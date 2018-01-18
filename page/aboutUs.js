require('../css/common-mobile.less');
require('../css/aboutUs.less');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
require('../tpl/aboutUs.html');

$('.nav div').click(
    function () {
        $(this).addClass('active').siblings().removeClass('active');
        if($(this).attr('info')==1){
            $('.about').css('display','block');
            $('.server').css('display','none');
        } else {
            $('.server').css('display','block');
            $('.about').css('display','none');
        }}
);