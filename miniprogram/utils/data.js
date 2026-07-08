/**
 * 数据中心 —— 全站共享数据（唯一数据源）
 * 角色 / 家族 / 事件 / 百科词条 全在这里改
 * character-list.js / search.js 都从此导入
 */
const IMG_H = '/images/houses/';

// ========== 角色（唯一主数据，55人）==========
const CHARACTERS = [
  // === 冰火正传 · 核心 ===
  { _id:'char_eddard_stark',    name:'艾德·史塔克',       aliases:['奈德'],             houseId:'house_stark',     titles:['临冬城公爵','北境守护','国王之手'],              status:'dead',        tags:['史塔克','荣誉','核心角色'],              culture:'北境人' },
  { _id:'char_catelyn_stark',   name:'凯特琳·史塔克',     aliases:['凯特','石心夫人'],  houseId:'house_stark',     titles:['临冬城夫人'],                                    status:'dead',        tags:['史塔克','徒利','石心夫人'],              culture:'河间地人' },
  { _id:'char_robb_stark',      name:'罗柏·史塔克',       aliases:['少狼主','北境之王'],houseId:'house_stark',     titles:['北境之王'],                                      status:'dead',        tags:['史塔克','少狼主','五王之战'],            culture:'北境人' },
  { _id:'char_jon_snow',        name:'琼恩·雪诺',         aliases:['雪诺大人','白狼'],  houseId:'house_stark',     titles:['守夜人总司令','北境之王'],                      status:'resurrected', tags:['守夜人','史塔克','坦格利安','冰原狼','复活','核心角色'], culture:'北境人' },
  { _id:'char_sansa_stark',     name:'珊莎·史塔克',       aliases:['小指头的私生女'],   houseId:'house_stark',     titles:['临冬城夫人','北境女王'],                        status:'alive',       tags:['史塔克','政治','女王','核心角色'],        culture:'北境人' },
  { _id:'char_arya_stark',      name:'艾莉亚·史塔克',     aliases:['马脸','无名之辈'],  houseId:'house_stark',     titles:[],                                                status:'alive',       tags:['史塔克','复仇','无面者','刺客'],          culture:'北境人' },
  { _id:'char_bran_stark',      name:'布兰·史塔克',       aliases:['残废布兰','三眼乌鸦'],houseId:'house_stark',  titles:['三眼乌鸦','六国之王'],                          status:'alive',       tags:['史塔克','绿先知','魔法','国王'],          culture:'北境人' },
  { _id:'char_theon_greyjoy',   name:'席恩·葛雷乔伊',     aliases:['臭佬'],             houseId:'house_greyjoy',   titles:['铁群岛继承人'],                                  status:'dead',        tags:['葛雷乔伊','铁民','救赎'],               culture:'铁民' },
  // === 兰尼斯特 ===
  { _id:'char_tywin_lannister', name:'泰温·兰尼斯特',     aliases:['凯岩之狮'],         houseId:'house_lannister', titles:['凯岩城公爵','西境守护','国王之手'],            status:'dead',        tags:['兰尼斯特','权力','核心角色'],              culture:'西境人' },
  { _id:'char_cersei_lannister',name:'瑟曦·兰尼斯特',     aliases:['摄政太后'],         houseId:'house_lannister', titles:['七大王国女王'],                                    status:'dead',        tags:['兰尼斯特','女王','权力','核心角色'],      culture:'西境人' },
  { _id:'char_jaime_lannister', name:'詹姆·兰尼斯特',     aliases:['弑君者'],           houseId:'house_lannister', titles:['御林铁卫队长','西境守护'],                      status:'dead',        tags:['兰尼斯特','弑君者','御林铁卫','救赎'],    culture:'西境人' },
  { _id:'char_tyrion_lannister',name:'提利昂·兰尼斯特',   aliases:['小恶魔','半人'],    houseId:'house_lannister', titles:['国王之手','财政大臣'],                          status:'alive',       tags:['兰尼斯特','小恶魔','政治','核心角色'],    culture:'西境人' },
  { _id:'char_joffrey',         name:'乔佛里·拜拉席恩',   aliases:[],                   houseId:'house_lannister', titles:['七大王国国王'],                                    status:'dead',        tags:['兰尼斯特','暴君'],                        culture:'西境人' },
  // === 拜拉席恩 ===
  { _id:'char_robert_baratheon',name:'劳勃·拜拉席恩',     aliases:['篡夺者'],           houseId:'house_baratheon', titles:['七大王国国王'],                                    status:'dead',        tags:['拜拉席恩','国王','战士'],                culture:'风暴地人' },
  { _id:'char_stannis',         name:'史坦尼斯·拜拉席恩', aliases:[],                   houseId:'house_baratheon', titles:['龙石岛公爵','合法之王'],                        status:'dead',        tags:['拜拉席恩','光之王','王位'],              culture:'风暴地人' },
  { _id:'char_renly',           name:'蓝礼·拜拉席恩',     aliases:[],                   houseId:'house_baratheon', titles:['风息堡公爵'],                                      status:'dead',        tags:['拜拉席恩'],                              culture:'风暴地人' },
  // === 坦格利安 ===
  { _id:'char_daenerys',        name:'丹妮莉丝·坦格利安', aliases:['龙之母','卡丽熙','弥林女王','风暴降生'], houseId:'house_targaryen', titles:['龙之母','镣铐破除者','弥林女王'],    status:'dead',        tags:['坦格利安','龙','女王','核心角色'],        culture:'瓦雷利亚人' },
  { _id:'char_rhaegar',         name:'雷加·坦格利安',     aliases:['银王子'],           houseId:'house_targaryen', titles:['龙石岛亲王'],                                      status:'dead',        tags:['坦格利安','预言','莱安娜'],              culture:'瓦雷利亚人' },
  { _id:'char_khal_drogo',      name:'卓戈卡奥',           aliases:['大卡奥'],           houseId:null,              titles:['多斯拉克卡奥'],                                   status:'dead',        tags:['多斯拉克','丹妮莉丝'],                   culture:'多斯拉克人' },
  // === 提利尔 ===
  { _id:'char_margaery',        name:'玛格丽·提利尔',     aliases:['小玫瑰'],           houseId:'house_tyrell',    titles:['七大王国女王'],                                    status:'dead',        tags:['提利尔','玫瑰','王后'],                  culture:'河湾地人' },
  { _id:'char_olenna',          name:'奥莲娜·提利尔',     aliases:['荆棘女王'],         houseId:'house_tyrell',    titles:[],                                                status:'dead',        tags:['提利尔','谋略'],                         culture:'河湾地人' },
  // === 马泰尔 ===
  { _id:'char_oberyn',          name:'奥柏伦·马泰尔',     aliases:['红毒蛇'],           houseId:'house_martell',   titles:['多恩亲王'],                                      status:'dead',        tags:['马泰尔','多恩','复仇','毒药'],           culture:'多恩人' },
  { _id:'char_doran',           name:'道朗·马泰尔',       aliases:[],                   houseId:'house_martell',   titles:['多恩亲王'],                                      status:'alive',       tags:['马泰尔','多恩','谋略'],                  culture:'多恩人' },
  // === 葛雷乔伊 ===
  { _id:'char_asha',            name:'阿莎·葛雷乔伊',     aliases:[],                   houseId:'house_greyjoy',   titles:['铁群岛继承人'],                                  status:'alive',       tags:['葛雷乔伊','铁民'],                       culture:'铁民' },
  { _id:'char_euron',           name:'攸伦·葛雷乔伊',     aliases:['鸦眼'],             houseId:'house_greyjoy',   titles:['铁群岛之王'],                                    status:'alive',       tags:['葛雷乔伊','鸦眼','魔法'],                culture:'铁民' },
  { _id:'char_victarion',       name:'维克塔利昂·葛雷乔伊',aliases:[],                  houseId:'house_greyjoy',   titles:['铁舰队司令'],                                    status:'alive',       tags:['葛雷乔伊','铁民'],                       culture:'铁民' },
  // === 守夜人 & 北境 ===
  { _id:'char_samwell',         name:'山姆威尔·塔利',     aliases:['山姆','杀手山姆'],  houseId:'house_tarly',     titles:['守夜人学士'],                                    status:'alive',       tags:['守夜人','塔利','学士','龙晶'],           culture:'河湾地人' },
  { _id:'char_aemon',           name:'伊蒙·坦格利安',     aliases:['伊蒙学士'],         houseId:'house_targaryen', titles:['守夜人学士'],                                    status:'dead',        tags:['坦格利安','守夜人','学士'],              culture:'瓦雷利亚人' },
  { _id:'char_tormund',         name:'托蒙德·巨人克星',   aliases:[],                   houseId:null,              titles:['自由民首领'],                                    status:'alive',       tags:['野人','自由民'],                         culture:'自由民' },
  // === 御林铁卫 & 骑士 ===
  { _id:'char_brienne',         name:'布蕾妮·塔斯',       aliases:['美人布蕾妮'],       houseId:null,              titles:['御林铁卫队长'],                                  status:'alive',       tags:['骑士','荣誉','守誓剑','女性力量'],      culture:'风暴地人' },
  { _id:'char_barristan',       name:'巴利斯坦·赛尔弥',   aliases:['无畏的巴利斯坦'],   houseId:null,              titles:['御林铁卫队长'],                                  status:'dead',        tags:['骑士','御林铁卫','荣誉'],                culture:'多恩人' },
  { _id:'char_sandor',          name:'桑铎·克里冈',       aliases:['猎狗'],             houseId:'house_clegane',   titles:[],                                                status:'unknown',     tags:['克里冈','猎狗','复仇'],                  culture:'西境人' },
  { _id:'char_gregor',          name:'格雷果·克里冈',     aliases:['魔山','劳勃·斯壮'],houseId:'house_clegane',   titles:[],                                                status:'dead',        tags:['克里冈','魔山'],                         culture:'西境人' },
  // === 宫廷 ===
  { _id:'char_varys',           name:'瓦里斯',             aliases:['蜘蛛','八爪蜘蛛'],  houseId:null,              titles:['情报总管'],                                      status:'dead',        tags:['情报','阴谋','太监'],                    culture:'里斯人' },
  { _id:'char_littlefinger',    name:'培提尔·贝里席',     aliases:['小指头'],           houseId:null,              titles:['财政大臣','赫伦堡公爵'],                        status:'dead',        tags:['阴谋','财政','混乱'],                    culture:'谷地人' },
  { _id:'char_davos',           name:'戴佛斯·席渥斯',     aliases:['洋葱骑士'],         houseId:null,              titles:['国王之手'],                                      status:'alive',       tags:['骑士','忠诚'],                           culture:'君临平民' },
  { _id:'char_melisandre',      name:'梅丽珊卓',           aliases:['红袍女'],           houseId:null,              titles:['光之王祭司'],                                    status:'dead',        tags:['光之王','预言','暗影','魔法'],           culture:'亚夏人' },
  { _id:'char_jorah',           name:'乔拉·莫尔蒙',       aliases:['大熊'],             houseId:'house_mormont',   titles:[],                                                status:'dead',        tags:['莫尔蒙','流亡','丹妮莉丝'],             culture:'北境人' },
  // === 拉姆斯 ===
  { _id:'char_ramsay',          name:'拉姆斯·波顿',       aliases:['小剥皮'],           houseId:'house_bolton',    titles:['临冬城公爵'],                                    status:'dead',        tags:['波顿','暴君'],                           culture:'北境人' },

  // ===== 坦格利安开国君主 =====
  { _id:'char_aegon_i',         name:'征服者伊耿',         aliases:['龙王'],             houseId:'house_targaryen', titles:['维斯特洛之王'],                                  status:'dead',        tags:['坦格利安','国王','征服者','贝勒里恩'],  culture:'瓦雷利亚人' },
  { _id:'char_visenya',         name:'维桑尼亚·坦格利安', aliases:[],                   houseId:'house_targaryen', titles:['王后'],                                          status:'dead',        tags:['坦格利安','瓦格哈尔','暗黑姐妹'],      culture:'瓦雷利亚人' },
  { _id:'char_rhaenys_qz',      name:'雷妮丝·坦格利安',   aliases:[],                   houseId:'house_targaryen', titles:['王后'],                                          status:'dead',        tags:['坦格利安','米拉西斯','多恩'],           culture:'瓦雷利亚人' },
  { _id:'char_aenys_i',         name:'伊尼斯一世·坦格利安',aliases:[],                  houseId:'house_targaryen', titles:['维斯特洛之王'],                                  status:'dead',        tags:['坦格利安','国王','软弱'],               culture:'瓦雷利亚人' },
  { _id:'char_maegor',          name:'残酷的梅葛·坦格利安',aliases:['残酷的梅葛'],     houseId:'house_targaryen', titles:['维斯特洛之王'],                                  status:'dead',        tags:['坦格利安','国王','暴君','贝勒里恩'],    culture:'瓦雷利亚人' },
  { _id:'char_jaehaerys_i',     name:'杰赫里斯一世·坦格利安',aliases:['和解者','人瑞王'],houseId:'house_targaryen',titles:['维斯特洛之王'],                                  status:'dead',        tags:['坦格利安','国王','和解者','人瑞王'],    culture:'瓦雷利亚人' },
  { _id:'char_alysanne',        name:'亚莉珊·坦格利安',   aliases:['善后王后'],         houseId:'house_targaryen', titles:['王后'],                                          status:'dead',        tags:['坦格利安','王后','改革'],               culture:'瓦雷利亚人' },
  { _id:'char_barth',           name:'巴斯修士',           aliases:[],                   houseId:null,              titles:['国王之手'],                                      status:'dead',        tags:['七神信仰','学士','改革'],               culture:'君临平民' },

  // ===== 龙之家族 =====
  { _id:'char_rhaenyra',        name:'雷妮拉·坦格利安',   aliases:['王国之光','黑女王'],houseId:'house_targaryen', titles:['龙石岛公主','铁王座宣称者'],                  status:'dead',        tags:['坦格利安','黑党','血龙狂舞'],           culture:'瓦雷利亚人' },
  { _id:'char_daemon',          name:'戴蒙·坦格利安',     aliases:['浪荡王子'],         houseId:'house_targaryen', titles:['都城守备队司令','石阶列岛之王'],              status:'dead',        tags:['坦格利安','黑党','血龙狂舞','科拉克休'],culture:'瓦雷利亚人' },
  { _id:'char_rhaenys_tq',      name:'雷妮丝·坦格利安',   aliases:['无冕女王'],         houseId:'house_targaryen', titles:['公主'],                                            status:'dead',        tags:['坦格利安','黑党','梅丽亚斯'],           culture:'瓦雷利亚人' },
  { _id:'char_viserys_i',       name:'韦赛里斯一世·坦格利安',aliases:['和平者韦赛里斯'],houseId:'house_targaryen', titles:['维斯特洛之王'],                                  status:'dead',        tags:['坦格利安','国王','和平','龙之家族'],     culture:'瓦雷利亚人' },
  { _id:'char_aegon_ii',        name:'伊耿二世·坦格利安', aliases:[],                   houseId:'house_targaryen', titles:['维斯特洛之王'],                                  status:'dead',        tags:['坦格利安','绿党','阳炎','血龙狂舞'],     culture:'瓦雷利亚人' },
  { _id:'char_aemond',          name:'伊蒙德·坦格利安',   aliases:['独眼伊蒙德'],       houseId:'house_targaryen', titles:['王子'],                                            status:'dead',        tags:['坦格利安','绿党','瓦格哈尔','血龙狂舞'],culture:'瓦雷利亚人' },
  { _id:'char_helaena',         name:'海伦娜·坦格利安',   aliases:[],                   houseId:'house_targaryen', titles:['王后'],                                            status:'dead',        tags:['坦格利安','绿党','梦火','预言'],        culture:'瓦雷利亚人' },
  { _id:'char_alicent',         name:'阿莉森·海塔尔',     aliases:[],                   houseId:null,              titles:['王后','绿党领袖'],                               status:'dead',        tags:['海塔尔','绿党','血龙狂舞','王后'],      culture:'河湾地人' },
  { _id:'char_otto',            name:'奥托·海塔尔',       aliases:[],                   houseId:null,              titles:['国王之手'],                                      status:'dead',        tags:['海塔尔','绿党','国王之手'],             culture:'河湾地人' },
  { _id:'char_corlys',          name:'科利斯·瓦列利安',   aliases:['海蛇'],             houseId:'house_velaryon',  titles:['潮头岛伯爵','女王之手'],                        status:'dead',        tags:['瓦列利安','航海','黑党','血龙狂舞'],     culture:'瓦雷利亚人' },
  { _id:'char_criston',         name:'克里斯顿·科尔',     aliases:['拥王者'],           houseId:null,              titles:['御林铁卫队长','国王之手'],                      status:'dead',        tags:['御林铁卫','绿党','拥王者','血龙狂舞'],  culture:'多恩人' },
  { _id:'char_jacaerys',        name:'杰卡里斯·瓦列利安', aliases:['小杰'],             houseId:'house_velaryon',  titles:['龙石岛继承人'],                                  status:'dead',        tags:['瓦列利安','黑党','沃马克斯','血龙狂舞'],culture:'瓦雷利亚人' },

  // ===== 七王国的骑士 =====
  { _id:'char_dunk',            name:'高个邓肯爵士',       aliases:['邓克'],             houseId:null,              titles:['御林铁卫队长'],                                  status:'dead',        tags:['骑士','御林铁卫','平民','邓肯与伊戈'],  culture:'君临平民' },
  { _id:'char_egg',             name:'伊耿五世·坦格利安', aliases:['伊戈','不该成王的国王'],houseId:'house_targaryen',titles:['维斯特洛之王'],                                  status:'dead',        tags:['坦格利安','国王','盛夏厅','邓肯与伊戈'],culture:'瓦雷利亚人' },
  { _id:'char_baelor_breakspear',name:'贝勒·坦格利安',    aliases:['裂颚'],             houseId:'house_targaryen', titles:['龙石岛亲王','国王之手'],                        status:'dead',        tags:['坦格利安','龙石岛亲王','岑树滩'],       culture:'瓦雷利亚人' },
  { _id:'char_maekar',          name:'梅卡·坦格利安',     aliases:[],                   houseId:'house_targaryen', titles:['亲王','后为维斯特洛之王'],                    status:'dead',        tags:['坦格利安','国王','岑树滩'],             culture:'瓦雷利亚人' }
];

