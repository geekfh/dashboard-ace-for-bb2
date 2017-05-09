define([
    'tpl!assets/scripts/fwk/component/templates/edit-zbank.tpl',
    'common-ui'
], function (tpl, CommonUI) {
    var MAX_LENGTH = 20;

    var View = Marionette.ItemView.extend({
        className: 'edit-zbank',

        template: tpl,

        ui: {
            zbankTipRow: '.zbank-tip-row',
            editZbankBtnRow: '.edit-zbank-btn-row',

            editZbankForm: '.edit-zbank-form',

            zbankNameModifiedRow: '.zbankNameModified-row',
            zbankNameModifiedTxt: '.zbankNameModifiedTxt',

            province: 'select[name="province"]',
            city: 'select[name="city"]',
            region: 'select[name="country"]',
            zbankName: '[name="zbankName"]',
            zbankNo: '[name="zbankNo"]'
        },

        events: {
            'click .update-bank': 'editZBank',
            'click .confirm-update-zbank': 'submitUpdateZbank',
            'click .cancel-update-zbank': 'cancelEditZbank'
        },

        initialize: function (options) {
            this.bankCode = options.bankCode;
            this.taskId = options.taskId;
            this.$renderAfter = $(options.renderAfter);
            this.render();
        },

        onRender: function () {
            this.setup();
            this.$renderAfter.after(this.$el);
        },

        setup: function () {
            var ui = this.ui;

            CommonUI.address(ui.province, ui.city, ui.region);

            addSelect2(ui.zbankName, ui.region, this.bankCode);

            Opf.Validate.addRules(ui.editZbankForm,{
                rules: {
                    province: {required: true},
                    city: {required: true},
                    country: {required: true},
                    zbankName: {required: true}
                }
            });
        },

        editZBank: function () {
            var ui = this.ui;

            ui.editZbankForm.show();
            ui.zbankTipRow.hide();
            ui.editZbankBtnRow.hide();
        },

        cancelEditZbank: function () {
            var ui = this.ui;

            ui.zbankTipRow.show();
            ui.editZbankBtnRow.show();
            ui.editZbankForm.hide();
        },

        submitUpdateZbank: function () {
            var me = this;
            var ui = this.ui;

            if(!ui.editZbankForm.valid()) {return;}

            var zbankName = ui.zbankName.select2('data').name;
            var zbankNo = ui.zbankName.select2('data').value;

            Opf.ajax({
                type: 'PUT',
                url: url._('task.updatezbank', {id: me.taskId}),
                data: JSON.stringify({
                    zbankCode: ui.region.val(),//支行地区号
                    zbankName: zbankName,
                    zbankNo: zbankNo
                }),
                success: function () {
                    ui.zbankNameModifiedTxt.text(zbankName);
                    ui.zbankNameModifiedTxt.data('zbankNo', zbankNo);

                    ui.zbankNameModifiedRow.show();
                    ui.zbankTipRow.hide();
                    ui.editZbankForm.hide();

                    me.trigger('updatezbank.success');
                }
            });

            return false;
        }
    });

    function addSelect2($el, $regionCode, bankNo) {
        $el.select2({
            placeholder: '请选择支行',
            minimumInputLength: 1,
            width: '100%',
            ajax: {
                type: "get",
                autoMsg: false,
                url: 'api/system/options/zbank-name',
                dataType: 'json',
                data: function (term) {
                    return {
                        kw: encodeURIComponent(term),
                        regionCode: $regionCode.val(),
                        bankCode: bankNo,
                        maxLength: MAX_LENGTH
                    };
                },
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data){
                return "<div class='select-result'>" + data.name + "</div>";
            },
            formatSelection: function(data){
                return data.name;
            },
            formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
            formatInputTooShort: function (input, min) {
                var n = min - input.length;
                return "请输入至少 " + n + "个字符";
            },
            formatSearching: function () {
                return "搜索中...";
            },
            adaptContainerCssClass: function(classname){
                return classname;
            },
            escapeMarkup: function (m) {
                return m;
            }
        });
    }

    return View;
});