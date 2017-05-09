define(['tpl!app/oms/message/common/templates/timeSelect.tpl', 'moment.override'], function(tpl) {
    var timeSelectView = Marionette.ItemView.extend({
        className: 'timeSelect',
        template: tpl,
        events: {

        },

        ui: {
            timeDD: 'input[name="time-dd"]',
            timeHH: 'select[name="time-hh"]',
            timeMM: 'select[name="time-mm"]'
        },

        initialize: function(options) {
            this.DD = '';
            this.HH = '';
            this.MM = '';
            this.render();
            this.options = options || {};
        },

        onRender: function() {
            this.attachTimeEvents();
        },

        attachTimeEvents: function() {
            var me = this;
            var minPushDate = moment().add('minute', 30);
            var ui = this.ui,
                $day = ui.timeDD,
                $hour = ui.timeHH,
                $minute = ui.timeMM;

            $day.datepicker({
                autoclose: true,
                startDate: me.options.startDate
            }).on('changeDate', function(ev){
                me.DD = moment(ev.date).formatPureYMD();
                var minHour = me.DD == minPushDate.formatPureYMD() ? minPushDate.get('hour') : 0;
                setMinHour($hour, minHour);
                $hour.trigger('change');
            });

            $hour.change(function(){
                me.HH = $(this).val();
                var minMinute;
                if(me.DD == minPushDate.formatPureYMD() && me.HH == minPushDate.get('hour')){
                    minMinute = minPushDate.get('minute');
                }else{
                    minMinute = 0;
                }
                setMinMinute($minute, minMinute);
                $minute.trigger('change');
            });

            $minute.change(function(){
                me.MM = $(this).val();
                me.trigger('getTime', me.getTime());
            });
        },

        getTime: function() {
            return this.DD + this.HH + this.MM;
        },

        setTime: function(value) {
            if(!value){ return; }
            var ui = this.ui;
            var date = moment(value, 'YYYYMMDDHHmm').formatCnYMD(),
                hour = value.substring(8,10),
                minute = value.substring(10,12);

            setMinHour(ui.timeHH, 0);
            setMinMinute(ui.timeMM, 0);

            this.DD = value.substring(0,8);
            this.HH = hour;
            this.MM = minute;

            ui.timeDD.val(date);
            ui.timeHH.val(hour);
            ui.timeMM.val(minute);
        }   
        
    });

    function setMinHour(el, hour) {
        var optionsHtml = [];
        for(var i = hour; i < 24; i++){
            var _i = i < 10 ? ('0' + i) : i;
            optionsHtml.push('<option value='+ _i +'>'+ i +'点</option>');
        }

        $(el).empty().append(optionsHtml.join(''));
    }

    function setMinMinute(el, minute) {
        var optionsHtml = [];
        for(var i = minute; i < 60; i++){
            var _i = i < 10 ? ('0' + i) : i;
            optionsHtml.push('<option value='+ _i +'>'+ i +'分</option>');
        }

        $(el).empty().append(optionsHtml.join(''));
    }

    return timeSelectView;
});