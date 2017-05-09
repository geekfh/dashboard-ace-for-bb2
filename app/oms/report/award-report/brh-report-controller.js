define(['app/oms/report/award-report/brh-common-report'], function(BrhCommonView) {

    var brhMonthViewConfig = {
        tabId: 'menu.brh.month.report',

        getGridName: function () {
            return 'brh-month';
        },

        getGridUrl: function () {
            return url._('report.brh.month');
        },

        getGridRsId: function () {
            return 'brh.month.report';
        },

        getRangeDatePickerConf: function () {
            var me = this;
            return {
                trigger: me.ui.dateTrigger,
                defaultValues: [me.momentStart, me.momentEnd],
                limitDate: moment(),
                displayFormat: 'YYYY/MM',
                valueFormat: 'YYYYMM'
            }
        },

        initDate: function () {
            this.startDate = formatMomentToStr(this.momentStart, 'YM');
            this.endDate = formatMomentToStr(this.momentEnd, 'YM');
        },

        dateFormatter: function (val) {
            return val ? Opf.String.replaceYM(val, 'YYYY年MM月') : '';
        }
    };

    var brhDayViewConfig = {
        tabId: 'menu.brh.day.report',

        getGridName: function () {
            return 'brh-day';
        },

        getGridUrl: function () {
            return url._('report.brh.day');
        },

        getGridRsId: function () {
            return 'brh.day.report';
        },

        getRangeDatePickerConf: function () {
            var me = this;
            return {
                trigger: me.ui.dateTrigger,
                defaultValues: [me.momentStart, me.momentEnd],
                limitDate: moment().subtract('day', 1),
                displayFormat: 'YYYY/MM/DD',
                valueFormat: 'YYYYMMDD'
            }
        },

        initDate: function () {
            this.startDate = formatMomentToStr(this.momentStart.subtract('day', 1), 'YMD');
            this.endDate = formatMomentToStr(this.momentEnd.subtract('day', 1), 'YMD');

        },

        dateFormatter: function (val) {
            return val ? Opf.String.replaceYMD(val, 'YYYY年MM月DD日') : '';
        }
    };

    var Controller = Marionette.Controller.extend({

        brhMonthReport: function() {
            var brhMonthView = BrhCommonView.extend(brhMonthViewConfig);

            App.show(new brhMonthView());

        },
        brhDayReport: function () {
            var brhDayView = BrhCommonView.extend(brhDayViewConfig);

            App.show(new brhDayView());
        }

    });

    function formatMomentToStr (date, style) {
        var reg=new RegExp('/','g');
        if(moment.isMoment (date)){
            if(style == 'YM'){
                return date.formatYM().replace(reg, '');
            }else{
                return date.formatYMD().replace(reg, '');
            }
        }else{
            return '';
        }
    }

    var ctrl = new Controller();

    App.on('branches:month:report', function () {
        ctrl.brhMonthReport();
    });

    App.on('branches:day:report', function () {
        ctrl.brhDayReport();
    });

    return ctrl;

});