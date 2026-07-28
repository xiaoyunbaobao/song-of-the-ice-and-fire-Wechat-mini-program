/**
 * 评论区组件 v2
 * 支持：发表评论、回复评论、点赞
 */
const { isLoggedIn, getUser } = require('../../utils/auth');

const SPAM_WORDS = [
  '加微信', '加微', '微信', 'VX', 'vx', 'WX', 'wx',
  '扫码', '二维码', '关注公众号', '关注公号', 
  '免费领', '点击领取', 'https://', 'http://',
  '赚钱', '兼职', '日赚', '月入', '代理', '加盟',
  '私聊', '私我', '加我', '加Q', 'QQ', 'qq',
  '电话', '手机号', '联系电话',
  '低价', '优惠券', '折扣', '促销', '免费', '看剧', '佳窝', '操'
];

function isSpam(text) {
  const lower = text.toLowerCase();
  return SPAM_WORDS.some(w => lower.includes(w.toLowerCase()));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ===== 每日发言限制 =====
const DAILY_MAX = 10;
const BONUS_LIKES = 3;

function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function getDailyStats(userId) {
  try {
    const all = wx.getStorageSync('asoiaf_daily') || {};
    const key = userId + '_' + todayKey();
    return all[key] || { count: 0, likes: 0, bonus: 0 };
  } catch (e) { return { count: 0, likes: 0, bonus: 0 }; }
}

function saveDailyStats(userId, stats) {
  const all = wx.getStorageSync('asoiaf_daily') || {};
  all[userId + '_' + todayKey()] = stats;
  wx.setStorageSync('asoiaf_daily', all);
}

function canPost(userId) {
  const s = getDailyStats(userId);
  return s.count < DAILY_MAX + s.bonus;
}

function afterPost(userId) {
  const s = getDailyStats(userId);
  s.count++;
  saveDailyStats(userId, s);
}

function afterDelete(userId) {
  const s = getDailyStats(userId);
  if (s.count > 0) s.count--;
  saveDailyStats(userId, s);
}

function afterLike(authorId) {
  const s = getDailyStats(authorId);
  const oldBonus = s.bonus;
  s.likes++;
  // 每累计 BONUS_LIKES 个赞，多一次机会，但总共最多额外 5 次
  s.bonus = Math.min(5, Math.floor(s.likes / BONUS_LIKES));
  saveDailyStats(authorId, s);
  return s.bonus > oldBonus; // true = 刚解锁了新机会
}

function dailyRemaining(userId) {
  const s = getDailyStats(userId);
  return Math.max(0, DAILY_MAX + s.bonus - s.count);
}

function fmtTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  const d = new Date(ts);
  return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

Component({
  properties: {
    targetId: { type: String, value: '' }
  },

  data: {
    comments: [],
    inputValue: '',
    isLogin: false,
    user: null,
    submitting: false,
    replyToId: '',        // 正在回复哪条评论
    replyToUser: ''       // 正在回复谁
  },

  lifetimes: { attached() { this.refresh(); } },
  pageLifetimes: { show() { this.refresh(); } },

  methods: {
    refresh() {
      const user = getUser();
      this.setData({
        isLogin: !!user,
        user: user,
        comments: this.loadComments()
      });
    },

    // ===== 数据存取 =====
    loadComments() {
      try {
        const all = wx.getStorageSync('asoiaf_comments') || {};
        const list = (all[this.properties.targetId] || []).sort((a, b) => b.time - a.time);
        return list.map(c => ({
          ...c,
          _time: fmtTime(c.time),
          replies: (c.replies || []).map(r => ({ ...r, _time: fmtTime(r.time) }))
        }));
      } catch (e) { return []; }
    },

    saveList(list) {
      const all = wx.getStorageSync('asoiaf_comments') || {};
      all[this.properties.targetId] = list;
      wx.setStorageSync('asoiaf_comments', all);
    },

    // ===== 发表评论 =====
    onInput(e) {
      this.setData({ inputValue: e.detail.value });
    },

    onSubmit() {
      const userId = this.data.user ? this.data.user.nickName : 'unknown';
      if (!canPost(userId)) {
        wx.showModal({ title: '今日发言已达上限', content: '学城学士每日限发' + DAILY_MAX + '条评论。\n你的今日评论累计获赞每超过' + BONUS_LIKES + '个可解锁额外一次机会。', showCancel: false, confirmText: '知道了' });
        return;
      }
      const text = this.data.inputValue.trim();
      if (!text) { wx.showToast({ title: '请输入内容', icon: 'none' }); return; }
      if (text.length > 500) { wx.showToast({ title: '不超过500字', icon: 'none' }); return; }
      if (isSpam(text)) {
        wx.showModal({ title: '评论未通过', content: '您的评论疑似广告。维斯特洛不欢迎乌鸦的营销。', showCancel: false, confirmText: '知道了' });
        return;
      }
      this.setData({ submitting: true });

      const user = this.data.user;
      const list = this.loadComments();
      const comment = {
        id: genId(),
        userId: user.nickName || 'unknown',
        userName: user.nickName || '无名学士',
        avatar: user.avatarUrl || '',
        house: user.house || { name:'无旗兄弟会', sigil:'🏴' },
        content: text,
        time: Date.now(),
        _time: fmtTime(Date.now()),
        likes: 0,
        likedBy: [],
        replies: []
      };

      list.unshift(comment);
      this.saveList(list);
      afterPost(userId);
      const remaining = dailyRemaining(userId);
      this.setData({ comments: list, inputValue: '', submitting: false });
      wx.showToast({ title: '发表成功 (今日剩余' + remaining + '次)', icon: 'success' });
    },

    // ===== 回复评论 =====
    onReplyTap(e) {
      const { id, user } = e.currentTarget.dataset;
      this.setData({ replyToId: id, replyToUser: user, inputValue: '' });
    },

    cancelReply() {
      this.setData({ replyToId: '', replyToUser: '', inputValue: '' });
    },

    onSubmitReply() {
      const userId = this.data.user ? this.data.user.nickName : 'unknown';
      if (!canPost(userId)) {
        wx.showModal({ title: '今日发言已达上限', content: '每日限发' + DAILY_MAX + '条（含回复）。\n你的今日评论累计获赞每超过' + BONUS_LIKES + '个可解锁额外一次机会。', showCancel: false, confirmText: '知道了' });
        return;
      }
      const text = this.data.inputValue.trim();
      if (!text) { wx.showToast({ title: '请输入回复', icon: 'none' }); return; }
      if (text.length > 300) { wx.showToast({ title: '不超过300字', icon: 'none' }); return; }
      if (isSpam(text)) {
        wx.showModal({ title: '回复未通过', content: '包含违禁词? hodor', showCancel: false, confirmText: '知道了' });
        return;
      }

      const user = this.data.user;
      const reply = {
        id: genId(),
        userId: user.nickName || 'unknown',
        userName: user.nickName || '无名学士',
        avatar: user.avatarUrl || '',
        house: user.house || { name:'无旗兄弟会', sigil:'🏴' },
        content: text,
        time: Date.now(),
        _time: fmtTime(Date.now()),
        replyTo: this.data.replyToUser
      };

      const list = this.loadComments();
      const parent = list.find(c => c.id === this.data.replyToId);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(reply);
        this.saveList(list);
      }

      const comments = list.map(c => ({
        ...c,
        _time: fmtTime(c.time),
        replies: (c.replies || []).map(r => ({ ...r, _time: fmtTime(r.time) }))
      }));
      afterPost(userId);
      const remaining = dailyRemaining(userId);
      this.setData({ comments, replyToId: '', replyToUser: '', inputValue: '' });
      wx.showToast({ title: '回复成功 (今日剩余' + remaining + '次)', icon: 'success' });
    },

    // ===== 点赞 =====
    onLike(e) {
      const { id, rid } = e.currentTarget.dataset;
      const user = this.data.user;
      if (!user) { this.triggerEvent('login'); return; }
      const userId = user.nickName || 'unknown';

      const list = this.loadComments();
      const comment = list.find(c => c.id === id);
      if (!comment) return;

      if (rid) {
        // 点赞回复
        const reply = (comment.replies || []).find(r => r.id === rid);
        if (reply) {
          reply.likedBy = reply.likedBy || [];
          if (reply.likedBy.includes(userId)) {
            reply.likes = Math.max(0, (reply.likes || 0) - 1);
            reply.likedBy = reply.likedBy.filter(u => u !== userId);
          } else {
            reply.likes = (reply.likes || 0) + 1;
            reply.likedBy.push(userId);
          }
        }
      } else {
        // 点赞评论
        comment.likedBy = comment.likedBy || [];
        if (comment.likedBy.includes(userId)) {
          comment.likes = Math.max(0, (comment.likes || 0) - 1);
          comment.likedBy = comment.likedBy.filter(u => u !== userId);
        } else {
          comment.likes = (comment.likes || 0) + 1;
          comment.likedBy.push(userId);
        }
      }

      this.saveList(list);
      // 如果点赞的是别人的评论，给作者累计赞数
      if (!rid && comment.userId && comment.userId !== userId) {
        const unlocked = afterLike(comment.userId);
        if (unlocked) {
          wx.showToast({ title: comment.userName + ' 今日获赞达标，解锁额外发言机会！', icon: 'none', duration: 2500 });
        }
      }
      const comments = list.map(c => ({ ...c, _time: fmtTime(c.time), replies: (c.replies || []).map(r => ({ ...r, _time: fmtTime(r.time) })) }));
      this.setData({ comments });
    },

    // ===== 删除评论 =====
    onDelete(e) {
      const id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '删除评论',
        content: '确定要删除这条评论吗？学士不会记录已删除的内容。',
        success: (res) => {
          if (!res.confirm) return;
          const list = this.loadComments();
          const filtered = list.filter(c => c.id !== id);
          this.saveList(filtered);
          const userId = this.data.user ? this.data.user.nickName : 'unknown';
          afterDelete(userId);
          const comments = filtered.map(c => ({ ...c, _time: fmtTime(c.time), replies: (c.replies || []).map(r => ({ ...r, _time: fmtTime(r.time) })) }));
          this.setData({ comments });
          wx.showToast({ title: '已删除（不扣除次数）', icon: 'none' });
        }
      });
    },

    onLogin() { this.triggerEvent('login'); }
  }
});
