define([
    'assets/scripts/fwk/component/uploader',
    'jquery.validate',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.override',
    'common-ui'
],function(uploader, validator){
    //******************** 新增校验规则开始 ************************

    //手机号唯一性校验
    jQuery.validator.addMethod("operate.cmcht.checkmobile", function(value, element, params) {
        if($(element).attr('userPhoneOld') == value){
            return true;
        }
        else{
            return validator.syncRemoteValid(url._('operate.cmcht.checkmobile', {mobile:value}));
        }

    }, "手机号码已经存在！");

    //身份证号唯一性校验
    jQuery.validator.addMethod("operate.cmcht.checkcardno", function(value, element, params) {
        return validator.syncRemoteValid(url._('operate.cmcht.checkcardno', {cardno:value}));
    }, "身份证号码已经存在！");

    //******************** 新增校验规则结束 ************************

    var grid, tpl,
        grid_tpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="operate-cmcht-grid-table"></table>',
                '<div id="operate-cmcht-grid-pager" ></div>',
            '</div>',
        '</div>'
    ].join("");
    tpl = _.template(grid_tpl);

    /*var filterEditOptsFn = function(jsonObj){
        return JSON.stringify(jsonObj).replace(/[\{|\}|'|"]/g, "").replace(/,/g, ";");
    };*/

    //商户来源
    var USER_FROM_MAP = {
        "0": "手工录入",
        "1": "批量关联导入"
    };
    //var USER_FROM_VALUE = {value:filterEditOptsFn(USER_FROM_MAP)};

    //同步状态
    var STATUS_MAP = {
        "0": "新增未同步",
        "1": "资料修改未同步",
        "2": "已激活",
        "3": "已停用",
        "4": "已删除"
    };

    //通道同步状态
    var CHANNEL_SYN_STATUS_MAP = {
        "0": "未同步",
        "1": "同步成功",
        "2": "同步失败",
        "3": "不支持同步"
    };

    //格式化日期
    var dateFormatter = function(value) {
        return value ? moment(value, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    };

    //格式化数据
    var dataFormatter = function(data){
        var _data = [];
        _.each(data, function(v){
            var kv = {};
            kv.text = v.channelNm;
            kv.value = v.channelNo;
            _data.push(kv);
        });
        return _data;
    };

    //创建下拉列表
    var createOptions = function(url, $obj, formatterData){
        Opf.ajax({
            url: url,
            type: 'GET',
            success: function (resp) {
                if(_.isFunction(formatterData)){
                    resp = formatterData(resp);
                }
                var tpl = _.map(resp,function(item){
                    var value = item.value||item.text||"";
                    var text = item.text||item.value||"";
                    return 	'<option value="' + value + '">' + text + '</option>';
                }).join('');
                var $options = $(tpl);
                $obj.append($options);
            }
        });
    };

    //更改状态
    var changeState = function (name, opts, rowData) {
        var tpl = [
            '<form onsubmit="return false;" >',
                '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
                    '<tbody>',
                        '<tr class="FormData">',
                            '<td class="CaptionTD" style="padding-right:10px;">更改状态:</td>',
                            '<td class="DataTD">',
                                '&nbsp;',
                                '<select role="select" name="state" class="FormElement ui-widget-content ui-corner-all">',
                                    '<option value="2">已激活</option>',
                                    '<option value="3">已停用</option>',
                                    '<option value="4">已删除</option>',
                                '</select>',
                            '</td>',
                        '</tr>',
                    '</tbody>',
                '</table>',
            '</form>'
        ].join('');
        var $dialog = Opf.Factory.createDialog(tpl, {
            destroyOnClose: true,
            title: '状态变更',
            autoOpen: true,
            width: 300,
            height: 150,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $(this).find('[name="state"]');
                    var oldState = rowData.status;
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();
                    if (oldState != newState) {
                        var addConfirmMessage = '';
                        if (newState == "4") {
                            addConfirmMessage = '此商户将被删除，确定要这么做吗！';
                        }
                        Opf.confirm('您确定要修改商户的状态为 "' + selSateTxt + '" 吗？<br><br> ' + addConfirmMessage, function (result) {
                            if (result) {
                                Opf.ajax({
                                    type: 'PUT',
                                    jsonData: {
                                        oldStatus: oldState,
                                        newStatus: newState
                                    },
                                    url: url._('operate.cmcht.changestate', {id: rowData.id}),
                                    success: function () {
                                        grid.trigger('reloadGrid', [{current:true}]);
                                    },
                                    complete: function () {
                                        $dialog.dialog('close');
                                    }
                                });
                            }
                        });
                    } else {
                        $(this).dialog('close');
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                $(this).find('[name="state"]').val(rowData.status);
            }
        });
    };

    //手动同步通道商户
    var changeChannelState = function(name, opts, rowData){
        Opf.UI.setLoading(true);
        Opf.ajax({
            type: 'PUT',
            url: url._('operate.cmcht.changechannelstate', {id: rowData.id}),
            success: function () {
                grid.trigger('reloadGrid', [{current:true}]);
            },
            complete: function(){
                Opf.UI.setLoading(false);
            }
        });
    };

    return Marionette.ItemView.extend({
        tabId: 'menu.operate.cmcht',
        template: tpl,

        initialize: function (options) {
            //TODO
        },

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var me = this;
            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    rules: {
                        mchtNo: {
                            required: true
                        },
                        mchtMcc: {
                            required: true,
                            maxlength: 4
                        },
                        userCardNo: {
                            required: true,
                            idcard: true,
                            'operate.cmcht.checkcardno': true
                        },
                        userPhone: {
                            required: true,
                            mobile: true,
                            'operate.cmcht.checkmobile': true
                        }
                    }
                });
            };

            grid = me.grid = App.Factory.createJqGrid({
                caption: '通道商户管理',
                rsId:'operate.cmcht',
                gid: 'operate-cmcht-grid',
                url: url._('operate.cmcht.list'),
                datatype: 'json',
                nav: {
                    formSize: {
                        width: 480,
                        height: 600
                    },
                    add: {
                        beforeShowForm: function(form){
                            addValidateRules(form);
                            CommonUI.address(form.find('[name="acctZbankProvince"]'), form.find('[name="acctZbankCity"]'));
                        },
                        beforeSubmit: setupValidation
                    },
                    view: {
                      beforeShowForm: function(form){
                          var id = Opf.jqGrid.getLastSelRowId(this);
                          var rowData = me.grid._getRecordByRowId(id);
                          var curProvince, curCity;
                          Opf.ajax({
                              type: 'GET',
                              url: url._('options.province'),
                              success: function(res){
                                  if(res.length){
                                      curProvince = _.findWhere(res, {value: rowData.acctZbankProvince});
                                      form.find('td#v_acctZbankProvince').html("&nbsp;<span>" + curProvince.name + "</span>");
                                  }
                              }
                          });
                          Opf.ajax({
                              type: 'GET',
                              url: url._('options.city', {province : rowData.acctZbankProvince}),
                              success: function(res){
                                  if(res.length){
                                      curCity = _.findWhere(res, {value: rowData.acctZbankCity});
                                      form.find('td#v_acctZbankCity').html("&nbsp;<span>" + curCity.name + "</span>");
                                  }
                              }
                          });
                      }
                    },
                    edit: {
                        beforeShowForm: function(form){
                            addValidateRules(form);
                            var id = Opf.jqGrid.getLastSelRowId(this);
                            var rowData = me.grid._getRecordByRowId(id);
                            form.find('[name="userPhone"]').attr('userPhoneOld', $(form).find('[name="userPhone"]').val());
                            CommonUI.address(form.find('[name="acctZbankProvince"]'), form.find('[name="acctZbankCity"]'), null, rowData.acctZbankProvince, rowData.acctZbankCity, null);
                        },
                        beforeSubmit: setupValidation
                    }
                },
                actionsCol: {
                    width: 140,
                    canButtonRender: function (name, opts, rowData) {
                        var isEditable = rowData.iseditble;
                        var isChangeable4channel = rowData.channleSynStatus;

                        //是否可编辑
                        if(name=="edit" && isEditable=="1") {
                            return false;
                        }

                        //是否可以同步通道状态
                        if(name=="changeChannelState" && isChangeable4channel=="3") {
                            return false;
                        }
                    },
                    extraButtons: [
                        {
                            name: 'changestate', title: '更改通道商户状态',
                            icon:'icon-opf-state-change', click: changeState
                        },{
                            name: 'changeChannelState', title: '手动同步通道状态',
                            icon:'icon-hand-up', click: changeChannelState
                        }
                    ]
                },
                colNames: {
                    id:             'id',
                    mchtNo:         '商户号',
                    mchtNm:         '商户名称',
                    mchtShortNm:    '商户简称',
                    userName:       '法人代表',
                    userCardNo:     '用户证件号码',
                    compLicNo:      '营业执照号码',
                    compTaxNo:      '税务登记证号码',
                    province:       '省',
                    city:           '市',
                    area:           '区',
                    mchtAreaNo:     '区域代码',
                    mchtAddr:       '商户地址',
                    userPhone:      '用户手机号',
                    mchtMcc:        '商户MCC码',
                    servicePhone:   '客服电话',
                    acctNo:         '账户账号',
                    acctNm:         '账户名称',
                    acctZbankNm:    '账户开户行名称',
                    acctZbankNo:    '账户开户支行号',
                    acctZbankProvince:    '开户支行所在省',
                    acctZbankCity:    '开户支行所在市',
                    channelNo:      '通道号',
                    channelNm:      '通道名称',
                    channleSynStatus: '通道同步状态',
                    channleSynAlipayStatus: '支付宝同步状态',
                    channleSynWechatStatus: '微信同步状态',
                    channleCode:      '通道返回码',
                    channleCodeDetail:'通道返回码详情',
                    status:         '同步状态',
                    iseditble:      '商户来源',
                    createTime:     '创建时间',
                    createOprId:    '拓展员ID',
                    updateTime:     '更新时间',
                    updateOprId:    '修改人ID',
                    remark:         '备注'
                },
                colModel: [
                    //ID
                    {
                        name: 'id',
                        index:'id',
                        hidden: true
                    },

                    //商户号
                    {
                        name: 'mchtNo',
                        index: 'mchtNo',
                        search: true,
                        searchoptions: { sopt:['lk','nlk', 'eq', 'ne'] },
                        editable: true
                    },

                    //商户名称
                    {
                        name: 'mchtNm',
                        index: 'mchtNm',
                        search: true,
                        searchoptions: { sopt:['lk','nlk', 'eq', 'ne'] },
                        editable: true
                    },

                    //商户简称
                    {
                        name: 'mchtShortNm',
                        index: 'mchtShortNm',
                        search: false,
                        searchoptions: { sopt:['lk','nlk', 'eq', 'ne'] },
                        editable: true
                    },

                    //法人代表
                    {
                        name: 'userName',
                        index:'userName',
                        hidden: true,
                        editable: true
                    },

                    //用户证件号码
                    {
                        name: 'userCardNo',
                        index: 'userCardNo',
                        hidden: true,
                        editable: true
                    },

                    //营业执照号码
                    {
                        name: 'compLicNo',
                        index: 'compLicNo',
                        hidden: true,
                        editable: true
                    },

                    //税务登记证号码
                    {
                        name: 'compTaxNo',
                        index: 'compTaxNo',
                        hidden: true,
                        editable: true
                    },

                    //省
                    {
                        name: 'province',
                        index: 'province',
                        hidden: true,
                        editable: true
                    },

                    //市
                    {
                        name: 'city',
                        index: 'city',
                        hidden: true,
                        editable: true
                    },

                    //区
                    {
                        name: 'area',
                        index: 'area',
                        hidden: true,
                        editable: true
                    },

                    //区域代码
                    {
                        name: 'mchtAreaNo',
                        index: 'mchtAreaNo',
                        hidden: true,
                        editable: true
                    },

                    //商户地址
                    {
                        name: 'mchtAddr',
                        index: 'mchtAddr',
                        hidden: true,
                        editable: true
                    },

                    //手机号
                    {
                        name: 'userPhone',
                        index: 'userPhone',
                        search: true,
                        editable: true
                    },

                    //用户MCC码
                    {
                        name: 'mchtMcc',
                        index: 'mchtMcc',
                        hidden: true,
                        editable: true
                    },

                    //客服电话
                    {
                        name: 'servicePhone',
                        index: 'servicePhone',
                        hidden: true,
                        editable: true
                    },

                    //账户账号
                    {
                        name: 'acctNo',
                        index: 'acctNo',
                        hidden: true,
                        editable: true
                    },

                    //账户名称
                    {
                        name: 'acctNm',
                        index: 'acctNm',
                        hidden: true,
                        editable: true
                    },

                    //账户开户行名称
                    {
                        name: 'acctZbankNm',
                        index: 'acctZbankNm',
                        hidden: true,
                        editable: true
                    },

                    //账户开户支行号
                    {
                        name: 'acctZbankNo',
                        index: 'acctZbankNo',
                        hidden: true,
                        editable: true
                    },
                    //开户支行所在省
                    {
                        name: 'acctZbankProvince',
                        index: 'acctZbankProvince',
                        edittype: 'select',
                        hidden: true,
                        editable: true
                    },

                    //开户支行所在市
                    {
                        name: 'acctZbankCity',
                        index: 'acctZbankCity',
                        edittype: 'select',
                        hidden: true,
                        editable: true
                    },

                    /*//通道号
                    {
                        name: 'channelNo',
                        index: 'channelNo',
                        hidden: true,
                        editable: true
                    },*/

                    //商户来源
                    {
                        name: 'iseditble',
                        index: 'iseditble',
                        search: false,
                        stype: 'select',
                        searchoptions: {
                            sopt:['eq', 'ne'],
                            value: USER_FROM_MAP
                        },
                        /*editable: true,
                        edittype: 'select',
                        editoptions: USER_FROM_VALUE,*/
                        formatter: function(value){
                            return USER_FROM_MAP[value] || '';
                        }
                    },

                    //同步状态
                    {
                        name: 'status',
                        index: 'status',
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            sopt:['eq', 'ne'],
                            value: STATUS_MAP
                        },
                        /*editable: true,
                        edittype: 'select',
                        editoptions: STATUS_VALUE,*/
                        formatter: function(value){
                            return STATUS_MAP[value]||"";
                        }
                    },

                    //通道名称
                    {
                        name: 'channelNm',//channelNo
                        index: 'channelNm',
                        search: true,
                        searchoptions: { sopt:['lk','nlk', 'eq', 'ne'] },
                        editable: true,
                        edittype: 'select',
                        editoptions: {
                            value: CHANNELNM_MAP(),
                            dataInit: function(ele){
                                $(ele).removeAttr('name').attr('name', 'channelNo');
                            }
                        }
                    },

                    //通道同步状态
                    {
                        name: 'channleSynStatus',
                        index: 'channleSynStatus',
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            sopt:['eq', 'ne'],
                            value: CHANNEL_SYN_STATUS_MAP
                        },
                        formatter: function(value){
                            return CHANNEL_SYN_STATUS_MAP[value]||"";
                        }
                    },

                    //支付宝同步状态
                    {
                        name: 'channleSynAlipayStatus',
                        index: 'channleSynAlipayStatus',
                        search: false,
                        stype: 'select',
                        searchoptions: {
                            sopt:['eq', 'ne'],
                            value: CHANNEL_SYN_STATUS_MAP
                        },
                        formatter: function(value){
                            return CHANNEL_SYN_STATUS_MAP[value] || "";
                        }
                    },

                    //微信同步状态',
                    {
                        name: 'channleSynWechatStatus',
                        index: 'channleSynWechatStatus',
                        search: false,
                        stype: 'select',
                        searchoptions: {
                            sopt:['eq', 'ne'],
                            value: CHANNEL_SYN_STATUS_MAP
                        },
                        formatter: function(value){
                            return CHANNEL_SYN_STATUS_MAP[value] || "";
                        }
                    },

                    //通道返回码
                    {
                        name: 'channleCode',
                        index: 'channleCode'
                    },

                    //通道码返回详情
                    {
                        name: 'channleCodeDetail',
                        index: 'channleCodeDetail'
                    },

                    //创建时间
                    {
                        name: 'createTime',
                        index: 'createTime',
                        hidden: true,
                        formatter: function(value){
                            return dateFormatter(value);
                        }
                    },

                    //更新时间
                    {
                        name: 'updateTime',
                        index: 'updateTime',
                        hidden: true,
                        formatter: function(value){
                            return dateFormatter(value);
                        }
                    },

                    //拓展员ID
                    /*{
                         name: 'createOprId',
                         index: 'createOprId',
                         hidden: true,
                         editable: true
                     },*/

                    //修改人ID
                    /*{
                        name: 'updateOprId',
                        index: 'updateOprId',
                        hidden: true,
                        editable: true
                    },*/

                    //备注
                    {
                        name: 'remark',
                        index: 'remark',
                        editable: true
                    }
                ]
            });

            //批量导入
            if(Ctx.avail('operate.cmcht.import')){
                generateImportBtn(me.grid);
            }

            //下载/导出
            if(Ctx.avail('operate.cmcht.export')){
                generateDownloadBtn(me.grid);
            }

            //批量更改状态
            if(Ctx.avail('operate.cmcht.changestatus')){
                generateLinksBtn(me.grid);
            }

            //批量同步商户通道状态
            if(Ctx.avail('operate.cmcht.changestatus')) {
                generateChannelsBtn(me.grid);
            }
        }
    });

    /**
     * 导入
     * @param grid
     */
    function generateImportBtn(grid) {
        setTimeout(function () {
            Opf.Grid.navButtonAdd(grid, {
                title: "批量导入通道商户",
                caption: "",
                id: "importCmchtObjTarget",
                name: "importCmchtObjTarget",
                buttonicon: "icon-upload-alt white",
                position: "last",
                onClickButton: function () {
                    uploader.doImport({
                        uploadTitle: "批量导入通道商户",
                        uploadUrl: url._('operate.cmcht.import'),
                        uploadTpl: url._('operate.cmcht.download'),
                        uploadParams: [
                            {label:'所属通道', type:'select', name:'channelNo', url:url._('operate.cmcht.channels'), formatterData:dataFormatter}
                        ],
                        cbSuccess: function(queueId){
                            grid.trigger("reloadGrid", [{current:true}]);
                        }
                    });
                }
            });
        }, 0);
    }

    /**
     * 下载/导出
     * @param grid
     */
    function generateDownloadBtn(grid){
        setTimeout(function () {
            Opf.Grid.navButtonAdd(grid, {
                title: '导出通道商户资料',
                caption: "",
                id: "downloadCmchtObjTarget",
                name: "downloadCmchtObjTarget",
                buttonicon: "icon-download-alt white",
                position: "last",
                onClickButton: function () {
                    var tpl = [
                        '<form class="form-settle-check"><div class="container">',
                        '<style type="text/css">.form-settle-check .col-xs-3{text-align:right;margin-top:6px;}</style>',
                        '<div id="J_cMcht_export" class="container">',
                            '<div class="row settle-styles-row">',
                                '<div class="col-xs-3">所属通道：</div>',
                                '<div class="col-xs-9">',
                                    '<select name="channelNo"></select>',
                                '</div>',
                            '</div>',
                            '<div class="row settle-styles-row">',
                                '<div class="col-xs-3">商户状态：</div>',
                                '<div class="col-xs-9">',
                                    '<select name="status"></select>',
                                '</div>',
                            '</div>',
                            '<div class="row settle-styles-row">',
                                '<span class="text-info"><i class="icon-info-sign"></i> 将按照所属通道和选择的状态导出商户资料！</span>',
                            '</div>',
                        '</div>',
                        '</div></form>'
                    ].join('');

                    var $dialogForm = $(tpl);

                    //生成通道下拉列表
                    var $channelNo = $("select[name='channelNo']", $dialogForm);
                    createOptions(url._('operate.cmcht.channels'), $channelNo,
                        function(data){
                            return dataFormatter(data);
                        }
                    );

                    //生成状态下拉列表
                    var $status = $("select[name='status']", $dialogForm);
                    for(var k in STATUS_MAP){
                        var $option = $('<option value="' + k + '">' + STATUS_MAP[k] + '</option>');
                        $status.append($option);
                    }

                    var $dialog = Opf.Factory.createDialog($dialogForm, {
                        destroyOnClose: true,
                        title: "导出通道商户资料",
                        width: 450,
                        height: 420,
                        autoOpen: true,
                        modal: true,
                        buttons: [{
                            type: 'submit',
                            text: '提交',
                            className: 'submit',
                            icons: { primary: 'icon-ok' },
                            click: function () {
                                var params = {
                                    groupOp: "AND",
                                    rules: [
                                        {
                                            field: "channelNo",
                                            op: "eq",
                                            data: $("select[name='channelNo']",$dialogForm).val()
                                        },{
                                            field: "status",
                                            op: "eq",
                                            data: $("select[name='status']",$dialogForm).val()
                                        }
                                    ]
                                };
                                var postData = { filters: JSON.stringify(params) };
                                var ajaxOptions = {
                                    url: url._("operate.cmcht.export"),
                                    type: 'GET',
                                    data: postData,
                                    success: function(resp){
                                        if(resp&&resp.url){
                                            Opf.download(resp.url);
                                        }
                                        $dialog.trigger('dialogclose');
                                    }
                                };
                                $.ajax(ajaxOptions);
                            }
                        },{
                            type: 'cancel'
                        }]
                    });
                }
            });
        }, 10);
    }

    /**
     * 批量更改
     * @param grid
     */
    function generateLinksBtn(grid){
        var statusMap = {
            "2": "批量激活",
            "3": "批量停用",
            "4": "批量删除"
        };
        var formatterData = function(data){
            var _data = [];
            for(var k in data){
                var kv = {};
                kv.text = data[k];
                kv.value = k;
                _data.push(kv);
            }
            return _data;
        };
        setTimeout(function () {
            Opf.Grid.navButtonAdd(grid, {
                title: '批量更改通道商户状态',
                caption: "",
                id: "stateCmchtObjTarget",
                name: "stateCmchtObjTarget",
                buttonicon: "icon-unlink white",
                position: "last",
                onClickButton: function () {
                    uploader.doImport({
                        uploadTitle: "批量更改通道商户状态",
                        uploadUrl: url._('operate.cmcht.changestatus'),
                        uploadTpl: url._('operate.cmcht.download'),
                        uploadParams: [
                            {label:'所属通道', type:'select', name:'channelNo', url:url._('operate.cmcht.channels'), formatterData:dataFormatter},
                            {label:'选择商户状态', type:'select', name:'status', url:statusMap, formatterData:formatterData}
                        ],
                        cbSuccess: function(queueId){
                            grid.trigger("reloadGrid", [{current:true}]);
                        }
                    });
                }
            });
        }, 20);
    }

    function CHANNELNM_MAP(){
        var result = {};
        Opf.ajax({
            type: 'GET',
            async: false,
            url: url._('operate.cmcht.channels'),
            success: function (resp) {
                _.map(resp, function (value){
                    result[value.channelNo] = value.channelNm;
                });
            }
        });
        return result;
    }

    /**
     * 手动批量同步商户状态
     * @param grid
     */
    function generateChannelsBtn(grid){
        setTimeout(function () {
            Opf.Grid.navButtonAdd(grid, {
                title: '手动批量同步商户状态',
                caption: "",
                buttonicon: "icon-hand-up white",
                position: "last",
                onClickButton: function () {
                    Opf.confirm("是否需要批量同步商户状态？", function(result){
                        if(result){
                            Opf.ajax({
                                type: 'POST',
                                url: url._('operate.cmcht.batofchannelstate'),
                                beforeSend: function(){
                                    Opf.UI.setLoading($('#main-body'), true);
                                },
                                success: function(resp){
                                    Opf.alert({
                                        title: '商户状态批量同步结果',
                                        message: resp && resp.content || "同步完成"
                                    });
                                },
                                complete: function(){
                                    Opf.UI.setLoading($('#main-body'), false);
                                }
                            })
                        }
                    });
                }
            });
        }, 30);
    }

});