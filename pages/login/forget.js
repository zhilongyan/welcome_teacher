
let app = getApp();
let interval;
var md5 = require("../../utils/md5.min.js");
Page({
  data: {
    time: 60,
    phoneIcon: true,
    phoneStatus: false,
    codeText: "发送验证码",
    finishDisabled: true,
    codeStatus: false,
    passwordStatus: false
  },
  // 发送验证码按钮
  sendCode: function () {
    let that = this;
    // 验证手机号是否正确
    let phoneStatus = that.data.phoneStatus;
    if (phoneStatus) {
      console.log("==========发送验证码==============")
      interval = setInterval(this.timekeeper, 1000);
      let phoneNum = that.data.phoneNum;
      let data = {
        mobile: phoneNum,
        templateid: 3059309
      };
      app.postRequest("/Verification/sms/SmsCode", data, function (res) {
        let status = res.data.status;
        if (status == 1) {
          console.log("==============发送验证码成功================")
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 1000
          })
        } else {
          console.log(res)
          let msg = res.data.msg;
          app.showErrorModal(msg);
        }
      })
    } else {
      console.log("==============手机号有误==============")
      that.setData({ phoneIcon: false })
      return;
    }
  },
  // 计时
  timekeeper: function () {
    let time = this.data.time;
    if (time > 0) {
      time--;
      this.setData({ time: time })
    }
    else {
      clearInterval(interval);
      this.setData({ time: 60, codeText: "重新发送" })
    }
  },
  // 验证码框
  code: function (e) {
    let code = e.detail.value;
    var that = this;
    if (code.length == 6) {
      var phone = that.data.phoneNum;
      let data = {
        mobile: phone,
        smsCode: code,
      }
      app.postRequest('/Verification/sms/codeVerification', data, function (res) {
        let status = res.data.status;
        if (status == 1) {
          that.setData({ codeStatus: true })
        } else {
          that.setData({ codeStatus: false })
          let msg = res.data.msg;
          app.showErrorModal(msg);
        }

      })
    }
  },
  // 账号输入框
  userid: function (e) {
    // console.log(e);
    let value = e.detail.value;
    let that = this;
    this.setData({ studentNum: value })
  },
  // 验证手机号是否和账号匹配
  phoneLength: function (e) {
    let phoneNum = e.detail.value;
    let that = this;
    if (phoneNum.length == 11) {
      let studentNum = this.data.studentNum;
      if (studentNum) {
        // 输入的手机号格式正确
        if (app.judgePhoneNum(phoneNum)) {
          // 判断用户输入的手机号是否是用户这个账号输入的手机号
          app.getRequest("/student/stuFind", { studentNum: studentNum }, function (res) {
            let status = res.data.status;
            if (status == 1) {
              let num = res.data.data.phone;
              if (num == phoneNum) {
                that.setData({ phoneNum: phoneNum, phoneStatus: true, phoneIcon: true })
              } else {
                app.showErrorModal("您输入的手机号和绑定的手机号不一致")
                that.setData({ phoneNum: phoneNum, phoneStatus: false, phoneIcon: false })
                // that.setData({phoneNum:''})
              }

            } else {
              let msg = res.data.msg;
              app.showErrorModal(msg);
            }
          })

        } else {
          this.setData({ phoneStatus: false, phoneIcon: false })
        }
      } else {
        this.setData({ phoneNum: '' })
        app.showErrorModal("请先填写账号")
      }
    }
  },
  password: function (e) {
    let password = e.detail.value;
    this.setData({ password: password })
  },
  againPassword: function (e) {
    let password = e.detail.value;
    let newPassword = this.data.password;
    if (password == newPassword) {
      this.setData({ passwordStatus: true ,finishDisabled:false})
    } else {
      this.setData({ passwordStatus: false })
    }
  },
  // 提交
  formSubmit: function (e) {
    let codeStatus = this.data.codeStatus;
    if (!codeStatus) {
      app.showErrorModal("验证码不正确，请重新填写");
      return;
    };
    let passwordStatus = this.data.passwordStatus;
    if (!passwordStatus) {
      app.showErrorModal("密码俩次输入不一致，请重新填写");
      return;
    };
    let password = md5(this.data.password);
    let studentNum = this.data.studentNum;
    let phone = this.data.phoneNum;
    let data = {
      studentNum: studentNum,
      password: password,
      phone: phone
    }
    wx.showToast({
      title: '修改中',
      icon: 'loading',
      duration: 2000
    })
    app.putRequest("/student/changePwd", data, function (res) {
      wx.hideToast();
      let status = res.data.status;
      if (status == 1) {
        wx.showToast({
          title : "修改成功",
          icon:"success",
          duration:1000
        });
        wx.redirectTo({
          url: 'login',
        })
      }else{
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
})