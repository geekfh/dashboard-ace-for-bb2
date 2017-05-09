/**
 * @created 2014-3-12 19:27:29
 */
define(['App',
    'tpl!app/oms/wkb/task-list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/settle',
    'app/oms/wkb/common',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker'
], function(App, tableCtTpl, settleLang, wkbCommon) {

    var STATUS_MAP = {
        '0' : '保存',
        '1' : '未领取',
        '2' : '已领取',
        '3' : '待修改',
        '4' : '删除',
        '5' : '成功'
    },

    CREDENTIALS_MAP = {//证件条件
        '0' : '租凭协议', 
        '1' :  '一证',
        '2' : '三证', 
        '3' : '五证'
    },

    RATE_MAP = {//直联标扣商户
         '0' : '全部',
         '1.25' : '1.25%',
         '0.78' : '0.78%'
    },

    SHOW_VIEW_MAP = {
        showBrhView: {
            view: 'app/oms/wkb/branch-task/show/show-view',
            urlName: 'task.mgr.view', 
            callback: function(view){
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
                $el.find('.takeback').hide();
                $el.find('.not-allow-takeback').hide();
            }
        },
        showUserView: {
            view: 'app/oms/auth/user/task/show-view',
            urlName: 'task.mgr.view',//todo 
            callback: function(view){
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
                $el.find('.takeback').hide();
                $el.find('.not-allow-takeback').hide();
            }
        },
        showMchtView: {
            view: 'app/oms/wkb/task/show/show-view',
            urlName: 'task.mgr.view',
            callback: function(view){
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
                $el.find('.takeback').hide();
                $el.find('.not-allow-takeback').hide();
            }
        },
        showBanknoView: {
            view: 'app/oms/wkb/bankno-task/perform/bankno-show',
            urlName: 'task.mgr.view',
            callback: function(view){
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
            }
        },
        showT0View: {
            view: 'app/oms/wkb/T0-task/perform/T0-show',
            urlName: 'task.mgr.view',
            callback: function(view){
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
            }
        },
        showCertificationView: {
            view: 'app/oms/wkb/certification-task/perform/show',
            urlName: 'task.mgr.view',
            callback: function(view) {
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
            }
        },
        showAddMchtInfoView: {
            view: 'app/oms/wkb/extraInfo-task/perform/show',
            urlName: 'task.mgr.view',
            callback: function(view){
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
                $el.find('.takeback').hide();
                $el.find('.not-allow-takeback').hide();
            }
        },
        showDelView: {
            view: 'app/oms/wkb/task/show/show-delete-view',
            urlName: 'task.history',
            callback: function(view){
                $(view).wrap('<div class="deleteViewWrap"></div>');
            }
        },
        showUserFurtherInfoView: {
            view: 'app/oms/auth/user/furtherInfo-task/show-view',
            urlName: 'task.mgr.view',
            callback: function(view) {
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
            }
        },
        showUserOpenInfoView: {
            view: 'app/oms/wkb/extraInfo-open-task/perform/show',
            urlName: 'task.mgr.view',
            callback: function(view){
                var $el = $(view);
                $el.find('.caption:first').text(view.title + '的任务');
            }
        }
    };

    App.module('WkbSysApp.TaskList.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.TaskList = Marionette.ItemView.extend({
            tabId: 'menu.wkb.taskList',
            template: tableCtTpl,

            taskManagementHandle: function ($grid) {
                require(['app/oms/wkb/task-list/taskManagement'], function(taskManView){
                    var taskManView = new taskManView({}).render();
                    taskManView.showDialog(taskManView);
                    taskManView.$el.on('reloadParentGrid',function(){
                        $grid.trigger('reloadGrid');
                    });
                });
            },

            onRender: function() {
                var me = this;

                _.defer(function(){
                    me.renderGrid();
                });

                //判断该用户有没有 在线管理权限 给admin
                /*var taskMg = Ctx.avail('menu.task.management.config');
                if(taskMg){
                    me.ui.taskManagement.show();
                }*/
            },

            gridOptions: function (defaultOptions) {
                return defaultOptions;
            },

            getSelectedData: function () {
                var me = this;
                var rowIds = Opf.Grid.getSelRowIds(this.grid);
                var rowData = $(me.grid).jqGrid('getRowData');

                return _.filter(rowData, function (item) {
                    return _.weekContains(rowIds, item.id);
                });
            },

            getSelectedIds: function () {
                return _.clone(Opf.Grid.getSelRowIds(this.grid));
            },

            getTaskIdsByStatus: function (flag) {
                var me = this;
                if(me.checkflagsAllEq(flag)){
                    return me.getSelectedIds();
                }else{
                    return [];
                }
            },

            checkflagsAllEq: function (flag) {
                if(flag == 'noNeedFlag'){
                    // 如果结果标示设置为 noNeedFlag，则直接返回true
                    return true;
                }else{
                    var flagsAllEq = true;
                    var selectedRowDatas = this.getSelectedData();

                    _.each(selectedRowDatas, function (item) {
                        if(item.status != flag){
                            flagsAllEq = false;
                        }
                    });

                    if(!flagsAllEq){
                        Opf.alert({
                            title:'选中记录的任务状态应该都为：' + STATUS_MAP[flag],
                            message:'请重新选择 !'
                        });
                    }
                    return flagsAllEq;
                }
            },

            showAllotDialog: function (noTakeTaskIds) {
                var me = this;

                var $dialog = Opf.Factory.createDialog(getAllotDialogTpl(noTakeTaskIds.length), {
                    destroyOnClose: true,
                    title: '人员指派',
                    width: 400,
                    height: 250,
                    autoOpen: true,
                    modal: true,
                    buttons: [{
                        type: 'submit',
                        text: '确定',
                        click: function () {
                            var $input = $dialog.find('[name="allotName"]');

                            if(!$input.select2('data')){
                                Opf.alert('请选择指派人员');
                                return;
                            }else{
                                Opf.UI.setLoading($dialog.closest('.ui-dialog'));
                                var param = {
                                    key: $input.select2('data').key,
                                    value: $input.select2('data').value,
                                    taskIds: noTakeTaskIds
                                };

                                Opf.ajax({
                                    type: 'PUT',
                                    url: url._('task.allot'),
                                    data: JSON.stringify(param),
                                    success: function () {
                                        Opf.Toast.success('操作成功');
                                        $dialog.trigger('dialogclose');
                                        $(me.grid).trigger("reloadGrid", [{current:true}]);
                                    },
                                    complete: function () {
                                        Opf.UI.setLoading($dialog.closest('.ui-dialog'), false);
                                    }
                                });
                            }

                        }
                    },{
                        type: 'cancel'
                    }],
                    create: function() {
                        var $allotName = $(this).find('[name="allotName"]');

                        $allotName.select2({
                            placeholder: ' -- 请选择指派人员 -- ',
                            minimumInputLength: 1,
                            ajax: {
                                type: "GET",
                                url: url._('task.get.auditor'),
                                data: function (term, page) {
                                    return {
                                        value: encodeURIComponent(term)
                                    };
                                },
                                results: function (data, page) {
                                    return {
                                        results: data
                                    };
                                },
                                success: function (data) {
                                    console.log('success');
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
                        });
                    }
                });

            },

            putBackTask: function (hadTakeTaskIds) {
                var me = this;
                Opf.confirm('确定将任务放回？', function(result){
                    if(result){
                        var param = {
                            taskIds: hadTakeTaskIds
                        };
                        Opf.ajax({
                            type: 'PUT',
                            url: url._('task.release'),
                            data: JSON.stringify(param),
                            success: function () {
                                Opf.Toast.success('操作成功');
                                $(me.grid).trigger("reloadGrid", [{current:true}]);
                            }
                        });
                    }
                });
            },

            renderGrid: function() {
                var me = this;
                
                var grid = this.grid = App.Factory.createJqGrid(me.gridOptions({
                    altRows: true,
                    multiselect: true,
                    multiboxonly: false,
                    caption: '',//settleLang._('TaskList.txt'),
                    rsId:'taskList',
                    actionsCol: {
                        edit: false,
                        del: false
                    },
                    toolbar: [
                        {
                            name: 'verifyonline',
                            iconCls: 'icon-cog',
                            text: '在线管理',
                            onClick: me.taskManagementHandle
                        }
                    ],
                    filters: [
                       {
                           caption: '条件查询',
                           defaultRenderGrid: false,
                           canClearSearch: true,
                           components: [
                               {
                                   label: '任务类型',
                                   name: 'subType',
                                   type: 'select',
                                   options: {
                                       sopt: ['eq'],
                                       value: wkbCommon.SUBTYPE_MAP
                                   }
                               },
                               {
                                   label: '任务状态',
                                   name: 'status',
                                   type: 'select',
                                   options: {
                                       sopt: ['eq'],
                                       value: STATUS_MAP
                                   }
                               },
                               {
                                   label: '名称关键字',
                                   name: 'keyName',
                                   type: 'text',
                                   options: {
                                       sopt: ['eq']
                                   }
                               }, {
                                   label: '手机号',
                                   name: 'keyPhone',
                                   inputmask: {
                                       integer: true
                                   },
                                   options: {
                                       sopt: ['eq']
                                   }
                               }, {
                                   label: '商户号',
                                   name: 'mchtNo',
                                   options: {
                                       sopt: ['eq']
                                   }
                               },{
                                   label: '提交时间段',
                                   name: 'submitTime',
                                   type: 'date',
                                   options: {
                                       sopt: ['eq']
                                   }
                               }
                               //, {
                               //    label: '证件条件',
                               //    name: 'credentials',
                               //    type: 'select',
                               //    options: {
                               //        sopt: ['eq'],
                               //        value: CREDENTIALS_MAP
                               //    }
                               //}
                               , {
                                   label: '直联标扣商户',
                                   name: 'rate',
                                   type: 'select',
                                   options: {
                                       sopt: ['eq'],
                                       value: RATE_MAP
                                   }
                               }
                           ],
                           searchBtn: {
                               text: '搜索'
                           }
                       }
                    ],
                    nav: {
                        actions: {
                            add: false,
                            viewfunc: function () {
                                var selectId = Opf.Grid.getLastSelRowId(grid),
                                    rowData = grid.getRowData(selectId),
                                    status = parseInt(rowData.status, 10),
                                    subType = parseInt(rowData.subType, 10);

                                var targetView;
                                //subType：101/新增机构，102/新增商户，103/新增用户，205/审核银行卡号
                                //status: 4 / 删除 ，除了删除状态之外查看信息的都是showView
                                if(status === 4){
                                    targetView = 'showDelView';
                                }else{
                                    switch(subType){
                                        case 101: targetView = 'showBrhView';break;
                                        case 102:
                                        case 108:
                                        case 110:
                                        case 106:
                                        case 107:
                                            targetView = 'showMchtView';
                                            break;
                                        case 103: targetView = 'showUserView';break;
                                        case 104:
                                        case 305: targetView = 'showUserView';break;
                                        case 205: targetView = 'showBanknoView';break;
                                        case 206: targetView = 'showCertificationView';break;
                                        case 207: targetView = 'showAddMchtInfoView';break;//商户资料审核
                                        case 208: targetView = 'showUserFurtherInfoView';break;//直销人员补充资料审核
                                        case 209: targetView = 'showUserOpenInfoView';break;//开放注册用户补充资料审核
                                        case 304: targetView = 'showT0View';break;
                                        case 306: targetView = 'showUserView';break;
                                        default:
                                            Opf.alert("数据异常！");
                                            return;
                                    }
                                }

                                renderViewBy(me, {
                                    view: SHOW_VIEW_MAP[targetView].view,
                                    url: url._( SHOW_VIEW_MAP[targetView].urlName, {id: rowData.id} ),
                                    title: STATUS_MAP[status],
                                    callback: SHOW_VIEW_MAP[targetView].callback,
                                    taskModel: subType
                                });

                            }
                        },
                        search : {
                            // beforeShowSearch : function(form){
                            //     $(form).find(".columns option[value=keyName]").prop("selected",true);
                            //     $(form).find(".columns select").trigger("change");
                            //     return true;
                            // },

                            // when the search dialog pop up or click the reset button, afterRedraw will be triggered (zhuyimin)
                            afterRedraw: function(){
                                var $lastColumsSelect = $(this).find(".columns select:last");
                                $lastColumsSelect.val('keyName').trigger('change');
                            }
                        }
                    },
                    gid: 'task-list-grid',//innerly get corresponding ct '#bat-main-ctl-details-grid-table' '#bat-main-ctl-details-grid-pager'
                    url: url._('task.list.grid'),
                    colNames: {
                        id            : 'id', 
                        subType       : '任务类型',  //任务类型
                        status        : '任务状态',    //任务状态0-新任务待确认提交(保存)
                        keyName       : '关键信息名称',  //关键信息名称
                        keyPhone      : '关键信息号码',  //关键信息号码
                        beginOprName  : '任务发起人名称',   //任务发起人名称
                        submitTime    : '任务提交时间',   //任务提交时间
                        beginTime     : '任务发起时间',   //任务发起时间
                        step          : '任务步骤数',     //任务步骤数
                        recommitCount : '任务重提次数',   //任务重提次数,
                        nowBrhLevel   : '当前角色对应机构级别' ,  //当前角色对应机构级别
                        nowRoleCode   : '当前角色编号',   //now-role  当前角色编号
                        nowRoleName   : '当前角色名称',   // 当前角色名称
                        nowOprId      : '当前处理操作员',       //当前处理操作员
                        nowOprName    : '当前操作员',   //当前处理操作员名称
                        nowStep       : '当前步骤',        //当前步骤
                        oprNum        : '操作次数',        //操作次数 
                        map_type      : '配置类型',        //配置类型
                        mapBrh        : '配置对应机构',    //配置对应机构

/*************上面的在列表中展现，在详情展现的时候把下面的加上*****/


                        brhLevel1 : '一次操作机构级别',     //一次操作机构级别
                        roleCode1 : '一次操作角色编号',     //一次操作角色编号
                        roleName1 : '一次操作角色名称',     //一次操作角色名称
                        brhLevel2 : '二次操作机构级别',     //二次操作机构级别
                        roleCode2 : '二次操作角色编号',     //二次操作角色编号
                        roleName2 : '二次操作角色名称',     //二次操作角色名称
                        brhLevel3 : '三次操作机构级别',     //三次操作机构级别
                        roleCode3 : '三次操作角色编号',     //三次操作角色编号
                        roleName3 : '三次操作角色名称',     //三次操作角色名称


                        credentials : '证件条件',          //证件条件
                        rate : '直联标扣商户'              //直联标扣商户
                    },
                    responsiveOptions: {
                        hidden: {
                            ss: ['keyPhone', 'beginOprName', 'beginTime', 'step', 'recommitCount', 'nowBrhLevel', 'nowRoleCode', 'nowRoleName', 'nowOprId', 'nowOprName', 'nowStep', 'map_type', 'mapBrh'],
                            xs: ['keyPhone', 'beginOprName', 'step', 'recommitCount', 'nowBrhLevel', 'nowRoleCode', 'nowRoleName', 'nowOprId', 'nowStep', 'map_type', 'mapBrh'],
                            sm: ['beginOprName', 'step', 'recommitCount', 'nowBrhLevel', 'nowRoleCode', 'nowRoleName', 'nowOprId', 'nowStep', 'map_type', 'mapBrh'],
                            md: ['beginOprName', 'recommitCount', 'nowBrhLevel', 'nowRoleCode', 'nowRoleName', 'nowOprId', 'nowStep', 'map_type', 'mapBrh'],
                            ld: ['beginOprName', 'recommitCount', 'nowBrhLevel', 'nowRoleCode', 'nowRoleName', 'nowOprId', 'nowStep', 'map_type', 'mapBrh']
                        }
                    },
                    colModel: [
                        {name:         'id',            index:         'id', hidden: true},  //id
                        {name:         'subType',       index:         'subType', formatter: subTypeFormatter, search: true,
                            stype: 'select',
                            searchoptions: {
                                value: wkbCommon.SUBTYPE_MAP,
                                sopt: ['eq'],
                                dataInit : function(elem){
                                    // console.log(elem);
                                    $(elem).children("[value=102]").prop("selected",true);
                                }
                            }
                        },  //任务类型
                        {name:         'status',        index:         'status', formatter: statusFormatter, search: true,
                            stype: 'select',
                            searchoptions: {
                                value: STATUS_MAP,
                                sopt: ['eq']
                            }
                        },  //任务状态
                        {name:         'keyName',       index:         'keyName', search: true, _searchType:'string'},  //关键信息名称
                        {name:         'keyPhone',      index:         'keyPhone', search: true, _searchType:'string',  hidden: true},  //关键信息号码
                        {name:         'beginOprName',  index:         'beginOprName'},  //任务发起人名称
                        {name:         'submitTime',    index:         'submitTime', search: true, searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            }, sopt: ['lk','nlk']
                        }, formatter: timeFormatter},  //任务提交时间
                        {name:         'beginTime',     index:         'beginTime', search: true, searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            }, sopt: ['lk','nlk']
                        }, formatter: timeFormatter},  //任务发起时间
                        {name:         'recommitCount', index:         'recommitCount'},  //任务重提次数
                        {name:         'nowBrhLevel',   index:         'nowBrhLevel'},  //当前角色对应机构级别
                        {name:         'nowRoleCode',   index:         'nowRoleCode'},  //当前角色编号
                        {name:         'nowRoleName',   index:         'nowRoleName'},  //当前角色名称
                        {name:         'nowOprId',      index:         'nowOprId'},  //当前处理操作员
                        {name:         'nowOprName',    index:         'nowOprName', search:true, _searchType:'string', formatter: nowOprNameFormatter},  //当前处理操作员名称
                        {name:         'nowStep',       index:         'nowStep'},  //当前步骤
                        {name:         'step',          index:         'step'},  //任务步骤数
                        {name:         'map_type',      index:         'map_type'},  //配置类型
                        {name:         'mapBrh',        index:         'mapBrh'},  //配置对应机构
                        {name:         'oprNum',        index:         'oprNum',   hidden: true},  //操作次数
                        {name:         'brhLevel1',     index:         'brhLevel1',   hidden: true, viewable: false},  //一次操作机构级别
                        {name:         'roleCode1',     index:         'roleCode1',   hidden: true, viewable: false},  //一次操作角色编号
                        {name:         'roleName1',     index:         'roleName1',   hidden: true, viewable: false},  //一次操作角色名称
                        {name:         'brhLevel2',     index:         'brhLevel2',   hidden: true, viewable: false},  //二次操作机构级别
                        {name:         'roleCode2',     index:         'roleCode2',   hidden: true, viewable: false},  //二次操作角色编号
                        {name:         'roleName2',     index:         'roleName2',   hidden: true, viewable: false},  //二次操作角色名称
                        {name:         'brhLevel3',     index:         'brhLevel3',   hidden: true, viewable: false},  //三次操作机构级别
                        {name:         'roleCode3',     index:         'roleCode3',   hidden: true, viewable: false},  //三次操作角色编号
                        {name:         'roleName3',     index:         'roleName3',   hidden: true, viewable: false}  //三次操作角色名称

                        //{name:         'credentials',   index:         'credentials'},  //证件条件
                        //{name:         'rate ',   index:         'rate'}   //直联标扣商户
                    ],
                    loadComplete: function(data) {
                        if(me.grid){
                            me.$el.find('#cb_task-list-grid-table').hide();
                            var dataList = data.content;

                            _.each(dataList, function (item) {
                                var canSelect = checkCanSelectTr(item);

                                !canSelect && disabledThisTr(me.grid.find('tr#'+item.id));
                            });

                        }
                    },
                    beforeSelectRow: function(rowid, e){
                        var cboxdisabled = me.grid.find('tr#'+ rowid +'.jqgrow input.cbox:disabled');

                        if (cboxdisabled.length === 0) {
                            return true;
                        }
                        cboxdisabled.prop('checked', false); // 如果点击 操作栏，会在触发beforeSelctRow 之前 选中 checkbox，修复此问题
                        cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮
                        return false;
                    }
                    //,
                    //onSelectRow: function(rowid, status){
                    //    //按钮状态控制器的updateStatus 方法
                    //    me.btnStatusCtrl.updateStatus();
                    //}

                }));

                _.defer(function () {
                    //指派打开按钮
                    Opf.Grid.availNavButtonAdd(me.grid, {
                      caption: "",
                      name: "sendUsers",
                      title: "人员指派",
                      buttonicon: "icon-hand-right white",
                      position: "last",
                      onClickButton: function  () {
                            var ids = Opf.Grid.getSelRowIds(grid);
                            if(ids.length == 0){
                                Opf.alert({title: "警告",message: "请至少选中一条记录!"});
                            }
                            else{
                                // 选中的未领取的任务 id
                                var noTakeTaskIds = me.getTaskIdsByStatus('1');
                                if(noTakeTaskIds.length > 0){
                                    me.showAllotDialog(noTakeTaskIds);
                                }
                            }
                      }
                    });

                    //指派放回
                    Opf.Grid.availNavButtonAdd(me.grid, {
                      caption: "",
                      name: "dropTask",
                      title: "任务放回",
                      buttonicon: "icon-exchange white",
                      position: "last",
                      onClickButton: function () {
                        var ids = Opf.Grid.getSelRowIds(grid);
                        if(ids.length == 0){
                            Opf.alert({ title: "警告",message: "请至少选中一条记录!"});
                        }
                        else{
                            // 选中的已领取的任务 id
                            var hadTakeTaskIds = me.getTaskIdsByStatus('2');
                            if(hadTakeTaskIds.length > 0){
                                me.putBackTask(hadTakeTaskIds);
                            }
                        }
                      }
                    });

                });

                //生成按钮状态控制器
            //    me.genBtnStatusCtrl();
            }
            //,
            ////点击行事件
            //genBtnStatusCtrl: function(rowid){
            //    var btnStatusList = [],
            //        me = this;
            //    //btnStatusList.push({id:'nowBrhLevel', condition: '0'});
            //    //btnStatusList.push({id:'subType', condition: '101'});
            //    //btnStatusList.push({id:'subType', condition: '103'});
            //    //btnStatusList.push({id:'subType', condition: '206'});
            //    //btnStatusList.push({id:'status', condition: '1'});
            //    //btnStatusList.push({id:'status', condition: '2'});
            //
            //    function updateStatus(rowid){
            //        if(_.filter(getRowsData(me.grid),function(item){
            //                return item.nowBrhLevel == 0 && (item.subType != 101 || 103 || 206) && (item.status == 1 || 2)
            //            }).length !== 0){
            //            return true;
            //        }
            //        else {
            //            var cboxdisabled = me.grid.find('tr#'+ rowid +'.jqgrow input.cbox');
            //            //
            //            if (cboxdisabled.length === 0) {
            //                return true;
            //            }
            //            cboxdisabled.prop('checked', false); // 如果点击 操作栏，会在触发beforeSelctRow 之前 选中 checkbox，修复此问题
            //            cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮
            //        }
            //    }
            //
            //    return me.btnStatusCtrl = {
            //        updateStatus : updateStatus
            //    };
            //}

        });

    });


    //获取被选中的行包含的数据
    //function getRowsData(grid){
    //    return _.map(grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
    //        return grid.jqGrid('getRowData', id);
    //    });
    //}

    function disabledThisTr (tr) {
        $(tr).find('.cbox').prop('disabled', true);
    }

    //某条记录应该符合以下条件才可以被选择：
    //1.nowBrhLevel （机构等级） 为 0
    //2.subType（任务类型）不为 101（新增机构）或103（新增用户）或206（实名认证审核）
    //3.status （任务状态）为 1（未领取）或 2（已领取）
    function checkCanSelectTr (options) {
        var nowBrhLevel = options.nowBrhLevel;
        var subType = options.subType;
        var status = options.status;

        return nowBrhLevel == 0 && (status == 1 || status == 2) && !(subType == 101 || subType == 103);
    }


    //选中未处理状态弹出框(指派人员)
    function getAllotDialogTpl(taskIdsLength){
        return [
            '<form class="form-settle-txn">',
                '<fieldset>',
                    '<div class="row settle-styles-row" style="margin-left:0;margin-right:0">',
                        '<div class="col-xs-3">人员名称</div>',
                        '<div class="col-xs-9">',
                            '<input type="text" name="allotName" style="width: 180px; ">',
                        '</div>',
                    '</div>',
                    '<div style="margin: 12px;">',
                        '<span style="font-size: 12px;">将指派</span>',
                        '<span style="color: #ff0000; font-size: 14px;"> '+ taskIdsLength +'个任务 </span>',
                        '<span style="font-size: 12px;">给该审核人员</span>',
                    '</div>',
                '</fieldset>',
            '</form>'
        ].join('');
    }

    function subTypeFormatter(val) {
        return wkbCommon.SUBTYPE_MAP[val] || '';
    }

    function statusFormatter(val) {
        return STATUS_MAP[val] || '';
    }

    function backBtnFnOf(el, showEl) {
        var $el = $(el);
        var $showEl = $(showEl);
        var $backBtn = $el.find('.js-back');

        $backBtn.off('.click') && $backBtn.on('click.taskList',function(){
            $el.remove();

            setTimeout(function(){
                $(window).trigger('resize');
                $showEl.show();
            },1);
        });
    }

    function timeFormatter(time) {
        return time ? Opf.String.replaceFullDate(time, '$1-$2-$3 $4:$5:$6') : '';
    }

    function nowOprNameFormatter(val, options, rowData){
        return val && rowData.status !== '1' ? val : '';
    }

    function renderViewBy(me, options){
        var view = options.view;
        var url = options.url;
        var callback = options.callback;

        Opf.UI.setLoading(me.$el);
        
        require([view], function(ShowView){
            Opf.ajax({
                type: 'GET',
                async: false,
                url: url,
                success: function (data) {
                    me.$el.hide();

                    data['taskSubType'] = options.taskModel;//任务和任务管理模块 放入taskmodel不一样，写成放入userinfo里头 调用

                    var showView = new ShowView({data:data}).render();
                    var $showView = showView.$el;
                    $showView.title = options.title;

                    //绑定返回按钮事件, 两个view之间的切换
                    backBtnFnOf($showView, me.$el);
                    
                    App.getCurTabPaneEl().append($showView);
                    //针对不同的view的不同处理
                    callback($showView);
                    fitImages(showView);

                },
                complete: function () {
                    Opf.UI.setLoading(me.$el, false);
                }
            });
        });
    }

    //将图片缩略图按照正常比例调整
    function fitImages (view) {
        var $imgWrapArray = view.$el.find('.img-wrap');
        if($imgWrapArray.length){
            $imgWrapArray.each(function () {
                var $imgWrap = $(this);
                Opf.Util.autoFitImg({
                    img: $imgWrap.find('img'),
                    constrain: $imgWrap.find('.img-inner-wrap')
                });
            });
        }
    }

    return App.WkbSysApp.TaskList.List.View;

});