define([
    'tpl!assets/scripts/fwk/component/templates/filters-fieldset.tpl',
    'assets/scripts/fwk/component/common-filters'
], function(tpl, Filters){
    /**
     *  
        {
            caption: '精准搜索',
            components: [
                {
                    label: '清算日期',(必填)
                    name:'settleDate',(必填)
                    type: text/select/date/rangeDate (如果不配，默认为text)(选填)
                    defaultValue: 'xxxx'/{startDate: 'xx', endDate: 'xx'}(用于日期范围)(选填)
                    options:{(选填)
                        sopt:['eq'],//'lk', 'nlk', 'llk', 'rlk', 'eq', 'ne', 'lt', 'le', 'gt', 'ge'
                        dataInit: function (elem) {
                            ...(elem为输入值的框框，你可以在它显示之前进行处理)
                        },
                        value: TYPE_MAP(仅用于配置select的选项值)
                    }
                },{...},{...}

            ],
            searchBtn: {
                text:'搜索',
                id:'xxx'
            }
        }
     */

    var defaultOptions = {
        caption: "", //fieldset标题
        searchBtn: null, //搜索按钮
        components: [], //查询条件
        canClearSearch: false, //是否显示清空按钮
        canSearchAll: true, //是否启用搜索按钮
        defaultRenderGrid: false, //默认是否显示表格数据
        isSearchRequired: false //是否必填查询条件
    };

    var fieldsetView = Marionette.ItemView.extend({

        className: 'condition-group',

        events: {
            'click .search-btn': 'clickSearchBtn',
            'click .cleanSearch': 'cleanSearch'
            //'click #filterSearchSubmit': 'clickFilterSearchSubmitBtn',
            //'click #accountSearch': 'clickAccountSearchBtn'
        },

        initialize: function (options) {
            var cOpts = _.clone(options);
            options = $.extend({}, defaultOptions, cOpts);

            this.options = options;

            this.render();
        },

        render: function () {
            var me = this;
            var options = this.options;
            this.$el.append($(tpl(options)));

            this.filters = new Filters({
                renderTo: this.$el.find('.filters'),
                items: options.components
            }).on('effect:input', function(filterRules){
                me.enableSeachBtn(filterRules.length > 0 || options.canSearchAll);
            });

            if(options.canClearSearch){
                var $clearBtn = $('<a href="#" class="cleanSearch">清空筛选条件</a>');
                me.$el.find('.fieldset-innerwrap').append($clearBtn);
            }

            this.checkSearchBtnEnable();
        },

        checkSearchBtnEnable: function () {
            var defaultValue = this.getFilterValue();
            var canSearchAll = this.options.canSearchAll;
            this.enableSeachBtn(!!defaultValue || canSearchAll);
        },

        clickSearchBtn: function (){
            var opts = this.options;
            var filterValues = this.getFilterValue();

            /**
             * opts {Object}
             * isSearchRequired {Boolean/Number} true:必须输入一项; number:必须输入{number}项;
             * isSearchRequiredMsg {String} 对"isSearchRequired"的修饰; 一般可以不设置
             */
            if(opts.isSearchRequired !== false){
                var filterValuesObj = filterValues? JSON.parse(filterValues):{rules:[]};
                // 这里需要去重，因为日历组件一个值占用2个rules长度
                var filterValuesLen = _.uniq(filterValuesObj.rules, function(item){ return item.field; }).length;
                var minLen = 1,
                    message = '请至少输入 1 项查询条件';

                if(_.isNumber(opts.isSearchRequired)) {
                    minLen = opts.isSearchRequired;
                    message = opts.isSearchRequiredMsg? opts.isSearchRequiredMsg:'请至少输入 '+ minLen +' 项查询条件';
                }

                if(filterValuesLen < minLen) {
                    // 给出页面提示
                    Opf.alert({
                        title: "搜索提示",
                        message: message
                    });

                    // 阻止submit
                    return;
                }
            }

            this.trigger('submit', filterValues);
        },

        /*clickFilterSearchSubmitBtn: function (){
            var flag = true;
            var filterValues = this.getFilterValue();
            var _filters = !_.isEmpty(filterValues) ? $.parseJSON(filterValues) : {};

            if(_.isEmpty(_filters) || _filters.rules.length < 1){
                //Opf.alert({
                //    title: "搜索提示",
                //    message: "请至少输入一项查询条件！"
                //});

                flag = false;
            }
            return flag;
            //var opts = this.options;
            //var filterValues = this.getFilterValue();
            //var filterValuesObj = filterValues? JSON.parse(filterValues):{rules:[]};
            //if(postData.filters == undefined && filterValuesObj.rules.length ==0){
            //    Opf.alert({
            //        title: "搜索提示",
            //        message: "请至少输入一项查询条件！"
            //    });
            //    postData.filters = false;
            //}
        },*/

        /*clickAccountSearchBtn: function (){
            var opts = this.options;
            var filterValues = this.getFilterValue();
            var filterValuesObj = filterValues? JSON.parse(filterValues):{rules:[]};
            if(filterValuesObj.rules.length < 2){
                Opf.alert({
                    title: "用户查询条件",
                    message: "请至少输入两项查询条件, 用户类型为必填。"
                });
                return;
            }
            this.trigger('submit', filterValues);
        },*/

        enableSeachBtn: function (toBeEnable) {
            this.$el.find('.search-btn').toggleClass('disabled', toBeEnable === false);
        },

        getFilterValue: function () {
            var filters,
                rules = this.filters.getValue().rules;
            if (rules.length > 0) {
                if(this.options.caption == '日志搜索'){
                        if(rules[0].field == 'model'){
                            rules[0].field = 'desc';
                            rules[0].op = 'lk';
                        }
                        if(rules.length > 1){
                        if(rules[1].field == 'resName'){
                            rules[0].field = 'desc';
                            rules[0].op = 'lk';
                            rules[0].data += '-' + rules[1].data;
                            delete rules[1];
                        }
                    }
                    if(rules.length > 2){
                        if(rules[2].field == 'type'){
                            rules[0].field = 'desc';
                            rules[0].op = 'lk';
                            rules[0].data += '-' + rules[2].data;
                            delete rules[2];
                        }
                    }
                }

                //if(rules[i].data.indexOf('-') > 0){
                //    $(rules[i].data).substr(1,arguments.length).replace('-', '');
                //}
                filters = JSON.stringify({
                    groupOp: 'AND',
                    rules: rules
                });
            }
            return filters;
        },

        cleanSearch: function () {
            this.filters.trigger('cleanSearch');
        }

    });

    return fieldsetView;

});