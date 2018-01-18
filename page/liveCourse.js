/**
 * Created by hjy on 2017/11/24.
 * 公众号liveCourse.html
 * 引用videoController.js
 */
require('../css/common-mobile.less');
require('../css/liveCourse.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/moment.js');
require('../lib/initFont.js');
const MyTime = require('../lib/MyTime.js');
const videoController = require('../lib/videoController.js');
const timeTool = require('../lib/timeTool.js');
const TcPlayer = require('../lib/TcPlayer.js');
DEBUG = false;
window.g_time = new MyTime.MyTime();
window.t = window.g_time;
var liveTool = {
    arr: [],
    init: function () {
        var _this = this;
        this.creatTeanherinformation();
        this.OnlineNumber();
        livingRow = -1;
        lessonArray = [];
        $('.Teather').hide();
        this.getData();//ajax
        var timer = setInterval(function () {
            _this.checkTimeForLesson();
        }, 3000);

    },
    //模板工具
    say: function (template, data) {
        var array = data instanceof Array ? data : [data];
        var res = "";
        for (var i in array) {
            var tpl = template;
            while (match = /<%([^%>]+)?%>/g.exec(tpl)) {
                tpl = tpl.replace(match[0], eval("array[i]." + match[1]));
            }
            res += tpl;
        }
        return res;
    },
    createLessonTable: function () {
        var _this = this;
        var container = $('.list-con');
        var htmltem = '  <ul class="course cf" resee="<%resee%>">\n' +
            '            <li><%showtime%></li>\n' +
            '            <li><%teachername%></li>\n' +
            '            <li><%title%></li>\n' +
            '            <li class="button">直播中</li>\n' +
            '        </ul>';
        var aft = _this.say(htmltem, lessonArray);
        container.append(aft);
        _this.checkTimeForLesson();
        //当最后一节结束
        if($('.button').eq($('.button').length-1).html()=='结束'){
            this.clickcourse();//视频结束点击可播放
        }
    },
    // ajax获取数据
    getData: function () {
        var _this = this;
        $.ajax({
            type: "get",
            async: true,
            cache: false,
            url: baseURL + "/program/liveList.do",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (result) {
                var obj = JSON.parse(result);
                var data = obj.data;
                if (obj.success == true) {
                    _this.setLessonData(data);
                    _this.createLessonTable();
                    _this.setCoverImg(data);
                }
            }
        });
    },
    //1,监测video标签，未播时间放img标签，播放时间初始化tcplay。2,老师简介更新
    setCoverImg: function (data) {
        var lc = new videoController.LiveController(data);
        var mom = lc.Moment;
        //cover图切换
        if (mom.isInInterval || mom.livingIndex == -1) {
            $('.video').html('');
            $('.video').html('<img class="video-wait" style="width: 100%;height: 100%">');
            var getData = (new Date()).getDay();
            $('.video-wait').attr('src', baseURL + mom.livingImg);
            if (getData == 6 || getData == 0) {//如果是星期天，放一张固定cover图
                $('.course').hide();
                $('.video-wait').attr('src', 'http://cctvjylive.oss-cn-shanghai.aliyuncs.com/static/images/web/cover.jpg');
            }
        } else {
            $('.video').html('');
            this.initVideo(mom.livingUrl, mom.livingImg);
        }
        //老师简介切换
        if (mom.teacherName == '马梦琪') {
            $('.Teather').hide();
            $('.Teather-1').show();
        } else if (mom.teacherName == '范建强') {
            $('.Teather').hide();
            $('.Teather-2').show();
        } else if (mom.teacherName == '乔立方') {
            $('.Teather').hide();
            $('.Teather-3').show();
        }
        else if (mom.teacherName == '王伟') {
            $('.Teather').hide();
            $('.Teather-4').show();
        }
    },
    //重置data
    setLessonData: function (datas) {
        var liveUrl = "";
        var imgFirst = "";
        for (var i in datas) {
            //固定IP地址,取第一次时
            if (i == 0) {
                liveUrl = datas[i].m3u8Url;//直播地址
                imgFirst = baseURL + datas[i].initImg;
            }
            var startStamp = datas[i].startTime;
            var endStamp = datas[i].endTime;
            //把时间戳转换为可读取时间
            var startTime = timeTool.toHHMM(startStamp);
            var endTime = timeTool.toHHMM(endStamp);
            var showtime = startTime; //时间范围

            var initImg = datas[i].initImg;//介绍图片
            var name = datas[i].name;//简介
            var teacherName = datas[i].teacherName; //老师名称的ID,需要关联查询
            var resee = datas[i].playBackUrl;//录播地址
            var summary = datas[i].summary;//主题
            var keyword = datas[i].keyword;//关键字
            var mtsState = datas[i].mtsState;//是否直播的表示
            var onoff = datas[i].onoff;//视频是否打开

            //把数据存到内存
            var lessonItem = {};
            lessonItem["lessondataid"] = i;
            lessonItem["startTime"] = startTime;
            lessonItem["startStamp"] = startStamp;
            lessonItem["endTime"] = endTime;
            lessonItem["endStamp"] = endStamp;
            lessonItem["resee"] = resee;
            lessonItem["liveUrl"] = liveUrl;
            lessonItem["mtsState"] = mtsState;
            lessonItem["initImg"] = initImg;
            lessonItem["showtime"] = showtime;
            lessonItem["title"] = name;
            lessonItem["teachername"] = teacherName;
            lessonItem["summary"] = summary;
            lessonItem["keyword"] = keyword;
            lessonItem["onoff"] = onoff;

            lessonArray.push(lessonItem);
        }
        this.checkTimeForLesson();
        // this.initVideo(liveUrl,imgFirst);
        // this.setCoverImg(liveTool.mydata);
    },
    //获取层状态
    getRowState: function (row) {
        if (row < 0 || row > lessonArray.length) {
            return "";
        }
        var now = new Date();
        var start = lessonArray[row].startStamp * 1000;
        var end = lessonArray[row].endStamp * 1000;
        if (now >= start && now < end) {
            return "living";
        } else if (now >= end) {
            return 'lived';
        } else {
            return 'prepare';
        }
    },
    //播放今日结束课程
    clickcourse:function () {
        var _this=this;
        $('.list-con').delegate('.course','click',function () {
            if($(this).attr('resee')){
                $('.video').html('');
                _this.initVideo($(this).attr('resee'));
            }
        })
    },
    //初始化视频tcplay
    initVideo: function (url, coverImg) {
        var height = $(".video").css("height").split('px')[0];
        var width = $(".video").css("width").split('px')[0];

        function getParams(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURIComponent(r[2]);
            }
            return null;
        }

        var rtmp = getParams('rtmp'),
            flv = getParams('flv'),
            m3u8 = getParams('m3u8'),
            mp4 = getParams('mp4'),
            live = (getParams('live') == 'true' ? true : false),
            coverpic = getParams('coverpic'),
            width = getParams('width'),
            height = getParams('height'),
            autoplay = (getParams('autoplay') == 'true' ? true : false);
        /**
         * 视频类型播放优先级
         * mobile ：m3u8>mp4
         * PC ：RTMP>flv>m3u8>mp4
         */

        /**
         * 属性说明：
         *
         * coverpic  {Object|String} src:图片地址，style：default 居中1:1显示 stretch 拉伸铺满，图片可能会变形 cover 等比横向铺满，图片某些部分可能无法显示在区域内
         *  封面在 ios10 暂时无法生效。
         */
        var options = {
            coverpic: coverImg,
            autoplay: true,
            width: this.width || '',
            height: this.height || '',
            x5_player: true
        };
        var urlobj = {};
        if (url.indexOf("mp4") > 0) {
            urlobj.mp4 = url;
        } else if (url.indexOf("m3u8") > 0) {
            urlobj.m3u8 = url;
        } else if (url.indexOf("flv") > 0) {
            urlobj.flv = url;
        }
        options = $.extend(options, urlobj);
        var player = new TcPlayer.TcPlayer('video', options);
        window.qcplayer = player;
    },
    //监测视频列表状态'直播中,结束,预播‘
    checkTimeForLesson: function () {
        if (lessonArray.length === 0) {
            return;
        }
        for (var row in lessonArray) {
            var state = this.getRowState(row);
            // var dotindex = parseInt(row)+1;
            // var dot = $(".dot"+dotindex);
            var li = $(".course").eq(row);
            var button = li.find(".button");
            switch (state) {
                case "lived": {
                    // dot.removeClass("selected");
                    button.text("结束");
                    button.removeClass("play");
                    li.removeClass("selected");
                }
                    break;
                case "living": {
                    if (parseInt(livingRow) !== parseInt(row)) {
                        // dot.addClass("selected");
                        // console.log(lessonArray[row].liveUrl);
                        var living = lessonArray[row].liveUrl;
                        var onoff = lessonArray[row].onoff;
                        if (button.length > 0) {
                            livingRow = row;
                            button.addClass("play");
                            li.addClass("selected");
                            if (onoff == 1) {
                                button.text("直播中");
                                // videoPlay(living);
                            } else {
                                button.text("停播中");
                            }
                        }
                    }
                }
                    break;
                case "prepare": {
                    // dot.removeClass("selected");
                    button.removeClass("play");
                    button.text("预播");
                    li.removeClass("selected");
                }
                    break;
            }
        }
    },
    //老师简介添加进页面
    creatTeanherinformation: function () {
        var _this = this;
        _this.arr.push(_this.html1);
        _this.arr.push(_this.html2);
        _this.arr.push(_this.html3);
        _this.arr.push(_this.html4);
        $('.Teather-1').html(_this.arr[0]);
        $('.Teather-2').html(_this.arr[1]);
        $('.Teather-3').html(_this.arr[2]);
        $('.Teather-4').html(_this.arr[3]);
    },

    //添加在线人数
    OnlineNumber: function () {
        var _this = this;

    }
};
liveTool.init();