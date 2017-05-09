define([
    'tpl!assets/scripts/fwk/component/templates/area-no.tpl',
    'common-ui'
], function (areaTpl, CommonUI) {
    var AreaNoView = Marionette.ItemView.extend({
        template: areaTpl,
        className: 'address-panel',
        events: {
            'change [name="areaNo"]': 'onAreaNoChange',
            'click input': 'onClickInput'

        },
        ui: {
            province: '[name="province"]',
            city: '[name="city"]',
            areaNo: '[name="areaNo"]'
        },
        initialize: function (options) {
            this.render();
            this.$el.appendTo(options.appendTo);
        },
        onRender: function () {
            CommonUI.subAddress(this.ui.province, this.ui.city, this.ui.areaNo);

            this.$bindInput = this.$el.find('input');

            if (this.getOption('editType') === 'mul') {
                this.$bindInput.addClass('mul-input');

                this.$bindInput.tagsinput({
                    itemValue: function (item) {
                        return item.id;
                    },
                    itemText: function (item) {
                        return item.text;
                    }
                });
                this.$el.find('input').attr('readonly', 'readonly');

            } else {
                this.$bindInput.addClass('single-input');
                this.$bindInput.attr('name', 'single');

            }

            this.toggleAddress(false);
        },
        toggleAddress: function (toggle) {
            this.$el.find('.address-code').toggle(toggle);

            if (!toggle) {
                $(document).unbind('click.areaNo');
                this.bindDocuments = false;
            }
        },

        onClickInput: function (e) {
            e.stopPropagation();
            var me = this;
            this.toggleAddress(true);

            !this.bindDocuments && $(document).on('click.areaNo', function (e) {
                if(!$(e.target).hasClass('area-no-group')) {
                    me.toggleAddress(false);
                }
            });

            this.bindDocuments = true;
        },

        getAddress: function (value) {
            if (!value) {
                return;
            }

            var province = this.ui.province.find('option:selected').text(),
                city = this.ui.city.find('option:selected').text(),
                area = this.ui.areaNo.find('option:selected').text(), address = province;

            if (value.length > 2) {
                address += ('/' + city);
            }

            if (value.length > 4) {
                address += ('/' + area);
            }

            return address;
        },

        getAreaNoValue: function () {
            var result;

            if ((result = this.ui.areaNo.val()) !== 'all') {
                return result;

            } else if ((result = this.ui.city.val()) !== 'all') {
                return result;

            } else {
                return this.ui.province.val();

            }
        },

        onAreaNoChange: function (e) {
            var value = this.getAreaNoValue(),
                address = this.getAddress(value);

            if (!value) return;

            if (this.$bindInput.data('tagsinput')) {
                this.$bindInput.tagsinput('add', { id: value, text: address });

            } else {
                this.$bindInput.val(address);
                this.$bindInput.data('areaNo', value);
                this.toggleAddress(false);

            }
        },
        
        clearAreaNo: function () {
            this.$bindInput.val('');
            this.$bindInput.data('areaNo', '');
            this.ui.province.find('option.placeholder').prop('selected', true);
            this.ui.city.find('option.placeholder').prop('selected', true);
            this.ui.areaNo.find('option.placeholder').prop('selected', true);
        }
    });

    return AreaNoView;

});