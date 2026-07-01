/**
 * 云数据库操作封装
 * 封装常用数据库操作，统一错误处理
 */

const db = wx.cloud ? wx.cloud.database() : null;

// 集合名称常量
const COLLECTIONS = {
  CHARACTERS: 'characters',
  HOUSES: 'houses',
  EVENTS: 'events',
  EPISODES: 'episodes'
};

/**
 * 分页获取角色列表
 * @param {Object} options - { page, pageSize, houseId, status, culture, keyword }
 */
async function getCharacters(options = {}) {
  const {
    page = 1,
    pageSize = 20,
    houseId,
    status,
    culture,
    keyword
  } = options;

  if (!db) return { data: [], total: 0 };

  try {
    let query = db.collection(COLLECTIONS.CHARACTERS);

    // 构建筛选条件
    const where = {};
    if (houseId) where.houseId = houseId;
    if (status) where.status = status;
    if (culture) where.culture = culture;

    // 关键词搜索（使用云数据库的正则匹配）
    if (keyword) {
      where.name = db.RegExp({
        regexp: keyword,
        options: 'i'
      });
    }

    if (Object.keys(where).length > 0) {
      query = query.where(where);
    }

    // 获取总数
    const countRes = await query.count();
    const total = countRes.total;

    // 分页查询
    const res = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('name', 'asc')
      .field({
        name: true,
        aliases: true,
        houseId: true,
        titles: true,
        status: true,
        tags: true,
        imageId: true
      })
      .get();

    return { data: res.data, total };
  } catch (err) {
    console.error('getCharacters error:', err);
    return { data: [], total: 0 };
  }
}

/**
 * 获取角色详情（含关联家族数据）
 */
async function getCharacterDetail(id) {
  if (!db) return null;

  try {
    const res = await db.collection(COLLECTIONS.CHARACTERS)
      .doc(id)
      .get();

    if (!res.data) return null;

    const character = res.data;

    // 关联查询家族信息
    if (character.houseId) {
      try {
        const houseRes = await db.collection(COLLECTIONS.HOUSES)
          .doc(character.houseId)
          .field({ name: true, sigil: true, words: true, region: true, seat: true })
          .get();
        character.house = houseRes.data || null;
      } catch (e) {
        character.house = null;
      }
    }

    return character;
  } catch (err) {
    console.error('getCharacterDetail error:', err);
    return null;
  }
}

/**
 * 获取家族列表
 */
async function getHouses(options = {}) {
  const {
    page = 1,
    pageSize = 20,
    region
  } = options;

  if (!db) return { data: [], total: 0 };

  try {
    let query = db.collection(COLLECTIONS.HOUSES);

    if (region) {
      query = query.where({ region });
    }

    const countRes = await query.count();
    const total = countRes.total;

    const res = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('name', 'asc')
      .get();

    return { data: res.data, total };
  } catch (err) {
    console.error('getHouses error:', err);
    return { data: [], total: 0 };
  }
}

/**
 * 全局搜索（角色+家族+事件）
 */
async function searchAll(keyword) {
  if (!db || !keyword) return { characters: [], houses: [], events: [] };

  try {
    const regexp = db.RegExp({ regexp: keyword, options: 'i' });

    // 并行搜索三个集合
    const [charRes, houseRes, eventRes] = await Promise.all([
      db.collection(COLLECTIONS.CHARACTERS)
        .where(db.command.or([
          { name: regexp },
          { aliases: regexp },
          { tags: regexp }
        ]))
        .limit(10)
        .field({ name: true, houseId: true, tags: true, imageId: true })
        .get(),

      db.collection(COLLECTIONS.HOUSES)
        .where(db.command.or([
          { name: regexp },
          { words: regexp },
          { region: regexp }
        ]))
        .limit(5)
        .get(),

      db.collection(COLLECTIONS.EVENTS)
        .where(db.command.or([
          { name: regexp },
          { locationId: regexp }
        ]))
        .limit(5)
        .get()
    ]);

    return {
      characters: charRes.data || [],
      houses: houseRes.data || [],
      events: eventRes.data || []
    };
  } catch (err) {
    console.error('searchAll error:', err);
    return { characters: [], houses: [], events: [] };
  }
}

module.exports = {
  getCharacters,
  getCharacterDetail,
  getHouses,
  searchAll,
  COLLECTIONS
};
