Page({
  data: {
    userInfo: {
      avatarUrl: '/image/page_me/default_avatar.png', // 默认头像
      nickName: '用户昵称',
      role: '角色'
    }
  },

  onLoad: function() {
    this.getUserInfo();
  },

  getUserInfo: function() {

	},
	
  navigateToChooseAccount: function() {
    wx.navigateTo({
      url: '/pages/chooseAccount/chooseAccount'
    });
  }
});
