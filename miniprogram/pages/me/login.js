const app = getApp()

Page({
  data: {
    logoSrc: '/image/logo.png' 
  },

  navigateToLogin: function() {
		wx.navigateTo({
			url: '/pages/editProfile/editProfile' 
		});
		console.log("succ");
  },

  navigateToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register' 
    });
  }
});
