// components/diff-compare/diff-compare.js
// 冰与火之歌 书籍vs剧集 对比组件

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 差异对比数组: [{aspect, book, show}]
    differences: {
      type: Array,
      value: [],
      observer: function (newVal) {
        this.setData({
          isEmpty: !newVal || newVal.length === 0
        });
      }
    },

    // 是否显示标题
    showTitle: {
      type: Boolean,
      value: true
    },

    // 自定义标题
    title: {
      type: String,
      value: '书籍与剧集对比'
    },

    // 显示模式: 'stacked' 或 'side-by-side'
    displayMode: {
      type: String,
      value: 'stacked'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isEmpty: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onToggleMode: function () {
      const newMode = this.data.displayMode === 'stacked' ? 'side-by-side' : 'stacked';
      this.setData({ displayMode: newMode });
    }
  }
});
