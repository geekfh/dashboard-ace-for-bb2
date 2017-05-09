define([
    'app/oms/auth/org/edit/edit-info-view'
], function (AbstractView) {

    var View = AbstractView.extend({
        setExtraParams: function (options) {
            this.rowData = {level:options.brhInfo.brhLevel};
            this.errorMark = options.errorMark;
        },

        doSetupUI: function () {
            //这个是修订机构设置应有的UI
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

            //编辑二级机构时显示分润方案
            me.meIsOneBrh() && ui.profitInfo.show();

            //一级机构新增二级及二级以下机构时显示对私账户
            me.gtTwoLevelOrg() && ui.paccountInfo.show() && ui.accountName.attr("disabled", true);

            //绑定是否提供帐号信息事件
            ui.needAccount.on('change', function(){
                var $this = me.$el.find('[name="needAccount"]:checked');
                ui.accountInfo.toggle($this.val() == 1);
            });
        },

        onRender: function () {
            AbstractView.prototype.onRender.apply(this, arguments);
            var me = this;

            applyErrorMark(me);
            me.listenTo(me.uploadFile, 'file:deleted', function () {
                me.$el.find('.btn-upload-file').closest('.form-group').removeClass('has-revise-error');
            });

            //一级机构新增机构时显示分润方案
            me.meIsOneBrh() && this.ui.profitInfo.show();
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
                ui.accountName.attr("disabled", true);
                ui.accountName.find("option[value='0']").attr("selected", true);
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

        applyExtraImages: function () {
            var View = this.extraImagerAppender.ImageView;
            var $imgDom = this.$el.find('.imgs-preview'),imgView;
            
            var extraImages = this.data.extraImages;
            var imgs = extraImages ? extraImages.split(',') : [];

            _.each(imgs, function(imgUrl) {
                imgView = new View().render();
                imgView.loadImage(imgUrl);
                $imgDom.append(imgView.$el);
            });
            
        }

    });

    function applyErrorMark (me) {

        function isError (fieldName) {
            return fieldName in errorMark;
        }

        function forceEnable () {
            _.each(arguments, function (name) {
                forceEnableMap[name] = true;
            });
        }

        //这个是前端为了某些私有的字段名使用
        function markError () {
            _.each(arguments, function (name) {
                errorMark[name] = 0;
            });
        }

        function notRegionName (name) {
            var regionNames = [
                'brhProvince', 'brhCity', 'brhRegionCode',
                'zbankProvince', 'zbankCity', 'zbankRegionCode',
                'pzbankProvince', 'pzbankCity', 'pzbankRegionCode'
            ];
            var notRegion = true;

            _.each(regionNames, function(item){
                if(item == name){
                    notRegion = false;
                }
            });
            return notRegion;
        }
        
        var $el = me.$el;
        var errorMark = $.extend({}, me.errorMark);
        var forceEnableMap = {};
        var forceNonErrorStyleMap = {};
        var data = me.data;

        
        //潜规则：审核的时候没有地方 拒绝 支行省/市/区，所以 支行省/市/区 永远不会高亮
        //如果开户名被拒，放开账号 支行省市区 委托他人清算
        if(isError('accountName')) {
            forceEnable(
                'zbankProvince', 'zbankCity', 'zbankRegionCode',
                'zbankName', 'accountNo', 'accountNoPublic', 'bankInfos'
            );
        }

        //如果银行卡号被拒绝，放开 支行省/市/区 && 支行名
        if(isError('accountNo')) {
            errorMark.accountNoPublic = 0;
            forceEnable('zbankProvince', 'zbankCity', 'zbankRegionCode', 'zbankName', 'bankInfos');

            //如果支行名未被拒，则不高亮
            if (!isError('zbankName')) {
                forceNonErrorStyleMap.zbankName = true;
            }
        }

        //如果支行名被拒， 放开 支行省/市/区
        if(isError('zbankName')) {
             forceEnable('zbankProvince', 'zbankCity', 'zbankRegionCode');
        }


        //对私账号编辑控制
        if(me.isOrgan()){

            //如果开户名被拒
            if(isError('paccountName')) {
                forceEnable(
                    'pzbankProvince', 'pzbankCity', 'pzbankRegionCode',
                    'pzbankName', 'name', 'pbankInfos'
                );
                errorMark.name = 0;
                delete errorMark.paccountName;
            }

            if(isError('accountName')) {
                errorMark.brhName = 0;
                delete errorMark.accountName;
            }

            //如果账户被拒
            if(isError('paccountNo')) {
                forceEnable(
                    'pzbankProvince', 'pzbankCity', 'pzbankRegionCode',
                    'pzbankName', 'paccountNo', 'pbankInfos'
                );
            }

            //如果支行名未被拒，则不高亮
            if (isError('pzbankName')) {
                forceEnable(
                    'pzbankProvince', 'pzbankCity', 'pzbankRegionCode',
                    'pbankInfos'
                );
            }

            //如果银行卡号被拒绝，放开 支行省/市/区 && 支行名
            /*if(isError('paccountNo')) {
                forceEnable(
                    'pzbankProvince', 'pzbankCity',
                    'pzbankRegionCode', 'pzbankName', 'pbankInfos'
                );

                //如果支行名未被拒，则不高亮
                if (!isError('pzbankName')) {
                    forceNonErrorStyleMap.pzbankName = true;
                }
            }*/

        }

        _.defer(function () {
            $el.find('[name]:visible').not('[type="file"]').each(function () {
                var $this = $(this);
                var name = $this.attr('name');
                var nonErrorMark = (errorMark[name] === void 0);
                
                if(nonErrorMark) {//不在错误表中则禁用

                    if(forceEnableMap[name] !== true) {//如果非强制忽略 禁止编辑
                        $this.prop('disabled', true);

                        if($this.data('select2')) {
                            $this.select2('enable', false);
                        }

                        var $typeahead = $this.closest('.twitter-typeahead');
                        if($typeahead.length) {
                            $typeahead.find('.remove-trigger').hide();
                        }
                    }

                    if(!data[name] && notRegionName(name)){
                        //如果某个字段为空（省市区除外），则放开编辑
                        $this.prop('disabled', false);
                    }

                }else {//在错误表中 (被拒绝了)

                    if(forceNonErrorStyleMap[name] !== true) {//如果强制忽略错误高亮
                        $this.addClass('has-revise-error');
                        $this.blur(function () {
                            $this.removeClass('has-revise-error');
                        });
                        if($this.data('select2')) {
                            $this.on('select2-blur', function() {
                                $this.removeClass('has-revise-error');
                            });
                        }
                    }
                }           
            });

            if(errorMark['brhAddress'] !== void 0){
                //如果机构地址有错误，则放开编辑机构省市区
                $el.find('[name="brhProvince"]')
                    .add('[name="brhCity"]')
                    .add('[name="brhRegionCode"]')
                    .prop('disabled', false);
            }

            var $extraImgs = $el.find('.imgs-preview').find('.img-align-wrap');
            if (errorMark['extra']) {
                _.each(errorMark['extra'], function (val, index) {
                    if (val == 0) {
                        $extraImgs.eq(index).addClass('has-revise-error');
                    }
                });
            }


            //是否提供账户信息应该一直放开编辑
            $el.find('[name="needAccount"]').prop('disabled', false);


            if (errorMark['contractFile'] === void 0) {
                me.uploadFile.disableDeleteBtn();

            } else {
                me.uploadFile.enableDeleteBtn();
                $el.find('.btn-upload-file').closest('.form-group').addClass('has-revise-error');
            }

        });
    }

    return View;

});
