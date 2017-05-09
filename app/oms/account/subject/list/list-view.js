/**
 * Created by wupeiying on 2015/9/15.
 */
define(['App',
    'jquery.jqGrid',
    'jquery.validate',
    'select2'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="account-subject-grid-table"></table>',
        '<div id="account-subject-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var LEVEL_MAP = {
        1:'一级',
        2:'二级',
        3:'三级'
    };

    var DIRECTION_MAP = {
        1:'借',
        2:'贷'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.subject.management',
        events: {},

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        renderGrid: function () {
            var setupValidation = Opf.Validate.setup;
            $.validator.addMethod('letter', function(value, element) {
                var valid=false;
                var reg = /^[a-zA-Z]+$/; //字母
                if(reg.test(value)){
                    valid = true;
                }
                return this.optional(element) || valid;
            }, "请输入字母，请重新填写.");
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    rules: {
                        enName: {
                            'required':true,
                            letter: true
                        },
                        cnName: {
                            'required':true
                        },
                        parentSubjectCode: {
                            'required':true
                        }
                    }
                });
            };
            var grid = App.Factory.createJqGrid({
                rsId: 'subjectConfig',
                caption: '',
                nav: {
                    actions: {
                        search: false
                    },
                    add: {
                        beforeShowForm: function(form) {
                            //var rowData = grid._getRecordByRowId(id);
                            addValidateRules(form);
                            var $form = $(form);
                            var subjectLevel = $form.find('[name="subjectLevel"]').val();
                            $form.find('#tr_subjectLevel').hide();
                            //$form.find('[name="subjectLevel"]').on('change', function(){
                            //    subjectLevel = $(this).val();
                            //});
                            $form.find("[name='parentSubjectCode']").select2({
                                placeholder: '--请选择科目--',
                                minimumResultsForSearch: Infinity,
                                width: '50%',
                                ajax: {
                                    type: "GET",
                                    async: false,
                                    url: url._('account.subject.info'),
                                    dataType: 'json',
                                    data: function (term) {
                                        return {
                                            subjectLevel: 1
                                        };
                                    },
                                    results: function (data) {
                                        return {
                                            results: data
                                        };
                                    }
                                },
                                id: function (e) {
                                    return e.subjectCode;
                                },
                                formatResult: function(data, container, query, escapeMarkup){
                                    return data.cnName;
                                },
                                formatSelection: function(data, container, escapeMarkup){
                                    return data.cnName;
                                }
                            });
                        },
                        beforeSubmit: setupValidation
                    },
                    edit: {
                        beforeShowForm: function(form) {
                            addValidateRules(form);
                            form.find('#tr_subjectLevel').hide();
                            form.find('#tr_parentSubjectCode').hide();
                        },
                        beforeSubmit: setupValidation
                    }
                },
                actionsCol: {
                    del: false,
                    view: false,
                    canButtonRender: function (name, options, rowData) {
                        if(name === 'edit' && rowData.subjectFlag == 0){
                            return false;
                        }
                    }
                },
                gid: 'account-subject-grid',
                url: url._('account.subject.list'),
                colNames: {
                    id				: '',//'等于subjectCode'
                    subjectId		: '科目ID',
                    subjectCode 	: '科目编号',
                    enName          : '科目英文名称',
                    cnName    	    : '科目中文名称',
                    subjectLevel    : '科目级别',//(1一级2二级 3三级)
                    parentSubjectCode: '科目',//科目父编号
                    direction       : '余额方向',//（1借 2贷）
                    subjectFlag     : '科目标识'
                },
                colModel: [
                    {name:'id', hidden:true },
                    {name:'subjectId', hidden:true },
                    {name:'subjectCode'},
                    {name:'enName', editable: true},
                    {name:'cnName', editable: true},
                    {name:'subjectLevel', editable: true, formatter: levelFormatter,
                        edittype: 'select',
                        editoptions: {
                            value: LEVEL_MAP,
                            sopt: ['eq']
                        }
                    },
                    {name:'parentSubjectCode', editable: true, hidden:true},
                    {
                        name: 'direction', formatter: directionFormatter, editable: true,
                        edittype: 'select',
                        editoptions: {
                            value: DIRECTION_MAP,
                            sopt: ['eq']
                        }
                    },
                    {name: 'subjectFlag', formatter: function(val){ return SUBJECTFLAG_MAP[val] || '';} }
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    var MAIN_MAP = {
        0: '普通用户',
        1: '企业用户'
    };
    var SUB_MAP = {
        1: '资金',
        2: '积分',
        3: '信用'
    };
    var SUBJECTFLAG_MAP = {
        0: '系统内置',
        1: '手工录入'
    };

    function getDetailDialog(rowData){
        //TODO block target
        var code = parseInt(rowData.subjectCode);
        Opf.ajax({
            type: 'GET',
            url: url._('account.subject.detail', {subjectCode: code}),
            success: function (data) {
                var html = ['<div>',
                '<div style="margin-left: -30px; font-size: 12px;">',
                '<div style="padding: 15px 0 8px 150px;border-bottom: 1px dotted #eee;"><strong>科目代号:</strong><label style="padding-left: 15px;" for="subjectCode">',
                    code,
                '</label></div>',
                '<div style="padding: 15px 0 8px 125px;border-bottom: 1px dotted #eee;"><strong>科目中文名称:</strong><label style="padding-left: 15px;" for="cnName">',
                    rowData.cnName,
                '</label></div>',
                '<div style="padding: 15px 0 8px 112px;border-bottom: 1px dotted #eee;"><strong>关联主账户类型:</strong><label style="padding-left: 15px;" for="relatedMainAccount">',
                    MAIN_MAP[data.relatedMainAccount] || '',
                '</label></div>',
                '<div style="padding: 15px 0 8px 112px;border-bottom: 1px dotted #eee;"><strong>关联子账号类型:</strong><label style="padding-left: 15px;" for="relatedSubAccount">',
                    SUB_MAP[data.relatedSubAccount] || '',
                '</label></div>',
                '</div>',
                '</div>'].join('');
                var $dialog = Opf.Factory.createDialog(html, {
                    destroyOnClose: true,
                    title: '查看科目和账户类型关联',
                    autoOpen: true,
                    width: 450,
                    height: 300,
                    modal: true,
                    buttons: [{
                        type: 'cancel'
                    }]
                });
            },
            complete: function () {
                //$dialog.dialog('close');
            }
        });
    }

    function levelFormatter(val){
        return LEVEL_MAP[val] || '';
    }

    function directionFormatter(val){
        return DIRECTION_MAP[val] || '';
    }

    App.on('subject:management:list', function () {
        App.show(new View());
    });

    return View;
});