// ========== 拼音首字母映射（用于 A-Z 索引）==========
const PINYIN_MAP = {
  char_eddard_stark:'A', char_catelyn_stark:'K', char_robb_stark:'L', char_jon_snow:'Q',
  char_sansa_stark:'S', char_arya_stark:'A', char_bran_stark:'B', char_theon_greyjoy:'X',
  char_tywin_lannister:'T', char_cersei_lannister:'S', char_jaime_lannister:'Z', char_tyrion_lannister:'T',
  char_joffrey:'Q', char_robert_baratheon:'L', char_stannis:'S', char_renly:'L',
  char_daenerys:'D', char_rhaegar:'L', char_khal_drogo:'Z',
  char_margaery:'M', char_olenna:'A', char_oberyn:'A', char_doran:'D',
  char_asha:'A', char_euron:'Y', char_victarion:'W',
  char_samwell:'S', char_aemon:'Y', char_tormund:'T',
  char_brienne:'B', char_barristan:'B', char_sandor:'S', char_gregor:'G',
  char_varys:'W', char_littlefinger:'P', char_davos:'D', char_melisandre:'M', char_jorah:'Q',
  char_ramsay:'L',
  char_aegon_i:'Z', char_visenya:'W', char_rhaenys_qz:'L', char_aenys_i:'Y',
  char_maegor:'C', char_jaehaerys_i:'J', char_alysanne:'Y', char_barth:'B',
  char_rhaenyra:'L', char_daemon:'D', char_rhaenys_tq:'L', char_viserys_i:'W', char_aegon_ii:'Y',
  char_aemond:'Y', char_helaena:'H', char_alicent:'A', char_otto:'A', char_corlys:'K',
  char_criston:'K', char_jacaerys:'J',
  char_dunk:'G', char_egg:'Y', char_baelor_breakspear:'B', char_maekar:'M'
};

