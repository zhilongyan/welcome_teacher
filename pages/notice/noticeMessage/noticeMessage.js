// pages/notice/noticeMessage/noticeMessage.js
let app = getApp();
var person;
Page({
  data: {},
  onLoad: function (options) {
    let role = app.role;
    switch (role) {
      case 1: let common = require("../../../utils/teacher");
        let teacherMessage = wx.getStorageSync("teacher_Info");
        person = new common.teacher(teacherMessage); break;
      case 2: var common = require("../../../utils/stu");
        let stuMessage = wx.getStorageSync("stu_Info");
        person = new common.stu(stuMessage); break;;
    }
    let id = options.id;
    var del = options.del;
    if (del == "true") {
      del = true
    } else {
      del = false
    }
    let that = this;
    person.noticeMessage(id, function (res) {
      let message = res.data.data[0];
      let time = message.time;
      let newTime = new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
      message.time = newTime;
      message.del = del;
      message.id = id;
      that.setData({ message: message })
    })
  },
  del: function () {
    let id = this.data.message.id;
    wx.showModal({
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          person.deleteNotice(id, function (res) {
            wx.showToast({
              title: '删除成功',
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
        } else if (res.cancel) {
          return
        }
      }
    })

  }
})