const app = getApp();

Page({
  data: {
    accounts: [
      {
        imgSrc: '/image/choose_account/team_manager.png',
        text: '球队管理账号',
        role: 'team_manager'
      },
      {
        imgSrc: '/image/choose_account/player.png',
        text: '球员账号',
        role: 'player'
      },
      {
        imgSrc: '/image/choose_account/referee.png',
        text: '比赛裁判账号',
        role: 'referee'
      },
      {
        imgSrc: '/image/choose_account/manager.png',
        text: '赛事管理账号',
        role: 'manager'
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