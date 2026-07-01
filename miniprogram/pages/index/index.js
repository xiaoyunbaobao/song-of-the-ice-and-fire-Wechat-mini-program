const app = getApp();
const { getHouseIcon } = require('../../utils/icons');

Page({
  data: {
    categories: [],
    majorHouses: [],
    loading: false,
    mapOffsetY: 2.6,
    activeMapRegion: '',
    // Banner 书卷瀑布流（两排不同速度）
    bannerRow1: [
      '/images/banner/AGameOfThrones1.jpg',
      '/images/banner/AClashOfKings.jpg',
      '/images/banner/AStormOfSwords.jpg',
      '/images/banner/AFeastForCrows.jpg',
      '/images/banner/ADanceWithDragons.jpg',
      '/images/banner/Blood_and_fire_cover_uk.jpg',
      '/images/banner/KNIGHT of the seven kingdoms.jpg',
      '/images/banner/Twow_cover.jpg'
    ],
    bannerRow2: [
      '/images/banner/Blood_and_fire_cover_uk.jpg',
      '/images/banner/KNIGHT of the seven kingdoms.jpg',
      '/images/banner/AGameOfThrones1.jpg',
      '/images/banner/AStormOfSwords.jpg',
      '/images/banner/Twow_cover.jpg',
      '/images/banner/AClashOfKings.jpg',
      '/images/banner/ADanceWithDragons.jpg',
      '/images/banner/AFeastForCrows.jpg'
    ],
    regionTabs: [
      { id: 'beyond_wall',  name: '塞外' },
      { id: 'the_north',    name: '北境' },
      { id: 'iron_islands', name: '铁群岛' },
      { id: 'riverlands',   name: '河间地' },
      { id: 'the_vale',     name: '谷地' },
      { id: 'westerlands',  name: '西境' },
      { id: 'crownlands',   name: '王领' },
      { id: 'stormlands',   name: '风暴地' },
      { id: 'the_reach',    name: '河湾地' },
      { id: 'dorne',        name: '多恩' }
    ]
  },

  onLoad() {
    this.refreshData();
  },

  onShow() {
    this.refreshData();
  },

  refreshData() {
    this.setData({
      categories: app.globalData.categories,
      majorHouses: this.getMajorHouses()
    });
  },

  // 九大家族快速入口
  getMajorHouses() {
    const { HOUSE_ICONS } = require('../../utils/icons');
    return [
      { _id:'house_stark',     name:'史塔克',   nameCn:'Stark',     words:'凛冬将至',       region:'北境',   img: HOUSE_ICONS.house_stark.img,     sigil: HOUSE_ICONS.house_stark.sigil },
      { _id:'house_lannister', name:'兰尼斯特', nameCn:'Lannister', words:'听我怒吼',       region:'西境',   img: HOUSE_ICONS.house_lannister.img, sigil: HOUSE_ICONS.house_lannister.sigil },
      { _id:'house_targaryen', name:'坦格利安', nameCn:'Targaryen', words:'血火同源',       region:'王领',   img: HOUSE_ICONS.house_targaryen.img, sigil: HOUSE_ICONS.house_targaryen.sigil },
      { _id:'house_baratheon', name:'拜拉席恩', nameCn:'Baratheon', words:'怒火燎原',       region:'风暴地', img: HOUSE_ICONS.house_baratheon.img, sigil: HOUSE_ICONS.house_baratheon.sigil },
      { _id:'house_greyjoy',   name:'葛雷乔伊', nameCn:'Greyjoy',   words:'强取胜于苦耕',   region:'铁群岛', img: HOUSE_ICONS.house_greyjoy.img,   sigil: HOUSE_ICONS.house_greyjoy.sigil },
      { _id:'house_arryn',     name:'艾林',     nameCn:'Arryn',     words:'高如荣誉',       region:'谷地',   img: HOUSE_ICONS.house_arryn.img,     sigil: HOUSE_ICONS.house_arryn.sigil },
      { _id:'house_martell',   name:'马泰尔',   nameCn:'Martell',   words:'不屈不挠',       region:'多恩',   img: HOUSE_ICONS.house_martell.img,   sigil: HOUSE_ICONS.house_martell.sigil },
      { _id:'house_tully',     name:'徒利',     nameCn:'Tully',     words:'家族·责任·荣誉', region:'河间地', img: HOUSE_ICONS.house_tully.img,     sigil: HOUSE_ICONS.house_tully.sigil },
      { _id:'house_tyrell',    name:'提利尔',   nameCn:'Tyrell',    words:'生生不息',       region:'河湾地', img: HOUSE_ICONS.house_tyrell.img,    sigil: HOUSE_ICONS.house_tyrell.sigil },
      { _id:'house_velaryon',  name:'瓦列利安', nameCn:'Velaryon',  words:'古老·忠誠·勇毅', region:'王领',   img: HOUSE_ICONS.house_velaryon.img,  sigil: HOUSE_ICONS.house_velaryon.sigil }
    ];
  },

  // 分类导航点击
  onCategoryTap(e) {
    const { path } = e.currentTarget.dataset;
    if (path) wx.navigateTo({ url: path });
  },

  // 地图区域索引
  onRegionTab(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      activeMapRegion: this.data.activeMapRegion === id ? '' : id
    });
  },

  // 家族快速入口
  onHouseTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/house-detail/house-detail?id=${id}` });
  },

  // 字母索引
  onLetterTap(e) {
    const letter = e.currentTarget.dataset.letter;
    wx.navigateTo({
      url: `/pages/character-list/character-list?letter=${letter}`
    });
  },

  // 搜索
  onSearch(e) {
    const { keyword } = e.detail;
    wx.navigateTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(keyword)}`
    });
  },

  // 查看全部角色
  onAllCharacters() {
    wx.navigateTo({ url: '/pages/character-list/character-list' });
  },

  // 查看全部家族
  onAllHouses() {
    wx.navigateTo({ url: '/pages/house-list/house-list' });
  }
});
