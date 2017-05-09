$(function() {


    var mobile_reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[067])|(18[0-9]{1}))+\d{8})$/;

    jQuery.validator.addMethod("nowhitespace",
        function(value, element) {
            return this.optional(element) || /^\S+$/i.test(value);
        }, "不能包含空格");


    // 手机号码验证
    jQuery.validator.addMethod("mobile", function(value, element) {
        var length = value.length;
        return this.optional(element) || 
                (length == 11 && mobile_reg.test(value));
    }, "请正确填写您的手机号码");


    // 中文字两个字节
    jQuery.validator.addMethod("byteRangeLength", function(value,
            element, param) {
        var length = value.length;
        for (var i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) > 255) {
                length++;
            }
        }
        return this.optional(element)
                || (length >= param[0] && length <= param[1]);
    }, "请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)");

    function popWrongAccountMsg(message) {
        bootbox.dialog({
            message: "<span class='bigger-110'>" + message || '登录失败' + "</span>",
            buttons: {
                "danger": {
                    "label": "确定!",
                    "className": "btn-sm btn-danger"
                }
            }
        });
    }

    var $form = $('#login-form');
    var $loginBtn = $form.find('button[type="button"]');
    var $user = $form.find('input[name=username]');
    var $psw = $form.find('input[name=password]');
    var $token = $form.find('input[name=token]');
    var strUsername, strPassword;

    $token.val('');

    $('.token-img-switcher').on('click', refreshToken);

    function refreshToken() {
        var newImgUrl = "api/entry/new-token?_t=" + (new Date()).getTime();
        $('.token-img').attr('src', newImgUrl);
        $token.val('');
    }

    function busyLoginBtn(isBusy) {
        if (isBusy === false) {
            $loginBtn.removeClass('disabled').text('登录').prop({
                disabled: false
            });
        } else {
            $loginBtn.addClass('disabled').text('正在登录').prop({
                disabled: true
            });
        }
    }

    function getUrlValue(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 

        if (r !== null) {
            return unescape(r[2]);
        }
        return null; 
    } 

    function submit() {
        var strUsername = $user.val();
        var strPassword = $psw.val();
        var strToken = $token.val();

        if (!strUsername || !strPassword) {
            return;
        }

        busyLoginBtn();

        $.ajax({
            cache: false,
            url: 'api/entry/login',
            type: 'POST',
            data: {
                user: strUsername,
                password: strPassword,
                token: strToken,
                url: window.location.search.replace(/^\?previousUrl=/, ''),
                gid: window.gid || '1'
            },
            dataType: 'json',
            success: onSuccess,
            complete: function(res) {
                busyLoginBtn(false);
            }
        });

        function onSuccess(res) {
            var redirectUrl;

            if (res.success === false) {
                refreshToken();
                popWrongAccountMsg(res.msg);
                return;
            }

            if (res.data) {
                redirectUrl = decodeURIComponent(res.data);
            } else {
                redirectUrl = 'index.html?_ts=' + (new Date()).getTime();
            }

            $('.main-body').hide();
            $('.login-success').show();

            setTimeout(function() {
                window.location = redirectUrl;
            }, 100);
        }

        return false;
    }

    $form.validate({
        rules: {
            username: {
                required: true,
                nowhitespace: true
            },
            password: {
                required: true,
                nowhitespace: true
            },
            token: {
                required: true
            }
        },
        messages: {
            username: {
                required: '请输入用户名/手机号/邮箱',
                nowhitespace: '不能输入空格'
            },
            password: {
                required: '请输入密码',
                nowhitespace: '不能输入空格'
            },
            token: {
                required: '请输入验证码'
            }
        }
    });

    //用户登录
    $loginBtn.on('click', function() {
        if ($form.valid()) {
            submit();
        }
    });

    //监听Enter事件
    $form.find('input').on('keydown', function(evt){
        if(evt.keyCode == 13){
            $loginBtn.trigger('click');
        }
    });

    //忘记密码
    $('#btn-forget-password').on('click', forgetButtonClick);

});