Page({
  data: {
    matches: [
      {
        id: 1,
        day: "2024-07-06",
        starttime: "12:00",
        place: "北操",
        teamA: "信息A",
        teamB: "信息B",
        scoreA: 3,
        scoreB: 1,
        game_running_flag: 0,
        game_finished_flag: 1
      },
      {
        id: 2,
        day: "2024-07-07",
        starttime: "14:00",
        place: "南操",
        teamA: "机电",
        teamB: "计算机",
        scoreA: 2,
        scoreB: 2,
        game_running_flag: 0,
        game_finished_flag: 1
      },
      {
        id: 3,
        day: "2024-07-08",
        starttime: "16:00",
        place: "东操",
        teamA: "建筑",
        teamB: "土木",
        scoreA: 1,
        scoreB: 3,
        game_running_flag: 0,
        game_finished_flag: 1
      },
      {
        id: 4,
        day: "2024-07-09",
        starttime: "10:00",
        place: "西操",
        teamA: "化工",
        teamB: "材料",
        scoreA: 0,
        scoreB: 0,
        game_running_flag: 0,
        game_finished_flag: 1
      },
      {
        id: 5,
        day: "2024-07-10",
        starttime: "09:00",
        place: "北操",
        teamA: "能源",
        teamB: "环境",
        scoreA: 1,
        scoreB: 2,
        game_running_flag: 0,
        game_finished_flag: 1
      },
      {
        id: 6,
        day: "2024-07-11",
        starttime: "15:00",
        place: "北操",
        teamA: "机电",
        teamB: "计算机",
        scoreA: 0,
        scoreB: 0,
        game_running_flag: 1,
        game_finished_flag: 0
      },
      {
        id: 7,
        day: "2024-07-12",
        starttime: "10:00",
        place: "南操",
        teamA: "信息C",
        teamB: "建筑C",
        scoreA: 0,
        scoreB: 0,
        game_running_flag: 0,
        game_finished_flag: 0
      },
      {
        id: 8,
        day: "2024-07-13",
        starttime: "14:00",
        place: "东操",
        teamA: "化工B",
        teamB: "材料B",
        scoreA: 0,
        scoreB: 0,
        game_running_flag: 0,
        game_finished_flag: 0
      },
      {
        id: 9,
        day: "2024-07-14",
        starttime: "16:00",
        place: "西操",
        teamA: "能源B",
        teamB: "环境B",
        scoreA: 0,
        scoreB: 0,
        game_running_flag: 0,
        game_finished_flag: 0
      },
      {
        id: 10,
        day: "2024-07-15",
        starttime: "18:00",
        place: "北操",
        teamA: "机械",
        teamB: "电气",
        scoreA: 0,
        scoreB: 0,
        game_running_flag: 0,
        game_finished_flag: 0
      }
    ],
    toView: ''
  },

  goToMatchDetail(event) {
    const { id } = event.currentTarget.dataset;
    const match = this.data.matches.find(match => match.id === id);
    wx.navigateTo({
      url: `/pages/matchDetail/matchDetail?day=${match.day}&starttime=${match.starttime}&teamA=${match.teamA}&teamB=${match.teamB}&place=${match.place}&scoreA=${match.scoreA}&scoreB=${match.scoreB}&game_running_flag=${match.game_running_flag}&game_finished_flag=${match.game_finished_flag}`
    });
  },

  onLoad(options) {
    this.getMatches();
  },
	
	onShow() {
		this.scrollToCurrentMatch();
	},

  getMatches: async function() {
    const db = wx.cloud.database();
    const _ = db.command;

    try {
      // 获取 matches 集合中的所有记录，并按 A 升序排序
      const matchesRes = await db.collection('matchInfo').orderBy('matchTime', 'asc').get();
      const matches = matchesRes.data;

      if (matches.length === 0) {
        console.log('未找到 matches 数据');
        return;
      }

      // 提取所有的 B 值
      const BValues = matches.map(match => match.match_id);

      // 批量查询 details 集合中的记录
      const detailsRes = await db.collection('judge').where({
        match_id: _.in(BValues)
      }).get();
      const details = detailsRes.data;

      // 构建 B 到 details 记录的映射
      const detailsMap = {};
      details.forEach(detail => {
        detailsMap[detail.match_id] = detail;
      });

      // 合并数据
      const matchinfo = matches.map(match => {
        const detail = detailsMap[match.match_id];
        const start = detail.started?1:0;
        const end = detail.finished?1:0;
        return {
          id: match.match_id,
          day: match.matchTime.toLocaleDateString(),
          startTime: match.matchTime.toLocaleTimeString(),
          place: match.place,
          teamA: match.teamA,
          teamB: match.teamB,
          scoreA: match.scoreA,
          scoreB: match.scoreB,
          game_running_flag: start,
          game_finished_flag: end
        };
      });

      // 更新 matchinfo 数组
      this.setData({
        matches: matchinfo
      });

    } catch (error) {
      console.error('数据获取或合并失败:', error);
    }
  },

  scrollToCurrentMatch() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    let closestMatchId = null;
    let minDiff = Infinity;

    // 优先滚动到正在进行的比赛
    const runningMatch = this.data.matches.find(match => match.game_running_flag === 1);
    if (runningMatch) {
      this.setData({
        toView: `match-${runningMatch.id}`
      });
      return;
    }

    // 如果没有正在进行的比赛，滚动到最近结束的比赛
    this.data.matches.forEach(match => {
      const [matchHour, matchMinute] = match.starttime.split(':').map(Number);
      const matchTime = matchHour * 60 + matchMinute;

      if (match.day === currentDay) {
        if (matchTime <= currentTime && currentTime - matchTime < minDiff) {
          closestMatchId = match.id;
          minDiff = currentTime - matchTime;
        }
      } else if (match.day < currentDay) {
        if (currentDay - match.day < minDiff) {
          closestMatchId = match.id;
          minDiff = currentDay - match.day;
        }
      }
    });

    if (closestMatchId !== null) {
      this.setData({
        toView: `match-${closestMatchId}`
      });
    }
  }
});
