require('../css/common-mobile.less');
require('../css/login.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
const Notice = require('../lib/notice');
var loginRegister={
	ifClick: true,
    init:function () {
        this.addClickEvent();
        this.getAuthenticationCode();
    },
    addClickEvent:function () {
        var _this=this;
        $('.tips').click(function () {
            $('.sign-in').css('display','none');
            $('.register').css('display','block');
            _this.getRegistrationAuthenticationCode();
        });
        $('.regis-login-btn').click(function () {
            $('.sign-in').css('display','block');
            $('.register').css('display','none');
            _this.getAuthenticationCode();
        });$('.login-regis-btn').click(function () {
            $('.sign-in').css('display','none');
            $('.register').css('display','block');
            _this.getRegistrationAuthenticationCode();
        });
        $('#login').click(function () {
            _this.userLogin();
        });
        $('#regis').click(function () {
			_this.userRegistration();
        });
        $('.getva').click(function () {
			if (!_this.ifClick) {
				return;
			}
			_this.ifClick = false;
			var userNameVal = $('.register .number').val(),
				verificationVal = $('.register .img-verification').val();
			$.ajax({
				url: baseURL + 'login/checkCode.do',
				data: {code: verificationVal, mobile: userNameVal},
				contentType: "text/html;charset=UTF-8",
				type: 'get', //GET
				success: function (msg) {
					msg = JSON.parse(msg);
					if (msg.success) {
						if (_this.checkPhone(userNameVal) && !!userNameVal) {
							$.ajax({
								url: baseURL + 'login/getMCode.do',
								data: {mobile: userNameVal},
								contentType: "text/html;charset=UTF-8",
								type: 'get', //GET
								success: function (msg) {
									msg = JSON.parse(msg);
									if (!msg.success) {
										_this.errorPrompt(msg.data);
									} else {
										_this.times = 60;
										function schedule() {
											$('#J-imgVerify').html(_this.times + "S后重新获取");
											if (_this.times > 0) {
												_this.times -= 1;
											} else {
												$(".getva").html("获取验证码");
											}
											if (_this.times <= 0) {
												$(".getva").html("获取验证码");
												clearInterval(intervalId);
												_this.times = '';
												_this.ifClick = true;
											}
										}
										var intervalId = setInterval(schedule, 1000);
									}
								},
								error: function (msg) {
									msg = JSON.parse(msg);
									_this.errorPrompt(msg.message);
								}
							});
						}
					} else {
						_this.ifClick = true;
						_this.errorPrompt('验证码错误');
					}
				},
				error: function (msg) {
					_this.ifClick = true;
					_this.errorPrompt('图片验证码错误');
				}
			});
		});
        $(".login .img-verify").on("click", function () {
            _this.getAuthenticationCode();
            $('.verification').val('');
        });
        $('input').focus(function () {
            $('input').removeClass('focus');
            $(this).addClass('focus');
        })
    },
    // 登录调用
    getAuthenticationCode: function () {
        $(".login .img-verify").find('img').attr("src", baseURL + "public/verifycode.png.do?random" + new Date());
    },
    // 注册调用
    getRegistrationAuthenticationCode: function () {
        $(".register .img-verify").find('img').attr("src", baseURL + "public/verifycode.png.do?random" + new Date());
    },
    //验证手机号码
    checkPhone: function (phone) {
        if (!(/^1[34578]\d{9}$/.test(phone))) {
            return false;
        } else {
            return true;
        }
    },
    //登录按钮事件
    userLogin: function () {
        var _this = this;
        var userNameVal = $('.sign-in .number').val(),
            verificationVal = $('.sign-in .verification').val(),
            passwordVal = $('.sign-in .pass-word').val();
		if (_this.checkPhone(userNameVal)) {
            $.ajax({
                url: baseURL + 'login/checkCode.do',
                data: {code: verificationVal, mobile: userNameVal},
				contentType: "text/html;charset=UTF-8",
                type: 'get', //GET
                success: function (msg) {
					msg = JSON.parse(msg);
                    if (msg.success) {
                        $.ajax({
                            url: baseURL + 'login/login.do',
                            data: {mobile: userNameVal, password: passwordVal},
							contentType: "text/html;charset=UTF-8",
							type: 'get', //GET
                            success: function (msg) {
								msg = JSON.parse(msg);
                                if (!msg.success) {
                                    _this.errorPrompt('登录失败');
                                } else {
									window.location.href = baseURL + '/dist/home.html'
								}
                            },
                            error: function (msg) {
                                _this.errorPrompt('登录失败');
                            }
                        });
                    } else {
                        _this.errorPrompt('请输入正确的验证码');
                    }
                },
                error: function (msg) {
                    _this.errorPrompt(msg.message);
                },
            });
        } else {
            _this.errorPrompt('用户名不存在');
        }
    },
    //注册按钮事件
    userRegistration: function () {
        var _this = this;
		var userNameVal = $('.register .number').val(),
			verificationVal = $('.register .iphone-verification').val(),
			jobNumber = $('.register .job').val(),
			passwordVal = $('.register .password-show').val(),
			confirmVal = $('.register .confirm-show').val(),
            reg = /^[1-9]\d{0,5}$/;
        //检测手机号是否正确
        if (_this.checkPhone(userNameVal)) {
            // 检测密码是否为空
            if (!reg.test(jobNumber)) {
                console.log('@@');
                _this.errorPrompt('请填写正确邀请码');
            } else {
                if (passwordVal == '设置密码' || confirmVal == '确认密码') {
                    _this.errorPrompt('密码不能为空');
                } else {
                    // 检测两次密码输入是否一致
                    if (passwordVal == confirmVal) {
                        //验证密码是否为数字和字母
                        $.ajax({
                            url: baseURL + 'login/register.do',
                            data: {mobile: userNameVal, password: passwordVal, yzm: verificationVal, yqm: jobNumber},
                            dataType: 'json',
                            cache: false,
                            contentType: "application/x-www-form-urlencoded; charset=utf-8",
                            type: 'get', //GET
                            success: function (msg) {
                                if (msg.success) {
                                    $.ajax({
                                        url: baseURL + 'login/login.do',
                                        data: {mobile: userNameVal, password: passwordVal},
                                        dataType: 'json',
                                        cache: false,
                                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                                        type: 'get', //GET
                                        success: function (msg) {
                                            if (!msg.success) {
                                                _this.errorPrompt(msg.message);
                                            } else {
                                                window.location.href = baseURL + 'page/openclass.html'
                                            }
                                        },
                                        error: function (msg) {
                                            _this.errorPrompt(msg.message);
                                        }
                                    });
                                } else {
                                    _this.errorPrompt(msg.message);
                                }
                            },
                            error: function (msg) {
                                _this.errorPrompt('注册失败');
                            }
                        });
                    } else {
                        _this.errorPrompt('两次输入不一致');
                    }
                }
            }
        } else {
            _this.errorPrompt('手机号输入有误');
        }
        // _this.cleanInputValue();
    },
	errorPrompt: function (prompt) {
		var _this = this;
		_this.notice = new Notice({
			width: '360',
			maskBackground: '#161616',//蒙版颜色
			maskOpacity: '0.6',//蒙版透明度
			headColor: '#e51c24',//头部字体颜色
			headText: '消息',//头部字体
			textTitle: '',//正文标题
			textParagraph: prompt,//数组正文段落p
			stateName: '',
			stateDate: '<span class="mask-btn" style="cursor: pointer; margin: 0 auto; text-align: center;line-height: 30px;display: block; width: 85px;height: 30px;color: white;border: none;background-color: rgb(206, 3, 6);">确定</span>'
		});
		_this.$popWarp = $('#pop-wrap');
		$('.text-w p').css({
			lineHeight: '20px',
            paddingTop: '.5rem'
		});
		$('.mask-btn').on('click', function () {
			_this.$popWarp.remove();
		});
		$('#mask').on('click', function () {
			_this.$popWarp.remove();
		});
		$('#close').on('click', function () {
			_this.$popWarp.remove();
		});
		_this.btnTextNext = _this.btnText;
		_this.btnText = 'notice';
	},
};
loginRegister.init();


