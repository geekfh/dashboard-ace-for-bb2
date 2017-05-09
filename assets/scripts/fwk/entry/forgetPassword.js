function forgetButtonClick(e) {
    e.preventDefault();

    // 数字+字母
    jQuery.validator.addMethod("numberORletterOnly", function(value, element) {
        var valid=false;
        var reg_password = /^\w{6,12}$/; //字母，数字，下划线(6~12)
        var reg_password2 = /^(\d(?!\d*$)|[A-z](?![A-z]*$))\w*$/; //不能全是数字也不能全是字母
        if(reg_password.test(value)&&reg_password2.test(value)){
            valid = true;
        }
        return this.optional(element) || valid;
    }, "密码必须6到12位，且包含数字和字母");

    var signal = false,
        hasGetverifyCode = false;

    $('.main-body').hide();
    $('.forget-password-main').append($('#forget-password-template').html()).show();

    init();

    setTimeout(function(){
        $('input[name="verifyCode"]').val('');
    }, 10);


    function init() {
        var $form = $('#repair-password-from');

        $form.validate({
            rules: {
                loginName: {
                    required: true
                },
                mobile: {
                    required: true,
                    mobile: true
                },
                password: {
                    required: true,
                    nowhitespace: true,
                    numberORletterOnly: true
                },
                repassword: {
                    required: true,
                    equalTo: '#password'
                }
            },
            messages: {
                loginName: {
                    required: '请输入用户名'
                },
                mobile: {
                    required: '请输入手机号码'
                },
                password: {
                    required: '请输入密码',
                    nowhitespace: '密码不能包含空格'
                },
                repassword: {
                    required: '请再次输入密码',
                    equalTo: '两次输入密码不一致'
                },
                verifyCode: {
                    required: '请输入校验码',
                    byteRangeLength: '请输入6位验证码'
                }
            }
        });
        var loginName = $form.find('input[name="loginName"]');
        var mobile = $form.find('input[name="mobile"]');
        var getVerifyCode = $form.find('button[name="getVerifyCode"]');
        var verification = $form.find('button[name="verification"]');
        var verifyCode = $form.find('input[name="verifyCode"]');

        verification.addClass('disabled');
        getVerifyCode.addClass('disabled');

        $('[name="getVerifyCode"]').on('click', getVerifyCodeClick);
        $('[name="verification"]').on('click', verificationClick);
        $('[name="repairPassword"]').on('click', repairPasswordClick);
        $('.repair-password').hide();

        $(loginName).on('input propertychange', function(e){
            if(signal) {
                return;
            }


            if(!e.target.value || !mobile.val()) {
                getVerifyCode.addClass('disabled');
            } else {
                getVerifyCode.removeClass('disabled');
            }

        });

        $(mobile).on('input propertychange', function(e){
            if(signal) {
                return;
            }

            $('#put-result-information-error').empty();

            if(!e.target.value || !loginName.val()) {
                getVerifyCode.addClass('disabled');
            } else {
                getVerifyCode.removeClass('disabled');
            }
        });

        $('.remove-icon').on('click', function(e) {
            $('.forget-password-main').empty().hide();
            $('.main-body').show();
        });

        setTimeout(function(){
            verifyCode.val('');
        },10);

        verifyCode.keydown(function (e) {
            var me = $(this);
            setTimeout(function(){
                var value = me.val();
                console.log(value);
                if(value.length == 6 && hasGetverifyCode){
                    verification.removeClass('disabled');
                }else{
                    verification.addClass('disabled');
                }
            },10);
        });

    }


    function getVerifyCodeClick(e) {
        e.preventDefault();
        signal = true;

        var $form = $('#repair-password-from');
        var $button = $('[name="getVerifyCode"]');

        if (!$form.validate().form()) {
            return;
        }

        var loginName = $form.find('input[name="loginName"]').val();
        var mobile = $form.find('input[name="mobile"]').val();

        var options = {
            url: 'api/entry/forget-password-getinfo',
            data: {
                loginName: loginName,
                mobile: mobile,
                gid: window.gid || '1'
            }
        };

        var timer,count=60;
        $button.addClass("disabled");

        ajaxRequest(options,
            function() {
                hasGetverifyCode = true;
                $('#put-result-information-error').empty();
                $('#put-result-information-success').empty().append('已发送');
                timer = setInterval(function(){
                    $button.html(count + "秒后可重新发送");
                    count = count - 1;
                    if(count == -1) {
                        $button.html("获取验证码").removeClass("disabled");
                        count = 60;
                        getVcode = false;
                        signal = false;
                        clearInterval(timer);
                    }
                }, 1000);
            },
            function(res) {
                signal = false;
                $button.removeClass("disabled");
                $('#put-result-information-success').empty();
                $('#put-result-information-error').empty().append(res.remark);
            },
            function(resp) {
                signal = false;
                $button.removeClass("disabled");
                console.error('ajax post faild : ' + JSON.stringify(resp));
            });

    }

    function verificationClick(e) {
        e.preventDefault();
        
        var $form = $('#repair-password-from');
        var verifyCode = $form.find('input[name="verifyCode"]').val();

        if (!verifyCode) {
            return;
        }

        var options = {
            url: 'api/entry/forget-password-validate',
            data: {
                verifyCode: verifyCode,
                gid: window.gid || '1'
            }
        };

        ajaxRequest(options, function() {
            console.log('验证成功');
            $('#result-verification-success').show();
            $("#result-verification-error").hide();

            setTimeout(function() {
                $('.entry-verifyCode').hide();
                $('.repair-password').show();

            }, 1000);
        },
        function() {
            $('#result-verification-success').hide();
            $("#result-verification-error").show();
        });
    }

    function repairPasswordClick(e) {
        e.preventDefault();
        var $form = $('#repair-password-from');

        if (!$form.validate().form()) {
            return;
        }

        var password = $form.find('input[name="password"]').val();

        var options = {
            url: 'api/entry/forget-password-modify',
            data: {
                password: password,
                gid: window.gid || '1'
            }
        };

        ajaxRequest(options, 
        function() {
            $('.remove-icon').trigger('click');

            bootbox.dialog({
                message: "<span class='bigger-110'>修改成功</span>",
                buttons:            
                {
                    "success" :
                    {
                        "label" : "确定!",
                        "className" : "btn-sm btn-success"

                    }
                }
            });
            console.log('修改成功!');
        },
        function() {
            bootbox.dialog({
                message: "<span class='bigger-110'>修改失败</span>",
                buttons:            
                {
                    "danger" :
                    {
                        "label" : "确定!",
                        "className" : "btn-sm btn-danger"

                    }
                }
            });
        });
    }

    function ajaxRequest(options, successCallback, faildCallback, errorCallback) {
        $.ajax({
            url: options.url,
            type: 'POST',
            data: options.data,
            success: function(res) {
                if (res.status === 0) {
                    if(faildCallback) {
                        faildCallback(res);
                    }else {
                        console.log(res.remark);
                    }

                } else if (res.status === 1) {
                    successCallback();

                } else {
                    console.error('ajax faild');

                }
            },

            error: function(res) {
                if(errorCallback) {
                    errorCallback(res);
                }else {
                    console.error('ajax post faild : ' + JSON.stringify(res));
                }
            }

        });
    }
}
