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
      {name: "gf", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "gf", sno:"21041014",score: 10,red:4,yellow:3},
      {name: "el", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "pp", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "vv", sno:"21041015",score: 10,red:4,yellow:3},
      {name: "qq", sno:"21041015",score: 10,red:4,yellow:3}
    ],
    foundPlayer:"",
    //用于记录被搜索的球员是否在球员数据库中
    found: false,
    filteredResults: [],
    selectedIndex: 0
  },

  inputChange: function(e) {
    const inputValue = e.detail.value;
    const searchValue = inputValue.toLowerCase();
    if (!inputValue) {
      this.setData({
        inputValue: inputValue,
        empty: true,
        found: false,
        filteredResults: [] // Clear results when input is empty
      });
      return;
    }
    const filteredResults = this.data.list2.filter(item => item.name.toLowerCase().includes(searchValue));
    this.setData({
      inputValue: inputValue,
      empty: false,
      found: false,
      filteredResults: filteredResults,
      foundPlayer:filteredResults[0]
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

  selectPlayer: function (e) {
    const index = e.currentTarget.dataset.index;
    const player = this.data.filteredResults[index];
    if (player) {
      this.setData({
        foundPlayer: player,
        found: true,
        selectedIndex: index, // 更新选中的索引
      });
    }
  },

  clearSearch: function() {
    this.setData({
      inputValue: '',
      empty: true,
      foundPlayer: null,
      found: false,
      filteredResults: []
    });
  },

 
  addPlayer: function() {
    //在这里写添加成员的逻辑
    //foundPlayer这个变量为被添加的球员，定义在了data中
    //现在只需要判断一下foundPlayer是不是为空就可以了，不为空就进行数据库的添加操作
    //后端逻辑：如果foundPlayer已经在本队了则返回0，如果foundPlayer不在本队则返回1
    if(this.data.foundPlayer!=""){
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      });
    }
    else{
      wx.showToast({
        title: '请输入想要添加的球员',
        icon:"none",
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