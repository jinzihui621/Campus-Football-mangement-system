// pages/homePage/homePage.js
Page({
  data: {
		matches: [
			{
        day: "2024-07-11",
        starttime: "15:00",
        teamnameA: "信息A",
        teamnameB: "城建A",
        place: "北操"
			},
			{
        day: "2024-07-11",
        starttime: "15:00",
        teamnameA: "机电",
        teamnameB: "计算机",
        place: "北操"
			}
		]  
		// 存储比赛信息
		// 需要的信息示例如下：
		// "id": 1,   -->比赛id
		// "day": "2024-07-03",
		// "starttime": "12:00",
		// "place": "北操",
		// "teamA": "信息A",
		// "teamB": "信息B",
		// "scoreA": 3,
		// "scoreB": 1,
		// "game_running_flag": 1   -->比赛是否在进行
		// "game_finished_flag": 1  -->比赛是否已经结束
  },

  goToMatchDetail(event) {
    const { day, starttime, teamnamea, teamnameb, place } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/matchDetail/matchDetail?day=${day}&starttime=${starttime}&teamnameA=${teamnamea}&teamnameB=${teamnameb}&place=${place}`
    });
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