/*var notice=new Notice({
    width:'240',
    maskBackground:'#161616',//蒙版颜色
    maskOpacity:'0.6',//蒙版透明度
    headColor:'#e51c24',//头部字体颜色
    headText:'我是频道公告',//头部字体
    textTitle:'我是正文标题',//正文标题
    textParagraph:['近期，我频道弘学','我是第二段','我是第三段落文字'],//数组正文段落p
    stateName:'博信集团',
    stateDate:'2017年10月01日'
})*/
function Notice(opts) {
    this.init(opts);
};
Notice.prototype = {
    width: null,
    popWrap: null,
    body: null,
    headColor: null,
    headText: null,
    textTitle: null,
    textParagraph: null,
    stateName: null,
    stateDate: null,
    maskBackground: null,
    maskOpacity: null,
    init: function (opts) {
        var _this = this;
        _this.width = opts.width;
        _this.headColor = opts.headColor;
        _this.headText = opts.headText;
        _this.textTitle = opts.textTitle;
        _this.textParagraph = opts.textParagraph;
        _this.stateName = opts.stateName;
        _this.stateDate = opts.stateDate;
        _this.maskBackground = opts.maskBackground;
        _this.maskOpacity = opts.maskOpacity;
        this.createHtml();
        this.addCss(opts);
        this.closeNote();
    },
    createHtml: function () {
        var _this = this;
        var text = '';

        text += '<p>' + _this.textParagraph + '</p>';

        var str = ' <div class="mask" id="mask"></div>\n' +
            '    <div class="notice-wrap">\n' +
            '        <div class="head cf">\n' +
            '            <div class="title">' + _this.headText + '</div>\n' +
            '            <div class="close" style="margin-top: -.02rem" id="close">x</div>\n' +
            '        </div>\n' +
            '        <div class="text-w">\n' +
            '            <h4>' + _this.textTitle + '</h4>\n' +
            '            ' + text + '\n' +
            '            <p class="right">' + _this.stateDate + '</p>\n' +
            '        </div>\n' +
            '    </div>';
        _this.popWrap = document.createElement('div');
        _this.body = document.getElementsByTagName('body')[0];
        _this.body.insertBefore(_this.popWrap, _this.body.childNodes[0]);
        $(_this.popWrap).attr('id', 'pop-wrap');
        $(_this.popWrap).html(str);
    },
    addCss: function () {
        var _this = this;
        $('.cf').css({
            '*zoom': 1,
        });
        $('.cf:after').css({
            '*zoom': 1,
        });
        $('.mask').css({
            position: 'fixed',
            zIndex: 999,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: _this.maskOpacity,
            filter: 'progid:DXImageTransform.Microsoft.Alpha(opacity=70)',
            background: _this.maskBackground,
        });
        $('.notice-wrap').css({
            zIndex: 9999,
            backgroundColor: '#FFF',
            width: _this.width + 'px',
            position: 'fixed',
            left: '50%',
            marginLeft: '-' + _this.width / 2 + 'px',
            top: '50%',
            marginTop: '-205px',
            padding: '15px',
            borderRadius: '8px',
        });
        $('.notice-wrap .head').css({
            width: '100%',
            height: '.68rem',
            lineHeight: '.68rem',
            'border-radius': '0.4rem'
        })
        $('.notice-wrap .head .title').css({
			'float': 'left',
		    'color': '#fff',
		    'text-align': 'center',
		    'position': 'relative',
		    'padding': '5px',
		    'font-size': '.3rem',
		    'line-height': '0.52rem',
		    'text-indent':'1em',
        });
        $('.notice-wrap .head .close').css({
            float: 'right',
            textAlign: 'right',
            color: '#fff',
            cursor: 'pointer',
			'padding-right': '.2rem'
        });
        $('.notice-wrap .text-w h4').css({
            lineHeight: '28px'
        });
        $('.notice-wrap .text-w p').css({
            fontSize: '.28rem',
            lineHeight: '24px',
            textAlign: 'center',
        });
        $('.notice-wrap .text-w .right').css({
            textAlign: 'right',
            paddingTop: '.5rem'
        });
        // var style = document.createElement('style');
        // $(style).html(strCss);
        // $('head').append(style);
    },
    closeNote: function () {
        document.getElementById('close').onclick = function () {
            document.getElementById('pop-wrap').style.display = 'none';
        }
        document.getElementById('mask').onclick = function () {
            document.getElementById('pop-wrap').style.display = 'none';
        }
    }
}
module.exports = Notice;
