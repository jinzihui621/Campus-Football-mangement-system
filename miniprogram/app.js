// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'campus-football-7gssthyk0ebee95a',
      traceUser: true,
    });

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 初始化全局用户信息
    this.globalData = {
      userInfo: {
        avatarUrl: '/image/page_me/default_avatar.png', // 默认头像
        nickname: '爱踢球的工大人',
        studentID: '00000000'
      },
      userRole: '赛事管理',
      loginFlag: 0,
      userPermissions: ['球员', '裁判', '球队管理'] // 假设用户拥有球员和裁判的权限
    }
  },
  globalData: {
    userInfo: null,
    userRole: null,  // 可取值："球员", "裁判", "赛事组织", "球队管理"
    loginFlag: null,
    currentPage: null,
    userPermissions: [] // 用户权限数组
  }
});
