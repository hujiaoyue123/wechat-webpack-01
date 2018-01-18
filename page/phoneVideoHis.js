require('../css/common-mobile.less');
require('../css/phoneVideoHis.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
const timeTool = require('../lib/timeTool.js');

var phoneVideoHis = {
    lastDay: "",                                            //上次加载时间
    canRefresh: true,                                       //可刷新
    currentWeek: 1,                                           //当前是第几周
    historyUrl: baseURL + '/program/liveList.do',                       //请求历史数据连接URL

    /**
     * 页面初始化
     */
    init: function () {
        this.initFontSize();
        this.initData();
        this.initHtml();
        this.DropdownRefresh();
    },
    initData: function () {
        this.canRefresh = true;
        this.lastDay = "";
        this.currentWeek = 1;
    },

    /**
     * 页面元素大小适配
     */
    initFontSize: function () {
        _this = this;
        var html = document.documentElement;
        var windowWidth = html.clientWidth;
        html.style.fontSize = windowWidth / 7.5 + 'px';

        $(window).resize(function () {
            _this.initFontSize();
        });
    },

    /**
     * 加载数据
     */
    initHtml: function () {
        _this = this;
        var time = this.timeInterval(this.currentWeek++);
        this.require(this.historyUrl, {startTime: time[0], endTime: time[1]}, function (data) {
            _this.render(data);
        }, function () {
            // console.log("数据请求异常！");
        });
    },

    /**
     * 页面渲染
     * @param data
     */
    render: function (data) {
        var wrap = $(".wrap");
        var html = "";
        for (var i = data.length - 1; i >= 0; i--) {
            var startDay = this.time2Day(data[i].startTime);
            var dat = {};
            if (startDay != this.lastDay) {
                dat.day = startDay;
                this.lastDay = startDay;
            } else {
                dat.day = "";
            }
            dat.id = data[i].id;
            dat.name = data[i].name;
            dat.teacher = data[i].teacherName;
            dat.playBackUrl = data[i].playBackUrl;
            dat.img = data[i].cutImg ? data[i].cutImg : data[i].initImg;
            dat.playTimes = data[i].playTimes;
            dat.shareTimes = data[i].shareTimes;
            dat.startTime = this.time2HourMin(data[i].startTime);
            dat.endTime = this.time2HourMin(data[i].endTime);
            html += this.htmlTpl(dat);
        }

        if (data.length == 0) {
            this.canRefresh = false;
            html += '<div class="end">\n' + '            <div class="line1"></div>\n' + '            <div class="text">已至末尾</div>\n' + '            <div class="line2"></div>\n' + '        </div>';
        }

        if (html) {
            wrap.append(html);
            this.bindingEvent();
        }
    },
    DropdownRefresh: function () {
        var _this = this;
        //--------------上拉加载更多---------------
        //获取滚动条当前的位置
        function getScrollTop() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        }

        //获取当前可视范围的高度
        function getClientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
            } else {
                clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
            }
            return clientHeight;
        }

        //获取文档完整的高度
        function getScrollHeight() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        }

        //滚动事件触发
        window.onscroll = function () {
            if ((getScrollTop() + getClientHeight() + 20) > getScrollHeight()) {
                _this.initHtml();
            }
        }
    },
    htmlTpl: function (data) {
        if (!data.playBackUrl) return '';
        var tpl = '<div class="con cf">' +
            '<div class="left">' +
            '<div class="date"><span>' + data.day + '</span></div>' +
            '</div>' +
            '<div class="right">' +
            '<div class="title">' +
            '<div class="dot">' +
            '<div class="dot1"></div>' +
            '</div>' +
            '<div class="con-des">' +
            '<span>' + data.startTime + '-' + data.endTime + '</span>' +
            '<span>' + data.teacher + '</span>' +
            '<span>' + data.name + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="video">' +
            '<img src="' + data.img + '" videoID="' + data.id + '" alt="">' +
            '</div>' +
            '</div>' +
            '</div>';
        return tpl;
    },

    /**
     * 绑定事件动作
     */
    bindingEvent: function () {
        $(".video").find('img').bind("click", function () {
            var id = this.getAttribute("videoid");
            window.location.href = './phoneVideoReview.html?id=' + id;
        });
        $(".back").bind('click', function () {
            window.location.href = "./liveCourse.html";
        });
    },

    /**
     * 请求数据
     * @param url
     * @param data
     * @param successCallBack
     * @param errorCallBack
     * @param type
     */
    require: function (url, data, successCallBack, errorCallBack, type) {
        $.ajax({
            type: type || 'get',
            url: url,
            data: data,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (result) {
                if (typeof(result) == 'string') {
                    result = JSON.parse(result);
                }
                if (result.success == true) {
                    successCallBack(result.data);
                } else {
                    // console.log(result.message);
                }
            },
            error: function () {
                errorCallBack();
            }
        });
    },

    /**
     * 时间工具：返回距离当前第N周的开始，结束时间
     * @param week
     * @returns {Array}
     */
    timeInterval: function (week) {
        var time = [];
        var endTime = parseInt(new Date().getTime() / 1000);
        var perWeekTime = 24 * 60 * 60 * 7;
        var startTime = endTime - perWeekTime * week;
        if (week != 1) {
            endTime = startTime + perWeekTime;
        }
        time.push(startTime);
        time.push(endTime);
        return time;
    },
    time2Day: function (data) {
        return timeTool.timeFormat(data, 'yy/MM/dd');
    },
    time2HourMin: function (data) {
        return timeTool.timeFormat(data, 'hh:mm');
    }
};

phoneVideoHis.init();
