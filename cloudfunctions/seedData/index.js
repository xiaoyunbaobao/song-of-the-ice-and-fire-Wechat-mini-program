// 云函数：seedData
// 从 seed-data.json 读取全量数据初始化云数据库
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const data = require('./seed-data.json');

exports.main = async (event, context) => {
  const result = { charactersInserted: 0, housesInserted: 0, eventsInserted: 0, errors: [] };
  const batchSize = 50;

  // 批量插入角色
  const chars = data.characters || [];
  for (let i = 0; i < chars.length; i += batchSize) {
    const batch = chars.slice(i, i + batchSize);
    try {
      await Promise.all(batch.map(c => db.collection('characters').add({ data: c })));
      result.charactersInserted += batch.length;
    } catch (err) {
      // 逐个重试
      for (const c of batch) {
        try { await db.collection('characters').add({ data: c }); result.charactersInserted++; }
        catch (e) { result.errors.push({ collection: 'characters', id: c._id, error: e.message }); }
      }
    }
  }

  // 批量插入家族
  const houses = data.houses || [];
  for (const h of houses) {
    try { await db.collection('houses').add({ data: h }); result.housesInserted++; }
    catch (e) { result.errors.push({ collection: 'houses', id: h._id, error: e.message }); }
  }

  // 批量插入事件
  const events = data.events || [];
  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    try {
      await Promise.all(batch.map(ev => db.collection('events').add({ data: ev })));
      result.eventsInserted += batch.length;
    } catch (err) {
      for (const ev of batch) {
        try { await db.collection('events').add({ data: ev }); result.eventsInserted++; }
        catch (e) { result.errors.push({ collection: 'events', id: ev._id, error: e.message }); }
      }
    }
  }

  return {
    success: result.errors.length === 0,
    message: `角色${result.charactersInserted} / 家族${result.housesInserted} / 事件${result.eventsInserted}`,
    data: result,
    errors: result.errors.length > 0 ? result.errors : undefined
  };
};
