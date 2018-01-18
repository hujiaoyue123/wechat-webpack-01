require('../css/common-mobile.less');
require('../css/columnList.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
const timeTool = require('../lib/timeTool.js');
const getUrlObject = require('../lib/common.js');

var localUrl = getUrlObject.getUrlObject();
var url = baseURL + '/program/kungfuListByType.do';
var columnvideo = {
    pageIndex: 0,
    pageSize: 8,
    type: localUrl.type,
    canRefresh: true,
    init: function () {
        this.initHtml();
        this.DropdownRefresh();
        this.bindingVideo();
    },
    initHtml:function () {
        var _this = this;
        this.pageIndex++;
        this.require(url, {pageIndex: this.pageIndex, pageSize: this.pageSize, type: this.type}, function (data) {
            var data = data.meta.rows;
            if(data.length==0){
                return;
            }
            _this.render(data);
        });
    },
    render: function (data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str +=
                ' <li id="'+data[i].id+'" kfVideo="'+data[i].kfVideo+'" kfPublish="'+data[i].kfPublish+'" type="'+data[i].type+'" kfDesc="'+data[i].kfDesc+'" title="'+data[i].title+'">\n' +
                '            <div class="item-image">\n' +
                '                <img src="'+baseURL+data[i].kfImg+'" alt="">\n' +
                '            </div>\n' +
                '            <div class="item-name">' + data[i].title.replace(/\d*(-|_)\d*(-|_)\d*/g,'') + '</div>\n' +
                '            <div class="item-desc">'+timeTool.timeFormat(data[i].kfPublish, 'yyyy-MM-dd')+'</div>\n' +
                '        </li>'
        }
        if(data.length==0){return}
        if (str) {
            $('.column-list').append(str);
            $('.column-name').html(data[0].title);
        }
    },
    bindingVideo:function () {
        $('.column-list').delegate('li','click',function () {
            var id = this.getAttribute("id");
            var type = this.getAttribute("type");
            var kfPublish = this.getAttribute("kfPublish");
            var kfVideo = this.getAttribute("kfVideo");
            var title = this.getAttribute("title");
            var kfDesc = this.getAttribute("kfDesc");
            window.location.href = 'columnVideo.html?id=' + id + '&type=' + type + '&kfPublish=' + kfPublish + '&kfVideo=' + kfVideo+'&title='+title+'&kfDesc='+kfDesc;
        })
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
            // if ((Math.ceil(getScrollTop()) + Math.ceil(getClientHeight())) == Math.ceil(getScrollHeight())) {
            if ((getScrollTop() + getClientHeight() + 20) > getScrollHeight()) {
               _this.initHtml();
            }
        }
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
};
columnvideo.init();
