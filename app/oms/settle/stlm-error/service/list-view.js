/**
 * Created by wupeiying on 2015/9/24.
 */
define(['App',
    'tpl!app/oms/settle/stlm-error/service/stlm-error-bats.tpl',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function (App, batsTpl) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="service-refunds-grid-table"></table>',
        '<div id="service-refunds-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var STATUS_MAP = {
        0: '未处理',
        1: '已处理',
        2: '待自动清算',
        3: '自动清算中',
        4: '入账成功',
        5: '未知',
        6: '入账失败'
    };

    var TYPE_MAP = {
        0: 'T0交易',
        1: 'S0交易'
    };

    var STAT_MAP = {
        "errorTotalAmt":"退款总金额",
        "errorTotalNum":"退款总笔数"
    };

    var queryFilters;

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.service.refunds',

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var me = this;
            //默认查询为 未处理状态
            var param = {
             "groupOp":"AND",
             "rules":[{"field":"flag","op":"eq","data":"0"}]
            };
            var grid = this.grid = App.Factory.createJqGrid({
                rsId: 'refundsList',
                caption: '',
                gid: 'service-refunds-grid',
                url: url._('stlm.service.refunds'),
                rowList:[10, 20, 30, 100],
                multiselect: true,
                stats:{
                    labelConfig:STAT_MAP,
                    items:[
                        {name: 'errorTotalAmt', type:'currency'},
                        {name: 'errorTotalNum', type:'count'}
                    ]
                },
                //download: {
                //    url: url._('stlm.service.refunds.export'),
                //    //必须返回对象
                //    params: function () {
                //        return {filters: queryFilters};
                //    }
                //},
                filters: [
                    {
                        caption: '条件过滤',
                        defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '商户号',
                                name: 'mchtNo'
                            },{
                                label: '商户名',
                                name: 'mchtName'
                            },{
                                label: '状态',
                                name: 'flag',
                                type: 'select',
                                options: {
                                    sopt: ['eq'],
                                    value: STATUS_MAP
                                }
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ],
                actionsCol: {
                    edit : false,
                    del: false,
                    extraButtons: [{
                        name: 'batsHandle', title:'处理', icon: 'icon-opf-process-account', caption:'', click: function() {//处理
                            loadBatHandle(me);
                        }
                    }],
                    canButtonRender: function(name, opts, rowData) {
                        if(name === 'batsHandle') {
                            var result = false;
                            switch(rowData.flag)
                            {
                                case "0":
                                    result = false;
                                     break;
                                case "1":
                                    result = true;
                                    break;
                                case "2":
                                    result = true;
                                    break;
                                case "3":
                                    result = true;
                                    break;
                                case "4":
                                    result = true;
                                    break;
                                case "5":
                                    result = false;//
                                    break;
                                case "6":
                                    result = false;//
                                    break;
                                default:
                                    result = false;
                                    break;
                            }
                            if(result){//如果不是那三个状态，则返回false 匹配(未处理，未知，入账失败)056
                                return false;
                            }
                        }

                    }
                },
                postData:{ filters: JSON.stringify(param) },
                nav: {
                    actions: {
                        view: false,
                        add: false
                    },
                    search: {
                        onSearch: function() {
                            var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
                            queryFilters = postData.filters;
                        }
                    }
                },
                colNames: {
                    id          :  '',
                    acctNo      :  '卡号',
                    acctName    :  '账户名',
                    zbankNo     :  '支行号',
                    zbankName   :  '支行名',
                    type        :  '交易类型',
                    mchtNo      :  '商户号',
                    mchtName    :  '商户名',
                    settleDate  :  '清算日期',
                    txAmt       :  '交易金额',
                    feeAmt      :  '手续费',
                    mchtServeAmt:  '交易服务费',
                    refundAmt   :  '退款金额',
                    flag        :  '状态',
                    refundTime  :  '退款时间',
                    crtTime     :  '创建时间',
                    oprName     :  '操作人',
                    updTime     :  '操作时间'
                },
                colModel: [
                    {name:'id', hidden: true},
                    {name:'acctNo', hidden: true},
                    {name:'acctName', hidden: true},
                    {name:'zbankNo', hidden: true},
                    {name:'zbankName', hidden: true},
                    {name:'type', formatter: typeFormatter},
                    {name:'mchtNo', search: true},
                    {name:'mchtName', search: true},
                    {name:'settleDate', search: true, searchoptions:{
                        dataInit: function(elem){
                            $(elem).datepicker({autoclose:true, format: 'yyyymmdd'});
                        },sopt:['eq', 'ge', 'le']}
                    },
                    {name:'txAmt'},
                    {name:'feeAmt'},
                    {name:'mchtServeAmt'},
                    {name:'refundAmt'},
                    {name:'flag', search: true, formatter: statusFormatter,
                        stype: 'select',
                        searchoptions: {
                            value: STATUS_MAP,
                            sopt: ['eq', 'ne']
                        }
                    },
                    {name:'refundTime', formatter: timeFormatter},
                    {name:'crtTime', formatter: timeFormatter, search: true, searchoptions: {
                        dataInit : function (elem) {
                            $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                        },
                        sopt: ['lk', 'nlk','gt','ge','eq','ne','lt','le','in','ni']
                    }},
                    {name:'oprName'},
                    {name:'updTime', formatter: timeFormatter}
                ],
                loadComplete: function(data) {}
            });

            _.defer(function() {
                if (!Ctx.avail('refundsList.autobatch')) {
                    return;
                }
                var $extraBtn = $('<div class="grid-extra-btn">自动成批</div>');
                var $td = $('<td class="ui-pg-button ui-corner-all" title="自动成批"></td>');
                $td.append($extraBtn);

                $('#' + grid.attr('id') + '_toppager_left').find('tr').append($td);

                $extraBtn.on('click', function() {
                    Opf.confirm('确定执行自动成批吗？', function(result){
                        if(result){
                            if($extraBtn.hasClass('grid-extra-btn-disable')) {
                                return;
                            }
                            $extraBtn.addClass('grid-extra-btn-disable').text('正在运行...');
                            $.ajax({
                                type: 'GET',
                                url: url._('stlm.service.refunds.autobatch'),
                                success: function(resp) {
                                    grid.trigger('reloadGrid', [{page:1}]);
                                    Opf.Toast.success('操作成功');
                                },
                                complete: function() {
                                    $extraBtn.removeClass('grid-extra-btn-disable').text('自动成批');

                                }
                            });
                        }
                    });
                });

            });

            me.batsHandleBtns(grid);

            return grid;
        },

        getSelectedIds: function () {
            return _.clone(Opf.Grid.getSelRowIds(this.grid));
        },

        checkSelected: function () {
            if(this.getSelectedIds().length === 0) {
                Opf.alert('请至少选中一条记录');
                return false;
            }
            return true;
        },

        batsHandleBtns: function(grid){
            var me = this;
            if (!Ctx.avail('refundsList.batsHandle')) {
                return;
            }
            Opf.Grid.navButtonAdd(grid, {
                caption: "",//批量处理
                id: "batsHandle",
                name: "batsHandle",
                title: '批量处理',
                buttonicon: "icon-user white",
                position: "last",
                onClickButton: function () {
                    loadBatsHandle(me);
                }
            });
            $("#importInformation").hover(function () {
                $(".icon-upload-alt").addClass("icon-upload-alt-hover");
            }, function () {
                $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
            });
        }

    });

    function loadBatsHandle(me){
        if(me.checkSelected()){
            var postData = null;
            var result = false;
            var statusData = _.map(me.grid.jqGrid('getGridParam', 'selarrrow'), function(id){ return me.grid.jqGrid('getRowData', id);});
            if(statusData.length > 1 && (statusData[0].flag == 0 || statusData[0].flag == 5 || statusData[0].flag == 6)){
                var sResult = false;
                for(var i = 1; i < statusData.length; i++){
                    if(statusData[0].flag != statusData[i].flag){
                        Opf.alert('选择状态不一致');
                        sResult = false;
                    }
                    else{
                        sResult = true;
                    }
                    if(!sResult){
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
                //_.filter(statusData, function(v, i){
                //    if(i > 0){
                //        if(statusData[0].flag != statusData[i].flag){
                //            Opf.alert('选择状态不一致');
                //            sResult = false;
                //        }
                //        if(!sResult){ return false; }
                //    }
                //});
            }
            else if(statusData.length > 0 && (statusData[0].flag == 0 || statusData[0].flag == 5 || statusData[0].flag == 6)){
                result = true;
            }
            else{
                Opf.alert('执行处理只允许状态为[未处理，未知，入账失败]');
                return false;
            }
            if(result){
                var $dialog = Opf.Factory.createDialog(batsTpl(), {
                    destroyOnClose: true,
                    title: '批量处理',
                    autoOpen: true,
                    width: 230,
                    height: 180,
                    modal: true,
                    buttons: [{
                        type: 'submit',
                        click: function (e) {
                            if($dialog.find('#status').val() == -1){
                                Opf.alert('您还未选择状态！');
                                return false;
                            }
                            postData = { id: me.getSelectedIds(), flag: $dialog.find('#status').val() };
                            Opf.ajax({
                                url: url._('stlm.service.refunds.bats'),
                                type: 'PUT',
                                jsonData: postData,
                                success: function(resp) {
                                    if(resp.success) {
                                        Opf.Toast.success('操作成功');
                                    }
                                },
                                error: function(resp) {
                                    console.log(resp);
                                },
                                complete: function(resp) {
                                    $dialog.dialog('destroy');
                                    me.grid.trigger("reloadGrid");
                                }
                            });
                        }
                    },
                    {
                        type: 'cancel'
                    }],
                    create: function(){
                        var createMe = this;
                        var statusData = _.map(me.grid.jqGrid('getGridParam', 'selarrrow'), function(id){ return me.grid.jqGrid('getRowData', id);});
                        if(statusData[0].flag == 5){//未知-入账成功 入账失败
                            $(createMe).find('option[value="4"]').css('display','block');
                            $(createMe).find('option[value="6"]').css('display','block');
                        }
                        else if(statusData[0].flag == 0 || statusData[0].flag == 6){//入账失败 未处理-- “待自动清算”
                            $(createMe).find('option[value="2"]').css('display','block');
                        }
                    },
                    close: function(){
                        $dialog.dialog('destroy');
                    }
                });
            }
        }
    }

    function loadBatHandle(me){
        var id = me.grid.jqGrid('getGridParam','selarrrow');
        var $dialog = Opf.Factory.createDialog(batsTpl(), {
            destroyOnClose: true,
            title: '处理',
            autoOpen: true,
            width: 230,
            height: 180,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function (e) {
                    Opf.ajax({
                        url: url._('stlm.service.refunds.bats'),
                        type: 'PUT',
                        jsonData: { id: id, flag: $dialog.find('#status').val() },
                        success: function(resp) {
                            if(resp.success) {
                                Opf.Toast.success('操作成功');
                            }
                        },
                        error: function(resp) {
                            console.log(resp);
                        },
                        complete: function(resp) {
                            $dialog.dialog('destroy');
                            me.grid.trigger("reloadGrid");
                        }
                    });
                }
            },
            {
                type: 'cancel'
            }],
            create: function(){
                var createMe = this;
                var statusData = _.map(me.grid.jqGrid('getGridParam', 'selarrrow'), function(id){ return me.grid.jqGrid('getRowData', id);});
                if(statusData[0].flag == 5){//未知-入账成功 入账失败
                    $(createMe).find('option[value="4"]').css('display','block');
                    $(createMe).find('option[value="6"]').css('display','block');
                }
                else if(statusData[0].flag == 0 || statusData[0].flag == 6){//入账失败 未处理-- “待自动清算”
                    $(createMe).find('option[value="2"]').css('display','block');
                }
            },
            close: function(){
                $dialog.dialog('destroy');
            }
        });
    }

    App.on('service:refunds:list', function () {
        App.show(new View());
    });

    function typeFormatter(val){
        return TYPE_MAP[val] || '';
    }

    function timeFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    return View;

});