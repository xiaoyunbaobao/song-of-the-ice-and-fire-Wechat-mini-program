const { getHouses } = require('../../utils/db');
const { getHouseIcon, REGIONS } = require('../../utils/icons');

Page({
  data: {
    houses: [],
    loading: true,
    loadingMore: false,
    hasMore: true,
    page: 1,
    pageSize: 20,
    total: 0,

    // 搜索
    keyword: '',

    // 本地降级数据
    localHouses: []
  },

  onLoad() {
    this.setData({ localHouses: this.getLocalHouses() });
    this.loadHouses();
  },

  // 加载家族数据
  async loadHouses(append = false) {
    if (!append) {
      this.setData({ loading: true, page: 1 });
    } else {
      this.setData({ loadingMore: true });
    }

    const { page, pageSize, keyword } = this.data;

    const result = await getHouses({
      page,
      pageSize
    });

    if (result.data.length > 0) {
      let houses = (append
        ? [...this.data.houses, ...result.data]
        : result.data).map(h => ({
          ...h,
          img: h.img && h.img.startsWith('/images/')
            ? h.img.replace('/images/', 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/')
            : h.img
        }));

      // 关键词筛选
      if (keyword) {
        houses = this.filterByKeyword(houses);
      }

      this.setData({
        houses,
        total: result.total,
        hasMore: houses.length < result.total,
        loading: false,
        loadingMore: false
      });
    } else if (!append) {
      // 云端无数据，使用本地数据
      let filtered = this.getLocalHouses();
      if (keyword) {
        filtered = this.filterByKeyword(filtered);
      }
      this.setData({
        houses: filtered,
        total: filtered.length,
        hasMore: false,
        loading: false,
        loadingMore: false
      });
    } else {
      this.setData({
        hasMore: false,
        loadingMore: false
      });
    }
  },

  // 关键词过滤
  filterByKeyword(list) {
    const kw = this.data.keyword.toLowerCase();
    return list.filter(h =>
      h.name.toLowerCase().includes(kw) ||
      (h.words && h.words.toLowerCase().includes(kw)) ||
      (h.region && h.region.includes(kw)) ||
      (h.seat && h.seat.includes(kw))
    );
  },

  // 本地家族数据（云数据库未就绪时的降级方案）
  getLocalHouses() {
    return [
      // ===== 九大家族 =====
      {
        _id: 'house_stark',
        name: '史塔克家族',
        sigil: '🐺', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Stark.jpg',
        sigilName: '冰原狼',
        words: '凛冬将至',
        region: '北境',
        seat: '临冬城',
        overlord: '北境之王',
        description: '史塔克家族是北境的守护者，临冬城的领主。他们是先民的后裔，数千年来统治着北境。作为维斯特洛最古老的家族之一，史塔克家族以荣誉、责任和坚韧著称。',
        sigilColor: '#7ec8e3'
      },
      {
        _id: 'house_lannister',
        name: '兰尼斯特家族',
        sigil: '🦁', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Lannister.jpg',
        sigilName: '雄狮',
        words: '听我怒吼',
        region: '西境',
        seat: '凯岩城',
        overlord: '西境守护',
        description: '兰尼斯特家族是西境的统治者，凯岩城的领主。他们拥有维斯特洛最丰富的金矿，以"兰尼斯特有债必偿"闻名。家族以雄狮为徽记，象征力量与威严。',
        sigilColor: '#d4a853'
      },
      {
        _id: 'house_targaryen',
        name: '坦格利安家族',
        sigil: '🐉', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Targaryen.jpg',
        sigilName: '三头龙',
        words: '血火同源',
        region: '王领（原）',
        seat: '龙石岛（原红堡）',
        overlord: '维斯特洛合法统治者',
        description: '坦格利安家族是瓦雷利亚自由堡垒的遗民，以驾驭巨龙的能力征服了维斯特洛。三头龙是他们的族徽，代表征服者伊耿和他的两个姐妹。血与火是他们的族语，象征着瓦雷利亚的遗产。',
        sigilColor: '#c44536'
      },
      {
        _id: 'house_baratheon',
        name: '拜拉席恩家族',
        sigil: '🦌', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/Baratheon_DS.jpg',
        sigilName: '宝冠雄鹿',
        words: '怒火燎原',
        region: '风暴地',
        seat: '风息堡',
        overlord: '风暴地守护',
        description: '拜拉席恩家族是风暴地的统治者，由奥里斯·拜拉席恩创立——他是征服者伊耿的私生子兄弟（传说）。家族以宝冠雄鹿为徽记，在劳勃叛乱后成为王族。',
        sigilColor: '#f0c040'
      },
      {
        _id: 'house_greyjoy',
        name: '葛雷乔伊家族',
        sigil: '🐙', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Greyjoy.jpg',
        sigilName: '海怪',
        words: '强取胜于苦耕',
        region: '铁群岛',
        seat: '派克城',
        overlord: '铁群岛之王',
        description: '葛雷乔伊家族统治铁群岛和铁民，他们是海上的掠袭者，信奉淹神。海怪徽记象征深海的力量与恐惧。',
        sigilColor: '#808080'
      },
      {
        _id: 'house_arryn',
        name: '艾林家族',
        sigil: '🦅', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Arryn.jpg',
        sigilName: '新月猎鹰',
        words: '高如荣誉',
        region: '谷地',
        seat: '鹰巢城',
        overlord: '谷地守护',
        description: '艾林家族是谷地的统治者，安达尔贵族中最古老的一支。鹰巢城建于高山之巅，易守难攻。家族以猎鹰和新月为徽记，象征高远的荣誉。',
        sigilColor: '#4a90d9'
      },
      {
        _id: 'house_martell',
        name: '马泰尔家族',
        sigil: '☀️', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Martell.jpg',
        sigilName: '长枪贯日',
        words: '不屈不挠',
        region: '多恩',
        seat: '阳戟城',
        overlord: '多恩亲王',
        description: '马泰尔家族是多恩的统治者，是唯一没有被征服者伊耿用龙火击败的王国。他们以长枪贯穿红日的徽记象征多恩人永不屈服的精神。多恩承认男女平等的继承权。',
        sigilColor: '#d4744a'
      },
      {
        _id: 'house_tully',
        name: '徒利家族',
        sigil: '🐟', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Tully.jpg',
        sigilName: '银色鳟鱼',
        words: '家族、责任、荣誉',
        region: '河间地',
        seat: '奔流城',
        overlord: '河间地守护',
        description: '徒利家族是河间地的领主，奔流城的主人。他们以银色鳟鱼为徽记——鳟鱼跃出水面，象征敏捷与生命力。徒利家族在劳勃叛乱中率先举起反旗。',
        sigilColor: '#4a7a9c'
      },
      {
        _id: 'house_tyrell',
        name: '提利尔家族',
        sigil: '🌹', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Tyrell.jpg',
        sigilName: '金色玫瑰',
        words: '生生不息',
        region: '河湾地',
        seat: '高庭',
        overlord: '河湾地守护',
        description: '提利尔家族是河湾地的统治者，高庭的主人。他们以金色玫瑰为徽记，象征美丽、富饶与生长。河湾地是维斯特洛最富庶的地区，盛产粮食。',
        sigilColor: '#4a9c4a'
      },
      // ===== 次级家族 =====
      {
        _id: 'house_bolton',
        name: '波顿家族',
        sigil: '🚩', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Bolton.jpg',
        sigilName: '剥皮人',
        words: '吾刃锐利',
        region: '北境',
        seat: '恐怖堡',
        overlord: '史塔克家族',
        description: '波顿家族是北境最令人畏惧的家族之一，以"剥皮"传统著称，历史上曾与史塔克家族争夺北境统治权。',
        sigilColor: '#c44536'
      },
      {
        _id: 'house_frey',
        name: '佛雷家族',
        sigil: '🏰', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Frey.jpg',
        sigilName: '双塔',
        words: '（无正式族语）',
        region: '河间地',
        seat: '孪河城',
        overlord: '徒利家族',
        description: '佛雷家族控制着孪河城——跨越绿叉河的重要通道。家族庞大，族系复杂，"血色婚礼"的策划者。',
        sigilColor: '#6a6560'
      },
      {
        _id: 'house_mormont',
        name: '莫尔蒙家族',
        sigil: '🐻', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Mormont.jpg',
        sigilName: '熊',
        words: '昂首屹立',
        region: '北境',
        seat: '熊岛',
        overlord: '史塔克家族',
        description: '莫尔蒙家族是熊岛的小贵族家族，以忠诚和勇武著称。每一位莫尔蒙都以熊为徽记，女性同样能征善战。',
        sigilColor: '#4a9c4a'
      },
      {
        _id: 'house_tarly',
        name: '塔利家族',
        sigil: '🏹', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/Tarly.jpg',
        sigilName: '猎人',
        words: '率先冲锋',
        region: '河湾地',
        seat: '角陵',
        overlord: '提利尔家族',
        description: '塔利家族是河湾地的军事贵族，以出色的战士闻名。蓝道·塔利被认为是维斯特洛最优秀的军事指挥官之一。',
        sigilColor: '#7ec8e3'
      },
      {
        _id: 'house_reed',
        name: '黎德家族',
        sigil: '🦎', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Reed.jpg',
        sigilName: '灰沼蜥狮',
        words: '（不详）',
        region: '北境',
        seat: '灰水望',
        overlord: '史塔克家族',
        description: '黎德家族是泽地的统治者，统领泽地人。他们住在漂浮的城堡灰水望中，以游击战术和毒箭闻名。',
        sigilColor: '#4a7a9c'
      },
      {
        _id: 'house_clegane',
        name: '克里冈家族',
        sigil: '🐕', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Clegane.jpg',
        sigilName: '三黑犬',
        words: '（无）',
        region: '西境',
        seat: '克里冈堡',
        overlord: '兰尼斯特家族',
        description: '克里冈家族是兰尼斯特的封臣，家徽为黄底三黑犬。"魔山"格雷果·克里冈和"猎狗"桑铎·克里冈均出自此家族。',
        sigilColor: '#d4a853'
      },
      {
        _id:'house_velaryon', name:'瓦列利安家族', sigil:'🌊', sigilName:'海马',
        words:'古老·忠誠·勇毅', region:'王领', seat:'潮头岛',
        overlord:'坦格利安家族',
        img:'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Velaryon2.jpg',
        description:'瓦列利安家族是瓦雷利亚血统的古老家族，统治潮头岛。海蛇科利斯·瓦列利安是维斯特洛史上最伟大的航海家，曾九次远航至厄斯索斯尽头。血龙狂舞时期与雷妮拉·坦格利安结盟。',
        sigilColor:'#3cb4b4'
      }
    ];
  },

  // 搜索
  onSearch(e) {
    const { keyword } = e.detail;
    this.setData({ keyword, page: 1, houses: [] });
    this.loadHouses();
  },

  // 清除搜索
  onSearchClear() {
    this.setData({ keyword: '', page: 1, houses: [] });
    this.loadHouses();
  },

  // 跳转家族详情
  onHouseTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/house-detail/house-detail?id=${id}`
    });
  },

  // 加载更多
  loadMore() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadHouses(true);
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ page: 1, houses: [], keyword: '' });
    this.loadHouses().then(() => wx.stopPullDownRefresh());
  },

  // 触底加载
  onReachBottom() {
    this.loadMore();
  }
});
