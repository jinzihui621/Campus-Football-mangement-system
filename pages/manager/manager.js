// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:[
      {id:1,name:"金子辉",tno:10,red:5},
      {id:2,name:"崔朗清",tno:9,red:5},
      {id:3,name:"张三",tno:8,red:5},
      {id:4,name:"李四",tno:7,red:5},
      {id:5,name:"王五",tno:6,red:5},
      {id:5,name:"王五",tno:6,red:5},
      {id:5,name:"王五",tno:6,red:5},
      {id:5,name:"王五",tno:6,red:5},
      {id:5,name:"王五",tno:6,red:5},
      {id:5,name:"王五",tno:6,red:5},
      {id:5,name:"王五",tno:6,red:5},
      {id:5,name:"王五",tno:6,red:5}
    ]

  },

  toPlus(){
    wx.navigateTo({
      url: '/pages/addPlayer/addPlayer' // 目标页面的路径
    });
  },

  toMinus(){
    wx.navigateTo({
      url: '/pages/deletePlayer/deletePlayer' // 目标页面的路径
    });
  },

  gotoIndex(){
    wx.navigateTo({
      url: '/pages/index/index'
    })
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
    console.log(2)
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