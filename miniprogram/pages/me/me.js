const app = getApp()

Page({
  data: {
		userInfo: app.globalData.userInfo,
		userRole: app.globalData.userRole
  },

  onLoad: function() {
		const loginFlag = app.globalData.loginFlag
		if (loginFlag === 0) {
			let targetUrl = '/pages/me/login';
			wx.redirectTo({
				url: targetUrl
			});
		}
		
		this.setData({ 
			userInfo: app.globalData.userInfo,
			userRole: app.globalData.userRole
		});

  },

receive_DB:async function(){
  const db = wx.cloud.database()
  // 查询符合条件的messageId
  const _ = db.command;
  const messageId = app.globalData.userInfo.studentID;
  console.log(messageId);
  const msgResult = await db.collection('message').where({
    recv_id: messageId,
    status: "待定"
  }).get();
  if(msgResult.data.length > 0){
    wx.showToast({
      title: '有新消息',
      icon:'none',
      duration:1000
    })
  }
},

	onShow: function() {
		this.setData({ 
			userInfo: app.globalData.userInfo,
			userRole: app.globalData.userRole
    });
    this.receive_DB();
	},
	
	navigateToMessages: function() {
    wx.navigateTo({
      url: '/pages/messageList/messageList'
    });
  },

  navigateToChooseAccount: function() {
    wx.navigateTo({
      url: '/pages/chooseAccount/chooseAccount'
    });
	},
	
	navigateToEditProfile: function() {
    wx.navigateTo({
      url: '/pages/editProfile/editProfile'
    });
	},
});