// ========== 家族 ==========
const HOUSES = [
  { _id:'house_stark',     name:'史塔克家族',   sigil:'🐺', img:IMG_H+'House_Stark.jpg',       words:'凛冬将至',       region:'北境',   seat:'临冬城',  overlord:'北境之王' },
  { _id:'house_lannister', name:'兰尼斯特家族', sigil:'🦁', img:IMG_H+'House_Lannister.jpg',   words:'听我怒吼',       region:'西境',   seat:'凯岩城',  overlord:'西境守护' },
  { _id:'house_targaryen', name:'坦格利安家族', sigil:'🐉', img:IMG_H+'House_Targaryen.jpg',   words:'血火同源',       region:'王领',   seat:'龙石岛',  overlord:'维斯特洛之主' },
  { _id:'house_baratheon', name:'拜拉席恩家族', sigil:'🦌', img:IMG_H+'Baratheon_DS.jpg',      words:'怒火燎原',       region:'风暴地', seat:'风息堡',  overlord:'风暴地守护' },
  { _id:'house_greyjoy',   name:'葛雷乔伊家族', sigil:'🐙', img:IMG_H+'House_Greyjoy.jpg',     words:'强取胜于苦耕',   region:'铁群岛', seat:'派克城',  overlord:'铁群岛之王' },
  { _id:'house_arryn',     name:'艾林家族',     sigil:'🦅', img:IMG_H+'House_Arryn.jpg',       words:'高如荣誉',       region:'谷地',   seat:'鹰巢城',  overlord:'谷地守护' },
  { _id:'house_martell',   name:'马泰尔家族',   sigil:'☀️', img:IMG_H+'House_Martell.jpg',     words:'不屈不挠',       region:'多恩',   seat:'阳戟城',  overlord:'多恩亲王' },
  { _id:'house_tully',     name:'徒利家族',     sigil:'🐟', img:IMG_H+'House_Tully.jpg',       words:'家族·责任·荣誉', region:'河间地', seat:'奔流城',  overlord:'河间地守护' },
  { _id:'house_tyrell',    name:'提利尔家族',   sigil:'🌹', img:IMG_H+'House_Tyrell.jpg',      words:'生生不息',       region:'河湾地', seat:'高庭',    overlord:'河湾地守护' },
  { _id:'house_velaryon',  name:'瓦列利安家族', sigil:'🌊', img:IMG_H+'House_Velaryon2.jpg',   words:'古老·忠誠·勇毅', region:'王领',   seat:'潮头岛',  overlord:'坦格利安家族' },
  { _id:'house_bolton',    name:'波顿家族',     sigil:'🚩', img:IMG_H+'House_Bolton.jpg',      words:'吾刃锐利',       region:'北境',   seat:'恐怖堡',  overlord:'史塔克家族' },
  { _id:'house_frey',      name:'佛雷家族',     sigil:'🏰', img:IMG_H+'House_Frey.jpg',        words:'无正式族语',     region:'河间地', seat:'孪河城',  overlord:'徒利家族' },
  { _id:'house_mormont',   name:'莫尔蒙家族',   sigil:'🐻', img:IMG_H+'House_Mormont.jpg',     words:'昂首屹立',       region:'北境',   seat:'熊岛',    overlord:'史塔克家族' },
  { _id:'house_tarly',     name:'塔利家族',     sigil:'🏹', img:IMG_H+'Tarly.jpg',             words:'率先冲锋',       region:'河湾地', seat:'角陵',    overlord:'提利尔家族' },
  { _id:'house_reed',      name:'黎德家族',     sigil:'🦎', img:IMG_H+'House_Reed.jpg',        words:'不详',           region:'北境',   seat:'灰水望',  overlord:'史塔克家族' },
  { _id:'house_clegane',   name:'克里冈家族',   sigil:'🐕', img:IMG_H+'House_Clegane.jpg',     words:'无',             region:'西境',   seat:'克里冈堡',overlord:'兰尼斯特家族' }
];

