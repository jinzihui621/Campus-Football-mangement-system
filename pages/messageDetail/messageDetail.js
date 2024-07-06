Page({
  data: {
    message: {}
  },

  onLoad: function(options) {
    const id = options.id;
    // 从全局数据中或通过网络请求获取消息详情，这里我们简单模拟
    const messages = [
      {
        id: 1,
        title: '邀请加入计算机足球队',
        content: '金子辉邀请你加入计算机足球队的大家庭，请确认加入！\n如非本人请忽略~',
      },
      {
        id: 2,
        title: '邀请执法比赛',
        content: '工超组委会邀请你执法2024年7月7日12时xx队与xx队的比赛，请确认！\n如非本人请忽略~',
      }
    ];
    const message = messages.find(msg => msg.id == id);
    this.setData({ message });
  },

  confirmAction: function() {
    // 确认操作逻辑
    wx.showToast({
      title: '已确认',
      icon: 'success'
    });
    wx.navigateBack();
  },

  rejectAction: function() {
    // 拒绝操作逻辑
    wx.showToast({
      title: '已拒绝',
      icon: 'none'
    });
    wx.navigateBack();
  }
});
