let app = getApp();
var person;
Page({
  data: {
    totalNum: 0,
    registerNum: 0,
    register: 0,
    NotRegisterNum: 0,
    selfNum: 0,
    publicNum: 0,
    successReportNum: 0,
    notDormNum: 0,
    dorm: 0,
    successReceiveNum: 0,
    receive: 0
  },
  onLoad: function () {
    console.log("onload")
    let status = app.judgeLogin();
    console.log(status)
    if (status == 0) {
      wx.redirectTo({
        url: '../../login/login',
      })
      return;
    }
    let role = status.status;
    switch (role) {
      case 1: app.getTeacherMes(status.id); app.role = 1;
        var common = require("../../../utils/teacher");
        let teacherMessage = wx.getStorageSync("teacher_Info");
        person = new common.teacher(teacherMessage); break;
      case 2: app.getStuMes(status.id); app.role = 2;
        var common = require("../../../utils/stu");
        let stuMessage = wx.getStorageSync("stu_Info");
        person = new common.stu(stuMessage); break;
      case 3: app.role = 3
        wx.redirectTo({
          url: '../../station/meetStation/meetStation',
        }); return;
    }
    app.showLoadToast();
    this.getNum();
  },
  onPullDownRefresh: function () {
    this.getNum();
  },
  getNum: function () {
    console.log("获取人数")
    console.log(app.role)
    console.log(person);
    let that = this;
    // 先获取导员管理的总人数
    person.getTotalNum(function (count, res) {
      console.log(res)
      var totalNum = count;
      that.setData({ totalNum: count });
      // 获取注册总人数
      person.getRegisterNum(function (count) {
        // let totalNum = that.data.totalNum;
        let register = Math.round(count / totalNum * 100) / 1;
        // 获取未注册人数
        let notRegister = totalNum - count;
        that.setData({ registerNum: count, register: register, NotRegisterNum: notRegister })
      });
      // 获取自驾人数
      person.getUsercarNum(function (count) {
        that.setData({ selfNum: count });
      },2)
      // 获取乘坐公共交通的人数
      person.getUsercarNum(function (count) {
        var publicNum = count
        let usercar = Math.round(count / totalNum * 100) / 1;
        that.setData({ publicNum: publicNum, usercar: usercar });
        // 获取成功到站人数    这个需要获得乘坐公共交通的人数，所以放在这里
        person.getReceiveNum(function (count) {
          let receive = Math.round(count / publicNum * 100) / 1;
          that.setData({ successReceiveNum: count, receive: receive })
          wx.stopPullDownRefresh()
          wx.hideToast()
        })
      },1)
      // 获取成功接到的人数
      person.getReportNum(function (count) {
        let report = Math.round(count / totalNum * 100) / 1;
        that.setData({ successReportNum: count, report: report });
      })
      // 获取成功选择宿舍的人数
      person.getDormNum(function (count) {
        let dorm =  Math.round(count / totalNum * 100) / 1;
        that.setData({ dorm : dorm, dormNum: count });
      })
      // 获取成功入住宿舍的人数
      person.getSureDorm(function(count){
        let sureDorm = Math.round(count / totalNum * 100) /1;
        that.setData({ sureDorm: sureDorm, successDorm:count})
      })
    });
  },
  see : function(e){
    let value = e.target.dataset.name;
    wx.navigateTo({
      url: '../detail/detail?name='+value,
    })
  }
})