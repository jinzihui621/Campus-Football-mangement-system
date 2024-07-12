// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event) => {
  const number = event.number; // 学号
  const match_id = event.match_id; // 比赛ID

  try {
    // 查询数据库中number字段匹配的记录
    const queryResult = await cloud.database().collection('team_player').where({
      number: number
    }).get();

    if (queryResult.data.length > 0) {
      const doc = queryResult.data[0];
      const newData = {
        match_id: match_id,
        player_num: doc.player_num,
        red: 0.0,
        score: 0.0,
        team_id: doc.team_id,
        yellow: 0.0
      };

      // 尝试添加新记录
      const addResult = await cloud.database().collection('player_score_list').add({
        data: newData
      });

      // 返回添加结果
      if (addResult._id) {
        // 添加成功
        return 1;
      } else {
        // 添加失败
        return 0;
      }
    } else {
      // 未找到学号对应记录
      return 0;
    }
  } catch (error) {
    console.error('添加操作出错', error);
    // 处理异常情况
    return 0;
  }
}