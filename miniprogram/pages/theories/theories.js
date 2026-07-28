const { THEORIES, CATEGORIES, STATUS_MAP } = require('../../utils/theories-data');

Page({
  data: {
    categories: CATEGORIES,
    activeCategory: 'all',
    allTheories: THEORIES,
    filteredTheories: THEORIES,
    statusMap: STATUS_MAP
  },

  onLoad() {
    this.filterByCategory({ currentTarget: { dataset: { id: 'all' } } });
  },

  filterByCategory(e) {
    const catId = e.currentTarget.dataset.id;
    const filtered = catId === 'all'
      ? THEORIES
      : THEORIES.filter(t => t.category === catId);
    this.setData({ activeCategory: catId, filteredTheories: filtered });
  },

  toggleTheory(e) {
    const id = e.currentTarget.dataset.id;
    const theories = this.data.filteredTheories.map(t => ({
      ...t,
      expanded: t.id === id ? !t.expanded : t.expanded
    }));
    // 保持引用一致
    this.setData({
      filteredTheories: theories,
      allTheories: this.data.allTheories.map(t => ({
        ...t,
        expanded: t.id === id ? !t.expanded : t.expanded
      }))
    });
  },

  onCharTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/character-detail/character-detail?id=${id}` });
  },

  onArticleTap(e) {
    const name = e.currentTarget.dataset.name;
    wx.navigateTo({ url: `/pages/wiki-article/wiki-article?topic=${encodeURIComponent(name)}` });
  }
});
