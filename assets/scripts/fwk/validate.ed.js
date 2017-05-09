(function($, win, undefined){
		
		$.extend($.fn, {
			simpleValid: function(options) {
				var validator = $.data(this[0], "simpleValidator");
				if (validator) {
					return validator;
				}
				this.attr("data-valid", "smpValid");
				validator = new $.simpleValidator(options, this);
				$.data(this[0], "simpleValidator", validator);
				return validator;
			},
			toValid: function() {
				return $(this).simpleValid().valid();
			}
		});

		$.simpleValidator = function(options, element) {
			this.settings = $.extend( true, {}, $.simpleValidator.defaults, options );
			this.element = element;
			this.init();
		};
		
		$.extend($.simpleValidator, {
			defaults: {
				messages: {},
				rules: {},
				errorClass: "help-error help-block",
				validClass: "valid",
				errorElement: "span",
				highlight: function(element, error, errorClass){
					element.addClass(errorClass);
				},
				success: function(element, error, errorClass) {
					element.removeClass(errorClass);
                    error.remove();
				},
				errorPlacement: function(element, error, errorClass) {
                	error.addClass(errorClass).insertAfter(element);
                }
			},
			ruleMethod: {
				required: function(value, element) {
    				return $.trim(value) != "";
    			},
    			maxLength: function( value, element, param ) {
    				var length = value.length;
    				return $.simpleValidator.ruleMethod.required(value) && length <= param;
    			},
    			chinese: function(value, element) {
    				return $.simpleValidator.ruleMethod.required(value) 
    						&& /^[\u0391-\uFFE5]+$/.test(value);
    			},
    			english: function(value, element) {
    				return $.simpleValidator.ruleMethod.required(value) && /^[A-Za-z]+$/.test(value);
    			},
    			email: function( value, element ) {
					return $.simpleValidator.ruleMethod.required(element) 
							&& /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
				},
				phone: function(value, element) {
					var length = value.length;
					var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
					var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
					return $.simpleValidator.ruleMethod.required(element)
							&& tel.test(value)
							&& (length == 11 && mobile.test(value));
				}
			},
			ruleMessage: {
				required: "此字段必填",
    			maxLength: "最大长度为{0}",
    			chinese: "请输入中文",
    			english: "请输入英文",
    			email: "请输入正确的电邮格式",
    			phone: "请输入正确的手机号码"
			},
			prototype: {
				init: function() {
					var me = this;
					me.errorElement = $("<" + me.settings.errorElement + ">").addClass(me.settings.errorClass);
					me.rules = me.normalizeRule(me.settings.rules);
					me.element.on("keyup blur", function(){
						me.valid();
					})
				},
				valid: function() {
					if ( !this.getRxpMode(this.rules) ) {
        				this.showError();
        				return false;
        			} else {
        				this.showSuccess();
        				return true;
        			};
				},
				getRxpMode: function(rules) {
            		var param, val;
            		this.errorList = [];
            		for(var rule in rules) {
            			param = $.makeArray(rules[rule]);
            			val = this.element.val();
            			if(!$.simpleValidator.ruleMethod[rule].call(null, val, this.element, param)) {
            				this.errorList.push( {method: rule, param: param} );
            				return false;
            			};
            		};
            		return true;
            	},
            	transErrorInfo: function(list) {
            		var source, param;
            		if(list.length > 0) {
            			source = $.simpleValidator.ruleMessage[list[0]["method"]];
            			param = list[0]["param"];
            			$.each(param, function(i, n) {
            				source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
            					return n;
            				});
            			});
            		}
            		return source;
            	},
            	showLabel: function() {

            	},
            	showError: function() {
            		this.errorElement.html(this.transErrorInfo(this.errorList));
            		this.settings.highlight.call(null, this.element, this.errorElement, this.errorClass);
            		this.settings.errorPlacement.call(null, this.element, this.errorElement, this.errorClass);
            	},
            	showSuccess: function(element, error) {
            		this.settings.success.call(null, this.element, this.errorElement, this.errorClass);
            	},
				normalizeRule: function(data) {
					if ( typeof data === "string" ) {
						var transformed = {};
						$.each(data.split(/\s/), function() {
							transformed[this] = true;
						});
						data = transformed;
					}
					return data;
				}
			}
		});

})(jQuery, window);