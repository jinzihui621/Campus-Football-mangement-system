// pages/homePage/homePage.js
Page({
  data: {
		matches: []  // 存储比赛信息
  },

  onLoad(options) {
		this.getMatches();
  },

	getMatches: function() {
    var that = this;
    // wx.request({
    //   url: 'https://your-backend-api.com/getMatches', // 替换为你的后端接口地址
    //   method: 'GET',
    //   success: function(res) {
    //     if (res.statusCode === 200) {
    //       // 假设返回的数据在 res.data 中
    //       that.setData({
    //         matches: res.data
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
})