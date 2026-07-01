// 云函数：getCharacters
// 获取角色列表，支持分页与过滤

const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const page = event.page || 1;
  const pageSize = event.pageSize || 20;
  const status = event.status || null;     // 'alive', 'deceased', 'unknown'
  const houseId = event.houseId || null;    // 按家族过滤
  const keyword = event.keyword || null;    // 关键词搜索 (regex on name)

  try {
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    let conditions = {};

    if (status) {
      conditions.status = status;
    }

    if (houseId) {
      conditions.houseId = houseId;
    }

    if (keyword && keyword.trim().length > 0) {
      conditions.name = db.RegExp({
        regexp: keyword.trim(),
        options: 'i'
      });
    }

    // 查询总数
    const countResult = await db.collection('characters')
      .where(conditions)
      .count();

    const total = countResult.total;

    // 查询分页数据
    let dataResult;
    if (total > 0) {
      dataResult = await db.collection('characters')
        .where(conditions)
        .skip(skip)
        .limit(pageSize)
        .orderBy('name', 'asc')
        .get();
    } else {
      dataResult = { data: [] };
    }

    return {
      success: true,
      data: dataResult.data,
      total: total,
      page: page,
      pageSize: pageSize
    };

  } catch (err) {
    console.error('getCharacters error:', err);
    return {
      success: false,
      error: err.message,
      data: [],
      total: 0,
      page: page,
      pageSize: pageSize
    };
  }
};
