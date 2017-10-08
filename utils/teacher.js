let app = getApp();
class Teacher {
  constructor(teacher) {
    this.teacherbh = teacher.teacherbh;
    this.name = teacher.name;
    this.phone = teacher.phone;
    this.sex = teacher.sex;
    this.qq = teacher.qq;
    this.face = teacher.face;
    this.wechat = teacher.wechat;
    this.info = teacher.teainfo;
    this.majorname = teacher.majorname.split(",");
    this.majorbh = teacher.majorbh.split(",");
  }
  // 获得数量情况的接口
  getNumRequest(data, cb, url = "/student/stuSelect") {
    app.getRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        let count = res.data.count;
        typeof cb == "function" && cb(count, res)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
  // 更新个人信息
  updatePerson (data,cb){
    let that = this;
    data.teainfo = data.info;
    data.teacherbh = this.teacherbh;
    delete data.info;
    let url = "/teacher/teacherUpdate";
    app.putRequest(url,data,function(res){
      let status = res.data.status;
      if(status == 1){
        let teacher = wx.getStorageSync("teacher_Info");
        teacher.qq = data.qq;
        teacher.phone = data.phone;
        teacher.teainfo = data.teainfo;
        teacher.wechat = data.wechat;
        wx.setStorageSync("teacher_Info", teacher)
        typeof cb == "function" && cb(res);
      }else{
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  }
  // 获取导员管理的总人数
  getTotalNum(cb) {
    let data = {
      teacherbh: this.teacherbh
    }
    this.getNumRequest(data, cb);
  }
  // 获取注册情况
  getRegisterNum(cb,status = 1,page = 1,pageNum = 10) {
    let data = {
      teacherbh: this.teacherbh,
      status: status,
      page: page,
      pageNum: pageNum
    }
    this.getNumRequest(data, cb);
  }
  // 获取接站方面人数
  getUsercarNum(cb,usecar,page = 1, pageNum = 10) {
    let data = {
      teacherbh: this.teacherbh,
      usecar: usecar,
      page: page,
      pageNum: pageNum
    }
    this.getNumRequest(data, cb);
  }
  // // 获取乘坐公共交通的人数
  // getPublicNum(cb, page = 1, pageNum = 10) {
  //   let data = {
  //     teacherbh: this.teacherbh,
  //     usecar: 1,
  //     page: page,
  //     pageNum: pageNum
  //   }
  //   this.getNumRequest(data, cb);
  // }
  // 获得报到的情况
  getReportNum(cb, report = 1,page = 1, pageNum = 10) {
    let data = {
      teacherbh: this.teacherbh,
      report: report,
      page: page,
      pageNum: pageNum
    }
    this.getNumRequest(data, cb)
  }
  // 获得是否选择宿舍的情况
  getDormNum(cb, page = 1, pageNum = 10) {
    let data = {
      teacherbh: this.teacherbh,
      page : page,
      pageNum : pageNum
    }
    app.getRequest("/room/stuRoomSelect",data,function(res){
      let status = res.data.status;
      if(status == 1){
        let count = res.data.data.length;
        typeof cb == "function" && cb(count,res);
      }else{
        console.log("===========导员查看是否选宿舍人数错误==========");
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    });
  }
  // 查询宿舍入住情况
  getSureDorm(cb,dormstatus = 1,page = 1,pageNum = 10){
    let data = {
      teacherbh : this.teacherbh,
      dormstatus : dormstatus,
      page : page,
      pageNum : pageNum
    }
    this.getNumRequest(data, cb);
  }
  // 获得接站情况
  getReceiveNum(cb,pstatus = 1,page = 1,pageNum = 10) {
    let data = {
      teacherbh: this.teacherbh,
       pstatus: pstatus
    }
    let url = "/position/poSelect"
    this.getNumRequest(data, cb, url)
  }
  // 获得校方的通知
  getSchoolNotice(cb, pageNum = 10, page = 1) {
    let data = {
      page: page,
      pageNum: pageNum,
      writerbh: "admin"
    };
    let url = "/notice/noticeSelect";
    app.getRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        typeof cb == "function" && cb(res)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
  // 获得自己发的通知
  getTeacherNotice(cb, pageNum = 10, page = 1) {
    let data = {
      page: page,
      pageNum: pageNum,
      writerbh: this.teacherbh
    };
    let url = "/notice/noticeSelect";
    app.getRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        typeof cb == "function" && cb(res)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
  // 获得手下小班信息
  getStuMessage(cb) {
    let that = this;
    let data = {
      teacherbh: this.teacherbh,
    }
    let url = "/sub/subSelect"
    app.getRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        // that.stu = res.data.data;
        typeof cb == "function" && cb(res)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
  // 获得手下小班发的通知
  getStuNotice(cb, pageNum = 10, page = 1) {
    this.getStuMessage(function (res) {
      let stuMessage = res.data.data;
      for (let i = 0; i < stuMessage.length; i++) {
        let data = {
          page: page,
          pageNum: pageNum,
          writerbh: stuMessage[i].subteacherbh
        };
        let url = "/notice/noticeSelect";
        app.getRequest(url, data, function (res) {
          let status = res.data.status;
          if (status == 1) {
            typeof cb == "function" && cb(res)
          } else {
            let msg = res.data.msg;
            app.showErrorModal(msg);
          }
        })
      }
    })

  }
  // 导员发布通知
  sendNotice(title, content, cb) {
    let data = {
      title: title,
      content: content,
      writerbh: this.teacherbh,
      writer: this.name
    }
    let url = "/notice/noticeAdd";
    app.postRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        typeof cb == "function" && cb(res)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  }
  // 删除通知
  deleteNotice(id, cb) {
    let data = {
      id: id
    }
    let url = "/notice/noticeDel";
    app.postRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        typeof cb == "function" && cb(res)
      } else {
        let msg = res.data.msg;
        app.showErrorMdodal(msg)
      }
    })
  }
  // 获得某条通知的详细内容
  noticeMessage(id, cb) {
    let data = {
      id: id
    }
    let url = "/notice/noticeSelect"
    app.getRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        typeof cb == "function" && cb(res)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  }
  // 退出登录
  // quit() {
  //   let url = "/teacher/teacherLogout";
  //   app.postRequest(url, {}, function (res) {
  //     let status = res.data.status;
  //     if (status == 1) {
  //       wx.removeStorageSync("user_Info");
  //       wx.removeStorageSync("session_id");
  //       wx.removeStorageSync("teacher_Info");
  //       this.status = false;
  //       wx.redirectTo({
  //         url: '/pages/login/login',
  //       });

  //     } else {
  //       let msg = res.data.msg;
  //       app.showErrorModal(msg);
  //     }
  //   })
  // }
  // 查询老师管理的班级
  getClass(cb) {
    let data = {
      majorname: this.majorname[0],
      teacherbh: this.teacherbh
    };
    let url = "/student/stuClass";
    app.getRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        typeof cb == "function" && cb(res)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  }
  // // 查询某专业下非的班级
  // getClass(majorbh, cb) {
  //   let data = {
  //     majorbh: majorbh,
  //     teacherbh: this.teacherbh
  //   };
  //   let url = "/student/stuClass";
  //   app.getRequest(url, data, function (res) {
  //     let status = res.data.status;
  //     if (status == 1) {
  //       typeof cb == "function" && cb(res)
  //     } else {
  //       let msg = res.data.msg;
  //       app.showErrorModal(msg)
  //     }
  //   })
  // }
  // 获得问答中回复我的
  getReplay(data,cb){
    data.to_id = this.teacherbh;
    let url = "/question/questionSelect";
    app.getRequest(url,data,function(res){
      let status = res.data.status;
      if(status == 1){
        typeof cb == "function" && cb(res);
      }else{
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
  // 问答中回复问题
  replay(data, cb) {
    data.from_id = this.teacherbh;
    data.from_name = this.name;
    data.from_face = this.face;
    data.role = 3;
    let url = "/question/questionReply";
    app.postRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        typeof cb == "function" && cb(res);
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
  // 获取某个学生
  search(url,data,cb){
    app.getRequest(url,data,function(res){
      let status = res.data.status;
      if(status){
        typeof cb == "function"  && cb(res);
      }else{
        console.log("=====获取学生详细情况错误=======");
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
}

// if(teacher.status )
// console.log("实例化对象")
// let teacherMessage = wx.getStorageSync("teacher_Info");
// let teacher = new Teacher(teacherMessage);
module.exports.teacher = Teacher;
// module.exports.getTotalNum = teacher.getTotalNum
// module.exports.getRegisterNum = teacher.getRegisterNum
// module.exports.getUsercarNum = teacher.getUsercarNum
// module.exports.getNumRequest = teacher.getNumRequest
// module.exports.getPublicNum = teacher.getPublicNum
// module.exports.getReportNum = teacher.getReportNum
// module.exports.getDormNum = teacher.getDormNum
// module.exports.getReceiveNum = teacher.getReceiveNum
// module.exports.getSchoolNotice = teacher.getSchoolNotice
// module.exports.teacher = teacher.teacher
// module.exports.getTeacherNotice = teacher.getTeacherNotice
// module.exports.getStuMessage = teacher.getStuMessage
// module.exports.getStuNotice = teacher.getStuNotice
// module.exports.sendNotice = teacher.sendNotice
// module.exports.deleteNotice = teacher.deleteNotice
// module.exports.noticeMessage = teacher.noticeMessage
