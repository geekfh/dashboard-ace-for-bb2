/**
 * User hefeng
 * Date 2016/6/29
 */
define([
    'assets/scripts/fwk/component/ajax-select',
    'tpl!app/oms/operate/coupon/templates/add.tpl',
    'select2'
], function(AjaxSelect, addTplFn) {
    return Marionette.ItemView.extend({
        className: 'coupon-add',

        template: addTplFn,

        ui: {
            form: 'form',
            mchtNo: '[name="mchtNo"]',
            couponValue: '[name="discountCouponDtlId"]',
            couponCount: '[name="couponCount"]',
            remark: '[name="remark"]',
            count: '#coupon_count',
            total: '#coupon_total'
        },

        validation: {
            rules: {
                mchtNo: {
                    required: true,
                    number: true,
                    mchtNoValid: true
                },
                discountCouponDtlId: {
                    required: true
                },
                couponCount: {
                    required: true,
                    intGtZeroAndFive: true
                }
            }
        },

        onRender: function() {
            var me = this,
                ui = me.ui;

            var $dialog = Opf.Factory.createDialog(this.$el, {
                title: '添加记录',
                destroyOnClose: true,
                autoOpen: true,
                width: 480,
                height: 480,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function () {
                        if(ui.form.validate().form()) {
                            var $btn = $(this).closest('.ui-dialog').find('button[type="submit"]');

                            Opf.UI.ajaxBusyText($btn);
                            Opf.ajax({
                                type: 'post',
                                url: url._('operate.discount.coupon'),
                                jsonData: me.getValues(),
                                success: function() {
                                    $dialog.dialog('close');
                                    me.trigger('submit:success');
                                }
                            });
                        }
                    }
                },{
                    type: 'cancel'
                }],
                create: function() {
                    var flag = false;
                    var msg = '';
                    jQuery.validator.addMethod("mchtNoValid", function(value, element, param) {
                        Opf.ajax({
                            type: 'GET',
                            async: false,
                            url: 'api/discountCoupon/validate/'+ value,
                            success: function(resp){
                                flag = resp.status;
                                msg = resp.msg;
                            }
                        });
                        return this.optional(element) || flag;
                    }, function(){
                        return msg;
                    });
                    Opf.Validate.addRules(ui.form, me.validation);
                }
            });

            me.renderEl("couponValue");
            me.renderVal();
        },

        renderEl: function(type) {
            var me = this,
                ui = me.ui;

            switch(type) {
                /*case "mchtNo":
                    ui.mchtNo.select2({
                        placeholder: '请选择商户',
                        minimumInputLength: 1,
                        width: 260,
                        ajax: {
                            type: "get",
                            url: url._('operate.discount.coupon.mchtName'),
                            dataType: 'json',
                            data: function (text) {
                                return {
                                    mchtName: encodeURIComponent(text)
                                };
                            },
                            results: function (data, page) {
                                return {
                                    results: data
                                };
                            }
                        },
                        id: function (item) {
                            return item.no;
                        },
                        formatResult: function(data, container, query, escapeMarkup){
                            return data.name;
                        },
                        formatSelection: function(data, container, escapeMarkup){
                            return data.name;
                        }
                    });

                    ui.mchtNo.on('change', function() {
                        ui.form.validate().element(this);
                    });

                    break;*/

                case "couponValue":
                    new AjaxSelect(ui.couponValue, {
                        value: "",
                        placeholder: '- 请选择优惠券面值 -',
                        convertField: {
                            name: 'couponValue',
                            value: 'id'
                        },
                        ajax: {
                            url: url._('operate.discount.coupon.get')
                        }
                    });
                    break;

                default:
                    break;
            }
        },

        renderVal: function() {
            var ui = this.ui;

            Opf.ajax({
                type: 'get',
                url: url._('operate.discount.coupon.total'),
                success: function(resp) {
                    ui.count.text(resp.totalCount);
                    ui.total.text(resp.totalMoney);
                }
            })
        },

        getValues: function() {
            var $form = this.ui.form;
            var postData = {},
                els = $form.find('[name]:visible');

            $.each(els, function(){
                var el = $(this);
                postData[el.attr('name')] = el.val();
            });

            return postData;
        }
    })
});
