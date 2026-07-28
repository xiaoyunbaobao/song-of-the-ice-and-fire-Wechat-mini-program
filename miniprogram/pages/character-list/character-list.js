const { getCharacters } = require('../../utils/db');
const { CHARACTERS, PINYIN_MAP } = require('../../utils/data');

// A-Z 字母映射
const LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

Page({
  data: {
    allCharacters: [],
    groupedList: [],
    letterIndex: LETTERS,
    activeLetter: '',
    showLetterHint: false,
    letterHint: '',

    keyword: '',

    loading: true,
    empty: false
  },

  onLoad(options) {
    const letter = options.letter || '';
    this.loadCharacters(letter);
  },

  async loadCharacters(targetLetter) {
    this.setData({ loading: true });

    // 优先本地数据（云端有20条限制）
    let characters = this.getLocalCharactersFull();

    // 尝试补充云数据
    try {
      if (wx.cloud) {
        const db = wx.cloud.database();
        const res = await db.collection('characters').limit(100).get();
        if (res.data && res.data.length > characters.length) {
          characters = res.data.map(c => ({...c, pinyin: PINYIN_MAP[c._id] || c.name.charAt(0).toUpperCase()}));
        }
      }
    } catch (err) {
      // 云不可用时用本地
    }

    // 关键词搜索
    if (this.data.keyword) {
      const kw = this.data.keyword.toLowerCase();
      characters = characters.filter(c =>
        c.name.includes(kw) || (c.aliases && c.aliases.some(a => a.includes(kw)))
      );
    }

    const grouped = this.groupByLetter(characters);

    this.setData({
      allCharacters: characters,
      groupedList: grouped,
      loading: false,
      empty: characters.length === 0
    });

    if (targetLetter) {
      this.scrollToLetter(targetLetter);
    }
  },

  // 从统一数据源构建（加 pinyin）
  getLocalCharactersFull() {
    return CHARACTERS.map(c => ({
      ...c,
      pinyin: PINYIN_MAP[c._id] || c.name.charAt(0).toUpperCase()
    }));
  },

  // 按首字母分组
  groupByLetter(characters) {
    const groups = {};
    LETTERS.forEach(l => { groups[l] = []; });

    characters.forEach(char => {
      const first = (char.pinyin || char.name).charAt(0).toUpperCase();
      if (groups[first]) {
        groups[first].push(char);
      } else {
        if (!groups['#']) groups['#'] = [];
        groups['#'].push(char);
      }
    });

    const result = [];
    LETTERS.forEach(l => {
      if (groups[l] && groups[l].length > 0) {
        result.push({ letter: l, characters: groups[l] });
      }
    });
    if (groups['#'] && groups['#'].length > 0) {
      result.push({ letter: '#', characters: groups['#'] });
    }
    return result;
  },

  scrollToLetter(letter) {
    const index = this.data.groupedList.findIndex(g => g.letter === letter);
    if (index < 0) return;
    this.setData({ activeLetter: letter, showLetterHint: true, letterHint: letter });
    const query = wx.createSelectorQuery();
    query.select('#letter-' + letter).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(res => {
      if (res[0]) {
        wx.pageScrollTo({ scrollTop: res[0].top + (res[1] ? res[1].scrollTop : 0) - 60, duration: 200 });
      }
    });
    setTimeout(() => { this.setData({ showLetterHint: false }); }, 1500);
  },

  onLetterTap(e) {
    const letter = e.currentTarget.dataset.letter;
    this.scrollToLetter(letter);
  },

  onLetterTouchMove(e) {
    const touchY = e.touches[0].clientY;
    const query = wx.createSelectorQuery();
    query.selectAll('.letter-bar-item').boundingClientRect();
    query.exec(res => {
      if (!res[0]) return;
      const items = res[0];
      for (let i = 0; i < items.length; i++) {
        if (touchY >= items[i].top && touchY <= items[i].bottom) {
          const letter = LETTERS[i];
          if (letter && letter !== this.data.letterHint) {
            this.setData({ letterHint: letter, showLetterHint: true });
            this.scrollToLetter(letter);
          }
          break;
        }
      }
    });
  },

  onLetterTouchEnd() {
    setTimeout(() => { this.setData({ showLetterHint: false }); }, 800);
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.keyword });
    this.loadCharacters();
  },

  onCharacterTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/character-detail/character-detail?id=${id}` });
  }
});
