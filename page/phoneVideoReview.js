require('../css/common-mobile.less');
require('../css/phoneVideoReview.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
const TcPlayer = require('../lib/TcPlayer.js');
const timeTool = require('../lib/timeTool.js');
const getUrlObject = require('../lib/common.js');

var phoneVideoReview = {
    url:baseURL + "/program/getReviewVideo.do",        //请求指定的回看视频
    aboutUrl:baseURL + '/program/getAboutVideos.do',
    updateUrl:baseURL + '/program/updateVideosPlayTimes.do',
    _player:'',
    /**
     * 页面加载时初始化
     */
    init:function(){
        this.initFontSize();
        this.initHtml();
        this.bindingEvent();
    },

    //判断播放设备
 /*   isIOS:function () {
        var u = navigator.userAgent;
        alert(u);
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        return isIOS;
    },*/
    IsPc : function(){
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },

    initH5Player : function(data){
        this._player = $("<video src='"+data.url+"' height='"+data.height+"' width='"+data.width+"'></video>");
        if(data.autoplay){
            this._player.attr("autoplay","autoplay");
        }
        $("#"+data.id).append(this._player);
    },

    initPCPlayer : function (data) {
        this._player = new prismplayer({
            id: data.id,
            source:data.url,
            autoplay: data.autoplay,
            width: data.width,
            height: data.height
        });
    },

    /**
     * 页面初始化
     */
    initHtml:function(){
        _this = this;
        var localUrl = getUrlObject.getUrlObject();
        var liveID = localUrl.id;
        this.require(this.url,{liveID:liveID},function(data){
            _this.renderVideo(data);
        },function(){
            // console.log("数据请求异常！");
        });
    },
    /**
     * 页面渲染
     * @param data
     */
    renderVideo:function(data){
        data.startTime = timeTool.timeFormat(data.startTime,'yyyy-MM-dd');
        var html = this.videoHtmlTpl(data);
        $(".course").append(html);
        this.initPlayer(data.playBackUrl);
        this.loadAboutVideos(data.tId,data.id);
        this.updatePlayTimes(data.id);
    },
    /**
     * 初始化播放器
     * @param url
     */
    initPlayer:function(url) {
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
            flv  = getParams('flv'),
            m3u8 = getParams('m3u8'),
            mp4  = getParams('mp4'),
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
            coverpic: '',
            autoplay: true,
            width : this.width || '',
            height : this.height || '',
            x5_player : true
        };
        var urlobj = {};
        if(url.indexOf("mp4")>0){
            urlobj.mp4 = url;
        }else if(url.indexOf("m3u8")>0){
            urlobj.m3u8 = url;
        }else if(url.indexOf("flv")>0){
            urlobj.flv = url;
        }
        options = $.extend(options,urlobj);
        var player = new TcPlayer.TcPlayer('video-player', options);
        window.qcplayer  = player;
    },
    /**
     * 更新视频播放次数
     * @param id
     */
    updatePlayTimes:function(id){
        this.require(this.updateUrl,{id:id},function(data){
            // console.log("更新成功")
        },function(){
            // console.log("数据请求异常！");
        });
    },
    /**
     * 加载相关视频
     * @param tid
     * @param liveId
     */
    loadAboutVideos:function(tid,liveId){
        this.require(this.aboutUrl,{tid:tid,liveID:liveId,size:4},function(data){
            _this.renderAboutVideos(data);
        },function(){
            // console.log("数据请求异常！");
        });
    },
    /**
     * 渲染相关视频界面
     * @param data
     */
    renderAboutVideos:function(data){
        // console.log(data);
        var course = $(".course-v");
        var html = this.aboutVideosHtmlTpl(data);
        course.append(html);
        this.bindingAboutEvent();
    },
    /**
     * 相关视频模板
     * @param data
     * @returns {string}
     */
    aboutVideosHtmlTpl:function(data){
        var tpl = '';
        for(var i=0;i<data.length;i++){
            var img = baseURL+data[i].cutImg?data[i].cutImg:data[i].initImg;
            tpl += '<div class="course-des" vid="'+data[i].id+'">'+
            '<div class="video">' +
                '<img src="'+img+'"  alt="">'+
            '</div>'+
            '<div class="v-title">'+data[i].name+'</div>'+
            '</div>';
        }
        return tpl;
    },
    /**
     * 主视频模板
     * @param data
     * @returns {string}
     */
    videoHtmlTpl:function(data){
        var tpl = '<div class="title">'+
            '<div class="con-des">'+
            '<span>'+data.startTime+'</span>'+
            '<span>'+data.teacherName+'</span>'+
            '<span>'+data.name+'</span>'+
            '</div>'+
            '</div>'+
            '<div class="video" id="video-player">'+
            '</div>'
        return tpl;
    },
    /**
     * 绑定事件
     */
    bindingEvent:function(){
        $(".back").bind('click',function(){
            window.location.href = "./phoneVideoHis.html";
        });
    },
    /**
     * 绑定相关视频事件
     */
    bindingAboutEvent:function(){
        $('.course-des').bind('click',function(){
            var id = this.getAttribute('vid');
            window.location.href = './phoneVideoReview.html?id='+id;
        });
    },
    /**
     * 页面元素大小适配
     */
    initFontSize:function() {
        _this = this;
        var html = document.documentElement;
        var windowWidth = html.clientWidth;
        html.style.fontSize = windowWidth / 7.5 + 'px';

        $(window).resize(function () {
            _this.initFontSize();
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
    require:function(url,data,successCallBack,errorCallBack,type){
        $.ajax({
            type: type||'get',
            url: url,
            data:data,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (result) {
                if(typeof(result) == 'string'){
                    result = JSON.parse(result);
                }
                if (result.success == true) {
                    successCallBack(result.data);
                }else{
                    // console.log(result.message);
                }
            },
            error: function () {
                errorCallBack();
            }
        });
    }
};
phoneVideoReview.init();


