const app = getApp()

Page({
  data: {
    userInfo: {
      avatarUrl: '/image/page_me/default_avatar.png', // 默认头像
      nickName: '用户昵称',
      role: ''
    }
  },

  onLoad: function() {
		const loginFlag = app.globalData.loginFlag
		if (loginFlag === 0) {
			let targetUrl = '/pages/me/login';
			wx.redirectTo({
				url: targetUrl
			});
		}
		
		this.setData({ userRole: app.globalData.userRole })
  },

	onShow: function() {
		this.setData({ userRole: app.globalData.userRole })
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
  }
});
