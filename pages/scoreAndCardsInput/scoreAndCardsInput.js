// pages/scoreAndCardsInput/scoreAndCardsInput.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     match:'xx杯xxx场比赛',
     scoreA: 0,
     scoreB: 0,
     teamA:'队伍A',
     teamB:'队伍B',
     teamAid:1,
     teamBid:2,
     players:[
       {teamID:1,playerID:1,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:2,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:3,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:4,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:5,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:6,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:7,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:8,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:9,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:10,score:0,yellowCard:0,redCard:0},
       {teamID:1,playerID:11,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:1,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:2,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:3,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:4,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:5,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:6,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:7,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:8,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:9,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:10,score:0,yellowCard:0,redCard:0},
       {teamID:2,playerID:11,score:0,yellowCard:0,redCard:0}
     ]
  },
  /*点击进球时的函数*/
  btnGoalTape(e){
    let playerId=e.currentTarget.dataset.playerid;
    let teamId=e.currentTarget.dataset.teamid;
    // 遍历players数组，找到对应的球员并更新其score  
    let updatedPlayers = this.data.players.map(player => {  
      if (player.playerID === parseInt(playerId)&&player.teamID===parseInt(teamId)) {
        player.score += 1;  
      }  
      return player;  
    });  
    this.setData({  
      players: updatedPlayers  
    });
    this.updateTeamScore()  
  },
  /*点击黄牌时的函数*/
  btnYellowTape(e){
    let playerId=e.currentTarget.dataset.playerid;
    let updatedPlayers = this.data.players.map(player => {  
      if (player.playerID === parseInt(playerId)) {
        player.yellowCard += 1;  
      }  
      return player;  
    });  
    this.setData({  
      players: updatedPlayers  
    });
  },
  /*点击红牌时的函数*/
  btnRedTape(e){
    console.log(e)
    let playerId=e.currentTarget.dataset.playerid;
    let updatedPlayers = this.data.players.map(player => {  
      if (player.playerID === parseInt(playerId)) {
        player.redCard += 1;  
      }  
      return player;  
    });  
    this.setData({  
      players: updatedPlayers  
    });
  },
  /*更新总比分*/
  updateTeamScore:function(){
    let scores = {  
      team1: 0, // 队伍A的比分  
      team2: 0  // 队伍B的比分  
    }; 
    this.data.players.forEach(player => {  
      if (player.teamID === this.data.teamAid) {  
        scores.team1 += player.score;  
      } else if (player.teamID === this.data.teamBid) {  
        scores.team2 += player.score;  
      }  
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