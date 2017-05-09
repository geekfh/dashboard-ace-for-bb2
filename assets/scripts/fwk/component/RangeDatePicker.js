define([
    'tpl!assets/scripts/fwk/component/templates/daterange.tpl',
    'marionette',
    'moment.override'
], function(tpl, Marionette) {

    var BTN_TPL = [
        '<li data-end="{endDate}" data-start="{startDate}">',
        '<button class="quick-btn">{text}</button>',
        '</li>'
    ].join('');

    var HINT_TPL = '<span class="hint">提醒：只能选择同一个月内的日期</span>';

    function m () { return moment(); }

    function getInitRange () {
        return {
            daily: [
                { text: '昨天', value: [m().subtract('day', 1), m()]},
                { text: '过去一周', value: [m().subtract('day', 6), m()]},
                { text: '过去两周', value: [m().subtract('day', 13), m()]},
                { text: '过去四周', value: [m().subtract('day', 27), m()]}
            ],
            weekly: [
                { text: '过去四周', value: [m().subtract('day', 27), m()]},
                { text: '本季度', value: [m().startOf('quarter'), m()]},
                { text: '过去半年', value: [m().subtract('month', 5), m()]},
                { text: '今年', value: [m().startOf('year'), m()]}
            ],
            monthly: [
                { text: '本季度', value: [m().startOf('quarter'), m()]},
                { text: '过去半年', value: [m().subtract('month', 5), m()]},
                { text: '过去一年', value: [m().subtract('month', 11), m()]},
                { text: '今年', value: [m().startOf('year'), m()]}
            ]
        };
    }

    var STR_REPLACE_MAP = {
        'YYYY/MM/DD': Opf.String.replaceYMD,
        'YYYY/MM': Opf.String.replaceYM,
        'YYYYMMDD': Opf.String.replaceYMD,
        'YYYYMM': Opf.String.replaceYM
    };

    var limitDate = false;
    var View = Marionette.ItemView.extend({

        className: ' none-select',

        template: tpl,

        ui: {
            hackFocusInput: '.hack-focus',
            startY: '.start-y',
            startM: '.start-m',
            startD: '.start-d',
            endY: '.end-y',
            endM: '.end-m',
            endD: '.end-d',
            error: '.error',

            quickBtnsWrap: '.quick-btns-wrap',
            dateRangeWrap: '.date-range',

            yWrap: '.y-select-wrap',
            mWrap: '.m-select-wrap',
            dWrap: '.d-select-wrap'
        },

        events: {
            'click .btn.cancel': 'close',
            'click .btn.ok': 'submit',
            'click .quick-btn': 'onQuickItemClick'
        },

        /**
         * [initialize description]
         * 支持配置：
         * {
         *     limitDate: moment//可选最后日期，只允许选择该日期之前的日期 ----可选
         *     trigger: dom//点击的dom ----必填
         *     limitRange: 'string'//范围限制 TODO ----可选
         *     textHolder: dom//显示文字的dom
         *     displayFormat: 'YYYY/MM' //展示在界面上的日期格式 ----可选
         *     valueFormat: 'YYYYMM'  //设置值的日期格式 ----可选
         * }
         *
         */
        initialize: function (options) {
            var me = this;
            var defaults = {
                displayFormat: 'YYYY/MM/DD',
                valueFormat: 'YYYYMMDD'
            };

            this.options = $.extend({}, defaults, options);

            this.textHolder = this.options.textHolder || this.options.trigger;

            this.initRange = getInitRange();

            limitDate = options.limitDate || false;



            this.render();

            this.options.limitRange && this.setLimitRange();

            //TODO move
            if(this.options.trigger) {
                $(this.options.trigger).on('click.daterangepicker', function () {
                    me.toggle();
                });
            }
        },

        setLimitRange: function () {
            var me = this;
            var limitRange = this.getOption('limitRange');
            switch(limitRange){
                case 'weekly': break;
                case 'month': me.limitInMonth(); break;
                case 'quarter':  break;
                default:
                    if(typeof limitRange == 'number'){

                    }
                    break;
            }
        },

        limitInMonth: function () {
            var $startY = this.ui.startY;
            var $endY = this.ui.endY;
            var $startM = this.ui.startM;
            var $endM = this.ui.endM;

            //限制为同一个月内，因此年改变时为同一年，月改变时为同一月
            $startY.on('change.startY', function(){
                $endY.val($startY.val()).triggerHandler('change.updateMonths');
            });
            $endY.on('change.endY', function(){
                $startY.val($endY.val()).triggerHandler('change.updateMonths');
            });

            $startM.on('change.startM', function(){
                $endM.val($startM.val()).triggerHandler('change.updateDays');
            });
            $endM.on('change.endM', function(){
                $startM.val($endM.val()).triggerHandler('change.updateDays');
            });
            this.ui.dateRangeWrap.append(HINT_TPL);
        },

        onQuickItemClick: function (e) {
            var $li = $(e.target).closest('li');
            var startDate = $li.attr('data-start');
            var endDate = $li.attr('data-end');
            if(startDate && endDate) {
                this.setStartValue(startDate);
                this.setEndValue(endDate);
            }
            this.submit();
        },

        today: function () {
            var day = m();
            this.setStartValue(day);
            this.setEndValue(day);
        },

        thisWeek: function () {
            var day = m().startOf('week');
            this.setStartValue(day);
            this.setEndValue(day.endOf('week'));
        },

        thisMonth: function () {
            var day = m().startOf('month');
            this.setStartValue(day);
            this.setEndValue(day.endOf('month'));
        },

        setDefaultValue: function () {
            //TODO 当天日期使用后台给的日期
            var defaultValues = this.getOption('defaultValues');
            var valueFormat = this.getOption('valueFormat');
            var limitDate = this.getOption('limitDate');

            var startDate = m().subtract('day', 1);
            var endDate = m();

            // 如果配置了可选最后日期, 则默认设置起始日期为该日期前一天，结束日期为该日期
            if(limitDate){
                startDate = limitDate.clone().subtract('day', 1);
                endDate = limitDate.clone();
            }

            // 如果配置了默认日期, 则以默认日期为准
            if(defaultValues){
                startDate = defaultValues[0];
                endDate = defaultValues[1];
            }

            this.setStartValue(startDate);

            this.setEndValue(endDate);

            // 配置了默认日期时才显示具体日期的 text
            defaultValues && this.updateTextHolder();

        },

        //别重构这两个setXXValue
        setStartValue: function (y, m, d) {
            if(y.length === 6) {
                y = moment(y, 'YYYYMM');
            }
            if(y.length === 8) {
                y = moment(y, 'YYYYMMDD');
            }
            if(moment.isMoment(y)) {
                m = y.get('month') + 1;
                d = y.get('date');
                y = y.get('year');
            }
            this.ui.startY.val(y);
            this.ui.startY.triggerHandler('change.updateMonths');
            this.ui.startM.val(twoDigit(m));
            this.ui.startM.triggerHandler('change.updateDays');
            this.ui.startD.val(twoDigit(d));
        },

        setEndValue: function (y, m, d) {
            if(y.length === 6) {
                y = moment(y, 'YYYYMM');
            }
            if(y.length === 8) {
                y = moment(y, 'YYYYMMDD');
            }
            if(moment.isMoment(y)) {
                m = y.get('month') + 1;
                d = y.get('date');
                y = y.get('year');
            }
            this.ui.endY.val(y);
            this.ui.endY.triggerHandler('change.updateMonths');
            this.ui.endM.val(twoDigit(m));
            this.ui.endM.triggerHandler('change.updateDays');
            this.ui.endD.val(twoDigit(d));
        },

        validate: function (strStart, strEnd) {
            if(strStart && strEnd && strStart > strEnd) {
                this.ui.error.text('起始日期 不能超过 结束日期').show();
                return false;
            }
            this.ui.error.text('').hide();
            return true;
        },

        getStartDate: function () {
            var ui = this.ui;
            var strStart = _.invoke([ui.startY, ui.startM, ui.startD], 'val').join('');
            return strStart;
        },

        getEndDate: function () {
            var ui = this.ui;
            var strEnd = _.invoke([ui.endY, ui.endM, ui.endD], 'val').join('');
            return strEnd;
        },

        updateTextHolder: function () {

            var strStart = this.getStartDate();
            var strEnd = this.getEndDate();

            if(this.textHolder) {
                $(this.textHolder).text(formatDateRangeText.call(this, strStart, strEnd));
            }
        },

        submit: function () {
            var ui = this.ui;
            var FORMAT_STYLE = this.getOption('valueFormat');
            var strReplace = STR_REPLACE_MAP[FORMAT_STYLE];

            var strStart = this.getStartDate();
            var strEnd = this.getEndDate();

            if(!this.validate(strStart, strEnd)) {
                return;
            }

            this.updateTextHolder();

            this.trigger('submit', {
                startDate: strReplace(strStart, FORMAT_STYLE),
                endDate: strReplace(strEnd, FORMAT_STYLE)
            });

            this.close();
        },

        close: function () {
            this.$el.hide();
        },

        // 销毁范围日期选择框时候同时删除打开范围日期的按钮事件
        onDestroy: function () {
            this.options.trigger.off('click.daterangepicker');
        },

        onRender: function () {
            var ui = this.ui;
            var me = this;

            select(ui.startY, ui.startM, ui.startD);
            select(ui.endY, ui.endM, ui.endD);

            this.$el.hide();

            this.setDefaultValue();

            this.$el.appendTo(document.body);

            this.renderDateSelect();

            this.$el.on('keydown', function (e) {
                if(e.keyCode === 27) {
                    me.close();
                }
            });
        },

        renderDateSelect: function () {
            // 根据配置 displayFormat 来显示或隐藏界面上的 年月日 select 框
            // 如 ‘YYYY/MM’ 则只显示 年 和 月
            var ui = this.ui;
            var displayFormat = this.getOption('displayFormat');
            var yearMatch = /YYYY/, monthMatch = /MM/, dayMatch = /DD/;

            var canShowYear = yearMatch.test(displayFormat);
            var canShowMonth = monthMatch.test(displayFormat);
            var canShowDay = dayMatch.test(displayFormat);

            ui.yWrap.toggle(canShowYear);
            ui.mWrap.toggle(canShowMonth);
            ui.dWrap.toggle(canShowDay);

            if(!canShowDay){
                this.updateRangesByName('monthly');
            }else{
                this.updateRangesByName('daily');
            }
        },

        toggle: function () {
            //TODO refactor
            if(this.$el.is(':visible')){
                this.close();
            }else {
                this.show();
            }
        },

        show: function () {
            var me = this;

            _.defer(function () {
                me.ui.hackFocusInput.focus();
            });
            this.$el.show();
        },

        updateRanges: function (ranges) {
            var me = this;
            var valueFormat = this.getOption('valueFormat');
            var btnHtml, strHtml = '';
            var availNum = 0;
            _.each(ranges, function(item){

                // 配置了可选最后日期时，如果起始日期超过了该日期时，则不显示该快速选择按钮
                // 配置了限制日期范围为同一个月时，如果超过同一个月，则不显示该快速选择按钮
                if(me.canRenderQuickBtn(item)){
                    availNum ++;
                    var strStart = item.value[0].format(valueFormat);
                    var strEnd = item.value[1].format(valueFormat);

                    // 配置了可选最后日期时，
                    // 如果结束日期超过了该日期时，则设置该快速选择按钮的结束日期为该日期
                    if(limitDate){
                        if(item.value[1].format(valueFormat) - limitDate.format(valueFormat) > 0){
                            strEnd = limitDate.format(valueFormat);
                        }
                    }

                    btnHtml = Opf.String.substitute(BTN_TPL,{
                        text: item.text,
                        startDate: strStart,
                        endDate: strEnd
                    });

                    strHtml += btnHtml;
                }
            });

            this.ui.quickBtnsWrap.empty().append(strHtml);
            if(availNum > 0){
                this.ui.quickBtnsWrap.find('li').css('width', parseInt(100/availNum, 10) + '%');
            }
        },

        updateRangesByName: function (frequency) {
            this.updateRanges(this.initRange[frequency]);
        },

        canRenderQuickBtn: function (item) {
            var me = this;
            var valueFormat = this.getOption('valueFormat');
            var limitRange = this.getOption('limitRange');
            var limitDate = this.getOption('limitDate');
            var startDate = moment(item.value[0]).format(valueFormat);
            var endDate = moment(item.value[1]).format(valueFormat);

            // 配置了可选最后日期时， 如果起始日期大于等于该日期时，则不显示该快速选择按钮
            if(limitDate){
                if(item.value[0].format(valueFormat) - limitDate.format(valueFormat) >= 0)
                    return false ;
            }

            // 配置了限制日期范围为同一个月时，如果超过同一个月，则不显示该快速选择按钮
            if(limitRange && limitRange == 'month'){
                if(me.getStrDateMonth(startDate) != me.getStrDateMonth(endDate)){
                    return false;
                }
            }
            return true;
        },

        getStrDateMonth:function (strDate){
            var displayFormat = this.getOption('displayFormat');
            return moment(strDate, displayFormat).get('month') + 1;
        }

    });

    //TODO 后续确保start end 都是满格式
    function formatDateRangeText(start, end) {
        var FORMAT_STYLE = this.getOption('displayFormat');

        var strReplace = STR_REPLACE_MAP[FORMAT_STYLE];

        if (start === end) {
            return strReplace(start, FORMAT_STYLE);
        } else {
            return strReplace(start, FORMAT_STYLE) + ' ~ ' + strReplace(end, FORMAT_STYLE);
        }
    }

    var DAYS_OF_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function getMaxDay (year, month) {
        // 如果有配置可选最后日期，并且选中的‘年’和‘月’都等于该日期的‘年’和‘月’
        // 则最大可选日为该日期的日。
        if(moment.isMoment(limitDate) && limitDate.get('year') == year && limitDate.get('month')+1 == month){
            return limitDate.get('date');
        }else{
            return  month == 2 ? //是二月吗2
                (isLeapYear(year) ? 29 : 28) :
                DAYS_OF_MONTH[parseInt(month, 10)-1];
        }

    }

    function getMaxMonth (year) {
        // 如果有配置可选最后日期，并且选中的‘年’等于该日期的‘年’
        // 则最大可选月为该日期的‘月’。
        if(moment.isMoment(limitDate) && limitDate.get('year') == year){
            return limitDate.get('month') + 1;
        }else return 12;
    }

    var FROM_YEAR = 2010;

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    var _cacheDaysOptions = {};
    var _cacheMonthsOptions = {};
    function select ($y, $m, $d) {

        genDefaultYearOptions();
        genDefaultMonthOptions();

        $y.on('change.updateMonths', function() {
            var maxMonths = getMaxMonth($y.val());

            var oldMonth = $m.val();
            $m.html(genMonthOptionsByMax(maxMonths));
            if (oldMonth && parseInt(oldMonth, 10) <= maxMonths) {
                $m.val(oldMonth);
            }
            $m.triggerHandler('change.updateDays');
        });

        $y.add($m).each(function() {
            $(this).on('change.updateDays', function() {
                var maxDays = getMaxDay($y.val(), $m.val());

                var oldDay = $d.val();
                $d.html(genDayOptionsByMax(maxDays));
                if (oldDay && parseInt(oldDay, 10) <= maxDays) {
                    $d.val(oldDay);
                }
            });
        });

        $m.triggerHandler('change.updateDays');

        function genDayOptionsByMax (maxDay) {
            if(_cacheDaysOptions[maxDay]) {
                return _cacheDaysOptions[maxDay];
            }
            var arr = [], ret, day;
            for(var i = 1; i <= maxDay; i++){
                day = twoDigit(i);
                arr.push('<option value="' + day + '">' + day + '</option>');
            }
            ret =  arr.join('');
            _cacheDaysOptions[maxDay] = ret;
            return ret;
        }

        function genMonthOptionsByMax (maxMonth) {
            if(_cacheMonthsOptions[maxMonth]) {
                return _cacheMonthsOptions[maxMonth];
            }
            var arr = [], ret, month;
            for(var i = 1; i <= maxMonth; i++){
                month = twoDigit(i);
                arr.push('<option value="' + month + '">' + month + '</option>');
            }
            ret =  arr.join('');
            _cacheMonthsOptions[maxMonth] = ret;
            return ret;
        }

        function genDefaultYearOptions () {
            var momToday = m();
            var todayYear = momToday.get('year');
            var arr = [], val;
            for(var i = FROM_YEAR; i <= todayYear; i++) {
                val = twoDigit(i);
                arr.push('<option value="' + val + '">' + val + '</option>');
            }
            $y.html(arr.join(''));
        }

        function genDefaultMonthOptions () {
            var arr = [], val;
            for(var i = 1; i <= 12; i++) {
                val = twoDigit(i);
                arr.push('<option value="' + val + '">' + val + '</option>');
            }
            $m.html(arr.join(''));
        }
    }

    function twoDigit (str) {
        var tmp = parseInt(str, 10);
        return tmp < 10 ? ('0' + tmp) : tmp;
    }

    return View;
});