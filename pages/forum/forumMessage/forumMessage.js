// pages/forumMessage/forumMessage.js
let app = getApp();
let page = 1;
let pageNum = 10;
var person;
var role;
Page({
  data: {
    question_id: '',
    qusetion: [
    ],
    message: [],
    to_message: {},
    facus: false,
    downStatus: true,
    loadStatus: false,
    loadAllStatus: false,
    answeiContent: '',
    page: '',
    replayMessage: ''
  },
  onLoad: function (options) {
    role = app.role;
    switch (role) {
      case 1: let common = require("../../../utils/teacher");
        let teacherMessage = wx.getStorageSync("teacher_Info");
        person = new common.teacher(teacherMessage); break;
      case 2: var common = require("../../../utils/stu");
        let stuMessage = wx.getStorageSync("stu_Info");
        person = new common.stu(stuMessage); break;
    }
    //加载中。。。
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    //获得是点击那个问题进来的
    let question_id = options.id;
    this.setData({ question_id: question_id, page: 1 })
    //根据问题的id寻找所有有关这个问题的讨论
    this.getMes();
  },
  // 实时获取输入框中内容
  replayContent: function (e) {
    let content = e.detail.value;
    this.setData({ answeiContent: content })
  },
  // 点击每条回复是判断是回复谁的
  replayThis: function (e) {
    let index = e.currentTarget.id / 1;
    let question = this.data.message[index];
    let to_name = question.from_name;
    let to_id = question.from_id;
    let to_face = question.from_face;
    let parent_id = question.parent_id;
    let question_id = question_id;
    let to_personId = question.id;
    // if (to_name == this.data.message[0].from_name) {
    //   to_name = '楼主'
    // }
    let to_message = {
      to_name: to_name,
      to_id: to_id,
      to_face: to_face,
      parent_id: parent_id,
      question_id: question_id,
      to_personId: to_personId
    }
    this.setData({
      to_message: to_message,
      focus: true
    });
  },
  // 点击发送按钮
  sendReplay: function () {
    let title = "";
    let content = this.data.answeiContent;
    if (content == '') {
      return;
    }
    let to_message = this.data.to_message;
    let question_id = this.data.question_id;
    let that = this;
    let data = {
      title: title,
      content: content,
      parent_id: to_message.to_personId,
      to_id: to_message.to_id,
      to_name: to_message.to_name,
      to_face: to_message.to_face,
      question_id: question_id,
    };
    person.replay(data, function (res) {
      wx.showToast({
        title: '回复成功',
        icon: 'success',
        duration: 3000,
        mask: true
      })
      // 将回复框中内容变为空
      that.setData({ replayMessage: '' })
    })
  },
  //第一次加载的时候请求的数据
  getMes: function () {
    let that = this;
    let question_id = that.data.question_id;
    let page = that.data.page;
    let data = {
      question_id: question_id,
      page: page,
      pageNum: pageNum
    };
    app.getRequest('/question/detailContent', data, function (res) {
      wx.stopPullDownRefresh();
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        console.log("=============第" + page + "页的内容=============");
        console.log(res.data.data);
        // 获得当前页面的内容
        let mes = res.data.data;
        for (let i = 0; i < mes.length; i++) {
          let time = mes[i].time;
          let newTime = new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
          mes[i].time = newTime;
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
        // 设置to_message
        let message = newMes[0];
        let to_message = {
          to_face: message.from_face,
          to_id: message.from_id,
          to_name: message.from_name,
          parent_id: message.parent_id,
          question_id: message.question_id,
          to_personId: message.id
        }
        that.setData({
          message: newMes,
          page: newPage,
          downStatus: downStatus,
          loadAllStatus: loadAllStatus,
          loadStatus: false,
          to_message: to_message
        })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  },
  //刷新问题
  onPullDownRefresh: function (e) {
    this.setData({ page: 1 });
    this.getMes();
  },
  //下拉加载
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
