// pages/myClass/myClass.js
var app = getApp();
//每页默认个数
let pageNum = 10;
var person;
Page({
  data: {
    iconArray: [],
    downStatus: true,
    loadStatus: false,
    loadAllStatus: false,
    page: 1,
    classArr : [],
    classIndex : 0
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    var common = require("../../../utils/stu");
    let stuMessage = wx.getStorageSync("stu_Info");
    person = new common.stu(stuMessage);
    this.getClass();

  },
  getMes: function () {
    let that = this;
    let page = that.data.page;
    let className = that.data.classArr[that.data.classIndex]; 
    let data = {
      class : className,
      page: page,
      pageNum: pageNum,
    };
    person.getStudentMessage(data,function (res) {
      wx.stopPullDownRefresh();
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
  // 监听用户下拉动作
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    this.setData({ page: 1 });
    this.getMes();
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    //获取现在是否已全部加载完毕
    let loadAllStatus = this.data.loadAllStatus;
    //如果全部加载完毕，则不执行下拉加载
    if (loadAllStatus == true) return;
    //显示加载中
    this.setData({ loadStatus: true, downStatus: false });
    this.getMes();
    console.log("上拉加载")
  },
  getClass : function(){
    let classArr = person.class.split(',');
    this.setData({ classArr: classArr})
  },
  changeClass : function(e){
    let value = e.detail.value;
    this.setData({classIndex : value})
  },
  sureButton : function(){
    this.setData({ page: 1, iconArray:[]});
    this.getMes();
  },
  call : function(e){
    let num  = e.target.dataset.id;
    if(num){
      wx.makePhoneCall({
        phoneNumber: num,
        success: function (res) {
        }
      })
    }
  }
})