/**
 * 商户费率模型 收费方案列表
 */

define([
    'tpl!app/oms/disc/mcht-disc/templates/scheme-lsit.tpl',
    'tpl!app/oms/disc/mcht-disc/templates/scheme-item.tpl'
    ], function(ListTpl,ItemTpl){
        var RowView = Marionette.ItemView.extend({
            tagName: 'tr',
            template: ItemTpl
        });

        var ComView = Marionette.CompositeView.extend({
            className: 'scheme-list',
            template: ListTpl,
            ui: {
                add: '.addItem'
            },
            events: {
                'click .canAddItem' : 'addItem'
            },
            childView: RowView,
            childViewContainer: '.scheme-container',
            initialize: function(){

            },

            onRender: function(){

            },

            templateHelpers: function(){
                return {
                    scheme: "收费方案"
                };
            },

            addItem: function(){
                var me = this;
                require(['app/oms/disc/mcht-disc/add-scheme-view'], function(View){
                    var addView = me.addView = new View({collection: me.collection}).render();
                    var $dialog = Opf.Factory.createDialog(addView.$el, {
                            destroyOnClose: true,
                            title: '',
                            autoOpen: true,
                            width: 900,
                            height: 550,
                            modal: true,
                            buttons: [{
                                type: 'submit',
                                text: '保存',
                                click: saveModel
                            },{
                                type: 'cancel',
                                click: cleanModel
                            }]
                        });
                    function saveModel(){
                        if(addView.validate()){
                            me.addView.setModelsValue();
                            me.collection.reset(me.collection.models);
                            $dialog.dialog('close');
                        }
                    }

                    function cleanModel(){
                        me.collection.each(function(model) {
                            if (model.get('floorAmount') === "") {
                                me.collection.remove(model);
                            }
                        });
                        $dialog.dialog('close');
                    }
                    me.trigger('remove:scheme:error');
                });
            },

            enableAdd: function(){
                var me = this;
                me.ui.add.addClass('canAddItem icon-pencil');
            },


            hideAddSchemeButton: function(){
                var me = this;
                me.ui.add.hide();
            },

            showAddSchemeButton: function(){
                var me = this;
                me.ui.add.show();
            },

            getModelId: function(){
                var me = this;
                return me.addView.collection.settingForModelId;
            }



        });

        return ComView;
    });