require('../css/common-mobile.less');
require('../css/InformationDetails.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
require('../lib/jquery-1.6.2.min.js');
require('../lib/ext.js');
require('../lib/manage.js');
const FastClick = require('../lib/faskclick.js');
const AutoGetQuote0826 = require('../lib/manage.js');

var stockOpe = {
    typeID: 913,
    currentPage: 1,     //当前第几页
    limit: 10,
    init: function () {
        this.getUrl();
        this.addClickEvent();
        this.windowScroll();
        $(function () {
            FastClick.attach(document.body);
        })
    },
    getUrl: function () {
        var _this = this;
        var str = window.location.search;
        var splitStr = str.split("&");
        var glid = splitStr[0].split('=')[1];
        var sid = splitStr[1].split('=')[1];
        _this.getInfo(glid, sid);
    },
    getInfo: function (glid, sid) {
        var _this = this;
        $.ajax({
            type: 'get',
            url: baseURL + '/sinfo/newsinfo.do?typeID=' + sid + '&articleID=' + glid,
            contentType: "text/html;charset=UTF-8",
            success: function (result) {
                var data = JSON.parse(result);
                data = JSON.parse(data.data);
                $('.title').html(data.a.title);
                $('.time').html(data.a.createtime.split('.')[0]);
                var content = data.ac.content;
                content = content.replace(/style="[^"]+"/ig, "");
                content = content.replace(/&nbsp;/g, '');
                content = content.replace(/#000000/ig, "");
                content = content.replace(/target="_blank"/ig, "");
                content = content.replace(/\/"/ig, "");
                content = content.replace(/loged="true"/ig, "");
                content = content.replace(/href/ig, "data-abc");
                _this.renderGP(content);
            },
            error: function () {

            }
        });
    },
    addClickEvent: function () {
        $('.small').click(function () {
            $('.box').removeClass('bigSize');
        });
        $('.big').click(function () {
            $('.box').addClass('bigSize');
        })
    },
    renderGP: function (content) {
        var re = /\d{6,}/ig;
        var reStock = /^[036]\d{5}$/g;
        var rs = '';
        var contentRep = content;
        var stockIds = '';

        while (rs = re.exec(content)) {
            reStock = /^[036]\d{5}$/g;
            var bbb;
            var ccc = rs[0]
            var aaa = ccc.substring(0, 2);
            if (aaa == "60") {
                bbb = "sh" + ccc
            } else if (aaa == "30" || aaa == "00") {
                bbb = "sz" + ccc
            }
            var strCode = '"' + bbb + '"'
            //show_quote(strCode,"stock111")
            if (stockIds.indexOf(rs[0]) == -1 && reStock.test(rs[0])) {
                stockIds = stockIds + rs[0] + ",";

                // contentRep = contentRep.replace(rs[0], '<a style="COLOR:red;" href="http://www.treeid/CODE_'+ rs[0] + '"'+'>'
                contentRep = contentRep.replace(rs[0], '<a class="stockOpe-U" id="SecurityCode_' + rs[0] + '_0">'
                    + rs[0] + '[行情]' + '</a>' + '&nbsp;' + '<span class="stockOpe-U"  id="price_' + rs[0] + '_0">' + '</span><span class="stockOpe-U" " id="ceil_' + rs[0] + '_0">' + '</span>'
                );
                var qqq = String(rs[0]);
                //xn
                AutoGetQuote0826(qqq, 1, 1);
                now = new Date();
                if (now.getHours() >= 9 && now.getHours() < 15) {
                    //xn
                    setInterval(function () {
                        AutoGetQuote0826("qqq",0,0)
                    }, 1000);
                }
            }
        }
        if (rs != '' || rs != null) {
            $('.box').html(contentRep);
        }
        content = null;
        contentRep = null;
        re = null;
        reStock = null;
        rs = null;
        stockIds = null;
        $('.load').hide();
        $('.wrap').show();
        $('.table-out').css('borderBottom', '.01rem solid #000');
    },
    windowScroll: function () {
        var $backTop = $('.back-top');
        function getScrollTop() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        }
        window.onscroll = function () {
            if (getScrollTop() > 100) {
                $backTop.fadeIn();
            } else {
                $backTop.fadeOut();
            }
        };
        $backTop.click(function () {
            $('html,body').animate({scrollTop: 0}, 500);
        })
    }
};
stockOpe.init();