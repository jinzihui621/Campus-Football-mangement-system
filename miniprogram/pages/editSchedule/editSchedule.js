const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    roundIndex: "",
    rounds: ['第一轮', '第二轮', '第三轮','第四轮', '第五轮', '第六轮','第七轮'],
    starttime: " ",
    teamnameAIndex: "",
    teamnameBIndex: "",
    teams: ['信息A', '信息B', '信息C','城建A','都柏林','环生A','艺设A','机电A'],
    placeIndex: "",
    places: ['北工大北操场', '北工大南操场']

  },


  onInputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  addSchedule: function() {
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
    this.setData({
      day: '',
      round: '',
      starttime: '',
      teamnameA:  '',
      teamnameB: '',
      place: '',
    });
  }


})
