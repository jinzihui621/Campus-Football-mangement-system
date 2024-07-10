const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    matchInfo: app.globalData.matchInfo,
    match: [{day: "08-08", round: "第1轮", starttime:"12:00", teamnameA: "信息A", teamnameB: "信息B", place: "北工大北操场"},
    {day: "08-08", round: "第1轮", starttime:"12:00", teamnameA: "城建A", teamnameB: "艺设B", place: "北工大南操场"},
    {day: "08-08", round: "第2轮", starttime:"17:00", teamnameA: "软件A", teamnameB: "都柏林", place: "北工大北操场"},
    {day: "08-08", round: "第5轮",  starttime:"17:00", teamnameA: "数理", teamnameB: "经管", place: "北工大南操场"}]

  },

  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 7
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },

    //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },

  onLoad: function() {
		this.setData({ 
			matchInfo: app.globalData.matchInfo,
    });
  },

  onShow: function() {
		this.setData({ 
      matchInfo: app.globalData.matchInfo,
		});
  },
  
  navigateToeditSchedule: function() {
    wx.navigateTo({
      url: '/pages/editSchedule/editSchedule'  // 这里替换成实际的路径
    });
  },

  navigateTodelMatch: function() {
    wx.navigateTo({
      url: '/pages/delMatch/delMatch'  // 这里替换成实际的路径
    });
  },
})