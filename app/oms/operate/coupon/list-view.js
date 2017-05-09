/**
 * Created by wupeiying on 2015/12/3.
 */
define([
    'App', 'jquery.jqGrid', 'moment.override',
    'app/oms/settle/trade-txn/list/list-controller' //综合查询下的交易流水信息
], function(App) {
    // 导入格式化工具
    var mUtils = moment.utils;

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="discount-coupon-grid-table"></table>',
        '<div id="discount-coupon-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    //注意！！修改此处 renderGrid条件判断也要同步修改。
    var COUPONOBJTYPE_MAP = {
        1: '商户',
        2: '机构'
    };
    var COUPONSTATUS_MAP = {
        '-1':'未激活',
        '0' :'可用',
        '1' :'已用',
        '2' :'已过期'
    };
    var COUPONTYPE_MAP = {
        1: '免扣券',
        2: '体验券',
        3: '服务费折扣券',
        4: '手续费折扣券',
        5: '限额折扣券'
    };
    var COUPONMODE_MAP = {
        1: '按金额',
        2: '按比例',
        3: '按笔数'
    };
    var COUPONUSEDFLOW_MAP = {
        'ALL': '全部流程',
        'TONE': 'T+1刷卡',
        'TZERO': 'T+0当天',
        'TREAL': 'T+0实时',
        'WCHT': '微信',
        'ALPY': '支付宝'
    };

    //时间格式化
    var dateTimeFormatter = function(val) {
        return val? mUtils.dateFormat(val, 'YYYY/MM/DD HH:mm:ss') : "";
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.discount.coupon',
        events: {},

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        renderGrid: function () {
            var me = this;

            var grid = App.Factory.createJqGrid({
                rsId: 'discountCoupon',
                caption: '',
                filters: [//注意：搜索条件有增加，要注意couponObjType判断条件
                    {
                        caption: '搜索',
                        isSearchRequired: true,//查询条件至少填写一项
                        defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '优惠券归属',
                                name: 'couponObjType',
                                type: 'select',
                                options: {
                                    sopt: ['eq'],
                                    value: COUPONOBJTYPE_MAP,
                                    change: function(input, rules){
                                        if(rules == '商户'){
                                            input.$el.find('[data-index="5"]').show();
                                            input.$el.find('[data-index="4"]').hide();//机构隐藏
                                            input.$el.find('[data-index="4"]').find('.couponObjNo-filter-input').select2('data','');//清空
                                        }
                                        else if(rules == '机构'){
                                            input.$el.find('[data-index="4"]').show();
                                            input.$el.find('[data-index="5"]').hide();//商户隐藏
                                            input.$el.find('[data-index="5"]').find('.couponObjNo-filter-input').select2('data','');//清空
                                        }
                                    }
                                }
                            },
                            {
                                label: '优惠券类型',
                                name: 'couponType',
                                type: 'select',
                                options: {
                                    sopt: ['eq'],
                                    value: COUPONTYPE_MAP
                                }
                            },
                            {
                                label: '适用交易',
                                name: 'couponUsedFlow',
                                type: 'select',
                                options: {
                                    sopt: ['eq'],
                                    value: COUPONUSEDFLOW_MAP
                                }
                            },
                            {
                                label: '优惠券类型',
                                name: 'couponStatus',
                                type: 'select',
                                options: {
                                    sopt: ['eq'],
                                    value: COUPONSTATUS_MAP
                                }
                            },
                            {
                                label: '机构',
                                name: 'couponObjNo',
                                type: 'select2',
                                options: {
                                    sopt: ['eq'],
                                    select2Config: {
                                        placeholder: '--请选择机构--',
                                        minimumInputLength: 1,
                                        width: 200,
                                        ajax: {
                                            type: 'GET',
                                            url: url._('report.tree.searchOrg'),
                                            dataType: 'json',
                                            data: function (term, page) {
                                                return {
                                                    kw: encodeURIComponent(term),
                                                    number: page - 1
                                                };
                                            },
                                            results: function (data, page) { // 返回除分页信息外的内容，要正确过滤备选项就在这里操作
                                                var more = page < data.totalPages,
                                                //过滤非直接下属机构
                                                    content = _.filter(data.content, function (item) {
                                                        return item.orgLevel >= Ctx.getUser().get('brhLevel');
                                                    });
                                                return {
                                                    results: content
                                                    //more: more
                                                };
                                            }
                                        },
                                        // 如果不设ID，将不能选择列表
                                        id: function (e) {
                                            return e.id;
                                        },
                                        //格式化备选项，显示给用户。对每一个数组元素都执行此方法，data即为数组元素
                                        formatResult: function (data, container, query, escapeMarkup) {
                                            return data.name;
                                        },
                                        formatSelection: function(data){
                                            return data.name;
                                        }
                                    },
                                    valueFormat: function (select2Data) {
                                        return select2Data.id;
                                    }
                                }
                            },
                            {
                                label: '商户号',
                                name: 'couponObjNo'
                            },
                            {
                                label: '发放时间',
                                name: 'createTime',
                                type: 'rangeDate',
                                //limitRange: 'month',
                                //limitDate: moment(),
                                defaultValue: [moment().subtract('month', 1), moment()]
                            },
                            {
                                label: '发放人',
                                name: 'oprName',//oprId
                                type: 'text',
                                options: {
                                    sopt: ['eq']
                                }
                                //options: {
                                //    sopt: ['eq'],
                                //    select2Config: {
                                //        placeholder: '--请选择发放人--',
                                //        minimumInputLength: 1,
                                //        width: 200,
                                //        ajax: {
                                //            type: 'GET',
                                //            url: url._('operate.discount.coupon.userName'),
                                //            dataType: 'json',
                                //            data: function (term) {
                                //                return {
                                //                    userName: encodeURIComponent(term)
                                //                };
                                //            },
                                //            results: function (data) {
                                //                return {
                                //                    results: data
                                //                };
                                //            }
                                //        },
                                //        id: function (e) {
                                //            return e.oprId;
                                //        },
                                //        formatResult: function(data){
                                //            return data.oprName;
                                //        },
                                //        formatSelection: function(data){
                                //            return data.oprName;
                                //        }
                                //    },
                                //    valueFormat: function (select2Data) {
                                //        return select2Data.oprId;
                                //    }
                                //}
                            },{
                                label: '备注',
                                name: 'remark'
                            }
                        ],
                        searchBtn: {
                            id: 'discountCouponSearch',
                            text: '搜索'
                        }
                    }],
                nav: {
                    actions: {
                        search: false,
                        addfunc: function() {
                            require(['app/oms/operate/coupon/add-view'], function(AddView) {
                                var addView = new AddView();
                                addView.render();
                                addView.on('submit:success', function() {
                                    grid.trigger('reloadGrid', {current:true});
                                })
                            })
                        }
                    }
                },
                actionsCol: {
                    edit: false,
                    del: false
                },
                gid: 'discount-coupon-grid',
                url: url._('operate.discount.coupon'),
                colNames: {
                    id:'',
                    couponObjType:'优惠券归属', //1商户  2机构
                    couponObjNo:'优惠券归属编号', //商户编号或机构编号
                    userName:'发放人', 
                    refObjType:'推荐人', //1商户  2机构
                    refObjNo:'推荐人', //商户编号或机构编号
                    couponStartTime:'开始时间',//开始时间
                    couponEndTime:'结束时间', //结束时间
                    couponValue:'使用面值', //使用面值
                    couponStatus:'优惠券的状态', //-1未激活   0 可用   1已用   2 已过期
                    orderNo:'订单号',
                    userPhone:'用户手机号',
                    couponType:'优惠券类型', //1免扣券；1免扣券；2体验券；3服务费折扣券；4手续费折扣券；5限额折扣券
                    couponMode:'优惠券参与方式', //1按金额  2按比例  3按笔数
                    couponUsedFlow:'适用交易', //ALL：全部流程； TONE：T+1刷卡；TZERO：T+0当天；TREAL：T+0实时；WCHT：微信；ALPY：支付宝,
                    remark: '备注'
                },
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'couponObjType', formatter: function(val){return COUPONOBJTYPE_MAP[val] || '' }},
                    {name: 'couponObjNo'},
                    {name: 'userName'},
                    {name: 'refObjType', formatter: function(val){return COUPONOBJTYPE_MAP[val] || '' }},
                    {name: 'refObjNo'},
                    {name: 'couponStartTime',formatter: dateTimeFormatter},
                    {name: 'couponEndTime', formatter: dateTimeFormatter},
                    {name: 'couponValue'},
                    {name: 'couponStatus', formatter: function(val){return COUPONSTATUS_MAP[val] || '' }},
                    {name: 'orderNo', formatter: function(val, opts, rowData){
                        return val? '<a href="javascript:void(0);" onclick="App.__events__.jumpTo_tradeTxn(this);" data-row-createTime="'+rowData.createTime+'">'+val+'</a>':'';
                    }},
                    {name: 'userPhone'},
                    {name: 'couponType', formatter: function(val){return COUPONTYPE_MAP[val] || '' }},
                    {name: 'couponMode', formatter: function(val){return COUPONMODE_MAP[val] || '' }},
                    {name: 'couponUsedFlow', formatter: function(val){return COUPONUSEDFLOW_MAP[val] || '' }},
                    {name: 'remark', hidden:true}
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    App.__events__.jumpTo_tradeTxn = function(self){
        var $self = $(self);
        var orderNo = $self.text();
        var createTime = moment($self.attr('data-row-createTime'), 'YYYYMMDDhhmmss').formatPureYMD();
        var currentTime = moment().formatPureYMD();
        var filters = {"groupOp":"AND", "rules":[
            {"field":"orderNo","op":"eq","data":orderNo},
            {"field":"date","op":"ge","data":createTime},
            {"field":"date","op":"le","data":currentTime}
        ]};

        //设置默认查询信息
        var setDefaultValue = function(gridId, params){
            var timeout = setInterval(function(){
                var currentPanel = App.getCurTabPaneEl();
                var $grid = currentPanel.find('table#'+gridId);
                var gridComplete = _.isObject($grid.jqGrid('getGridParam', 'postData')); //$grid.find("tr").length>1;
                if(gridComplete){
                    clearInterval(timeout);

                    var postData = $grid.jqGrid('getGridParam', 'postData');

                    postData.filters = params;

                    $grid.jqGrid('setGridParam', {
                        datatype: 'json'
                    });
                    $grid.trigger("reloadGrid", [{page:1}]);
                }
            }, 100);
        };

        App.trigger('tradeTxn:list:query');
        setDefaultValue('trade-txn-grid-table', JSON.stringify(filters));
    };

    App.on('operate:discountCoupon:list', function () {
        App.show(new View());
    });

    return View;
});