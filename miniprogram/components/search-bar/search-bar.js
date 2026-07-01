Component({
  properties: {
    placeholder: {
      type: String,
      value: '搜索角色、家族、事件...'
    },
    autofocus: {
      type: Boolean,
      value: false
    }
  },

  data: {
    keyword: '',
    focused: false
  },

  methods: {
    onInput(e) {
      this.setData({ keyword: e.detail.value });
    },

    onFocus() {
      this.setData({ focused: true });
    },

    onBlur() {
      this.setData({ focused: false });
    },

    onSearch() {
      const keyword = this.data.keyword.trim();
      if (!keyword) {
        wx.showToast({ title: '请输入搜索内容', icon: 'none' });
        return;
      }
      this.triggerEvent('search', { keyword });
    },

    onClear() {
      this.setData({ keyword: '' });
      this.triggerEvent('clear');
    },

    onConfirm(e) {
      this.onSearch();
    }
  }
});
