// pages/search/search.js
// 冰与火之歌 全局搜索页

const LOCAL_CHARACTERS = [
  { _id: 'char_01', name: '琼恩·雪诺', nameEn: 'Jon Snow', type: 'character', aliases: ['雪诺大人', '白狼'], houseId: 'house_stark', titles: ['守夜人总司令', '北境之王'], status: 'alive' },
  { _id: 'char_02', name: '丹妮莉丝·坦格利安', nameEn: 'Daenerys Targaryen', type: 'character', aliases: ['龙之母', '卡丽熙'], houseId: 'house_targaryen', titles: ['安达尔人和先民的女王', '龙之母'], status: 'alive' },
  { _id: 'char_03', name: '提利昂·兰尼斯特', nameEn: 'Tyrion Lannister', type: 'character', aliases: ['小恶魔', '半人'], houseId: 'house_lannister', titles: ['凯岩城公爵', '女王之手'], status: 'alive' },
  { _id: 'char_04', name: '艾莉亚·史塔克', nameEn: 'Arya Stark', type: 'character', aliases: ['马脸', '无名之辈'], houseId: 'house_stark', titles: [], status: 'alive' },
  { _id: 'char_05', name: '珊莎·史塔克', nameEn: 'Sansa Stark', type: 'character', aliases: ['小指头的私生女', '阿莲'], houseId: 'house_stark', titles: ['临冬城夫人', '北境女王'], status: 'alive' },
  { _id: 'char_06', name: '布兰·史塔克', nameEn: 'Bran Stark', type: 'character', aliases: ['残废布兰', '三眼乌鸦'], houseId: 'house_stark', titles: ['三眼乌鸦', '六国国王'], status: 'alive' },
  { _id: 'char_07', name: '瑟曦·兰尼斯特', nameEn: 'Cersei Lannister', type: 'character', aliases: ['摄政太后'], houseId: 'house_lannister', titles: ['维斯特洛女王'], status: 'alive' },
  { _id: 'char_08', name: '詹姆·兰尼斯特', nameEn: 'Jaime Lannister', type: 'character', aliases: ['弑君者'], houseId: 'house_lannister', titles: ['御林铁卫队长'], status: 'alive' },
  { _id: 'char_09', name: '艾德·史塔克', nameEn: 'Eddard Stark', type: 'character', aliases: ['奈德'], houseId: 'house_stark', titles: ['临冬城公爵', '北境守护', '御前首相'], status: 'deceased' },
  { _id: 'char_10', name: '劳勃·拜拉席恩', nameEn: 'Robert Baratheon', type: 'character', aliases: ['篡夺者'], houseId: 'house_baratheon', titles: ['安达尔人及先民之王'], status: 'deceased' }
];

const LOCAL_HOUSES = [
  { _id: 'house_stark', name: '史塔克家族', nameEn: 'House Stark', type: 'house', sigil: '冰原狼', words: '凛冬将至', region: '北境', seat: '临冬城' },
  { _id: 'house_lannister', name: '兰尼斯特家族', nameEn: 'House Lannister', type: 'house', sigil: '金色雄狮', words: '听我怒吼', region: '西境', seat: '凯岩城' },
  { _id: 'house_targaryen', name: '坦格利安家族', nameEn: 'House Targaryen', type: 'house', sigil: '三头龙', words: '血火同源', region: '王领', seat: '龙石岛' },
  { _id: 'house_baratheon', name: '拜拉席恩家族', nameEn: 'House Baratheon', type: 'house', sigil: '宝冠雄鹿', words: '怒火燎原', region: '风暴地', seat: '风息堡' },
  { _id: 'house_arryn', name: '艾林家族', nameEn: 'House Arryn', type: 'house', sigil: '新月猎鹰', words: '高如荣誉', region: '谷地', seat: '鹰巢城' },
  { _id: 'house_tully', name: '徒利家族', nameEn: 'House Tully', type: 'house', sigil: '鳟鱼', words: '家族·责任·荣誉', region: '河间地', seat: '奔流城' },
  { _id: 'house_tyrell', name: '提利尔家族', nameEn: 'House Tyrell', type: 'house', sigil: '金玫瑰', words: '生生不息', region: '河湾地', seat: '高庭' },
  { _id: 'house_martell', name: '马泰尔家族', nameEn: 'House Martell', type: 'house', sigil: '长枪贯日', words: '不屈不挠', region: '多恩', seat: '阳戟城' },
  { _id: 'house_greyjoy', name: '葛雷乔伊家族', nameEn: 'House Greyjoy', type: 'house', sigil: '海怪', words: '强取胜于苦耕', region: '铁群岛', seat: '派克城' }
];

