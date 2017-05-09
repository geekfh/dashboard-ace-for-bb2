/**
 * Created by wupeiying on 2016/11/10.
 */
define([
	'tpl!app/oms/route/oneSettle/common/templates/add-field-item.tpl',
	'tpl!app/oms/route/oneSettle/common/templates/fieldset-group.tpl',
	'tpl!app/oms/route/oneSettle/common/templates/field-types-dd.tpl',
	'tpl!assets/scripts/fwk/component/templates/area-no.tpl',
	'tpl!app/oms/route/oneSettle/common/templates/mcc.tpl',
	'app/oms/route/settlement/AbstarctField',
	'bootstrap-tagsinput',
	'jquery.inputmask',
	'select2',
	'common-ui'
], function(addFieldItemTpl, fieldsetGroupTpl, fieldTypesDDTpl, areaTpl, mccTpl, AbstarctField) {

	// eq-相等 uq-不等 gt-大于 lt-小于 in-在 not_in-不在 not_null-非空 is_null-为空
	var OPERATOR_CN = {
		eq: '相等',
		uq: '不等',
		gt: '大于',
		lt: '小于',
		in: '在',
		not_in: '不在',
		not_null: '非空',
		is_null: '为空'
	};

	var OPERATOR_MAP = {
		'num': ['eq', 'uq', 'gt', 'lt'],
		'str': ['eq', 'in', 'not_in']
	};

    /**
     * mcc
     */
    var MccView = Marionette.ItemView.extend({
        template: mccTpl,
        className: 'mcc-panel dropdown',
        events: {
            'change @ui.mcc': 'onMccChange',
            'click select': 'onClickSelect'
            //'click input': 'onClickInput'
        },

        ui: {
            mccGroup: '[name="mccGroup4Condition"]',
            mcc:      '[name="mcc4Condition"]'
        },

        initialize: function (options) {
            this.render();
            this.$el.appendTo(options.appendTo);
        },

        onRender: function () {
            this.$bindInput = this.$el.find('input');

            if (this.getOption('editType') === 'mul') {
                this.$bindInput.addClass('mul-input');

                this.$bindInput.tagsinput({
                    itemValue: function (item) {
                        return item.id;
                    },
                    itemText: function (item) {
                        return item.text;
                    }
                });

                this.$el.find('input').attr({
                    readonly: "readonly"
                }).closest(".bootstrap-tagsinput").attr("data-toggle", "dropdown");

            } else {
                this.$bindInput.addClass('single-input');
                this.$bindInput.attr('name', 'single');
            }

            //this.toggleMcc(false);

            //render mcc
            this.renderMcc();
        },

        renderMcc: function() {
            var me = this,
                ui = me.ui;

            ui.mcc.data('select2') && ui.mcc.select2('destroy');
            ui.mcc.html('<option></option>');

            CommonUI.mccSection(ui.mccGroup, ui.mcc);
        },

        /*toggleMcc: function (toggle) {
            this.$el.find('.address-code').toggle(toggle);

            if (!toggle) {
                $(document).unbind('click.mcc');
                this.bindDocuments = false;
            }
        },

        onClickInput: function (e) {
            e.stopPropagation();
            var me = this;
            this.ui.mcc.data('select2') && this.ui.mcc.select2('destroy');
            this.ui.mcc.html('<option></option>');
            CommonUI.mccSection(this.ui.mccGroup, this.ui.mcc);
            //this.toggleMcc(true);

            !this.bindDocuments && $(document).on('click.mcc', function (e) {
                if(!$(e.target).hasClass('mcc-group')) {
                    //me.toggleMcc(false);
                }
            });

            this.bindDocuments = true;
        },*/

        onClickSelect: function(e) {
            e.stopPropagation();
            return false;
        },

        onMccChange: function (e) {
            var value  = $(e.target).val();
            var remark = $(e.target).find('option:selected').text();

            //不允许出现空值
            if(_.isEmpty(value||remark)) {
                return;
            }

            if (this.$bindInput.data('tagsinput')) {
                this.$bindInput.tagsinput('add', { id: value, text: remark });

            } else {
                this.$bindInput.val(remark);
                this.$bindInput.data('mcc', value);
                this.$bindInput.dropdown('toggle');
                //this.toggleMcc(false);
            }

        }
    });

    /**
     * address
     */
    var AreaNoView = Marionette.ItemView.extend({
        template: areaTpl,
        className: 'address-panel',
        events: {
            'change [name="areaNo"]': 'onAreaNoChange',
            'click input': 'onClickInput'
        },
        ui: {
            province: '[name="province"]',
            city: '[name="city"]',
            areaNo: '[name="areaNo"]'
        },
        initialize: function (options) {
            this.render();
            this.$el.appendTo(options.appendTo);
        },
        onRender: function () {
            this.$bindInput = this.$el.find('input');

            if (this.getOption('editType') === 'mul') {
                this.$bindInput.addClass('mul-input');

                this.$bindInput.tagsinput({
                    itemValue: function (item) {
                        return item.id;
                    },
                    itemText: function (item) {
                        return item.text;
                    }
                });
                this.$el.find('input').attr('readonly', 'readonly');

            } else {
                this.$bindInput.addClass('single-input');
                this.$bindInput.attr('name', 'single');

            }

            this.toggleAddress(false);
        },
        toggleAddress: function (toggle) {
            this.$el.find('.address-code').toggle(toggle);

            if (!toggle) {
                $(document).unbind('click.areaNo');
                this.bindDocuments = false;
            }
        },

        onClickInput: function (e) {
            e.stopPropagation();

            var me = this,
                ui = me.ui;

            if(!me.subAddress) {
                me.subAddress = CommonUI.subAddress(ui.province, ui.city, ui.areaNo);
            }
			this.toggleAddress(true);

			!this.bindDocuments && $(document).on('click.areaNo', function (e) {
				if(!$(e.target).hasClass('area-no-group')) {
					me.toggleAddress(false);
				}
			});

			this.bindDocuments = true;
		},

		getAddress: function (value) {
			if (!value) {
				return;
			}

			var province = this.ui.province.find('option:selected').text(),
				city = this.ui.city.find('option:selected').text(),
				area = this.ui.areaNo.find('option:selected').text(), address = province;

			if (value.length > 2) {
				address += ('/' + city);
			}

			if (value.length > 4) {
				address += ('/' + area);
			}

			return address;
		},

		getAreaNoValue: function () {
			var result;

			if ((result = this.ui.areaNo.val()) !== 'all') {
				return result;

			} else if ((result = this.ui.city.val()) !== 'all') {
				return result;

			} else {
				return this.ui.province.val();

			}
		},

		onAreaNoChange: function (e) {
			var value = this.getAreaNoValue(),
				address = this.getAddress(value);

			if (!value) return;

			if (this.$bindInput.data('tagsinput')) {
				this.$bindInput.tagsinput('add', { id: value, text: address });

			} else {
				this.$bindInput.val(address);
				this.$bindInput.data('areaNo', value);
				this.toggleAddress(false);

			}

		}
	});


	var FieldMchtNoView = AbstarctField.extend({
		label: '商户编号',
		name: 'mcht_no',
		extraOprs: ['in', 'not_in'],
		validateMul: function () {
			this.ui.mulValWrap.find('.has-error').remove();
			if(this.$mulInput.val() !== '') {
				return true;
			} else {
				this.ui.mulValWrap.find('.bootstrap-tagsinput').after('<span class="has-error">此字段必须填写</span>');
				return false;
			}
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.validateMul();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		},

		setupSingleVal: function () {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask("Regex", {
					regex: "[0-9]+"
				})
				.appendTo(this.ui.singleValWrap);
		},

		setupMulVal: function() {
			var me = this;
			AbstarctField.prototype.setupMulVal.apply(this, arguments);
			this.$mulInput.on('itemAdded', function () {
				me.ui.mulValWrap.find('.has-error').remove();
			});
			this.ui.mulValWrap.find('.bootstrap-tagsinput').find('input')
				.inputmask("Regex", {
					regex: "[0-9]+"
				});
		}

	});

	var FieldMccGroup = AbstarctField.extend({
		label: '商户MCC',
		name: 'mcc_grp',
		extraOprs: ['in', 'not_in'],
		ajaxMCCGroup: function (callback) {
			return Opf.ajax({
				url: url._('options.mccGroup'),
				type: 'GET',
				success: function (resp) {
					var arr = [];
					_.each(resp, function (item) {
						arr.push({id: item.value, text: item.name});
					});
					callback(arr);
				}
			});
		},

		setMulValue: function (val) {
			var me = this;

			if(me.mulInputDeferr && typeof val === 'string') {
				me.mulInputDeferr.done(function () {
					me.$mulInput.select2('val', val.split(','));
				});
			}
		},

		setSingleValue: function (val) {
			var me = this;

			if(me.singleInputDeferr) {
				me.singleInputDeferr.done(function () {
					me.$singleInput.select2('val', val);
				});
			}
		},

		setupSingleVal: function () {
			var me = this;
			me.singleInputDeferr = $.Deferred();

			me.$singleInput = $('<input class="single-input" name="single">').appendTo(this.ui.singleValWrap);

			me.ajaxMCCGroup(function (arr) {
				me.$singleInput.select2({ data: arr, width: 150, placeholder: ' - 选择MCC组 - ' });
				me.$singleInput.on('change', function () {
					me.$singleInput.trigger('keyup');
				});
				me.singleInputDeferr.resolve();
			});
		},

		setupMulVal: function () {
			var me = this;
			me.mulInputDeferr = $.Deferred();
			me.$mulInput = $('<input class="mul-input" name="mul">').appendTo(this.ui.mulValWrap);

			me.ajaxMCCGroup(function (arr) {
				me.$mulInput.select2({ data: arr, multiple: true, width: 200 });
				me.$mulInput.on('change', function () {
					me.$mulInput.trigger('keyup');
				});
				me.mulInputDeferr.resolve();
			});
		},

		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},
		getMulRemark: function () {
			return _.map(this.$mulInput.select2('data'), function (item) {
				return item.text;
			}).join(',');
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.ui.mulValWrap.valid();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});

			this.ui.mulValWrap.validate({
				rules: {
					mul: 'required'
				}
			});
		}
	});
