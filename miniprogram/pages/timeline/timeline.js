/**
 * 时间线 · 维斯特洛历史大事记
 * 涵盖：冰与火之歌、血与火、七王国的骑士
 * 纪年：BC=征服前 / AC=征服后 / 原著五卷 ~297-300 AC
 */
const { getCloudImg } = require('../../utils/cloud-img');
const TIMELINE_BG = 'images/banner-timeline/';
Page({
  data: {
    eras: [], activeEra: null,
    bannerRow1: [], bannerRow2: []
  },
  onLoad() {
    const imgs = [
      TIMELINE_BG+'0ce82ca312f0bfee280346626bcc8da1.jpg',
      TIMELINE_BG+'24ffe824d0030b504adc67f2a1b4a34d.jpg',
      TIMELINE_BG+'501511415f48532b70d589f318383321.jpg',
      TIMELINE_BG+'57cbcc87dcb388c6d2374946ec534adf.jpg',
      TIMELINE_BG+'57cd3492047ac8629238a955c0975807.jpg',
      TIMELINE_BG+'7b43e7f8f6dfeac5832fbf1ad624bc31.jpg',
      TIMELINE_BG+'bd8655f48246dff353fa87230ba735c1.jpg',
      TIMELINE_BG+'d5134c596daaa5dbaaa8ceb9839d2ee1.jpg',
      TIMELINE_BG+'f2b14e35a280a60f4dc05c24b4eda070.jpg',
      TIMELINE_BG+'fbdebcd30de22255413ea318be537aba.jpg',
      TIMELINE_BG+'SnapInsta.to_727059472_18120696019762707_1553023134374025101_n.jpg',
      TIMELINE_BG+'SnapInsta.to_728167688_18121019035762707_6791964763756525900_n.jpg',
      TIMELINE_BG+'SnapInsta.to_728254744_1312646870986438_5946622554020638327_n.jpg',
      TIMELINE_BG+'SnapInsta.to_728786703_18121019044762707_4283463319236600363_n.jpg',
      TIMELINE_BG+'SnapInsta.to_728892570_18121019011762707_5114092763841656623_n.jpg',
      TIMELINE_BG+'SnapInsta.to_728937548_1316086230642502_4788015785482619517_n.jpg',
      TIMELINE_BG+'SnapInsta.to_729325378_1316086363975822_6443960489862177779_n.jpg',
      TIMELINE_BG+'SnapInsta.to_730331506_1316086537309138_8862562012485017830_n.jpg',
      TIMELINE_BG+'SnapInsta.to_730464018_1316085977309194_2232082104831374308_n.jpg',
      TIMELINE_BG+'SnapInsta.to_731653039_1316086420642483_7861040386639682578_n.jpg',
      TIMELINE_BG+'SnapInsta.to_732504816_1316085923975866_3567890682604388492_n.jpg',
      TIMELINE_BG+'SnapInsta.to_733156740_1316086107309181_5064380387724205501_n.jpg'
    ];
    this.setData({
      eras: this.getTimelineData(),
      bannerRow1: imgs.map(i => getCloudImg(i)),
      bannerRow2: [...imgs].reverse().map(i => getCloudImg(i))
    });
  },
  toggleEra(e) {
    const eraId = e.currentTarget.dataset.id;
    this.setData({ activeEra: this.data.activeEra === eraId ? null : eraId });
  },
  onCharacterTap(e) {
    const name = e.currentTarget.dataset.name;
    const idMap = {
      '征服者伊耿':'char_aegon_i', '维桑尼亚':'char_visenya', '雷妮丝':'char_rhaenys_qz',
      '伊尼斯一世':'char_aenys_i', '残酷的梅葛':'char_maegor',
      '杰赫里斯一世':'char_jaehaerys_i', '善后王后亚莉珊':'char_alysanne', '巴斯修士':'char_barth',
      '韦赛里斯一世':'char_viserys_i', '伊耿二世':'char_aegon_ii',
      '雷妮拉·坦格利安':'char_rhaenyra', '戴蒙·坦格利安':'char_daemon',
      '伊蒙德·坦格利安':'char_aemond', '阿莉森·海塔尔':'char_alicent', '奥托·海塔尔':'char_otto',
      '伊耿三世':'char_aegon_ii',
      '伊耿五世':'char_egg', '高个邓肯爵士':'char_dunk', '贝勒·坦格利安':'char_baelor_breakspear',
      '雷加·坦格利安':'char_rhaegar', '莱安娜·史塔克':'',
      '丹妮莉丝·坦格利安':'char_daenerys', '琼恩·雪诺':'char_jon_snow',
      '艾德·史塔克':'char_eddard_stark', '罗柏·史塔克':'char_robb_stark',
      '凯特琳·史塔克':'char_catelyn_stark', '布兰·史塔克':'char_bran_stark',
      '劳勃·拜拉席恩':'char_robert_baratheon', '史坦尼斯·拜拉席恩':'char_stannis',
      '提利昂·兰尼斯特':'char_tyrion_lannister', '詹姆·兰尼斯特':'char_jaime_lannister',
      '泰温·兰尼斯特':'char_tywin_lannister', '瑟曦·兰尼斯特':'char_cersei_lannister',
      '乔佛里·拜拉席恩':'char_joffrey', '培提尔·贝里席':'char_littlefinger',
      '奥莲娜·提利尔':'char_olenna', '格雷果·克里冈':'char_gregor',
      '巴利斯坦·赛尔弥':'char_barristan', '梅丽珊卓':'char_melisandre', '布蕾妮':'char_brienne',
      '戴蒙·黑火':'', '戴蒙二世·黑火':'', '布林登·河文':''
    };
    if (idMap[name]) wx.navigateTo({ url: `/pages/character-detail/character-detail?id=${idMap[name]}` });
    else wx.navigateTo({ url: `/pages/search/search?keyword=${encodeURIComponent(name)}` });
  },
  getTimelineData() {
    return [
      // ===== 1. 征服者伊耿 (1 – 37 AC) =====
      { id:'aegon_i',title:'征服者伊耿',period:'1 — 37 AC',source:'《血与火》',icon:'👑',events:[
        { id:'e001',date:'2 BC',title:'伊耿登陆',desc:'征服者伊耿与姐妹维桑尼亚、雷妮丝率少数军队在黑水河口登陆。建立伊耿堡（君临前身）。征服战争开始。',characters:['征服者伊耿','维桑尼亚','雷妮丝'],type:'major'},
        { id:'e002',date:'2 BC',title:'赫伦堡之焚',desc:'黑心赫伦王拒绝投降。伊耿骑黑死神贝勒里恩趁夜飞入赫伦堡——龙焰烧熔石塔，赫伦王与所有子嗣葬身火海。赫伦堡自此废弃。',characters:['征服者伊耿'],type:'major'},
        { id:'e003',date:'2 BC',title:'怒火燎原',desc:'凯岩王罗伦·兰尼斯特与河湾王孟恩·加德纳联军五万五千人。伊耿三龙齐出——史上唯一一次三条龙同时出战。加德纳家族覆灭，兰尼斯特投降。',characters:['征服者伊耿'],type:'major'},
        { id:'e004',date:'2 BC',title:'托伦降服',desc:'北境之王托伦·史塔克率三万北境军南下，看到巨龙后选择屈膝投降。"降服之王"被封为北境守护。',characters:['征服者伊耿'],type:'major'},
        { id:'e005',date:'1 AC',title:'伊耿加冕',desc:'旧镇总主教涂圣油加冕——"安达尔人、洛伊拿人和先民的国王，七国统治者。"坦格利安王朝开始，征服纪年由此计算。',characters:['征服者伊耿'],type:'major'},
        { id:'e006',date:'4-13 AC',title:'第一次多恩战争',desc:'伊耿一世试图以龙焰征服多恩但失败。雷妮丝王后与龙米拉西斯在狱门堡被弩炮射杀。多恩以游击战抵抗——唯一未被征服的王国。',characters:['征服者伊耿','雷妮丝'],type:'medium'},
        { id:'e008',date:'10 AC',title:'御林铁卫创立',desc:'维桑尼亚王后建议组建精锐护卫。从全国挑选七位最忠诚善战的骑士：首任队长科利斯·瓦列利安爵士。誓言效仿守夜人：终身服务、不娶妻、不封地。白袍白盾象征纯净与服从。维桑尼亚亲手以暗黑姐妹剑封七位白骑士。',characters:['征服者伊耿','维桑尼亚'],type:'medium'},
        { id:'e007',date:'37 AC',title:'伊耿一世驾崩',desc:'征服者伊耿在龙石岛中风去世，按坦格利安传统火化。在位27年——将一片分裂的大陆锻造成统一王国。其子伊尼斯一世继位。',characters:['征服者伊耿'],type:'medium'}
      ]},

      // ===== 2. 伊尼斯一世 (37 – 42 AC) =====
      { id:'aenys_i',title:'伊尼斯一世',period:'37 — 42 AC',source:'《血与火》',icon:'😷',events:[
        { id:'e101',date:'37 AC',title:'伊尼斯一世继位',desc:'伊耿一世与雷妮丝之子——体弱多病、优柔寡断、热爱艺术和音乐而非治国。骑乘孱弱小龙奎克斯。他的柔弱为叛乱埋下伏笔。',characters:['伊尼斯一世'],type:'major'},
        { id:'e102',date:'37-41 AC',title:'各地叛乱四起',desc:'四位反王同时起兵——"乞丐王"、红隼、哈里·哈德温、以及铁群岛的"教士王"。伊尼斯无力应对——"好人不等于好国王。"',characters:['伊尼斯一世'],type:'medium'},
        { id:'e103',date:'41 AC',title:'信仰武装兴起',desc:'七神教会因坦格利安的一夫多妻制而武装反抗——"战士之子"和"穷人集会"组成军事力量。伊尼斯试图协商——每次妥协都使王权更加衰弱。',characters:['伊尼斯一世'],type:'major'},
        { id:'e104',date:'42 AC',title:'伊尼斯一世病逝',desc:'35岁在龙石岛死于热病——死前仍未能解决信仰武装危机。其弟梅葛一世夺取王位——坦格利安王朝最黑暗的时期开始。',characters:['伊尼斯一世'],type:'medium'}
      ]},

      // ===== 3. 残酷的梅葛 (42 – 48 AC) =====
      { id:'maegor',title:'残酷的梅葛一世',period:'42 — 48 AC',source:'《血与火》',icon:'💀',events:[
        { id:'e201',date:'42 AC',title:'梅葛篡位',desc:'伊尼斯病逝后，其子伊耿理应为合法继承人。但维桑尼亚王后支持自己的儿子梅葛——她以瓦格哈尔飞赴龙石岛为梅葛加冕。坦格利安王朝第一次继承危机。',characters:['残酷的梅葛','维桑尼亚'],type:'major'},
        { id:'e202',date:'43 AC',title:'七星审判',desc:'梅葛与战士教会的七名骑士在君临单挑——七星审判。梅葛是唯一的幸存者——"他倒下时，七人中有六人已经死了。"之后梅葛昏迷三十天。',characters:['残酷的梅葛'],type:'major'},
        { id:'e203',date:'43-44 AC',title:'焚毁教会',desc:'梅葛骑贝勒里恩——"既然教会有武装，我就用龙焰来回应。"焚烧战士之子的圣堂、轰炸繁星圣堂的塔楼。数千人死于龙焰。但教会仍在抵抗——"龙焰无法烧死信仰。"',characters:['残酷的梅葛'],type:'major'},
        { id:'e204',date:'45 AC',title:'红堡建成·屠杀工匠',desc:'梅葛下令修建红堡作为新王座所在地——完工后处决所有参与修建的工匠以保守密道秘密。"残酷的梅葛"之名由此广为流传。',characters:['残酷的梅葛'],type:'medium'},
        { id:'e205',date:'44-48 AC',title:'六位妻子无一子嗣',desc:'梅葛娶六位妻子——每位均未生子。传说他有生殖缺陷或被诅咒——"他的血脉和他本人一样贫瘠。"他日益疯狂——"疯狂似乎是他的本性，但权力放大了它。"',characters:['残酷的梅葛'],type:'medium'},
        { id:'e206',date:'48 AC',title:'梅葛死于铁王座',desc:'盟友纷纷背弃后，梅葛被发现死在铁王座上——手腕割开、铁王座利刃刺入喉咙与胸膛。是自杀、他杀、还是"铁王座本身的审判"？维斯特洛史上最大的未解之谜之一。在位六年。',characters:['残酷的梅葛'],type:'major'}
      ]},

      // ===== 4. 杰赫里斯一世 · 和解者 (48 – 103 AC) =====
      { id:'jaehaerys',title:'杰赫里斯一世 · 和解者 · 人瑞王',period:'48 — 103 AC',source:'《血与火》',icon:'🕊️',events:[
        { id:'e301',date:'48 AC',title:'十四岁登基',desc:'伊尼斯一世之子——梅葛死后由母亲阿莱莎·瓦列利安太后保护。十四岁时以惊人成熟登上铁王座——"他的第一个行动是大赦。"赦免所有在梅葛时期被迫支持暴君的贵族——条件是宣誓效忠新王。',characters:['杰赫里斯一世'],type:'major'},
        { id:'e302',date:'50 AC',title:'迎娶亚莉珊',desc:'杰赫里斯与妹妹亚莉珊秘密结婚——"善后王后"成为维斯特洛最受爱戴的王后。教会震怒但最终接受——"你可以废除初夜权、但不能废除爱情。"',characters:['杰赫里斯一世','善后王后亚莉珊'],type:'medium'},
        { id:'e303',date:'51-55 AC',title:'废除初夜权·妇女法庭',desc:'在亚莉珊王后推动下：废除领主的初夜权——"让每一位新娘在婚礼之夜属于自己。"亚莉珊巡游七国设立妇女法庭——亲自听取女性申诉。载入"杰赫里斯法典"。',characters:['杰赫里斯一世','善后王后亚莉珊','巴斯修士'],type:'major'},
        { id:'e304',date:'55-58 AC',title:'与教会和解',desc:'杰赫里斯与总主教谈判——教会放弃武装（战士之子解散、穷人集会解除），王室宣誓保护信仰。"王权与信仰的契约"——梅葛用龙焰没能做到的事，杰赫里斯用言辞做到了。',characters:['杰赫里斯一世'],type:'major'},
        { id:'e305',date:'58-80 AC',title:'杰赫里斯法典 · 国王大道',desc:'巴斯修士编纂维斯特洛第一部统一法典：废除断肢刑、统一度量衡、确立审判程序。修建"国王大道"连接全国——从长城到君临、从君临到旧镇。"一个好的国王需要好的道路。"',characters:['杰赫里斯一世','巴斯修士'],type:'major'},
        { id:'e306',date:'80-100 AC',title:'继承悲剧',desc:'与亚莉珊生了十三个孩子——大多数先他而死。长子伊蒙被海盗射杀、次子贝隆死于阑尾破裂……每一个孩子的死都是"他最深的伤疤"。——最终由大议会决定继承人。',characters:['杰赫里斯一世','善后王后亚莉珊'],type:'medium'},
        { id:'e307',date:'101 AC',title:'101大议会',desc:'杰赫里斯一世召集大议会决定继承人——雷妮丝公主（长子之女）vs 韦赛里斯王子（次子之子）。大议会选择男性——韦赛里斯成为继承人。"和解者"用民主程序避免了内战。',characters:['杰赫里斯一世','韦赛里斯一世'],type:'major'},
        { id:'e308',date:'103 AC',title:'杰赫里斯一世驾崩',desc:'69岁在床榻上安详去世——在位五十五年。统治期间是维斯特洛最长久的和平与繁荣时期——后人称他"人瑞王"。"他在位时维斯特洛学会了和平。"',characters:['杰赫里斯一世'],type:'major'}
      ]},

      // ===== 5. 韦赛里斯一世 (103 – 129 AC) =====
      { id:'viserys_i',title:'韦赛里斯一世 · 和平者',period:'103 — 129 AC',source:'《血与火》',icon:'👑',events:[
        { id:'e401',date:'103 AC',title:'继位·继承杰赫里斯的和平',desc:'韦赛里斯一世继承祖父的和平王国。他的统治是坦格利安王朝最后的太平盛世——无重大战争、财政充裕、贵族顺从。"和平者"的绰号来自他在位期间的无战事。',characters:['韦赛里斯一世'],type:'medium'},
        { id:'e402',date:'105 AC',title:'指定雷妮拉为继承人',desc:'第一任妻子艾玛·艾林在产床上死去——新生儿也随即夭折。韦赛里斯一怒之下指定女儿雷妮拉为铁王座继承人——"让全国的领主宣誓效忠她。"这在维斯特洛史无前例。',characters:['韦赛里斯一世','雷妮拉·坦格利安'],type:'major'},
        { id:'e403',date:'106 AC',title:'再婚阿莉森·海塔尔',desc:'韦赛里斯一世娶了阿莉森·海塔尔——奥托·海塔尔的女儿。她生下儿子伊耿（后来的伊耿二世）——埋下了血龙狂舞的最大隐患。"他是儿子……她只是女儿。"',characters:['韦赛里斯一世','阿莉森·海塔尔','奥托·海塔尔'],type:'medium'},
        { id:'e404',date:'129 AC',title:'韦赛里斯一世驾崩',desc:'晚年肥胖病重——临终呓语中呼喊雷妮拉的名字却被阿莉森误解为让伊耿继位。绿党立即筹备伊耿二世加冕——血龙狂舞由此引爆。',characters:['韦赛里斯一世','阿莉森·海塔尔'],type:'major'}
      ]},

      // ===== 6. 血龙狂舞 (129 – 131 AC) =====
      { id:'dance',title:'血龙狂舞',period:'129 — 131 AC',source:'《血与火》《公主与王后》',icon:'🔥',events:[
        { id:'e501',date:'129 AC',title:'血龙狂舞爆发',desc:'韦赛里斯一世驾崩。绿党抢先立伊耿二世为王，雷妮拉在龙石岛加冕。坦格利安家族最惨烈内战——龙与龙相斗。',characters:['伊耿二世','雷妮拉·坦格利安','阿莉森·海塔尔'],type:'major'},
        { id:'e502',date:'129 AC',title:'路斯里斯之死',desc:'雷妮拉之子路斯里斯骑阿拉克斯出使风息堡，被伊蒙德骑瓦格哈尔追杀。一人一龙在破船湾上空被杀——血龙狂舞中首场龙战。',characters:['伊蒙德·坦格利安'],type:'medium'},
        { id:'e503',date:'130 AC',title:'神眼湖龙战',desc:'戴蒙骑科拉克休 vs 伊蒙德骑瓦格哈尔。戴蒙从龙背跃至瓦格哈尔，暗黑姐妹刺穿伊蒙德独眼。双龙坠湖——血龙狂舞最传奇的一役。',characters:['戴蒙·坦格利安','伊蒙德·坦格利安'],type:'major'},
        { id:'e504',date:'130 AC',title:'鸦栖堡之战',desc:'无冕女王雷妮丝骑梅丽亚斯以一敌二——被伊耿二世和伊蒙德联手伏击。梅丽亚斯战死，雷妮丝全身焦骨坠下。伊耿二世严重烧伤。',characters:['伊耿二世','伊蒙德·坦格利安'],type:'medium'},
        { id:'e505',date:'130 AC',title:'雷妮拉夺取君临·六个月统治',desc:'黑党攻入君临。雷妮拉登上铁王座被割伤——国库空、增税失民心、处决绿党、日益偏执。牧羊人煽动暴民围攻龙穴屠五龙。卖王冠逃亡。',characters:['雷妮拉·坦格利安','伊耿二世'],type:'major'},
        { id:'e506',date:'130 AC',title:'雷妮拉之死',desc:'逃回龙石岛落入伊耿二世之手。被喂给阳炎吞噬——当着儿子（未来的伊耿三世）的面被吞下六口而死。三十三岁。',characters:['雷妮拉·坦格利安','伊耿二世','伊耿三世'],type:'major'},
        { id:'e507',date:'131 AC',title:'血龙狂舞终结',desc:'伊耿二世被毒死。雷妮拉之子伊耿三世继位。龙群大量死亡——坦格利安家族失去最重要的力量来源。',characters:['伊耿二世','伊耿三世'],type:'major'}
      ]},

      // ===== 7. 伊耿三世 · 龙祸 (131 – 157 AC) =====
      { id:'aegon_iii',title:'伊耿三世 · 龙祸',period:'131 — 157 AC',source:'《血与火》',icon:'🐉',events:[
        { id:'e601',date:'131 AC',title:'十一岁登基',desc:'童年目睹母亲雷妮拉被龙吞噬——一生患有严重的心理创伤。他的统治是"摄政时期"——七大贵族组成的摄政议会实际统治了六年。"他从不笑。"',characters:['伊耿三世'],type:'medium'},
        { id:'e602',date:'153 AC',title:'最后一条龙死亡',desc:'伊耿三世统治期间，最后一条活龙死亡——"她蜷缩在龙石岛的火山岩上，闭上了绿色的眼睛……再也没有睁开。"龙族消亡。"龙祸"之名由此而来——据说他毒死了最后的龙，但真相不详。',characters:['伊耿三世'],type:'major'},
        { id:'e603',date:'157 AC',title:'伊耿三世驾崩',desc:'因肺结核去世——三十六岁。在位二十六年，低声寡言——"他留给王国的东西比任何国王都少……除了和平。"其子戴伦一世继位。',characters:['伊耿三世'],type:'medium'}
      ]},

      // ===== 8. 少年国王们 (157 – 184 AC) =====
      { id:'young_kings',title:'少年国王们 · 征服多恩 · 虔信与堕落',period:'157 — 184 AC',source:'《冰与火之歌》正史',icon:'⚔️',events:[
        { id:'e701',date:'157 AC',title:'戴伦一世 · 少年龙王',desc:'十四岁登基——"年轻龙"。发动多恩征服战争——"你是那个征服了多恩的男孩国王。"成功占领多恩但无法守住——在平息多恩叛乱时被杀。十八岁。',characters:[],type:'medium'},
        { id:'e702',date:'161 AC',title:'贝勒一世 · 受神恩宠的贝勒',desc:'戴伦一世之弟——最虔诚的国王。步行赤脚前往多恩签订和约。在君临驱逐妓女、建造贝勒大圣堂（白色大理石七座水晶高塔）。禁食祈祷四十天——饿死在圣堂中。',characters:[],type:'medium'},
        { id:'e703',date:'171 AC',title:'韦赛里斯二世',desc:'贝勒一世之叔。戴伦二世之父。在位仅一年——据传被其子伊耿四世毒死（未证实）。",',characters:[],type:'minor'},
        { id:'e704',date:'172 AC',title:'伊耿四世 · 庸王',desc:'坦格利安王朝最堕落的国王——"庸王伊耿"。拥有无数情妇和私生子。临终前合法化所有私生子——赠予戴蒙·黑火祖传瓦雷利亚钢剑"黑火"——王国的百年定时炸弹就此埋下。',characters:[],type:'major'}
      ]},

      // ===== 9. 戴伦二世 & 黑火叛乱 (184 – 209 AC) =====
      { id:'daeron_ii',title:'戴伦二世 · 贤王 & 黑火叛乱',period:'184 — 209 AC',source:'《冰与火之歌》正史',icon:'⚔️',events:[
        { id:'e801',date:'184 AC',title:'戴伦二世继位',desc:'伊耿四世嫡子——与父亲截然相反的贤明君主。将多恩以联姻方式并入七国（马隆·马泰尔亲王迎娶戴伦之妹丹妮莉丝公主）。引发布林登·河文（血鸦）等关键人物登场。',characters:['戴伦二世'],type:'medium'},
        { id:'e802',date:'196 AC',title:'第一次黑火叛乱 · 红草原之战',desc:'戴蒙·黑火自称铁王座正统继承人发动叛乱。红草原之战中戴蒙被血鸦公爵的箭雨射杀——"血鸦的箭从不失手。"黑火一方溃败，其子逃往厄斯索斯建立金色团。',characters:['戴蒙·黑火','布林登·河文','戴伦二世'],type:'major'},
        { id:'e803',date:'209 AC',title:'春季大瘟疫',desc:'横扫维斯特洛、杀死三分之一人口。戴伦二世与两个孙子均死于瘟疫——"贤王"终结于灾难之年。',characters:['戴伦二世'],type:'medium'}
      ]},

      // ===== 10. 邓肯与伊戈 · 盛夏厅 (209 – 259 AC) =====
      { id:'dunk_egg',title:'邓肯与伊戈 · 七王国的骑士',period:'~209 — 259 AC',source:'《七王国的骑士》',icon:'🛡️',events:[
        { id:'e901',date:'~209 AC',title:'岑树滩比武 · 七子裁判',desc:'高个邓肯因保护平民被王子欺负，七子裁判开庭。贝勒·裂颚太子为邓肯出战——被弟弟梅卡一锤击中头部而死。邓肯被授封御林铁卫。伊戈成为他的侍从。',characters:['高个邓肯爵士','伊耿五世','贝勒·坦格利安'],type:'major'},
        { id:'e902',date:'~211 AC',title:'誓言之剑 · 坚阵堡',desc:'邓肯与伊戈在河湾地为尤斯塔斯·奥斯格雷爵士效力。邓肯拒绝伤害无辜——真正骑士精神的展现。',characters:['高个邓肯爵士','伊耿五世'],type:'medium'},
        { id:'e903',date:'~212 AC',title:'神秘骑士 · 白墙城',desc:'邓肯与伊戈在白墙城发现戴蒙二世·黑火策划第二次黑火叛乱。邓肯揭穿阴谋。伊戈首次参与政治斗争。',characters:['高个邓肯爵士','伊耿五世','戴蒙二世·黑火'],type:'major'},
        { id:'e904',date:'233 AC',title:'伊戈加冕 · 不该成王的国王',desc:'大议会意外选择伊戈（伊耿五世）——"不该成王的国王"。高个邓肯任御林铁卫队长——首任平民出身队长。',characters:['伊耿五世','高个邓肯爵士'],type:'major'},
        { id:'e905',date:'236 AC',title:'第四次黑火叛乱',desc:'戴蒙三世·黑火率金色团入侵，被伊耿五世军队击败。戴蒙三世阵亡。',characters:['伊耿五世'],type:'minor'},
        { id:'e906',date:'259 AC',title:'盛夏厅的悲剧',desc:'伊耿五世尝试用野火孵化龙蛋——盛夏厅大火。伊耿五世、邓肯王子与高个邓肯爵士死于火中。雷加·坦格利安于此日诞生。"龙梦"以火与泪收场。',characters:['伊耿五世','高个邓肯爵士','雷加·坦格利安'],type:'major'}
      ]},

      // ===== 11. 疯王 & 篡夺者战争 (259 – 283 AC) =====
      { id:'rebellion',title:'疯王伊里斯二世 & 篡夺者战争',period:'259 — 283 AC',source:'《冰与火之歌》正史',icon:'🦌',events:[
        { id:'ea01',date:'262 AC',title:'伊里斯二世继位',desc:'杰赫里斯二世之子——早年以魅力和抱负著称。泰温·兰尼斯特成为其最杰出的国王之手——"兰尼斯特统治七国而伊里斯坐在铁王座上。"后因嫉妒和偏执与泰温决裂。',characters:['泰温·兰尼斯特'],type:'medium'},
        { id:'ea02',date:'277 AC',title:'暮谷城之乱',desc:'暮谷城领主丹尼斯·达克林绑架伊里斯二世——在暮谷城囚禁半年。被巴利斯坦·赛尔弥爵士只身救出。此后伊里斯精神彻底崩溃——"疯王"从此而来。',characters:['巴利斯坦·赛尔弥'],type:'medium'},
        { id:'ea03',date:'281 AC',title:'错误的春天 · 赫伦堡比武',desc:'雷加·坦格利安夺冠后将"爱与美的桂冠"献给莱安娜·史塔克——而非妻子伊莉亚·马泰尔。"那一刻，所有在场的人都笑了……"',characters:['雷加·坦格利安','莱安娜·史塔克','艾德·史塔克'],type:'major'},
        { id:'ea04',date:'282-283 AC',title:'篡夺者战争',desc:'雷加与莱安娜消失→疯王处决布兰登与瑞卡德·史塔克→劳勃、艾德、琼恩·艾林举起义旗→红宝石滩之战劳勃锤杀雷加→君临沦陷詹姆弑杀疯王。"劳勃的反叛建立在谎言之上。"',characters:['劳勃·拜拉席恩','雷加·坦格利安','艾德·史塔克','詹姆·兰尼斯特'],type:'major'},
        { id:'ea05',date:'283 AC',title:'极乐塔之战',desc:'艾德·史塔克率六人在多恩极乐塔寻找莱安娜。三名御林铁卫（含拂晓神剑亚瑟·戴恩）守卫。仅艾德与霍兰·黎德幸存。莱安娜死于血床——"答应我，奈德……"',characters:['艾德·史塔克','莱安娜·史塔克'],type:'major'}
      ]},

      // ===== 12. 劳勃统治 & 五王之战 (283 – 300 AC) =====
      { id:'asoiaf',title:'劳勃·拜拉席恩 & 五王之战',period:'283 — 300 AC',source:'《冰与火之歌》五卷',icon:'🐺',events:[
        { id:'eb01',date:'283-298 AC',title:'劳勃统治 · 和平的虚构',desc:'劳勃·拜拉席恩登上铁王座——但国王之位于他不适合。沉溺酒色比武大会——将国家拖入六百万金龙债务。妻子瑟曦的三个孩子实为詹姆所生——"劳勃的王座建立在谎言的沙丘上。"',characters:['劳勃·拜拉席恩','瑟曦·兰尼斯特'],type:'medium'},
        { id:'eb02',date:'298 AC',title:'琼恩·艾林之死 · 劳勃北上',desc:'御前首相琼恩·艾林突然病逝——遗言"种性强韧"。劳勃北上临冬城邀艾德·史塔克任国王之手。',characters:['劳勃·拜拉席恩','艾德·史塔克'],type:'medium'},
        { id:'eb03',date:'298 AC',title:'布兰坠楼 · 艾德被捕 · 劳勃之死',desc:'布兰撞见詹姆与瑟曦乱伦被推下高塔→劳勃被野猪重伤致死→艾德揭露真相被小指头背叛关入黑牢→被乔佛里下令斩首。五王之战拉开序幕。',characters:['布兰·史塔克','艾德·史塔克','詹姆·兰尼斯特','乔佛里·拜拉席恩'],type:'major'},
        { id:'eb04',date:'299 AC',title:'龙的诞生',desc:'丹妮莉丝走入卓戈卡奥火葬柴堆——黎明时从灰烬中站起，孵化卓耿、雷戈、韦赛里昂——近一百五十年第一批活龙。魔法的回归。',characters:['丹妮莉丝·坦格利安'],type:'major'},
        { id:'eb05',date:'299 AC',title:'呓语森林 · 黑水河 · 红色婚礼',desc:'罗柏·史塔克呓语森林俘获詹姆→黑水河之战史坦尼斯被野火击退→红色婚礼罗柏与凯特琳被屠杀——"北境之王"陨落。',characters:['罗柏·史塔克','提利昂·兰尼斯特','凯特琳·史塔克'],type:'major'},
        { id:'eb06',date:'300 AC',title:'紫色婚礼 · 提利昂弑父',desc:'乔佛里在婚宴被毒杀→提利昂被诬告→弑父泰温后逃亡→瓦里斯带他前往厄斯索斯。',characters:['乔佛里·拜拉席恩','提利昂·兰尼斯特','泰温·兰尼斯特'],type:'major'},
        { id:'eb07',date:'300 AC',title:'琼恩·雪诺之死',desc:'守夜人第998任总司令在黑城堡被兄弟刺杀——"他从未感觉到第四刀……"《魔龙的狂舞》在此终结。',characters:['琼恩·雪诺'],type:'major'}
      ]},

      // ===== 13. 凛冬的寒风 (300 AC – ) =====
      { id:'winds',title:'凛冬的寒风 · 已知与未知',period:'300 AC —',source:'预览章节 · 马丁访谈',icon:'❄️',events:[
        { id:'ec01',date:'300 AC',title:'石心夫人的复仇',desc:'凯特琳被光之王复活为石心夫人——无法说话、面容残损，率无旗兄弟会展开血腥复仇。布蕾妮与詹姆被她俘获——面临生死审判。（原著独有）',characters:['凯特琳·史塔克','布蕾妮','詹姆·兰尼斯特'],type:'medium'},
        { id:'ec02',date:'300 AC',title:'伊耿登陆风暴地',desc:'雷加之子伊耿·坦格利安（琼恩·康林顿抚养）率黄金团在风暴地登陆——先于丹妮莉丝开始征服维斯特洛。（原著独有——剧中完全删除）',characters:[],type:'major'},
        { id:'ec03',date:'300 AC',title:'临冬城之战 · 史坦尼斯',desc:'史坦尼斯利用夜灯之谋在冰湖设伏——结果未知。原著中史坦尼斯尚未死亡。"我是合法的国王——我将战斗到最后一息。"',characters:['史坦尼斯·拜拉席恩'],type:'medium'},
        { id:'ec04',date:'300 AC',title:'琼恩的复活',desc:'梅丽珊卓可能在黑城堡复活琼恩·雪诺。根据马丁暗示——复活可能带来根本性的人格改变。琼恩可能通过白灵的灵魂转移存活——与剧集路径可能不同。',characters:['琼恩·雪诺','梅丽珊卓'],type:'medium'}
      ]}
    ];
  }
});
