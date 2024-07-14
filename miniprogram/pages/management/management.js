// pages/index/index.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    userRole: '',
    matchId:"",
    team1:"",
    team2:"",
    place:"",
    time:"",
    notices:null,
    matches:null,
    deleteFlag: false,
    player:{
      name:"",
      tno:"",
    },
    member:[],
    leaderId: '',
    currentIndex: 0,
    teamA:'队伍A',
    teamB:'队伍B',
    scoreA:0,
    scoreB:0,
    matchTime:'07-07 00:00',
    match:'xx杯',
    race:"",
    turn:1,
    teamAid:1,
    teamBid:2,
    playerA:[],
    playerB:[],
  },
  
  onLoad: function() {
    this.setData({
			userRole: app.globalData.userRole
    });
    this.getOpenId().then(openid => {
      this.setData({ leaderId: openid });
      this.loadMember(); // 在获取到 openid 后加载成员信息
    });
    this.getInfo();
  },

  onShow: function() {
		this.setData({ 
      userRole: app.globalData.userRole
    });
    this.loadNotices();
    this.loadMatches();
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

  async loadNotices() {
    //！！！！！！这里的player_id后面需要替换成该用户的openid
    const player_id = "id1";
    try {
      // 获取球员所属队伍的 team_id
      const teamPlayerRes = await db.collection('team_player').where({
        player_id: player_id
      }).get();

      if (teamPlayerRes.data.length === 0) {
        wx.showToast({
          title: '未找到对应的队伍',
          icon: 'none'
        });
        return;
      }

      const team_id = teamPlayerRes.data[0].team_id;

      // 获取该队伍的所有公告
      const noticesRes = await db.collection('leader_manage_team').where({
        team_id: team_id
      }).orderBy('time', 'desc').get();

      if (noticesRes.data.length === 0) {
        wx.showToast({
          title: '没有公告',
          icon: 'none'
        });
        return;
      }

      this.setData({
        notices: noticesRes.data.map(notice => {
          //调整日期格式
          const date = new Date(notice.time);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          return {
            time: `${formattedDate} ${formattedTime}`,  // 格式化时间
            content: notice.notice
          };
        })
      });

    } catch (err) {
      console.error('加载公告数据失败', err);
      wx.showToast({
        title: '加载公告数据失败',
        icon: 'none'
      });
    }
  },

  async loadMatches() {
    const player_id = "id1"; // 当前球员的 player_id
    try {
      // 1. 获取当前球员的 team_id
      const teamPlayerRes = await db.collection('team_player').where({
        player_id: player_id
      }).get();
      if (teamPlayerRes.data.length === 0) {
        wx.showToast({
          title: '未找到该球员所属的队伍',
          icon: 'none'
        });
        return;
      }
      const team_id = teamPlayerRes.data[0].team_id;
      // 2. 根据 team_id 获取所有相关的比赛信息
      const matchRes = await db.collection('matchInfo').where({
        $or: [
          { teamA_id: team_id },
          { teamB_id: team_id }
        ]
      }).get();
      const matches = matchRes.data.map(match => ({
        teamA: match.teamA,
        teamB: match.teamB,
        matchTime: this.formatDate(match.matchTime),
        place: match.place,
        match_id:match.match_id
      }));

      // 3. 设置数据到页面中
      this.setData({
        matches: matches
      });

    } catch (err) {
      console.error('加载比赛数据失败', err);
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    }
  },

  formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  },

  joinGame_DB:function(e){
    
    try{
      var player_id = "id1";//学号 
      var match_id = e.currentTarget.dataset.match_id;//比赛ID
      db.collection('team_player').where({
        player_id: player_id
      }).get({
        success(res) {
          const doc = res.data[0]
          console.log(res)
          if(doc){
            var newData = {
                match_id:match_id,
                player_num:doc.player_num,
                red:0.0,
                score:0.0,
                team_id:doc.team_id,
                yellow:0.0
            }
            db.collection('player_score_list').add({
              data:newData,
              success(res) {
                wx.showToast({
                  title: '添加成功',
                  icon: 'none'
                });
                console.log('添加成功');
              },
              fail(err) {
                wx.showToast({
                  title: '球员已参赛',
                  icon: 'none'
                });
                console.error('添加失败', err);
              }
            });
          } else {
            wx.showToast({
              title: '学号错误',
              icon: 'none'
            });
            console.log('未找到学号对应记录');
          }
      },
        fail(err) {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          });
          console.error('添加失败', err);
          // 处理查询失败的情况
        }
      });
    } catch (err) {
      console.error('添加操作出错', err);
      // 处理异常情况
    }
  },

  async loadMember(e) {
    const db = wx.cloud.database();
    try {
      // 获取 team_id
      const leaderRes = await db.collection('leader_manage_team').where({
        teamleader_id: "id1"
      }).get();

      if (leaderRes.data.length === 0) {
        wx.showToast({
          title: '未找到对应的团队',
          icon: 'none'
        });
        return;
      }

      const team_id = leaderRes.data[0].team_id;

      // 获取所有球员的 player_id
      const teamPlayerRes = await db.collection('team_player').where({
        team_id: team_id
      }).get();

      if (teamPlayerRes.data.length === 0) {
        wx.showToast({
          title: '未找到球员',
          icon: 'none'
        });
        return;
      }

      const playerIds = teamPlayerRes.data.map(item => item.player_id);

      // 获取每个球员的详细信息
      const playerPromises = playerIds.map(async playerId => {
        const playerRes = await db.collection('player').doc(playerId).get();
        return {
          name: playerRes.data.name,
          number: playerRes.data.number,
          player_num: playerRes.data.player_num,
          player_id:playerRes.data._id
        };
      });

      const players = await Promise.all(playerPromises);

      console.log('Loaded players:', players);
      this.setData({
        member: players
      });
    } catch (err) {
      console.error('加载球员数据失败', err);
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    }
  },



  navigateToSchedule: function() {
    wx.navigateTo({
      url: '/pages/soccerSchedule/soccerSchedule'  // 这里替换成实际的路径
    });
  },

  toPlus(){
    wx.navigateTo({
      url: '/pages/addPlayer/addPlayer' // 目标页面的路径
    });
  },

  gotoUpdate(){
    wx.navigateTo({
      url: '/pages/updateJerseyNumber/updateJerseyNumber' // 目标页面的路径
    });
  },

  toDelete(e){
    this.setData({
      deleteFlag: !this.data.deleteFlag

    })
  },

   getOpenId: function() {
        return wx.cloud.callFunction({
          name: 'getOpenid'
        }).then(res => res.result.openid);
  },

  //球队管理员删除球员
  async deletePlayer_DB(e){
    // 显示确认框
    wx.showModal({
      title: '确认删除',
      content: '你确定要删除这个球员吗？',
      success: async (res) => {
        if (res.confirm) {
          const self = this;
          try {
            var player_id = e.currentTarget.dataset.info1; 
            var _id = "id1";
            db.collection('leader_manage_team').where({
              _id: _id
            }).get({
              success(res) {
                const doc = res.data[0]
                if(doc){
                  db.collection('team_player').where({
                    team_id: doc.team_id,
                    player_id: player_id
                  }).remove({
                    success(res) {
                      wx.showToast({
                        title: '删除成功',
                        icon: 'none'
                      });
                      self.setData({
                        member: self.data.member.filter(player => player.player_id !== player_id)
                      });
                    },
                    fail(err) {
                      wx.showToast({
                        title: '球员号错误',
                        icon: 'none'
                      });
                      console.error('删除失败', err);
                    }
                  });
                } else {
                  wx.showToast({
                    title: '球队管理者ID错误',
                    icon: 'none'
                  });
                  console.log('未找到该记录');
                }
              },
              fail(err) {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
                console.error('查询失败', err);
                // 处理查询失败的情况
              }
            });
          } catch (err) {
            console.error('删除操作出错', err);
            // 处理异常情况
          }
          console.log(111);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
        this.btnGoalMinus_DB(playerCode,teamID,this.data.race);
        newPlayers[index].score--;  
      }else{
        wx.showToast({
          title: '不能继续减少',
          icon:'none',
          duration:1000
        })
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
    console.log(index) 
    //console.log(playercode)
    console.log(playerCode)
    if (index !== -1) {  
      const newPlayers = [...players];
      this.btnGoalAdd_DB(playerCode,teamID,this.data.race);
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
      if(players[index].yellowCard < 2){
        this.btnYellowAdd_DB(playerCode,teamID,this.data.race)
        newPlayers[index].yellowCard++;
      }else{
        wx.showToast({
          title: '单个队员黄牌数达上限',
          icon:"none",
          duration:1000
        })
      }
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
      this.btnYellowMinus_DB(playerCode,teamID, this.data.race)
      newPlayers[index].yellowCard--;  
      this.setData({  
        [teamID === this.data.teamAid ? 'playerA' : 'playerB']: newPlayers  
      });  
    }else if(players[index].yellowCard <= 0){
      wx.showToast({
        title: '不能继续减少',
        icon:"none",
        duration:1000
      })
    }
  },
  /*点击红牌+时的函数*/
  btnRedAdd(e){
    const { playercode: playerCode, teamid: teamID } = e.currentTarget.dataset;  
    const players = this.data[teamID === this.data.teamAid ? 'playerA' : 'playerB'];  
    const index = players.findIndex(player => player.playerCode === parseInt(playerCode, 10));  
    if (index !== -1) {  
      const newPlayers = [...players];
      if(players[index].redCard < 1){
        this.btnRedAdd_DB(playerCode,teamID)
        newPlayers[index].redCard++;  
      }
      else{
        wx.showToast({
          title: '单个队员红牌数已达上限',
          icon:'none',
          duration:1000
        })
      }
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
      this.btnRedMinus_DB(playerCode,teamID)
      newPlayers[index].redCard--;  
      this.setData({  
        [teamID === this.data.teamAid ? 'playerA' : 'playerB']: newPlayers  
      });  
    }else if(players[index].redCard <= 0){
      wx.showToast({
        title: '不能继续减少',
        icon:"none",
        duration:1000
      })
    }
  },
  // 获取当前用户的 OpenID
  getOpenId: function() {
    return wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(res => res.result.openid);
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

  //裁判员记录进球
  btnGoalAdd_DB: function(player_num,team_id,match_id) {
    //球员积分表指定球员加分
    console.log(player_num)
    console.log(team_id)
    console.log(match_id)
    db.collection('player_score_list').where({
      player_num: player_num.toString(),
      team_id: team_id
    }).update({
      data: {
        score:db.command.inc(1)
      },
      success(res) {
        console("player_score_list加分成功")
      },
      fail(err) {
        console("player_score_list加分失败")
      }
    })
    //进球球员球队
    db.collection('team_match_participate').where({
      match_id : match_id,
      team_id : team_id
    }).update({
      data: {
        goal:db.command.inc(1)
      },
      success(res) {
        console("team_match_participate加分成功")
      },
      fail(err) {
        console("team_match_participate加分失败")
      }
    })
    //球队表进球数加一
    db.collection('team').where({
      team_id : team_id
    }).update({
      data: {
        goal_num:db.command.inc(1)
      },
      success(res) {
        console("team_match_participate加分成功")
      },
      fail(err) {
        console("team_match_participate加分失败")
      }
    })
    //matchInfo teamA加分
    db.collection('matchInfo').where({
      teamA_id : team_id
    }).update({
      data: {
        scoreA:db.command.inc(1)
        
      },
      success(res) {
        console("matchInfo_teamB加分成功")
      },
      fail(err) {
        console("matchInfo_teamB加分失败")
      }
    })
    //matchInfo teamB加分
    db.collection('matchInfo').where({
      teamB_id : team_id
    }).update({
      data: {
        scoreB:db.command.inc(1)
      },
      success(res) {
        console("matchInfo_teamB加分成功")
      },
      fail(err) {
        console("matchInfo_teamB加分失败")
      }
    })
  },
  //裁判员记录减分
  btnGoalMinus_DB: function(player_num,team_id,match_id){
    //球员积分表指定球员减
    db.collection('player_score_list').where({
      player_num: player_num.toString(),
      team_id: team_id}).get({
      success(res) {
        const doc = res.data[0]
        console.log(doc.score)
        if (doc.score === 0){
          wx.showToast({
            title: 'score = 0',
            icon: 'none'
          });
        }
        else{
          db.collection('player_score_list').where({
            player_num: player_num.toString(),
            team_id: team_id
          }).update({
            data: {
              score:db.command.inc(-1)
            },
            success(res) {
              console.log(res)
              console.log("player_score_list减分成功")
            },
            fail(err) {
              ///console.error("player_score_list减分失败")
            }
          })
        }
      }})
    //进球球员球队
    db.collection('team_match_participate').where({
      team_id: team_id}).get({
      success(res) {
        const doc = res.data[0]
        if (doc.score === 0){
          wx.showToast({
            title: 'score = 0',
            icon: 'none'
          });
        }
        else{
          db.collection('team_match_participate').where({
            match_id : match_id,
            team_id : team_id
          }).update({
            data: {
              goal:db.command.inc(-1)
            },
            success(res) {
              console.log("team_match_participate减分成功")
            },
            fail(err) {
              console.error("team_match_participate减分失败")
            }
          })
        }
      }})
    //球队表进球数减一
    db.collection('team').where({
      team_id: team_id}).get({
      success(res) {
        const doc = res.data[0]
        if (doc.score === 0){
          wx.showToast({
            title: 'score = 0',
            icon: 'none'
          });
        }
        else{
          db.collection('team').where({
            team_id : team_id
          }).update({
            data: {
              goal_num:db.command.inc(-1)
            },
            success(res) {
              console.log("team减分成功")
            },
            fail(err) {
              console.error("team减分失败")
            }
          })
        }
      }})
    //matchInfo teamA减分
    db.collection('matchInfo').where({
      teamA_id: team_id}).get({
      success(res) {
        const doc = res.data[0]
        if (doc.score === 0){
          wx.showToast({
            title: 'score = 0',
            icon: 'none'
          });
        }
        else{
          db.collection('matchInfo').where({
            teamA_id : team_id
          }).update({
            data: {
              scoreA:db.command.inc(-1)
            },
            success(res) {
              console.log("matchInfo_teamA减分成功")
            },
            fail(err) {
              //console.error("matchInfo_teamA减分失败")
            }
          })
        }
      }
      })
    //matchInfo teamB减分
    db.collection('matchInfo').where({
      teamB_id: team_id}).get({
      success(res) {
        const doc = res.data[0]
        if (doc.score === 0){
          wx.showToast({
            title: 'score = 0',
            icon: 'none'
          });
        }
        else{
          db.collection('matchInfo').where({
            teamB_id : team_id
          }).update({
            data: {
              scoreA:db.command.inc(-1)
            },
            success(res) {
              console.log("matchInfo_teamB减分成功")
            },
            fail(err) {
              console.error("matchInfo_teamB减分失败")
            }
          })
        }
      }
      })
  },
  //红牌
  //红牌
  btnRedAdd_DB: async function(player_num, team_id, match_id) {
      try{
        const res = await db.collection('player_score_list').where({
          player_num: player_num.toString(),
          team_id: team_id,
          match_id: match_id
        }).get();
         // 假设只会有一个表项
        let player = res.data[0];
        if(player.red === 0){
          //球员积分表指定球员加分
          await db.collection('player_score_list').where({
            player_num: player_num.toString(),
            team_id: team_id,
            match_id: match_id
          }).update({
            data: {
              red:db.command.inc(1)
            },
            success(res) {
              console("判罚成功")
            },
            fail(err) {
              console("判罚失败")
            }
          })
      }
      else{
        wx.showToast({
          title: '红牌数已为1，无法增加',
          icon: 'none'
        });
      }
      }catch (error) {
        console.error('操作失败:', error);
      }
   },
    //取消红牌
  btnRedMinus_DB: async function(player_num, team_id, match_id) {
      try{
        const res = await db.collection('player_score_list').where({
          player_num: player_num.toString(),
          team_id: team_id,
          match_id: match_id
        }).get();
         // 假设只会有一个表项
        let player = res.data[0];
        if(player.red === 1){
          //球员积分表指定球员加分
          await db.collection('player_score_list').where({
            player_num: player_num.toString(),
            team_id: team_id,
            match_id: match_id
          }).update({
            data: {
              red:db.command.inc(-1)
            },
            success(res) {
              console("取消判罚成功")
            },
            fail(err) {
              console("取消判罚失败")
            }
          })
      }
      else{
        wx.showToast({
          title: '红牌数已为0，无法减少',
          icon: 'none'
        });
      }
      }catch (error) {
        console.error('操作失败:', error);
      }
   },
  //黄牌
  btnYellowAdd_DB: function(player_num,team_id,match_id) {
    try{
      //球员积分表指定球员增加黄牌
      db.collection('player_score_list').where({
        player_num: player_num.toString(),
          team_id: team_id,
          match_id:match_id
      }).get({
        success(res) {
          const doc = res.data[0]
          if (doc.yellow === 2 ){
            wx.showToast({
              title: 'yellow = 2',
              icon: 'none'
            });
          }
          else{
            db.collection('player_score_list').where({
              player_num: player_num.toString(),
              team_id: team_id,
              match_id: match_id
            }).update({
              data: {
                yellow:db.command.inc(1)
              },
              success(res) {
                console("判罚成功")
              },
              fail(err) {
                console("判罚失败")
              }
            })
          }
        }
      })
    }catch (error) {
      console.error('操作失败:', error);
    }
  },
  //取消黄牌
  btnYellowMinus_DB: function(player_num,team_id,match_id) {
    try{
      //球员积分表指定球员增加黄牌
      db.collection('player_score_list').where({
        player_num: player_num.toString(),
          team_id: team_id,
          match_id: match_id
      }).get({
        success(res) {
          const doc = res.data[0]
          if (doc.yellow === 0 ){
            wx.showToast({
              title: 'yellow = 0',
              icon: 'none'
            });
          }
          else{
            db.collection('player_score_list').where({
              player_num: player_num.toString(),
              team_id: team_id,
              match_id: match_id
            }).update({
              data: {
                yellow:db.command.inc(-1)
              },
              success(res) {
                wx.showToast({
                  title: '消罚成功',
                  icon: 'none'
                });
                console("消罚成功")
              },
              fail(err) {
                wx.showToast({
                  title: '消罚失败',
                  icon: 'none'
                });
                console("消罚失败")
              }
            })
          }
        }
      })
    }catch (error) {
      console.error('操作失败:', error);
    }
  },

  getInfo: async function() {
    try {
      // 获取当前用户的OpenID
      const openid = await this.getOpenId();
      console.log(openid)
      // 查询符合条件的messageId
      const _ = db.command;
      const messageResult = await db.collection('judge').where({
        finished: false,
        judgeid: "id2"
      }).get();
      console.log(messageResult)

      if (messageResult.data.length > 0) {
        const messageId = messageResult.data[0].match_id;

        // 根据messageId查询比赛信息
        const matchResult = await db.collection("matchInfo").where({
          match_id: messageId
        }).get();

        if (matchResult.data.length > 0) {
          const match = matchResult.data[0];
          this.setData({
            match: match.event_name,
            turn: match.turn,
            race: match.match_id,
            matchTime: match.matchTime.toLocaleDateString(),
            teamA: match.teamA,
            teamB: match.teamB,
            scoreA: match.scoreA,
            scoreB: match.scoreB,
            teamAid: match.teamA_id,
            teamBid: match.teamB_id
          });
        } else {
          console.log('没有找到对应的比赛信息');
        }
        try {
          const resA = await db.collection('player_score_list').where({
            team_id: this.data.teamAid,
            match_id:this.data.race
          }).get();
    
          if (resA.data.length > 0) {
            const updatedPlayerA = resA.data.map(item => ({
              teamID: item.team_id,
              playerCode: Number(item.player_num),
              score: item.score,
              yellowCard: item.yellow,
              redCard: item.red
            }));
            this.setData({
              playerA: updatedPlayerA
            });
          } else {
            console.log('没有找到符合条件的数据');
          }
          const resB = await db.collection('player_score_list').where({
            team_id: this.data.teamBid,
            match_id:this.data.race
          }).get();
    
          if (resB.data.length > 0) {
            const updatedPlayerB = resB.data.map(item => ({
              teamID: item.team_id,
              playerCode: Number(item.player_num),
              score: item.score,
              yellowCard: item.yellow,
              redCard: item.red
            }));
    
            this.setData({
              playerB: updatedPlayerB
            });
          } else {
            console.log('没有找到符合条件的数据');
          }
        } catch (error) {
          console.error('查询失败:', error);
        }
      } else {
        console.log('没有找到符合条件的信息');
      }
    } catch (error) {
      console.error('查询失败:', error);
    }
  },


  startMatch_DB:function(){
    db.collection('judge').where({
      match_id: this.data.race
    }).update({
      data: {
        started:true
      },
      success(res) {
        console("成功")
      },
      fail(err) {
        console("失败")
      }
    })
  },

  endMatch_DB:async function(){
    const _ = db.command;
    try {
      await db.collection('judge').where({
        match_id: this.data.race
      }).update({
        data: {
          finished:true,
          started:false
        },
        success(res) {
          console("成功")
        },
        fail(err) {
          console("失败")
        }
      })
      // 获取 A 队和 B 队的当前数据
      const [teamAData, teamBData] = await Promise.all([
        db.collection('team').where({ team_id: this.data.teamAid }).get(),
        db.collection('team').where({ team_id: this.data.teamBid }).get()
      ]);

      if (teamAData.data.length === 0 || teamBData.data.length === 0) {
        console.error('未找到对应的队伍数据');
        return;
      }

      let teamA_t = teamAData.data[0];
      let teamB_t = teamBData.data[0];

      // 更新数据
      if (this.data.scoreA > this.data.scoreB) {
        // A 胜，B 败
        teamA_t.vic_num += 1;
        teamB_t.lose_num += 1;
        teamA_t.score += 3;
      } else if (this.data.scoreA < this.data.scoreB) {
        // A 败，B 胜
        teamA_t.lose_num += 1;
        teamB_t.vic_num += 1;
        teamB_t.score += 3;
      } else {
        // 平局
        teamA_t.draw_num += 1;
        teamB_t.draw_num += 1;
        teamA_t.score += 1;
        teamB_t.score += 1;
      }

      // 更新进球和失球数据
      teamA_t.goal_num += this.data.scoreA;
      teamA_t.fumble_num += this.data.scoreB;
      teamB_t.goal_num += this.data.scoreB;
      teamB_t.fumble_num += this.data.scoreA;

      teamA_t.match_num += 1;
      teamB_t.match_num += 1;

      // 更新数据库
      await Promise.all([
        db.collection('team').doc(teamA_t._id).update({
          data: {
           // _id: teamA_t._id,
            vic_num: teamA_t.vic_num,
            lose_num: teamA_t.lose_num,
            draw_num: teamA_t.draw_num,
            goal_num: teamA_t.goal_num,
            fumble_num: teamA_t.fumble_num,
            score: teamA_t.score,
            team_id: teamA_t.team_id,
            team_name: teamA_t.team_name,
            match_num: teamA_t.match_num
          }
        }),
        db.collection('team').doc(teamB_t._id).update({
          data: {
            //_id: teamB_t._id,
            vic_num: teamB_t.vic_num,
            lose_num: teamB_t.lose_num,
            draw_num: teamB_t.draw_num,
            goal_num: teamB_t.goal_num,
            fumble_num: teamB_t.fumble_num,
            score: teamB_t.score,
            team_id: teamB_t.team_id,
            team_name: teamB_t.team_name,
            match_num: teamB_t.match_num
          }
        })
      ]);

      console.log('数据更新成功');
      this.getInfo();
    } catch (error) {
      console.error('数据更新失败:', error);
    }
  },

})
