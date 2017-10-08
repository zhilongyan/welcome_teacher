// pages/home/detail/detail.js
let app = getApp();
var person;
var role;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downStatus: true,
    loadStatus: false,
    loadAllStatus: false,
    page: 1,
    pageNum : 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = options.name;
    this.setData({name : name})
    role = app.role;
    switch (role) {
      case 1: let common = require("../../../utils/teacher");
        let teacherMessage = wx.getStorageSync("teacher_Info");
        person = new common.teacher(teacherMessage); break;
      case 2: var common = require("../../../utils/stu");
        let stuMessage = wx.getStorageSync("stu_Info");
        person = new common.stu(stuMessage); break;
    }
    this.getMes()
  },
  // 获取各种详细情况
  getMes:function(){
    app.showLoadToast();
    let name = this.data.name/1;
    let page = this.data.page;
    switch(name){
      // 已注册
      case 0: person.getRegisterNum(this.getDetail, 1, page); 
      // 动态设置当前页面头部
      wx.setNavigationBarTitle({
        title: '已注册学生'
      });break;
      // 未注册
      case 1 : person.getRegisterNum(this.getDetail, 0, page);
        wx.setNavigationBarTitle({
          title: '未注册学生'
        }); break;
      // 自驾
      case 2 : person.getUsercarNum(this.getDetail,2,page);
        wx.setNavigationBarTitle({
          title: '自驾'
        });break;
      // 乘坐公共交通
      case 3 : person.getUsercarNum(this.getDetail, 1, page); 
        wx.setNavigationBarTitle({
          title: '乘坐公共交通'
        });break;
      // 未选择到校方式的
      case 4 : person.getUsercarNum(this.getDetail, 0, page);
        wx.setNavigationBarTitle({
          title: '未选择到校方式'
        }); break;
      // 成功接到的
      case 5 : person.getReceiveNum(this.getDetail,1,page);
        wx.setNavigationBarTitle({
          title: '成功接到'
        });break;
      // 未接到的
      case 6 : person.getReceiveNum(this.getDetail,0,page);
        wx.setNavigationBarTitle({
          title: '未接到'
        });break;
      // 已选宿舍的
      case 7: person.getDormNum(this.getDetail,page);
        wx.setNavigationBarTitle({
          title: '已选宿舍'
        });break;
      // 成功入住宿舍
      case 8: person.getSureDorm(this.getDetail, 1,page);
        wx.setNavigationBarTitle({
          title: '成功入住宿舍'
        }); break;
      // 没有入住宿舍
      case 9: person.getSureDorm(this.getDetail, 0,page);
        wx.setNavigationBarTitle({
          title: '没有入住宿舍'
        }); break;
      default : console.log("发生错误");
    }
  },
  getDetail:function(count,res){
    wx.stopPullDownRefresh();
    wx.hideToast();
    let page = this.data.page;
    let pageNum = this.data.pageNum;
    let status = res.data.status;
    if (status == 1) {
      console.log("=============第" + page + "页的内容=============");
      console.log(res.data.data);
      // 获得当前页面的内容
      let mes = res.data.data;
      // 当前页面不是第一页,需要将前面的内容和现在的内容连接在一起
      if (page != 1) {
        var oldMes = this.data.message;
        var newMes = oldMes.concat(mes)
      } else {
        var newMes = mes;
      }
      // 获得总页数
      // let count = count;
      if (count == 0) {
        this.setData({
          message: [],
          noMessage: true,
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
        this.setData({
          message: newMes,
          page: newPage,
          downStatus: downStatus,
          loadAllStatus: loadAllStatus,
          loadStatus: false,
          noMessage: false,
        })
      }

    } else {
      console.log("=============没有查询到数据==============");
      this.setData({
        downStatus: false,
        loadStatus: false,
        loadAllStatus: false,
        noMessage: true,
        message: []
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    this.setData({ page: 1 });
    this.getMes();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
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
  // 打电话
  call: function (e) {
    let num = e.target.dataset.id;
    if (num) {
      wx.makePhoneCall({
        phoneNumber: num,
        success: function (res) {
        }
      })
    }
  },
  // 搜索
  search :  function(e){
    let that = this;
    let data = {};
    let url = ''
    let value = e.detail.value;
    // 如果value未定义，则是用户点击搜索图片搜索的
    if(value == undefined){
      value = that.data.searchContent;
      if(value == undefined){
        return;
      }
    }
    // 如果输入的为空则搜索当前页面所有需要的学生
    if(value == ""){
      this.getMes();
    }
    // 判断是数字还是字符串  因为value都是字符串 所以先数值转换一下，数字的会转换成数字，字符串的会转换成NAN,然后再判断一下是不是nan
    if(isNaN(parseInt(value))){
      data.name = value;
    }else{
      data.studentnum = value;
    }
    let name = this.data.name / 1;
    switch (name) {
      // 已注册
      case 0: url = "/student/stuSelect";data.status = 1; break;
      // 未注册
      case 1: url = "/student/stuSelect"; data.status = 0; break;
      // 自驾
      case 2: url = "/student/stuSelect"; data.usecar = 2; break;
      // 乘坐公共交通
      case 3: url = "/student/stuSelect"; data.usecar = 1; break;
      // 未选择到校方式的
      case 4: url = "/student/stuSelect"; data.status = 0; break;
      // 成功接到的
      case 5: url = "/position/poSelect"; data.pstatus = 1; break;
      // 未接到的
      case 6: url = "/position/poSelect"; data.pstatus = 0; break;
      // 已选宿舍的
      case 7: url = "/room/stuRoomSelect";break;
      // 成功入住宿舍
      case 8: url = "/student/stuSelect"; data.dormstatus = 1; break;
      // 没有入住宿舍的
      case 9: url = "/student/stuSelect"; data.dormstatus = 0; break;
      default: console.log("发生错误");
    };
    data.teacherbh = person.teacherbh;
    person.search(url,data,function(res){
      let data  = res.data.data;
      that.setData({message : data})
    })
  },
  // 输入框输入触发事件
  searchContent : function(e){
    let value = e.detail.value;
    this.setData({searchContent:value});
  }
})