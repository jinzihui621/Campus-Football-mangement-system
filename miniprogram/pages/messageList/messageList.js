Page({
  data: {
    messages: [
      {
        id: 1,
        title: '邀请加入计算机足球队',
        content: '消息内容消息内容消息内容消息内容',
        timestamp: '16:00'
      },
      {
        id: 2,
        title: '邀请执法比赛',
        content: '消息内容消息内容消息内容消息内容',
        timestamp: '16:00'
      },
      // 更多消息
    ]
  },

  navigateToMessageDetail: function(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/messageDetail/messageDetail?id=${id}`
    });
  }
});
