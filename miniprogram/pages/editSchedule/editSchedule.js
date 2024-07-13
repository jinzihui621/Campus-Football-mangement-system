const app = getApp();
const db = wx.cloud.database();
const matchInfoCollection = db.collection('matchInfo');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    roundIndex: "",
    rounds: ['第1轮', '第2轮', '第3轮','第4轮', '第5轮', '第6轮','第7轮'],
    starttime: " ",
    teamnameAIndex: "",
    teamnameBIndex: "",
    teams: ['信息A', '信息B', '信息C','城建A','都柏林','环生A','艺设A','机电A'],
    placeIndex: "",
    places: ['北工大北操场', '北工大南操场']
  },

  onInputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  addSchedule_DB: async function() {
    const data = {
      date: this.data.day,
      starttime: this.data.starttime,
      place: this.data.places[this.data.placeIndex],
      teamnameA: this.data.teams[this.data.teamnameAIndex],
      teamnameB: this.data.teams[this.data.teamnameBIndex],
      round: this.data.rounds[this.data.roundIndex],
      eventname: '工超',
      teamA_id: `id${this.data.teamnameAIndex}`,
      teamB_id: `id${this.data.teamnameBIndex}`
    };

    // 将 day 和 starttime 结合成完整的日期时间字符串
    const fullStartTimeStr = `${data.date}T${data.starttime}:00Z`;

    // 将字符串转换为 Date 对象
    const localStartTime = new Date(fullStartTimeStr);
    const startTimeDate = new Date(localStartTime.getTime() - (8 * 60 * 60 * 1000));

    try {
      const startTimeMinus1Hour30Minutes = new Date(startTimeDate.getTime() - (1.5 * 60 * 60 * 1000));
      const startTimePlus1Hour30Minutes = new Date(startTimeDate.getTime() + (1.5 * 60 * 60 * 1000));

      var flag = 0;
      const res = await matchInfoCollection.where({
        place: data.place
      }).get();
      console.log("res",res);
      if (res.data && res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          const record = res.data[i];
          const timeDifference = Math.abs(new Date(record.matchTime) - startTimeDate);
          if (timeDifference <= 5400000) {
            console.log("flag",flag);
            flag=1;
            break; // 找到符合条件的记录后退出循环
          }
          
        }
      }

      const query = {
        $or: [
          { teamA: data.teamnameA },
          { teamB: data.teamnameA },
          { teamA: data.teamnameB },
          { teamB: data.teamnameB }
        ]
      };
      // 执行查询
      const res1 = await matchInfoCollection.where(query).get();
      console.log("res1",res1);
      if (res1.data && res1.data.length > 0) {
        for (let i = 0; i < res1.data.length; i++) {
          if(res1.data[i].turn == data.round){
            flag=-1;
            break;
          }
        }
      }
      console.log("flag最后",flag);
      if (flag==1) {
        wx.showToast({
          title: '时间地点冲突！',
          icon: 'none',
          duration: 2000
        });
        return {
          success: false,
          message: '时间地点冲突！'
        };
      } else if(flag==-1){
        wx.showToast({
          title: '球队此轮次已有比赛！',
          icon: 'none',
          duration: 2000
        });
        return {
          success: false,
          message: '球队此轮次已有比赛！'
        }
      } else {
        // 没有冲突，继续获取下一个 match_id
        let maxNumber = 0; // 用于存储当前找到的最大数字

        // 遍历所有记录
        const allRes = await matchInfoCollection.get();
        allRes.data.forEach(record => {
          // 使用正则表达式匹配并提取数字
          const matchResult = record.match_id.match(/id(\d+)/);
          if (matchResult) {
            const number = parseInt(matchResult[1], 10);
            // 更新最大数字
            if (number > maxNumber) {
              maxNumber = number;
            }
          }
        });

        const newMatchId = `id${maxNumber + 1}`;
        const newData = {
          event_name: data.eventname,
          matchTime: startTimeDate,
          match_id: newMatchId,
          place: data.place,
          scoreA: 0.0,
          scoreB: 0.0,
          teamA: data.teamnameA,
          teamB: data.teamnameB,
          teamA_id: data.teamA_id,
          teamB_id: data.teamB_id,
          turn: data.round
        };

        // 添加新比赛信息
        const addResult = await matchInfoCollection.add({
          data: newData
        });

        if (addResult._id) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        } else {
          wx.showToast({
            title: '比赛创建失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    } catch (error) {
      console.log("error",error);
      wx.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  onLoad: function() {
    this.setData({
      day: '',
      roundIndex: '',
      starttime: '',
      teamnameAIndex: '',
      teamnameBIndex: '',
      placeIndex: '',
    });
  }
});
