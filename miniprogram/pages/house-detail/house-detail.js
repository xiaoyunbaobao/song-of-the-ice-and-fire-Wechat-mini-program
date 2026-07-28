const { getCharacterDetail } = require('../../utils/db');
const { getHouseIcon, REGIONS } = require('../../utils/icons');
const { EVENTS } = require('../../utils/data');
const { getCloudImg } = require('../../utils/cloud-img');

Page({
  data: {
    house: null,
    loading: true,
    houseId: ''
  },

  onLoad(options) {
    const id = options.id || '';
    this.setData({ houseId: id });
    this.loadDetail(id);
  },

  async loadDetail(id) {
    this.setData({ loading: true });

    // 优先本地数据（含详细历史/成员/事件）
    const localHouse = this.getLocalHouseDetail(id);
    if (localHouse) {
      const hImgs = [];
      if (localHouse.img) hImgs.push(localHouse.img);
      if (localHouse.familyTree) hImgs.push(localHouse.familyTree);
      if (hImgs.length) {
        const res = hImgs.map(i => getCloudImg(i.replace('https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/', 'images/')));
        if (localHouse.img) localHouse.img = res[0];
        if (localHouse.familyTree) localHouse.familyTree = res[localHouse.img ? 1 : 0];
      }
      this.setData({ house: localHouse, loading: false });
      wx.setNavigationBarTitle({ title: localHouse.name || '家族详情' });
      return;
    }

    // 本地没有时尝试云数据库
    try {
      if (wx.cloud) {
        const db = wx.cloud.database();
        const res = await db.collection('houses').doc(id).get();
        if (res.data && res.data.name) {
          this.setData({ house: res.data, loading: false });
          wx.setNavigationBarTitle({ title: res.data.name || '家族详情' });
          return;
        }
      }
    } catch (err) {
      console.log('云数据库加载失败', err);
    }

    this.setData({ loading: false });
  },

  // 本地家族详情数据
  getLocalHouseDetail(id) {
    const houses = {
      // ═══════════ 史塔克家族 ═══════════
      'house_stark': {
        _id: 'house_stark',
        name: '史塔克家族',
        sigil: '🐺', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Stark.jpg',
        sigilName: '冰原狼',
        words: '凛冬将至',
        region: '北境',
        seat: '临冬城',
        overlord: '北境之王',
        coatOfArms: '白底灰色冰原狼',
        religion: { name:'旧神', icon:'🌳', isRich:true, desc:[
          { t:'史塔克家族信仰' },{ t:'旧神', l:'article:旧神' },{ t:'——维斯特洛最古老的信仰体系。旧神没有特定的神名、经书或祭司，信徒在' },{ t:'鱼梁木', l:'article:鱼梁木' },{ t:'前祈祷。鱼梁木是刻有人脸的白色古树，被视为旧神注视人间的眼睛和耳朵。北境是七国中唯一保留了旧神信仰的地区。' }
        ] },
        history: [
          { t: '史塔克家族是北境的统治家族，' }, { t: '先民', l: 'search:先民' }, { t: '的后裔。传说' }, { t: '筑城者布兰登', l: 'search:筑城者布兰登' }, { t: '在英雄纪元（约八千年）前建造了' }, { t: '临冬城', l: 'search:临冬城' }, { t: '和' }, { t: '绝境长城', l: 'search:绝境长城' }, { t: '。史塔克家族以' }, { t: '北境之王', l: 'search:北境之王' }, { t: '身份统治数千年，直至' }, { t: '征服者伊耿', l: 'char:char_aegon_i' }, { t: '到来后屈膝降服，换取北境守护和临冬城公爵头衔。\n\n' },
          { t: '在' }, { t: '篡夺者战争', l: 'event:rebellion' }, { t: '期间，' }, { t: '艾德·史塔克', l: 'char:char_eddard_stark' }, { t: '与' }, { t: '劳勃·拜拉席恩', l: 'search:劳勃·拜拉席恩' }, { t: '并肩作战，推翻' }, { t: '坦格利安王朝', l: 'house:house_targaryen' }, { t: '。艾德后任国王之手，但因发现乔佛里等人是瑟曦与詹姆乱伦所生，被以叛国罪处决。\n\n' },
          { t: '此后史塔克家族遭受毁灭——' }, { t: '罗柏·史塔克', l: 'search:罗柏·史塔克' }, { t: '被拥为北境之王后在' }, { t: '红色婚礼', l: 'event:red_wedding' }, { t: '上遭瓦德·佛雷与卢斯·波顿屠杀；临冬城被' }, { t: '波顿家族', l: 'house:house_bolton' }, { t: '占据。但史塔克子女各自成长：' }, { t: '琼恩·雪诺', l: 'char:char_jon_snow' }, { t: '成为守夜人总司令，' }, { t: '珊莎', l: 'search:珊莎·史塔克' }, { t: '在谷地成长为政治人物，' }, { t: '艾莉亚', l: 'char:char_arya' }, { t: '在布拉佛斯成为无面者，' }, { t: '布兰', l: 'search:布兰·史塔克' }, { t: '获得三眼乌鸦之力。\n\n' },
          { t: '最终史塔克重新崛起。琼恩击败拉姆斯·波顿夺回临冬城；布兰成为六国之王，珊莎成为独立北境女王。族语"凛冬将至"提醒永恒的警惕——而狼群在冬天活下来了。' }
        ],
        notableEvents: [
          { year: '传说时代', event: '"筑城者"布兰登建造临冬城和绝境长城' },
          { year: '征服前', event: '史塔克家族以"北境之王"身份统治数千年' },
          { year: '征服元年', event: '"降服王"托伦·史塔克向征服者伊耿屈膝，放弃王冠换取北境守护头衔' },
          { year: '283 AC', event: '劳勃叛乱：艾德·史塔克与劳勃·拜拉席恩推翻坦格利安王朝' },
          { year: '298 AC', event: '艾德·史塔克被任命为国王之手，发现王后秘密' },
          { year: '299 AC', event: '艾德·史塔克被处决，罗柏·史塔克被拥立为北境之王' },
          { year: '299 AC', event: '红色婚礼：罗柏·史塔克、凯特琳·徒利和北境军队在孪河城被屠杀' },
          { year: '300+ AC', event: '琼恩·雪诺成为守夜人总司令，后被刺杀（书中）/复活（剧中）' },
          { year: '最终', event: '珊莎·史塔克成为北境女王，布兰·史塔克成为六国之王' }
        ],
        members: [
          '艾德·史塔克 — 临冬城公爵，北境守护',
          '凯特琳·徒利（凯特琳·史塔克）— 艾德的妻子',
          '罗柏·史塔克 — 长子，北境之王',
          '珊莎·史塔克 — 长女，最终成为北境女王',
          '艾莉亚·史塔克 — 次女，无面者',
          '布兰·史塔克 — 次子，三眼乌鸦/六国之王',
          '瑞肯·史塔克 — 幼子',
          '琼恩·雪诺 — 艾德的私生子（实为雷加·坦格利安与莱安娜·史塔克之子）'
        ],
        vassalHouses: ['波顿家族', '卡史塔克家族', '安柏家族', '莫尔蒙家族', '黎德家族', '曼德勒家族', '葛洛佛家族', '陶哈家族', '赛文家族', '达斯丁家族'],
        sigilColor: '#7ec8e3'
      },

      // ═══════════ 兰尼斯特家族 ═══════════
      'house_lannister': {
        _id: 'house_lannister',
        name: '兰尼斯特家族',
        sigil: '🦁', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Lannister.jpg',
        sigilName: '雄狮',
        words: '听我怒吼',
        region: '西境',
        seat: '凯岩城',
        overlord: '西境守护',
        coatOfArms: '猩红底色金色雄狮',
        religion: { name: '七神信仰', icon: '⭐', desc: '兰尼斯特家族名义上信仰安达尔人带来的七神——天父、圣母、战士、铁匠、少女、老妪和陌客。然而实际中他们更多将宗教视为政治工具。泰温·兰尼斯特曾说"狮子不在乎羊的想法"，瑟曦在剧中利用大麻雀后反被其制服。' },
        history: [
          { t: '兰尼斯特家族是西境的统治家族，凯岩城的领主。家族始祖"' }, { t: '机灵的兰恩', l: 'search:机灵的兰恩' }, { t: '在英雄纪元时期通过智谋从凯斯特利家族手中夺取了' }, { t: '凯岩城', l: 'search:凯岩城' }, { t: '。凯岩城建于一座巨大的金矿之上，使兰尼斯特成为维斯特洛最富有的家族。\n\n在坦格利安王朝时期，兰尼斯特家族是王室的坚定盟友（除了"' }, { t: '血龙狂舞', l: 'event:血龙狂舞' }, { t: '内战中短暂的摩擦）。' }, { t: '泰温·兰尼斯特', l: 'search:泰温·兰尼斯特' }, { t: '年轻时与' }, { t: '伊里斯二世', l: 'search:伊里斯二世' }, { t: '是好友，担任国王之手期间统治出色。\n\n' }, { t: '篡夺者战争', l: 'event:rebellion' }, { t: '期间，泰温在最后关头加入叛乱方，他的军队洗劫了君临，' }, { t: '詹姆·兰尼斯特', l: 'search:詹姆·兰尼斯特' }, { t: '杀死了' }, { t: '疯王', l: 'search:疯王' }, { t: '伊里斯。' }, { t: '瑟曦·兰尼斯特', l: 'search:瑟曦·兰尼斯特' }, { t: '嫁给劳勃成为王后，兰尼斯特家族的影响力达到顶峰。\n\n泰温去世后，兰尼斯特家族的权力迅速衰落。瑟曦放纵宗教武装导致自己被羞辱游街，后在第六季炸毁' }, { t: '贝勒大圣堂', l: 'search:贝勒大圣堂' }, { t: '消灭所有政敌并加冕为王（剧中），但这也导致了最后一个儿子托曼的自杀。詹姆在长夜之战中为生者而战，最终回到瑟曦身边，两人在红堡的坍塌中死去。\n\n' }, { t: '提利昂·兰尼斯特', l: 'search:提利昂·兰尼斯特' }, { t: '是家族中唯一的幸存者，在结局中成为布兰·史塔克的国王之手。兰尼斯特家族的"有债必偿"既成就了他们的统治，也带来了毁灭。' }
        ],
        notableEvents: [
          { year: '英雄纪元', event: '"机灵的"兰恩智取凯岩城，建立兰尼斯特家族' },
          { year: '征服元年', event: '兰尼斯特向征服者伊耿屈膝' },
          { year: '262 AC', event: '泰温·兰尼斯特成为伊里斯二世的国王之手，以铁腕治理王国二十年' },
          { year: '277 AC', event: '泰温消灭雷耶斯家族和塔贝克家族（"卡斯特梅的雨季"）' },
          { year: '283 AC', event: '君临沦陷：詹姆杀死疯王，泰温军队洗劫君临；兰尼斯特加入劳勃方' },
          { year: '298-300 AC', event: '五王之战：兰尼斯特家族对抗史塔克、拜拉席恩等叛乱势力' },
          { year: '300 AC', event: '泰温·兰尼斯特被儿子提利昂在茅厕中射杀' },
          { year: '300+ AC', event: '瑟曦炸毁贝勒大圣堂，消灭大麻雀和提利尔家族（剧中），加冕为女王' },
          { year: '最终', event: '詹姆和瑟曦在红堡坍塌中死亡，兰尼斯特家族由提利昂作为仅存继承人' }
        ],
        members: [
          '泰温·兰尼斯特 — 凯岩城公爵，西境守护，前国王之手',
          '詹姆·兰尼斯特 — 泰温的长子，"弑君者"，御林铁卫队长',
          '瑟曦·兰尼斯特 — 泰温的长女，七大王国女王',
          '提利昂·兰尼斯特 — 泰温的幼子，"小恶魔"，最终国王之手',
          '凯冯·兰尼斯特 — 泰温的弟弟，后成为摄政',
          '蓝赛尔·兰尼斯特 — 凯冯之子（剧中成为宗教武装成员）',
          '乔佛里·拜拉席恩 — （名义）瑟曦和劳勃的儿子，实为瑟曦与詹姆之子',
          '弥赛拉·拜拉席恩 — （名义）瑟曦和劳勃的女儿',
          '托曼·拜拉席恩 — （名义）瑟曦和劳勃的儿子'
        ],
        vassalHouses: ['克里冈家族', '马尔布兰家族', '派柏家族', '沙略特家族', '雷耶斯家族（已灭）', '塔贝克家族（已灭）', '维斯特林家族', '莱佛德家族'],
        sigilColor: '#d4a853'
      },

      // ═══════════ 坦格利安家族 ═══════════
      'house_targaryen': {
        _id: 'house_targaryen',
        name: '坦格利安家族',
        sigil: '🐉', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Targaryen.jpg',
        familyTree: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/house-tree/坦格利安家族谱系图2.0by_Gawen.jpg',
        sigilName: '三头龙',
        words: '血火同源',
        region: '王领（原）',
        seat: '龙石岛（原红堡）',
        overlord: '维斯特洛合法统治者',
        coatOfArms: '黑底红色三头龙',
        religion: { name: '瓦雷利亚传统与七神', icon: '🔥', desc: '坦格利安家族源自瓦雷利亚，原本信仰瓦雷利亚众神（巴勒里昂、赛里斯等龙神）。征服维斯特洛后为融入七国改信七神。然而他们保留了许多瓦雷利亚习俗——尤其是兄妹通婚以保持血统纯正。他们与龙的联系也是其信仰体系的核心部分。' },
        history: [
          { t: '坦格利安家族是' }, { t: '瓦雷利亚自由堡垒', l: 'search:瓦雷利亚自由堡垒' }, { t: '四十个龙主家族之一。在瓦雷利亚末日浩劫前十二年，丹妮丝·坦格利安在预言梦的指引下带领家族迁往龙石岛——这使他们成为浩劫后唯一幸存的龙主家族。\n\n' }, { t: '征服者伊耿', l: 'search:征服者伊耿' }, { t: '和他的两个姐妹（也是妻子）维桑尼亚和雷妮丝，骑乘三条巨' }, { t: '龙', l: 'article:龙' }, { t: '征服了维斯特洛七国中的六国（多恩通过联姻加入），开创了坦格利安王朝。坦格利安统治了近三百年，期间经历了多次内战（' }, { t: '血龙狂舞', l: 'event:血龙狂舞' }, { t: '、' }, { t: '黑火叛乱', l: 'search:黑火叛乱' }, { t: '）和外患。\n\n王朝最终在' }, { t: '篡夺者战争', l: 'event:rebellion' }, { t: '中覆灭——"' }, { t: '疯王伊里斯', l: 'search:疯王伊里斯' }, { t: '被詹姆·兰尼斯特杀死，伊耿王子（雷加的儿子）和雷妮丝公主被杀。仅存的坦格利安血脉——韦赛里斯和怀孕的蕾拉王后逃往龙石岛。丹妮莉丝在龙石岛出生，母亲死于难产。\n\n' }, { t: '丹妮莉丝·坦格利安', l: 'search:丹妮莉丝·坦格利安' }, { t: '成长为龙之母，孵化了三条巨' }, { t: '龙', l: 'article:龙' }, { t: '，解放了奴隶湾，最终（剧中）回到维斯特洛争夺铁王座。她在君临屠城后被琼恩·雪诺（实为雷加之子伊耿·坦格利安）刺杀，坦格利安王朝至此终结。' }
        ],
        notableEvents: [
          { year: '114 BC', event: '丹妮丝·坦格利安的预言梦引导家族迁往龙石岛，躲避末日浩劫' },
          { year: '征服元年', event: '征服者伊耿骑着贝勒里恩开始征服维斯特洛' },
          { year: '129-131 AC', event: '血龙狂舞：坦格利安内战，龙与龙相斗，大部分龙死亡' },
          { year: '196-260 AC', event: '五次黑火叛乱：坦格利安家族的支系争夺王位' },
          { year: '283 AC', event: '劳勃叛乱：疯王伊里斯二世被杀，坦格利安王朝覆灭' },
          { year: '298 AC', event: '丹妮莉丝孵化三条巨龙，龙重新回到世界' },
          { year: '最终', event: '丹妮莉丝攻陷君临并屠城，被琼恩·雪诺刺杀，铁王座被德罗贡熔化' }
        ],
        members: [
          '伊耿一世·坦格利安（征服者）— 第一任坦格利安国王',
          '伊里斯二世·坦格利安（疯王）— 末代坦格利安国王',
          '雷加·坦格利安 — 伊里斯的继承人，死于三叉戟河之战',
          '韦赛里斯·坦格利安 — 伊里斯的次子，"乞丐王"',
          '丹妮莉丝·坦格利安 — 伊里斯的幼女，龙之母',
          '琼恩·雪诺（伊耿·坦格利安）— 雷加与莱安娜·史塔克的儿子'
        ],
        vassalHouses: ['瓦列利安家族', '赛提加家族', '巴尔艾蒙家族', '桑格拉斯家族'],
        sigilColor: '#c44536'
      },

      // ═══════════ 拜拉席恩家族 ═══════════
      'house_baratheon': {
        _id: 'house_baratheon',
        name: '拜拉席恩家族',
        sigil: '🦌', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/Baratheon_DS.jpg',
        sigilName: '宝冠雄鹿',
        words: '怒火燎原',
        region: '风暴地',
        seat: '风息堡',
        overlord: '风暴地守护',
        coatOfArms: '金色底色黑色宝冠雄鹿',
        religion: { name: '七神信仰', icon: '⭐', desc: '拜拉席恩家族作为安达尔人后裔，名义上信仰七神。但史坦尼斯·拜拉席恩在红袍女梅丽珊卓影响下皈依了光之王拉赫洛信仰——一种来自厄斯索斯的一神教，以火与光象征真理。其族语"怒火燎原"与火神信仰形成呼应。' },
        history: [
          { t: '拜拉席恩家族由' }, { t: '奥里斯·拜拉席恩', l: 'search:奥里斯·拜拉席恩' }, { t: '创立——传说是' }, { t: '征服者伊耿', l: 'search:征服者伊耿' }, { t: '的私生子兄弟。他在征服战争中杀死了末代风暴国王亚尔吉拉·杜兰登，娶其女儿为妻，继承了杜兰登家族的徽记和族语。\n\n在' }, { t: '篡夺者战争', l: 'event:rebellion' }, { t: '中，' }, { t: '劳勃·拜拉席恩', l: 'search:劳勃·拜拉席恩' }, { t: '击败' }, { t: '雷加·坦格利安', l: 'search:雷加·坦格利安' }, { t: '于' }, { t: '三叉戟河', l: 'search:三叉戟河' }, { t: '，推翻坦格利安王朝，成为铁王座的新主人。他有坦格利安血统——他的祖母是伊耿五世的女儿蕾拉·坦格利安。\n\n劳勃死后，家族分裂为三个分支：劳勃（名义上的继承人乔佛里）、' }, { t: '史坦尼斯·拜拉席恩', l: 'search:史坦尼斯·拜拉席恩' }, { t: '（龙石岛公爵，自立为王）和' }, { t: '蓝礼·拜拉席恩', l: 'search:蓝礼·拜拉席恩' }, { t: '（风息堡公爵，也自立为王）。史坦尼斯是三人中最具合法继承权的，但最终在临冬城之战中失败身亡。\n\n剧中，拜拉席恩家族的血脉几乎断绝——劳勃的所有"子女"实为瑟曦与詹姆所生。但劳勃的私生子詹德利（剧中由戴佛斯·席渥斯扶持）最终被丹妮莉丝合法化，成为风息堡公爵，拜拉席恩家族得以延续。' }
        ],
        notableEvents: [
          { year: '征服元年', event: '奥里斯·拜拉席恩杀死风暴国王，创立拜拉席恩家族' },
          { year: '283 AC', event: '劳勃叛乱：劳勃击败雷加于三叉戟河，成为新国王' },
          { year: '298 AC', event: '劳勃去世，引发继承权危机——"五王之战"爆发' },
          { year: '299 AC', event: '蓝礼·拜拉席恩被暗影刺杀；史坦尼斯进攻君临失败于黑水河' }
        ],
        members: [
          '劳勃·拜拉席恩 — 维斯特洛国王（283-298 AC）',
          '史坦尼斯·拜拉席恩 — 龙石岛公爵，自立为王',
          '蓝礼·拜拉席恩 — 风息堡公爵，自立为王',
          '詹德利 — 劳勃的私生子（剧中合法化为拜拉席恩）'
        ],
        vassalHouses: ['卡伦家族', '史文家族', '庞洛斯家族', '塔斯家族', '席渥斯家族'],
        sigilColor: '#f0c040'
      },

      // ═══════════ 葛雷乔伊家族 ═══════════
      'house_greyjoy': {
        _id: 'house_greyjoy',
        name: '葛雷乔伊家族',
        sigil: '🐙', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Greyjoy.jpg',
        sigilName: '海怪',
        words: '强取胜于苦耕',
        region: '铁群岛',
        seat: '派克城',
        overlord: '铁群岛之王',
        coatOfArms: '黑底金色海怪',
        religion: { name: '淹神信仰', icon: '🌊', desc: '葛雷乔伊家族与铁民信奉淹神——一位与风暴神永恒争斗的海洋之神。淹神的格言是"逝者不死，必将再起，其势更烈"。信徒通过溺水仪式被"杀死"后"复活"来完成洗礼。铁民相信他们在海上掠夺并非罪恶，而是淹神赐予的权利——"强取胜于苦耕"正是这一信仰的体现。' },
        history: [
          { t: '葛雷乔伊家族统治' }, { t: '铁群岛', l: 'search:铁群岛' }, { t: '，是' }, { t: '铁民', l: 'search:铁民' }, { t: '的领导者。铁民遵循"' }, { t: '古道', l: 'search:古道' }, { t: '——以掠夺为生，信奉' }, { t: '淹神', l: 'search:淹神' }, { t: '，鄙视农业和贸易。在' }, { t: '葛雷乔伊叛乱', l: 'search:葛雷乔伊叛乱' }, { t: '（' }, { t: '巴隆·葛雷乔伊', l: 'search:巴隆·葛雷乔伊' }, { t: '第一次自立为王）被平定后，' }, { t: '席恩·葛雷乔伊', l: 'search:席恩·葛雷乔伊' }, { t: '被送到临冬城作为艾德·史塔克的养子/人质。\n\n五王之战期间，巴隆再次自立，席恩背叛史塔克家族夺取临冬城但很快失去。巴隆死后，' }, { t: '攸伦·葛雷乔伊', l: 'search:攸伦·葛雷乔伊' }, { t: '在选王会上当选为王。阿莎·葛雷乔伊（剧中名雅拉）和席恩在剧中与丹妮莉丝结盟。席恩在长夜之战中为保护布兰·史塔克牺牲，完成了他的救赎之路。' }
        ],
        notableEvents: [
          { year: '289 AC', event: '葛雷乔伊叛乱：巴隆·葛雷乔伊首次自立为王，被平定' },
          { year: '299 AC', event: '席恩·葛雷乔伊背叛史塔克，夺取临冬城，随后被拉姆斯·雪诺俘虏折磨' },
          { year: '300 AC', event: '攸伦·葛雷乔伊在选王会上当选为铁群岛之王' }
        ],
        members: [
          '巴隆·葛雷乔伊 — 铁群岛大王',
          '席恩·葛雷乔伊 — 巴隆的独子，充满悲剧的救赎者',
          '阿莎·葛雷乔伊（雅拉）— 巴隆的女儿，铁群岛继承人',
          '攸伦·葛雷乔伊 — 巴隆的弟弟，"鸦眼"，疯狂的海盗王'
        ],
        vassalHouses: ['哈尔洛家族', '古柏勒家族', '布莱克泰斯家族', '奥克伍家族'],
        sigilColor: '#808080'
      },

      // ═══════════ 艾林家族 ═══════════
      'house_arryn': {
        _id: 'house_arryn',
        name: '艾林家族',
        sigil: '🦅', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Arryn.jpg',
        sigilName: '新月猎鹰',
        words: '高如荣誉',
        region: '谷地',
        seat: '鹰巢城',
        overlord: '谷地守护',
        coatOfArms: '白底天蓝色新月猎鹰',
        religion: { name: '七神信仰', icon: '⭐', desc: '艾林家族作为最古老的安达尔贵族之一，是七神信仰在西境的坚定守护者。鹰巢城的高塔之中设有供奉七神的圣堂。然而莱莎·徒利在丈夫琼恩·艾林死后变得偏执迷信，溺爱儿子劳勃·艾林，其行为偏离了传统信仰的理性。' },
        history: [
          { t: '艾林家族是' }, { t: '谷地', l: 'search:谷地' }, { t: '的统治家族，是' }, { t: '安达尔人', l: 'search:安达尔人' }, { t: '贵族中最古老和最纯正的一支。他们以' }, { t: '鹰巢城', l: 'search:鹰巢城' }, { t: '——建在巨人之枪山巅的白色城堡——统治谷地。由于鹰巢城在冬季无法居住，艾林家族每年冬季会迁往' }, { t: '月门', l: 'search:月门' }, { t: '堡。\n\n' }, { t: '琼恩·艾林', l: 'search:琼恩·艾林' }, { t: '是劳勃·拜拉席恩和艾德·史塔克的养父，在' }, { t: '劳勃叛乱', l: 'search:劳勃叛乱' }, { t: '中率先举起反旗。后来成为劳勃的国王之手。他的死亡（被妻子' }, { t: '莱莎·徒利', l: 'search:莱莎·徒利' }, { t: '在' }, { t: '小指头', l: 'search:小指头' }, { t: '的指使下毒杀）触发了五王之战。\n\n莱莎死后，培提尔·贝里席（小指头）以劳勃·艾林小公爵的保护人身份实际控制谷地。最终（剧中）培提尔被处决后，劳勃·艾林公爵宣誓效忠北境之王。' }
        ],
        notableEvents: [
          { year: '征服前', event: '艾林家族以"谷地之王"身份统治数千年' },
          { year: '282 AC', event: '琼恩·艾林拒绝交出劳勃和艾德，率先反抗疯王' },
          { year: '298 AC', event: '琼恩·艾林被毒杀，成为五王之战导火索之一' }
        ],
        members: [
          '琼恩·艾林 — 谷地公爵，劳勃和艾德的养父',
          '莱莎·徒利（莱莎·艾林）— 琼恩的第三任妻子',
          '劳勃·艾林 — 琼恩和莱莎的幼子，体弱多病'
        ],
        vassalHouses: ['罗伊斯家族', '科布瑞家族', '韦伍德家族', '贝尔摩家族', '杭特家族', '雷德佛家族'],
        sigilColor: '#4a90d9'
      },

      // ═══════════ 马泰尔家族 ═══════════
      'house_martell': {
        _id: 'house_martell',
        name: '马泰尔家族',
        sigil: '☀️', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Martell.jpg',
        sigilName: '长枪贯日',
        words: '不屈不挠',
        region: '多恩',
        seat: '阳戟城',
        overlord: '多恩亲王',
        coatOfArms: '橙底红色长枪贯穿金色太阳',
        religion: { name: '七神信仰（含洛伊拿传统）', icon: '☀️', desc: '马泰尔家族与多恩人信仰七神，但融合了洛伊拿人的母系传统。多恩是七国中唯一承认男女平等继承权的地区。洛伊拿的母神洛恩与七神中的圣母并列崇拜，体现了多恩文化中独特的包容性。' },
        history: [
          { t: '马泰尔家族是' }, { t: '多恩', l: 'search:多恩' }, { t: '的统治者，是唯一没有被' }, { t: '征服者伊耿', l: 'search:征服者伊耿' }, { t: '用龙火征服的王国——多恩人通过游击战术击退了' }, { t: '坦格利安', l: 'house:house_targaryen' }, { t: '的所有入侵。一个半世纪后，多恩通过联姻（马隆·马泰尔亲王迎娶丹妮莉丝·坦格利安公主）和平并入七国。\n\n' }, { t: '伊莉亚·马泰尔', l: 'search:伊莉亚·马泰尔' }, { t: '嫁给雷加·坦格利安，但在君临沦陷时被格雷果·克里冈奸杀，她的两个孩子也被杀害。道朗·马泰尔亲王多年来暗中策划复仇，签署了让韦赛里斯·坦格利安迎娶女儿亚莲恩的秘密婚约。\n\n' }, { t: '奥柏伦·马泰尔', l: 'search:奥柏伦·马泰尔' }, { t: '（"' }, { t: '红毒蛇', l: 'search:红毒蛇' }, { t: '）在与格雷果·克里冈的比武审判中身亡，但在死前给' }, { t: '魔山', l: 'search:魔山' }, { t: '下了慢性剧毒。书中多恩的复仇计划更为复杂和深远——道朗亲王最终揭露他的计划是支持雷加之子伊耿（小格里芬/年轻格里芬）。剧中多恩故事线被大幅简化。' }
        ],
        notableEvents: [
          { year: '征服时期', event: '多恩是唯一没有被龙火征服的维斯特洛王国' },
          { year: '197 AC', event: '多恩通过联姻和平并入七国' },
          { year: '283 AC', event: '伊莉亚·马泰尔和她的孩子被兰尼斯特军队杀害' },
          { year: '300 AC', event: '奥柏伦·马泰尔在比武审判中被魔山杀害' }
        ],
        members: [
          '道朗·马泰尔 — 多恩亲王',
          '奥柏伦·马泰尔 — "红毒蛇"，道朗的弟弟',
          '伊莉亚·马泰尔 — 道朗的妹妹，雷加·坦格利安的妻子',
          '亚莲恩·马泰尔 — 道朗的长女和多恩继承人（书中）',
          '昆廷·马泰尔 — 道朗的长子（书中）',
          '沙蛇们 — 奥柏伦的八个私生女'
        ],
        vassalHouses: ['戴恩家族', '伊伦伍德家族', '佛勒家族', '托兰家族', '乌娄家族'],
        sigilColor: '#d4744a'
      },

      // ═══════════ 徒利家族 ═══════════
      'house_tully': {
        _id: 'house_tully',
        name: '徒利家族',
        sigil: '🐟', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Tully.jpg',
        sigilName: '银色鳟鱼',
        words: '家族、责任、荣誉',
        region: '河间地',
        seat: '奔流城',
        overlord: '河间地守护',
        coatOfArms: '蓝红条纹底银色鳟鱼',
        religion: { name: '七神信仰', icon: '⭐', desc: '徒利家族信仰七神，遵循安达尔人带来的传统。其族语中的"家族·责任·荣誉"体现了七神信仰中天父的正义与圣母的慈悲精神。凯特琳·徒利在临冬城设有一座小圣堂供奉七神。' },
        history: [
          { t: '徒利家族是' }, { t: '河间地', l: 'search:河间地' }, { t: '的统治家族，' }, { t: '奔流城', l: 'search:奔流城' }, { t: '的主人。在征服战争期间，艾德敏·徒利率先支持征服者伊耿，因此获得了河间地守护的头衔——此前河间地由铁群岛的霍尔家族统治。\n\n霍斯特·徒利公爵在' }, { t: '劳勃叛乱', l: 'search:劳勃叛乱' }, { t: '中率先举起反旗——两个女儿' }, { t: '凯特琳·徒利', l: 'search:凯特琳·徒利' }, { t: '嫁给' }, { t: '艾德·史塔克', l: 'char:char_eddard_stark' }, { t: '、莱莎嫁给琼恩·艾林，建立了鹰鹿狼鱼联盟。五王之战期间，徒利家族支持罗柏·史塔克。\n\n' }, { t: '红色婚礼', l: 'event:red_wedding' }, { t: '后，佛雷家族获得了奔流城的统治权。黑鱼布林登·徒利逃出奔流城（书中）/奔流城最终被詹姆·兰尼斯特收降（书中）。' }, { t: '艾德慕·徒利', l: 'search:艾德慕·徒利' }, { t: '被兰尼斯特囚禁多年。最终（剧中）艾德慕重新成为奔流城公爵。' }
        ],
        notableEvents: [
          { year: '征服元年', event: '艾德敏·徒利支持征服者伊耿，被任命为河间地守护' },
          { year: '282 AC', event: '霍斯特·徒利通过婚姻联盟支持劳勃叛乱' },
          { year: '299 AC', event: '红色婚礼：凯特琳·徒利被杀，徒利家族失去奔流城' }
        ],
        members: [
          '霍斯特·徒利 — 奔流城公爵',
          '凯特琳·徒利 — 霍斯特的长女，艾德·史塔克的妻子',
          '莱莎·徒利 — 霍斯特的次女，琼恩·艾林的妻子',
          '艾德慕·徒利 — 霍斯特的独子，奔流城继承人',
          '布林登·徒利（黑鱼）— 霍斯特的弟弟，著名骑士'
        ],
        vassalHouses: ['佛雷家族', '布雷肯家族', '布莱伍德家族', '莫利斯特家族', '派柏家族', '凡斯家族'],
        sigilColor: '#4a7a9c'
      },

      // ═══════════ 提利尔家族 ═══════════
      'house_tyrell': {
        _id: 'house_tyrell',
        name: '提利尔家族',
        sigil: '🌹', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Tyrell.jpg',
        sigilName: '金色玫瑰',
        words: '生生不息',
        region: '河湾地',
        seat: '高庭',
        overlord: '河湾地守护',
        coatOfArms: '绿底金色玫瑰',
        religion: { name: '七神信仰', icon: '⭐', desc: '提利尔家族信仰七神。河湾地是维斯特洛骑士精神的发源地，七神信仰中的"战士"在此受到特别崇敬——每位骑士都以战士之名起誓。提利尔家族在宗教上较为温和，倾向于将信仰作为社会礼仪而非狂热崇拜。' },
        history: [
          { t: '提利尔家族是' }, { t: '河湾地', l: 'search:河湾地' }, { t: '的统治家族，' }, { t: '高庭', l: 'search:高庭' }, { t: '的主人。他们曾是' }, { t: '园丁家族', l: 'search:园丁家族' }, { t: '（河湾地原本的王族）的管家。在征服战争期间，末代园丁王孟恩九世在' }, { t: '怒火燎原', l: 'search:怒火燎原' }, { t: '战役中被龙火烧死，提利尔家族向' }, { t: '征服者伊耿', l: 'search:征服者伊耿' }, { t: '献出高庭，因此获封河湾地守护。\n\n提利尔家族通过联姻和外交不断增强势力。在五王之战期间，他们先是支持' }, { t: '蓝礼·拜拉席恩', l: 'search:蓝礼·拜拉席恩' }, { t: '，蓝礼死后又通过' }, { t: '玛格丽·提利尔', l: 'search:玛格丽·提利尔' }, { t: '与乔佛里（后来是托曼）的联姻投靠兰尼斯特。' }, { t: '奥莲娜·雷德温', l: 'search:奥莲娜·雷德温' }, { t: '（"' }, { t: '荆棘女王', l: 'search:荆棘女王' }, { t: '）是家族的真正操纵者。\n\n剧中，玛格丽、洛拉斯和梅斯·提利尔在' }, { t: '贝勒大圣堂', l: 'search:贝勒大圣堂' }, { t: '爆炸中被瑟曦杀害。家族在高庭的统治权被兰尼斯特军队终结。书中提利尔家族的故事线尚未完结。' }
        ],
        notableEvents: [
          { year: '征服元年', event: '哈兰·提利尔向征服者伊耿献出高庭，获封河湾地守护' },
          { year: '299-300 AC', event: '五王之战：提利尔家族灵活转换阵营，通过联姻获取最大利益' },
          { year: '剧中', event: '贝勒大圣堂爆炸：玛格丽、洛拉斯和梅斯·提利尔被瑟曦杀害' }
        ],
        members: [
          '梅斯·提利尔 — 高庭公爵，河湾地守护',
          '奥莲娜·雷德温（荆棘女王）— 梅斯的母亲，家族真正掌权者',
          '玛格丽·提利尔 — 梅斯的女儿，三次成为王后',
          '洛拉斯·提利尔 — 梅斯的儿子，"百花骑士"',
          '加兰·提利尔 — 梅斯的次子（书中），"勇武的加兰"',
          '维拉斯·提利尔 — 梅斯的长子，高庭继承人（书中，腿部残疾）'
        ],
        vassalHouses: ['海塔尔家族', '雷德温家族', '佛罗伦家族', '塔利家族', '罗宛家族', '奥克赫特家族'],
        sigilColor: '#4a9c4a'
      },
      'house_velaryon': {
        _id: 'house_velaryon', name: '瓦列利安家族',
        sigil: '🌊', img: 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/House_Velaryon2.jpg', sigilName: '海马',
        words: '古老·忠誠·勇毅', region: '王领', seat: '潮头岛（高潮城）', overlord: '坦格利安家族',
        coatOfArms: '海绿底色上的银色海马',
        religion: { name: '七神信仰（瓦雷利亚渊源）', icon: '🌊', desc: '瓦列利安家族与坦格利安家族同出瓦雷利亚，原本信仰瓦雷利亚众神。定居潮头岛后改信七神以融入维斯特洛。然而海洋对他们的意义超越一切宗教——"海蛇"科利斯曾说他信仰的是"风、潮汐与地平线"。' },
        history: [
          { t: '瓦列利安家族是来自' }, { t: '瓦雷利亚', l: 'search:瓦雷利亚' }, { t: '自由堡垒的古老家族，其历史甚至比坦格利安家族更为悠久。他们早在坦格利安征服维斯特洛之前就已经定居于黑水湾的' }, { t: '潮头岛', l: 'search:潮头岛' }, { t: '。与坦格利安家族一样，瓦列利安家族拥有银金色头发和紫色眼眸的瓦雷利亚特征。\n\n在' }, { t: '血龙狂舞', l: 'event:血龙狂舞' }, { t: '时期，' }, { t: '海蛇', l: 'search:海蛇' }, { t: '科利斯·瓦列利安', l: 'search:科利斯·瓦列利安' }, { t: '是' }, { t: '雷妮拉·坦格利安', l: 'search:雷妮拉·坦格利安' }, { t: '（' }, { t: '黑党', l: 'search:黑党' }, { t: '）最重要的支持者。他的舰队封锁了黑水湾，切断了君临的海上补给。瓦列利安家族为雷妮拉提供了海军、财富和政治支持。\n\n科利斯·瓦列利安进行了九次著名的远航，到达过厄斯索斯的尽头、千岛群岛、阴影之地旁的亚夏。他因此获得了"海蛇"的称号，并积累了维斯特洛史上最大的财富之一。' }
        ],
        notableEvents: [
          { year: '征服前', event: '瓦列利安家族从瓦雷利亚迁徙至潮头岛定居' },
          { year: '129-131 AC', event: '血龙狂舞：海蛇科利斯率瓦列利安舰队支持雷妮拉·坦格利安' },
          { year: '剧中', event: '剧中瓦列利安家族被简化处理，科利斯·瓦列利安（海蛇）出现在《龙之家族》中' }
        ],
        members: [
          '科利斯·瓦列利安（海蛇）— 潮头岛伯爵，维斯特洛最伟大的航海家',
          '雷妮丝·坦格利安 — 科利斯之妻，骑乘母龙梅丽亚斯',
          '兰娜尔·瓦列利安 — 科利斯之女，骑乘瓦格哈尔',
          '兰尼诺·瓦列利安 — 科利斯之子，雷妮拉·坦格利安的第一任丈夫',
          '亚当·瓦列利安 — 私生子出身，血龙狂舞中的龙骑士（骑乘海烟）'
        ],
        vassalHouses: ['潮头岛小贵族'],
        sigilColor: '#3cb4b4'
      }
    };

    // 如果请求的是已定义家族
    if (houses[id]) return houses[id];

    // 返回未定义家族的通用数据结构
    // 从本地家族列表尝试匹配基础信息
    return null;
  },

  // 跳转角色详情
  onPreviewTree() {
    const url = this.data.house.familyTree;
    if (url) wx.previewImage({ urls: [url], current: url });
  },

  onCharacterTap(e) {
    const characterId = e.currentTarget.dataset.id;
    if (characterId) {
      wx.navigateTo({
        url: `/pages/character-detail/character-detail?id=${characterId}`
      });
    }
  },

  // 超链接词条跳转
  // 点击重大事件——匹配数据源
  onNotableEventTap(e) {
    const text = e.currentTarget.dataset.event;
    if (!text) return;
    // 匹配事件名中的关键词
    const matched = EVENTS.find(ev => text.includes(ev.name) || ev.name.includes(text.substring(0, 4)));
    if (matched) {
      wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${matched._id}` });
    } else {
      wx.navigateTo({ url: `/pages/search/search?keyword=${encodeURIComponent(text.substring(0, 8))}` });
    }
  },

  onWikiLink(e) {
    const target = e.currentTarget.dataset.target;
    if (!target) return;
    const [type, value] = target.split(':');
    switch (type) {
      case 'search':
        wx.navigateTo({ url: `/pages/search/search?keyword=${encodeURIComponent(value)}` });
        break;
      case 'char':
        wx.navigateTo({ url: `/pages/character-detail/character-detail?id=${value}` });
        break;
      case 'house':
        wx.navigateTo({ url: `/pages/house-detail/house-detail?id=${value}` });
        break;
      case 'article':
        wx.navigateTo({ url: `/pages/wiki-article/wiki-article?topic=${encodeURIComponent(value)}` });
        break;
      case 'event':
        wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${value.startsWith('evt_') ? value : 'evt_' + value}` });
        break;
      default:
        wx.navigateTo({ url: `/pages/search/search?keyword=${encodeURIComponent(target)}` });
    }
  }
});