// icon-minus-sign
	var FieldTerminal = AbstarctField.extend({
		label: '终端类型',
		name: 'term_type',
		extraOprs: ['in', 'not_in'],

		setMulValue: function (strVal) {
			this.$mulInput.val(this.model.get('remark'));
		},

		setSingleValue: function (val) {
			this.$singleInput.val(this.model.get('remark'));
		},

		setupSingleVal: function () {
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			CommonUI.terminalSelect(this.$singleInput, {multiple: false});
		},

		setupMulVal: function () {
			this.$mulInput = $('<input name="mul" class="mul-input">').appendTo(this.ui.mulValWrap);
			CommonUI.terminalSelect(this.$mulInput, {multiple: true});
		},

		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},

		getSingleValue: function() {
			return this.$singleInput.select2('data').typeId;
		},

		getMulRemark: function () {
			return _.map(this.$mulInput.select2('data'), function (item) {
				return item.text;
			}).join(',');
		},

		getMulValue: function() {
			return _.map(this.$mulInput.select2('data'), function (item) {
				return item.typeId;
			}).join(',');
		},

		validate: function () {
			if(this.isMulOpr()) {
				return this.ui.mulValWrap.valid();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});

			this.ui.mulValWrap.validate({
				rules: {
					mul: 'required'
				}
			});
		}
	});

	var FieldCardTypeView = AbstarctField.extend({
		label: '卡种类', //         01-借记卡    02-信用卡    03-准贷记卡    04-预付费卡
		name: 'card_type',
		extraOprs: ['in', 'not_in'],
		select2Data: [{id: '01', text: '借记卡'}, {id: '02', text: '信用卡'}, {id: '03', text: '准贷记卡'}, {id: '04', text: '预付费卡'}],
		setMulValue: function (val) {
			this.$mulInput.select2('val', val.split(','));
		},
		setSingleValue: function (val) {
			this.$singleInput.select2('val', val);
		},
		setupSingleVal: function () {
			var me = this;
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			this.$singleInput.select2({ data: this.select2Data, width: 150, placeholder: ' - 选择卡种类 - '});
			me.$singleInput.on('change', function () {
				me.$singleInput.trigger('keyup');
			});
		},
		setupMulVal: function () {
			var me = this;
			this.$mulInput = $('<input name="mul" class="mul-input">').appendTo(this.ui.mulValWrap);
			this.$mulInput.select2({ data: this.select2Data, multiple: true, width: 200});
			me.$mulInput.on('change', function () {
				me.$mulInput.trigger('keyup');
			});
		},
		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},
		getMulRemark: function () {
			return _.map(this.$mulInput.select2('data'), function (item) {
				return item.text;
			}).join(',');
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.ui.mulValWrap.valid();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});

			this.ui.mulValWrap.validate({
				rules: {
					mul: 'required'
				}
			});
		}
	});

	var FieldCardMaterialsView = AbstarctField.extend({
		label: '卡介质', //         1-IC卡        2-磁条卡
		name: 'card_kind',
		extraOprs: ['in', 'not_in'],
		select2Data: [{id: '1', text: 'IC卡'}, {id: '2', text: '磁条卡'}],
		setMulValue: function (val) {
			this.$mulInput.select2('val', val.split(','));
		},
		setSingleValue: function (val) {
			this.$singleInput.select2('val', val);
		},
		setupSingleVal: function () {
			var me = this;
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			this.$singleInput.select2({ data: this.select2Data, width: 150, placeholder: ' - 选择卡介质 - '});
			me.$singleInput.on('change', function () {
				me.$singleInput.trigger('keyup');
			});
		},
		setupMulVal: function () {
			var me = this;
			this.$mulInput = $('<input name="mul" class="mul-input">').appendTo(this.ui.mulValWrap);
			this.$mulInput.select2({ data: this.select2Data, multiple: true, width: 200});
			me.$mulInput.on('change', function () {
				me.$mulInput.trigger('keyup');
			});
		},
		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},
		getMulRemark: function () {
			return _.map(this.$mulInput.select2('data'), function (item) {
				return item.text;
			}).join(',');
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.ui.mulValWrap.valid();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});

			this.ui.mulValWrap.validate({
				rules: {
					mul: 'required'
				}
			});
		}
	});

	var FieldTxnTypeView = AbstarctField.extend({
		label: '交易类型', // 30-查询（IC卡和磁条卡统一送30）    31-消费（IC卡和磁条卡统一送31）    36-预授权（IC卡和磁条卡统一送36）
		name: 'cmd_type',
		extraOprs: ['in', 'not_in'],
		select2Data: [{id: 30, text: '查询'}, {id: 31, text: '消费'}, {id: 36, text: '预授权'}],
		setMulValue: function (val) {
			this.$mulInput.select2('val', val.split(','));
		},
		setSingleValue: function (val) {
			this.$singleInput.select2('val', val);
		},
		setupSingleVal: function () {
			var me = this;
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			this.$singleInput.select2({ data: this.select2Data, width: 150, placeholder: ' - 选择交易类型 - '});
			me.$singleInput.on('change', function () {
				me.$singleInput.trigger('keyup');
			});
		},
		setupMulVal: function () {
			var me = this;
			this.$mulInput = $('<input name="mul" class="mul-input">').appendTo(this.ui.mulValWrap);
			this.$mulInput.select2({ data: this.select2Data, multiple: true, width: 200});
			me.$mulInput.on('change', function () {
				me.$mulInput.trigger('keyup');
			});
		},
		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},
		getMulRemark: function () {
			return _.map(this.$mulInput.select2('data'), function (item) {
				return item.text;
			}).join(',');
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.ui.mulValWrap.valid();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});

			this.ui.mulValWrap.validate({
				rules: {
					mul: 'required'
				}
			});
		}

	});

	var FieldBankView = AbstarctField.extend({
		label: '开户行',
		name: 'card_bank',
		extraOprs: ['in', 'not_in'],
		select2Config: {
			ajax: {
				type: 'GET',
				url: url._('bank.info'),
				dataType: 'json',
				data: function (term) { return { value: encodeURIComponent(term) }; },
				results: function (data) { return { results: data }; }
			},
			id: function (data) { return data.key; },
			formatResult: function(data){ return data.value; },
			formatSelection: function(data){ return data.value; }
		},
		setMulValue: function (val) {
			if(val){
				var keyArr = val.split(','),
					valueArr = this.model.get('remark') ? this.model.get('remark').split(',') : '',
					arr = [];

				for(var i=0; i<keyArr.length; i++) {
					arr.push({
						key: keyArr[i],
						value: valueArr == '' ? '' : valueArr[i]
					});
				}
				this.$mulInput.select2('data', arr);
			}
			else{
				this.$mulInput.select2('data');
			}
		},
		setSingleValue: function (val) {
			var data = {
				key: val,
				value: this.model.get('remark')
			};

			this.$singleInput.select2('data', data);
		},
		setupSingleVal: function () {
			var me = this;
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			this.$singleInput.select2($.extend({width: 150, placeholder: ' - 选择开户行 - '}, this.select2Config));
			me.$singleInput.on('change', function () {
				me.$singleInput.trigger('keyup');
			});
		},
		getSingleRemark: function () {
			var data = this.$singleInput.select2('data');
			return data ? data.value : '';
		},
		setupMulVal: function () {
			var me = this;
			this.$mulInput = $('<input name="mul" class="mul-input">').appendTo(this.ui.mulValWrap);
			this.$mulInput.select2($.extend({multiple: true, width: 200, placeholder: '选择开户行'}, this.select2Config));
			me.$mulInput.on('change', function () {
				me.$mulInput.trigger('keyup');
			});
		},
		getMulRemark: function () {
			var arr = [];
			var data = this.$mulInput.select2('data');

			_.each(data, function (bankInfo) {
				arr.push(bankInfo.value);
			});

			return arr.join(',');
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.ui.mulValWrap.valid();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});

			this.ui.mulValWrap.validate({
				rules: {
					mul: 'required'
				}
			});
		}
	});

	var FieldCardBinView = AbstarctField.extend({
		label: '卡bin',
		name: 'card_no',
		extraOprs: ['in', 'not_in'],
		validateMul: function () {
			this.ui.mulValWrap.find('.has-error').remove();
			if(this.$mulInput.val() !== '') {
				return true;
			} else {
				this.ui.mulValWrap.find('.bootstrap-tagsinput').after('<span class="has-error">此字段必须填写</span>');
				return false;
			}
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.validateMul();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		},

		setupSingleVal: function () {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask("Regex", {
					regex: "[0-9]+"
				})
				.appendTo(this.ui.singleValWrap);
		},

		setupMulVal: function() {
			var me = this;
			AbstarctField.prototype.setupMulVal.apply(this, arguments);
			this.$mulInput.on('itemAdded', function () {
				me.ui.mulValWrap.find('.has-error').remove();
			});
			this.ui.mulValWrap.find('.bootstrap-tagsinput').find('input')
				.inputmask("Regex", {
					regex: "[0-9]+"
				});
		}
	});

	var FieldBrhView = AbstarctField.extend({
		label: '所属机构',
		name: 'brh_no',
		extraOprs: ['in', 'not_in'],
		validateMul: function () {
			this.ui.mulValWrap.find('.has-error').remove();
			if(this.$mulInput.val() !== '') {
				return true;
			} else {
				this.ui.mulValWrap.find('.bootstrap-tagsinput').after('<span class="has-error">此字段必须填写</span>');
				return false;
			}
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.validateMul();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		},

		setupSingleVal: function () {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask("Regex", {
					regex: "[0-9]+"
				})
				.appendTo(this.ui.singleValWrap);
		},

		setupMulVal: function() {
			var me = this;
			AbstarctField.prototype.setupMulVal.apply(this, arguments);
			this.$mulInput.on('itemAdded', function () {
				me.ui.mulValWrap.find('.has-error').remove();
			});
			this.ui.mulValWrap.find('.bootstrap-tagsinput').find('input')
				.inputmask("Regex", {
					regex: "[0-9]+"
				});
		}
	});

	var FieldAccountView = AbstarctField.extend({
		label: '交易金额(元)',
		name: 'amount',
		extraOprs: ['gt', 'lt'],
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask('numeric', {
					autoUnmask: true,
					allowMinus: false,
					allowPlus: false
				}) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldTotalAccountView = FieldAccountView.extend({
		label: '交易容量(亿)',
		name: 'total_amt',
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask('numeric', {
					autoUnmask: true,
					allowMinus: false,
					allowPlus: false
				}) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldBigAccountView = FieldAccountView.extend({
		label: '大额金额',
		name: 'bigAccount',
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask('numeric', {
					autoUnmask: true,
					allowMinus: false,
					allowPlus: false
				}) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldBigAccountCountView = FieldAccountView.extend({
		label: '总笔数',
		name: 'total_num',
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask("Regex", {
					regex: "[0-9]+"
				})
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldAreaNoView = AbstarctField.extend({
		label: '地区码',
		name: 'region_code',
		extraOprs: ['in', 'not_in'],
		setupSingleVal: function () {
			var areaNoView = new AreaNoView({appendTo: this.ui.singleValWrap});
			this.$singleInput = areaNoView.$bindInput;

		},
		getSingleValue: function() {
			return this.$singleInput.data('areaNo') || '';
		},
		getSingleRemark: function () {
			return this.$singleInput.val() || '';
		},
		setSingleValue: function (val) {
			this.$singleInput.val(this.model.get('remark'));
			this.$singleInput.data('areaNo', val);
		},

		setupMulVal: function() {
			var me = this;
			var areaNoView = new AreaNoView({appendTo: this.ui.mulValWrap, editType: 'mul'});

			this.$mulInput = areaNoView.$bindInput;
			this.$mulInput.on('itemAdded', function () {
				me.ui.mulValWrap.find('.has-error').remove();
			});
		},
		getMulRemark: function () {
			var arr = [];
			var data = this.$mulInput.tagsinput('items');

			_.each(data, function (mccInfo) {
				arr.push(mccInfo.text);
			});

			return arr.join(',');
		},
		setMulValue: function (val) {
			var keyArr = val.split(','),
				valueArr = this.model.get('remark') ? this.model.get('remark').split(',') : '';

			for(var i=0; i<keyArr.length; i++) {
				this.$mulInput.tagsinput('add', {
					id: keyArr[i],
					text: valueArr == '' ? '' : valueArr[i]
				});
			}

		},
		validateMul: function () {
			this.ui.mulValWrap.find('.has-error').remove();
			if(this.$mulInput.val() !== '') {
				return true;
			} else {
				this.ui.mulValWrap.find('.bootstrap-tagsinput').after('<span class="has-error">此字段必须填写</span>');
				return false;
			}
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.validateMul();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}

	});

	var FieldTimeView = AbstarctField.extend({
		label: '日可用时间',
		name: 'tx_time',
		extraOprs: ['gt', 'lt'],
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input" placeholder="时:分（24小时）">') //
				.inputmask('hh:mm:ss')//
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		getSingleValue: function() {
			return this.$singleInput.val().split(':').join('');
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldMccView = AbstarctField.extend({
		label: 'MCC',
		name: 'mcc',
		extraOprs: ['in', 'not_in'],
		setupSingleVal: function() {
			var mccView = new MccView({appendTo: this.ui.singleValWrap});
			this.$singleInput = mccView.$bindInput;
		},
		getSingleValue: function() {
			return this.$singleInput.data('mcc') || '';
		},
		getSingleRemark: function () {
			return this.$singleInput.val() || '';
		},
		setSingleValue: function (val) {
			this.$singleInput.val(this.model.get('remark'));
			this.$singleInput.data('mcc', val);
		},

		setupMulVal: function() {
			var me = this;
			var mccView = new MccView({appendTo: this.ui.mulValWrap, editType: 'mul'});

			this.$mulInput = mccView.$bindInput;

			this.$mulInput.on('itemAdded', function () {
				me.ui.mulValWrap.find('.has-error').remove();
			});
		},
		getMulRemark: function () {
			var arr = [];
			var data = this.$mulInput.tagsinput('items');

			_.each(data, function (mccInfo) {
				arr.push(mccInfo.text);
			});

			return arr.join(',');
		},
		setMulValue: function (val) {
			var keyArr = val.split(','),
				valueArr = this.model.get('remark') ? this.model.get('remark').split(',') : '';

			for(var i=0; i<keyArr.length; i++) {
				this.$mulInput.tagsinput('add', {
					id: keyArr[i],
					text: valueArr == '' ? '' : valueArr[i]
				});
			}

		},
		validateMul: function () {
			this.ui.mulValWrap.find('.has-error').remove();
			if(this.$mulInput.val() !== '') {
				return true;
			} else {
				this.ui.mulValWrap.find('.bootstrap-tagsinput').after('<span class="has-error">此字段必须填写</span>');
				return false;
			}
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.validateMul();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldDiscView = AbstarctField.extend({
		label: '结算周期',
		name: 'disc',
		validateMul: function () {
			this.ui.mulValWrap.find('.has-error').remove();
			if(this.$mulInput.val() !== '') {
				return true;
			} else {
				this.ui.mulValWrap.find('.bootstrap-tagsinput').after('<span class="has-error">此字段必须填写</span>');
				return false;
			}
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.validateMul();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		},

		setupMulVal: function() {
			var me = this;
			AbstarctField.prototype.setupMulVal.apply(this, arguments);
			this.$mulInput.on('itemAdded', function () {
				me.ui.mulValWrap.find('.has-error').remove();
			});
		}
	});

	var FieldTermNoView = AbstarctField.extend({
		label: '终端号',
		name: 'term_no',
		extraOprs: ['in', 'not_in'],
		validateMul: function () {
			this.ui.mulValWrap.find('.has-error').remove();
			if(this.$mulInput.val() !== '') {
				return true;
			} else {
				this.ui.mulValWrap.find('.bootstrap-tagsinput').after('<span class="has-error">此字段必须填写</span>');
				return false;
			}
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.validateMul();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		},

		setupMulVal: function() {
			var me = this;
			AbstarctField.prototype.setupMulVal.apply(this, arguments);
			this.$mulInput.on('itemAdded', function () {
				me.ui.mulValWrap.find('.has-error').remove();
			});
		}

	});

	var FieldMchtTypeView = AbstarctField.extend({
		label: '商户类型',
		name: 'mcht_type',
		select2Data: [{id: '0', text: '间连'}, {id: '1', text: '直连'}],
		setSingleValue: function (val) {
			this.$singleInput.select2('val', val);
		},
		setupSingleVal: function () {
			var me = this;
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			this.$singleInput.select2({ data: this.select2Data, width: 150, placeholder: ' - 选择商户类型 - '});
			me.$singleInput.on('change', function () {
				me.$singleInput.trigger('keyup');
			});
		},
		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},
		validate: function () {
			return this.ui.singleValWrap.valid();
		},
		addValidator: function () {
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}


	});

	var FieldFeeTypeView = AbstarctField.extend({
		label: '费率类型',
		name: 'fee_type',
		select2Data: [{id: '1', text: '按比例'}, {id: '2', text: '封顶'}, {id: '3', text: '按笔固定'}],
		setSingleValue: function (val) {
			this.$singleInput.select2('val', val);
		},
		setupSingleVal: function () {
			var me = this;
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			this.$singleInput.select2({ data: this.select2Data, width: 150, placeholder: ' - 选择费率类型 - '});
			me.$singleInput.on('change', function () {
				me.$singleInput.trigger('keyup');
			});
		},
		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},
		validate: function () {
			return this.ui.singleValWrap.valid();
		},
		addValidator: function () {
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldPinTypeView = AbstarctField.extend({
		label: '有密无密',
		name: 'pin_type',
		select2Data: [{id: '1', text: '有密'}, {id: '2', text: '无密'}],
		setSingleValue: function (val) {
			this.$singleInput.select2('val', val);
		},
		setupSingleVal: function () {
			var me = this;
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			this.$singleInput.select2({ data: this.select2Data, width: 150, placeholder: ' - 选择费率类型 - '});
			me.$singleInput.on('change', function () {
				me.$singleInput.trigger('keyup');
			});
		},
		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},
		validate: function () {
			return this.ui.singleValWrap.valid();
		},
		addValidator: function () {
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldCardAmtView = AbstarctField.extend({
		label: '单卡单日总金额',
		name: 'card_amt',
		extraOprs: ['gt', 'lt'],
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask('numeric', {
					autoUnmask: true,
					allowMinus: false,
					allowPlus: false
				}) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldCardNumView = AbstarctField.extend({
		label: '单卡单日总笔数',
		name: 'card_num',
		extraOprs: ['gt', 'lt'],
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input">') //
				.inputmask('numeric', {
					autoUnmask: true,
					allowMinus: false,
					allowPlus: false
				}) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldBamtNumView = AbstarctField.extend({
		label: '大额笔数',
		name: 'bamt_num',
		extraOprs: ['gt', 'lt'],
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input" placeholder="金额和笔数用英文逗号分开">') //
			// .inputmask('numeric', {
			//     autoUnmask: true,
			//     allowMinus: false,
			//     allowPlus: false
			// }) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			this.ui.singleValWrap.validate({
				rules: {
					single: {
						required: true,
						amtAndNum: true
					}
				}
			});
		}
	});

	var FieldLamtNumView = AbstarctField.extend({
		label: '小额笔数',
		name: 'lamt_num',
		extraOprs: ['gt', 'lt'],
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input" placeholder="金额和笔数用英文逗号分开">') //
			// .inputmask('numeric', {
			//     autoUnmask: true,
			//     allowMinus: false,
			//     allowPlus: false
			// }) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			this.ui.singleValWrap.validate({
				rules: {
					single: {
						required: true,
						amtAndNum: true
					}
				}
			});
		}
	});

	var FieldModAmtView = AbstarctField.extend({
		label: '规则总容量(亿)',
		name: 'mod_amt',
		extraOprs: ['gt', 'lt'],
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input">')
				.inputmask('numeric', {
					autoUnmask: true,
					allowMinus: false,
					allowPlus: false
				}) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldModNumView = AbstarctField.extend({
		label: '规则总笔数',
		name: 'mod_num',
		extraOprs: ['gt', 'lt'],
		defaultOprsGt: true,
		setupSingleVal: function() {
			this.$singleInput = $('<input name="single" class="single-input">')
				.inputmask('numeric', {
					autoUnmask: true,
					allowMinus: false,
					allowPlus: false
				}) //
				.appendTo(this.ui.singleValWrap);
		},
		validate: function () {
			if(!this.isMulOpr() && this.ui.singleValWrap.valid()) {
				return true;
			}

			return false;
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});
		}
	});

	var FieldAccountTypeView = AbstarctField.extend({
		label: '账户类型',
		name: 'account_type',
		extraOprs: ['in'],
		select2Data: [{id: '0', text: '对公'}, {id: '1', text: '对私'}],

		setMulValue: function (val) {
			this.$mulInput.select2('val', val.split(','));
		},
		setSingleValue: function (val) {
			this.$singleInput.select2('val', val);
		},
		setupSingleVal: function () {
			var me = this;
			this.$singleInput = $('<input name="single" class="single-input">').appendTo(this.ui.singleValWrap);
			this.$singleInput.select2({ data: this.select2Data, width: 150, placeholder: ' - 选择账户类型 - '});
			me.$singleInput.on('change', function () {
				me.$singleInput.trigger('keyup');
			});
		},
		setupMulVal: function () {
			var me = this;
			this.$mulInput = $('<input name="mul" class="mul-input">').appendTo(this.ui.mulValWrap);
			this.$mulInput.select2({ data: this.select2Data, multiple: true, width: 200});
			me.$mulInput.on('change', function () {
				me.$mulInput.trigger('keyup');
			});
		},
		getSingleRemark: function () {
			return this.$singleInput.select2('data').text;
		},
		getMulRemark: function () {
			return _.map(this.$mulInput.select2('data'), function (item) {
				return item.text;
			}).join(',');
		},
		validate: function () {
			if(this.isMulOpr()) {
				return this.ui.mulValWrap.valid();
			} else {
				return this.ui.singleValWrap.valid();
			}
		},
		addValidator: function () {
			var me = this;
			this.ui.singleValWrap.validate({
				rules: {
					single: 'required'
				}
			});

			this.ui.mulValWrap.validate({
				rules: {
					mul: 'required'
				}
			});
		}
	});

	var fieldMap = [
		{type:'mcht_no',     label:'商户编号',fieldView:FieldMchtNoView},
		{type:'mcc_grp',     label:'MCC组',fieldView:FieldMccGroup},
		{type:'term_type',   label:'终端类型',fieldView:FieldTerminal},
		{type:'card_type',   label:'卡种类',fieldView:FieldCardTypeView},
		{type:'card_kind',   label:'卡介质',fieldView:FieldCardMaterialsView},
		{type:'amount',      label:'交易金额(元)',fieldView:FieldAccountView},
		{type:'cmd_type',    label:'交易类型',fieldView:FieldTxnTypeView},
		{type:'total_amt',   label:'交易容量(亿)',fieldView:FieldTotalAccountView},
		{type:'total_num',   label:'总笔数',fieldView:FieldBigAccountCountView},
		{type:'card_bank',   label:'开户行',fieldView:FieldBankView},
		{type:'card_no',     label:'卡bin',fieldView:FieldCardBinView},
		{type:'brh_no',      label:'所属机构',fieldView:FieldBrhView},
		{type:'mcc',         label:'MCC',fieldView:FieldMccView},
		{type:'region_code', label:'地区码',fieldView:FieldAreaNoView},
		{type:'tx_time',     label:'交易时间(时:分)',fieldView:FieldTimeView},
		{type:'disc',        label:'结算周期',fieldView:FieldDiscView},
		{type:'term_no',     label:'终端号',fieldView:FieldTermNoView},
		{type:'mcht_type',   label:'商户类型',fieldView:FieldMchtTypeView},
		{type:'fee_type',    label:'费率类型',fieldView:FieldFeeTypeView},
		{type:'pin_type',    label:'有密无密',fieldView:FieldPinTypeView},
		{type:'card_amt',    label:'单卡单日总金额',fieldView:FieldCardAmtView},
		{type:'card_num',    label:'单卡单日总笔数',fieldView:FieldCardNumView},
		{type:'bamt_num',    label:'大额笔数',fieldView:FieldBamtNumView},
		{type:'lamt_num',    label:'小额笔数',fieldView:FieldLamtNumView},
		{type:'mod_amt',     label:'规则总容量(亿)',fieldView:FieldModAmtView},
		{type:'mod_num',     label:'规则总笔数',fieldView:FieldModNumView},
		{type:'account_type',label:'账户类型',fieldView:FieldAccountTypeView}
	];

	var View = Marionette.CompositeView.extend({

		className: 'fieldset-group',

		template: fieldsetGroupTpl,

		childViewContainer: '.group-body tbody',

		triggers: {
			'click .btn-remove-fieldset': 'btn:remove:click'
		},

		events: {
			'click .field-type-menu-item': 'onAddFieldClick'
		},

		ui:{
			caption: '.caption',
			fieldTypesDDMenu: '.field-types-dd .dropdown-menu'
		},

		onChildviewBtnRemoveClick: function (childView) {
			this.collection.remove(childView.model);
		},

		// 'fixed-body'

		onAddFieldClick: function (e) {
			var type = $(e.target).data('type');
			this.collection.add({type: type});
		},

		getChildView: function(model) {
			// return fieldViewMap[model.get('type')];
			return _.findWhere(fieldMap, {type: model.get('type')}).fieldView;
		},

		initialize: function() {
			var fieldModels;

			if(this.model) {
				fieldModels = _.map(this.model.get('data'), function (item) {
					return $.extend({}, item, {type: item.factor});
				});
			}

			this.collection = new Backbone.Collection(fieldModels);
		},

		validate: function () {
			var valid = true;
			this.children.each(function (childView) {
				if(childView.validate() === false) {
					valid = false;
				}
			});
			return valid;
		},

		onRender: function() {
			var tmp;
			var menusHtml = fieldTypesDDTpl({
				items: this.getOption('conditions'),
				fieldMap: fieldMap
			});
			this.ui.fieldTypesDDMenu.html(menusHtml);
		},

		getObjValue: function () {
			return this.children.map(function (view) {
				return view.getObjValue();
			});
		},

		templateHelpers: function () {
			return {
				caption: this.calcCaptionText()
			};
		},

		calcCaptionText: function () {
			return '条件组' + (this.model.collection.indexOf(this.model) + 1);
		},

		refreshCaption: function () {
			this.ui.caption.text(this.calcCaptionText());
		}

	});

	return View;
});