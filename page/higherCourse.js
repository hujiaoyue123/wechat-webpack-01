require('../css/common-mobile.less');
require('../css/higherCourse.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');

var url = baseURL + '/course/getCourses.do';
var higherCourse = {
    init: function () {
        this.initHtml()
    },
    initHtml: function () {
        _this = this;
        this.require(url, '', function (data) {
            _this.render(data);
        }, function () {
            // console.log("数据请求异常！");
        })
    },
    render: function (data) {
        var str = '';
        var courseList = $('.course-list');
        for (var i = 0; i < data.length; i++) {
            str += '<div class="container">\n' +
                '    <div class="item"><img src="' + baseURL + data[i].courseUrl + '" alt="">' +
                '</div>\n' +
                '    <div class="item-head cf">' + data[i].generalCourseName + '</div>\n' +
                '</div>'
        }
        courseList.html(str);
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
}
higherCourse.init();