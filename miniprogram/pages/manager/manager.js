// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteFlag: false,
    player:{
      name:"",
      tno:"",
    },
    member:[
      {name:"金子辉",tno:10,score:10,red:5,yellow:3},
      {name:"崔朗清",tno:9,score:10,red:5,yellow:3},
      {name:"张三",tno:8,score:10,red:5,yellow:3},
      {name:"李四",tno:7,score:10,red:5,yellow:3},
      {name:"王五",tno:6,score:10,red:5,yellow:3},
      {name:"王五",tno:6,score:10,red:5,yellow:3},
      {name:"王五",tno:6,score:10,red:5,yellow:3},
      {name:"王五",tno:6,score:10,red:5,yellow:3},
      {name:"王五",tno:6,score:10,red:5,yellow:3},
      {name:"王五",tno:6,score:10,red:5,yellow:3},
      {name:"王五",tno:6,score:10,red:5,yellow:3},
      {name:"王五",tno:6,score:10,red:5,yellow:3}
    ],
  },

  toPlus(){
    wx.navigateTo({
      url: '/pages/addPlayer/addPlayer' // 目标页面的路径
    });
  },

  toDelete(e){
    this.setData({
      deleteFlag: true

    })
  },

  deletePlayer: function(e) {
    // 从事件对象中提取绑定的数据
    const name = e.currentTarget.dataset.info1;
    const tno = e.currentTarget.dataset.info2;
    wx.showModal({
      title: '删除确认',
      content: '确认要删除此球员吗',
      success: (res) => { // 使用箭头函数
        if (res.confirm) {
          this.setData({
            "player.name":name,
            "player.tno" :tno
          })
          // 用户点击了确定，执行删除操作
          // 这里添加你的删除逻辑

          console.log('用户点击了确认，执行删除操作');
        } else if (res.cancel) {
          // 用户点击了取消，可以在这里添加一些操作
          console.log('用户点击了取消');
        }
      },
    });
    this.setData({
      deleteFlag: false
    });
  },

  gotoIndex(){
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },

  gotoNotification(){
    wx.navigateTo({
      url: '/pages/notificationEdit/notificationEdit'
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