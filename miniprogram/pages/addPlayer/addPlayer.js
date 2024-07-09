// pages/addPlayer/addPlayer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    // 判断搜索框是否为空，搜索框中有内容则显示删除按钮
    empty: true,
    list: [
      {name: "zs", score: 10},
      {name: "ss", score: 10},
      {name: "ds", score: 10},
      {name: "hs", score: 10},
      {name: "js", score: 10},
      {name: "ks", score: 10}
    ],
    list2: [
      {name: "gf", score: 10},
      {name: "bn", score: 10},
      {name: "el", score: 10},
      {name: "pp", score: 10},
      {name: "vv", score: 10},
      {name: "qq", score: 10}
    ],
    foundPlayer:null,
    //用于记录被搜索的球员是否在球员数据库中
    found: false,
    //用于判断是否点击了搜索按钮
    focus: false
  },

  inputChange: function(e) {
    this.setData({
      inputValue: e.detail.value,
      empty: !e.detail.value,
      found:false,
    });
  },

  searchAction: function() {
    const searchValue = this.data.inputValue.toLowerCase();
    const player = this.data.list2.find(item => item.name.toLowerCase() === searchValue);
    if (player) {
      this.setData({
        foundPlayer: player,
        found: true,
      });
    } else {
      this.setData({
        foundPlayer: null,
        found: false,
      });
      wx.showToast({
        title: '未查询到该球员',
        icon: 'none',
        duration: 2000
      });
    }
  },

  clearSearch: function() {
    this.setData({
      inputValue: '',
      empty: true,
      foundPlayer: null,
      found: false
    });
  },

  confirmDelete: function() {
    if (!this.data.foundPlayer) return;
    const that = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这位球员吗？',
      success (res) {
        if (res.confirm) {
          that.deletePlayer();
        }
      }
    });
  },

  addPlayer: function() {
    const index = this.data.list2.findIndex(item => item === this.data.foundPlayer);
    if (index !== -1) {
      const newPlayer = this.data.list2[index];
      this.data.list.push(newPlayer);
      this.setData({
        list: this.data.list,
        list2:this.data.list2,
        foundPlayer: null,
        found: false,
        inputValue: ''
      });
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})