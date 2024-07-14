// pages/list/list.js
const db = wx.cloud.database();
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
    member:[],
    leaderId: ''
  },

  async loadMember(e) {

    const db = wx.cloud.database();
    try {
      // 获取 team_id
      const leaderRes = await db.collection('leader_manage_team').where({
        teamleader_id: this.data.leaderId
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
          player_num: playerRes.data.player_num
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
          var player_num = e.currentTarget.dataset.info2; 
          var _id = "id1";
          console.log("11111111")
          db.collection('leader_manage_team').where({
            teamleader_id: this.data.leaderId
          }).get({
            success(res) {
              console.log("res:",res)
              const doc = res.data[0]
              if(doc){
                db.collection('team_player').where({
                  team_id: doc.team_id,
                  player_num: player_num
                }).remove({
                  success(res) {
                    wx.showToast({
                      title: '删除成功',
                      icon: 'none'
                    });
                    self.setData({
                      member: self.data.member.filter(player => player.player_num !== player_num)
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
                console.log(res);
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getOpenId().then(openid => {
      this.setData({ leaderId: openid });
      this.loadMember(); // 在获取到 openid 后加载成员信息
    });
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