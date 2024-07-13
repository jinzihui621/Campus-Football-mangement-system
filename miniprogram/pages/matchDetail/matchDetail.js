Page({
  data: {
    events: [
			{ name: "金子辉", type: "进球", number: "2", team: "teamA"},
			{ name: "金子辉", type: "黄牌", number: "1", team: "teamA"},
			{ name: "徐鑫", type: "黄牌", number: "1", team: "teamB"}
    ],
    game_running_flag: 0,
    game_finished_flag: 0
  },

  onLoad(options) {
    const {
			id,
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
			id: id,
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
