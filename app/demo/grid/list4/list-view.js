/**
 * User hefeng
 * Date 2016/7/18
 */
define([
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
], function() {
    // 页面模板配置
    var tpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="demo-page-grid-list4-grid-table"></table>',
                '<div id="demo-page-grid-list4-grid-pager" ></div>',
            '</div>',
        '</div>'
    ].join('');

    //处理结果
    var DEALRESULT_MAP = {
        '0': '全部',
        '1': '处理完成',
        '2': '处理未完成'
    };

    // 配置视图
    return Marionette.ItemView.extend({
        // TAB唯一标识
        tabId: 'demo.menu.grid.list4',

        template: _.template(tpl),

        ui: {
            demoTable: '#demo-page-grid-list4-grid-table'
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
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    //要对select2作验证，选择添加select2前 input 的 name
                    //required: {boolean}
                    //number: {boolean},
                    //maxLength {number}
                    rules: {
                        promtsName: { //活动方案名称必填
                            required : true
                        },amount: { //活动优惠额必填且必须是数字
                            required : true,
                            number:true
                        },condationAmt: { //活动条件金额必填且必须是数字
                            required: true,
                            number:true
                        },condationNum: { //活动条件笔数必填且必须是数字
                            required: true,
                            number:true
                        },beginTime: { //活动开始时间必填
                            required: true
                        },endTime: { //活动结束时间必填
                            required: true
                        }
                    }
                });
            };

            me.grid = App.Factory.createJqGrid({
                caption: '动态表头示例',
                rsId:'demo.pm.grid.list4',
                gid: 'demo-page-grid-list4-grid',
                url: url._('demo.api.grid.list4'),
                autoResize: false,
                overflow: true,
                dynamic: true,
                dynamicUrl: 'app/demo/data/list4-conf.json',
                actionsCol: {
                    view: false
                    //width: 300,
                    //edit: false,
                    //del : false,
                    //extraButtons:[]
                },
                filters: [
                    {
                        caption: '精准搜索',
                        defaultRenderGrid: false,
                        canSearchAll: false,
                        isSearchRequired: true,
                        components: [
                            {
                                label: '处理结果',
                                name: 'dealResult',
                                type: 'select',
                                defaultValue: "0",
                                options: {
                                    sopt: ['eq'],
                                    value: DEALRESULT_MAP
                                }
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ],
                nav: {
                    formSize: {
                        width: Opf.Config._('ui', 'grid.form.width'),
                        height: Opf.Config._('ui', 'grid.form.height')
                    },
                    add: {
                        beforeShowForm: function(form){
                            //增加校验规则
                            addValidateRules(form);

                            //隐藏ID字段
                            $("input[name='id']",form).closest("tr#tr_id").hide();
                        },
                        /*onclickSubmit: function(params, postdata){
                         return postdata;
                         },*/
                        beforeSubmit: setupValidation
                    },
                    edit: {
                        beforeShowForm: function(form){
                            addValidateRules(form);
                            $("input[name='id']",form).closest("tr#tr_id").hide();
                        },
                        beforeSubmit: setupValidation
                    }
                },
                colNames: {},
                colModel: [],
                /*colNames: {
                    //id: 'ID',
                    field1: '字段1',
                    field2: '字段2',
                    field3: '字段3',
                    field4: '字段3',
                    field5: '字段3',
                    field6: '字段3',
                    field7: '字段3',
                    field8: '字段3',
                    field9: '字段3',
                    field31: '字段3',
                    field32: '字段3',
                    field33: '字段3',
                    field34: '字段3'
                },

                colModel: [
                    //{ name:'id', index:'id', hidden:true },
                    { name:'field1', index:'field1', width:180, frozen:true, editable:true },
                    { name:'field2', index:'field2', width:180, frozen:true, editable:true },
                    { name:'field3', index:'field3', width:200, frozen:true },
                    { name:'field4', index:'field3' },
                    { name:'field5', index:'field3' },
                    { name:'field6', index:'field3' },
                    { name:'field7', index:'field3' },
                    { name:'field8', index:'field3' },
                    { name:'field9', index:'field3' },
                    { name:'field31', index:'field3' },
                    { name:'field32', index:'field3' },
                    { name:'field33', index:'field3' },
                    { name:'field34', index:'field3', viewable:false, search:true }
                ],*/

                loadComplete: function() {
                    console.info("Load complete");
                },

                gridComplete: function() {
                    console.log("grid complete");
                }
            });
        }
    });

});