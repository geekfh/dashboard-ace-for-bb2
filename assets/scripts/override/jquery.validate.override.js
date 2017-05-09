/**
 * 扩展的验证器
 * maxWords 最大单词数
 * mixWords ..
 * rangeWords ..
 *
 * letterswithbasicpunc 英文字母和英文标点符号
 * alphanumeric 		英文字母数字,下划线
 * lettersonly 		    英文字母
 * nowhitespace 		无空白
 * integer 			    整数
 * dateITA 		        日期
 * time 		        00:00 ~ 23:59
 * time12h
 * ipv4
 * ipv6
 * pattern 		    正则验证
 * accept 		    mime类型
 * extension
 * namechars 		中文，英文字母，数字，下划线
 * cnLetterNum 		中文，英文字母，数字
 * byteRangeLength  字节长度范围
 *
 * 
 * idcard		身份证
 * taxNo		税务登记号
 * mobile 		手机号
 * telareacode 	电话区号
 * phone 		电话(座机)
 * tel 			座机或手机
 * zipcode 		邮政编码
 * isBankCard	银行卡号
 * licNo 		营业执照
 * debitCard	必须为借记卡
 *
 * intGtZero 	>0 整数
 * intGteZero 	>=0 整数
 * intNEqZero	非0整数
 * intLtZero 	<0整数
 * intLteZero 	<=0 整数
 *
 * floatEqZero 		0 		
 * floatGtZero 		>0
 * floatGteZero 	>=0
 * floatNEqZero 	!=0
 * floatLtZero 		<0
 * floatLteZero 	<=0
 * float 			数字
 *
 * number 		数字
 * digits 	[0-9]+
 * integerScope
 *
 * chinese 中文
 * date 	日期
 *
 * gt 	数字大于(>) 参数可以是数值或者dom
 *
 *
 * uniqueBrhDiscModelName 同一个机构下，费率模型名称不能重复
 */