// ========== 事件（战役 & 比武 & 重大历史）==========
const EVENTS = [
  // 征服战争
  { _id:'evt_conquest',       name:'征服战争',           era:'征服战争时期',   related:['house_targaryen'],      desc:'征服者伊耿与姐妹维桑尼亚、雷妮丝率三条龙征服维斯特洛六国。赫伦堡之焚、怒火燎原、托伦降服。多恩是唯一未被征服的王国。' },
  { _id:'evt_field_of_fire',  name:'怒火燎原',           era:'征服战争时期',   related:['house_targaryen'],      desc:'凯岩王罗伦·兰尼斯特与河湾王孟恩·加德纳联军五万五千人对抗坦格利安。伊耿三龙齐出、龙焰焚天——坦格利安史上唯一一次三条龙同时出战。加德纳家族覆灭，兰尼斯特投降。征服战争中规模最大的战役。' },
  { _id:'evt_first_dornish',  name:'第一次多恩战争',     era:'征服战争时期',   related:['house_targaryen','house_martell'], desc:'伊耿一世试图以龙焰征服多恩但失败。雷妮丝王后与龙米拉西斯在狱门堡被弩炮射杀。多恩人拒绝正面战斗——以游击战和暗杀抵抗——七国唯一未被征服的王国。持续近十年，最终伊耿收到一封神秘来信后求和。' },

  // 制度创立
  { _id:'evt_kingsguard',     name:'御林铁卫创立',       era:'征服战争时期',   related:['house_targaryen'],      desc:'10 AC，维桑尼亚王后建议伊耿一世建立精锐护卫——她从全国挑选了七位最忠诚、最善战的骑士，以守护国王和王室。第一任队长为科利斯·瓦列利安爵士（非后来的"海蛇"）。御林铁卫的誓言效仿守夜人——终身服务、不娶妻、不封地、不生子。白袍白盾是纯净与服从的象征。维桑尼亚亲手以暗黑姐妹剑封前七位骑士。"不忠的御林铁卫是最危险的……但他们也是最伟大的。"（巴利斯坦·赛尔弥）' },

  // 血龙狂舞
  { _id:'evt_dance',          name:'血龙狂舞',           era:'血龙狂舞时期',   related:['house_targaryen','house_velaryon'], desc:'坦格利安家族最惨烈的内战——雷妮拉（黑党）vs 伊耿二世（绿党）争夺铁王座。龙骑对战、君临陷落、龙群大量死亡，直接导致龙族衰落。' },
  { _id:'evt_gods_eye',       name:'神眼湖龙战',         era:'血龙狂舞时期',   related:['house_targaryen'],      desc:'戴蒙亲王骑科拉克休 vs 伊蒙德王子骑瓦格哈尔。在神眼湖上空展开龙战——戴蒙从科拉克休背上跃至瓦格哈尔龙鞍，将暗黑姐妹剑刺穿伊蒙德独眼。两人双龙坠入神眼湖——戴蒙尸体从未被找到。血龙狂舞最传奇的单场对决，维斯特洛史上最壮烈的空战。' },
  { _id:'evt_rooks_rest',     name:'鸦栖堡之战',         era:'血龙狂舞时期',   related:['house_targaryen'],      desc:'鸦栖堡是血龙狂舞首场龙战——无冕女王雷妮丝骑梅丽亚斯独自防御鸦栖堡。伊耿二世骑阳炎与伊蒙德骑瓦格哈尔联手伏击。梅丽亚斯以一敌二、壮烈战死，雷妮丝全身焦骨从龙鞍坠下。伊耿二世也严重烧伤——半边身体熔为焦炭。黑党失去最重要将领。' },
  { _id:'evt_gullet',         name:'喉道之战',           era:'血龙狂舞时期',   related:['house_velaryon','house_targaryen'], desc:'血龙狂舞中最惨烈的海战——三女儿王国舰队突袭黑党船运。杰卡里斯·瓦列利安骑沃马克斯奋勇出战，但沃马克斯被桅杆击中坠海。杰卡里斯跳海逃生时死于箭雨——"小杰"之死是黑党不可挽回的损失。维斯特洛史上最大规模海战之一。' },
  { _id:'evt_tumbleton',      name:'腾石镇之战',         era:'血龙狂舞时期',   related:['house_targaryen'],      desc:'血龙狂舞最大规模的陆地战役。绿党军队在腾石镇正面迎战黑党。龙种（非坦格利安血统的龙骑士）休·锤子和白发乌尔夫骑龙参战——随即倒戈投向绿党。腾石镇化为焦土，数千人死于龙焰。这场惨烈战役加速了双党的相互毁灭。' },
  { _id:'evt_dragonpit',      name:'君临暴动',           era:'血龙狂舞时期',   related:['house_targaryen'],      desc:'雷妮拉统治君临时，暴民被"牧羊人"煽动围攻龙穴。五条龙被困在龙穴内遭暴民屠杀——包括梦火、叙拉克斯等。暴民以斧头、长矛和人数压制龙焰。暴动直接导致龙族加速灭亡——"龙祸"时代由此开始。坦格利安历史上最黑暗的一夜。' },
  { _id:'evt_rhaenyra_rule',  name:'雷妮拉治下的君临',   era:'血龙狂舞时期',   related:['house_targaryen'],      desc:'130 AC，雷妮拉夺取君临坐上铁王座——传说铁王座割伤了她的腿，被解读为"王座拒绝了她"。她的统治急速恶化：伊耿二世掏空国库后逃亡，雷妮拉被迫征收重税以维持统治；她处决奥托·海塔尔等绿党重臣；失去民心后君临暴民围攻龙穴——她的龙叙拉克斯也被杀；最终她卖掉王冠换钱逃回龙石岛——在那里被伊耿二世捕获，喂给阳炎吞噬而死。她的六个月统治是血龙狂舞中最黯淡的章节。' },

  // 黑火叛乱时期
  { _id:'evt_summerhall',     name:'盛夏厅的悲剧',       era:'黑火叛乱时期',   related:['house_targaryen'],      desc:'伊耿五世尝试用野火孵化龙蛋导致盛夏厅大火。伊耿五世、邓肯王子与高个邓肯爵士死于火中。同一天雷加·坦格利安诞生——命运的交汇。盛夏厅化为废墟，"龙梦"最终以火与泪收场。' },
  { _id:'evt_blackfyre',      name:'黑火叛乱',           era:'黑火叛乱时期',   related:['house_targaryen'],      desc:'戴蒙·黑火——伊耿四世合法化的私生子——自称正统发动叛乱。红草原之战戴蒙被血鸦公爵的箭雨击杀，黑火一方溃败。其子逃往厄斯索斯建立金色团，黑火血脉延续五代叛乱——成为王国百年隐患、贯穿《七王国的骑士》。' },

  // 篡夺者战争
  { _id:'evt_rebellion',      name:'篡夺者战争',         era:'篡夺者战争',     related:['house_targaryen','house_stark','house_baratheon'], desc:'雷加·坦格利安"掳走"莱安娜·史塔克。疯王处决布兰登与瑞卡德·史塔克。劳勃、艾德与琼恩·艾林举起义旗，推翻坦格利安王朝。' },
  { _id:'evt_trident',        name:'红宝石滩之战',       era:'篡夺者战争',     related:['house_targaryen','house_baratheon'], desc:'劳勃·拜拉席恩与雷加·坦格利安在三叉戟河红宝石滩展开单挑——篡夺者战争的决定性战役。劳勃以战锤击碎雷加胸甲，红宝石洒落河滩——坦格利安王朝在此战终结。"劳勃的战锤粉碎了龙。"' },
  { _id:'evt_tower_of_joy',   name:'极乐塔之战',         era:'篡夺者战争',     related:['house_stark','house_targaryen'], desc:'艾德·史塔克率六人赴多恩极乐塔寻找莱安娜。三名御林铁卫——以"拂晓神剑"亚瑟·戴恩爵士为首——守卫塔楼。激战后仅艾德与霍兰·黎德幸存。莱安娜死于血床，留下临终承诺——"答应我，奈德……"琼恩·雪诺的身世之谜。' },
  { _id:'evt_sack_kl',        name:'君临沦陷',           era:'篡夺者战争',     related:['house_lannister','house_targaryen'], desc:'泰温·兰尼斯特以援军名义入城随即倒戈屠城。魔山格雷果·克里冈奸杀伊莉亚公主并杀害她的子女。詹姆·兰尼斯特在铁王座前弑杀疯王伊里斯二世——"burn them all!"疯王准备以野火毁灭全城。' },

  // 五王之战 & 冰火正传
  { _id:'evt_whispering_wood',name:'呓语森林之战',       era:'冰与火之歌时期', related:['house_stark','house_lannister'], desc:'罗柏·史塔克将兵力分为两路——一路佯攻泰温主力、另一路奇袭围困奔流城的詹姆军队。在呓语森林中设伏，詹姆·兰尼斯特全军覆没——弑君者本人被俘。少狼主"从未输过一战"的传奇开端。' },
  { _id:'evt_blackwater',     name:'黑水河之战',         era:'冰与火之歌时期', related:['house_lannister','house_baratheon'], desc:'史坦尼斯·拜拉席恩率舰队攻君临。提利昂以巨型野火链阵封锁黑水河——野火焚毁半数舰队——然后提利昂亲自率军出战。提利尔-兰尼斯特联军在关键时刻赶到解围。提利昂重伤毁容——失去大半个鼻子。君临最大规模的守城战。' },
  { _id:'evt_dragons_born',   name:'龙的诞生',           era:'冰与火之歌时期', related:['house_targaryen'],      desc:'丹妮莉丝走入卓戈卡奥火葬柴堆，带着三颗化石龙蛋。黎明时从灰烬中站起——卓耿、雷戈、韦赛里昂诞生。近一百五十年来第一批活龙。魔法的回归。' },
  { _id:'evt_red_wedding',    name:'红色婚礼',           era:'冰与火之歌时期', related:['house_stark','house_frey','house_bolton'], desc:'瓦德·佛雷与卢斯·波顿背叛宾客权利——在孪河城婚礼宴席上屠杀罗柏·史塔克、凯特琳·史塔克及三千五百北境将士。"北境之王"陨落。凯特琳被割喉抛尸河中——后被复活为石心夫人（原著独有）。' },
  { _id:'evt_purple_wedding', name:'紫色婚礼',           era:'冰与火之歌时期', related:['house_lannister','house_tyrell'], desc:'乔佛里·拜拉席恩在婚宴饮酒后窒息而死——被扼死者毒杀。提利昂被诬告逮捕，荆棘女王与小指头为真正策划者。珊莎在小指头帮助下趁机逃出君临。"暴君之死"——几乎无人哀悼。' },
  { _id:'evt_jon_death',      name:'琼恩·雪诺之死',     era:'冰与火之歌时期', related:[],                     desc:'守夜人第998任总司令琼恩·雪诺因决定让野人通过长城、以及对拉姆斯·波顿"粉红信"的激烈反应，在黑城堡被波文·马尔锡等守夜人兄弟以"Ides of Marsh"刺杀。《魔龙的狂舞》在此终结——"他从未感觉到第四刀……"（原著）' },

  // 黎明纪元
  { _id:'evt_long_night',     name:'长夜',               era:'黎明纪元',       related:[],                     desc:'异鬼从永冬之地南下——带来持续一代人的黑暗与寒冬。先民与森林之子结盟，"最后的英雄"带着十二个同伴寻找森林之子以求逆转——同伴逐个死去。最终黎明之战击退异鬼，绝境长城由此而建。亚梭尔·亚亥"光明使者"传说源于此时。' },

  // 比武大会
  { _id:'evt_ashford',        name:'岑树滩比武大会',     era:'邓肯与伊戈时期', related:['house_targaryen'],      desc:'~209 AC。高个邓肯在岑树滩参加比武大会。因保护被伊利昂王子欺负的平民提甘妮——邓肯打破规则攻击王子。七子裁判开庭：邓肯一方 vs 伊利昂一方（含御林铁卫三名）。贝勒·"裂颚"·坦格利安太子为邓肯出战——被弟弟梅卡一锤击中头部而亡。邓肯被授封御林铁卫。七国史上最著名的比武审判。' },
  { _id:'evt_harrenhal_tourney',name:'赫伦堡比武大会',   era:'篡夺者战争',     related:['house_targaryen','house_stark'], desc:'281 AC——"错误的春天"。河安大人举办赫伦堡规模最大的比武大会。雷加·坦格利安夺冠后将"爱与美的桂冠"（蓝色冬雪玫瑰）献给莱安娜·史塔克——而非妻子伊莉亚·马泰尔。"那一刻，所有在场的人都笑了……"——篡夺者战争的导火索在玫瑰花瓣下落中点燃。' }
];

