define([], function() {

    //第一个页面添加验证规则
    function addRules4Info(form) {
        Opf.Validate.addRules($(form), {
            errorElement: "span",
            errorClass: "help-error",
            focusInvalid: false,
            rules: {
                loginName: {
                    required:true,
                    checkLoginRepeat:true,
                    noSpace: true,
                    maxlength: 18
                },
                name: {
                    required:true,
                    maxlength: 50
                },
                cardNo: {
                    required: true,
                    idcard: true,
                    checkIdCardRepeat: true
                },
                cardEndDate: {
                    required: true
                },
                mobile: {
                    required: true,
                    mobile: true,
                    checkMobileRepeat: true
                },
                verifyCode: {
                    required: true,
                    number: true,
                    checkVerifyCodeValid: true
                },
                brhName: {
                    required: true,
                    brhNameDuplicateCheck: true
                },
                brhNickName: {
                    required: true
                },
                urgentContactName: {
                    required: true
                },
                brhTel: {
                    required: true
                },
                brhProvince: {
                    required: true
                },
                brhCity: {
                    required: true
                },
                brhRegionCode: {
                    required: true
                },
                brhAddress: {
                    required: true
                },
                licNo: {
                    required: true,
                    brhlicNoDuplicateCheck: true,
                    licNo: true
                },
                taxNo: {
                   taxNo: true
                },
                contractCode: {
                    required: true
                },
                profitPlan: {
                    required: true
                },
                accountName: {
                    required: true
                },
                bankInfos: {
                    required: true
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
                },
                accountNo: {
                    required: true,
                    number: true,
                    isBankCard: true,
                    debitCard: true,
                    checkCreditCard: true
                },
                accountNoPublic: {
                    required: true,
                    number: true
                },
                pzbankProvince: {
                    required: true
                },
                pzbankCity: {
                    required: true
                },
                pzbankRegionCode: {
                    required: true
                },
                pzbankName: {
                    required: true
                },
                pbankInfos: {
                    required: true
                },
                paccountName: {
                    required: true
                },
                paccountNo: {
                    required: true,
                    number: true,
                    isBankCard: true,
                    debitCard: true,
                    'org.info.checkSpecialBankCard': true
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