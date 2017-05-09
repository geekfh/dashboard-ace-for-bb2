define([
    'App',
    'tpl!app/oms/auth/org/common/templates/info.tpl',
    'i18n!app/oms/common/nls/auth',
    'app/oms/auth/org/common/sub/add-brh-validate',
    'app/oms/mcht/add/sub/extra-image-appender',
    'app/oms/auth/org/common/sub/uploadView',
    'jquery.validate',
    'common-ui',
    'bootstrap-datepicker',
    'moment.override',
    'select2'
], function(App, tpl, authLang, AddBrhValidate, ExtraImagerAppender, UploadView, validator) {
    //******************** 新增校验规则开始 ************************
    var pbankCode;

    //对私账号银行卡校验
    jQuery.validator.addMethod("org.info.checkSpecialBankCard", function(value, element, param) {
        return this.optional(element) || (param.ignore && _.contains(param.ignore, value)) ||
                validator.syncValid(url._('valid.eighteen.bank', {bankCardNo:value})+'?bankCode='+pbankCode,'org.info.checkSpecialBankCard');
    }, "");

    //******************** 新增校验规则结束 ************************

    var BRH_TYPE = {
        AGENT: 'agent',//代理商
        DIST: 'dist' //分销商
    };

    var typeaheadTplFn = _.template([
        '<div style="padding: 0 15px; height: 30px; line-height: 30px">',
            '<%= content %>',
        '</div>'
    ].join(''));

    var FILE_ERROR = '<div class="help-block help-error file-upload-error"> 需要上传文件 </div>';
    var CHECKBOX_ERROR = '<div class="col-md-12 help-block help-error checkbox-error"> 至少选择一项 </div>';

    var MAX_TYPEAHEAD_LENGTH = 20;

    // 点击了不参与分润，以下字段为空
    var NOT_JOIN_PROFIT = {
        accountName: '',
        accountNo: '',
        accountType: '',
        bankName: '',
        bankNo: '',
        //profitPlan: '',
        //profitPlanName: '',
        zbankName: '',
        zbankNo: '',
        zbankRegionCode: ''
    };
    //var NOT_JOIN_PROFIT = {
    //    accountName: '',
    //    accountNo: '',
    //    accountType: '',
    //    bankName: '',
    //    bankNo: '',
    //    profitPlan: '',
    //    profitPlanName: '',
    //    zbankName: '',
    //    zbankNo: '',
    //    zbankRegionCode: ''
    //};

    var InfoView = Marionette.ItemView.extend({
        template: tpl,

        events: {
            'click .btn-verifyCode': 'getVerifyCode',
            'input [name="phoneNo"]': 'loadRecommendNodHandle'
        },

        className: "brh-form-group mcht-add-extra",

        ui: {
            // 管理员登录名
            loginName       : '[name="loginName"]',
            // 法人代表信息
            name            : '[name="name"]',
            cardNo          : '[name="cardNo"]',
            cardEndDate     : '[name="cardEndDate"]',
            mobile          : '[name="mobile"]',
            verifyCodeBtn   : '.btn-verifyCode',
            verifyCode      : '[name="verifyCode"]',
            // 机构机构信息
            brhName         : '[name="brhName"]',
            brhNickName     : '[name="brhNickName"]',
            brhType         : '[name="brhType"]',
            brhAddress      : '[name="brhAddress"]',
            brhRegionCode   : '[name="brhRegionCode"]',
            urgentContactName: '[name="urgentContactName"]',
            brhTel       : '[name="brhTel"]',
            agencyEnd       : '[name="agencyEnd"]',
            licNo           : '[name="licNo"]',
            taxNo           : '[name="taxNo"]',
            // 机构可用费率模型
            /*discInfo        : '.disc-info',
            dir             : '.dir',
            indir           : '.indir', */
            // 合同存档
            contractCode    : '[name="contractCode"]',
            contractFile    : '[name="contractFile"]',
            // 分润方案
            isJoinProfit    : '[name="isJoinProfit"]',
            profitPlan      : '[name="profitPlan"]',

            // 对私收款账户
            paccountName     : '[name="paccountName"]',
            paccountNo       : '[name="paccountNo"]',
            pbankName        : '[name="pbankName"]',
            pbankNo          : '[name="pbankNo"]',
            pbankLogoPlace   : '.pbank-logo-place',
            pzbankNo         : '[name="pzbankNo"]',
            pzbankName       : '[name="pzbankName"]',
            pbankInfos       : '[name="pbankInfos"]',

            // 对公收款账户
            accountName     : '[name="accountName"]',
            accountNo       : '[name="accountNo"]',
            accountNoPublic : '[name="accountNoPublic"]',
            zbankNo         : '[name="zbankNo"]',
            zbankName       : '[name="zbankName"]',
            needAccount     : '[name="needAccount"]',
            bankName        : '[name="bankName"]',
            bankNo          : '[name="bankNo"]',
            bankLogoPlace   : '.bank-logo-place',
            bankInfos       : '[name="bankInfos"]',

            // 补充图片
            // extraImg        : '[name="extraImg"]',

            checkBank       : 'a.check-bank',

            //省市区
            brhProvince     : '[name="brhProvince"]',
            brhCity         : '[name="brhCity"]',
            brhReginCode    : '[name="brhReginCode"]',

            pzbankProvince   : '[name="pzbankProvince"]',
            pzbankCity       : '[name="pzbankCity"]',
            pzbankRegionCode : '[name="pzbankRegionCode"]',

            zbankProvince   : '[name="zbankProvince"]',
            zbankCity       : '[name="zbankCity"]',
            zbankRegionCode : '[name="zbankRegionCode"]',

            bankInfosGroup  : '.bank-infos-group',
            privateAccount  : '.account-private',
            publicAccount   : '.account-public',

            profitInfo      : '.profit-info',
            accountInfo     : '.account-info',
            paccountInfo    : '.paccount-info',

            //推荐人
            phoneNo     : '[name="phoneNo"]',
            info_brhName     : '[name="info_brhName"]'
        },

        constructor: function (data) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            
            //一级机构创建的机构是代理商, 二级或下面机构创建的是分销商,为了区分一些模版的不同
            this.type = Ctx.getUser().get('brhLevel') == 1 ? BRH_TYPE.AGENT : BRH_TYPE.DIST;

        },

        validate: function() {
            var fileError = this.showFileError();
            /*var discError = this.showDiscError();*/
            if(this.$el.find('.has-revise-error:visible').length) {
                return false;
            }
            return this.$el.find("form").valid() && fileError;
        },

        isAgent: function () {
            return this.type === BRH_TYPE.AGENT;
        },

        isDist: function () {
            return this.type === BRH_TYPE.DIST;
        },

        isOrgan: function(){
            return this.gtTwoLevelOrg() || Ctx.getBrhLevel() > 0;
        },

        //兼容编辑机构
        gtTwoLevelOrg: function(){
            return false;
        },

        // 跟后台定了一个字段 0-代理商, 1-分销商
        getBrhTypeValue: function () {
            return this.isAgent() ? 0 : 1;
        },

        isZeroBrh : function () {
            return Ctx.getBrhLevel() == 0;
        },

        meIsOneBrh: function () {
            return Ctx.getBrhLevel() == 1;
        },

        onRender: function() {
            var me = this;
            var $el = me.$el;

            var $trigger = $el.find('.add-img-tirgger');
            var $imgsPreviewCt = $el.find('.imgs-preview');
            new ExtraImagerAppender({
                trigger: $trigger,
                previewCt: $imgsPreviewCt,
                data: {name: 'extraImg', uuid: Ctx.getId()},
                url: url._('upload.brh.media'),   // url._('mcht.upload')
                limit: 5
            });

            me.uploadFile = new UploadView({
                data:{ name: 'contract', uuid: Ctx.getId() },
                url: url._('upload.brh.media')   // url._('mcht.upload')
            });
            me.uploadFile.render();
            me.$el.find('.btn-upload-file').append(me.uploadFile.$el);

            //绑定页面上改变输入框或下拉框时触发的事件
            me.attachEvents();

            //绑定初始化事件
            me.doSetupUI();

            //填写手机号时获取验证码按钮是否可用绑定事件
            me.bindMobileEvent();

            me.updateUI();

            me.addSelect2(this.ui.bankInfos);
            me.addSelect2(this.ui.pbankInfos, url._('bank.special'));

            me.attachValidation();

            me.toggleRules();

            me.bindDiscCheckboxEvent();

            me.doGetRecommend();//推荐人 brhLevel等级判断
        },
        doGetRecommend: function(){
            var me = this;
            var doc = $(document);
            if(doc.find('li[tabid="menu-org-add"]').hasClass('active')){
                if(Ctx.getUser().get('brhLevel') == 1 ){
                    me.$el.find('.recommend-info').show();
                }
            }
        },
        doSetupUI: function () {
            //这个是新增机构设置应有的UI
            var me = this;
            var ui = me.ui;

            CommonUI.address(ui.brhProvince, ui.brhCity, ui.brhRegionCode);
            CommonUI.address(ui.zbankProvince, ui.zbankCity, ui.zbankRegionCode);
            CommonUI.address(ui.pzbankProvince, ui.pzbankCity, ui.pzbankRegionCode);
            CommonUI.disc(ui.profitPlan, 'brh');

            me.setDatepicker(ui.cardEndDate);
            me.setDatepicker(ui.agencyEnd);
            me.typeheadZbankName();
            me.typeheadpZbankName();

            //新增机构时需要填写手机短信验证
            me.$el.find('.verify-group').show();

            //0级机构新增机构时需要选择可用费率模型
            //me.isZeroBrh() && ui.discInfo.show();

            //一级机构新增二级及二级以下机构时显示对私账户
            me.isOrgan() && ui.paccountInfo.show();

            //一级机构新增机构时显示分润方案
            me.meIsOneBrh() && ui.profitInfo.show();

            //绑定是否提供帐号信息事件
            ui.needAccount.on('change', function(){
                var $this = me.$el.find('[name="needAccount"]:checked');
                ui.accountInfo.toggle($this.val() == 1);
            });
        },

        bindDiscCheckboxEvent: function () {
            this.$el.find('.disc-checkbox').on('change', function(){
                var $this = $(this);
                if($this.prop('checked')){
                    var $inputWrap = $this.closest('.form-group');
                    $inputWrap.removeClass('has-error');
                    $inputWrap.find('.checkbox-error').remove();
                }
            });
        },

        addSelect2: function(select, uri) {
            console.log('add select2 for bank name!!');

            var $select = $(select);

            $select.select2({
                placeholder: '请选择开户行',
                minimumInputLength: 1,
                ajax: {
                    type: "get",
                    url: uri||url._('bank.info'),
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
                    var key = e.key;
                    if($select.attr("name")=="pbankInfos"){
                        pbankCode = key;
                    }
                    return key;
                },
                formatResult: function(data, container, query, escapeMarkup){
                    return data.value;
                },
                formatSelection: function(data, container, escapeMarkup){
                    return data.value;
                }
            });

            $select.change(function(){
                var $form = $(this).closest('form');
                $form.validate && $form.validate().element($(this));
            });

        },

        attachValidation: function () {
            AddBrhValidate.addRules4Info(this.$el.find('form:first'));
        },

        toggleRules: function () {
            if ( this.isAgent() ) {
                this.$el.find('.btn-upload-file').data('validate-rule', 'true');
                return; 
            }

            this.ui.licNo.rules('remove', 'required');
            this.ui.contractCode.rules('remove', 'required');
            this.$el.find('.btn-upload-file').data('validate-rule', 'false');
        },

        showFileError: function () {
            var filePath = this.$el.find('[name="contractFile"]').val();
            var $uploadTrigger = this.$el.find('.btn-upload-file');

            if ($uploadTrigger.data('validate-rule') === 'false') {
                return true;
            }

            if(!filePath) {
                $uploadTrigger.closest('.form-group').addClass('has-error');
                if( $uploadTrigger.find('.file-upload-error').length < 1 ) {
                    $uploadTrigger.find('.upload-group').append(FILE_ERROR);
                }
                return false;
            }

            return true;
        },

        /*showDiscError: function () {
            var ui = this.ui;
            if(this.$el.find('.disc-info').is(':visible')){
                var dirValid = this.checkedDiscValid(ui.dir);
                var indirValid = this.checkedDiscValid(ui.indir);
                return  dirValid && indirValid;
            }else{
                return true;
            }
        },*/

        checkedDiscValid: function (discGroup) {
            var $discGroup = $(discGroup);
            var $checkedDisc = $discGroup.find('input.disc-checkbox:checked');
            if($checkedDisc.length > 0){
                return true;
            }else if(!$discGroup.find('.checkbox-error').length){
                $discGroup.closest('form-group').addClass('has-error');
                $discGroup.append(CHECKBOX_ERROR);
                return false;
            }
        },

        clearZbank: function () {
            this.zbankCommonUI.reset();
        },

        clearpZbank: function () {
            this.pzbankCommonUI.reset();
        },

        /**
         * flag:true 添加一级机构
         * flag:false 添加二级及以下机构
         * @param flag
         */
        onAccountCardNoChange: function (flag) {
            var me = this, ui = me.ui;
            var $this = flag? ui.accountNo:ui.paccountNo;
            var theBankCardNo = $this.val();
            var bankName = flag? ui.bankName:ui.pbankName;
            var bankNo = flag? ui.bankNo:ui.pbankNo;
            var bankLogoPlace = flag? ui.bankLogoPlace:ui.pbankLogoPlace;

            bankName.val('');
            bankNo.val('');
            bankLogoPlace.empty();

            var isDebitCard = $this.closest('form').validate().element($this.get(0));
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
                            bankLogoPlace.empty().append(CommonUI.template('bank.logo.name', data));
                            bankNo.val(data.value);
                            bankName.val(data.name);
                        }
                    }
                });
            }
        },

        getDiscModelTypes: function () {
            var availDiscModelTypes = ['IndirMccMonthlyRate'];//直接默认选择“MCC码月交易额结算扣率”
            //this.$el.find('.disc-checkbox').each(function(){
            //    var $this = $(this);
            //    if($this.prop('checked')){
            //        availDiscModelTypes.push($this.attr('name'));
            //    }
            //});

            return {
                availDiscModelTypes: availDiscModelTypes
            };
        },

        getOrganModelValues: function(){
            var ui = this.ui;
            return {
                paccountName:     ui.paccountName.val(),
                paccountNo:       ui.paccountNo.val(),
                paccountType:     "1",
                pbankName:        ui.pbankName.val(),
                pbankNo:          ui.pbankNo.val(),
                pzbankName:       ui.pzbankName.val(),
                pzbankNo:         ui.pzbankNo.val(),
                pzbankRegionCode: ui.pzbankRegionCode.val()
            };
        },

        getValues: function () {
            var me = this;
            var selTxtFn = Opf.Util.getSelectedOptionText;

            var baseValue = {
                addBrhType:      me.getBrhTypeValue(),
                brhName:         me.ui.brhName.val(),
                loginName:       me.ui.loginName.val(),

                name:            me.ui.name.val(),
                cardNo:          me.ui.cardNo.val(),
                cardEndDate:     me.ui.cardEndDate.val(),
                mobile:          me.ui.mobile.val(),

                brhNickName:     me.ui.brhNickName.val(),
                brhType:         me.ui.brhType.val(),
                brhAddress:      me.ui.brhAddress.val(),
                brhRegionCode:   me.ui.brhRegionCode.val(),
                urgentContactName: me.ui.urgentContactName.val(),
                brhTel:          me.ui.brhTel.val(),
                agencyEnd:       me.ui.agencyEnd.val() || 0,
                licNo:           me.ui.licNo.val(),
                taxNo:           me.ui.taxNo.val(),

                contractCode:    me.ui.contractCode.val(),
                contractFile:    me.$el.find('[name="contractFile"]').val(),

                isJoinProfit:    me.getJoinProfit(),
                profitPlan:      me.ui.profitPlan.val(),
                profitPlanName:  me.ui.isJoinProfit.val() == 1 ? selTxtFn(me.ui.profitPlan) : '',
                needAccount:     me.$el.find('[name="needAccount"]:checked').val(),
                _extraImages:    me.getExtraImgs(),

                //推荐人
                recommendOprId:     me.ui.info_brhName.attr('oprId') || '',
                recommendBrhCode:   me.ui.info_brhName.attr('brhNo') || '',
                recommendOprPhone:  me.ui.phoneNo.val() || '',
                recommendBrhName :  me.ui.info_brhName.val() || ''

            };

            me.ui.verifyCodeBtn.is(':visible') && $.extend(baseValue, {verifyCode: me.ui.verifyCode.val()});

            if(me.isOrgan()){
                $.extend(baseValue, me.getOrganModelValues());
            }

            if(me.isZeroBrh()){
                $.extend(baseValue, me.getDiscModelTypes());
            }

            if (me.$el.find('[name="needAccount"]:checked').val() == 0) {
                return $.extend(baseValue, NOT_JOIN_PROFIT);
            }
            else {
                var joinProfitValue = {
                    accountName:     me.getAccountName(),
                    accountNo:       me.ui.accountName.val() == 0 ? me.ui.accountNoPublic.val() : me.ui.accountNo.val(),
                    accountType:     me.ui.accountName.val(),
                    bankName:        me.ui.bankName.val(),
                    bankNo:          me.ui.bankNo.val(),
                    profitPlan:      me.ui.profitPlan.val(),
                    profitPlanName:  me.ui.isJoinProfit.val() == 1 ? selTxtFn(me.ui.profitPlan) : '',
                    zbankName:       me.ui.zbankName.val(),
                    zbankNo:         me.ui.zbankNo.val(),
                    zbankRegionCode: me.ui.zbankRegionCode.val()
                };

                return $.extend(baseValue, joinProfitValue);
            }

        },

        getJoinProfit: function() {
            if(this.ui.profitInfo.is(':visible')) {
                return this.$el.find('[name="isJoinProfit"]:checked').val();

            } else {
                return '0';
            }
        },

        genAccountTypeOptions4KindB2: function () {
            var name = $.trim(this.ui.name.val());
            var brhName = $.trim(this.ui.brhName.val());
            var tpl = '<option disabled="disabled " selected="selected" class="placeholder">- 必须为机构名称或法人代表姓名 -</option>';
            if(brhName) {
                tpl += '<option value="0">' + brhName +' （对公）' + '</option>';
            }
            if(name) {
                tpl += '<option value="1">' + name +' （对私）' + '</option>';
            }
            return tpl;
        },

        bindMobileEvent: function () {
            var ui = this.ui;
            var $mobile = ui.mobile;
            $mobile.on('change', function(){
                setTimeout(function(){
                    var mobileError = ui.mobile.closest('.form-group').hasClass('has-error');
                    ui.verifyCodeBtn.prop('disabled', mobileError);
                }, 10);
            });

            $mobile.on('input', function(){
                setTimeout(function(){
                    var mobileLength = ui.mobile.val().length;
                    var mobileError = ui.mobile.closest('.form-group').hasClass('has-error');
                    ui.verifyCodeBtn.prop('disabled', mobileError || (mobileLength != 11));
                }, 10);
            });
        },

        loadRecommendNodHandle: function () {
            var me = this;
            var reg= /^[1][358]\d{9}$/;
            var phoneNum = me.$el.find('[name="phoneNo"]').val();

            me.$el.find('[name="help-error-brhName"]').css('display','none');

            if(reg.test(phoneNum)){
                me.$el.find('.hd-info-icon-ok').css('visibility','visible');
                Opf.ajax({
                    url: url._('auth.info.Recommend'),
                    type: 'GET',
                    data: { phoneNo: phoneNum },
                    success: function(resp) {
                        me.$el.find('[name="help-error-brhName"]').css('display','none');
                        me.$el.find('[name="info_brhName"]').val(resp.data.brhName);
                        me.$el.find('[name="info_brhName"]').attr('brhNo', resp.data.brhNo);
                        me.$el.find('[name="info_brhName"]').attr('oprId', resp.data.oprId);
                    },
                    error: function(){
                        me.$el.find('[name="help-error-brhName"]').css('display','block');
                        me.$el.find('[name="info_brhName"]').val('');
                        me.$el.find('[name="info_brhName"]').attr('brhNo', '');
                        me.$el.find('[name="info_brhName"]').attr('oprId', '');
                    }
                });
            }
            else{
                me.$el.find('.hd-info-icon-ok').css('visibility','hidden');
                me.$el.find('[name="help-error-brhName"]').css('display','block');
            }
        },
        getVerifyCode: function (e) {
            e.preventDefault();

            var me = this;
            var ui = me.ui;
            ui.verifyCode.data('mobileNo', ui.mobile.val());
            ui.verifyCode.data('validVerifyCodeUrl', url._('brh.validate.verifyCode'));
            Opf.ajax({
                type: 'GET',
                data: {
                    mobile: me.ui.mobile.val()
                },
                url: url._('brh.get.verifyCode'),
                success: function (resp) {
                    me.getVerifyCodeComplete(resp);
                }
            });
        },

        getVerifyCodeComplete: function (resp) {
            var timer, count=60, successLabel;
            var $verifyCodeBtn = this.ui.verifyCodeBtn;
            if(resp.status == '1'){
                //获取短信成功
                successLabel = [
                    '<div class="verifyLabel send-success">',
                        '<i class="icon icon-ok green"></i>',
                        '<label>已发送</label>',
                    '</div>'
                ].join('');
            }else{
                //获取短信失败
                successLabel = [
                    '<div class="verifyLabel send-error">',
                        '<label>'+ resp.remark +'</label>',
                    '</div>'
                ].join('');
            }

            var $verifyLabel = $verifyCodeBtn.parent().find('.verifyLabel');

            $verifyCodeBtn.addClass("disabled");
            !$verifyLabel.length && $verifyCodeBtn.after(successLabel);

            timer = setInterval(function(){
                $verifyCodeBtn.text(count + "秒后可重新发送");
                count = count - 1;
                if(count == -1) {
                    $verifyCodeBtn.text("获取验证码").removeClass("disabled");
                    count = 60;
                    getVcode = false;
                    signal = false;
                    clearInterval(timer);
                }
            }, 1000);
        },

        updateUI: function () {
            var me = this;
            var ui = this.ui;
            var tmp = ui.accountName.val();
            ui.accountName.empty().append(me.genAccountTypeOptions4KindB2());
            if(tmp !== null) {
                ui.accountName.val(tmp);
            }

            // 新增二级及以下机构显示对私账户
            if(me.isOrgan()){
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

        getAccountName: function () {
            var me = this;

            // 对公
            if(me.ui.accountName.val() == 0) {
                return me.ui.brhName.val();

            } else {
                return me.ui.name.val();

            }
        },

        //判断是否需要显示开户行,对公则显示，对私则不显示
        canShowBankName: function() {
            return this.ui.accountName.find('option:selected').val() === '0';
        },

        attachEvents: function () {
            var me = this;
            var ui = me.ui;

            var $el = me.$el;

            // 监听文件是否上传成功
            me.listenTo(me.uploadFile, 'upload:success', function () {
                $el.find('.btn-upload-file').closest('.form-group').removeClass('has-error');
                $el.find('.btn-upload-file').find('.file-upload-error').remove();
            });

            //是否参与分润
            ui.isJoinProfit.change(function () {
                me.updateUI();
            });

            ui.name.change(function () { 
                me.updateUI();
                me.refreshBankInfos();
            });

            ui.brhName.change(function () {
                me.updateUI();
                me.refreshBankInfos();
            });
    
            // 银行地区改变触发
            ui.zbankRegionCode.change(function(){
                me.clearZbank();
            });

            // 银行卡号改变触发
            ui.accountNo.on('change', function (e) {
                me.clearZbank();
                $(this).triggerHandler('change.logo');
            });
            ui.accountNo.on('change.logo', function (e) {
                me.onAccountCardNoChange(true);
            });

            //普通商户选择下拉框改变，将账号清空，及银行logo清空。
            ui.accountName.change(function () {
                me.updateUI();
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

            ui.cardNo.on('input.uppercaseXTail', function () {
                var value = $.trim($(this).val());
                if(value && value.substring(value.length-1) === 'x') {
                    $(this).val(value.toUpperCase());
                }
            });

            ui.checkBank.on('click',function(){
                Opf.alert({
                    title: "推荐银行",
                    message: me.getBankListTpl()
                });
            });

            // 如果新增二级及以下机构触发事件
            if(me.isOrgan()){
                ui.pbankInfos.on('change', function() {
                    ui.paccountNo.val('');
                    _.defer(function(){
                        ui.paccountNo.trigger('change');
                    });
                    //me.clearpZbank();
                });

                ui.pbankInfos.on('change.refreshpzbank', function() {
                    var infoData = ui.pbankInfos.select2('data');
                    ui.pbankName.val(infoData ? infoData.value : '');
                    ui.pbankNo.val(infoData ? infoData.key : '');
                });

                ui.pzbankRegionCode.change(function(){
                    me.clearpZbank();
                });

                ui.paccountNo.on('change', function (e) {
                    me.clearpZbank();
                    $(this).triggerHandler('change.logo');
                });

                ui.paccountNo.on('change.logo', function (e) {
                    me.onAccountCardNoChange(false);
                });
            }
        },

        getBankListTpl: function(){
            return [
                '<div class="container">',
                    '<div class="row">',
                        '<div class="col-xs-3">农业银行</div>',
                        '<div class="col-xs-3">建设银行</div>',
                        '<div class="col-xs-3">中国银行</div>',
                        '<div class="col-xs-3">工商银行</div>',
                    '</div>',
                    '<div class="row">',
                        '<div class="col-xs-3">招商银行</div>',
                        '<div class="col-xs-3">交通银行</div>',
                        '<div class="col-xs-3">平安银行</div>',
                        '<div class="col-xs-3">民生银行</div>',
                    '</div>',
                    '<div class="row">',
                        '<div class="col-xs-3">光大银行</div>',
                        '<div class="col-xs-3">兴业银行</div>',
                        '<div class="col-xs-3">华夏银行</div>',
                        '<div class="col-xs-3">浦发银行</div>',
                    '</div>',
                    '<div class="row">',
                        '<div class="col-xs-3">中信银行</div>',
                        '<div class="col-xs-3">广发银行</div>',
                        '<div class="col-xs-3">杭州银行</div>',
                        '<div class="col-xs-3">南粤银行</div>',
                    '</div>',
                    '<div class="row">',
                        '<div class="col-xs-3">宁波银行</div>',
                        '<div class="col-xs-3">浙商银行</div>',
                    '</div>',
                '</div>'
            ].join('');
        },

        refreshBankInfos: function() {
            console.log('show bank name is ', this.canShowBankName());

            var ui = this.ui;

            var accountNo = ui.accountNo,
                bankInfos = ui.bankInfos;

            //显示或者隐藏开户行的输入
            var canShow = this.canShowBankName();
            if(canShow) {
                //在对公的情况下 将开户行的select2的值设入bankNo和bankName中
                bankInfos.data('select2') && bankInfos.triggerHandler('change.refreshzbank');
            } else {
                //在对私的情况下 触发'change.logo'事件。
                accountNo.triggerHandler('change.logo');
            }

            //增加二级及以下机构时也要设入bankNo和bankName的值
            if(this.isOrgan()){
                ui.pbankInfos.data('select2') && ui.pbankInfos.triggerHandler('change.refreshpzbank');
                ui.paccountNo.triggerHandler('change.logo');
            }

            //这个判断是否清空支行的地址，当状态由对公切换为对私或者由对私切换为对公的时候就会清支行的信息。
            this.accountTypeChanged === canShow || this.clearZbank();

            this.accountTypeChanged = canShow;
        },


        setDatepicker: function (el) {
            $(el).datepicker({
                startDate:new Date(),
                format: 'yyyymmdd',
                autoclose: true
            });
        },

        /**
         * 搜索支行名称
         */
        typeheadZbankName: function () {
            var me = this;
            var ui = me.ui;
            var $el = ui.zbankName;

            function replaceUrl(url, query) {
                return url + '?' + $.param({
                    kw: encodeURIComponent($el.val()),
                    regionCode: ui.zbankRegionCode.val(),
                    bankCode: ui.bankNo.val(),
                    maxLength: MAX_TYPEAHEAD_LENGTH
                });
            }

            me.zbankCommonUI = CommonUI.zbankName($el, {
                source: function(query, process) {
                    $.ajax({
                        url: replaceUrl(url._('options.zbankName'), query),
                        type: 'GET',
                        autoMsg: false,
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

        },

        typeheadpZbankName: function(){
            var me = this;
            var ui = me.ui;
            var $el = ui.pzbankName;

            function replaceUrl(url, query) {
                return url + '?' + $.param({
                    kw: encodeURIComponent($el.val()),
                    regionCode: ui.pzbankRegionCode.val(),
                    bankCode: ui.pbankNo.val(),
                    maxLength: MAX_TYPEAHEAD_LENGTH
                });
            }

            me.pzbankCommonUI = CommonUI.zbankName($el, {
                source: function(query, process) {
                    $.ajax({
                        url: replaceUrl(url._('options.zbankName'), query),
                        type: 'GET',
                        autoMsg: false,
                        beforeSend: function() {
                            $el.parent().find('.tt-dropdown-menu').find('.tt-dataset-zbank').html(typeaheadTplFn({content: '正在搜索...'})).show();
                        },
                        success: function(resp) {
                            process(resp);
                        }
                    });
                },
                onReset: function() {
                    ui.pzbankNo.val('');
                },
                templates: {
                    empty: typeaheadTplFn({content: '未能搜索到结果...'})
                },
                events: {
                    'typeahead:selected': function(e, datum) {
                        ui.pzbankNo.val(datum.value);
                        $el.removeClass('has-revise-error');
                    }
                }
            });

            $el.change(function() {
                ui.pzbankNo.val('');
            });
        },

        getExtraImgs: function () {
            var $el = this.$el;
            var imgArr = [];

            $el.find('.imgs-preview').find('img').each(function(key, val) {
                imgArr.push($(val).attr('src'));
            });

            return imgArr;

        }

    });

    function getFile(el){
        return $(el).val() || '';
    }

    return InfoView;

});