// ========== 百科词条索引 ==========
const WIKI_TOPICS = [
  { topic:'旧神',         title:'旧神信仰',           category:'宗教信仰',   summary:'北境和森林之子的原始信仰。没有经典、没有牧师，在鱼梁木前祈祷。源于先民与森林之子签订的古老盟约。' },
  { topic:'七神信仰',     title:'七神信仰',           category:'宗教信仰',   summary:'安达尔人带来的主流信仰，崇拜天父、圣母、战士、少女、铁匠、老妪与陌客。以七芒星为标志，七券圣经为经典。' },
  { topic:'淹神',         title:'淹神信仰',           category:'宗教信仰',   summary:'铁群岛独有信仰。"逝者不死必将再起更加强大"。信徒通过浸水仪式受洗——被淹死后再被救活。淹神牧师是唯一可以挑战铁群岛王权的人。' },
  { topic:'光之王',       title:'光之王拉赫洛',       category:'宗教信仰',   summary:'来自厄斯索斯的二元论宗教。光之王拉赫洛 vs 远古异神。祭司能在火焰中看见幻象、施暗影魔法。亚梭尔·亚亥的转世预言的来源。' },
  { topic:'千面之神',     title:'千面之神',           category:'宗教信仰',   summary:'布拉佛斯黑白之院供奉的神祇。认为所有宗教的死神都是同一个存在——千面之神的不同面孔。无面者是他的仆人，赐予死亡为"礼物"。' },
  { topic:'先民',         title:'先民',               category:'种族文化',   summary:'一万二千年前首批跨越多恩断臂角迁徙到维斯特洛的人类。与森林之子经历了漫长的战争后签订盟约，接受旧神信仰。' },
  { topic:'安达尔人',     title:'安达尔人',           category:'种族文化',   summary:'约六千年前从厄斯索斯安达洛斯山迁徙而来，征服南境六国并带来七神信仰和骑士制度。北境因沼泽颈泽天险未被征服。' },
  { topic:'洛伊拿人',     title:'洛伊拿人',           category:'种族文化',   summary:'原是厄斯索斯洛伊拿河畔的强大文明，被瓦雷利亚自由堡垒以龙火征服。女王娜梅莉亚率万船西渡，定居多恩——多恩因此保留男女平等的继承法。' },
  { topic:'森林之子',     title:'森林之子',           category:'种族文化',   summary:'维斯特洛原住民，身材矮小、大眼、棕褐色皮肤，使用黑曜石武器和古老魔法。与先民签订盟约后被逐渐推到北方。据说创造了异鬼以对抗先民。' },
  { topic:'瓦雷利亚',     title:'瓦雷利亚自由堡垒',   category:'历史文明',   summary:'厄斯索斯最强大的文明——以龙骑士、瓦雷利亚钢和魔法闻名。末日浩劫中半岛沉入烟海。坦格利安家族是唯一在浩劫前迁往龙石岛而幸存的龙主家族。' },
  { topic:'吉斯帝国',     title:'吉斯帝国',           category:'历史文明',   summary:'厄斯索斯古老帝国——鹰身女妖之子的故乡。发明奴隶制度。被瓦雷利亚自由堡垒以龙火征服，但奴隶湾城邦（弥林、渊凯、阿斯塔波）保留吉斯文化。' },
  { topic:'鱼梁木',       title:'鱼梁木',             category:'神圣之物',   summary:'旧神信仰中的"神木"。白树皮红叶——刻有人脸。绿先知可通过鱼梁木的根脉看见过去和现在的一切——"旧神的眼睛"。被毁于安达尔人南征。' },
  { topic:'龙',           title:'龙',                 category:'魔法生物',   summary:'坦格利安家族的标志与力量来源。双足飞龙形态——可吐龙焰、高速飞行、智慧接近人类。一生持续成长。一只龙只认一名骑手。龙骨呈黑色（"黑死神"贝勒里恩足够吞下整头猛犸）。' },
  { topic:'异鬼',         title:'异鬼',               category:'魔法生物',   summary:'八千年前长夜中出现的冰生物——苍白的皮肤、幽蓝燃烧的眼睛。只被龙晶（黑曜石）和瓦雷利亚钢杀死。死者被复活为尸鬼供其驱使。绝境长城为防御异鬼而建。' },
  { topic:'绿之视野',     title:'绿之视野',           category:'魔法能力',   summary:'旧神赐予少数人的预言能力——"绿梦"。绿先知可通过鱼梁木看见过去与未来，进入动物意识（易形）。三眼乌鸦是最强大的绿先知。' },
  { topic:'易形',         title:'易形者',             category:'魔法能力',   summary:'能进入动物意识并控制其身体的能力——"狼灵"为进入狼的易形者。史塔克家的孩子各与一头冰原狼建立易形联系。维斯特洛人视易形者为不洁。' },
  { topic:'瓦雷利亚钢',   title:'瓦雷利亚钢',         category:'神器',       summary:'在瓦雷利亚自由堡垒以失传魔法与龙焰锻造的传奇金属。极其锋利、永不生锈、重量轻、韧性极强。全维斯特洛仅约200把。可杀死异鬼。' },
  { topic:'野火',         title:'野火',               category:'神器',       summary:'炼金术士公会制造的绿色易燃液体——燃烧温度极高、遇水不灭，越烧越旺。疯王伊里斯曾计划用野火烧毁君临全城。瑟曦用野火炸毁贝勒大圣堂。' },
  { topic:'冰原狼',       title:'冰原狼',             category:'魔法生物',   summary:'绝境长城以北的特有巨型狼——比普通狼大一倍、更聪慧。史塔克家徽。六只幼崽被史塔克家孩子收养——各自与主人有神秘的命运联系。' },
  { topic:'御林铁卫',     title:'御林铁卫',           category:'制度',       summary:'10 AC由维桑尼亚王后创立——七位白袍骑士终身守护国王。誓言："从今开始至死方休，你是黑暗中的光明、绝望中的守护……不娶妻、不封地、不生子。"首任队长科利斯·瓦列利安。詹姆·兰尼斯特是最年轻的成员（15岁），巴利斯坦·赛尔弥是最受尊敬的队长。' },
  { topic:'铁王座',       title:'铁王座',             category:'神器',       summary:'征服者伊耿以战败者的剑熔铸而成——由贝勒里恩的龙焰锻造。伊耿说"国王不应坐得舒适。"传说铁王座会割伤不配统治的人——雷妮拉被割伤、残酷的梅葛被发现死在铁王座上（手腕割开、利刃刺入身体）。铁王座是七国统治权的象征。' },
  { topic:'加冕',         title:'国王加冕仪式',       category:'制度',       summary:'维斯特洛国王在旧镇繁星圣堂由总主教涂七油（代表七神）加冕——宣布头衔为"安达尔人、洛伊拿人和先民的国王，七国统治者，全境守护者。"征服者伊耿是第一位接受此仪式的坦格利安国王。加冕词沿用至今。' }
];

module.exports = { CHARACTERS, PINYIN_MAP, HOUSES, EVENTS, WIKI_TOPICS };
