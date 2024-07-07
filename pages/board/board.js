Page({
  data: {
    years: ['2022', '2023', '2024'],
    selectedYear: '2024',
    currentEvent: 'super',
    currentSubTab: 'score',
    currentPlayerTab: 'goals',
    scoreData: [
      { rank: 1, team: '计算机', played: 8, won: 8, drawn: 0, lost: 0, goalDifference: '35/2', points: 24 },
      { rank: 2, team: '城建', played: 8, won: 8, drawn: 0, lost: 0, goalDifference: '35/2', points: 24 },
      // 其他球队数据
    ],
    goalData: [
      { rank: 1, player: '球员A', team: '计算机', goals: 10 },
      { rank: 2, player: '球员B', team: '城建', goals: 8 },
      // 其他进球榜数据
    ],
    assistData: [
      { rank: 1, player: '球员C', team: '计算机', assists: 5 },
      { rank: 2, player: '球员D', team: '城建', assists: 4 },
      // 其他助攻榜数据
    ],
    yellowCardData: [
      { rank: 1, player: '球员E', team: '计算机', yellowCards: 3 },
      { rank: 2, player: '球员F', team: '城建', yellowCards: 2 },
      // 其他黄牌榜数据
    ],
    redCardData: [
      { rank: 1, player: '球员G', team: '计算机', redCards: 1 },
      { rank: 2, player: '球员H', team: '城建', redCards: 1 },
      // 其他红牌榜数据
    ]
  },

  selectEvent: function(e) {
    this.setData({
      currentEvent: e.currentTarget.dataset.event
    });
    // TODO: 根据赛事类型加载数据
  },

  selectYear: function(e) {
    this.setData({
      selectedYear: this.data.years[e.detail.value]
    });
    // TODO: 根据年份加载数据
  },

  selectSubTab: function(e) {
    this.setData({
      currentSubTab: e.currentTarget.dataset.tab
    });
  },

  selectPlayerTab: function(e) {
    this.setData({
      currentPlayerTab: e.currentTarget.dataset.tab
    });
  }
});
