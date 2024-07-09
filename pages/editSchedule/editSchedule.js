const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: " ",
    round: " ",
    starttime: " ",
    teamnameA: " ",
    teamnameB: " ",
    place: " "

  },


  onInputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  saveProfile: function() {
    // 保存用户信息到全局数据或数据库
		app.globalData.matchInfo = this.data;
    wx.showToast({
      title: '保存成功',
			icon: 'success',
			duration: 1000
    });
    setTimeout(() => {
			wx.navigateBack();
		}, 1000);
  },

  onLoad: function() {
    // 可以从全局数据或数据库加载用户信息
    const matchInfo = app.globalData.matchInfo || {};
    this.setData({
      day: matchInfo.day || '',
      round: matchInfo.endtime || '',
      starttime: matchInfo.starttime || '',
      teamnameA: matchInfo.teamnameA || '',
      teamnameB: matchInfo.teamnameB || '',
      place: matchInfo.place || '',
    });
  },

})
