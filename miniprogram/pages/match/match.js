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
    total_turns:50, //赛事的总轮数的十倍
    turn:1, //当前显示的赛程轮次
    tableColumns: [
      {title: "日期",key: "date",width: "100rpx"}, 
      {title: "队伍A",key: "teamA",}, 
      {title: "比分A",key: "teamAScore",},
      {title:"比分B",key:"teamBScore"},
      {title:"队伍B",key:"teamB"}
    ],
    matchList:[
      {date:"07-07 00:00",teamA:"team1",teamAScore:"-",teamBScore:'-',teamB:"name1"},
      {date:"07-07 00:00",teamA:"team2",teamAScore:"-",teamBScore:'-',teamB:"name2"},
      {date:"07-07 00:00",teamA:"team3",teamAScore:"3",teamBScore:'1',teamB:"name3"},
      {date:"07-07 00:00",teamA:"team4",teamAScore:"2",teamBScore:'3',teamB:"name4"}
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
    listRank: [
      { rank: 1, team: "计算机", gamePlayed: 8, win: 8, draw: 0, lose: 0, gs_ga: "35/2", points: 24 },
      { rank: 2, team: "城建", gamePlayed: 8, win: 7, draw: 1, lose: 0, gs_ga: "15/10", points: 22 },
      { rank: 3, team: "电子", gamePlayed: 8, win: 6, draw: 1, lose: 1, gs_ga: "20/5", points: 19 },
      { rank: 4, team: "化工", gamePlayed: 8, win: 5, draw: 2, lose: 1, gs_ga: "18/8", points: 17 }
    ],
		//进球榜
		tableGoalColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "进球数", key: "goals", width: "100rpx" }
    ],
    listGoal: [
      { rank: "1", player: "Player1", team: "Team1", goals: "10" },
      { rank: "2", player: "Player2", team: "Team2", goals: "8" },
      { rank: "3", player: "Player3", team: "Team3", goals: "7" },
      { rank: "4", player: "Player4", team: "Team4", goals: "6" }
    ],
    // 助攻榜
    tableAssistColumns: [
      { title: "名次", key: "rank", width: "100rpx", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "助攻数", key: "assists", width: "100rpx" }
    ],
    listAssist: [
      { rank: "1", player: "Player1", team: "Team1", assists: "12" },
      { rank: "2", player: "Player2", team: "Team2", assists: "9" },
      { rank: "3", player: "Player3", team: "Team3", assists: "8" },
      { rank: "4", player: "Player4", team: "Team4", assists: "7" }
		],
    // 黄牌榜
    tableYellowCardColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "黄牌数", key: "yellowCards", width: "100rpx" }
    ],
    listYellowCard: [
      { rank: "1", player: "Player1", team: "Team1", yellowCards: "5" },
      { rank: "2", player: "Player2", team: "Team2", yellowCards: "4" },
      { rank: "3", player: "Player3", team: "Team3", yellowCards: "3" },
      { rank: "4", player: "Player4", team: "Team4", yellowCards: "2" }
    ],
    // 红牌榜
    tableRedCardColumns: [
      { title: "名次", key: "rank", width: "100rpx" },
      { title: "球员", key: "player", width: "200rpx" },
      { title: "球队", key: "team", width: "200rpx" },
      { title: "红牌数", key: "redCards", width: "100rpx" }
    ],
		listRedCard: [],
		
    "firstList": [{ name: 'w券1', money: '5.00' }, { name: 'w券2', money: '50.00'}],
    "secondList": [{ name: 'y券1', money: '10.00' }, { name: 'y券2', money: '20.00' }],
    "thirdList": [{ name: 'g券1', money: '30.00' }, { name: 'g券2', money: '40.00' }],
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
      matchList:this.data.matchList
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
  /*赛程信息表格组件请求加载 */
  getMatchListLoading: function(e){
    try{
      this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,this.data.turn)
    }catch(error){
      wx.showToast({
        title: '网络连接不良',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if(matchList.length===0){
      return false
    }
    return true
  },
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
        const resPlayerScores = await db.collection("player_score_list").where({  
            match_id: db.command.in(matchIDs)  
        }).orderBy("score", "desc").get();  

        if (!resPlayerScores.data || resPlayerScores.data.length === 0) {  
            console.log("没有找到匹配的球员得分信息");  
            return;  
        }  
        let array = resPlayerScores.data.map(async(item, index) => {
          let playerName=await this.getPlayerName(item.team_id, item.player_num)
          let teamName=await this.getTeamName(item.team_id)
            return {  
                rank: index + 1,  
                player: playerName,   
                team: teamName,   
                goals: item.score  
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
      const resPlayerScores = await db.collection("player_score_list").where({  
          match_id: db.command.in(matchIDs)  
      }).orderBy("yellow", "desc").get();
      if (!resPlayerScores.data || resPlayerScores.data.length === 0) {  
          console.log("没有找到匹配的球员得分信息");  
          return;  
      }  
      let array = resPlayerScores.data.map(async(item, index) => {
        let playerName=await this.getPlayerName(item.team_id, item.player_num)
        let teamName=await this.getTeamName(item.team_id)
          return {  
              rank: index + 1,  
              player: playerName,   
              team: teamName,   
              yellowCards: item.yellow  
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
      const resPlayerScores = await db.collection("player_score_list").where({  
          match_id: db.command.in(matchIDs)  
      }).orderBy("red", "desc").get();  

      if (!resPlayerScores.data || resPlayerScores.data.length === 0) {  
          console.log("没有找到匹配的球员得分信息");  
          return;  
      }  
      let array = resPlayerScores.data.map(async(item, index) => {
        let playerName=await this.getPlayerName(item.team_id, item.player_num)
        let teamName=await this.getTeamName(item.team_id)
          return {  
              rank: index + 1,  
              player: playerName,   
              team: teamName,   
              redCards: item.red  
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
          turn:turn 
      }).get();
      console.log(turn)
      console.log(resMatchInfo)
      if (!resMatchInfo.data || resMatchInfo.data.length === 0) {  
          console.log("没有找到匹配的比赛信息");
          this.setData({
            matchList:[]
          })
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
        let matchesList = []
        groupedItemsList.forEach(async (item,index)=>{
          const matchTime_temp=await this.getMatchTime(item.match_id)
          const matchTimeWithFormat=await this.formatDate(matchTime_temp)
          matchesList.push({
            id:index+1,
            date:matchTimeWithFormat,
            teamA:item.members[0].team,
            teamAScore:item.members[0].score,
            teamB:item.members[1].team,
            teamBScore:item.members[1].score
          })
        })
        console.log(matchesList)
        this.setData({  
          matchList: matchesList,
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
        throw new Error('Player not found in team_player collection');  
      }  
      const playerID = playerResult.data[0].player_id;
      const nameResult = await db.collection("player").where({  
        _id: playerID  
      }).get();  
      if (nameResult.data.length === 0) {  
        throw new Error('Player not found in player collection');  
      }  
      const playerName = nameResult.data[0].name;
      return playerName;  
    } catch (error) {  
      console.error('Error getting player name:', error);  
      throw error; 
    }  
  },
  /*根据球队id获取球队名字 */
  getTeamName: async function(team_id){
    try {  
      const nameRes = await db.collection("team").where({ team_id: team_id }).get();  
      if (nameRes.data.length === 0) {  
        throw new Error('Team not found in team collection');  
      }  
      const team = nameRes.data[0];  
      if (!team) {  
        throw new Error('Unexpected error: No team data found');  
      }   
      return team.team_name;
    } catch (error) {  
      throw error;  
    }
  },
  /*根据match_id获取比赛时间*/
  getMatchTime: async function(match_id){
    try{
      const matchRes=await db.collection("matchInfo").where({match_id:match_id}).get()
      if (matchRes.data.length===0){
        throw new Error('Match not found in match collection');
      }
      const match=matchRes.data[0];
      if(!match){
        throw new Error('Unexpected error: No match data found')
      }
      return match.matchTime;
    }catch(error){
      throw error
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
    await this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,e.detail.current)
    console.log(this.data.matchList)
    this.setData({
      turn:e.detail.current
    })
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
    let year=new Date().getFullYear()
    this.setData({
      date:year
    })
    this.loadRank_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadGoal_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadYellow_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadRed_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,this.data.turn)
    this.setData({
      matchList:this.data.matchList
    })
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
    this.loadRank_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadGoal_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadYellow_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadRed_db(this.data.date,this.data.matches[this.data.currentIndex].matchName)
    this.loadMatch_db(this.data.date,this.data.matches[this.data.currentIndex].matchName,this.data.turn)
    console.log(this.data.matchList)
    this.setData({
      matchList:this.data.matchList
    })
    console.log(this.data.matchList)
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