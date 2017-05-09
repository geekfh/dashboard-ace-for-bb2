/**
 * 过滤条件
 */
define([
	'tpl!assets/scripts/fwk/component/templates/search-date.tpl',
	'assets/scripts/fwk/component/RangeDatePicker',
    'bootstrap-datepicker',
    'moment.override'
], function(tpl, RangeDatePicker){

    var SOPT_MAP = {
        eq: '等于',
        range: '范围'
    };

    var DEFAULT_DATE_FMT = 'YYYYMMDD';

	var dateView = Marionette.ItemView.extend({

        //@config
        label:'日期',

        //@config
        name: 'date',

        //@config
        dateFormat: DEFAULT_DATE_FMT,

        //@config
        defaultValue: {
            eq: moment().format('YYYY-MM-DD'),
            range:[moment().subtract('day', 1).format(DEFAULT_DATE_FMT), moment().format(DEFAULT_DATE_FMT)]
        },

        template: tpl,

        tagName: 'tr',

        className: 'search-date',

        formatSubmitDate: function (str) {
            return str;
        },

		events: {
		},

        ui: {
            colValue: '.col-value',
            singleDateInput: '.single-date-input',
            rangeDateBtn: '.range-date-btn',
            colLabel: '.col-label',
            columns: '.columns',
            selectopts: '.selectopts',
            data: '.data'
        },

		initialize: function (options) {

            this.rangeDateView = null;//范围选择的组件

            //选择范围操作的时候设置
            this.startDate = null;
            this.endDate = null;

            this.defaultValue = this.getOption('defaultValue') || {};

            this.render();
		},

        attachEvents: function () {
            var me = this,
                ui = this.ui;

            //切换 操作的时候切换显示对应的“值”组件
            this.ui.selectopts.on('change.toggleinput', function () {

                var isShowForSingle = $(this).val() === 'eq';
                ui.singleDateInput.toggle(isShowForSingle);
                ui.rangeDateBtn.toggle(!isShowForSingle);

            }).trigger('change.toggleinput');//触发一下切换操作，显示对应组件

        },

        onRender: function () {
            this.setLabel();
            this.attachEvents();

            this.buildOnlyDate();
            this.buildRangeDate();
        },

        setLabel: function () {
            this.$el.find('.label-text').text(this.getOption('label'));
        },

        buildOnlyDate: function () {
            this.ui.singleDateInput.datepicker({
                autoclose: true,
                format: 'yyyymmdd'
            });
            
            if(this.defaultValue.eq) {
                this.ui.singleDateInput.datepicker('update', this.defaultValue.eq);
            }
        },

        buildRangeDate: function () {
            var me = this;
            var range = this.defaultValue.range;

            var ranOptions = {
                trigger: this.ui.rangeDateBtn,
                textHolder: this.ui.rangeDateBtn
            };

            if(this.getOption('limitRange')){
                ranOptions.limitRange = this.getOption('limitRange');
            }

            if(range) {
                ranOptions.defaultValues = range;
                me.startDate = range[0];
                me.endDate = range[1];
            }

            this.rangeDateView = new RangeDatePicker(ranOptions);

            this.rangeDateView.on('submit', function(obj) {
                me.startDate = obj.startDate;
                me.endDate = obj.endDate;
            });
        },

        _genOneRule: function (op, val) {
            return {
                "field": this.getOption('name'),
                "op": op,
                "data": val
            };
        },

        getRules: function () {
            var me = this,
                ui = me.ui;

            var opVal = ui.selectopts.val();
            var ret = [];

            if(opVal === 'eq') {
                ret.push(this._genOneRule('eq', me.formatSubmitDate(ui.singleDateInput.val())));
            }
            else if (opVal === 'range') {
                ret.push(this._genOneRule('ge', me.formatSubmitDate(me.startDate)));
                ret.push(this._genOneRule('le', me.formatSubmitDate(me.endDate)));
            }

            return ret;
        }

	});

	return dateView;

});