// pages/notificationEidt/notificationEidt.js
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

  sendMessage() {
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
    wx.cloud.callFunction({
      name: 'sendMessage_DB', // 这里是云函数名称
      data: {
        message: escapeMessage
      },
      success: res => {
        wx.showToast({
          title: '发送成功',
        });
        this.navigateToParent();
      },
      fail: err => {
        wx.showToast({
          title: '发送失败',
          icon: 'none'
        });
        console.error(err);
      }
    });
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