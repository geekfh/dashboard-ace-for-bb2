/**
 * 机构费率模型 编辑/查看计费方案 计费方案列表
 */

define([
    'tpl!app/oms/disc/brh-disc/common/edit/templates/disc-row.tpl',
    'tpl!app/oms/disc/brh-disc/common/edit/templates/disc-table.tpl',
    'app/oms/disc/brh-disc/common/edit/edit-disc-view',
    'app/oms/disc/brh-disc/common/edit/edit-disc-view-dialog'
    ],function(RowTpl, Tpl, AddSchemeView, EditDiscDialogView){

        var ALL_CARD_TYPE = 15;

        var TRANSTYPE_MAP ={
            '1': '消费类',
            '2': '线上支付类',
            '0': '全部类'
        };

        var MCHTGRP_MAP = {
            '00':'全部类型',
            '01':'餐娱类',
            '02':'房产汽车类',
            '03':'民生类',
            '05':'一般类',
            '06':'批发类',
            '10':'扣率类',
            '11':'封顶类'
        };
            
        var ItemView = Marionette.ItemView.extend({
            template: RowTpl,
            tagName: 'tr',
            ui: {
                colProfitRange: '.col-profit-range',
                colProfitRatio: '.col-profit-ratio'
            },

            triggers: {
                'click .edit': 'edit',
                'click .delete': 'delete'
            },

            //更新该行的分润部分的单元格的，跨行设置
            updateUIProfitRowSpan: function (rowspan) {
                this.ui.colProfitRange.prop('rowspan', rowspan).addClass('rowspan');
                this.ui.colProfitRatio.prop('rowspan', rowspan).addClass('rowspan');
            },

            templateHelpers: function () {
                return {
                    shouldProfitInfoRender: this.getOption('shouldProfitInfoRender')
                }
            }
        });

        var ComView = Marionette.CompositeView.extend({
            template: Tpl,
            getChildView: function (model) {
                var shouldProfitInfoRender;
                var index = this.collection.indexOf(model);

                //如果是统一分润
                if(this.isUniteRatio()) {
                    //如果是画第一行，就画出单元格（后续会更新跨行rowspan）
                    if(index === 0) {
                        shouldProfitInfoRender = true;
                    }else {
                    //如果不是第一行，就不画了
                        shouldProfitInfoRender = false;
                    }
                }else {
                    //如果不是统一分润，每一行计费方案都要显示分润部分的单元格
                    shouldProfitInfoRender = true;
                }

                return ItemView.extend({
                    shouldProfitInfoRender: shouldProfitInfoRender
                });
            },
            childViewContainer: 'tbody',
            ui: {
                moreScheme: '.more-scheme',
                discTitle: '.disc-title'
            },

            events: {
                'click .add-more-scheme' : 'moreScheme'
            },

            //是否统一分润
            isUniteRatio: function () {
                //数据库定的0表示 “是统一分润”
                return this.modelRecord.uniteRatio == '0';
            },

            /**
             * [initialize description]
             * @param  {[type]} options 
             *                 {
             *                     modelRecord: modelRecord//一条费率模型的记录
             *                     renderTo: ,渲染完后添加到该容器
             *                     readOnly: 如果为 true 则禁止编辑
             *                 }
             * @return {[type]}         [description]
             */
            initialize: function(options){
                var me = this;

               /* me.needAddList = [];*/

                me.needAddPayOnline = false;

                me.modelRecord = options.modelRecord;  // modelRecord 包含 模型名称/ID/所属机构/状态/统一分润与否

                if(!me.collection) {
                    
                    var DiscCollection = Backbone.Collection.extend({
                        parse: function (models) {
                            //把字符串类型的 数字 整理一下，变成数字，却掉结尾的00小数
                            Opf.Utils.walkThrough(models, true, function(value, key, setFn) {
                                    if (typeof value === 'string' &&  /^\d+\.0+$/.test(value)) {
                                        setFn(parseFloat(value));
                                    }
                                }
                            );
                            return models;
                        },
                        url: url._('disc.scheme', {modelId: me.modelRecord.modelId})
                    });
                    me.collection = new DiscCollection();
                    me.reload({
                        reset: true,
                        success: function(collection, resp) {
                            if(!me.getOption('readOnly')){
                                //me.checkAddScheme(resp);
                                me.checkAddSchemeNew(resp);
                            }
                        }
                    });
                }

                if(me.collection) {
                    me.collection.on('request', function (c) {
                        if(c instanceof Backbone.Collection) {
                            // Opf.UI.ajaxLoading(me.$el);
                        }
                    });    
                }

                me.enoughItems = [];
            },

            reload: function (options) {
                options = _.extend({reset: true},options);
                this.collection.fetch(options);
            },

            onChildviewRender: function (childView) {
                if(this.getOption('readOnly')) {
                    childView.$el.find('.operation').remove();
                }

                //如果是统一分润
                //如果是画第一行，更新跨行rowspan，保持只显示一个单元格
                if(this.isUniteRatio()) {
                    childView.updateUIProfitRowSpan(this.collection.length);
                }
            },
            onRender: function () {
                if(this.getOption('readOnly')) {
                    this.$el.find('.operation').remove();
                }
                if(this.getOption('renderTo')) {
                    this.$el.appendTo(this.getOption('renderTo'));
                }
            },
            templateHelpers: function(){
                return {
                    shortModelId : this.modelRecord.modelId.slice(0,2)
                };
            },

            onChildviewEdit: function(chlidView){
                var me = this, model = chlidView.model;

                var deferred = me.fetchUpperBrhDisc({
                    modelBrh: me.modelRecord.modelBrh,
                    modelId: me.modelRecord.modelId,
                    mchtGrp: model.get('mchtGrp'),
                    cardType: model.get('cardType'),
                    transType: model.get('transType'),
                    ratioType: model.get('ratioType')
                });

                //如果不是0级机构，则要获取上一级机构的相关设置
                if (Ctx.getUser().get('brhLevel') != '0') {
                    $.when(deferred).done(function(resp){
                        me.popEditDiscDialog(model, resp);
                    });
                } else {
                    me.popEditDiscDialog(model,{});
                }

            },


            onChildviewDelete: function(childView){
                var me = this, ui = me.ui;
                var modelTransType = childView.model.get('transType');
                var modelmchtGrp = childView.model.get('mchtGrp');

                //检查能不能删除这个view
                //如果计费方案里只有一个 这个 view 的商户类型，就不能删除
                var mchtGrpArr = me.collection.where({
                    transType: modelTransType,
                    mchtGrp: modelmchtGrp
                });
                Opf.confirm('您确定删除所选记录吗？', function (result) {
                    if(result) {
                        if(mchtGrpArr.length === 1){
                            Opf.alert(TRANSTYPE_MAP[modelTransType] + ' 的 '+ MCHTGRP_MAP[modelmchtGrp] + ' 只有这一条记录，因此不能删除');
                            return true;
                        }
                        else {
                            // me.collection.remove(childView.model);
                            //向后台发送删除的条目
                            Opf.ajax({
                                url: url._('disc.edit.scheme', {id:childView.model.get('id')}),
                                type: "DELETE",
                                success: function(){
                                    me.reload({
                                        reset: true,
                                        success: function(collection, resp) {
                                            //me.checkAddScheme(resp);
                                            me.checkAddSchemeNew(resp);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            },

            

            addMoreScheme: function(msg){
                var me = this,
                    ui = me.ui;
                ui.moreScheme.addClass('icon-plus-sign can-add-more add-more-scheme');
                ui.discTitle.text('请补全 '+ msg +' 的计费方案').addClass('text-red');
                me.needAddPayOnline = true;
                console.log('need more');
            },

            noMoreScheme: function(){
                var me = this,
                    ui = me.ui;
                ui.moreScheme.removeClass('icon-plus-sign can-add-more add-more-scheme');
                ui.discTitle.text('计费方案').removeClass('text-red');
                console.log('no more scheme');
                this.needAddPayOnline = false;
            },

            popEditDiscDialog: function (model, upperBrhDisc) {
                var me = this;
                var discView = new EditDiscDialogView({
                    model: model,
                    modelRecord: me.modelRecord,
                    upperBrhDisc: upperBrhDisc
                }).render();

                discView.on('submit:success', function() {
                    console.log('>>> on editDiscView submit:success ');
                    me.reload({
                        reset: true,
                        success: function(collection, resp) {
                            //me.checkAddScheme(resp);
                            me.checkAddSchemeNew(resp);
                        }
                    });
                });
            },

            popAddDiscDialog: function(upperBrhDisc){
                var me = this;
                upperBrhDisc = upperBrhDisc || me.collection.at(0) && me.collection.at(0).toJSON() || me.getEmptyPayOnlineDisc();
                var model = new Backbone.Model(upperBrhDisc);
                var addSchemeView = new AddSchemeView({
                    model: model,
                    modelRecord: me.modelRecord,
                    upperBrhDisc: upperBrhDisc,
                    _from: 'add',
                    _enoughItems: me.enoughItems
                }).render();

                var $dialog = Opf.Factory.createDialog(addSchemeView.$el, {
                    dialogClass: '',
                    destroyOnClose: true,
                    title: '新增计费方案',
                    autoOpen: true,
                    width: 750,
                    height: 550,
                    modal: true,
                    buttons: [{
                        type: 'submit',
                        text: '保存',
                        click: saveDisc
                    },{
                        type: 'cancel'
                    }]
                });

                function saveDisc(){
                    if(addSchemeView.validate()){
                        $.ajax({
                            url: url._('disc.edit.scheme'),
                            type: 'POST',
                            jsonData: $.extend(addSchemeView.getPostData(), {id: null}),
                            complete: function(){
                                $dialog.dialog('close');
                            },
                            success: function(){
                                me.reload({
                                    reset:true,
                                    success: function(collection, resp){
                                        //me.checkAddScheme(resp);
                                        me.checkAddSchemeNew(resp);
                                    }
                                });
                            }
                        });
                    }
                }
            },

            getEmptyPayOnlineDisc: function () {
                return {
                    "modelId": this.modelRecord.modelId,
                    "transType": "2",
                    "ratioType": "1",
                    "cardType": null,
                    "mchtGrp": null,
                    "baseRatioSetting": [{
                        "minTrade": "0.00",
                        "maxTrade": "999999999999.99",
                        "baseRatio": "",
                        "maxFee": ""
                    }],
                    "minBorm": "",
                    "maxBorm": "",
                    "minTop": "",
                    "maxTop": "",
                    "profitSetting": [{
                        "minTrade": "0.00",
                        "maxTrade": "999999999999.99",
                        "profitRatio": ""
                    }]
                };
            },

            // modelBrh//所属机构号
            // modelId//模型ID
            // mchtGrp//商户类型
            // cardType//所缺卡类型
            // transType//交易类型
            moreScheme: function(){
                var me = this,
                    model = me.collection.at(0);

                var deferred = me.fetchUpperBrhDisc({
                    modelBrh: me.modelRecord.modelBrh,
                    modelId: me.modelRecord.modelId,
                    cardType: ALL_CARD_TYPE,
                    transType: model && model.get('transType') || 15,
                    ratioType: model && model.get('ratioType') || '2'
                });

                //如果不是0级机构，则要获取上一级机构的相关设置
                if (Ctx.getUser().get('brhLevel') != 0) {
                    $.when(deferred).done(function(resp){
                        me.popAddDiscDialog(resp);
                    });
                } else {
                    me.popAddDiscDialog();
                }
            },

            fetchUpperBrhDisc: function (param) {
                return $.ajax({
                    url: url._('brh.upper.brh.disc'),
                    data: param
                });
            },

            /*addPayOnline: function () {
                var me = this;

                var deferred = me.fetchUpperBrhDisc({
                    modelBrh: me.modelRecord.modelBrh,
                    modelId: me.modelRecord.modelId,
                    mchtGrp: '00',
                    cardType: 15,
                    transType: '2',
                    ratioType: '2'
                });

                //如果不是0级机构，则要获取上一级机构的相关设置
                if (Ctx.getUser().get('brhLevel') != 0) {
                    $.when(deferred).done(function(resp){
                        me.popAddDiscDialog(resp, 'addPayOnline');
                    });
                } else {
                    var emptyPayOnlineDisc = me.getEmptyPayOnlineDisc();

                    me.popAddDiscDialog(emptyPayOnlineDisc, 'addPayOnline');
                }

            },*/

            /*
            * 单选 transType 交易类型：全部类（0）；消费类（1）；线上支付类（2）
            * 多选 cardType  卡类型：借记卡（1）；贷记卡（2）；准贷记卡（4）；预付卡（8）；全部卡种类（15）
            * 单选 termType  产品类型：MPOS（01）；慧POS（02）；慧收银（03）；好哒（04）；全部（99）
            * 单选 discCycleType 结算周期：T0S0（0）；T1（1）；全部（9）
            * 思路：把这四项用四位数编码，总共是 2*4*4*2 个，消费类能不能选 就看1开头的四位数的个数，有木有 4*4*2 个，以此类推
            * */
            checkAddSchemeNew: function(schemes){
                var me = this;
                var validateSchemesArray = _.map(schemes, function(scheme){
                   return _.pick(scheme, 'transType', 'cardType', 'termType', 'discCycle');
                });

                var arrangedSchemesArray = [];
                _.each(validateSchemesArray, function(validateSchemesItem){
                    var transType = [],
                        cardType = [],
                        termType = [],
                        discCycle = [];

                    //把 'transType', 'cardType', 'termType', 'discCycle'的全部选项拆分成单项
                    transType = validateSchemesItem['transType']=="0" ? ["1", "2"] : [validateSchemesItem['transType']];
                    _.each([1, 2, 4, 8], function(indicator){
                        if(indicator & parseInt(validateSchemesItem['cardType'], 10)){
                            cardType.push(indicator);
                        }
                    });
                    termType = validateSchemesItem['termType']=="99" ? ["01", "02"] : [validateSchemesItem['termType']];
                    discCycle = validateSchemesItem['discCycle']==9 ? [0, 1] : [validateSchemesItem['discCycle']];

                    //得出现在已选的 'transType', 'cardType', 'termType', 'discCycle'的全部排列组合
                    var validateSchemesItemFormat = [transType, cardType, termType, discCycle];
                    var arrangedSchemes = arrangArray(validateSchemesItemFormat[0], validateSchemesItemFormat[1]);
                    var index = 2;
                    while (true){
                        if(validateSchemesItemFormat[index]){
                            arrangedSchemes = arrangArray(arrangedSchemes, validateSchemesItemFormat[index]);
                            index++;
                        }else {
                            break;
                        }
                    }
                    arrangedSchemesArray.push(arrangedSchemes);
                });

                //对现在已选的 'transType', 'cardType', 'termType', 'discCycle'的全部排列组合 去重
                var arrangedSchemesArrayList = _.uniq(_.flatten(arrangedSchemesArray));

                //再判断好哒和慧收银，***只需要存在好哒和慧收银除外的类型，则等于全部，则会执行下面这个计费方案，不包括还是没达到全部类型
                var isTermTypeVaild = isTermTypeFn(schemes);
                function isTermTypeFn(schemes){
                    var tType = [];
                    _.each(schemes, function(v, i){
                        tType.push(v.termType);
                    });
                    if(_.contains(tType, "01") && _.contains(tType, "02") || _.contains(tType, "99")){
                         return true;
                    }
                    else{
                        return false;
                    }
                }

                //还需要再选计费方案
                if(arrangedSchemesArrayList.length < 32 || !isTermTypeVaild){//有慧POS和MPOS就可以保存
                    var countByTransType = _.countBy(arrangedSchemesArrayList, function(arrItem){
                        if(arrItem.split(' ')[0]=="1"){
                            return "消费类";
                        }else if(arrItem.split(' ')[0]=="2"){
                            return "线上支付类";
                        }
                    });
                    var countByCardType = _.countBy(arrangedSchemesArrayList, function (arrItem) {
                        if (arrItem.split(' ')[1] == "1") {
                            return "借记卡";
                        } else if (arrItem.split(' ')[1] == "2") {
                            return "贷记卡";
                        } else if (arrItem.split(' ')[1] == "4") {
                            return "准贷记卡";
                        } else if (arrItem.split(' ')[1] == "8") {
                            return "预付卡";
                        }
                    });
                    var countByTermType = _.countBy(arrangedSchemesArrayList, function (arrItem) {
                        if (arrItem.split(' ')[2] == "01") {
                            return "MPOS";
                        } else if (arrItem.split(' ')[2] == "02") {
                            return "慧POS";
                        } else if (arrItem.split(' ')[2] == "03") {
                            return "慧收银";
                        } else if (arrItem.split(' ')[2] == "04") {
                            return "好哒";
                        }
                    });
                    var countByDiscCycleType = _.countBy(arrangedSchemesArrayList, function (arrItem) {
                        if (arrItem.split(' ')[3] == "0") {
                            return "T0S0";
                        } else if (arrItem.split(' ')[3] == "1") {
                            return "T1";
                        }
                    });

                    var noticeMsg = countByTransType["消费类"]==32 ? '线上支付类' : '消费类';

                    //计算当前各选项已满足的情况，如果全部满足，则在新增计费方案的界面去掉该选项
                    var enoughItems = [];
                    if(countByTransType["消费类"]==32){enoughItems.push("消费类");}
                    if(countByTransType["线上支付类"]==32){enoughItems.push("线上支付类");}

                    if(countByCardType["借记卡"]==16){enoughItems.push("借记卡");}
                    if(countByCardType["贷记卡"]==16){enoughItems.push("贷记卡");}
                    if(countByCardType["准贷记卡"]==16){enoughItems.push("准贷记卡");}
                    if(countByCardType["预付卡"]==16){enoughItems.push("预付卡");}

                    if(countByTermType["MPOS"]==16){enoughItems.push("MPOS");}
                    if(countByTermType["慧POS"]==16){enoughItems.push("慧POS");}
                    if(countByTermType["慧收银"]==16){enoughItems.push("慧收银");}
                    if(countByTermType["好哒"]==16){enoughItems.push("好哒");}

                    if(countByDiscCycleType["T0S0"]==32){enoughItems.push("T0S0");}
                    if(countByDiscCycleType["T1"]==32){enoughItems.push("T1");}

                    me.enoughItems = enoughItems;
                    this.addMoreScheme(noticeMsg);
                }else {
                    this.noMoreScheme();
                }

                //多个一维数组排例组合
                function arrangArray(arr1,arr2){
                    var arr = Array();
                    for(var i=0;i<arr1.length;i++){
                        for(var j=0;j<arr2.length;j++){
                            arr.push(arr1[i]+" "+arr2[j]);
                        }
                    }
                    return arr;
                }

            },
            //交易类型要么只有一种 '0': '全部类'，这是默认的类型
            //要么两种全有:'1': '消费类','2': '线上支付类'
            //要求每一种交易类型下的每一类商户类型都覆盖所有卡类型
            //我的初步想法见下面被注释的行，需要后台配合

            /*checkCardType: function(payWayList){
                return (_.reduce(getAllCardType(_.pluck(payWayList,'cardType')), function(memo, num){
                        return memo + Number(num);
                    }, 0)) < ALL_CARD_TYPE
            },

            checkDiscCycle: function(payWayList){
                var cardTypeGroups,
                    cardType,
                    needDiscCycle = false,
                    payWayListWithout15,  //排除卡类型为全部的，以方面下面的判断
                    payWayListCardType15,
                    needDiscCycleType = [];

                payWayListWithout15 = _.filter(payWayList, function(item){
                    return item.cardType != '15';
                });
                payWayListCardType15 = _.filter(payWayList, function(item){
                    return item.cardType == '15';
                });

                if(payWayListCardType15.length){ //如果卡类型选了全部，考查卡类型为全部的结算周期的满足情况
                    var payWayListCardType15_discCycle = _.pluck(payWayListCardType15, 'discCycle');
                    if(_.indexOf(payWayListCardType15_discCycle, 9) != '-1' || _.indexOf(payWayListCardType15_discCycle, 0) != '-1' && _.indexOf(payWayListCardType15_discCycle, 1) != '-1'){ //卡类型：全部 =》 结算周期：全部 || T0S0+T1.........条件满足，不再做判断
                        needDiscCycle = false;
                    }else if(_.indexOf(payWayListCardType15_discCycle, 0) != '-1'){//卡类型：全部 =》 结算周期：T0S0.........需要补齐四种卡类型各自的结算周期(T1)
                        needDiscCycle = true;
                        needDiscCycleType = [1];
                    }else {//卡类型：全部 =》 结算周期：T1.........需要补齐四种卡类型各自的结算周期(T0S0)
                        needDiscCycle = true;
                        needDiscCycleType = [0];
                    }
                }else {//卡类型没有选全部.........需要补齐四种卡类型各自的两种结算周期(T0S0、T1)
                    needDiscCycle = true;
                    needDiscCycleType = [0, 1];
                }

                //基于判断卡类型是否有选择全部的前提下，来判断其它要选择的卡类型的结算周期情况
                if(needDiscCycle){
                    cardTypeGroups = _.groupBy(payWayListWithout15, function(item){
                        return item.cardType;
                    });
                    //卡类型是多选的，要考虑一次选多个的情况，所以每次都把卡类型拆分成单个看
                    if(_.toArray(cardTypeGroups).length < 4 && getAllCardType(_.keys(cardTypeGroups)).length < 4){ //如果分组出来的卡类型小于4种，就需要补足卡类型
                        needDiscCycle = true;
                    }else {
                        needDiscCycle = false;
                        var cardType_discCycle;
                        if(_.indexOf(needDiscCycleType, 0) != '-1'){//需要补齐四种卡类型各自的结算周期(T0S0), 判断满足情况
                            for(cardType in cardTypeGroups){
                                cardType_discCycle = _.pluck(cardTypeGroups[cardType], 'discCycle');
                                if(cardType_discCycle.length < 2 && _.indexOf(cardType_discCycle, 9) == '-1' && _.indexOf(cardType_discCycle, 0) == '-1'){
                                    needDiscCycle = true;
                                    break;
                                }
                            }
                        }
                        if(_.indexOf(needDiscCycleType, 1) != '-1'){//需要补齐四种卡类型各自的结算周期(T1), 判断满足情况
                            for(cardType in cardTypeGroups){
                                cardType_discCycle = _.pluck(cardTypeGroups[cardType], 'discCycle');
                                if(cardType_discCycle.length < 2 && _.indexOf(cardType_discCycle, 9) == '-1' && _.indexOf(cardType_discCycle, 1) == '-1'){
                                    needDiscCycle = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                return needDiscCycle;
            },*/

            /*fixEmptyAndCardType: function(upperBrhDisc){
                var me = this, neededCardType = ALL_CARD_TYPE - Number(me.needAddList[0].addedCardType);
                //0级机构没有上级机构，所以取当前需要补全的 model 的相关设置
                upperBrhDisc = upperBrhDisc || me.collection.findWhere({transType:me.needAddList[0].transType, mchtGrp:me.needAddList[0].mchtGrp}).toJSON();

                upperBrhDisc.cardType = neededCardType;
                return upperBrhDisc;
            },

            needAdd: function(){
                return this.needAddList && this.needAddList.length !== 0 || this.needAddPayOnline;
            },*/

            needAdd: function(){
                return this.needAddPayOnline;
            }
        });
        /*function getAllCardType(cards){
            var allCardType = [];
            _.each(cards, function(oneCardTypeComposition){
                for(var i=0; i < 4; i++){
                    if(Number(oneCardTypeComposition) & Math.pow(2, i)){
                        allCardType.push(Math.pow(2, i));
                    }
                }
            });
            return _.uniq(allCardType);
        }*/
        return ComView;
});