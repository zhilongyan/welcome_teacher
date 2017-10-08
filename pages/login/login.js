//login.js
//获取应用实例
var app = getApp();
let _server = app._server;
var md5 = require("../../utils/md5.min.js");
Page({
  data: {
    remind: '加载中',
    help_status: false,
    userid_focus: false,
    passwd_focus: false,
    // userid: '',
    // userid: '2016974100123',
    angle: 0,
    role: ["导员", "小班", "接站人员"],
    roleArr: 0,
    initialPw: ''
  },
  onShow: function () {
    this.setData({ initialPw: '' })
  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1500);
  },

  bind: function () {
    var _this = this;
    var patrn = /^(\w){6,10}$/;
    if (!_this.data.userid || !_this.data.passwd) {
      app.showErrorModal('账号及密码不能为空', '提醒');
      return false;
    }
    // else if (!patrn.exec(_this.data.passwd)) {

    //   app.showErrorModal('密码输入至少6位，不得大于10位', '提示');
    // }
    else {
      app.showLoadToast('登录中');
      let password = this.data.passwd;
      let num = this.data.userid
      let role = this.data.roleArr;
      app.role = role + 1;
      switch (role) {
        case 0: this.teacherLogin(num, password); break;
        case 1: this.subLogin(num, password); break;
        case 2: this.stationLogin(num, password); break;
      }
    }
  },


  // 输入框 的设定
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
    });
    if (e.detail.value.length >= 13) {
      wx.hideKeyboard();
    }
  },
  passwdInput: function (e) {
    let psw = md5(e.detail.value)
    this.setData({
      passwd: psw
    });
  },

  // ......
  inputFocus: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },

  // 帮助
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  },
  // 选择角色
  roleChange: function (e) {
    console.log(e)
    let value = e.detail.value / 1;
    this.setData({ roleArr: value })
  },
  // 老师登陆
  teacherLogin: function (num, password) {
    let _this = this;
    let data = {
      teacherbh: num,
      password: password
    }
    app.postRequest('/teacher/teacherLogin', data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        let session_id = res.data.session_id;
        wx.setStorageSync('session_id', session_id)
        let data_mes = {
          teacherNum: _this.data.userid,
          password: _this.data.passwd,
          status: 1,
        }
        wx.setStorageSync('user_Info', data_mes);
        // 将导员信息放到缓冲中
        app.getTeacherMes(_this.data.userid, function () {
          // 将角色置为1
          app.role = 1;
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            mask: true,
            duration: 8000
          });
          wx.switchTab({
            url: "../home/index/index",

          })
          wx.hideToast()
          wx.showToast({
            title: '欢迎使用',
            icon: 'success',
            mask: true,
            duration: 1000
          });
        });
      // } else if (status == 7) {
      //   let session_id = res.data.session_id;
      //   wx.setStorageSync('session_id', session_id)
      //   let data_mes = {
      //     teacherNum: _this.data.userid,
      //     password: _this.data.passwd,
      //     status: 1,
      //   }
      //   wx.setStorageSync('user_Info', data_mes);
      //   wx.redirectTo({
      //     url: '../me/selectMajor/selectMajor?teacherbh=' + _this.data.userid,
      //   })
      } else {
        wx.hideToast();
        app.showErrorModal(res.data.msg);
      }
    })
  },
  // 小班登陆
  subLogin: function (num, password) {
    let _this = this;
    let data = {
      subteacherbh: num,
      password: password
    }
    app.postRequest('/sub/subLogin', data, function (res) {
      console.log(res)
      if (res.data.status == 1) {
        let session_id = res.data.session_id;
        wx.setStorageSync('session_id', session_id)
        let data_mes = {
          stuNum: _this.data.userid,
          teacherNum: null,
          studentNum: null,
          password: _this.data.passwd,
          status: 2,
        }
        wx.setStorageSync('user_Info', data_mes);
        app.getStuMes(_this.data.userid, function () {
          app.role = 2;
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            mask: true,
            duration: 8000
          });
          wx.switchTab({
            url: "../home/index/index",

          })
          wx.hideToast()
          wx.showToast({
            title: '欢迎使用',
            icon: 'success',
            mask: true,
            duration: 1000
          });
        });
      }
      else {
        wx.hideToast();
        app.showErrorModal(res.data.msg, '登录失败');
      }
    })
  },
  // 接站人员登陆
  stationLogin: function (num, password) {
    let data = {
      staffbh: num,
      password: password
    }
    app.postRequest('/staff/staffLogin', data, function (res) {
      console.log(res)

      if (res.data.status == 1) {
        let session_id = res.data.session_id;
        wx.setStorageSync('session_id', session_id)
        let data_mes = {
          status: 3,
        }
        wx.setStorageSync('user_Info', data_mes)
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          mask: true,
          duration: 8000
        });
        // wx.navigateTo({
        //   url: "../station/meetStation/meetStation",
        // })
        wx.switchTab({
          url: "../home/index/index",

        })
        wx.hideToast()
        wx.showToast({
          title: '欢迎使用',
          icon: 'success',
          mask: true,
          duration: 1000
        });

      }
      else {
        wx.hideToast();
        app.showErrorModal(res.data.msg, '登录失败');
      }
    })
  },
  forget: function () {
    app.showErrorModal("请联系管理员修改密码，管理员QQ:1160917739")
  }
});