// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init() // 使用当前云环境
// 云函数入口函数
exports.main = async (event) => {
  const name = event.name; // 从前端传递的参数
  console.log(typeof name);
  try {
    const query = {
      name: new RegExp('^' + name, 'i') // 直接使用 RegExp 对象
    };
    const res = await cloud.database().collection('player').where(query).get();
    console.log("res有:",res);
    // 处理查询结果，提取每条记录的name、number字段
    const processedData = res.data.map(item => {
      return {
        name: item.name,
        number: item.number,
        _id:item._id,
        _id: item._id
      };
    });
    
    try {
      // 检查 processedData 是否为空数组
      if (Array.isArray(processedData) && processedData.length === 0) {
        // 如果是空数组，则返回 { success: false }
        return {
          success: false,
          errorMessage: 'No data to process.'
        };
      } else {
        // 如果不是空数组，则返回处理后的数据
        return {
          success: true,
          data: processedData
        };
      }
    } catch (error) {
      // 错误处理
      return {
        success: false,
        errorMessage: error.message
      };
    }
  } catch (error) {
    // 错误处理
    return {
      success: false,
      errorMessage: error.message
    };
  }
}