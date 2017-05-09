define(['underscore', 'moment.origin'],function(){

    moment.lang('zh-cn');

    var FORMAT = {
        PURE_YMD: 'YYYYMMDD',
        YM: 'YYYY/MM',
        YMD: 'YYYY/MM/DD',
        CnYMD:'YYYY年MM月DD日',
        HMS: 'HH:mm:ss',
        YMD_Hm: 'YYYY-MM-DD HH:mm'
    };


    /**
     * [_moment description]
     * @param  {[type]} date [description]
     * @param  {String} fmt  如果date是字符串，则fmt则是该字符串对应的日期格式
     * @return {Moment}      [description]
     */
    function _moment (date, fmt) {
        if(moment.isMoment (date)) {
            return date;
        } else if (date instanceof Date){
            return moment(date);
        } else if (_.isString(date)){
            var M = moment(date, fmt||"YYYYMMDDHHmmss");

            if(moment.isMoment(M)) {
                return M;
            }

            return moment(date);
        } else {
            return moment(date, fmt);
        }

    }

    /**
     * formatXxxx 格式化工具
     * @param  {String/Moment/Date} date [description]
     * @param  {String} fmt 如果date是字符串，则fmt则是该字符串对应的日期格式
     * @return {[type]}      [description]
     */
    var formatUtils = {
        formatYM: function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.YM);
        },

        formatYMD: function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.YMD);
        },

        formatHMS: function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.HMS);
        },

        formatCnFull:function (date, fmt) {
            return _moment(date, fmt).format('lll');
        },

        formatPureYMD: function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.PURE_YMD);
        },

        formatCnYMD: function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.CnYMD);
        },

        formatYMDHm: function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.YMD_Hm);
        },

        /**
         * @val {String} 字符串格式的日期
         * @fmt {String} 预期格式。如"YYYY/MM/DD HH:mm"
         * @return 返回格式化后的日期字符串。如2016/03/09 15:30
         */
        dateFormat: function(date, fmt) {
            return _moment(date, fmt).format(fmt||FORMAT.YMD);
        }
    };

    moment.utils = {};
    _.extend(moment.utils, formatUtils);

    _.each(formatUtils, function (func, name) {
        moment.fn[name] = function () {
            return formatUtils[name].call(null, this);
        };
    });
});