define([], function() {
    //外卡商户独有资料页面添加验证规则
    function addRules4Info2(form) {

        Opf.Validate.addRules($(form), {
            errorElement: "span",
            errorClass: "help-error",
            focusInvalid: false,
            rules: {
                billAddress: {
                    required: true,
                    maxlength: 16
                },
                name: {
                    required: true,
                    maxlength: 30
                },
                regAddress: {
                    required: true,
                    maxlength: 200
                },
                businessAddress: {
                    required: true,
                    maxlength: 200
                },
                site: {
                    required: true,
                    maxlength: 16
                },
                contactPerson: {
                    required: true,
                    maxlength: 6
                },
                contactPhone: {
                    required: true,
                    tel: true,
                    maxlength: 12
                },
                email: {
                    required: true,
                    email: true,
                    maxlength: 30
                },
                business: {
                    required: true,
                    maxlength: 100
                },
                employeesNum: {
                    required: true,
                    number: true
                },
                aveOrdersAmount: {
                    required: true,
                    number: true
                },
                aveMonthAmount: {
                    required: true,
                    number: true
                },
                openCosts: {
                    required: true,
                    number: true,
                    maxlength: 11
                },
                annualServiceFee: {
                    required: true,
                    number: true,
                    maxlength: 11
                },
                guaranteeAmount: {
                    required: true,
                    number: true,
                    maxlength: 11
                },
                takeAmount: {
                    required: true,
                    number: true,
                    maxlength: 11
                },
                proportionFee: {
                    required: true,
                    number: true,
                    maxlength: 10
                },
                fixedFee: {
                    required: true,
                    number: true,
                    maxlength: 11
                },
                riskPeriod: {
                    required: true,
                    digits: true
                },
                freezDay: {
                    required: true,
                    digits: true
                },
                cycleRate: {
                    required: true,
                    digitalRange: [0, 1]
                },
                whetherCheck: {
                    required: true
                },
                settleType: {
                    required: true
                },
                settleMoneyKind: {
                    required: true
                },
                moneyLimit: {
                    required: true,
                    digitalRange: [0, 1]
                },
                countLimit: {
                    required: true,
                    digitalRange: [0, 1]
                },
                inFineMoney: {
                    required: true
                },
                outFineMoney: {
                    required: true,
                    number: true,
                    maxlength: 11
                },
                refuseDealMoney: {
                    required: true,
                    number: true,
                    maxlength: 11
                },
                firstMoney: {
                    number: true,
                    maxlength: 16
                },
                firstRate: {
                    number: true,
                    maxlength: 11,
                    digitalRange: [0, 1]
                },
                secondMoney: {
                    number: true,
                    maxlength: 16
                },
                secondRate: {
                    number: true,
                    maxlength: 11,
                    digitalRange: [0, 1]
                },
                thirdMoney: {
                    number: true,
                    maxlength: 16
                },
                thirdRate: {
                    number: true,
                    maxlength: 11,
                    digitalRange: [0, 1]
                },
                fourMoney: {
                    number: true,
                    maxlength: 16
                },
                fourRate: {
                    number: true,
                    maxlength: 11,
                    digitalRange: [0, 1]
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
        addRules4Info2: addRules4Info2
    };
});