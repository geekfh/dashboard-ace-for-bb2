/**
 * User hefeng
 * Date 2016/7/18
 */
define([
    'tpl!app/demo/others/datetimepicker/templates/demo.tpl',
    'bootstrap-datepicker', 'bootstrap-datetimepicker'
], function(datetimepickerTpl) {

    // 配置视图
    return Marionette.ItemView.extend({
        // TAB唯一标识
        tabId: 'demo.menu.others.datetimepicker',

        template: datetimepickerTpl,

        className: "jqueryui-datetimepicker-sample",

        ui: {
            form: '[role=form]',
            time: '[name=time]',
            bsDate: '[name=bsDate]',
            inputGroup: '.input-group.date>input',
            inputRange: '.input-daterange',
        },

        onRender: function () {
            var me = this;

            me.createTimepicker();

        },

        createTimepicker: function () {
            var me = this,
                ui = me.ui;

            $.fn.datepicker.defaults.format = "mm/dd/yyyy";
            $.fn.datepicker.defaults.autoclose = true;
            $.fn.datepicker.defaults.clearBtn = true;

            ui.time.datepicker({
                startDate: '-7d',
                endDate: '0d'
            });

            ui.inputGroup.datepicker({
                startDate: '-7d',
                endDate: '0d',
                autoclose: true
            });

            ui.bsDate.datetimepicker({
                //format: 'yyyy-mm-dd hh:ii',
                //startDate: '-7d'
            });

             /*ui.inputRange.each(function() {
                $(this).datepicker("clearDates");
            });*/

            /*$.datetimepicker.setLocale('ch');

            me.ui.time.datetimepicker({
                lang: 'ch',
                format: 'Y-m-d H:i'
            });*/

            //me.ui.time.datepicker({ currentText: 'Now' });
        }
    });

});