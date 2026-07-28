const { getCharacterDetail } = require('../../utils/db');
const { getHouseIcon, STATUS_MAP } = require('../../utils/icons');
const { PROFILES } = require('../../utils/characters-data');

const HOUSE_IMG = {
  '史塔克家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Stark.jpg',
  '兰尼斯特家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Lannister.jpg',
  '坦格利安家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Targaryen.jpg',
  '拜拉席恩家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/Baratheon_DS.jpg',
  '葛雷乔伊家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Greyjoy.jpg',
  '艾林家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Arryn.jpg',
  '马泰尔家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Martell.jpg',
  '徒利家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Tully.jpg',
  '提利尔家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Tyrell.jpg',
  '瓦列利安家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Velaryon2.jpg',
  '波顿家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Bolton.jpg',
  '莫尔蒙家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Mormont.jpg',
  '塔利家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/Tarly.jpg',
  '黎德家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Reed.jpg',
  '克里冈家族':'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Clegane.jpg',
};

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
      if (char._house) char._house.img = HOUSE_IMG[char._house.name] || '';
      this.setData({ character: char, house: char.house || null, loading: false });
    } else {
      const localChar = PROFILES[id];
      if (localChar && localChar._house) localChar._house.img = HOUSE_IMG[localChar._house.name] || '';
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
