/**
 * Created by zy on 2017/8/8.
 */
/**
 * 时间格式化
 * @param date  1503629966
 * @param format  'yyyy-MM-dd hh:mm:ss'
 */
const timeFormat = function (date, _format) {
    var format = _format ? _format : 'yyyy-MM-dd hh:mm:ss';
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1,         //月份
            "d+": this.getDate(),          //日
            "h+": this.getHours(),          //小时
            "m+": this.getMinutes(),         //分
            "s+": this.getSeconds(),         //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()       //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    if (Date.prototype.isPrototypeOf(date)) {
        return date.Format(format);
    } else if (typeof(date) === "number" || typeof(date) === "string") {
        var numlen = date.toString().length;
        if (numlen === 10) {
            var d = new Date(parseInt(date) * 1000);
            return d.Format(format);
        } else if (numlen === 13) {
            var d2 = new Date(parseInt(date));
            return d2.Format(format);
        } else {
            // console.log("timeTool:timeFormat error param!!");
            var d3 = new Date();
            return d3.Format(format);
        }
    } else {
        // console.log("timeTool:timeFormat error param!!");
        var d4 = new Date();
        return d4.Format(format);
    }
}
module.exports = timeFormat;
module.exports.timeFormat = timeFormat;

//获得星期几
function getWDay(date) {
    var str = "星期";
    var week = date.getDay();
    switch (week) {
        case 0 :
            str += "日";
            break;
        case 1 :
            str += "一";
            break;
        case 2 :
            str += "二";
            break;
        case 3 :
            str += "三";
            break;
        case 4 :
            str += "四";
            break;
        case 5 :
            str += "五";
            break;
        case 6 :
            str += "六";
            break;
    }
    return str;
}

//时间格式化把时间戳改为 HH:mm
module.exports.toHHMM = function (time) {
    return timeFormat(time, "hh:mm");
}

//通过天数计算得到日期
function getDateByDay(countday, ptoday) {
    var today = ptoday ? ptoday : new Date();
    today.setDate(today.getDate() + countday);
    var y = today.getFullYear();
    var m = today.getMonth() + 1;
    var d = today.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    var day = y + "/" + m + "/" + d;
    return new Date(day);
}

//得到时间戳对象[pday日期+pffset天数的开始时间,结束时间]
function getStEtByOffset(poffset, pday) {
    var offset = poffset ? poffset : 0;
    var offsetday = getDateByDay(offset, pday);
    var s = getDayStart(offsetday);
    var e = getDayEnd(offsetday);
    var obj = {};
    obj.start = s;
    obj.end = e;
    return obj;
}

// 得到一周的开始结束时间戳对象数组
function getDaysByWeek(offset) {
    var _offset = offset || 0;
    var days = [];
    var toweek = new Date().getDay() + _offset * (-7);
    var startDay = 1 - toweek;
    var endDay = 6 - toweek;
    for (var i = startDay; i < endDay; i++) {
        // var today = getDateByDay(i);
        // var timestamp = dateToTimestamp(today)*0.001;
        var timestamp = getStEtByOffset(i);
        days.push(timestamp);
    }
    return days;
}

// 汉化星期几
function getWeekByNumber(week) {
    var str = "星期";
    switch (parseInt(week)) {
        case 0 :
            str += "日";
            break;
        case 1 :
            str += "一";
            break;
        case 2 :
            str += "二";
            break;
        case 3 :
            str += "三";
            break;
        case 4 :
            str += "四";
            break;
        case 5 :
            str += "五";
            break;
        case 6 :
            str += "六";
            break;
    }
    return str;
}

///某天0点
function getDayStart(pday) {
    var day = pday;
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    var todayStartTime = Date.parse(day) * 0.001;
    return todayStartTime;
}

//某天23:59:59秒
function getDayEnd(pday) {
    var start = getDayStart(pday);
    return start + 60 * 60 * 24 - 1;
}


//日期转时间戳
function dateToTimestamp(date) {
    return Date.parse(date);
}

//时间测试对象
function TestTime() {
    this.beginDate = new Date(2017, 7, 11, 9, 0, 0);
    this.now = this.beginDate;
    this.step = 60 * 15 * 1000;
    this.index = 0;

    //走一步
    this.STEP = function () {
        this.index++;
        var start = this.beginDate;
        var bstramp = Date.parse(start);
        var now = bstramp + this.index * this.step;
        this.now = now;
    };

    this.getNow = function (nextstep) {
        if (nextstep) {
            this.STEP();
        }
        return parseInt(this.now);
    };

    this.getNowNor = function () {
        return new Date();
    };

}

TestTime.prototype.toString = function () {
    var now = this.getNow();
    return timeFormat(now, "hh:mm:ss");
};


// console.log(getDaysByWeek());

