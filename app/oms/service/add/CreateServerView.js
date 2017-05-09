define([
    'tpl!app/oms/service/add/templates/createServer.tpl',
    'app/oms/service/add/add-serv-valid',
    'jquery.validate',
    'common-ui',
    'moment.override'
],function(tpl, AddServValid){

    //解析年
    function parseYear(date){
        var year = "";
        if(/^(\d{4}).*(\d{2}).*(\d{2})$/.test(date)){
            year = RegExp.$1;
        }
        return year;
    }

    //增加费率
    var addFee = function (target, me) {
        var tpl = [
            '<form onsubmit="return false;" >',
                '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
                    '<tbody>',
                        '<tr class="FormData">',
                            '<td class="CaptionTD">按笔固定:</td>',
                            '<td class="DataTD">',
                                '<select role="select" name="profix" class="FormElement ui-widget-content ui-corner-all"></select>',
                            '</td>',
                        '</tr>',
                        '<tr class="FormData">',
                            '<td class="CaptionTD">按笔比例:</td>',
                            '<td class="DataTD">',
                                '<select role="select" name="prorate" class="FormElement ui-widget-content ui-corner-all"></select>',
                            '</td>',
                        '</tr>',
                    '</tbody>',
                '</table>',
            '</form>'
        ].join('');

        var $form = $(tpl);
        var $target = $(target);

        var $dialog = Opf.Factory.createDialog($form, {
            destroyOnClose: true,
            title: '新增费率',
            autoOpen: true,
            width: 300,
            height: 200,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $profix = $(this).find('[name="profix"]');
                    var $prorate = $(this).find('[name="prorate"]');

                    if ($profix.val()||$prorate.val())
                    {
                        var date = $target.attr('data-txDate');

                        Opf.ajax({
                            type: 'POST',
                            jsonData: {
                                year: parseYear(date),
                                date: date,
                                serviceCode: me.ui.code.val(),
                                prorate: $prorate.val(),
                                profix: $profix.val()
                            },
                            url: url._('service.fee.save'),
                            success: function () {
                                CommonUI.datePickerWithInfo('refresh');
                                me.setTodayFee();
                            },
                            complete: function () {
                                $dialog.dialog('close');
                            }
                        });
                    } else {
                        Opf.alert("请选择费率！");
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                var $prorate = $(this).find('[name="prorate"]');
                var $profix = $(this).find('[name="profix"]');
                CommonUI.feeModel($prorate, $target.attr('data-prorateValue'));
                CommonUI.feeModel($profix, $target.attr('data-profixValue'));
            }
        });
    };

    //批量添加
    var addFees = function(me){
        var tpl = [
            '<form onsubmit="return false;" >',
                '<div class="container">',
                    '<div class="row">',
                        '<div class="col-xs-3" style="text-align: right;">',
                            '<label class="caption caption-text-font">请选择年份：</label>',
                        '</div>',
                        '<div class="col-xs-9">',
                            '<select name="year" style="width: 100px;"></select>',
                        '</div>',
                    '</div>',
                    '<div class="row">',
                        '<hr />',
                    '</div>',
                    '<div class="row">',
                        '<div class="col-xs-5">',
                            '<label class="caption caption-text-font">',
                                '<input type="radio" name="settings" value="1" checked /> 统一设置',
                            '</label>',
                            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
                                '<tbody>',
                                    '<tr class="FormData">',
                                        '<td class="CaptionTD">',
                                            '<div>按笔固定:</div>',
                                            '<div>按笔比例:</div>',
                                        '</td>',
                                        '<td class="DataTD">',
                                            '<select role="select" name="profix_all" class="FormElement ui-widget-content ui-corner-all"></select>',
                                            '<select role="select" name="prorate_all" class="FormElement ui-widget-content ui-corner-all"></select>',
                                        '</td>',
                                    '</tr>',
                                '</tbody>',
                            '</table>',
                        '</div>',
                        '<div class="col-xs-7">',
                            '<label class="caption caption-text-font">',
                                '<input type="radio" name="settings" value="0" /> 按日设置',
                            '</label>',
                            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
                                '<tbody>',
                                    //星期一
                                    '<tr class="FormData">',
                                        '<td class="CaptionTD" width="36px">',
                                            '<b>星期一</b>',
                                        '</td> ',
                                        '<td class="CaptionTD" width="64px">',
                                            '<div>按笔固定:</div>',
                                            '<div>按笔比例:</div>',
                                        '</td>',
                                        '<td class="DataTD">',
                                            '<select role="select" name="profix_week_1" class="FormElement ui-widget-content ui-corner-all"></select>',
                                            '<select role="select" name="prorate_week_1" class="FormElement ui-widget-content ui-corner-all"></select>',
                                        '</td>',
                                        '<td class="CaptionTD">',
                                            '<input type="hidden" name="fee_week_1" />',
                                        '</td> ',
                                    '</tr>',

                                    //星期二
                                    '<tr class="FormData">',
                                        '<td class="CaptionTD">',
                                            '<b>星期二</b>',
                                        '</td> ',
                                        '<td class="CaptionTD">',
                                            '<div>按笔固定:</div>',
                                            '<div>按笔比例:</div>',
                                        '</td>',
                                        '<td class="DataTD">',
                                            '<select role="select" name="profix_week_2" class="FormElement ui-widget-content ui-corner-all"></select>',
                                            '<select role="select" name="prorate_week_2" class="FormElement ui-widget-content ui-corner-all"></select>',
                                        '</td>',
                                        '<td class="CaptionTD">',
                                            '<input type="hidden" name="fee_week_2" />',
                                        '</td> ',
                                    '</tr>',

                                    //星期三
                                    '<tr class="FormData">',
                                        '<td class="CaptionTD">',
                                            '<b>星期三</b>',
                                        '</td> ',
                                        '<td class="CaptionTD">',
                                            '<div>按笔固定:</div>',
                                            '<div>按笔比例:</div>',
                                        '</td>',
                                        '<td class="DataTD">',
                                            '<select role="select" name="profix_week_3" class="FormElement ui-widget-content ui-corner-all"></select>',
                                            '<select role="select" name="prorate_week_3" class="FormElement ui-widget-content ui-corner-all"></select>',
                                        '</td>',
                                        '<td class="CaptionTD">',
                                            '<input type="hidden" name="fee_week_3" />',
                                        '</td> ',
                                    '</tr>',

                                    //星期四
                                    '<tr class="FormData">',
                                        '<td class="CaptionTD">',
                                            '<b>星期四</b>',
                                        '</td> ',
                                        '<td class="CaptionTD">',
                                            '<div>按笔固定:</div>',
                                            '<div>按笔比例:</div>',
                                        '</td>',
                                        '<td class="DataTD">',
                                            '<select role="select" name="profix_week_4" class="FormElement ui-widget-content ui-corner-all"></select>',
                                            '<select role="select" name="prorate_week_4" class="FormElement ui-widget-content ui-corner-all"></select>',
                                        '</td>',
                                        '<td class="CaptionTD">',
                                            '<input type="hidden" name="fee_week_4" />',
                                        '</td> ',
                                    '</tr>',

                                    //星期五
                                    '<tr class="FormData">',
                                        '<td class="CaptionTD">',
                                            '<b>星期五</b>',
                                        '</td> ',
                                        '<td class="CaptionTD">',
                                            '<div>按笔固定:</div>',
                                            '<div>按笔比例:</div>',
                                        '</td>',
                                        '<td class="DataTD">',
                                            '<select role="select" name="profix_week_5" class="FormElement ui-widget-content ui-corner-all"></select>',
                                            '<select role="select" name="prorate_week_5" class="FormElement ui-widget-content ui-corner-all"></select>',
                                        '</td>',
                                        '<td class="CaptionTD">',
                                            '<input type="hidden" name="fee_week_5" />',
                                        '</td> ',
                                    '</tr>',

                                    //星期六
                                    '<tr class="FormData">',
                                        '<td class="CaptionTD">',
                                            '<b>星期六</b>',
                                        '</td> ',
                                        '<td class="CaptionTD">',
                                            '<div>按笔固定:</div>',
                                            '<div>按笔比例:</div>',
                                        '</td>',
                                        '<td class="DataTD">',
                                            '<select role="select" name="profix_week_6" class="FormElement ui-widget-content ui-corner-all"></select>',
                                            '<select role="select" name="prorate_week_6" class="FormElement ui-widget-content ui-corner-all"></select>',
                                        '</td>',
                                        '<td class="CaptionTD">',
                                            '<input type="hidden" name="fee_week_6" />',
                                        '</td> ',
                                    '</tr>',

                                    //星期天
                                    '<tr class="FormData">',
                                        '<td class="CaptionTD">',
                                            '<b>星期天</b>',
                                        '</td> ',
                                        '<td class="CaptionTD">',
                                            '<div>按笔固定:</div>',
                                            '<div>按笔比例:</div>',
                                        '</td>',
                                        '<td class="DataTD">',
                                            '<select role="select" name="profix_week_7" class="FormElement ui-widget-content ui-corner-all"></select>',
                                            '<select role="select" name="prorate_week_7" class="FormElement ui-widget-content ui-corner-all"></select>',
                                        '</td>',
                                        '<td class="CaptionTD">',
                                            '<input type="hidden" name="fee_week_7" />',
                                        '</td> ',
                                    '</tr>',
                                '</tbody>',
                            '</table>',
                        '</div>',
                    '</div>',
                '</div>',
            '</form>'
        ].join('');

        var $form = $(tpl);

        var $dialog = Opf.Factory.createDialog($form, {
            destroyOnClose: true,
            title: '批量新增费率',
            autoOpen: true,
            width: 600,
            height: 680,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $submitBtn, $form=$(this);
                    var ajaxOptions = {
                        type: 'POST',
                        url: '',
                        jsonData: {},
                        beforeSend: function(){
                            $submitBtn = $form.closest('.ui-dialog').find('button[type="submit"]');
                            $submitBtn.prop('disabled', true).text('提交中...');
                        },
                        success: function () {
                            //CommonUI.datePickerWithInfo('refresh');
                            me.setTodayFee();
                        },
                        complete: function () {
                            $dialog.dialog('close');
                        }
                    };

                    var canSubmit = true;
                    var errorMsg = "请选择费率！";
                    var year = $(this).find('[name="year"]').val();

                    //统一设置
                    if (!!parseInt($(this).find('[name="settings"]:checked').val())) {
                        var $prorate = $(this).find('[name="prorate_all"]');
                        var $profix = $(this).find('[name="profix_all"]');

                        $.extend(ajaxOptions, {
                            jsonData: {
                                year: year,
                                serviceCode: me.ui.code.val(),
                                prorate: $prorate.val(),
                                profix: $profix.val()
                            },
                            url: url._('service.fee.save')
                        });

                        canSubmit = !!($profix.val()||$prorate.val());
                        //validateEl = [];
                        //validateEl.push($prorate, $profix);
                    } else { //按日设置
                        var values = [];
                        var $prorates = $(this).find('[name^="prorate_week"]');
                        var $profixs = $(this).find('[name^="profix_week"]');
                        var $feeweeks = $(this).find('[name^="fee_week"]');

                        $.each($feeweeks, function(idx){
                            //var self = $(week);
                            //var name = self.attr('name');
                            //var idx = /.*(\d+)$/.test(name)? RegExp.$1:0;
                            var $prorate = $prorates.eq(idx);
                            var $profix = $profixs.eq(idx);
                            if($prorate.val()||$profix.val()){
                                values.push({
                                    week: idx+1,
                                    prorate: $prorate.val(),
                                    profix: $profix.val()
                                });
                            }
                        });

                        $.extend(ajaxOptions, {
                            jsonData: values,
                            url: url._('service.fees.save', {year:year, serviceCode:me.ui.code.val()})
                        });

                        if(values.length !== 7){
                            canSubmit = false;
                            errorMsg = "星期一到星期天的费率都必须设置！";
                        }
                    }

                    if(canSubmit){
                        Opf.ajax(ajaxOptions);
                    } else {
                        Opf.alert(errorMsg);
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                var $prorate = $(this).find('[name^="prorate"]');
                var $profix = $(this).find('[name^="profix"]');
                CommonUI.feeModel($prorate);
                CommonUI.feeModel($profix);

                var $year = $(this).find('[name^="year"]');
                var currentYear = parseInt(moment().format('YYYY'));
                var yearSteps = 20, yearOptions="";
                for(var i=0; i<yearSteps; i++){
                    yearOptions += '<option value="'+(currentYear+i)+'">'+(currentYear+i)+'</option>';
                }
                $year.empty().html(yearOptions);
            }
        });
    };

    return Marionette.ItemView.extend({
        tabId: 'menu.service.model.create.server',
        template: tpl,
        events: {
            'click .btn-submit': 'onSubmit',
            'click .back-list' : function () {
                App.trigger('service:list:page', this.page);
            }
        },

        ui: {
            code:              '[name="code"]',
            target:            '[name="target"]',
            activateWay:       '[name="activateWay"]',
            fixedFeeType:      '[name="fixedFeeType"]',
            fixedFeeFrequency: '[name="fixedFeeFrequency"]',
            fixedFeeAmt:       '[name="fixedFeeAmt"]',
            awardSection:      '.award-section',

            //handChargeRate:    '[name="handChargeRate"]',
            handChargeRateName:'[id="handChargeRateName"]',
            shareProfitModel:  '[name="shareProfitModel"]',
            trialPrice:        '[name="trialPrice"]',

            form: '.create-server-form',
            mchtFee: '.mcht-fee',
            branchFee: '.branch-fee',
            mchtHandRate: '.mcht-handChargeRate',
            branchHandRate: '.branch-handChargeRate',
            feeLabel: '.fee-label',

            btnAddFee: '#btn_add_fee',
            btnAddFees: '#btn_add_fees'
        },

        initialize: function (options) {
            this.page = options.page;
            this.canAddFee = options.canAddFee||false;
            this.canAddFees = options.canAddFees||false;
        },

        onRender: function () {
            this.attachValidation();
            this.attachEvents();
            this.updateUI();
            this.doSetupUI();
        },

        doSetupUI: function () {
            CommonUI.shareProfit(this.ui.shareProfitModel);
            CommonUI.codeSel(this.ui.code);
            //CommonUI.feeSel(this.ui.handChargeRate);
            CommonUI.feeSel(this.ui.trialPrice);

            this.cacheTarget = this.ui.target.val();
            this.doSetupFee();
        },

        setTodayFee: function(code){
            var ui = this.ui;
            $.ajax({
                type: 'GET',
                async: false,
                url: url._('service.fee.today', {
                    serviceCode: code||ui.code.val(),
                    date: moment().format('YYYYMMDD')
                }),
                dataType: 'json',
                success: function(rsp){
                    var feeStr = "";
                    if(rsp.profixName||rsp.prorateName){
                        feeStr = '<span style="color:#025D9C;">';
                        feeStr += rsp.profixName||"";
                        feeStr += '<br />';
                        feeStr += rsp.prorateName||"";
                        feeStr += '</span>';
                    } else {
                        feeStr = '<span>无</span>';
                    }
                    ui.handChargeRateName.html(feeStr);
                    //ui.handChargeRate.val(rsp.proRateValue||"");
                }
            })
        },

        doSetupFee: function(code){
            var $code = this.ui.code;
            var interval = setInterval(function(){
                var $option = code?
                        $code.find('option[value="'+code+'"]'):
                        $code.find('option').eq(1);
                if($option.length>0){
                    $option.attr("selected", true);
                    $code.trigger('change');
                    clearInterval(interval);
                }
            }, 10);
        },

        postUrl: function () {
            return url._('service.save');
        },

        onSubmit: function () {
            var me = this;
            if(this.validate()) {
                Opf.ajax({
                    url: me.postUrl(),
                    type: 'POST',
                    jsonData: me.getValues(),
                    success: function (resp) {
                        if (resp.success === true) {
                            Opf.Toast.success('提交成功');
                            App.trigger('service:list');
                        }
                    },
                    complete: function () {

                    }
                });
            }
        },

        validate: function() {
            var isValid = true;
            var handChargeRateName = $.trim(this.ui.handChargeRateName.text());
            if(handChargeRateName == "无"){
                isValid = false;
                this.ui.handChargeRateName.html('<span style="color:red;">请添加当日费率</span>');
            }
            return this.$el.find("form").valid()&&isValid;
        },

        attachValidation: function () {
            AddServValid.addRules4Info(this.$el.find('form.create-server-form'));
        },

        attachEvents: function () {
            var me = this;

            this.ui.code.on('change', function () {
                me.setTodayFee();
            });

            this.ui.target.on('change', function () {
                me.updateUI();
                me.updatehandChargeRateSel();
            });

            this.ui.activateWay.on('change', function () {
                me.updateUI();
            });

            this.ui.fixedFeeType.on('change', function () {
                me.updateUI();
            });

            this.canAddFee&&this.ui.btnAddFee.on('click', function(){
                if(me.ui.form.validate().element(me.ui.code)){
                    var serviceCode = me.ui.code.val();
                    var pickerOptions = {
                        handlerBar: me.ui.btnAddFee,
                        url: url._('service.fee.list', {serviceCode:serviceCode}),
                        fields: ['profixName', 'prorateName'], //需要在日历里面显示的描述字段
                        pickerOnClick: function(){
                            addFee(this, me);
                        }
                    };
                    CommonUI.datePickerWithInfo(pickerOptions);
                } else {
                    Opf.scrollToError(me.$el);
                }
            });

            this.canAddFees&&this.ui.btnAddFees.on('click', function(){
                if(me.ui.form.validate().element(me.ui.code)){
                    addFees(me);

                    //优化版本
                    /*require(['app/oms/service/add/add-fees'], function(AddFeesView){
                        var addFeesView = new AddFeesView;
                            addFeesView.render();
                        Opf.Factory.createDialog(addFeesView.$el, {
                            destroyOnClose: true,
                            title: '批量新增费率',
                            autoOpen: true,
                            width: 600,
                            height: 480,
                            modal: true,
                            buttons: [{
                                type: 'submit',
                                click: function () {
                                    console.log("add fees");
                                }
                            },{
                                type: 'cancel'
                            }]
                        })
                    });*/
                } else {
                    Opf.scrollToError(me.$el);
                }
            });
        },

        updateUI: function () {
            // 1,更新“代理商奖励”模块
            // 2，更新“商户费用”模块和“代理商费用“模块”
        
            this.ui.awardSection.toggle(this.canShowBranchReward());
            this.ui.fixedFeeFrequency.toggle(this.canShowFixedFeeFrequency());
            this.ui.fixedFeeAmt.toggle(this.canShowFixedFeeAmt());
            this.ui.feeLabel.toggle(this.canShowFixedFeeAmt());
            this.ui.btnAddFee.toggle(this.canAddFee);
            this.ui.btnAddFees.toggle(this.canAddFees);

            this.ui.mchtFee.toggle(this.ui.target.val() == 1);
            this.ui.branchFee.toggle(this.ui.target.val() == 2);
            this.ui.mchtHandRate.toggle(this.ui.target.val() == 1);
            this.ui.branchHandRate.toggle(this.ui.target.val() == 2);

        },

        updatehandChargeRateSel: function () {
            var newValue = this.ui.target.val();

            if(this.cacheTarget != newValue) {
                //this.ui.handChargeRate.val("");
                this.setTodayFee();
                //CommonUI.feeSel(this.ui.handChargeRate, undefined, newValue); //TODO
            }

            this.cacheTarget = newValue;
        },

        canShowFixedFeeFrequency: function () {
            // 只有"按周期收费"才显示“收费周期”下拉框
            return this.ui.fixedFeeType.val() == 1;
        },

        canShowFixedFeeAmt: function () {
            // 只有费用收取方式不是免费的，才显示金额输入框
            return this.ui.fixedFeeType.val() != 2;
        },


        canShowBranchReward: function () {
            // 如果是面向商户并且不是完全开放的，则出现“代理商奖励”
            if (this.ui.target.val() == 1 && this.ui.activateWay.val() != 1) {
                return true;
            } else {
                return false;
            }

        },

        getValues: function () {
            var result = {};
            this.$el.find(':input[name]').each(function () {
                var name = $(this).attr('name');

                if ( !$(this).is(':visible') ) {
                    result[name] = '';
                    return;
                }

                if ( $(this).is(':checkbox') || $(this).is('radio') ) {
                    if ($(this).is('checked')) {
                        (result[name] = $(this).val());
                    }

                } else {
                    result[name] = $(this).val();

                }

            });

            return result;
        }

    });

});