// pages/homePage/homePage.js
Page({
  data: {
		matches: [
      {
        day: "2023-07-07",
        starttime: "15:00",
        endtime: "17:00",
        teamnameA: "Team A",
        teamnameB: "Team B",
        place: "Stadium 1"
      },
      {
        day: "2023-07-08",
        starttime: "16:00",
        endtime: "18:00",
        teamnameA: "Team C",
        teamnameB: "Team D",
        place: "Stadium 2"
      },
      {
        day: "2023-07-09",
        starttime: "17:00",
        endtime: "19:00",
        teamnameA: "Team E",
        teamnameB: "Team F",
        place: "Stadium 3"
      },
      {
        day: "2023-07-10",
        starttime: "18:00",
        endtime: "20:00",
        teamnameA: "Team G",
        teamnameB: "Team H",
        place: "Stadium 4"
      }
    ]  // 存储比赛信息
		// 需要的信息示例如下：
		// "id": 1,   -->比赛id
		// "date": "2024-07-03",
		// "time": "12:00",
		// "game_running_flag": "1"   -->比赛是否在进行
		// "location": "北操",
		// "teamA": "信息A",
		// "teamB": "信息B",
		// "scoreA": 3,
		// "scoreB": 1
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