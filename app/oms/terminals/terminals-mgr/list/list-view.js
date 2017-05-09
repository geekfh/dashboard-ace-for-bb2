define(['App',
    'tpl!app/oms/terminals/terminals-mgr/list/templates/terminalsMgr.tpl',
    'tpl!app/oms/terminals/terminals-mgr/list/templates/uploadFile.tpl',
    'i18n!app/oms/common/nls/terminals',
    'tpl!app/oms/terminals/terminals-mgr/list/templates/selectedTerminal.tpl',
    'tpl!app/oms/terminals/terminals-mgr/list/templates/changeTerminalUse.tpl',
    'assets/scripts/fwk/component/uploader',
    'select2', 'upload', 'moment.override',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'jquery.validate'
], function (App, TerminalsMgrTpl, uploadFileTpl, terminalsLang, selTermTpl, changTermTpl, uploader) {

    var TERMINALSTATUS_MAP = {
            "0": terminalsLang._("terminals.mgr.terminalstatus.0"),
            "1": terminalsLang._("terminals.mgr.terminalstatus.1"),
            "2": terminalsLang._("terminals.mgr.terminalstatus.2"),
            "3": terminalsLang._("terminals.mgr.terminalstatus.3")
        },

        TERMINALTYPE_MAP = {
            "1": terminalsLang._("terminals.mgr.terminaltype.1"),
            "2": terminalsLang._("terminals.mgr.terminaltype.2")
        },

        TERMMACHTYPE_MAP = {
            "P603+": terminalsLang._("terminals.mgr.termMachType.P603PLUS"),
            "600": terminalsLang._("terminals.mgr.termMachType.600"),
            "602(通刷宝)": terminalsLang._("terminals.mgr.termMachType.602"),
            "808": terminalsLang._("terminals.mgr.termMachType.808"),
            "809": terminalsLang._("terminals.mgr.termMachType.809"),
            "E550": terminalsLang._("terminals.mgr.termMachType.E550"),
            "E5X0": terminalsLang._("terminals.mgr.termMachType.E5X0")
        };
    var checkStatus_MAP = {
        '0': '未考核',
        '1': '考核中',
        '2': '考核暂停',
        '3': '考核结束'
    };
    var use_MAP = {
        '': '',
        '0': '其它',
        '1': '租机',
        '2': '购买',
        '3': '赠送',
        '4': '非考核租机',
        '2A': '12-4营销活动销售',
        '3A': '12-4营销活动赠送',
        '3B': '11-1营销活动赠送'
    };

    arrResponse = [];


    //当挂属机构选择015***时，必须选择拓展员
    $.validator.addMethod(
        "oprRequired",
        function(value, element, params){
            var opr = $(element).data("oprRequired") === params;
            return  opr ? (value ? true : false) : true;
        },
        '请选择拓展员'
    );
    App.module('TerminalsApp.TerminalsMgrApp.List.View', function (View, App, Backbone, Marionette, $, _) {

        View.TerminalsMgr = Marionette.ItemView.extend({
            tabId: 'menu.terminals.mgr',
            template: TerminalsMgrTpl,

            events: {},

            initialize: function () {
            },

            onRender: function () {
                var me = this;

                _.defer(function () {
                    me.renderGrid();
                });
            },

            renderGrid: function () {
                var me = this;

                var setupValidation = Opf.Validate.setup;
                var addValidateRules = function (form) {
                    Opf.Validate.addRules(form, {
                        rules: {
                            snNo: {
                                required: true
                                // number:true bug#2378
                                , maxlength: 24 //bug#77
                            },
                            boxNm: {
                                required: true
                            },
                            batchNm: {
                                required: true
                            },
                            //要对select2 作验证，选择添加 select2 前 input 的 name
                            termUsed: {
                                required: true
                            },
                            termFactory: { required:true },
                            termMachType: { required:true },
                            application: { required:true },
                            oprIdDir:{
                                oprRequired:"015"
                            }
                        }
                    });
                };

                var grid = me.grid = App.Factory.createJqGrid({
                    emptyrecords: '没有查询到相关的POS机',
                    rsId: 'terminalsMgr',
                    caption: terminalsLang._('terminalsMgr.txt'),
                    filters: [
                        {
                            caption: '条件过滤',
                            defaultRenderGrid: false,
                            canSearchAll: true,
                            canClearSearch: true,
                            components: [
                                {
                                    label: terminalsLang._('temrinals.mgr.sn.no'),
                                    name: 'snNo',
                                    options: {
                                        sopt: ['eq']
                                    }
                                },{
                                    label: terminalsLang._('temrinals.mgr.term.mach.type'),
                                    name: 'termMachType',
                                    type: 'select',
                                    options: {
                                        sopt: ['eq'],
                                        value: TERMMACHTYPE_MAP
                                    }
                                },{
                                    label: terminalsLang._('temrinals.mgr.status'),
                                    name: 'status',
                                    type: 'select',
                                    options: {
                                        sopt: ['eq'],
                                        value: TERMINALSTATUS_MAP
                                    }
                                },{
                                    label: '终端用途',
                                    name: 'application',
                                    type: 'select',
                                    options: {
                                        sopt: ['eq'],
                                        value: use_MAP
                                    }
                                }
                            ],
                            searchBtn: {
                                text: '搜索'
                            }
                        }
                    ],
                    actionsCol: {
                        edit: false,
                        del: false,
                        canButtonRender: function (name, options, rowData) {
                            // 0－正常使用,  1－未绑定,  2－停用,  3－注销
                            var status = rowData.status;
                            if (status == 1) {// 未绑定 只能查看
                                return name == 'view';
                                // return false;
                            } else {
                                // 其他情况，显示所有按钮
                                return true;
                            }

                        },
                        extraButtons: [
                            //因为实现逻辑有问题，后台要求去掉
                            //{name: 'changestate', icon:'icon-opf-state-change', title: '更改终端状态',
                            //click: function (name, opts, rowData) {
                            //    showChangeStateDialog(me, rowData);
                            //}}
                        ]
                    },
                    nav: {
                        formSize: {
                            height: 580
                        },

                        add: {
                            beforeShowForm: function (form) {

                                var $selectTermFactory = $(form).find('select[name="termFactory"]'),
                                    $termUsed = $(form).find('#termUsed');

                                $.ajax({
                                    type: 'GET',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    url: url._('terminals.mgr.options'),
                                    success: function (resp) {
                                        createOptions(resp);
                                    }
                                });

                                attatchChangeEvent($selectTermFactory);

                                $termUsed.select2(_.result(me, 'getSelect2Options'));

                                $termUsed.on('change', function () {
                                    $(this).closest('form').find('label[for="termUsed"]').hide();
                                });
                                $('#tr_termUsed').after($(getDirTpl()));
                                //$('#oprIdDir').select2(_.result(me, 'getOprNameSelect2Options'));

                                $(form).find("select[name='application']")
                                    .prepend('<option class="placeholder" style="display: none;" selected disabled>请选择终端用途</option>');

                                addValidateRules(form);

                            },
                            onclickSubmit: function (params, postdata) {
                                var termFactory = $('select[name="termFactory"]').val(),
                                    termMachType = $('select[name="termMachType"]').val(),
                                    $termUsed = $('#termUsed');
                                //desc = $('#desc').val();

                                delete postdata['type'];
                                delete postdata['termMachType'];
                                delete postdata['termFactory'];

                                var findItem =  _.findWhere(arrResponse, {
                                    "termFactory": termFactory,
                                    "termMachType": termMachType
                                });

                                //id =["id"];
                                //"desc": desc

                                postdata['typeId'] = findItem && findItem.id;
                                postdata['termUsed'] = $termUsed.select2('data') && $termUsed.select2('data').id;

                                return postdata;
                            },
                            beforeSubmit: setupValidation
                        },

                        view: {
                            beforeShowForm: function (form) {
                                var $form = $(form);
                                var no = $.trim($form.find("#v_termFactory>span:first").text());
                                var ajaxOptions = {
                                    type: 'GET',
                                    url: url._('terminals.mgr.allocate.detail'),
                                    data: { no: no },
                                    beforeSend: function(){
                                        Opf.UI.setLoading($form, true);
                                    },
                                    success: function(resp){
                                        resp = resp || [];
                                        var operDtFormatter = function(value){
                                            return moment(value, 'YYYYMMDDhhmmss').format('YYYY/MM/DD HH:mm:ss');
                                        };
                                        var operTypeFormatter = function(logItem){
                                            var operType = logItem.operType, //操作类型
                                                mchtName = logItem.mchtNm, //商户名
                                                brhName = logItem.brhName, //机构名
                                                str = "";
                                            switch (operType){
                                                case "0":
                                                    str += '绑定至【'+mchtName+'】商户';
                                                    break;
                                                case "1":
                                                    str += '终端解绑';
                                                    break;
                                                case "2":
                                                    str += '终端停用';
                                                    break;
                                                case "3":
                                                    str += '终端注销';
                                                    break;
                                                case "4":
                                                    str += '未激活';
                                                    break;
                                                case "5":
                                                    str += '从【'+brhName+'机构】回收至盒子支付';
                                                    break;
                                                case "6":
                                                    str += '调配至【'+brhName+'机构】';
                                                    break;
                                                case "7":
                                                    str += '终端出库';
                                                    break;
                                                case "8":
                                                    str += '用途变更为【租机】';
                                                    break;
                                                default:
                                                    break;
                                            }
                                            return str;
                                        };
                                        var logStr = "";
                                            logStr += '<div class="container table-responsive" style="margin-top: 15px;">';
                                            logStr += '<table class="table table-bordered table-hover">';
                                            logStr += '<thead>';
                                            logStr += '<tr>';
                                            logStr += '<td colspan="3"><em class="text-primary">终端操作记录</em></td>';
                                            logStr += '</tr>';
                                            logStr += '<tr>';
                                            logStr += '<th width="100">操作人</th>';
                                            logStr += '<th width="80">操作时间</th>';
                                            logStr += '<th>操作内容</th>';
                                            logStr += '</tr>';
                                            logStr += '</thead>';
                                            logStr += '<tbody>';

                                        if(resp.length == 0){
                                            logStr += '<tr>';
                                            logStr += '<td colspan="3">无操作记录</td>';
                                            logStr += '</tr>';
                                        } else {
                                            for(var i=0; i<resp.length; i++){
                                                var logItem = resp[i];
                                                logStr += '<tr>';
                                                logStr += '<td>'+logItem.oprName+'</td>';
                                                logStr += '<td>'+operDtFormatter(logItem.operDt)+'</td>';
                                                logStr += '<td>'+operTypeFormatter(logItem)+'</td>';
                                                logStr += '</tr>';
                                            }
                                        }
                                            logStr += '</tbody>';
                                            logStr += '</table>';
                                            logStr += '</div>';

                                        $form.append(logStr);
                                    },
                                    complete: function(){
                                        Opf.UI.setLoading($form, false);
                                    }
                                };
                                Opf.ajax(ajaxOptions);
                            }
                        }

                    },
                    gid: 'terminalsMgr',
                    url: url._('temrinals.mgr'),
                    rowNum: 100,//分页
                    rowList: [100, 200, 300],
                    colNames: {
                        id: 'id',
                        snNo: terminalsLang._('temrinals.mgr.sn.no'),
                        no: terminalsLang._('temrinals.mgr.no'),//ID
                        type: terminalsLang._('temrinals.mgr.type'),
                        status: terminalsLang._('temrinals.mgr.status'),
                        mchtNo: terminalsLang._('temrinals.mgr.mcht.no'),
                        cityCode: terminalsLang._('temrinals.mgr.city.code'),
                        address: terminalsLang._('temrinals.mgr.address'),
                        branchNo: terminalsLang._('temrinals.mgr.branch.code'),
                        termUsed: terminalsLang._('temrinals.mgr.termUsed.code'),
                        expandName: terminalsLang._('temrinals.mgr.expand.name'),//'进件拓展员(登录账号)',
                        belongOprName: terminalsLang._('temrinals.mgr.operator.name'),//'挂属拓展员(登录账号)',
                        bindDate: terminalsLang._('temrinals.mgr.bind.date'),
                        termMachType: terminalsLang._('temrinals.mgr.term.mach.type'),
                        bthNum: terminalsLang._('temrinals.mgr.bth.num'),
                        bthDate: terminalsLang._('temrinals.mgr.bth.date'),
                        termFactory: terminalsLang._('temrinals.mgr.term.factory'),
                        brhName: '绑定机构名称',
                        termUsedName: '挂属机构名称',
                        boxNm: '箱子号',
                        batchNm: '批次号',
                        outDate: '出库时间',
                        application:'终端用途',
                        checkStatus: '审核状态'

                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['type', 'termMachType', 'termFactory', 'status', 'mchtNo', 'cityCode', 'address', 'branchNo', 'termUsed', 'expandName', 'bindDate', 'bthNum', 'bthDate'],
                            xs: ['type', 'termMachType', 'termFactory', 'status', 'mchtNo', 'cityCode', 'address', 'branchNo', 'termUsed', 'expandName', 'bindDate', 'bthNum', 'bthDate'],
                            sm: ['termMachType', 'termFactory', 'cityCode', 'address', 'branchNo', 'termUsed', 'expandName', 'bindDate', 'bthNum', 'bthDate'],
                            md: ['termMachType', 'termFactory', 'cityCode', 'address', 'branchNo', 'termUsed', 'expandName', 'bindDate', 'bthNum', 'bthDate'],
                            ld: ['termFactory', 'cityCode', 'address', 'bindDate', 'bthNum', 'bthDate']
                        }
                    },
                    //导出报表
                    download: {
                        searchFilter: false,
                        url: url._('terminals.mgr.download'),
                        titleName: '导出',
                        //必须返回对象
                        params: function () {
                            var snListData = $(me.grid).jqGrid('getGridParam', 'snList');
                            if (snListData) {
                                $(me.grid).jqGrid('setGridParam', {snList:''});
                                return {snList: snListData.join(',')};
                            }
                            var postData = $(me.grid).jqGrid('getGridParam', 'postData');
                            return {filters: postData.filters};
                        },
                        queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                            name: function () {
                                return 'POS机管理';
                            }
                        }
                    },
                    colModel: [
                        {name: 'id', index: 'id', hidden: true}, // id
                        {name: 'snNo', index: 'snNo', editable: true, search: true, searchoptions: {sopt: ['nlk', 'eq', 'ne']}},
                        {name: 'no', index: 'no', search: true, searchoptions: {sopt: ['nlk', 'eq', 'ne']}},  // no
                        {name: 'type', index: 'type', formatter: terminalTypeFormatter},
                        {
                            name: 'termMachType',
                            index: 'termMachType',
                            editable: true,
                            edittype: 'select',
                            editoptions: {value: {}},
                            formoptions: {rowpos: 4},
                            search: true,
                            stype: 'select',
                            searchoptions: {sopt: ['eq'], value: TERMMACHTYPE_MAP}
                        },
                        {
                            name: 'termFactory',
                            index: 'termFactory',
                            editable: true,
                            edittype: 'select',
                            editoptions: {value: {}},
                            formoptions: {rowpos: 3},
                            search: true,
                            searchoptions: {sopt: ['nlk', 'eq', 'ne']}
                        },
                        {
                            name: 'status',
                            index: 'status',
                            search: true,
                            formatter: terminalStatusFormatter,
                            stype: 'select',
                            searchoptions: {sopt: ['eq'], value: TERMINALSTATUS_MAP}
                        },
                        {name: 'mchtNo', index: 'mchtNo', search: true, searchoptions: {sopt: ['nlk', 'eq', 'ne']}},
                        {name: 'cityCode', index: 'cityCode'},
                        {name: 'address', index: 'address'},
                        {
                            name: 'termUsed',
                            index: 'termUsed',
                            editable: true,
                            search: true,
                            searchoptions: {sopt: ['nlk', 'eq', 'ne']},
                            formatter: loadTermUsedName
                        },//挂属
                        {
                            name: 'branchNo',
                            index: 'branchNo',
                            editable: false,
                            search: true,
                            searchoptions: {sopt: ['nlk', 'eq', 'ne']},
                            formatter: loadBranchNo
                        },//绑定
                        {name: 'expandName', index: 'expandName', formatter: function(val, rowId, rowData){
                                if(rowData.expandLoginCode != null){
                                    return val + '(' +rowData.expandLoginCode + ')';
                                }
                                else{
                                    return val || '';
                                }
                            }
                        }, //进件拓展员
                        {name: 'belongOprName', index: 'belongOprName', formatter: function(val, rowId, rowData){
                            if(rowData.belongOprLoginCode != null){
                                return val + '(' +rowData.belongOprLoginCode + ')';
                            }
                            else{
                                return val || '';
                            }
                        }},   //挂属拓展员
                        {name: 'bindDate', index: 'bindDate'},
                        {name: 'bthNum', index: 'bthNum'},
                        {name: 'bthDate', index: 'bthDate'},
                        {name: 'brhName', index: 'brhName', hidden: true,
                            search: true,
                            searchoptions: { sopt: ['eq'] }
                        },
                        {name: 'termUsedName', index: 'termUsedName', hidden: true,
                            search: true,
                            searchoptions: { sopt: ['eq'] }
                        },
                        {name: 'boxNm', index: 'boxNm', editable: true, search: true, searchoptions: {sopt: ['nlk', 'eq', 'ne', 'gt', 'lt']}},
                        {name: 'batchNm', index: 'batchNm', editable: true, search: true, searchoptions: {sopt: ['nlk', 'eq', 'ne', 'gt', 'lt']}},
                        {name: 'outDate', index: 'outDate'},
                        {name: 'application', index: 'application',search: true,formatter: function(val){return use_MAP[val] ? use_MAP[val] : '';},
                            stype: 'select',
                            searchoptions: {sopt: ['eq'], value: use_MAP},editable: true,
                            edittype: 'select',
                            editoptions: {sopt: ['eq'], value: use_MAP}
                        },
                        {name: 'checkStatus', index: 'checkStatus',search: true,formatter: function(val){return checkStatus_MAP[val] ? checkStatus_MAP[val] : '';},
                            stype: 'select',
                            searchoptions: {sopt: ['eq'], value: checkStatus_MAP}
                        }
                    ],

                    //实现终端解绑相关
                    //请参考 http://stackoverflow.com/questions/5259262/jqgrid-multiselect-and-disable-check-conditional

                    multiselect: true,//Ctx.avail('terminalsMgr.unbindTerminal')
                    multiboxonly: false,//实现点击条目 叠加选择

                    loadComplete: function (data) {
                        //TODO 取消选中所有 checkbox
                        //var statusList = _.pluck(data.content, 'status'),
                        //    rows = me.grid.find('.ui-widget-content');
                        //for (var i = 0; i < statusList.length; i++) {
                        //    $('input.cbox', rows[i])
                        //        .prop('disabled', statusList[i] !== "0")
                        //        .prop('checked', false);
                        //    $(rows[i]).removeClass('ui-state-highlight');
                        //}

                        //按钮状态控制器的updateStatus 方法
                        //me.btnStatusCtrl.updateStatus();
                    }

                    //beforeSelectRow: function(rowid, e){
                    //    var cboxdisabled = me.grid.find('tr#'+ rowid +'.jqgrow input.cbox:disabled');
                    //
                    //    if (cboxdisabled.length === 0) {
                    //        return true;
                    //    }
                    //    cboxdisabled.prop('checked', false); // 如果点击 操作栏，会在触发beforeSelctRow 之前 选中 checkbox，修复此问题
                    //    cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮
                    //    return false;
                    //},
                    //
                    //onSelectAll: function(aRowids, status){ // 只有选中当前页面的 rows
                    //    if(status){ //true 为选中状态
                    //        var cboxdisabled = me.grid.find('input.cbox:disabled'), selarrrow;
                    //        cboxdisabled.prop('checked', false);
                    //        cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮
                    //        selarrrow =
                    //            me.grid.find('input.cbox:checked')
                    //            .closest('tr')
                    //            .map(function(){
                    //                return this.id;
                    //            })
                    //            .get(); // get()不带参数，调用 toArray() 返回数组
                    //        //重新设置选中的 rowid
                    //        me.grid[0].p.selarrrow = selarrrow;
                    //    }
                    //    //按钮状态控制器的updateStatus 方法
                    //    me.btnStatusCtrl.updateStatus();
                    //},
                    //
                    //onSelectRow: function(rowid, status){
                    //    //按钮状态控制器的updateStatus 方法
                    //    me.btnStatusCtrl.updateStatus();
                    //}
                });

                me.generateImportBtn(grid);

                _.defer(function(){
                    me.genBtnStatusCtrl();//生成按钮状态控制器

                    me.snBatchSearchBtn(grid);//sn批量查询

                    me.resizeImportBtn(grid);//导入调整 20150424

                    me.unbundlingImportBtn(grid);//导入解绑 20150428

                    me.putbackImportBtn(grid);

                    me.generateAllocateBtn(grid);

                    me.generateUnbindTerminalBtn(grid);

                    me.machineReplaceBtn(grid);//租机替换

                    me.terminalStatusBySelect(grid); //终端变更用途
                    me.terminalStatusByImport(grid); //租机状态导入调整
                    me.generateSNListBtn(grid);     //生成好哒二维码
                });

            },

            generateImportBtn: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.importInformation')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    caption: "",
                    id: "importInformation",
                    name: "importInformation",
                    title: '批量上传信息',
                    buttonicon: "icon-upload-alt white",
                    position: "last",
                    onClickButton: function () {
                        addDialog(me, 'generate');
                    }
                });
                $("#importInformation").hover(function () {
                    $(".icon-upload-alt").addClass("icon-upload-alt-hover");
                }, function () {
                    $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
                });
            },

            getSelect2Options: function () {
                var me = this;
                return {
                    placeholder: '请选择终端挂属机构',
                    minimumInputLength: 1,
                    ajax: {
                        type: "get",
                        url: url._('report.tree.searchOrg'),
                        dataType: 'json',
                        data: function (term, page) { //page is one base
                            return {
                                kw: encodeURIComponent(term),
                                number: page - 1
                            };
                        },
                        results: function (data, page) { // 返回除分页信息外的内容，要正确过滤备选项就在这里操作
                            var more = page < data.totalPages,
                            //过滤非直接下属机构
                                content = _.filter(data.content, function (item) {
                                    return item.orgLevel >= Ctx.getUser().get('brhLevel');
                                });
                            return {
                                results: content,
                                more: more
                            };
                        }
                    },
                    // 如果不设ID，将不能选择列表
                    id: function (e) {
                        return e.id;
                    },
                    //格式化备选项，显示给用户。对每一个数组元素都执行此方法，data即为数组元素
                    formatResult: function (data, container, query, escapeMarkup) {
                        return data.orgName;
                    },
                    //选中之后显示的内容
                    formatSelection: function (data, container, escapeMarkup) {
                        if(data.id.indexOf('015') > -1){
                            $('.opr-select-row').show();
                            $('.oprSelectDir').select2(getOprNameSelect2Options());
                            $('#oprIdDir').data("oprRequired", "015");
                        }else{
                            $('.opr-select-row').hide();
                            $('#oprIdDir').val('');
                            $('#oprIdDir').data("oprRequired", "");
                        }
                        var orgLevel = Ctx.getUser().get('brhLevel');
                        //可选同级或下级
                        return data.orgLevel >= orgLevel && data.orgName;
                    }
                };
            },


            genBtnStatusCtrl: function () {
                var btnStatusCtrlList = [],
                    me = this;
                btnStatusCtrlList.push({id: 'unbindTerminal', condition: '0'});
                function updateStatus() {
                    _.each(btnStatusCtrlList, function (btn) {
                        //更新每个按钮状态
                        if (_.filter(getRowsData(me.grid), function (item) {
                                return item.status === btn.condition;
                            }).length !== 0) {
                            me.$el.find('#' + btn.id + ' .ui-icon').removeClass('inactive');
                        }
                        else {
                            me.$el.find('#' + btn.id + ' .ui-icon').addClass('inactive');
                        }
                    })
                }

                return me.btnStatusCtrl = {
                    updateStatus: updateStatus
                };
            },

            resizeImportBtn: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.resizeImport')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    id: 'resizeImport',
                    caption: '',
                    name: 'resizeImport',
                    title: '导入调整',
                    buttonicon: 'icon-upload white',
                    position: 'last',
                    onClickButton: function () {
                        addDialog(me, 'resize');
                    }
                });
                $("#importInformation").hover(function () {
                    $(".icon-upload-alt").addClass("icon-upload-alt-hover");
                }, function () {
                    $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
                });
            },

            putbackImportBtn: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.unbind')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    id: 'putbackImport',
                    caption: '',
                    name: 'unbundlingImport',
                    title: '批量回收返修',
                    buttonicon:'icon-trash white',
                    position: 'last',
                    onClickButton: function () {
                        addDialog(me, 'putback');
                    }
                });
                $("#importInformation").hover(function () {
                    $(".icon-upload-alt").addClass("icon-upload-alt-hover");
                }, function () {
                    $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
                });
            },
            snBatchSearchBtn: function (grid) {
                var me = this;
                //if (!Ctx.avail('terminalsMgr.unbind')) {
                //    return;
                //}
                Opf.Grid.navButtonAdd(grid, {
                    id: 'snBatchSearch',
                    caption: '',
                    name: 'snBatchSearch',
                    title: '批量SN查询',
                    buttonicon:'icon-certificate white',
                    position: 'last',
                    onClickButton: function () {
                        addDialog(me, 'snSearch');
                    }
                });
                $("#importInformation").hover(function () {
                    $(".icon-upload-alt").addClass("icon-upload-alt-hover");
                }, function () {
                    $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
                });
            },


            unbundlingImportBtn: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.unbundlingImport')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    id: 'unbundlingImport',
                    caption: '',
                    name: 'unbundlingImport',
                    title: '导入解绑',
                    buttonicon: 'icon-unlink white',
                    position: 'last',
                    onClickButton: function () {
                        addDialog(me, 'unbundling');
                    }
                });
                $("#importInformation").hover(function () {
                    $(".icon-upload-alt").addClass("icon-upload-alt-hover");
                }, function () {
                    $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
                });
            },

            //调配终端，可选多个
            /**
             * 传给后台的参数
             * no: [],//终端号
             * targetTermUsed: ,//调配到哪个机构，机构号
             * */
            generateAllocateBtn: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.allocate')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    caption: '',//
                    id: "allocate",
                    name: "allocate",
                    title: '调配选中终端',
                    buttonicon: 'icon-retweet white',
                    position: "last",
                    onClickButton: function () {
                        var inBindNo = getInBindNo(me.grid);
                        if (me.grid.find('input.cbox:checked').length === 0) {
                            Opf.alert('请至少选择一行数据.');
                            return false;
                        }

                        //只可以调配未绑定状态的终端，如果用户选中的终端中包含其他状态的终端，则提示
                        if (inBindNo.length !== 0) {
                            showInBinddAlert(inBindNo);
                            return false;
                        }
                        var $dialog = Opf.Factory.createDialog(allocateTpl(me.grid), {
                            destroyOnClose: true,
                            title: '调配选中终端',
                            autoOpen: true,
                            width: 510,
                            modal: true,
                            buttons: [{
                                type: 'submit',
                                text: '调配',
                                click: function () {
                                    //如果 描述 为空，则提示用户填写 描述
                                    var operationDesc = $dialog.find('.operation-msg').val().trim();
                                    if (operationDesc === '') {
                                        $dialog.find('div[name="describe"]').show();
                                        return false;
                                    }
                                    if($dialog.find('.target-termused').select2('data') && $dialog.find('.target-termused').select2('data').code
                                       && $dialog.find('.target-termused').select2('data').code.indexOf('015') > -1){
                                        if(!$dialog.find('.target-oprDir').select2('data')){
                                            $dialog.find('div[name="oprNotice"]').css("visibility", "visible");
                                            return false;
                                        }
                                    }
                                    Opf.ajax({
                                        type: 'PUT',
                                        jsonData: {
                                            no: getBoxNo(me.grid),
                                            targetTermUsed: $dialog.find('.target-termused').select2('data').code,
                                            oprIdDir : $dialog.find('.target-oprDir').select2('data').value,
                                            desc: _.escape(operationDesc)
                                        },
                                        url: url._('terminals.mgr.allocate.terminal'),
                                        successMsg: '成功调配终端',
                                        success: function () {
                                            me.grid.trigger('reloadGrid', {current: true});
                                        },
                                        complete: function () {
                                            $dialog.dialog('close');
                                        }
                                    });
                                }
                            }, {
                                type: 'cancel'
                            }],
                            create: function () {
                                $(this).find('.operation-msg').on('click', function () {
                                    $dialog.find('div[name="describe"]').hide();
                                });
                            }
                        });

                        function allocateTpl(grid) {
                            var me = this;
                            //这里要判断是选中单个还是其他情况！
                            //如果选中多个则不生成终端列表，但要生成一段说明文字
                            var $tpl,
                                rowsData = getRowsData(grid),
                                multiple = rowsData.length !== 1;

                            $tpl = $(selTermTpl({
                                multiple: multiple,
                                items: rowsData,
                                termUsed: rowsData[0].termUsed,
                                length: rowsData.length
                            }));

                            //append 调配机构
                            var $targetTermUsed = $([
                                '<div class="target-termused-container">',
                                '<span class="desc">调配机构：</span>',
                                '<input class="target-termused">',
                                '</div>'
                            ].join(''));
                            var oprDirTpl = function(){
                                return [
                                    '<div class="target-oprDir-container">',
                                    '<span class="desc">直销网络拓展员选择：</span>',
                                    '<input class="target-oprDir">',
                                    '<div name="oprNotice" class="error-msg" style="color:red;text-indent:10em;visibility: hidden;">请选择拓展员',
                                    '</div>',
                                    '</div>'
                                ].join('');
                            };
                            //生成select2
                            $targetTermUsed.find('.target-termused').select2({
                                placeholder: '请选择调配至哪个机构',
                                minimumInputLength: 1,
                                dropdownAutoWidth: true,
                                ajax: {
                                    type: "get",
                                    url: url._('disc.mcht.model.brh'),
                                    dataType: 'json',
                                    data: function (term) { //page is one base
                                        return {
                                            kw: encodeURIComponent(term)
                                        };
                                    },
                                    results: function (data) { // 返回除分页信息外的内容，要正确过滤备选项就在这里操作

                                        return {
                                            results: data
                                        };
                                    }
                                },
                                // 如果不设ID，将不能选择列表，这个返回的字段是因例各异的，要根据具体情况而定
                                id: function (e) {
                                    return e.code;
                                },
                                //格式化备选项，显示给用户。对每一个数组元素都执行此方法，data即为数组元素
                                formatResult: function (data) {
                                    return '<span value="' + data.code + '" data-brhLevel="' + data.brhLevel + '">' + data.name + '</span>';
                                },
                                //选中之后显示的内容
                                formatSelection: function (data) {
                                    if(data.code.indexOf('015') == 0 ){
                                        var $oprDir =$(oprDirTpl());
                                        $('.target-oprDir-container').remove();
                                        $('.target-termused-container').after($oprDir);
                                        $oprDir.find('.target-oprDir').select2(getOprNameSelect2Options());
                                    }else{
                                        $('.target-oprDir-container').hide();
                                    }
                                    return '<span value="' + data.code + '" data-brhLevel="' + data.brhLevel + '">' + data.name + '</span>';
                                }
                            });

                            $tpl.find('.terminals-operation-msg').before($targetTermUsed);

                            //返回
                            return $tpl;
                        }
                    }
                });
            },

            generateUnbindTerminalBtn: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.unbindTerminal')) {
                    return false;
                }
                Opf.Grid.navButtonAdd(grid, {
                    caption: '',
                    id: "unbindTerminal",
                    name: "unbindTerminal",
                    title: '解绑选中终端',
                    buttonicon: "icon-unlock white",
                    position: "last",
                    onClickButton: function () {
                        if (me.grid.find('input.cbox:checked').length === 0) {
                            Opf.alert('请至少选择一行数据.');
                            return false;
                        }
                        var rowsData = _.map(me.grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
                            return me.grid.jqGrid('getRowData', id);
                        });
                        var unBindNo = getUnBindNo(me.grid);
                        if (unBindNo.length !== 0) {
                            showUnBinddAlert(unBindNo);
                            return false;
                        }
                        var $dialog = Opf.Factory.createDialog(selectTpl(), {
                            destroyOnClose: true,
                            title: '解绑选中终端',
                            autoOpen: true,
                            width: 510,
                            modal: true,
                            buttons: [{
                                type: 'submit',
                                text: '解绑',
                                click: function () {
                                    //如果 描述 为空，则提示用户填写 描述
                                    var operationDesc = $dialog.find('.operation-msg').val().trim();
                                    if (operationDesc === '') {
                                        $dialog.find('.error-msg').show();
                                        return false;
                                    }
                                    Opf.ajax({
                                        type: 'PUT',
                                        //jsonData: {
                                        //    boxSn: getBoxSn(rowsData),
                                        //    desc: _.escape(operationDesc)
                                        //},
                                        //url: url._('terminals.mgr.unbind.terminal'),
                                        jsonData: {
                                            no: getBoxNo(rowsData),
                                            flag: '1',
                                            desc: _.escape(operationDesc)
                                        },
                                        url: url._('mcht.terminals.status'),
                                        successMsg: '成功解绑终端',
                                        success: function () {
                                            me.grid.trigger('reloadGrid', {current: true});
                                        },
                                        complete: function () {
                                            $dialog.dialog('close');
                                        }
                                    });
                                }
                            }, {
                                type: 'cancel'
                            }],
                            create: function () {
                                $(this).find('.operation-msg').on('click', function () {
                                    $dialog.find('.error-msg').hide();
                                });
                            }
                        });

                        function selectTpl() {
                            return selTermTpl({items: rowsData});
                        }

                        function getBoxNo(rowDataArray) {
                            return _.map(rowDataArray, function (rowData) {
                                return rowData.no;
                            });
                        }

                    }
                });
            },

            machineReplaceBtn: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.unbind')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    id: 'machineReplace',
                    caption: '',
                    name: 'machineReplace',
                    title: '租机替换',
                    buttonicon:'icon-stackexchange white',
                    position: 'last',
                    onClickButton: function () {
                        addDialog(me, 'machineReplace');
                    }
                });
                $("#importInformation").hover(function () {
                    $(".icon-upload-alt").addClass("icon-upload-alt-hover");
                }, function () {
                    $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
                });
            },

            terminalStatusBySelect: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.terminalStatusBySelect')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    id: 'terminalStatusBySelect',
                    title: '终端变更用途',
                    name: 'terminalStatusBySelect',
                    caption: '',
                    buttonicon:'icon-random white',
                    position: 'last',
                    onClickButton: function () {
                        var rowsData = getInApplicationNo(grid);
                        if(_.isEmpty(rowsData)) {
                            Opf.alert("请至少选择一行非租机终端用途的数据");
                            return;
                        }

                        //只可以修改未绑定状态的终端，如果用户选中的终端中包含其他状态的终端，则提示
                        var inBindNo = getInBindNo(me.grid);
                        if (!_.isEmpty(inBindNo)) {
                            Opf.alert({title: '不能修改租机状态', message: '请先解绑下列终端：<br>' + inBindNo.join('、')});
                            return;
                        }
                        var $dialog = Opf.Factory.createDialog(allocateTpl(me.grid), {
                           destroyOnClose: true,
                            title:'终端变更用途',
                            autoOpen:true,
                            width: 650,
                            height: 300,
                            modal:true,
                            buttons:[{
                                type: 'submit',
                                text:'确定',
                                click: function(){
                                    var el = this;
                                    var arr = getOprId($(el).find('[name="trTermUsed"]'));
                                    if(arr == 'termUsedisnull'){
                                        Opf.alert('请选择直销拓展员!');
                                        return false;
                                    }
                                    //TODO 提交服务
                                    Opf.ajax({
                                        async: false,
                                        type:'PUT',
                                        jsonData:{
                                            no: getBoxNo(me.grid),
                                            oprId: arr
                                            //desc: _.escape(operationDesc)
                                        },
                                        url:url._('terminals.mgr.useadjust.terminal'),
                                        success:function(resp){
                                            if(resp.success){
                                                Opf.Toast.success('成功变更终端用途');
                                                me.grid.trigger('reloadGrid', {current: true});
                                            }
                                        },
                                        complete:function(){
                                            $dialog.dialog('close');
                                        }
                                    });
                                }
                            },{
                                type:'cancel'
                            }],
                            create: function(){
                                $(this).find('.operation-msg').on('click', function(){
                                   $dialog.find('.error-msg').hide();
                                });
                            }
                        });
                        function allocateTpl(grid){
                            var me = this;
                            //这里要判断是选中单个还是其他情况
                            //如果选中多个则不生成终端列表，但要生成一段说明文字
                            var $tpl,
                                rowsData = getRowsData(grid),
                                multiple = rowsData.length !== 1;
                            $tpl = $(changTermTpl({
                                multiple: multiple,
                                items: rowsData,
                                termUsed: rowsData[0].termUsed,
                                length:rowsData.length
                            }));

                            $tpl.find('.trTermUsed').select2(getOprNameSelect2Options());

                            return $tpl;
                        }
                        //function getBoxNo(rowDataArray) {
                        //    return _.map(rowDataArray, function (rowData) {
                        //        return rowData.no;
                        //    });
                        //}
                        function getBoxNo(grid) {
                            var rowsData = getRowsData(grid),
                                arr = [];
                            _.each(rowsData, function (rowData) {
                                arr.push(rowData.no);
                            });
                            return arr;
                        }
                        function getOprId(oprSelList){
                            var arr = [];
                            var result = true;
                            _.map(oprSelList,function(opr){
                                var str;
                                if($(opr).css('display') == 'block'){
                                    str = $(opr).select2('data') == null ? null : $(opr).select2('data').value;
                                    if(str != null){
                                        arr.push(str.toString());
                                    }
                                    else{
                                        result = false;//判断为空
                                    }
                                }
                            });
                            if(!result){
                                return 'termUsedisnull';
                            }
                            else{
                                return arr;
                            }
                        }
                        //Opf.confirm("确定要将选中的非租机批量修改为租机吗？", function(isOk) {
                        //    if(isOk) {
                        //        Opf.UI.setLoading(true);
                        //        Opf.ajax({
                        //            type: 'POST',
                        //            url: url._('terminals.mgr.adjust.terminal'),
                        //            jsonData: rowsData,
                        //            successMsg: '批量修改租机状态成功',
                        //            success: function() {
                        //                me.grid.trigger("reloadGrid", {current:true});
                        //            },
                        //            complete: function() {
                        //                Opf.UI.setLoading(false);
                        //            }
                        //        })
                        //    }
                        //});
                    }
                });
            },

            terminalStatusByImport: function (grid) {
                var me = this;
                if (!Ctx.avail('terminalsMgr.terminalStatusByImport')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    id: 'terminalStatusByImport',
                    title: '导入调整租机状态',
                    name: 'terminalStatusByImport',
                    caption: '',
                    buttonicon:'icon-xing white',
                    position: 'last',
                    onClickButton: function () {
                        uploader.doImport({
                            uploadTitle: '导入变更用途',
                            uploadUrl: url._('terminals.mgr.import.terminal'),
                            uploadTpl: url._('terminals.mgr.snnooprid.excel'),
                            uploadParams: [
                                {label:'操作规则：“仅非租机终端可变更用途，并且终端当前状态是未绑定，操作成功后终端用途变更为租机”。', type:'label'}
                            ],
                            cbSuccess: function(queueId){
                                me.grid.trigger("reloadGrid", {current:true});
                            }
                        });
                    }
                });
            },

            generateSNListBtn: function(grid){
                if(!Ctx.avail('terminalsMgr.terminalGenerateSNList')){
                    return;
                }

                var obj_snnoconfig, startValue, maxValue;

                Opf.ajax({
                    type: 'GET',
                    async: false,
                    url: 'api/mcht/terminals/getSnNoConfig',
                    success: function (resp) {
                        obj_snnoconfig = resp;
                    }
                });

                var tpl = _.template(['<form class="form-horizontal" style="overflow: hidden;">' ,
                                '<h5 style="color: #999;padding-left: 20px;" class="small">请选择SN类型：</h5>',
                                '<div class="form-group" style="margin: 20px 0 20px 53px;">' ,
                                    '<% _.each(data, function(v, i){%>',
                                        '<div class="radio" style="width: auto; float: left;">' ,
                                            '<label>' ,
                                                '<input type="radio" name="optionsRadios" value="<%=v.id %>"> &nbsp;<%=v.name %>&nbsp;&nbsp;' ,
                                            '</label>' ,
                                        '</div>' ,
                                    '<%});%>',
                                '</div>' ,
                                '<div class="form-group">' ,
                                    '<label class="col-xs-4 control-label" for="sn">开始SN号：</label>' ,
                                    '<div class="col-xs-6"><input id="begin_sn" name="begin_sn" class="form-control" type="text" placeholder="请输入开始SN号" value="<%=data[0].startValue%>" readonly /></div>',
                                '</div>',
                                '<div class="form-group">' ,
                                    '<label class="col-xs-4 control-label" for="number">生成数量：</label>' ,
                                    '<div class="col-xs-6"><input id="number" name="number" class="form-control" type="text" placeholder="请输入生成数量" /></div>',
                                '</div>',
                                '<div class="form-group">' ,
                                    '<label class="col-xs-4 control-label" for="sn">结束SN号：</label>' ,
                                    '<div class="col-xs-6"><input id="end_sn" name="end_sn" class="form-control" type="text" placeholder="请输入结束SN号" value="" readonly /></div>',
                                '</div>',
                                '<div class="form-group">' ,
                                    '<div class="col-xs-10" style="text-align: center;"><label style="color: red; font-size: 14px; font-weight: bold;">注意：结束SN号不能大于</label><label id="end_sn_warn" style="color: red; font-size: 14px; font-weight: bold;"><%=data[0].maxValue%></label></div>',
                                '</div>',
                                '<div class="form-group" hidden>' ,
                                    '<div style="text-align: center;"><span>生成成功，<a href="javascript:void(0)">点击此处下载</a></span></div>',
                                '</div>',
                    '</form>'].join(''));

                Opf.Grid.navButtonAdd(grid, {
                    id: 'terminalGenerateSNList',
                    title: '二维码URL生成器',
                    name: 'terminalGenerateSNList',
                    caption: '',
                    buttonicon: 'icon-building white',
                    position: 'last',
                    onClickButton: function(){
                         var $dialog = Opf.Factory.createDialog(tpl({ data: obj_snnoconfig }), {
                            destroyOnClose: true,
                            title: '二维码URL生成器',
                            width: 430,
                            height: 400,
                            autoOpen: true,
                            modal: true,
                            buttons: [{
                                type: 'submit',
                                text: '生成',
                                click: function () {
                                    var me = this;
                                    var valid = $(this).valid();
                                    if(valid){
                                        $(this).find('div[class="form-group"]:last').hide();
                                        var number = $(this).find('input[id="number"]').val();
                                        var rd_id = $("input[name='optionsRadios']:checked").val();

                                        if(parseInt($(me).find('input[id="end_sn"]').val()) > parseInt($(me).find('#end_sn_warn').html())){
                                            Opf.alert('结束SN号不能大于'+$(me).find('#end_sn_warn').html());
                                            return false;
                                        }

                                        Opf.UI.setLoading($(this));
                                        $(me).parent().find('.ui-dialog-buttonset button[type="submit"]').attr("disabled", "disabled");

                                        Opf.ajax({
                                            url: url._('terminals.mgr.sn-downloadUrl'),
                                            type: 'GET',
                                            data: {
                                                id: rd_id,
                                                amount: number
                                            },
                                            success: function(res){
                                                $(me).find('div[class="form-group"]:last').show();
                                                $(me).find('div[class="form-group"]:last a').attr("data-download", res.url);
                                                $("a[data-download]").off('click').on('click', function(target){
                                                    var url = $(target.delegateTarget).attr("data-download");
                                                    Opf.download(url);
                                                });

                                                Opf.ajax({
                                                    type: 'GET',
                                                    async: false,
                                                    url: 'api/mcht/terminals/getSnNoConfig',
                                                    success: function (resp) {
                                                        obj_snnoconfig = resp;

                                                        //$('[name="optionsRadios"]').removeAttr('checked', 'checked');
                                                        //默认选中radio第一个值
                                                        $(me).find('[name="optionsRadios"]:eq(0)').prop('checked',true);
                                                        //生成后更新控件
                                                        $(me).find('input[id="begin_sn"]').val(resp[0].startValue);
                                                        $(me).find('[name="number"]').val('');
                                                        $(me).find('input[id="end_sn"]').val('');
                                                        $(me).find('#end_sn_warn').empty().html(resp[0].maxValue);
                                                    }
                                                });
                                            },
                                            complete: function(){
                                                Opf.UI.setLoading($(me), false);
                                                $(me).parent().find('.ui-dialog-buttonset button[type="submit"]').removeAttr("disabled");
                                            }
                                        });
                                    }
                                }
                            },{
                                type: 'cancel'
                            }],
                            create: function(){
                                var me = this;

                                Opf.Validate.addRules($(this), {
                                    rules: {
                                        sn: {
                                            required: true
                                        },
                                        number: {
                                            required: true,
                                            min: 1,
                                            max: 10000000
                                        }
                                    },
                                    messages: {
                                        number: {
                                            max: '数值不允许大于100万！'
                                        }
                                    }
                                });

                                //默认选中radio第一个值
                                $(me).find('[name="optionsRadios"]:eq(0)').prop('checked',true);
                                //radio改变sn值
                                $(me).find('input[name="optionsRadios"]').on('change', function(el){
                                    var model = _.findWhere(obj_snnoconfig, { id: parseInt(el.target.value) });
                                    $(me).find('input[id="begin_sn"]').val(model.startValue);
                                    $(me).find('#end_sn_warn').empty().html(model.maxValue);
                                });
                                //生成数量触发
                                $(me).find('[name="number"]').on('change', function(el){
                                    var _begin_sn = $(me).find('input[id="begin_sn"]').val();
                                    $(me).find('input[id="end_sn"]').val(parseInt(el.target.value) + (parseInt(_begin_sn) - 1));//开始号+（数量-1）
                                });
                            }
                        });
                    }
                });
            }
        });

    });

    //获取除了未绑定状态之外其他状态的终端号
    function getInBindNo(grid) {
        var rowsData = getRowsData(grid),
            arr = [];
        _.each(rowsData, function (rowData) {
            if (rowData.status.toString() !== '1') {
                arr.push(rowData.no);
            }
        });
        return arr;
    }

    //获取非租机状态之外其他状态的终端号
    function getInApplicationNo(grid) {
        var rowsData = getRowsData(grid),
            arr = [];
        _.each(rowsData, function (rowData) {
            if (rowData.application.toString() !== '1') {
                arr.push(rowData.no);
            }
        });
        return arr;
    }

    //提示先解绑
    function showInBinddAlert(inBindNo) {
        Opf.alert({title: '不能执行调配操作', message: '请先解绑下列终端：<br>' + inBindNo.join('、')});
    }


    //获取正在使用状态
    function getUnBindNo(grid) {
        var rowsData = getRowsData(grid),
            arr = [];
        _.each(rowsData, function (rowData) {
            if (rowData.status.toString() !== '0') {
                arr.push(rowData.no);
            }
        });
        return arr;
    }

    //提示先解绑
    function showUnBinddAlert(unBindNo) {
        Opf.alert({title: '不能执行解绑操作', message: '下列终端不是绑定状态：<br>' + unBindNo.join('、')});
    }

    function getBoxNo(grid) {
        var rowsData = getRowsData(grid);
        return _.map(rowsData, function (rowData) {
            return rowData.no;
        });
    }

    function loadBranchNo(data, rowId, rowData) {
        if (rowData.brhName == null || rowData.branchNo == null) {
            return '';
        }
        else {
            return rowData.brhName + '(' + rowData.branchNo + ')';
        }
    }

    function loadTermUsedName(data, rowId, rowData) {
        if (rowData.termUsedName == null || rowData.termUsed == null) {
            return '';
        }
        else {
            return rowData.termUsedName + '(' + rowData.termUsed + ')';
        }
    }

    function showChangeStateDialog(me, rowData) {
        var $dialog = Opf.Factory.createDialog(stateFormTpl(), {
            destroyOnClose: true,
            title: '状态变更',
            autoOpen: true,
            width: Opf.Config._('ui', 'terminalsMgr.grid.changestate.form.width'),
            height: Opf.Config._('ui', 'terminalsMgr.grid.changestate.form.height'),
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $(this).find('[name="state"]');
                    var oldState = rowData.status;
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();
                    if (oldState != newState) {
                        var addConfirmMessage = '';
                        //一共有三种情况需要额外增加说明：1.正常 -> 停用；2.停用 -> 正常；3.正常/停用 -> 注销
                        //标识为  0：正常使用；2：停用；3：注销
                        if (newState == '3') {
                            addConfirmMessage = '改为注销后，终端账号将被删除！';
                        }
                        if (oldState == '0' && newState == '2') {
                            addConfirmMessage = '改为停用后，终端将不能正常使用！';
                        }
                        if (oldState == '2' && newState == '0') {
                            addConfirmMessage = '改为正常后，终端可恢复使用！';
                        }
                        Opf.confirm('您确定更改终端状态为 "' + selSateTxt + '" 吗？<br><br> ' + addConfirmMessage, function (result) {
                            if (result) {
                                //TODO block target
                                Opf.ajax({
                                    type: 'PUT',
                                    jsonData: {
                                        oldStatus: oldState,
                                        newStatus: newState
                                    },
                                    url: url._('terminals.mgr.changestate', {id: rowData.id}),
                                    successMsg: '更改终端状态成功',
                                    success: function () {
                                        me.grid.trigger('reloadGrid', {current: true});
                                    },
                                    complete: function () {
                                        $dialog.dialog('close');
                                    }
                                });
                            }
                        });
                    } else {
                        $(this).dialog('close');
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                $(this).find('[name="state"]').val(rowData.status);
            }
        });
    }

    function stateFormTpl() {
        var str = [
            '<form onsubmit="return false;" >',
            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
            '<tbody>',
            '<tr class="FormData">',
            '<td class="CaptionTD" style="padding-right:10px;">终端状态:</td>',
            '<td class="DataTD">',
            '&nbsp;',
            '<select role="select" name="state" size="1" class="FormElement ui-widget-content ui-corner-all">',
            '<option value="0">正常使用</option>',
            '<option value="2">停用</option>',
            '<option value="3">注销</option>',
            '</select>',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>',
            '</form>'
        ].join('');

        return str;
    }

    function addDialog(me, dialogname) {
        var titleName = null;

        var uploader, tpl = null;

        if (dialogname == 'generate') {
            titleName = {0: '批量导入'};
            uploader = tpl = uploadFileTpl({
                data: titleName
            });
            var $dialog = Opf.Factory.createDialog(tpl, {
                destroyOnClose: true,
                autoOpen: true,
                width: 450,
                height: 420,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function (e) {
                        //upload file
                        var termFactory = $dialog.find('[name="termFactory"]').val(),
                            termMachType = $dialog.find('[name="termMachType"]').val(),
                            termApp = $dialog.find('[name="termApp"]').val(),//终端用途
                            select2Obj = $dialog.find('.termUsed').select2('data'),
                            termUsed = select2Obj && select2Obj.id,

                            oprObj = $dialog.find('.oprSelectDir').select2('data')||{value:""},
                            oprIdDir = select2Obj && oprObj.value||"",
                            fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);
                        var id = null;
                        if(termMachType != null){
                            id = _.findWhere(arrResponse, {
                                "termFactory": termFactory,
                                "termMachType": termMachType
                            })["id"];
                        }

                        var postData = {typeId: id, termUsed: termUsed,application:termApp};
                        if(oprIdDir){
                            postData.oprIdDir = oprIdDir;
                        }
                        if (fileSelected && termUsed) {
                            //如果挂属机构选择015001，直销拓展员不能为空
                            if(select2Obj.id.indexOf('015') > -1 && !oprIdDir){
                                $("label[for='uploadfile']").addClass("error").text("请选择拓展员");
                            }else {
                                uploader.setData(postData);
                                uploader.submit();
                            }
                        } else if (termUsed) {
                            $("label[for='uploadfile']").addClass("error").text("请选择文件");
                        } else {
                            $("label[for='uploadfile']").addClass("error").text("请选择终端所属机构");
                        }
                    }
                }, {
                    type: 'cancel'
                }],
                create: function () {
                    var $me = $(this),
                        $indicator = $me.find('.uploadFileIndicator'),
                        $trigger = $me.find('.uploadfile'),
                        $termUsed = $me.find('.termUsed'),
                        $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                    uploader = new Uploader({
                        data: {},
                        name: 'file',
                        trigger: $trigger,
                        action: url._('terminals.import.file'),
                        accept: '.xls, .xlsx',
                        change: function () {
                            $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                        },
                        beforeSubmit: function () {
                            Opf.UI.busyText($submitBtn);
                            $indicator.show();
                        },
                        complete: function () {
                            $indicator.hide();
                            Opf.UI.busyText($submitBtn, false);
                        },
                        progress: function (queueId, event, position, total, percent) {
                            if (percent) {
                                $indicator.find('.progress-percent').text(percent + '%').show();
                            }
                        },
                        success: function (queueId, resp) {
                            if (resp.success === false) {
                                if(resp.data == undefined){
                                    Opf.alert({title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败'});
                                }
                                else{
                                    Opf.alert({
                                        title: '文件格式不合法',
                                        message: resp.msg ? '导入数据有异常，'+ '<a href="'+resp.data+'">点击下载查看详情！</a>' + '请先下载上传模板。' : '上传失败'//resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败'
                                    });
                                }
                            }
                            else {
                                Opf.Toast.success('导入成功.');
                                me.grid.trigger("reloadGrid", [{current: true}]);
                                $me.dialog("destroy");
                            }

                        }
                    });

                    Opf.ajax({
                        url: url._('terminals.mgr.options'),
                        type: 'GET',
                        success: function (resp) {
                            createOptions(resp);
                        }
                    });
                    createTermAppOpt();
                    attatchChangeEvent($(this).find('[name="termFactory"]'));

                    // 下载按钮
                    $(this).find('.download-btn').click(function (event) {
                        Opf.UI.setLoading($('#page-content'), true);
                        Opf.ajax({
                            url: url._('terminals.mgr.download.tpl'),
                            success: function (resp) {
                                Opf.download(resp.data);
                            },

                            error: function (resp) {
                                console.log("downlaod template error");
                            },

                            complete: function (resp) {
                                Opf.UI.setLoading($(event.target).closest('#page-content'), false);
                            }
                        });
                    });


                    $termUsed.select2(_.result(me, 'getSelect2Options'));

                }
            });
        }
        else if (dialogname == 'resize') {//导入调整
            titleName = {0: '导入调整'};
            uploader = tpl = uploadFileTpl({
                data: titleName
            });
            var $dialog = Opf.Factory.createDialog(tpl, {
                destroyOnClose: true,
                autoOpen: true,
                width: 450,
                height: 420,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function (e) {
                        var termFactory = $dialog.find('[name="termFactory"]').val(),
                            termMachType = $dialog.find('[name="termMachType"]').val(),
                        //id = _.findWhere(arrResponse,{ "termFactory" : termFactory, "termMachType" : termMachType})["id"],
                            select2Obj = $dialog.find('.termUsed').select2('data'),
                            termUsed = select2Obj && select2Obj.id;
                        var postData = { termUsed: termUsed};


                        var oprObj = $dialog.find('.oprSelectDir').select2('data') || {value: ""},
                            oprIdDir = select2Obj && oprObj.value || "",
                            fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);

                        if (oprIdDir) {
                            postData.oprIdDir = oprIdDir;
                        }

                        if (fileSelected && termUsed) {
                            //uploader.setData({typeId:id, termUsed: termUsed});
                            //如果挂属机构选择015001，直销拓展员不能为空
                            if(select2Obj.id.indexOf('015') > -1 && !oprIdDir){
                                $("label[for='uploadfile']").addClass("error").text("请选择拓展员");
                            }else {
                                uploader.setData(postData);
                                uploader.submit();
                            }
                        } else if (termUsed) {
                            $("label[for='uploadfile']").addClass("error").text("请选择文件");
                        } else {
                            $("label[for='uploadfile']").addClass("error").text("请选择终端所属机构");
                        }
                    }
                }, {
                    type: 'cancel'
                }],
                create: function () {
                    var $me = $(this),
                        $indicator = $me.find('.uploadFileIndicator'),
                        $trigger = $me.find('.uploadfile'),
                        $termUsed = $me.find('.termUsed'),
                        $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                    uploader = new Uploader({
                        data: {},
                        name: 'file',
                        trigger: $trigger,
                        action: url._('terminals.adjust.file'),
                        accept: '.xls, .xlsx',
                        change: function () {
                            $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                        },
                        beforeSubmit: function () {
                            Opf.UI.busyText($submitBtn);
                            $indicator.show();
                        },
                        complete: function () {
                            $indicator.hide();
                            Opf.UI.busyText($submitBtn, false);
                        },
                        progress: function (queueId, event, position, total, percent) {
                            if (percent) {
                                $indicator.find('.progress-percent').text(percent + '%').show();
                            }
                        },
                        success: function (queueId, resp) {
                            if (resp.success === false) {
                                Opf.alert({title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败'});
                            } else {
                                me.grid.trigger("reloadGrid", [{current: true}]);
                                $me.dialog("destroy");
                                Opf.alert({title: '上传成功', message: resp.msg});
                            }

                        }
                    });

                    Opf.ajax({
                        url: url._('terminals.mgr.options'),
                        type: 'GET',
                        success: function (resp) {
                            createOptions(resp);
                        }
                    });
                    createTermAppOpt();
                    attatchChangeEvent($(this).find('[name="termFactory"]'));

                    // 下载按钮
                    $(this).find('.download-btn').click(function (event) {
                        Opf.UI.setLoading($('#page-content'), true);
                        Opf.ajax({
                            url: url._('terminals.mgr.newdownload.tpl'),
                            success: function (resp) {
                                Opf.download(resp.data);
                            },

                            error: function (resp) {
                                console.log("downlaod template error");
                            },

                            complete: function (resp) {
                                Opf.UI.setLoading($(event.target).closest('#page-content'), false);
                            }
                        });
                    });


                    $termUsed.select2(_.result(me, 'getSelect2Options'));


                }
            });
        }
        else if (dialogname == 'unbundling') {//导入解绑
            titleName = {0: '导入解绑'};
            uploader = tpl = uploadFileTpl({
                data: titleName
            });
            var $dialog = Opf.Factory.createDialog(tpl, {
                destroyOnClose: true,
                autoOpen: true,
                width: 450,
                height: 420,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function (e) {
                        var termFactory = $dialog.find('[name="termFactory"]').val(),
                            termMachType = $dialog.find('[name="termMachType"]').val(),
                            fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);

                        if (fileSelected) {
                            uploader.submit();
                        }
                        else {
                            $("label[for='uploadfile']").addClass("error").text("请选择文件");
                        }
                    }
                }, {
                    type: 'cancel'
                }],
                create: function () {
                    var $me = $(this),
                        $indicator = $me.find('.uploadFileIndicator'),
                        $trigger = $me.find('.uploadfile'),
                        $termUsed = $me.find('.termUsed'),
                        $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                    uploader = new Uploader({
                        data: {},
                        name: 'file',
                        trigger: $trigger,
                        action: url._('terminals.unbind.file'),
                        accept: '.xls, .xlsx',
                        change: function () {
                            $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                        },
                        beforeSubmit: function () {
                            Opf.UI.busyText($submitBtn);
                            $indicator.show();
                        },
                        complete: function () {
                            $indicator.hide();
                            Opf.UI.busyText($submitBtn, false);
                        },
                        progress: function (queueId, event, position, total, percent) {
                            if (percent) {
                                $indicator.find('.progress-percent').text(percent + '%').show();
                            }
                        },
                        success: function (queueId, resp) {
                            if (resp.success === false) {
                                Opf.alert({title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败'});
                            } else {
                                me.grid.trigger("reloadGrid", [{current: true}]);
                                $me.dialog("destroy");
                                Opf.alert({title: '上传成功', message: resp.msg});
                            }

                        }
                    });

                    Opf.ajax({
                        url: url._('terminals.mgr.options'),
                        type: 'GET',
                        success: function (resp) {
                            createOptions(resp);
                        }
                    });
                    attatchChangeEvent($(this).find('[name="termFactory"]'));

                    // 下载按钮
                    $(this).find('.download-btn').click(function (event) {
                        Opf.UI.setLoading($('#page-content'), true);
                        Opf.ajax({
                            url: url._('terminals.mgr.newdownload.tpl'),
                            success: function (resp) {
                                Opf.download(resp.data);
                            },

                            error: function (resp) {
                                console.log("downlaod template error");
                            },

                            complete: function (resp) {
                                Opf.UI.setLoading($(event.target).closest('#page-content'), false);
                            }
                        });
                    });


                    $termUsed.select2(_.result(me, 'getSelect2Options'));


                }
            });
        }
        else if (dialogname == 'putback') {//批量回收返修
            titleName = {0: '批量回收返修'};
            uploader = tpl = uploadFileTpl({
                data: titleName
            });
            var $dialog = Opf.Factory.createDialog(tpl, {
                destroyOnClose: true,
                autoOpen: true,
                width: 450,
                height: 420,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function (e) {
                        var termFactory = $dialog.find('[name="termFactory"]').val(),
                            termMachType = $dialog.find('[name="termMachType"]').val(),
                            fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true),
                            desc = $('textarea[name="desc"]').val().trim();

                        if (fileSelected == true && desc != '') {
                            if (desc.length > 42) {
                                $("label[for='uploadfile']").addClass("error").text("字数不能超过42");
                                $('textarea[name="desc"]').val('');
                            }
                            else {
                                uploader.setData({desc: desc});
                                uploader.submit();
                                $('textarea[name="desc"]').val('');
                            }
                        }
                        else {
                            if (desc == '') {
                                $("label[for='uploadfile']").addClass("error").text("请填写回收原因");
                            }
                            else {
                                $("label[for='uploadfile']").addClass("error").text("请选择文件");
                            }

                        }
                    }
                }, {
                    type: 'cancel'
                }],
                create: function () {
                    var $me = $(this),
                        $indicator = $me.find('.uploadFileIndicator'),
                        $trigger = $me.find('.uploadfile'),
                        $termUsed = $me.find('.termUsed'),
                        $desc = $('textarea[name="desc"]').val(),
                        $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');

                    uploader = new Uploader({
                        data: {},
                        name: 'file',
                        trigger: $trigger,
                        action: url._('terminals.putback.file'),
                        accept: '.xls, .xlsx',
                        change: function () {
                            $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                        },
                        beforeSubmit: function () {
                            Opf.UI.busyText($submitBtn);
                            $indicator.show();
                        },
                        complete: function () {
                            $indicator.hide();
                            Opf.UI.busyText($submitBtn, false);
                        },
                        progress: function (queueId, event, position, total, percent) {
                            if (percent) {
                                $indicator.find('.progress-percent').text(percent + '%').show();
                            }
                        },
                        success: function (queueId, resp) {
                            if (resp.success === false) {
                                $("label[for='uploadfile']").addClass("error").text('');
                                Opf.alert({title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败'});
                            } else {
                                me.grid.trigger("reloadGrid", [{current: true}]);
                                $me.dialog("destroy");
                                Opf.alert({title: '上传成功', message: resp.msg});
                            }
                        }
                    });

                    Opf.ajax({
                        url: url._('terminals.mgr.options'),
                        type: 'GET',
                        success: function (resp) {
                            createOptions(resp);
                        }
                    });
                    attatchChangeEvent($(this).find('[name="termFactory"]'));

                    // 下载按钮
                    $(this).find('.download-btn').click(function (event) {
                        Opf.UI.setLoading($('#page-content'), true);
                        Opf.ajax({
                            url: url._('terminals.mgr.newdownload.tpl'),
                            success: function (resp) {
                                Opf.download(resp.data);
                            },

                            error: function (resp) {
                                console.log("downlaod template error");
                            },

                            complete: function (resp) {
                                Opf.UI.setLoading($(event.target).closest('#page-content'), false);
                            }
                        });
                    });
                    $termUsed.select2(_.result(me, 'getSelect2Options'));
                }
            });
        }
        else if (dialogname == 'snSearch') {//批量SN查询
            titleName = {0: 'SN批量查询'};
            uploader = tpl = uploadFileTpl({
                data: titleName
            });
            var $dialog = Opf.Factory.createDialog(tpl, {
                destroyOnClose: true,
                autoOpen: true,
                width: 450,
                height: 420,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function (e) {
                        var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);

                        if (fileSelected) {
                            uploader.submit();
                        }
                        else {
                            $("label[for='uploadfile']").addClass("error").text("请选择文件");
                        }
                    }
                }, {
                    type: 'cancel'
                }],
                create: function () {
                    var $me = $(this),
                        $indicator = $me.find('.uploadFileIndicator'),
                        $trigger = $me.find('.uploadfile'),
                        $termUsed = $me.find('.termUsed'),
                        $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                    uploader = new Uploader({
                        data: {},
                        type: 'GET',
                        name: 'file',
                        trigger: $trigger,
                        action: url._('terminals.snsearch.file'),
                        accept: '.xls, .xlsx',
                        change: function () {
                            $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                        },
                        beforeSubmit: function () {
                            Opf.UI.busyText($submitBtn);
                            $indicator.show();
                        },
                        complete: function () {
                            $indicator.hide();
                            Opf.UI.busyText($submitBtn, false);
                            $(me.grid).jqGrid('setGridParam',{postData:{size:100},reccount:100,rowNum:'100'});
                        },
                        progress: function (queueId, event, position, total, percent) {
                            if (percent) {
                                $indicator.find('.progress-percent').text(percent + '%').show();
                            }
                        },
                        success: function (queueId, resp) {
                            $me.dialog("destroy");
                            $('body').removeClass('fixed-body');
                            $(me.grid).jqGrid('setGridParam',{postData:{size:10000},reccount:10000,rowNum:'10000'});
                            //window.grid = me.grid;
                            //$('.ui-pg-selbox').append('<option role="option" value="10000" selected="true">10000</option>');
                            me.grid[0].addJSONData(resp);
                            var snList = resp.content.length == 0 ? '': resp.content[0].snList;
                            $(me.grid).jqGrid('setGridParam',{snList:snList});

                            //if (resp.success === false) {
                            //    Opf.alert({title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败'});
                            //} else {
                            //    //me.grid.trigger("reloadGrid", [{current: true}]);
                            //    $me.dialog("destroy");
                            //    Opf.alert({title: '上传成功', message: resp.msg});
                            //}

                        }
                    });

                    // 下载按钮
                    $(this).find('.download-btn').click(function (event) {
                        Opf.UI.setLoading($('#page-content'), true);
                        Opf.ajax({
                            url: url._('terminals.mgr.snsearch.excel'),
                            success: function (resp) {
                                Opf.download(resp.data);
                            },

                            error: function (resp) {
                                console.log("downlaod template error");
                            },

                            complete: function (resp) {
                                Opf.UI.setLoading($(event.target).closest('#page-content'), false);
                            }
                        });
                    });


                    $termUsed.select2(_.result(me, 'getSelect2Options'));


                }
            });
        }
        else if (dialogname == 'machineReplace') {
            titleName = {0: '租机替换'};
            uploader = tpl = uploadFileTpl({
                data: titleName
            });
            var $dialog = Opf.Factory.createDialog(tpl, {
                destroyOnClose: true,
                autoOpen: true,
                width: 450,
                height: 420,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function (e) {
                         var    fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);

                        if (fileSelected) {
                            uploader.submit();
                        }
                        else {
                            $("label[for='uploadfile']").addClass("error").text("请选择文件");
                        }
                    }
                }, {
                    type: 'cancel'
                }],
                create: function () {
                    var $me = $(this),
                        $indicator = $me.find('.uploadFileIndicator'),
                        $trigger = $me.find('.uploadfile'),
                        $termUsed = $me.find('.termUsed'),
                        $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                    uploader = new Uploader({
                        data: {},
                        type: 'GET',
                        name: 'file',
                        trigger: $trigger,
                        action: url._('terminals.replterm.file'),
                        accept: '.xls, .xlsx',
                        change: function () {
                            $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                        },
                        beforeSubmit: function () {
                            Opf.UI.busyText($submitBtn);
                            $indicator.show();
                        },
                        complete: function () {
                            $indicator.hide();
                            Opf.UI.busyText($submitBtn, false);
                        },
                        progress: function (queueId, event, position, total, percent) {
                            if (percent) {
                                $indicator.find('.progress-percent').text(percent + '%').show();
                            }
                        },
                        success: function (queueId, resp) {
                            if (resp.success === false) {
                                Opf.alert({title: '提示', message: resp.msg });
                            } else {
                                $me.dialog("destroy");
                                me.grid[0].addJSONData(resp);
                            }

                        }
                    });

                    // 下载按钮
                    $(this).find('.download-btn').click(function (event) {
                        Opf.UI.setLoading($('#page-content'), true);
                        Opf.ajax({
                            url: url._('terminals.mgr.replterm.excel'),
                            success: function (resp) {
                                Opf.download(resp.data);
                            },

                            error: function (resp) {
                                console.log("downlaod template error");
                            },

                            complete: function (resp) {
                                Opf.UI.setLoading($(event.target).closest('#page-content'), false);
                            }
                        });
                    });


                    $termUsed.select2(_.result(me, 'getSelect2Options'));


                }
            });
        }

    }

    function attatchChangeEvent($selectTermFactory) {
        $selectTermFactory.on('change', function () {
            console.log("change termfactory");
            createOptionsForTermMachType(arrResponse, $selectTermFactory.val());
        });
    }
    //生成终端用途select
    function createTermAppOpt(){
        var $termAppSelect = $("select[name='termApp']");
        $.each(use_MAP,function(key,val){
            $termAppSelect.append('<option value="' + key + '">' + val + '</option>');
        });
    }
    function createOptions(resp) {
        var arrTermFactory = [],
            termFactoryDefaultVal = "盒子支付"
            ;
        if (arrResponse.length === 0) {
            arrResponse = resp;
        }
        arrTermFactory = _.uniq(_.pluck(resp, "termFactory"));
        $("select[name='termFactory']").append('<option class="placeholder" style="display: none;" selected disabled>请选择终端厂商</option>');
        _.each(arrTermFactory, function (value) {
            $("select[name='termFactory']").append('<option value="' + value + '" '+ (value==termFactoryDefaultVal?"selected":"") +'>' + value + '</option>');
        });
        createOptionsForTermMachType(resp, _.contains(arrTermFactory,termFactoryDefaultVal)?termFactoryDefaultVal:arrTermFactory[0]);
    }

    function createOptionsForTermMachType(arrResponse, termFactory) {
        var arr = _.where(arrResponse, {'termFactory': termFactory});
        $("select[name='termMachType']").empty().append('<option class="placeholder" style="display: none;" selected disabled>请选择终端机型</option>');
        _.each(arr, function (item) {
            $("select[name='termMachType']").append('<option value="' + item['termMachType'] + '">' + item['termMachType'] + '</option>');
        });
    }

    function ajaxGetOptions() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            url: url._('terminals.mgr.options'),
            success: function (resp) {
                createOptions(resp);
            },
            error: function (resp) {
                console.error(resp);
            }
        });
    }

    function txDateFormatter(val, options, rowData) {
        var txTime = rowData.txTime.replace(/(\d{2})(\d{2})/g, '$1:$2:');
        return (val || '') + ' ' + (txTime || '');
    }

    //获取被选中的行包含的数据
    function getRowsData(grid) {
        return _.map(grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
            return grid.jqGrid('getRowData', id);
        });
    }
    function getDirTpl(){//opr-select-row oprSelect
            return [
                '<tr class="target-oprDir-container opr-select-row" style="display: none;">',
                '<td class="CaptionTD">直销网络拓展员选择：</td>',
                '<td class="DataTD">',
                '<input type="text" id="oprIdDir" name="oprIdDir" role="textbox" class="FormElement ui-widget-content ui-corner-all oprSelectDir">',
                '</td>',
                '</tr>'
            ].join('');
    }
    function terminalStatusFormatter(val) {
        return TERMINALSTATUS_MAP[val];
    }

    function terminalTypeFormatter(val) {
        return TERMINALTYPE_MAP[val] || '';
    }
    function getOprNameSelect2Options() {
        return {
            placeholder: '直销网络拓展员选择',
            minimumInputLength: 1,
            ajax: {
                type: "get",
                url: url._('terms.dirname.search'),
                dataType: 'json',
                data: function (term) {
                    return{ name: term }
                },
                results: function (data, page) { // 返回除分页信息外的内容，要正确过滤备选项就在这里操作
                    return { results: data };
                }
            },
            // 如果不设ID，将不能选择列表
            id: function (e) {
                return e.value;
            },
            //格式化备选项，显示给用户。对每一个数组元素都执行此方法，data即为数组元素
            formatResult: function (data, container, query, escapeMarkup) {
                return data.oprName;
            },
            //选中之后显示的内容
            formatSelection: function (data, container, escapeMarkup) {
                //var orgLevel = Ctx.getUser().get('brhLevel');
                ////可选同级或下级
                if(data.oprName !== ""){
                    $('label[for="oprIdDir"]').remove();
                }
                return data.oprName;
            }
        };
    }
    return App.TerminalsApp.TerminalsMgrApp.List.View;

});