// pages/addPlayer/addPlayer.js
const app = getApp();
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    // 判断搜索框是否为空，搜索框中有内容则显示删除按钮
    empty: true,
    searchedPlayer: [
      {name: "gf", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "gf", sno:"21041014",score: 10,red:4,yellow:3},
      {name: "el", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "pp", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "qq", sno:"21041015",score: 10,red:4,yellow:3}
    ],
    foundPlayer:null,
    //用于记录被搜索的球员是否在球员数据库中
    selectedIndex: 0,
    playerData:null
  },

  inputChange: function(e) {
    const inputValue = e.detail.value;
    const searchValue = inputValue.toLowerCase();
    if (inputValue=='') {
      this.setData({
        inputValue: inputValue,
        empty: true,
        foundPlayer:null,
        playerData:null
      });
      return;
    }
    this.setData({
      inputValue: inputValue,
      empty: false,
      selectedIndex:0,
    });
    this.queryPlayerData();
  },

  async queryPlayerData() {
    try {
      const escapeValue = this.escapeSQLInjection(this.data.inputValue);
      const res = await wx.cloud.callFunction({
        name: 'searchedPlayer_DB', // 替换为你的云函数名称
        data: {
          name: escapeValue
        }
      });
      if (res.result.success) {
        this.setData({
          playerData: res.result.data,
          foundPlayer: res.result.data.length > 0 ? res.result.data[this.data.selectedIndex] : null
        });
      } else {
        this.setData({
          playerData:null
        })
      }
    } catch (error) {
      console.error('调用云函数失败', error);
      wx.showToast({
        title: '调用云函数失败',
        icon: 'none'
      });
    }
  },

  escapeSQLInjection(str) {
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
          return "\\" + char; // Prepends a backslash to backslash, percent,
                              // and double/single quotes
      }
    });
  },

  searchAction: function() {
    //不一定会用
  },

  selectPlayer: function (e) {
    const index = e.currentTarget.dataset.index;
    const player = this.data.playerData[index];
    if (player) {
      this.setData({
        foundPlayer: player,
        selectedIndex: index, // 更新选中的索引
      });
    }
  },

  clearSearch: function() {
    this.setData({
      inputValue: '',
      empty: true,
      foundPlayer: null,
      playerData:null

    });
  },

 
  addPlayer: function() {
    //在这里写添加成员的逻辑
    //foundPlayer这个变量为被添加的球员，定义在了data中
    //现在只需要判断一下foundPlayer是不是为空就可以了，不为空就进行数据库的添加操作
    //后端逻辑：如果foundPlayer已经在本队了则返回0，如果foundPlayer不在本队则返回1
    if(this.data.foundPlayer!=null){
      const playerNumber = this.data.foundPlayer.number;
      const playerId = this.data.foundPlayer._id;
      this.addPlayer_DB(playerNumber,playerId);
    }
    else{
      wx.showToast({
        title: '请输入想要添加的球员',
        icon:"none",
        duration: 2000
      });
    }
    
  },
  
  // 获取当前用户的 OpenID
  getOpenId: function() {
    return wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(res => res.result.openid);
  },

  addPlayer_DB:async function(recv_id, player_id){
        const db = wx.cloud.database()
       // const openid = await this.getOpenId();
        // 查询符合条件的messageId
        const _ = db.command;
        // const messageResult = await db.collection('user').where({
        //     _id: openid
        //   }).get();
        const messageId = app.globalData.userInfo.studentID;
        //const messageId = "21212121";
        const leaderResult = await db.collection('teamleader').where({
          number: messageId
        }).get();
        const leaderID = leaderResult.data[0]._id;
        const teamResult = await db.collection('leader_manage_team').where({
          teamleader_id: leaderID
        }).get();
        const teamID = teamResult.data[0].team_id;
        try{
          const SearchRes = await db.collection('team_player').where({
            player_id: player_id,
            team_id: teamID
          }).get();
    console.log(SearchRes);
          if(SearchRes.data.length > 0 ){
            wx.showToast({
              title: '对方已有队伍',
              icon:"error",
              duration: 1000
            });
            return;
          }
        }catch{
        }
        const teamNameResult = await db.collection('team').where({
          team_id: teamID
        }).get();
        const teamName = teamNameResult.data[0].team_name;
        console.log(messageId);
        console.log(recv_id);
        console.log(teamName);
        const currentTime = new Date();
    
        // 创建新记录对象
        const newRecord = {
          send_id: messageId,
          recv_id: recv_id,
          player_id: player_id,
          time: currentTime,
          team: teamName,
          team_id: teamID,
          status: "待定"
        };
    
        await db.collection('message').add({
          data:newRecord
        });
        console.log("success");
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
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