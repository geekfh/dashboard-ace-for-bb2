define(['App',
    'tpl!app/oms/message/push-sm/list/templates/pushSM.tpl',
    'i18n!app/oms/common/nls/push-sm',
    'app/oms/message/push-sm/list/perform-view',
    'app/oms/message/push-sm/collection/pageableCollection',
    'app/oms/message/common/timeSelect',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.override'
], function(App, Tpl, pushSMLang, PerformView, PageableCollection,TimeSelectView) {

    var APPTYPE_MAP = {
            "0": "所有钱盒商户通用户",
            "1": "部分钱盒商户通用户",
            "2": "所有开通宝用户用户",
            "3": "部分开通宝用户用户",
            "4": "所有个人端用户用户",
            "5": "部分个人端用户用户"
        },

        DEVICETYPE_MAP = {
            "0": "所有用户",
            "1": "Android用户",
            "2": "ios用户",
            "3": "自定义",
            "4": "导入"
        },

        PUSHTYPE_MAP = {
            "1": "立即发送",
            "2": "定时发送"
        },

        STATUS_OPERATION_MAP = {
            // 1-待审核 2-等待发送 3-正在发送 4-已拒绝 5-已发送 6-已取消 7-已撤销
            "1": "perform:undo:edit",
            "2": "cancel",
            "3": "cancel",
            "4": "",
            "5": "",
            "6": "resendAll",
            "7": "edit"

        },

        STATUS_MAP = {
            // 0-待审核 1-等待发送 2-正在发送 3-已拒绝 4-已发送 5-已取消
            "1": "待审核",
            "2": "等待发送",
            "3": "正在发送",
            "4": "已拒绝",
            "5": "已发送",
            "6": "已取消",
            "7": "已撤消"
        },

        SEND_RESULT = {
            "1" : "成功",
            "0" : "失败"
        },

        DEFAULT_SEARCH_FILTERS = {
            groupOp:"AND",
            rules: [
                {field: 'startDate', op: 'ge', data: ''},
                {field: 'endDate', op: 'le', data: ''}
            ]
        },

        validator;
    
    App.module('PushApp.PushSMSApp.List.View', function(View, App, Backbone, Marionette, $, _) {
        View.Record = Marionette.ItemView.extend({
            tabId: 'menu.sm.push.list',
            template: Tpl,
            events: {

            },

            onRender: function() {
                var me = this;

                setTimeout(function() {
                    me.grid = me.renderGrid();
                }, 0);
            },

            renderGrid: function() {
                var me = this;
                var grid = App.Factory.createJqGrid({
                    rsId:'push.record',
                    caption: pushSMLang._('push.sm.txt'),
                    actionsCol: {
                        width: 85,
                        // edit: false,
                        del : false,
                        // view : false,
                        canButtonRender: function(name, options, rowData){
                            // 1-待审核 2-等待发送 3-正在发送 4-已拒绝 5-已发送 6-已取消 7-已撤销
                            var status = rowData.status;

                            return !!~STATUS_OPERATION_MAP[status].indexOf(name) || 
                                    (name === "resendFail" && rowData.failNum != '0'); //已发送，但有发送失败的情况

                        },

                        extraButtons: [
                            {name: 'perform', title:'审核', icon: 'icon-opf-param-config green', click: function(name, obj, rowData) {
                                me.triggerMethod('show:perform', rowData);
                            }},
                            {name: 'cancel', icon:'icon-opf-times-circle red', title: '取消',
                            click: function (name, opts, rowData) {
                                me.triggerMethod('show:cancel', rowData);
                            }},
                            {name: 'undo', icon:'icon-opf-rotate-left orange', title: '撤销',
                            click: function (name, opts, rowData) {
                                me.triggerMethod('show:undo', rowData);
                            }},
                            // {name: 'edit', icon:'ui-icon ui-icon-pencil', title: '编辑',
                            // click: function (name, opts, rowData) {
                            //     me.triggerMethod('add:edit:sm', rowData);
                            // }},
                            {name: 'resendFail', icon:'', caption:'重发失败', title: '重发失败短信',
                            click: function (name, opts, rowData) {
                                me.triggerMethod('resend:fail:sm', rowData);
                            }},
                            {name: 'resendAll', icon:'', caption:'重新发送', title: '重新发送',
                            click: function (name, opts, rowData) {
                                me.triggerMethod('resend:sm', rowData);
                            }}
                        ]
                    },
                    nav: {

                        actions: {

                            addfunc: function(){
                                me.triggerMethod('add:edit:sm');
                            },
                            editfunc: function(id){
                                me.triggerMethod('add:edit:sm', id);
                            }
                        },
                        search:{
                            // 以下实现了默认查询条件，查看demo http://www.trirand.com/blog/jqgrid/jqgrid.html ---> Search Templates
                            tmplNames: ["customDefaultSearch"],
                            tmplFilters: [DEFAULT_SEARCH_FILTERS],
                            tmplLabel: "",
                            beforeShowSearch: function(form){
                                // 查看 jquery.jqgrid.js 中的 showFilter 函数，发现：
                                // form 参数在 beforeShowSearch 第一次执行时有值，之后执行都为空数组
                                if (form.length) {
                                    me.form = form;
                                }
                                //选中定制的搜索模板并触发change事件
                                $(me.form).parent().find('select.ui-template').val("0").trigger('change').hide();

                                return true;
                            },

                            afterRedraw: function(){
                                addTimeSelectEl(this);
                            }
                        },

                        view: {
                            beforeShowForm: function(form){
                                $(form).find('.planSendNum').remove();
                            }
                        }

                    },
                    gid: 'sm-record',
                    url: url._('push.sm.record'),
                    colNames: {
                        id               : 'id',
                        appType: pushSMLang._('push.sm.app.type'),
                        deviceType: pushSMLang._('push.sm.device.type'),
                        smCategory: pushSMLang._('push.sm.category'),
                        content: pushSMLang._('push.sm.content'),
                        sendTime: pushSMLang._('push.sm.sendTime'),
                        pushType: pushSMLang._('push.sm.pushType'),
                        planSendNum: pushSMLang._('push.sm.planSendNum'),
                        failNum: pushSMLang._('push.sm.failNum'),
                        status: pushSMLang._('push.sm.status'),
                        startDate: pushSMLang._('push.sm.startDate'),//'起始日期',
                        endDate: pushSMLang._('push.sm.endDate')//'结束日期',
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
                        {name: 'id',             index: 'id', hidden:true}, // id
                        {name: 'appType', index: 'appType', editable: true, edittype: 'select', editoptions: {value: APPTYPE_MAP}, formatter: appTypeFormatter, hidden:true},
                        {name: 'deviceType', index: 'deviceType', editable: true, edittype: 'select', editoptions:{value: DEVICETYPE_MAP}, formatter: deviceTypeFormatter,hidden:true},
                        {name: 'smCategory', index: 'smCategory', editable: true, edittype: 'select', editoptions: {value: {}}},
                        {name: 'content', index: 'content', editable: true, edittype: "textarea", formatter: contentFormatter},
                        {name: 'sendTime', index: 'sendTime', formatter:sendTimeFormatter},
                        {name: 'pushType', index: 'pushType', search:true, stype:"select", searchoptions: {
                            value: PUSHTYPE_MAP,
                            sopt: ['eq', 'ne']
                        }, editable: true, edittype: 'select', formatter:pushTypeFormatter ,editoptions: {value: PUSHTYPE_MAP}},
                        {name: 'planSendNum', index: 'planSendNum', formatter: planSendNumFormatter},
                        {name: 'failNum', index: 'failNum'},
                        {name: 'status', index: 'status', search:true, stype:"select", searchoptions: {
                            value: STATUS_MAP,
                            sopt: ['eq', 'ne']
                        }, formatter: statusFormatter},
                        {name:'startDate', index: 'startDate', hidden: true, editable: false, viewable: false, search: true,
                            searchoptions: {
                                sopt: ['ge']
                            }
                        },
                        {name:'endDate', index: 'endDate', hidden: true, editable: false, viewable: false, search: true,
                            searchoptions: {
                                sopt: ['le']
                            }
                        }
                        
                    ],

                    onCellSelect: function(rowid, iCol, cellcontent, e){
                        var id = grid.getRowData(rowid).id;
                        if($(e.target).hasClass('planSendNum')){
                            me.triggerMethod('plan:send:num', id);
                        }

                    }
                });


                return grid;
            },

            onShowPerform: function (data) {
                var me = this,
                    model = new Backbone.Model(data),
                    view = new PerformView({model: model});

                var $dialog = Opf.Factory.createDialog(view.$el, {
                    destroyOnClose: true,
                    title: '审核页面',
                    autoOpen: true,
                    width: 500,
                    height: 550,
                    modal: true
                });

                view.on('perform:cancel', function () {
                    $dialog.dialog('destroy');
                });

                view.on('perform:complete', function(){
                    me.grid.trigger('reloadGrid', {current: true});
                    $dialog.dialog('destroy');
                });

            },

            onShowUndo: function(data){
                var me = this;
                Opf.confirm('您确定要撤销发送此信息吗？', function (result) {
                    if(result) {
                        Opf.ajax({
                            type: 'PUT',
                            jsonData: {name: '7', value:null},
                            url: url._('push.sm.status', {id: data.id}),
                            successMsg: '撤销成功',
                            complete: function () {
                                me.grid.trigger('reloadGrid', {current: true});
                            }
                        });
                    }
                });
            },

            onShowCancel: function(data){
                var me = this;
                Opf.confirm('您确定要取消发送此信息吗？', function (result) {
                    if(result) {
                        Opf.ajax({
                            type: 'PUT',
                            jsonData: {name: '6', value:null},
                            url: url._('push.sm.status', {id: data.id}),
                            successMsg: '取消成功',
                            complete: function () {
                                me.grid.trigger('reloadGrid', {current: true});
                            }
                        });
                    }
                });
            },

            onResendFailSm: function(data){
                var me = this;
                Opf.confirm('您确定要重新发送失败的信息吗？', function (result) {
                    if(result) {
                        Opf.ajax({
                            url: url._('push.sm.resend.fail', {id: data.id}),
                            jsonData:{},
                            type: "POST",
                            successMsg: "成功提交重新发送请求",
                            error: function(resp){
                                Opf.alert(resp.msg || '超过重新发送次数限制');
                            },
                            complete: function(resp){
                                me.grid.trigger('reloadGrid', {current: true});
                            }
                        });
                    }
                });
            },
            onResendSm: function(data){
                var me = this;
                Opf.confirm('您确定要重新发送信息吗？', function (result) {
                    if(result) {
                        Opf.ajax({
                            url: url._('push.sm.resend.fail', {id: data.id}),
                            jsonData:{},
                            type: "POST",
                            successMsg: "成功提交重新发送请求",
                            error: function(resp){
                                Opf.alert(resp.msg || '超过重新发送次数限制');
                            },
                            complete: function(resp){
                                me.grid.trigger('reloadGrid', {current: true});
                            }
                        });
                    }
                });
            },

            onPlanSendNum: function(id){
                require([
                    'backgrid',
                    'backgrid-paginator'
                    ], function(){
                    var collection = new PageableCollection([], {url: url._('push.sm.detail', {id: id})}),
                        columns = [
                            {name: 'phoneNo',    label: '手机号码', cell: 'string', editable: false},
                            {name: 'sendTime',    label: '发送时间', cell: 'string', formatter:_.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function(rawValue, model){
                                    return moment(rawValue, 'YYYYMMDDHHmm').formatYMDHm();
                                }
                            }), editable: false},
                            {name: 'status',  label: '状态', cell: 'string', formatter:_.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function(rawValue, model){
                                    return SEND_RESULT[rawValue] || "未知";
                                }
                            }), editable: false}
                                
                        ],
                        pageableGrid = new Backgrid.Grid({
                            columns: columns,
                            collection: collection
                        }),
                        paginator = new Backgrid.Extension.Paginator({
                            collection: collection
                        }),
                        $containerHtml = $("<div></div>");

                    $containerHtml.append(pageableGrid.render().$el).append(paginator.render().$el);

                    var $dialog = Opf.Factory.createDialog($containerHtml, {
                        dialogClass: 'sm-detail',
                        destroyOnClose: true,
                        title: '短信发送详情',
                        autoOpen: true,
                        width: 500,
                        height: 350,
                        modal: true,
                        buttons: [{
                            type: 'submit',
                            text: '重新发送失败短信',
                            click: handleReSend
                        },{
                            type: 'cancel'
                        }]
                    });

                    collection.fetch({reset: true});


                    function handleReSend(){
                        Opf.ajax({
                            url: url._('push.sm.resend.fail', {id: id}),
                            jsonData:{
                                name: '3',
                                value: null
                            },
                            type: "POST",
                            successMsg: "成功提交重新发送请求",
                            success: function(resp){
                                //TODO
                            }
                        });
                    }
                    
                });

            },

            onAddEditSm: function(id){
                var me = this;
                require(['app/oms/message/push-sm/add/view',
                         'app/oms/message/push-sm/collection/sm-collection'
                        ],
                        function(AddView, Collection){
                            var collection = new Collection(),
                                addView = new AddView({collection: collection});
                            var $dialog = Opf.Factory.createDialog(addView.$el, {
                                destroyOnClose: true,
                                modal: true,
                                height: 400,
                                minHeight: 400,
                                width: 400,
                                //TODO i18n
                                title: id ? '编辑短信' : '提交短信',
                                buttons: [{
                                    type: 'submit',
                                    text: '提交审核',
                                    click: function() {
                                        if(addView.validate()){
                                            Opf.ajax({
                                                type: id ? "PUT" : "POST",
                                                url: url._("push.sm.submit", {id: addView.getID()}),
                                                jsonData: getPostData(),
                                                success: function(){

                                                },
                                                complete: function () {
                                                    $dialog.dialog('close');
                                                    me.grid.trigger('reloadGrid', {current: true});
                                                }

                                            });
                                        }
                                    }
                                },{
                                    type: 'cancel'
                                }],

                                create: function(){
                                    collection.fetch();
                                }
                            });

                            function getPostData(){
                                return {
                                    id: addView.getID(),
                                    appType: addView.getAppType(),
                                    deviceType: addView.getDeviceType(),
                                    phoneNoFile: addView.getPhoneNoFile(),
                                    customPhoneNos: addView.getCustomPhoneNos(),
                                    smCategory: addView.getSmCategory(),
                                    content: addView.getContent(),
                                    pushType: addView.getPushType(),
                                    sendTime: addView.getSendTime(),
                                    resendTimes: addView.getResendTimes()
                                };
                            }
                            if(id){
                                var rowData = me.grid._getRecordByRowId(id);
                                addView.setDefaultValue(rowData);
                            }

                });
            }
        });

    });

    function appTypeFormatter(val){
        return APPTYPE_MAP[val];
    }

    function deviceTypeFormatter(val){
        return DEVICETYPE_MAP[val];
    }

    function sendTimeFormatter(cellvalue){
        return cellvalue ? moment(cellvalue, 'YYYYMMDDHHmm').formatYMDHm() : '--';
    }

    function pushTypeFormatter(cellvalue, options, rowObject){
        return cellvalue === '2' ? "定时发送" : "立即发送";
    }

    function statusFormatter(cellvalue, options, rowObject){
        return STATUS_MAP[cellvalue];
    }

    function planSendNumFormatter(cellvalue, options, rowObject){
        return '<span>'+ (cellvalue || '0') +'</span>' + '<button class="btn btn-minier btn-link planSendNum">查看详情</button>';
    }

    function contentFormatter(val){
        return '<span title="' + val + '">'+ (val.length >= 30 ? val.slice(0,30) + "..." : val) +'</span>';
    }

    function addTimeSelectEl (grid) {
        var $form = $(grid);
        var $select = $form.find('.columns select');

        //找到所有应该放timeSelect的input，替换成timeSelect；
        _.each($select, function(item){
            var itemVal = $(item).find('option:selected').attr('value');
            if(itemVal == 'startDate' || itemVal == 'endDate'){
                var $data = $(item).closest('tr').find('.data');
                buildTimeSelectUI($data);
            }
        });

        //找到所有的搜索条件下拉框重新绑定事件
        $select.on('change.addTimeSelect',function(){
            var me = $(this), itemVal = me.find('option:selected').attr('value');
            if(itemVal == 'startDate' || itemVal == 'endDate'){
                var $data = me.closest('tr').find('.data');
                buildTimeSelectUI($data);
            }
        });

    }

    function buildTimeSelectUI(el) {
        var timeView = new TimeSelectView();
        var $data = $(el);
        var $inputElm = $data.find('.input-elm');

        $inputElm.hide();
        $data.append(timeView.$el);
        timeView.on('getTime', function (time){
            $inputElm.val(time);
            $inputElm.trigger('change');
        });
    }

    function setupValidation(){

    }

    return App.PushApp.PushSMSApp.List.View;

});