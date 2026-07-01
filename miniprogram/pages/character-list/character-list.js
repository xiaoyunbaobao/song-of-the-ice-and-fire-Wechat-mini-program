const { getCharacters } = require('../../utils/db');

// A-Z 字母映射（用于侧边索引）
const LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

Page({
  data: {
    // 所有角色（含分组）
    allCharacters: [],
    // 当前显示的分组列表 [{letter, characters[]}]
    groupedList: [],
    // A-Z 字母索引
    letterIndex: LETTERS,
    // 当前活跃字母（滚动时高亮）
    activeLetter: '',
    // 跳转指示器
    showLetterHint: false,
    letterHint: '',

    // 搜索与筛选
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
      { value: 'house_tyrell', label: '提利尔' }
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

    // 先尝试云数据库
    let characters = [];
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

    // 降级：本地数据
    if (!characters.length) {
      characters = this.getLocalCharactersFull();
    }

    // 应用家族筛选
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

    // 按拼音首字母分组
    const grouped = this.groupByLetter(characters);

    this.setData({
      allCharacters: characters,
      groupedList: grouped,
      loading: false,
      empty: characters.length === 0
    });

    // 如果有 targetLetter，滚动到对应字母
    if (targetLetter) {
      this.scrollToLetter(targetLetter);
    }
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
        // 非字母开头的放入 # 组...用 Z 作为兜底
        if (!groups['#']) groups['#'] = [];
        groups['#'].push(char);
      }
    });

    // 转换为列表，过滤空组
    const result = [];
    LETTERS.forEach(l => {
      if (groups[l] && groups[l].length > 0) {
        result.push({ letter: l, characters: groups[l] });
      }
    });
    // # 组放最后
    if (groups['#'] && groups['#'].length > 0) {
      result.push({ letter: '#', characters: groups['#'] });
    }
    return result;
  },

  // 滚动到指定字母
  scrollToLetter(letter) {
    const index = this.data.groupedList.findIndex(g => g.letter === letter);
    if (index >= 0) {
      this.setData({ activeLetter: letter, showLetterHint: true, letterHint: letter });
      // 使用 scroll-into-view
      wx.pageScrollTo({ selector: `#letter-${letter}`, duration: 200 });
      setTimeout(() => { this.setData({ showLetterHint: false }); }, 1500);
    }
  },

  // 侧边字母点击
  onLetterTap(e) {
    const letter = e.currentTarget.dataset.letter;
    this.scrollToLetter(letter);
  },

  // 字母触摸移动（快速滑动切换）
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

  // 搜索
  onSearch(e) {
    this.setData({ keyword: e.detail.keyword });
    this.loadCharacters();
  },

  // 家族筛选
  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  onHouseFilter(e) {
    const houseId = e.currentTarget.dataset.value;
    this.setData({ selectedHouse: houseId, showFilter: false });
    this.loadCharacters();
  },

  // 角色点击
  onCharacterTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/character-detail/character-detail?id=${id}` });
  },

  // 本地角色全量数据（含 pinyin 首字母）
  getLocalCharactersFull() {
    return [
      { _id: 'char_aemon', name: '伊蒙·坦格利安', pinyin: 'A', houseId: 'house_targaryen', titles: ['守夜人学士'], status: 'dead', tags: ['坦格利安', '守夜人'] },
      { _id: 'char_arya', name: '艾莉亚·史塔克', pinyin: 'A', houseId: 'house_stark', titles: ['无面者'], status: 'alive', tags: ['史塔克', '复仇'] },
      { _id: 'char_asha', name: '阿莎·葛雷乔伊', pinyin: 'A', houseId: 'house_greyjoy', titles: ['铁群岛继承人'], status: 'alive', tags: ['葛雷乔伊', '铁民'] },
      { _id: 'char_brienne', name: '布蕾妮·塔斯', pinyin: 'B', houseId: null, titles: ['御林铁卫队长'], status: 'alive', tags: ['骑士', '荣誉'] },
      { _id: 'char_bran', name: '布兰·史塔克', pinyin: 'B', houseId: 'house_stark', titles: ['三眼乌鸦', '六国之王'], status: 'alive', tags: ['史塔克', '绿先知'] },
      { _id: 'char_barristan', name: '巴利斯坦·赛尔弥', pinyin: 'B', houseId: null, titles: ['御林铁卫队长'], status: 'dead', tags: ['骑士', '荣誉'] },
      { _id: 'char_cersei', name: '瑟曦·兰尼斯特', pinyin: 'C', houseId: 'house_lannister', titles: ['七大王国女王'], status: 'dead', tags: ['兰尼斯特', '权力'] },
      { _id: 'char_daenerys', name: '丹妮莉丝·坦格利安', pinyin: 'D', houseId: 'house_targaryen', titles: ['龙之母', '镣铐破除者'], status: 'dead', tags: ['坦格利安', '龙'] },
      { _id: 'char_davos', name: '戴佛斯·席渥斯', pinyin: 'D', houseId: null, titles: ['国王之手'], status: 'alive', tags: ['洋葱骑士'] },
      { _id: 'char_doran', name: '道朗·马泰尔', pinyin: 'D', houseId: 'house_martell', titles: ['多恩亲王'], status: 'alive', tags: ['马泰尔', '多恩'] },
      { _id: 'char_eddard', name: '艾德·史塔克', pinyin: 'E', houseId: 'house_stark', titles: ['临冬城公爵', '北境守护'], status: 'dead', tags: ['史塔克', '荣誉'] },
      { _id: 'char_euron', name: '攸伦·葛雷乔伊', pinyin: 'E', houseId: 'house_greyjoy', titles: ['铁群岛之王'], status: 'alive', tags: ['葛雷乔伊', '鸦眼'] },
      { _id: 'char_jaime', name: '詹姆·兰尼斯特', pinyin: 'J', houseId: 'house_lannister', titles: ['御林铁卫队长'], status: 'dead', tags: ['兰尼斯特', '弑君者'] },
      { _id: 'char_jon', name: '琼恩·雪诺', pinyin: 'J', houseId: 'house_stark', titles: ['守夜人总司令', '北境之王'], status: 'resurrected', tags: ['守夜人', '史塔克'] },
      { _id: 'char_jorah', name: '乔拉·莫尔蒙', pinyin: 'J', houseId: null, titles: ['流亡骑士'], status: 'dead', tags: ['莫尔蒙', '守护'] },
      { _id: 'char_littlefinger', name: '培提尔·贝里席', pinyin: 'L', houseId: null, titles: ['财政大臣'], status: 'dead', tags: ['小指头', '阴谋'] },
      { _id: 'char_margaery', name: '玛格丽·提利尔', pinyin: 'M', houseId: 'house_tyrell', titles: ['七大王国女王'], status: 'dead', tags: ['提利尔', '玫瑰'] },
      { _id: 'char_melisandre', name: '梅丽珊卓', pinyin: 'M', houseId: null, titles: ['光之王祭司'], status: 'dead', tags: ['红袍女'] },
      { _id: 'char_oberyn', name: '奥柏伦·马泰尔', pinyin: 'A', houseId: 'house_martell', titles: ['红毒蛇'], status: 'dead', tags: ['马泰尔', '多恩'] },
      { _id: 'char_olenna', name: '奥莲娜·提利尔', pinyin: 'A', houseId: 'house_tyrell', titles: ['荆棘女王'], status: 'dead', tags: ['提利尔', '谋略'] },
      { _id: 'char_renly', name: '蓝礼·拜拉席恩', pinyin: 'L', houseId: 'house_baratheon', titles: ['风息堡公爵'], status: 'dead', tags: ['拜拉席恩'] },
      { _id: 'char_robb', name: '罗柏·史塔克', pinyin: 'L', houseId: 'house_stark', titles: ['北境之王'], status: 'dead', tags: ['史塔克', '少狼主'] },
      { _id: 'char_robert', name: '劳勃·拜拉席恩', pinyin: 'L', houseId: 'house_baratheon', titles: ['七大王国国王'], status: 'dead', tags: ['拜拉席恩', '篡夺者'] },
      { _id: 'char_samwell', name: '山姆威尔·塔利', pinyin: 'S', houseId: null, titles: ['守夜人学士'], status: 'alive', tags: ['守夜人', '塔利'] },
      { _id: 'char_sandor', name: '桑铎·克里冈', pinyin: 'S', houseId: null, titles: ['御林铁卫'], status: 'unknown', tags: ['猎狗'] },
      { _id: 'char_sansa', name: '珊莎·史塔克', pinyin: 'S', houseId: 'house_stark', titles: ['临冬城夫人', '北境女王'], status: 'alive', tags: ['史塔克', '政治'] },
      { _id: 'char_stannis', name: '史坦尼斯·拜拉席恩', pinyin: 'S', houseId: 'house_baratheon', titles: ['龙石岛公爵'], status: 'dead', tags: ['拜拉席恩', '光之王'] },
      { _id: 'char_theon', name: '席恩·葛雷乔伊', pinyin: 'S', houseId: 'house_greyjoy', titles: ['铁群岛王子'], status: 'dead', tags: ['葛雷乔伊', '臭佬'] },
      { _id: 'char_tyrion', name: '提利昂·兰尼斯特', pinyin: 'T', houseId: 'house_lannister', titles: ['国王之手', '凯岩城公爵'], status: 'alive', tags: ['兰尼斯特', '小恶魔'] },
      { _id: 'char_tywin', name: '泰温·兰尼斯特', pinyin: 'T', houseId: 'house_lannister', titles: ['凯岩城公爵', '国王之手'], status: 'dead', tags: ['兰尼斯特', '雄狮'] },
      { _id: 'char_varys', name: '瓦里斯', pinyin: 'V', houseId: null, titles: ['情报总管'], status: 'dead', tags: ['太监', '蜘蛛'] },
      { _id: 'char_victarion', name: '维克塔利昂·葛雷乔伊', pinyin: 'V', houseId: 'house_greyjoy', titles: ['铁舰队司令'], status: 'alive', tags: ['葛雷乔伊', '铁民'] }
    ];
  }
});
