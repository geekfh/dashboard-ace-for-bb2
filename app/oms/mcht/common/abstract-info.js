define([
    'App',
    'tpl!app/oms/mcht/common/templates/info.tpl',
    'i18n!app/oms/common/nls/mcht',
    'assets/scripts/fwk/factory/typeahead.factory',
    'app/oms/wkb/task/revise/debug-checker',
    'app/oms/mcht/add/validate-utils',
    'app/oms/common/moduleUI',
    'jquery.validate',
    'common-ui',
    'select2',
    'jquery.autosize'
], function(App, tpl, mcmgrLang, typeaheadFactory, debuger, MchtValidUtils, ModuleUI) {

    var typeaheadTplFn = _.template([
        '<div style="padding: 0 15px; height: 30px; line-height: 30px">',
        '<%= content %>',
        '</div>'
    ].join(''));

    var MAX_TYPEAHEAD_LENGTH = 20;

    var InfoView = Marionette.ItemView.extend({
        template: tpl,
        ui: {
            form: 'form:first',

            explorerId: '[name=explorerId]',
            explorerName: '[name=explorerName]',
            dd: '.dropdown-switch',
            ddToggle           : '.dropdown-toggle',
            remark             : 'textarea[name="remark"]',

            //经营信息
            mchtName           : 'input[name="mchtName"]',
            groupMcc           : '[name=grpBudID]',  //新的经营分类大类
            businessMcc        : '[name=businessId]',//新的经营分类子类
            mccGroup           : '[name=group]',
            mcc                : '[name=mcc]',
            mchtProvince       : '[name="province"]',
            mchtCity           : '[name="city"]',
            mchtDist           : '[name="areaNo"]',
            attr               : '[name="attr"]',
            licNo              : '[name="licNo"]',

            //清算
            discCycle           : '[name="discCycle"]',
            tNDiscId           : '[name="tNDiscId"]',
            tZeroDiscId        : '[name="tZeroDiscId"]',

            //户主信息
            userName           : 'input[name="userName"]',
            cardType           : '[name="userCardType"]',
            userPhone          : '[name="userPhone"]',
            userCardNo         : '[name="userCardNo"]',
            userEmail         : '[name="userEmail"]',

            //法人信息隐藏
            aluserName           : '[name="alone_userName"]',
            aluserPhone          : '[name="alone_userPhone"]',
            aluserCardNo         : '[name="alone_userCardNo"]',
            aluserEmail          : '[name="alone_userEmail"]',

            accountProxyType: '.account-proxy-type',
            accountProxy           : '[name="accountProxy"]',
            delegateFieldset   : '.delegate-fieldset',
            notDelegateFieldset: '.not-delegate-fieldset',
            accountTypeRadios  : '[name="_accountProxyType"]',
            accountProxyName  : '[name="_accountProxyName"]',

            //银行帐号信息
            bankName: '[name="bankName"]',
            bankNo: '[name="bankNo"]',

            accountProvince    : '[name="_province"]',//支行省
            accountCity        : '[name="_city"]',//支行市
            zbankRegion        : '[name="zbankRegionCode"]',//支行区

            zbankProvince: '[name="zbankProvince"]',
            zbankCity: '[name="zbankCity"]',
            zbankRegionCode: '[name="zbankRegionCode"]',

            displayAccountName : '.display-account-name',
            accountNo          : '[name="accountNo"]',
            accountNoPublic    : '[name="accountNoPublic"]',
            zbankName          : '[name="zbankName"]',
            zbankNo            : '[name="zbankNo"]',//隐藏字段

            selectAccountName  : 'select[name="accountName"]',

            bankLogoPlace : '.bank-logo-place',
            bankInfos     : '[name="bankInfos"]',
            bankInfosGroup: '.bank-infos-group',

            privateAccount : '.account-private',
            publicAccount  : '.account-public',
            certFlag : '[name="certFlag"]',//证照属性

            /**
             * 集团商户 块
             **/
            groupInfo: '.group_info', //集团商户 块
            //divUserLogin: '[name="user_login"]',
            //userSuffix: '[name="user_suffix"]',
            brandSuffix: '[name="brand_suffix"]',
            divAloneUser: '[name="div_aloneUser"]',
            divDiscThis: '[name="div_discThis"]',
            //userLoginSuffix: '[name="userLogin_suffix"]',
            accountSection: '.account-section',
            /**
             * 集团商户字段
             **/
            mchtKind:  '[name="mchtKind"]',//商户级别
            //kindSuffix: '[name="kindSuffix"]',//账号后缀
            aloneUser: '[name="aloneUser"]',
            discThis: '[name="discThis"]',
            //userLogin: '[name="userLogin"]',
            brandKindSuffix: '#brand_kindSuffix',
            //userKindSuffix: '#user_kindSuffix',
            warnAloneUser: '#warn_aloneUser'
        },
        events:{
            'change [name="certFlag"]': 'onCertFlagHandle',
            'change select[name="mchtKind"]': 'onMchtKindChangeHandle',
            //'change [name="kindSuffix"]': 'onKindSuffixChangeHandle',
            //'change #brand_kindSuffix': 'onBrandKindSuffixChangeHandle',现在不用了
            'change [name="aloneUser"]': 'onAloneUserChangeHandle',
            //'change #user_kindSuffix': 'onUserKindSuffixChangeHandle',
            'change [name="discThis"]': 'onDiscThisChangeHandle'
        },
        onDiscThisChangeHandle: function(){
            var me = this.ui.discThis.is(':checked');
            if(me){
                _.each(this.ui.accountSection.find("input[name]"), function(v, i){
                    if(v.name != 'discThis'){
                        $(v).attr('disabled', 'disabled');
                    }
                });
                _.each(this.ui.accountSection.find("select[name]"), function(v, i){
                    $(v).attr('disabled', 'disabled');
                });
                _.each(this.ui.accountSection.find("textarea[name]"), function(v, i){
                    $(v).attr('disabled', 'disabled');
                });
                this.updateAccountNameUI();
            }
            else{
                _.each(this.ui.accountSection.find("input[name]"), function(v, i){
                    if(v.name != 'discThis'){
                        $(v).removeAttr('disabled', 'disabled');
                    }
                });
                _.each(this.ui.accountSection.find("select[name]"), function(v, i){
                    $(v).removeAttr('disabled', 'disabled');
                });
                _.each(this.ui.accountSection.find("textarea[name]"), function(v, i){
                    $(v).removeAttr('disabled', 'disabled');
                });
            }
        },
        onUserKindSuffixChangeHandle: function(el){//因为有两个kindSuffix
            var me = $(el.currentTarget).val();
            this.ui.kindSuffix.val(me);
        },

        //addKindSuffixSelect: function(select){
        //    var $select = $(select);
        //    $select.select2({
        //        placeholder: '--请选择--',
        //        minimumInputLength: 1,
        //        ajax: {
        //            type: 'GET',
        //            url: 'api/mcht/merchants/get-brandSuffix',
        //            data: function (term) {
        //                return {
        //                    kindSuffix: encodeURIComponent(term)
        //                };
        //            },
        //            results: function (data, page) {
        //                return {
        //                    results: data
        //                };
        //            }
        //        },
        //        id: function (e) {
        //            return e.name;
        //        },
        //        formatResult: function(data, container, query, escapeMarkup){
        //            return data.value;
        //        },
        //        formatSelection: function(data, container, escapeMarkup){
        //            return data.value;
        //        }
        //    });
        //},

        onAloneUserChangeHandle: function(){
            var me = this.ui.aloneUser.is(':checked');
            if(me){
                this.ui.userName.attr('disabled', 'disabled');
                this.ui.userPhone.attr('disabled', 'disabled');
                this.ui.userCardNo.attr('disabled', 'disabled');
                this.ui.userEmail.attr('disabled', 'disabled');
                //this.loadUserNameContent();
                //this.refreshBankInfos();
                //this.updateAccountNameUI();
            }
            else{
                this.ui.userName.removeAttr('disabled', 'disabled');
                this.ui.userPhone.removeAttr('disabled', 'disabled');
                this.ui.userCardNo.removeAttr('disabled', 'disabled');
                this.ui.userEmail.removeAttr('disabled', 'disabled');
            }
            //this.onBrandKindSuffixChangeHandle(this.ui.brandKindSuffix.val());
        },
        onBrandKindSuffixChangeHandle: function(el){
            var me = this;
            //搜索法人信息
            Opf.ajax({
                async: false,
                type: 'GET',
                url: 'api/mcht/merchants/brandSuffix-aloneUser',
                data: {kindSuffix: el},
                success: function (resp) {
                    me.ui.aluserName.val(resp.userName == null ? '' : resp.userName);
                    me.ui.aluserPhone.val(resp.userPhone == null ? '' : resp.userPhone);
                    me.ui.aluserCardNo.val(resp.userCardNo == null ? '' : resp.userCardNo);
                    me.ui.aluserEmail.val(resp.userEmail == null ? '' : resp.userEmail);
                }
            });
        },
        loadUserNameContent: function(){
            var me = this;
            me.ui.userName.val(me.ui.aluserName.val());
            me.ui.userPhone.val(me.ui.aluserPhone.val());
            me.ui.userCardNo.val(me.ui.aluserCardNo.val());
            me.ui.userEmail.val(me.ui.aluserEmail.val());
        },
        onKindSuffixChangeHandle: function(el){
            this.ui.userLoginSuffix.html('@'+$(el.currentTarget).val());
        },
        onMchtKindChangeHandle: function(el){
            //C1是总店，C2是门店
            var me = null;
            if(typeof el === 'object'){
                me = $(el.currentTarget).val();
            }
            else{
                me = el;
            }
            if(me == 'C2'){
                //this.ui.userSuffix.hide();
                this.ui.brandSuffix.show();
                //this.ui.divUserLogin.show();
                this.ui.divAloneUser.show();
                this.ui.divDiscThis.show();
            }
            else if(me == 'C1'){
                //this.ui.userSuffix.show();
                this.ui.brandSuffix.hide();
                //this.ui.divUserLogin.hide();
                this.ui.divAloneUser.hide();
                this.ui.divDiscThis.hide();
            }
            else{
                //this.ui.userSuffix.hide();
                this.ui.brandSuffix.hide();
                //this.ui.divUserLogin.hide();
                this.ui.divAloneUser.hide();
                this.ui.divDiscThis.hide();
            }
            this.ui.mchtKind.val(me);
        },

        onCertFlagHandle: function(){
            var me = this;
            var cflag = me.$el.find('[name="certFlag"]').val();
            if(cflag == 2){
                me.$el.find('[name="div_licNo"]').css('display','block');
                me.$el.find('[name="div_orgCode"]').css('display','none');
                me.$el.find('[name="div_taxNo"]').css('display','none');
            }
            else{
                me.$el.find('[name="div_licNo"]').css('display','block');
                me.$el.find('[name="div_orgCode"]').css('display','block');
                me.$el.find('[name="div_taxNo"]').css('display','block');
            }
        },

        constructor: function (data) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.data = data;
            this.zbankRegionNo = null;
        },

        validate: function() {
            if(this.$el.find('.has-revise-error:visible').length) {
                return false;
            }
            return this.ui.form.valid();
        },

        onRender: function() {
            var me = this;

            this.accountTypeChanged = null;

            me.attachEvents();
            me.attachValidation();

            doSetupUI(this);

            if(this.autoSwitchUI !== false) {
                // var curType = me.ui.ddToggle.attr('ref');
                //根据当前商户类型切换显示/隐藏某些字段
                me.toggleUIByKind();
            }
            me.addSelect2(this.ui.bankInfos);
            //me.addKindSuffixSelect(this.ui.brandKindSuffix);
            //三证合一 判断
            if(me.data.certFlag == 2){//一证一码
                me.$el.find('[name="div_licNo"]').show();
                me.$el.find('[name="div_orgCode"]').hide();
                me.$el.find('[name="div_taxNo"]').hide();
            }
            else{
                me.$el.find('[name="div_licNo"]').show();
                me.$el.find('[name="div_orgCode"]').show();
                me.$el.find('[name="div_taxNo"]').show();
            }

            this.onAloneUserChangeHandle();
        },

        addSelect2: function(select) {
            var me = this, ui = me.ui,
                $select = $(select);

            $select.select2({
                placeholder: '请选择开户行',
                minimumInputLength: 1,
                ajax: {
                    type: "get",
                    url: url._('bank.info'),
                    dataType: 'json',
                    data: function (term, page) {
                        return {
                            value: encodeURIComponent(term)
                        };
                    },
                    results: function (data, page) {
                        return {
                            results: data
                        };
                    }
                },

                id: function (e) {
                    return e.key;
                },
                formatResult: function(data, container, query, escapeMarkup){
                    return data.value;
                },
                formatSelection: function(data, container, escapeMarkup){
                    return data.value;
                }
            });

            $select.change(function(){
                var $form = ui.form; //$(this).closest('form');
                $form.validate && $form.validate().element($(this));
            });

        },
        attachEvents: function () {
            var me = this;
            var ui = me.ui;
            var firstGroupMCC = !_.isEmpty(me.data.group || me.data.mcc);

            //新增和修改页面，显示普通商户和个人商户，显示可点击，其他类型不可修改，不可点击。
            if(ui.dd.find('button').attr('ref') == 'B1' || ui.dd.find('button').attr('ref') == 'B2'){
                ui.dd.find('button').removeAttr('disabled').css('background-color', '#ffffff').css('cursor', 'pointer');
            }
            else{
                ui.dd.find('button').attr('disabled', 'disabled').css('background-color', '#eeeeee').css('cursor', 'not-allowed');
            }

            ui.dd.on('changed.bs.dropdown', function(e, newVal) {
                me.toggleUIByKind();
                me.refreshBankInfos();
                me.updateValidateRules(newVal);

                //切换普通和个体商户
                var certFlag_val = me.$el.find('[name="certFlag"]').val();

                //三证合一 判断
                if(certFlag_val == 2){//一证一码
                    me.$el.find('[name="div_licNo"]').show();
                    me.$el.find('[name="div_orgCode"]').hide();
                    me.$el.find('[name="div_taxNo"]').hide();
                }
                else{
                    me.$el.find('[name="div_licNo"]').show();
                    me.$el.find('[name="div_orgCode"]').show();
                    me.$el.find('[name="div_taxNo"]').show();
                }
            });

            ui.mchtName.change(function () {
                me.updateAccountNameUI();
                me.refreshBankInfos();
            });

            ui.userName.change(function () {
                me.updateAccountNameUI();
                me.refreshBankInfos();
            });

            ui.zbankProvince.change(function () {
                // 当支行省改变时，延时触发: 如果城市有值，将支行输入框置为可用，否则不可用
                _.defer(function () {
                    var canZbankName = ui.zbankCity.val() ? true : false;

                    me.enabledZbankName(canZbankName);
                });
            });

            ui.zbankCity.change(function () {
                // 当支行市改变时，如果有选中值，将支行输入框置为可用，否则不可用
                var canZbankName = $(this).val() ? true : false;

                me.enabledZbankName(canZbankName);
                me.zbankRegionNo = $(this).val();
            });

            ui.zbankRegion.change(function(){
                me.clearZbank();
                me.zbankRegionNo = $(this).val();
            });


            ui.accountNo.on('change', function (e) {
                me.clearZbank();
                var disabledZbank = ui.zbankCity.val() ? false : true;
                ui.zbankName.prop('disabled', disabledZbank);
            });

            ui.accountNo.on('change.logo', function (e) {
                me.onAccountCardNoChange();
            });


            //触发dom的显示隐藏
            ui.accountProxy.on('change.elementDisplay', function () {
                me.onDelegateChange();
            });

            //触发dom相关值的清空
            ui.accountProxy.on('change.elementValueRefresh', function () {
                //TODO
                me.refreshBankInfos();

            });

            //委托他人清算radio改变,，将账号清空，及银行logo清空。
            ui.accountTypeRadios.change(function () {
                me.updateAccountNameUI();
                me.refreshBankInfos();
            });

            //普通商户选择下拉框改变，将账号清空，及银行logo清空。
            ui.selectAccountName.change(function () {
                me.updateAccountNameUI();
                me.refreshBankInfos();
            });

            //开户行的select2输入框改变的时候，将开户行的名称及开户行号的值取出放入ui.bankName和ui.bankNo中。
            ui.bankInfos.on('change', function() {
                me.clearZbank();
            });

            ui.bankInfos.on('change.refreshzbank', function() {
                var infoData = ui.bankInfos.select2('data');

                ui.bankName.val(infoData ? infoData.value : '');
                ui.bankNo.val(infoData ? infoData.key : '');
            });

            me.$el.find('[name="category"]').on('change.resetDisc', function () {
                me.refetchDisc();
            });

            ui.mccGroup.on('change.refreshdisc', function () {
                me.refetchDisc();
            });

            ui.mccGroup.on('change.enable', function () {
                ui.tNDiscId.attr('disabled', false);
            });

            ui.businessMcc.on('change.mcc', function(){
                if(firstGroupMCC){
                    firstGroupMCC = false;
                } else {
                    _.defer(function(){
                        var mccCode = ui.businessMcc.attr("data-mcc");
                        if(!_.isEmpty(mccCode)) {
                            Opf.ajax({
                                url: url._('options.mccCode', {mccCode:mccCode}),
                                type: 'GET',
                                success: function(resp){
                                    if(!!resp){
                                        ui.mcc.data('ajaxselect.obj', {id: resp.mccValue, text: resp.mccName});
                                        ui.mccGroup.val(resp.grpValue).trigger('change');

                                        //ui.mccGroup.trigger('change.refreshdisc');
                                        //ui.mcc.select2('data', {id: resp.mccValue, text: resp.mccName});
                                        //$(ui.mccGroup).empty().append(
                                        //    $('<option selected="selected"></option>')
                                        //        .val(resp.grpValue)
                                        //        .text(resp.grpName)
                                        //).trigger('change.refreshdisc');
                                    }
                                }
                            });
                        }
                    })
                }
            });

            ui.tNDiscId.on('change.validate', function () {
                ui.tNDiscId.trigger('keyup');
            });

            ui.userCardNo.on('input.uppercaseXTail', function () {
                var value = $.trim($(this).val());
                if(value && value.substring(value.length-1) === 'x') {
                    $(this).val(value.toUpperCase());
                }
            });

            //if(ui.userLogin.val().indexOf('@') > 0){
            //    var str = ui.userLogin.val();
            //    var str_index = str.indexOf('@');
            //    var houzhui = str.substr(str_index, str.length);
            //    var str_name = str.substr(0, str_index);
            //    ui.userLoginSuffix.html(houzhui);
            //    ui.userLogin.val(str_name);
            //}

        },
        updateValidateRules: function (newVal) {
            var ui = this.ui, validator = ui.form.validate(),
                deferValidateRules = ['attr', 'licNo'],
                //ignoreTypes = ["C1", "C2", "D1"],
                accountGroup = ui.selectAccountName.closest('.form-group');

            // 由于从普通商户切换到个体商户的时候经济类型和营业执照号是允许不填写的，
            // 但是jQuery.validate的合法性验证里面还是会出现不合法的提示
            _.each(deferValidateRules, function (item) {
                ui[item].closest('.form-group').removeClass('has-error');
                validator.element(ui[item]);
            });

            accountGroup.removeClass('has-error');
            accountGroup.find('.help-error').remove();
        },
        refetchDisc: function () {
            this.ui.tNDiscId.select2('val', null);
            this.mchtDiscSelectTwo && this.mchtDiscSelectTwo.fetch();
        },

        onDelegateChange: function () {
            var isCheck = this.ui.accountProxy.prop('checked');
            this.ui.delegateFieldset.toggle(isCheck);
            this.ui.notDelegateFieldset.toggle(!isCheck);

            this.updateAccountNameUI();
        },

        onAccountCardNoChange: function (e) {
            var me = this;
            var $this = me.ui.accountNo;
            var theBankCardNo = $this.val();
            var ui = me.ui;

            ui.bankName.val('');
            ui.bankNo.val('');
            ui.bankLogoPlace.empty();

            //如果是二维码商户，则营业执照不必填，注意添加验证，是修改值之后的，要focus再重新验证，得到更新后的bankCode做卡号验证
            var mKind = me.mchtData ? me.mchtData.mchtKind : ui.dd.find('button').attr('ref');
            if(mKind == 'D1'){
                ui.licNo.rules("remove", "required");
                //撤销18家银行校验规则
                ui.accountNo.rules("remove", "isEighteenBank");
                //添加18家银行校验规则
                ui.accountNo.rules( "add", {
                    isEighteenBank: {
                        mchtKind: mKind
                    }
                });
            }

            var isDebitCard = ui.form.validate().element($this.get(0));
            if (isDebitCard) {
                Opf.ajax({
                    autoMsg: false,
                    type: 'GET',
                    async: false,
                    url: url._('bankcode', {
                        bankCardNo: theBankCardNo
                    }),
                    success: function(data) {
                        if (data.success !== false) {
                            ui.bankLogoPlace.empty().append(CommonUI.template('bank.logo.name', data));
                            ui.bankNo.val(data.value);
                            ui.bankName.val(data.name);
                        }
                    }
                });
            }
        },

        clearZbank: function () {
            this.zbankCommonUI.reset();
        },

        attachValidation: function () {
            MchtValidUtils.addRules4Info(this.ui.form); //this.$el.find('form:first')
        },

        toggleUIByKind: function() {
            var that = this,
                ui = that.ui,
                kind = that.getKind();

            var validOpr =
                kind === 'B2' ||
                kind === 'C2' ||
                kind === 'D1' ||
                kind === 'E1' ||
                kind === 'C1' ? 'add' : 'remove';

            /*(
                // 如果普通商户有租赁协议
                // 则营业执照号和营业照片选填
                kind === 'B2'
                //&& _.isEmpty((_.findWhere(Opf.get(this.data, 'images'), {name: "rentAgreement"})||{}).value)
            )*/

            this.$el.find('.form-group').each(function() {
                var $this = $(this);
                // var needShow = belong && belong.indexOf('' + val) !== -1;

                //var belong = $(this).attr('belong') ? true : false;
                /*var belong = true;
                if($(this).attr('belong').indexOf(kind) >= 0){
                    belong = true;
                }
                else{
                    belong = false;
                }*/

                $this.toggle($(this).attr('belong').indexOf(kind)!==-1);
            });

            //普通商户就要让他选对公还是对私
            //二维码商户走普通商户流程
            ui.selectAccountName.toggle(
                kind === 'B2' ||
                kind === 'D1' ||
                kind === 'E1' ||
                kind === 'C1' ||
                kind === 'C2'
            );

            //个体商户只显示用户帐号名
            ui.displayAccountName.toggle(kind === 'B1');

            // 只有普通户才显示委托他人清算
            ui.accountProxyType.toggle(
                kind === 'B2' ||
                kind === 'D1' ||
                kind === 'E1' ||
                kind === 'C1' ||
                kind === 'C2'
            );

            if (kind === 'B1') {
                ui.accountProxy.prop('checked', false);
                this.onDelegateChange();
                // ui.accountProxy.trigger('change');
            }

            ui.licNo.rules(kind == "B2" || kind == "C1" || kind == "C2" || kind == "D1" ? "remove" : validOpr, 'required');
            ui.attr.rules(validOpr, 'required');

            this.updateAccountNameUI();
        },

        getKind: function () {
            return this.ui.ddToggle.attr('ref');
        },

        /**
         * @return {Array} [账户类型，开户名]
         */
        getAccountInfo: function () {
            var ui = this.ui;
            var kind;
            var name, type;

            if(ui.accountProxy.prop('checked')) {
                name = ui.accountProxyName.val();
                type = ui.accountTypeRadios.filter(':checked').val();
            }else {
                kind = this.getKind();

                if(kind === 'B1') {
                    name = this.ui.userName.val();
                    type = 1;

                } else if(
                    kind === 'B2' ||
                    kind === 'D1' ||
                    kind === 'E1' ||
                    kind === 'C1' ||
                    kind === 'C2'
                ){
                    type = this.ui.selectAccountName.val();
                    name = type =='0' ? this.ui.mchtName.val() : this.ui.userName.val();
                }
            }

            return [String(type), $.trim(name)];
        },

        genAccountTypeOptions4KindB2: function () {
            var mchtName = $.trim(this.ui.mchtName.val());
            var userName = $.trim(this.ui.userName.val());
            // var tpl = '<option disabled="disabled " style="display:none;" selected="selected" class="placeholder">- 选择开户名 -</option>';
            var tpl = '<option disabled="disabled " selected="selected" class="placeholder">- 选择开户名 -</option>';
            if(mchtName) {
                tpl += '<option value="0">' + mchtName+' （对公）' + '</option>';
            }
            if(userName) {
                tpl += '<option value="1">' + userName+' （对私）' + '</option>';
            }
            return tpl;
        },

        updateAccountNameUI: function () {
            var kind = this.getKind();

            //如果选中委托其他收款账户，则账户名为输入框
            if(this.ui.accountProxy.prop('checked')) {

            } else {
                if(kind === 'B1') {
                    this.ui.displayAccountName.text($.trim(this.ui.userName.val()));

                } else if(
                    kind === 'B2' ||
                    kind === 'D1' ||
                    kind === 'E1' ||
                    kind === 'C1' ||
                    kind === 'C2'
                ){
                    var tmp = this.ui.selectAccountName.val();
                    this.ui.selectAccountName.empty().append(this.genAccountTypeOptions4KindB2());
                    if(tmp !== null) {// && this.ui.discThis.is(':checked') == false//是否清算给上级没有勾选则不赋值给accountName控件
                        this.ui.selectAccountName.val(tmp);
                    }
                }
            }

            var canShow = this.canShowBankName();
            this.ui.privateAccount.toggle(!canShow);
            this.ui.publicAccount.toggle(canShow);
            this.ui.bankInfosGroup.toggle(canShow);

        },

        refreshBankInfos: function() {
            console.log('show bank name is ', this.canShowBankName());

            var ui = this.ui;

            var accountNo = this.ui.accountNo,
                bankInfos = this.ui.bankInfos;

            var canShow = this.canShowBankName();

            //显示或者隐藏开户行的输入
            if(canShow) {
                //在对公的情况下 将开户行的select2的值设入bankNo和bankName中
                bankInfos.data('select2') && bankInfos.triggerHandler('change.refreshzbank');

            } else {
                //在对私的情况下 触发'change.logo'事件。
                accountNo.triggerHandler('change.logo');
            }

            //这个判断是否清空支行的地址，当状态由对公切换为对私或者由对私切换为对公的时候就会清支行的信息。
            this.accountTypeChanged === canShow || this.clearZbank();

            this.accountTypeChanged = canShow;
        },

        //判断是否需要显示开户行,对公则显示，对私则不显示
        canShowBankName: function() {
            var ui =this.ui;

            if (ui.accountProxy.is(':checked')) {
                return ui.accountTypeRadios.filter(':checked').val() === '0';
            }
            else {
                return (this.getKind() === 'B2' && ui.selectAccountName.find('option:selected').val() === '0') ||
                    this.getKind() === 'C1' && ui.selectAccountName.find('option:selected').val() === '0' ||
                    this.getKind() === 'C2' && ui.selectAccountName.find('option:selected').val() === '0';
            }
        },

        getMccGroupValue: function () {
            return this.ui.mccGroup.val() || this.data.group;
        },

        //获取直联还是间联复选值
        getDiscCategoryValue: function () {
            //return this.$('[name="category"]:checked').val();
            return "indirect"; //因为当原始数据为direct时，在info-view.js里设置默认值会把 name="category" 的direct设置为选中。这样在common-ui里生成curOptions列表数据时就取的是options4Indirect数组里的数据
                                //然而，用原始数据data里的相应字段的value来匹配options4Direct项再次设置select2选中选项时，匹配到的数据是indirect的
                                //所以再用indirect对应的 options4Indirect来显示列表数据时就是空的，因为列表数据被存到了 options4Indirect 里
                                //解决方案：这里直接返回 indirect，这样第一次设置列表数据时就会直接设置到间联列表里了。
                                        //或者也可以更改common-ui.js里curOptions字段的获取方式。
        },

        getBrhCode: function () {
            return this.data.brhCode;
        },

        getValues: function () {
            var me = this;
            var ui = me.ui;
            var accountInfo = me.getAccountInfo();
            var selTxtFn = Opf.Util.getSelectedOptionText;

            var obj = {
                accountType: accountInfo[0],
                accountName: accountInfo[1],
                userCardType: 1,

                _attrDescr           : ui.attr.val() !== null ? selTxtFn(ui.attr) : '',
                _cardTypeDescr       : selTxtFn(ui.cardType),
                _mchtDiscIdDescr     : selTxtFn(ui.tNDiscId),
                _mchtDiscIdZeroDescr : selTxtFn(ui.tZeroDiscId),
                _discCycleDesc       : selTxtFn(ui.discCycle),
                _mccGroupDescr       : selTxtFn(ui.mccGroup),
                _mccDescr            : selTxtFn(ui.mcc),

                //集团商户
                mchtKind             : this.getKind(),
                //userLogin            : ui.userLogin.val(),
                //kindSuffix           : ui.kindSuffix.val(),
                discThis             : ui.discThis.is(':checked') == true ? 0 : 1,
                aloneUser            : ui.aloneUser.is(':checked') == true ? 0 : 1
            };

            if(parseInt(obj.accountType) === 1) {
                obj.accountNo = ui.accountNo.val();
            } else {
                obj.accountNo = ui.accountNoPublic.val();
            }

            this.$el.find(':input[data-set]:visible').each(function() {
                var fieldName = $(this).attr('name');
                var $this = $(this);
                var theVal = null;

                if(fieldName != 'discThis' && $this.is(':checkbox')) {
                    theVal = $(this).prop('checked') ? 1 : 0;
                } else if($this.is(':radio')){
                    if($this.prop('checked')) {
                        theVal = $this.val();
                    }
                } else {
                    if(fieldName == 'discThis' && $this.is(':checkbox')){
                        //theVal = $(this).prop('checked') ? 0 : 1;
                        theVal = me.data.discThis
                    }
                    else{
                        theVal = $this.val();
                    }
                }

                if (theVal !== null) {
                    obj[fieldName] = theVal;
                }
            });

            // 支行区号的值是 zbankRegionNo
            obj.zbankRegionCode = this.zbankRegionNo;

            // 经营范围只传二级分类的businessId和mcc
            obj.businessId = ui.businessMcc.val();
            //obj.mcc = ui.businessMcc.attr("data-mcc");
            obj.mcc = ui.mcc.val();

            //>>>DEBUG
            debuger.checkInfo(obj);
            //<<<DEBUG

            return obj;
        },
        enabledZbankName: function (toBeEnable) {
            this.ui.zbankName.prop('disabled', toBeEnable === false ? true: false);
        }
    });

    //把之前的商户录入数据设置到表单中
    function doSetupUI (me) {
        var $el = me.$el;
        var ui = me.ui;

        setTimeout(function(){
            ui.remark.autosize();
        },10);

        //describe: .mchtType-group，disabled控件是不能继续提交
        if(me.mchtData && me.mchtData.mchtType == 1){
            me.$el.find('.mchtType-group').css('display', 'block');
        }
        else{
            me.$el.find('.mchtType-group').css('display', 'none');
        }

        CommonUI.address(ui.mchtProvince, ui.mchtCity, ui.mchtDist);
        CommonUI.address(ui.zbankProvince, ui.zbankCity, ui.zbankRegionCode);
        CommonUI.mccSection(ui.mccGroup, ui.mcc);
        CommonUI.nature(ui.attr);
        ModuleUI.mccSection(ui.groupMcc, ui.businessMcc); //, me.data.grpBudID, me.data.businessId
        // CommonUI.disc(ui.tNDiscId, 'mcht', null, {
        //     ajax: {
        //         data: function () { 
        //             return {type: 'mcht', brhCode: me.data.brhCode};
        //         }
        //     }
        // });
        me.mchtDiscSelectTwo = CommonUI.mchtDiscSelectTwo(ui.tNDiscId, {
            //机构号用于编辑时，表示录入员所在机构
            brhCode: function () { return me.getBrhCode();},
            mccGroup: function () { return me.getMccGroupValue();},
            category: function () { return me.getDiscCategoryValue();},
            onSetDefaultValue: function (obj) {
                me.$el.find('[name="category"]')
                    .filter('[value="' + obj.category + '"]').prop('checked', true);
            }
        });

        CommonUI.disc(ui.tZeroDiscId, 'mcht', null, {placeholder:false});
        CommonUI.discCycle(ui.discCycle);

        //三证合一
        $(ui.certFlag).find('option[value='+me.data.certFlag+']').attr('selected', true);

        //集团商户
        $(ui.mchtKind).find('option[value='+me.data.mchtKind+']').attr('selected', true);

        //非独立法人
        if(me.data.aloneUser == '0'){
            $(ui.aloneUser).attr("checked","checked");
        }
        else{
            $(ui.aloneUser).removeAttr("checked","checked");
        }

        //清算给上级商户
        if(me.data.discThis == '0'){
            $(ui.discThis).attr("checked","checked");
            me.onDiscThisChangeHandle();
        }
        else{
            $(ui.discThis).removeAttr("checked","checked");
        }

        typeheadZbankName(me);
        typeheadExpand(me);

        me.enabledZbankName(false);

        $el.find('label[name="zbankNo_noHidden"]').html(me.ui.zbankNo.val());//开户支行号
    }

    function typeheadExpand(me) {
        var options = {
            onReset: function() {
                me.ui.explorerId.val('');
            },
            events: {
                'typeahead:selected': function(e, datum) {
                    me.ui.explorerId.val(datum.value);
                    me.ui.explorerName.removeClass('has-revise-error');
                }
            },
            model: {
                remote: {
                    replace: function(xurl, query) {
                        var brhCode = me.data.brhCode ? me.data.brhCode : '';
                        return url._('options.explorers', {
                                kw: encodeURIComponent(encodeURIComponent(query))
                            })+'?brhCode='+brhCode;
                    }
                }
            }
        };
        var user;

        if (me.needInitExploreNameByCtx !== false) {
            user = Ctx.getUser();
            options.defaultDatum = user.isExplorer() ? {
                name: user.get('name'),
                value: user.get('id')
            } : null;
        }

        var obj = CommonUI.explorerName(me.ui.explorerName, options);
    }


    function typeheadZbankName(me) {
        var zbankTypehead;
        var ui = me.ui;
        var $el = ui.zbankName;

        function replaceUrl(url, query) {
            return url + '?' + $.param({
                    kw: encodeURIComponent($el.val()),
                    regionCode: me.zbankRegionNo,
                    bankCode: ui.bankNo.val(),
                    maxLength: MAX_TYPEAHEAD_LENGTH
                });
        }

        var zbankCommonUI = me.zbankCommonUI = CommonUI.zbankName($el, {
            // model: {
            //     remote: {
            //         replace: replaceUrl
            //     }
            // },
            source: function(query, process) {
                $.ajax({
                    autoMsg: false,
                    url: replaceUrl(url._('options.zbankName'), query),
                    type: 'GET',
                    beforeSend: function() {
                        $el.parent().find('.tt-dropdown-menu').find('.tt-dataset-zbank').html(typeaheadTplFn({content: '正在搜索...'})).show();
                    },
                    success: function(resp) {
                        process(resp);
                    }
                });
            },
            onReset: function() {
                ui.zbankNo.val('');
            },
            templates: {
                empty: typeaheadTplFn({content: '未能搜索到结果...'})
            },
            events: {
                'typeahead:selected': function(e, datum) {
                    ui.zbankNo.val(datum.value);
                    $el.removeClass('has-revise-error');
                }
            }
        });

        $el.change(function() {
            ui.zbankNo.val('');
        });

    }


    return InfoView;

});