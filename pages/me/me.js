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
		this.getUserInfo();
		this.setData({ userRole: app.globalData.userRole })
  },

	onShow: function() {
		this.setData({ userRole: app.globalData.userRole })
	},

  getUserInfo: function() {

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
