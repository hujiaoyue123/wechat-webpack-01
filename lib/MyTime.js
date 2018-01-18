const moment = require('../lib/moment.js');
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Created by zy on 2017/10/30.
 */

var log = function log() {
    // console.log.apply(console, arguments);
};

//带暂停的计时器

var Step = function () {
    function Step(func, interval) {
        _classCallCheck(this, Step);

        this._name = -1;
        this._func = func;
        this._interval = interval;
        this.isPause = false;
    }

    _createClass(Step, [{
        key: "start",
        value: function start() {
            var _this = this;

            this.name = setInterval(function () {
                if (!_this.isPause) {
                    _this._func();
                }
            }, this._interval);
            this.isPause = false;
        }
    }, {
        key: "pause",
        value: function pause() {
            this.isPause = true;
        }
    }, {
        key: "resume",
        value: function resume() {
            this.isPause = false;
        }
    }, {
        key: "toggle",
        value: function toggle() {
            this.isPause = !this.isPause;
        }
    }, {
        key: "stop",
        value: function stop() {
            clearInterval(this.name);
        }
    }]);

    return Step;
}();

module.exports.MyTime = function () {
    function MyTime(date) {
        var _this2 = this;

        var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, MyTime);

        this.date = moment(date);
        this._format = "YYYY/MM/DD HH:mm:ss";
        this._step = "";
        this._now = date;
        this.top = option.top ? option.top : "50%";
        this.left = option.left ? option.left : "50%";

        //设置偏移
        this.day_offset = 0;
        this.hour_offset = 0;
        this.min_offset = 0;
        this.sec_offset = 0;

        //每秒移动速度
        this.isPause = false;
        this.speed = option.speed ? option.speed : 1;
        this.long = 0;
        this.clock = new Step(function () {
            _this2.long += parseInt(1);
        }, 1000);
        this.clock.start();
    }

    _createClass(MyTime, [{
        key: "Pause",
        get: function get() {
            this.clock.pause();
            return "clock has pause";
        }
    }, {
        key: "Resume",
        get: function get() {
            this.clock.resume();
            return "clock has resume";
        }
    }, {
        key: "Toggle",
        get: function get() {
            this.clock.toggle();
            return "clock has toggle";
        }
    }, {
        key: "Moment",
        get: function get() {
            if (!DEBUG) {
                return moment();
            } else {
                var m = moment();
                if (this.day_offset) {
                    m.day(this.day_offset);
                }
                if (this.hour_offset) {
                    m.hour(this.hour_offset);
                }
                if (this.min_offset) {
                    m.minute(this.min_offset);
                }
                if (this.sec_offset) {
                    m.second(this.sec_offset);
                }
                var adds = this.speed * this.long - parseInt(this.long);
                var t = m.add(adds, 'seconds');
                return t;
            }
        }
    }, {
        key: "Now",
        get: function get() {
            return this.Moment.unix();
        }
    }, {
        key: "Show",
        get: function get() {
            return this.Moment.format(this._format);
        }
    }, {
        key: "day",
        set: function set(day) {
            this.day_offset = day;
            // console.log(this.Show);
        }
    }, {
        key: "min",
        set: function set(min) {
            this.min_offset = min;
            // console.log(this.Show);
        }
    }, {
        key: "hour",
        set: function set(hour) {
            this.hour_offset = hour;
            // console.log(this.Show);
        }
    }, {
        key: "sec",
        set: function set(sec) {
            this.sec_offset = sec;
            // console.log(this.Show);
        }
    }]);

    return MyTime;
}();
