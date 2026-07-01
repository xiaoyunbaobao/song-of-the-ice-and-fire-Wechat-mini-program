// 云函数：seedData
// 初始化数据库种子数据：10个角色、9个大家族、10个关键事件

const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const result = {
    charactersInserted: 0,
    housesInserted: 0,
    eventsInserted: 0
  };

  // ========== 种子角色数据 (10+) ==========
  const characters = [
    {
      name: '琼恩·雪诺',
      nameEn: 'Jon Snow',
      aliases: ['雪诺大人', '白狼', '伊耿·坦格利安'],
      titles: ['守夜人总司令', '北境之王'],
      houseId: 'house_stark',
      status: 'alive',
      gender: 'male',
      culture: '北境人',
      description: '艾德·史塔克的私生子（实际为雷加·坦格利安与莱安娜·史塔克之子），守夜人第998任总司令，后成为北境之王。拥有一只名为白灵的冰原狼。',
      sigil: '冰原狼',
      words: '凛冬将至',
      tags: ['史塔克', '守夜人', '北境']
    },
    {
      name: '丹妮莉丝·坦格利安',
      nameEn: 'Daenerys Targaryen',
      aliases: ['龙之母', '卡丽熙', '弥林女王', '风暴降生', '不焚者'],
      titles: ['安达尔人和先民的女王', '龙之母', '弥林女王'],
      houseId: 'house_targaryen',
      status: 'alive',
      gender: 'female',
      culture: '瓦雷利亚',
      description: '坦格利安王朝末代公主，在厄斯索斯大陆孵化三条龙并征服多座城市。目标是夺回铁王座。',
      sigil: '三头龙',
      words: '血火同源',
      tags: ['坦格利安', '龙', '厄斯索斯']
    },
    {
      name: '提利昂·兰尼斯特',
      nameEn: 'Tyrion Lannister',
      aliases: ['小恶魔', '半人'],
      titles: ['女王之手', '凯岩城公爵'],
      houseId: 'house_lannister',
      status: 'alive',
      gender: 'male',
      culture: '西境人',
      description: '泰温·兰尼斯特的侏儒儿子，才智过人但常遭家族歧视。先后担任乔佛里国王的首相和丹妮莉丝女王的首相。',
      sigil: '金色雄狮',
      words: '听我怒吼',
      tags: ['兰尼斯特', '御前议会']
    },
    {
      name: '艾莉亚·史塔克',
      nameEn: 'Arya Stark',
      aliases: ['马脸', '无名之辈', '阿莉'],
      titles: [],
      houseId: 'house_stark',
      status: 'alive',
      gender: 'female',
      culture: '北境人',
      description: '艾德与凯特琳的小女儿，在无面者组织受训成为杀手。手握缝衣针，怀有复仇名单。',
      sigil: '冰原狼',
      words: '凛冬将至',
      tags: ['史塔克', '无面者', '北境']
    },
    {
      name: '珊莎·史塔克',
      nameEn: 'Sansa Stark',
      aliases: ['小指头的私生女', '阿莲·石东'],
      titles: ['临冬城夫人', '北境女王'],
      houseId: 'house_stark',
      status: 'alive',
      gender: 'female',
      culture: '北境人',
      description: '艾德与凯特琳的长女，经历君临和人质生涯后成长为政治人物。最终成为北境独立女王。',
      sigil: '冰原狼',
      words: '凛冬将至',
      tags: ['史塔克', '北境', '君临']
    },
    {
      name: '布兰·史塔克',
      nameEn: 'Brandon Stark',
      aliases: ['残废布兰', '三眼乌鸦', '绿先知'],
      titles: ['三眼乌鸦', '维斯特洛国王'],
      houseId: 'house_stark',
      status: 'alive',
      gender: 'male',
      culture: '北境人',
      description: '艾德与凯特琳的次子，被詹姆推下高塔后失去双腿。继承了绿先知的能力，成为三眼乌鸦。最终被选为六国国王。',
      sigil: '冰原狼',
      words: '凛冬将至',
      tags: ['史塔克', '绿先知', '北境']
    },
    {
      name: '瑟曦·兰尼斯特',
      nameEn: 'Cersei Lannister',
      aliases: ['摄政太后'],
      titles: ['维斯特洛女王', '凯岩城女公爵'],
      houseId: 'house_lannister',
      status: 'deceased',
      gender: 'female',
      culture: '西境人',
      description: '劳勃·拜拉席恩的王后，实际为其三子之母。野心勃勃且冷酷无情，在贝勒大圣堂事件后自立为王。',
      sigil: '金色雄狮',
      words: '听我怒吼',
      tags: ['兰尼斯特', '君临', '铁王座']
    },
    {
      name: '詹姆·兰尼斯特',
      nameEn: 'Jaime Lannister',
      aliases: ['弑君者'],
      titles: ['御林铁卫队长', '凯岩城继承人'],
      houseId: 'house_lannister',
      status: 'alive',
      gender: 'male',
      culture: '西境人',
      description: '御林铁卫成员，因刺杀疯王伊里斯二世而被称为"弑君者"。在失去右手后重塑自我。',
      sigil: '金色雄狮',
      words: '听我怒吼',
      tags: ['兰尼斯特', '御林铁卫']
    },
    {
      name: '艾德·史塔克',
      nameEn: 'Eddard Stark',
      aliases: ['奈德'],
      titles: ['临冬城公爵', '北境守护', '御前首相'],
      houseId: 'house_stark',
      status: 'deceased',
      gender: 'male',
      culture: '北境人',
      description: '临冬城公爵，北境守护。受劳勃之邀担任御前首相，在揭开瑟曦的秘密后被捕并被乔佛里下令处决。',
      sigil: '冰原狼',
      words: '凛冬将至',
      tags: ['史塔克', '北境', '君临']
    },
    {
      name: '劳勃·拜拉席恩',
      nameEn: 'Robert Baratheon',
      aliases: ['篡夺者', '雄鹿王'],
      titles: ['安达尔人及先民之王', '七国守护者'],
      houseId: 'house_baratheon',
      status: 'deceased',
      gender: 'male',
      culture: '风暴地',
      description: '率军推翻坦格利安王朝并登基为七国之王。英勇善战但荒于政事，在一次狩猎事故中被野猪所伤而亡。',
      sigil: '宝冠雄鹿',
      words: '怒火燎原',
      tags: ['拜拉席恩', '铁王座', '君临']
    },
    {
      name: '培提尔·贝里席',
      nameEn: 'Petyr Baelish',
      aliases: ['小指头'],
      titles: ['赫伦堡公爵', '谷地守护者'],
      houseId: 'house_baelish',
      status: 'deceased',
      gender: 'male',
      culture: '河间地',
      description: '御前会议财政大臣，出身卑微但才智超群。凭借权谋操纵混乱步步高升，是五王之战背后最危险的棋手。',
      sigil: '仿声鸟',
      words: '',
      tags: ['贝里席', '君临', '权谋']
    },
    {
      name: '瓦里斯',
      nameEn: 'Varys',
      aliases: ['八爪蜘蛛', '太监'],
      titles: ['情报总管'],
      houseId: null,
      status: 'alive',
      gender: 'male',
      culture: '里斯',
      description: '七国的情报总管，拥有遍布各地的''小小鸟儿''谍报网。表面上效忠铁王座，实则一心为王国利益行动。',
      sigil: '',
      words: '',
      tags: ['君临', '情报', '御前议会']
    }
  ];

  // ========== 种子家族数据 (9大+1小) ==========
  const houses = [
    {
      _id: 'house_stark',
      name: '史塔克家族',
      nameEn: 'House Stark',
      sigil: '冰原狼',
      words: '凛冬将至',
      wordsEn: 'Winter is Coming',
      region: '北境',
      seat: '临冬城',
      description: '史塔克家族已统治北境八千年，是维斯特洛最古老的家族之一。他们在北境被称为"北境之王"的世系。家族城堡临冬城建于温泉之上。',
      overlord: null,
      founded: '英雄纪元',
      founder: '筑城者布兰登',
      tags: ['北境', '先民', '旧神']
    },
    {
      _id: 'house_lannister',
      name: '兰尼斯特家族',
      nameEn: 'House Lannister',
      sigil: '金色雄狮',
      words: '听我怒吼',
      wordsEn: 'Hear Me Roar',
      region: '西境',
      seat: '凯岩城',
      description: '西境守护家族，是维斯特洛最富有的家族。他们的城堡凯岩城是挖空一座巨石而建。家族掌控着凯岩城下取之不竭的金矿。',
      overlord: null,
      founded: '安达尔人入侵时期',
      founder: '机灵的兰恩',
      tags: ['西境', '安达尔人', '七神']
    },
    {
      _id: 'house_targaryen',
      name: '坦格利安家族',
      nameEn: 'House Targaryen',
      sigil: '三头龙',
      words: '血火同源',
      wordsEn: 'Fire and Blood',
      region: '王领',
      seat: '龙石岛',
      description: '来自瓦雷利亚自由堡垒的龙族血脉家族。伊耿一世征服维斯特洛后统治近三百年。因篡夺者战争几乎灭族。',
      overlord: null,
      founded: '征服战争(1 AC)',
      founder: '伊耿一世·征服者',
      tags: ['龙', '王领', '瓦雷利亚']
    },
    {
      _id: 'house_baratheon',
      name: '拜拉席恩家族',
      nameEn: 'House Baratheon',
      sigil: '宝冠雄鹿',
      words: '怒火燎原',
      wordsEn: 'Ours is the Fury',
      region: '风暴地',
      seat: '风息堡',
      description: '劳勃·拜拉席恩在篡夺者战争后夺取了铁王座。拜拉席恩家族是征服者伊耿的私生子兄弟奥里斯的后代，拥有坦格利安血统。',
      overlord: null,
      founded: '征服战争',
      founder: '奥里斯·拜拉席恩',
      tags: ['风暴地', '铁王座']
    },
    {
      _id: 'house_arryn',
      name: '艾林家族',
      nameEn: 'House Arryn',
      sigil: '新月猎鹰',
      words: '高如荣誉',
      wordsEn: 'As High as Honor',
      region: '谷地',
      seat: '鹰巢城',
      description: '统治艾林谷的古老家族，居住在易守难攻的鹰巢城。琼恩·艾林曾是劳勃和艾德的养父和导师。',
      overlord: null,
      founded: '安达尔人入侵',
      founder: '阿提斯·艾林爵士',
      tags: ['谷地', '安达尔人', '七神']
    },
    {
      _id: 'house_tully',
      name: '徒利家族',
      nameEn: 'House Tully',
      sigil: '银色鳟鱼',
      words: '家族·责任·荣誉',
      wordsEn: 'Family, Duty, Honor',
      region: '河间地',
      seat: '奔流城',
      description: '河间地守护家族。艾德·史塔克的妻子凯特琳即出身于此。徒利家族在五王之战中选择支持北境。',
      overlord: null,
      founded: '征服战争前期',
      founder: null,
      tags: ['河间地', '先民']
    },
    {
      _id: 'house_tyrell',
      name: '提利尔家族',
      nameEn: 'House Tyrell',
      sigil: '金玫瑰',
      words: '生生不息',
      wordsEn: 'Growing Strong',
      region: '河湾地',
      seat: '高庭',
      description: '河湾地守护家族，维斯特洛第二大富裕的家族。以精妙的宫廷权术和提利尔玫瑰闻名。',
      overlord: null,
      founded: '征服战争',
      founder: '哈兰·提利尔爵士',
      tags: ['河湾地', '安达尔人', '七神']
    },
    {
      _id: 'house_martell',
      name: '马泰尔家族',
      nameEn: 'House Martell',
      sigil: '长枪贯日',
      words: '不屈不挠',
      wordsEn: 'Unbowed, Unbent, Unbroken',
      region: '多恩',
      seat: '阳戟城',
      description: '多恩的统治家族，是唯一未被伊耿一世武力征服的地区。多恩通过联姻最终并入七大王国。男女都有平等继承权。',
      overlord: null,
      founded: '安达尔人入侵后期',
      founder: '莫尔甘·马泰尔',
      tags: ['多恩', '洛依拿', '平等继承']
    },
    {
      _id: 'house_greyjoy',
      name: '葛雷乔伊家族',
      nameEn: 'House Greyjoy',
      sigil: '金色海怪',
      words: '强取胜于苦耕',
      wordsEn: 'We Do Not Sow',
      region: '铁群岛',
      seat: '派克城',
      description: '铁群岛的统治家族，铁民的骄傲。葛雷乔伊家族多次发动叛乱寻求独立，践行着"古道"和"付铁金"的传统。',
      overlord: null,
      founded: '英雄纪元',
      founder: '灰海王',
      tags: ['铁群岛', '铁民', '淹神']
    }
  ];

  // ========== 种子事件数据 (10+) ==========
  const events = [
    {
      name: '长夜与黎明之战',
      nameEn: 'The Long Night & The Battle for the Dawn',
      date: '约 8,000 BC',
      era: 'dawn_age',
      eraName: '黎明纪元',
      eraNameEn: 'Dawn Age',
      description: '长达一整代人的寒冬降临，异鬼从永冬之地席卷维斯特洛。在以亚梭尔·亚亥为首的人类与森林之子联合下，黎明之战最终击退了异鬼。此后筑城者布兰登建造了绝境长城。',
      involvedCharacters: ['亚梭尔·亚亥', '最后的英雄', '异鬼'],
      locationName: '维斯特洛全境'
    },
    {
      name: '盟誓',
      nameEn: 'The Pact',
      date: '约 10,000 BC',
      era: 'dawn_age',
      eraName: '黎明纪元',
      eraNameEn: 'Dawn Age',
      description: '先民与森林之子在神眼湖的千面屿签订和平盟约，结束了两千年战争。先民获得平原和海岸，森林之子保留森林，双方共同信奉旧神。',
      involvedCharacters: ['先民', '森林之子', '绿先知'],
      locationName: '神眼湖'
    },
    {
      name: '筑城者布兰登建造绝境长城',
      nameEn: 'Bran the Builder Raises the Wall',
      date: '约 8,000 BC',
      era: 'age_of_heroes',
      eraName: '英雄纪元',
      eraNameEn: 'Age of Heroes',
      description: '传说筑城者布兰登·史塔克在巨人和森林之子的帮助下建造了绝境长城——一道高700英尺、横跨300余英里的冰墙，用以阻挡北方异鬼的入侵。他还建造了临冬城。',
      involvedCharacters: ['筑城者布兰登', '巨人', '森林之子'],
      locationName: '绝境长城 / 临冬城'
    },
    {
      name: '安达尔人入侵',
      nameEn: 'The Andal Invasion',
      date: '约 6,000 - 2,000 BC',
      era: 'andal_invasion',
      eraName: '安达尔人入侵',
      eraNameEn: 'Andal Invasion',
      description: '安达尔人从厄斯索斯大陆横渡狭海入侵维斯特洛，带来了钢铁武器、七神信仰和文字。他们征服了整个南境，但北境史塔克家族在卡林湾成功阻挡了他们。',
      involvedCharacters: ['安达尔人', '阿提斯·艾林', '史塔克家族'],
      locationName: '谷地 / 维斯特洛全境'
    },
    {
      name: '伊耿征服',
      nameEn: 'Aegon\'s Conquest',
      date: '2 BC - 1 AC',
      era: 'targaryen_conquest',
      eraName: '征服战争',
      eraNameEn: 'Targaryen Conquest',
      description: '征服者伊耿一世与其姐妹妻子维桑尼亚和雷妮丝，骑乘三条巨龙登陆维斯特洛，两年间征服了七大王国中的六个（多恩除外），在君临建立坦格利安王朝。',
      involvedCharacters: ['伊耿一世·坦格利安', '维桑尼亚·坦格利安', '雷妮丝·坦格利安', '托伦·史塔克', '贝勒里恩'],
      locationName: '君临 / 维斯特洛全境'
    },
    {
      name: '血龙狂舞',
      nameEn: 'The Dance of the Dragons',
      date: '129 - 131 AC',
      era: 'dance_of_dragons',
      eraName: '血龙狂舞',
      eraNameEn: 'Dance of the Dragons',
      description: '韦赛里斯一世驾崩后，长女雷妮拉与继后之子伊耿二世争夺铁王座，引发坦格利安家族毁灭性的内战。数条龙在自相残杀中死亡，坦格利安家族的力量从此衰退。',
      involvedCharacters: ['雷妮拉·坦格利安', '伊耿二世·坦格利安', '戴蒙·坦格利安', '伊蒙德·坦格利安'],
      locationName: '君临 / 龙石岛 / 神眼湖'
    },
    {
      name: '第一次黑火叛乱',
      nameEn: 'The First Blackfyre Rebellion',
      date: '196 AC',
      era: 'blackfyre_rebellions',
      eraName: '黑火叛乱',
      eraNameEn: 'Blackfyre Rebellions',
      description: '戴蒙·黑火——被合法化的伊耿四世私生子，手持瓦雷利亚钢剑黑火——自称正统王位继承人发动叛乱。红草原之战中戴蒙阵亡，叛乱被镇压。',
      involvedCharacters: ['戴蒙·黑火', '戴伦二世·坦格利安', '血鸦公爵', '寒铁'],
      locationName: '红草原'
    },
    {
      name: '篡夺者战争',
      nameEn: 'Robert\'s Rebellion',
      date: '282 - 283 AC',
      era: 'roberts_rebellion',
      eraName: '篡夺者战争',
      eraNameEn: 'Robert\'s Rebellion',
      description: '雷加·坦格利安"绑架"莱安娜·史塔克引发叛乱。疯王伊里斯杀害瑞卡德和布兰登·史塔克。劳勃·拜拉席恩在三叉戟河杀死雷加，詹姆·兰尼斯特弑杀疯王。劳勃登基为七国之王。',
      involvedCharacters: ['劳勃·拜拉席恩', '艾德·史塔克', '雷加·坦格利安', '伊里斯二世', '莱安娜·史塔克', '詹姆·兰尼斯特'],
      locationName: '三叉戟河 / 君临 / 极乐塔'
    },
    {
      name: '五王之战',
      nameEn: 'The War of the Five Kings',
      date: '298 - 300 AC',
      era: 'war_of_five_kings',
      eraName: '五王之战',
      eraNameEn: 'War of the Five Kings',
      description: '劳勃死后，五位国王争夺维斯特洛：乔佛里·拜拉席恩、史坦尼斯·拜拉席恩、蓝礼·拜拉席恩、罗柏·史塔克（北境之王）和巴隆·葛雷乔伊（铁群岛之王）。北境在血色婚礼中惨败。',
      involvedCharacters: ['罗柏·史塔克', '乔佛里·拜拉席恩', '史坦尼斯·拜拉席恩', '巴隆·葛雷乔伊', '蓝礼·拜拉席恩'],
      locationName: '维斯特洛全境'
    },
    {
      name: '血色婚礼',
      nameEn: 'The Red Wedding',
      date: '299 AC',
      era: 'war_of_five_kings',
      eraName: '五王之战',
      eraNameEn: 'War of the Five Kings',
      description: '罗柏·史塔克与母亲凯特琳在孪河城参加舅舅艾德慕的婚宴时，瓦德·佛雷与卢斯·波顿背弃宾客权利实施大屠杀。罗柏、凯特琳及三千名北境将士身亡。',
      involvedCharacters: ['罗柏·史塔克', '凯特琳·徒利', '瓦德·佛雷', '卢斯·波顿'],
      locationName: '孪河城'
    },
    {
      name: '龙之重生',
      nameEn: 'The Rebirth of Dragons',
      date: '299 AC',
      era: 'main_story',
      eraName: '主线故事',
      eraNameEn: 'The Main Story',
      description: '丹妮莉丝·坦格利安在卓戈卡奥的火葬柴堆中走入烈焰，携带三颗石化的龙蛋。黎明时分她毫发无伤从灰烬中起身，孵化出三条龙——卓耿、雷戈和韦赛里昂。这是近150年来的首批活龙。',
      involvedCharacters: ['丹妮莉丝·坦格利安', '卓戈卡奥', '乔拉·莫尔蒙'],
      locationName: '红色荒原'
    },
    {
      name: '临冬城之战(私生子之战)',
      nameEn: 'The Battle of the Bastards',
      date: '301 AC',
      era: 'main_story',
      eraName: '主线故事',
      eraNameEn: 'The Main Story',
      description: '琼恩·雪诺与珊莎·史塔克为夺回临冬城，与拉姆斯·波顿展开决战。谷地骑士在千钧一发之际赶到战场，北境重归史塔克家族统治。',
      involvedCharacters: ['琼恩·雪诺', '珊莎·史塔克', '拉姆斯·波顿', '培提尔·贝里席'],
      locationName: '临冬城'
    }
  ];

  // ========== 插入数据 ==========
  try {
    // 插入角色
    for (const char of characters) {
      await db.collection('characters').add({ data: char });
      result.charactersInserted++;
    }

    // 插入家族
    for (const house of houses) {
      await db.collection('houses').add({ data: house });
      result.housesInserted++;
    }

    // 插入事件
    for (const event of events) {
      await db.collection('events').add({ data: event });
      result.eventsInserted++;
    }

    return {
      success: true,
      message: '种子数据插入完成',
      data: result,
      total: result.charactersInserted + result.housesInserted + result.eventsInserted
    };

  } catch (err) {
    console.error('seedData error:', err);
    return {
      success: false,
      error: err.message,
      data: result
    };
  }
};
