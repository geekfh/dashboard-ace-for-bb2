define(['app/oms/report/award-report/opr-common-report'], function(OprCommonView) {

    var oprMonthViewConfig = {
        tabId: 'menu.opr.month.report',

        getGridName: function () {
            return 'opr-month';
        },

        getGridUrl: function () {
            return url._('report.opr.month');
        },

        getGridRsId: function () {
            return 'opr.month.report';
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

    var oprDayViewConfig = {
        tabId: 'menu.opr.day.report',

        getGridName: function () {
            return 'opr-day';
        },

        getGridUrl: function () {
            return url._('report.opr.day');
        },

        getGridRsId: function () {
            return 'opr.day.report';
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

        oprMonthReport: function() {
            var oprMonthView = OprCommonView.extend(oprMonthViewConfig);

            App.show(new oprMonthView());

        },
        oprDayReport: function () {
            var oprDayView = OprCommonView.extend(oprDayViewConfig);

            App.show(new oprDayView());
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

    App.on('operators:month:report', function () {
        ctrl.oprMonthReport();
    });

    App.on('operators:day:report', function () {
        ctrl.oprDayReport();
    });

    return ctrl;

});