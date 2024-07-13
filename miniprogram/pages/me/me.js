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

	onShow: function() {
		this.setData({ 
			userInfo: app.globalData.userInfo,
			userRole: app.globalData.userRole
		});
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
