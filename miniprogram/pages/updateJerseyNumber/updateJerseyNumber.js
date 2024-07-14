// pages/updateJerseyNumber/updateJerseyNumber.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    member:null,
    formattedMembers: [],
    selectedMember: "",
    newJerseyNumber: ''
  },

  async updateJerseyNumber() {
    if (!this.data.selectedPlayer || !this.data.newJerseyNumber) {
      wx.showToast({
        title: '请选择球员并输入新的队服号',
        icon: 'none'
      });
      return;
    }
    const jerseyNumber = this.data.newJerseyNumber;
    // 检查球服号是否为数字并在有效范围内
    const isNumber = /^\d+$/.test(jerseyNumber);
    const jerseyNumberInt = parseInt(jerseyNumber, 10);
    if (!isNumber || jerseyNumberInt < 0 || jerseyNumberInt > 100) {
      wx.showToast({
        title: '球服号必须是0到100之间的数字',
        icon: 'none'
      });
      return;
    }
    // 防止SQL注入的字符转义
    const escapeSQLInjection = (str) => {
      return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
          case "\0":
            return "\\0";
          case "\x08":
            return "\\b";
          case "\x09":
            return "\\t";
          case "\x1a":
            return "\\z";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
            return "\\" + char;
        }
      });
    };
    const escapedJerseyNumber = escapeSQLInjection(jerseyNumber);
    const db = wx.cloud.database();
    try {
      // 获取 team_id 和原始的 player_num
      const teamPlayerRes = await db.collection('team_player').where({
        player_id: this.data.selectedPlayer.player_id
      }).get();
      const team_id = teamPlayerRes.data[0].team_id;
      const originalPlayerNum = this.data.selectedPlayer.player_id;
  
      // 更新 player 表中的 player_num
      await db.collection('player').doc(this.data.selectedPlayer.player_id).update({
        data: {
          player_num: escapedJerseyNumber
        }
      });
  
      // 更新 team_player 表中的 player_num
      await db.collection('team_player').where({
        player_id: this.data.selectedPlayer.player_id
      }).update({
        data: {
          player_num: escapedJerseyNumber
        }
      });
  
      // 更新 player_score_list 表中的 player_num
      await db.collection('player_score_list').where({
        team_id: team_id,
        _openid: originalPlayerNum
      }).update({
        data: {
          player_num: escapedJerseyNumber
        }
      });
  
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      });
  
      // 更新球员列表
      this.loadMember();
    } catch (err) {
      console.error('修改队服号失败', err);
      wx.showToast({
        title: '修改失败',
        icon: 'none'
      });
    }
  },
  
  onJerseyNumberInput(e) {
    this.setData({
      newJerseyNumber: e.detail.value
    });
  },

  onPlayerChange(e) {
    this.setData({
      selectedPlayer: this.data.member[e.detail.value]
    });
  },

  async loadMember() {
    try {
      // 获取 team_id
      const leaderRes = await db.collection('leader_manage_team').where({
        teamleader_id: this.data.userId
      }).get();
      console.log(leaderRes)
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
          player_id: playerRes.data._openid
        };
      });
      const players = await Promise.all(playerPromises);
      console.log('Loaded players:', players);
      // 设置 member 和 formattedMembers
      this.setData({
        member: players,
        formattedMembers: players.map(member => {
          return `${member.name} - 学号: ${member.number} - 球员号: ${member.player_num}`;
        })
      });
    } catch (err) {
      console.error('加载球员数据失败', err);
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    }
  },

   getOpenId: function() {
        return wx.cloud.callFunction({
          name: 'getOpenid'
        }).then(res => res.result.openid);
  },

   /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getOpenId().then(openid => {
      this.setData({ userId: openid });
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