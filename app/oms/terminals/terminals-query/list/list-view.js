define(['App',
    'tpl!app/oms/terminals/terminals-query/list/templates/terminalsQuery.tpl',
    'i18n!app/oms/common/nls/terminals',
    'common-ui',
    'upload',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function(App, TerminalsQueryTpl, terminalsLang, CommonUi) {

    var TERMINALSTATUS_MAP = {
            "0" : terminalsLang._("terminals.query.terminalstatus.0"),
            "1" : terminalsLang._("terminals.query.terminalstatus.1"),
            "2" : terminalsLang._("terminals.query.terminalstatus.2"),
            "3" : terminalsLang._("terminals.query.terminalstatus.3")
        },

        // TERMINALTYPE_MAP = {
        //     "1" : terminalsLang._("terminals.query.terminaltype.1"),
        //     "2" : terminalsLang._("terminals.query.terminaltype.2")
        // },

        options = [],

        grid,

        validator;
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
        '3': '赠送',
        '4': '非考核租机'
    };
    App.module('TerminalsApp.TerminalsQueryApp.List.View', function(View, App, Backbone, Marionette, $, _) {
        View.TerminalsQuery = Marionette.ItemView.extend({
            tabId: 'menu.terminals.query',
            template: TerminalsQueryTpl,
            className: 'temrinals-wrap',
            events: {
                "submit form.queryForm" : "queryGrid",
                "click #fbox_terminalsQuery_reset" : "resetInput"
            },

            onRender: function() {
                var me = this;

                setTimeout(function() {
                    var $form = $("form.queryForm");
                    setUpValidate($form);
                    CommonUi.terminalSelect($form.find('input[name="temrinal"]'));
                    grid = me.renderGrid();
                    $("#terminalsQuery-table_toppager").hide();
                }, 0);
            },

            renderGrid: function() {
                var me = this;
                var grid = App.Factory.createJqGrid({
                    rsId:'terminalsQuery',
                    caption: terminalsLang._('terminalsQuery.txt'),
                    actionsCol: {
                        edit: false,
                        del : false,
                        view : false
                    },
                    nav: {

                        actions: {add:false, edit: false, del: false, view: false, search: false, refresh: false}

                    },
                    gid: 'terminalsQuery',
                    // url: url._('temrinals.mgr'),
                    colNames: {
                        id               : 'id',
                        no               : terminalsLang._('temrinals.query.no'), // ID
                        snNo         : terminalsLang._('temrinals.query.sn.no'), //
                        // type           : terminalsLang._('temrinals.query.type'), //
                        status           : terminalsLang._('temrinals.query.status'), //
                        // mchtNo          : terminalsLang._('temrinals.query.mcht.no'), //
                        // cityCode          : terminalsLang._('temrinals.query.city.code'), //
                        // address           : terminalsLang._('temrinals.query.address'), //
                        // branchCode      : terminalsLang._('temrinals.query.branch.code'), //
                        // expandName           : terminalsLang._('temrinals.query.expand.name'), //
                        // bindDate           : terminalsLang._('temrinals.query.bind.date'), //
                        termMachType         : terminalsLang._('temrinals.query.term.mach.type'), //
                        // bthNum             : terminalsLang._('temrinals.query.bth.num'), //
                        // bthDate         : terminalsLang._('temrinals.query.bth.date'), //
                        termFactory         : terminalsLang._('temrinals.query.term.factory'), //
                        application:'终端用途',
                        checkStatus: '审核状态'
                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['termMachType', 'termFactory', 'status',  '_action_'],
                            xs: ['termMachType', 'termFactory', 'status',  '_action_'],
                            sm: ['termMachType', 'termFactory',   '_action_'],
                            md: ['termMachType', 'termFactory',   '_action_'],
                            ld: ['_action_']
                        }
                    },

                    colModel: [
                        {name: 'id',             index: 'id',   hidden:true}, // id
                        {name: 'no',             index: 'no'},  // no
                        {name: 'snNo',       index: 'snNo' },  //
                        // {name: 'type', index: 'type',  formatter: terminalTypeFormatter},  // 
                        {name: 'termMachType', index: 'termMachType' },  // 
                        {name: 'termFactory', index: 'termFactory' }, // 
                        {name: 'status',         index: 'status', formatter: terminalStatusFormatter},//,  //
                        // {name: 'mchtNo',        index: 'mchtNo' },  // 
                        // {name: 'cityCode',        index: 'cityCode' },  // 
                        // {name: 'address',         index: 'address' },  // 
                        // {name: 'branchCode',    index: 'branchCode' },  // 
                        // {name: 'expandName',         index: 'expandName'         },  // 
                        // {name: 'bindDate',         index: 'bindDate'        },  // 
                        // {name: 'bthNum',           index: 'bthNum' },  // 
                        // {name: 'bthDate',       index: 'bthDate'}  //
                        {name: 'application', index: 'application',search: true,formatter: function(val){return use_MAP[val] ? use_MAP[val] : '';},
                            stype: 'select',
                            searchoptions: {sopt: ['eq'], value: use_MAP}},
                        {name: 'checkStatus', index: 'checkStatus',search: true,formatter: function(val){return checkStatus_MAP[val] ? checkStatus_MAP[val] : '';},
                            stype: 'select',
                            searchoptions: {sopt: ['eq'], value: checkStatus_MAP}},
                    ]
                });
                return grid;
            },

            queryGrid: function(){
                var $form = $("form.queryForm");
                if($form.valid()) {
                    var postData = $(grid).jqGrid('getGridParam', 'postData');

                    var temrinal = $form.find('input[name="temrinal"]').select2('data');
                    var snNo = $form.find('input[name="snNo"]').val();
                    var checkStatus = $form.find('select[name="checkStatus"]').val();
                    var application = $form.find('select[name="application"]').val();
                    var rules = [], id, filters;

                    temrinal && rules.push({field:"typeId",op:"eq",data: temrinal.typeId});
                    checkStatus && checkStatus != -1 &&  rules.push({field:"checkStatus",op:"eq",data: checkStatus});
                    application && application != -1 && rules.push({field:"application",op:"eq",data: application});
                    rules.push({field:"snNo",op:"eq",data:snNo});

                    filters = JSON.stringify({groupOp:"AND",rules:rules});

                    postData.filters = filters;

                    $(grid).jqGrid('setGridParam', {url: url._('temrinals.mgr'), search: true, postData: postData} );
                    $(grid).trigger("reloadGrid", [{page:1}]);

                    
                    $("div.jgrid-container").css('visibility','visible');
                }
                return false;
            },

            resetInput: function(){
                var $form = $("form.queryForm");
                $form.find('input[name="snNo"]').val('');
                $form.find('input[name="temrinal"]').select2('data', null);
                validator.resetForm();
                createOptions(options, $form);
            }
        });

    });


    function setUpValidate($form){
        validator = $form.validate({
            rules: {
                snNo: {required:true}
            },
            messages: {
                snNo: {required:'请输入终端标识码'}
            }
        });

    }

    function terminalStatusFormatter(val){
        return TERMINALSTATUS_MAP[val];
    }

    // function terminalTypeFormatter(val){
    //     return TERMINALTYPE_MAP[val];
    // }

    return App.TerminalsApp.TerminalsQueryApp.List.View;

});