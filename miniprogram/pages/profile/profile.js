const { getUser, setHouse, canChangeHouse, logout, doLogin, ensureLogin, HOUSES } = require('../../utils/auth');

Page({
  data: {
    user: null,
    isLogin: false,
    myComments: [],
    commentCount: 0,
    houses: HOUSES,
    showHousePicker: false,
    showSetup: false,
    setupMode: 'register',
    loggingIn: false,
    rankLevel: '平民',
    totalLikes: 0,
    houseLocked: false,
    houseLockDays: 0
  },

  onShow() { this.refresh(); },

  // 等级体系
  getRank(commentCount, totalLikes) {
    if (commentCount >= 50 && totalLikes >= 120) return { name:'誓言骑士', icon:'⚔️', color:'#d4a853' };
    if (commentCount >= 30 && totalLikes >= 70)  return { name:'御林铁卫', icon:'🛡️', color:'#e2e2e2' };
    if (commentCount >= 15 && totalLikes >= 35)  return { name:'将领',     icon:'🎖️', color:'#d4a853' };
    if (commentCount >= 8  && totalLikes >= 15)  return { name:'指挥官',   icon:'📯', color:'#b8a68e' };
    if (commentCount >= 3  && totalLikes >= 5)   return { name:'士卒',     icon:'🗡️', color:'#8a7b68' };
    if (commentCount >= 1  && totalLikes >= 2)   return { name:'侍从',     icon:'🐴', color:'#8a7b68' };
    return { name:'平民', icon:'👤', color:'#8a7b68' };
  },

  async refresh() {
    const user = await ensureLogin();
    const comments = this.loadMyComments(user);
    const totalLikes = comments.reduce((sum, c) => sum + (c.likes || 0), 0);
    const rank = this.getRank(comments.length, totalLikes);
    this.setData({
      user,
      isLogin: !!user,
      myComments: comments,
      commentCount: comments.length,
      totalLikes,
      rankLevel: rank.name,
      rankIcon: rank.icon,
      rankColor: rank.color,
      showHousePicker: false
    });
    const lock = canChangeHouse();
    if (user) this.setData({ houseLocked: !lock.can, houseLockDays: lock.remaining || 0 });
  },

  loadMyComments(user) {
    if (!user) return [];
    // 新评论 userId 是 openid，旧评论是昵称——双条件兼容
    const isMine = c => c.userId === user.openid || c.userId === user.nickName;
    const all = wx.getStorageSync('asoiaf_comments') || {};
    const mine = [];
    Object.keys(all).forEach(topic => {
      (all[topic] || []).forEach(c => {
        if (isMine(c)) mine.push({ ...c, _topic: topic, _time: this.fmtTime(c.time) });
        (c.replies || []).forEach(r => {
          if (isMine(r)) mine.push({ ...r, _topic: topic, _time: this.fmtTime(r.time) });
        });
      });
    });
    return mine.sort((a, b) => b.time - a.time);
  },

  fmtTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    const d = new Date(ts);
    return (d.getMonth() + 1) + '/' + d.getDate();
  },

  async onLoginTap() {
    if (this.data.loggingIn) return;
    this.setData({ loggingIn: true });
    const res = await doLogin();
    this.setData({ loggingIn: false });
    if (res.error) {
      wx.showToast({ title: '网络异常，请重试', icon: 'none' });
      return;
    }
    if (res.needProfile) {
      this.setData({ showSetup: true, setupMode: 'register' });
      return;
    }
    wx.showToast({ title: '登录成功', icon: 'success' });
    this.refresh();
  },

  onEditProfile() {
    this.setData({ showSetup: true, setupMode: 'edit' });
  },

  onSetupDone() {
    const wasEdit = this.data.setupMode === 'edit';
    this.setData({ showSetup: false });
    wx.showToast({ title: wasEdit ? '档案已更新' : '宣誓成功，欢迎加入七国', icon: 'success' });
    this.refresh();
  },

  onSetupCancel() {
    this.setData({ showSetup: false });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '退出后你的言论会被记录在学城，但无法发布新评论。',
      success: (res) => {
        if (res.confirm) { logout(); this.setData({ user: null, isLogin: false, myComments: [], commentCount: 0 }); }
      }
    });
  },

  // 家族选择
  toggleHousePicker() {
    this.setData({ showHousePicker: !this.data.showHousePicker });
  },

  onChooseHouse(e) {
    const lock = canChangeHouse();
    if (this.data.user && this.data.user.house && this.data.user.house.id !== 'none' && !lock.can) {
      wx.showToast({ title: '还需 ' + lock.remaining + ' 天才能更换效忠', icon: 'none' });
      return;
    }
    const id = e.currentTarget.dataset.id;
    const chosen = HOUSES.find(h => h.id === id);
    if (!chosen) return;
    const h = { id: chosen.id, name: chosen.name, sigil: chosen.sigil, img: chosen.img || '' };
    setHouse(h);
    wx.showToast({ title: '宣誓效忠 ' + chosen.name, icon: 'success' });
    this.setData({
      user: getUser(),
      showHousePicker: false,
      houseLocked: true,
      houseLockDays: 10
    });
  },

  onCommentTap(e) {
    const topic = e.currentTarget.dataset.topic;
    if (topic) wx.navigateTo({ url: `/pages/wiki-article/wiki-article?topic=${encodeURIComponent(topic)}` });
  }
});
