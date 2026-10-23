/**
 * 完善资料组件 v1.1
 * 官方推荐方案：chooseAvatar + type="nickname" 用户主动填写头像昵称
 * mode="register" 新用户注册；mode="edit" 预填当前资料用于修改
 * 保存成功后触发 success 事件；用户主动收起触发 cancel 事件
 */
const { registerProfile } = require('../../utils/auth');

Component({
  properties: {
    mode: { type: String, value: 'register' },       // register | edit
    initialNickName: { type: String, value: '' },
    initialAvatar: { type: String, value: '' }
  },

  data: {
    tempAvatar: '',
    nickInput: '',
    submitting: false
  },

  lifetimes: {
    attached() {
      // 编辑模式预填当前昵称（头像经 wxml 用 tempAvatar || initialAvatar 显示）
      if (this.properties.mode === 'edit') {
        this.setData({ nickInput: this.properties.initialNickName || '' });
      }
    }
  },

  methods: {
    onChooseAvatar(e) {
      // 临时路径，确认时才上传
      this.setData({ tempAvatar: e.detail.avatarUrl || '' });
    },

    onNickInput(e) {
      this.setData({ nickInput: e.detail.value });
    },

    async onConfirm() {
      if (this.data.submitting) return;
      this.setData({ submitting: true });
      try {
        const user = await registerProfile({
          nickName: this.data.nickInput,
          avatarTempPath: this.data.tempAvatar
        });
        this.setData({ submitting: false });
        this.triggerEvent('success', { user });
      } catch (err) {
        // 失败保留面板与已填内容
        this.setData({ submitting: false });
        wx.showToast({ title: this.properties.mode === 'edit' ? '保存失败，请重试' : '宣誓失败，请重试', icon: 'none' });
      }
    },

    onSkip() {
      this.triggerEvent('cancel');
    }
  }
});
