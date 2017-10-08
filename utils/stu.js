let app = getApp();
class Stu {
  constructor(stu) {
    this.subteacherbh = stu.subteacherbh;
    this.name = stu.name;
    this.sex = stu.sex;
    this.face = stu.face;
    this.majorbh = stu.majorbh;
    this.majorname = stu.majorname;
    this.class = stu.class;
    this.info = stu.subinfo;
    this.teacherbh = stu.teacherbh;
    this.phone = stu.phone;
    this.qq = stu.qq;
    this.wechat = stu.wechat;
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
  updatePerson(data, cb) {
    let that = this;
    data.subinfo = data.info;
    data.subteacherbh = this.subteacherbh;
    delete data.info;
    let url = "/sub/subUpdate";
    app.putRequest(url, data, function (res) {
      wx.hideToast();
      let status = res.data.status;
      if (status == 1) {
        let stu = wx.getStorageSync("stu_Info");
        stu.qq = data.qq;
        stu.phone = data.phone;
        stu.subinfo = data.subinfo;
        stu.wechat = data.wechat;
        wx.setStorageSync("stu_Info",stu)
        typeof cb == "function" && cb(res);
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  }
  // 获取小班管理的总人数
  getTotalNum(cb) {
    let data = {
      subteacherbh: this.subteacherbh
    }
    this.getNumRequest(data, cb);
  }
  // 获取注册情况
  getRegisterNum(cb,status = 1,page = 1, pageNum = 10) {
    let data = {
      subteacherbh: this.subteacherbh,
      status: status,
      page : page,
      pageNum : pageNum
    }
    this.getNumRequest(data, cb);
  }
  // 获取选择各种交通工具的情况
  getUsercarNum(cb,usecar,page = 1,pageNum = 10) {
    let data = {
      subteacherbh: this.subteacherbh,
      usecar: usecar,
      page: page,
      pageNum: pageNum
    }
    this.getNumRequest(data, cb);
  }
  // 获取乘坐公共交通的人数
  // getPublicNum(cb) {
  //   let data = {
  //     subteacherbh: this.subteacherbh,
  //     usecar: 1
  //   }
  //   this.getNumRequest(data, cb);
  // }
  // 获得报到的情况
  getReportNum(cb,report = 1,page = 1,pageNum = 1) {
    let data = {
      subteacherbh: this.subteacherbh,
      report: report,
      page: page,
      pageNum: pageNum
    }
    this.getNumRequest(data, cb)
  }
  // // 获得是否选择宿舍的情况
  // getDormNum(cb) {
  //   let data = {
  //     majorbh: this.majorbh,
  //     class: this.class,
  //     dormbh: ''
  //   }
  //   this.getNumRequest(data, cb)
  // }
  // 获得是否选择宿舍的情况
  getDormNum(cb,page = 1,pageNum = 10) {
    let data = {
      subteacherbh: this.subteacherbh,
      page : page,
      pageNum : pageNum
    }
    app.getRequest("/room/stuRoomSelect", data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        let count = res.data.data.length;
        typeof cb == "function" && cb(count,res);
      } else {
        console.log("===========小班查看是否选宿舍人数错误==========");
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    });
  }
  // 查询宿舍入住情况
  getSureDorm(cb, dormstatus = 1, page = 1, pageNum = 10) {
    let data = {
      subteacherbh: this.subteacherbh,
      dormstatus: dormstatus,
      page: page,
      pageNum: pageNum
    }
    this.getNumRequest(data, cb);
  }
  // 获得接站情况
  getReceiveNum(cb,pstatus = 1,page = 1,pageNum = 10 ) {
    let data = {
      subteacherbh: this.subteacherbh,
      pstatus: pstatus,
      page: page,
      pageNum: pageNum
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
  // 获得导员信息
  // getTeacherMessage(cb) {
  //   let that = this;
  //   let data = {
  //     teacherbh: teacherbh
  //   }
  //   let url = "/teacher/teacherSelect"
  //   app.getRequest(url, data, function (res) {
  //     let status = res.data.status;
  //     if (status == 1) {
  //       // that.teacher = res.data.data;
  //       typeof cb == "function" && cb(res)
  //     } else {
  //       let msg = res.data.msg;
  //       app.showErrorModal(msg);
  //     }
  //   })
  // }
  // 获得导员发的通知
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

  // 获得小班发的通知
  getStuNotice(cb, pageNum = 10, page = 1) {
    let data = {
      page: page,
      pageNum: pageNum,
      writerbh: this.subteacherbh
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
  // 小班发布通知
  sendNotice(title, content, cb) {
    let data = {
      title: title,
      content: content,
      writerbh: this.subteacherbh,
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
        app.showErrorMdodal(msg)
      }
    })
  }
  // 获得自己管理的学生情况
  getStudentMessage(data,cb){
    data.subteacherbh =  this.subteacherbh;
    let url = "/student/stuSelect";
    app.getRequest(url,data,function(res){
      wx.hideToast()
      let status = res.data.status;
      if(status == 1){
        typeof cb == "function" && cb(res);
      }else{
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  }
  // 获得问答中回复我的
  getReplay(data, cb) {
    data.to_id = this.subteacherbh;
    let url = "/question/questionSelect";
    app.getRequest(url, data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        typeof cb == "function" && cb(res);
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
  // 问答中回复问题
  replay(data, cb) {
    data.from_id = this.subteacherbh;
    data.from_name = this.name;
    data.from_face = this.face;
    data.role = 4;
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
}
// let stu = new Stu();
// stu.getTeacherMessage(function () {
//   module.exports.teacher = stu.teacher
// });
module.exports.stu = Stu
// module.exports.getRegisterNum = stu.getRegisterNum
// module.exports.getUsercarNum = stu.getUsercarNum
// module.exports.getNumRequest = stu.getNumRequest
// module.exports.getPublicNum = stu.getPublicNum
// module.exports.getDormNum = stu.getDormNum
// module.exports.getReportNum = stu.getReportNum
// module.exports.getReceiveNum = stu.getReceiveNum
// module.exports.getSchoolNotice = stu.getSchoolNotice
// module.exports.stu = stu.stu
// module.exports.getTeacherNotice = stu.getTeacherNotice
// module.exports.getStuNotice = stu.getStuNotice
// module.exports.sendNotice = stu.sendNotice
// module.exports.deleteNotice = stu.deleteNotice
// module.exports.noticeMessage = stu.noticeMessage
// module.exports.getName = getName