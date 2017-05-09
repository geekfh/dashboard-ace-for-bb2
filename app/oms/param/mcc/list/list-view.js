
define(['App',
	'tpl!app/oms/param/mcc/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/param',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang) {

	var GROUP_MAP = {
        '01':paramLang._('mcc.group.01'),//宾馆娱乐类
        '02':paramLang._('mcc.group.02'),//房产批发类
        '03':paramLang._('mcc.group.03'),//超市加油类
        '04':paramLang._('mcc.group.04'),//医院学校类
        '05':paramLang._('mcc.group.05'),//一般商户类
        '06':paramLang._('mcc.group.06'),//新兴行业类
        '07':paramLang._('mcc.group.07') //县乡优惠

    };

	App.module('ParamSysApp.Mcc.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.Mccs = Marionette.ItemView.extend({
            tabId: 'menu.param.mcc',
			template: tableCtTpl,

			events: {

			},

			onRender: function() {
				var me = this;

				setTimeout(function() {

					me.renderGrid();

				}, 1);
			},

			renderGrid: function() {
				var setupValidation = Opf.Validate.setup;
                var addValidateRules = function(form){
                    Opf.Validate.addRules(form, {
                                        rules:{
                                            code:{
                                            	'required':true,
                                             	 number:true
                                            }
                                        }
                    
                    });
                };
				var patch = function(form){
					var $group = [
						'<tr rowpos="2" class="FormData" id="tr_group">',
                            '<td class="CaptionTD">MCC组</td>',
                            '<td class="DataTD">&nbsp;',
                                '<select role="select" id="group" name="group" size="1" class="FormElement ui-widget-content ui-corner-all">',
                                    
                                '</select>',
                            '</td>',
                        '</tr>'
					].join('');

					form.find('#tr_code').after($group);
				};

				var roleGird = App.Factory.createJqGrid({
					rsId: 'mccs',
					caption: paramLang._('mcc.txt'),
					nav: {
						add : {
								beforeShowForm: function (form) {
									patch(form);
                                    ajaxSelect({
                                        el:form.find('[name=group]'),
                                        url:url._('options.mccGroup')
                                    });

                                    addValidateRules(form);
								},
								onclickSubmit:function(params, postdata){
									delete postdata['id'];
									return postdata;
								},
                                beforeSubmit: setupValidation
                            }
					},
					gid: 'mccs-grid',//innerly get corresponding ct '#mccs-grid-table' '#mccs-grid-pager'
					url: url._('mcc'),
					colNames: [
						paramLang._('mcc.id'),
						paramLang._('mcc.code'),
						paramLang._('mcc.group'),
						paramLang._('mcc.descr')
					],

					colModel: [
						{name:    'id', index:    'id', editable: false, hidden: true},
						{name:  'code', index:  'code', search:true,editable: true, editoptions : {minlength : 4, maxlength : 4},
                            _searchType:'string'
                        },
						{name: 'group', index: 'group', search:true,editable: false,
                            _searchType:'string',
                            // formatter:mccGroupFormatter,
                            editoptions: { value: GROUP_MAP }
                        },
						{name: 'descr', index: 'descr', search:false,editable: true}
					],

					loadComplete: function() {}
				});

			}

		});

	});

	function convertToSelectOptionsHtml(data) {
		var arr = [];
		for (var i = 0; i < data.length; i++) {
			arr.push('<option value="' + data[i].value + '">' + data[i].name + '</option>');
		}
		return arr.join('');
	}

	function ajaxSelect(options) {
		var $el = $(options.el);
		$.ajax({
			type: 'GET',
			url: options.url,
			success: function(data) {
				var strHtml = convertToSelectOptionsHtml(data);

				if (options.append === true) {
					$el.append(strHtml);
				} else {
					$el.empty().append(strHtml);
				}
				$el.data('setup', true);
				options.success && options.success.apply(null, arguments);

			}
		});
	}


    function mccGroupFormatter (cellvalue, options, rowObject){
        return GROUP_MAP[cellvalue];
    }

	return App.ParamSysApp.Mcc.List.View;

});