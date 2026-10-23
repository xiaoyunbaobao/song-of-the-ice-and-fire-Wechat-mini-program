/**
 * 评论区组件 v3.1 — 隐私合规 + 云数据库多用户共享
 */
const { doLogin, ensureLogin } = require('../../utils/auth');

const SPAM_WORDS = [
  '加微信','加微','微信','VX','vx','WX','wx',
  '扫码','二维码','关注公众号',
  '免费领','点击领取','https://','http://',
  '赚钱','兼职','日赚','月入','代理','加盟',
  '私聊','私我','加我','加Q','QQ','qq',
  '电话','手机号','联系电话',
  '低价','优惠券','折扣','促销','免费','看剧','佳窝','操'
];
function isSpam(text){return SPAM_WORDS.some(w=>text.toLowerCase().includes(w.toLowerCase()));}
function genId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}

const DAILY_MAX=10;
function todayKey(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function getDailyStats(userId){try{return(wx.getStorageSync('asoiaf_daily')||{})[userId+'_'+todayKey()]||{count:0,likes:0};}catch(e){return{count:0,likes:0};}}
function saveDailyStats(userId,stats){const all=wx.getStorageSync('asoiaf_daily')||{};all[userId+'_'+todayKey()]=stats;wx.setStorageSync('asoiaf_daily',all);}
function canPost(userId){return getDailyStats(userId).count<DAILY_MAX;}
function afterPost(userId){const s=getDailyStats(userId);s.count++;saveDailyStats(userId,s);}
function dailyRemaining(userId){return Math.max(0,DAILY_MAX-getDailyStats(userId).count);}
function fmtTime(ts){const diff=Date.now()-ts;if(diff<60000)return'刚刚';if(diff<3600000)return Math.floor(diff/60000)+'分钟前';if(diff<86400000)return Math.floor(diff/3600000)+'小时前';const d=new Date(ts);return(d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');}

Component({
  properties:{targetId:{type:String,value:''}},
  data:{
    comments:[],inputValue:'',isLogin:false,user:null,submitting:false,
    replyToId:'',replyToUser:'',loading:true,
    showSetup:false,
    showPrivacy:false,privacyResolve:null
  },

  lifetimes:{attached(){this.refresh();}},
  pageLifetimes:{show(){this.refresh();}},

  methods:{
    getDb(){return wx.cloud?wx.cloud.database():null;},

    async refresh(){
      const user=await ensureLogin();
      this.setData({isLogin:!!user,user:user,loading:true});
      const list=await this.loadComments();
      this.setData({comments:list,loading:false});
    },

    async loadComments(){
      const db=this.getDb();
      if(!db)return this.loadLocal();
      try{
        const res=await db.collection('comments').doc(this.properties.targetId).get();
        const list=(res.data&&res.data.comments)?res.data.comments:[];
        return list.sort((a,b)=>b.time-a.time).map(c=>({...c,_time:fmtTime(c.time),replies:(c.replies||[]).map(r=>({...r,_time:fmtTime(r.time)}))}));
      }catch(e){
        if(e.errCode===-1)return[];
        return this.loadLocal();
      }
    },
    loadLocal(){try{return(wx.getStorageSync('asoiaf_comments')||{})[this.properties.targetId]||[];}catch(e){return[];}},
    async saveComments(list){
      const db=this.getDb();
      if(!db){this.saveLocal(list);return;}
      try{await db.collection('comments').doc(this.properties.targetId).set({data:{comments:list,updatedAt:Date.now()}});}
      catch(e){this.saveLocal(list);}
    },
    saveLocal(list){const all=wx.getStorageSync('asoiaf_comments')||{};all[this.properties.targetId]=list;wx.setStorageSync('asoiaf_comments',all);},

    // ===== 登录：openid 账号 + 内联完善资料面板 =====
    async onLoginTap(){
      const res=await doLogin();
      if(res.error){wx.showToast({title:'网络异常，请重试',icon:'none'});return;}
      if(res.needProfile){this.setData({showSetup:true});return;}
      wx.showToast({title:'登录成功',icon:'success'});
      this.refresh();
    },

    onSetupDone(){
      this.setData({showSetup:false});
      wx.showToast({title:'宣誓成功，欢迎加入七国',icon:'success'});
      this.refresh();
    },

    onSetupCancel(){
      this.setData({showSetup:false});
    },

    // ===== 发表评论 =====
    onInput(e){this.setData({inputValue:e.detail.value});},
    async onSubmit(){
      const user=this.data.user;
      if(!user){this.onLoginTap();return;}
      const userId=user.openid||user.nickName||'unknown'; // 新数据 openid，离线旧缓存回退昵称
      if(!canPost(userId)){wx.showModal({title:'今日发言已达上限',content:'学城学士每日限发'+DAILY_MAX+'条评论。',showCancel:false,confirmText:'知道了'});return;}
      const text=this.data.inputValue.trim();
      if(!text){wx.showToast({title:'请输入内容',icon:'none'});return;}
      if(text.length>500){wx.showToast({title:'不超过500字',icon:'none'});return;}
      if(isSpam(text)){wx.showModal({title:'评论未通过',content:'疑似广告。维斯特洛不欢迎乌鸦的营销。',showCancel:false,confirmText:'知道了'});return;}
      this.setData({submitting:true});
      const comment={id:genId(),userId,userName:user.nickName||'无名学士',avatar:user.avatarFileID||user.avatarUrl||'',house:user.house||{name:'无旗兄弟会',sigil:'🏴'},content:text,time:Date.now(),likes:0,likedBy:[],replies:[]};
      const list=await this.loadComments();list.unshift(comment);await this.saveComments(list);
      afterPost(userId);
      const remaining=dailyRemaining(userId);
      const comments=list.map(c=>({...c,_time:fmtTime(c.time),replies:(c.replies||[]).map(r=>({...r,_time:fmtTime(r.time)}))}));
      this.setData({comments,inputValue:'',submitting:false});
      wx.showToast({title:'发表成功 (今日剩余'+remaining+'次)',icon:'success'});
    },

    onReplyTap(e){const{id,user}=e.currentTarget.dataset;this.setData({replyToId:id,replyToUser:user,inputValue:''});},
    cancelReply(){this.setData({replyToId:'',replyToUser:'',inputValue:''});},
    async onSubmitReply(){
      const user=this.data.user;
      if(!user){this.onLoginTap();return;}
      const userId=user.openid||user.nickName||'unknown'; // 新数据 openid，离线旧缓存回退昵称
      if(!canPost(userId)){wx.showModal({title:'今日发言已达上限',content:'每日限发'+DAILY_MAX+'条（含回复）。',showCancel:false,confirmText:'知道了'});return;}
      const text=this.data.inputValue.trim();
      if(!text){wx.showToast({title:'请输入回复',icon:'none'});return;}
      if(text.length>300){wx.showToast({title:'不超过300字',icon:'none'});return;}
      if(isSpam(text)){wx.showModal({title:'回复未通过',content:'包含违禁词',showCancel:false,confirmText:'知道了'});return;}
      const reply={id:genId(),userId,userName:user.nickName||'无名学士',avatar:user.avatarFileID||user.avatarUrl||'',house:user.house||{name:'无旗兄弟会',sigil:'🏴'},content:text,time:Date.now(),replyTo:this.data.replyToUser};
      const list=await this.loadComments();
      const parent=list.find(c=>c.id===this.data.replyToId);
      if(parent){parent.replies=(parent.replies||[]);parent.replies.push(reply);}
      await this.saveComments(list);
      afterPost(userId);const remaining=dailyRemaining(userId);
      const comments=list.map(c=>({...c,_time:fmtTime(c.time),replies:(c.replies||[]).map(r=>({...r,_time:fmtTime(r.time)}))}));
      this.setData({comments,replyToId:'',replyToUser:'',inputValue:''});
      wx.showToast({title:'回复成功 (今日剩余'+remaining+'次)',icon:'success'});
    },

    async onLike(e){
      const{id,rid}=e.currentTarget.dataset;
      const user=this.data.user;
      if(!user){this.onLoginTap();return;}
      const userId=user.openid||user.nickName||'unknown'; // 新数据 openid，离线旧缓存回退昵称
      const list=await this.loadComments();
      const comment=list.find(c=>c.id===id);
      if(!comment)return;
      const target=rid?(comment.replies||[]).find(r=>r.id===rid):comment;
      if(!target)return;
      target.likedBy=target.likedBy||[];
      if(target.likedBy.includes(userId)){target.likes=Math.max(0,(target.likes||0)-1);target.likedBy=target.likedBy.filter(u=>u!==userId);}
      else{target.likes=(target.likes||0)+1;target.likedBy.push(userId);}
      await this.saveComments(list);
      const comments=list.map(c=>({...c,_time:fmtTime(c.time),replies:(c.replies||[]).map(r=>({...r,_time:fmtTime(r.time)}))}));
      this.setData({comments});
    },

    onDelete(e){
      const id=e.currentTarget.dataset.id;
      const that=this;
      wx.showModal({title:'删除评论',content:'确定要删除吗？',success:async res=>{
        if(!res.confirm)return;
        const list=await that.loadComments();
        const filtered=list.filter(c=>c.id!==id);
        await that.saveComments(filtered);
        const comments=filtered.map(c=>({...c,_time:fmtTime(c.time),replies:(c.replies||[]).map(r=>({...r,_time:fmtTime(r.time)}))}));
        that.setData({comments});wx.showToast({title:'已删除',icon:'none'});
      }});
    }
  }
});
