define([
    'tpl!app/oms/settle/repair-sum/list/templates/table.tpl',
    'tpl!app/oms/settle/repair-sum/list/templates/dialog.tpl',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.override',
    'jquery.validate',
    'select2'
], function(tableCtTpl, dialogTpl) {

    var APP_TYPE_MAP = {
        '1': '商户调账',
        '2': '机构调账'
    };

    var View = Marionette.ItemView.extend({
        template: tableCtTpl,
        tabId: 'menu.repair.sum',

        events: {

        },

        onRender: function() {
            var me = this;

            _.defer(function() {
                me.queryFilters = '';
                me.renderGrid();
            });
        },

        gridOptions: function(defaultOptions) {
            return defaultOptions;
        },


        ajaxRequest: function (options) {
            var me = this;
            return Opf.ajax({
                url: options.url,
                type: 'POST',
                jsonData: options.postData,
                success: function (resp) {
                    options.callback && options.callback(resp);
                },
                complete: function () {
                    me.grid.trigger('reloadGrid');
                }
            });
        },

        repairAdd: function (model, options) {
            var postData = {
                appId: model.appId,
                appType: model.appType,
                amt: options.amt,
                oprDesc: options.oprDesc
            };

            this.ajaxRequest({
                url: url._('repair.sum.add'),
                postData: postData
            });

        },

        repairReduce: function (model, options) {
            var postData = {
                appId: model.appId,
                appType: model.appType,
                amt: options.amt,
                oprDesc: options.oprDesc
            };

            this.ajaxRequest({
                url: url._('repair.sum.reduce'),
                postData: postData
            });

        },

        repairThaw: function (model, options) {
            var postData = {
                appId: model.appId,
                appType: model.appType,
                amt: options.amt,
                oprDesc: options.oprDesc
            };

            this.ajaxRequest({
                url: url._('repair.sum.thaw'),
                postData: postData
            });


        },

        repairStopThaw: function (model, options) {
            var postData = {
                appId: model.appId,
                appType: model.appType,
                oprDesc: options.oprDesc
            };

            this.ajaxRequest({
                url: url._('repair.sum.stopThaw'),
                postData: postData
            });
        },

        showDialog: function (callback, isNeedAmt) {
            var $el = $(dialogTpl({needAmt: isNeedAmt}));

            var $dialog = Opf.Factory.createDialog($el, {
                destroyOnClose: true,
                title: '',
                autoOpen: true,
                width: 300,
                height: 250,
                modal: true,
                buttons: [{
                    type: 'submit',
                    text: '保存',
                    click: function () {
                        if (!$dialog.find('form').valid()) {
                            return;
                        }

                        var formValues = getFormValues($dialog.find('form'));
                        callback && callback(formValues);
                        $dialog.dialog('destroy');
                    }
                },{
                    type: 'cancel'
                }],
                create: function () {
                    var $form = $(this).find('form');

                        $form.validate({
                            rules: {
                                amt: {
                                    required: true,
                                    floatGtZero: true,
                                    'float': true
                                },
                                oprDesc: {
                                    required: true,
                                    byteRangeLength: [1, 256]
                                }
                            },
                            messages: {
                              
                            }
                        });

                }
            });
        },

        attachValidation: function() {
            return {
                setupValidation: Opf.Validate.setup,
                addValidateRules: function(form) {
                    Opf.Validate.addRules(form, {
                        rules:{
                            appId:{
                                required: true
                            },
                            repairMin: {
                                required: true,
                                integer: true,
                                intGteZero: true
                            }
                        }
                    });
                }
            };
            
        },

        renderGrid: function() {
            var me = this;

            var validation = this.attachValidation();

            var roleGird = me.grid = App.Factory.createJqGrid(me.gridOptions({
                rsId:'repair.sum',
                caption: '调账汇总',

                download: {
                    url: url._('repair.sum.download'),
                    //必须返回对象
                    params: function () {
                        return {filters: me.queryFilters};
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '调账明细';
                        }
                    }
                },
                
                actionsCol: {
                    width: 150,
                    edit : true,
                    del: false,
                    extraButtons: [
                        {name: 'addUp', caption: '增调', title:'增调', icon: '', click: function(name, obj, model) {
                            me.showDialog(function (data) {
                                me.repairAdd(model, data);
                            }, true);
                        }},
                        {name: 'reduce', caption: '减调', title:'减调', icon: '', click: function(name, obj, model) {
                            me.showDialog(function (data) {
                                me.repairReduce(model, data);
                            }, true);
                        }},
                        {name: 'thaw', caption: '解冻', title:'解冻', icon: '', click: function(name, obj, model) {
                            me.showDialog(function (data) {
                                me.repairThaw(model, data);
                            }, true);
                        }},
                        {name: 'stopThaw', caption: '停止解冻', title:'停止解冻', icon: '', click: function(name, obj, model) {
                            me.showDialog(function (data) {
                                me.repairStopThaw(model, data);
                            }, false);
                        }}
                    ],
                    canButtonRender: function(name, opts, rowData) {
                        // 判断有无申请解冻资金，如果有，则不能进行该操作
                        if(name === 'addUp' && rowData.prefreezeSum > 0) {
                            return false;
                        }

                        // 判断有无未截留总金额，无则不能进行操作，有则可以
                        if(name === 'reduce' && rowData.unRepairAmt <= 0) {
                            return false;
                        }

                        // 判断未截留总金额是否为0，如果为0则可以进行解冻操作，并且解冻金额不能大于剩余可解冻金额，如不为0，则不允许解冻操作
                        if(name === 'thaw' && rowData.unRepairAmt > 0) {
                            return false;
                        }

                        // 停止解冻前，先判断有无申请解冻资金，如有 则可以操作，无则不能操作                        
                        if(name === 'stopThaw' && rowData.prefreezeSum <= 0) {
                            return false;
                        }
                    }
                },
                nav: {
                    actions: {
                        viewfunc: function(id) {
                            require(['app/oms/settle/repair-detail/list/list-view'], function () {
                                var rowData = me.grid._getRecordByRowId(id);
                                App.trigger('repairDetail:list', rowData);
                            });
                        }
                        // add: false
                    },
                    add : {
                        beforeShowForm: function(form) {
                            validation.addValidateRules(form);
                            setupRepairInfo(me,form);
                            
                        },
                        beforeSubmit: validation.setupValidation

                    },
                    edit: {
                        beforeShowForm: function(form) {
                            validation.addValidateRules(form);
                            form.find("#tr_appType").hide();
                            form.find("#tr_appId").hide();
                        },
                        beforeSubmit: validation.setupValidation
                    }
                },
                gid: 'repair-sum-grid',
                url: url._('repair.sum'),

                colNames: {
                    id: 'id',
                    appType: '调账标示', //   1 ：商户调帐 2 ：机构调帐
                    appId: '商户/机构号',
                    mchtOrBrhName: '商户/机构名',
                    repairAmt: '截留总金额',
                    repairMin: '最小截留金额', //新增最小截留金额
                    repairedAmt: '已截留总金额',
                    unRepairAmt: '未截留总金额',
                    surpUnfreeze: '剩余可解冻金额',
                    auditUnfreeze: '审核中解冻金额',
                    unfreezeSum: '已解冻金额',
                    prefreezeSum: '待解冻金额',
                    recUpdTs: '记录修改时间',
                    recCrtTs: '记录创建时间'
                },

                responsiveOptions: {
                    hidden: {
                        ss: [],
                        xs: [],
                        sm: [],
                        md: [],
                        ld: []
                    }
                },

                colModel: [
                    {name: 'id', editable: false, hidden: true},  //ID
                    {name: 'appType', formatter: appTypeFormatter, editable: true, search: true,
                        edittype:'select',
                        editoptions: {
                            value: APP_TYPE_MAP
                        },
                        stype: 'select',
                        searchoptions: {
                            value: APP_TYPE_MAP,
                            sopt: ['eq','ne']
                        }
                    },   //调账标示, //   1 ：商户调帐 2 ：机构调帐
                    {name: 'appId', editable: true, search: true, _searchType:'string',searchoptions : {sopt : [ 'eq']}},   //商户或机构编号,
                    {name: 'mchtOrBrhName', formatter: mchtOrBrhNameFormatter},
                    {name: 'repairAmt'},   //截留总金额,
                    {name: 'repairMin', editable: true, edittype:'text'},   //最小截留金额
                    {name: 'repairedAmt'},   //已截留总金额,
                    {name: 'unRepairAmt'},   //未截留总金额,
                    {name: 'surpUnfreeze'},   //剩余可解冻金额,
                    {name: 'auditUnfreeze'},   //审核中解冻金额,
                    {name: 'unfreezeSum'},   //已解冻金额,
                    {name: 'prefreezeSum'},   //申请解冻金额,
                    {name: 'recUpdTs', formatter: timeFormatter},   //记录修改时间,
                    {name: 'recCrtTs', formatter: timeFormatter}   //记录创建时间
                   
                ],

                loadComplete: function() {
                    var postData = $(me.grid).jqGrid('getGridParam', 'postData') || {};
                    me.queryFilters = postData.filters;
                }
            }));


        }

    });


    function appTypeFormatter(val) {
        return APP_TYPE_MAP[val] || '';
    }

    function timeFormatter (val) {
        var value = val || '';
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
    }

    function mchtOrBrhNameFormatter (val, obj, rowData) {
        return rowData.mchtName || rowData.brhName || '';
    }

    function setupRepairInfo(me,form){
        var $select = $(form).find('select[name="appType"]');
        var $keyNo = me.$keyNo = $(form).find('[name=appId]');

        $select.on('change', function(){
            if($keyNo.data('select2')) {
                $keyNo.select2('data', null);
            }
        });


        $select.trigger('change');
        addOprIdSelect2($keyNo, $select);
        
    }

    function addOprIdSelect2 (select, $appType) {
        var $select = $(select);

        $select.select2({
            placeholder: '请输入商户/机构号',
            minimumInputLength: 1,
            width: '76%',
            ajax: {
                type: 'get',
                url: url._('repair.sum.search'),
                dataType: 'json',
                data: function (term) {
                    return {
                        type: $appType.val(),
                        kw: encodeURIComponent(term)
                    };
                },
                results: function (data) {
                    _.each(data, function(infos) {
                        infos.name = infos.value + '<br>(' + infos.name + ')';

                    });

                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data){
                return data.name;
            },
            formatSelection: function(data){
                return data.name;
            }

        });

        $select.on('change', function () {
            $select.closest('form').valid();
        });
    }

    function getFormValues ($form) {
        var formData = {};

        $form.find(':input').each(function () {
            formData[$(this).attr('name')] = $(this).val();
        });

        return formData;
    }


    App.on('repairSum:list', function () {
        App.show(new View());
    });


    return View;

});