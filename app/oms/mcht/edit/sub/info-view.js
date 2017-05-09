define([
    'app/oms/mcht/common/abstract-info'
], function(AbstractMchtInfoView) {

    var InfoView = AbstractMchtInfoView.extend({

        needInitExploreNameByCtx:false,
        // autoSwitchUI: false,
        constructor: function (mchtData) {
            AbstractMchtInfoView.prototype.constructor.apply(this, arguments);

            this.adaptMchtData(mchtData);
        },

        //disabledSwitchKind: function () {
        //    this.ui.dd.find('ul').remove();
        //    this.ui.dd.find('button').css('cursor', 'auto');
        //    this.ui.ddToggle.find('.icon').hide();
        //},

        onRender: function () {
            var me = this;

            var ui = this.ui;
            this.applyDefaultValue();
            // this.onSwitchKind();

            AbstractMchtInfoView.prototype.onRender.apply(this, arguments);

            this.triggerEvents();
            //this.disabledSwitchKind();
            this.adjustValidateRules();

            //如果是对公的账户，将bankName和bankNo的值设入select2中。
            if( Opf.isBsFalse(this.mchtData.accountType) ) {
                ui.bankInfos.data('select2') && ui.bankInfos.select2('data', {key: ui.bankNo.val(), value: ui.bankName.val()});
            }

            this.accountTypeChanged = this.canShowBankName();
        },

        triggerEvents: function () {
            var ui = this.ui;
            //如果是对公的账户则不需要trigger change.logo的事件，并且去掉对账号合法性验证。
            if( Opf.isBsFalse(this.mchtData.accountType) ) { //if(this.mchtData.accountType === '0') {
                ui.accountProxy.triggerHandler('change.elementDisplay');
                // ui.accountNo.rules('remove', 'isBankCard');
            } else {
                ui.accountNo.triggerHandler('change.logo');
                ui.accountProxy.triggerHandler('change.elementDisplay');
            }
            
        },

        adjustValidateRules: function () {
            var baseId = this.mchtData.baseId;

            this.ui.licNo.data('baseId', baseId);
            this.ui.userPhone.data('baseId', baseId);
            this.ui.userEmail.data('baseId', baseId);

            this.ui.licNo.rules( "add", {
                mchtlicNoDuplicateCheck: {ignore: [this.ui.licNo.data('original')]}
            });
            this.ui.userPhone.rules( "add", {
                mchtMobileDuplicateCheck: {ignore: [this.ui.userPhone.data('original')]}
            });
            this.ui.userCardNo.rules( "add", {
                mchtPersonIdDuplicateCheck: {ignore: [this.ui.userCardNo.data('original')]}
            });
            this.ui.userEmail.rules( "add", {
                mchtUserEmailDuplicateCheck: {ignore: [this.ui.userEmail.data('original')]}
            });
            //this.ui.userKindSuffix.rules( "add", {
            //    mchtUserKindSuffixCheck: {ignore: [this.ui.userKindSuffix.data('original')]}
            //});
            //this.ui.userLogin.rules( "add", {
            //    mchtUserLoginCheck: {ignore: [this.ui.userLogin.data('original')]}
            //});
        },

        applyDefaultValue: function () {
            doApplyMchtData(this);
        },

        adaptMchtData: function (mchtData) {

            if(mchtData.accountProxy == 1) {
                mchtData._accountProxyType = mchtData.accountType;
                mchtData._accountProxyName = mchtData.accountName;
            }

            this.mchtData = mchtData;
            
        }
    });

    //把之前的商户录入数据设置到表单中
    function doApplyMchtData (me) {
        var $el = me.$el;
        var data = me.mchtData;
        var ui = me.ui;
        var kind = data.mchtKind;
        //触发了dd的change事件,会切换显示隐藏某些组件
        ui.dd.find('.dropdown-toggle').dropdown('setValue', kind);

        // 支行省市区号赋值
        me.zbankRegionNo = data.zbankRegionCode;

        // 输入框的值可以直接设置
        $el.find(':input[name]').not('select').each(function () {
            var name = $(this).attr('name');

            if(name === 'accountNoPublic' && data.accountNo) {
                $(this).val(data.accountNo);
            }

            if(data[name]) {
                if($(this).is(':checkbox')) {
                    $(this).prop('checked', Opf.isBsTrue(data[name]));

                }else if($(this).is(':radio')) {
                    if($(this).val()==data[name]){
                        $(this).prop('checked', true);
                    }

                }else{
                    $(this).val(data[name]);
                    console.log(name, data[name]);
                }

                $(this).data('original', data[name]);
            }
        });


        var mchtAddressCodes = Opf.Util.parseRegionCode(data.areaNo);
        var zbankAddressCode = Opf.Util.parseRegionCode(data.zbankRegionCode);

        var map = {
            mchtProvince: mchtAddressCodes[0],
            mchtCity: mchtAddressCodes[1],
            mchtDist: mchtAddressCodes[2],

            zbankProvince: zbankAddressCode[0],
            zbankCity: zbankAddressCode[1],

            mccGroup: data.group, //MCC大类
            mcc: data.mcc, //MCC小类
            groupMcc: data.grpBudID, //经营范围大类
            businessMcc: data.businessId, //经营范围小类
            attr: data.attr,
            tNDiscId: data.tNDiscId,
            tZeroDiscId: data.tZeroDiscId,
            discCycle: data.discCycle,
            cardType: data.cardType
        };

        // 当支行区号是完整的区号时，才去给支行区下拉框赋值
        if(Opf.Util.isFullRegionCode(data.zbankRegionCode)){
            $.extend(map, {zbankRegionCode: zbankAddressCode[2]});
        }

        _.each(map, function (defVal, name) {
            ui[name] && ui[name].data('ajaxselect.value', defVal);
        });

        //TODO恶心 每次updateAccountNameUI时，如果不是委托的清算的普通商户
        //则生成选项时会根据上次的选中值，这里先生成选项然后选中
        //这样后续的改变在未手动选择账户名时都能保持默认值
        if(!Opf.isBsTrue(data.accountProxy)) {
            me.updateAccountNameUI();
            ui.selectAccountName.val(data.accountType);
        }

        ui.explorerName.data('default.datum', {
            name: data.explorerName,
            value: data.explorerId
        });

    }


    return InfoView;

});