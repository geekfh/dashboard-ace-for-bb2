/**
 * 商户费率模型 新增或者编辑计费方案
 */

define([
    'tpl!app/oms/disc/mcht-disc/templates/add-scheme-lsit.tpl',
    'tpl!app/oms/disc/mcht-disc/templates/add-scheme-item.tpl',
    'select2',
    'jquery.validate',
    'jquery.inputmask'
    ], function(Tpl,itemTpl){

        var MAX_RETURN_PROFIT = -2;

        var ALL_CARD_TYPE = 15;
        var CARDTYPE_MAP = {
            "1": "借记卡",
            "2": "贷记卡",
            "4": "准贷记卡",
            "8": "预付卡",
            "15": "全部卡种类"
        };
        var ChildView = Marionette.ItemView.extend({
            template: itemTpl,
            className: 'list clearfix',

            ui: {
                form: 'form',
                floorAmount : '.floor-amount',//交易分段
                upperAmount : '.upper-amount',
                cardType: '.card-type',
                flag: '.flag',
                feeValueTip: '.fee-value-tip',
                maxFeeTip: '.max-fee-tip',
                feeValue: '.fee-value',//扣率
                minFee: '.min-fee',//收费设置保底
                maxFee: '.max-fee'//收费封顶

            },
            events: {
                'change .card-type' : 'onCardTypeChange'
            },
            triggers: {
                'click .btn-delete' : 'item:delete'
            },

            initialize: function () {
                // this.backendRange
            },

            templateHelpers: function(){
                var me = this;
                var data = {
                    id : me.model.cid,
                    order: _.indexOf(me.model.collection.models,me.model) + 1
                };
                return data;
            },

            onRender: function(){
                var me = this,
                    ui = me.ui;

                var initCardTypeSelectData = me.generateCardType();
                var selec2Data = me.generateCardType();
                me.ui.cardType.select2({
                    multiple: true,
                    data: function () {
                        return {
                            results: selec2Data
                        };
                    }
                    
                });

                me.ui.cardType.on('select2-opening', function () {
                    var usededCardType = me.parentView.getSelectedCardType();

                    selec2Data = _.filter(initCardTypeSelectData, function (item) {
                        var isUsed = parseInt(item.id, 10) & usededCardType;
                        return !isUsed;
                    });
                });

                this.setDefaultValue();

                this.setupValidation();

            },

            setupAjaxValidation: function () {
                var me = this, 
                    ui = this.ui;

                console.log('>>>setupAjaxValidation');

                var modelSetting = this.model.collection.modelSetting;

                if (modelSetting.brhLevel < 2) { // 0 级 和 1 级不访问后台
                    return ;
                }

                Opf.ajax({
                    url: url._('disc.mcht.setting'),
                    data: {
                        brhCode: modelSetting.modelBrh,
                        transType: modelSetting.transType,
                        mchtGrp: modelSetting.mchtGrp,
                        type: modelSetting.type,
                        cardType: this.getCardTypeFromUI()
                    },
                    async: false,
                    success: function (resp) {
                        addRules(resp);
                        if (modelSetting.brhLevel > 1) {
                            ui.feeValueTip.text('在' + resp.minBorm + '-' + resp.maxBorm + '之间');
                            ui.maxFeeTip.text('在' + resp.minTop + '-' + resp.maxTop + '之间');
                        }
                        console.log(resp);
                        ui.feeValue.prop('disabled',false);
                        ui.minFee.prop('disabled',false);
                        ui.maxFee.prop('disabled',false);
                        me.$el.closest('.ui-dialog').find('button[type="submit"]').prop('true',false);
                        me.model.collection.settingForModelId = resp.modelId;
                        // minBorm: //下级或商户签约扣率
                        // maxBorm: //下级或商户签约扣率
                        // minTop: //下级或商户最低封顶值
                        // maxTop: 
                    },
                    error: function(){
                        me.$el.closest('.ui-dialog').find('button[type="submit"]').prop('disabled',true);
                        ui.feeValue.prop('disabled',true);
                        ui.minFee.prop('disabled',true);
                        ui.maxFee.prop('disabled',true);
                    }
                });

                function inReturnProfitRange(val){
                    return val <= 0 && val >= MAX_RETURN_PROFIT;
                }

                function feeValueFloatScopeDepends(element){
                    //0 级 和 1 级机构 不加限制
                    //在返利范围内：0 ~ -2 也不加限制
                    return inReturnProfitRange($(element).val()) ? false : modelSetting.brhLevel > 1;
                }

                function addRules (resp) {
                    ui.feeValue.rules('add', {
                        floatScope: {
                            depends: function(element){
                                return feeValueFloatScopeDepends(element);
                            },
                            param: [resp.minBorm, resp.maxBorm]
                        },
                        min: MAX_RETURN_PROFIT,
                        messages: {
                            floatScope: "超出范围",
                            min: "不能小于" + MAX_RETURN_PROFIT
                        }
                    });
                    ui.minFee.rules('add', {
                        le: {
                            depends: function(){
                                return ui.maxFee.val() != "";
                            },
                            param: ui.maxFee
                        },
                        messages: {
                            le: '不大于封顶'
                        }
                    });
                    ui.maxFee.rules('add', {
                        floatScope: {
                            depends: function(){
                                //0 级 和 1 级机构 不加限制
                                return modelSetting.brhLevel > 1;
                            },
                            param: [resp.minTop, resp.maxTop]
                        },
                        messages: {
                            floatScope: "超出范围"
                        }
                    });
                }
            },

            setupValidation: function () {
                var me = this, 
                    ui = this.ui;

                this.ui.form.validate();

                $().add(ui.floorAmount)
                .add(ui.upperAmount)
                .add(ui.cardType)
                .add(ui.feeValue)
                .add(ui.minFee)
                .add(ui.maxFee).each(function () {
                    $(this).rules('add', {
                        required: true,
                        messages: {
                            required: '必填'
                        }
                    });
                });

                ui.minFee.rules('add', {
                    le: {
                        depends: function() {
                            return ui.maxFee.val() != "";
                        },
                        param: ui.maxFee
                    },
                    messages: {
                        le: '不大于封顶'
                    }
                });

                ui.feeValue.rules('add', {
                    min: MAX_RETURN_PROFIT,
                    messages: {
                        min: "不能小于" + MAX_RETURN_PROFIT
                    }
                });


                $().add(ui.floorAmount)
                    .add(ui.upperAmount)
                    .add(ui.minFee)
                    .add(ui.maxFee)
                    .inputmask('numeric', {
                        autoUnmask: true,
                        allowMinus: false,
                        allowPlus: false
                    });

                $().add(ui.feeValue)
                    .inputmask('numeric', {
                        autoUnmask: true,
                        allowMinus: true,
                        allowPlus: false
                    });

            },


            setupRangeValidWithFrontView: function (frontItemView) {
                this.ui.floorAmount.rules('add', {
                    le: {
                        param: frontItemView.ui.upperAmount
                    },
                    messages: {
                        le: '不能大于上一档最大值'
                    }
                });
            },

            validate: function () {
                return this.ui.form.valid();
            },

            setDefaultValue: function(){
                var me = this,
                    ui = me.ui;
                me.model.get('cardType') && ui.cardType.select2('val',me.userCardTypeArray(me.model.get('cardType')));
                ui.floorAmount.val(me.model.get('floorAmount'));
                ui.upperAmount.val(me.model.get('upperAmount'));
                ui.minFee.val(me.model.get('minFee'));
                ui.maxFee.val(me.model.get('maxFee'));
                ui.feeValue.val(me.model.get('feeValue'));

            },

            setModelValue: function(){
                var me = this;
                me.setFloorAmountVal(); //交易分段上限
                me.setUpperAmountVal(); //交易分段下限
                me.setMaxFeeVal(); //封顶
                me.setMinFeeVal(); //保底
                me.setFeeValue(); //扣率
                me.setCardType(); //卡类型
                me.setFlag(); //收费模型
            },

            userCardTypeArray: function(value){ // 用户设置的 cardType id 数组
                var arr = [];
                
                if(value == ALL_CARD_TYPE){ //如果设置了 全部卡种类
                    arr.push(value);
                    return arr;
                }
                return this.getCardList(value);
                
            },

            //生成 cardType select2 可以选择的选项
            //要用到 id 和 text
            //卡类型不能与现有的重复
            generateCardType: function(){
                var me = this;


                //已有卡类型列表
                var cardTypeArray = _.pluck(me.model.collection.toJSON(),'cardType');

                //已有卡类型，格式是 一个数字
                var addedCardType = _.reduce(cardTypeArray, function(memo, num) {
                    return memo + Number(num);
                }, 0);

                //不能与现有卡类型有交集，所以用全部卡类型减去已有卡类型
                var unUsedCardType = ALL_CARD_TYPE - addedCardType;


                //本身拥有的卡类型
                var ownCardType = me.model.get('cardType');

                //可以设置的卡类型 = 未用到的卡类型 + 自身拥有的卡类型
                var canAddCardType = Number(unUsedCardType) + Number(ownCardType);

                // 生成 id 列表
                var list = me.getCardList(canAddCardType);


                var arr = _.map(list,function(item){
                    return {
                        id: item,
                        text: CARDTYPE_MAP[item]
                    };
                });
                return arr;
            },


            //如果没有传入defaultValue，则返回所有可能的 id 列表
            //如果用传入 defaultValue ，则根据 defaultValue 生成列表
            //
            getCardList: function(defaultValue){
                var me = this;
                var val = defaultValue || ALL_CARD_TYPE;
                var arr = [];
                // 1-借记卡; 2-贷记卡; 4-准贷记卡; 8-预付卡
                var cardTypeArray = [1,2,4,8];

                for(var i in cardTypeArray){
                    if(!!(val & cardTypeArray[i])){
                        arr.push(cardTypeArray[i]);
                    }
                }
                if(arr.length === 4){ //增加一个 全部卡种类 的选项
                    arr.unshift(ALL_CARD_TYPE);
                }
                return arr;
            },

            setFloorAmountVal: function(){
                this.model.set('floorAmount', this.ui.floorAmount.val());
            },

            setUpperAmountVal: function(){
                this.model.set('upperAmount', this.ui.upperAmount.val());
            },

            setMaxFeeVal: function(){
                this.model.set('maxFee', this.ui.maxFee.val());
            },

            setMinFeeVal: function(){
                this.model.set('minFee', this.ui.minFee.val());
            },

            setFeeValue: function(){
                this.model.set('feeValue', this.ui.feeValue.val());
            },


            setFlag: function(){
                this.model.set('flag', this.ui.flag.val());
            },

            getCardTypeFromUI: function () {
                var me = this,
                    ui = me.ui,
                    arr = _.map(ui.cardType.select2("data"), function(item){
                            return  item.id;
                        }),
                    cardType = _.reduce(arr,function(memo,num){
                        return memo + Number(num);
                    },0);
                return cardType;
            },

            setCardType: function(){
                this.model.set('cardType',this.getCardTypeFromUI());
            },

            onCardTypeChange: function(e){ //设置卡类型select2的显示值
                var me = this,
                    ui = me.ui,
                    arr = $(e.target).select2("data"),
                    lastValue = _.last(arr);

                    //如果select2 没有选项则直接返回
                    if(!arr.length){
                        return ;
                    }
                // 如果最新一个选择是 “全部卡类型” 或 之前选择了 “全部卡类型”
                //  重置 select2 的值为 最新一个选择
                if ( lastValue.id == ALL_CARD_TYPE || _.contains(_.pluck(arr,'id'), ALL_CARD_TYPE)) {
                    arr = [lastValue];
                    $(e.target).select2('data',arr);
                }

                //解决输入正确但错误提示没有消失的问题
                ui.cardType.trigger('keyup');

                me.setupAjaxValidation();
            },

            //返回所有选中值的 和
            getSelectedCardType: function(){
                return this.getCardTypeFromUI();
            }
        });

        var ComView = Marionette.CompositeView.extend({
            template: Tpl,
            childViewContainer: '.add-scheme-container',
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
            },

            templateHelpers: function(){
                
            },
            onChildviewItemDelete: function(childView){
                var me =  this;
                if(me.children.length <= 1) {
                    return false;   
                }
                me.collection.remove(childView.model);
            },
            addItem: function(){
                if(!this.validate()) {
                    return false;
                }

                //如果所有子view选中的卡类型覆盖全集，则不能在添加
                if(this.getSelectedCardType() == ALL_CARD_TYPE) {
                    Opf.alert({ title: '不能再添加',  message: '所选卡类型已经覆盖所有，不能再添加' });
                    return false;
                }


                this.children.each(function(child){
                    child.setModelValue();
                });
                var me = this;
                var defaultObject = {
                    floorAmount : "",
                    upperAmount : "",
                    cardType : "",
                    flag: "1",
                    feeValue: "",
                    minFee: "",
                    maxFee: ""
                };
                me.collection.add(defaultObject);
            },
            onRender: function(){
                this.$el.find('.card-type').trigger('change');
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


            onChildviewRender: function (childView) {
                console.log('<<<parentview onRender');
                //从第二条开始，要保证，下一条的起始 >= 上一条的结束
                var curIndex = this.collection.indexOf(childView.model);
                if(curIndex >= 1) {
                    var frontChildView = this.children.findByIndex(curIndex - 1);
                    childView.setupRangeValidWithFrontView(frontChildView);
                }
            },

            getDefaultFeeValue: function(){
                var me = this;
                return me.collection.modelSetting.maxBorm;
            },

            setModelsValue: function(){

                this.children.each(function (childView) {
                    childView.setModelValue();
                });
                
            },

            getSelectedCardType: function(){
                var ret = 0;

                this.children.each(function(child){

                    console.log('invoke child.getSelectedCardType');

                    if (child.getSelectedCardType() == ALL_CARD_TYPE) {
                        ret = ALL_CARD_TYPE;
                        return false;
                    }
                    ret |= child.getSelectedCardType();
                });

                console.log('<<<parentview getSelectedCardType', ret);
                return ret;
            }

        });



        return ComView;
});