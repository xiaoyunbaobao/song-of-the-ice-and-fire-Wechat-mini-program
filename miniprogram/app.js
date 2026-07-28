// 冰与火之歌知识库 · 小程序入口
App({
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-1g5ys3sne8db5912',
        traceUser: true
      });
    }

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    this.globalData.navBarHeight = systemInfo.platform === 'android' ? 48 : 44;
  },

  globalData: {
    systemInfo: null,
    statusBarHeight: 0,
    navBarHeight: 0,
    // 首页分类导航
    categories: [
      { id: 'characters', name: '角色', icon: '⚔️', desc: '按家族·字母索引', path: '/pages/character-list/character-list' },
      { id: 'houses', name: '家族', icon: '🛡️', desc: '纹章·族语·历史', path: '/pages/house-list/house-list' },
      { id: 'culture', name: '文化习俗', icon: '🏛️', desc: '信仰·传统·生活方式', path: '/pages/culture/culture' },
      { id: 'theories', name: '理论推测', icon: '🔮', desc: '粉丝理论·预言分析', path: '/pages/theories/theories' }
    ]
  }
});
