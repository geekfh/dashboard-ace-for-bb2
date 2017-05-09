define([
    'app/oms/mcht/edit/sub/info-view'
], function(MchtEditInfoView) {

    var InfoView = MchtEditInfoView.extend({
        constructor: function (mchtData, errorMark) {
            MchtEditInfoView.prototype.constructor.apply(this, arguments);

            this.errorMark = this.convertErrorMark(errorMark);
            this.reviseFinish = false;
        },

        disabledSwitchKind: function () {
            this.ui.dd.find('ul').remove();
            this.ui.dd.find('button').css('cursor', 'auto');
            this.ui.ddToggle.find('.icon').hide();
        },

        convertErrorMark: function (errorMark) {
            if(errorMark.scope !== void 0) {
                errorMark.group = errorMark.mcc = true;
            }
            return errorMark;
        },
        onRender: function () {
            MchtEditInfoView.prototype.onRender.apply(this, arguments);
            doApplyErrorMark(this);

            this.accountTypeChanged = this.canShowBankName();
        },

        // 切换个体商户，普通商户时，银行帐号信息都置为可用
        refreshBankInfos: function () {
            MchtEditInfoView.prototype.refreshBankInfos.apply(this, arguments);

            var $accountSection = this.$el.find('.account-section');

            $accountSection.find('[name]:visible').each(function () {
                $(this).prop('disabled', false);
            });
        }
    });

    //把非错误部分禁用
    function doApplyErrorMark (me) {

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
            var regionNames = ['zbankProvince', 'zbankCity', 'zbankRegionCode', 'province', 'city', 'areaNo'];
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
        var forceEnableMap = {remark: true}; // 默认“特殊说明”在修订是可以编辑
        var data = me.data;

        //潜规则：审核的时候没有地方 拒绝 支行省/市/区，所以 支行省/市/区 永远不会高亮
        
        //如果开户名被拒，放开账号 支行省市区 委托他人清算
        if(isError('accountName')) {
            forceEnable('zbankProvince', 'zbankCity', 'zbankRegionCode', 'zbankName', 'accountProxy', 'accountNo', 'accountNoPublic', 'bankInfos');
        }

        //如果银行卡号被拒绝，放开 支行省/市/区 && 支行名
        if(isError('accountNo')) {
            errorMark.accountNoPublic = 0;
            forceEnable('zbankProvince', 'zbankCity', 'zbankRegionCode', 'zbankName', 'bankInfos');
        }

        //如果支行名被拒， 放开 支行省/市/区
        if(isError('zbankName')) {
             forceEnable('zbankProvince', 'zbankCity', 'zbankRegionCode');
        }

        //如果商户费率被拒绝， 放开直连和间联的选择
        if(isError('tNDiscId')) {
            forceEnable('category');
        }

        if(isError('accountName')) {
            if(Opf.isBsTrue(data.accountProxy)) {
                forceEnable('accountProxy', '_accountProxyType', '_accountProxyName');
                markError('_accountProxyName');
            }
        }

        //如果商户类型没有被拒绝，则禁止商户类型选择
        if(!isError('kind')){
            //me.disabledSwitchKind();
        }

        setTimeout(function () {
            $el.find('[name]:visible').each(function () {
                var $this = $(this);
                var name = $(this).attr('name');
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

                    $this.addClass('has-revise-error');
                    $this.blur(function () {
                        $this.removeClass('has-revise-error');
                    });
                    if($this.data('select2')) {
                        $this.on('select2-blur', function() {
                            $this.removeClass('has-revise-error');
                        });
                    }
                    // 如果支行名称在错误表中，则放开编辑（设值的时候支行名称这里被禁用了，所以要在这里手动的放开）
                    if(name == 'zbankName'){
                        $this.prop('disabled', false);
                    }
                }
            });

            // 当支行区号不是完整的区号时，放开支行区下拉框
            if(!Opf.Util.isFullRegionCode(data.zbankRegionCode)){
                //如果某个字段为空（省市区除外），则放开编辑
                $el.find('[name="zbankRegionCode"]').prop('disabled', false);
            }
        }, 1);
    }

    return InfoView;

});