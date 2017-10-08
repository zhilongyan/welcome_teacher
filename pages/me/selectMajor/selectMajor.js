// pages/me/selectMajor/selectMajor.js
let app = getApp();
var person;
var role;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    majorView: [{ majorname: "系名", classname: "班级名", majorIndex: -1 }],
    classArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获得所有专业
    app.getRequest("/student/stuMajor", {
    }, function (res) {
      let status = res.data.status;
      console.log(res)
      if (status == 1) {
        var allMajor = res.data.data;
        var allMajorname = [];
        for (let i = 0; i < allMajor.length; i++) {
          allMajorname.push(allMajor[i].majorname);
        }
        that.setData({ major: allMajor, majorname: allMajorname })
        let teacherbh = options.teacherbh;
        //判断是从哪个页面进来的
        if (teacherbh) {
          // 从登录页进来的
          that.setData({ teacherbh: teacherbh, come: true })
        } else {
          // 从我页面进来的
          role = app.role;
          let common = require("../../../utils/teacher");
          let teacherMessage = wx.getStorageSync("teacher_Info");
          person = new common.teacher(teacherMessage);
          that.setData({ teacherbh: person.teacherbh })
          // 获取已选专业的编号加名称
          let major = person.majorbh;
          let majorname = person.majorname;
          // 获得放系名的容器
          let majorView = that.data.majorView;
          for (var i = 0; i < major.length; i++) {
            // 获得此系下自己所管理的班级
            person.getClass(major[i], function (res) {
              let className = res.data.data;
              var classArr = that.data.classArr;
              let classString = ''
              for (let i = 0; i < className.length; i++) {
                if (i == 0) {
                  classString += className[i].class;
                } else {
                  classString += "," + className[i].class;
                }
              }
              classArr.push(classString)
              that.setData({ classArr: classArr })
            })
            // 如果是第一个系就不用增加容器
            if (i >= 1) {
              majorView.push({ majorname: "系名", classname: "班级名", majorIndex: -1 });
            }
            // 与所有系的系编号进行比较，获得当前系编号对应的数组下标
            for (var j = 0; j < allMajor.length; j++) {
              if (major[i] == allMajor[j].majorbh) {
                majorView[i].majorIndex = j;
                break;
              }
            }
          }
          that.setData({ majorView: majorView })
        }
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })



    // 
  },
  // 增加专业
  addMajor: function () {
    let majorView = this.data.majorView;
    majorView.push({ majorname: "系名", classname: "班级名", majorIndex: -1 });
    this.setData({ majorView: majorView })
  },
  // 选择专业
  roleChange: function (e) {
    let value = e.detail.value;
    let index = e.target.dataset.id;
    let majorView = this.data.majorView;
    majorView[index].majorIndex = value;
    this.setData({ majorView: majorView })
  },
  // 选择班级
  getClass: function (e) {
    let value = e.detail.value;
    // g  全局搜索
    let newValue = value.replace(/，/g, ",")
    let index = e.target.dataset.id;
    let classArr = this.data.classArr;
    classArr[index] = newValue;
    this.setData({ classArr: classArr })
  },
  // 发送所选择的专业
  sureMajor: function () {
    let majorView = this.data.majorView;
    let majorbh = "";
    let majorname = "";
    let major = this.data.major;
    let that = this;
    let classArr = this.data.classArr;
    for (let i = 0; i < majorView.length; i++) {
      let index = majorView[i].majorIndex;
      if (index == -1) {
        continue;
      }
      if (i == 0) {
        majorbh += major[index].majorbh;
        majorname += major[index].majorname;
      } else {
        majorbh += "," + major[index].majorbh;
        majorname += "," + major[index].majorname;
      }
      if (classArr[i] == null || classArr[i] == "" || classArr.length == 0) {
        app.showErrorModal("填写信息有误，请完善");
        return;
      }
    }
    let classbh = classArr.join('-')
    let teacherbh = this.data.teacherbh;
    let data = {
      majorname: majorname,
      majorbh: majorbh,
      class: classbh,
      teacherbh: teacherbh
    }
    app.showLoadToast("修改中")
    app.putRequest("/teacher/teaMajorUpdate", data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        app.getTeacherMes(teacherbh, function (res) {
          wx.hideToast();
          let come = that.data.come;
          if (come) {
            wx.switchTab({
              url: '/pages/home/index/index',
            })
          }
          else {
            wx.switchTab({
              url: '/pages/me/wode/wode',

            })
          }
        })
      } else {
        wx.hideToast();
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
})