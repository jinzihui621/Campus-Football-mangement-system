// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const date = event.date; // 格式如 "07-07"
  const startTime = event.starttime; // 格式如 "12:00"
  const place = event.place;
  const teamnameA = event.teamnameA;
  const teamnameB = event.teamnameB;
  const turn = event.round;
  const fullStartTimeStr = `${date}T${startTime}:00Z`
  const localStartTime = new Date(fullStartTimeStr);
  const startTimeDate = new Date(localStartTime.getTime()-(8 * 60 * 60 * 1000));
  try {
    const res = await cloud.database().collection('matchInfo').where({
      matchTime: startTimeDate,
      place: place,
      teamA: teamnameA,
      teamB: teamnameB,
      turn: turn
    }).remove();
      if (res) {
        return {
          success: true,
          // 返回新创建的记录的 _id
        };
      } else {
        return {
          success: false,
          message: '比赛删除失败'
        };
      }
  }catch (error) {
    return {
      success: false,
      errorMessage: error.message
    };
  }
}