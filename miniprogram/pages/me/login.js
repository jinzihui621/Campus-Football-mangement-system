Page({
  data: {
    logoSrc: '/image/logo.png' 
  },

  navigateToLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login' 
    });
  },

  navigateToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register' 
    });
  }
});
