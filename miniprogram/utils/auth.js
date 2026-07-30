/**
 * 用户授权管理
 */
const STORAGE_KEY = 'asoiaf_user';

const IMG = 'https://636c-cloud1-1g5ys3sne8db5912-1419585064.tcb.qcloud.la/images/houses/';
const DEFAULT_HOUSE = { id:'none', name:'无旗兄弟会', sigil:'🏴', img:IMG+'Brotherhood_without_banners.jpg' };

const HOUSES = [
  { id:'house_stark',     name:'史塔克',   sigil:'🐺', img:IMG+'House_Stark.jpg' },
  { id:'house_lannister', name:'兰尼斯特', sigil:'🦁', img:IMG+'House_Lannister.jpg' },
  { id:'house_targaryen', name:'坦格利安', sigil:'🐉', img:IMG+'House_Targaryen.jpg' },
  { id:'house_baratheon', name:'拜拉席恩', sigil:'🦌', img:IMG+'Baratheon_DS.jpg' },
  { id:'house_greyjoy',   name:'葛雷乔伊', sigil:'🐙', img:IMG+'House_Greyjoy.jpg' },
  { id:'house_arryn',     name:'艾林',     sigil:'🦅', img:IMG+'House_Arryn.jpg' },
  { id:'house_martell',   name:'马泰尔',   sigil:'☀️', img:IMG+'House_Martell.jpg' },
  { id:'house_tully',     name:'徒利',     sigil:'🐟', img:IMG+'House_Tully.jpg' },
  { id:'house_tyrell',    name:'提利尔',   sigil:'🌹', img:IMG+'House_Tyrell.jpg' },
  { id:'house_velaryon',  name:'瓦列利安', sigil:'🌊', img:IMG+'House_Velaryon2.jpg' },
  { id:'house_bolton',    name:'波顿',     sigil:'🚩', img:IMG+'House_Bolton.jpg' },
  { id:'house_mormont',   name:'莫尔蒙',   sigil:'🐻', img:IMG+'House_Mormont.jpg' },
  { id:'house_tarly',     name:'塔利',     sigil:'🏹', img:IMG+'Tarly.jpg' },
  { id:'house_clegane',   name:'克里冈',   sigil:'🐕', img:IMG+'House_Clegane.jpg' },
  { id:'house_frey',      name:'佛雷',     sigil:'🏰', img:IMG+'House_Frey.jpg' },
  { id:'house_reed',      name:'黎德',     sigil:'🦎', img:IMG+'House_Reed.jpg' },
  { id:'none',            name:'无旗兄弟会', sigil:'🏴', img:IMG+'Brotherhood_without_banners.jpg' }
];

function getUser() {
  try { return wx.getStorageSync(STORAGE_KEY) || null; } catch (e) { return null; }
}

function saveUser(user) {
  const existing = getUser();
  const merged = { ...existing, ...user };
  // 首次登录默认效忠无旗兄弟会
  if (!merged.house) merged.house = DEFAULT_HOUSE;
  wx.setStorageSync(STORAGE_KEY, merged);

  // 同步到云数据库——方便查看访问用户
  if (wx.cloud && merged.nickName) {
    try {
      const db = wx.cloud.database();
      db.collection('users').doc(merged.nickName).set({
        data: {
          nickName: merged.nickName,
          avatarUrl: merged.avatarUrl || '',
          lastLogin: Date.now(),
          house: merged.house || DEFAULT_HOUSE
        }
      }).catch(() => {});
    } catch(e) {}
  }
}

function setHouse(house) {
  const user = getUser();
  if (!user) return false;
  const now = Date.now();
  const tenDays = 10 * 24 * 3600 * 1000;
  if (user.houseChangedAt && (now - user.houseChangedAt < tenDays)) {
    const remaining = Math.ceil((tenDays - (now - user.houseChangedAt)) / (24 * 3600 * 1000));
    return { locked: true, remaining };
  }
  user.house = house;
  user.houseChangedAt = now;
  wx.setStorageSync(STORAGE_KEY, user);
  return { locked: false };
}

function canChangeHouse() {
  const user = getUser();
  if (!user || !user.houseChangedAt) return { can: true };
  const now = Date.now();
  const tenDays = 10 * 24 * 3600 * 1000;
  const elapsed = now - user.houseChangedAt;
  if (elapsed >= tenDays) return { can: true };
  return { can: false, remaining: Math.ceil((tenDays - elapsed) / (24 * 3600 * 1000)) };
}

function isLoggedIn() { return !!getUser(); }

function logout() { wx.removeStorageSync(STORAGE_KEY); }

module.exports = { getUser, saveUser, setHouse, canChangeHouse, isLoggedIn, logout, HOUSES, DEFAULT_HOUSE };