const LOCAL_EVENTS = [
  { _id: 'evt_01', name: '长夜', nameEn: 'The Long Night', type: 'event' },
  { _id: 'evt_02', name: '征服战争', nameEn: 'Aegon\'s Conquest', type: 'event' },
  { _id: 'evt_03', name: '血龙狂舞', nameEn: 'The Dance of the Dragons', type: 'event' },
  { _id: 'evt_04', name: '篡夺者战争', nameEn: 'Robert\'s Rebellion', type: 'event' },
  { _id: 'evt_05', name: '五王之战', nameEn: 'War of the Five Kings', type: 'event' }
];

Page({
  data: {
    keyword: '',
    searching: false,
    hasResults: false,
    characters: [],
    houses: [],
    events: [],
    totalCount: 0
  },

  onLoad: function (options) {
    if (options.keyword) {
      this.setData({ keyword: options.keyword });
      this.performSearch(options.keyword);
    }
  },

  onSearchInput: function (e) {
    const keyword = e.detail.value.trim();
    this.setData({ keyword: keyword });

    if (keyword.length === 0) {
      this.setData({
        searching: false,
        hasResults: false,
        characters: [],
        houses: [],
        events: [],
        totalCount: 0
      });
      return;
    }

    if (keyword.length >= 2) {
      this.performSearch(keyword);
    }
  },

  onSearchConfirm: function (e) {
    const keyword = e.detail.value.trim();
    if (keyword.length > 0) {
      this.performSearch(keyword);
    }
  },

  performSearch: function (keyword) {
    const that = this;
    this.setData({ searching: true });

    // Try cloud search first
    try {
      wx.cloud.callFunction({
        name: 'search',
        data: { keyword: keyword }
      }).then(res => {
        if (res.result) {
          that.setData({
            characters: res.result.characters || [],
            houses: res.result.houses || [],
            events: res.result.events || [],
            searching: false,
            hasResults: true,
            totalCount: (res.result.characters || []).length +
                        (res.result.houses || []).length +
                        (res.result.events || []).length
          });
        } else {
          that.fallbackLocalSearch(keyword);
        }
      }).catch(() => {
        that.fallbackLocalSearch(keyword);
      });
    } catch (e) {
      that.fallbackLocalSearch(keyword);
    }
  },

  fallbackLocalSearch: function (keyword) {
    const lower = keyword.toLowerCase();

    const matchChars = LOCAL_CHARACTERS.filter(c =>
      c.name.includes(keyword) ||
      c.nameEn.toLowerCase().includes(lower) ||
      (c.aliases && c.aliases.some(a => a.includes(keyword)))
    );

    const matchHouses = LOCAL_HOUSES.filter(h =>
      h.name.includes(keyword) ||
      h.nameEn.toLowerCase().includes(lower) ||
      h.words.includes(keyword) ||
      h.region.includes(keyword)
    );

    const matchEvents = LOCAL_EVENTS.filter(e =>
      e.name.includes(keyword) ||
      e.nameEn.toLowerCase().includes(lower)
    );

    this.setData({
      characters: matchChars,
      houses: matchHouses,
      events: matchEvents,
      searching: false,
      hasResults: matchChars.length + matchHouses.length + matchEvents.length > 0,
      totalCount: matchChars.length + matchHouses.length + matchEvents.length
    });
  },

  onResultTap: function (e) {
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;

    switch (type) {
      case 'character':
        wx.navigateTo({ url: '/pages/character-detail/character-detail?id=' + id });
        break;
      case 'house':
        wx.navigateTo({ url: '/pages/house-detail/house-detail?id=' + id });
        break;
      case 'event':
        wx.navigateTo({ url: '/pages/event-detail/event-detail?id=' + id });
        break;
      default:
        break;
    }
  },

  onClear: function () {
    this.setData({
      keyword: '',
      searching: false,
      hasResults: false,
      characters: [],
      houses: [],
      events: [],
      totalCount: 0
    });
  }
});
