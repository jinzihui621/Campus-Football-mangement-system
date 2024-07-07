const app = getApp();

Page({
  data: {
    accounts: [
      {
        imgSrc: '/image/choose_account/team_manager.png',
        text: '球队管理账号',
        role: '球队管理'
      },
      {
        imgSrc: '/image/choose_account/player.png',
        text: '比赛球员账号',
        role: '球员'
      },
      {
        imgSrc: '/image/choose_account/referee.png',
        text: '比赛裁判账号',
        role: '裁判'
      },
      {
        imgSrc: '/image/choose_account/manager.png',
        text: '赛事管理账号',
        role: '赛事管理'
      }
    ]
  },

  onAccountClick: function(event) {
    const role = event.currentTarget.dataset.role;

    // 更新全局 flag
    app.globalData.userRole = role;

    // 跳转到“我的”页面
    wx.switchTab({
      url: '/pages/me/me'
    });
  }
});