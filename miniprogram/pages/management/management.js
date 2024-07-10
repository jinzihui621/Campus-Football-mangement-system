// pages/index/index.js
const app = getApp();

Page({
  data: {
    currentPage: '',
    messageList: [
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"},
      {time:"2024/7/7",content:"今天中午有比赛，请大家积极报名"}
    ],
    team1:"",
    team2:"",
    place:"",
    time:"",

    team: [
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操"},
      {team1:"经管",team2:"理学",time:"2024/7/7",place:"北操"},
      {team1:"都柏林",team2:"艺设",time:"2024/7/7",place:"北操"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操"},
      {team1:"信息",team2:"土木",time:"2024/7/7",place:"北操"},
    ],
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
  
  onLoad: function() {
    const cp = app.globalData.currentPage
    this.setData({
      currentPage: cp
    });
  },

  navigateToSchedule: function() {
    wx.navigateTo({
      url: '/pages/soccerSchedule/soccerSchedule'  // 这里替换成实际的路径
    });
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

  toPlus(){
    wx.navigateTo({
      url: '/pages/addPlayer/addPlayer' // 目标页面的路径
    });
  },

  toDelete(e){
    this.setData({
      deleteFlag: !this.data.deleteFlag

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
          wx.showToast({
            title: '删除成功',
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

})
