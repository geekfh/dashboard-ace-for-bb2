/**
 * Created by wupeiying on 2015/7/15.
 */
define(['App',
    'tpl!app/oms/disc/profit/table-ct.tpl',
    'i18n!app/oms/common/nls/param',
    'app/oms/disc/profit/profit_dialog_grid',
    'jquery.jqGrid',
    'common-ui',
    'jquery.validate',
    'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang, GridView) {

    var STATUS_MAP = {
        '0':paramLang._('disc.status.0'),
        '1':paramLang._('disc.status.1')
    };

    App.module('ParamSysApp.Profit.List.View', function(View, App, Backbone, Marionette, $, _) {
        View.Profit = Marionette.ItemView.extend({
            tabId: 'menu.profit.service.list',
            template: tableCtTpl,

            onRender: function() {
                var me = this;
                _.defer(function(){
                    me.renderGrid();
                });
            },

            renderGrid: function() {
                var me = this;
                var discGird = App.Factory.createJqGrid({
                    rsId:'system.serviceprofit',
                    caption: '',
                    //注意: 增加时，表单通过模板生成，如果增加或减少字段要去改模版
                    nav: {
                        formSize: {
                            width: Opf.Config._('ui', 'disc.grid.form.width'),
                            height: Opf.Config._('ui', 'disc.grid.form.height')
                        },
                        add: {},
                        edit: decorateEditForm({}),
                        view: {
                            beforeShowForm: function(form){
                                form.find('#trv_branchCode').css('display','none');
                            }
                        },
                        actions: {
                            addfunc: function () {
                                require(['app/oms/disc/profit/add-view'], function (View) {
                                    var view = new View();
                                    view.render();
                                    view.on('add:success', function () {
                                        Opf.Toast.success('操作成功');
                                        $(discGird).trigger("reloadGrid", [{current:true}]);
                                    });
                                });
                            }
                        }
                    },
                    gid: 'profit-grid',
                    url: url._('disc.service.profit'),
                    colNames: {
                        id         : paramLang._('disc.id'),
                        name       : '名称',
                        serviceName: '关联服务',
                        branchCode : '清算机构编号',
                        branchName : '清算机构',
                        status     : paramLang._('disc.status')
                    },

                    colModel: [
                        {name:         'id', index: 'id', editable: false, hidden: true},
                        {name:       'name', index: 'name', search:true, editable: true, _searchType:'string'},
                        {name:       'serviceName', index: 'serviceName', editable: true},
                        {name: 'branchCode', index: 'branchCode', editable: false, hidden: true},
                        {name: 'branchName', index: 'branchName', editable: true},
                        {name:     'status', index: 'status', editable: true, formatter: statusFormatter,
                            edittype:'select',
                            editoptions: {
                                value: STATUS_MAP
                            }
                        }
                    ]
                });
            }

        });

    });

    function statusFormatter(val){
        return STATUS_MAP[val] || '' ;
    }

    function renderAlgosView (discId, form, gridOptions) {
        var view = new GridView({
            renderTo: form,
            gridOptions: gridOptions
        });
        if(discId) {
            Opf.ajax({
                url: url._('disc.service.profit.edit', {id: discId}),
                success: function (resp) {
                    view.render(resp.algos);
                }
            });
        }
        else {
            view.render();
        }

        $(form).find('#tr_branchCode').hide();
        $(form).find('input[name="serviceName"]').css('width','300px');
        $(form).find('input[name="branchName"]').css('width','300px');
        $(form).find('input[name="serviceName"]').attr('readonly','true');
        $(form).find('input[name="branchName"]').attr('readonly','true');

        return view;
    }

    function decorateEditForm (options) {
        var setupValidation = Opf.Validate.algosJqGridSetup;
        var addValidateRules = function(form){
            var rulesMap = {
                'name': {
                    required: true,
                    maxlength: 50
                }
            };
            Opf.Validate.addRules(form, {rules:rulesMap});
        };
        var subView;
        var opt = {
            beforeInitData: function () {
                $(this).jqGrid('setColProp', 'type', {
                    editoptions: {
                        disabled: true
                    }
                });
                $(this).jqGrid('setColProp', 'branchCode', {
                    editoptions: {
                        disabled: true
                    }
                });
            },
            afterShowForm: function (form) {
                var discId = this.p.selrow;
                subView = renderAlgosView(discId, form);
                addValidateRules($(form));
                $('#editcntprofit-grid-table').attr("style","overflow-x:hidden!important;");
            },
            onclickSubmit: function (params, postdata) {
                var algos = subView.getRowDatas();
                postdata.algos = algos;
            },
            beforeSubmit: setupValidation
        };
        return $.extend(opt, options);
    }

    function buildOrgSelectUI ($el, data) {
        $el.parent().width(150);
        $el.css({'height':'100%'});
        $el.select2({
            data: _.map(data, function (item) {return {id: item[1], text: item[1]};}),
            width: 300,
            placeholder: '- 选择适用机构 -'
        });
        $el.closest('tr').data('cached.select2', $el.data('select2'));
    }

    //检测表单是否需要select2，由于新增选择条件的时候会重绘
    function checkNeedSelect2 (form, data) {
        var $form = $(form);
        var $select = $form.find('.columns select');

        //找到所有应该放select2的input，重新加上select2；
        _.each($select, function(item){
            if($(item).find('option:checked').attr('value') == 'branchName'){
                var $dataSel = $(item).closest('tr').find('.data .input-elm');
                buildOrgSelectUI($dataSel, data);
            }
        });

        //找到所有的搜索条件下拉框重新绑定事件
        $select.on('change.addSelect2',function(){
            var me = $(this);
            if(me.find('option:checked').attr('value') == 'branchName'){
                var $dataSel = me.closest('tr').find('.data .input-elm');
                buildOrgSelectUI($dataSel, data);
            }else{
                var $cachedSelect2 = me.closest('tr').data('cached.select2');
                $cachedSelect2 && $cachedSelect2.destroy();
            }
        });

    }

    return App.ParamSysApp.Profit.List.View;

});