define([
    'app/oms/service/add/CreateServerView'
], function(AbstractView) {

    var CAN_BE_EDIT = ['name', 'desc', 'fixedRewardAmt', 'trialPrice', 'trialPeriod'];

    var View = AbstractView.extend({
        tabId: 'menu.service.model.edit.task',
        initialize: function (options) {
            AbstractView.prototype.initialize.apply(this, arguments);
            this.data = options.data;
            this.status = options.data.status;
        },

        onRender: function() {
            AbstractView.prototype.onRender.apply(this, arguments);
            this.applyDefaultValue();
            this.updateUI();
            this.updateStatus();
        },

        postUrl: function () {
            return url._('service.save', {id: this.id});
        },

        doSetupUI: function () {
            var data = this.data;

            CommonUI.shareProfit(this.ui.shareProfitModel, data.shareProfitModel);
            CommonUI.codeSel(this.ui.code, data.code);
            //CommonUI.feeSel(this.ui.handChargeRate, data.handChargeRate);
            CommonUI.feeSel(this.ui.trialPrice, data.trialPrice);

            this.cacheTarget = data.target;
            this.doSetupFee(data.code);
        },

        updateStatus: function () {
            //未开始，全部都可以修改
            if (this.status == 0) {
                return;
            }

            //开始或者暂停，部分可以修改
            if (this.status == 1 || this.status == 2) {
                this.$el.find(':input[name]').each(function () {
                    var name = $(this).attr('name');

                    if(!_.contains(CAN_BE_EDIT, name)) {
                        $(this).prop('disabled', true);
                    }
                });
            }

            //任务停止，全部不可以修改
            if (this.status == 3) {
                this.$el.find(':input[name]').each(function () {
                    $(this).prop('disabled', true);
                });
            }
        },


        //把之前的创建的服务的数据设置到表单中
        applyDefaultValue: function () {
            var me = this;
            var $el = me.$el;
            var data = me.data;

            // 输入框的值可以直接设置
            $el.find(':input[name]').not('[service-backgroud]').each(function () {
                var name = $(this).attr('name');

                if (data[name]) {
                    if ($(this).is(':checkbox')) {
                        $(this).prop('checked', Opf.isBsTrue(data[name]));

                    } else if ($(this).is(':radio')) {
                        if($(this).val() == data[name]){
                            $(this).prop('checked', true);
                        }

                    } else {
                        $(this).val(data[name]);

                    }

                }
            });
            
        }

    });

    return View;
});