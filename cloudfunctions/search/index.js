// 云函数：search
// 全文搜索，跨 characters、houses、events 三个集合

const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const keyword = event.keyword || '';

  if (!keyword || keyword.trim().length === 0) {
    return {
      success: true,
      characters: [],
      houses: [],
      events: [],
      total: 0
    };
  }

  const trimmedKeyword = keyword.trim();

  try {
    // 并行搜索三个集合
    const [charResult, houseResult, eventResult] = await Promise.all([
      // 搜索角色：name, aliases
      db.collection('characters')
        .where(db.command.or([
          { name: db.RegExp({ regexp: trimmedKeyword, options: 'i' }) },
          { aliases: db.RegExp({ regexp: trimmedKeyword, options: 'i' }) }
        ]))
        .limit(20)
        .get(),

      // 搜索家族：name, words, region, tags
      db.collection('houses')
        .where(db.command.or([
          { name: db.RegExp({ regexp: trimmedKeyword, options: 'i' }) },
          { words: db.RegExp({ regexp: trimmedKeyword, options: 'i' }) },
          { region: db.RegExp({ regexp: trimmedKeyword, options: 'i' }) }
        ]))
        .limit(20)
        .get(),

      // 搜索事件：name, description
      db.collection('events')
        .where(db.command.or([
          { name: db.RegExp({ regexp: trimmedKeyword, options: 'i' }) },
          { description: db.RegExp({ regexp: trimmedKeyword, options: 'i' }) }
        ]))
        .limit(20)
        .get()
    ]);

    const characters = (charResult && charResult.data) ? charResult.data : [];
    const houses = (houseResult && houseResult.data) ? houseResult.data : [];
    const events = (eventResult && eventResult.data) ? eventResult.data : [];

    return {
      success: true,
      characters: characters,
      houses: houses,
      events: events,
      total: characters.length + houses.length + events.length
    };

  } catch (err) {
    console.error('search error:', err);
    return {
      success: false,
      error: err.message,
      characters: [],
      houses: [],
      events: [],
      total: 0
    };
  }
};
