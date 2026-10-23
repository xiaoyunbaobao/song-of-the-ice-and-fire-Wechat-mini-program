// 云函数：login
// openid 账号体系：纯登录查询 / 注册 / 资料更新（昵称·头像·家族）
// 所有 users 集合写入都走本函数，客户端不直写

const cloud = require('wx-server-sdk');
cloud.init({ env: 'cloud1-1g5ys3sne8db5912' });
const db = cloud.database();

// 家族 id 白名单——防止伪造 house 数据注入
const HOUSE_IDS = [
  'none', 'house_stark', 'house_lannister', 'house_targaryen',
  'house_baratheon', 'house_greyjoy', 'house_arryn', 'house_martell',
  'house_tully', 'house_tyrell', 'house_velaryon', 'house_bolton',
  'house_mormont', 'house_tarly', 'house_clegane', 'house_frey', 'house_reed'
];
const DEFAULT_HOUSE = { id: 'none', name: '无旗兄弟会', sigil: '🏴', img: '' };

function sanitizeNickName(v) {
  let s = String(v == null ? '' : v).replace(/[\x00-\x1f\x7f]/g, '').trim();
  if (s.length > 20) s = s.substring(0, 20);
  return s || '无名学士';
}

function sanitizeAvatar(v) {
  if (typeof v !== 'string') return '';
  if (!v.startsWith('cloud://')) return '';
  return v.length > 512 ? '' : v;
}

function sanitizeHouse(v) {
  if (!v || typeof v !== 'object' || HOUSE_IDS.indexOf(v.id) === -1) return DEFAULT_HOUSE;
  return {
    id: v.id,
    name: typeof v.name === 'string' && v.name ? v.name.substring(0, 20) : DEFAULT_HOUSE.name,
    sigil: typeof v.sigil === 'string' ? v.sigil.substring(0, 8) : DEFAULT_HOUSE.sigil,
    img: typeof v.img === 'string' && v.img.length <= 512 ? v.img : ''
  };
}

function sanitizeTs(v) {
  const n = Number(v);
  return isFinite(n) && n > 0 ? n : null;
}

// users 集合可能不存在（seedData 只建 characters/houses/events）——set 失败时建集重试一次
async function upsert(openid, data) {
  try {
    await db.collection('users').doc(openid).set({ data });
  } catch (e) {
    if (e.errCode === -502005) {
      await db.createCollection('users');
      await db.collection('users').doc(openid).set({ data });
    } else {
      throw e;
    }
  }
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  if (!OPENID) return { success: false, error: 'no openid' };

  try {
    // ===== 纯登录：查已有档案 =====
    if (!event || !event.profile) {
      let user = null;
      try {
        const res = await db.collection('users').doc(OPENID).get();
        if (res.data) {
          user = res.data;
          // 顺带刷新 lastLogin（失败不影响登录）
          db.collection('users').doc(OPENID).update({ data: { lastLogin: Date.now() } }).catch(() => {});
        }
      } catch (e) {
        // 文档不存在 / 集合不存在 → 新用户
        user = null;
      }
      return { success: true, openid: OPENID, user };
    }

    // ===== 注册 / 资料更新 =====
    const profile = event.profile || {};
    const now = Date.now();

    let old = null;
    try {
      const res = await db.collection('users').doc(OPENID).get();
      old = res.data || null;
    } catch (e) {
      old = null;
    }

    const data = {
      openid: OPENID,
      nickName: profile.nickName !== undefined ? sanitizeNickName(profile.nickName) : (old && old.nickName ? old.nickName : '无名学士'),
      avatarFileID: profile.avatarFileID !== undefined ? sanitizeAvatar(profile.avatarFileID) : (old ? old.avatarFileID || '' : ''),
      house: profile.house !== undefined ? sanitizeHouse(profile.house) : (old && old.house ? old.house : DEFAULT_HOUSE),
      houseChangedAt: profile.houseChangedAt !== undefined ? sanitizeTs(profile.houseChangedAt) : (old && old.houseChangedAt ? old.houseChangedAt : null),
      createdAt: old && old.createdAt ? old.createdAt : now,
      updatedAt: now,
      lastLogin: now
    };

    await upsert(OPENID, data);
    return { success: true, openid: OPENID, user: data };

  } catch (err) {
    console.error('login error:', err);
    return { success: false, error: err.message };
  }
};
