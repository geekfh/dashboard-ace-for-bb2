/**
 * 来电弹屏
 */
define([
    'App',
    'tpl!app/oms/operate/service-telephone/templates/crm_alert.tpl',
    'app/oms/mcht/mcht-sys-app',
    'app/oms/auth/org/list/list-controller', //机构信息
    'app/oms/auth/user/list/list-controller', //商户信息
    'app/oms/settle/trade-txn/list/list-controller', //综合查询下的交易流水信息
    'app/oms/settle/mcht-settle-detail/list/list-controller', //综合查询下的商户清算明细
    'app/oms/settle/settle-error/list/list-controller' //清算失败信息
], function(App, tpl, mchtSysApp, orgCtrl, userCtrl, txnCtrl, detailCtrl, errorCtrl){

    //获取行DIV
    var getTheRow = function(self){
        return self.closest("div.row");
    };

    //获取DOM属性
    var getAttrValue = function(self, attrName){
        return self.attr(attrName);
    };

    //设置默认查询信息
    var setDefaultValue = function(gridId, params){
        var timeout = setInterval(function(){
            var currentPanel = App.getCurTabPaneEl();
            var $grid = currentPanel.find('table#'+gridId);
            var gridComplete = $grid.find("tr").length>1;
            if(gridComplete){
                clearInterval(timeout);
                _.defer(function(){
                    var postData = $grid.jqGrid('getGridParam', 'postData');
                    _.extend(postData, params);
                    $grid.trigger("reloadGrid");
                });
            }
        }, 100);
    };

    //生成商户信息
    var buildMchtTable = function(rowData, tbody, me){
        var tr = "", ui = me.ui;

        for(var i=0; i<rowData.length; i++){
            var item = rowData[i];
            tr += '<tr>';
            tr += '<td>'+mchtNameFormatter(item.mchtName, item)+'</td>';
            tr += '<td>'+item.mainUserName+'</td>';
            tr += '<td>'+item.brhName+'</td>';
            tr += '<td>'+item.expandName+'</td><td>';
            tr += '<a href="javascript:void(0);" data-mchtNo="'+item.mchtNo+'">商户信息</a>';
            tr += '&nbsp;&nbsp;&nbsp;&nbsp;';
            tr += '<a href="javascript:void(0);" data-mchtNo="'+item.mchtNo+'">交易流水信息</a>';
            tr += '<br/>';
            tr += '<a href="javascript:void(0);" data-mchtNo="'+item.mchtNo+'">商户清算明细</a>';
            tr += '&nbsp;&nbsp;&nbsp;&nbsp;';
            tr += '<a href="javascript:void(0);" data-mchtNo="'+item.mchtNo+'">清算失败信息</a>';
            tr += '</td></tr>';
        }

        //绑定操作事件
        var $tr = $(tr);

        //商户信息
        $('a:contains("商户信息")', $tr).on('click', function(){
            App.trigger('mchts:user2:list'); var self = $(this);
            var timeout = setInterval(function(){
                var currentPanel = App.getCurTabPaneEl();
                var searchBtn = currentPanel.find('button.search-btn');
                var userCode = currentPanel.find('input.filter-input[class^="mchtNo"]');
                if(userCode.length>0){
                    clearInterval(timeout);
                    userCode.val(getAttrValue(self, 'data-mchtNo')).trigger('change');
                    searchBtn.trigger('click');
                }
            }, 100)
        });

        //交易流水信息
        $('a:contains("交易流水信息")', $tr).on('click', function(){
            var self = $(this);
            var gridFilters = [
                {
                    name: 'ibox42',
                    params: {
                        defaultValue: getAttrValue(self, 'data-mchtNo')
                    }
                }
            ];
            txnCtrl.listQueryTradeTxn(gridFilters);
        });

        //商户清算明细
        $('a:contains("商户清算明细")', $tr).on('click', function(){
            var self = $(this);
            var gridFilters = [
                {
                    name: 'mchtNo',
                    params: {
                        defaultValue: getAttrValue(self, 'data-mchtNo')
                    }
                }
            ];
            detailCtrl.listQueryMchtSettleDetail(gridFilters);
        });

        //清算失败信息
        $('a:contains("清算失败信息")', $tr).on('click', function(){
            var self = $(this);
            var gridFilters = [
                {
                    name: 'mchtNo',
                    params: {
                        defaultValue: getAttrValue(self, 'data-mchtNo')
                    }
                }
            ];
            errorCtrl.listSettleErrors(gridFilters);
        });

        //插入HTML
        tbody.empty().append($tr);
    };

    //生成机构信息
    var buildBrhTable = function(rowData, tbody, me){
        var tr = "", ui = me.ui;

        for(var i=0; i<rowData.length; i++){
            var item = rowData[i];
            tr += '<tr>';
            tr += '<td>'+item.brhName+'</td>';
            tr += '<td>'+item.brhCode+'</td>';
            tr += '<td>'+item.contName+'</td>';
            tr += '<td>'+item.brhLevel+'</td>';
            tr += '<td><a href="javascript:void(0);">机构信息</a></td>';
            tr += '</tr>';
        }

        //绑定操作事件
        var $tr = $(tr);
        $('a:contains("机构信息")', $tr).on('click', function(){
            App.trigger('branches:list');
            setDefaultValue('orgs-grid-table', {filters: JSON.stringify({"groupOp":"AND","rules":[{"field":"mobile","op":"eq","data":ui.customerNumber.val()}]})});
        });

        //插入HTML
        tbody.empty().append($tr);
    };

    //生成机构拓展员信息
    var buildunDirectOprTable = function(rowData, tbody, me){
        var tr = "", ui = me.ui;

        for(var i=0; i<rowData.length; i++){
            var item = rowData[i];
            tr += '<tr>';
            tr += '<td>'+item.name+'</td>';
            tr += '<td>'+item.loginName+'</td>';
            tr += '<td>'+item.brhName+'</td>';
            tr += '<td>'+item.oneLevelAgentName+'</td>';
            tr += '<td><a href="javascript:void(0);">员工信息</a></td>';
            tr += '</tr>';
        }

        //绑定操作事件
        var $tr = $(tr);
        $('a:contains("员工信息")', $tr).on('click', function(){
            App.trigger('user:list');
            setDefaultValue('users-grid-table', {filters: JSON.stringify({"groupOp":"AND","rules":[{"field":"mobile","op":"eq","data":ui.customerNumber.val()}]})});
        });

        //插入HTML
        tbody.empty().append($tr);
    };

    //生成直销网络拓展员信息
    var buildDirectOprTable = function(rowData, tbody, me){
        var tr = "", ui = me.ui;

        for(var i=0; i<rowData.length; i++){
            var item = rowData[i];
            tr += '<tr>';
            tr += '<td>'+item.name+'</td>';
            tr += '<td>'+item.loginName+'</td>';
            tr += '<td>'+item.upExpandName+'</td>';
            tr += '<td><a href="javascript:void(0);">员工信息</a></td>';
            tr += '</tr>';
        }

        //绑定操作事件
        var $tr = $(tr);
        $('a:contains("员工信息")', $tr).on('click', function(){
            App.trigger('user:list');
            setDefaultValue('users-grid-table', {filters: JSON.stringify({"groupOp":"AND","rules":[{"field":"mobile","op":"eq","data":ui.customerNumber.val()}]})});
        });

        //插入HTML
        tbody.empty().append($tr);
    };

    //商户等级
    function mchtNameFormatter(value, rowData){
        var mchtLevel = parseInt(rowData.mchtLevel);
        var mchtLevelStr = "";
        for(var i=0; i<mchtLevel; i++){
            mchtLevelStr += '<i class="icon icon-star" style="color:#FF6A00;"></i>';
        }

        var mchtNameStr = "";
        mchtNameStr += '<div class="row">';
        mchtNameStr += '<div class="col-xs-12">'+value+'</div>';
        mchtNameStr += '</div>';
        mchtNameStr += '<div class="row">';
        mchtNameStr += '<div class="col-xs-12">'+mchtLevelStr+'</div>';
        mchtNameStr += '</div>';

        return mchtNameStr;
    }

    return  Marionette.ItemView.extend({
        template: tpl,
        ui: {
            container: 'div.container',
            warning: 'div.text-warning',
            customerNumber: 'input[name="customerNumber"]',
            searchBtn: '#J_service_telephone_alert_search',
            mchtInfo: '#J_service_telephone_alert_mchtInfo',
            brhInfo: '#J_service_telephone_alert_brhInfo',
            directOprInfo: '#J_service_telephone_alert_directOprInfo',
            unDirectOprInfo: '#J_service_telephone_alert_unDirectOprInfo'
        },
        initialize: function(data){
            this.data = data;
        },
        serializeData: function(){
            var me = this;
            return {
                token: me.data
            }
        },
        onRender: function(){
            var me = this, ui = me.ui;

            ui.searchBtn.on('click.search', function(){
                var ajaxOptions = {
                    type: 'GET',
                    data: {
                        phone: ui.customerNumber.val()
                    },
                    url: url._('service.telephone.alertInfo'),
                    success: function (resp) {
                        var theRow, noInfo=true;

                        ui.container.find("div.row:not(:first)").hide();

                        //商户信息
                        if(resp && resp.mchtInfo && resp.mchtInfo.length){
                            theRow = getTheRow(ui.mchtInfo);
                            theRow.show();
                            buildMchtTable(resp.mchtInfo, ui.mchtInfo, me);
                            noInfo = false;
                        }

                        //机构信息
                        if(resp && resp.brhInfo && resp.brhInfo.length){
                            theRow = getTheRow(ui.brhInfo);
                            theRow.show();
                            buildBrhTable(resp.brhInfo, ui.brhInfo, me);
                            noInfo = false;
                        }

                        //机构拓展员信息
                        if(resp && resp.unDirectOprInfo && resp.unDirectOprInfo.length){
                            theRow = getTheRow(ui.unDirectOprInfo);
                            theRow.show();
                            buildunDirectOprTable(resp.unDirectOprInfo, ui.unDirectOprInfo, me);
                            noInfo = false;
                        }

                        //直销拓展员信息
                        if(resp && resp.directOprInfo && resp.directOprInfo.length){
                            theRow = getTheRow(ui.directOprInfo);
                            theRow.show();
                            buildDirectOprTable(resp.directOprInfo, ui.directOprInfo, me);
                            noInfo = false;
                        }

                        ui.warning.toggle(noInfo);
                    }
                };
                Opf.ajax(ajaxOptions);
            });

            _.defer(function(){
                ui.searchBtn.trigger('click.search');
            });
        }
    });
});
