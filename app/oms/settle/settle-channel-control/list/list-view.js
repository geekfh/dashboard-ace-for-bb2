/**
 * 清分清算/商户清算明细
 */
define(['App',
    'tpl!app/oms/settle/settle-channel-control/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/settle',
    'assets/scripts/fwk/component/common-search-date',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
], function(App, tableCtTpl, settleLang, SearchDate) {

    var CHECK_STAT_MAP = {
        "0":"未对账",
        "1":"对账中",
        "2":"对账成功",
        "3":"对账失败"
    };

    var SETTLESTATE_MAP = {
        0: '未处理',
        1: '清算中',
        2: '清算成功',
        3: '清算失败'
    };

    var SETTLE_FLAG_MAP = {
        0: "不参与结算",
        1: "参与汇总结算"
    };
    //var SETTLE_FLAG_MAP = {
    //    "0":"未清算",
    //    "1":"待清算"
    //};

    var checkStateFormatter = function(val){
        return CHECK_STAT_MAP[val] || '';
    };

    var settleFlagFormatter = function(val) {
        return SETTLE_FLAG_MAP[val] || '';
    };

    var oprNoFormatter = function(val){
        return val == 0? '':val;
    };

    var settleStateFormatter = function(val){
        return SETTLESTATE_MAP[val] || '';
    };

    var doSettle4Channel = function(me, rowData){
        var tpl = [
            '<form onsubmit="return false;" >',
                '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
                    '<tbody>',
                        '<tr class="FormData">',
                            '<td class="CaptionTD" style="padding-right:10px;">处理描述:</td>',
                            '<td class="DataTD">',
                                '<textarea name="oprDesc" style="width:300px; height:150px;"></textarea>',
                            '</td>',
                        '</tr>',
                    '</tbody>',
                '</table>',
            '</form>'
        ].join('');

        var $form = $(tpl);
            $form.validate({
                rules: {
                    oprDesc: {
                        maxlength: 340
                    }
                }
            });

        var uri;
        if(rowData.clearFlag=="0"){
            uri = url._('settle.channel.control.doSecond');
            var curTabPanel = App.getCurTabPaneEl();
            var filters = $('.filters', curTabPanel);
            var settleDateInput = $('input.settleDate-filter-input', filters);
            var settleDate = settleDateInput.val();
        } else {
            uri = url._('settle.channel.control.do', {id: rowData.id});
        }

        /*if(_.isArray(rowData)){
            uri = url._('settle.channel.control.doSecond');
            ids = _.map(rowData, function(value){
                return value.id;
            });
        } else {
            uri = url._('settle.channel.control.do', {id: rowData.id});
            ids = [];
        }*/

        var $dialog = Opf.Factory.createDialog($form, {
            destroyOnClose: true,
            title: '清算处理',
            autoOpen: true,
            width: 420,
            height: 280,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    if(!$form.validate().form()) return;

                    var oprDesc = $(this).find('[name="oprDesc"]').val();
                    var params = { oprDesc: oprDesc };
                    settleDate && (params.settleDate = settleDate);

                    $(this).closest('.ui-dialog').find('button[type="submit"]').prop('disabled', true).text('提交中...');
                    Opf.ajax({
                        type: 'PUT',
                        jsonData: params,
                        url: uri,
                        success: function () {
                            me.grid.trigger('reloadGrid', [{current:true}]);
                        },
                        complete: function () {
                            $dialog.dialog('close');
                        }
                    });
                }
            }, {
                type: 'cancel'
            }]
        });
    };

    return Marionette.ItemView.extend({
        tabId: 'menu.settle.channel.control',
        template: tableCtTpl,

        onRender: function() {
            var me = this;
            _.defer(function() {
                me.renderGrid();
            });
        },

        renderGrid: function() {
            var me = this;

            var grid = me.grid = App.Factory.createJqGrid({
                rsId:'settle.channel.control',
                gid: 'settle-channel-control-grid',
                url: url._('settle.channel.control'),
                caption: "渠道清算控制",
                filters: [
                    {
                        caption: '条件过滤',
                        components: [
                            {
                                type: 'date',
                                ignoreFormReset: true,
                                defaultValue: moment(),
                                label: '清算日期',
                                name: 'settleDate',
                                options:{
                                    sopt: ['eq','gt','lt']
                                }
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ],
                actionsCol: {
                    edit: false,
                    del : false,
                    view: false,
                    canButtonRender: function (name, opts, rowData) {
                        var settleState = rowData.settleState;
                        var checkState = rowData.checkState;
                        //带清算状态不显示清算链接）
                        if(name == "changestate" && settleState == "1") {
                            return false;
                        }
                        if(name == "changestate" && settleState == "2"){
                            return false;
                        }
                        if(name == 'changestate' && checkState == "1" ){
                            return false;
                        }
                    },
                    extraButtons: [{
                        name: 'changestate', icon: 'icon-opf-state-change', title: '点击清算',
                        click: function (name, opts, rowData) {
                            doSettle4Channel(me, rowData);
                        }
                    }]
                },
                nav: {
                    actions: {
                        add: false
                    },

                    view: {
                        width: Opf.Config._('ui', 'mchtSettleDetail.grid.viewform.width'),
                        height: Opf.Config._('ui', 'mchtSettleDetail.grid.viewform.height')
                    },

                    search: {
                        customComponent: {
                            items: [{//放大镜面板里，外部filter组件
                                type: 'singleOrRangeDate',
                                label: '清算日期',
                                limitRange: 'month',
                                name: 'settleDate'
                            }]
                        },
                        // 点击重置按钮时，搜索条件保留以下值
                        resetReserveValue: [
                            {
                                field: 'settleDate',
                                op: 'eq',
                                data: moment().format('YYYYMMDD')
                            }
                        ],
                        afterRedraw: function(){
                            $(this).find('select.opsel').prop('disabled',true);
                        }
                    }

                },
                colNames: {
                    _settleFlag: "清算渠道",
                    id: "id",
                    settleDate: "清算日期", //清算日期
                    cupNo: "渠道编号", //渠道编号
                    cupName: "渠道名称", //渠道名称0
                    checkState: "对账标识", //对账标识 0-未对账 ，1-对账中 ，2-对账成功， 3-对账失败
                    settleFlag: "清算标识", //清算标识
                    clearFlag: "一清标识", //一清标识 0-二清，1-一清
                    settleState: "清算状态",
                    oprNo: "处理人员", //处理人员
                    oprDate: "处理日期", //处理日期
                    oprDesc: "处理描述"
                },
                colModel: [
                    {name: '_settleFlag', width:80, sortable: false, align:'center'},
                    {name: 'id', hidden: true},
                    {name: 'settleDate', sortable: false},
                    {name: 'cupNo', sortable: false},
                    {name: 'cupName', sortable: false},
                    {name: 'checkState', sortable: false, formatter: checkStateFormatter},
                    {name: 'settleFlag', sortable: false, formatter: settleFlagFormatter},
                    {name: 'clearFlag', sortable: false, hidden: true},
                    {name: 'settleState', formatter: settleStateFormatter},
                    {name: 'oprNo', sortable: false, formatter: oprNoFormatter},
                    {name: 'oprDate', sortable: false},
                    {name: 'oprDesc', sortable: false}
                ],
                mergeRowspan: function(rowspan1, rowspan2, rowsData){
                    var jqgrows = grid.find("tr.jqgrow"),
                        rowLength = jqgrows.length,
                        that = this, isTdLast = false
                        ;
                    //合并二清数据
                    $.each(jqgrows, function(idx){
                        var row = $(this);
                        var tdFirst = row.find("td:first");
                        var tdLast = row.find("td:last");
                        //从0位置开始合并row2行
                        if(rowspan2>0 && idx==0){ //二清
                            tdFirst.attr('rowspan', rowspan2).text('二清渠道').addClass('action-col');
                            tdLast.attr('rowspan', rowspan2);

                            /*var handler = tdLast.find("a").removeAttr('onclick');
                            handler.length && handler.bind('click', function(){
                                var extraButtonsConfig = that.actionsCol.extraButtons;
                                var changeStateConfig = _.findWhere(extraButtonsConfig, {name:"changestate"});
                                changeStateConfig.click && changeStateConfig.click.call(that, "changestate", {settleFlag:"1"}, rowsData);
                            });*/

                            isTdLast = true;
                        } else if(rowspan1>0 && idx==rowspan2){ //一清
                            tdFirst.attr('rowspan', rowspan1).text('一清渠道').addClass('action-col');
                            isTdLast = false;
                        } else if(idx>=(rowspan1+rowspan2) && idx<rowLength){ //未知
                            tdFirst.text('未知渠道');
                            isTdLast = false;
                        } else {
                            tdFirst.hide();
                            isTdLast && tdLast.empty().hide();
                        }
                    });
                },
                loadComplete: function(data){
                    var that = this;
                    if(data.content && data.content.length){
                        var jsonData = data.content,
                            rowspan1 = 0, //一清渠道
                            rowspan2 = 0, //二清渠道
                            rowsData = [];
                        _.each(jsonData, function(v, i){
                            v['clearFlag']==1 && ++rowspan1;
                            v['clearFlag']==0 && ++rowspan2 && rowsData.push(v);
                        });
                        that.mergeRowspan(rowspan1, rowspan2, rowsData);
                    }
                }
            });
        }
    });
});