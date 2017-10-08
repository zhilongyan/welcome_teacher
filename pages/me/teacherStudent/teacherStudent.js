// pages/me/teacherStudent/teacherStudent.js
let app = getApp();
let teacher;
let pageNum = 10;
Page({
  data: {
    majorIndex: -1,
    classIndex: 0,
    hideStatus: false,
    downStatus: false,
    loadStatus: false,
    loadAllStatus: false,
    page: 1,
  },
  onLoad: function (options) {
    let common = require("../../../utils/teacher");
    let teacherMessage = wx.getStorageSync("teacher_Info");
    teacher = new common.teacher(teacherMessage);
    // let majorbh = teacher.majorbh;
    // let majorname = teacher.majorname;
    // this.setData({ majorbh: majorbh, majorname: majorname })
    let that = this;
    teacher.getClass(function (res) {
      let className = res.data.data;
      let classArr = []
      for (let i = 0; i < className.length; i++) {
        classArr.push(className[i].class)
      }
      that.setData({ classArr: classArr })
    })
  },
  // 选择系
  changeMajor: function (e) {
    console.log(e);
    let value = e.detail.value;
    this.setData({ classArr: [],  majorIndex: value });
    let major = this.data.majorbh[value];
    let that = this;
    let data = {
      majorbh: major
    };
    teacher.getClass(major,function(res){
      let className = res.data.data;
      let classArr = []
      for(let i=0;i<className.length;i++){
        classArr.push(className[i].class)
      }
      that.setData({ classArr: classArr })
    })
  },
  // 选择班级
  changeClass: function (e) {
    let value = e.detail.value;
    this.setData({ classIndex: value })
  },
  // 查询按钮
  query: function () {
    // let major = this.data.majorbh[this.data.majorIndex];
    let className = this.data.classArr[this.data.classIndex];
    let that = this;
    let page = this.data.page;
    let data = {
      // majorbh: major,
      class: className,
      page: page,
      pageNum: pageNum,
      teacherbh : teacher.teacherbh
    };
    app.getRequest('/student/stuSelect', data, function (res) {
      wx.hideToast();
      let status = res.data.status;
      if (status == 1) {
        console.log("=============第" + page + "页的内容=============");
        console.log(res.data.data);
        // 获得当前页面的内容
        let mes = res.data.data;
        for (var i = 0; i < mes.length; i++) {
          var str = mes[i].address
          mes[i].address = app.regularAddress(str);
        }
        // 当前页面不是第一页,需要将前面的内容和现在的内容连接在一起
        if (page != 1) {
          var oldMes = that.data.iconArray;
          var newMes = oldMes.concat(mes)
        } else {
          var newMes = mes;
        }
        // 获得总页数
        let count = res.data.count;
        if (count == 0) {
          that.setData({
            iconArray: [],
            noiconArray: true,
            downStatus: false,
            loadStatus: false,
            loadAllStatus: false,
          })
        } else {
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
            iconArray: newMes,
            page: newPage,
            downStatus: downStatus,
            loadAllStatus: loadAllStatus,
            loadStatus: false,
            noiconArray: false,
          })
        }

      } else {
        console.log("=============没有查询到数据==============");
        that.setData({
          downStatus: false,
          loadStatus: false,
          loadAllStatus: false,
          noiconArray: true,
          iconArray: []
        })
      }
    })
  },
  packUp: function () {
    this.setData({ hideStatus: true })
  },
  show: function () {
    this.setData({ hideStatus: false })
  },
  // 拨打电话
  callNum: function (e) {
    let phone = e.target.id;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function (res) {
      }
    })
  },
  // 监听用户下拉动作
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    this.setData({ page: 1 });
    this.query();
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    //获取现在是否已全部加载完毕
    let loadAllStatus = this.data.loadAllStatus;
    //如果全部加载完毕，则不执行下拉加载
    if (loadAllStatus == true) return;
    //显示加载中
    this.setData({ loadStatus: true, downStatus: false });
    this.query();
    console.log("上拉加载")
  },
})

