/**
 * 所有机构费率模型 编辑计费方案 设定统一分润
 */

define([
    'tpl!app/oms/disc/brh-disc/common/edit/templates/set-unite-ratio.tpl',
    'tpl!app/oms/disc/brh-disc/common/edit/templates/unite-ratio-item.tpl',
    'jquery.validate',
    'jquery.inputmask'
    ], function(Tpl,itemTpl){

        var DEFAULT_MAX_TRADE = Ctx.get('STR_DEFAULT_MAX_TRADE');
        var ChildView = Marionette.ItemView.extend({

            template: itemTpl,
            className: 'list',
            ui: {
                form: 'form',
                minTrade : '.min-trade',
                maxTrade : '.max-trade',
                profitRatio : '.profit-ratio'
            },
            events: {

            },
            triggers: {
                'click .btn-delete' : 'item:delete',
                'keyup .max-trade': 'keyup:maxtrade',
                'keyup .min-trade': 'keyup:mintrade'
            },
            getMinTrade: function () {
                return this.ui.minTrade.val();
            },
            setMinTrade: function (v) {
                this.ui.minTrade.val(v);
            },
            getMaxTrade: function () {
                return this.ui.maxTrade.val();
            },
            setMaxTrade: function (v) {
                this.ui.maxTrade.val(v);
            },
            templateHelpers: function(){
                var me = this;
                return {
                    id : me.model.cid,
                    order: _.indexOf(me.model.collection.models,me.model) + 1
                };
            },
            serializeData: function() {
                return {
                    data: this.model.toJSON()
                }
            },
            onRender: function(){
                this.setDefaultValue();
                this.setupValidation();
                console.log('<<<childview onRender');
            },

            //@deprecated
            setupRangeValidWithFrontView: function (frontItemView) {
                this.ui.minTrade.rules('add', {
                    le: {
                        param: frontItemView.ui.maxTrade
                    },
                    messages: {
                        le: '不能大于上一档最大值'
                    }
                });
            },

            setupValidation: function () {
                var ui = this.ui;
                
                ui.form.validate();

                //只允许键盘敲入数字
                $().add(ui.minTrade)//
                .add(ui.maxTrade)//
                .add(ui.profitRatio)//
                .inputmask('numeric', {
                    allowMinus: false,
                    allowPlus: false
                });

                ui.minTrade.rules('add', {
                    required: true,
                    messages: {required:"此处不能为空"}
                });

                ui.maxTrade.rules('add', {
                    required: true,
                    ge: {
                        param: ui.minTrade
                    },
                    messages: {
                        required: "此处不能为空",
                        ge: '不能小于区间最小值'
                    }
                });

                ui.profitRatio.rules('add', {
                    required: true,
                    messages: {required:"此处不能为空"}
                });

            },

            validate: function () {
                return this.ui.form.valid();
            },


            setDefaultValue: function(){
                var me = this;
                if (me.parentView.canSetTrade()) {
                    me.ui.minTrade.val(me.model.get('minTrade'));
                    me.ui.maxTrade.val(me.model.get('maxTrade'));
                } else {
                    me.ui.minTrade.val('0').prop('disabled', true);
                    me.ui.maxTrade.val('0').prop('disabled', true);
                }
                me.ui.profitRatio.val(me.model.get('profitRatio'));
            },

            //@deprecated
            syncModelDataFromUI: function(){
                this.model.set('minTrade', this.ui.minTrade.val());//交易额下界
                this.model.set('maxTrade', this.ui.maxTrade.val());//交易额上界
                this.model.set('profitRatio', this.ui.profitRatio.val());//分润比例
            },


            getPostValues: function(){
                return {
                    minTrade : this.ui.minTrade.val(),
                    maxTrade : this.ui.maxTrade.val(),
                    profitRatio : this.ui.profitRatio.val()
                }
            },

            updateOrder: function() {
                var me = this,
                    model = me.model;
                this.$('.order').text(_.indexOf(model.collection.models,model) + 1);
            }
        });

        var ComView = Marionette.CompositeView.extend({

            // @config
            // discModel 对应以个费率模型的backbone Model

            template: Tpl,

            childViewContainer: '.unite-ratio-container',

            getChildView: function () {
                return ChildView.extend({
                    parentView: this
                });
            },

            ui: {
                form : 'form'
            },

            events: {
                'click .btn-add' : 'addItem'
            },

            initialize: function(){
                var me = this;
                if(!me.collection) {
                    me.collection = new Backbone.Collection();
                }

                me.discModel = me.getOption('discModel');

                //只有在编辑的时候才会传入discModel
                //对于编辑时的分润设置，如果分润设置不为空，要套上默认模板
                if(me.discModel && me.discModel.get('profitSetting')) {
                    var profitSetting = $.extend(true, [], me.discModel.get('profitSetting'));
                    profitSetting = me._preHanderProfitSettingDataWhenEdit(profitSetting);
                    me.collection.reset(profitSetting);
                }
                //如果分润设置为空，则自动新增一条 由 0 到 DEFAULT_MAX_TRADE 的分润档
                else if(me.discModel && me.discModel.get('profitSetting') == null){
                    me.addDefaultItem();
                }
            },

            _preHanderProfitSettingDataWhenEdit: function (profitSetting) {
                if(!_.isEmpty(profitSetting)) {
                    profitSetting[0].canDelete = true;
                    profitSetting[0].minTradeDisable = true;

                    profitSetting[profitSetting.length-1].canDelete = true;
                    profitSetting[profitSetting.length-1].maxTradeDisable = true;
                }
                return profitSetting;
            },

            canSetTrade: function(){
                var ret;
                if (this.discModel) {
                    ret = 'PBPA'.indexOf(this.discModel.get('modelId')) == -1;
                    return ret;
                } else {
                    return true;
                }
            },

            onChildviewRender: function () {
                console.log('<<<parentview onRender');

                this.updateOrder();
            },

            onChildviewItemDelete: function(childView){
                var me =  this;
                var curIndex = me.collection.indexOf(childView.model);
                var preChildView = me.findByModelIndex(curIndex - 1);
                var nextChildView = me.findByModelIndex(curIndex + 1);
                //如果只剩一条分档，不能被删除
                if(me.children.length <= 1) {
                    return false;
                }

                //如果只剩两条分档，则把这两条分档都删除，用默认分档代替
                else if(me.children.length === 2){
                    me.collection.reset([]);
                    me.addDefaultItem();
                }
                //否则如果是删除第一条，先增加 默认第一条分档，然后删除第一、第二条分档
                else if(curIndex === 0){
                    me.addDefaultFirstItem(nextChildView.model.toJSON());
                    me.collection.remove(childView.model);
                    me.collection.remove(nextChildView.model);
                }
                //否则如果是删除最后一条，先增加 默认最后一条分档，然后删除最后一条、倒数第二条分档
                else if(curIndex === me.collection.length - 1){
                    me.addDefaultLastItem(preChildView.model.toJSON());
                    me.collection.remove(preChildView.model);
                    me.collection.remove(childView.model);
                }

                //否则如果 删除行有前有后的话，把 前 的上界设置到 后 的下界
                else if(preChildView && nextChildView) {
                    nextChildView.setMinTrade(preChildView.getMaxTrade());
                    me.collection.remove(childView.model);
                }
                me.children.each(function(child){
                    child.updateOrder();
                });
            },

            findByModelIndex: function (modelIndex) {
                //作 index 超出范围保护处理
                if(modelIndex !== -1 && modelIndex !== this.collection.length){
                    return this.children.findByModel(this.collection.at(modelIndex));
                }
            },

            onChildviewKeyupMaxtrade: function(childView){
                console.log('>>> childView maxtrade change');
                var curIndex = this.collection.indexOf(childView.model);

                var nextChildView = this.children.findByModel(this.collection.at(curIndex + 1));
                if(nextChildView){
                    nextChildView.setMinTrade(childView.getMaxTrade());
                }
            },

            onChildviewKeyupMintrade: function(childView){
                console.log('>>> childView mintrade change');
                var curIndex = this.collection.indexOf(childView.model);
                var previousChildView = this.children.findByModel(this.collection.at(curIndex - 1));
                if(previousChildView){
                    previousChildView.setMaxTrade(childView.getMinTrade());
                }
            },


            updateOrder: function () {
                this.children.invoke('updateOrder');
            },

            addItem: function(){
                //如果当前值 验证不通过，不能添加一条
                if(!this.validate()) {
                    return;
                }

                if (this.collection.length === 1) { //如果当前只有一条分档，则认为这条分档是合法的，上下限是 0 - DEFAULT_MAX_TRADE

                    this.collection.reset([]);
                    this.addDefaultFirstItem();
                    this.addDefaultLastItem();

                    return ;
                }

                var me = this;
                var defaultObject = {
                    minTrade : "",
                    maxTrade : "",
                    profitRatio : ""
                };
                me.collection.add(defaultObject,{
                    at: me.collection.length - 1
                });
            },

            //新增时 默认插入一条 上下限是 0 - DEFAULT_MAX_TRADE 的条目
            addDefaultItem: function(data){
                data = data || {};
                var defaultObject = {
                    minTrade : "0",
                    maxTrade : DEFAULT_MAX_TRADE,
                    profitRatio : (data.profitRatio === 0 || data.profitRatio) ? data.profitRatio : "",
                    minTradeDisable: true,
                    maxTradeDisable: true,
                    canDelete: false
                };
                this.collection.add(defaultObject,{
                    at: 0
                });
            },


            //编辑时 点新增如果当前只有一条条目
            //会插入一条分档下限为0且不可编辑分档下限，不能被删除的条目
            addDefaultFirstItem: function(data){
                data = data || {};
                var defaultObject = {
                    minTrade : "0",
                    maxTrade : (data.maxTrade === 0 || data.maxTrade) ? data.maxTrade : "",
                    profitRatio : (data.profitRatio === 0 || data.profitRatio) ? data.profitRatio : "",
                    minTradeDisable: true,
                    canDelete: true
                };
                this.collection.add(defaultObject,{
                    at: 0
                });
            },

            //编辑时 点新增如果当前只有一条条目
            //会插入一条分档上限为最大值且不可编辑分档上限，不能被删除的条目
            addDefaultLastItem: function(data){
                data = data || {};
                var defaultObject = {
                    minTrade : (data.minTrade === 0 || data.minTrade) ? data.minTrade : "",
                    maxTrade : DEFAULT_MAX_TRADE,
                    profitRatio : (data.profitRatio === 0 || data.profitRatio) ? data.profitRatio : "",
                    maxTradeDisable: true,
                    canDelete: true
                };
                this.collection.add(defaultObject,{});
            },

            onRender: function(){
                var me = this;
                if(me.getOption('renderTo')) {
                    me.$el.appendTo(me.getOption('renderTo'));
                }
            },

            validate: function () {
                var valid = true;
                this.children.each(function (childView) {
                    if(childView.validate() === false) {
                        valid = false;
                    }
                });
                return valid;
            },
            //@deprecated
            syncModelsDataFromUI: function(){
                this.children.each(function(childView){
                    childView.syncModelDataFromUI();
                });
            },

            getPostValues: function () {
                var arr = [];

                //TODO 以下方法不保证顺序，看看有没有别的方法一步到位，不用再用 sortBy
                this.children.each(function(childView){
                    arr.push(childView.getPostValues());
                });

                return _.sortBy(arr,function(item){
                    return item.minTrade;
                });
            }
        });



        return ComView;
});