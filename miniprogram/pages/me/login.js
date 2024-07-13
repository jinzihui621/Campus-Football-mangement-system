const app = getApp()

Page({
  data: {
    logoSrc: '/image/logo.png' 
  },

  navigateToLogin: function() {
    // 登录
    wx.login({
      success: res => {
        app.globalData.loginFlag = 1;
        wx.navigateTo({
          url: '/pages/editProfile/editProfile' 
        });
        console.log("succ");
      }
    });
  },

  navigateToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register' 
    });
  }
});
