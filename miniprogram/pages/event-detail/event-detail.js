const { EVENTS, HOUSES } = require('../../utils/data');

Page({
  data: {
    event: null,
    relatedHouses: []
  },

  onLoad(options) {
    const id = options.id || '';
    this.loadEvent(id);
  },

  loadEvent(id) {
    const evt = EVENTS.find(e => e._id === id);
    if (evt) {
      wx.setNavigationBarTitle({ title: evt.name });
      // 找关联家族
      const houses = (evt.related || []).map(hid =>
        HOUSES.find(h => h._id === hid)
      ).filter(Boolean);
      this.setData({ event: evt, relatedHouses: houses });
    } else {
      wx.setNavigationBarTitle({ title: '事件详情' });
      this.setData({
        event: {
          _id: id, name: id.replace('evt_', '').replace(/_/g, ' '),
          era: '未知', desc: '该事件详情正在编纂中。请前往时间线页查看更多信息。'
        },
        relatedHouses: []
      });
    }
  },

  onHouseTap(e) {
    const hid = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/house-detail/house-detail?id=${hid}` });
  },

  onTimelineTap() {
    wx.switchTab({ url: '/pages/timeline/timeline' });
  }
});
