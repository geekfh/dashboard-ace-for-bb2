
define(['App',
    'assets/scripts/fwk/component/uploader',
	'i18n!app/oms/common/nls/param',
	'jquery.jqGrid',
	'bootstrap-datepicker',
    'common-ui'
], function(App, uploader, paramLang) {

	App.module('ParamSysApp.Zbank.List.View', function(View, App, Backbone, Marionette, $, _) {
        var tpl = [
            '<div class="row">',
                '<div class="col-xs-12 jgrid-container">',
                    '<table id="zbank-grid-table"></table>',
                    '<div id="zbank-grid-pager" ></div>',
                '</div>',
            '</div>'
        ].join('');

		View.Zbanks = Marionette.ItemView.extend({
			tabId: 'menu.param.zbank',
			template: _.template(tpl),

			onRender: function() {
				var me = this;
                _.defer(function(){
                    me.renderGrid();
                });
			},

			renderGrid: function() {
				//var setupValidation = Opf.Validate.setup;
				var addValidateRules = function(form) {
					Opf.Validate.addRules(form, {
						rules: {
							no: {
                                required:true,
                                number:true,
                                minlength:7
							},
							name: {
                                required:true
							},
							netpayNo: {
                                required:true
							},
							netpayName: {
                                required:true
							}
						}
					});
				};

                var addEvents = function(type, form){
                    var ajaxOptions = {
                        type: 'GET'
                    };

                    var $No = $("#no", form);
                    var $isModify = $('[name="isModify"]', form);
                    var $modifyZbankArea = $("#tr_modifyZbankArea", form);

                    $No.on('blur', function(){
                        var $zbankArea = $("#zbankArea", form);

                        var callback = function(rst){
                            var zbankArea = rst||[];
                            $zbankArea.text(zbankArea.join(", "));
                        };

                        $(form).validate().element($No)&&Opf.ajax($.extend({
                            url: type=="add"?
                                url._('zbank.parents', {no: $("#no", form).val()}):
                                url._('zbank.parents', {no: $("#id", form).val()}),
                            success: callback
                        }, ajaxOptions));
                    });

                    $isModify.on('click', function(){
                        var self = $(this);
                        var isModify = parseInt(self.val());
                        if(isModify){
                            $modifyZbankArea.show();
                        } else {
                            $modifyZbankArea.hide();
                        }
                    })
                };

                var renderView = function(options){
                    var view = options.view,
                        form = options.form,
                        type = options.type;

                    require(view, function(View){
                        var addView = new View({
                            renderTo: $('table>tbody', form)
                        });
                            addView.render();

                        addEvents(type, form);
                    });
                };

                var submitData = function(postdata, form){
                    var $form = $(form);

                    //postData
                    $.extend(postdata, {
                        isModify: $('[name="isModify"]:checked', form).val(), //是否修改
                        regionCode: $('[name="zbankRegionCode"]', form).val() //地区码
                    });

                    console.log('postData>>>', postdata);

                    //校验表单元素
                    var valid = $form.validate().form();
                    return [valid, ''];
                };

                var roleGrid = App.Factory.createJqGrid({
                    rsId: 'zbank',
                    caption: paramLang._('zbank.txt'),
                    filters: [{
                        caption: '精准搜索',
                        defaultRenderGrid: false,
                        isSearchRequired: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '所属总行',
                                name: 'bankId',
                                type: 'select2',
                                options: {
                                    sopt: ['eq'],
                                    select2Config: {
                                        placeholder: '请选择所属总行',
                                        minimumInputLength: 1,
                                        width: 250,
                                        ajax: {
                                            type: "get",
                                            url: url._('zbank.search'),
                                            dataType: 'json',
                                            data: function (term, page) {
                                                return {
                                                    value: encodeURIComponent(term)
                                                };
                                            },
                                            results: function (data, page) {
                                                return {
                                                    results: data
                                                };
                                            }
                                        },
                                        id: function (e) {
                                            return e.key;
                                        },
                                        formatResult: function(data, container, query, escapeMarkup){
                                            return data.value;
                                        },
                                        formatSelection: function(data, container, escapeMarkup){
                                            return data.value;
                                        }
                                    },
                                    valueFormat: function(select2data){
                                        return select2data.key;
                                    }
                                }
                            },
                            {
                                label: '所属地区',
                                name: 'code',
                                type: 'address'
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }],
                    actionsCol:{del: false},
					nav: {
                        formSize: {
                            width:480,
                            height:520
                        },
						add: {
							beforeShowForm: function(form) {
								addValidateRules(form);
                                renderView({
                                    type: 'add',
                                    view: ['app/oms/param/zbank/add/add-view'],
                                    form: form
                                });
							},
                            beforeSubmit: submitData
						},

						edit: {
							beforeShowForm: function(form) {
								addValidateRules(form);
                                renderView({
                                    type: 'edit',
                                    view: ['app/oms/param/zbank/edit/edit-view'],
                                    form: form
                                });
							},
                            beforeSubmit: submitData
						}
					},
					gid: 'zbank-grid',
					url: url._('zbank'),
					colNames: [
						paramLang._('zbank.id'),
						paramLang._('zbank.no'),
						paramLang._('zbank.name'),
						paramLang._('zbank.netpay.no'),
						paramLang._('zbank.netpay.name'),
						paramLang._('zbank.address')
					],
					colModel: [
						{name:'id', index:'id', editable:false, hidden:true},
						{name:'no', index:'no', search:true, editable: true, _searchType:'string'},
						{name:'name', index:'name', search:true, editable:true, _searchType:'string'},
						{name:'netpayNo', index:'netpayNo', search:false, editable: true},
						{name:'netpayName', index:'netpayName', search:false,editable: true},
                        {name:'resv2', index:'resv2', editable:true, hidden:true}
					],
					loadComplete: function() {}
				});

                //批量导入
                if(Ctx.avail('zbank.import')){
                    generateImportBtn(roleGrid);
                }

			}
		});
	});


    /**
     * 导入
     */
    function generateImportBtn(grid) {
        setTimeout(function () {
            Opf.Grid.navButtonAdd(grid, {
                title: "批量导入支行信息",
                caption: "",
                id: "importZbankObjTarget",
                name: "importZbankObjTarget",
                buttonicon: "icon-upload-alt white",
                position: "last",
                onClickButton: function () {
                    uploader.doImport({
                        uploadTitle: "批量导入支行信息",
                        uploadUrl: url._('zbank.import'),
                        uploadTpl: url._('zbank.download'),
                        uploadParams: [],
                        cbSuccess: function(){
                            grid.trigger("reloadGrid", [{current:true}]);
                        }
                    });
                }
            });
        }, 0);
    }

	return App.ParamSysApp.Zbank.List.View;
});