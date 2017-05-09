define([
    'App',
    'tpl!app/oms/mcht/change/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/mcht',
    'moment.override',
    'jquery.jqGrid'
], function (app, tpl, mcmgrLang) {
    var FIELDSET_FLAG_MAP = {
        '1': mcmgrLang._('MCHT.account'),
        '2': mcmgrLang._('MCHT.user.phone'),
        '3': mcmgrLang._('MCHT.user.name')
    };

    View = Marionette.ItemView.extend({
        tabId: 'menu.mcht.change',
        template: tpl,

        onRender: function() {
            var me = this;

            setTimeout(function() {

                me.renderGrid();

            }, 1);
        },


        renderGrid: function() {
            var me = this;

            var gird = me.grid = App.Factory.createJqGrid({
                title: '商户信息变更历史表',
                rsId: 'infoChange',
                gid: 'infoChange-grid',
                url: url._('mcht-info-change'),

                filters: [{
                    caption: '条件过滤',
                    defaultRenderGrid: false,
                    canSearchAll: true,
                    canClearSearch: true,
                    components: [
                        {
                            label: '商户名',
                            name: 'mchtName'
                        },
                        {
                            label: '商户号',
                            name: 'mchtNo'
                        }
                    ],
                    searchBtn: {
                        text: '搜索'
                    }
                }],

                actionsCol: {
                    edit: false,
                    del: false
                },

                nav: {
                    actions: {
                        add: false,
                        search: false
                    }
                },

                colNames: {
                    id: '',
                    mchtNo: mcmgrLang._('MCHT.no'),//商户号
                    mchtName: mcmgrLang._('MCHT.name'),//商户名称
                    modifiedTime: mcmgrLang._('MCHT.modified.time'),//修改时间
                    fieldsetFlag: mcmgrLang._('MCHT.fieldset.name'),//修改字段
                    oldFieldset: mcmgrLang._('MCHT.old.fieldset'),//原有内容
                    newFieldset: mcmgrLang._('MCHT.new.fieldset')//新内容
                },

                responsiveOptions: {
                    hidden: {
                        ss: ['mchtNo','fieldsetFlag','oldFieldset','newFieldset'],
                        xs: ['mchtNo','fieldsetFlag','oldFieldset','newFieldset'],
                        sm: ['oldFieldset','newFieldset'],
                        md: [],
                        ld: []
                    }
                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'mchtNo'},//商户号
                    {name: 'mchtName'},//商户名称
                    {name: 'modifiedTime', formatter: timeFormatter},//修改时间
                    {name: 'fieldsetFlag', formatter: fieldsetFormatter},//修改字段
                    {name: 'oldFieldset', formatter: oldFieldsetFormatter},//原有内容
                    {name: 'newFieldset', formatter: newFieldsetFormatter}//新内容
                ],

                onInitGrid: function () {},
                
                loadComplete: function () {}

            });
        }
    });

    function accountTpl (obj) {
        var fieldsetHtml = [
            '<div>开户名: ' + obj.accountName + '</div>',
            '<div>账户号: ' + obj.accountNo + '</div>',
            '<div>开户支行: ' + obj.zbankName + '</div>'
        ].join('');

        return fieldsetHtml;
    }

    function userTpl(obj) {
        var fieldsetHtml = [
            '<div>用户姓名: ' + obj.userName + '</div>',
            '<div>手机号: ' + obj.mobile + '</div>'
        ].join('');

        return fieldsetHtml;
    }

    function timeFormatter (cellvalue, options, rowObject){
        if(cellvalue){
            return moment(cellvalue, 'YYYYMMDD').formatCnYMD();
        }else{
            return '';
        }
    }
    function fieldsetFormatter (cellvalue, options, rowObject){
        return FIELDSET_FLAG_MAP[cellvalue];
    }
    function oldFieldsetFormatter (cellvalue, options, rowObject){
        var fieldsetObj = cellvalue;
        switch(rowObject.fieldsetFlag){
            case '1': return accountTpl(fieldsetObj);
            case '2': return fieldsetObj.userPhone;
            default: return '无';
        }
    }
    function newFieldsetFormatter (cellvalue, options, rowObject){
        var fieldsetObj = cellvalue;
        switch(rowObject.fieldsetFlag){
            case '1': return accountTpl(fieldsetObj);
            case '2': return fieldsetObj.userPhone;
            case '3': return userTpl(fieldsetObj);
            default: return fieldsetObj;
        }
    }

    return View;
});