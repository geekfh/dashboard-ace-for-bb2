define([
    'app/oms/service/edit/task/editTaskView'
], function(EditView) {

    var View = EditView.extend({
        tabId: 'menu.service.model.view.task',
        events: {
            'click .btn-submit': 'onBack',
            'click .back-list' : 'onBack'
        },
        onRender: function () {
            EditView.prototype.onRender.apply(this, arguments);
            this.changeValueToLabel();
            this.$el.find('.btn-submit').text('返 回');
        },

        doSetupUI: function () {
            var me = this;
            var data = this.data;
            var tmpVal;

            var shareProfitAjax = Opf.ajax({
                url: url._('service.reward'),
                type: 'GET'
            });

            var codeSelAjax = Opf.ajax({
                url: url._('service.code'),
                type: 'GET'
            });

            var feeSelAjax = Opf.ajax({
                url: url._('service.fee'),
                type: 'GET'
            });


            $.when(shareProfitAjax, codeSelAjax, feeSelAjax).done(function (shareProfit, codeSel, feeSel) {
                if (shareProfit[1] === 'success') {
                    tmpVal = _.findWhere(shareProfit[0], {value: data.shareProfitModel});
                    var shareProfitValue = tmpVal ? tmpVal.name : '';
                    me.ui.shareProfitModel.before('<label class="service-message-value">' + shareProfitValue + '</label>').remove();
                }

                if (codeSel[1] === 'success') {
                    tmpVal = _.findWhere(codeSel[0], {value: data.code});
                    var codeSelValue = tmpVal ? tmpVal.name : '';
                    me.ui.code.before('<label class="service-message-value">' + codeSelValue + '</label>').remove();
                }

                if (feeSel[1] === 'success') {
                    /*tmpVal = _.findWhere(feeSel[0], {value: data.handChargeRate});
                    var feeSelValue = tmpVal ? tmpVal.name : '';
                    me.ui.handChargeRate.before('<label class="service-message-value">' + feeSelValue + '</label>').remove();*/


                    tmpVal = _.findWhere(feeSel[0], {value: data.trialPrice});
                    var trialPriceValue = tmpVal ? tmpVal.name : '';
                    me.ui.trialPrice.before('<label class="service-message-value">' + trialPriceValue + '</label>').remove();
                }
            });

            this.cacheTarget = data.target;
            this.setTodayFee(data.code);
        },

        onBack: function () {
            App.trigger('service:list:page', this.page);
        },

        //把之前的创建的服务的数据设置到表单中
        changeValueToLabel: function () {
            var me = this;
            var $el = me.$el;
            var data = me.data;

            $el.find('select[name!="fixedFeeFrequency"]').not('[service-backgroud]').each(function () {
                $(this).before('<label class="service-message-value">' + $(this).find('option:selected').text() + '</label>').remove();

            });

            var $fixedFeeFrequency = $el.find('select[name="fixedFeeFrequency"]');
            me.data.fixedFeeFrequency != null && $fixedFeeFrequency.before('<label class="service-message-value">' + $fixedFeeFrequency.find('option:selected').text() + '</label>');
            $fixedFeeFrequency.remove();

            $el.find('input').not('[service-backgroud]').each(function () {
                $(this).before('<label class="service-message-value">' + $(this).val() + '</label>').remove();
                
            });

            $el.find('textarea').not('[service-backgroud]').each(function () {
                $(this).before('<label class="service-message-value">' + $(this).val() + '</label>').remove();
                
            });
            
        }

    });

    return View;

});