Page({
  data: {
    matches: [],
    toView: ''
  },

  goToMatchDetail(event) {
    const { id } = event.currentTarget.dataset;
    const match = this.data.matches.find(match => match.id === id);
    wx.navigateTo({
      url: `/pages/matchDetail/matchDetail?id=${match.id}&day=${match.day}&starttime=${match.starttime}&teamA=${match.teamA}&teamB=${match.teamB}&place=${match.place}&scoreA=${match.scoreA}&scoreB=${match.scoreB}&turn=${match.turn}&game_running_flag=${match.game_running_flag}&game_finished_flag=${match.game_finished_flag}`
    });
  },

  onLoad(options) {},

  onShow() {
    this.getMatches();
	},
	
	onPullDownRefresh() {
    this.getMatches(() => {
      wx.stopPullDownRefresh();
    });
  },

  getMatches: async function() {
    const db = wx.cloud.database();
    const _ = db.command;

    try {
      // 获取 matches 集合中的所有记录，并按 matchTime 升序排序
      const matchesRes = await db.collection('matchInfo').orderBy('matchTime', 'asc').get();
      const matches = matchesRes.data;

      if (matches.length === 0) {
				console.log('未找到 matches 数据');
				this.setData({
					matches: []
				})
        return;
      }

      // 提取所有的 match_id 值
      const matchIds = matches.map(match => match.match_id);

      // 批量查询 judge 集合中的记录
      const detailsRes = await db.collection('judge').where({
        match_id: _.in(matchIds)
      }).get();
      const details = detailsRes.data;

      // 构建 match_id 到 details 记录的映射
      const detailsMap = {};
      details.forEach(detail => {
        detailsMap[detail.match_id] = detail;
      });
			
			const formatTime = (date) => {
				const hours = date.getHours().toString().padStart(2, '0');
				const minutes = date.getMinutes().toString().padStart(2, '0');
				return `${hours}:${minutes}`;
			};

      // 合并数据
      const matchinfo = matches.map(match => {
        const detail = detailsMap[match.match_id];
        const start = detail ? (detail.started ? 1 : 0) : 0;
        const end = detail ? (detail.finished ? 1 : 0) : 0;
        return {
          id: match.match_id,
          day: match.matchTime.toLocaleDateString('zh-cn', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
          starttime: formatTime(new Date(match.matchTime)),
          place: match.place,
          teamA: match.teamA,
          teamB: match.teamB,
          scoreA: match.scoreA,
          scoreB: match.scoreB,
          turn: match.turn,
          game_running_flag: start,
          game_finished_flag: end
        };
      });

      // 更新 matchinfo 数组
      this.setData({
        matches: matchinfo
      }, () => {
        this.scrollToCurrentMatch();
      });

    } catch (error) {
      console.error('数据获取或合并失败:', error);
    }
  },

  scrollToCurrentMatch() {
		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();
		const currentDay = new Date(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
	
		let closestMatchId = null;
		let minDiff = Infinity;
	
		// 优先滚动到正在进行的比赛
		const runningMatch = this.data.matches.find(match => match.game_running_flag === 1);
		if (runningMatch) {
			console.log("In running match...");
			this.setData({
				toView: `match-${runningMatch.id}`
			});
			return;
		}
	
		// 如果没有正在进行的比赛，滚动到最近结束的比赛
		this.data.matches.forEach(match => {
			const [matchHour, matchMinute] = match.starttime.split(':').map(Number);
			const matchTime = matchHour * 60 + matchMinute;
			const matchDay = new Date(match.day);
	
			if (matchDay.getTime() === currentDay.getTime()) {
				if (matchTime <= currentTime && currentTime - matchTime < minDiff) {
					closestMatchId = match.id;
					minDiff = currentTime - matchTime;
				}
			} else if (matchDay < currentDay) {
				console.log(currentDay - matchDay);
				if ((currentDay.getTime() - matchDay.getTime()) < minDiff) {
					closestMatchId = match.id;
					minDiff = currentDay.getTime() - matchDay.getTime();
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
