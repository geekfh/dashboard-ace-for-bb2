/**
 * 机构计费模型 抽象类
 */
define([
    'tpl!app/oms/disc/brh-disc/common/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/param',
    'jquery.jqGrid',
    'common-ui',
    'jquery.validate',
    'bootstrap-datepicker',
    'select2'
], function(tableCtTpl, paramLang) {

    var DIC_STATUS = {'0':'启用', '1':'停用'};
    var DIC_IS_UNION_RATIO = {'0':'是', '1':'否'};

    //计费方案列表
    var DiscCollection = Backbone.Collection.extend({
        initialize: function (options) {
            this.discMId = options.discMId; 
        },
        url: function () {
            return  url._('disc.scheme', {modelId: this.discMId});
        }
    });

    var View = Marionette.ItemView.extend({

        template: tableCtTpl,

        templateHelpers: function(){
            return {
                gid: this.getOption('gid')
            };
        },

        onRender: function() {
            var me = this;
            setTimeout(function() {
                me.renderGrid();
            },1);
        },

        reloadGrid: function (options) {
            this.grid.trigger('reloadGrid', $.extend({current: true}, options));
        },

        renderGrid: function() {
            var me = this;

            var grid = me.grid = App.Factory.createJqGrid({
                rsId: me.getOption('rsId'),
                caption: me.getOption('caption'),
                actionsCol: {
                     canButtonRender: function (type, opts, rowData) {
                        // 只能删除/编辑 本机构的模型
                        if ((type === 'del' || type === 'edit') && 
                                (rowData.modelBrh !== Ctx.getUser().get('brhCode'))) {
                            return false;
                        }
                        return true;
                     }
                },
                nav: {
                    formSize: {
                        width: Opf.Config._('ui', 'disc.grid.form.width'),
                        height: Opf.Config._('ui', 'disc.grid.form.height')
                    },
                    add: {
                        beforeShowForm: _.bind(beforeShowAddForm, me),
                        beforeSubmit: Opf.Validate.validateBeforeJqGridFormSubmit
                    },
                    view: {
                        width: 1100,
                        beforeShowForm: _.bind(beforeShowViewForm, me)
                    },
                    actions: {
                        editfunc: _.bind(editfunc, me),
                        delfunc: _.bind(delfunc, me)
                    }
                },
                gid: me.getOption('gid'),
                url: me.getOption('url'),
                colNames: {
                    id : paramLang._('disc.model.id'),
                    modelId : paramLang._('disc.model.id'),
                    modelNm       : paramLang._('disc.model.name'),
                    modelBrh : paramLang._('disc.model.brh'),
                    modelBrhName : paramLang._('disc.model.brh.name'),
                    modelFlag     : paramLang._('disc.model.flag'),
                    uniteRatio : paramLang._('disc.model.unite.ratio')
                },

                colModel: [
                    {name:'id', index:'id', editable: false, hidden: true},
                    {name:'modelId', index:'modelId', editable: true, hidden: true},
                    {name:'modelNm', index:'modelNm', search:true,editable: true,
                        _searchType:'string', editoptions:{maxlength: 40}
                    },
                    {name:'modelBrh', index:'modelBrh', search:false,editable: true,
                        // edittype: 'select',
                        formoptions: { label: paramLang._('disc.forbranch')},
                        hidden: false
                    },
                    {name:'modelBrhName', index:'modelBrhName', search:true, editable: false, _searchType:'string'},
                    {name:'modelFlag', index:'modelFlag', search:false, editable: true, formatter: _.resultFn(DIC_STATUS),
                        edittype:'select',
                        editoptions: {value: DIC_STATUS}
                    },
                    {name:'uniteRatio', index:'uniteRatio', search:false, editable: true, formatter:_.resultFn(DIC_IS_UNION_RATIO),
                        edittype:'select',
                        editoptions: {value: DIC_IS_UNION_RATIO}
                    }
                ]
            });

        }

    });
    
    function beforeShowAddForm ($form) {
        var me = this;
        var tipHtml = [
            '<br>',
            '<label class="length-tip">输入长度要在0-40个字节之间(一个中文字算3个字节)</label>'
        ].join('');

        var $brhInput = $form.find('[name="modelBrh"]');

        $form.find('#tr_modelBrh .CaptionTD').html('所属机构');
        $form.find('#tr_modelId').hide();
        $form.find('#uniteRatio').val('1'); //暂时设置默认值为 不统一设置分润


        $form.find('#modelNm').after($(tipHtml));

        require(['common-ui'], function(CommonUI){
            CommonUI.select2Branch4DiscByInput($brhInput, {
                modelType: me.getOption('modelType')
            });
        });

       Opf.Validate.addRules($form,{
            rules: {
                'modelNm': {
                    required:true,
                    utf8ByteLength: [0, 40],
                    uniqueBrhDiscModelName: {
                        depends: function () {
                            return $brhInput.val();
                        },
                        param: {
                            brhCode: function () {
                                return $brhInput.val();
                            }
                        }
                    }
                },
                'modelBrh': {required: true}
            },
            messages: {
                'modelNm': {
                    required:'此字段需要填写',
                    checkBrhModelNmRepeat: '此模型名称已存在'
                },
                'modelBrh': {required: '此字段需要选择'}
            }
        });                           
    }

    function beforeShowViewForm ($form) {
        var rowData = Opf.Grid.getLastSelRecord(this.grid);

        if(rowData) {
            require(['app/oms/disc/brh-disc/common/edit/disc-table-view'],function(View){
                var view = new View({
                    modelRecord: rowData,
                    renderTo: $form,
                    readOnly: true
                }).render();
                view.$el.wrap('<div class="disc-table"/>');
            });
        }
    }

    function editfunc (id){
        var me = this;

        require(['app/oms/disc/brh-disc/common/edit/edit-model-view'], function(ModelView){

            var data = me.grid._getRecordByRowId(id);

            var modelView = me.modelView = new ModelView({
                modelType: me.getOption('modelType'),
                modelRecord: data,
                title: me.getOption('title')
            }).render();

            modelView.on('submit:success', function () {
                me.reloadGrid();
            });
        });
    }

    function delfunc (id) {
        var me = this;

        Opf.confirm('您确定删除所选记录吗？', function (result) {
            if(result) {
                Opf.ajax({
                    type: 'DELETE',
                    url: url._('disc.brh',{id:id}),
                    successMsg: '成功删除记录',
                    complete: function () {
                        me.reloadGrid();
                    }
                });
            }
        });
    }


    return View;
});

