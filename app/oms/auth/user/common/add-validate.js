define([], function() {

    //第一个页面添加验证规则
    function addRules4Info(form) {
        Opf.Validate.addRules($(form), {
            errorElement: "span",
            errorClass: "help-error",
            focusInvalid: false,
            rules: {
                name : {
                    required : true
                },
                roleGroupId: {
                    required:true
                },
                ruleId: {
                    required:true
                },
                loginName : {
                    required:true,
                    checkLoginRepeat:true,
                    noSpace: true,
                    maxlength: 18
                },
                email : {
                    email : true,
                    checkEmailRepeat:true
                },
                tel : 'telBranch',
                mobile : {
                    required:true,
                    mobile:true,
                    checkPhoneRepeat:true
                },
                verifyCode: {
                    required: true,
                    number: true,
                    checkVerifyCodeValid: true
                },
                cardNo: {
                    required: true,
                    idcard: true,
                    //checkIdCardRepeat4User: true
                },
                bankInfo: {
                    required: true
                },
                accountName: {
                    required: true
                },
                accountNo: {
                    required: true,
                    isBankCard: true,
                    debitCard: false,
                    number: true,
                    eighteenBank:true
                },
                zbankProvince: {
                    required: true
                },
                zbankCity: {
                    required: true
                },
                zbankRegionCode: {
                    required: true
                },
                zbankName: {
                    required: true
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
                error.addClass('help-block').insertAfter(element);
            }
        });
    }

    return {
        addRules4Info: addRules4Info
    };
});