/**
 * @created 2014-3-12 19:27:29
 */



define(['App',
    'tpl!app/oms/settle/stlm-account/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/settle',
    'assets/scripts/fwk/factory/typeahead.factory',
    'common-ui',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'select2'
], function(App, tableCtTpl, settleLang, typeaheadFactory,commonUi) {
    var MODE_MAP = {
        "0": settleLang._("stlm-account.mode.0"),
        "1": settleLang._("stlm-account.mode.1"),
        "2": settleLang._("stlm-account.mode.2")
    },
        ISDEFAULT_MAP = {
            "0": settleLang._("stlm-account.isDefault.0"),
            "1": settleLang._("stlm-account.isDefault.1")
        },
        TYPE_MAP = {
            "0": settleLang._("stlm-account.type.0"),
            "1": settleLang._("stlm-account.type.1")
        },
        STATUS_MAP = {
            "0": settleLang._("stlm-account.status.0"),
            "1": settleLang._("stlm-account.status.1")
        };

    var infoMap = {};
    var MAX_TYPEAHEAD_LENGTH = 20;

    var typeaheadTplFn = _.template([
        '<div style="padding: 0 15px; height: 30px; line-height: 30px">',
            '<%= content %>',
        '</div>'
    ].join(''));

    App.module('SettleApp.StlmAccount.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.StlmAccounts = Marionette.ItemView.extend({
            tabId: 'menu.stlm.account',
            template: tableCtTpl,

            events: {

            },

            onRender: function() {
                var me = this;

                setTimeout(function() {

                    me.renderGrid();

                }, 1);
            },

            attachValidation: function() {
                return {
                    setupValidation: Opf.Validate.setup,
                    addValidateRules: function(form) {
                        Opf.Validate.addRules(form, {
                            rules: {
                                mode: {
                                    required: true
                                },
                                isDefault: {
                                    required: true
                                },
                                type: {
                                    required: true
                                },
                                no: {
                                    required: true,
                                    // isBankCard: true,
                                    checkZbankNoRepeat:true
                                },
                                province: {
                                    required: true
                                },
                                city: {
                                    required: true
                                },
                                country: {
                                    required: true
                                },
                                custNo: {
                                    required: true,
                                    number: true
                                },
                                name: {
                                    required: true
                                },
                                zbankNm: {
                                    required: true
                                },
                                zbankAddr: {
                                    required: true
                                },
                                netNo: {
                                    required: true
                                },
                                bankName: {
                                    required: true
                                }
                            }
                        });
                    }
                };

            },

            renderGrid: function() {
                var me = this;
                var validation = this.attachValidation();
                var roleGird = App.Factory.createJqGrid({
                    rsId: 'stlmAccount',
                    caption: settleLang._('stlmAccount.txt'),

                    actionsCol: {
                        canButtonRender: function(name, opts, rowData) {

                            //默认账户不能删除
                            if(name === 'del' && rowData.isDefault === '1') {
                                console.log('isDefault true can not delete');
                                return false;
                            }
                        }
                    },

                    nav: {
                        formSize: {
                            width: Opf.Config._('ui', 'stlmAccount.grid.form.width'),
                            height: Opf.Config._('ui', 'stlmAccount.grid.form.height')
                        },
                        add: {
                            beforeShowForm: function(form) {
                                validation.addValidateRules(form);
                                patch(form);
                                setupStlmInfo(me, form);

                                var url = 'api/settle/stlm-accounts/check?no=';
                                $(form).find('[name=no]').data("params",{"url":url});

                                var $select = $(form).find('select[name="mode"]');
                                var $isDefault = $(form).find('select[name="isDefault"]');
                                var $status = $(form).find('select[name="status"]');

                                $status.on('change', function() {
                                    checkChoiceIsDefault(form);
                                }); 

                                $select.on('change', function() {
                                    checkChoiceIsDefault(form);

                                    // if ($(this).val() === '0') {
                                    //     $isDefault.empty().append('<option role="option" value="0">否</option>');
                                    // } else {
                                    //     $isDefault.empty().append('<option role="option" value="0">否</option><option role="option" value="1">默认账户</option>');
                                    // }
                                });
                                $select.trigger('change');
                            },
                            afterShowForm: function(form) {
                                var $removeIcon = form.find('.icon-remove');
                                var $zbankNm = form.find('textarea[name=zbankNm]');
                                $removeIcon.click(function() {
                                    $(this).css({
                                        'display': 'none'
                                    });
                                    $zbankNm.prop({
                                        disabled: false
                                    });
                                    $zbankNm.typeahead('val', '');
                                });

                                addSelect2($('#bankName'), false, 'bankNo', roleGird, $removeIcon);
                            },
                            onclickSubmit: function(params, postdata) {
                                var noNeedToPost = [
                                    'province', 'city', 'country',
                                    'lastOperaterId', 'lastUpdateTime',
                                    'balance'
                                ];

                                var select2Data = $('#bankName').select2('data');

                                postdata['bankName'] = select2Data ? select2Data.value : '';
                                postdata['bankNo'] = select2Data ? select2Data.key : '';

                                _.each(infoMap, function(value, key) {
                                    postdata[key] = value;
                                });

                                _.each(noNeedToPost, function(delName) {
                                    delete postdata[delName];
                                });

                                postdata['unionNo'] = infoMap.zbankNo;

                                var province = $('[name=province]').find('option:selected').text();
                                var city = $('[name=city]').find('option:selected').text();
                                var country = $('[name=country]').find('option:selected').text();
                                var zbankNm = $('[name=zbankNm]').val();
                                postdata['zbankNm'] = zbankNm;
                                return postdata;
                            },
                            beforeSubmit: validation.setupValidation
                        },
                        edit: {
                            beforeShowForm: function(form) {
                                validation.addValidateRules(form);
                                patch(form);
                                var selectId = Opf.Grid.getLastSelRowId(roleGird);
                                var rowData = roleGird.getRowData(selectId);
                                var parseRegionCode = Opf.Util.parseRegionCode(rowData.zbankCode);

                                me.defaultProvinceVal = parseRegionCode[0];
                                me.defaultCityVal = parseRegionCode[1];
                                me.defaultCountryVal = parseRegionCode[2];
                                me.defaultZbankNmVal = rowData.zbankNm;
                                me.defaultNetNo = rowData.netNo;
                                me.edit = true;
                                setupStlmInfo(me, form);

                                var url = 'api/settle/stlm-accounts/check?no=';
                                $(form).find('[name=no]').data('params',{"url":url,"selId":selectId});

                                var $select = $(form).find('select[name="mode"]');
                                var $isDefault = $(form).find('select[name="isDefault"]');
                                var $statusSelect = $(form).find('select[name="status"]');

                                var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));

                                if(rowData.isDefault === '1') {
                                    console.log('这是默认账户');
                                    $select.find('option').each(function() {
                                        if($(this).val() === '0') {
                                            $(this).remove();
                                        }
                                    });

                                    $isDefault.empty().append('<option role="option" value="1">默认账户</option>');

                                    $statusSelect.empty().append('<option role="option" value="0">正常</option>');


                                } else {
                                    console.log('这不是默认账户');
                                    $statusSelect.on('change', function() {
                                        checkChoiceIsDefault(form);
                                    });

                                    $select.on('change', function() {
                                        checkChoiceIsDefault(form);
                                        // if ($(this).val() === '0') {
                                        //     $isDefault.empty().append('<option role="option" value="0">否</option>');
                                        // } else {
                                        //     $isDefault.empty().append('<option role="option" value="0">否</option><option role="option" value="1">默认账户</option>');
                                        // }
                                    });

                                    $select.trigger('change');

                                }
                            },
                            afterShowForm: function(form) {
                                var $removeIcon = form.find('.icon-remove');
                                me.$removeIcon.css({
                                    'line-height':'60px'
                                });
                                 me.$removeIcon.on('click',function(){
                                    me.$zbankNm.data('regionCode',me.$country.val());
                                });
                                if(me.defaultZbankNmVal){
                                    me.$zbankNm.val(me.defaultZbankNmVal);
                                    me.defaultZbankNmVal = null;
                                    if(me.edit) { 
                                        commonUi.triggerTahSelected(me.$zbankNm,me.$removeIcon);
                                        me.edit = false;
                                    }
                                }

                                addSelect2($('#bankName'), true, 'bankNo', roleGird, $removeIcon);


                            },
                            onclickSubmit: function(params, postdata) {
                                var noNeedToPost = [
                                    'province', 'city', 'country',
                                    'lastOperaterId', 'lastUpdateTime',
                                    'balance',
                                ];

                                _.each(infoMap, function(value, key) {
                                    postdata[key] = value;
                                });

                                var select2Data = $('#bankName').select2('data');

                                postdata['bankName'] = select2Data ? select2Data.value : '';
                                postdata['bankNo'] = select2Data ? select2Data.key : '';
                                
                                _.each(noNeedToPost, function(delName) {
                                    delete postdata[delName];
                                });

                                postdata['unionNo'] = infoMap.zbankNo;
                                postdata['zbankNm'] = $('[name=zbankNm]').val();
                                return postdata;
                            },
                            beforeSubmit: validation.setupValidation
                        },
                        view: {
                            width: Opf.Config._('ui', 'stlmAccount.grid.viewform.width'),
                            height: Opf.Config._('ui', 'stlmAccount.grid.viewform.height')
                        },
                        search: {
                            beforeShowSearch: function(form) {
                                $(form).find('select.input-elm').trigger('change').each(function(){
                                    $(this).trigger('change');
                                })
                                return true;
                            }
                        }
                    },
                    gid: 'stlm-accounts-grid', //innerly get corresponding ct '#stlm-accounts-grid-table' '#stlm-accounts-grid-pager'
                    url: url._('stlm.account'),
                    colNames: {
                        id: settleLang._('stlm.account.id'), //ID
                        mode: settleLang._('stlm.account.mode'), //账户种类(0-仅为收款账户，1-仅为付款账户，2-即为收款又为付款)
                        isDefault: settleLang._('stlm.account.is.default'), //是否为默认付款账户(0-不为默认账户，1-为默认账户)
                        type: settleLang._('stlm.account.type'), //账户类型(0-对公，1-对私)
                        no: settleLang._('stlm.account.no'), //账户账号
                        zbankNm: settleLang._('stlm.account.zbank.nm'), //账户开户支行名称
                        custNo: settleLang._('stlm.account.cust.no'), //客户号
                        name: settleLang._('stlm.account.name'), //账户名称
                        status: settleLang._('stlm.account.status'), //账户状态(0-正常，1-异常)
                        bankNo: settleLang._('stlm.account.bank.no'), //账户开户行号
                        bankName: settleLang._('stlm.account.bank.name'), //账户开户行名称
                        zbankNo: settleLang._('stlm.account.zbank.no'), //账户开户支行号
                        zbankAddr: settleLang._('stlm.account.zbank.addr'), //账户开户支行地址
                        zbankCode: settleLang._('stlm.account.zbank.code'), //账户开户支行地区号
                        netNo: settleLang._('stlm.account.net.no'), //账户网银支付号
                        unionNo: settleLang._('stlm.account.union.no'), //账户联行号
                        balance: settleLang._('stlm.account.balance'), //账户余额
                        lastOperaterId: settleLang._('stlm.account.last.operater.id'), //最后更新操作员

                        //add row
                        lastOperaterName: settleLang._('stlm.account.last.operater.name'), //最后更新操作员
                        //add end

                        lastUpdateTime: settleLang._('stlm.account.last.update.time') //最后更新时间

                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['mode', 'isDefault', 'type', 'name', 'bankName', 'status', 'custNo'],
                            xs: ['mode', 'isDefault', 'type', 'name', 'status'],
                            sm: ['mode', 'type', 'name'],
                            md: ['type'],
                            ld: []
                        }
                    },

                    colModel: [
                        {name:         'id', index:         'id', editable: false, hidden: true},  //ID
                        {name:         'mode', index:         'mode', search:true,editable: true, formatter: modeFormatter,
                            stype: 'select',
                            searchoptions: {
                                value: MODE_MAP,
                                sopt: ['eq','ne']
                            },
                            edittype:'select',
                            editoptions: {
                                value: MODE_MAP
                            }
                        },  //账户种类(0-仅为收款账户，1-仅为付款账户，2-即为收款又为付款)
                        {name:         'status', index:         'status', search:true,editable: true, formatter: statusFormatter,
                            edittype:'select',
                            editoptions: {
                                value: STATUS_MAP
                            },
                            stype: 'select',
                            searchoptions: {
                                value: STATUS_MAP,
                                sopt:['eq','ne']
                            }

                        },  //账户状态(0-正常，1-异常)
                        {name:         'isDefault', index:         'isDefault', search:false,editable: true, formatter: isDefaultFormatter,
                            edittype:'select',
                            editoptions: {
                                value: ISDEFAULT_MAP
                            }
                        },  //是否为默认付款账户(0-对公，1-对私)
                        {name:         'type', index:         'type', search:true,editable: true, formatter: typeFormatter,
                            edittype:'select',
                            editoptions: {
                                value: TYPE_MAP
                            },
                            stype: 'select',
                            searchoptions: {
                                value: TYPE_MAP,
                                sopt: ['eq','ne']
                            }
                        },  //账户类型(0-不为默认账户，1-为默认账户)
                        {name:         'name', index:         'name', width: 250, search:false,editable: true},  //账户名称
                        {name:         'bankName', index:         'bankName', width: 250, search:true,editable: true,
                            _searchType:'string'

                        },  //账户开户行名称

                        {name:         'no', index:         'no', width: 250, search:true,editable: true,
                            _searchType:'string'
                        },  //账户账号
                        {name:         'zbankNm', index:         'zbankNm', search:false, editable: true, hidden: true, edittype:'textarea'},  //账户开户支行名称
                        {name:         'custNo', index:     'custNo', search:true, editable:true,
                            _searchType:'string',
                            searchoptions: {
                            sopt: ['eq']
                            }

                        },  //客户号

                        {name:         'bankNo', index:         'bankNo', search:false,editable: false, hidden: true},  //账户开户行号
                        {name:         'zbankNo', index:         'zbankNo', search:false,editable: false, hidden: true},  //账户开户支行号
                        {name:         'zbankAddr', index:         'zbankAddr', search:false,editable: false, hidden: true},  //账户开户支行地址
                        {name:         'zbankCode', index:         'zbankCode', search:false,editable: false, hidden: true},  //账户开户支行地区号
                        {name:         'netNo', index:         'netNo', search:false,editable: false, hidden: true},  //账户网银支付号
                        {name:         'unionNo', index:         'unionNo', search:false,editable: false, hidden: true},  //账户联行号
                        {name:         'balance', index:         'balance', search:false,editable: false, hidden: true, formatter: Opf.currencyFormatter},  //账户余额
                        {name:         'lastOperaterId', index:         'lastOperaterId', search:false,editable: false, viewable: false, hidden: true},  //最后更新操作员

                        //add row
                        {name:         'lastOperaterName', index:       'lastOperaterName', search:false,editable: false, hidden:true},
                        //add end

                        {name:         'lastUpdateTime', index:         'lastUpdateTime', search:false,editable: false, hidden: true} //最后更新时间
                    ],

                    loadComplete: function() {}
                });
                    
                setTimeout(function () {

                    if(!Ctx.avail('stlmAccount.acctMmCode')) {
                        return;
                    }

                    Opf.Grid.navButtonAdd(roleGird, {
                        caption: "", //
                        name: "acctMmCode",
                        title:'转账密码',
                        buttonicon: "icon-opf-icon-key-temp white",
                        onClickButton: function() {
                            addDialog('stlm.account.modify');
                        },
                        position: "last" //first
                    });

                }, 10);



                setTimeout(function () {

                    $('.icon-opf-icon-key-temp').html('<i class="icon-opf-icon-key"></i>');

                }, 100);

            }

        });

    });

    function modeFormatter(val) {
        return MODE_MAP[val];
    }

    function isDefaultFormatter(val) {
        return ISDEFAULT_MAP[val];
    }

    function typeFormatter(val) {
        return TYPE_MAP[val];
    }

    function statusFormatter(val) {
        return STATUS_MAP[val];
    }

    function noFormatter(val) {
        return NO_MAP[val];
    }



    function patch(form) {
        var $addressHtml = [
            '<tr rowpos="6" class="FormData">',
                '<td class="CaptionTD" name="bankImg"></td>',
                '<td class="DataTD" name="bankName"></td>',
            '</tr>',
            '<tr rowpos="7" class="FormData">',
                '<td class="CaptionTD">省</td>',
                '<td class="DataTD">',
                    '&nbsp;',
                    '<select class="FormElement ui-widget-content ui-corner-all" name="province" style="width:70%">',
                    '<option class="placeholder">-选择省-</option>',
                    '</select>',
                '</td>',
            '</tr>',

            '<tr rowpos="8" class="FormData">',
                '<td class="CaptionTD">市</td>',
                '<td class="DataTD">',
                    '&nbsp;',
                    '<select class="FormElement ui-widget-content ui-corner-all" name="city" style="width:70%">',
                        '<option class="placeholder">-选择市-</option>',
                    ' </select>',
                '</td>',
            '</tr>',

            '<tr rowpos="9" class="FormData">',
                '<td class="CaptionTD">区</td>',
                '<td class="DataTD">',
                    '&nbsp;',
                    '<select class="FormElement ui-widget-content ui-corner-all" name="country" style="width:70%">',
                        '<option class="placeholder">-选择区-</option>',
                    '</select>',
                '</td>',
            '</tr>',
        ].join('');
        form.find('#tr_no').after($addressHtml);


    }

    function setupStlmInfo(me, form) {
        var $province = form.find('[name=province]');
        var $city = form.find('[name=city]');
        var $country = me.$country = form.find('[name=country]');
        var $no = form.find('[name=no]');
        var $zbankNm = me.$zbankNm = form.find('[name=zbankNm]');
        var $netNo = form.find('[name=netNo]');
        var $bankImg = form.find('td[name=bankImg]');
        var $bankName = form.find('td[name=bankName]');

        var $removeIcon = me.$removeIcon = commonUi.creatRemoveIconWith($zbankNm);

        if (me.defaultProvinceVal) {
            commonUi.address($province, $city, $country, me.defaultProvinceVal, me.defaultCityVal, me.defaultCountryVal);
            me.defaultCountryVal = me.defaultProvinceVal = me.defaultCountryVal = undefined;
        } else {
            commonUi.address($province, $city, $country);
        }

        $netNo.prop({ 'disabled':true });
        $zbankNm.on('change', function() {
            if(!$(this).val()){
                $netNo.val('');
                infoMap['zbankNo'] = infoMap['unionNo'] = undefined;
            }
            else{
                Opf.ajax({
                    type: 'GET',
                    autoMsg:false,
                    url: url._('zbankno', {
                        zbankNo: infoMap['zbankNo']
                    }),
                    success: function(data) {
                        $netNo.val(data.key);
                    }
                });
                
            }
        });


        //填充账户帐号时获取银行code以及更新支行输入框
        //TODO 先用比较落后的方式去实现,后面再修改这块
        // $no.change(function() {
        //     var $this = $(this);
        //     $zbankNm.val() && $removeIcon.trigger('click');
        //     Opf.ajax({
        //         type: 'GET',
        //         autoMsg:false,
        //         async: false,
        //         url: url._('bankcode', {
        //             bankCardNo: $this.val()
        //         }),
        //         success: function(data) {
        //             if(data.name){

        //                 //保存数据以便接下来传数据给后台
        //                 infoMap['bankNo'] = data.value;
        //                 infoMap['bankName'] = data.name;

        //                 //银行卡号改变时清空支行输入框以及保存此时的银行编号
        //                 $zbankNm.val('').data('bankCode', data.value);

        //                 //展示银行logo以及名称
        //                 var bankLogeImg = 'assets/images/bankCardLogo/bankcard_' + data.value + '.png';
        //                 var bankLogeHtml = '<img src=' + bankLogeImg + ' style="width:35px;height:35px">';

        //                 var bankNameLabelHtml = '<div style="line-height:35px">' + data.name + '</div>';
        //                 $bankImg.empty().append(bankLogeHtml);
        //                 $bankName.empty().append(bankNameLabelHtml);
        //             }
        //         }
        //     });
        // });


        //当选择-区-时更新支行输入框
        $country.on('change', function() {   
            $zbankNm.val() && $removeIcon.trigger('click'); 
            //银行卡号改变时清空支行输入框以及保存此时的区号
            $zbankNm.data('regionCode', $(this).val());
            console.log('you change country' + me.defaultZbankNmVal);
            //保存数据以便接下来传数据给后台
            infoMap['zbankCode'] = $(this).val();
            infoMap['zbankNo'] = '';
        });

        //支行名称获取
        typeaheadEl(me, {
            el: $zbankNm,
            url: url._('options.zbankName')
        });

        if(me.edit){
            $no.trigger('change');
            $netNo.val(me.defaultNetNo);
            console.log('$netNo'+$netNo.val());
         }
    }

    function typeaheadEl(me, options) {
        var $el = options.el;
        var url = options.url;
        var ZBANK_TYPEHEAD = 'stlm-account-zbank';
        var model, zbankTypeahead;

        // model = typeaheadFactory.createModel(ZBANK_TYPEHEAD, {
        //     search: 'name',
        //     prefectch: null,
        //     remote: {
        //         url: url,
        //         replace: function(url, query) {
        //             return url + '?' + $.param({
        //                 kw: encodeURIComponent(me.$zbankNm.val()),
        //                 regionCode: me.$zbankNm.data('regionCode'),
        //                 //改变bank
        //                 bankCode: $('#bankName').select2('data').key //me.$zbankNm.data('bankCode')
        //             });
        //         }
        //     }
        // });
        
        function replaceUrl(url, query) {
            return url + '?' + $.param({
                kw: encodeURIComponent(me.$zbankNm.val()),
                regionCode: me.$zbankNm.data('regionCode'),
                //改变bank
                bankCode: $('#bankName').select2('data').key, //me.$zbankNm.data('bankCode')
                maxLength: MAX_TYPEAHEAD_LENGTH
            });
        }

        zbankTypeahead = typeaheadFactory.newTypeahead(ZBANK_TYPEHEAD, {
            el: $el,
            displayKey: 'name',
            source: function(query, process) {
                $.ajax({
                    url: replaceUrl(url, query),
                    type: 'GET',
                    beforeSend: function() {
                        $el.parent().find('.tt-dropdown-menu').find('.tt-dataset-'+ZBANK_TYPEHEAD).html(typeaheadTplFn({content: '正在搜索...'})).show();
                    },
                    success: function(resp) {
                        process(resp);
                    }
                });
            },
            templates: {
                empty: typeaheadTplFn({content: '未能搜索到结果...'})
            }
        });

        zbankTypeahead.on('typeahead:opened', function(e, obj) {
            zbankTypeahead.parent('.twitter-typeahead').find('.tt-dropdown-menu').css({
                top: 'auto',
                bottom: '100%',
                'margin-bottom': '1px'
            });
        });

        zbankTypeahead.on('typeahead:selected', function(e, datum) {
            var zbankNo = datum.value.toString();
            infoMap['zbankNo'] = infoMap['unionNo'] = zbankNo;
            $el.trigger('change');
            commonUi.triggerTahSelected($el,me.$removeIcon);
        });
    }



    function checkChoiceIsDefault ($form) {
        $form = $($form);
        var status = $form.find('select[name="status"]').val();
        var mode = $form.find('select[name="mode"]').val();

        if(status === '1' || mode === '0') {
            $form.find('select[name="isDefault"]').empty().append('<option role="option" value="0">否</option>');
        } else {
            $form.find('select[name="isDefault"]').empty().append('<option role="option" value="0">否</option><option role="option" value="1">默认账户</option>');
        }
    }

    // function bankCardNoInput (el) {
    //        var $el = $(el);
    //        var _last;
    //        var validateFn = function (val) { return true };

    //        $el.on('change.common.ui', function () {
    //            //TODO if same with last time
    //            var val = $.trim($(this).val());

    //            if(_last && _last === val) {
    //                return false;
    //            }

    //            //TODO validation
    //            if(validateFn(val) === false) {
    //                return false;
    //            }

    //            $el.data('bankNo', null);
    //            _last = val;

    //            Opf.ajax({
    //                type: 'GET',
    //                async: false,
    //                url: url._('bankcode', {bankCardNo: $el.val()}),
    //                success:function(data){
    //                    $el.data('bankNo',data.value);
    //                    console.log('bankCode1:'+$el.data('bankNo'));
    //                }
    //            });

    //            console.log('bankCode2:'+$el.data('bankNo'));

    //        });


    //    }
    //    
    
    function addDialog(postUrl) {
        var tpl = $('#add-password-dialog-template').html();

        var $dialog = Opf.Factory.createDialog(tpl, {
            destroyOnClose: true,
            autoOpen: true,
            width: 360,
            height: 250,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function (e) {
                    var valid = $(this).find('form').valid();

                    if(valid) {
                        var $button = $($(e.target).closest('button'));
                        $button.addClass('disabled').find('span.text').html("正在提交...");
                        submitForm(postUrl, this, $button);

                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function() {
                Opf.Validate.addRules($(this).find('form'), {
                    rules: {
                        id: 'required'
                    }
                });

                Opf.ajax({
                    url: 'api/system/options/account-infos',
                    type:'GET',
                    success: function(resp) {
                        console.log(resp);
                        $(resp).each(function(key, values) {
                            $('#acctMmCodeId').append('<option value="' + values.key + '">' + values.value + '</option>');
                        });
                        
                    }
                });

                $('#acctMmCodeId').select2({
                    placeholder: ' -- 请输入账号 -- ',
                    // width: '80%',
                    formatResult: function(data, container, query, escapeMarkup){
                        // console.log('----formatResult----');
                        // console.log(data, container, query, escapeMarkup);
                        return data.text;
                    },
                    formatSelection: function(data, container, escapeMarkup){
                        // console.log('----formatSelection----');
                        // console.log(data, container, escapeMarkup);
                        return data.text;
                    }
                });
                
                // addFormatSelect2('#acctMmCodeId', {
                //     placeholder: '请输入账号',
                //     url: url._('stlm.account.acctMmCode'), //'api/system/options/account-infos'
                // });
            }
        });
    }

    function submitForm(postUrl, dialog, button) {

        var postData = {};

        $(dialog).find('form').find(':input').each(function() {
            var $name = $(this).attr('name');
            $name && (postData[$name] = $(this).val());
        });

        console.log(postData);

        Opf.ajax({
            url: url._(postUrl, {id: postData.id || ''}),
            type:'PUT',
            jsonData: postData,
            success: function(resp) {
                console.log(resp);
                // $(GRID).trigger("reloadGrid", [{current:true}]);
                if(resp.success) {
                    // Opf.Toast.success('操作成功');
                    Opf.alert('操作成功:  ' + resp.data);
                    // $('#call-back-info').html(resp.data || '操作成功，但是后台未返回数据');
                    $(dialog).dialog('destroy');
                } else {
                    $button.removeClass('disabled');
                }
            },
            error: function(resp) {
                $button.removeClass('disabled');
                console.log(resp);
            },
            complete: function(resp) {
                
            }
        });
    }


    // function addFormatSelect2 ($select, options) {

    //     $($select).select2({
    //         placeholder: options.placeholder || '',
    //         minimumInputLength: 1,
    //         width: '73%',
    //         formatResult: function(data, container, query, escapeMarkup){
    //             return data.text;
    //         },
    //         formatSelection: function(data, container, escapeMarkup){
    //             return data.text;
    //         },
    //         formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
    //         formatInputTooShort: function (input, min) {
    //             var n = min - input.length;
    //             return "请输入至少 " + n + "个字符";
    //         },
    //         formatSearching: function () { 
    //             return "搜索中..."; 
    //         },
    //         adaptContainerCssClass: function(classname){
    //             return classname;
    //         },
    //         escapeMarkup: function (m) {
    //             return m;
    //         }
    //     });

    // }
    
    function addSelect2($select, isEdit, name, roleGird, $removeIcon) {
        var bankName = $($select).val();

        $($select).val('');
        $($select).select2({
            placeholder: '请选择开户行',
            minimumInputLength: 1,
            width: '70%',
            ajax: {
                type: "get",
                url: url._('bank.info'),
                dataType: 'json',
                data: function (term, page) {
                    return {
                        value: encodeURIComponent(term)
                    };
                },
                results: function (data, page) {
                    return {
                        results: data
                    };
                }
            },
            initSelection: function(element, callback){
                var number = $(element).val();
                if (number !== "") {
                    $.ajax({
                        url: url._('bank.info'),
                        dataType: "json"
                    }).done(function(data) { 
                        callback(data);
                    });
                }
            },
            id: function (e) {
                return e.key;
            },
            formatResult: function(data, container, query, escapeMarkup){
                return data.value;
            },
            formatSelection: function(data, container, escapeMarkup){
                return data.value;
            },
            formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
            formatInputTooShort: function (input, min) {
                var n = min - input.length;
                return "请输入至少 " + n + "个字符";
            },
            formatSearching: function () { 
                return "搜索中..."; 
            },
            adaptContainerCssClass: function(classname){
                return classname;
            },
            escapeMarkup: function (m) {
                return m;
            }
        });

        var selId = Opf.Grid.getSelRowId(roleGird);

        var bankNo = selId ? roleGird._getRecordByRowId(selId)[name] : null;

        if(isEdit && bankName && bankNo) {
            $($select).select2("data", {key: bankNo, value: bankName});
        }

        $($select).on('change', function() {
            console.log('select2 had changed!!');
            $removeIcon.triggerHandler('click');
        });

    }





    return App.SettleApp.StlmAccount.List.View;

});