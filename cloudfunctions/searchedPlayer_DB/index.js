// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init() // 使用当前云环境
// 云函数入口函数
exports.main = async (event) => {
  const name = event.name; // 从前端传递的参数

  try {
    // 查询数据库中name字段匹配的记录
    const res = await cloud.database().collection('player').where({
      name: name
    }).get();

    // 处理查询结果，提取每条记录的name、number字段
    const processedData = res.data.map(item => {
      return {
        name: item.name,
        number: item.number,
        _id:item._id
      };
    });
    // 返回处理后的数据
    return {
      success: true,
      data: processedData
    };
  } catch (error) {
    // 错误处理
    return {
      success: false,
      errorMessage: error.message
    };
  }
}