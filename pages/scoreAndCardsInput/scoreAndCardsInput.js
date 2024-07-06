// pages/scoreAndCardsInput/scoreAndCardsInput.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    teamA:'队伍A',
    teamB:'队伍B',
    scoreA:0,
    scoreB:0,
    matchTime:'07-07 00:00',
    match:'xx杯',
    race:'xx-xx',
    turn:1,
    teamAid:1,
    teamBid:2,
    playerA:[
      {teamID:1,playerCode:1,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:2,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:3,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:4,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:5,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:6,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:7,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:8,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:9,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:10,score:0,yellowCard:0,redCard:0},
      {teamID:1,playerCode:11,score:0,yellowCard:0,redCard:0}
    ],
    playerB:[
      {teamID:2,playerCode:1,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:2,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:3,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:4,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:5,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:6,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:7,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:8,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:9,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:10,score:0,yellowCard:0,redCard:0},
      {teamID:2,playerCode:11,score:0,yellowCard:0,redCard:0}
    ],
  },
 
  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  btnGoalMinus: function(e) {  
    const { playercode: playerCode, teamid: teamID } = e.currentTarget.dataset;  
    const players = this.data[teamID === this.data.teamAid ? 'playerA' : 'playerB'];  
    const index = players.findIndex(player => player.playerCode === parseInt(playerCode, 10));  
    if (index !== -1) {  
      const newPlayers = [...players];  
      if (newPlayers[index].score > 0) { // 避免得分为负  
        newPlayers[index].score--;  
      }  
      this.setData({  
        [teamID === this.data.teamAid ? 'playerA' : 'playerB']: newPlayers  
      });  
    }
    this.updateTeamScore()  
  },  
  btnGoalAdd: function(e) {  
    const { playercode: playerCode, teamid: teamID } = e.currentTarget.dataset;  
    const players = this.data[teamID === this.data.teamAid ? 'playerA' : 'playerB'];  
    const index = players.findIndex(player => player.playerCode === parseInt(playerCode, 10));  
    if (index !== -1) {  
      const newPlayers = [...players];  
      newPlayers[index].score++;
      this.setData({  
        [teamID === this.data.teamAid ? 'playerA' : 'playerB']: newPlayers  
      });  
    }
    this.updateTeamScore()  
  },
  /*点击黄牌+时的函数*/
  btnYellowAdd(e){
    const { playercode: playerCode, teamid: teamID } = e.currentTarget.dataset;  
    const players = this.data[teamID === this.data.teamAid ? 'playerA' : 'playerB'];  
    const index = players.findIndex(player => player.playerCode === parseInt(playerCode, 10));  
    if (index !== -1) {  
      const newPlayers = [...players];  
      newPlayers[index].yellowCard++;  
      this.setData({  
        [teamID === this.data.teamAid ? 'playerA' : 'playerB']: newPlayers  
      });  
    }  
  },
  /*点击黄牌-时的函数*/
  btnYellowMinus(e){
    const { playercode: playerCode, teamid: teamID } = e.currentTarget.dataset;  
    const players = this.data[teamID === this.data.teamAid ? 'playerA' : 'playerB'];  
    const index = players.findIndex(player => player.playerCode === parseInt(playerCode, 10));  
    if (index !== -1 && players[index].yellowCard > 0) { // 确保黄牌数量大于0  
      const newPlayers = [...players];  
      newPlayers[index].yellowCard--;  
      this.setData({  
        [teamID === this.data.teamAid ? 'playerA' : 'playerB']: newPlayers  
      });  
    }
  },
  /*点击红牌+时的函数*/
  btnRedAdd(e){
    const { playercode: playerCode, teamid: teamID } = e.currentTarget.dataset;  
    const players = this.data[teamID === this.data.teamAid ? 'playerA' : 'playerB'];  
    const index = players.findIndex(player => player.playerCode === parseInt(playerCode, 10));  
    if (index !== -1) {  
      const newPlayers = [...players];  
      newPlayers[index].redCard++;  
      this.setData({  
        [teamID === this.data.teamAid ? 'playerA' : 'playerB']: newPlayers  
      });  
    }
  },
  /*点击红牌-时的函数*/
  btnRedMinus(e){
    const { playercode: playerCode, teamid: teamID } = e.currentTarget.dataset;  
    const players = this.data[teamID === this.data.teamAid ? 'playerA' : 'playerB'];  
    const index = players.findIndex(player => player.playerCode === parseInt(playerCode, 10));  
    if (index !== -1 && players[index].redCard > 0) { // 确保黄牌数量大于0  
      const newPlayers = [...players];  
      newPlayers[index].redCard--;  
      this.setData({  
        [teamID === this.data.teamAid ? 'playerA' : 'playerB']: newPlayers  
      });  
    }
  },
  /*更新总比分*/
  updateTeamScore:function(){
    let scores = {  
      team1: 0, // 队伍A的比分  
      team2: 0  // 队伍B的比分  
    }; 
    this.data.playerA.forEach(player => {  
      scores.team1 += player.score;  
    });  
    this.data.playerB.forEach(player => {  
      scores.team2 += player.score;  
  }); 
    this.setData({
      scoreA:scores.team1,
      scoreB:scores.team2
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