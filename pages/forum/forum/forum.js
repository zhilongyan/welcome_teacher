let app = getApp();
let server = app._server;
//每页默认个数
let pageNum = 10;
Page({
    data: {
        message: [
        ],
        downStatus: true,
        loadStatus: false,
        loadAllStatus: false,
        page: 1,
        noMessage: false,
        openStatus: true
    },
    onLoad: function () {
        let that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000,
            mask: true
        });
        // 检测论坛是否开放
        app.getRequest("/question/openForum", {}, function (res) {
            let status = res.data.status;
            if (status == 1) {
                wx.hideToast();
                console.log("论坛开放")
                //获取问题的第一页
                that.setData({ page: 1, openStatus: true })
                that.getMes();
            } else {
                wx.hideToast();
                // let msg = res.data.msg;
                // app.showErrorModal(msg);
                that.setData({ openStatus: false })
                return;
            }
        })
    },
    getMes: function () {
        let that = this;
        let page = that.data.page;
        let data = {
            page: page,
            pageNum: pageNum,
            parent_id: 0
        };
        app.getRequest('/question/questionSelect', data, function (res) {
            wx.stopPullDownRefresh();
            wx.hideToast();
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
                if (count == 0) {
                    that.setData({
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
                    that.setData({
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
                that.setData({
                    downStatus: false,
                    loadStatus: false,
                    loadAllStatus: false,
                    noMessage: true,
                    message: []
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
})
