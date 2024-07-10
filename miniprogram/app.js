// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
		})
		
		// 初始化全局用户信息
    this.globalData = {
      userInfo: {
        avatarUrl: '/image/page_me/default_avatar.png', // 默认头像
        nickname: '爱踢球的工大人'
      },
      userRole: '球员',
      loginFlag: 1,
      currentPage: 'page4' // 默认页面
    }
  },
  globalData: {
		userInfo: null,
		userRole: null,
    loginFlag: null,
    currentPage: null // 默认页面
  }
})
