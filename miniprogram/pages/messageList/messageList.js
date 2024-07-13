const app = getApp();

Page({
  data: {
    messages: []
  },

update_DB:async function(){
  const db = wx.cloud.database()
  // 查询符合条件的messageId
  const _ = db.command;
  const messageId = app.globalData.userInfo.studentID;
  const msgResult = await db.collection('message').where({
    recv_id: messageId,
    status: "待定"
  }).get();
  if(msgResult.data.length > 0){
    const updateMsg = msgResult.data.map((item, index) => ({
      id: index + 1,
      title: '邀请加入'+item.team+'足球队',
      content: '是否加入',
      send_id: item.send_id,
      recv_id: item.recv_id,
      team_id: item.team_id,
      player_id: item.player_id,
      timestamp: item.time.toLocaleTimeString('en-US', { hour12: false,hour: '2-digit', minute: '2-digit'})
    }));
    this.setData({
      messages: updateMsg
    });
  }
},

  onShow: function() {
    this.update_DB();
	},

  navigateToMessageDetail: function(event) {
    const id = event.currentTarget.dataset.id;
    const messages = this.data.messages;
    wx.navigateTo({
      url: `/pages/messageDetail/messageDetail?id=${id}&messages=${encodeURIComponent(JSON.stringify(messages))}`
    });
  }
});
