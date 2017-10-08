// pages/notice/index/index.js
let app = getApp();
var person;
var role;
Page({
  data: {
    schoolNotice:[],
    teacherNotice:[],
    stuNotice:[]
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
  },
  onShow: function () {
    this.getMes();
  },
  getMes: function () {
    let that = this;
    person.getSchoolNotice(function (res) {
      let schoolNotice = res.data.data;
      for(let i =0;i<schoolNotice.length;i++){
        schoolNotice[i].time = that.getDate(schoolNotice[i].time)
      };
      if(schoolNotice.length>=1){
        var title = "校园通知"
      }else{
        var title = ""
      }
      that.setData({ schoolNotice: schoolNotice, schoolTitle:title })
    })
    person.getTeacherNotice(function (res) {
      let teacherNotice = res.data.data;
      if (role == 1) {
        for (let i = 0; i < teacherNotice.length; i++) {
          teacherNotice[i].del = true;
          teacherNotice[i].time = that.getDate(teacherNotice[i].time);
        }
      } else {
        for (let i = 0; i < teacherNotice.length; i++) {
          teacherNotice[i].time = that.getDate(teacherNotice[i].time);
          teacherNotice[i].del = false;
        }
      }
      if (teacherNotice.length >= 1) {
        var title = "导员通知"
      } else {
        var title = ""
      }
      that.setData({ teacherNotice: teacherNotice, teacherTitle: title })
    })
    // 获得小班通知需要获得小班信息
    var oldStuNotice = []
    person.getStuNotice(function (res) {
      wx.stopPullDownRefresh()
      let stuNotice = res.data.data;
      for (let i = 0; i < stuNotice.length; i++) {
        stuNotice[i].del = true;
        stuNotice[i].time = that.getDate(stuNotice[i].time);
      }
      oldStuNotice = oldStuNotice.concat(stuNotice);
      if (oldStuNotice.length >= 1) {
        var title = "小班通知"
      } else {
        var title = ""
      }
      that.setData({ stuNotice: oldStuNotice, stuTitle: title  })
    })
  },
  onPullDownRefresh: function () {
    this.getMes();
  },
  getDate: function (time) {
    var now = new Date(time * 1000);
    var year = now.getYear() - 100;
    var month = now.getMonth() + 1;
    var date = now.getDate();
    return year + "/" + month + "/" + date;
  }
})