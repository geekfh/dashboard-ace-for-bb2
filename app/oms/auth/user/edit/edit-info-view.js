define([
    'app/oms/auth/user/common/info-view'
], function (InfoView) {
    var view = InfoView.extend({

        constructor: function (data) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.data = data;
            this.uploadImgs = [];
            this.defaultRoleGroupMap = {};
            this.rowData = {};
        },

        // 在 render 之前已执行
        setExtraParams: function (options) {
            this.rowData = options.rowData;
        },

        onRender: function () {
            InfoView.prototype.onRender.apply(this, arguments);

            this.checkRepeat();

            this.applyRoleGroupMap();

            this.$el.find('.verify-group').remove();
        },

        applyRoleGroupMap: function () {
            var me = this;
            var brhCode = this.rowData.brhCode;
            Opf.ajax({
                type: 'GET',
                async: 'false',
                url: url._('options.user.rolegroup.code',{brhCode: brhCode}),
                success: function (data) {
                    me.defaultRoleGroupMap = convertRoleGroupMap(data);
                }
            });
        },

        doSetupUI: function () {
            var ui = this.ui;
            var data = this.data;
            var rowData = this.rowData;
            this.$el.find(':input').each(function(){
                var name = $(this).attr('name');
                $(this).val(data[name]);
            });
            ui.loginName.prop('disabled', true);
            CommonUI.address(ui.zbankProvince, ui.zbankCity, ui.zbankRegionCode);//选择支行
            this.typeheadZbankName();
            CommonUI.roleGroup4User(ui.roleGroupId, data.roleGroupId, data.id);
            CommonUI.rule4User(ui.ruleId, data.ruleId, rowData.brhCode);
            this.$el.find('.user-type-select').hide();
        },

        isTwoMoreBrh: function () {
            var myBrhLevel = this.rowData.brhLevel || this.data.brhLevel;

            return myBrhLevel > 1;
        },

        checkRepeat: function () {
            var ui = this.ui;
            var selectId = this.data.id;
            ui.loginName.data('selectId', selectId);
            ui.mobile.data('selectId', selectId);
            ui.email.data('selectId', selectId);
            ui.cardNo.data('selectId', selectId);
        },

        // 点击添加按钮后初始化上传图片的功能
        initUpload: function () {
            var me = this;
            var ui = this.ui;
            var data = this.data;

            _.defer(function () {
                //编辑操作员时如果不具有修改拓展员信息的权限时，不能修改身份证及照片信息，只能查看
                //"编辑操作员并且具有修改拓展员信息权限"时，允许上传和修改照片）
                if(!me.canEditExplorer()){
                    ui.cardNo.prop('disabled', true);
                    me.initDetailView(ui.idCardFront, data.idCardFront);
                    me.initDetailView(ui.idCardBack, data.idCardBack);
                    me.initDetailView(ui.personWithIdCard, data.personWithIdCard);
                    me.initDetailView(ui.bankCard, data.bankCard);
                }else{
                    me.initUploadView(ui.idCardFront, data.idCardFront);
                    me.initUploadView(ui.idCardBack, data.idCardBack);
                    me.initUploadView(ui.personWithIdCard, data.personWithIdCard);
                    me.initUploadView(ui.bankCard, data.bankCard);
                }
            });
        },

        canEditExplorer: function () {
            // 如果 rowData 为空, 则说明是工作台修改保存的操作员，这个时候是可以编辑拓展员信息的
            // 0级和1级具有修改拓展员信息
            return _.isEmpty(this.rowData) || Ctx.getBrhLevel() == 0 || Ctx.getBrhLevel() == 1;
        },

        bindIsExplorerEvent: function () {
            var me = this;
            var ui = this.ui;
            var data = this.data;
            var rowData = this.rowData;
            // “是否为拓展员”下拉框应该一直都是不可编辑的
            // 它的值是根据它所属的机构而决定的，0，1级机构只能是“非拓展员”
            ui.isExplorer.prop('disabled', true);

            //如果是编辑操作员，则“是否拓展员”下拉框设置从后台取回来的值
            ui.isExplorer.val(data.isExplorer);

            ui.isExplorer.on('change', function(val) {
                var isExplorer = $(this).val() == 1;

                me.updateSomeUiByisExpBoolean(isExplorer);

                // 如果当前机构为2级及以下
                //     如果是拓展员，规则只能选 4-仅查看自己拓展
                //     否则规则只能选 1-本机构全部
                if(me.isTwoMoreBrh()){
                    //初始时ruleId的值还没回来，所以先做个延时再设置
                    setTimeout(function(){
                        if(isExplorer){
                            ui.ruleId.val("4");
                        }else{
                            ui.ruleId.val("1");
                        }
                    },300);
                    ui.ruleId.prop('disabled', true);
                }

                if(rowData.roleFlag == 1){
                    setTimeout(function(){
                        ui.ruleId.val(data.ruleId);
                    },350);
                    ui.ruleId.prop('disabled', false);
                }
            });

            ui.isExplorer.trigger('change');

        },

        // 编辑操作员的时候，根据是否拓展员来判断是否需要填写银行卡号信息
        getNeedAccountVal: function () {
            return this.data.isExplorer == '1' ? '1': '0';
        },

        addAccountInfo: function () {
            var ui = this.ui;
            var data = this.data;
            var needAccountVal = this.getNeedAccountVal();

            this.addSelect2(ui.bankInfo);

            ui.needAccount.on('change', function() {
                ui.account.toggle($(this).val() == 1);
            });

            ui.needAccount.val(needAccountVal).trigger('change');

            //如果数据中有帐号名称，意味着有填写帐号信息，编辑需要设置初始值
            if(data.accountName){
                ui.bankInfo.select2('data', {key: data.bankNo, value: data.bankName});
                ui.accountName.val(data.accountName);
                ui.accountNo.val(data.accountNo);
                if(data.zbankRegionCode) {//填写的支行
                    var zbankAddressCode = Opf.Util.parseRegionCode(data.zbankRegionCode);
                    var map = {};
                    $.extend(map, {
                        zbankProvince: zbankAddressCode[0],
                        zbankCity: zbankAddressCode[1],
                        zbankRegionCode: zbankAddressCode[2]
                    });
                    $.extend(map, { profitPlan: data.profitPlan });
                    _.each(map, function (defVal, name) {
                        ui[name] && ui[name].length && ui[name].data('ajaxselect.value', defVal);
                    });
                }
            }
        }
        
    });

    function convertRoleGroupMap (data) {
        /*
         后台获取到的数据
         [
            {key: xxx, value:1}, //机构管理角色组（管理+业务)
            {key: xxx, value:2}, //机构管理角色组（仅用于管理）
            {key: xxx, value:3}, //拓展员角色组
            {key: xxx, value:4}, //录入员角色组
            {key: xxx, value:5}, //统计查询角色组
            {key: xxx, value:7}, //二级管理员专用角色组
         ]
         */
        var codeToName = {
            1: 'sysbsmgr',
            2: 'sysmgr',
            3: 'expand',
            4: 'keyboard',
            5: 'statist',
            6: 'firstmgr',
            7: 'secondmgr'
        };
        var map = {};
        _.each(data, function (item) {
            map[codeToName[item.value]] = item.key;
        });
        return map;
    }

    return view;
});