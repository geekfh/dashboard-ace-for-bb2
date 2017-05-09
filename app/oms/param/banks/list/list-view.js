define(['App',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App) {
	App.module('ParamSysApp.banks.List.View', function(View) {
        var IS_SUPPORT_IN_MAP =
            IS_SUPPORT_OUT_MAP =
            NO_CARD_SUPPORT_OUT_MAP =
            IS_SUPPORT_DT_MAP = {
                "1": "支持",
                "0": "不支持"
            };

        var IS_SUPPORT_IN_VALUE =
            IS_SUPPORT_OUT_VALUE =
            NO_CARD_SUPPORT_OUT_VALUE =
            IS_SUPPORT_DT_VALUE = {value:"1:支持;0:不支持"};

        var tpl = [
            '<div class="row">',
                '<div class="col-xs-12 jgrid-container">',
                    '<table id="banks-grid-table"></table>',
                    '<div id="banks-grid-pager" ></div>',
                '</div>',
            '</div>'
        ].join('');

		View.banks = Marionette.ItemView.extend({
			tabId: 'menu.param.banks',
			template: _.template(tpl),

			onRender: function() {
				var me = this;
                _.defer(function(){
                    me.renderGrid();
                });
			},

			renderGrid: function() {
                var me = this;

				var setupValidation = Opf.Validate.setup;
				var addValidateRules = function(form) {
					Opf.Validate.addRules(form, {
						rules: {
                            code: {'required':true},
							name: {'required':true},
                            isSupportIn: {'required':true},
                            isSupportOut: {'required':true}
						}
					});
				};

				me.grid = App.Factory.createJqGrid({
                    caption: "总行信息",
					rsId: 'banks',
                    gid: 'banks-grid',
                    url: url._('banks'),
                    filters: [{defaultRenderGrid:false}],
                    actionsCol:{del: false},
					nav: {
                        formSize: {
                            height: 480
                        },
						add: {
							beforeShowForm: function(form) {
								addValidateRules(form);
							},
							beforeSubmit: setupValidation
						},

						edit: {
							beforeShowForm: function(form) {
								addValidateRules(form);
							},
							beforeSubmit: setupValidation
						}
					},
					colNames: {
                        id:	"id",
                        code: "银行行号",
                        name: "银行行名",
                        nameAbbr: "银行简称",
                        isSupportIn: "是否支持转入行",
                        isSupportOut: "是否支持转出行",
                        sortFlg: "排序标识",
                        marketActivitySort: "市场活动银行排序",
                        noCardSupportOut: "无卡支付签约银行支持标志",
                        resv1: "是否支持地推" //保留域1
                    },
					colModel: [
						{name:'id', index:'id', hidden:true},
						{name:'code', index:'code', editable:true,
                            search:true, _searchType:'string'
                        },
						{name:'name', index:'name', editable:true,
                            search:true, _searchType:'string'
                        },
						{name:'nameAbbr', index:'nameAbbr', editable:true},
						{name:'isSupportIn', index:'isSupportIn',
                            editable:true, edittype:'select', editoptions:IS_SUPPORT_IN_VALUE,
                            formatter:function(value){return IS_SUPPORT_IN_MAP[value]||"";}
                        },
						{name:'isSupportOut', index:'isSupportOut',
                            editable:true, edittype:'select', editoptions:IS_SUPPORT_OUT_VALUE,
                            formatter:function(value){return IS_SUPPORT_OUT_MAP[value]||"";}
                        },
						{name:'sortFlg', index:'sortFlg', editable:true},
						{name:'marketActivitySort', index:'marketActivitySort', editable:true},
						{name:'noCardSupportOut', index:'noCardSupportOut',
                            editable:true, edittype:'select', editoptions:NO_CARD_SUPPORT_OUT_VALUE,
                            formatter:function(value){return NO_CARD_SUPPORT_OUT_MAP[value]||"";}
                        },
						{name:'resv1', index:'resv1',
                            editable:true, edittype:'select', editoptions:IS_SUPPORT_DT_VALUE,
                            formatter:function(value){return IS_SUPPORT_DT_MAP[value]||"";}
                        }
					],
					loadComplete: function() {}
				});
			}
		});
	});

	return App.ParamSysApp.banks.List.View;
});