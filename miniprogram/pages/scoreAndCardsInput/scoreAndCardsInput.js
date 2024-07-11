// pages/scoreAndCardsInput/scoreAndCardsInput.js
const db = wx.cloud.database()
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
    race:"",
    turn:1,
    teamAid:1,
    teamBid:2,
    playerA:[
      {teamID:"id1",playerCode:1,score:0,yellowCard:0,redCard:0},
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
      {teamID:"id2",playerCode:1,score:0,yellowCard:0,redCard:0},
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
        this.btnYellowAdd_DB(playerCode,teamID)
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
      this.btnYellowMinus_DB(playerCode,teamID)
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
  btnRedAdd_DB: function(player_num,team_id) {
    try{
      //球员积分表指定球员增加红牌
      db.collection('player_score_list').where({
        player_num: player_num.toString(),
        team_id: team_id
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
    }catch (error) {
      console.error('操作失败:', error);
    }
  },
  //取消红牌
  btnRedMinus_DB: function(player_num,team_id) {
    try{
      //球员积分表指定球员减少红牌
      db.collection('player_score_list').where({
        player_num: player_num.toString(),
        team_id: team_id
      }).update({
        data: {
          red:db.command.inc(-1)
        },
        success(res) {
          console("判罚成功")
        },
        fail(err) {
          console("判罚失败")
        }
      })
    }catch (error) {
      console.error('操作失败:', error);
    }
  },
  //黄牌
  btnYellowAdd_DB: function(player_num,team_id) {
    try{
      //球员积分表指定球员增加黄牌
      db.collection('player_score_list').where({
        player_num: player_num.toString(),
          team_id: team_id
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
              team_id: team_id
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
  btnYellowMinus_DB: function(player_num,team_id) {
    try{
      //球员积分表指定球员增加黄牌
      db.collection('player_score_list').where({
        player_num: player_num.toString(),
          team_id: team_id
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
              team_id: team_id
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInfo();
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
  // 获取OpenID并查询messageId和比赛信息
  getInfo: async function() {
    try {
      // 获取当前用户的OpenID
      const openid = await this.getOpenId();
      console.log(openid)
      // 查询符合条件的messageId
      const _ = db.command;
      const messageResult = await db.collection('judge').where({
        finished: false,
        judgeid: openid
      }).get();
      console.log(messageResult)

      if (messageResult.data.length > 0) {
        const messageId = messageResult.data[0].matchid;

        // 根据messageId查询比赛信息
        const matchResult = await db.collection("matchInfo").where({
          raceId: messageId
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
            teamAid:match.teamA_id,
            teamBid:match.teamB_id
          });
        } else {
          console.log('没有找到对应的比赛信息');
        }
      } else {
        console.log('没有找到符合条件的信息');
      }
    } catch (error) {
      console.error('查询失败:', error);
    }
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