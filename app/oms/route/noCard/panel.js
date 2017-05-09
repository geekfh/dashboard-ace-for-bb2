define([
    'tpl!app/oms/route/noCard/templates/panel.tpl',
    'app/oms/route/noCard/sub/txn-model-list',
    'app/oms/route/noCard/sub/channel-model-list',
    'app/oms/route/noCard/sub/mcht-model-list',
    'app/oms/route/noCard/sub/route-conf-head'
], function(tpl, TxnListView, ChannelListView, MchtListView, HeadMenu) {

    var VIEW_BINDING = 'view.binding',  // 当前操作为查看绑定关系
        EDIT_BINDING = 'edit.binding',  // 当前操作为编辑绑定关系

        BATCH_BIND   = 'batch.bind',    // 批量选中
        BATCH_UNBIND = 'batch.unbind';  // 批量反选


    var PanelView = Marionette.LayoutView.extend({
        tabId: 'menu.nocard.route.config',
        template: tpl,

        regions: {
            txnModel: '.txn-model-list',
            channelModel: '.channel-model-list',
            mchtModel: '.mcht-model-list'
        },

        // triggers: {
        //     'click .route-conf-edit': 'click:edit',
        //     'click .route-conf-ok': 'click:ok',
        //     'click .route-conf-cancel': 'click:cancel'
        // },

        initialize: function () {
            var me = this;

            var layoutMap = me.layoutMap = {
                'txn': new TxnListView(),
                'channel': new ChannelListView(),
                'mcht': new MchtListView()
            };
           
            _.each(layoutMap, function (view, prefix) {
                me._proxyChildEvents(view, prefix);

            });

            this.operateStatus = VIEW_BINDING;

        },

        onRender: function () {
            this.txnModel.show(this.layoutMap.txn);
            this.channelModel.show(this.layoutMap.channel);
            this.mchtModel.show(this.layoutMap.mcht);

            var menu = this.menu = new HeadMenu();
            // var $pageHeader = $('#page-content').find('.page-header').find('.text');
            this.$el.prepend(menu.$el);

            this._proxyChildEvents(menu, 'head');
            this.updateOperateStatus();

        },


        // 抄袭Backbone.Marionette
        // 监听view 触发的所有事件，
        // prefix：为view触发的事件名称前加一个前缀
        // 然后自身触发这个事件
        _proxyChildEvents: function(view, prefix) {
            this.listenTo(view, 'all', function() {
                var args = Array.prototype.slice.call(arguments);
                var rootEvent = args[0];

                args[0] = prefix + ':' + rootEvent;
                args.splice(1, 0, view);

                this.triggerMethod.apply(this, args);

            }, this);
        },

        // 操作类别改变时更新UI（操作类型：查看绑定关系，编辑绑定关系）
        updateOperateStatus: function () {
            var ui = this.menu.ui;

            // 更新UI
            ui.confEdit.toggle(this.operateStatus === VIEW_BINDING);
            ui.confOk.toggle(this.operateStatus === EDIT_BINDING);
            ui.confCancel.toggle(this.operateStatus === EDIT_BINDING);

            this.$el.toggleClass('route-panel-editing', this.operateStatus === EDIT_BINDING);
            this.$el.toggleClass('route-panel-looking', this.operateStatus === VIEW_BINDING);
        },

        // 点击了"修改模型间的绑定关系"按钮
        onHeadClickEdit: function () {
            this.operateStatus = EDIT_BINDING;
            this.updateOperateStatus();
            this.cleanAllEditBindingRelevance();
            this.txnChoiceType = void 0;

            this.layoutMap.channel.cleanFilterByTxnId();
            this.layoutMap.mcht.cleanFilterByChannelId();

        },

        // 在修改模型间的绑定关系时点击了保存按钮
        onHeadClickOk: function () {
            var me = this;

            if (me.typeOfSaveBind === BATCH_BIND) {  // 当前的任务是：批量选中
                me.batchSaveBind({operate: 'bind', 
                    filters: me.layoutMap.mcht.getSearchInputValue(), 
                    exclude: me.layoutMap.mcht.getUncheckedChildrenView()}).done(function () {

                    me.backToLookingView();
                    me.refreshListModels();
                });

            } else if (me.typeOfSaveBind === BATCH_UNBIND) {  // 当前的任务是：批量反选
                me.batchSaveBind({operate: 'unbind', 
                    filters: me.layoutMap.mcht.getSearchInputValue(), 
                    exclude: me.layoutMap.mcht.getCheckedChildrenView()}).done(function () {

                    me.backToLookingView();
                    me.refreshListModels();
                });

            } else {
                var saveDiffer = me.saveBind();
                saveDiffer && saveDiffer.done(function () {
                    me.backToLookingView();
                    me.refreshListModels();
                });
                
            }

        },


        // 保存绑定关系
        saveBind: function () {
            if (this.nowEditingRelevanceModelList) {
                var modelType = this.nowEditingRelevanceModelList.modelType;
                var id = this.nowEditingRelevanceModelList.model.get('id');
                var submitUrl;

                if (modelType === 'txn') {
                    submitUrl = url._('nocard.route.txn.bind', {id: id});
                    return this.submitEditRelevance(submitUrl, this.layoutMap.channel.getBindRelevance());
                }

                if (modelType === 'channel') {
                    submitUrl = url._('nocard.route.channel.bind', {id: id});
                    return this.submitEditRelevance(submitUrl, this.layoutMap.mcht.getBindRelevance());
                }

            } else {
                this.operateStatus = VIEW_BINDING;
                this.updateOperateStatus();

            }

        },


        // 批量保存绑定关系或者解绑
        batchSaveBind: function (submitData) {
            var modelType, submitUrl, id;
            this.nowEditingRelevanceModelList && (modelType = this.nowEditingRelevanceModelList.modelType);

            if (modelType === 'channel') {
                id = this.nowEditingRelevanceModelList.model.get('id');
                submitUrl = url._('route.batch.bind', {id: id});

                return this.submitEditRelevance(submitUrl, submitData);
            }

        },


        // 返回一个Ajax，向后台提交修改后的绑定关系的内容
        submitEditRelevance: function (url, submitData) {
            var me = this;
            return Opf.ajax({
                url: url,
                type: 'POST',
                jsonData: submitData,
                success: function (resp) {
                    Opf.alert('修改成功');
                    // me.cleanWaiteToSaveModelList();
                },
                error: function () {
                    Opf.alert('修改失败');
                },
                complete: function () {
                    // me.backToLookingView();
                }
            });
        },


        // 在修改模型间的绑定关系时点击了取消按钮
        onHeadClickCancel: function () {
            this.backToLookingView();
        },


        // 返回到查看绑定关系的视图
        backToLookingView: function () {
            this.operateStatus = VIEW_BINDING;
            this.updateOperateStatus();
            this.cleanAllEditBindingRelevance();
            this.typeOfSaveBind = 'default';
            // this.cleanWaiteToSaveModelList();

        },

        // 当视图从编辑绑定关系切换到查看绑定关系的时候，清除每个模型列表的高亮和不高亮。
        cleanAllEditBindingRelevance: function () {
            this.nowEditingRelevanceModelList = void 0;
            _.each(this.layoutMap, function (listView, prefix) {
                listView.cleanEditRelevanceStatus();
            });
        },

        // 监听交易模型列表下的模型点击事件
        onTxnChildviewClickContent: function (ListView, ModelView, obj) {
            // 如果是在查看绑定关系的情况下点击了某个模型
            if (this.operateStatus === VIEW_BINDING) {
                this.clickTxnModelWhenView(ListView, ModelView, obj);
            }

            // 如果是在编辑绑定关系的情况下点击了某个模型
            if (this.operateStatus === EDIT_BINDING) {
                this.clickTxnModelWhenEdit(ListView, ModelView, obj);
            }
        },

        // 在查看绑定关系的情况下，点击了某个模型
        clickTxnModelWhenView: function (ListView, ModelView, obj) {
            // 获取点击的模型
            // var choiceType = ListView.selectChildView(ModelView);
            // this.txnChoiceType = choiceType;
            this.uncheckedChildrenModelView('channel', 'mcht');

            // 如果点击的模型是被选中
            // 下一级通道模型需要赛选出与被选中的模型有绑定关系的
            // 通道商户模型变为不可编辑状态
            // if (choiceType === 'selected') {
            if ( ModelView.isChecked() ) {
                ListView.filterCheckbox(ModelView);
                this.layoutMap.channel.filterByTxnId(obj.model.get('id'));
                this.layoutMap.mcht.disableChoice();

                this.txnChoiceType = 'selected';
            }

            // 如果点击的模型是被反选
            // 下一级清算模型清除赛选条件
            // 通道商户模型变为可编辑的状态
            // if (choiceType === 'unselected') {
            if ( ModelView.isUnchecked() ) {
                this.layoutMap.channel.cleanFilterByTxnId();
                this.layoutMap.mcht.cleanFilterByChannelId();
                this.layoutMap.mcht.enableChoice();

                this.txnChoiceType = 'unselected';
            }
        },

        // 在编辑绑定关系的情况下，点击了某个模型
        clickTxnModelWhenEdit: function (ListView, ModelView, obj) {
            // 获取点击的模型
            // var choiceType = ListView.selectChildViewWhenEdit(ModelView);
            var channelModelIds = obj.model.get('channelModels') ? obj.model.get('channelModels').split(',') : [];


            // 如果点击的模型是被选中
            // 下一级通道模型需要更新模型的状态，与被选中的模型有关联的置为高亮，没有绑定关系的变为暗色。
            // 通道商户模型变为不可编辑的状态
            if ( ModelView.isChecked() ) {
                ListView.filterCheckbox(ModelView);
                // 如果点击选中一个交易模型后，设置当前正在被编辑的交易模型
                this.nowEditingRelevanceModelList = ModelView; 

                this.layoutMap.channel.setFiltersByIds(channelModelIds);
                this.layoutMap.mcht.disableChoice();
            }

            // 如果点击的模型是被反选
            // 下一级通道模型清除状态更新
            if ( ModelView.isUnchecked() ) {
                // 如果点击反选一个交易模型后，清除当前正在编辑的模型
                this.nowEditingRelevanceModelList = void 0;

                this.layoutMap.channel.clearFiltersByIds();
                this.layoutMap.mcht.clearFiltersByIds();
                this.layoutMap.mcht.enableChoice();
                // this.cleanWaiteToSaveModelList();
            }
        },


        // 监听通道模型列表下的模型点击事件
        onChannelChildviewClickContent: function (ListView, ModelView, obj) {
            if (this.operateStatus === VIEW_BINDING) {
                this.clickChannelModelWhenView(ListView, ModelView, obj);
            }

            if (this.operateStatus === EDIT_BINDING) {
                this.clickChannelModelWhenEdit(ListView, ModelView, obj);
            }
        },

        // 在查看绑定关系的情况下，点击了某个模型
        clickChannelModelWhenView: function (ListView, ModelView, obj) {
            // var choiceType = ListView.selectChildView(ModelView);
            this.uncheckedChildrenModelView('mcht');

            // 选中，下一级赛选
            if ( ModelView.isChecked() ) {
                ListView.filterCheckbox(ModelView);
                this.layoutMap.mcht.filterByChannelId(obj.model.get('id'));
                this.layoutMap.mcht.enableChoice();
            }

            // 反选，下一级清除赛选
            if ( ModelView.isUnchecked() ) {
                this.layoutMap.mcht.cleanFilterByChannelId();
                this.txnChoiceType === 'selected' && this.layoutMap.mcht.disableChoice();
            }

        },

        // 在编辑绑定关系下点击了某个模型
        clickChannelModelWhenEdit: function (ListView, ModelView, obj) {
            if (ListView.operateObj && ListView.operateObj.operate === 'editingRelevance') {
                return;
            }

            // var choiceType = ListView.selectChildViewWhenEdit(ModelView);
            var channelMchtModels = obj.model.get('channelMchtModels') ? obj.model.get('channelMchtModels').split(',') : [];
            this.typeOfSaveBind = 'default';
            
            // 选中，下一级随绑定关系更新状态
            if ( ModelView.isChecked() ) {
                ListView.filterCheckbox(ModelView);
                // 如果点击选中一个通道模型后，设置当前正在被编辑的通道模型
                this.nowEditingRelevanceModelList = ModelView; 

                this.layoutMap.mcht.setFiltersByIds(channelMchtModels);
                this.layoutMap.txn.disableChoice();
            }

            // 反选，下一级清除状态
            if ( ModelView.isUnchecked() ) {
                // 如果点击反选一个通道模型后，清除当前正在编辑的模型
                this.nowEditingRelevanceModelList = void 0;

                this.layoutMap.mcht.clearFiltersByIds();
                this.layoutMap.txn.enableChoice();
                
                // this.cleanWaiteToSaveModelList();
            }

            // if (choiceType === 'edit.bind') {
            //     this.setWaiteToSaveModelList();
            // }
        },

        // 将列表下所有选项反选
        uncheckedChildrenModelView: function () {
            var me = this;
            _.each(arguments, function (layout) {
                me.layoutMap[layout].uncheckedChildrenView();
            });
        },

        checkedChildrenModelView: function () {
            var me = this;
            _.each(arguments, function (layout) {
                me.layoutMap[layout].checkedChildrenView();
            });
        },

        // 刷新
        refreshListModels: function () {
            _.each(this.layoutMap, function (ModelView) {
                ModelView.refreshModels();
            });
        },

        onMchtBatchChecked: function (childView, obj) {
            var me = this;
            //如果是 编辑绑定关系 状态
            if(me.operateStatus === EDIT_BINDING) {
                me.typeOfSaveBind = BATCH_BIND;
            }
        },

        onMchtBatchUnchecked: function (childView, obj) {
            var me = this;

            if(me.operateStatus === EDIT_BINDING) {
                me.typeOfSaveBind = BATCH_UNBIND;
            }
            // Opf.confirm('解绑当前搜索条件下的所有通道商户模型', function (result) {
            //     if (result) {
            //         me.batchSaveBind({operate: 'unbind', filter: childView.getSearchInputValue()}).done(function () {
            //             childView.refreshModels();
            //         });

            //     }
            // });
        }

    });


    App.on('nocard:route:config', function () {
        App.show(new PanelView());
    });
    
    return PanelView;
    
});