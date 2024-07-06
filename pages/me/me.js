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
    var that = this;
    // wx.request({
    //   url: 'https://your-backend-api.com/getUserInfo', // 替换为你的后端接口地址
    //   method: 'GET',
    //   success: function(res) {
    //     if (res.statusCode === 200) {
    //       let userInfo = res.data;
    //       // 如果用户没有设置头像，使用默认头像
    //       if (!userInfo.avatarUrl) {
    //         userInfo.avatarUrl = '/image/default_avatar.png';
    //       }
    //       that.setData({
    //         userInfo: userInfo
    //       });
    //     } else {
    //       console.error('获取数据失败', res);
    //     }
    //   },
    //   fail: function(err) {
    //     console.error('请求失败', err);
    //   }
    // });
  }
});
