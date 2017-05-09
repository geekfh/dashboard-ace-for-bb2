define([
    'jquery.jqGrid',
    'jquery.validate',
    'moment.override'
],function(){

    //活动对象类型
    var STATUS_MAP = {
        "1": "已处理",
        "0": "未处理"
    };

    //来源
    var SOURCE_MAP = {
        "1": "差错交易",
        "2": "清算失败"
    };

    //格式化日期
    var dateFormatter = function(value) {
        return value ? moment(value, 'YYYYMMDDhhmmss').format('YYYY/MM/DD HH:mm:ss') : '';
    };

    //S0异常处理
    var todoS0 = function (me, rowData) {
        var tpl = [
            '<form class="form-s0-check"><div class="container">',
                '<style type="text/css">.form-s0-check .col-xs-3{text-align: right;}</style>',
                '<div id="J_checkS0Info" class="container">',
                    '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">处理结果：</div>',
                        '<div class="col-xs-9">',
                            '<select name="result">',
                                '<option value="1">退服务费</option>',
                                '<option value="2">无需退费</option>',
                            '</select>',
                        '</div>',
                    '</div>',
                    '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">退费金额：</div>',
                        '<div class="col-xs-9">',
                            '<input type="text" name="refundAmt" /> 元',
                        '</div>',
                    '</div>',
                    '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">处理描述：</div>',
                        '<div class="col-xs-9">',
                            '<textarea name="desc" style="width:280px;height:120px;"></textarea>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div></form>'
        ].join('');

        var rules = {
            refundAmt: { required:true, number:true },
            desc: { required:true, maxlength: 200 }
        };
        var $dialogForm = $(tpl);

        var $dialog = Opf.Factory.createDialog($dialogForm, {
            destroyOnClose: true,
            title: "处理状态",
            width: 480,
            height: 360,
            autoOpen: true,
            modal: true,
            create: function(){
                $('select[name="result"]', $dialogForm).on('change', function(){
                    var self = $(this);
                    if(self.val()==2){
                        $('input[name="refundAmt"]', $dialogForm).closest(".row").hide();
                    }else{
                        $('input[name="refundAmt"]', $dialogForm).closest(".row").show();
                    }
                });
            },
            buttons: [{
                type: 'submit',
                text: '提交',
                className: 'submit',
                icons: { primary: 'icon-ok' },
                click: function () {
                    //发送审核通过/拒绝的信息
                    var isValid = $dialogForm.validate().form();
                    if(isValid){
                        //提交审核信息
                        var ajaxOptions = {
                            url: url._("settle.exceptions0.changestate", {id: rowData.id}),
                            type: 'PUT',
                            contentType: "application/json",
                            jsonData: Opf.Util.getFormData($dialogForm),
                            success: function(){
                                $dialog.trigger('dialogclose');
                                me.grid.trigger("reloadGrid", [{current: true}]);
                            }
                        };
                        Opf.ajax(ajaxOptions);
                    }
                }
            },{
                type: 'cancel'
            }]
        });
        Opf.Validate.addRules($dialogForm, {rules: rules});
    };

    var tpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="exception-s0-grid-table"></table>',
                '<div id="exception-s0-grid-pager" ></div>',
            '</div>',
        '</div>'
    ].join('');

    return Marionette.ItemView.extend({
        tabId: 'menu.exception.S0',
        template: _.template(tpl),

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var me = this;

            var grid = me.grid = App.Factory.createJqGrid({
                caption: 'S0异常处理',
                rsId:'exception.S0',
                gid: 'exception-s0-grid',
                url: url._('settle.exceptions0.list'),
                datatype: 'json',
                actionsCol: {
                    view: false,
                    edit: false,
                    del : false,
                    canButtonRender: function (name, options, rowData) {
                        if(name === 'changestate' &&
                            (rowData.status == 1 || !Ctx.avail('exception.S0.changestate'))
                        ){
                            return false;
                        }
                    },
                    extraButtons:[
                        {
                            name:'changestate', title:'S0异常处理',
                            icon:'icon-opf-process-account icon-opf-process-account-color',
                            click: function (name, opts, rowData) {
                                todoS0(me, rowData);
                            }
                        }
                    ]
                },
                nav: {actions:{add:false,search:false,refresh:true}},
                filters: [
                    {
                        caption: '精准搜索',
                        defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '来源',
                                name: 'source',
                                type: 'select',
                                options: {
                                    value: SOURCE_MAP
                                }
                            },{
                                label: '创建日期',
                                type: 'rangeDate',
                                name: 'createTime'
                                //limitRange: 'month',
                                //limitDate: moment(),
                                //defaultValue: [moment(), moment()]
                            },{
                                label: '创建人',
                                name: 'creatorName'
                            },{
                                label: '商户号',
                                name: 'ibox42'
                            },{
                                label: '操作状态',
                                name: 'status',
                                type: 'select',
                                options: {
                                    value: STATUS_MAP
                                }
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ],
                colNames: {
                    id:         'id',
                    source:     '来源', //1:差错交易,2:清算失败
                    txAmt:      '交易金额',
                    refundAmt:  '退换金额',
                    ibox42:     '商户号',
                    ibox43:     '商户名',
                    bankCardNo: '收款账号',
                    zbankName:  '收款支行',
                    accountName:'开户名',
                    status:     '操作状态', // 0：未处理(默认)，1：已处理
                    operateDesc:'操作描述',
                    operateTime:'操作时间',
                    opratorName:'操作人',
                    createTime: '创建时间', //初始为 点击差错处理/清算失败处理的时间 yyyyMMddHHmmss
                    creatorName:'创建人', //初始为 点击差错处理/清算失败处理的人
                    desc:       '处理描述'
                },
                colModel: [
                    //主键ID
                    { name: 'id', hidden: true },

                    //来源
                    { name: 'source', formatter:function(value){
                        return SOURCE_MAP[value]||"";
                    }},

                    //交易金额
                    {
                        name: 'txAmt'
                        /*editable: true,
                        search: true,
                        searchoptions: {
                            sopt: ['eq','ne']
                        }*/
                    },

                    //退换金额
                    { name: 'refundAmt' },

                    //商户号
                    { name: 'ibox42' },

                    //商户名
                    { name: 'ibox43' },

                    //开户账号
                    { name: 'bankCardNo' },

                    //开户支行
                    { name: 'zbankName' },

                    //开户名
                    { name: 'accountName' },

                    //操作状态
                    {
                        name: 'status',
                        formatter: function(value){
                            return STATUS_MAP[value]||"";
                        }
                    },

                    //操作描述
                    { name: 'operateDesc' },

                    //操作时间
                    { name:'operateTime', formatter:dateFormatter },

                    //操作人
                    { name: 'opratorName' },

                    //创建时间
                    { name: 'createTime', formatter: dateFormatter },

                    //创建人
                    { name: 'creatorName' },

                    //处理描述
                    { name: 'desc' }
                ],

                loadComplete: function () {
                    //console.info(me.$el);
                }
            });
        }
    });
});