/**
 * @author hefeng
 * @date 2015/11/30
 * @description  资金池配置
 */
define([
    'tpl!app/oms/operate/cashpool/config/templates/table-list.tpl',
    '../common/time-view',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.override'
],function(tpl,TimeView){

    var _STAT_MAP = {
            "totalAmount": "资金池当日已用",
            't0TotalAmount':'T0资金池金额',
            's0TotalAmount':'S0资金池金额',
            "t0TodaySummary": "T0当日已用",
            "s0TodaySummary": "S0当日已用"
        },
        TYPE_MAP = {
            '0': '原有资金池',
            '2': '二维码'
        },
        isShare_MAP = {
                '1': '是',
                '0': '否'
            },
       typeSwitcher_Map = {
                '1': '开',
                '0': '关'
            },
        switcher_MAP = {
            '1': '打开',
            '0': '关闭'
        };

    var capitalPoolDateFormatter = function(value){
        value = value || "";
        if(/^9{8}$/g.test(value)) {
            return value;
        }
        return moment(value, 'YYYYMMDD').formatYMD();
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.cashpool.config',
        template: tpl,
        onRender: function(){
            var me = this;
            _.defer(function(){
                me.renderGrid();
            });
        },
        onAddModel: function(){
            var me = this;
            require(['app/oms/settle/cancel-order/add-view'],function(AddView){
                var AddOrderView = new AddView().render();
                AddOrderView.showDialog(AddOrderView);
                //App.searchOrderRegion.show(AddOrderView);
                AddOrderView.$el.on('reloadParentGrid',function(){
                    me.grid.trigger('reloadGrid');
                });
            });
        },
        renderGrid: function() {
            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    rules : {
                        totalAmount       : {'required': true},
                        effectTime      : {'required': true},
                        t0Amount       : {'required': true},
                        s0Amount       : {'required': true}
                    }
                });
            };
            var setT0AvaliableTime =  function(form){
                var view = new TimeView();
                view.render();
                var $td = $(form).find('#tr_t0StartTime .DataTD');
                view.$el.find('.start-hour').attr('id','t0StartTime').attr('name','t0StartTime');
                view.$el.find('.end-hour').attr('id','t0EndTime').attr('name','t0EndTime');
                $td.after(view.$el.find('td'));
                $td.remove();
            };
            var setS0AvalibleTime = function(form){
                var view = new TimeView();
                view.render();
                var $td = $(form).find('#tr_s0StartTime .DataTD');
                view.$el.find('.start-hour').attr('id','s0StartTime').attr('name','s0StartTime');
                view.$el.find('.end-hour').attr('id','s0EndTime').attr('name','s0EndTime');
                $td.after(view.$el.find('td'));
                $td.remove();
            };
            var me = this;

            //运维权限变量
            //是运营权限 Ctx.getBrhCode() != '000'
            var ctxValue = false;

            //admin全部打开
            if(Ctx.getUser().get('loginName') == 'admin' && Ctx.avail('cashpool.config.view') == true && Ctx.avail('cashpool.config.operate') == true){
                ctxValue = true;
            }
            //如果两个权限都有，则取最小值的权限就是只能看到资金池的运维权限
            else if(Ctx.avail('cashpool.config.view') == true && Ctx.avail('cashpool.config.operate') == true){
                ctxValue = false;
            }
            //只能看到资金池运维权限
            else if(Ctx.avail('cashpool.config.view') == false && Ctx.avail('cashpool.config.operate') == true){
                ctxValue = false;
            }
            //只能看到资金池所有权限
            else if(Ctx.avail('cashpool.config.view') == true && Ctx.avail('cashpool.config.operate') == false){
                ctxValue = true;
            }

            var configGrid = me.grid = App.Factory.createJqGrid({
                rsId:'cashpool.config',
                gid: 'cashpool-config-grid',
                caption: '资金池信息变更',
                actionsCol: {
                    del: false
                },
                nav: {
                    formSize: {
                        width: 400,
                        height: 600
                    },
                    actions: {
                        add: ctxValue,
                        search: false
                    },
                    view: {
                        beforeShowForm: function (form) {
                            var selID = Opf.Grid.getLastSelRowId(configGrid),
                                rowData = configGrid.getRowData(selID),
                                t0StartTime = rowData.t0StartTime.substr(0, 2) + ':00',
                                t0EndTime = rowData.t0EndTime.substr(0, 2) + ':00',
                                s0StartTime = rowData.s0StartTime.substr(0, 2) + ':00',
                                s0EndTime = rowData.s0EndTime.substr(0, 2) + ':00';
                            $(form).find('#v_t0StartTime').text(t0StartTime + ' - ' + t0EndTime);
                            $(form).find('#v_s0StartTime').text(s0StartTime + ' - ' + s0EndTime);
                        }
                    },
                    add : {
                        beforeShowForm: function(form) {
                            var target = $('[name="capitalPoolDate"]', form);
                                target.datepicker({autoclose:true, format:'yyyymmdd'});

                            addValidateRules(form);
                            setT0AvaliableTime(form);
                            setS0AvalibleTime(form);
                        },
                        beforeSubmit: setupValidation
                    },
                    edit: {
                        beforeShowForm: function (form) {
                            var target = $('[name="capitalPoolDate"]', form);
                                target.prop('disabled', true);

                            setT0AvaliableTime(form);
                            setS0AvalibleTime(form);

                            var selID = Opf.Grid.getLastSelRowId(configGrid);
                            var rowData = configGrid.getRowData(selID);
                            var $form = $(form);

                            if (ctxValue == false) {//是运营权限
                               $form.find('#tr_isShareCapital').hide();
                               $form.find('#tr_capitalPoolType').hide();
                               $form.find('#tr_typeSwitcher').hide();
                            }
                            $form.find('#t0StartTime').val(rowData.t0StartTime);
                            $form.find('#t0EndTime').val(rowData.t0EndTime);
                            $form.find('#s0StartTime').val(rowData.s0StartTime);
                            $form.find('#s0EndTime').val(rowData.s0EndTime);

                            addValidateRules(form);
                        },
                        beforeSubmit: setupValidation
                    }
                },
                stats:{
                    labelConfig: _STAT_MAP,
                    items: [],
                    formatter: function(gridStats, statsData){
                        if(ctxValue == false){//是运营权限
                            return "";
                        }
                        var items = [], isShareCapital = statsData && statsData.isShareCapital;
                        if(isShareCapital == "0"){
                            items = [
                                {name: 't0TotalAmount', type:'currency'},
                                {name: 's0TotalAmount', type:'currency'},
                                {name: 't0TodaySummary', type:'currency'},
                                {name: 's0TodaySummary', type:'currency'}
                            ]
                        } else if (isShareCapital == "1"){
                            items = [
                                {name: 'totalAmount', type:'currency'},
                                {name: 't0TodaySummary', type:'currency'},
                                {name: 's0TodaySummary', type:'currency'}
                            ]
                        } else {
                            //TODO
                        }
                        gridStats.items = items;
                    }
                },
                //actionsCol:{
                //    view:false,
                //    width: 110,
                //    extraButtons: [
                //        {
                //            name: 'serviceObjConfig', icon: 'icon-edit red', title: '服务对象',
                //            click: function (name,obj,rowData) {
                //                require(['../../service-targer/list-view'], function(configView){
                //                    var serviceConfigView = new configView({serviceId: rowData.serviceId}).render();
                //                    serviceConfigView.showDialog(serviceConfigView);
                //                    serviceConfigView.$el.on('reloadParentGrid',function(){
                //                        me.grid.trigger('reloadGrid');
                //                    });
                //                });
                //            }
                //        }
                //    ]
                //},
                url: url._('operate.cashpollconfig.list'),
                postData: {ctx: ctxValue == false
                    ? 'cashpool.config.operate'
                    : 'product:cashpool:s'},
                colNames: {
                    id: 'ID',
                    capitalPoolDate: '资金池可用日期',
                    totalAmount: '总限额(万元)',
                    isShareCapital: '资金池是否共享',
                    capitalPoolType: '资金池类型',
                    typeSwitcher :'资金池开关',
                    t0TotalAmount: 'T+0限额（万元）',
                    s0TotalAmount: 'S+0限额（万元）',
                    t0Switcher: 'T+0状态',
                    t0StartTime: 'T+0可用时间',
                    t0EndTime:'T+0结束时间',
                    s0Switcher: 'S+0状态',
                    s0StartTime: 'S+0可用时间',
                    s0EndTime: 'S+0结束时间',

                    isDefault: '是否为默认资金池'
                },

            colModel: [
                    {name: 'id',hidden:true},
                    {name: 'capitalPoolDate', editable: true, sortable: false, edittype:'text',
                        formatter: capitalPoolDateFormatter
                    },
                    {name: 'totalAmount',editable: true,search:true},
                    {name: 'isShareCapital',editable: true, sortable: false, formatter: isShareFormatter, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: isShare_MAP,
                            sopt: ['eq']
                        },
                        edittype:'select',
                        editoptions: {
                            value: isShare_MAP
                        }
                    },
                    {name: 'capitalPoolType',editable: true, sortable: false, formatter: TYPE_MAPFormatter, search: true,
                        searchoptions: {
                            value: TYPE_MAP,
                            sopt: ['eq']
                        },
                        edittype:'select',
                        editoptions: {
                            value: TYPE_MAP
                        }
                    },
                    {name: 'typeSwitcher',editable: true, sortable: false, formatter: typeSwitcherFormatter, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: typeSwitcher_Map,
                            sopt: ['eq']
                        },
                        edittype:'select',
                        editoptions: {
                            value: typeSwitcher_Map
                        }
                    },
                    {name: 't0TotalAmount',editable: true,search:true},
                    {name: 's0TotalAmount',editable: true,search:true},
                    {name: 't0Switcher',editable: true,sortable: false, formatter: swicherFormatter, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: switcher_MAP,
                            sopt: ['eq']
                        },
                        edittype:'select',
                        editoptions: {
                            value: switcher_MAP
                        }},
                    {name: 't0StartTime',hidden:true,editable: true, sortable: false
                        /*,edittype:'text',editoptions:{
                            dataInit : function (elem) {


                              /!*  var view = new TimeView();
                                $(elem).after(view.$el);
                                console.log($('.start-hour'));
                                $(elem).remove();*!/
                                //$(elem).css({width:'80px'}).after(' - <input type="text" id="t0EndTime" name="t0EndTime" role="textbox" class="FormElement ui-widget-content ui-corner-all" style="width: 80px">');
                            }

                        }*/
                    },
                    {name: 't0EndTime',hidden:true,search: false,editable: false,viewable: false},
                    {name: 's0Switcher',editable: true,sortable: false, formatter: swicherFormatter, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: switcher_MAP,
                            sopt: ['eq']
                        },
                        edittype:'select',
                        editoptions: {
                            value: switcher_MAP
                        }
                    },
                    {name: 's0StartTime',hidden:true,editable: true, sortable: false
                        /*,edittype:'text', editoptions:{
                            dataInit : function (elem) {
                               // $(elem).css({width:'80px'}).after(' - <input type="text" id="s0EndTime" name="s0EndTime" role="textbox" class="FormElement ui-widget-content ui-corner-all" style="width: 80px">');
                            }
                        }*/
                    },
                    {name: 's0EndTime',hidden:true,search: false,editable: false,viewable: false},
                    {name: 'isDefault', editable:true, editrules: {edithidden: false}, hidden:true}

                ],
                loadComplete: function(resp) {
                    //TODO
                }
            });
        }
    });

    function isShareFormatter(val){
        return isShare_MAP[val]||"";
    }
    
    function TYPE_MAPFormatter(val){
        return TYPE_MAP[val]||"";
    }

    function typeSwitcherFormatter(val){
        return typeSwitcher_Map[val]||"";
    }

    function swicherFormatter(val){
        return switcher_MAP[val]||"";
    }

    App.on('operate:cashpoll:list',function(){
        App.show(new View());
    });

    return View;
});
