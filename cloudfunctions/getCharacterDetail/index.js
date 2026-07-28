// 云函数：getCharacterDetail
// 获取单个角色详情，包含关联家族信息

const cloud = require('wx-server-sdk');
cloud.init({ env: 'cloud1-1g5ys3sne8db5912' });
const db = cloud.database();

exports.main = async (event, context) => {
  const characterId = event.characterId || event.id || '';

  if (!characterId) {
    return {
      success: false,
      error: 'characterId is required'
    };
  }

  try {
    // 查询角色
    const charResult = await db.collection('characters')
      .doc(characterId)
      .get();

    if (!charResult.data || charResult.data.length === 0) {
      return {
        success: false,
        error: 'Character not found'
      };
    }

    const character = charResult.data;

    // 如果角色有关联家族，查询家族数据
    let house = null;
    if (character.houseId) {
      try {
        const houseResult = await db.collection('houses')
          .doc(character.houseId)
          .get();
        house = houseResult.data || null;
      } catch (houseErr) {
        // 家族不存在时不影响返回
        house = null;
      }
    }

    // 查询相关事件 (角色出现在 involvedCharacters 中)
    let relatedEvents = [];
    try {
      const eventsResult = await db.collection('events')
        .where({
          involvedCharacters: db.RegExp({
            regexp: character.name,
            options: 'i'
          })
        })
        .limit(20)
        .get();
      relatedEvents = eventsResult.data || [];
    } catch (evtErr) {
      relatedEvents = [];
    }

    return {
      success: true,
      data: {
        character: character,
        house: house,
        relatedEvents: relatedEvents
      }
    };

  } catch (err) {
    console.error('getCharacterDetail error:', err);
    return {
      success: false,
      error: err.message
    };
  }
};
