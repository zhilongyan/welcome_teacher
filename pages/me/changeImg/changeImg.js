// pages/me/changImg/changImg.js
let app = getApp();
var _server = app._server;
var person;
var role;
Page({
  data: {
    face: '',
    studentNum: ''
  },
  onLoad: function (options) {
    role = app.role;
    switch (role) {
      case 0　: wx.redirectTo({
        url: '../../login/login',
      }); break;
      case 1: var common = require("../../../utils/teacher");
        let teacherMessage = wx.getStorageSync("teacher_Info");
        person = new common.teacher(teacherMessage); break;
      case 2: var common = require("../../../utils/stu");
        let stuMessage = wx.getStorageSync("stu_Info");
        person = new common.stu(stuMessage); break;
      case 3: wx.redirectTo({
        url: '../../station/meetStation/meetStation',
      }); break;
    }
    let face = person.face;
    this.setData({ face: face })
  },
  changeImg: function () {
    console.log("===============上传头像按钮==================")
    var name;
    var url;
    switch (role) {
      case 1: name = person.teacherbh; url = "/teacher/face"; break;
      case 2: name = person.subteacherbh; url = "/sub/face"; break;
    }
    let studentNum = this.data.studentNum;
    let that = this;
    let session_id = wx.getStorageSync('session_id');
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showToast({
          title: "上传中",
          icon: "loading",
          duration: 60000,
        })
        wx.uploadFile({
          url: _server + url,
          filePath: tempFilePaths[0],
          name: name,
          formData: {
            "Content-Type": "application/x-www-form-urlencoded",
            name: name,
            session_id: session_id
          },
          success: function (res) {
            console.log(res);
            // 将json数据转换成对象
            let data = JSON.parse(res.data);

            wx.hideToast();
            if (data.status == 1) {
              let face = data.data;
              var people;
              switch (role) {
                case 1: people = wx.getStorageSync("teacher_Info"); people.face = face; wx.setStorageSync("teacher_Info", people); break;
                case 2: people = wx.getStorageSync("stu_Info"); people.face = face; wx.setStorageSync("stu_Info", people); break;
              }

              console.log(res);
              wx.switchTab({
                url: '../wode/wode',
              })
            }
            else {
              wx.showModal({
                title: "图片过大",
                content: "上传出现错误了，可能是图片过大，换张照片试试",
                showCancel: false,
              })
            }
          },
          fail: function (res) {
            console.log(res);
            wx.hideToast();
            wx.showModal({
              title: "图片过大",
              content: "上传出现错误了，可能是图片过大，换张照片试试",
              showCancel: false,
            })
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})