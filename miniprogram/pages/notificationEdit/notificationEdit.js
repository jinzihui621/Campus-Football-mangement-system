// pages/notificationEidt/notificationEidt.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    valueInput:""
  },

  handleInput(e){
    this.setData({
      valueInput: e.detail.value
    })
  },

  navigateToParent(){
    wx.navigateBack({
      delta: 1 // 返回上一级页面
    });
  },

  sendMessage_DB() {
    const message = this.data.valueInput;
    // 输入内容验证
    if (!message || message.length === 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      });
      return;
    }
    // 防止SQL注入的字符转义
    const escapeMessage = this.escapeSQLInjection(message);
    // 进行数据库操作发布信息
    try{
      var valueInput = escapeMessage; 
      var  _id = "id1"; //队长id
      db.collection('leader_manage_team').where({
        teamleader_id: _id
      }).get({
        success(res) {
          const doc = res.data[0]
          console.log(res)
          if(doc){
            var newData ={
              teamleader_id: _id,
              notice: valueInput,
              team_id : doc.team_id,
              time : new Date()
            }
            console.log(newData)
            db.collection('leader_manage_team').add({
              data: newData,
              success(res) {
                wx.showToast({
                  title: '发送成功',
                  icon: "success",
                })
              },
              fail(err) {
                console.error('添加失败', err);
              }
            });
          }else{
            console.log('未找到该记录');
          }
        },
        fail(err){
          console.error('查询失败', err);
        }
      });
    } catch (err) {
      console.error('删除操作出错', err);
      // 处理异常情况
    }
    this.navigateToParent();
  },

  escapeSQLInjection(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
        case "\0":
          return "\\0";
        case "\x08":
          return "\\b";
        case "\x09":
          return "\\t";
        case "\x1a":
          return "\\z";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "\"":
        case "'":
        case "\\":
        case "%":
          return "\\" + char; // Prepends a backslash to backslash, percent,
                              // and double/single quotes
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})