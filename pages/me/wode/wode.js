var app = getApp();

Page({
  data: {
    remind: '加载中',
    userInfo: {},
    student_Info: {},
    loginStatus: false,
    Array: [{
      bindtap: 'tapUsername',
      img_Url_1: '/image/id.png',
      img_Url_2: '/image/icon-arrow.png',
      item: '个人信息'
    },
    {
      bindtap: 'tap_teacherStudent',
      img_Url_1: '/image/class.png',
      img_Url_2: '/image/icon-arrow.png',
      item: '我的学生'
    },
    {
      bindtap: 'tap_reply',
      img_Url_1: '/image/request.png',
      img_Url_2: '/image/icon-arrow.png',
      item: '回复我的'
    },
    {
      bindtap: 'tap_password',
      img_Url_1: '/image/psd_change.png',
      img_Url_2: '/image/icon-arrow.png',
      item: '修改密码'
    },
    ],
  },
  onShow: function () {
    let role = app.role;
    switch (role) {
      case 1: let common = require("../../../utils/teacher");
        let teacherMessage = wx.getStorageSync("teacher_Info");
        var person = new common.teacher(teacherMessage);
        var bh = person.teacherbh;
        // let array = this.data.Array;
        // array[4] = {
        //   bindtap: 'selectMajor',
        //   img_Url_1: '/image/selectMajor.png',
        //   img_Url_2: '/image/icon-arrow.png',
        //   item: '专业管理'
        // }
        // this.setData({ Array: array })
        break;
      case 2: var common = require("../../../utils/stu");
        let stuMessage = wx.getStorageSync("stu_Info");
        var person = new common.stu(stuMessage);
        var bh = person.subteacherbh;
        this.setData({ "Array[1].bindtap": "tap_myClass" })
        break;
    }
    let userInfo = {
      face: person.face,
      name: person.name,
      bh: bh
    }
    this.setData({ userInfo: userInfo })
  },


  tap_myClass: function () {
    let role = this.data.role;
    wx.navigateTo({
      url: '../myClass/myClass?role=' + role
    })
  },

  // 回复我的
  tap_reply: function () {
    let role = app.role;
    wx.navigateTo({
      url: '../reply/reply?role=' + role
    })
  },
  // 导员查看学生
  tap_teacherStudent: function () {
    let id = this.data.userInfo.teacherbh;
    wx.navigateTo({
      url: '../teacherStudent/teacherStudent?id=' + id
    })
  },
  selectMajor: function () {
    wx.navigateTo({
      url: '../selectMajor/selectMajor'
    })
  },
  // 退出
  quit: function () {
    let that = this;
    wx.showModal({
      content: '确认退出？',
      success: function (res) {
        if (res.confirm) {
          let role = app.role;
          switch (role) {
            case 1: wx.removeStorageSync("teacher_Info"); var url = "/teacher/teacherLogout"; break;
            case 2: wx.removeStorageSync("stu_Info"); var url = "/sub/subLogout"; break;
          };
          app.postRequest(url, {}, function (res) {
            let status = res.data.status;
            if (status == 1) {
              wx.removeStorageSync("user_Info");
              wx.removeStorageSync("session_id");
              wx.reLaunch({
                url: '/pages/login/login',
              })
            } else {
              let msg = res.data.msg;
              app.showErrorModal(msg);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tapUsername: function () {
    let role = this.data.role;
    switch (role) {
      case 1: var id = this.data.userInfo.teacherbh; break;
      case 2: var id = this.data.userInfo.subteacherbh; break;
    }
    wx.navigateTo({
      url: '../person_Info/person_Info'
    })
  },
  // 修改密码
  tap_password: function () {
    let role = this.data.role;
    wx.navigateTo({
      url: '../resetPassword/resetPassword?role=' + role
    })
  },
  changeImg: function () {
    wx.navigateTo({
      url: '../changeImg/changeImg',
    })
  }
})