const { getCharacterDetail } = require('../../utils/db');
const { getHouseIcon, STATUS_MAP } = require('../../utils/icons');
const { PROFILES } = require('../../utils/characters-data');

Page({
  data: { character: null, house: null, loading: true, activeTab: 'book', characterId: '' },

  onLoad(options) {
    const id = options.id || '';
    this.setData({ characterId: id });
    this.loadDetail(id);
  },

  async loadDetail(id) {
    this.setData({ loading: true });
    const char = await getCharacterDetail(id);
    if (char) {
      this.setData({ character: char, house: char.house || null, loading: false });
    } else {
      const localChar = PROFILES[id];
      this.setData({ character: localChar, house: localChar ? localChar._house : null, loading: false });
    }
    if (this.data.character) {
      wx.setNavigationBarTitle({ title: this.data.character.name });
    }
  },

  onTabChange(e) { this.setData({ activeTab: e.currentTarget.dataset.tab }); },

  onRelatedCharacterTap(e) {
    wx.navigateTo({ url: '/pages/character-detail/character-detail?id=' + e.currentTarget.dataset.id });
  },

  onHouseTap() {
    const houseId = this.data.character.houseId;
    if (houseId) { wx.navigateTo({ url: '/pages/house-detail/house-detail?id=' + houseId }); }
  }
});
