/**
 * 过滤条件
 */
define([
	'tpl!assets/scripts/fwk/component/templates/search-select2.tpl',
    'moment.override'
], function(searchSelect2Tpl){

	return Marionette.ItemView.extend({

        template: searchSelect2Tpl,

        tagName: 'tr',

        className: 'search-select2',

        ui: {
            selectopts: 'select.selectopts',
            inputEle: '.input-elm[name]'
        },

		initialize: function (options) {
            this.options = options;
            this.render();
		},

        serializeData: function() {
            return {
                options: this.options
            }
        },

        _genOneRule: function (op, val) {
            return {
                "field": this.options.name,
                "op": op,
                "data": val
            };
        },

        onRender: function () {
            this.initSelect2(this.options.ajaxOpts);
        },

        initSelect2: function() {
            var ui = this.ui,
                options = this.options;

            ui.inputEle.select2({
                placeholder: '请选择'+options.label,
                minimumInputLength: 1,
                ajax: _.extend({
                    type: 'GET',
                    dataType: 'json',
                    data: function (term) {
                        return {
                            kw: encodeURIComponent(term)
                        };
                    },
                    results: function (data) {
                        return {
                            results: data
                        };
                    }
                }, options.ajaxOpts),
                id: function (e) {
                    return e.value;
                },
                formatResult: function(data, container, query, escapeMarkup){
                    return data.name;
                },
                formatSelection: function(data, container, escapeMarkup){
                    name = data.name;
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
        },

        getRules: function () {
            var ret = [],
                ui = this.ui;

            var opVal = ui.selectopts.val();
            var selVal = ui.inputEle.val();

            ret.push(this._genOneRule(opVal, selVal));

            return ret;
        }
	});
});