(function(root, factory){

    if (typeof define === 'function' && define.amd) {
        define(['jquery.validate.origin'], function(){
            return factory();
        });
	} else {
        root.validator = factory();
	}

})(this, function() {

        //var mobile_reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[067])|(18[0-9]{1}))+\d{8})$/;
        var mobile_reg = /^(1[0-9]{2})+\d{8}$/;
        var fix_tel_reg = /^(\d{3,4}-?)?\d{7,9}$/;
        var fix_tel_branch = /^[\d\(\-\)]*$/;

        jQuery.validator.addMethod("maxWords", function(value, element,
                                                        params) {
            return this.optional(element)
                || stripHtml(value).match(/\b\w+\b/g).length <= params;
        }, jQuery.validator.format("Please enter {0} words or less."));

        jQuery.validator.addMethod("minWords", function(value, element,
                                                        params) {
            return this.optional(element)
                || stripHtml(value).match(/\b\w+\b/g).length >= params;
        }, jQuery.validator.format("Please enter at least {0} words."));

        jQuery.validator.addMethod("rangeWords", function(value, element,
                                                          params) {
            var valueStripped = stripHtml(value);
            var regex = /\b\w+\b/g;
            return this.optional(element)
                || valueStripped.match(regex).length >= params[0]
                && valueStripped.match(regex).length <= params[1];
        }, jQuery.validator
            .format("Please enter between {0} and {1} words."));

        jQuery.validator.addMethod("letterswithbasicpunc", function(value,
                                                                    element) {
            return this.optional(element)
                || /^[a-z\-.,()'"\s]+$/i.test(value);
        }, "Letters or punctuation only please");

        jQuery.validator.addMethod("alphanumeric",
            function(value, element) {
                return this.optional(element) || /^\w+$/i.test(value);
            }, "Letters, numbers, and underscores only please");

        jQuery.validator.addMethod("lettersonly", function(value, element) {
            return this.optional(element) || /^[a-z]+$/i.test(value);
        }, "Letters only please");

        jQuery.validator.addMethod("nowhitespace",
            function(value, element) {
                return this.optional(element) || /^\S+$/i.test(value);
            }, "No white space please");

        jQuery.validator.addMethod("integer", function(value, element) {
            return this.optional(element) || /^-?\d+$/.test(value);
        }, "A positive or negative non-decimal number please");

        jQuery.validator.addMethod("positiveInteger", function(value, element) {
            return this.optional(element) || /^\d+$/.test(value);
        });

        jQuery.validator.addMethod("dateITA", function(value, element) {
            var check = false;
            var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (re.test(value)) {
                var adata = value.split('/');
                var gg = parseInt(adata[0], 10);
                var mm = parseInt(adata[1], 10);
                var aaaa = parseInt(adata[2], 10);
                var xdata = new Date(aaaa, mm - 1, gg);
                if ((xdata.getFullYear() === aaaa)
                    && (xdata.getMonth() === mm - 1)
                    && (xdata.getDate() === gg)) {
                    check = true;
                } else {
                    check = false;
                }
            } else {
                check = false;
            }
            return this.optional(element) || check;
        }, "Please enter a correct date");

        jQuery.validator.addMethod("time", function(value, element) {
            return this.optional(element)
                || /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/.test(value);
        }, "Please enter a valid time, between 00:00 and 23:59");
        jQuery.validator.addMethod("time12h", function(value, element) {
            return this.optional(element)
                || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i
                .test(value);
        }, "Please enter a valid time in 12-hour am/pm format");

        jQuery.validator.addMethod("ipv4", function(value, element, param) {
            return this.optional(element)
                || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i
                .test(value);
        }, "请输入正确的ipv4地址");

        jQuery.validator.addMethod("ipv6", function(value, element, param) {
            return this.optional(element)
                || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i
                .test(value);
        }, "请输入正确的ipv6地址");


        jQuery.validator.addMethod("amtAndNum", function(value, element, param) {
            var arr = value.split(',');

            return this.optional(element)
                || (arr.length === 2 && /^[-\+]?\d+(\.\d+)?$/.test(arr[0].trim()) && /^\d+$/.test(arr[1].trim()));
        }, "金额和笔数用英文逗号隔开");



        /**
         * Return true if the field value matches the given format RegExp
         *
         * @example jQuery.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
         * @result true
         *
         * @example jQuery.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
         * @result false
         *
         * @name jQuery.validator.methods.pattern
         * @type Boolean
         * @cat Plugins/Validate/Methods
         */
        jQuery.validator.addMethod("pattern", function(value, element,
                                                       param) {
            if (this.optional(element)) {
                return true;
            }
            if (typeof param === 'string') {
                param = new RegExp('^(?:' + param + ')$');
            }
            return param.test(value);
        }, "Invalid format.");

        // Accept a value from a file input based on a required mimetype
        jQuery.validator.addMethod("accept", function(value, element, param) {
            // Split mime on commas in case we have multiple
            // types we can accept
            var typeParam = typeof param === "string" ? param
                .replace(/\s/g, '').replace(/,/g, '|')
                : "image/*", optionalValue = this
                .optional(element), i, file;

            // Element is optional
            if (optionalValue) {
                return optionalValue;
            }

            if ($(element).attr("type") === "file") {
                // If we are using a wildcard, make it regex
                // friendly
                typeParam = typeParam.replace(/\*/g, ".*");

                // Check if the element has a FileList
                // before checking each file
                if (element.files && element.files.length) {
                    for (i = 0; i < element.files.length; i++) {
                        file = element.files[i];

                        // Grab the mimetype from the loaded
                        // file, verify it matches
                        if (!file.type.match(new RegExp(
                            ".?(" + typeParam + ")$",
                            "i"))) {
                            return false;
                        }
                    }
                }
            }

            // Either return true because we've validated
            // each file, or because the
            // browser does not support element.files and
            // the FileList feature
            return true;
        }, jQuery.format("Please enter a value with a valid mimetype."));

        // Older "accept" file extension method. Old docs:
        // http://docs.jquery.com/Plugins/Validation/Methods/accept
        jQuery.validator.addMethod("extension", function(value, element,
                                                         param) {
            param = typeof param === "string" ? param.replace(/,/g, '|')
                : "png|jpe?g|gif";
            return this.optional(element)
                || value.match(new RegExp(".(" + param + ")$", "i"));
        }, jQuery.format("Please enter a value with a valid extension."));

        // 字符验证
        jQuery.validator.addMethod("namechars", function(value, element) {
            return this.optional(element)
                || /^[\u0391-\uFFE5\w]+$/.test(value);
        }, "只能包括中文字、英文字母、数字和下划线");


        // 字符验证
        jQuery.validator.addMethod("cnLetterNum", function(value, element) {
            return this.optional(element) || /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value);
        }, "只能包括中文字、英文字母和数字");

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

        // 中文字三个字节
        jQuery.validator.addMethod("utf8ByteLength", function(value,
                                                              element, param) {
            var length = Opf.Util.utf8ByteLength(value);
            return this.optional(element)
                || (length >= param[0] && length <= param[1]);
        }, "请确保输入的值在{0}-{1}个字节之间(一个中文字算3个字节)");

        // 身份证号码验证
        jQuery.validator.addMethod("idcard", function(value, element) {
            return this.optional(element) || validateIdentityCode(value);
        }, "请正确输入您的身份证号码");

        //字母数字
        jQuery.validator.addMethod('alnum', function(value, element) {
            return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
        }, '只能包括英文字母和数字');
        // 税务登记号验证

        var TXA_REG = /^[a-zA-Z0-9]{15,24}$/;

        jQuery.validator.addMethod("taxNo", function(value, element, param) {
            // param 为对应身份证字段selector

            function checkTaxNo(taxNo, idCardSelector) {
                var len, id, idLen, val, extrVal;
                if(taxNo && typeof taxNo === "string") {
                    len = taxNo.length;
                    // 没有确定验证规则
                    if(len == 18 || len == 15 || len == 24) {
                        return /^[a-zA-Z0-9]+$/.test(taxNo);
                    }
                    // 前15位或者18位匹配身份证
                    // 规则
                    // 1. 与身份证字段相等
                    // 2. 截取15或18位进行身份证验证
                    //3. 剩余字段必须是全数字

                    // id = $(idCardSelector).val(), idLen = id.length,
                    // val = taxNo.substring(0, idLen), extrVal = taxNo.substring(idLen);
                    // return val === id && /^\d+$/.test(extrVal) && new clsIDCard(val).IsValid();
                }
                return false;
            }
            return this.optional(element) || TXA_REG.test($.trim(value));
            // message ----> "税务登记号与申请人的身份证号码不匹配"

            // 简易处理
            // return this.optional(element) || /^\d{15}$|^\d{24}$/.test(value);
        }, "请输入15至24位税务登记号");

        // 手机号码验证
        jQuery.validator.addMethod("mobile", function(value, element) {
            var length = value.length;
            return this.optional(element) ||
                (length == 11 && mobile_reg.test(value));
        }, "请正确填写您的手机号码");

        // 电话区号验证
        jQuery.validator.addMethod("telareacode", function(value, element) {
            var areacode = /^\d{3,4}$/;
            return this.optional(element) || (areacode.test(value));
        }, "请正确填写您的电话号码");

        // 电话号码验证
        jQuery.validator.addMethod("phone", function(value, element) {
            var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
            return this.optional(element) || (tel.test(value));
        }, "请正确填写您的电话号码");

        // 联系电话(手机/电话皆可)验证
        jQuery.validator.addMethod("tel", function(value, element) {
            var length = value.length;
            return this.optional(element) ||
                fix_tel_reg.test(value) ||
                (length == 11 && mobile_reg.test(value));
        }, "请正确填写您的联系方式");

        // 带有分机号码的电话验证，电话号码只能由数字、'('、'-'、')'字符 组成
        jQuery.validator.addMethod("telBranch", function(value, element) {
            var length = value.length;
            return this.optional(element) || fix_tel_branch.test(value);
        }, "请正确填写您的联系方式");

        // 邮政编码验证
        jQuery.validator.addMethod("zipcode", function(value, element) {
            var tel = /^[0-9]{6}$/;
            return this.optional(element) || (tel.test(value));
        }, "请正确填写您的邮政编码");

        // 借记卡验证
        jQuery.validator.addMethod("debitCard", function(value, element, params) {
            return this.optional(element) ||
                syncRemoteValid(url._('valid.debitcard', {bankCardNo: value}));
        }, "请输入借记卡卡号");

        // 借记卡验证（是否是18家银行，判断类型为D1,慧收银用户）
        jQuery.validator.addMethod("isEighteenBank", function(value, element, params) {
            params = params||{};
            if(params.mchtKind == 'D1'){
                return this.optional(element) ||
                    syncValid(url._('valid.eighteen.bank', {bankCardNo: value}), 'isEighteenBank', {'bankCode': params.bankNo});
            }
            else{
                return true;
            }
        }, '只支持推荐的十八家银行');

        var banklen_reg = /^\d{16,19}$/;
        // 银行卡格式验证
        jQuery.validator.addMethod("isBankCard", function(value, element) {
            return this.optional(element) || (banklen_reg.test(value) && luhmCheck(value));
        }, "请正确填写您的银行卡号");
    
        // 18家银行验证
        jQuery.validator.addMethod("eighteenBank", function(value, element) {
            return this.optional(element) ||
                syncValid(url._('valid.eighteen.bank', {bankCardNo: value}) + '?bankCode='+ bankCode1,'eighteenBank');
        }, "错误");
    
        // 判断整数value是否大于0
        jQuery.validator.addMethod("intGtZero", function(value, element) {
            value = parseInt(value, 10);
            return this.optional(element) || value > 0;
        }, "整数必须大于0");

        jQuery.validator.addMethod("intGtZeroAndFive", function(value, element, param) {
            return this.optional(element) ||
                (value > 0 && value <= 5);
        }, "整数必须大于0或小于等于5");

        // 判断整数value是否大于或等于0
        jQuery.validator.addMethod("intGteZero", function(value, element) {
            value = parseInt(value, 10);
            return this.optional(element) || value >= 0;
        }, "整数必须大于或等于0");

        // 判断整数value是否不等于0
        jQuery.validator.addMethod("intNEqZero", function(value, element) {
            value = parseInt(value, 10);
            return this.optional(element) || value !== 0;
        }, "整数必须不等于0");

        // 判断整数value是否小于0
        jQuery.validator.addMethod("intLtZero", function(value, element) {
            value = parseInt(value, 10);
            return this.optional(element) || value < 0;
        }, "整数必须小于0");

        // 判断整数value是否小于或等于0
        jQuery.validator.addMethod("intLteZero", function(value, element) {
            value = parseInt(value, 10);
            return this.optional(element) || value <= 0;
        }, "整数必须小于或等于0");

        jQuery.validator.addMethod("integerScope", function(value,
                                                            element, param) {
            value = parseInt(value, 10);
            return this.optional(element) ||
                (param[0] <= value && value <= param[1]);
        }, "请确保输入的值在{0}-{1}之间");

        jQuery.validator.addMethod("floatScope", function(value,
                                                          element, param) {
            value = +value;
            return this.optional(element) ||
                (param[0] <= value && value <= param[1]);
        }, "请确保输入的值在{0}-{1}之间");

        // 判断浮点数value是否等于0
        jQuery.validator.addMethod("floatEqZero", function(value, element) {
            value = parseFloat(value);
            return this.optional(element) || value == 0;
        }, "浮点数必须为0");

        // 判断浮点数value是否大于0
        jQuery.validator.addMethod("floatGtZero", function(value, element) {
            value = parseFloat(value);
            return this.optional(element) || value > 0;
        }, "请输入大于零的数字");

        // 判断浮点数value是否大于或等于0
        jQuery.validator.addMethod("floatGteZero", function(value,
                                                            element) {
            value = parseFloat(value);
            return this.optional(element) || value >= 0;
        }, "请输入大于或等于零的数字");

        // 判断浮点数value是否不等于0
        jQuery.validator.addMethod("floatNEqZero",
            function(value, element) {
                value = parseFloat(value);
                return this.optional(element) || value != 0;
            }, "浮点数必须不等于0");

        // 判断浮点数value是否小于0
        jQuery.validator.addMethod("floatLtZero", function(value, element) {
            value = parseFloat(value);
            return this.optional(element) || value < 0;
        }, "浮点数必须小于0");

        // 判断浮点数value是否小于或等于0
        jQuery.validator.addMethod("floatLteZero",
            function(value, element) {
                value = parseFloat(value);
                return this.optional(element) || value <= 0;
            }, "浮点数必须小于或等于0");

        // 判断浮点型
        jQuery.validator.addMethod("float", function(value, element) {
            return this.optional(element) || /^[-\+]?\d+(\.\d+)?$/.test(value);
        }, "只能包含数字、小数点等字符");

        // 判断数值类型，包括整数和浮点数
        jQuery.validator.addMethod("number", function(value, element) {
            return this.optional(element) ||
                /^[-\+]?\d+$/.test(value) ||
                /^[-\+]?\d+(\.\d+)?$/.test(value);
        }, "匹配数值类型，包括整数和浮点数");

        // 两次输入不能相同
        jQuery.validator.addMethod("notEqualTo", function( value, element, param ) {
            var valid = true;

            var target = $(param);

            if ( this.settings.onfocusout ) {
                target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    $(element).valid();
                });
            }

            //如果当前值等于参数中任一个元素的值，就是不合法
            $(param).each(function (idx, el) {
                console.log(value, $(el).val());
                if(value === $(el).val()) {
                    valid = false;
                    return;//break each
                }
            });

            return valid;
        }, "输入内容重复");


        //大于的判断
        $.validator.addMethod("gt", validateCpm(
            function(myVal, targetVal) {
                return !isNaN(myVal) && !isNaN(targetVal) && myVal > targetVal;
            }
        ), function(element, parameters) {
            // 通常都是自定义，暂时不需要默认，需要再补
            return '';
        });


        //大于等于的判断
        $.validator.addMethod("ge", validateCpm(
            function(myVal, targetVal) {
                return !isNaN(myVal) && !isNaN(targetVal) && myVal >= targetVal;
            }
        ),function (element, parameters) {
            // 通常都是自定义，暂时不需要默认，需要再补
            return '';
        });

        //小于等于的判断
        $.validator.addMethod("le", validateCpm(
            function(myVal, targetVal) {
                return !isNaN(myVal) && !isNaN(targetVal) && myVal <= targetVal;
            }
        ),function (element, parameters) {
            // 通常都是自定义，暂时不需要默认，需要再补
            return '';
        });

        //限定输入数字范围
        jQuery.validator.addMethod("digitalRange", function(value, element, param) {
            return this.optional(element) || (value>param[0] && value<param[1]);
        }, "请输入{0}~{1}之间的数字");

        //不能输入空格
        $.validator.addMethod("noSpace", function(value, element) {
            return this.optional(element) || /^\S+$/.test(value);
        },"不能输入空格");

        // 只能输入[0-9]数字
        jQuery.validator.addMethod("digits", function(value, element) {
            return this.optional(element) || /^\d+$/.test(value);
        }, "只能输入0-9数字");

        // 判断中文字符
        jQuery.validator.addMethod("chinese", function(value, element) {
            return this.optional(element) || /^[\u4E00-\u9FA5]+$/.test(value);
        }, "只能包含中文字符。");

        var cnname_reg = /^([a-zA-Z]+[\u0020\u00b7]?[a-zA-Z]+|[\u4E00-\u9FA5]+[\u0020\u00b7]?[\u4E00-\u9FA5]+)$/;
        // 判断中文字符
        jQuery.validator.addMethod("chineseName", function(value, element) {
            //在智能ABC输入法中按V+1+4键或shift+@, 或者中文输入法下敲入1左边的`键
            //少数名族用到'·'\u00b7作为间隔符号，空格(\u0020)
            return this.optional(element) || cnname_reg.test(value);
        }, "请输入合法的姓名。");

        // 判断英文字符
        jQuery.validator.addMethod("english", function(value, element) {
            return this.optional(element) || /^[A-Za-z]+$/.test(value);
        }, "只能包含英文字符。");

        // 营业执照验证 不确定规则, 有可能有英文字母
        jQuery.validator.addMethod("licNo", function(value, element) {
            //var licNoReg = /^[a-zA-Z\d]{10,}$/;
            return this.optional(element) || /^\w{13,20}$/.test(value);
        }, "请输入合法的营业执照号");

        jQuery.validator.addMethod("date", function(value, element, param) {
            return this.optional(element) || checkDateString(value);
        }, "请输入正确的时间格式");

        jQuery.validator.addMethod("endDate", function(value, element, param) {
            var nowDate = new Date();
            var nowDateMounth = nowDate.getMonth()<9 ? '0' + (nowDate.getMonth()+1) : (nowDate.getMonth()+1);
            var nowDateVal = nowDate.getFullYear() + nowDateMounth + nowDate.getDate();
            return parseInt(value, 10) > parseInt(nowDateVal, 10);
        }, "过期了");

        jQuery.validator.addMethod('remarkLength',function(value,element){
            return this.optional(element) || checkMchtNameLength(value, 600);
        }, '备注过长');

        //（数据库UTF8）中文个数x3+英文个数 <= 160
        jQuery.validator.addMethod('mchtNameLength',function(value,element){
            return this.optional(element) || checkMchtNameLength(value, 160);
        }, '商户名称过长');

        function checkMchtNameLength (value, maxLength) {
            return (value||'').replace(/[^x00-xff]/gi,'xxx').length <= maxLength;
        }

        //TODO增加mchtMobile的验证里面包含组合的验证
        jQuery.validator.addMethod('mchtMobileDuplicateCheck',function(value,element, param){
            var baseId = $(element).data('baseId') || '';
            return this.optional(element) ||
                //可配置忽略的号码
                (
                    (!(param.exist && _.contains(param.exist, value))) &&
                        (
                            (param.ignore && _.contains(param.ignore, value)) ||
                                syncRemoteValid(url._('merchant.valid.mobile', {mobile:value}) + '?id=' + baseId)
                            )
                    );
        });

        jQuery.validator.addMethod('mchtlicNoDuplicateCheck',function(value, element, param){
            var baseId = $(element).data('baseId') || '';
            return this.optional(element) ||
                //可配置忽略的号码
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('merchant.valid.licNo', {licNo:value}) + '?id=' + baseId);
        });

        jQuery.validator.addMethod('mchtPersonIdDuplicateCheck',function(value, element, param){
            return this.optional(element) ||
                //可配置忽略的号码
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('merchant.valid.id', {id:value}));

        });

        jQuery.validator.addMethod('mchtUserEmailDuplicateCheck',function(value, element, param){
            var paramData = {email: value, id: ''};
            if($(element).data('baseId')){
                paramData.id = $(element).data('baseId');
            }
            return this.optional(element) ||
                //可配置忽略的
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('merchant.valid.email') + '?' + $.param(paramData));
        });

        //jQuery.validator.addMethod('mchtUserLoginCheck',function(value, element, param){
        //    var houzhui = $(element).next().text();
        //    var paramData = {kw: value+houzhui};
        //
        //    if(typeof param == 'boolean'){
        //        return this.optional(element) ||
        //            (param.ignore && _.contains(param.ignore, value)) ||
        //            syncRemoteValid('api/mcht/merchants/userLogin' + '?' + $.param(paramData));
        //    }
        //    else{
        //        var str_index = param.ignore[0].indexOf('@');
        //        var oldParam = param.ignore[0].substr(0, str_index);//账号名
        //        if(oldParam == value){//修改记录旧账号
        //            return true;
        //        }
        //        else{
        //            return this.optional(element) ||
        //                (param.ignore && _.contains(param.ignore, value)) ||
        //                syncRemoteValid('api/mcht/merchants/userLogin' + '?' + $.param(paramData));
        //        }
        //    }
        //});

        //jQuery.validator.addMethod('mchtUserKindSuffixCheck',function(value, element, param){
        //    var paramData = {kindSuffix: value};
        //    if(element.id == 'brand_kindSuffix'){
        //        return true;
        //    }
        //    else{
        //        if(typeof param == 'boolean'){
        //            return this.optional(element) ||
        //                (param.ignore && _.contains(param.ignore, value)) ||
        //                syncRemoteValid('api/mcht/merchants/check-brandSuffix' + '?' + $.param(paramData));
        //        }
        //        else{
        //            var oldParam = param.ignore[0];//账号名
        //            if(oldParam == value){//修改记录旧账号
        //                return true;
        //            }
        //            else {
        //                return this.optional(element) ||
        //                    (param.ignore && _.contains(param.ignore, value)) ||
        //                    syncRemoteValid('api/mcht/merchants/check-brandSuffix' + '?' + $.param(paramData));
        //            }
        //        }
        //    }
        //});

        jQuery.validator.addMethod('brhNameDuplicateCheck',function(value, element, param){
            var baseId = $(element).data('id') || '';
            return this.optional(element) ||
                //可配置忽略的
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('merchant.valid.BrhName', {BrhName: encodeTwice(value)}) + '&id=' + baseId);

        });

        jQuery.validator.addMethod('brhlicNoDuplicateCheck',function(value, element, param){
            var baseId = $(element).data('id') || '';
            return this.optional(element) ||
                //可配置忽略的号码
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('branch.valid.licNo', {licNo:value}) + '?id=' + baseId);
        });

        jQuery.validator.addMethod('checkGroupNameRepeat',function(value, element, param){
            return this.optional(element) ||
                //可配置忽略的
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('rolegroup.valid.name', {roleGroupName: encodeTwice(value)}));

        });

    jQuery.validator.addMethod('checkIdCardRepeat',function(value, element, param){
        var baseId = $(element).data('id') || '';
        return this.optional(element) ||
            (param.ignore && _.contains(param.ignore, value)) ||
            syncRemoteValid(url._('brhIdCardCheck', {idCard: value}) + '&id=' + baseId);
    });

    jQuery.validator.addMethod('checkIdCardRepeat4User',function(value, element, param){
        var baseId = $(element).data('selectId') || '';
        return this.optional(element) ||
            (param.ignore && _.contains(param.ignore, value)) ||
            syncRemoteValid(url._('brhIdCardCheck4User', {cardno: value}) + '&id=' + baseId);
    });

    jQuery.validator.addMethod('checkCreditCard',function(value, element, param){
        return this.optional(element) ||
            (param.ignore && _.contains(param.ignore, value)) ||
            syncRemoteValid(url._('valid.debitcard', {bankCardNo: value}));
    });

    jQuery.validator.addMethod('checkLoginRepeat',function(value, element, param){
        var paramData = {loginName: value, id: ''};
        if($(element).data('selectId')){
            paramData.id = $(element).data('selectId');
        }
        return this.optional(element) ||
            (param.ignore && _.contains(param.ignore, value)) ||
            syncRemoteValid(url._('check.loginName') + '?' + $.param(paramData));
    });

    jQuery.validator.addMethod('checkPhoneRepeat',function(value, element, param){
        var paramData = {mobile: value, id: ''};
        if($(element).data('selectId')){
            paramData.id = $(element).data('selectId');
        }
        return this.optional(element) ||
            //可配置忽略的
            (param.ignore && _.contains(param.ignore, value)) ||
            syncRemoteValid(url._('check.mobile') + '?' + $.param(paramData));
    });

    jQuery.validator.addMethod('checkEmailRepeat',function(value, element, param){
        var paramData = {email: value, id: ''};
        if($(element).data('selectId')){
            paramData.id = $(element).data('selectId');
        }
        return this.optional(element) ||
            //可配置忽略的
            (param.ignore && _.contains(param.ignore, value)) ||
            syncRemoteValid(url._('check.email') + '?' + $.param(paramData));
    });

    jQuery.validator.addMethod('checkMobileRepeat',function(value, element, param){
        var baseId = $(element).data('id') || '';
        return this.optional(element) ||
            //可配置忽略的
            (param.ignore && _.contains(param.ignore, value)) ||
            syncRemoteValid(url._('brhMobileCheck', {mobile: value}) + '&id=' + baseId);
    });

    jQuery.validator.addMethod('checkZbankNoRepeat',function(value,element){
        return this.optional(element) || checkUnRepeat(value,element);
    });

    jQuery.validator.addMethod('checkVerifyCodeValid',function(value,element){
        return this.optional(element) ||
            checkVerifyCode({
                value: value,
                mobileNo:$(element).data('mobileNo'),
                url: $(element).data('validVerifyCodeUrl')
            });
    });

        //费率名称， 同机构下模型名称不能重复
        /**
         * @param  {[type]} value   [description]
         * @param  {[type]} element [description]
         * @param  {[type]} param
         *         				{
		 *         					ignore:['忽略valueA', '忽略valueB'],
		 *         					brhCode: 机构号, 支持方法
		 *         				}
         * @return {[type]}         [description]
         */
        jQuery.validator.addMethod("uniqueBrhDiscModelName", function(value, element, param) {
            //保证param.ignore 是一个数组
            var validUrl, brhCode;

            if(param && param.ignore) {
                param.ignore = Opf.Array.from(param.ignore);
            }

            brhCode = (param && param.brhCode) ? _.result(param, 'brhCode') : null;
            if (brhCode) {
                validUrl = url._('valid.disc.brh.modelname.unique', {
                    modelName: encodeTwice(value),
                    brhCode: brhCode
                });
            }

            return this.optional(element) ||
                //可配置忽略的, 通常用在编辑表单
                (param.ignore && _.contains(param.ignore, value)) ||
                //验证该机构下的模型模型名称是否重复, 没有获取到合适url就不验证
                (!validUrl || syncRemoteValid(validUrl));

        }, "该机构下已有相同的名称");

        jQuery.validator.addMethod('checkBrhModelNmRepeat',function(value, element, param){
            return this.optional(element) ||
                //可配置忽略的
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('disc.brh.check.modelNm', {modelNm: encodeTwice(value), modelBrh: encodeTwice($(element).data('modelBrh'))}));

        });

        jQuery.validator.addMethod('checkMchtModelNmRepeat',function(value, element, param){
            return this.optional(element) ||
                //可配置忽略的
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('disc.mcht.valid.modelNm', {name: encodeTwice(value), brhCode: encodeURIComponent(encodeURIComponent($(element).data('brhCode')))}));

        });


        jQuery.validator.addMethod('checkProfitNmRepeat',function(value, element, param){
            return this.optional(element) ||
                //可配置忽略的
                (param.ignore && _.contains(param.ignore, value)) ||
                syncRemoteValid(url._('disc.profit.valid.name', {modelNm: encodeTwice(value), modelBrh: encodeTwice(param.modelBrh)}));
        });

    // ************************** functions begin ***********************

    function syncRemoteValid (url) {
        var valid = false;
        Opf.ajax({
            type:'GET',
            url: url,
            async:false,
            autoMsg:false,
            success: function (resp) {
                /**
                 * 可能的返回
                 * {valid: true}//合法
                 * {没有success,没有valid}//合法
                 * {success: true}//合法
                 *
                 * {valid: false}//不合法
                 * {success: false}//不合法
                 */
                //恶心 TODO 后面统一所有验证接口
                if(resp.valid === true ||
                    resp.success === true ||
                    (resp.valid === void 0 && resp.success === void 0)) {
                    valid = true;
                }
            }
        });
        return valid;
    }

    //验证--动态赋值错误信息
    function syncValid (url,methodName,param) {
        var valid = false;
        Opf.ajax({
            type:'GET',
            url: url,
            data: param,
            async:false,
            autoMsg:false,
            success: function (resp) {
                /**
                 * 可能的返回
                 * {status: 0}//合法
                 * {status: 1,remark:xxx}//不合法
                 */
                if(resp.status == '0') {
                    valid = true;
                }else{
                    $.validator.messages[methodName] = resp.remark;
                }
            }
        });
        return valid;
    }

    function checkUnRepeat(value,element){
        var url,
            params = $(element).data('params')||{};

        if(!_.isUndefined(params.selId)){
            //var _selId = $(element).data('params').selId;
            //_url = $(element).data('params').url;
            url = params.url + value + '&id=' + params.selId;
        }else{
            //_url = $(element).data('params').url;
            url = params.url + value;
        }

        var unRepeat = true;
        Opf.ajax({
            type:'GET',
            url:url,
            async:false,
            autoMsg:false,
            error:function(resp){
                unRepeat = false;
            }
        });

        return unRepeat;
    }

    function checkVerifyCode(options){
        var valid = false;
        var value = options.value||"";
        var mobileNo = options.mobileNo||"";
        var url = options.url||"";

        if(value && value.length == 6){
                Opf.ajax({
                    type: 'GET',
                    data: {
                        mobile: mobileNo,
                        verifyCode: value
                    },
                    url: url,
                    async: false,
                    autoMsg: false,
                    success: function (resp) {
                        /**
                         * 可能的返回
                         * {status: 1}//合法
                         * {success: true}//合法
                         *
                         * {status: 0}//不合法
                         * {success: false}//不合法
                         */
                        resp.status && resp.status == 1 && (valid = true);
                    }
                });
            }
            return valid;
        }

        function checkCreditCard(value,element){
            var notCreditCard = true;
            if($(element).data("isCreditCard")){
                notCreditCard = false;
            }
            console.log($(element).data("isCreditCard"));
            return notCreditCard;
        }

        function checkDateString(text) {
            var result = text.match( new RegExp("^(\\d{1,4})(-|\\/)?(\\d{1,2})(-|\\/)?(\\d{1,2})$") );
            if(!result ) return false;
            var d = new Date(result[1], result[3] - 1, result[5]);
            return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[5]);
        }

        /*
         * 可以任意匹配时间格式 (yyyy-mm-dd | mm-dd-yyyy 等)
         function dateStringFormatter(value, format) {
         }
         */

        function stripHtml(value) {
            // remove html tags and space chars
            return value.replace(/<.[^<>]*?>/g, ' ').replace(
                    /&nbsp;|&#160;/gi, ' ')
                // remove punctuation
                .replace(/[.(),;:!?%#$'"_+=\/\-]*/g, '');
        }


        var id_reg = /^[0-9]{6}(18|19|20)?[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[0-9]{3}([0-9]|X)$/i;
        function validateIdentityCode(code) {
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};

            //支持15位和18位身份证号
            if (!code || !id_reg.test(code)) {
                return false;
            }

            //前两位为地区码
            if (!city[code.substr(0, 2)]) {
                return false;
            }

            //18位身份证需要验证最后一位校验位
            if (code.length == 18 && !checkIdkSum(code)) {
                return false;
            }

            return true;
        }

        function checkIdkSum(str) {
            var valid = true;

            var code = str.split('');
            /*
             ∑(ai×Wi)(mod 11)
             i----表示号码字符包括校验码在内的位置索引；
             ai----表示第i位置上的号码字符值；
             加权因子Wi----示第i位置上的加权因子，其数值依据公式 "Wi=2^(n-1）(mod 11)"  (n=i+1)
             */
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0, ai = 0, wi = 0;

            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            if (parity[sum % 11] != code[17]) {
                valid = false;
            }

            return valid;
        }

        /*
         * 银行卡号Luhm校验
         */
        function luhmCheck(bankno) {

            // 放开银行卡合法性验证
            return true;
            // 发开银行卡合法性验证


            var lastNum = bankno.substr(bankno.length - 1, 1);// 取出最后一位（与luhm进行比较）

            var first15Num = bankno.substr(0, bankno.length - 1);// 前15或18位
            var newArr = new Array();
            for (var i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
                newArr.push(first15Num.substr(i, 1));
            }
            var arrJiShu = new Array(); // 奇数位*2的积 <9
            var arrJiShu2 = new Array(); // 奇数位*2的积 >9
            var arrOuShu = new Array(); // 偶数位数组
            for (var j = 0; j < newArr.length; j++) {
                if ((j + 1) % 2 == 1) {// 奇数位
                    if (parseInt(newArr[j]) * 2 < 9)
                        arrJiShu.push(parseInt(newArr[j]) * 2);
                    else
                        arrJiShu2.push(parseInt(newArr[j]) * 2);
                } else
                // 偶数位
                    arrOuShu.push(newArr[j]);
            }

            var jishu_child1 = new Array();// 奇数位*2 >9 的分割之后的数组个位数
            var jishu_child2 = new Array();// 奇数位*2 >9 的分割之后的数组十位数
            for (var h = 0; h < arrJiShu2.length; h++) {
                jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
                jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
            }

            var sumJiShu = 0; // 奇数位*2 < 9 的数组之和
            var sumOuShu = 0; // 偶数位数组之和
            var sumJiShuChild1 = 0; // 奇数位*2 >9 的分割之后的数组个位数之和
            var sumJiShuChild2 = 0; // 奇数位*2 >9 的分割之后的数组十位数之和
            var sumTotal = 0;

            for (var m = 0; m < arrJiShu.length; m++) {
                sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
            }

            for (var n = 0; n < arrOuShu.length; n++) {
                sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
            }

            for (var p = 0; p < jishu_child1.length; p++) {
                sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
                sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
            }
            // 计算总和
            sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu)
                + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

            // 计算Luhm值
            var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;

            if (lastNum == 10 - k) {
                return true;
            }
            return false;
        }


        function validateCpm(comprValidFn) {

            return function(value, element, param) {
                var settings = this.settings;

                var valid = true;
                var $elements;

                var myVal = parseFloat(value);

                //如果选择器, 从配置元素表单去找
                if (_.isString(param)) {
                    $elements = $(element.form).find(param);
                    //如果是dom/jqueryEl/jqueryEls
                } else if (param.tagName && param.nodeType || param instanceof $ || _.isArray(param)) {
                    $elements = $(param);
                }

                //遍历所有目标，只要有一个不合法，立刻返回
                $elements.each(function(index, el) {

                    var $cmpTarget = $(el);

                    //如果是跟dom元素比较，则在目标dom改变时也要触发一次验证
                    if ($cmpTarget && settings.onfocusout) {
                        $cmpTarget.unbind(".validate-gt").bind("blur.validate-gt", function() {
                            $(element).valid();
                        });
                    }

                    var cmpTargetVal = parseFloat($cmpTarget ? $cmpTarget.val() : param);
                    valid = !isNaN(myVal) && !isNaN(cmpTargetVal);

                    if (comprValidFn) {
                        valid = valid && comprValidFn(myVal, cmpTargetVal);
                    }

                    if (!valid) {
                        return false; //break $.each
                    }

                });

                return valid;
            }
        }

    function encodeTwice (str) {
        return encodeURIComponent(encodeURIComponent(str));
    }
    // ************************** functions end ***********************

    //返回公用的校验方法
    return {
        syncValid:       syncValid,
        syncRemoteValid: syncRemoteValid
    }
});
