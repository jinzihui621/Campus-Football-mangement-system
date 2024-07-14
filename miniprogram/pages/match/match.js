// pages/match/match.js
const db =wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    matches:[
      {matchID:1,matchName:"工超"},
      {matchID:2,matchName:'工甲'},
      {matchID:3,matchName:'工大杯'}
    ],
    matchNumber:3, //这个match是赛事的意思
    listType:['积分榜','球员榜','赛程'],
    listNumber:3,
    currentIndex: 0,
		currentListIndex:0,
		currentPlayerTab:'goals',
		date:"2024",
		currentYear: '',
    turn:0, //当前显示的赛程轮次-1
    tableColumns: [
      {title: "日期",key: "date",width: "100rpx"}, 
      {title: "队伍A",key: "teamA",}, 
      {title: "比分A",key: "teamAScore",},
      {title:"比分B",key:"teamBScore"},
      {title:"队伍B",key:"teamB"}
    ],
    matchList:[
      [{date:"07-07 00:00",teamA:"team1",teamAScore:"-",teamBScore:'-',teamB:"name1"},
      {date:"07-07 00:00",teamA:"team2",teamAScore:"-",teamBScore:'-',teamB:"name2"},
      {date:"07-07 00:00",teamA:"team3",teamAScore:"3",teamBScore:'1',teamB:"name3"},
      {date:"07-07 00:00",teamA:"team4",teamAScore:"2",teamBScore:'3',teamB:"name4"}],
      [{date:"07-07 00:00",teamA:"team1",teamAScore:"-",teamBScore:'-',teamB:"name1"},
      {date:"07-07 00:00",teamA:"team2",teamAScore:"-",teamBScore:'-',teamB:"name2"},
      {date:"07-07 00:00",teamA:"team3",teamAScore:"3",teamBScore:'1',teamB:"name3"},
      {date:"07-07 00:00",teamA:"team4",teamAScore:"2",teamBScore:'3',teamB:"name4"}],
      [{}],[{}],[{}],[{}],[{}]
		],
		//积分榜
		tableRankColumns: [
      { title: "名次", key: "rank", width: "80rpx" },
      { title: "球队", key: "team", width: "140rpx" },
      { title: "赛", key: "gamePlayed", width: "80rpx" },
      { title: "胜", key: "win", width: "80rpx" },
      { title: "平", key: "draw", width: "80rpx" },
      { title: "负", key: "lose", width: "80rpx" },
      { title: "进/失", key: "gs_ga", width: "100rpx" },
      { title: "积分", key: "points", width: "80rpx" }
    ],
    listRank: [],
		//进球榜
		tableGoalColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "进球数", key: "goals", width: "100rpx" }
    ],
    listGoal: [],
    // 助攻榜
    tableAssistColumns: [
      { title: "名次", key: "rank", width: "100rpx", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "助攻数", key: "assists", width: "100rpx" }
    ],
    listAssist: [],
    // 黄牌榜
    tableYellowCardColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "黄牌数", key: "yellowCards", width: "100rpx" }
    ],
    listYellowCard: [],
    // 红牌榜
    tableRedCardColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "红牌数", key: "redCards", width: "100rpx" }
    ],
		listRedCard: [],
		
    "firstList": [{ name: 'w券1', money: '5.00' }, { name: 'w券2', money: '50.00'}],
    "secondList": [{msg: '暂无内容'}],
    "thirdList": [{msg: '暂无内容'}],
  },
 
  //swiper切换时会调用——赛事切换
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % this.data.matchNumber
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //榜单切换
  listchange: function(e){
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentListIndex
      currentPageIndex = (currentPageIndex + 1) % this.data.listNumber
      this.setData({
        currentIndex: currentPageIndex
      })
    }
    this.setData({
      matchList:this.data.matchList
    })
  },
  //处理滑动事件
  eventHandler:function(e){
    return ""
  },
  //轮次切换
  turnChange:function(e){
    if ("touch" === e.detail.source) {
      let turn = this.data.turn
      turn = (turn + 1) % 7
      this.setData({
        turn: turn
      })
    }
  },
  //用户点击tab时调用——切换赛事
  titleClick: function (e) {
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx
    })
  },
  //用户点击切换榜单
  listClick: function(e){
    this.setData({
      //拿到当前索引并动态改变
      currentListIndex: e.currentTarget.dataset.idx,
      //matchList:this.data.matchList
    })
  },
  /*积分榜表格组件请求加载*/
  getRankListLoading: function(e){
    try{
      this.loadRank_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    }catch(error){
      wx.showToast({
        title: '网络连接不良',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    return true
  },
  /* 球员进球榜表格组件请求加载*/
  getGoalListLoading:function(e){
    try{
      this.loadGoal_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    }catch(error){
      wx.showToast({
        title: '网络连接不良',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    return true
  },
  /*球员黄牌榜表格组件请求加载*/
  getYellowListLoading:function(e){
    try{
      this.loadYellow_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    }catch(error){
      wx.showToast({
        title: '网络连接不良',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    return true
  },
  /*球员红牌榜表格组件请求加载*/
  getRedListLoading:function(e){
    try{
      this.loadYellow_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    }catch(error){
      wx.showToast({
        title: '网络连接不良',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    return true
  },
  // /*赛程信息表格组件请求加载 */
  // getMatchListLoading: function(e){
  //   try{
  //     this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,this.data.turn)
  //   }catch(error){
  //     wx.showToast({
  //       title: '网络连接不良',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //     return false
  //   }
  //   if(matchList.length===0){
  //     return false
  //   }
  //   return true
  // },
  //加载积分榜数据
  loadRank_db:async function(date, matchName) {  
      try {  
          const startOfYear = new Date(`${date}-01-01T00:00:00.000Z`); // UTC时间，当年的第一天  
          const endOfYear = new Date(`${parseInt(date) + 1}-01-01T00:00:00.000Z`); // UTC时间，下一年的第一天（不包含）  
          const resMatchInfo = await db.collection("matchInfo").where({  
              matchTime: db.command.gte(startOfYear).and(db.command.lt(endOfYear)),  
              event_name: matchName  
          }).get();  
          if (!resMatchInfo.data || resMatchInfo.data.length === 0) {  
              console.log("没有找到匹配的比赛信息");  
              return;  
          } 
          let matchIDs = resMatchInfo.data.map(item => item.match_id);  
    
          // 获取参与比赛的队伍ID  
          const resTeamParticipation = await db.collection("team_match_participate").where({  
              match_id: db.command.in(matchIDs)  
          }).get();  
    
          if (!resTeamParticipation.data || resTeamParticipation.data.length === 0) {  
              console.log("没有找到参与比赛的队伍信息");  
              return;  
          }  
          let teamIDs = resTeamParticipation.data.map(item => item.team_id);  
          const resTeams = await db.collection("team").where({  
              team_id: db.command.in(teamIDs)  
          }).orderBy("score", "desc").get();  
    
          if (!resTeams.data || resTeams.data.length === 0) {  
              console.log("没有找到队伍信息");  
              return;  
          }  
          let itemWithIndex = resTeams.data.map((item, index) => ({  
              rank: index + 1,  
              team: item.team_name,  
              gamePlayed: item.match_num,  
              win: item.vic_num,  
              draw: item.draw_num,  
              lose: item.lose_num,  
              gs_ga: `${item.goal_num}/${item.fumble_num}`,
              points: item.score  
          }));   
          this.setData({  
              listRank: itemWithIndex  
          });  
      } catch (err) {  
          console.error("加载队伍排名信息失败:", err);  
      }  
  } ,
  //加载进球榜数据
  loadGoal_db:async function(date, matchName) {  
    try {  
      const $=db.command.aggregate
      const resPlayerScores = await db.collection("player_score_list").aggregate()
        .group({
          _id: '$_openid',
          team_id:{$first:'$team_id'},
          player_num:{$first:'$player_num'},
          totalScore: $.sum('$score')
        })
        .sort({totalScore:-1})
        .end();  
        let array = resPlayerScores.list.map(async(item, index) => {
          let playerName=await this.getPlayerName(item.team_id, item.player_num)
          let teamName=await this.getTeamName(item.team_id)
            return {  
                rank: index + 1,  
                player: playerName,   
                team: teamName,   
                goals: item.totalScore  
            };  
        });
        Promise.all(array).then(results => {
          console.log(results);  
          this.setData({  
              listGoal: results  
          });  
        }).catch(error => {  
            console.error('Error fetching player and team names:', error);  
        });  
    } catch (err) {  
        console.error("加载比赛和球员得分信息失败:", err);  
    }  
  },
  //加载黄牌榜数据
  loadYellow_db:async function(date,matchName){
    try {  
      const $=db.command.aggregate
      const resPlayerScores = await db.collection("player_score_list").aggregate()
        .group({
          _id: '$_openid',
          team_id:{$first:'$team_id'},
          player_num:{$first:'$player_num'},
          totalYellow: $.sum('$yellow')
        })
        .sort({totalYellow:-1})
        .end();
      if (!resPlayerScores.list || resPlayerScores.list.length === 0) {  
          console.log("没有找到匹配的球员黄牌信息");  
          return;  
      }
      let array = resPlayerScores.list.map(async(item, index) => {
        console.log(item)
        let playerName=await this.getPlayerName(item.team_id, item.player_num)
        let teamName=await this.getTeamName(item.team_id)
          return {  
              rank: index + 1,  
              player: playerName,   
              team: teamName,   
              yellowCards: item.totalYellow  
          };  
      });
      Promise.all(array).then(results => {
        console.log(results);  
        this.setData({  
          listYellowCard: results  
        });  
      }).catch(error => {  
          console.error('Error fetching player and team names:', error);  
      });  
    } catch (err) {  
        console.error("加载比赛和球员黄牌信息失败:", err);  
    }  
  },
  //加载红牌榜数据
  loadRed_db:async function(date,matchName){
    try {  
      const $=db.command.aggregate
      const resPlayerreds = await db.collection("player_score_list").aggregate()
        .group({
          _id: '$_openid',
          team_id:{$first:'$team_id'},
          player_num:{$first:'$player_num'},
          totalRed: $.sum('$red')
        })
        .sort({totalRed:-1})
        .end();
      if (!resPlayerreds.list || resPlayerreds.list.length === 0) {  
          console.log("没有找到匹配的球员红牌信息");  
          return;  
      }  
      let array = resPlayerreds.list.map(async(item, index) => {
        let playerName=await this.getPlayerName(item.team_id, item.player_num)
        let teamName=await this.getTeamName(item.team_id)
          return {  
              rank: index + 1,  
              player: playerName,   
              team: teamName,   
              redCards: item.totalRed  
          };  
      });
      Promise.all(array).then(results => {
        console.log(results);  
        this.setData({  
          listRedCard: results  
        });  
      }).catch(error => {  
          console.error('Error fetching player and team names:', error);  
      });
    } catch (err) {  
        console.error("加载比赛和球员红牌信息失败:", err);  
    }  
  },
  //加载赛程数据
  loadMatch_db:async function(date,matchName,turn){
    try{
      const startOfYear = new Date(`${date}-01-01T00:00:00.000Z`); // UTC时间，当年的第一天  
      const endOfYear = new Date(`${parseInt(date) + 1}-01-01T00:00:00.000Z`); // UTC时间，下一年的第一天（不包含）  
      const resMatchInfo = await db.collection("matchInfo").where({  
          matchTime: db.command.gte(startOfYear).and(db.command.lt(endOfYear)),  
          event_name: matchName,
          turn:"第"+turn+"轮" 
      }).get();
      console.log(turn)
      console.log(resMatchInfo)
      if (!resMatchInfo.data || resMatchInfo.data.length === 0) {  
          console.log("没有找到匹配的比赛信息");
          this.data.matchList[turn-1]=[]
          return;  
      }
      let matchIDs = resMatchInfo.data.map(item => item.match_id);
      const teamMatch =await db.collection("team_match_participate").where({
        match_id:db.command.in(matchIDs)
      }).get()
      let array = teamMatch.data.map(async item => {
        let teamName=await this.getTeamName(item.team_id)
          return {
              match_id:item.match_id,
              team: teamName,   
              score: item.goal
          };  
      });
      Promise.all(array).then(results => {
        console.log(results);
        let groupedItems = {};
        results.forEach(item => {  
            if (!groupedItems[item.match_id]) {  
                groupedItems[item.match_id] = [];  
            }  
            groupedItems[item.match_id].push({ team: item.team, score: item.score });  
        });
        //字典转列表
        let groupedItemsList = Object.keys(groupedItems).map(key => ({  
          group: key,  
          members: groupedItems[key]  
        }));
        let matchesListItem = []
        groupedItemsList.forEach(async item=>{
          const matchTime_temp=await this.getMatchTime(item.group)
          const matchTimeWithFormat=await this.formatDate(matchTime_temp)
          matchesListItem.push({
            date:matchTimeWithFormat,
            teamA:item.members[0].team,
            teamAScore:item.members[0].score,
            teamB:item.members[1].team,
            teamBScore:item.members[1].score
          })
        })
        console.log(matchesListItem)
        this.data.matchList[turn-1]=matchesListItem
        console.log(this.data.matchList)
        this.setData({  
          matchList: this.data.matchList,
        });
      }).catch(error => {  
          console.error('Error fetching player and team names:', error);  
      });
    }catch (err) {  
      console.error("加载赛程信息失败:", err);  
    }
  },
 /*根据球队id和队员号码获取队员名字 */
	getPlayerName: async function(team_id, playerCode) {  
		try {  
			const playerResult = await db.collection("team_player").where({  
				team_id: team_id,  
				player_num: playerCode.toString() 
			}).get();  
			if (playerResult.data.length === 0) {  
				console.warn('Player not found in team_player collection');
				return '未知球员';  // 返回默认值
			}  
			const playerID = playerResult.data[0].player_id;
			const nameResult = await db.collection("player").where({  
				_id: playerID  
			}).get();  
			if (nameResult.data.length === 0) {  
				console.warn('Player not found in player collection');
				return '未知球员';  // 返回默认值
			}  
			const playerName = nameResult.data[0].name;
			return playerName;  
		} catch (error) {  
			console.error('Error getting player name:', error);  
			return '未知球员';  // 返回默认值
		}  
	},
  /*根据球队id获取球队名字 */
  getTeamName: async function(team_id){
    try {  
      const nameRes = await db.collection("team").where({ team_id: team_id }).get();  
      if (nameRes.data.length === 0) {  
        console.warn('Team not found in team collection');  
        return '未知球队';  // 返回默认值
      }  
      const team = nameRes.data[0];  
      if (!team) {  
        console.warn('Unexpected error: No team data found');  
        return '未知球队';  // 返回默认值
      }   
      return team.team_name;
    } catch (error) {  
      console.error('Error getting team name:', error);  
      return '未知球队';  // 返回默认值
    }
  },
  /*根据match_id获取比赛时间*/
  getMatchTime: async function(match_id){
    try{
      const matchRes=await db.collection("matchInfo").where({match_id:match_id}).get()
      if (matchRes.data.length===0){
        console.warn('Match not found in match collection');
        return new Date();  // 返回当前日期作为默认值
      }
      const match=matchRes.data[0];
      if(!match){
        console.warn('Unexpected error: No match data found');
        return new Date();  // 返回当前日期作为默认值
      }
      return match.matchTime;
    }catch(error){
      console.error('Error getting match time:', error);
      return new Date();  // 返回当前日期作为默认值
    }
  },
  /* 接收一个Date型变量，返回月-日 时-分格式的字符串*/
  formatDate:async function (datePromise) {  
    try {  
      let date = await datePromise; // 等待 Promise 解析  
      if (!(date instanceof Date)) {  
          throw new Error('Resolved value is not a Date object');  
      }  
      let month = String(date.getMonth() + 1).padStart(2, '0');  
      let day = String(date.getDate()).padStart(2, '0');  
      let hours = String(date.getHours()).padStart(2, '0');  
      let minutes = String(date.getMinutes()).padStart(2, '0');  
      return `${month}-${day} ${hours}:${minutes}`;  
    } catch (error) {  
        console.error('Error formatting date:', error);  
        return null; // 或者其他错误处理  
    }  
  },
  /*筛选日期 */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /*切换比赛轮次*/
  changeTurn:async function(e){
    console.log(e)
    // await this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,e.detail.current)
    // console.log(this.data.matchList)
    this.setData({
      turn:e.detail.current-1
    })
    console.log(this.data.turn)
    console.log(this.data.matchList)
  },
	// 切换球员榜榜单
	selectPlayerTab: function(e) {
    this.setData({
      currentPlayerTab: e.currentTarget.dataset.tab
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		wx.showLoading({
			title: '加载中……',
			mask: true
		})
    let year=new Date().getFullYear()
    this.data.matchList=[]
    this.setData({
			date:year,
			currentYear: year
		})
    this.loadRank_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadGoal_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadYellow_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadRed_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    let i=0
    for(i=1;i<=7;i++){
      this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,i)
		}
		
		setTimeout(() => {
			wx.hideLoading();
		}, 4000)
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
    let year=new Date().getFullYear()
    this.setData({
      date:year
    })
    this.loadRank_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadGoal_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadYellow_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadRed_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    // this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,this.data.turn)
    // this.setData({
    //   matchList:this.data.matchList
    // })
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
    // this.loadRank_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    // this.loadGoal_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    // this.loadYellow_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    // this.loadRed_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    // this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,this.data.turn)
    // console.log(this.data.matchList)
    // this.setData({
    //   matchList:this.data.matchList
    // })
    // console.log(this.data.matchList)
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