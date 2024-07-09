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
		currentListIndex:0,
		currentPlayerTab:'goals',
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
		//积分榜
		tableRankColumns: [
      { title: "名次", key: "rank", width: "80rpx" },
      { title: "球队", key: "team", width: "140rpx" },
      { title: "赛", key: "gamePlayed", width: "80rpx" },
      { title: "胜", key: "win", width: "80rpx" },
      { title: "平", key: "draw", width: "80rpx" },
      { title: "负", key: "lose", width: "80rpx" },
      { title: "进/失", key: "gs_ga", width: "100rpx" },
      { title: "积分", key: "points", width: "80rpx" }
    ],
    listRank: [
      { rank: "1", team: "计算机", gamePlayed: 8, win: 8, draw: 0, lose: 0, gs_ga: "35/2", points: 24 },
      { rank: "2", team: "城建", gamePlayed: 8, win: 7, draw: 1, lose: 0, gs_ga: "15/10", points: 22 },
      { rank: "3", team: "电子", gamePlayed: 8, win: 6, draw: 1, lose: 1, gs_ga: "20/5", points: 19 },
      { rank: "4", team: "化工", gamePlayed: 8, win: 5, draw: 2, lose: 1, gs_ga: "18/8", points: 17 }
    ],
		//进球榜
		tableGoalColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "进球数", key: "goals", width: "100rpx" }
    ],
    listGoal: [
      { rank: "1", player: "Player1", team: "Team1", goals: "10" },
      { rank: "2", player: "Player2", team: "Team2", goals: "8" },
      { rank: "3", player: "Player3", team: "Team3", goals: "7" },
      { rank: "4", player: "Player4", team: "Team4", goals: "6" }
    ],
    // 助攻榜
    tableAssistColumns: [
      { title: "名次", key: "rank", width: "100rpx", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "助攻数", key: "assists", width: "100rpx" }
    ],
    listAssist: [
      { rank: "1", player: "Player1", team: "Team1", assists: "12" },
      { rank: "2", player: "Player2", team: "Team2", assists: "9" },
      { rank: "3", player: "Player3", team: "Team3", assists: "8" },
      { rank: "4", player: "Player4", team: "Team4", assists: "7" }
		],
    // 黄牌榜
    tableYellowCardColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "黄牌数", key: "yellowCards", width: "100rpx" }
    ],
    listYellowCard: [
      { rank: "1", player: "Player1", team: "Team1", yellowCards: "5" },
      { rank: "2", player: "Player2", team: "Team2", yellowCards: "4" },
      { rank: "3", player: "Player3", team: "Team3", yellowCards: "3" },
      { rank: "4", player: "Player4", team: "Team4", yellowCards: "2" }
    ],
    // 红牌榜
    tableRedCardColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "红牌数", key: "redCards", width: "100rpx" }
    ],
		listRedCard: [],
		
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
	// 切换球员榜榜单
	selectPlayerTab: function(e) {
    this.setData({
      currentPlayerTab: e.currentTarget.dataset.tab
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