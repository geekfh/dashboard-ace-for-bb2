/**
 * 商户费率模型
 *
 * 直联跟间联都共用这一个view
 */

define([
    'tpl!app/oms/disc/mcht-disc/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/param',
    'jquery.jqGrid',
    'common-ui',
    'select2',
    'jquery.validate'
    ],function(tableCtTpl, paramLang){
        var STATUS_MAP = {
            '0':paramLang._('disc.status.0'),
            '1':paramLang._('disc.status.1')
        };
        var TRANSTYPE_MAP = {
            '0': '全部类',
            '1': '消费类',
            '2': '线上支付类'
        };
        var MCHTGRP_MAP = {
            '00': '全部类型',
            '01': '餐娱类',
            '02': '房产汽车类',
            '03': '民生类',
            '05': '一般类',
            '06': '批发类',
            '10': '扣率类',
            '11': '封顶类'

        };
        
        function statusFormatter(val){return STATUS_MAP[val];}
        function transTypeFormatter(val){return TRANSTYPE_MAP[val];}
        function mchtGrpFormatter(val){return MCHTGRP_MAP[val];}
        var View = Marionette.ItemView.extend({
                template: tableCtTpl,
                options:{
                    
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

                    var discGird = me.grid = App.Factory.createJqGrid({

                        rsId: me.getOption('rsId'),
                        caption: me.getOption('caption'),
                        actionsCol: {
                            // canButtonRender: function (type, opts, rowData) {
                            //     //000机构都可以修改
                            //     if ((type === 'edit') && Ctx.getUser().get('brhCode') == "000") {
                            //         return true;
                            //     }
                            //     //如果当前登陆机构不是此条目的上机机构，则不能修改
                            //     //下级机构以上级机构号开头
                            //     if ((type === 'edit') && (rowData.modelBrh.indexOf(Ctx.getUser().get('brhCode')) != 0 )) {
                            //         return false;
                            //     }
                            //     //当前登陆机构如果不是创建条目的机构，则不能删除
                            //     if((type === 'del') && (rowData.modelBrh !== Ctx.getUser().get('brhCode'))) {
                            //      return false;
                            //     }
                            // }
                        },
                        nav: {
                            formSize: {
                                width: Opf.Config._('ui', 'disc.grid.form.width'),
                                height: Opf.Config._('ui', 'disc.grid.form.height')
                            },

                            view: {
                                beforeShowForm: function(form){
                                    var selectId = Opf.Grid.getLastSelRowId(discGird),
                                        rowData = discGird._getRecordByRowId(selectId);

                                    $.ajax({
                                        url: url._('disc.mcht.pubdisc.algo', {modelId: rowData.modelId}), //模型ID
                                        type: 'GET',
                                        success: function(resp){
                                            require(['app/oms/disc/mcht-disc/scheme-list-view'],function(ListView){
                                                var collection = new Backbone.Collection(resp);
                                                var view = new ListView({collection: collection}).render();
                                                //只能查看
                                                view.$('.addItem').remove();
                                                form.append(view.$el);
                                            });
                                        }
                                    });
                                }
                            },

                            actions: {


                                addfunc: function(){
                                    require(['app/oms/disc/mcht-disc/add-model-view'], function(AddModelView){
                                        var addModelView = new AddModelView(me.options).render();
                                        var $dialog = Opf.Factory.createDialog(addModelView.$el, {
                                            destroyOnClose: true,
                                            title: me.getOption('title'),
                                            autoOpen: true,
                                            width: 900,
                                            height: 550,
                                            modal: true,
                                            buttons: [{
                                                type: 'submit',
                                                text: '保存',
                                                click: saveModel
                                            },{
                                                type: 'cancel'
                                            }]
                                        });
                                        function saveModel(){
                                            var method = "POST";
                                            if (addModelView.formIsValid()) {
                                                // 如果模型是基准费率与签约费率一一对应的情况，且还没有设置 基准费率方案
                                                //  让用户设置基准费率方案
                                                //  同时不能让用户更改 商户类型、卡类型、交易类型
                                                //  让用户输入一个新的模型名称，且不能与刚才设置的一样
                                                // 如果模型是基准费率与签约费率一一对应的情况，已经设置 基准费率方案
                                                //  传给后台一个数组，包含两份数据
                                                // 如果模型是其他类型
                                                //  传给后台一个数组
                                                if(addModelView.modelIsHD() && !addModelView.baseCollection){
                                                    addModelView.enableInputs(false);
                                                    addModelView.ui.modelNm.hide();
                                                    addModelView.ui.ForIdModelNm.show();
                                                    addModelView.shiftDisc();
                                                   
                                                } else if(addModelView.baseCollection) {
                                                    addModelView.sendHDData(method,function(){
                                                        $dialog.dialog('close');
                                                        me.grid.trigger("reloadGrid", [{current:true}]);
                                                    });
                                                } else {
                                                    addModelView.sendData(method, function(){
                                                        $dialog.dialog('close');
                                                        me.grid.trigger("reloadGrid", [{current:true}]);
                                                    });
                                                }
                                            } else if(addModelView.schemeIsEmpty()){ //如果没有设置计费方案
                                                addModelView.showErrorTag(true);
                                            }
                                        }
                                    });
                                },

                                editfunc: function(id){
                                    require(['app/oms/disc/mcht-disc/add-model-view'], function(EditModelView){
                                        var options = _.clone(me.options);
                                        var method = "PUT";
                                        options.data = me.grid._getRecordByRowId(id);
                                        var editModelView = new EditModelView(options).render();
                                        var $dialog = Opf.Factory.createDialog(editModelView.$el, {
                                            destroyOnClose: true,
                                            title: me.getOption('title'),
                                            autoOpen: true,
                                            width: 900,
                                            height: 550,
                                            modal: true,
                                            buttons: [{
                                                type: 'submit',
                                                text: '保存',
                                                click: saveModel
                                            },{
                                                type: 'cancel'
                                            }]
                                        });
                                        function saveModel(){
                                            if (editModelView.formIsValid()) {
                                                //对于 HD 的情况，分开编辑
                                                editModelView.sendData(method, function(){
                                                    $dialog.dialog('close');
                                                    me.grid.trigger("reloadGrid", [{current:true}]);
                                                });
                                            } else if(editModelView.schemeIsEmpty()){ //如果没有设置计费方案
                                                editModelView.showErrorTag(true);
                                            }
                                        }
                                    });
                                },

                                delfunc: function(id){
                                    Opf.confirm('您确定删除所选记录吗？', function (result) {
                                        if(result) {
                                            Opf.ajax({
                                                type: 'DELETE',
                                                url: url._('disc.mcht.del',{type:me.getOption('type'),id:id}),
                                                successMsg: '成功删除记录',
                                                success: function () {
                                                },
                                                complete: function () {
                                                    me.grid.trigger('reloadGrid', {current: true});
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        },
                        gid: me.getOption('gid'),
                        url: me.getOption('url'),
                        colNames: {
                            id : paramLang._('disc.mcht.model.id'),
                            modelNm       : paramLang._('disc.mcht.model.name'), //模型名称
                            modelId : paramLang._('disc.mcht.model.id'), //所属模型ID
                            modelBrh : paramLang._('disc.mcht.model.brh'), //所属机构编号
                            modelBrhName : paramLang._('disc.mcht.model.brh.name'), //所属机构名称
                            modelFlag     : paramLang._('disc.mcht.model.flag'), //状态
                            transType : paramLang._('disc.mcht.model.trans.type'), //交易类型
                            mchtGrp : paramLang._('disc.mcht.model.mcht.grp') //商户类型
                        },

                        colModel: [
                            {name:         'id', index:         'id', editable: false, hidden: true},
                            {name:         'modelId', index:         'modelId', editable: true, hidden: true},
                            {name:       'modelNm', index:       'modelNm', search:true,editable: true,_searchType:'string'},
                            {name: 'modelBrh', index: 'modelBrh', search:false,editable: true,
                                edittype:'select',
                                editoptions: {value: {}},
                                formoptions: {
                                    label: paramLang._('disc.forbranch')
                                }, hidden: false
                            },
                            {name: 'modelBrhName', index: 'modelBrhName', search:true,editable: false, _searchType:'string'},
                            {name:     'modelFlag', index:     'modelFlag', search:false,editable: true,formatter: statusFormatter,
                                edittype:'select',
                                editoptions: {value: STATUS_MAP}},
                            {name:     'transType', index:     'transType', search:false,editable: true,formatter: transTypeFormatter,
                                edittype:'select',
                                editoptions: {value: TRANSTYPE_MAP}},
                            {name:     'mchtGrp', index:     'mchtGrp', search:false,editable: true,formatter: mchtGrpFormatter,
                                edittype:'select',
                                editoptions: {value: {}}}
                            
                        ]
                    });

                }
        });

            function ajaxSelect (options) {
                var $el = $(options.el);
                var defaultVal = options.defaultVal == void 0 ? null : options.defaultVal;
                var placeholder = options.placeholder == void 0 ? null : options.placeholder;

                $.ajax({
                    type: 'GET',
                    url: options.url,
                    success: function (data) {
                        var strHtml = convertToSelectOptionsHtml(data);

                        if(options.append === true) {
                            $el.append(strHtml);
                        }else {
                            $el.empty().append(strHtml);
                        }
                        if(defaultVal){
                            $el.select2('val',defaultVal);
                        }
                        if(placeholder){
                            $el.select2({placeholder:placeholder});
                        }

                        $el.data('setup', true);
                        options.success && options.success.apply(null, arguments);

                    }
                });
            }

            function convertToSelectOptionsHtml  (data) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push('<option value="' + data[i].value + '">' + data[i].name + '</option>');
                }
                return arr.join('');
            }

        return View;
    });