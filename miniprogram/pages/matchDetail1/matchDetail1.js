// pages/index/index.js
const app = getApp();

Page({
  data: {
    currentPage: ''
  },
  
  onLoad: function() {
    const cp = app.globalData.currentPage
    this.setData({
      currentPage: cp
    });
  },

})
