/**
 * @created 2014-3-12 19:27:29
 */
define(['App',
    'tpl!app/oms/settle/channel-account/list/templates/table-ct.tpl',
    'tpl!app/oms/settle/channel-account/list/templates/channel-account.tpl',
    'tpl!app/oms/settle/channel-account/list/templates/deal.tpl',
    'i18n!app/oms/common/nls/settle',
    'assets/scripts/fwk/main/ReportPollingTask',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'common-ui'
], function (App, tableCtTpl, channelAcctTpl, dealTpl, settleLang, ReportPollingTask) {

    var RECVFLAG_MAP = {
            "0": settleLang._("channel-account.recvFlag.0"),
            "1": settleLang._("channel-account.recvFlag.1"),
            "2": settleLang._("channel-account.recvFlag.2")
        },
        STAT_MAP = {
            "txAmt": "交易金额",
            "cupFee": "手续费",
            "inAmt": "应收金额",
            "realAmt": "实收金额"
        };

    App.module('SettleApp.ChannelAccount.List.View', function (View, App, Backbone, Marionette, $, _) {

        View.ChannelAccounts = Marionette.ItemView.extend({
            tabId: 'menu.channel.account',
            template: tableCtTpl,
            events: {},
            initialize: function () {
                this.queryFilters = null;
            },

            onRender: function () {
                var me = this;
                _.defer(function () {
                    me.renderGrid();
                });
            },

            getRequestDateSelect: function (gird) {
                var data = {};

                data['id'] = Opf.Grid.getSelRowId(gird);
                var $form = $('form.form-channel-account').find(':input');
                $form.each(function () {
                    data[$(this).attr('name')] = $(this).val();
                });

                var options = {
                    url: 'api/settle/channel-accounts/' + data['id'] + '/update',
                    data: data,
                    type: 'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    needData: true
                };

                return options;
            },

            ajaxRequest: function (options, dialog, grid) {
                $.ajax({
                    type: options.type,
                    contentType: options.contentType,
                    dataType: options.dataType,
                    url: options.url,
                    data: options.needData ? JSON.stringify(options.data) : "",
                    success: function (resp) {
                        $(dialog).dialog("destroy");
                        $(grid).trigger("reloadGrid", [{current: true}]);
                        if (resp.success) {
                            Opf.Toast.success('操作成功');
                        }
                    },
                    error: function (resp) {
                        $(dialog).dialog("destroy");
                    }
                });
            },

            loadChannAccDeal: function (roleGird, rowData){
                var tpl = dealTpl();
                var $dialog = Opf.Factory.createDialog(tpl, {
                    destroyOnClose: true,
                    title: '处理',
                    autoOpen: true,
                    width: 500,
                    height: 400,
                    modal: true,
                    buttons: [{
                        type: 'submit',
                        click: function () {
                            var me = this;
                            var id = rowData.id;
                            var time = $(me).find('#txt-time').val().replace(':','');
                            var amt = $(me).find('#txt-amt').val();
                            var oprMsg2 = $(me).find('#txt-oprMsg2').val();
                            var exp = /^([1-9][\d]{0,15}|0)(\.[\d]{1,2})?$/;
                            if(time == '' || amt == null || oprMsg2 == null){
                                CommonUI.loadError($(this), '所有选项为必填,请输入完整.');
                                return false;
                            }
                            else if(!exp.test(amt)){
                                CommonUI.loadError($(this), '金额输入无效格式,请重新输入.');
                                return false;
                            }
                            else{
                                CommonUI.loadCleanError($(this), '');
                            }
                            Opf.ajax({
                                type: 'PUT',
                                url: url._('channel.account.deal'),
                                jsonData: {id: id, time: time, amt: amt, oprMsg2: oprMsg2},
                                success: function(resp){
                                    $dialog.trigger('dialogclose');
                                    $(roleGird).trigger("reloadGrid", [{current:true}]);
                                    Opf.Toast.success('操作成功');
                                }
                            });
                        }
                    }, {
                        type: 'cancel'
                    }],
                    create: function(){
                        $(this).find('#txt-id').val(rowData.id);
                    }
                });
            },
            onClickButton: function (roleGird) {
                var me = this;
                var tpl = channelAcctTpl();

                var $dialog = $(tpl).dialog({
                    autoOpen: true,
                    height: Opf.Config._('ui', 'channelAccount.grid.form.extra.height'),
                    width: Opf.Config._('ui', 'channelAccount.grid.form.extra.width'),
                    modal: true,
                    buttons: [{
                        html: "<i class='icon-ok'></i>&nbsp; 提交",
                        "class": "btn btn-xs btn-primary",
                        click: function (e) {
                            var $form = $('form.form-channel-account');
                            var validator = $form.validate();
                            var valid = true;
                            if (validator && !validator.form()) {
                                valid = false;
                            }
                            if (valid) {
                                $($(e.target).closest('button')).addClass('disabled').find('span').html("<i class='icon-ok'></i>&nbsp; 正在提交...");
                                me.ajaxRequest(me.getRequestDateSelect(roleGird), this, roleGird);
                            }
                        }
                    }, {
                        html: "<i class='icon-remove'></i>&nbsp; 取消",
                        "class": "btn btn-xs",
                        click: function () {
                            $(this).dialog("destroy");
                        }
                    }],
                    create: function () {
                        var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));
                        var $form = $('form.form-channel-account');
                        var realAmount = rowData.realAmt;
                        var inAmt = rowData.inAmt;
                        var $input = $form.find('input[name="amountReceived"]');
                        var $inAmtInput = $form.find('input[name="inAmt"]');

                        $input.val(realAmount);
                        $inAmtInput.val(inAmt);

                        $input.on("focus", function () {
                            $(this).select();
                        });

                        me.initSelectValue();
                        Opf.Validate.addRules($('form.form-channel-account'), {
                            rules: {
                                amountReceived: {
                                    required: true,
                                    number: true
                                }

                            }
                        });

                        $(this).prev('.ui-widget-header').find('.ui-dialog-title').addClass('settle-styles-paddingL-15');
                    },
                    close: function () {
                        $(this).dialog("destroy");
                    }
                });
            },

            initSelectValue: function () {
                $.ajax({
                    type: "GET",
                    url: url._('stlm.account') + '/2/accountInfo',
                    success: function (resp) {
                        for (var i = 0; i < resp.length; i++) {
                            var data = '<option value="' + resp[i].key + '">' + resp[i].value + '</option>';
                            $('form.form-channel-account').find('select[name="bankId"]').append(data);
                        }
                    },
                    error: function (resp) {
                        console.error('ajax get failed');
                    }
                });
            },

            attachValidation: function () {
                return {
                    setupValidation: Opf.Validate.setup,
                    addValidateRules: function (form) {
                        Opf.Validate.addRules(form, {
                            rules: {
                                stlmDate: {
                                    required: true,
                                    date: true
                                },
                                cupsNo: {
                                    required: true,
                                    namechars: true
                                },
                                cupsName: {
                                    required: true,
                                    namechars: true
                                },
                                txAmt: {
                                    required: true,
                                    float: true
                                },
                                cupFee: {
                                    required: true,
                                    float: true
                                },
                                inAmt: {
                                    required: true,
                                    float: true
                                },
                                realAmt: {
                                    required: true,
                                    float: true
                                },
                                recvFlag: {
                                    required: true
                                },
                                inAcctId: {
                                    required: true,
                                    number: true
                                },
                                bankName: {
                                    required: true
                                },
                                authOpr: {
                                    required: true,
                                    namechars: true
                                },
                                oprName: {
                                    required: true,
                                    namechars: true
                                },
                                authTme: {
                                    required: true,
                                    date: true
                                }
                            }
                        });
                    }
                };
            },

            renderGrid: function () {
                var me = this;
                //var searchFilters = '';
                var validation = this.attachValidation();
                var param = {
                    "groupOp":"AND",
                    "rules":[{"field":"stlmDate","op":"eq","data":""+ moment().format('YYYYMMDD') + ""}]
                };

                var roleGird = me.grid = App.Factory.createJqGrid({
                    rsId: 'channelAccount',
                    caption: settleLang._('channelAccount.txt'),
                    filters: [{
                        caption: '搜索',
                        defaultRenderGrid: false,
                        canSearchAll: false,
                        canClearSearch: true,
                        components: [
                            {
                                label: '账务日期',
                                name: 'stlmDate',
                                type: 'date',
                                options: {sopt: ['lk']}
                            },
                            {
                                label: '交易渠道',
                                name: 'cupsNo',
                                type: 'text',
                                options: {sopt: ['lk']}
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }],
                    stats: {
                        labelConfig: STAT_MAP,
                        items: [
                            {name: 'txAmt', type: 'currency'},
                            {name: 'cupFee', type: 'currency'},
                            {name: 'inAmt', type: 'currency'},
                            {name: 'realAmt', type: 'currency'}
                        ]
                    },
                    download: {
                        url: url._('channel.account.download'),
                        //必须返回对象
                        params: function () {
                            var postData = me.grid.jqGrid('getGridParam', 'postData');
                            return {filters: postData.filters};
                        },
                        queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                            name: function () {
                                return '下载列表';
                            }
                        }
                    },
                    actionsCol: {
                        view: false,
                        edit: false,
                        del: false,
                        extraButtons: [
                            {
                                name: 'affirm',
                                title: '确认实收金额',
                                icon: 'icon-opf-confirm-receive icon-opf-confirm-receive-color',
                                click: function () {
                                    me.onClickButton(roleGird);
                                }
                            },
                            {
                                name: 'deal',
                                title: '处理',
                                icon: '',
                                caption: '处理',
                                click: function (name, opts, rowData) {
                                    me.loadChannAccDeal(roleGird, rowData);
                                }
                            }
                        ],
                        canButtonRender: function (name, opts, rowData) {
                            // 初始化未核实的情况下才显示确认实收金额的按钮
                            if (name === 'affirm' && rowData.recvFlag !== '0') {
                                return false;
                            }
                        }
                    },
                    nav: {
                        actions: {
                            add: false,
                            edit: false,
                            del: false
                        },
                        formSize: {
                            width: Opf.Config._('ui', 'channelAccount.grid.form.width'),
                            height: Opf.Config._('ui', 'channelAccount.grid.form.height')
                        },
                        add: {
                            beforeShowForm: function (form) {
                                validation.addValidateRules(form);
                            },
                            beforeSubmit: validation.setupValidation
                        },
                        edit: {
                            beforeShowForm: function (form) {
                                validation.addValidateRules(form);
                            },
                            beforeSubmit: validation.setupValidation
                        },
                        view: {
                            width: Opf.Config._('ui', 'channelAccount.grid.viewform.width'),
                            height: Opf.Config._('ui', 'channelAccount.grid.viewform.height')
                        },
                        search: {
                            customComponent: {
                                //放大镜面板里，外部filter组件
                                items: [
                                    // 账务日期
                                    {
                                        type: 'singleOrRangeDate',
                                        label: '账务日期',
                                        limitRange: 'month',
                                        name: 'stlmDate'
                                    },

                                    // 交易渠道
                                    {
                                        type: 'select2',
                                        label: '交易渠道',
                                        selOpts: {
                                            'lk': '包含',
                                            'nlk': '不包含',
                                            'eq': '等于',
                                            'ne': '不等于'
                                        },
                                        ajaxOpts: {
                                            url: url._('cups.name')
                                        },
                                        name: 'cupsNo'
                                    }
                                ]
                            },
                            afterRedraw: function (){
                                var $searchForm = me.$searchForm = $(this);
                                $searchForm.find('table.ui-widget-content').css('width', 400);
                            },
                            afterShowSearch: function() {
                                // 删除多余的操作项
                                me.$searchForm.find('th>select').prop('disabled', true);
                                me.$searchForm.find('th>input').attr('disabled', 'disabled');
                                me.$searchForm.parent().find('.EditButton>a[id$=reset]').remove();

                                return true;
                            },
                            onSearch: function() {
                                var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
                                var gid = $grid.jqGrid('getGridParam', 'gid');
                                var tableId = $('#fbox_'+gid+'-table');

                                var queryFilters = me.queryFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'cupsNo');

                                if(queryFilters.filters) {
                                    var filters = JSON.parse(queryFilters.filters);
                                    var rules = filters.rules;
                                    var cupsNoRule = _.findWhere(rules, {field:"cupsNo"});

                                    if(!_.isEmpty(cupsNoRule)) {
                                        tableId.find('th.error').empty().hide();
                                        queryFilters.filters = JSON.stringify(filters);
                                    } else {
                                        tableId.find('tr.error').html('<th colspan="5" class="ui-state-error" align="left">请选择交易渠道</th>').show();
                                        queryFilters = false;
                                    }
                                } else {
                                    queryFilters = false;
                                }

                                return queryFilters;
                            }
                        }
                    },
                    gid: 'channel-accounts-grid',
                    url: url._('channel.account'),
                    postData:{ filters: JSON.stringify(param) },
                    overflow: true,
                    colNames: {
                        id: '',
                        stlmDate:  '账务日期',
                        cupsNo:    '交易渠道',//通道编号
                        cupsNm:    '通道名称',
                        iboxNum:   '交易笔数',//盒子流水笔数
                        iboxAmt:   '交易金额',//盒子流水金额
                        iboxCup:   '通道手续费',//盒子计算出渠道成本
                        iboxRecv:  '应收',//盒子应收渠道金额
                        iboxNum00:   '交易笔数',//盒子流水笔数
                        iboxAmt00:   '交易金额',//盒子流水金额
                        iboxCup00:   '通道手续费',//盒子计算出渠道成本
                        iboxRecv00:  '应收',//盒子应收渠道金额
                        cupsNum:   '交易笔数',//'渠道流水笔数',
                        cupsAmt:   '交易金额',//'渠道流水金额',
                        cupsCup:   '通道手续费',//'渠道成本',
                        cupsRecv:  '应收',//'渠道应收金额',
                        rightNum:  '交易笔数',//'对平流水笔数',
                        rightAmt:  '交易金额',//'对平流水金额',
                        rightCup:  '通道手续费',//'对平流水渠道手续费',
                        rightRecv: '应收',//'对平应收金额',
                        longNum:   '交易笔数',//'长款笔数',
                        longAmt:   '交易金额',//'长款金额',
                        longCup:   '通道手续费',//'长款渠道成本',
                        longRecv:  '应收',//'长款应收金额',
                        shortNum:  '交易笔数',//'短款笔数',
                        shortAmt:  '交易金额',//'短款金额',
                        shortCup:  '通道手续费',//'短款渠道成本',
                        shortRecv: '应收',//'短款应收金额',
                        recvFlag:  '收款标示',
                        in_acctId: '收款银行ID',
                        authOpr:   '确认收款人',
                        authTime:  '确认收款时间',
                        resvAmt1:  '实收金额',
                        authDesc:  '确认描述',
                        time:      '到账时间',
                        amt:       '到账金额'
                    },
                    colModel: [
                        {name: 'id', hidden: true},
                        {name: 'stlmDate',  formatter: authTmeFormatter},
                        {name: 'cupsNo', hidden: true, search: false},
                        {name: 'cupsNm'}, //, search: true, searchoptions: {sopt: ['lk','nlk']}
                        {name: 'iboxNum'},
                        {name: 'iboxAmt'},
                        {name: 'iboxCup'},
                        {name: 'iboxRecv'},
                        {name: 'iboxNum00'},
                        {name: 'iboxAmt00'},
                        {name: 'iboxCup00'},
                        {name: 'iboxRecv00'},
                        {name: 'cupsNum'},
                        {name: 'cupsAmt'},
                        {name: 'cupsCup'},
                        {name: 'cupsRecv'},
                        {name: 'rightNum'},
                        {name: 'rightAmt'},
                        {name: 'rightCup'},
                        {name: 'rightRecv'},
                        {name: 'longNum'},
                        {name: 'longAmt'},
                        {name: 'longCup'},
                        {name: 'longRecv'},
                        {name: 'shortNum'},
                        {name: 'shortAmt'},
                        {name: 'shortCup'},
                        {name: 'shortRecv'},
                        {name: 'recvFlag', hidden: true},
                        {name: 'in_acctId', hidden: true},
                        {name: 'authOpr', hidden: true},
                        {name: 'authTime', formatter: authTmeFormatter, hidden: true},
                        {name: 'resvAmt1', hidden: true},
                        {name: 'authDesc', hidden: true},
                        {name: 'time', formatter: timeFormatter},
                        {name: 'amt'}
                    ],
                    loadComplete: function () {},
                    onInitGrid: function () {
                        _.defer(function () {
                            me.setGroupHeaders();
                        });
                    }
                });

                _.defer(function () {
                    var html = '<div style="border: 1px solid #ffffff;color: #ffffff;border-radius: 5px;">' +
                        '<div style="padding: 5px 10px 5px 10px;">' +
                        '<i class="icon-download"></i>' +
                        '下载渠道信息' +
                        '</div>' +
                        '</div>';
                    var postData = me.grid.jqGrid('getGridParam', 'postData');
                    Opf.Grid.navButtonAdd(roleGird, {
                        caption: html,
                        name: 'downLoadCups',
                        title: '下载渠道信息',
                        buttonicon: '',
                        position: "last",
                        onClickButton: function(){
                            Opf.ajax({
                                type: 'GET',
                                url: url._('channel.account.statistics.download'),
                                data: { filters : postData.filters },
                                success: function(resp){//Opf.Toast.success('下载成功.');
                                    if(resp.success !== false) {
                                        //判断回来的数中本身是不是有下载URL的，如果有，直接下载，不用走轮询
                                        var dlUrl = resp.data || resp.url;
                                        if(dlUrl){
                                            Opf.download(dlUrl);
                                            //当数据返回成功下载报表时，对比当前rsId的下载按钮，将其置为可用
                                            var $uiPgBtnDl = $('.ui-pg-button-download-default[rsId="channelAccount"]');
                                            $uiPgBtnDl.length && $uiPgBtnDl.removeClass('disabled');
                                        }
                                    }
                                    else{
                                        var reportQueueTask = new ReportPollingTask({
                                            name: _.result(options.queueTask, 'name'),
                                            params: postData.filters,
                                            rsId: 'channelAccount'
                                        });

                                        App.TaskQueueMgr.addTask(reportQueueTask);

                                        Opf.Polling.addCallback({
                                            tid: Ctx.getUUID(),
                                            fn: function (obj) {
                                                reportQueueTask.updateByResponse(obj);
                                                if(obj.data){
                                                    //当数据返回成功下载报表时，对比当前rsId的下载按钮，将其置为可用
                                                    var $uiPgBtnDl = $('.ui-pg-button-download-default[rsId="channelAccount"]');
                                                    $uiPgBtnDl.length && $uiPgBtnDl.removeClass('disabled');
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });

                });
            },

            setGroupHeaders: function () {
                var me = this;
                me.grid.jqGrid('setGroupHeaders', {
                    useColSpanStyle: true,
                    groupHeaders: [{
                        startColumnName: 'iboxNum',
                        numberOfColumns: 4,
                        titleText: '<font color="#2A7CCE">盒子账单(23:00~23:00)</font>'
                    },{
                        startColumnName: 'iboxNum00',
                        numberOfColumns: 4,
                        titleText: '<font color="#2A7CCE">盒子账单(00:00~00:00)</font>'
                    },{
                        startColumnName: 'cupsNum',
                        numberOfColumns: 4,
                        titleText: '<font color="#2A7CCE">渠道账单</font>'
                    },{
                        startColumnName: 'rightNum',
                        numberOfColumns: 4,
                        titleText: '<font color="#2A7CCE">对平</font>'
                    },{
                        startColumnName: 'longNum',
                        numberOfColumns: 4,
                        titleText: '<font color="#2A7CCE">长款</font>'
                    },{
                        startColumnName: 'shortNum',
                        numberOfColumns: 4,
                        titleText: '<font color="#2A7CCE">短款</font>'
                    }]
                });
            }
        });
    });

    function timeFormatter(val){
        return val == null ? '' : val.substring(0, 2) + ':' + val.substring(2, 4) || '';
    }

    function authTmeFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD') : '';
    }

    //function authTmeFormatter(value) {
    //	return value ? value.substring(0, 8) + ' ' + value.substring(8,10) + ':' + value.substring(10,12) + ':' + value.substring(12,14) : value;
    //}

    function recvFlagFormatter(val) {
        if (val !== '1') {
            return '<span class="red-color">' + (RECVFLAG_MAP[val] || null) + '</span>';
        }
        return RECVFLAG_MAP[val];
    }

    function realAmtFormat(cellvalue, options, rowObject) {
        if (rowObject.resvAmt1 - cellvalue > 0.001) {
            return '<span class="red-color">' + (Opf.currencyFormatter(cellvalue, options, rowObject) || 0) + '</span>';
        }
        return Opf.currencyFormatter(cellvalue, options, rowObject) || 0;
    }

    function realInDifFormat(cellvalue, options, rowObject) {
        var val = rowObject.resvAmt1 - rowObject.realAmt;
        return Opf.currencyFormatter(val, options, rowObject) || 0;
    }

    function oprNameFormatter(val) {
        return val || '无';
    }

    return App.SettleApp.ChannelAccount.List.View;

});