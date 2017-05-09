define([
    'tpl!app/oms/auth/user/common/templates/info.tpl',
    'common-ui',
    'app/oms/auth/user/list/upload-image-view',
    'app/oms/auth/user/common/add-validate',
    'jquery.validate',
    'jquery.fancybox'
], function (tpl, CommonUi, UploadImagerCtrl, AddValidate) {
    var UPLOAD_IMG_BUTTOM = [
        '<div style="position: relative;">',
            '<a href="#" class="btn btn-primary add-img">添加图片</a>',
        '</div>'
    ].join('');
    var typeaheadTplFn = _.template([
        '<div style="padding: 0 15px; height: 30px; line-height: 30px">',
            '<%= content %>',
        '</div>'
    ].join(''));
    var MAX_TYPEAHEAD_LENGTH = 20;
    var ADD_USER_MAP_LIST = [
        {name: 'custom', label: '操作员(能自定义角色组)', permission: 'user.add.custom'},
        {name: 'sysbsmgr', label: '机构管理员(管理&业务)', permission: 'user.add.brh.business'},
        {name: 'sysmgr', label: '机构管理员(管理)', permission: 'user.add.brh.manage'},
        {name: 'expand', label: '拓展员', permission: 'user.add.expand'},
        {name: 'keyboard', label: '录入员', permission: 'user.add.entry'},
        {name: 'statist', label: '统计员', permission: 'user.add.statist'}
    ];

    var REAL_USER_MAP_LIST = _.filter(ADD_USER_MAP_LIST, function (item) {
        return Ctx.avail(item.permission);
    });

    var view = Marionette.ItemView.extend({
        template: tpl,

        events: {
            'click .btn-verifyCode': 'getVerifyCode',
            'click .type-dd-item': 'onUserTypeSwitch'
        },

        ui: {
            userTypeDDMenu: '.user-type-select .dropdown-menu',
            userTypeDD: '.user-type-select',
            name: '[name="name"]',
            loginName: '[name="loginName"]',
            roleGroupId: '[name="roleGroupId"]',
            ruleId: '[name="ruleId"]',
            isExplorer: '[name="isExplorer"]',

            expInfo: '.expInfo',
            cardNo: '[name="cardNo"]',
            idCardFront: '#idCardFront',
            idCardBack: '#idCardBack',
            personWithIdCard: '#personWithIdCard',
            bankCard: '#bankCard',

            gender: '[name="gender"]',
            tel: '[name="tel"]',
            mobile: '[name="mobile"]',
            verifyCodeBtn: '.btn-verifyCode',
            verifyCode: '[name="verifyCode"]',
            email: '[name="email"]',
            needAccount: '[name="needAccount"]',
            bankInfo: '[name="bankInfo"]',
            accountName: '[name="accountName"]',
            accountNo: '[name="accountNo"]',
            accountInfo: '.accountInfo',
            account: '.account',
            verifyGroup: '.verify-group',

            //省市区-选支行
            zbankProvince   : '[name="zbankProvince"]',
            zbankCity       : '[name="zbankCity"]',
            zbankRegionCode : '[name="zbankRegionCode"]',
            bankNo          : '[name="bankInfo"]',
            zbankNo         : '[name="zbankNo"]',
            zbankName       : '[name="zbankName"]',
            checkBank        :'.check-bank'
        },

        constructor: function (options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.uploadImgs = [];

            this.defaultRoleGroupMap = Ctx.getDefaultRoleGroupMap();
        },

        onRender: function () {
            //初始化页面设置
            this.doSetupUI();
            //填写手机号时获取验证码按钮是否可用绑定事件
            this.bindMobileEvent();
            // 添加图片上传功能
            this.initUpload();
            //是否为拓展员事件
            this.bindIsExplorerEvent();
            //填写帐号信息
            this.addAccountInfo();
            //添加验证
            this.attachValidation();
            //绑定事件
            this.attachEvents();
        },

        attachEvents: function () {
            //往后有绑定事件直接在这里写
            var me = this;
            var ui = this.ui;

            ui.roleGroupId.on('change.updateIsExplorer', function(){
                var roleGroupIdVal = $(this).val();
                me.updateIsExplorer(roleGroupIdVal);
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
            //开户行改动话就清空支行信息
            ui.bankInfo.on('change',function(){
                me.clearZbank();
            });
            ui.zbankRegionCode.on('change',function(){
                me.clearZbank();
            });
            setTimeout(function(){
                ui.roleGroupId.trigger('change');
            },300);
        },

        updateIsExplorer: function (roleGroupIdVal) {
            var me = this;
            var ui = this.ui;
            var defaultRoleGroupMap = this.defaultRoleGroupMap;
            //如果选中的角色组是“拓展员角色组”或“机构管理+业务”并且当前操作员所属机构为2级及以下机构，则一定为“是拓展员”，否则为“非拓展员”
            //操作员所属机构为二级机构，遍历从后台获取到的角色组的数据 object, 如果对应的 key 值为 expand 或者 sysbsmgr 则设置为是拓展员
            for(var p in defaultRoleGroupMap){
                if(defaultRoleGroupMap[p] == roleGroupIdVal){
                    if((p == 'expand' || p == 'sysbsmgr' || p == 'secondmgr') && me.isTwoMoreBrh()){
                        ui.isExplorer.val('1');
                    }else{
                        ui.isExplorer.val('0');
                    }
                    ui.isExplorer.trigger('change');
                }
            }
        },

        isTwoMoreBrh: function () {
            return Ctx.getBrhLevel() > 1;
        },

        isAddUserView: function () {
            return this.data ? false : true;
        },

        isEditUserView: function () {
            return this.data ? true : false;
        },

        attachValidation: function () {
            AddValidate.addRules4Info(this.$el.find('form:first'));
        },

        getVerifyCode: function (e) {
            e.preventDefault();

            var me = this;
            var ui = me.ui;
            ui.verifyCode.data('mobileNo', ui.mobile.val());
            ui.verifyCode.data('validVerifyCodeUrl', url._('user.validate.verifyCode'));
            Opf.ajax({
                type: 'GET',
                data: {
                    mobile: me.ui.mobile.val()
                },
                url: url._('user.get.verifyCode'),
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

        validate: function() {
            this.attachImgValid();
            var extraValid = true;
            if(this.$el.find('.has-revise-error:visible').length) {
                extraValid = false;
            }
            if(this.$el.find('.has-error:visible').length){
                extraValid = false;
            }
            return this.$el.find("form").valid() && extraValid;
        },

        attachImgValid: function () {
            var imgErrorHtml = [
                '<div class="help-error help-block img-upload-error">',
                    '请上传照片',
                '</div>'
            ].join('');

            this.$el.find('.upload-img').each(function(){
                var $this = $(this);
                var name = $this.closest('.form-group').attr('id');

                if( $this.data('validate-rule') && 
                    $this.find('.img-upload-error').length < 1 &&
                    $this.find('img[name="'+ name +'"]').length < 1){
                        valid = false;
                        $this.closest('.form-group').addClass('has-error');
                        $this.append(imgErrorHtml);
                }
            });
        },

        isExplorerSelectTrue: function () {
            return this.ui.isExplorer.val() == '1';
        },

        doSetupUI: function () {
            var me = this;
            var ui = this.ui;
            bankCode1 = '';
            this.roleGroupAjaxUi = CommonUi.roleGroup4User(ui.roleGroupId);
            this.roleAjaxUi = CommonUi.rule4User(ui.ruleId);
            ui.name.on('input', _.debounce(function(){
                console.log('>>>set accountName', ui.name.val());
                if(me.isExplorerSelectTrue()) {
                    ui.accountName.val(ui.name.val());
                }
            }, 200));

            CommonUI.address(ui.zbankProvince, ui.zbankCity, ui.zbankRegionCode);
            me.typeheadZbankName();

            me.buildUserDropdown();
            me.updateUiByUserType(ui.userTypeDD.find('button').attr('ref'));
            me.checkUserPermission();
        },

        checkUserPermission: function () {
            // 如果没有拓展员权限，则拓展员不可编辑且值为非拓展员
            // 否则默认设置是拓展员
            if(this.noExpandPermission()){
                this.ui.isExplorer.val('0').prop('disabled', true);
            }else{
                this.ui.isExplorer.val('1');
            }
            this.ui.isExplorer.trigger('change');
        },

        noExpandPermission: function () {
            return !Ctx.avail('user.add.expand');
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

        buildUserDropdown: function() {
            //在这里构建选择操作员类型的下拉列表
            //选中某种操作员会根据 roleGroupId 更新当前页面
            var me = this, defalutValue;

            _.each(REAL_USER_MAP_LIST, function(item, idx) {
                if (idx === 0) {
                    //设置dd的默认值
                    me.ui.userTypeDD.find('button').attr('ref', item.name);
                    me.ui.userTypeDD.find('button').find('.text').text(item.label);
                    defalutValue = item.name;
                }
                // 【新增操作员】2级及以下机构，新增员工时，默认选择项“拓展员“
                if(me.isTwoMoreBrh()){
                    defalutValue = 'expand';
                }
                $('<li><a class="type-dd-item" href="#" value="' + item.name + '">' + item.label + '</a></li>').appendTo(me.ui.userTypeDDMenu);
            });
            _.defer(function () {
                me.ui.userTypeDD.find('a[value="' + defalutValue + '"]').click();

            });
        },

        onUserTypeSwitch: function (e) {
            var $text = $(e.target).closest('li').find('a');
            this.updateUiByUserType($text.attr('value'));
        },

        // 根据 roleGroupId 来判断角色组下拉框是否可编辑
        isCustomUser: function (menuItemName) {
            return menuItemName == 'custom';
        },

        getMenuItemName: function () {
            return this.menuItemName;
        },

        updateUiByUserType: function (menuItemName) {
            console.log('>>>updateUiByUserType', menuItemName);

            this.menuItemName = menuItemName;

            // 根据 roleGroupId 更新当前页面
            var ui = this.ui;
            var isCustomUser = this.isCustomUser(menuItemName);

            // ------这里控制 角色组下拉框 UI变化------
            // 如果选中自定义操作员，则角色组可编辑，
            // 否则角色组不可以编辑，并改变角色组的值
            if(isCustomUser){
                ui.roleGroupId.prop('disabled', false);
            }else{
                this.setRoleGroupIdByItemName(menuItemName);
                ui.roleGroupId.prop('disabled', true);
            }

            if(this.isTwoMoreBrh()){
                //2级及以下机构创建操作员时, “管辖范围”，不可编辑
                ui.ruleId.prop('disabled', true);
            }


        },

        //{id: 1, label: '操作员(能自定义角色组)', permission: 'user.add.custom'},
        // {id: 2, label: '机构管理员(管理&业务)', permission: 'user.add.brh.business'},
        // {id: 3, label: '机构管理员(管理)', permission: 'user.add.brh.manage'},
        // {id: 4, label: '拓展员', permission: 'user.add.expand'},
        // {id: 5, label: '录入员', permission: 'user.add.entry'},
        // {id: 6, label: '统计员', permission: 'user.add.statist'}
        setRoleGroupIdByItemName: function (menuItemName) {
            var roleGroupBsId = this.defaultRoleGroupMap[menuItemName];
            this.roleGroupAjaxUi.setDefaultValue(roleGroupBsId);
            this.updateIsExplorer(roleGroupBsId);
        },

        // 点击添加按钮后初始化上传图片的功能
        initUpload: function () {
            var me = this;
            var ui = this.ui;

            _.defer(function () {
                me.initUploadView(ui.idCardFront);
                me.initUploadView(ui.idCardBack);
                me.initUploadView(ui.personWithIdCard);
                me.initUploadView(ui.bankCard);
            });
        },

        bindIsExplorerEvent: function () {
            var me = this;
            var ui = this.ui;
            var data = this.data;

            // “是否为拓展员”下拉框应该一直都是不可编辑的
            // 它的值是根据它所属的机构级别而决定的，0，1级机构只能是“非拓展员”,2级及以下机构要根据所选的角色组roleGroupId来判断
            ui.isExplorer.prop('disabled', true);
            ui.isExplorer.on('change', function(val) {
                var isExplorer = $(this).val() == 1;

                me.updateSomeUiByisExpBoolean(isExplorer);

                // 如果当前机构为2级及以下
                //     如果是拓展员，规则只能选 4-仅查看自己拓展
                //     否则规则只能选 1-本机构全部
                if(me.isTwoMoreBrh()){
                    var roleIdValue = isExplorer ? '4' : '1';
                    me.roleAjaxUi.setDefaultValue(roleIdValue);
                    ui.ruleId.prop('disabled', true);
                }
            });

            ui.isExplorer.trigger('change');

        },

        updateSomeUiByisExpBoolean: function (isExplorer) {
            //如果是拓展员，显示拓展员详情并需要填写，显示银行帐号信息并需要填写，显示短信验证码
            //如果不是拓展员，则拓展员详情和银行账号信息都隐藏，银行卡信息设为不需要填写
            var ui = this.ui;
            var needAccountVal = isExplorer ? '1' : '0';

            ui.needAccount.val(needAccountVal);

            ui.account.toggle(isExplorer);
            ui.expInfo.toggle(isExplorer);
            ui.verifyGroup.toggle(isExplorer);

            ui.expInfo.find('.upload-img').each(function(){
                $(this).data('validate-rule', isExplorer);
            });
            
        },

        addAccountInfo: function () {
            var ui = this.ui;

            this.addSelect2(ui.bankInfo);

            //"新增操作员",显示“是”
            ui.needAccount.val('1');
        },

        getImgUrl: function (el) {
            var name = $(el).attr('id');
            return $(el).find('img[name='+ name +']').attr('src').split('?')[0] || '';
        },

        getExpVal: function () {
            var me = this;
            var ui = this.ui;
            return {
                cardNo: ui.cardNo.val(),
                images: [
                    {
                        name: 'idCardFront',
                        value: me.getImgUrl(ui.idCardFront)
                    },{
                        name: 'idCardBack',
                        value: me.getImgUrl(ui.idCardBack)
                    },{
                        name: 'personWithIdCard',
                        value: me.getImgUrl(ui.personWithIdCard)
                    },{
                        name: 'bankCard',
                        value: me.getImgUrl(ui.bankCard)
                    }
                ]
            };
        },

        getAccountVal: function () {
            var ui = this.ui;
            var bankInfo = ui.bankInfo.select2('data') || {};
            return {
                bankName: bankInfo.value,
                bankNo: bankInfo.key,
                accountName: ui.accountName.val(),
                accountNo: ui.accountNo.val()
            };
        },

        getValues: function () {
            var me = this;
            var ui = this.ui;
            var selTxtFn = Opf.Util.getSelectedOptionText;

            var obj = {
                name: ui.name.val(),
                loginName: ui.loginName.val(),
                roleGroupId: ui.roleGroupId.val(),
                _roleGroupId: selTxtFn(ui.roleGroupId),
                ruleId: ui.ruleId.val(), 
                _ruleId: selTxtFn(ui.ruleId), 
                isExplorer: ui.isExplorer.val(),

                gender: ui.gender.val(),
                tel: ui.tel.val(),
                mobile: ui.mobile.val(),
                email: ui.email.val(),
                needAccount: me.isExplorerSelectTrue() ?  ui.needAccount.val() : 0,
                zbankNo : ui.zbankNo.val(),
                zbankName : ui.zbankName.val(),
                zbankRegionCode:ui.zbankRegionCode.val()

            };

            this.isEditUserView() && $.extend(obj, {id: this.data.id});

            ui.isExplorer.val() === "1" && $.extend(obj, me.getExpVal());

            ui.needAccount.val() === "1" && $.extend(obj, me.getAccountVal());

            this.isAddUserView() && $.extend(obj, {verifyCode: ui.verifyCode.val()});

            console.log(obj);
            return obj;
        },

        // 初始化编辑上传图片
        initUploadView: function(el, imgUrl) {
            var $uploadBtn = $(UPLOAD_IMG_BUTTOM);
            $uploadBtn.find('button').on('click', function (e) { e.preventDefault(); });
            $(el).find('.upload-img').append($uploadBtn);
            var uploadImg = new UploadImagerCtrl({ 
                trigger: $uploadBtn.find('a'),
                name: $uploadBtn.closest('.form-group').attr('id')
            });
            uploadImg.initUploadView();

            imgUrl && uploadImg.renderViewByImgUrl(imgUrl);

            uploadImg.on("upload:success", function(){
                $(el).closest('.form-group').removeClass('has-error');
                $(el).find('.img-upload-error').remove();
            });

            this.uploadImgs.push(uploadImg);

        },

        // 由于图片太小,查看详情时点击图片需要显示大图。
        initDetailView: function(el, imgUrl) {
            var $el = $(el);
            if(imgUrl) {
                var name = $el.attr('id');
                var _imgUrl = imgUrl + '?_t=' + (new Date()).getTime();
                var imgHtml = [
                    '<div class="img-inner-wrap" title="查看大图">',
                        '<a class="img-link" href="' + _imgUrl + '">',
                            '<span class="vertical-helper"></span>',
                            '<img name="' + name + '" style="width: 150px; height: 100px;" src="' + _imgUrl + '">',
                        '</a>',
                    '</div>'
                ].join('');

                var $img = $(imgHtml);

                $el.find('.upload-img').empty().append($img);

                $img.find('.img-link').fancybox({
                    wrapCSS    : 'fancybox-custom',
                    closeClick : true,
                    openEffect : 'none',
                    type: 'image',

                    helpers : {
                        title : {
                            type : 'inside'
                        }
                    }
                });
            } else {
                $el.empty();
            }
        },

        addSelect2: function (select) {
            var $select = $(select);
            $select.select2({
                placeholder: '请选择开户行',
                minimumInputLength: 1,
                ajax: {
                    type: "get",
                    url: 'api/system/options/special-bank-infos',
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
                    bankCode1 = e.key;
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
                var $form = $(this).closest('form');

                $form.validate && $form.validate().element($(this));
            });

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
        clearZbank: function () {
            this.zbankCommonUI.reset();
        },
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

        }
        
    });

    return view;
});