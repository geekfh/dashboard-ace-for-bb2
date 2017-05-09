/**
 * Created by wupeiying on 2016/6/28.
 */
define(['App',
    'jquery.jqGrid',
    'common-ui'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="param-taskTag-grid-table"></table>',
        '<div id="param-taskTag-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.param.taskTag',
        events: {},

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        renderGrid: function () {
            var me = this;
            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function(form){
                Opf.Validate.addRules(form, {
                    rules: {
                        proName: {
                            'required': true
                        },
                        proOprNo: {
                            'required': true
                        },
                        proOprName: {
                            'required': true
                        },
                        reviewLabel: {
                            'required': true
                        }
                    }
                });
            };
            var grid = App.Factory.createJqGrid({
                rsId: 'paramTaskTag',
                caption: '',
                nav: {
                    actions: {
                        search: false
                    },
                    add: {
                        beforeShowForm: function(form){
                            addValidateRules(form);
                            var $form = form;
                            $form.find('#tr_proOprNo').hide();
                            CommonUI.branchSelect2($form.find('#proOprName'), {});
                            $form.find('#reviewLabel').css('width', '200px').css('height', '120px');
                            $form.find('#remark').css('width', '200px').css('height', '120px');
                        },
                        onclickSubmit: function(params, postdata) {
                            var org_id = $('form[name="FormPost"]').find('#proOprName').select2('data').id;
                            var org_name = $('form[name="FormPost"]').find('#proOprName').select2('data').name;

                            postdata['proOprNo'] = org_id;
                            postdata['proOprName'] = org_name;

                            return postdata;
                        },
                        beforeSubmit: setupValidation
                    },
                    edit: {
                        beforeShowForm: function(form){
                            addValidateRules(form);
                            var $form = form;
                            $form.find('#tr_proOprNo').hide();
                            CommonUI.branchSelect2($form.find('#proOprName'), { defaultValue: $form.find('#proOprNo').val()});

                            var rp = new RegExp("<br>", "g");
                            var $reviewLabel = $form.find('#reviewLabel');
                            $reviewLabel.css('width', '200px').css('height', '120px');
                            $form.find('#reviewLabel').val($reviewLabel.val().replace(rp, '\n'));
                            $form.find('#remark').css('width', '200px').css('height', '120px');
                        },
                        beforeSubmit: setupValidation,
                        onclickSubmit: function(params, postdata) {
                            var org_id = $('form[name="FormPost"]').find('#proOprName').select2('data').id;
                            var org_name = $('form[name="FormPost"]').find('#proOprName').select2('data').name;

                            postdata['proOprNo'] = org_id;
                            postdata['proOprName'] = org_name;

                            return postdata;
                        }
                    }
                },
                actionsCol: {

                },
                gid: 'param-taskTag-grid',
                url: url._('task.tag.list'),
                colNames: {
                    id:'',
                    proName:'项目名称',
                    proOprNo:'机构号',
                    proOprName:'机构名称',
                    reviewLabel:'审核标签',
                    remark:'备注',
                    createTime:'创建时间',
                    updateTime:'更新时间'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'proName', editable: true},
                    {name: 'proOprNo', editable: true},
                    {name: 'proOprName', editable: true},
                    {name: 'reviewLabel', editable: true, edittype: 'textarea',
                        formatter: function(val){ return Opf.String.replaceWordWrapByHtml(val); }},
                    {name: 'remark', editable: true, edittype: 'textarea'},
                    {name: 'createTime'},
                    {name: 'updateTime'}
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    App.on('task:tag:list', function () {
        App.show(new View());
    });

    return View;
});