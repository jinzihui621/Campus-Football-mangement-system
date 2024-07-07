const app = getApp();

Page({
  data: {
    avatarUrl: '/image/page_me/default_avatar.png', // 默认头像
    name: '',
    nickname: '爱踢球的工大人',
    signature: '',
    studentID: '',
    contact: '',
    college: '',
    major: ''
  },

  onLoad: function() {
    // 可以从全局数据或数据库加载用户信息
    const userInfo = app.globalData.userInfo || {};
    this.setData({
      avatarUrl: userInfo.avatarUrl || '/image/page_me/default_avatar.png',
      name: userInfo.name || '',
      nickname: userInfo.nickname || '',
      signature: userInfo.signature || '',
      studentID: userInfo.studentID || '',
      contact: userInfo.contact || '',
      college: userInfo.college || '',
      major: userInfo.major || ''
    });
  },

  onInputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          avatarUrl: tempFilePath
        });
      }
    });
  },

  saveProfile: function() {
    // 保存用户信息到全局数据或数据库
		app.globalData.userInfo = this.data;
    wx.showToast({
      title: '保存成功',
			icon: 'success',
			duration: 1000
    });
    setTimeout(() => {
			wx.navigateBack();
		}, 1000);
  }
});
