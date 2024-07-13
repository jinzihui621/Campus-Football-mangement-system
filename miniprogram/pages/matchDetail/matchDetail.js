Page({
  data: {
    events: [
      { time: "22'", description: "金子辉进球", team: "teamA" },
      { time: "32'", description: "谢锋红牌", team: "teamB" },
      { time: "51'", description: "梅西进球", team: "teamA" },
      { time: "55'", description: "梅西黄牌", team: "teamA" },
      { time: "63'", description: "崔朗清进球", team: "teamB" },
      { time: "64'", description: "徐鑫进球", team: "teamA" },
      { time: "64'", description: "章鸿亮进球", team: "teamB" }
    ],
    game_running_flag: 0,
    game_finished_flag: 0
  },

  onLoad(options) {
    const {
      day,
      starttime,
      teamA,
      teamB,
      place,
      scoreA,
      scoreB,
      turn,
      game_running_flag,
      game_finished_flag
    } = options;
    this.setData({
      day: day,
      starttime: starttime,
      teamA: teamA,
      teamB: teamB,
      place: place,
      scoreA: scoreA,
      scoreB: scoreB,
      turn: turn,
      game_running_flag: game_running_flag === "1",
      game_finished_flag: game_finished_flag === "1"
    });
  }
});
