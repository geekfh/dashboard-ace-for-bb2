/**
 * 间联月交易额结算扣率变动
 *
 * 编辑计费方案时的 结算扣率/封顶设置
 */

//TODO 至少留一条

define([
    'tpl!app/oms/disc/brh-disc/common/edit/templates/set-base-ratio.tpl',
    'tpl!app/oms/disc/brh-disc/common/edit/templates/base-ratio-item.tpl',
    'jquery.validate',
    'jquery.inputmask'
    ], function(Tpl,itemTpl){

        var MAX_RETURN_PROFIT = -2;
        var DEFAULT_MAX_TRADE = Ctx.get('STR_DEFAULT_MAX_TRADE');
        var FIXED_MAX_TRADE = 999999999999;

        var CAN_SET_MAXFEE = {
            '00': true,
            '01': false,
            '02': true,
            '03': false,
            '05': false,
            '06': true,
            '10': false,
            '11': true
        };

        var ChildView = Marionette.ItemView.extend({
            template: itemTpl,
            className: 'list',
            ui: {
                form: 'form',
                minTrade : '.min-trade',
                maxTrade : '.max-trade',
                baseRatio : '.base-ratio',
                maxFee : '.max-fee'
            },
            events: {
                'keyup .min-trade' : 'syncModelMinTradewithUI',
                'keyup .max-trade' : 'syncMaxTradeValWithUI',
                'keyup .base-ratio' : 'syncModelBaseRatioWithUI',
                'keyup .max-fee' : 'syncModelMaxFeeWithUI'
            },
            triggers: {
                'click .btn-delete': 'delete',
                'keyup .min-trade' : 'keyup:mintrade',
                'keyup .max-trade' : 'keyup:maxtrade'
            },
            templateHelpers: function(){
                var me = this;
                return {
                    id : me.model.cid,
                    order: _.indexOf(me.model.collection.models,me.model) + 1
                };
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
            //@deprecated
            syncModelDataFromUI: function () {
                this.syncModelMinTradewithUI();
                this.syncMaxTradeValWithUI();
                this.syncModelBaseRatioWithUI();
                this.syncModelMaxFeeWithUI();
            },

            onRender: function(){
                this.setDefaultValue();
                this.setupValidation();
            },

            serializeData: function() {
                return {
                    data: this.model.toJSON()
                }
            },

            //@deprecated
            setupRangeValidWithFrontView: function (frontItemView) {
                this.ui.minTrade.rules('add', {
                    le: {
                        param: frontItemView.ui.maxTrade
                    },
                    messages: {
                        le: '不大于上一档最大值'
                    }
                });
            },

            setupValidation: function () {

                var me = this,
                    ui = me.ui,
                    $form = ui.form;
                $form.validate();

                var upperBrhDisc = this.parentView.getOption('upperBrhDisc');
                console.log('>>>setupValidation upperBrhDisc', upperBrhDisc);

                function inReturnProfitRange(val){
                    return val <= 0 && val >= MAX_RETURN_PROFIT;
                }

                function floatScopeDependsForRatio(element){

                    return inReturnProfitRange($(element).val()) ? false : upperBrhDisc.minBorm != undefined;
                }

                function floatScopeDependsForFee(){
                    return upperBrhDisc.minBorm != undefined;
                }

                $form.find('[name="min-trade"]').rules('add',{
                    required: true,
                    messages: {
                        required: "此处不能为空"
                    }
                });

                $form.find('[name="max-trade"]').rules('add',{
                    required: true,
                    ge: {
                        param: $form.find('[name="min-trade"]')
                    },
                    messages: {
                        required: "此处不能为空",
                        ge: "不能低于区间最小值"
                    }
                });

                $form.find('[name="base-ratio"]').rules('add',{
                    required: true,
                    messages: {
                        required: "此处不能为空",
                        floatScope: "超出范围",
                        min: "不能小于 " + MAX_RETURN_PROFIT
                    },
                    //floatScope: {
                    //        depends: function(element){
                    //            return floatScopeDependsForRatio(element);
                    //        },
                    //        param: [upperBrhDisc.minBorm, upperBrhDisc.maxBorm]
                    //},
                    min: MAX_RETURN_PROFIT
                });


                $form.find('[name="max-fee"]').rules('add',{
                    required: true,
                    messages: {
                        required: "此处不能为空",
                        floatScope: "超出范围"
                    }/*,
                    floatScope: {
                        depends: floatScopeDependsForFee,
                        param: [upperBrhDisc.minTop, upperBrhDisc.maxTop]
                    }*/
                });


                $().add(ui.minTrade)
                    .add(ui.maxTrade)
                    .add(ui.maxFee).inputmask('numeric', {
                    autoUnmask: true,
                    allowMinus: false,
                    allowPlus: false
                });

                $(ui.baseRatio).inputmask('numeric', {
                    autoUnmask: true,
                    allowMinus: true,
                    allowPlus: false
                });

            },

            setDefaultValue: function(){
                var me = this;
                me.ui.minTrade.val(me.model.get('minTrade'));
                me.ui.maxTrade.val(me.model.get('maxTrade'));
                me.ui.baseRatio.val(me.model.get('baseRatio'));
                console.log('>>>>maxFee:  ',me.model.get('maxFee'));
                me.ui.maxFee.val(me.model.get('maxFee'));
            },

            syncModelMinTradewithUI: function(){
                this.model.set('minTrade', this.ui.minTrade.val());
            },

            syncMaxTradeValWithUI: function(){
                this.model.set('maxTrade', this.ui.maxTrade.val());
            },

            syncModelBaseRatioWithUI: function(){
                this.model.set('baseRatio', this.ui.baseRatio.val());
            },

            syncModelMaxFeeWithUI: function(){
                this.model.set('maxFee', this.ui.maxFee.val());
            },

            updateOrder: function() {
                var me = this,
                    model = me.model;
                this.$('.order').text(_.indexOf(model.collection.models,model) + 1);
            },

            getBaseRatio: function(){
                return this.ui.baseRatio.val();
            },

            getMaxFee: function(){
                return this.ui.maxFee.val();
            },

            setMaxFee: function(mchtGrp, ratioType){
                var $maxFee = this.$el.find('.max-fee');
                if(ratioType == '2'){
                    $maxFee.val('0').prop('disabled', true);
                }else{
                    // 否则就是 按笔比例
                    // 如果是 线上支付类，那么封顶费全部放开
                    if(this.parentView.isPayOnline()){
                        $maxFee.prop('disabled', false);
                    }else{
                        // 如果是 消费类，那么封顶费要根据 商户类型 来判断
                        if(CAN_SET_MAXFEE[mchtGrp]){ //封顶费
                            $maxFee.prop('disabled', false);
                        } else {
                            $maxFee.val('0').prop('disabled', true);
                        }
                    }
                }
            },

            getPostValues: function(){
                return {
                    minTrade: this.ui.minTrade.val(),
                    maxTrade: this.ui.maxTrade.val(),
                    baseRatio: this.ui.baseRatio.val(),
                    maxFee: this.ui.maxFee.val()
                };
            },

            validate: function(){
                var me = this;
                return me.ui.form.valid();
            }

        });

        var ComView = Marionette.CompositeView.extend({
            template: Tpl,
            childViewContainer: '.base-ratio-container',
            getChildView: function () {
                return ChildView.extend({
                    parentView: this
                });
            },
            ui: {
                form : 'form',
                title: '.title',
                baseRatioTitleHundred: '.base-ratio-title-hundred',
                baseFixedTitle: '.base-fixed-title',
                baseRatioTitleMillion: '.base-ratio-title-million'
            },
            triggers: {
                'click .btn-add' : 'item:add'
            },
            initialize: function(options){
                this.mchtGrp = options.mchtGrp;
                this.ratioType = options.ratioType;
                this.transType = options.transType;

                //this.initialCollection = $.extend(true, [],this.collection);

                //给原始数据套上模板
                //第一条数据的 上限 0 不可编辑，第一条数据不能被删除
                //最后一条数据的 下限 DEFAULT_MAX_TRADE 不可编辑，最后一条数据不能被删除
                this.collection = this.exendCollection(this.collection);
            },
            //@deprecated
            syncModelsDataFromUI: function(){
                this.children.each(function(childView){
                    childView.syncModelDataFromUI();
                });
            },

            getPostValues: function () {
                var arr = [];
                this.children.each(function(childView){
                    arr.push(childView.getPostValues());
                });
                return _.sortBy(arr,function(item){
                    return item.minTrade;
                });
            },

            exendCollection: function(collection){
                //填充数据
                collection.each(function(model){
                    model.set('minTradeDisable', false);
                    model.set('maxTradeDisable', false);
                    model.set('canDelete', true);
                });

                //设置第一条的模板
                collection.at(0).set('minTradeDisable', true);
                collection.at(0).set('canDelete', true);

                //设置最后一条的模板
                collection.at(collection.length-1).set('maxTradeDisable', true);
                collection.at(collection.length-1).set('canDelete', true);
                return collection;
            },

            templateHelpers: function(){
                var upperBrhDisc = this.getOption('upperBrhDisc');
                return {
                    bormRange: upperBrhDisc.minBorm ? (upperBrhDisc.minBorm +'-'+ upperBrhDisc.maxBorm) : '不限',
                    topRange: upperBrhDisc.minTop ? (upperBrhDisc.minTop +'-'+ upperBrhDisc.maxTop) : '不限'
                };
            },

            onChildviewRender: function (childView) {
                console.log('<<<parentview onRender');
                childView.setMaxFee(this.mchtGrp, this.ratioType);

                this.children.each(function(child){
                    child.updateOrder();
                });
            },

            onChildviewDelete: function(childView){
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
                    var data = childView.model.toJSON();
                    me.collection.reset([]);
                    me.addDefaultItem(data);
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

            onItemAdd: function(){
                var me = this;
                //如果当前值 验证不通过，不能添加一条
                if(!this.validate()) {
                    return;
                }


                //如果只有一条分档时，则认为这条分档是合法的，上下限是 0 - DEFAULT_MAX_TRADE
                if (this.collection.length === 1) {
                    var data = {
                        minTrade : "",
                        maxTrade : "",
                        baseRatio : this.collection.at(0).toJSON().baseRatio,
                        maxFee : this.collection.at(0).toJSON().maxFee
                    };
                    this.collection.reset([]);
                    this.addDefaultFirstItem(data);
                    this.addDefaultLastItem(data);

                    return ;
                }
                var defaultObject = {
                    minTrade : "",
                    maxTrade : "",
                    baseRatio : "",
                    maxFee : ""
                };
                me.collection.add(defaultObject,{
                    at: me.collection.length - 1
                });
            },

            //只有两条分档时，再删除任何一条分档，都会插入 上下限是 0 - DEFAULT_MAX_TRADE 的分档
            addDefaultItem: function(data){
                data = data || {};
                var defaultObject = {
                    minTrade : "0",
                    maxTrade : this.ratioType == '1' ? DEFAULT_MAX_TRADE : FIXED_MAX_TRADE,
                    baseRatio : (data.baseRatio === 0 || data.baseRatio) ? data.baseRatio : "",
                    maxFee: (data.maxFee === 0 || data.maxFee) ? data.maxFee : "",
                    minTradeDisable: true,
                    maxTradeDisable: true,
                    canDelete: false
                };
                this.collection.add(defaultObject,{
                    at: 0
                });
            },


            //编辑时 点新增如果当前只有一条条目
            //会插入一条分档下限为0且不可编辑分档下限的条目
            addDefaultFirstItem: function(data){
                data = data || {};
                var defaultObject = {
                    minTrade : "0",
                    maxTrade : (data.maxTrade === 0 || data.maxTrade) ? data.maxTrade : "",
                    baseRatio : (data.baseRatio === 0 || data.baseRatio) ? data.baseRatio : "",
                    maxFee : (data.maxFee === 0 || data.maxFee) ? data.maxFee : "",
                    minTradeDisable: true,
                    canDelete: true
                };
                this.collection.add(defaultObject,{
                    at: 0
                });
            },

            //编辑时 点新增如果当前只有一条条目
            //会插入一条分档上限为最大值且不可编辑分档上限的条目
            addDefaultLastItem: function(data){
                data = data || {};
                var defaultObject = {
                    minTrade : (data.minTrade === 0 || data.inTradee) ? data.minTrade : "",
                    maxTrade : this.ratioType == '1' ? DEFAULT_MAX_TRADE : FIXED_MAX_TRADE,
                    baseRatio : (data.baseRatio === 0 || data.baseRatio) ? data.baseRatio : "",
                    maxFee : (data.maxFee === 0 || data.maxFee) ? data.maxFee : "",
                    maxTradeDisable: true,
                    canDelete: true
                };
                this.collection.add(defaultObject,{});
            },
            onRender: function(){
                var me = this;
                this.setTitleByRatioType();
            },

            setTitleByRatioType: function () {
                var isBaseRatioTitleHundred = this.ratioType == '1';
                var isFixedRatio = this.ratioType == '2';
                var isBaseRatioTitleMillion = this.ratioType == '3';

                // 根据 ratioType 来显示表头 1-按比比例(百分之) 2-按笔固定 3-按笔比例(万分之)
                this.ui.baseRatioTitleHundred.toggle(isBaseRatioTitleHundred);
                this.ui.baseFixedTitle.toggle(isFixedRatio);
                this.ui.baseRatioTitleMillion.toggle(isBaseRatioTitleMillion);
                if(isBaseRatioTitleMillion){
                    this.ui.title.find('span').text('分润标准/封顶设置');
                }
                this.setMaxFee(this.mchtGrp, this.ratioType);
            },

            isPayOnline: function () {
                return this.transType == '2';
            },

            setMaxFee: function(mchtGrp, ratioType){
                var me = this, ui = me.ui;
                // 如果是 按笔固定，封顶费全为0并且不可以编辑
                var $maxFee = ui.form.find('.max-fee');
                if(ratioType == '2'){
                    $maxFee.val('0').prop('disabled', true);
                }else{
                    // 否则就是 按笔比例
                    // 如果是 线上支付类，那么封顶费全部放开
                    if(me.isPayOnline()){
                        $maxFee.prop('disabled', false);
                    }else{
                        // 如果是 消费类，那么封顶费要根据 商户类型 来判断
                        if(CAN_SET_MAXFEE[mchtGrp]){ //封顶费f
                            $maxFee.prop('disabled', false);
                        } else {
                            $maxFee.val('0').prop('disabled', true);
                            me.children.each(function (childView) {
                                childView.syncModelMaxFeeWithUI();
                            });
                        }
                    }
                }

            },

            getBiggestMaxFeeEl: function(){
                var list = this.children.map(function(childView) {
                    return {
                        val: childView.getMaxFee(),
                        childView: childView
                    };
                });
                var maxItem = _.max(list, function (item) {
                    return parseFloat(item.val);
                });
                return maxItem.childView.ui.maxFee;
            },

            //获取所有基础扣率里面最大的一个值
            getBiggestBaseRatioEl: function(){
                var list = this.children.map(function(childView) {
                    return {
                        val: childView.getBaseRatio(),
                        childView: childView
                    };
                });
                var maxItem = _.max(list, function (item) {
                    return parseFloat(item.val);
                });
                return maxItem.childView.ui.baseRatio;
            },

            validate: function () {
                var valid = true;
                this.children.each(function (childView) {
                    if(childView.validate() === false) {
                        valid = false;
                    }
                });
                return valid;
            }

        });



        return ComView;
});