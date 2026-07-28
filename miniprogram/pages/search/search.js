// pages/search/search.js
// 冰与火之歌 全局搜索页
const { CHARACTERS, HOUSES, EVENTS, WIKI_TOPICS } = require('../../utils/data');

Page({
  data: {
    keyword: '',
    searching: false,
    hasResults: false,
    characters: [],
    houses: [],
    events: [],
    articles: [],
    totalCount: 0
  },

  onLoad: function (options) {
    if (options.keyword) {
      const decoded = decodeURIComponent(options.keyword);
      this.setData({ keyword: decoded });
      this.performSearch(decoded);
    }
  },

  onSearchInput: function (e) {
    let keyword = e.detail.value.trim();
    try { keyword = decodeURIComponent(keyword); } catch(e) {}
    this.setData({ keyword: keyword });

    if (keyword.length === 0) {
      this.setData({
        searching: false,
        hasResults: false,
        characters: [],
        houses: [],
        events: [],
        articles: [],
        totalCount: 0
      });
      return;
    }

    if (keyword.length >= 1) {
      this.performSearch(keyword);
    }
  },

  onSearchConfirm: function (e) {
    let keyword = e.detail.value.trim();
    try { keyword = decodeURIComponent(keyword); } catch(e) {}
    if (keyword.length > 0) {
      this.setData({ keyword: keyword });
      this.performSearch(keyword);
    }
  },

  performSearch: function (keyword) {
    this.setData({ searching: true });
    let kw = keyword;
    try { kw = decodeURIComponent(keyword); } catch(e) {}
    this.setData({ keyword: kw });
    this.fallbackLocalSearch(kw);
  },

  fallbackLocalSearch: function (keyword) {
    const lower = keyword.toLowerCase();

    const matchArticles = WIKI_TOPICS.filter(a =>
      a.title.includes(keyword) || a.topic.includes(keyword) || a.category.includes(keyword) || (a.summary && a.summary.includes(keyword))
    );

    const matchChars = CHARACTERS.filter(c =>
      c.name.includes(keyword) ||
      (c.aliases && c.aliases.some(a => a.includes(keyword)))
    );

    const matchHouses = HOUSES.filter(h =>
      h.name.includes(keyword) ||
      h.words.includes(keyword) ||
      h.region.includes(keyword) ||
      h.seat.includes(keyword)
    );

    const matchEvents = EVENTS.filter(e =>
      e.name.includes(keyword) ||
      e.era.includes(keyword)
    );

    this.setData({
      characters: matchChars,
      houses: matchHouses,
      events: matchEvents,
      articles: matchArticles,
      searching: false,
      hasResults: matchChars.length + matchHouses.length + matchEvents.length + matchArticles.length > 0,
      totalCount: matchChars.length + matchHouses.length + matchEvents.length + matchArticles.length
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
      case 'article':
        wx.navigateTo({ url: `/pages/wiki-article/wiki-article?topic=${encodeURIComponent(id)}` });
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
