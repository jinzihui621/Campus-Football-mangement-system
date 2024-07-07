// pages/match/match.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matches:[
      {matchID:1,matchName:"工超"},
      {matchID:2,matchName:'工甲'},
      {matchID:3,matchName:'工大杯'}
    ],
    matchNumber:3,
    listType:['积分榜','球员榜','赛程'],
    listNumber:3,
    currentIndex: 0,
    currentListIndex:2,
    date:'2024',
    turn:1, //当前显示的赛程轮次
    tableColumns: [
      {title: "日期",key: "date",width: "100rpx"}, 
      {title: "队伍A",key: "teamA",}, 
      {title: "A",key: "teamAScore",},
      {title:"B",key:"teamBScore"},
      {title:"队伍B",key:"teamB"}
    ],
    list:[
      {date:"07-07 00:00",teamA:"type1",teamAScore:"-",teamBScore:'-',teamB:"name1"},
      {date:"07-07 00:00",teamA:"type2",teamAScore:"-",teamBScore:'-',teamB:"name2"},
      {date:"07-07 00:00",teamA:"type3",teamAScore:"3",teamBScore:'1',teamB:"name3"},
      {date:"07-07 00:00",teamA:"type4",teamAScore:"2",teamBScore:'3',teamB:"name4"}
    ],
    "firstList": [{ name: 'w券1', money: '5.00' }, { name: 'w券2', money: '50.00'}],
    "secondList": [{ name: 'y券1', money: '10.00' }, { name: 'y券2', money: '20.00' }],
    "thirdList": [{ name: 'g券1', money: '30.00' }, { name: 'g券2', money: '40.00' }],
  },
 
  //swiper切换时会调用——赛事切换
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % this.data.matchNumber
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //榜单切换
  listchange: function(e){
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentListIndex
      currentPageIndex = (currentPageIndex + 1) % this.data.listNumber
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //用户点击tab时调用——切换赛事
  titleClick: function (e) {
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx
    })
  },
  //用户点击切换榜单
  listClick: function(e){
    this.setData({
      //拿到当前索引并动态改变
      currentListIndex: e.currentTarget.dataset.idx
    })
  },
  /*表格组件请求加载表格*/
  getListLoading: function(e){
    return true;
  },
  /*筛选日期 */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /*切换比赛轮次*/
  changeTurn:function(e){
    console.log(e)
    this.setData({
      turn:e.currentTarget.dataset.current
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