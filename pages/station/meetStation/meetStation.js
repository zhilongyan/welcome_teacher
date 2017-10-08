// pages/station/meetStation/meetStation.js
let app = getApp();
let _server = app._server;
let page = 1;
let pageNum = 10;
Page({
  data: {
    message: [
    ],
    downStatus: false,
    loadStatus: false,
    upStatus: false,
    loadAllStatus: true,
    page: 1,
    noMessage: false,
    role: '',
    position : [],
    positionIndex : 0
  },
  onLoad: function (options) {
    this.getPosition();
  },
  // 查询未接人数
  query: function () {
    this.getMes();
    this.getReceived();
  },
  // 获取用户输入框中输入的信息
  useridInput: function (e) {
    let value = e.detail.value;
    let position = value.replace(/(^\s*)|(\s*$)/g, "");
    this.setData({ position: position });
  },
  // 拨打电话
  callPhone: function (e) {
    let phone = e.target.dataset.id;
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  // 退出登录
  back: function () {
    wx.removeStorage({
      key: 'user_Info',
    });
    wx.redirectTo({
      url: '../../login/login'
    })
  },
  getMes: function () {

    let that = this;
    let page = that.data.page;
    let position = this.data.position[this.data.positionIndex];
    let data = {
      page: page,
      pageNum: pageNum,
      position: position,
      pstatus: 0
    };
    if(position == []){
      return
    }
    app.showLoadToast();
    app.getRequest('/position/poSelect', data, function (res) {
      wx.hideToast();
      // 阻止页面下拉效果
      wx.stopPullDownRefresh()
      console.log("=============第" + page + "页的内容=============");
      console.log(res.data.data);
      if (res.data.status == 1) {
        if (res.data.data.length == 0) {
          that.setData({ num: 0 })
        }
        // 获得当前页面的内容
        let mes = res.data.data;
        // 计算到站时间
        for (let i = 0; i < mes.length; i++) {
          mes[i].time = that.time(mes[i].update_time);
        }
        // 当前页面不是第一页,需要将前面的内容和现在的内容连接在一起
        if (page != 1) {
          var oldMes = that.data.message;
          var newMes = oldMes.concat(mes)
        } else {
          var newMes = mes;
        }
        // 获得总页数
        let count = res.data.count;
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
          noMessage: false,
          num: count
        })
      }
      else {
        console.log("=============没有查询到数据==============");
        that.setData({
          downStatus: false,
          loadStatus: false,
          upStatus: false,
          loadAllStatus: false,
          noMessage: true,
          message: [],
          num: 0
        })
      }
    })
  },
  // 监听用户下拉动作
  onPullDownRefresh: function () {
      console.log("下拉刷新");
      this.setData({ upStatus: true, page: 1 });
      this.getMes();
      this.getReceived();
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

  /*
   *  url :  /position/poSelect
   *  data : page :1, pageNum:1, pstatus : 1,position
   *  获取已接到人数 
   */
  getReceived: function () {
    let that = this;
    let position = that.data.position[that.data.positionIndex];
    let data = {
      page: 1,
      pageNum: 1,
      pstatus: 1,
      position: position
    };
    if (position == undefined || position == "") {
      return
    }
    let url = "/position/poSelect";

    app.getRequest(url, data, function (res) {
      console.log("================已接到人数=================")
      console.log(res)
      let status = res.data.status;
      if (status == 1) {
        let count = res.data.count;
        that.setData({ count: count })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  },
  /*
   * 获取到站时间
   * 接口返回的时间戳为Unix时间戳，需要*1000才能使用
   */
  time: function (time) {
    let now = new Date();
    let oldTime = new Date(time * 1000);

    let day = now.getDay() - oldTime.getDay() >= 0 ? now.getDay() - oldTime.getDay() : oldTime.getDay() - now.getDay();
    day = day > 0 ? day + "天" : "";
    let hour = now.getHours() - oldTime.getHours() >= 0 ? now.getHours() - oldTime.getHours() : oldTime.getHours() - now.getHours();

    hour = hour > 0 ? hour + "小时" : "";
    let minute = now.getMinutes() - oldTime.getMinutes() >= 0 ? now.getMinutes() - oldTime.getMinutes() : oldTime.getMinutes() - now.getMinutes();
    minute = minute > 0 ? minute + "分钟" : 0 + "分钟";
    return day + hour + minute;
  },

  // 获取到站站点
  getPosition : function(){
    let that = this;
    app.getRequest("position/getPo",{},function(res){
      let status = res.data.status;
      if(status){
        let position = res.data.data;
        that.setData({position : position})
      }else{
        console.log("========获取站点错误======");
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  },
  // 选择接站位置
  changePos : function(e){
    let value = e.detail.value;
    this.setData({positionIndex : value})
  }
})