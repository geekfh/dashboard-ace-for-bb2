/**
 * 商户费率模型 新增某一个费率模型
 *
 */

define([
    'tpl!app/oms/disc/mcht-disc/templates/add-model.tpl',
    'app/oms/disc/mcht-disc/scheme-list-view',
    'select2'
    ],function(Tpl,schemeListView){
        var SELECT_PLACEHOLDER_OPTION_CLS = 'placeholder';
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
        var SIX_MCHTGRP_MAP = {
            '00': '全部类型',
            '01': '餐娱类',
            '02': '房产汽车类',
            '03': '民生类',
            '05': '一般类',
            '06': '批发类'
        };
        var TWO_MCHTGRP_MAP = {
            '10': '扣率类',
            '11': '封顶类'
        };
        var View = Marionette.ItemView.extend({
            template: Tpl,
            ui: {
                modelNm: '.model-name',
                ForIdModelNm: '.for-hd-model-name',
                modelBrh : 'input.model-brh',
                mchtGrp: '.mcht-grp',
                modelFlag: '.model-flag',
                transType: '.trans-type',
                modelId: '.model-id',
                form: '.add-model-form'
            },
            initialize: function(options){
                this.options = options;
            },
            onRender: function(){
                var me = this,
                    ui = me.ui,
                    data = me.getOption('data'); //edit 时 相关数据保存在 data

                me.attachEventsListener();

                if (data) { //如果是 edit 则要从后台获取用户已设置过的值

                    $.ajax({
                        url: url._('disc.mcht.pubdisc.algo',{modelId: data.modelId}),
                        success: function(resp){
                            me.appendDisc(resp);
                            me.setDefaultVal(data);
                        }
                    });
                } else {
                    me.appendDisc();
                    //新增时设当前登陆机构为所属机构
                    me.setBrh(
                        Ctx.getUser().get('brhCode'),
                        Ctx.getUser().get('brhLevel'),
                        Ctx.getUser().get('brhName')
                    );
                    ui.modelBrh.trigger('change.value');
                }


                me.addValidateRules(ui.form);


            },

            setDefaultVal: function(data){
                var me = this,
                    ui = me.ui;
                data = data || {};

                //模型名称
                ui.modelNm.val(data.modelNm);
                //状态
                ui.modelFlag.val(data.modelFlag);
                //所属机构
                me.setBrh(data.modelBrh, data.level, data.modelBrhName);
                //交易类型
                me.generateTransTypeOpt(data.transType);
            },


            //设置所属机构
            setBrh: function(modelBrh, brhLevel,modelBrhName){
                var me = this,
                    ui = me.ui,
                    $inputBrh = ui.modelBrh;

                $inputBrh.select2(_.result(me, 'getSelect2Options'));
                modelBrh && $inputBrh.select2('data', {code:modelBrh, brhLevel: brhLevel, name:modelBrhName});

            },


            getSelect2Options: function(){
                return {
                    placeholder: '请选择所属机构',
                    minimumInputLength: 1,
                    ajax: {
                        type: "get",
                        url: url._('disc.mcht.model.brh'),
                        dataType: 'json',
                        data: function (term, page) { //page is one base
                            return {
                                kw: encodeURIComponent(term)
                            };
                        },
                        results: function (data, page) { // 返回除分页信息外的内容，要正确过滤备选项就在这里操作
                            
                            return {
                                results: data
                            };
                        }
                    },
                    // 如果不设ID，将不能选择列表，这个返回的字段是因例各异的，要根据具体情况而定
                    id: function (e) {
                        return e.code;
                    },
                    //格式化备选项，显示给用户。对每一个数组元素都执行此方法，data即为数组元素
                    formatResult: function(data, container, query, escapeMarkup){
                        return '<span value="'+data.code+'" data-brhLevel="'+data.brhLevel+'">'+ data.name +'</span>';
                    },
                    //选中之后显示的内容
                    formatSelection: function(data, container, escapeMarkup){
                        return '<span value="' + data.code + '" data-brhLevel="'+ data.brhLevel +'">'+ data.name +'</span>';
                    }
                };
            },

            attachEventsListener: function(){
                var me = this,
                    ui = me.ui;

                //所属机构
                ui.modelBrh.on('change.value', function(e){

                    var curBrhCode = $(e.target).val();
                    
                    function triggerValidateModelNm(){
                        ui.modelNm.data({brhCode:curBrhCode});
                        ui.modelNm.trigger('keyup');
                    }
                    triggerValidateModelNm(); // 触发验证 modelNm



                    if (me.getOption('type') == 'P') {
                        //如果是 直联商户费率模型，要检测所选机构的最近的上一级参与分润的机构有没有创建 直联MCC 模型，如果有，则不让用户新建模型模型
                        var fetchUpperBrh = me.upperBrhIsDirect(curBrhCode);

                        $.when(fetchUpperBrh).done(function(resp) {
                            if (resp.success === false) {
                                me.trigger('can:not:create:model', resp.msg);
                            } else {
                                me.trigger('can:create:model', resp.msg);
                                //生成交易类型下拉选项
                                me.generateTransTypeOpt();
                            }
                        });
                    } else {
                        //生成交易类型下拉选项
                        me.generateTransTypeOpt();
                    }

                });
                //交易类型
                ui.transType.on('change', function(){
                    //生成商户类型下拉选项
                    //商户类型选项要根据交易类型
                    me.generateMchtGrpOpt();
                });
                //商户类型
                ui.mchtGrp.on('change', function(){
                    //无论是新增还是编辑，
                    //所属机构/交易类型/商户类型都有默认值
                    //新增时所属机构默认为当前登陆机构
                    //交易类型根据所属机构而定
                    //商户类型根据 所属机构和交易类型 而定
                    if (me.schemeView) {
                        me.schemeView.collection.modelSetting = {
                            modelBrh: ui.modelBrh.val(),
                            transType: ui.transType.val(),
                            mchtGrp: ui.mchtGrp.val(),
                            type: me.getOption('type'),
                            brhLevel: ui.modelBrh.select2('data').brhLevel,
                            cardType: 15
                        };
                        me.schemeView.enableAdd();
                    }
                });

                //因为各种原因不能新建计费方案，不能让用户继续操作，除非他更新所属机构
                me.on('can:not:create:model', function(msg){
                    me.disableOperations();
                    ui.modelBrh.select2('enable',true);
                });

                me.on('can:create:model', function(msg){
                    if(me.modelSettingIsReady()){ // 如果用来创建计费方案的设置都已经准备好
                        me.schemeView.enableAdd();
                    }
                    me.enableOperations();
                });
            },

            upperBrhIsDirect: function(brhCode){
                var me = this;
                var fetchUpperBrh = $.ajax({
                    url: url._('disc.mcht.upperBrhIsDirect',{brhCode:brhCode})
                });
                return fetchUpperBrh;
                
            },

            genOptString: function(optObj){
                return _.map(optObj,function(value, key){
                        return '<option value="'+ key +'">' + value + '</option>';
                    }).join('');
            },


            //获取商户交易类型
            // /api/mcht-algos/model/transType
            // request
            // {
            //     brhCode: //所属机构号
            //     type:  // P:直联  H:间联
            // }
            generateTransTypeOpt: function(defaultVal){
                var me = this,
                    ui = me.ui,
                    brhCode,
                    ALL_OPT = {
                        '0' : '全部类',
                        '1' : '消费类',
                        '2' : '线上支付类'
                    },
                    $str;
                if(ui.modelBrh.select2('data')) { //如果所属机构有值
                    if (ui.modelBrh.select2('data').brhLevel > 1) { // 如果所属机构等级大于 1 级，则从后台获取 交易类型 的选项
                        $.ajax({
                            url: url._('disc.mcht.transType'),
                            type: "GET",
                            data: {
                                brhCode: ui.modelBrh.select2('data').code,
                                type: me.getOption('type')
                            },
                            success: function(resp){
                                var optObj = _.pick(ALL_OPT,resp);
                                var $str = me.genOptString(optObj);
                                ui.transType
                                    .empty()
                                    .append($str)
                                    .prop('disabled',false);
                                me.trigger('can:create:model');
                                if (defaultVal) {
                                    ui.transType.val(defaultVal);
                                    me.generateMchtGrpOpt(me.getOption('data').mchtGrp); //商户类型
                                } else {
                                    me.generateMchtGrpOpt();
                                }
                            },
                            error: function(){
                                me.trigger('can:not:create:model');
                            }
                        });
                    } else { // 如果所属机构等级是 0 级或 1 级，则显示所有交易类型
                        ui.transType
                            .empty()
                            .append(me.genOptString(ALL_OPT))
                            .prop('disabled',false);
                        if (defaultVal) {
                            ui.transType.val(defaultVal);
                            me.generateMchtGrpOpt(me.getOption('data').mchtGrp); //商户类型
                        } else {
                            me.generateMchtGrpOpt();
                        }
                    }
                }
            },


            //获取商户类型
            //request
            // /api/mcht-algos/model/mchtGrp
            // {
                
            //     brhCode: //所属机构号
            //     type:  // P:直联  H:间联 
            //     transType://交易类型
            // }
            generateMchtGrpOpt: function(defaultVal){
                var me = this,
                    ui = me.ui,
                    brhCode = ui.modelBrh.select2('data') && ui.modelBrh.select2('data').code,
                    brhLevel = ui.modelBrh.select2('data') && ui.modelBrh.select2('data').brhLevel,
                    transType = ui.transType.val(),
                    $str;

                if(brhLevel != null && brhLevel < 2){ //如果所属机构等级是 0 级 或 1 级
                    if( me.getOption('type') == 'P'){
                        $str = me.genOptString(SIX_MCHTGRP_MAP); //直联商户只有六种商户类型
                    } else {
                        $str = me.genOptString(MCHTGRP_MAP); //间联有所有的商户类型
                    }
                    ui.mchtGrp
                        .empty()
                        .append($str)
                        .prop('disabled',false);
                    defaultVal && ui.mchtGrp.val(defaultVal);
                    ui.mchtGrp.trigger('change');
                } else if(brhCode && transType) { //否则 如果所属机构 交易类型 有值 则从后台获取
                    $.ajax({
                        url: url._('disc.mcht.mchtGrp'),
                        type: "GET",
                        data: {
                            brhCode: brhCode,
                            transType: transType,
                            type: me.getOption('type')
                        },
                        success: function(resp){
                            var optObj = _.pick(MCHTGRP_MAP,resp);
                            var $str = me.genOptString(optObj);
                            ui.mchtGrp
                                .empty()
                                .append($str)
                                .prop('disabled',false);
                            defaultVal && ui.mchtGrp.val(defaultVal);
                            ui.mchtGrp.trigger('change');

                        }
                    });
                }/* else {
                    ui.mchtGrp.prop('disabled', true);
                }*/
            },

            appendDisc: function(data){
                var me = this,
                    ui = me.ui,
                    data = data || []; //  在编辑时传入 data

                    var collection = me.collection = new Backbone.Collection(data);
                    var view = me.schemeView = new schemeListView({collection: collection}).render();

                    if(data.length){ // 如果是 编辑 时的情况
                        collection.modelSetting = {
                            modelBrh: ui.modelBrh.val(),
                            transType: ui.transType.val(),
                            mchtGrp: ui.mchtGrp.val(),
                            type: me.getOption('type'),
                            brhLevel: me.options.data.level, // 编辑时从列表里获取机构等级
                            cardType: data[0].cardType
                        };
                        //可以让用户新增计费方案
                        view.enableAdd();
                    }



                    view.on('remove:scheme:error',function(){
                        me.showErrorTag(false);
                    });
                    me.$('.disc-table').append(view.$el);
            },

            modelIsHD: function(){
                var me = this;
                // 后台根据用户选择卡类型 回传的 setting 里的 modelId 
                // 如果以 HD 开头，即为 商户费率与基准费率一一对应 情况，
                // 此时要让用户再设置 基准计费方案
                var modelId = me.schemeView.getModelId();

                return modelId && modelId.slice(0,2) == 'HD';
            },

            isCreatedByAddFunc: function(){
                return this.getOption('data') == null;
            },

            addValidateRules: function(form){
                var me = this,
                    ui = this.ui;

                //用来验证 模型是 基准费率与签约费率一一对应 情况
                jQuery.validator.addMethod("checkRepeat", function(value, element, param) {
                    return this.optional(element) || ( param.modelNm.val() != value);
                }, "输入重复");

                Opf.Validate.addRules(form, {
                    rules: {
                        "model-name": {
                            'required':true,
                            utf8ByteLength:[0, 40],
                            checkMchtModelNmRepeat: {
                                param: {
                                    ignore:[$(form).find('input[name="model-name"]').val()],
                                    brhCode: ui.modelBrh.select2('data') && ui.modelBrh.select2('data').code
                                },
                                depends: function(){
                                    return ui.modelBrh.select2('data');
                                }
                            }
                        },
                        "for-hd-model-name": {
                            required: true,
                            checkRepeat: { // 在模型是 基准费率与签约费率一一对应 时，要求用户输入两次模型名称，且后一次不能与前一次的相同
                                depends: function(){
                                    return me.modelIsHD();
                                },
                                param: {
                                    modelNm : ui.modelNm
                                }
                            }
                        },
                        "model-brh": {
                            'required':true
                        }
                    },
                    messages: {
                        "model-name": {
                            checkMchtModelNmRepeat: "该模型名称已存在",
                            utf8ByteLength: "长度超出范围"
                        },
                        "for-hd-model-name": {
                            required: "请填写",
                            checkRepeat: "与前一次重复"
                        }
                    }
                });
            },

            formIsValid: function(){
                var ui = this.ui;
                return ui.form.valid() && !this.schemeIsEmpty();
            },

            schemeIsEmpty: function(){
                return !this.$('.disc-table .scheme-container tr').length ||
                        (this.baseCollection && 
                            !this.$('.base-disc-table .scheme-container tr').length);
            },

            showErrorTag: function(option){
                var schemeEmptyError = this.$('.scheme-empty-error');
                option && option === true ? schemeEmptyError.show() : schemeEmptyError.hide();
            },

            //如果是 商户费率与基准费率一一对应 的情况，要求用户填写 基准计费方案
            shiftDisc: function(){
                var me =  this;
                me.$('.disc-table').hide();
                require(['app/oms/disc/mcht-disc/base-scheme-list-view'], function(View){
                    var collection = me.baseCollection = new Backbone.Collection();
                    var view = new View({collection: collection}).render();
                    view.collection.modelSetting = me.collection.modelSetting;
                    view.on('remove:scheme:error',function(){
                        me.showErrorTag(false);
                    });
                    me.$('.base-disc-table').append(view.$el);
                });
            },

            //如果不是 商户费率与基准费率一一对应 的情况
            sendData: function(method,cb){
                var me = this;
                $.ajax({
                    url: url._('disc.mcht.model',{type: me.getOption('type')}),
                    type: method,
                    //后台要求 新增 时数据结构是一个数组，编辑 时是一个对象
                    jsonData: method == 'POST' ? $.makeArray(me.getPostData()) : me.getPostData(),
                    success: function(){
                        cb();
                    }
                });
            },
            
            //如果是 商户费率与基准费率一一对应 的情况
            sendHDData: function(method,cb){
                var me = this;
                $.ajax({
                    url: url._('disc.mcht.model',{type: me.getOption('type')}),
                    type: method,
                    jsonData: me.getHDPostData(),
                    success: function(resp){
                        cb();
                    }
                });
            },

            getPostData: function(){
                var me = this,
                    ui = me.ui,
                    rowData = me.getOption('data');
                var data = {
                    "id": rowData ? rowData.id : "",
                    "modelId": rowData ? rowData.modelId : "",
                    "modelType": "M",
                    "stlmFlag": "1",
                    "cycleType": "N",
                    "cardType": "15",
                    "modelNm": ui.modelNm.val(),
                    "modelBrh": ui.modelBrh.val(),
                    "mchtGrp": ui.mchtGrp.val(),
                    "transType": ui.transType.val(),
                    "modelFlag": ui.modelFlag.val(),
                    "feeScheme": me.collection.toJSON()
                };
                return data;
            },


            //如果是 商户费率与基准费率一一对应 的情况
            getHDPostData: function(){
                var me = this,
                    ui = me.ui,
                    arr = [],
                    data = me.getPostData(),
                    hdData;

                data.stlmFlag = "0"; //修复BUG #3028

                hdData = _.clone(data);
                hdData.modelNm = ui.ForIdModelNm.val();
                hdData.modelType = "B";
                hdData.stlmFlag = "0";
                hdData.feeScheme = me.baseCollection.toJSON();

                arr.push(data);
                arr.push(hdData);


                return arr;
            },

            modelSettingIsReady: function(){
                var me = this;
                return me.schemeView && me.schemeView.collection.modelSetting;
            },

            disableOperations: function(){

                this.enableInputs(false);
                this.enableSubmit(false);
                this.schemeView.hideAddSchemeButton();
            },

            enableOperations: function(){
                this.enableInputs(true);
                this.enableSubmit(true);
                this.schemeView && this.schemeView.showAddSchemeButton();
            },

            enableSubmit: function(flag){
                this.$el.closest('.ui-dialog').find('button[type=submit]').prop('disabled',flag === false);
            },

            enableInputs: function(flag){
                var me = this,
                    ui = me.ui;
                ui.modelNm.prop('disabled',flag === false);
                ui.modelBrh.select2('enable',flag === true);
                ui.mchtGrp.prop('disabled',flag === false);
                ui.transType.prop('disabled', flag === false);
                ui.modelFlag.prop('disabled', flag === false);
            },

            getFeeScheme: function(options){
                var me = this;
                if (options && !options.isHD) {
                    return me.collection.toJSON();
                }
                return me.baseCollection.toJSON();
            }
        });
        return View;
    });