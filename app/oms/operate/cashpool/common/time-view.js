define(['tpl!app/oms/operate/cashpool/common/time-view.tpl'], function (tpl) {

    var view = Marionette.ItemView.extend({
        template: tpl,
        events: {
            'change .start-hour': 'onStartHourChange',
            'change .end-hour': 'onEndHourChange'
        },

        ui: {
            startHour: '.start-hour',
            endHour: '.end-hour'
        },
        onRender: function () {
            //this.attachTimeEvents();
            this.initHour();
        },
        initHour: function () {
            //console.log($('.123').val());
            this.setHour('.start-hour', 0, 23);
            this.setHour('.end-hour', 0, 23);
            this.$el.find('.start-hour').val('00');
            this.$el.find('.end-hour').val('23');

        },
        onStartHourChange: function () {
            var ui = this.ui,
                starHour = ui.startHour.val(),
                endHour = ui.endHour.val();
            this.endHourLimit(starHour);
            ui.endHour.val(endHour);
        },
        onEndHourChange: function () {
            var ui = this.ui,
                starHour = ui.startHour.val(),
                endHour = ui.endHour.val();
            this.startHourLimit(endHour);
            ui.startHour.val(starHour);
        },
        startHourLimit: function (endHour) {
            this.setHour('.start-hour', 0, endHour);
        },
        endHourLimit: function (starHour) {
            this.setHour('.end-hour', starHour, 23);
        },
        setHour: function (el, minHour, maxHour) {
            var optionsHtml = [];
            for (var i = minHour; i <= maxHour; i++) {
                var _i = i < 10 ? ('0' + i) : i;
                var val = i < 10 ? ('0'+i+'0000'): (i+'0000');
                optionsHtml.push('<option value = '+val+' num=' + i + '>' + _i + ':00</option>');
            }

            this.$el.find(el).empty().append(optionsHtml.join(''));
        }
    });
    //function getTpl(){
    //    return[
    //        '<select name="start-hour"></select>',
    //        ' - ',
    //        '<select name="end-hour"></select>'
    //    ].join('');
    //
    //
    //}


    return view;
});


