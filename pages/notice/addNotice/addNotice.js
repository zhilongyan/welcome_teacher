// pages/notice/addNotice/addNotice.js
let app = getApp();
var person
Page({
  data: {},
  onLoad: function (options) {
    let role = app.role;
    switch (role) {
      case 1: let common = require("../../../utils/teacher");
        let teacherMessage = wx.getStorageSync("teacher_Info");
        person = new common.teacher(teacherMessage); break;;
      case 2: var common = require("../../../utils/stu");
        let stuMessage = wx.getStorageSync("stu_Info");
        person = new common.stu(stuMessage); break;
    }
  },
  submitNotice: function (e) {
    let titleMessage = this.data.title;
    if (titleMessage == undefined) {
      app.showErrorModal("标题不可以为空");
      return
    }
    // 去掉空格
    let title = titleMessage.replace(/(^\s*)|(\s*$)/g, "");
    if (title == '') {
      app.showErrorModal("标题不可以为空");
      return
    }

    let message = this.data.message;
    if (message == undefined) {
      app.showErrorModal("内容不可以为空")
      return
    }
    let content = message.replace(/(^\s*)|(\s*$)/g, "");
    if (content == "") {
      app.showErrorModal("内容不可以为空")
      return
    }

    // 发布公告
    person.sendNotice(title, content, function (res) {
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 1000,
        mask: true
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    })
  },
  title: function (e) {
    let title = e.detail.value;
    this.setData({ title: title })
  },
  message: function (e) {
    let message = e.detail.value;
    this.setData({ message: message })
  }
})