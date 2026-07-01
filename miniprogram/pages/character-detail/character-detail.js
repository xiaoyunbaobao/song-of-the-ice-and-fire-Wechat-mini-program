const { getCharacterDetail } = require('../../utils/db');
const { getHouseIcon, STATUS_MAP } = require('../../utils/icons');

Page({
  data: {
    character: null,
    house: null,
    loading: true,
    activeTab: 'book',       // book | show | diff
    characterId: ''
  },

  onLoad(options) {
    const id = options.id || '';
    this.setData({ characterId: id });
    this.loadDetail(id);
  },

  async loadDetail(id) {
    this.setData({ loading: true });

    // 优先从云数据库加载
    const char = await getCharacterDetail(id);

    if (char) {
      this.setData({
        character: char,
        house: char.house || null,
        loading: false
      });
    } else {
      // 降级：本地数据
      const localChar = this.getLocalCharacterDetail(id);
      this.setData({
        character: localChar,
        house: localChar ? localChar._house : null,
        loading: false
      });
    }

    // 更新导航栏标题
    if (this.data.character) {
      wx.setNavigationBarTitle({ title: this.data.character.name });
    }
  },

  // 本地角色详情（含书剧差异）
  getLocalCharacterDetail(id) {
    const characters = {
      'char_jon_snow': {
        _id: 'char_jon_snow',
        name: '琼恩·雪诺',
        aliases: ['雪诺大人', '白狼', '伊耿·坦格利安'],
        houseId: 'house_stark',
        titles: ['守夜人第998任总司令', '北境之王'],
        status: 'resurrected',
        culture: '北境人',
        actorName: '基特·哈灵顿',
        bookBio: '琼恩·雪诺是艾德·史塔克的私生子（实为雷加·坦格利安与莱安娜·史塔克之子），在临冬城与其他史塔克家孩子一起长大。他加入守夜人军团，成为总司令，在与野人的冲突中试图统一北境力量对抗异鬼。在第5卷《魔龙的狂舞》结尾，他在叛乱中被守夜人兄弟刺杀身亡，命运未卜。',
        showBio: '剧中琼恩的故事线与原著大体相似，在第5季结尾同样被刺杀。第6季被梅丽珊卓复活，随后击败拉姆斯·波顿夺回临冬城。第7季与丹妮莉丝结盟，第8季发现身世真相后杀死丹妮莉丝，最终被流放回守夜人。',
        differences: [
          {
            aspect: '复活',
            book: '原著中琼恩在第5卷结尾被刺杀，至今（第6卷未出版）尚未复活。书中暗示他可能通过白灵（冰原狼）的灵魂转移存活。',
            show: '剧中第6季明确被梅丽珊卓复活，身体完全恢复，复活过程相对简单直接。'
          },
          {
            aspect: '身世揭示',
            book: '书中尚未正式揭示 R+L=J（雷加+莱安娜=琼恩），但通过布兰·史塔克的绿之视野和多处暗示强烈指向此理论。',
            show: '第7季正式揭示琼恩是雷加·坦格利安与莱安娜·史塔克的合法儿子，本名伊耿·坦格利安。'
          },
          {
            aspect: '与丹妮莉丝的关系',
            book: '两人在书中尚未见面。',
            show: '第7季相遇并成为恋人，第8季发现血缘关系后关系破裂。'
          }
        ],
        appearedIn: {
          books: ['权力的游戏', '列王的纷争', '冰雨的风暴', '群鸦的盛宴', '魔龙的狂舞'],
          seasons: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        tags: ['守夜人', '史塔克', '坦格利安', '冰原狼', '复活', '核心角色'],
        relatedCharacters: ['char_eddard_stark', 'char_daenerys', 'char_arya', 'char_samwell'],
        _house: { name: '史塔克家族', sigil: '冰原狼', words: '凛冬将至', region: '北境', seat: '临冬城' }
      },
      'char_daenerys': {
        _id: 'char_daenerys',
        name: '丹妮莉丝·坦格利安',
        aliases: ['龙之母', '镣铐破除者', '弥林女王', '风暴降生'],
        houseId: 'house_targaryen',
        titles: ['龙之母', '镣铐破除者', '弥林女王', '安达尔人和先民的女王', '大草海的卡丽熙'],
        status: 'dead',
        culture: '瓦雷利亚人',
        actorName: '艾米莉亚·克拉克',
        bookBio: '丹妮莉丝是"疯王"伊里斯·坦格利安二世的女儿，在篡夺者战争后流亡厄斯索斯。她通过孵化和培育三条龙重建了坦格利安家族的力量。在奴隶湾解放奴隶后，她统治弥林并学习治国之道。第5卷结尾，她骑着卓耿飞离弥林竞技场，被多斯拉克人发现。',
        showBio: '剧中丹妮莉丝的故事与原著在前几季大体一致。她从第6季开始偏离原著（原著未出版内容），在第7季与琼恩·雪诺结盟。第8季她攻陷君临后在钟声响起后仍屠城，被琼恩·雪诺刺杀。德罗贡熔化铁王座后带走她的尸体。',
        differences: [
          {
            aspect: '性格与黑化',
            book: '书中丹妮莉丝逐渐展现统治者的冷酷面，但过程更细腻、更有逻辑。她在弥林面对的政治困境和内心挣扎被深入描写，黑化路径尚未完全展开。',
            show: '剧中她的转变在第8季加速完成，被许多观众认为过于仓促——从正义的解放者到屠城者的转折缺乏足够铺垫。'
          },
          {
            aspect: '魁尔斯与不朽之殿',
            book: '书中丹妮莉丝在不朽之殿看到的幻象极其丰富，包含大量预言（如"三个火焰""三个坐骑""三个背叛"），这些预言贯穿全书。',
            show: '剧中大幅简化了不朽之殿的幻象，删除了大部分预言内容。'
          },
          {
            aspect: '结局',
            book: '原著尚未写到结局，马丁表示结局会"苦乐参半"，但具体情节未知。',
            show: '被琼恩·雪诺刺杀，德罗贡熔化铁王座，布兰·史塔克成为国王。'
          }
        ],
        appearedIn: {
          books: ['权力的游戏', '列王的纷争', '冰雨的风暴', '群鸦的盛宴', '魔龙的狂舞'],
          seasons: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        tags: ['坦格利安', '龙', '女王', '解放者', '核心角色'],
        relatedCharacters: ['char_jon_snow', 'char_tyrion', 'char_jorah'],
        _house: { name: '坦格利安家族', sigil: '三头龙', words: '血火同源', region: '王领（原）', seat: '龙石岛（原红堡）' }
      },
      'char_tyrion': {
        _id: 'char_tyrion',
        name: '提利昂·兰尼斯特',
        aliases: ['小恶魔', '半人'],
        houseId: 'house_lannister',
        titles: ['国王之手', '财政大臣', '凯岩城公爵'],
        status: 'alive',
        culture: '西境人',
        actorName: '彼特·丁拉基',
        bookBio: '提利昂是泰温·兰尼斯特的矮人儿子，因出生导致母亲难产而死，被父亲和姐姐憎恨。他智力超群，善于政治和谋略。在第3卷中，他被指控谋杀乔佛里国王，杀死父亲泰温后逃亡厄斯索斯。第5卷中加入雇佣兵团，试图与丹妮莉丝结盟，但陷入奴隶困境。',
        showBio: '剧中提利昂的形象比原著更加正面。第5季起成为丹妮莉丝的顾问，第8季成为布兰·史塔克的国王之手。剧中省略了原著中提利昂在厄斯索斯的黑暗心理历程。',
        differences: [
          {
            aspect: '性格塑造',
            book: '书中提利昂在弑父后变得极其阴暗，充满仇恨和自我厌恶。他在厄斯索斯的旅程充满了对暴力和复仇的渴望。',
            show: '剧中提利昂始终保持着较为正面的形象，即使经历弑父后也没有走向黑暗，更像一个道德标杆。'
          },
          {
            aspect: '与詹姆的关系',
            book: '书中提利昂在逃亡前对詹姆说了极其恶毒的话（关于瑟曦的背叛），兄弟关系彻底破裂。',
            show: '剧中兄弟在后期和解，詹姆在临冬城之战前为提利昂说话。'
          },
          {
            aspect: '外貌',
            book: '书中提利昂在黑水河之战中被砍掉大半个鼻子，面目极其丑陋。',
            show: '剧中仅留下一条面部伤疤，整体外观保持体面。'
          }
        ],
        appearedIn: {
          books: ['权力的游戏', '列王的纷争', '冰雨的风暴', '群鸦的盛宴', '魔龙的狂舞'],
          seasons: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        tags: ['兰尼斯特', '国王之手', '政治', '核心角色'],
        relatedCharacters: ['char_jaime', 'char_cersei', 'char_daenerys'],
        _house: { name: '兰尼斯特家族', sigil: '雄狮', words: '听我怒吼', region: '西境', seat: '凯岩城' }
      }
    };

    // 如果请求的不是以上三个核心角色，返回通用降级数据
    const char = characters[id];
    if (char) return char;

    // 从角色列表本地数据中匹配基础信息
    if (id && id.startsWith('char_')) {
      return {
        _id: id,
        name: id.replace('char_', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        aliases: [],
        houseId: null,
        titles: [],
        status: 'unknown',
        culture: '未知',
        bookBio: '该角色的详细数据正在整理中。',
        showBio: '该角色的详细数据正在整理中。',
        differences: [],
        appearedIn: { books: [], seasons: [] },
        tags: [],
        relatedCharacters: [],
        _house: null
      };
    }
    return null;
  },

  // Tab 切换
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 跳转关联角色
  onRelatedCharacterTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/character-detail/character-detail?id=${id}`
    });
  },

  // 跳转家族
  onHouseTap() {
    const houseId = this.data.character.houseId;
    if (houseId) {
      wx.navigateTo({
        url: `/pages/house-detail/house-detail?id=${houseId}`
      });
    }
  }
});
