/**
 * 带信息日历控件
 * 作者：何锋
 * 邮箱：hefeng@iboxpay.com
 * 日期：2015/9/8
 */
define([
    'jquery',
    'moment.override'
], function($) {

    //日历默认数据模型
    var obj = {
        date: new Date(),
        year: -1, month: -1,
        pickerArr: []
    };

    //日历模板结构
    var htmlObj = {
        header: "",
        container: "",
        footer: ""
    };

    var handlerBar = null, tid = "J_opf_calendar";

    //设置初始化数据
    var setPickerData = function(url, param){
        var params = $.param(param);
        $.ajax({
            type: 'GET',
            url: url+"?"+params,
            async: false,
            dataType: 'json',
            success: function(data){
                obj.pickerArr = data;
                return true;
            },
            error: function(){
                return false;
            }
        });
    };

    //默认变量
    var g_vars = {
        url: '', //日历描述请求地址
        fields: [] //需要显示的“描述”字段
    };
    var datePickerWithInfo = function(options){
        if(typeof options === "string"){
            return methods[options]();
        } else {
            handlerBar = options.handlerBar;
            $.extend(g_vars, options);
            pickerEvent.Init();
            return "";
        }
    };

    var methods = {
        setVars: function(vars){
            $.extend(g_vars, vars);
        },
        refresh: function(){
            commonUtil.appendTds();
        }
    };

    var pickerEvent = {
        Init: function () {
            console.log(">>>begin init datepicker");
            commonUtil.doInit();
        },
        getLast: function () {
            dateUtil.getLastDate();
            commonUtil.doInit();
        },
        getNext: function () {
            dateUtil.getNexDate();
            commonUtil.doInit();
        },
        getToday:function(){
            dateUtil.getCurrent();
            commonUtil.doInit();
        },
        remove: function () {
            var $tid = $("#"+tid);
            $tid.remove();
        },
        isShow: function () {
            var $tid = $("#"+tid);
            return !!$tid.length;
        }
    };

    var pickerHtml = {
        getHeader: function(){
            var header = '<div class="opf_calendar_header pkg_double_month">';
                header += '<a href="javascript:void(0);" title="上一月" id="picker_last" class="arrow_left">上一月</a>';
                header += '<p class="caption"><span>' + obj.year + '年' + obj.month + '月</span></p>';
                header += '<a href="javascript:void(0);" title="下一月" id="picker_next" class="arrow_right ">下一月</a>';
                header += '</div>';

            htmlObj.header = header;
        },
        getContainer: function(){
            var thead = _getThead();
            //var tbody = _getTbody();
            var tfoot = _getTfoot();

            //thead
            function _getThead(){
                var thead = "<thead>";
                    thead += '<tr class="calendar_week">';
                    thead += '<th class="holiday">日</th>';
                    thead += '<th>一</th>';
                    thead += '<th>二</th>';
                    thead += '<th>三</th>';
                    thead += '<th>四</th>';
                    thead += '<th>五</th>';
                    thead += '<th class="holiday">六</th>';
                    thead += '</tr>';

                return thead+"</thead>";
            }

            //tfoot
            function _getTfoot(){
                var tfoot = "<tfoot>";

                return tfoot+"</tfoot>";
            }

            //container
            var container = '<div class="opf_calendar_container"><table>';
                container += thead;
                //container += tbody;
                container += tfoot;
                container += '</table></div>';

            htmlObj.container = container;
        },
        getFooter: function(){
            var footer = '<div class="opf_calendar_footer">';
                footer += '<button class="btn btn-sm btn-default" id="picker_today">回到今天</button>';
                footer += '&nbsp;&nbsp;';
                footer += '<button class="btn btn-sm btn-danger" id="picker_close">关闭</button>';
                footer += '</div>';

            htmlObj.footer = footer;
        }
    };

    var dateUtil = {
        //检测今天之前
        ltToday: function(day){
            day = day<10? "0"+day:""+day;
            var SpecialToDate = this.getTxDate()+day;
            var SpecialTo = moment(SpecialToDate, "YYYYMMDD");
            return moment().diff(SpecialTo, 'days')>0; //pass
        },

        //检测今天之后
        gtToday: function(day){
            var SpecialToDate = this.getTxDate()+day;
            var SpecialTo = moment(SpecialToDate, "YYYYMMDD");
            return moment().diff(SpecialTo, 'days')<0; //future
        },

        //检测是否当天
        eqToday: function(day){
            day = day<10? "0"+day:""+day;
            var SpecialToDate = this.getTxDate()+day;
            var SpecialTo = moment(SpecialToDate, "YYYYMMDD");
            return SpecialTo.isSame(moment(), 'day'); // Returns true if is today
        },

        //检测是否当天
        checkToday: function(day){
            return obj.year==new Date().getFullYear()&&obj.month==new Date().getMonth()+1&&day==new Date().getDate();
        },

        //获取日期(YYYYMM)
        getTxDate: function(){
            var year = obj.year;
            var month = obj.month<10? "0"+obj.month:obj.month;
            return ""+year+month;
        },

        //根据日期得到星期
        getWeek: function () {
            var d = new Date(obj.year, obj.month - 1, 1);
            return d.getDay();
        },
        //得到一个月的天数
        getLastDay: function () {
            var new_year = obj.year;//取当前的年份
            var new_month = obj.month;//取下一个月的第一天，方便计算（最后一不固定）
            var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期
        },
        getCurrent: function () {
            var dt = obj.date;
            obj.year = dt.getFullYear();
            obj.month = dt.getMonth() + 1;
            obj.day = dt.getDate();
        },
        getLastDate: function () {
            if (obj.year == -1) {
                var dt = new Date(obj.date);
                obj.year = dt.getFullYear();
                obj.month = dt.getMonth() + 1;
            }
            else {
                var newMonth = obj.month - 1;
                if (newMonth <= 0) {
                    obj.year -= 1;
                    obj.month = 12;
                }
                else {
                    obj.month -= 1;
                }
            }
        },
        getNexDate: function () {
            if (obj.year == -1) {
                var dt = new Date(obj.date);
                obj.year = dt.getFullYear();
                obj.month = dt.getMonth() + 1;
            }
            else {
                var newMonth = obj.month + 1;
                if (newMonth > 12) {
                    obj.year += 1;
                    obj.month = 1;
                }
                else {
                    obj.month += 1;
                }
            }
        }
    };

    var commonUtil = {
        doInit: function(){
            //尝试删除日历控件
            pickerEvent.remove();

            if (obj.year == -1) {
                dateUtil.getCurrent();
            }
            for (var item in pickerHtml) {
                pickerHtml[item]();
            }

            var html = '<div id="'+tid+'" class="opf_calendar" style="display: block; position: absolute;">';
                html += htmlObj.header;
                html += htmlObj.container;
                html += htmlObj.footer;
                html += "</div>";
            var $target = $(html).appendTo(document.body);

            var $elem = $(handlerBar);
            var elemOffset = $elem.offset();
            var elemPosTop = elemOffset.top-5;
            var elemHeight = $elem.height();
            var targetHeight = $target.height();

            var elemOffsetLeft = elemOffset.left;
            //var elemOffsetLeft = elemPosLeft>=targetWidth? elemOffset.left-targetWidth:elemOffset.left+elemWidth;
            var elemOffsetTop = elemPosTop>=targetHeight? elemOffset.top-targetHeight-5:elemOffset.top+elemHeight+5;

            $target.css({
                left: elemOffsetLeft+"px",
                top: elemOffsetTop+"px",
                zIndex: "99"
            });

            $("#picker_last", $target).on('click', pickerEvent.getLast);
            $("#picker_next", $target).on('click', pickerEvent.getNext);
            $("#picker_today", $target).on('click', pickerEvent.getToday);
            $("#picker_close", $target).on('click', pickerEvent.remove);

            this.appendTds();

            return $target;
        },
        appendTds: function(){
            var $target = $("#"+tid);
            var $thead = $target.find("table>thead");
            var $tbody = $target.find("table>tbody");
            var $source = $(this.getTbody());

            $tbody.remove();
            $thead.after($source);

            //绑定日历事件
            var tds = $source.find("a");
            tds.bind('click', function(){
                var self = $(this);
                if($.isFunction(g_vars.pickerOnClick)){
                    g_vars.pickerOnClick.call(self);
                }
            });
        },
        getTbody: function(){
            //首先获取数据
            setPickerData(g_vars.url, {
                txDate: dateUtil.getTxDate()
            });

            var days = dateUtil.getLastDay();
            var week = dateUtil.getWeek();
            var tbody = '<tbody>';
            var index = 0;
            for (var i = 1; i <= 42; i++) {
                if (index == 0) {
                    tbody += "<tr>";
                }

                var c = week > 0 ? week : 0;
                var day = i-c;

                if ((i-1) >= week && day <= days) {
                    var item = commonUtil.getItem(day);

                    var itemStr = "";
                    var cssStyle = "";

                    //有数据返回
                    if(item !== -1) {
                        cssStyle += 'on';

                        var fields = g_vars.fields;
                        for(var j=0; j<fields.length; j++){
                            var field = fields[j];
                            if(!!item[field]){
                                itemStr += '<span class="info day_info_'+field+'">'+item[field]+'</span>';
                            }
                        }
                    }

                    //单条数据不存在的情况下，采用默认的
                    item = item==-1? {
                        txDate: ""+obj.year
                            + (obj.month<10? "0"+obj.month:""+obj.month)
                            + (day<10? "0"+day:""+day)
                    }:item;

                    //判断今天
                    var isToday = false;
                    if(dateUtil.checkToday(day)){
                        isToday = true;
                    }

                    //生成数据
                    tbody += '<td '+(cssStyle&&('class="'+cssStyle)+'"')+'>';

                    //如果是今天以前的日期则不能再次配置费率
                    if(dateUtil.ltToday(day)){
                        tbody += '<div class="day_item">';
                        tbody += '<span class="day day_info_date">'+day+'</span>';
                        tbody += itemStr;
                        tbody += '</div>';
                    } else {
                        tbody += '<a class="day_item" href="javascript:void(0);"';
                        $.each(item, function(k, v){ tbody += ' data-'+k+'="'+v+'"'; });
                        tbody += '>';
                        tbody += '<span class="day day_info_date'+(isToday? " today":"")+'">'+(isToday? day+"<sub>今天</sub>":day)+'</span>';
                        tbody += itemStr;
                        tbody += '</a>';
                    }

                    tbody += '</td>';

                    if (index == 6) {
                        tbody += '</tr>';
                        index = -1;
                    }
                }
                else {
                    tbody += "<td></td>";
                    if (index == 6) {
                        tbody += "</tr>";
                        index = -1;
                    }
                }
                index++;
            }
            return tbody+"</tbody>";
        },
        getItem: function (day) {
            var dt = ""+obj.year;
            var month = obj.month<10? "0"+obj.month:""+obj.month;
                day = day<10? "0"+day:""+day;
                dt += month;
                dt += day;

            for (var i = 0; i < obj.pickerArr.length; i++) {
                if (obj.pickerArr[i].txDate == dt) {
                    return obj.pickerArr[i];
                }
            }
            return -1;
        }
    };

    return datePickerWithInfo;
});