/*
    机构分润模型方案
 */
define(['App',
    'tpl!app/oms/disc/brh-disc/common/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/param',
    'jquery.jqGrid',
    'common-ui',
    'jquery.validate',
    'bootstrap-datepicker',
    'select2'
], function(App, tableCtTpl, paramLang) {

    var View = Marionette.ItemView.extend({
            tabId: 'menu.disc.profit',
            template: tableCtTpl,

            options:{
                gid: 'brh-profit-grid',
                rsId: 'brh.profit',
                caption: '机构分润模型方案',
                url: url._('brh.profit'),
                title: '编辑方案'
            },

            templateHelpers: function(){
                var me = this;
                return {
                    gid: me.getOption('gid')
                };
            },

            onRender: function() {
                var me = this;
                setTimeout(function() {
                    me.renderGrid();
                },1);
            },

            renderGrid: function() {
                var me = this;
                var addValidateRules = function(form){
                    Opf.Validate.addRules($(form),{
                        rules: {
                            'modelNm': {
                                required:true,
                                checkProfitNmRepeat: {
                                    param: {
                                        ignore: [$(form).find('input[name="model-name"]').val()],
                                        modelBrh: Ctx.getUser().get('brhCode')
                                    }
                            }
                            }
                        },
                        messages: {
                            'modelNm': {
                                required:'此字段需要填写',
                                checkProfitNmRepeat: "该方案名称已存在"
                            }
                        }
                    });
                };
                me.grid = App.Factory.createJqGrid({

                    rsId: me.getOption('rsId'),
                    caption: me.getOption('caption'),
                    actionsCol: {
                        canButtonRender: function (type, opts, rowData) {
                            if((type === 'del' || type === 'edit') && (rowData.modelBrh !== Ctx.getUser().get('brhCode'))) {
                             return false;
                            }
                         }
                    },
                    nav: {
                        add: {
                            beforeShowForm: function(form){
                                $.ajax({
                                    url: url._('brh.standard.treaty',{modelBrh: Ctx.getUser().get('brhCode')}),
                                    success: function(resp){
                                        require(['tpl!app/oms/disc/brh-disc/brh-profit/templates/standard-treaty.tpl'], function(Tpl){
                                            var data = me.fomatStandardTreaty(resp);
                                            var $html = $(Tpl({data: data}));
                                            var standardTreaty = _.keys(data);
                                            var tipToShow;
                                            $html.find('[name="standard"]:first').prop('checked', true); //设置默认选中第一个
                                            $html.find('[name="treaty"]:first').prop('checked', true);
                                            form.append($html);
                                            if (lackOfModel()) { //后台返回数据缺少模型
                                                //所缺模型的提示

                                                tipToShow = standardTreaty[0] === undefined ? '.treaty-tip,.standard-tip' :
                                                            standardTreaty[0] === 'standard' ? '.treaty-tip': '.standard-tip';
                                                $html.find(tipToShow).show();
                                                //禁止提交
                                                form.closest('.ui-dialog').find('#sData').addClass('disabled');
                                            }

                                            function lackOfModel(){
                                                return standardTreaty.length !== 2;
                                            }
                                        });
                                    }
                                });
                                addValidateRules(form);                                
                            },
                            beforeSubmit: function(postdata, form){
                                var $form = $(form);
                                var valid = $form.validate().form();
                                return [valid, ''];
                            } ,

                            onclickSubmit: function(params, postdata){
                                var $form = $('#FrmGrid_brh-profit-grid-table'),
                                    $standardId = $form.find('input[name=standard]:checked'),
                                    $treatyId = $form.find('input[name=treaty]:checked'),
                                    $standardNm = $standardId.closest('li').find('.standard-name'),
                                    $treatyNm = $treatyId.closest('li').find('.treaty-name');

                                postdata['standardNm'] = $standardNm.text();
                                postdata['treatyNm'] = $treatyNm.text();
                                postdata['standardId'] = $standardId.val();
                                postdata['treatyId'] = $treatyId.val();
                                return postdata;
                            }
                        },

                        view: {
                            
                        },

                        // edit: {
                        //     beforeShowForm: function(form){

                        //     }
                        // },

                        actions: {

                            editfunc: function(id){
                                $.ajax({
                                    url: url._('brh.standard.treaty',{modelBrh: Ctx.getUser().get('brhCode')}),
                                    success: function(resp){
                                        require(['app/oms/disc/brh-disc/brh-profit/edit-view'], function(View){
                                            var data = me.grid._getRecordByRowId(id);
                                                data.standardTreaty = me.fomatStandardTreaty(resp);
                                            var model = new Backbone.Model(data);
                                            var view = new View({model: model}).render();
                                            var $dialog = Opf.Factory.createDialog(view.$el, {
                                                destroyOnClose: true,
                                                title: me.getOption('title'),
                                                autoOpen: true,
                                                width: 500,
                                                height: 550,
                                                modal: true,
                                                buttons: [{
                                                    type: 'submit',
                                                    text: '保存',
                                                    click: save
                                                },{
                                                    type: 'cancel'
                                                }]
                                            });
                                            function save(){
                                                if(view.isValid()){
                                                    Opf.ajax({
                                                        url: url._('brh.profit',{id:id}),
                                                        type: "PUT",
                                                        jsonData: getPostData(),
                                                        success: function(){
                                                            me.grid.trigger('reloadGrid', {current: true});
                                                        },
                                                        complete: function(){
                                                            $dialog.dialog('close');
                                                        }
                                                    });
                                                }
                                            }
                                            function getPostData(){
                                                return {
                                                    id: id,
                                                    modelNm: view.getModelNm(),
                                                    standardId: view.getStandardId(),
                                                    treatyId: view.getTreatyId(),
                                                    standardNm: view.getStandardNm(),
                                                    treatyNm: view.getTreatyNm()
                                                };
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    },
                    gid: me.getOption('gid'),//innerly get corresponding ct '#discs-grid-table' '#discs-grid-pager'
                    url: me.getOption('url'),
                    colNames: {
                        id : 'id',
                        modelNm       : paramLang._('brh.profit.modelNm'),
                        treatyNm : paramLang._('brh.profit.treatyNm'),
                        standardNm : paramLang._('brh.profit.standardNm'),
                        standardId : paramLang._('brh.profit.standardId'),
                        treatyId     : paramLang._('brh.profit.treatyId')
                    },

                    colModel: [
                        {name: 'id', index:         'id', editable: false, hidden: true},
                        {name: 'modelNm', index:         'modelNm',search:true, _searchType:'string', editable: true},
                        {name: 'standardNm', index: 'standardNm', search:true, _searchType:'string', editable: false},
                        {name: 'treatyNm', index:     'treatyNm', search:true, _searchType:'string', editable: false},
                        {name: 'standardId', index:       'standardId', search:false,editable: false, hidden: true, viewable: false},
                        {name: 'treatyId', index: 'treatyId', search:false,editable: false, hidden: true, viewable: false}
                    ]
                });

            },

            fomatStandardTreaty: function(resp){
                return _.groupBy(resp, function(item){
                            return item.value.indexOf('H') == -1 ? 'standard' : 'treaty';
                        });
            }

        });
    
    App.on('brh:profit:list', function(){
        App.show(new View());
    });
    
    return View;

});