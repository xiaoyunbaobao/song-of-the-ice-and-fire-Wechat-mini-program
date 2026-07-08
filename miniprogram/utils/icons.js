/**
 * 家族徽章与图标映射
 * sigil: emoji 兜底 / img: 正式家徽图片路径
 */
const SIGIL_PATH = '/images/houses/';

const HOUSE_ICONS = {
  house_stark:     { sigil:'🐺', name:'冰原狼',   color:'#7ec8e3', img: SIGIL_PATH+'House_Stark.jpg',       bg:'linear-gradient(135deg, #1a2a3e, #0d1b2a)' },
  house_lannister: { sigil:'🦁', name:'雄狮',     color:'#d4a853', img: SIGIL_PATH+'House_Lannister.jpg',   bg:'linear-gradient(135deg, #2a1a1a, #3e1a1a)' },
  house_targaryen: { sigil:'🐉', name:'三头龙',   color:'#c44536', img: SIGIL_PATH+'House_Targaryen.jpg',   bg:'linear-gradient(135deg, #2a1a1a, #1a0a0a)' },
  house_baratheon: { sigil:'🦌', name:'宝冠雄鹿', color:'#f0c040', img: SIGIL_PATH+'Baratheon_DS.jpg',      bg:'linear-gradient(135deg, #2a2a1a, #1a1a0a)' },
  house_greyjoy:   { sigil:'🐙', name:'海怪',     color:'#808080', img: SIGIL_PATH+'House_Greyjoy.jpg',     bg:'linear-gradient(135deg, #1a2a2a, #0a1a1a)' },
  house_arryn:     { sigil:'🦅', name:'新月猎鹰', color:'#4a90d9', img: SIGIL_PATH+'House_Arryn.jpg',       bg:'linear-gradient(135deg, #1a2a3e, #0d1a2a)' },
  house_martell:   { sigil:'☀️', name:'长枪贯日', color:'#d4744a', img: SIGIL_PATH+'House_Martell.jpg',     bg:'linear-gradient(135deg, #2a1a0a, #3e1a0a)' },
  house_tully:     { sigil:'🐟', name:'银色鳟鱼', color:'#4a7a9c', img: SIGIL_PATH+'House_Tully.jpg',      bg:'linear-gradient(135deg, #1a2a3e, #0d1a2a)' },
  house_tyrell:    { sigil:'🌹', name:'金色玫瑰', color:'#4a9c4a', img: SIGIL_PATH+'House_Tyrell.jpg',     bg:'linear-gradient(135deg, #1a2a1a, #0a1a0a)' },
  house_velaryon:  { sigil:'🌊', name:'海马',     color:'#3cb4b4', img: SIGIL_PATH+'House_Velaryon2.jpg',    bg:'linear-gradient(135deg, #0a2a2a, #0a1a2a)' }
};

const REGIONS = ['北境','河间地','谷地','西境','王领','风暴地','河湾地','多恩','铁群岛','塞外'];

const STATUS_MAP = {
  alive:        { label:'存活',   cssClass:'tag-status-alive' },
  dead:         { label:'已故',   cssClass:'tag-status-dead' },
  unknown:      { label:'未知',   cssClass:'tag-ice' },
  resurrected:  { label:'已复活', cssClass:'tag-fire' }
};

function getHouseIcon(houseId) {
  return HOUSE_ICONS[houseId] || { sigil:'🏰', name:'未知家族', color:'#666' };
}

module.exports = { HOUSE_ICONS, REGIONS, STATUS_MAP, getHouseIcon, SIGIL_PATH };
