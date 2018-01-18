require('../css/common-mobile.less');
require('../css/column.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
import Swiper from '../lib/swiper.min.js';
const timeTool = require('../lib/timeTool.js');

var url = baseURL + '/page/sourcesByKey.do';
var listUrl = baseURL + '/program/kungfuListByType.do';
// 栏目列表
var column = {
    pageIndex: 1,
    pageSize: 2,
    init: function () {
        var _this = this;
        this.initSwiper();
        this.bindMore();
        this.require(url, {sourceKeys: 1}, function (result) {
            _this.render(result.data);
            _this.bindBanner(result.data);
        });
        this.columnVideo();
    },
    initSwiper: function () {
        var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            autoplay: true,
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
            }
        });
    },
    bindBanner: function (data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += ' <div class="swiper-slide wr">\n' +
                '            <img class="photo" src="' + baseURL + data[i].sourceUrl + '" alt="">\n' +
                '            <div class="banner-title">' + data[i].source + '</div>\n' +
                '        </div>'
        }
        $('.swiper-wrapper').html(str);
    },
    bindMore: function () {
        $('.column').delegate('.column-head', 'click', function () {
            var columnType = $(this).attr('type');
            window.location.href = 'columnList.html' + '?type=' + columnType;
        })
    },
    render: function (data) {
        for (var i = 0; i < data.length; i++) {
            var str = '<div class="column-wrap">\n' +
                '        <div class="head-top-line"></div>\n' +
                '        <div class="head-line">\n' +
                '            <div class="column-head" type="' + data[i].sourceType + '">\n' +
                '                <div class="head-left-w">\n' +
                '                    <div class="head-left">\n' +
                '                        <div class="border"></div>\n' +
                '                        <div class="name">' + data[i].source + '</div>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '                <div class="more-btn">\n' +
                '                    <img src="../images/more.png" alt="">\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <ul class="column-list">';
            this.renderList(data[i].sourceType, str);
        }
    },
    renderList: function (type, str) {
        let _this = this;
        this.require(listUrl, {pageIndex: this.pageIndex, pageSize: this.pageSize, type: type}, function (data) {
            var dataItem = data.meta.rows;
            var strItem = '';
            for (var i = 0; i < dataItem.length; i++) {
                strItem += '<li class="item-video" videoID="' + dataItem[i].id + '" type="' + dataItem[i].type + '" pageIndex="' + _this.pageIndex + '" pageSize="' + _this.pageSize + '">\n' +
                    '                <div class="item-image">\n' +
                    '                    <img src="' +baseURL+ dataItem[i].kfImg + '" alt="">\n' +
                    '                </div>\n' +
                    '                <div class="item-name">' + dataItem[i].title + '</div>\n' +
                    '                <div class="item-desc">' + timeTool.timeFormat(dataItem[i].kfPublish, 'yyyy-MM-dd') + '</div>\n' +
                    '            </li>\n'
            }
            var strItemEnd = '        </ul>\n' +
                '    </div>'
            var html = str + strItem + strItemEnd;
            $('.column').append(html);
        })
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
    },
    columnVideo: function () {
        $('.column').delegate('.item-video', 'click', function () {
            var id = this.getAttribute("videoid");
            var type = this.getAttribute("type");
            var pageIndex = this.getAttribute("pageIndex");
            var pageSize = this.getAttribute("pageSize");
            window.location.href = 'columnVideo.html?id=' + id + '&type=' + type + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize;
        })
    }
};
column.init();
//轮播图
