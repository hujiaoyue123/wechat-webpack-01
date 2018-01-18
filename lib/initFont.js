$(function () {
    //自适应基础
    function initFontSize() {
        var html = document.documentElement;
        var windowWidth = html.clientWidth;
        html.style.fontSize = windowWidth / 7.5 + 'px';
    }
    initFontSize();
    $(window).resize(function () {
        initFontSize();
    });
});