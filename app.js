//app.js
App({
  _server: 'https://api.dysceapp.com/znyx/',
  role: 0,
  onShow: function (res) {
  console.log("show")
  },
  // 发生错误的提示
  showErrorModal: function (content, title, cb) {
    wx.showModal({
      title: "",
      content: content || '未知错误',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          typeof cb == "function" && cb();
        }
      }
    });
  },
  //提示 加载中
  showLoadToast: function (title, duration, cb) {
    wx.showToast({
      title: title || '加载中',
      icon: 'loading',
      mask: true,
      duration: duration || 10000,
      success: function () {
        typeof cb == "function" && cb();
      }
    });
  },
  // 获得当前登录用户的微信信息
  getUserInfo: function (cb) {
    var that = this;
    //调用登录接口
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            let userInfo = res.userInfo
            typeof cb == "function" && cb(userInfo)
          }
        })
      }
    })
  },
  // 获取当前导员信息
  getTeacherMes: function (teacherId, cb) {
    //根据账号获取导员的详细信息
    let that = this;
    let data = {
      teacherbh: teacherId,
    };
    this.getRequest('/teacher/teacherSelect', data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        console.log("================获取导员信息===============");
        console.log(res.data.data[0]);
        let face = res.data.data[0].face;
        wx.setStorageSync('teacher_Info', res.data.data[0])
        if (face == "") {
          that.getUserInfo(function (user) {
            var face = user.avatarUrl;
            res.data.data[0].face = face;
            that.loadImg(face, 1);
            wx.setStorageSync('teacher_Info', res.data.data[0])
          })
        }
        // 执行传进来的函数
        typeof cb == "function" && cb();
      } else {
        console.log("==============获取信息失败==============")
        let msg = res.data.msg;
        // 清空信息，让其重新登录
        wx.removeStorageSync("user_Info");
        wx.removeStorageSync("teacher_Info");
        wx.removeStorageSync("session_id");
        that.showErrorModal(msg, "出错了", function () {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        })
      }
    })
  },
  // 获取当前小班信息
  getStuMes: function (stuId, cb) {
    //根据账号获取小班的详细信息
    let that = this;
    let data = {
      subteacherbh: stuId,
    };
    this.getRequest('/sub/subSelect', data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        console.log("================小班信息===============");
        console.log(res.data.data[0]);
        var face = res.data.data[0].face
        wx.setStorageSync('stu_Info', res.data.data[0])
        // that.setData({ student_Info: res.data.data });
        if (face == "") {
          that.getUserInfo(function (user) {
            var face = user.avatarUrl;
            res.data.data[0].face = face;
            that.loadImg(face, 2);
            wx.setStorageSync('stu_Info', res.data.data[0])
          })
        }
        // 执行传进来的函数
        typeof cb == "function" && cb();
      }
      else {
        console.log("==============获取信息失败==============")
        let msg = res.data.msg;
        // 清空信息，让其重新登录
        wx.removeStorageSync("user_Info");
        wx.removeStorageSync("stu_Info");
        wx.removeStorageSync("session_id");
        that.showErrorModal(msg, "出错了", function () {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        })
      }
    })
  },
  // 判断是否登陆
  judgeLogin: function () {
    // 获取id，判断其是否登陆
    let message = wx.getStorageSync('user_Info');
    let status = message.status;
    let teacherId = message.teacherNum;
    let stuId = message.stuNum;
    if (status == 1) {
      console.log("=================导员登陆==================")
      console.log(teacherId);
      // this.getTeacherMes(teacherId)
      let mes = {
        id: teacherId,
        status: 1
      }
      return mes;
    }
    else if (status == 2) {
      console.log("=================小班登陆==================")
      console.log(stuId);
      // this.getStuMes(stuId)
      let mes = {
        id: stuId,
        status: 2
      }
      return mes;
    }
    else if (status == 3) {
      console.log("=================接站人员登陆=============")
      let mes = {
        id: stuId,
        status: 3
      }
      return mes;
    }
    else {
      console.log("==============未登录==================")
      return 0;
    }
  },
  // 正则截取地址
  regularAddress: function (address) {
    let newAddress = ''
    let substr = address.match(/(\S*)(?=省)/);
    let substr1 = address.match(/省(\S*)市/);
    let substr2 = address.match(/(\S*)(?=市)/);
    if (substr == null) {
      if (substr2 == null) {
        newAddress = address
      }
      else {
        newAddress = substr2
      }
    }
    else {
      if (substr1 == null) {
        newAddress = address
      }
      else {
        newAddress = substr[1] + substr1[1]
      }
    }
    return newAddress;
  },
  // 上传头像地址
  loadImg: function (face, role) {
    let user = wx.getStorageSync('user_Info');
    switch (role) {
      case 1: var teacherbh = user.teacherNum; var data = {
        teacherbh: teacherbh,
        face: face,
      }; var url = "/teacher/teacherUpdate"; break;
      case 2: var subteacherbh = user.stuNum; var data = {
        subteacherbh: subteacherbh,
        face: face,
      }; var url = '/sub/subUpdate'; break;
    }
    let that = this;
    that.putRequest(url, data, function (res) {
      console.log(res)
      let status = res.data.status;
      if (status != 1) {
        let msg = res.data.meg;
        that.showErrorModal(sg)
      }
    })
  },
  // 获取数据库中的图片，并将其添加到缓冲中
  getImage: function (name, format, cb) {
    let that = this;
    let image = wx.getStorageSync(name);
    if (image) {
      console.log("=======================缓冲中含有图片地址======================")
      // 判断缓冲区中对应的图片是否还在
      wx.getImageInfo({
        src: image,
        success: function (res) {
          console.log("============缓冲中图片存在============");
          typeof cb == "function" && cb(image);
        },
        fail: function (res) {
          console.log("========缓冲中图片不存在==========");
          that.downImg(name, format, cb);
        }
      })
    } else {
      console.log("=======================缓冲中没有图片地址======================")
      that.downImg(name, format, cb);
    }
  },
  downImg: function (name, format, cb) {
    wx.getSavedFileList({
      success: function (res) {
        console.log(res)

      }
    })
    wx.downloadFile({
      url: "https://www.codemobile.cn/student/Public/image/" + name + format,
      type: 'image',
      success: function (res) {
        let tempFilePath = res.tempFilePath;
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            console.log("=================文件保存地址======================")
            let savedFilePath = res.savedFilePath;
            console.log(savedFilePath);
            // 将文件的保存地址保存到本地缓存中，调用的时候从这里根据地址调用图片
            wx.setStorageSync(name, savedFilePath);
            typeof cb == "function" && cb(savedFilePath);
          },
          fail: function (res) {
            console.log("============下载图片失败===========");
            console.log("=============删除图片==============");
            wx.getSavedFileList({
              success: function (res) {
                console.log(res)
                for (let i = 0; i < res.fileList.length; i++) {
                  wx.removeSavedFile({
                    filePath: res.fileList[i].filePath,
                    complete: function (res) {
                      console.log(res);
                      console.log("删除成功")
                      if (i == res.fileList.length - 1) {
                        console.log("开始下载新的")
                        that.downImg(name, format, cb)
                      }
                    }
                  })
                }

              }
            })

          },
          complete: function (res) {
            // complete
            console.log(res)
          }
        })

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  // 发get请求
  getRequest: function (url, data, success) {
    let session_id = wx.getStorageSync('session_id');
    if (session_id) {
      data.session_id = session_id;
    }
    wx.request({
      url: this._server + url,
      data: data,
      method: 'GET',
      success: success,
      fail: function (res) {
        wx.hideToast();
        let msg = res.data.msg;
        app.showErrorModal(msg, "出错了");
      },
      complete: function (res) {

      }
    })
  },
  // 发post请求
  postRequest: function (url, data, success) {
    if (url == '/student/stuLogin' || url == "/teacher/teacherLogin" || url == "/sub/subLogin" || url == "/staff/staffLogin") {
      console.log("============登陆接口================")
    } else {
      let session_id = wx.getStorageSync('session_id');
      if (session_id) {
        data.session_id = session_id;
      }
    }
    wx.request({
      url: this._server + url,
      data: data,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: success,
      fail: function (res) {
        wx.hideToast();
        let msg = res.data.msg;
        app.showErrorModal(msg, "出错了");
      },
      complete: function (res) {

      }
    })
  },
  // 发put请求
  putRequest: function (url, data, success) {
    let session_id = wx.getStorageSync('session_id');
    if (session_id) {
      data.session_id = session_id;
    }
    wx.request({
      url: this._server + url,
      data: data,
      method: 'PUT',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: success,
      fail: function (res) {
        wx.hideToast();
        let msg = res.data.msg;
        app.showErrorModal(msg, "出错了");
      },
      complete: function (res) {

      }
    })
  },
  // 检查手机号是否正确
  judgePhoneNum: function (num) {
    if ((/^1[34578]\d{9}$/.test(num))) {
      return true;
    } else {
      return false;
    }
  },
  // 禁止输入中文字符
  judgeChinese: function (num) {
    var wechat = "";
    for (let i = 0; i < num.length; i++) {
      if (num.charCodeAt(i) > 0 && num.charCodeAt(i) < 255) {
        wechat += num.charAt(i)
      }
    }
    return wechat;

  },
  // 验证电子邮箱
  judgeEmail: function (email) {
    let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (myreg.test(email)) {
      return true;
    } else {
      return false;
    }
  },
  // 将性格标签转化为数组
  changeCharacter: function (tag) {
    let array = tag.split(",");
    let character = []
    for (let i = 0; i < array.length - 1; i += 3) {
      character.push({
        name: array[i],
        swiperIndex: array[i + 1],
        characterIndex: array[i + 2]
      });

    }
    return character;
  }
})