define([
    'tpl!app/oms/route/oneSettle/templates/mcht-filters.tpl',
    'assets/scripts/fwk/component/common-filters-fieldset',
    'assets/scripts/fwk/component/common-select-areano'
], function (tpl, FiltersFieldset, AreaNoView) {

    var FILTERS_ITEM = {
        caption: '条件过滤',
        canClearSearch: true,
        components: [
            {
                label: '所属通道',
                name: 'channelName',
                type: 'select',
                options:{
                    sopt: ['lk']
                }
            },{
                label: '商户编号',
                name: 'mchtNo',
                options:{
                    sopt: ['lk']
                }
            },{
                label: '地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;区',
                name: 'regionCode',
                options:{
                    sopt: ['lk'],
                    dataInit: function (elem) {
                        var $el = $(elem);
                        var areaNoView = new AreaNoView({
                            appendTo: $el.closest('.filter-form-group')
                        });

                        areaNoView.ui.areaNo.on('change', function () {
                            var areaNo = areaNoView.getAreaNoValue();
                            $el.val(areaNo).trigger('change');
                        });

                        $el.closest('.filter-group-content').hide();
                        $el.on('change.clearInput', function () {
                            // 当隐藏的 input 输入框的值为空时，才去触发清空事件
                            if($(this).val() === ''){
                                areaNoView.clearAreaNo();
                            }
                        });
                    }
                }
            },{
                label: '费&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;率',
                name: 'rate',
                options: {
                    sopt:['eq','ne', 'lt', 'gt']
                },
                inputmask:{
                    decimal: true
                }
            },{
                label: '封&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;顶',
                name: 'maxFee',
                options: {
                    sopt:['eq','ne', 'lt', 'gt']
                },
                inputmask:{
                    decimal: true
                }
            },{
                label: '备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注',
                name: 'remark',
                options: {
                    sopt:['lk']
                }
            }
        ],
        searchBtn: false,
        setChannelNameValues: function (value) {
            this.components[0].options.value = value;
        }
    };

    var View = Marionette.ItemView.extend({
        template: tpl,
        ui:{
            channelName: '[name="channelName"]',
            rate:        '[name="rate"]',
            regionCode:  '[name="regionCode"]',
            maxFee:      '[name="maxFee"]',
            filters:     '.mcht-filters'
        },
        triggers: {
            'click .btn-search': 'submit',
            'click .btn-cancel': 'cancel'
        },

        initialize: function () {
            var me = this;
            ajaxChannelName(function (data) {
                FILTERS_ITEM.setChannelNameValues(data);
                me.render();
            });
        },

        onRender: function () {
            var me = this;
            this.renderFilterView();
            this.$el.hide();

            if(this.getOption('trigger')) {
                $(this.getOption('trigger')).on('click', function () {
                    me.$el.toggle();
                });
            }

            this.getOption('appendTo') && this.$el.appendTo(this.getOption('appendTo'));
        },


        renderFilterView: function () {
            this.filters = new FiltersFieldset(FILTERS_ITEM);
            this.filters.$el.appendTo(this.ui.filters);
        },

        onCancel: function () {
            this.$el.toggle(false);
        },

        validate: function () {
            return true;
        },

        getStrFilters: function () {
            return this.filters.getFilterValue();
        }
    });


    function ajaxChannelName (callback) {
        Opf.ajax({
            url: url._('route.channel.name'),
            type: 'GET',
            success: function (resp) {
                var result = {};

                _.each(resp, function (item) {
                    result[item.value] = item.name;
                });

                callback && callback (result);
            }
        });
    }

    return View;
});