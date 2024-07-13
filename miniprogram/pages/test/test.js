Page({
  data: {
    day: '',
    roundIndex: 0,
    rounds: ['第一轮', '第二轮', '第三轮'],
    starttime: '',
    teamnameAIndex: 0,
    teamnameBIndex: 0,
    teams: ['球队A', '球队B', '球队C'],
    placeIndex: 0,
    places: ['场地A', '场地B', '场地C']
  },
  onPickerChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },
  addSchedule() {
    // 处理添加赛程的逻辑
  }
});
