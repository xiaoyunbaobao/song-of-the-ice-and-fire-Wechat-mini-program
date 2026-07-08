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
    selectedHouse: '',
    houseOptions: [
      { value: '', label: '全部家族' },
      { value: 'house_stark', label: '史塔克' },
      { value: 'house_lannister', label: '兰尼斯特' },
      { value: 'house_targaryen', label: '坦格利安' },
      { value: 'house_baratheon', label: '拜拉席恩' },
      { value: 'house_greyjoy', label: '葛雷乔伊' },
      { value: 'house_arryn', label: '艾林' },
      { value: 'house_martell', label: '马泰尔' },
      { value: 'house_tully', label: '徒利' },
      { value: 'house_tyrell', label: '提利尔' },
      { value: 'house_velaryon', label: '瓦列利安' },
      { value: 'house_bolton', label: '波顿' },
      { value: 'house_frey', label: '佛雷' },
      { value: 'house_mormont', label: '莫尔蒙' },
      { value: 'house_tarly', label: '塔利' },
      { value: 'house_clegane', label: '克里冈' },
      { value: 'house_reed', label: '黎德' }
    ],
    showFilter: false,

    loading: true,
    empty: false
  },

  onLoad(options) {
    const letter = options.letter || '';
    this.loadCharacters(letter);
  },

  async loadCharacters(targetLetter) {
    this.setData({ loading: true });

    let characters = [];
    // 先尝试云数据库
    try {
      if (wx.cloud) {
        const db = wx.cloud.database();
        const res = await db.collection('characters').limit(200).get();
        if (res.data && res.data.length > 0) {
          characters = res.data;
        }
      }
    } catch (err) {
      console.log('云数据库未就绪，使用本地数据');
    }

    // 降级：从统一数据源构建
    if (!characters.length) {
      characters = this.getLocalCharactersFull();
    }

    // 家族筛选
    if (this.data.selectedHouse) {
      characters = characters.filter(c => c.houseId === this.data.selectedHouse);
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
    if (index >= 0) {
      this.setData({ activeLetter: letter, showLetterHint: true, letterHint: letter });
      wx.pageScrollTo({ selector: `#letter-${letter}`, duration: 200 });
      setTimeout(() => { this.setData({ showLetterHint: false }); }, 1500);
    }
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

  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  onHouseFilter(e) {
    const houseId = e.currentTarget.dataset.value;
    this.setData({ selectedHouse: houseId, showFilter: false });
    this.loadCharacters();
  },

  onCharacterTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/character-detail/character-detail?id=${id}` });
  }
});
