/**
 * @author hefeng
 * @date 2015/11/26
 * @description 拒绝理由模板设置
 */
define(['App',
	'jquery.jqGrid',
    'common-ui',
	'bootstrap-datepicker'
], function(App) {
    //表格模板
    var tpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="refuse-config-grid-table"></table>',
                '<div id="refuse-config-grid-pager" ></div>',
            '</div>',
        '</div>'
    ].join('');

    //刷新模板分类
    var refreshRefuseConfig = CommonUI.refreshRefuseConfig;

    return Marionette.ItemView.extend({
        tabId: 'menu.param.refuseConfig',
        template: _.template(tpl),

        onRender: function() {
            var me = this;
            _.defer(function(){
                me.renderGrid();
            });
        },

        renderGrid: function() {
            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    rules: {
                        refuseTitle: {
                            required: true,
                            maxlength: 50
                        },
                        refuseDesc: {
                            required: true,
                            maxlength: 300
                        },
                        dataLevel: {
                            required: true
                        },
                        dataSort: {
                            required: true,
                            integer: true,
                            intGteZero: true
                        }
                    }
                });
            };

            var renderDialogForm = function(form, rowData){
                addValidateRules(form);

                var $form = $(form);

                var prependTpl = '<tr class="FormData">';
                    prependTpl += '<td class="CaptionTD">模板分类</td>';
                    prependTpl += '<td class="DataTD">&nbsp;';
                    prependTpl += '<select name="dataLevel"></select>';
                    prependTpl += '</td>';
                    prependTpl += '</tr>';

                var appendTpl = '<tr class="FormData"><td colspan="2"><div class="container">';
                    appendTpl += '<a class="js-refuseConfig-add" href="javascript:void(0);">新增模板分类</a>';
                    appendTpl += '<div class="js-refuseConfig-classify" hidden>';
                    appendTpl += '<div class="row">';
                    appendTpl += '<div class="col-xs-8">';
                    appendTpl += '<input type="text" name="dataLevelTop" class="form-control" autofocus>';
                    appendTpl += '</div>';
                    appendTpl += '<div class="col-xs-4" style="padding: 0;">';
                    appendTpl += '<button type="button" name="refuseConfigAdd" class="btn btn-sm btn-success">新增</button>&nbsp;';
                    appendTpl += '<button type="button" name="refuseConfigCancel" class="btn btn-sm btn-default">取消</button>';
                    appendTpl += '</div>';
                    appendTpl += '</div>';
                    appendTpl += '</div>';
                    appendTpl += '</div></td></tr>';

                $form.find('table>tbody>tr[id*="id"]').before(prependTpl);
                $form.find('table>tbody').append(appendTpl);

                var js_refuseConfig_classify = $form.find('.js-refuseConfig-classify');
                var a_refuseConfig_add = $form.find('a.js-refuseConfig-add');
                var sel_refuseConfig_dataLevel = $form.find('select[name="dataLevel"]');
                var ipt_refuseConfig_dataLevel = $form.find('input[name="dataLevelTop"]');
                var btn_refuseConfig_add = $form.find('button[name="refuseConfigAdd"]');
                var btn_refuseConfig_cancel = $form.find('button[name="refuseConfigCancel"]');

                a_refuseConfig_add.on('click', function(){
                    js_refuseConfig_classify.toggle(!js_refuseConfig_classify.is(':visible'));
                });
                btn_refuseConfig_add.on('click', function(){
                    var postData = {
                        dataLevel: 1,
                        dataSort: null,
                        parentId: null,
                        refuseDesc: '',
                        refuseTitle: ipt_refuseConfig_dataLevel.val()
                    };

                    Opf.ajax({
                        type: 'POST',
                        url: url._('task.refuseConfig'),
                        jsonData: postData,
                        beforeSend: function(){
                            btn_refuseConfig_add.prop('disabled', true).text('新增...');
                        },
                        success: function(){
                            ipt_refuseConfig_dataLevel.val('').focus();
                            refreshRefuseConfig(sel_refuseConfig_dataLevel, rowData? rowData.parentId:"");
                        },
                        complete: function(){
                            btn_refuseConfig_add.prop('disabled', false).text('新增');
                        }
                    });
                });
                btn_refuseConfig_cancel.on('click', function(){
                    ipt_refuseConfig_dataLevel.val('');
                    js_refuseConfig_classify.hide();
                });

                _.defer(function(){
                    refreshRefuseConfig(sel_refuseConfig_dataLevel, rowData? rowData.parentId:"");
                });
            };

            var submitData = function(postdata, form){
                var $form = $(form);

                //postData
                $.extend(postdata, {
                    parentId: $form.find('select[name="dataLevel"]').val(),
                    dataLevel: 2,
                    status: 1 //状态  1：启用  2：禁用。需求没提暂时写死
                });

                return setupValidation(postdata, form);
            };

            var grid = App.Factory.createJqGrid({
                rsId: 'param.refuseConfig',
                caption: '审核拒绝理由模板',
                actionsCol:{del: false},
                nav: {
                    formSize: {
                        width: 420,
                        height: 480
                    },
                    add: {
                        beforeShowForm: function(form){
                            renderDialogForm(form);
                        },
                        beforeSubmit: submitData
                    },
                    edit: {
                        beforeShowForm: function(form){
                            var rowData = grid._getSelRecord();
                            renderDialogForm(form, rowData);
                        },
                        beforeSubmit: submitData
                    }
                },
                gid: 'refuse-config-grid',
                url: url._('task.refuseConfig'),
                colNames: {
                    id: 'id',
                    dataSort: '序号',
                    parentRefuseTitle: '所属分类',
                    refuseTitle: '标题',
                    refuseDesc: '内容'
                },
                colModel: [
                    {name:'id', index:'id', editable:false, hidden:true},
                    {name:'dataSort', index:'dataSort', width:'8%', editable:true},
                    {name:'parentRefuseTitle', index:'parentRefuseTitle', width:'25%', editable:false},
                    {name:'refuseTitle', index:'refuseTitle', width:'30%', search:true, editable: true, editoptions:{
                        style:'width:306px;'
                    }, _searchType:'string'},
                    {name:'refuseDesc', index:'refuseDesc', search:true, editable:true, edittype:'textarea', editoptions:{
                        cols:40, rows:8
                    }, _searchType:'string'}
                ],
                loadComplete: function() {}
            });
        }
    });
});
