// 云函数：seedData
// 传 {"type":"characters"} 只插角色，{"clear":true} 先清空再插
const cloud = require('wx-server-sdk');
cloud.init({ env: 'cloud1-1g5ys3sne8db5912' });
const db = cloud.database();
const _ = db.command;
const data = require('./seed-data.json');

exports.main = async (event, context) => {
  const mode = event.type || 'all';
  const shouldClear = event.clear === true;
  const result = { inserted: 0, deleted: 0, errors: [] };

  const collections = [];
  if (mode === 'characters' || mode === 'all') collections.push({ name: 'characters', items: data.characters || [] });
  if (mode === 'houses' || mode === 'all') collections.push({ name: 'houses', items: data.houses || [] });
  if (mode === 'events' || mode === 'all') collections.push({ name: 'events', items: data.events || [] });

  for (const col of collections) {
    // 需要清空时，先删所有旧数据
    if (shouldClear) {
      try {
        const allDocs = await db.collection(col.name).limit(1000).get();
        for (const doc of allDocs.data) {
          try { await db.collection(col.name).doc(doc._id).remove(); result.deleted++; } catch (e) {}
        }
      } catch (e) {}
    }

    // 逐个插入
    for (const item of col.items) {
      try {
        await db.collection(col.name).add({ data: item });
        result.inserted++;
      } catch (err) {
        const msg = err.message || '';
        if (msg.includes('E11000') || msg.includes('duplicate')) {
          result.inserted++; // 已存在算成功
        } else {
          result.errors.push({ col: col.name, id: item._id, err: msg });
        }
      }
    }
  }

  return {
    success: result.errors.length === 0,
    inserted: result.inserted,
    deleted: shouldClear ? result.deleted : undefined,
    mode: mode,
    cleared: shouldClear
  };
};
