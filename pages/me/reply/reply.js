// pages/me/reply/reply.js
let app = getApp();
var person;
let pageNum = 10;
Page({
  data: {
    message: [
    ],
    page: 1,
    downStatus: false,
    loadStatus: false,
    upStatus: false,
    loadAllStatus: false,
    // 下拉刷新状态
    refresh: false,
    studentNum: '',
    noMessage: false,
  },
  onLoad: function (options) {
    let role = app.role;
    switch (role) {
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
    app.showLoadToast();
    this.getMes();

  },
  // 获取回复我的数据
  getMes: function () {
    let page = this.data.page;
    // 导航条加载中样式,只有加载第一页的时候才会出现
    if (page == 1) {
      wx.showNavigationBarLoading()
    }
    else {
      this.setData({ loadStatus: true })
    };

    let data = {
      page: page,
      pageNum: pageNum
    }
    let that = this;
    person.getReplay(data, function (res) {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      wx.hideToast()
      let count = res.data.count;
      if (count == 0) {
        console.log("=============没有查询到数据==============");
        that.setData({
          downStatus: false,
          loadStatus: false,
          upStatus: false,
          loadAllStatus: false,
          noMessage: true,
          message: []
        })
      } else {
        // 获得当前页面的内容
        let mes = res.data.data;
        // 当前页面不是第一页,需要将前面的内容和现在的内容连接在一起
        if (page != 1) {
          var oldMes = that.data.message;
          var newMes = oldMes.concat(mes)
        } else {
          var newMes = mes;
        }
        // 获得总页数
        let allPage = Math.ceil(count / pageNum);
        // 下一页的页码
        let nextPage = page + 1;
        // 下一页的页码大于总页数，不继续加页码了
        if (nextPage > allPage) {
          var newPage = page;
          // 是否显示下拉加载
          var loadAllStatus = true;
          var downStatus = false;
        }
        else {
          var newPage = nextPage;
          var downStatus = true;
          var loadAllStatus = false;
        }
        that.setData({
          message: newMes,
          page: newPage,
          downStatus: downStatus,
          loadAllStatus: loadAllStatus,
          upStatus: false,
          loadStatus: false,
          noMessage: false
        })
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function (e) {
    this.setData({ upStatus: true, page: 1 });
    this.getMes();
  },
  //上拉加载
  onReachBottom: function (e) {
    //获取现在是否已全部加载完毕
    let loadAllStatus = this.data.loadAllStatus;
    //如果全部加载完毕，则不执行下拉加载
    if (loadAllStatus == true) return;
    //显示加载中
    this.setData({ loadStatus: true, downStatus: false });
    this.getMes();

  },

})