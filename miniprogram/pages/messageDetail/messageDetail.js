Page({
  data: {
    message: {},
    id: null,
		messages: [],
		openid: ""
  },

	getOpenId: function() {
        return wx.cloud.callFunction({
          name: 'getOpenid'
        }).then(res => res.result.openid);
  },

  onLoad: function(options) {
    const id = options.id;
    const messages = JSON.parse(decodeURIComponent(options.messages));
    this.setData({
      id: id,
      messages: messages,
      message: messages.find(msg => msg.id == id)
		});
		this.setData({
			openid: this.getOpenId()
		})
  },

  confirmAction: async function() {
    const db = wx.cloud.database();
    const { message, messages } = this.data;
    try {
      // 更新当前消息的 status 字段为“同意”
      await db.collection('message').where({
        recv_id: message.recv_id,
        send_id: message.send_id
      }).update({
        data: {
          status: "同意"
        }
      });
          // 创建新记录对象
    const newRecord = {
      player_id: message.player_id,
      player_num: this.openid,
      team_id: message.team_id
    };
      await db.collection('team_player').add({
        data:newRecord
      })
      // 更新其余消息的 status 字段为“拒绝”
      await db.collection('message').where({
        send_id: db.command.in(messages.filter(msg => msg.send_id != message.send_id).map(msg => msg.send_id)),
        recv_id: message.recv_id
      }).update({
        data: {
          status: "拒绝"
        }
      });

      wx.showToast({
        title: '已确认',
        icon: 'success',
        duration: 1000
      });

      setTimeout(() => {
        wx.navigateBack({delta : 2});
      }, 1000);

    } catch (error) {
      console.error('更新失败:', error);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none',
        duration: 1000
      });
    }
  },

  rejectAction: async function() {
    // 拒绝操作逻辑
    const db = wx.cloud.database();
    const { message, messages } = this.data;
    try {
      // 更新当前消息的 status 字段为“同意”
      await db.collection('message').where({
        recv_id: message.recv_id,
        send_id: message.send_id
      }).update({
        data: {
          status: "拒绝"
        }
      });

      wx.showToast({
        title: '已拒绝',
        icon: 'success',
        duration: 1000
      });

      setTimeout(() => {
        wx.navigateBack({delta : 2});
      }, 1000);

    } catch (error) {
      console.error('更新失败:', error);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none',
        duration: 1000
      });
    }
  }
});
