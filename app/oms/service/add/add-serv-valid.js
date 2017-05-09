define([], function() {

    //第一个页面添加验证规则
    function addRules4Info(form) {
        Opf.Validate.addRules($(form), {
            errorElement: "span",
            errorClass: "help-error",
            focusInvalid: false,
            rules: {
                code: {
                    required:true
                },
                name: {
                    required:true,
                    utf8ByteLength: [1, 100]
                },
                version: {
                    required:true
                },
                desc: {
                    required:true,
                    utf8ByteLength: [1, 150]
                },
                fixedFeeAmt: {
                    required:true,
                    floatGtZero:true,
                    'float':true
                },
                handChargeRate: {
                    required:true
                },
                fixedRewardAmt: {
                    required:true,
                    floatGtZero:true,
                    'float': true
                },
                shareProfitModel: {
                    required:true
                },
                trialPrice: {
                    required:true/*,
                    floatGteZero:true,
                    'float':true*/
                },
                trialPeriod: {
                    required:true,
                    intGtZero:true,
                    integer:true
                }
                
            },
            messages: {
                name: {
                    utf8ByteLength: '输入的文字过长'
                },
                desc: {
                    utf8ByteLength: '输入的文字过长'
                }
            },
            highlight: function(element) {
                // 这里element是DOM对象
                $(element).closest('.form-group').addClass('has-error');
            },
            success: function(element) {
                element.closest('.form-group').removeClass('has-error');
                element.remove();
            },
            errorPlacement: function(error, element) {
                error.addClass('help-block').appendTo(element.parent());
            }
        });
    }

    return {
        addRules4Info: addRules4Info
    };
});