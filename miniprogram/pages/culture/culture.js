const { REGIONS } = require('../../utils/culture-data');

Page({
  data: {
    regions: REGIONS,
    activeRegion: 'beyond_wall',
    current: null
  },

  onLoad() {
    this.selectRegion({ currentTarget: { dataset: { id: 'beyond_wall' } } });
  },

  selectRegion(e) {
    const id = e.currentTarget.dataset.id;
    const region = REGIONS.find(r => r.id === id);
    if (region) {
      this.setData({ activeRegion: id, current: region });
    }
  },

  onWikiLink(e) {
    const topic = e.currentTarget.dataset.topic;
    wx.navigateTo({ url: `/pages/wiki-article/wiki-article?topic=${encodeURIComponent(topic)}` });
  },

  onCharLink(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/character-detail/character-detail?id=${id}` });
  }
});
