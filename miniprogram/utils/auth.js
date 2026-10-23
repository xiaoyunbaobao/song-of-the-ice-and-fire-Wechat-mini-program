/**
 * 用户授权管理 v2.0
 * openid 账号体系（login 云函数）+ 头像昵称主动填写（chooseAvatar/nickname）
 * 本地缓存仅作登录态镜像，云端 users 文档按 openid 存储
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

function saveUser(user, opts = {}) {
  const existing = getUser();
  const merged = { ...existing, ...user };
  // 首次登录默认效忠无旗兄弟会
  if (!merged.house) merged.house = DEFAULT_HOUSE;
  wx.setStorageSync(STORAGE_KEY, merged);

  // 同步到云端——通过 login 云函数，文档按 openid 存储（fire-and-forget）
  if (opts.sync !== false && merged.openid && wx.cloud) {
    wx.cloud.callFunction({
      name: 'login',
      data: { profile: {
        nickName: merged.nickName,
        avatarFileID: merged.avatarFileID || '',
        house: merged.house,
        houseChangedAt: merged.houseChangedAt || null
      } }
    }).catch(() => {});
  }
}

/**
 * 显式登录（登录按钮）：查云端档案
 * @returns {user, needProfile:false} | {needProfile:true} | {error:true}
 */
async function doLogin() {
  try {
    const res = await wx.cloud.callFunction({ name: 'login', data: {} });
    const r = res.result || {};
    if (!r.success) throw new Error(r.error || 'login failed');
    if (r.user) {
      saveUser(r.user, { sync: false });
      return { user: r.user, needProfile: false };
    }
    return { needProfile: true };
  } catch (e) {
    // 网络/云函数异常：有本地登录态则沿用（离线可用）
    const local = getUser();
    if (local) return { user: local, needProfile: false };
    return { error: true };
  }
}

/**
 * 注册/完善资料：头像临时文件上传云存储（失败降级无头像）→ 云函数建档/更新
 * 不传 avatarTempPath 时不动云端已有头像（编辑资料时未换头像则保留）
 */
async function registerProfile({ nickName, avatarTempPath }) {
  const profile = { nickName };
  if (avatarTempPath && wx.cloud) {
    try {
      const up = await wx.cloud.uploadFile({
        cloudPath: 'avatars/' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.png',
        filePath: avatarTempPath
      });
      profile.avatarFileID = up.fileID || '';
    } catch (e) {
      // 头像可选，上传失败不阻塞注册
      profile.avatarFileID = '';
    }
  }
  const res = await wx.cloud.callFunction({
    name: 'login',
    data: { profile }
  });
  const r = res.result || {};
  if (!r.success || !r.user) throw new Error(r.error || 'register failed');
  saveUser(r.user, { sync: false });
  return r.user;
}

/**
 * 登录态闸口（页面/组件 refresh 时调用）
 * - 新体系缓存（有 openid）：直接返回，不发云调用
 * - 旧版缓存（无 openid）：静默查云端迁移；网络异常沿用旧缓存；云端无档案则作废走新注册
 */
async function ensureLogin() {
  const local = getUser();
  if (!local) return null;
  if (local.openid) return local;
  try {
    const res = await wx.cloud.callFunction({ name: 'login', data: {} });
    const r = res.result || {};
    if (r.success && r.user) {
      saveUser(r.user, { sync: false });
      return r.user;
    }
  } catch (e) {
    return local; // 离线沿用旧登录态
  }
  logout(); // 旧假数据（"微信用户"）作废
  return null;
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
  // 同步云端家族与冷却时间（fire-and-forget）
  if (user.openid && wx.cloud) {
    wx.cloud.callFunction({
      name: 'login',
      data: { profile: { house, houseChangedAt: now } }
    }).catch(() => {});
  }
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

module.exports = { getUser, saveUser, setHouse, canChangeHouse, isLoggedIn, logout, doLogin, registerProfile, ensureLogin, HOUSES, DEFAULT_HOUSE };
