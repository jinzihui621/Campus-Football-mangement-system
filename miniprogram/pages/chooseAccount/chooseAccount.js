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
    const userPermissions = app.globalData.userPermissions;

    if (userPermissions.includes(role)) {
      // 更新全局 userRole
      app.globalData.userRole = role;

      wx.showToast({
        title: '跳转成功',
        icon: 'success',
        duration: 1000
      });
      // 跳转到“我的”页面
			setTimeout(() => {
				wx.switchTab({
					url: '/pages/me/me'
				});
			}, 1000);
    } else {
      wx.showToast({
        title: '没有权限',
        icon: 'none',
        duration: 1000
      });
    }
  }
});
