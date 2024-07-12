// pages/player/player.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"}
    ],
    matchId:"",
    team1:"",
    team2:"",
    place:"",
    time:"",

    match: [
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操",matchId:"43234"},
      {team1:"经管",team2:"理学",time:"2024/7/7",place:"北操",matchId:"43234"},
      {team1:"都柏林",team2:"艺设",time:"2024/7/7",place:"北操",matchId:"43234"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操",matchId:"43234"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操",matchId:"43234"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操",matchId:"43234"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操",matchId:"43234"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操",matchId:"43234"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操",matchId:"43234"},
    ]

  },

  handleRegister(e){
    wx.showModal({
      title: '确认',
      content: '请确认是否报名本场比赛',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            place:e.currentTarget.dataset.info4,
            team1:e.currentTarget.dataset.info1,
            team2:e.currentTarget.dataset.info2,
            time:e.currentTarget.dataset.info3,
            matchId:e.currentTarget.dataset.info5,
          });
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 1000
          });
        } else if (res.cancel) {
          wx.showToast({
            title: '操作取消',
            icon: 'none',
            duration: 2000
          });
        }
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