/**
 * Created by liliu on 2016/10/25.
 */
define([
	'assets/scripts/fwk/component/ajax-select'
], function(AjaxSelect){

	ModuleUI = {
		mccSection: function (mccGroupEl, mccEl, defaultMccGroupVal, defaultMccVal) {
			var $mccGroup = $(mccGroupEl),
				$mccEl = $(mccEl),
				mccArr = [];

			new AjaxSelect($mccGroup, {
				value: defaultMccGroupVal,
				placeholder: '- 选择经营范围 -',
				convertField: {
					name: 'grpBusName',
					value: 'id'
				},
				ajax : {
					url: url._('options.group-mcc')
				},
				onDefaultValue: onGroupChange
			});

			var commonMccSelect = new AjaxSelect($mccEl, {
				value: defaultMccVal,
				convertField: {
					name: 'businessName',
					value: 'id'
				}
			});

			$mccEl.select2({
				placeholder: '- 选择经营范围子类 -',
				formatResult: function(data, container, query, escapeMarkup){
					// console.log('----formatResult----');
					// console.log(data, container, query, escapeMarkup);
					return '[' + data.id + ']' + data.text;
				},
				formatSelection: function(data, container, escapeMarkup){
					// console.log('----formatSelection----');
					// console.log(data, container, escapeMarkup);
					return '[' + data.id + ']' + data.text;
				},
				matcher: function(kw, value, $option) {
					// console.log('---------matcher----------');
					// console.log(arguments);
					var mccCode = $option.attr('value') || '';
					var fullText = mccCode + $.trim(value);

					return fullText.indexOf(kw) >= 0;
				}
			});

			$mccEl.change(onGroupMccChange);

			function onGroupMccChange() {
				var id, mccItem,
					$this = $(this),
					$form = $this.closest('form');

				id = parseInt($this.val());
				mccItem = _.findWhere(mccArr, {id: id})||{};
				$this.attr('data-mcc', mccItem.mcc);

				$form.validate && $form.validate() && $form.validate().element($this);
			}

			$mccGroup.change(onGroupChange);

			function onGroupChange () {
				var mccGroupId = $mccGroup.val();
				// 清空Mcc
				resetMcc();

				if(mccGroupId) {
					commonMccSelect.init();

					$.when(commonMccSelect.fetch({
						url: url._('options.business-mcc', {groupId: mccGroupId})
					})).done(function(data) {
						mccArr = data||[];
						$mccEl.trigger('change');
					});
				}

				//$(mccEl).select2('data', null);
			}

			function resetMcc () {
				$mccEl.html('');
				$mccEl.attr('data-mcc', '');
				$mccEl.select2('data', null);
			}
		},

		/*
		 * jqGrid搜索功能select2（添加select2方法）
		 * form：弹出选择控件
		 * className：选择哪个字段做select2 例如：cupsNo
		 * 使用过的字段名有：cupsNo(渠道名称)，bankId所属银行
		 * */
		searchFormBySelect2: function (form, className){
			var newClass = className=='bankName'?'bankId':className;

			form.find('.ui-widget-content').css('width','400px');

			$.each(form.find('tr'), function(i, v){
				if(i > 1){
					var s = $(form.find('tr')[i]).find('[value="'+className+'"]').attr('selected');
					if(s == 'selected'){
						var tar = form.find('tr')[i];
						$(tar).find('.data').css('width','220px');
						$(tar).find('.data').children().remove();
						$(tar).find('.data').append('<input id="sl_'+newClass+'" class="input-elm">');
						switch(className)
						{
							case 'cupsNo':
								cupsNameBySearch(tar);
								break;
							case 'bankName':
								bankIdBySearch(tar);
								break;
							case 'cancelOrderSGId':
								cancelOrderSGBySearch(tar);
								break;
							case 'cancelOrderQSId':
								cancelOrderQSBySearch(tar);
								break;
							case 'userName':
								userNameBySearch(tar);
								break;
							default:

						}
					}
				}
			});
			form.find('.columns>select').on('change', function (str) {
				if(str.target.value == className){
					var tar = $(str.target).parent().closest('tr');
					tar.find('.data').css('width','220px');
					tar.find('.data').children().remove();
					tar.find('.data').append('<input id="sl_'+newClass+'" class="input-elm">');
					switch(className)
					{
						case 'cupsNo':
							cupsNameBySearch(tar);
							break;
						case 'bankName':
							bankIdBySearch(tar);
							break;
						case 'cancelOrderSGId':
							cancelOrderSGBySearch(tar);
							break;
						case 'cancelOrderQSId':
							cancelOrderQSBySearch(tar);
							break;
						case 'userName':
							userNameBySearch(tar);
							break;
						default:

					}
				}
			});
		}
	};

	function userNameBySearch(str){
		var name = '';
		$(str).find('#sl_userName').select2({
			placeholder: '请输入邀请码',
			minimumInputLength: 1,
			ajax: {
				type: 'GET',
				url: 'api/postedTicket/userInfo/inviteCode',
				dataType: 'json',
				data: function (term) {
					return {
						inviteCode: encodeURIComponent(term)
					};
				},
				results: function (data) {
					return {
						results: data
					};
				}
			},
			id: function (e) {
				return e.userId;
			},
			formatResult: function(data, container, query, escapeMarkup){
				return data.userName;
			},
			formatSelection: function(data, container, escapeMarkup){
				return data.userName;
			},
			formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
			formatInputTooShort: function (input, min) {
				var n = min - input.length;
				return "请输入至少 " + n + "个字符";
			},
			formatSearching: function () {
				return "搜索中...";
			},
			adaptContainerCssClass: function(classname){
				return classname;
			},
			escapeMarkup: function (m) {
				return m;
			}
		});
		return name;
	}

	//搜索对应的select2，因后端没有统一对应哪个key value所以得写两道
	function cupsNameBySearch(str){
		var name = '';
		$(str).find('#sl_cupsNo').select2({
			placeholder: '请选择交易渠道',
			minimumInputLength: 1,
			ajax: {
				type: 'GET',
				url: url._('cups.name'),
				dataType: 'json',
				data: function (term) {
					return {
						kw: encodeURIComponent(term)
					};
				},
				results: function (data) {
					return {
						results: data
					};
				}
			},
			id: function (e) {
				return e.value;
			},
			formatResult: function(data, container, query, escapeMarkup){
				return data.name;
			},
			formatSelection: function(data, container, escapeMarkup){
				name = data.name;
				return data.name;
			},
			formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
			formatInputTooShort: function (input, min) {
				var n = min - input.length;
				return "请输入至少 " + n + "个字符";
			},
			formatSearching: function () {
				return "搜索中...";
			},
			adaptContainerCssClass: function(classname){
				return classname;
			},
			escapeMarkup: function (m) {
				return m;
			}
		});
		return name;
	}

	function bankIdBySearch(str){
		var name = '';
		$(str).find('#sl_bankId').select2({
			placeholder: '请选择所属银行',
			minimumInputLength: 1,
			ajax: {
				type: 'GET',
				url: url._('card-bin.bankName'),
				dataType: 'json',
				data: function (term, page) {
					return {
						bankName: encodeURIComponent(term)
					};
				},
				results: function (data, page) {
					return {
						results: data
					};
				}
			},
			initSelection: function(element, callback){
				var number = $(element).val();
				if(number !== ''){
					return $.ajax({
						type: 'GET',
						url: url._('card-bin.bankName'),
						dataType: 'json',
						data: function (term, page) {
							return {
								bankName: encodeURIComponent(number)
							};
						},
						results: function (data, page) {
							return {
								results: data.bankName
							};
						}
					});
				}
			},
			id: function (e) {
				return e.bankId;
			},
			formatResult: function(data, container, query, escapeMarkup){
				return data.bankName;
			},
			formatSelection: function(data, container, escapeMarkup){
				return data.bankName;
			},
			formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
			formatInputTooShort: function (input, min) {
				var n = min - input.length;
				return "请输入至少 " + n + "个字符";
			},
			formatSearching: function () {
				return "搜索中...";
			},
			adaptContainerCssClass: function(classname){
				return classname;
			},
			escapeMarkup: function (m) {
				return m;
			}
		});

		return name;
	}

	function cancelOrderQSBySearch(str){
		var name = '';
		$(str).find('#sl_cancelOrderQSId').select2({
			placeholder: '搜索清算处理人',
			minimumInputLength: 1,
			width: 150,
			ajax: {
				type: 'GET',
				url: 'api/settle/cancel_order_info/oprName',
				dataType: 'json',
				data: function (term) {
					return {
						kw: encodeURIComponent(term)
					};
				},
				results: function (data) {
					return {
						results: data
					};
				}
			},
			id: function (e) {
				return e.value;
			},
			formatResult: function(data){
				return data.oprName;
			},
			formatSelection: function(data){
				return data.oprName;
			}
		});

		return name;
	}

	function cancelOrderSGBySearch(str){
		var name = '';
		$(str).find('#sl_cancelOrderSGId').select2({
			placeholder: '搜索商管处理人',
			minimumInputLength: 1,
			width: 150,
			ajax: {
				type: 'GET',
				url: 'api/settle/cancel_order_info/oprName',
				dataType: 'json',
				data: function (term) {
					return {
						kw: encodeURIComponent(term)
					};
				},
				results: function (data) {
					return {
						results: data
					};
				}
			},
			id: function (e) {
				return e.value;
			},
			formatResult: function(data){
				return data.oprName;
			},
			formatSelection: function(data){
				return data.oprName;
			}
		});

		return name;
	}

	return ModuleUI;
});