// 云函数：getHouses
// 获取家族列表，支持区域过滤与分页

const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const page = event.page || 1;
  const pageSize = event.pageSize || 20;
  const region = event.region || null;  // 按区域过滤: 北境, 西境, 王领, etc.

  try {
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    let conditions = {};

    if (region && region.trim().length > 0) {
      conditions.region = region.trim();
    }

    // 查询总数
    const countResult = await db.collection('houses')
      .where(conditions)
      .count();

    const total = countResult.total;

    // 查询分页数据
    let dataResult;
    if (total > 0) {
      dataResult = await db.collection('houses')
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
    console.error('getHouses error:', err);
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
