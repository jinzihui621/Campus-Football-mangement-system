// pages/player/player.js
const db = wx.cloud.database();
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
    notices:null,
    matches:null,

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

  async loadNotices() {
    //！！！！！！这里的player_id后面需要替换成该用户的openid
    const player_id = wx.cloud.callFunction({
            name: 'getOpenid'
          })
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
    this.loadNotices();
    this.loadMatches();
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