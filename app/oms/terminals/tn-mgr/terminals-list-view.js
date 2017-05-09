/**
 * Created by zhuyimin on 2015/1/8.
 */
/**
 * terminals jqgrid view*/

define([
    'tpl!app/oms/terminals/tn-mgr/templates/terminalsMgr.tpl',
    'tpl!app/oms/terminals/tn-mgr/templates/uploadFile.tpl',
    'i18n!app/oms/common/nls/terminals',
    'tpl!app/oms/terminals/tn-mgr/templates/selectedTerminal.tpl',
    'select2',
    'upload',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function (TerminalsMgrTpl, uploadFileTpl, terminalsLang, selTermTpl) {

    "use strict";

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
        },

        OPERATION_FLAG = {
            'recall': '0',
            'unbind': '1',
            'disable': '2'
        },

        arrResponse = [];
    var checkStatus_MAP = {
        '0': '未考核',
        '1': '考核中',
        '2': '考核暂停',
        '3': '考核结束'
    };
    var use_MAP = {
        '0': '其它',
        '1': '租机',
        '2': '购买',
        '3': '赠送'
    }

    var View = Marionette.ItemView.extend({
        template: TerminalsMgrTpl,

        events: {
            'click .terminals-back-to-agent': 'backToAgent'
        },



        initialize: function (options) {
            this.options = options;
            this.render();
        },

        onRender: function () {
            var me = this;

            if(me.options.renderTo){
                me.$el.appendTo(me.options.renderTo);
                me.renderGrid();
            }

        },

        renderGrid: function () {
            var me = this;

            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function (form) {
                Opf.Validate.addRules(form, {
                    rules: {
                        snNo: {
                            required: true
                            , maxlength: 24
                        },
                        //要对select2 作验证，选择添加 select2 前 input 的 name
                        termUsed: {
                            required: true
                        }
                    }
                });
            };

            var grid = me.grid = App.Factory.createJqGrid({
                emptyrecords: '没有查询到相关的POS机',
                rsId: 'terminalsMgr',
                caption: terminalsLang._('terminalsMgr.txt'),
                actionsCol: {
                    edit: false,
                    del: false
                },
                nav: {
                    view: {
                        height: 420,
                        beforeShowForm: function (form) {
                            var selectId = Opf.Grid.getLastSelRowId(grid),
                                rowData = grid._getRecordByRowId(selectId),
                                tmpHtml;
                            Opf.ajax({
                                type: 'GET',
                                url: url._('mcht.terminals.log',{no: rowData.no}),
                                success: function(resp){
                                    require(['tpl!app/oms/terminals/tn-mgr/templates/termialsOprLog.tpl'], function(tpl){
                                        tmpHtml = tpl({items: resp});
                                        $(form).append(tmpHtml);
                                    });
                                }
                            });
                        }
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

                            addValidateRules(form);
                        },
                        onclickSubmit: function (params, postdata) {
                            var id,
                                termFactory = $('select[name="termFactory"]').val(),
                                termMachType = $('select[name="termMachType"]').val(),
                                $termUsed = $('#termUsed');

                            delete postdata['type'];
                            delete postdata['termMachType'];
                            delete postdata['termFactory'];

                            id = _.findWhere(arrResponse, {
                                "termFactory": termFactory,
                                "termMachType": termMachType
                            })["id"];
                            postdata['typeId'] = id;
                            postdata['termUsed'] = $termUsed.select2('data') && $termUsed.select2('data').id;
                            return postdata;
                        },
                        beforeSubmit: setupValidation
                    },

                    search: {

                        afterRedraw: function(){
                            //不能让用户查询到别的机构的终端

                            //不能选 任一 查询条件，
                            $(this).find('select.opsel').prop('disabled',true);


                            //不能更改挂属机构搜索条件
                            //不能删除 挂属机构 条件
                            var $termUsedRow = $(this).find('tr:eq(2)');
                            $termUsedRow.find('select').prop('disabled',true);
                            $termUsedRow.find('input').prop('disabled',true);

                            //不能再选择 挂属机构
                            $(this).find('option[value="termUsed"]').not(':first').prop('disabled',true);

                        }
                    }

                },
                gid: 'terminalsDispatchMgr',
                /*
                * jqgrid 构建最初发送请求的代码在 jquery.jqGrid.js 1899行 populate函数中
                * */
                url: url._('temrinals.mgr'),
                rowNum: 100,//分页
                rowList: [100, 200, 300],
                search: true,
                postData: {
                    //后台决定启用右包含，用'rlk'代替'lk'
                    filters: JSON.stringify({groupOp:"AND",rules:[{field:"termUsed",op:"rlk",data:me.options.termUsed}]})
                },
                colNames: {
                    id: 'id',
                    no: terminalsLang._('temrinals.mgr.no'), // ID
                    snNo: terminalsLang._('temrinals.mgr.sn.no'), //
                    type: terminalsLang._('temrinals.mgr.type'), //
                    status: terminalsLang._('temrinals.mgr.status'), //
                    mchtNo: terminalsLang._('temrinals.mgr.mcht.no'), //
                    cityCode: terminalsLang._('temrinals.mgr.city.code'), //
                    address: terminalsLang._('temrinals.mgr.address'), //
                    branchNo: terminalsLang._('temrinals.mgr.branch.code'), //
                    termUsed: terminalsLang._('temrinals.mgr.termUsed.code'), //
                    expandName: terminalsLang._('temrinals.mgr.expand.name'), //
                    bindDate: terminalsLang._('temrinals.mgr.bind.date'), //
                    termMachType: terminalsLang._('temrinals.mgr.term.mach.type'), //
                    bthNum: terminalsLang._('temrinals.mgr.bth.num'), //
                    bthDate: terminalsLang._('temrinals.mgr.bth.date'), //
                    termFactory: terminalsLang._('temrinals.mgr.term.factory'), //
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

                colModel: [
                    {name: 'id', index: 'id', hidden: true}, // id
                    {name: 'no', index: 'no', search: true, _searchType: 'string'},  // no
                    {
                        name: 'snNo',
                        index: 'snNo',
                        editable: true,
                        search: true,
                        _searchType: 'string'
                    },  //
                    {name: 'type', index: 'type', formatter: terminalTypeFormatter},  //
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
                    },  //
                    {
                        name: 'termFactory',
                        index: 'termFactory',
                        editable: true,
                        edittype: 'select',
                        editoptions: {value: {}},
                        formoptions: {rowpos: 3},
                        search: true,
                        _searchType: 'string'
                    }, //
                    {
                        name: 'status',
                        index: 'status',
                        search: true,
                        formatter: terminalStatusFormatter,
                        stype: 'select',
                        searchoptions: {sopt: ['eq'], value: TERMINALSTATUS_MAP}
                    },  //
                    {name: 'application', index: 'application',search: true,formatter: function(val){return use_MAP[val] ? use_MAP[val] : '';},
                        stype: 'select',
                        searchoptions: {sopt: ['eq'], value: use_MAP}},
                    {name: 'checkStatus', index: 'checkStatus',search: true,formatter: function(val){return checkStatus_MAP[val] ? checkStatus_MAP[val] : '' ;},
                        stype: 'select',
                        searchoptions: {sopt: ['eq'], value: checkStatus_MAP}},
                    {name: 'mchtNo', index: 'mchtNo', search: true, _searchType: 'string'},  //
                    {name: 'cityCode', index: 'cityCode', viewable: false},  //
                    {name: 'address', index: 'address', viewable: false},  //
                    {name: 'termUsed', index: 'termUsed', editable: true, search: true, searchoptions: {sopt: ['rlk']}},  //要改为 rlk
                    {name: 'branchNo', index: 'branchNo', editable: false, search: true, _searchType: 'string'},  //
                    {name: 'expandName', index: 'expandName'},  //
                    {name: 'bindDate', index: 'bindDate', viewable: false},  //
                    {name: 'bthNum', index: 'bthNum', viewable: false},  //
                    {name: 'bthDate', index: 'bthDate', viewable: false}  //
                ],

                //实现多选行
                //请参考 http://stackoverflow.com/questions/5259262/jqgrid-multiselect-and-disable-check-conditional

                multiselect: true,
                multiboxonly: false,//实现点击条目 叠加选择

                loadComplete: function (data) {
                    var statusList = _.pluck(data.content, 'status'),
                        rows = me.grid.find('.ui-widget-content');
                    for (var i = 0; i < statusList.length; i++) {
                        $('input.cbox', rows[i])
                            //让已解绑终端不能被选中
                            //.prop('disabled', statusList[i] === "1")
                            .prop('checked', false);
                        $(rows[i]).removeClass('ui-state-highlight');
                    }
                    //按钮状态控制器的updateStatus 方法
                    me.btnStatusCtrl.updateStatus();
                },

                beforeSelectRow: function (rowid) {
                    var cboxdisabled = me.grid.find('tr#' + rowid + '.jqgrow input.cbox:disabled');

                    if (cboxdisabled.length === 0) {
                        return true;
                    }
                    cboxdisabled.prop('checked', false); // 如果点击 操作栏，会在触发beforeSelctRow 之前 选中 checkbox，修复此问题
                    cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮
                    return false;
                },

                onSelectAll: function (aRowids, status) { // 只有选中当前页面的 rows
                    if (status) { //true 为选中状态
                        var cboxdisabled = me.grid.find('input.cbox:disabled'), selarrrow;
                        cboxdisabled.prop('checked', false);
                        cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮


                        selarrrow = me.grid.find('input.cbox:checked')
                            .closest('tr')
                            .map(function () {
                                return this.id;
                            })
                            .get(); // get()不带参数，调用 toArray() 返回数组
                        //重新设置选中的 rowid
                        me.grid[0].p.selarrrow = selarrrow;
                    }
                    //按钮状态控制器的updateStatus 方法
                    me.btnStatusCtrl.updateStatus();

                },
                onSelectRow: function(rowid, status){
                    //按钮状态控制器的updateStatus 方法
                    me.btnStatusCtrl.updateStatus();
                }

            });



            me.generateImportBtn(grid);
            me.generateAllocateBtn(grid);


            me.generateBtns(grid,[
                'unbind',
                'recall',
                'disable'
            ]);
            //生成按钮状态控制器
            me.genBtnStatusCtrl();
        },

        generateImportBtn: function (grid) {
            var me = this;
            if (!Ctx.avail('terminalsMgr.importInformation')) {
                return;
            }
            setTimeout(function () {
                Opf.Grid.navButtonAdd(grid, {
                    caption: "",
                    id: "importInformation",
                    name: "importInformation",
                    title: '批量上传信息',
                    buttonicon: "icon-upload-alt white",
                    position: "last",
                    onClickButton: function () {
                        addDialog(me);
                    }
                });
                $("#importInformation").hover(function () {
                    $(".icon-upload-alt").addClass("icon-upload-alt-hover");
                }, function () {
                    $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
                });
            }, 10);
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
            setTimeout(function () {
                Opf.Grid.navButtonAdd(grid, {
                    caption: "",
                    id: "allocate",
                    name: "allocate",
                    title: '调配选中终端',
                    buttonicon: "icon-retweet white",
                    position: "last",
                    onClickButton: function () {
                        var inBindNo = getInBindNo(me.grid);
                        if (me.grid.find('input.cbox:checked').length === 0) {
                            return false;
                        }

                        //只可以调配未绑定状态的终端，如果用户选中的终端中包含其他状态的终端，则提示
                        if(inBindNo.length !== 0){
                            showUnbindAlert(inBindNo);
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
                                    var operationDesc = $dialog.find('.operation-msg').val();
                                    if(operationDesc === ''){
                                        $dialog.find('.error-msg').show();
                                        return false;
                                    }
                                    Opf.ajax({
                                        type: 'PUT',
                                        jsonData: {
                                            no: getBoxNo(me.grid),
                                            targetTermUsed: $dialog.find('.target-termused').select2('data').code,
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
                                $(this).find('.operation-msg').on('click',function(){
                                    $dialog.find('.error-msg').hide();
                                });
                            }
                        });

                        function allocateTpl(grid) {
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
                                formatResult: function(data){
                                    return '<span value="'+data.code+'" data-brhLevel="'+data.brhLevel+'">'+ data.name +'</span>';
                                },
                                //选中之后显示的内容
                                formatSelection: function(data){
                                    return '<span value="' + data.code + '" data-brhLevel="'+ data.brhLevel +'">'+ data.name +'</span>';
                                }
                            });

                            $tpl.find('.terminals-operation-msg').before($targetTermUsed);

                            //返回
                            return $tpl;

                        }

                    }
                });

            }, 10);
        },


        //回收、解绑、停用终端
        generateBtns: function(grid,arr){

            var id = {
                    'unbind': 'unbind',
                    'recall': 'recall',
                    'disable': 'disable'
            },
                title = {
                    'unbind': '解绑选中终端',
                    'recall': '回收选中终端',
                    'disable': '停用选中终端'
            },
                buttonicon = {
                    'unbind': 'icon-unlink white',
                    'recall': 'icon-trash white',
                    'disable': 'icon-remove-sign white'
            },
                text = {
                    'unbind': '解绑',
                    'recall': '回收',
                    'disable': '停用'
            },
                me = this;

            $.each(arr, function(index, operation){

                if (!Ctx.avail('terminalsMgr.'+id[operation])) {
                    return;
                }
                setTimeout(function () {
                    Opf.Grid.navButtonAdd(grid, {
                        caption: "",
                        id: id[operation],
                        name: id[operation],
                        title: title[operation],
                        buttonicon: buttonicon[operation],
                        position: "last",
                        onClickButton: function () {
                            var inBindNo = getInBindNo(me.grid);
                            if (grid.find('input.cbox:checked').length === 0) {
                                return false;
                            }
                            //只可以回收、调配未绑定状态的终端，如果用户选中的终端中包含其他状态的终端，则提示
                            if(operation !== 'unbind' && inBindNo.length !== 0){
                                showUnbindAlert(inBindNo);
                                return false;
                            }
                            //如果是解绑操作，则要求所选终端至少有一个处于绑定状态
                            if(operation === 'unbind' && inBindNo.length === 0){
                                return false;
                            }
                            var $dialog = Opf.Factory.createDialog(selectTpl(grid), {
                                destroyOnClose: true,
                                title: title[operation],
                                autoOpen: true,
                                width: 510,
                                modal: true,
                                buttons: [{
                                    type: 'submit',
                                    text: text[operation],
                                    click: function () {
                                        //如果 描述 为空，则提示用户填写 描述
                                        var operationDesc = $dialog.find('.operation-msg').val();
                                        if(operationDesc === ''){
                                            $dialog.find('.error-msg').show();
                                            return false;
                                        }
                                        Opf.ajax({
                                            type: 'PUT',
                                            jsonData: {
                                                //如果是 解绑，则只传给后台已绑定的终端号
                                                no: operation === 'unbind' ? getInBindNo(grid) : getBoxNo(grid),
                                                flag: OPERATION_FLAG[operation],
                                                desc: _.escape(operationDesc)
                                            },
                                            url: url._('mcht.terminals.status'),
                                            successMsg: '成功'+text[operation]+'终端',
                                            success: function () {
                                                grid.trigger('reloadGrid', {current: true});
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
                                    $(this).find('.operation-msg').on('click',function(){
                                        $dialog.find('.error-msg').hide();
                                    });
                                }
                            });

                            function selectTpl(grid) {
                                //这里要判断是选中单个还是其他情况！
                                //如果选中多个则不生成终端列表，但要生成一段说明文字
                                var $tpl,
                                    rowsData = getRowsData(grid),
                                    multiple = rowsData.length !== 1,
                                    hint = '<div class="operate-terminals-hint">是否确认'+ text[operation] +'？</div>';

                                $tpl = $(selTermTpl({
                                    multiple: multiple,
                                    items: rowsData,
                                    termUsed: rowsData[0].termUsed,
                                    length: rowsData.length
                                }));

                                return $tpl;
                            }

                        }
                    });

                }, 10);
            });
        },

        getSelect2Options: function () {
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
                formatResult: function (data) {
                    return data.orgName;
                },
                //选中之后显示的内容
                formatSelection: function (data) {
                    var orgLevel = Ctx.getUser().get('brhLevel');
                    //可选同级或下级
                    return data.orgLevel >= orgLevel && data.orgName;
                }
            };
        },


        backToAgent: function(){
            this.destroy();
        },

        genBtnStatusCtrl: function(){
            var btnStatusCtrlList = [],
                me = this;
            btnStatusCtrlList.push({id:'unbind', condition: '0'});
            btnStatusCtrlList.push({id:'recall', condition: '1'});
            btnStatusCtrlList.push({id:'disable', condition: '1'});
            btnStatusCtrlList.push({id:'allocate', condition: '1'});
            function updateStatus(){
                _.each(btnStatusCtrlList,function(btn){
                    //更新每个按钮状态
                    if(_.filter(getRowsData(me.grid),function(item){
                            return item.status === btn.condition;
                        }).length !== 0){
                        me.$el.find('#' + btn.id + ' .ui-icon').removeClass('inactive');
                    }
                    else {
                        me.$el.find('#' + btn.id + ' .ui-icon').addClass('inactive');
                    }
                })
            }

            return me.btnStatusCtrl = {
                updateStatus : updateStatus
            };
        }
    });

    //获取除了未绑定状态之外其他状态的终端号
    function getInBindNo(grid){
        var rowsData = getRowsData(grid),
            arr = [];
        _.each(rowsData, function (rowData) {
            if(rowData.status.toString() !== '1'){
                arr.push(rowData.no);
            }
        });
        return arr;
    }

    //提示先解绑
    function showUnbindAlert(inBindNo){
        Opf.alert({title:'不能执行调配操作', message:'请先解绑下列终端：<br>' + inBindNo.join('、')});
    }



    function getBoxNo(grid){
        var rowsData = getRowsData(grid);

        return _.map(rowsData, function (rowData) {
            return rowData.no;
        });

    }

    //获取被选中的行包含的数据
    function getRowsData(grid){
        return _.map(grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
            return grid.jqGrid('getRowData', id);
        });
    }

    function addDialog(me) {
        var uploader, tpl = uploadFileTpl();

        var $dialog = Opf.Factory.createDialog(tpl, {
            destroyOnClose: true,
            autoOpen: true,
            width: 450,
            height: 420,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    //upload file

                    var termFactory = $dialog.find('[name="termFactory"]').val(),
                        termMachType = $dialog.find('[name="termMachType"]').val(),
                        id = _.findWhere(arrResponse, {"termFactory": termFactory, "termMachType": termMachType})["id"],
                        select2Obj = $dialog.find('.termUsed').select2('data'),
                        termUsed = select2Obj && select2Obj.id,
                        fileSelected = $dialog.find("input[name='file']").val() !== "";

                    if (fileSelected && termUsed) {
                        uploader.setData({typeId: id, termUsed: termUsed});
                        uploader.submit();
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
                var $indicator = $(this).find('.uploadFileIndicator'),
                    that = this,
                    $trigger = $(this).find('.uploadfile'),
                    $termUsed = $(this).find('.termUsed');
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
                        $indicator.show();
                    },
                    complete: function () {
                        $indicator.hide();
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
                            $(that).dialog("destroy");
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
                        url: url._('terminals.mgr.download.tpl'),
                        success: function (resp) {
                            Opf.download(resp.data);
                        },

                        error: function () {
                            console.log("downlaod template error");
                        },

                        complete: function () {
                            Opf.UI.setLoading($(event.target).closest('#page-content'), false);
                        }
                    });
                });


                $termUsed.select2(_.result(me, 'getSelect2Options'));


            }
        });
    }

    function attatchChangeEvent($selectTermFactory) {
        $selectTermFactory.on('change', function () {
            console.log("change termfactory");
            createOptionsForTermMachType(arrResponse, $selectTermFactory.val());
        });
    }

    function createOptions(resp) {
        var arrTermFactory;
        if (arrResponse.length === 0) {
            arrResponse = resp;
        }
        arrTermFactory = _.uniq(_.pluck(resp, "termFactory"));
        _.each(arrTermFactory, function (value) {
            $("select[name='termFactory']").append('<option value="' + value + '">' + value + '</option>');
        });
        createOptionsForTermMachType(resp, arrTermFactory[0]);
    }

    function createOptionsForTermMachType(arrResponse, termFactory) {
        var arr = _.where(arrResponse, {'termFactory': termFactory});
        $("select[name='termMachType']").empty();
        _.each(arr, function (item) {
            $("select[name='termMachType']").append('<option value="' + item['termMachType'] + '">' + item['termMachType'] + '</option>');
        });
    }


    function terminalStatusFormatter(val) {
        return TERMINALSTATUS_MAP[val];
    }

    function terminalTypeFormatter(val) {
        return TERMINALTYPE_MAP[val];
    }

    App.on('show:mgr:list', function () {
        console.log('>>>>using new terminals management');
        App.show(new View());
    });

    return View;

});
