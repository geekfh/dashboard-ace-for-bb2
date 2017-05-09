define(['App',
    'tpl!app/oms/auth/log/list/templates/log.tpl',
    'i18n!app/oms/common/nls/auth',
    'i18n!app/oms/common/nls/mcht',
    'tpl!app/oms/auth/log/list/templates/detail.tpl',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker'
], function(App, logTpl, authLang, mcmgrLang, detailTpl) {

    var STATUS_MAP = {
        0: mcmgrLang._('MCHT.status.0'),
        1: mcmgrLang._('MCHT.status.1'),
        2: mcmgrLang._('MCHT.status.2'),
        3: mcmgrLang._('MCHT.status.3'),
        4: mcmgrLang._('MCHT.status.4'),
        5: mcmgrLang._('MCHT.status.5'),
        6: mcmgrLang._('MCHT.status.6')
    };

    var queryFilters;

    App.module('AuthSysApp.Log.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.Log = Marionette.ItemView.extend({
            tabId: 'menu.auth.log',
            template: logTpl,
            events: {},

            onRender: function() {
                var me = this;
                _.defer(function(){
                    me.renderGrid();
                });
            },

            renderGrid: function() {
                var me = this;
                var grid = App.Factory.createJqGrid({
                    rsId:'log',
                    caption: authLang._('log.txt'),
                    actionsCol: {
                        edit: false,
                        del : false,
                        view: false,
                        extraButtons: [
                            {name: 'changestate', icon:'', title: '查看', caption: '查看',
                                click: function (name, opts, rowData) {
                                    showDetailDialog(me, rowData);
                                }
                            }
                        ]
                    },
                    filters: [
                    {
                        caption: '日志搜索',
                        defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                        {
                            label: '操作业务模块',
                            name: 'model',
                            type: 'select2',
                            options: {
                                sopt: ['eq'],
                                select2Config: {
                                    placeholder: '--请选择--',
                                    minimumResultsForSearch: Infinity,
                                    width: 170,
                                    ajax: {
                                        type: 'get',
                                        url: url._('log.model.show'),
                                        dataType: 'json',
                                        //data: function (term) {
                                        //    return {
                                        //        kw: encodeURIComponent(term)
                                        //    };
                                        //},
                                        results: function (data) {
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
                                },
                                valueFormat: function (select2Data) {
                                    return select2Data.value;
                                }
                            }
                        },
                        {
                            label: '操作资源名称',
                            name: 'resName',
                            type: 'select2',
                            options: {
                                sopt: ['eq'],
                                select2Config: {
                                    placeholder: '--请选择操作业务模块--',
                                    minimumResultsForSearch: Infinity,
                                    width: 200,
                                    ajax: {
                                        type: 'get',
                                        url: url._('log.resName.show'),
                                        dataType: 'json',
                                        data: function (term) {
                                            return {
                                                head: $('.model-filter-input').find('span').html()
                                            };
                                        },
                                        results: function (data) {
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
                                },
                                valueFormat: function (select2Data) {
                                    return select2Data.value;
                                }
                            }
                        },
                        {
                            label: '操作类型',
                            name: 'type',
                            type: 'select2',
                            options: {
                                sopt: ['eq'],
                                select2Config: {
                                    placeholder: '--请选择操作资源名称--',
                                    minimumResultsForSearch: Infinity,
                                    width: 200,
                                    ajax: {
                                        type: 'get',
                                        url: url._('log.type.show'),
                                        dataType: 'json',
                                        data: function (term) {
                                            return {//encodeURIComponent()
                                                resName: $('.model-filter-input').find('span').html() + '-' + $('.resName-filter-input').find('span').html()
                                            };
                                        },
                                        results: function (data) {
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
                                },
                                valueFormat: function (select2Data) {
                                    return select2Data.value;
                                }
                            }
                        },
                        //{
                        //    label: '操作员名称',
                        //    name: 'oprName'
                        //},
                        {
                            label: '操作时间',
                            name: 'oprTime',
                            type: 'date',
                            //ignoreFormReset: true,
                            limitDate: moment(),
                            //limitRange: 'month'
                            options: {sopt: ['lk']}
                        },
                        {
                            label: authLang._('log.desc'),
                            name: 'desc',
                            type: 'text'
                        },
                            {
                                label: '关键信息名称',
                                name: 'keyName',
                                type: 'text'
                            }
                        ],
                        searchBtn: {
                            id: 'logSearchBtn',
                            text: '搜索'
                        }
                    }],
                    nav: {
                        actions: {
                            add: false
                        }
                    },
                    gid: 'log',
                    url: url._('log'),
                    colNames: {
                        id          : 'id',
                        model       : authLang._('log.model'),
                        resName     : authLang._('log.resName'),
                        type        : authLang._('log.type'),
                        brhCode     : authLang._('log.brhCode'),
                        brhName     : authLang._('log.brhName'),
                        status      : authLang._('log.status'),
                        oprId       : authLang._('log.oprId'),
                        oprName     : authLang._('log.oprName'),
                        desc        : authLang._('log.desc'),
                        oprTime     : authLang._('log.oprTime'),
                        keyId       : authLang._('log.keyId'),
                        keyName     : authLang._('log.keyName'),
                        soureInfo   : authLang._('log.soureInfo'),
                        modifyInfo  : authLang._('log.modifyInfo')
                    },
                    colModel: [
                        {name: 'id',      index: 'id', hidden: true},
                        {name: 'desc',    index: 'desc', search:true, _searchType:'string'},
                        {name: 'model',   index: 'model', hidden: true},
                        {name: 'resName', index: 'resName',  hidden: true},
                        {name: 'type',    index: 'type', formatter: statusFormatter, hidden: true},
                        {name: 'brhCode', index: 'brhCode',  hidden: true},
                        {name: 'brhName', index: 'brhName', search:true, _searchType:'string'},
                        {name: 'status',  index: 'status', hidden: true},
                        {name: 'oprId',   index: 'oprId', hidden: true},
                        {name: 'oprName', index: 'oprName'},
                        {name: 'oprTime', index: 'oprTime', formatter: dateFormatter},
                        {name: 'keyId',   index: 'keyId', hidden: true},
                        {name: 'keyName', index: 'keyName'},
                        {name: 'soureInfo',index: 'soureInfo', viewable: false, hidden: true},
                        {name: 'modifyInfo',index: 'modifyInfo',viewable: false, hidden: true}
                    ]
                });
            }
        });
    });  

    function showDetailDialog(me, rowData){
        var soureInfoData = null;
        var modifyInfoData = null;
        $.ajax({
            type: 'GET',
            //url: 'yoyo.json',
            url: url._('log.detail', {id: rowData.id}),
            dataType: 'json',
            async: false,
            success: function(data){
                soureInfoData = data.soureInfo;
                modifyInfoData = data.modifyInfo;
            }
        });
        if(soureInfoData == null && modifyInfoData == null){
            Opf.alert('没有记录.');
            return false;
        }
        var $dialog = Opf.Factory.createDialog(detailTpl({sModel: soureInfoData, mData: modifyInfoData}), {
            destroyOnClose: true,
                title: '查看详情',
                autoOpen: true,
                width: 1000,
                height: 700,
                modal: true,
                buttons: [{
                    type: 'cancel'
                }]
        });
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    return App.AuthSysApp.Log.List.View;

});