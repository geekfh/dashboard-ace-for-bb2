
define([
    'tpl!app/oms/route/noCard/templates/mcht-model-list.tpl',
    'app/oms/route/noCard/sub/model-list',
    'app/oms/route/noCard/sub/model',
    'app/oms/common/store/OpfPageableCollection',
    'upload',
    'app/oms/route/noCard/sub/mcht-filters'
], function(tpl, ModelListView, ModelView, OpfPageableCollection, Uploader, FiltersView) {


    var Collection = OpfPageableCollection.extend({

        state: {
            pageSize: 5
        },

        queryParams: {
            // kw 和 filters 互斥
            kw: '',
            filters: ''
        },

        initialize: function () {
            var me = this;
            OpfPageableCollection.prototype.initialize.apply(this, arguments);

            this._strUrl = url._('route.nocard.mcht');

            this.dataMode = this.batchOperateType = 'default';

            // batchOperateType ： defaul（仅仅是单纯的选中了若干个模型）
            // batch（点击了全选后全选模型）

            this.on('reset', function () {
                me.batchOperateType = 'default';
            });
        },

        setBatchOperateType: function (type) {
            this.batchOperateType = type;
        },

        url: function () {
            console.log('>>>商户通道模型collection、 返回url', this._strUrl);
            return this._strUrl;
        },

        // 替换为模糊搜索
        applyKwSearch: function (kw) {
            //TODO check kw null
            this.dataMode = 'kwSearch';
            
            this.setUrl(url._('route.nocard.mcht'));
            this._lastKw = kw;

            this.resetQueryParams();
            this.queryParams.kw = encodeURIComponent(kw);

            this.getFirstPage({reset: true});
        },

        resetDefault: function () {
            this.dataMode = 'default';
            this.resetQueryParams();
            this.getFirstPage({reset: true});
        },
        resetQueryParams: function () {
            var me = this;
            _.each(['kw', 'filters'], function (key) {
                delete me.queryParams[key];
            });
        },

        // 替换为条件过滤搜索
        applyFilterSearch: function (strFilters) {
            this.dataMode = 'filterSearch';

            this.setUrl(url._('route.nocard.filters.mcht'));
            this._lastStrFilters = strFilters;

            this.resetQueryParams();
            this.queryParams.filters = strFilters;

            this.getFirstPage({reset: true});
        },

        setUrl: function (str) {
            this._strUrl = str;
        },

        changeToDefaultUrl: function () {
            this.setUrl(url._('route.nocard.mcht'));
        },

        ajaxBatchOperate: function (submitURL, submitData) {
            return Opf.ajax({
                type: 'PUT',
                url: submitURL, 
                jsonData: submitData
            });

        },

        requestDefaultBatchOpenOrClose: function (options) {
            // alert('requestDefaultBatchOpenOrClose');

            var me = this, submitData = {
                operate: options.operate,
                ids: options.checked
            };

            me.ajaxBatchOperate(url._('route.nocard.open.close.default'), submitData).done(function (resp) {
                me.getFirstPage({reset: true});
                Opf.Toast.success('操作成功');
            });
        },

        requestBatchOpenOrClose: function (options) {
            var me = this,
                submitData = {
                    operate: options.operate,
                    exclude: options.exclude
                };

            if (this.batchOperateType === 'default') {
                this.requestDefaultBatchOpenOrClose(options);
                return;
            }

            if (this.dataMode === 'default') {
                submitData.filters = '';

                me.ajaxBatchOperate(url._('batch.open.close.kw'), submitData).done(function (resp) {
                    me.getFirstPage({reset: true});
                    Opf.Toast.success('操作成功');
                });
            }

            if (this.dataMode === 'kwSearch') {
                submitData.filters = this._lastKw;

                me.ajaxBatchOperate(url._('batch.open.close.kw'), submitData).done(function (resp) {
                    me.getFirstPage({reset: true});
                    Opf.Toast.success('操作成功');
                });
            }

            if (this.dataMode === 'filterSearch') {
                submitData.filters = this._lastStrFilters;

                me.ajaxBatchOperate(url._('batch.open.close.filters'), submitData).done(function (resp) {
                    me.getFirstPage({reset: true});
                    Opf.Toast.success('操作成功');
                });
            }

        },

        getStrFiltersParam: function () {
            if (this.dataMode === 'default') {
                return '';
            }

            if (this.dataMode === 'kwSearch') {
                return this._lastKw;

            }

            if (this.dataMode === 'filterSearch') {
                return this._lastStrFilters;

            }
        },

        requestDefaultBatchUpdateDayAmountLimit: function (options) {
            // alert('requestDefaultBatchUpdateDayAmountLimit');

            var me = this, submitData = {
                operate: options.amountVal,
                ids: options.checked
            };

            me.ajaxBatchOperate(url._('route.nocard.dmaxtotalamt.default'), submitData).done(function (resp) {
                me.getFirstPage({reset: true});
                Opf.Toast.success('操作成功');
            });
        },

        requestRemark: function (options) {
            var me = this, submitData = {
                operate: options.remarkValue,
                ids: options.checked
            };

            me.ajaxBatchOperate(url._('route.nocard.remark.default'), submitData).done(function (resp) {
                me.getFirstPage({reset: true});
                Opf.Toast.success('操作成功');
            });
        },

        requestBatchUpdateDayAmountLimit: function (options) {
            var me = this,
                submitData = {
                    operate: options.amountVal,
                    exclude: options.exclude
                };

            if (this.batchOperateType === 'default') {
                this.requestDefaultBatchUpdateDayAmountLimit(options);
                return;
            }

            if (this.dataMode === 'default') {
                submitData.filters = '';

                me.ajaxBatchOperate(url._('batch.upd.maxtotalamt.kw'), submitData).done(function (resp) {
                    me.getFirstPage({reset: true});
                    Opf.Toast.success('操作成功');
                });
            }

            if (this.dataMode === 'kwSearch') {
                submitData.filters = this._lastKw;

                me.ajaxBatchOperate(url._('batch.upd.maxtotalamt.kw'), submitData).done(function (resp) {
                    me.getFirstPage({reset: true});
                    Opf.Toast.success('操作成功');
                });
            }

            if (this.dataMode === 'filterSearch') {
                submitData.filters = this._lastStrFilters;

                me.ajaxBatchOperate(url._('batch.upd.maxtotalamt.filters'), submitData).done(function (resp) {
                    me.getFirstPage({reset: true});
                    Opf.Toast.success('操作成功');
                });
            }

        }
    });

    var ItemView = ModelView.extend({
        permission: {
            'edit': Ctx.avail('nocard.route.config.mcht.edit'),
            'del': Ctx.avail('nocard.route.config.mcht.del')
        },

        onRender: function () {
            if (ModelView.prototype.onRender) {
                ModelView.prototype.onRender.apply(this, arguments);
                
            }
            
            this.$el.find('.del-model').removeClass('icon-trash').addClass('icon-off');
        },

        // 编辑通道商户模型
        onEditModel: function (obj) {
            var me = this;
            require(['app/oms/route/noCard/mcht-channel/edit-mcht-channel-model-view'], function (ModelView) {
                var view = new ModelView({ model: obj.model, title: '编辑通道商户模型' });

                view.on('submit:success', function () {
                    me.trigger('edit:success');
                });
            });
        },

        // 查看通道商户模型
        onViewModel: function (obj) {
            require(['app/oms/route/noCard/mcht-channel/mcht-channel-detail'], function (ModelView) {
                new ModelView({ model: obj.model, title: '查看通道商户模型' });
            });
        },

        onDelModel: function (obj) {
            var me = this;

            Opf.confirm('确认注销？', function (result){
                if (!result) {
                    return;
                }

                Opf.ajax({
                    url: url._('route.nocard.filters.mcht', {id: obj.model.get('id')}),
                    type: 'DELETE',
                    success: function () {
                        Opf.Toast.success('删除成功');
                    },
                    complete: function () {
                        me.trigger('models:refresh');
                    }
                });

            });

        },

        modelType: 'mchtChannel'
    });


    var ListView = ModelListView.extend({
        childView: ItemView,
        template: tpl,

        triggers: $.extend(true, {
            'click .batch-checked':   'batch:checked',
            'click .batch-unchecked': 'batch:unchecked',
            'click .upload-models':   'click:upload:mchts'

        }, ModelListView.prototype.triggers),

        events: $.extend(true, {
            'click .batch-operate-open':  'onBatchOpen',
            'click .batch-operate-close': 'onBatchClose',
            'click .batch-update-day-amount-limit':  'onUpdateDayAmountLimit',
            'click .batch-update-remark': 'onUpdateRemark',
            'click .filter-pop-trigger':  'onFiltersBtnClick'

        }, ModelListView.prototype.events),

        ui: $.extend(true, {
            batchOpDDToggle: '.batch-op-dd-toggle',
            filterPopTrigger: '.filter-pop-trigger',
            totalNum: '.mcht-total-num'

        }, ModelListView.prototype.ui),

        onBatchUnchecked: function () {
            this.uncheckedChildrenView();

            this.disabledBatchOpDD(true);
            this.collection.setBatchOperateType('default');
            this.refreshTotalModels();
        },

        onBatchChecked: function () {
            this.checkedChildrenView();

            //批量操作菜单 只有全选才能用
            this.disabledBatchOpDD(false);
            this.collection.setBatchOperateType('batch');
            this.refreshTotalModels();
        },

        disabledBatchOpDD: function (disabled) {
            // disabled = disabled === void 0 ? true : disabled;
            // this.ui.batchOpDDToggle.toggleClass('disabled', disabled);
        },

        initialize: function () {
            var me = this;

            this.collection = new Collection();
            this.collection.fetch({parse: true});

            this.title = '通道商户模型';
            this._addCollectionListenner();

            this.listenTo(this.collection, 'sync', function (c) {
                if(c instanceof Backbone.Collection) {
                    //列表重置之后，禁用批量操作按钮                    
                    // me.disabledBatchOpDD(true);

                    
                    //列表重置后，刷新模型的总数
                    me.refreshTotalModels();
                }
            });

            this.permission = {
                add: Ctx.avail('nocard.route.config.mcht.add'),
                upload: Ctx.avail('nocard.route.config.mcht.upload')
            };
        },

        onChildviewChangeCheckbox: function () {
            this.refreshTotalModels();
        },

        refreshTotalModels: function () {
            var state = this.collection.state;

            this.ui.totalNum.text('共' + state.totalRecords + '条,选中' + this.getSelectedModelNum() + '条');
        },

        getSelectedModelNum: function () {
            if (this.collection.batchOperateType !== 'batch') {
                return this.getCheckedChildrenView().length;

            } else {
                return this.collection.state.totalRecords - this.getUncheckedChildrenView().length;

            }
        },

        onRender: function () {

            ModelListView.prototype.onRender.apply(this, arguments);
            
            this.filtersView = new FiltersView({
                trigger: this.ui.filterPopTrigger,
                appendTo: this.$el.find('.panel-search')
            });

            this.filtersView.on('submit', this.onFilterSubmit, this);

        },

        // @override
        getSearchInputValue: function () {
            return this.collection.getStrFiltersParam();
        },

         // 新增一个通道商户模型
        onAddModel: function () {
            var me = this;
            require(['app/oms/route/noCard/mcht-channel/add-mcht-channel-model-view'], function (ModelView) {
                var view = new ModelView();
                view.on('submit:success', function (resp) {
                    me.collection.add(resp, {at: 0});
                });
            });
        },

        onClickUploadMchts: function () {
            var me = this;

            require(['app/oms/route/noCard/mcht-channel/upload-mchts'], function (UploadView) {
                var view = new UploadView();

                view.on('submit:success', function (resp) {
                    me.refreshModels();
                });
            });
        },

        onBatchOpen: function() {
            var me = this;

            if (me.getCheckedChildrenView().length < 1) {
                Opf.alert('未选中任何模型!');
                return;
            }

            Opf.confirm('确认批量开启', function(result) {
                if (result) {
                    me.collection.requestBatchOpenOrClose({
                        operate: 'open',
                        exclude: me.getUncheckedChildrenView(),
                        checked: me.getCheckedChildrenView()
                    });
                }
            });
        },

        onBatchClose: function() {
            var me = this;

            if (me.getCheckedChildrenView().length < 1) {
                Opf.alert('未选中任何模型!');
                return;
            }

            Opf.confirm('确认批量关闭', function(result) {
                if (result) {
                    me.collection.requestBatchOpenOrClose({
                        operate: 'close',
                        exclude: me.getUncheckedChildrenView(),
                        checked: me.getCheckedChildrenView()
                    });
                }
            });
        },

        onUpdateDayAmountLimit: function() {
            var me = this;
            if (this.getCheckedChildrenView().length < 1) {
                Opf.alert('未选中任何模型!');
                return;
            }

            var amountVal = window.prompt("输入单日额度");
            if(amountVal != null) {
                this.collection.requestBatchUpdateDayAmountLimit({
                    amountVal: amountVal,
                    exclude: this.getUncheckedChildrenView(),
                    checked: me.getCheckedChildrenView()
                });
            }
        },


        // 批量修改备注
        onUpdateRemark: function () {
            var me = this;
            if (this.getCheckedChildrenView().length < 1) {
                Opf.alert('未选中任何模型!');
                return;
            }

            var remarkValue = window.prompt("输入备注信息");
            if (remarkValue != null) {
                this.collection.requestRemark({
                    remarkValue: remarkValue,
                    exclude: this.getUncheckedChildrenView(),
                    checked: me.getCheckedChildrenView()
                });
            }

        },

        //关键字搜索
        onSearch: function (e) {
           if (e) e.preventDefault();

            var data = {};
            var kw = $.trim(this.ui.searchInput.val());

            if (kw) {
                this.collection.applyKwSearch(kw);
            }else {
                this.collection.changeToDefaultUrl();
                this.collection.resetDefault();
                // this.collection.getFirstPage({reset: true});
            }

            // this.collection.getFirstPage({data: data, reset: true});
        },

        clear: function (e) {
            if (e) e.preventDefault();
            
            this.collection.changeToDefaultUrl();
            this.ui.searchInput.val(null);
            this.checkRestSeachBtnVisible();
            this.collection.resetDefault();
        },

        // 条件过滤搜索
        onFilterSubmit: function () {
            this.collection.applyFilterSearch(this.filtersView.getStrFilters());
            this.filtersView.$el.toggle(false);
        },

        // 通过通道模型ID来赛选通道商户模型
        filterByChannelId: function (channelId) {
            this.collection.queryParams['channelModelId'] = channelId;
            this.collection.getFirstPage({reset: true});

        },

        // 清除赛选
        cleanFilterByChannelId: function () {
            this.collection.queryParams['channelModelId'] = void 0;
            this.collection.getFirstPage({reset: true});
        },

        // 编辑绑定关系
        setFiltersByIds: function (channelIds) {
            this.operateObj = {
                operate: 'editingRelevance',
                channelIds: channelIds
            };
            this._initEditingRelevanceOperate();

            // this.$el.find('.batch-edit-bind').removeClass('hide');
        },

        // 编辑绑定关系完成
        clearFiltersByIds: function () {
            this.operateObj = null;
            this.uncheckedChildrenView();

            // this.$el.find('.batch-edit-bind').addClass('hide');
        },

        // 添加对collection的监听事件，如果正在编辑 通道模型 和 通道商户模型 之间的绑定关系的时候
        // 每当有刷新或者请求下一页的情况下，需要根据请求回来的数据，对请求回来的数据进行处理，
        // 如果和 通道模型 有绑定关系的需要高亮显示，没有绑定关系的暗色显示
        _addCollectionListenner: function () {
            var me = this;
            me.listenTo(this.collection, 'sync', function (collection) {
                if (me.operateObj && (me.operateObj.operate === 'editingRelevance')) {
                    me._initEditingRelevanceOperate();
                }
            });
        },

        // 在编辑通道模型和通道商户模型之间的绑定关系的时候，更新高亮显示，和通道模型有绑定关系的需要高亮，没有绑定关系的需要暗色显示
        _initEditingRelevanceOperate: function () {
            var me = this;
            this.children.each(function (childView) {
                _.contains(me.operateObj.channelIds, childView.model.get('id') + '') ? childView.checkedView() : childView.uncheckedView();
            });
        }


    });

    
    return ListView;
    
});