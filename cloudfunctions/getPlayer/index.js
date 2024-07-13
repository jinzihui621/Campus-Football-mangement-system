// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("进入云函数");
  const db = cloud.database()
  const _ = db.command
  const { teamleader_id } = event;

  // 获取 team_id
  const leaderResult = await db.collection('leader_manage_team').where({
    teamleader_id: teamleader_id
  }).get()

  if (leaderResult.data.length === 0) {
    return {
      success: false,
      message: '未找到对应的团队'
    }
  }
console.log("找到队伍");
  const team_id = leaderResult.data[0].team_id

  // 获取 team_id 对应的所有队员
  const playerResult = await db.collection('team_player').where({
    team_id: team_id
  }).get()

  return {
    success: true,
    players: playerResult.data
  }
}
