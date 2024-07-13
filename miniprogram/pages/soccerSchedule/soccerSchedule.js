const db = wx.cloud.database();
const matchInfoCollection = db.collection('matchInfo');

Page({
  data: {
    currentIndex: 0,
    match: []
  },

  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex;
      currentPageIndex = (currentPageIndex + 1) % 7;
      this.setData({
        currentIndex: currentPageIndex
      });
    }
  },

  titleClick: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.idx
    });
  },

  onLoad: function() {
    this.loadMatchInfo();
  },

  onShow: function() {
    this.loadMatchInfo();
  },

  loadMatchInfo: async function() {
    try {
      const res = await matchInfoCollection.get();
      console.log("获取到的比赛信息：", res.data);
      
      const match = res.data.map(record => {
        let matchTimeStr = '';
        if (record.matchTime instanceof Date) {
          matchTimeStr = record.matchTime.toISOString();
        } else if (record.matchTime) {
          matchTimeStr = new Date(record.matchTime).toISOString();
        }

        return {
          day: record.day || matchTimeStr.substring(0, 10),
          round:record.turn,
          starttime: record.starttime || matchTimeStr.substring(11, 16),
          teamnameA: record.teamA,
          teamnameB: record.teamB,
          place: record.place
        };
      });

      console.log("处理后的比赛信息：", match);
      this.setData({ 
        match: match,
      });
    } catch (error) {
      wx.showToast({
        title: '加载比赛信息失败',
        icon: 'none',
        duration: 2000
      });
      console.error("加载比赛信息失败", error);
    }
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
});
