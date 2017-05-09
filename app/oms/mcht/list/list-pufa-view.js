
define(['App',
    'tpl!app/oms/mcht/list/templates/table-pufa-ct.tpl',
    'i18n!app/oms/common/nls/mcht',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function(App, tableCtTpl, mcmgrLang) {

    var STATUS_MAP = {
        0:mcmgrLang._('MCHT.status.0'),
        1:mcmgrLang._('MCHT.status.1'),
        2:mcmgrLang._('MCHT.status.2'),
        3:mcmgrLang._('MCHT.status.3'),
        4:mcmgrLang._('MCHT.status.4'),
        5:mcmgrLang._('MCHT.status.5')
    };

    var KIND_MAP = {
        // 'A1':mcmgrLang._('MCHT.kind.A1'),
        // 'A2':mcmgrLang._('MCHT.kind.A2'),
        'B1':mcmgrLang._('MCHT.kind.B1'),
        'B2':mcmgrLang._('MCHT.kind.B2')
        // 'B3':mcmgrLang._('MCHT.kind.B3'),
        // 'C1':mcmgrLang._('MCHT.kind.C1'),
        // 'C2':mcmgrLang._('MCHT.kind.C2'),
        // 'C3':mcmgrLang._('MCHT.kind.C3')

    };

    var CERTIFICATECOUNTS_MAP = {
        '100': '一证商户',
        '111': '三证商户'
    };

    var MCHT_SOURCE_MAP = {
        '1': '开放注册',
        '2': '开通宝',
        '3': '平台录入',
        '4': '新开放注册',
        '5': '快捷商户自主注册'
    };


    App.module('MchtSysApp.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.PufaMchts = Marionette.ItemView.extend({
            tabId: 'menu.mcht.pufa',
            template: tableCtTpl,

            events: {

            },

            onRender: function() {
                var me = this;

                setTimeout(function() {

                    me.renderGrid();

                }, 1);
            },

            renderTip: function () {
                var tipTpl = [
                    '<div class="search-tip">',
                        '<div class="search-tip-arrow"></div>',
                        '<span>点击此处可搜索商户信息</span>',
                    '</div>'
                ].join('');

                this.$el.find('.fieldset-innerwrap').eq(0).append(tipTpl);
            },



            renderGrid: function() {
                var me = this;

                var gird = me.grid = App.Factory.createJqGrid({
                        rsId:'mchtsgrid.pufa',
                        caption: mcmgrLang._('mcht.txt'),
                        filters: [
                            {
                                caption: '精准搜索',
                                defaultRenderGrid: false,
                                canSearchAll: true,
                                components: [
                                    {
                                        label: '商户名称',
                                        name: 'name'
                                    },{
                                        label: '商户号',
                                        name: 'code',
                                        inputmask: {
                                            integer: true
                                        },
                                        options: {
                                            sopt: ['eq']
                                        }
                                    },{
                                        label: '商户手机号',
                                        name: 'userPhone',
                                        inputmask: {
                                            integer: true
                                        },
                                        options: {
                                            sopt: ['eq']
                                        }
                                    }
                                ],
                                searchBtn: {
                                    text: '搜索'
                                }
                            },{
                                caption: '条件过滤',
                                defaultRenderGrid: false,
                                canSearchAll: true,
                                canClearSearch: true,
                                components: [
                                    {
                                        label: '签约机构名',
                                        name: 'branchName'
                                    },{
                                        label: '签约机构号',
                                        name: 'brhCode'
                                    },{
                                        label: '拓展员姓名',
                                        name: 'expandName'
                                    },{
                                        label: '一级代理商',
                                        name: 'agency'
                                    }, {
                                        label: '商户证件数',
                                        name: 'certificateCounts',
                                        type: 'select',
                                        options: {
                                            value: CERTIFICATECOUNTS_MAP,
                                            sopt: ['eq','ne']
                                        }
                                    }
                                ],
                                searchBtn: {
                                    text: '过滤'
                                }
                            }
                        ],
                        actionsCol: {
                            edit: false,
                            del: false
                        },
                        nav: {
                            actions:{
                                add: false,
                                viewfunc: function (id) {
                                    App.trigger("mcht:show:pufa", id);//商户id
                                }
                            }
                        },
                        gid: 'mchts-pufa-grid',//innerly get corresponding ct '#mchts-grid-table' '#mchts-grid-pager'
                        url: url._('merchant.pufa'),

                        colNames: {
                            id: '',
                            mchtName        : mcmgrLang._('MCHT.mchtName'/*'mchtName'*/),
                            kind        : mcmgrLang._('MCHT.kind'/*'kind'*/),
                            certificateCounts: '商户证件数',
                            mchtNo      : mcmgrLang._('MCHT.mchtNo'/*'mchtNo'*/),
                            status      : mcmgrLang._('MCHT.status'/*'status'*/),
                            branchName      : mcmgrLang._('MCHT.branchName'/*'branchName'*/),
                            brhCode     :  mcmgrLang._('MCHT.brhCode'),  // 所属机构编号
                            expandName    : mcmgrLang._('MCHT.expandName'/*'expandName'*/),
                            userName        : mcmgrLang._('MCHT.userName'/*'userName'*/),
                            phone       : mcmgrLang._('MCHT.phone'/*'phone'*/),
                            // mccName         : mcmgrLang._('MCHT.mccName'),
                            // regionName      : mcmgrLang._('MCHT.regionName'/*'regionName'*/),
                            // rate:       '扣率',
                            discName       : mcmgrLang._('MCHT.discName'/*'discName'*/),
                            mchtSource: '商户来源',
                            registeDate : mcmgrLang._('MCHT.registeDate'),//商户录入时间
                            finalVertifyDate : mcmgrLang._('MCHT.finalVertifyDate'),//终审通过时间

                            cupsMchtNo    : '同步商户号',
                            exportDate    : '同步时间',
                            cupsMchtSortNo: '归类商户号',

                            //新增搜索功能，前端不需要显示，但是需要作为搜索条件传到后台来搜索
                            //
                            userPhone     :  mcmgrLang._('MCHT.userPhone'),  // 联系人手机号码
                            regDate       :  mcmgrLang._('MCHT.regDate'),  // 申请日期
                            cardNo        :  mcmgrLang._('MCHT.cardNo')  //联系人证件号码
                        },

                        responsiveOptions: {
                            hidden: {
                                ss: ['kind','branchName','expandName','userName','phone','mccName','regionName','discName','userPhone','regDate','cardNo','registeDate','finalVertifyDate', 'rate', 'mchtSource'],
                                xs: ['kind','branchName','expandName','userName','phone','mccName','regionName','discName','userPhone','regDate','cardNo','registeDate','finalVertifyDate', 'rate', 'mchtSource'],
                                sm: ['kind','expandName','phone','mccName','regionName','discName','userPhone','regDate','cardNo','registeDate','finalVertifyDate', 'rate', 'mchtSource'],
                                md: ['phone','mccName','regionName','discName','userPhone','regDate','cardNo','registeDate','finalVertifyDate', 'rate', 'mchtSource'],
                                ld: []
                            }
                        },

                        colModel: [
                            {name:          'id', index:          'id', editable:  false, hidden: true},
                            {name:        'mchtName', index:        'name', search:true,editable: true,
                                _searchType:'string'
                            },
                            {name:        'kind', index:        'kind', search:true,editable: true,
                                formatter: kindFormatter,
                                edittype:'select',
                                stype:'select',
                                searchoptions: {
                                    sopt: ['eq'],
                                    value: KIND_MAP
                                },
                                editoptions: {
                                    value: KIND_MAP
                                }
                            },
                            {name: 'certificateCounts', index: 'certificateCounts', search: true,
                                formatter: CFCountsFormatter,
                                stype: 'select',
                                searchoptions: {
                                    sopt: ['eq','ne'],
                                    value: CERTIFICATECOUNTS_MAP
                                }
                            },
                            {name:      'mchtNo', index:      'code', search:true,editable: true,
                            width:130, fixed:true,
                             searchoptions: {
                                sopt: ['eq']
                            }
                            },
                            {name:      'status', index:      'status', search:true,editable: true,
                                formatter: statusFormatter,
                                stype:'select',
                                searchoptions:{
                                    sopt: ['eq'],
                                    value: STATUS_MAP
                                },
                                edittype:'select',
                                editoptions: {
                                    value: STATUS_MAP
                                }
                            },
                            {name:    'branchName', index:    'branchName', search:true,editable: true,
                                _searchType:'string'
                            },
                            {name: 'brhCode',   index: 'brhCode',   search: true, editable: false, viewable: false, hidden: true, _searchType:'string'},
                            {name:    'expandName', index:    'expandName', search:true,editable: true,
                                _searchType:'string'
                            },
                            {name:        'userName', index:        'userName', search:true,editable: true,
                                _searchType:'string'
                            },
                            {name:       'phone', index:       'phone', search:false,editable: true, hidden: true},
                            // {name:         'mccName', index:         'mccName', search:false,editable: true},
                            // {name:      'regionName', index:      'regionName', search:false,editable: true},
                            // {name:      'rate',       index:      'rate',       search:false, editable: true},
                            {name:       'discName', index:       'discName', search:false, editable: true},
                            {name:      'mchtSource', index:      'mchtSource', search:true, editable: true, formatter: mchtSourceFormatter,
                                stype:'select',
                                searchoptions:{
                                    sopt: ['eq', 'ne'],
                                    value: MCHT_SOURCE_MAP
                                }

                            },
                            {name:      'registeDate', index:      'registeDate', search:false,editable: true},
                            {name:      'finalVertifyDate', index:      'finalVertifyDate', search:false,editable: true},

                            {name:   'cupsMchtNo',     index: 'cupsMchtNo'},
                            {name:   'exportDate',     index: 'exportDate'},
                            {name:   'cupsMchtSortNo', index: 'cupsMchtSortNo'},

                            //新增搜索功能，前端不需要显示，但是需要作为搜索条件传到后台来搜索
                            //
                            {name: 'userPhone', index: 'userPhone', search: true, editable: false, viewable: false, hidden: true,
                                searchoptions: {
                                sopt: ['eq']
                            }
                            },
                            {name: 'regDate',   index: 'regDate',   search: true, editable: false, viewable: false, hidden: true,
                                searchoptions: {
                                    dataInit : function (elem) {
                                        $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                                    },
                                    sopt: ['eq', 'lt', 'gt']
                                }
                            },
                            {name: 'cardNo',    index: 'cardNo',    search: false, editable: false, viewable: false, hidden: true,
                                _searchType:'string'
                            }
                        ],

                        loadComplete: function() {
                            setTimeout(function () {
                                if(!me.$el.find('.search-tip').length) {
                                    me.renderTip();
                                }
                            }, 300);
                        }
                });

            }

        });

    });

    function statusFormatter (val) {
        return STATUS_MAP[val];
    }

    function kindFormatter (val) {
        return KIND_MAP[val];
    }

    function CFCountsFormatter(val) {
        if(val == '100' || val == '010' || val == '001'){
            return '一证商户';
        }else if(val == '111') {
            return '三证商户';
        }else{
            return '';
        }
    }

    function mchtSourceFormatter (val) {
        return MCHT_SOURCE_MAP[val] || '';
    }


    return App.MchtSysApp.List.View;

});