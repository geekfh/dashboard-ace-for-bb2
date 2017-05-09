/**
 * Created by wangdongdong on 2015/7/17.
 */
//新增调单退单时 弹出的大框
define([
        'i18n!app/oms/common/nls/settle',
        'tpl!app/oms/settle/cancel-order/templates/add.tpl',
        'jquery.jqGrid'
    ],
    function(settleLang,tpl){
        var STAT_MAP = {
                '0' : settleLang._('trade.txn.stat.0'),  //成功应答
                '1' : settleLang._('trade.txn.stat.1'),  //请求
                '2' : settleLang._('trade.txn.stat.2'),  //已冲正
                '3' : settleLang._('trade.txn.stat.3'),  //已撤销
                '4' : settleLang._('trade.txn.stat.4'),  //已确认
                '5' : settleLang._('trade.txn.stat.5'),  //部分退货
                '6' : settleLang._('trade.txn.stat.6'),  //全部退货
                '7' : settleLang._('trade.txn.stat.7')   //交易异常
            },
            SUBCODE_MAP = {
                '31' : settleLang._('trade.txn.sub.code.31'), //消费
                '30' : settleLang._('trade.txn.sub.code.30'), //余额查询
                '32' : settleLang._('trade.txn.sub.code.32'), //消费冲正
                '33' : settleLang._('trade.txn.sub.code.33'), //消费撤销
                '34' : settleLang._('trade.txn.sub.code.34'), //消费撤销冲正
                '35' : settleLang._('trade.txn.sub.code.35'),  //退货
                '51' : settleLang._('trade.txn.sub.code.31'), //消费
                '50' : settleLang._('trade.txn.sub.code.30'), //余额查询
                '52' : settleLang._('trade.txn.sub.code.32'), //消费冲正
                '53' : settleLang._('trade.txn.sub.code.33'), //消费撤销
                '54' : settleLang._('trade.txn.sub.code.34'), //消费撤销冲正
                '55' : settleLang._('trade.txn.sub.code.35')  //退货
            };
    var View = Marionette.ItemView.extend({
        tabId: 'menu.exception.cancelorder',
        template: tpl,
        onRender: function(){
            var me = this;
            //me.showDialog();
            _.defer(function(){
                me.renderGrid();
                me.doSetupUI();
            });
        },
        showDialog: function(addView){
            var me = this;
            //var tpl = ['<div id="search-order-dialog"></div>'].join('');
            me.$dialog = App.Factory.createDialog(addView.$el,{
                destroyOnClose: true,
                title: '查询订单',
                width: 1000,
                maxHeight: 600,
                appendTo: document.body,
                autoOpen: true,
                modal: true,
                buttons: [
                    {
                        type: 'submit',
                        text: '确认录入',
                        class:'confirm-insert',
                        click: function(){
                            me.confirmInsert();

                        }
                    },{
                        type: 'submit',
                        text:'确认并继续录入',
                        class:'continue-insert',
                        click: function(){
                            me.continueInsert();
                        }
                    },{
                        type: 'cancel'
                    }]
            });
            //App.addRegions({searchOrderRegion: "#search-order-dialog"});

        },
        doSetupUI: function(){
            //隐藏掉 全选框
            this.$el.find('#cb_add-cancelorder-grid-table').hide();
            //this.$el.append($(getTypeTpl()));
        },
        //确认录入
        confirmInsert: function(){
            var me = this;
            me.commonInsert(function(){
                me.$dialog.dialog('close');
                me.$el.trigger('reloadParentGrid');
            });
        },

        //继续录入
        continueInsert: function(){
            var me = this;
            me.commonInsert(function(){
                me.grid.trigger('reloadGrid');
            });
        },
        //录入公共部分
        commonInsert: function(callBack){
            var me = this;
            var selectedTradeIds = me.getSelectedTradeIds();
            var data = me.wrapData();
            if(!data){
                return;
            }
            this.addCommit(selectedTradeIds,data,callBack);
        },
        getSelectedTradeIds: function(){
            var me = this;
            var rowsData = _.map(me.grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
                return me.grid.jqGrid('getRowData', id);
            });
            return _.map(rowsData, function(rowData){
                return rowData.tradeId;
            })
        },
        //封装数据
        wrapData: function(){
            var me = this;
            var orderType = $('input[name = "orderType"]:checked').val();
            var selIDs = Opf.Grid.getSelRowIds(me.grid);
            var data = [];

            if(!selIDs || selIDs.length == 0){
                Opf.alert('未选中记录！');
                return;
            }
            if(!orderType){
                Opf.alert('未选中录入类型');
                return;
            }
            $.each(selIDs,function(i,elem){
                var rowData =me.grid.getRowData(elem);
                delete(rowData['_action_']);
                data.push($.extend(rowData,{type: orderType}));
            });
            return data;
            //return $.extend(rowData,{type: orderType});
        },
        //提交
        addCommit: function(selectedTradeIds, data,callBack){
            Opf.confirm('你已选择'+selectedTradeIds.length+'条交易流水，是否确认录入？',function(confirm){
                if(!confirm){
                    return;
                }
                var _me = this;
                _me.saveAjax = function(){
                	Opf.ajax({
                        type: 'POST',
                        url: url._('settle.cancelorder.search'),
                        jsonData: data,
                        success: function(){
                            callBack();
                        }
                    });
                }
                Opf.ajax({
                    type:'GET',
                    url: url._('settle.cancelorder.search.queryRepeatTradeNo')+'?tradeIds='+selectedTradeIds,
                    success: function(resp){
                        if(resp.length){
                            Opf.confirm('此交易曾发起过调单拒付，是否继续录入？', function(confirm){
                                if(!confirm){
                                    return;
                                }
                                _me.saveAjax();
                            });
                        }else {
                            _me.saveAjax();
                        }
                    }
                });
            });
        },
        renderGrid: function(){
            var me = this;
            me.grid = App.Factory.createJqGrid({
                rsId:'add.cancelorder.grid',
                gid: 'add-cancelorder-grid',
                caption: '查询订单',
                url: url._('settle.cancelorder.add.search'),
                multiselect: true,
                nav: { //上面一栏的按钮
                    actions:{
                        add: false,
                        search: false,
                        refresh:false
                    }
                },
                actionsCol: false,
                //overflow: true,
                colNames: {
                    cupsNo:          '渠道编号',
                    cupsName:        '交易渠道',
                    tradeId:         '交易流水号',
                    orderNo:         '订单号',
                    tradeType:       '交易类型',
                    tradeStatus:     '交易状态',
                    tradeTime:       '交易时间',
                    cupsMchtName:    '通道商户名',
                    mchtName:        '交易商户',
                    mchtNo:          '交易商户号',
                    phone:           '商户联系电话',
                    tradeCardNo:     '交易卡号',
                    tradeAmt:        '交易金额',
                    longitude:       '经度',
                    latitude:        '纬度'
                },

                colModel: [
                    {name: 'cupsNo'},
                    {name: 'cupsName',hidden:true},
                    {name: 'tradeId'},
                    {name: 'orderNo'},
                    {name: 'tradeType',formatter:tradeTypeFormatter},
                    {name: 'tradeStatus',formatter: statFormatter},
                    {name: 'tradeTime'},
                    {name: 'cupsMchtName'},
                    {name: 'mchtNo',hidden:true},
                    {name: 'mchtName'},
                    {name: 'phone'},
                    {name: 'tradeCardNo'},
                    {name: 'tradeAmt'},
                    {name: 'longitude',hidden: true},
                    {name: 'latitude',hidden: true}


                ],
                filters: [{
                    caption: '条件过滤',
                    canClearSearch: true,
                    defaultRenderGrid: false,
                    components: [
                        {label: '通道商户名称', name: 'cupsMchtName', options: {sopt:['eq']}},
                        {label: '平台流水号', name: 'traceNo', options: {sopt:['eq']}},
                        {label: '交易订单号', name: 'orderNo', options: {sopt:['eq']}},
                        {label: '交易卡号', name: 'tradeCardNo', options: {sopt:['lk']}},
                        {   type: 'rangeDate',
                            label: '交易时间',
                            ignoreFormReset: true,
                            limitRange: 'month',
                            limitDate: moment(),
                            defaultValue: [moment(), moment()],
                            name: 'date'
                        },
                        {label: '交易金额', name: 'amt', options: {sopt:['eq']}}

                    ],
                    searchBtn: {text: '搜索'}
                }],
                //设置成只能单选
                onCellSelect: function(id,status){
                    //var name = 'jqg_add-cancelorder-grid-table_'+id;
                    //$('input[name = '+name+']').attr('checked',true);
                    //var checkedItems = $("input[type = 'checkbox']:checked");
                    //for(var i = 0 ; i < checkedItems.length; i++ ){
                    //    if ( checkedItems[i].name != name ) {
                    //        $(checkedItems[i]).attr("checked",false);
                    //        $(this).parent().parent().removeClass("ui-state-highlight");
                    //    }
                    //}
                }

            });
        }
    });
        //function getTypeTpl(){
        //    return ['<div>',
        //    '<span><input type="radio" name = "orderType" value = "1">调单录入</input></span>',
        //    '<span><input type="radio" name = "orderType" value = "2">退单录入</input></span>',
        //    '<span><input type="radio" name = "orderType" value = "3">退货录入</input></span>'
        //
        //    ].join('');
        //}
        function statFormatter(val, options, rowData) {
            // 如果是状态为 0（交易成功），则要针对一下情况进行翻译
            //if(val == '0'){
            //    if(rowData.name == 'POS消费冲正'){
            //        return '冲正成功';
            //    }else if(rowData.name == 'POS消费撤销'){
            //        return '撤销成功';
            //    }
            //}

            return STAT_MAP[val] || '';
        }
        function tradeTypeFormatter(val){
            return SUBCODE_MAP[val];
        }
    return View;
});
