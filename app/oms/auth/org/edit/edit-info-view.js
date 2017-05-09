define([
    'app/oms/auth/org/common/sub/info-view',
    'app/oms/mcht/add/sub/extra-image-appender'
], function (AbstractInfoView, ExtraImagerAppender) {

    var InfoView = AbstractInfoView.extend({
        constructor: function (data) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this.data = data;
            this.extraImagerAppender = ExtraImagerAppender;
        },
        setExtraParams: function (options) {
            this.rowData = options.rowData||{};
        },

        doSetupUI: function () {
            //这个是编辑机构设置应有的UI
            var me = this;
            var ui = me.ui;

            // zbankRegionCode
            // regionCode = regionCode ? Opf.Util.parseRegionCode(regionCode) : [];
            // regionCode[0],  regionCode[1], regionCode[2]

            CommonUI.address(ui.brhProvince, ui.brhCity, ui.brhRegionCode);
            CommonUI.address(ui.zbankProvince, ui.zbankCity, ui.zbankRegionCode);
            CommonUI.address(ui.pzbankProvince, ui.pzbankCity, ui.pzbankRegionCode);

            CommonUI.disc(ui.profitPlan, 'brh', null, {brhCode: me.rowData.code});

            me.setDatepicker(ui.cardEndDate);
            me.setDatepicker(ui.agencyEnd);
            
            me.typeheadZbankName();
            me.typeheadpZbankName();

            if(this.isOneBrh()){
                //1级机构被编辑时需要显示可用费率模型
                //ui.discInfo.show();

                //1级机构被编辑时设置为不参与分润
                ui.isJoinProfit.closest('[value="0"]').prop('checked', 'checked').trigger('change');
            }

            //编辑二级机构时显示分润方案
            me.isTwoBrh() && ui.profitInfo.show();

            //编辑二级及二级以下机构时显示对私账户
            me.gtTwoLevelOrg() && ui.paccountInfo.show();

            //绑定是否提供帐号信息事件
            ui.needAccount.on('change', function(){
                var $this = me.$el.find('[name="needAccount"]:checked');
                ui.accountInfo.toggle($this.val() == 1);
            });
        },

        updateUI: function () {
            var me = this;
            var ui = this.ui;
            var tmp = ui.accountName.val();
            ui.accountName.empty().append(me.genAccountTypeOptions4KindB2());
            if(tmp !== null) {
                ui.accountName.val(tmp);
            }

            //编辑二级及以下机构时显示对私账户
            var isGtTwoLevelOrg = me.gtTwoLevelOrg();
            if(isGtTwoLevelOrg){
                var name = $.trim(ui.name.val());
                ui.paccountName.val(name);
                ui.accountName.prop("disabled", true);
                ui.accountName.find("option[value='0']").prop("selected", true);
            }

            var canShow = me.canShowBankName();
            ui.privateAccount.toggle(!canShow);
            ui.publicAccount.toggle(canShow);
            ui.bankInfosGroup.toggle(canShow);

            //如果显示“是否参与分润”并且参与分润，则必须要填写帐号信息，
            //    否则放开选择填写账号信息
            //改变"是否提供帐号信息"时改UI
            var isJoinProfit = (me.$el.find('[name="isJoinProfit"]:checked').val() == 1);

            //如果参与分润，则需要上传扫描文件，否则不需要
            ui.profitPlan.closest('.form-horizontal').toggle(isJoinProfit);

            if(ui.profitInfo.is(':visible') && isJoinProfit){
                ui.needAccount.prop('disabled', true);
                ui.needAccount.closest('[value="1"]').prop('checked','checked');
            }else{
                ui.needAccount.prop('disabled', false);
            }
            ui.needAccount.trigger('change');
            //分销商有些特有的UI（例如："（选填）"）
            this.$el.find('.brh-type-toggle').toggle(this.isDist());
        },

        getAddBrhType: function(){
            return this.data.addBrhType;
        },

        onRender: function () {
            applyDefaultValue(this);

            //除了新增之外其他都应该没有管理员登录名的输入框
            this.$el.find('.sys-info').hide();

            AbstractInfoView.prototype.onRender.apply(this, arguments);

            // 如果是对公的账户，将bankName和bankNo的值设入select2中。
            var ui = this.ui;
            this.triggerEvents();
            this.applyExtraImages();
            this.adjustValidateRules();

            if( Opf.isBsFalse(this.data.accountType) ) {
                ui.bankInfos.data('select2') && ui.bankInfos.select2('data', {key: ui.bankNo.val(), value: ui.bankName.val()});
            }

            if( this.gtTwoLevelOrg() ) {
                ui.pbankInfos.data('select2') && ui.pbankInfos.select2('data', {key: ui.pbankNo.val(), value: ui.pbankName.val()});
            }

            if (this.data.contractFile) {
                this.uploadFile.loadFileUrl(this.data.contractFile);
            }

            this.accountTypeChanged = this.canShowBankName();
        },

        isOneBrh: function () {
            return this.rowData.level == 1;
        },

        isTwoBrh: function () {
            return this.rowData.level == 2;
        },

        //大于一级的机构
        gtTwoLevelOrg: function () {
            var level = this.rowData.level || -1;
            return level > 1;
        },

        triggerEvents: function () {
            var ui = this.ui;
            //如果是对公的账户则不需要trigger change.logo的事件，并且去掉对账号合法性验证。
            if( !Opf.isBsFalse(this.data.accountType) ) {
                ui.accountNo.triggerHandler('change.logo');
            }
        },

        adjustValidateRules: function () {
            var id = this.data.id;
            var ui = this.ui;

            // 机构的唯一性验证要加上id号作为额外参数传给后台
            var RULES_LIST = [
                {el: ui.brhName, rule: 'brhNameDuplicateCheck'},
                {el: ui.cardNo, rule: 'checkIdCardRepeat'},
                {el: ui.mobile, rule: 'checkMobileRepeat'},
                {el: ui.licNo, rule: 'brhlicNoDuplicateCheck'}
            ];

            _.each(RULES_LIST, function (item) {
                adjustItemValidRule(item, id);
            });
        },

        applyExtraImages: function () {
            var View = this.extraImagerAppender.ImageView;
            var $imgDom = this.$el.find('.imgs-preview'),imgView;
            if(this.data.images){//之前的机构录入是没有图片的，images有可能为空，在这里保护一下
                var extraImages = _.findWhere(this.data.images, {name:'extra'});
                var imgs = extraImages.value ? extraImages.value.split(',') : [];

                _.each(imgs, function(imgUrl) {
                    imgView = new View().render();
                    imgView.loadImage(imgUrl);
                    $imgDom.append(imgView.$el);
                });
            }
        }

    });


    //把之前的机构录入数据设置到表单中
    function applyDefaultValue (me) {
        var $el = me.$el;
        var data = me.data;
        var ui = me.ui;
        var canEditAccount = (data.addBrhType == 0 && data.isJoinProfit == 1);

        // 输入框的值可以直接设置
        $el.find(':input[name]').not('select').each(function () {
            var name = $(this).attr('name');

            if(name === 'accountNoPublic' && data.accountNo) {
                $(this).val(data.accountNo);
            }

            if (data[name]) {
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

        // if (data.brhTel) {
        //     var brhTels = data.brhTel.split('-');
        //     ui.brhTelPre.val(brhTels[0]);
        //     ui.brhTelAfter.val(brhTels[1]);
        // }
        if (data.availDiscModelTypes && data.availDiscModelTypes.length > 0) {
            _.each(data.availDiscModelTypes, function(discType){
                $el.find('input[name="'+ discType +'"]').prop('checked', true);
            });
        }

        var map = {};

        if (data.brhRegionCode) {
            var orgAddressCodes = Opf.Util.parseRegionCode(data.brhRegionCode);
            map = {
                brhProvince: orgAddressCodes[0],
                brhCity: orgAddressCodes[1],
                brhRegionCode: orgAddressCodes[2]
            };
        }

        if(data.zbankRegionCode) {

            var zbankAddressCode = Opf.Util.parseRegionCode(data.zbankRegionCode);

            $.extend(map, {
                zbankProvince: zbankAddressCode[0],
                zbankCity: zbankAddressCode[1],
                zbankRegionCode: zbankAddressCode[2]
            });
        }

        if(data.pzbankRegionCode) {

            var pzbankAddressCode = Opf.Util.parseRegionCode(data.pzbankRegionCode);

            $.extend(map, {
                pzbankProvince: pzbankAddressCode[0],
                pzbankCity: pzbankAddressCode[1],
                pzbankRegionCode: pzbankAddressCode[2]
            });
        }

        $.extend(map, { profitPlan: data.profitPlan });

        _.each(map, function (defVal, name) {
            ui[name] && ui[name].length && ui[name].data('ajaxselect.value', defVal);
        });

        me.updateUI();
        var accountType = data.accountType;
        var $accountName = $el.find('select[name="accountName"]');
        if(accountType && $accountName.length) {
            $accountName.val(accountType);
        }

        //如果回来的数据中有账户的信息，则为提供账户信息，否则为不提供帐户信息
        if(hasAccountInfo(data)){
            $el.find('[name="needAccount"][value="1"]').prop('checked','checked');
        }else{
            $el.find('[name="needAccount"][value="0"]').prop('checked','checked');
        }

        $el.find('[name="needAccount"]').trigger('change');

    }

    function hasAccountInfo (data) {
        var accountError = false;
        var accountList = ['accountName','accountNo','zbankRegionCode','zbankName'];
        _.each(accountList, function (item) {
            if(data[item]){
                accountError = true;
            }
        });

        return accountError;
    }

    function adjustItemValidRule (options, id) {
        var $el = $(options.el);
        var addRuleConfig = {};

        addRuleConfig[options.rule] = {ignore: [$el.data('original')]};
        $el.rules("add", addRuleConfig);
        $el.data('id', id);
    }


    return InfoView;

});