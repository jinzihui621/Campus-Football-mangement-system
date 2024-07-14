const app = getApp();

Page({
  data: {
    avatarUrl: '/image/page_me/default_avatar.png', // 默认头像
    name: '',
    nickname: '爱踢球的工大人',
    signature: '',
    studentID: '',
    contact: '',
    college: '',
    major: ''
  },

  // 获取当前用户的 OpenID
  getOpenId: function() {
    return wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(res => res.result.openid);
  },

  onLoad: async function() {
      // 保存用户信息到全局数据或数据库
      try{
        const openid = await this.getOpenId(); 
        const db = wx.cloud.database()
        const SearchRes = await db.collection('user').doc(openid).get();
        const sanitizedData = {
          avatarUrl: app.globalData.userInfo.avatarUrl,
          name: SearchRes.data.name,
          nickname: SearchRes.data.nickname,
          signature: SearchRes.data.p_signature,
          studentID: SearchRes.data.number,
          contact: SearchRes.data.phone_number,
          college: SearchRes.data.department,
          major: SearchRes.data.major
        };
        app.globalData.userInfo = sanitizedData;
      }catch{}
    // 可以从全局数据或数据库加载用户信息
    const userInfo = app.globalData.userInfo || {};
    this.setData({
      avatarUrl: userInfo.avatarUrl || '/image/page_me/default_avatar.png',
      name: userInfo.name || '',
      nickname: userInfo.nickname || '',
      signature: userInfo.signature || '',
      studentID: userInfo.studentID || '',
      contact: userInfo.contact || '',
      college: userInfo.college || '',
      major: userInfo.major || ''
    });
  },

  onInputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          avatarUrl: tempFilePath
        });
      }
    });
  },

  validateInput: function() {
    const { name, studentID, nickname, signature, contact, college, major } = this.data;

    const namePattern = /^[\u4e00-\u9fa5a-zA-Z·]*$/; // 中文、英文字母和中间点
    const nicknamePattern = /^[\u4e00-\u9fa5a-zA-Z@!（）&%]+$/; // 中文、英文字母和特殊符号
    const contactPattern = /^[\d+]*$/; // 数字和加号
    const chinesePattern = /^[\u4e00-\u9fa5]*$/; // 中文汉字

		if (!name) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (name && (name.length > 20 || !namePattern.test(name))) {
      wx.showToast({
        title: '姓名只能包含中文汉字、英文字母和中间点，且不超过20个字符',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (!nickname) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (!nicknamePattern.test(nickname)) {
      wx.showToast({
        title: '昵称只能包含中文汉字、英文字母和@!（）&%',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (contact && !contactPattern.test(contact)) {
      wx.showToast({
        title: '联系方式只能包含数字和+',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (college && !chinesePattern.test(college)) {
      wx.showToast({
        title: '所属学院只能包含中文汉字',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (major && !chinesePattern.test(major)) {
      wx.showToast({
        title: '所属专业只能包含中文汉字',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

		if (!studentID) {
      wx.showToast({
        title: '学号不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (studentID && !/^\d*$/.test(studentID)) {
      wx.showToast({
        title: '学号必须为数字',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    return true;
  },

// 获取当前用户的 OpenID
  getOpenId: function() {
    return wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(res => res.result.openid);
  },

  saveProfile: async function() {
    // 验证用户输入
    if (!this.validateInput()) {
      return;
    }
    const openid = await this.getOpenId();
    // 保存用户信息到全局数据或数据库
    const sanitizedData = {
      avatarUrl: this.data.avatarUrl,
      name: this.data.name,
      nickname: this.data.nickname,
      signature: this.data.signature,
      studentID: this.data.studentID,
      contact: this.data.contact,
      college: this.data.college,
      major: this.data.major
    };

    app.globalData.userInfo = sanitizedData;
    const dbadd = {
      department: sanitizedData.college,
      major: sanitizedData.major,
      name: sanitizedData.name,
      nickname: sanitizedData.nickname,
      number: sanitizedData.studentID,
      p_signature:sanitizedData.signature,
      phone_num: sanitizedData.contact
    }
    const db = wx.cloud.database()
    try{
      const idRes = await db.collection('user').where({
        number: sanitizedData.studentID
      }).get();
      if(idRes.data.length > 0){
        if(idRes.data[0]._id === openid){}
        else{
          wx.showToast({
            title: '重复学号',
            icon:"error",
            duration: 1000
          });
          return;
       }
      }
    }catch{}
    try{
      await db.collection('user').doc(openid).set({
        data: dbadd
      });
      const playerRes = await db.collection('player').doc(openid).get();
      const dbadd_r = {
        ...dbadd,
        player_num: playerRes.data.player_num
      };
      await db.collection('player').doc(openid).set({
        data: dbadd_r
      });
    }catch{
      await db.collection('user').doc(openid).set({
        data: dbadd
      });
      const dbadd_r = {
        ...dbadd,
        player_num: ""
      };
      await db.collection('player').doc(openid).set({
        data: dbadd_r
      });
    }
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1000
    });
    setTimeout(() => {
      wx.switchTab({
				url: '/pages/me/me',
			});
    }, 1000);
  }
})
