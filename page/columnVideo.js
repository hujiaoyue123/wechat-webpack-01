require('../css/common-mobile.less');
require('../css/columnVideo.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/moment.js');
require('../lib/MyTime.js');
require('../lib/initFont.js');
const TcPlayer = require('../lib/TcPlayer.js');
const timeTool = require('../lib/timeTool.js');
const getUrlObject = require('../lib/common.js');

var columnVideo = {
    url: baseURL + '/program/kungfuListByType.do',
    init: function () {
        this.bindEvent();
        this.initHtml();
    },
    initHtml: function () {
        _this = this;
        var localUrl = getUrlObject.getUrlObject();
        var liveID = localUrl.id;
        var type = localUrl.type;
        var pageIndex = localUrl.pageIndex;
        var pageSize = localUrl.pageSize;

        var kfPublish=localUrl.kfPublish;
        var kfVideo=localUrl.kfVideo;
        var kfDesc=localUrl.kfDesc;
        var title=localUrl.title;
        if(kfDesc){
            this.htmlColumnList(title,kfDesc,kfPublish,kfVideo);
        }else{
            this.require(this.url, {pageIndex: pageIndex, pageSize: pageSize, type: type}, function (data) {
                var data = data.meta.rows;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == liveID) {
                        _this.renderVideo(data[i]);
                        $(function (i) {
                            columnVideo.initPlayer(data[i].kfVideo);
                        }(i))
                    }
                }
            }, function () {
                // console.log("数据请求异常！");
            });
            this.loadAboutVideos(pageIndex,type);
        }
    },
    renderVideo: function (data) {
        data.startTime = timeTool.timeFormat(data.startTime,'yyyy-MM-dd');
        var html = this.videoHtmlTpl(data);
        $(".course").html(html);
    },
    videoHtmlTpl: function (data) {
        $('.column-title').html(data.title);
        var tpl = '<div class="title">' +
            '<div class="con-des">' +
            '<span>' + data.title.replace(/\d*(-|_)\d*(-|_)\d*/g,'') + '</span>' +
            '<span>' + timeTool.timeFormat(data.kfPublish, 'yyyy-MM-dd') + '</span>' +
            '<span></span>' +
            '</div>' +
            '</div>' +
            '<div class="video" id="video-player">' +
            '</div>'+
            '<div class="des-c">所属分类：<span>'+data.kfDesc+'</span></div>\n'
        return tpl;
    },
    htmlColumnList:function (title,kfDesc,kfPublish,kfVideo) {
        var kfDesc = decodeURI(decodeURI(kfDesc));
        var title = decodeURI(decodeURI(title));
        $('.column-title').html(title.replace(/\d*(-|_)\d*(-|_)\d*/g,''));
        var tpl = '<div class="title">' +
            '<div class="con-des">' +
            '<span>' + title.replace(/\d*(-|_)\d*(-|_)\d*/g,'') + '</span>' +
            '<span>' + timeTool.timeFormat(kfPublish, 'yyyy-MM-dd') + '</span>' +
            '<span></span>' +
            '</div>' +
            '</div>' +
            '<div class="video" id="video-player">' +
            '</div>'+
            '<div class="des-c">所属分类：<span>'+kfDesc+'</span></div>\n';
        $(".course").html(tpl);
        $(function () {
            columnVideo.initPlayer(kfVideo);
        })
    },
    /**
     * 加载相关视频
     * @param tid
     * @param liveId
     */
    loadAboutVideos:function(pageIndex,type){
        this.require(this.url,{pageIndex: pageIndex, pageSize: 4, type: type},function(data){
            _this.renderAboutVideos(data,pageIndex,type);
        },function(){
            // console.log("数据请求异常！");
        });
    },
    /**
     * 渲染相关视频界面
     * @param data
     */
    renderAboutVideos:function(data,pageIndex,type){
        var course = $(".course-v");
        var html = this.aboutVideosHtmlTpl(data.meta.rows,pageIndex,type);
        course.append(html);
        this.bindingAboutEvent();
    },
    /**
     * 相关视频模板
     * @param data
     * @returns {string}
     */
    aboutVideosHtmlTpl:function(data,pageIndex,type){
        var tpl = '';
        for(var i=0;i<data.length;i++){
            tpl += '<div class="course-des" type="'+type+'" pageIndex="'+pageIndex+'" id="'+data[i].id+'" kfVideo="'+data[i].kfVideo+'" title="'+data[i].title+'" kfPublish="'+timeTool.timeFormat(data[i].kfPublish,'yyyy-MM-dd')+'">'+
                '<div class="video">' +
                '<img src="'+baseURL+data[i].kfImg+'"  alt="">'+
                '</div>'+
                '<div class="v-title">'+data[i].title.replace(/\d*(-|_)\d*(-|_)\d*/g,'')+'</div>'+
                '</div>';
        }
        return tpl;
    },
    bindEvent: function () {
    },
    /**
     * 绑定相关视频事件
     */
    bindingAboutEvent:function(){
        var _this=this;
        $('.course-des').bind('click',function(){
            var type=$(this).attr('type');
            var pageIndex=$(this).attr('pageIndex');
            var id=$(this).attr('id');
            window.location.href = 'columnVideo.html?id=' + id + '&pageIndex=' + pageIndex + '&pageSize=4'+'&type='+type;
            _this.init();
            // $('.video').html('');
            // _this.initPlayer($(this).attr('kfVideo'));
            // $('.con-des').html($(this).title);
        });
    },
    /**
     * 初始化播放器
     * @param url
     */
    initPlayer: function (url) {
        var height = $(".video").height();
        var width = $(".video").width();
        function getParams(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURIComponent(r[2]);
            }
            return null;
        }
        /**
         * 属性说明：
         *
         * coverpic  {Object|String} src:图片地址，style：default 居中1:1显示 stretch 拉伸铺满，图片可能会变形 cover 等比横向铺满，图片某些部分可能无法显示在区域内
         *  封面在 ios10 暂时无法生效。
         */
        var options = {
            coverpic: '',
            autoplay: true,
            width: width,
            height: height,
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
        var player = new TcPlayer.TcPlayer('video-player', options);
        window.qcplayer = player;
    },
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
                    successCallBack(result);
                } else {
                    // console.log(result.message);
                }
            },
            error: function () {
                errorCallBack();
            }
        });
    }
}
columnVideo.init();
