require('../css/common-mobile.less');
require('../css/dropload.css');
require('../css/zixun.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
require('../lib/dropload.js');
const FastClick = require('../lib/faskclick.js');

var information = {
    page: 1,
    index: 0,
    pageSize: 5,
    Title: '',
    init: function () {
        var _this = this;
        _this.getNavigation();
        _this.newsCarousel();
        $(function () {
            FastClick.attach(document.body);
            _this.contextDropload();
        })
    },
    getNavigation: function () {
        var _this = this;
        $.ajax({
            type: 'GET',
            url: baseURL + '/sinfo/items.do',
            contentType: "text/html;charset=UTF-8",
            success: function (result) {
                var result = JSON.parse(result),
                    data = result.data,
                    htmlArr = [];
                if (result.success) {
                    for (var i = 0; i < data.length; i++) {
                        var infoId = data[i].infoId;
                        var name = data[i].infoName.split('_')[0],
                            level = data[i].infoName.split('_')[1],
                            html = {};
                        if (level == 'vip') {
                            html.context = '<li class="list-group-item" id="2" data-infoId="' + data[i].infoId + '" data-id="' + data[i].id + '" data-delFlag="' + data[i].delFlag + '" >' + name + '</li>';
                            html.infoId = data[i].infoId;
                            html.id = 2;
                        } else if (level == 'svip') {
                            html.context = '<li class="list-group-item" id="3" data-infoId="' + data[i].infoId + '" data-id="' + data[i].id + '" data-delFlag="' + data[i].delFlag + '" >' + name + '</li>';
                            html.infoId = data[i].infoId;
                            html.id = 3;
                        } else {
                            html.context = '<li class="list-group-item" id="1" data-infoId="' + data[i].infoId + '" data-id="' + data[i].id + '" data-delFlag="' + data[i].delFlag + '" >' + name + '</li>';
                            html.infoId = data[i].infoId;
                            html.id = 1;
                        }
                        _this.infoId = data[0].infoId;
                        htmlArr.push(html);
                    }

                    function sortId(a, b) {
                        return a.id - b.id
                    }
                    htmlArr.sort(sortId);
                    for (var i = 0; i < htmlArr.length; i++) {
                        var infoId = htmlArr[i].infoId;
                        if (htmlArr[i].id == 1) {
                            $('.list-1').append(htmlArr[i].context);
                        } else if (htmlArr[i].id == 2){
                            $('.list-2').append(htmlArr[i].context);
                        } else if(htmlArr[i].id == 3) {
                            $('.list-3').append(htmlArr[i].context);
                        }
                    }
                    $('.list-group-item').first().addClass('redColor');
                    var infoId = $('.list-group-item').first().attr('data-infoid');
                    $('.load-info').attr('data-info', infoId);
                    _this.getNewList(infoId, _this.pageSize, _this.page);
                }
            },
            error: function () {
                // console.log("error");
            }
        })
    },
    getNewList: function (typeID, pageSize, page) {
        var _this = this;
        // info/newsList get  参数 Integer typeID,Integer pageSize,Integer page
        $.ajax({
            type: 'GET',
            url: baseURL + "/sinfo/newsList.do?typeID=" + typeID + "&pageSize=" + 5 + "&page=" + _this.page,
            contentType: "text/html;charset=UTF-8",
            success: function (result) {
                var dataJson = JSON.parse(result);
                if (dataJson.success == true) {
                    var html = '';
                    var data = JSON.parse(dataJson.data);
                    for (var i = 0; i < data.length; i++) {
                        var content = data[i].content,
                            time = data[i].createtime,
                            glid = data[i].glid,
                            sid = data[i].sid,
                            title = data[i].title;
                        content = content.replace(/<.*?>/ig, "");
                        html += '<div class="inforBox" data-glid="' + glid + '" data-sid="' + sid + '">' +
                                    '<div class="inforTitle">' + title + '</div>' +
                                    '<div class="inforTextview">' + content + '</div>' +
                                    '<div class="time">' + time + '</div>' +
                                '</div>';
                    }
                    $('#information').append('<li data-index="' + _this.index + '" class="info-news">' + html + '</li>');
                } else {
                    $('#information').html('');
                    $('#information').append('<img width="100%"  src="../images/vip-infomation.png">')
                }
                $('.dropload-down').hide();
            },
            error: function (result) {
                // console.log("error");
            }
        });
        _this.dropload.resetload();
    },
    newsCarousel: function () {
        var _this= this;
        $('#navList').delegate('.list-group-item', 'click', function () {
            $('.inner').scrollTop(0)
            $('#navList').find('.list-group-item').removeClass('redColor');
            $(this).addClass('redColor');
            var infoid = $(this).attr('data-infoid');
            _this.page = 1;
            $('#information').html('');
            $('.load-info').attr('data-info', infoid);
            _this.getNewList(infoid, _this.pageSize, _this.page);
        });
        $('.title-list li').on('click', function () {
            $('.inner').scrollTop(0);
            $('.title-list li').removeClass('redColor');
            $(this).addClass('redColor');
            var index = $(this).attr('data-index');
            var $listSlect = $('.list-' + index);
            var $liFirst = $listSlect.find('li').first();
            $('.list-group-item').removeClass('redColor');
            $liFirst.addClass('redColor');
            $('.navigation').find('.list').hide();
            $listSlect.show();
            var infoId = $liFirst.attr('data-infoId');
            $('#information').html('');
            $('.load-info').attr('data-info', infoId);
            $('#information').html('');
            _this.getNewList(infoId, _this.pageSize, _this.page);
        });
        $('#information').delegate('.info-news', 'click', function () {
            var sid = $(this).find('.inforBox').attr('data-sid'),
                glid = $(this).find('.inforBox').attr('data-glid');
            window.location.href = 'InformationDetails.html?glid=' + glid + '&sid=' + sid;
        })
    },
    contextDropload: function () {
        var _this = this;
        _this.dropload = $('.inner').dropload({
            domUp : {
                domClass   : 'dropload-up',
                domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
                domUpdate  : '<div class="dropload-update">↑释放更新</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
            },
            domDown : {
                domClass   : 'dropload-down',
                domRefresh : '<div class="dropload-refresh"></div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData  : '<div class="dropload-noData"></div>'
            },
            loadUpFn : function(me){
                setTimeout(function(){
                    $('#information').html('');
                    var infoId = $('.load-info').attr('data-info');
                    information.getNewList(infoId, _this.pageSize, _this.page);
                },500);
            },
            loadDownFn : function(me){
                _this.page++;
                $('.dropload-down').show();
                setTimeout(function(){
                    var infoId = $('.load-info').attr('data-info');
                    information.getNewList(infoId, _this.pageSize, _this.page);
                },600);
            }
        });
    }
};
information.init();
