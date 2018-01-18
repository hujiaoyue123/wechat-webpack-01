/**
 * Created by tdf on 2017/7/28.
 */

// var baseURL =  "http://www.cctvjy.cn";

// var baseURL = 'http://192.168.111.26:8080';
function checkBrower() {
    var ie_version = 6;
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    if (window.ActiveXObject) {
        Sys.ie = ua.match(/msie ([\d.]+)/)[1];
        //获取版本
        if (Sys.ie.indexOf("7") > -1) {
            ie_version = 7;
        }
        if (Sys.ie.indexOf("8") > -1) {
            ie_version = 8;
        }
        if (Sys.ie.indexOf("9") > -1) {
            ie_version = 9;
        }
        if (Sys.ie.indexOf("10") > -1) {
            ie_version = 10;
        }
        if (Sys.ie.indexOf("11") > -1) {
            ie_version = 11;
        }
    }
    else if (ua.indexOf("firefox") > -1)
        Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1];
    else if (ua.indexOf("chrome") > -1)
        Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1];
    else if (window.opera)
        Sys.opera = ua.match(/opera.([\d.]+)/)[1];
    else if (window.openDatabase)
        Sys.safari = ua.match(/version\/([\d.]+)/)[1];
    return ie_version;
}

function timeCleanT(timeStr) {
    return timeFormat(Date(timeStr),'yyyy-MM-dd hh:mm:ss');
}

function getWidth() {
    var screenWidth = $(document).width();
    $("body").css("min-width",screenWidth);
}

function getPathLevel() {
    var path = window.location.pathname;
    var level = 0;
    for(var i =0;i<path.length;i++){
        var char = path.charAt(i);
        if(char === "/"){
            level +=1;
        }
    }
    return level;
}

function getChildDir(childname) {
    var path = "";
    var level = getPathLevel();
    for(var i = 1;i<level;i++){
        path = "../"+path;

    }
    path = path + childname;
    return path;
}

//获取url参数并返回对象
module.exports.getUrlObject=function() {
    var object = {};
    var path = window.location.search;
    if(path.length<1){
        return;
    }
    //使用&分割参数
    var string =path.substring(1,path.length);
    var reg = string.split("&");
    for(var param in reg){
        var paramstr = reg[param];
        var pars = paramstr.toString().split("=");
        var left = pars[0];
        var right = "";
        //判断右值有几个
        if(pars.length===2){
            right = pars[1];
        }else if(pars.length===1){
            right = "";

        }else{
            //把剩下的所有分割重新合并
            for(var i = 1;i<pars.length;i++ ){
                right+=pars[i];
            }
        }
        object[left] = right;
    }
    return object;
}

//判断是否手机浏览器
function IsPC(){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid||isiOS){
        return false;
    }
    return true;
}

function isAndroid() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    return isAndroid;
}

function isIOS() {
    var u = navigator.userAgent;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isIOS;
}