var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by zy on 2017/9/14.
 */
var NULL = -1;
var LIVED = 0;
var LIVING = 1;
var NOTYET = 2;

//初始化入口 data

module.exports.LiveController = function () {
    function LiveController(datas) {
        _classCallCheck(this, LiveController);

        this._datas = datas;
        this.curLivingIndex = NULL;
        //找到开始和结束时间
        if (datas.length > 0) {
            this.setBeginAndEnd();
        }
    }

    _createClass(LiveController, [{
        key: "setDatas",
        value: function setDatas(datas) {
            this._datas = datas;
            if (datas.length > 0) {
                this.setBeginAndEnd();
            }
        }
    }, {
        key: "getDatas",
        value: function getDatas() {
            return this._datas;
        }
    }, {
        key: "getStates",
        value: function getStates() {
            if (this._datas.length <= 0) {
                console.error("liveController get null datas");
                return [0];
            }
            var state = [];
            var timestamp = g_time.Now;
            for (var i in this._datas) {
                var data = this._datas[i];
                var endt = parseInt(data.endTime);
                var startt = parseInt(data.startTime);
                var onoff = parseInt(data.onoff);
                if (endt > timestamp && timestamp >= startt && onoff === 1) {
                    state[i] = LIVING;
                } else if (timestamp >= endt) {
                    state[i] = LIVED;
                } else {
                    state[i] = NOTYET;
                }
            }
            return state;
        }
    }, {
        key: "setBeginAndEnd",
        value: function setBeginAndEnd() {
            if (this._datas.length <= 0) {
                window.error_info = "liveController get null datas";
                return;
            }
            var minTime = this._datas[0].endTime;
            var maxTime = this._datas[0].startTime;
            for (var i in this._datas) {
                var data = this._datas[i];
                var endt = data.endTime;
                var startt = data.startTime;
                if (parseInt(endt) > maxTime) {
                    maxTime = endt;
                }
                if (parseInt(startt) < minTime) {
                    minTime = startt;
                }
            }
            this._beginTimestramp = minTime;
            this._endTimestramp = maxTime;
        }
    }, {
        key: "isALLOVER",

        /**
         * 是否直播已经结束
         */
        value: function isALLOVER() {
            //判断是否所有直播已经结束
            var timestamp = g_time.Now;
            if (timestamp > this._endTimestramp) {
                return true;
            }
            return false;
        }
        /**
         * 是否开始直播
         * @param dispatcher
         */

    }, {
        key: "isBEGIN",
        value: function isBEGIN() {
            //判断是否直播已经开始
            var timestamp = g_time.Now;
            if (timestamp > this._beginTimestramp) {
                return true;
            }
            return false;
        }
    }, {
        key: "getMemontLiveUrl",
        value: function getMemontLiveUrl() {
            var timestamp = g_time.Now;
            for (var i in this._datas) {
                var data = this._datas[i];
                var endt = data.endTime;
                var startt = data.startTime;
                var onoff = data.onoff;
                if (parseInt(endt) > timestamp && timestamp >= parseInt(startt) && onoff == 1) {
                    // console.log(' start '+startt.toString()+'  '+timestamp.toString()+' end '+endt.toString());
                    var liveurl = data.flvUrl;
                    return liveurl;
                }
            }
            return this._datas[0].flvUrl;
        }

        /**
         * 返回当前状态对象：是否在直播间隙，当前直播地址，当前直播游标，当前覆盖图片（如果在直播间隙则返回下一个节目图片）
         * @returns {{isInInterval: boolean, livingImg: string, livingUrl: string, livingIndex: Number}}
         * @constructor
         */

    }, {
        key: "isLivingCheck",


        /**
         * 每秒检测是否在直播状态
         * @param dispatcher
         */
        value: function isLivingCheck(dispatcher) {
            var _this = this;

            setInterval(function () {
                if (_this.isBEGIN() && !_this.isALLOVER()) {
                    dispatcher(true);
                } else {
                    dispatcher(false);
                }
            }, 1000);
        }
    }, {
        key: "islivingMove",
        value: function islivingMove() {
            return false;
        }
    }, {
        key: "timeCheck",
        value: function timeCheck(dispatcher) {
            var _this2 = this;
            var startTime = -60 * 35;
            var teststep = 1;
            setInterval(function () {
                // let now =parseInt(Date.parse(new Date()))*0.001 +parseInt(teststep) + startTime;
                var now = g_time.Now;
                var events = [];
                for (var i in _this2._datas) {
                    var data = _this2._datas[i];
                    var endt = data.endTime;
                    var startt = data.startTime;
                    if (now === parseInt(endt)) {
                        events.push({ data: data, state: "end" });
                    } else if (now === parseInt(startt)) {
                        events.push({ data: data, state: "start" });
                    }
                }
                if (events.length > 0) {
                    dispatcher(events);
                }
                // console.log(now);
                teststep += 1;
                // },100);
            }, 1000);
        }
    }, {
        key: "data",
        get: function get() {
            return this._datas;
        }
    }, {
        key: "Moment",
        get: function get() {
            // let date = new Date();
            var timestamp = g_time.Now;
            // let timestamp = Date.parse(date)*0.001;

            var livingIndex = -1; //目前直播行
            var livingUrl = ""; //目前播放地址
            var livingEndTime= ""; //目前视频结束时间
            var livingImg = ""; //目前覆盖图片
            var teacherName = ""; //老师名字
            var isInInterval = false; //是否在直播间隙

            //输出isInterval是否在可播放间隙,livingIndex正在直播的时间段
            var hasRead = -1;
            for (var i in this._datas) {
                hasRead = i;
                var data = this._datas[i];
                var endt = parseInt(data.endTime);
                var startt = parseInt(data.startTime);
                var onoff = data.onoff;
                if (timestamp < endt) {
                    //在直播时间内
                    if (timestamp >= startt) {
                        if (onoff) {
                            //打开状态
                            livingIndex = i;
                            isInInterval = false;
                        } else {
                            livingIndex = -1;
                            isInInterval = true;
                        }
                    } else {
                        //还未到时间
                        isInInterval = true;
                    }
                    break;
                }
            }
            var max = this._datas.length;
            //获取播放地址
            if (livingIndex >= 0 && livingIndex < max) {
                livingUrl = this._datas[livingIndex].m3u8Url;
            }
            //获取结束时间
            if (livingIndex >= 0 && livingIndex < max) {
                livingEndTime = this._datas[livingIndex].endTime;
            }
            //获取播放图片
            if (hasRead >= 0) {
                if (!isInInterval && livingIndex >= 0) {
                    livingImg = this._datas[livingIndex].initImg;
                } else {
                    while (hasRead < max) {
                        if (this._datas[hasRead].onoff) {
                            livingImg = this._datas[hasRead].initImg;
                            break;
                        }
                        hasRead++;
                    }
                }
            }

            //获取老师名字
            if(hasRead >= 0){
                if (!isInInterval && livingIndex >= 0) {
                    teacherName = this._datas[livingIndex].teacherName;
                } else {
                    while (hasRead < max) {
                        if (this._datas[hasRead].onoff) {
                            teacherName = this._datas[hasRead].teacherName;
                            break;
                        }
                        hasRead++;
                    }
                }
            }

            // let next = parseInt(livingIndex)+1;
            // if(isInInterval && next <=this._datas.length){
            //     livingImg = this._datas[next].initImg;
            // }
            return {
                isInInterval: isInInterval,
                livingImg: livingImg,
                livingUrl: livingUrl,
                teacherName: teacherName,
                livingEndTime: livingEndTime,
                livingIndex: parseInt(livingIndex)
            };
        }
    }]);

    return LiveController;
}();