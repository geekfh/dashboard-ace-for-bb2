define([], function() {
    //第一个页面添加验证规则
    function addRules4Info(form) {

        var shouldValidateIdCardFmt = !Ctx.avail('mcht:edit:ignore:idcard:fmt:validate');

        Opf.Validate.addRules($(form), {
            errorElement: "span",
            errorClass: "help-error",
            focusInvalid: false,
            rules: {
                explorerName: {
                    required: true
                },
                mchtName: {
                    required: true,
                    minlength: 2,
                    // cnLetterNum: true,
                    mchtNameLength: true
                },
                province: {
                    required: true
                },
                city: {
                    required: true
                },
                areaNo: {
                    required: true
                },
                address: {
                    required: true,
                    maxlength: 30
                },
                comTel: {
                    // required: true, /*改为选填，但要验证号码合法性*/
                    telBranch: true
                },
                grpBudID: {
                  required: true
                },
                businessId: {
                  required: true
                },
                group: {
                    required: true
                },
                mcc: {
                    required: true
                },
                attr: {
                    required: true
                },
                licNo: {
                    mchtlicNoDuplicateCheck: true,
                    licNo: true
                },
                orgCode: {
                    maxlength: 20
                },
                taxNo: {
                    taxNo: true,
                    maxlength: 30
                },
                userName: {
                    required: true,
                    chineseName: true,
                    maxlength: 25,
                    // utf8Byte
                    // byteMaxLen: 
                    minlength:2
                    /*,equalTo: "input[name='mchtName']"*/
                },
                userPhone: {
                    required: true,
                    mobile: true,
                    mchtMobileDuplicateCheck: true
                },
                userCardType: {
                    required: true
                },
                userCardNo: {
                    required: true,
                    idcard: shouldValidateIdCardFmt
                },
                userEmail: {
                    email: true,
                    mchtUserEmailDuplicateCheck: true
                },
                tNDiscId: {
                    required: true
                },
                discCycle: {
                    required: true
                },
                tZeroDiscId: {
                    required: true
                },
                accountName: {
                    required: true
                },
                _accountProxyName: {
                    required: true
                },
                accountNo: {
                    required: true,
                    isBankCard: true,
                    debitCard: true,
                    number: true
                    //isEighteenBank: true //这个18家银行验证加到动态，放Info-view里
                },
                zbankProvince: {
                    required: true
                },
                zbankCity: {
                    required: true
                },
                zbankRegionCode: {
                    //required: true
                },
                zbankName: {
                    required: true
                },
                bankInfos: {
                    required: true
                },
                remark: {
                    remarkLength: true
                },
                accountNoPublic: {
                    required: true,
                    number: true
                },
                //kindSuffix: {
                //    required: true,
                //    maxlength: 20,
                //    mchtUserKindSuffixCheck: true
                //},
                //userLogin: {
                //    required: true,
                //    maxlength: 20,
                //    mchtUserLoginCheck: true
                //},
                kind: {
                    required: true
                }
            },
            highlight: function(element) {
                // 这里element是DOM对象
                $(element).closest('.form-group').addClass('has-error');
            },
            success: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
                $(element).remove();
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