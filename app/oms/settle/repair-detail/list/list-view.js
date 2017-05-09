define([
    'tpl!app/oms/settle/repair-detail/list/templates/table.tpl',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.override',
    'jquery.validate'
], function(tableCtTpl) {

    var OPR_TYPE_MAP = {
        '1': '增调',
        '2': '减调',
        '3': '截留',
        '9': '解冻申请',
        '8': '解冻停止',
        '0': '已解冻'
    };


    var APP_TYPE_MAP = {
        '1': '商户调账',
        '2': '机构调账'
    };


    var View = Marionette.ItemView.extend({
        template: tableCtTpl,
        tabId: 'menu.repair.detail',

        events: {

        },

        initialize: function (obj) {
            if (obj.appType && obj.appId) {
                this.filtersOption = {
                    appType: obj.appType,
                    appId: obj.appId
                };
            }
        },

        onRender: function() {
            var me = this;

            _.defer(function() {
                me.queryFilters = '';
                me.renderGrid();

                var postData = me.grid.jqGrid('getGridParam', 'postData');
                postData.filters = me.getYesterdayParams();

                me.grid.jqGrid('setGridParam', { postData: postData, datatype: 'json' });
                me.grid.trigger("reloadGrid", [{page:1}]);
          
            });
        },

        getYesterdayParams: function () {
            var me = this;
            var filters = null;
            if(me.options.createTime != undefined){
                filters = {
                    "groupOp":"AND",
                    "rules":[
                        {"field":"createTime","op":"lk","data": ""+me.options.createTime+""}
                    ]};
            }
            else if (!me.filtersOption) {
                return null;
            }
            else{
                filters = {
                    "groupOp": "AND",
                     rules: [
                        {field: "appId", op: "eq", data: ""+me.filtersOption.appId+""},
                        {field: "appType", op: "eq", data: ""+me.filtersOption.appType+""}
                     ]
                };
            }
            return JSON.stringify(filters);
        },


        gridOptions: function(defaultOptions) {
            return defaultOptions;
        },


        renderGrid: function() {
            var me = this;
            var roleGird = me.grid = App.Factory.createJqGrid(me.gridOptions({
                rsId:'repair.detail',
                caption: '调账明细',
                download: {
                    url: url._('repair.detail.download'),
                    //必须返回对象
                    params: function () {
                        var postData = me.grid.jqGrid('getGridParam', 'postData');
                        return {filters: postData.filters};
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '调账明细';
                        }
                    }
                },
                actionsCol: {
                    width: 150,
                    edit : false,
                    del: false,
                    extraButtons: [
                        {name: 'updateRepairExp', caption: '', title:'设置截留有效期', icon: 'icon-calendar', click: function(name, opts, rowData) {
                            showRepairExpDialog(me, rowData);
                        }}
                    ],
                    canButtonRender: function(name, opts, rowData) {
                        if(name === 'updateRepairExp' && rowData.oprType !== '3') {
                            return false;
                        }
                        return true;
                    }
                },
                nav: {
                    actions: {
                        add: false
                    }
                },
                datatype: 'local',
                gid: 'repair-detail-grid',
                url: url._('repair.detail'),
                //postData: {filters: JSON.stringify(filters)},
                colNames: {
                    id: 'id',
                    createTime: '创建时间',
                    appId: '商户/机构号',
                    appType: '调账标示',
                    mchtOrBrhName: '商户/机构名',
                    oprType: '调账类型',
                    oprAmt: '调账金额',
                    oprName: '调账人员',
                    oprId: '调账人员Id（页面不需要显示）',
                    oprDesc: '调账描述',
                    updateTime: '更新时间',
                    repairExp: '截留有效期'
    
                },

                colModel: [
                    {name: 'id', editable: false, hidden: true},  //ID
                    {name: 'createTime', formatter: timeFormatter,
                        search: true, _searchType: 'date',
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true, format: 'yyyymmdd'});
                            }
                        }
                    },
                    {name: 'appId', search: true},
                    {name: 'appType', formatter: appTypeFormatter, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: APP_TYPE_MAP,
                            sopt: ['eq','ne']
                        }
                    },   //调账标示, //   1 ：商户调帐 2 ：机构调帐
                    {name: 'mchtOrBrhName', formatter: mchtOrBrhNameFormatter},
                    {name: 'oprType', search: true, formatter: oprTypeFormatter,
                        stype: 'select',
                        searchoptions: {
                            value: OPR_TYPE_MAP,
                            sopt: ['eq','ne']
                        }
                    },
                    {name: 'oprAmt'},
                    {name: 'oprName'},
                    {name: 'oprId', hidden: true, viewable: false},
                    {name: 'oprDesc'},
                    {name: 'updateTime', formatter: timeFormatter},
                    {name: 'repairExp',
                        search: true, _searchType: 'date',
                        searchoptions: {
                            dataInit: function (elem) {
                                $(elem).datepicker({autoclose: true, format: 'yyyymmdd'});
                            }
                        }
                    }
                   
                ],

                loadComplete: function() {
                    //var postData = $(me.grid).jqGrid('getGridParam', 'postData') || {};
                    //me.queryFilters = postData.filters;
                }
            }));


        }

    });


    function timeFormatter (val) {
        var value = val || '';
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
    }

    function oprTypeFormatter (val) {
        return OPR_TYPE_MAP[val] || '';
    }

    function appTypeFormatter(val) {
        return APP_TYPE_MAP[val] || '';
    }

    function mchtOrBrhNameFormatter (val, obj, rowData) {
        return rowData.mchtName || rowData.brhName || '';
    }

    function showRepairExpDialog(me, rowData) {
        var tpl = [
            '<form onsubmit="return false;" style="padding-top:12px;">',
            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
            '<tbody>',
            '<tr class="FormData">',
            '<td class="CaptionTD" style="padding-right:10px;">请设定资金截留到期时间:</td>',
            '<td class="DataTD">',
            '&nbsp;',
            '<input type="text" readonly name="repairExp">',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>',
            '</form>',
        ].join('');

        var rules = {
            repairExp: { required:true, date:true }
        };

        var $dialogForm = $(tpl);

        var $dialog = Opf.Factory.createDialog($dialogForm, {
            destroyOnClose: true,
            title: '设置截留有效期',
            autoOpen: true,
            width: 400,
            height: 250,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function() {
                    var $repairExp = $(this).find('input[name="repairExpDatePicker"]');
                    var isValid = $dialogForm.validate().form();

                    if(isValid){
                        //提交审核信息
                        var ajaxOptions = {
                            url: url._('repair.detail.updateRepairExp', {id: rowData.id}),
                            type: 'PUT',
                            contentType: "application/json",
                            jsonData: Opf.Util.getFormData($dialogForm),
                            success: function(resp) {
                                result = resp.success;
                                console.log("result=============" + result);
                                if(result){
                                    $dialog.trigger('dialogclose');
                                    me.grid.trigger("reloadGrid", [{current: true}]);
                                    Opf.Toast.success(resp.msg ? resp.msg : '设置成功');
                                }
                                else{
                                    $dialog.trigger('dialogclose');
                                    me.grid.trigger("reloadGrid", [{current: true}]);
                                    Opf.Toast.success(resp.msg ? resp.msg : '设置失败!');
                                }
                            }
                        };
                        Opf.ajax(ajaxOptions);
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function() {
                _.defer(function(){
                    $dialog.find('input[name="repairExp"]').blur();
                    $dialog.find('button[type="cancel"]').focus();

                    $dialog.find('input[name="repairExp"]').datepicker({
                        autoclose: true,
                        format: 'yyyymmdd',
                        startDate: '+1d'
                    });

                    var $form = $dialog.find('form');
                });

            }

        });

        Opf.Validate.addRules($dialogForm, {rules: rules});
    }

    function repairExpFromTpl() {
        var str = [
            '<form onsubmit="return false;" style="padding-top:12px;">',
            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
            '<tbody>',
            '<tr class="FormData">',
            '<td class="CaptionTD" style="padding-right:10px;">请设定资金截留到期时间:</td>',
            '<td class="DataTD">',
            '&nbsp;',
            '<input type="text" readonly name="repairExp">',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>',
            '</form>',
        ].join('');

        return str;
    }

    App.on('repairDetail:list', function (rowData) {
        App.show(new View(rowData));
    });


    return View;

});