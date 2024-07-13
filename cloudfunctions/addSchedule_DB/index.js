// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event) => {
  const date = event.date; // 格式如 "07-07"
  const startTime = event.starttime; // 格式如 "12:00"
  const place = event.place;
  const teamnameA = event.teamnameA;
  const teamnameB = event.teamnameB;
  const turn = event.round;
  const eventname = event.eventname;
  const teamA_id = event.teamA_id;
  const teamB_id = event.teamB_id;

  // 将 day 和 startTime 结合成完整的日期时间字符串
  const fullStartTimeStr = `${date}T${startTime}:00Z`;

  // 将字符串转换为 Date 对象
  const localStartTime = new Date(fullStartTimeStr);
  const startTimeDate = new Date(localStartTime.getTime()-(8 * 60 * 60 * 1000));

  try {
    // 使用 Promise 形式的 get 方法
    const startTimeMinus1Hour30Minutes = new Date(
      startTimeDate.getTime() - (1.5 * 60 * 60 * 1000)
    );
    
    // 计算1.5小时之后的日期时间
    const startTimePlus1Hour30Minutes = new Date(
      startTimeDate.getTime() + (1.5 * 60 * 60 * 1000)
    );
    console.log("place",place);
    var flag=0;
    const res = await cloud.database().collection('matchInfo').where({
      place: place
    }).get();
    if (res.data && res.data.length > 0) {
      for (let i = 0; i < res.data.length; i++) {
        const record = res.data[i];
        const timeDifference = Math.abs(record.matchTime - startTimeDate);
        console.log("时间差",timeDifference);
        if (timeDifference <= 5400000) {
          console.log("flag",flag);
          flag++;
          break; // 找到符合条件的记录后退出循环
        }
      }
    }
    console.log("flag最后",flag);
    if (flag>0) {
      return {
        success: false,
        message: '时间地点冲突！'
      };
    } else {
      // 没有冲突，继续获取下一个 match_id
      let maxNumber = 0; // 用于存储当前找到的最大数字
      let maxRecord = null; // 用于存储具有最大数字的记录

    // 遍历所有记录
    const res = await cloud.database().collection('matchInfo').get();
    res.data.forEach(record => {
      // 使用正则表达式匹配并提取数字
      const matchResult = record.match_id.match(/id(\d+)/);
      if (matchResult) {
        const number = parseInt(matchResult[1], 10);
        // 更新最大数字和对应的记录
        if (number > maxNumber) {
          maxNumber = number;
          maxRecord = record;
        }
      }
    });
      let number = maxNumber + 1;
      const newmatchId = `id${number}`;
      const newData = {
        event_name:eventname,
        matchTime:startTimeDate,
        match_id:newmatchId,
        place: place,
        scoreA:0.0,
        scoreB:0.0,
        teamA:teamnameA,
        teamB:teamnameB,
        teamA_id:teamA_id,
        teamB_id:teamB_id,
        turn:turn
      };

      // 使用 Promise 形式的 add 方法
      const addResult = await cloud.database().collection('matchInfo').add({
        data: newData
      });

      if (addResult._id) {
        return {
          success: true,
          _id: addResult._id // 返回新创建的记录的 _id
        };
      } else {
        return {
          success: false,
          message: '比赛创建失败'
        };
      }
    }
  }
catch (error) {
    return {
      success: false,
      errorMessage: error.message
    };
  }
}