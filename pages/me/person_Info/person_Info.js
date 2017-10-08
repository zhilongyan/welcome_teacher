// pages/login/login_code_Info_PS.js
let app = getApp();
var person;
var role;
Page({
  data: {
    emailStatus : true,
    phoneStatus : true,
    changeStatus : false
  },
  onLoad: function (options) {
    role = app.role;
    switch (role) {
      case 1: let common = require("../../../utils/teacher");
        let teacherMessage = wx.getStorageSync("teacher_Info");
        person = new common.teacher(teacherMessage); break;
      case 2: var common = require("../../../utils/stu");
        let stuMessage = wx.getStorageSync("stu_Info");
        person = new common.stu(stuMessage); break;
    }
    this.setData({
      qq: person.qq,
      wechat: person.wechat,
      email: person.mail,
      phone: person.phone,
      info: person.info
    })
  },
  // 确认完善按钮
  formSubmit: function (e) {
    console.log(e);
    let _this = this;
    let emailStatus = this.data.emailStatus;
    let phoneStatus = this.data.phoneStatus;
    if (!emailStatus) {
      app.showErrorModal("请添加正确的邮箱");
      return;
    }
    if (!phoneStatus) {
      app.showErrorModal("请添加正确的手机号");
      return;
    }
    app.showLoadToast('完善中');
    // var student = wx.getStorageSync('student_Info')
    var qq = e.detail.value.qqNum;
    var wechat = e.detail.value.wechat;
    var mail = e.detail.value.email;
    var phone = e.detail.value.phoneNum;
    var info = e.detail.value.info;
    var data = {
      qq: qq,
      wechat: wechat,
      mail: mail,
      phone : phone,
      info:info
    }
    person.updatePerson(data,function(res){
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000
      });
      wx.navigateBack({
        delta:1
      })
    })
  },
  // 检查email输入框是否是符合规范
  emailBlur: function (e) {
    let email = e.detail.value;
    if (!app.judgeEmail(email)) {
      this.setData({ emailStatus: false })
    } else {
      this.setData({ emailStatus: true })
    }

  },
  // 用来检查微信输入框中是否含有汉字
  wechatBlur: function (e) {
    let wechat = app.judgeChinese(e.detail.value);
    this.setData({
      wechat: wechat
    })
  },
  // 验证手机号是否正确
  phone : function(e){
    let value = e.detail.value;
    let status = app.judgePhoneNum(value);
    if(status){
      // 正确
      this.setData({ phoneStatus: true })
    }else{
      // 错误
      this.setData({ phoneStatus: false })
    }
  },
  change : function(){
    this.setData({changeStatus : true})
  }
})