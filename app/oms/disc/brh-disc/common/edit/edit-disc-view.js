/**
 * 机构费率模型 编辑计费方案 表单
 */

define([
    'tpl!app/oms/disc/brh-disc/common/edit/templates/edit-disc.tpl',
    'select2',
    'jquery.validate',
    'jquery.inputmask'
    ], function(Tpl){

        var ALL_CARD_TYPE = 15; //用 15 标示所有卡类型
        var ALL_MCHT_MODE = 15; //用 15 标示所有支付方式


        var MAX_RETURN_PROFIT = -2;

        var CAN_SET_PROFIT = {
             'HA': true,
             'HB': true,
             'HC': true,
             'HD': true,
             'HE': false,
             'FG': true,
             'PA': true,
             'PB': true
        };

        var CAN_SET_TOP = {
                '00': true,
                '01': false,
                '02': true,
                '03': false,
                '05': false,
                '06': true,
                '10': false,
                '11': true
        };

        var MCHT_MODE = [
            {id:1, text:"微信大商户"},
            {id:2, text:"微信特约商户"},
            {id:4, text:"支付宝大商户"},
            {id:8, text:"支付宝特约商户"},
            {id:15, text:"全部"}
        ];

        var TRANS_TYPE = {
          '全部类'       :    '0',
          '消费类'       :    '1',
          '线上支付类'    :    '2'
        };
        var TERM_TYPE = {
          'MPOS'     :    '01',
          '慧POS'    :    '02',
          '慧收银'   :    '03',
          '好哒'     :    '04',
          '全部'     :    '99'
        };

        var View = Marionette.ItemView.extend({
            template: Tpl,
            ui: {
                transType:           '.trans-type',
                payWay:              '.pay-way',
                mchtMode:            '.pay-way input', //支付方式
                cardType:            '.card-type',
                termType:            '.term-type',
                discCycle:           '.disc-cycle', //结算周期
                ratioType:           '.ratio-type',
                baseRatio:           '.base-ratio',
                baseRatioRange:      '.base-ratio-range',
                signRatioRange:      '.sign-ratio-range',
                topRange:            '.top-range',
                maxFee:              '.max-fee',
                maxFeeRange:         '.max-fee-range',
                minBorm:             '.min-borm',
                maxBorm:             '.max-borm',
                minTop:              '.min-top',
                maxTop:              '.max-top',
                baseRatioSection   : '.base-ratio-section', 
                uniteRatioContainer: '.unite-ratio-section',
                form:                'form.disc'
            },
            initialize: function(options){
                this.modelRecord = options.modelRecord;  // 结算模型的 7 个属性
                this.upperBrhDisc = options.upperBrhDisc;  // 上级机构的相关设置范围

                this._enoughItems = options._enoughItems;
                this._from = options._from;
            },
            templateHelpers: function(){
                var me = this;
                return {
                    minBorm: Ctx.isTopBrh() ? '不限' : me.upperBrhDisc.minBorm || '不限',
                    maxBorm: Ctx.isTopBrh() ? '不限' : me.upperBrhDisc.maxBorm || '不限',
                    minTop: Ctx.isTopBrh() ? '不限' : me.upperBrhDisc.minTop || '不限',
                    maxTop: Ctx.isTopBrh() ? '不限' : me.upperBrhDisc.maxTop || '不限'
                };
            },
            events: {
                'change @ui.mchtMode' : 'setMchtMode',
                'change .card-type' : 'setCardType'
            },

            isPayOnline: function () {
                return this.model.get('transType') == '2';
            },

            onRender: function(){
                var me = this;

                this.setDefaultValue();
                this.appendUniteRatio();
                this.attatchListener();
                this.deferredSetBaseRatio.done(function(){
                    me.addValidation();
                    me.ui.termType.on('change.toggleBaseRatioView', function(){
                        if(me.ui.termType.val() == TERM_TYPE['MPOS']){
                            me.ui.ratioType.val('3').trigger('change');
                        }
                    }).trigger('change.toggleBaseRatioView');
                    me.ui.ratioType.on('change.toggleBaseRatioView', function(){
                        me.changeBaseRatioView();
                    }).trigger('change.toggleBaseRatioView');
                });

                _.defer(function(){
                    me.dialogButtonset = me.$el.parent().find('.ui-dialog-buttonset');
                    me.dialogButtonset.prepend(_.template('<span style="display: inline-block; float: left;">额外固定分润设置:&nbsp;<input type="number" class="feeAdded" value="<%= feeAdd %>" style="text-align: right;">&nbsp;元&nbsp;</span>',{feeAdd:me.model && me.model.get("feeAdded")}));
                })
            },
            setDefaultValue: function(){
                var me = this,
                    ui = me.ui;
                ui.mchtMode.select2({
                    multiple: true,
                    data: MCHT_MODE
                });
                ui.cardType.select2({
                    multiple: true,
                    data: me.getAllCardType()
                });
                if(me._from == "add"){
                    var disabledScope = me.$el.find('[data-disabled]');
                    _.each(disabledScope, function(item){
                        if(!!_.find(me._enoughItems, function(enoughItem){return enoughItem == $(item).text().trim()})){
                            me.$el.find('[data-disabled='+$(item).text().trim()+']').siblings('[data-disabled="all"]').remove();
                            me.$el.find('[data-disabled='+$(item).text().trim()+']').remove();
                        }
                    });
                }

                ui.transType.val(me.model.get('transType'));
                if(me.model.get('transType') == '2'){
                    ui.mchtMode.select2('val', me.setUIMchtModeFromModel());
                }
                ui.cardType.select2('val',me.setUICardTypeFromModel());
                ui.termType.val(me.model.get('termType')||'99');
                ui.ratioType.val(me.model.get('ratioType'));
                ui.discCycle.val(me.model.get('discCycle')|| '0');
                ui.minBorm.val(me.model.get('minBorm'));
                ui.maxBorm.val(me.model.get('maxBorm'));
                me.setTop(me.model.get('mchtGrp'), me.model.get('ratioType'));
                me.setBaseRatioValue();
            },

            setTop: function(mchtGrp, ratioType){
                var me = this,
                    ui = me.ui;

                // 如果是 按笔固定，则封顶全部放开
                if(ratioType == '2'){
                    ui.minTop.val(me.model.get('minTop')).prop('disabled',false);
                    ui.maxTop.val(me.model.get('maxTop')).prop('disabled',false);
                    ui.topRange.hide();
                }else{
                    // 否则就是 按笔比例
                    // 如果是 线上支付类，则封顶全部放开
                    if(me.isPayOnline()){
                        ui.minTop.val(me.model.get('minTop')).prop('disabled', false);
                        ui.maxTop.val(me.model.get('maxTop')).prop('disabled', false);
                        ui.topRange.show();
                    }else{
                        // 如果是 消费类，则封顶要根据商户类型来判断是否放开
                        if(!CAN_SET_TOP[mchtGrp]){
                            ui.minTop.val('0').prop('disabled',true);
                            ui.maxTop.val('0').prop('disabled',true);
                            ui.topRange.hide();
                        } else {
                            ui.minTop.val(me.model.get('minTop')).prop('disabled', false);
                            ui.maxTop.val(me.model.get('maxTop')).prop('disabled', false);
                            ui.topRange.show();
                        }
                    }
                }

            },

            setBaseRatioValue: function(){
                var me = this,
                    ui = me.ui;
                    me.deferredSetBaseRatio = $.Deferred();
                require(['app/oms/disc/brh-disc/common/edit/set-base-ratio-view'], function(BaseRatioView){
                    var defaultData = me.model.get('baseRatioSetting');

                    // 如果 baseRatioSetting 为空，则创建一条没有封顶限制的记录
                    if(!defaultData){
                        defaultData = [{
                            "minTrade": "0",
                            "maxTrade": me.model.get('ratioType') == '2' ? "999999999999" : "999999999999.99",
                            "baseRatio": "",
                            "maxFee": ""
                        }];
                    }

                    var collection = new Backbone.Collection(defaultData);

                    var otherCollection = new Backbone.Collection([{
                        "minTrade": "0",
                        "maxTrade": me.getOtherRatioType() == '2' ? "999999999999" : "999999999999.99",
                        "baseRatio": "",
                        "maxFee": ""
                    }]);

                    var baseRatioView = me.baseRatioView = new BaseRatioView({
                        transType: me.model.get('transType'),
                        ratioType: me.model.get('ratioType'),
                        collection: collection,
                        mchtGrp: me.model.get('mchtGrp'),
                        upperBrhDisc: me.upperBrhDisc
                    }).render();

                    var otherBaseRatioView = me.otherBaseRatioView = new BaseRatioView({
                        transType: me.model.get('transType'),
                        ratioType: me.getOtherRatioType()[0],
                        collection: otherCollection,
                        mchtGrp: me.model.get('mchtGrp'),
                        upperBrhDisc: me.upperBrhDisc
                    }).render();

                    var thirdBaseRatioView = me.thirdBaseRatioView = new BaseRatioView({
                        transType: me.model.get('transType'),
                        ratioType: me.getOtherRatioType()[1],
                        collection: otherCollection,
                        mchtGrp: me.model.get('mchtGrp'),
                        upperBrhDisc: me.upperBrhDisc
                    }).render();

                    ui.baseRatioSection.empty().append(baseRatioView.$el).append(otherBaseRatioView.$el.hide()).append(thirdBaseRatioView.$el.hide());
                    me.deferredSetBaseRatio.resolve();
                });

            },

            getOtherRatioType: function () {
                var me = this;
                // 1-按笔比例(百分) 2-按笔固定 3-按笔比例（万分）
                return _.reject(['1','2','3'], function(ratioType){return ratioType == me.model.get('ratioType');});
                //return this.model.get('ratioType') == '1' ? '2' : '1';
            },

            //从 model 获取 cardType 并设置到 UI 里
            setUICardTypeFromModel: function(){
                var me = this;
                var val = +me.model.get('cardType');
                // 1-借记卡; 2-贷记卡; 4-准贷记卡; 8-预付卡
                var cardTypeArray = [1,2,4,8];
                var arr = [];

                if (val == ALL_CARD_TYPE) {
                    return arr = [ALL_CARD_TYPE];
                }

                for(var i in cardTypeArray){
                    if(!!(val & cardTypeArray[i])){
                        arr.push(cardTypeArray[i]);
                    }
                }

                return arr;
            },

            //从 model 获取 支付方式 mchtMode 并设置到 UI 里
            setUIMchtModeFromModel: function(){
                var me = this;
                var val = +me.model.get('mchtMode');
                // 1-微信大商户 2-支付宝大商户 4-微信特约商户 8-支付宝特约商户
                var mchtModeArray = [1,2,4,8];
                var arr = [];
                if(val == ALL_MCHT_MODE){
                    return arr = [ALL_MCHT_MODE];
                }
                for(var i in mchtModeArray){
                    if(!!(val & mchtModeArray[i])){
                        arr.push(mchtModeArray[i]);
                    }
                }
                return arr;
            },
            //生成 cardType 可以选择的选项
            //编辑某一计费方案和补全某一计费方案时都要用到 两者有不同的业务逻辑
            //补全时 要找出特定交易类型的特定商户类型所缺卡类型
            //编辑时 只让用户选择 还没有被其他计费方案使用的卡类型和自有的卡类型

            getAllCardType: function(){
                var me = this;
                var data = [
                    {id: 1, text: "借记卡"},
                    {id: 2, text: "贷记卡"},
                    {id: 4, text: "准贷记卡"},
                    {id: 8, text: "预付卡"},
                    {id: 15, text: "全部卡种类"}
                ];
                if(me._from == "add"){
                    _.each(data, function(item){
                        if(me._enoughItems.indexOf(item.text) !== -1){
                            data = _.reject(_.without(data, item), function(item){return item.id == 15;})
                        }
                    });
                }
                return data;
            },

            appendUniteRatio: function(){
                var me = this,
                    ui = me.ui;
                if(me.modelRecord.uniteRatio == '0' || !CAN_SET_PROFIT[me.model.get('modelId') && me.model.get('modelId').slice(0,2)]){ //统一设置分润
                    return ;
                }
                require(['app/oms/disc/brh-disc/common/edit/set-unite-ratio-view'], function(UniteRatioView){

                    me.uniteRatioView = new UniteRatioView({
                        discModel: me.model,
                        renderTo: ui.uniteRatioContainer
                    }).render();
                });
            },

            setCardType: function(){
                var me = this,
                    ui = me.ui,
                    lastValue,
                    //如果使用 ui.cardType.select2('val') 会得到字符串数组，而不是 数字数组
                    //而ALL_CARD_TYPE是数字，所以接下来的 _.contains(arr,ALL_CARD_TYPE) 会出问题
                    arr = _.pluck(ui.cardType.select2("data"),'id');
                // 如果最新一个选择是 “全部卡类型” 或 之前选择了 “全部卡类型”
                //  重置 select2 的值为 最新一个选择
                if ( (lastValue = _.last(arr)) == ALL_CARD_TYPE || _.contains(arr,ALL_CARD_TYPE)) {
                    arr = [lastValue];
                    ui.cardType.select2('val',arr);
                }
            },

            setMchtMode: function(){
                var me = this,
                    ui = me.ui,
                    lastValue,
                    arr = _.pluck(ui.mchtMode.select2("data"), 'id');
                if((lastValue = _.last(arr)) == ALL_MCHT_MODE || _.contains(arr, ALL_MCHT_MODE)){
                    arr = [lastValue];
                    ui.mchtMode.select2('val', arr);
                }
            },

            changeBaseRatioView: function () {
                var me = this;
                // 切换签约扣率视图
                this.baseRatioView.$el.toggle(me.model.get('ratioType') == me.ui.ratioType.val());
                this.otherBaseRatioView.$el.toggle( me.getOtherRatioType()[0]== me.ui.ratioType.val());
                this.thirdBaseRatioView.$el.toggle( me.getOtherRatioType()[1]== me.ui.ratioType.val());
                // 如果是 按笔固定，封顶不可编辑且为0
                this.setTop(this.model.get('mchtGrp'), this.ui.ratioType.val());
            },

            attatchListener: function(){
                var me = this,
                    ui = me.ui;
                ui.transType.on('change.toggleSelectPayWay', function(){
                    ui.payWay.toggle($(this).val() == TRANS_TYPE['线上支付类']);
                }).trigger('change.toggleSelectPayWay');
            },


            getTransType: function(){
                return this.ui.transType.val();
            },
            getCardType: function(){
                return _.reduce(this.ui.cardType.select2("val"),function(memo,num){
                    return memo + Number(num);
                },0);
            },
            getMchtMode: function(){
                if(this.getTransType() == '2'){ //只有线上支付类才记录支付方式
                    return _.reduce(this.ui.mchtMode.select2("val"), function(memo, num){
                        return memo + Number(num);
                    },0);
                }
            },
            getTermType: function(){
              return this.ui.termType.val();
            },
            getRatioType: function () {
                return this.ui.ratioType.val();
            },
            getDiscCycle: function(){
                return this.ui.discCycle.val();
            },
            getMchtGrp: function(){
                //return this.ui.mchtGrp.val();
                return this.model.get('mchtGrp') || '00';
            },
            getMinBorm: function(){
                return this.ui.minBorm.val();
            },
            getMaxBorm: function(){
                return this.ui.maxBorm.val();

            },
            getMinTop: function(){
                return this.ui.minTop.val();

            },
            getMaxTop: function(){
                return this.ui.maxTop.val();

            },

            getbaseRatioSetting: function(){
                var ui = this.ui,
                    arr;

                if(this.baseRatioView && this.baseRatioView.$el.is(':visible')){

                    arr = this.baseRatioView.getPostValues();

                }else if(this.otherBaseRatioView && this.otherBaseRatioView.$el.is(':visible')){

                    arr = this.otherBaseRatioView.getPostValues();

                }else if(this.thirdBaseRatioView && this.thirdBaseRatioView.$el.is(':visible')){

                    arr = this.thirdBaseRatioView.getPostValues();

                }else {
                    arr=[{
                        baseRatio: ui.baseRatio.val(),
                        maxFee: ui.maxFee.val()
                    }];
                }
                return arr;
            },

            getProfitSetting: function(){
                if(this.uniteRatioView){
                   return this.uniteRatioView.getPostValues();
                }
                return [];
            },
            getFeeAdded: function(){
                return this.$el.parent().find('.ui-dialog-buttonset input').val();
            },

            getPostData: function(){
                var me = this;
                return {
                    id: me.model.get('id'),
                    modelId: me.model.get('modelId'),
                    transType: me.getTransType(),
                    cardType: me.getCardType(),
                    mchtMode: me.getMchtMode(),
                    termType: me.getTermType(),
                    ratioType: me.getRatioType(),
                    discCycle: me.getDiscCycle(),
                    mchtGrp: me.getMchtGrp(),
                    minBorm: me.getMinBorm(),
                    maxBorm: me.getMaxBorm(),
                    minTop: me.getMinTop(),
                    maxTop: me.getMaxTop(),
                    baseRatioSetting: me.getbaseRatioSetting(),
                    profitSetting: me.getProfitSetting(),
                    feeAdded: me.getFeeAdded()
                };
            },

            //结算扣率和结算封顶都是 上级允许范围内的最大值时，签约扣率和签约封顶 不必大于 结算扣率和结算封顶
            minBormMinTopDepends: function(){
                var me = this,
                    ui = me.ui;
                //如果结算扣率有分档时，还是要求 签约扣率和签约封顶 分别大于 结算扣率和结算封顶
                if (me.baseRatioView) {
                    return true;
                } else if (parseFloat(ui.form.find('.base-ratio').val(), 10) == parseFloat(me.upperBrhDisc.maxBorm, 10) &&
                    parseFloat(ui.form.find('.max-fee').val(), 10) == parseFloat(me.upperBrhDisc.maxTop, 10)) {
                    //结算扣率和结算封顶都是 上级允许范围内的最大值时，签约扣率和签约封顶 不必大于 结算扣率和结算封顶
                    return false;
                } else if (ui.form.find('.base-ratio').prop('disabled') === true && parseFloat(ui.form.find('.max-fee').val(), 10) == parseFloat(me.upperBrhDisc.maxTop, 10)) {
                    //结算扣率不能设置时，只要结算封顶是范围内最大值，签约封顶就不需要大于结算封顶
                    return false;
                } else if (ui.form.find('.max-fee').prop('disabled') === true && parseFloat(ui.form.find('.base-ratio').val(), 10) == parseFloat(me.upperBrhDisc.maxBorm, 10)) {
                    //结算封顶不能设置时，只要结算扣率是范围内最大值，签约扣率就不需要大于结算扣率
                    return false;
                } else {
                    return true;
                }

            },

            setupMinBormValidationWithBaseRatioView: function () {
                var me = this, ui = me.ui;

                this.ui.minBorm.rules('add',{
                    //需要： 大于结算扣率
                    ge: {
                        depends: _.bind(me.minBormMinTopDepends,me),
                        param: me.baseRatioView ?
                            me.baseRatioView.getBiggestBaseRatioEl() : ui.form.find('.base-ratio')
                        }
                });
            },

            setupMinTopValidationWithBaseRatioView: function () {
                var me = this, ui = me.ui;

                ui.minTop.rules('add', {
                    //需要： 大于结算封顶
                    ge: {
                        depends: _.bind(me.minBormMinTopDepends,me),
                        param: me.baseRatioView ?
                            me.baseRatioView.getBiggestMaxFeeEl() : ui.form.find('.max-fee')
                    }
                });

            },

            removeMinTopMaxTopValidation: function () {
                this.ui.minTop.rules('remove', 'floatScope');
                this.ui.maxTop.rules('remove', 'floatScope');
            },


            addValidation: function(){
                var me = this,
                    ui = me.ui,
                    upperBrhDisc = me.upperBrhDisc;

                //如果当前机构不是顶级，则验证跟上级相关信息（当前结算费率 在 上级的签约扣率范围内）
                var shouldValidateWithUpBrhDisc = (!Ctx.isTopBrh() && upperBrhDisc.minBorm);

                function inReturnProfitRange(val){ //在允许的返利范围之内
                    return val <=0 && val >= MAX_RETURN_PROFIT;
                }

                function floatScopeDependsForBaseRatio (element) {
                    //如果结算扣率是负数，但范围在 MAX_RETURN_PROFIT 到 0，不用校验
                    return inReturnProfitRange($(element).val()) ? false : shouldValidateWithUpBrhDisc;
                }

                function floatScopeDepends(){
                    return shouldValidateWithUpBrhDisc;
                }


                if(me.baseRatioView) {
                    me.baseRatioView.on('childview:destroy', function () {
                        _.defer(function () {
                            me.validate();
                        });
                    });
                }

                Opf.Validate.addRules(ui.form, {
                    rules: {
                        'trans-type': {
                            required : true
                        },
                        'card-type': {
                            required : true
                        },
                        'term-type': {
                            required : true
                        },
                        //结算扣率
                        'base-ratio': {
                            required : true,
                            max: 100,
                            min: MAX_RETURN_PROFIT

                        },
                        'ratio-type': {
                          required: true
                        },
                        'disc-cycle': {
                          required: true
                        },
                        //结算封顶
                        'max-fee': {
                            required : true,
                            floatScope: {
                                depends: floatScopeDepends,
                                param: [upperBrhDisc.minTop, upperBrhDisc.maxTop]
                            }
                        },
                        //签约扣率下界
                        'min-borm': {
                            required : true,
                            floatScope: {
                                depends: floatScopeDepends,
                                param: [upperBrhDisc.minBorm, upperBrhDisc.maxBorm]
                            },
                            max: 100
                        },
                         //签约扣率上界
                        'max-borm': {
                            required : true,
                            floatScope: {
                                depends: floatScopeDepends,
                                param: [upperBrhDisc.minBorm, upperBrhDisc.maxBorm]
                            },
                            max: 100,
                            //需要： >= 下界
                            ge: {
                                param: [ui.minBorm]
                            }
                        },
                        //封顶下界
                        'min-top': {
                            required : true,
                            floatScope: {
                                depends: floatScopeDepends,
                                param: [upperBrhDisc.minTop, upperBrhDisc.maxTop]
                            }
                        },
                        //封顶上界
                        'max-top': {
                            required : true,
                            floatScope: {
                                depends: floatScopeDepends,
                                param: [upperBrhDisc.minTop, upperBrhDisc.maxTop]
                            },
                            //需要： >= 下界
                            ge: {
                                param: [ui.minTop]
                            }
                        }
                    },
                    messages: {
                        'card-type': {
                            required : '请选择卡类型'
                        },
                        'base-ratio': {
                            required : '请填写',
                            floatScope: '超出范围',
                            max: '不能超过100',
                            min: '必须大于或等于' + MAX_RETURN_PROFIT
                        },
                        'max-fee': {
                            required : '请填写',
                            floatScope: '超出范围',
                            ge: '必须大于或等于0'
                        },
                        'min-borm': {
                            required : '请填写',
                            floatScope: '超出范围',
                            ge: '不能小于结算扣率',
                            max: '不能超过100'
                        },
                        'max-borm': {
                            required : '请填写',
                            floatScope: '超出范围',
                            ge: '不能小于最小签约扣率',
                            max: '不能超过100'
                        },
                        'min-top': {
                            required : '请填写',
                            floatScope: '超出范围',
                            ge: '不能小于结算封顶'
                        },
                        'max-top': {
                            required : '请填写',
                            floatScope: '超出范围',
                            ge: '不能小于最小封顶'
                        }
                    }
                });
                //me.setupMinBormValidationWithBaseRatioView();
                //me.setupMinTopValidationWithBaseRatioView();
                // 如果是 线上支付类 , 干掉封顶范围的验证
                if(this.isPayOnline()){
                    this.removeMinTopMaxTopValidation();
                }

                $().add(ui.maxFee)
                    .add(ui.minTop)
                    .add(ui.minBorm)
                    .add(ui.maxBorm)
                    .add(ui.maxTop).inputmask('numeric', {
                        autoUnmask: true,
                        allowMinus: false,
                        allowPlus: false
                    });

                $().add(ui.baseRatio)
                    .inputmask('numeric', {
                        autoUnmask: true,
                        allowMinus: true,
                        allowPlus: false
                    });
           },

            validate: function () {
                if(this.baseRatioView) {
                    //this.setupMinBormValidationWithBaseRatioView();
                    //this.setupMinTopValidationWithBaseRatioView();
                }
    
                var valid =  this.$('form').valid();
                if(this.uniteRatioView && this.uniteRatioView.validate) {
                    valid = valid && this.uniteRatioView.validate();
                }
                if(this.baseRatioView && this.baseRatioView.validate) {
                    valid = valid && this.baseRatioView.validate();
                }
                return valid;
            }

        });

        return View;
});