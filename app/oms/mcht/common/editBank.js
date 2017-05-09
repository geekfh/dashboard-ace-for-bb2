/**
 * Created by wupeiying on 2015/12/22.
 */
define(['App',
    'tpl!app/oms/mcht/common/templates/bank.tpl',
    'assets/scripts/fwk/factory/typeahead.factory',
    'common-ui',
    'jquery.validate',
    'jquery.autosize'
], function (App, bankTpl) {

    return editView = {
        onEditBankDialog: function(grid, rowData) {
            Opf.ajax({
                type: 'GET',
                url: url._('merchant', { id: rowData.id }),
                success: function(resp) {
                    if(resp != ''){
                        var $dialog = Opf.Factory.createDialog(bankTpl({model: resp}), {
                            destroyOnClose: true,
                            title: '修改银行卡',
                            autoOpen: true,
                            width: 800,
                            height: 620,
                            modal: true,
                            buttons: [{
                                type: 'submit',
                                click: function () {
                                    var me = this;
                                    var validResult = $(me).find('form').valid();
                                    if(validResult){

                                        var accountProxy = $(me).find('#accountProxy').is(":checked") == true ? 1 : 0;//委托人
                                        var accountType = $(me).find('input[name="accountType"]:checked').val();//对公对私(0-对公、1-对私)

                                        //开户名
                                        var accountName = '';
                                        var userName = '';
                                        var mchtName = '';
                                        if($(me).find('#accountName')[0].tagName == 'SELECT'){
                                            accountName = $(me).find('#accountName').find('option:selected').attr('data');
                                            accountType = $(me).find('#accountName').find('option:selected').val();
                                        }
                                        else{
                                            accountName = $(me).find('#accountName').val();
                                        }

                                        //开户行
                                        var bankInfos = $(me).find('#bankInfos').select2('data');
                                        var bankNo = bankInfos != null ? bankInfos.key : $(me).find('#bankLongNo').val();
                                        var bankName = bankInfos != null ? bankInfos.value : $(me).find('#bankLongName').val();

                                        //账户号
                                        var accountNo = $(me).find('#accountNo').val();

                                        //开户支行区
                                        var zbankRegionNo = $(me).find('#zbankRegionCode').find('option:selected').val();

                                        //支行名
                                        var zbankName = $(me).find('#zbankName').val();
                                        var zbankNo = $(me).find('#zbankNo').val();

                                        //[华势通道]显示，用户没勾选，不能修改
                                        //提示[华势通道] 存在 && checkbox没选中
                                        // if($(me).find('.mchtType-group').length > 0 && $(me).find('.mchtType-group').is(':hidden') == false && $(me).find('[name="ck_mchtType"]').is(':checked') == false){
                                        //     Opf.Toast.error('如已线下变更银行卡或未修改银行卡信息请勾选.');
                                        //     return false;
                                        // }

                                        Opf.ajax({
                                            type: 'PUT',
                                            url: 'api/mcht/merchants/modify-acct',
                                            jsonData: {
                                                id: rowData.id,
                                                accountName: accountName,
                                                accountNo: accountNo,
                                                zbankRegionCode: zbankRegionNo,
                                                zbankName: zbankName,
                                                zbankNo: zbankNo,
                                                bankNo: bankNo,
                                                bankName: bankName,
                                                accountType: accountType,
                                                accountProxy: accountProxy
                                            },
                                            success: function(resp){
                                                if(resp.success){
                                                    Opf.Toast.success('修改收款账户信息成功.');
                                                    $dialog.dialog('close');
                                                    grid.trigger('reloadGrid', {current: true});
                                                }
                                            }
                                        });
                                    }
                                }
                            }, {
                                type: 'cancel'
                            }],
                            create: function () {
                                var me = this;

                                var proxyCheck = $(me).find('#account-proxy-check');//对公/对私 click抓取
                                var accountProxy = $(me).find('#accountProxy');//委托人 click抓取
                                var zbankProvince = $(me).find('#zbankProvince');
                                var zbankCity = $(me).find('#zbankCity');
                                var zbankRegionCode = $(me).find('#zbankRegionCode');
                                var zbankName = $(me).find('#zbankName');


                                //获取相应填写值
                                var bankInfos = $(me).find('#bankInfos');//开户行 注意：只有在委托人收款并选择对公才有显示
                                //var accountType = $(me).find('[name="accountType"]:checked').val();//对公/对私

                                //mchtType为0，不显示提示，1为显示提示([华势直清]通道，如已线下变更银行卡请勾选)
                                if(resp.mchtType && resp.mchtType == 1){
                                    $(me).find('.mchtType-group').css('display', 'block');
                                }
                                else{
                                    $(me).find('.mchtType-group').css('display', 'none');
                                }

                                //下拉框 获取
                                CommonUI.addSelect2(bankInfos, resp);
                                CommonUI.address(zbankProvince, zbankCity, zbankRegionCode);
                                var zbankAddressCode = Opf.Util.parseRegionCode(resp.zbankRegionCode);
                                var map = {
                                    zbankProvince: zbankAddressCode[0],
                                    zbankCity: zbankAddressCode[1]
                                };
                                // 当支行区号是完整的区号时，才去给支行区下拉框赋值
                                if(Opf.Util.isFullRegionCode(resp.zbankRegionCode)){
                                    $.extend(map, {zbankRegionCode: zbankAddressCode[2]});
                                }
                                _.each(map, function (defVal, name) {
                                    $(me).find('#'+name).length && $(me).find('#'+name).data('ajaxselect.value', defVal);
                                });

                                typeheadZbankName(me, resp, rowData);
                                //$(me).find('#zbankName').on('change', function(){
                                //	var canZbankName = zbankCity.val() ? true : false;
                                //	$(this).prop('disabled', canZbankName === false ? true: false);
                                //
                                //});

                                if(resp != null) {
                                    var proxy = resp.accountProxy;
                                    var type = resp.accountType;
                                    var kind = rowData.kind;
                                    var interMcht = resp.interMcht;
                                    proxy == 1 ? $(me).find('#accountProxy').attr('checked','checked') : $(me).find('#accountProxy').removeAttr('checked','checked');
                                    //对公对私显示不同，做对比
                                    loadAccountTypeHandle(resp, me, proxy, type, kind, interMcht);

                                    //获取银行LOGO
                                    loadBankLogo(resp, me);
                                }

                                //开户支行改变值，则textarea开启
                                $(me).find('#zbankProvince,#zbankCity,#zbankRegionCode').on('change', function(){
                                    zbankName.removeAttr('disabled');
                                    zbankName.val('');
                                });

                                //开户行改变值操作
                                $(me).find('#bankInfos').on('change', function(){
                                    $(me).find('#bankNo').val($(this).select2('data').key);
                                    $(me).find('#bankName').val($(this).select2('data').value);
                                    zbankName.removeAttr('disabled');
                                    zbankName.val('');
                                });

                                //账户号改变值操作
                                $(me).find('#accountNo').on('change', function(){
                                    zbankName.removeAttr('disabled');
                                    zbankName.val('');
                                    Opf.ajax({
                                        autoMsg: false,
                                        type: 'GET',
                                        async: false,
                                        url: url._('bankcode', {
                                            bankCardNo: $(this).val()
                                        }),
                                        success: function(data) {
                                            if (data.value !== null) {
                                                $(me).find('.bank-logo-place').empty().append(CommonUI.template('bank.logo.name', data));
                                                $(me).find('#bankLongNo').val(data.value);
                                                $(me).find('#bankLongName').val(data.name);
                                            }
                                            else if(data.success == false) {
                                                $(me).find('.bank-logo-place').empty();
                                            }
                                            else{
                                                $(me).find('.bank-logo-place').empty();
                                            }
                                        }
                                    });

                                });

                                //委托人事件
                                $(me).find('input[name="accountType"], #accountProxy').on('click', function(){
                                    var proxy = $(me).find('#accountProxy').is(':checked') == true ? 1 : 0;
                                    var type = null;
                                    $(me).find('#sp_accountValid').addClass('disabled');
                                    if(proxy == 1 && $(me).find('[name="accountType"]').val() == undefined){
                                        $(me).find('[name="accountType"]:nth(0)').attr('checked', 'checked');
                                        type = $(me).find('[name="accountType"]:checked').val();
                                    }
                                    else{
                                        type = $(me).find('[name="accountType"]:checked').val();
                                    }
                                    var kind = 'B2';//B2就是普通商户
                                    var interMcht = null;

                                    //$(me).find('form').validator.resetForm();

                                    //对公对私显示不同，做对比
                                    loadAccountTypeHandle(resp, me, proxy, type, kind, interMcht);
                                });
                                
                                //accountNameHandle(me);

                                //验证 对公状态 初始化
                                //validateBytGeneral(me, resp.accountType);

                                //18家银行验证 针对D1慧收银用户，注意添加验证，是修改值之后的，要focus再重新验证，得到更新后的bankCode做卡号验证
                                var mKind = resp.mchtKind;
                                if(mKind == 'D1'){
                                    $(me).find('#accountNo').rules("remove", "isEighteenBank");
                                    $(me).find('#accountNo').rules("add", {
                                        isEighteenBank: {
                                            mchtKind: mKind
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    };

    function loadBankLogo(resp, me){
        Opf.ajax({
            autoMsg: false,
            type: 'GET',
            async: false,
            url: url._('bankcode', {
                bankCardNo: resp.accountNo
            }),
            success: function(data) {
                if (data.value !== null) {
                    $(me).find('.bank-logo-place').empty().append(CommonUI.template('bank.logo.name', data));
                    $(me).find('#bankLongNo').val(data.value);
                    $(me).find('#bankLongName').val(data.name);
                }
                else if(data.success == false) {
                    $(me).find('.bank-logo-place').empty();
                }
                else{
                    $(me).find('.bank-logo-place').empty();
                }

            }
        });
    }

    //验证 对公状态
    function validateBytGeneral(me, type){
        var valid = $(me).find('form').validate({
            rules: {
                'accountName': {
                    required: true
                },
                'bankNo': {
                    required: true
                },
                'bankName': {
                    required: true
                },
                'accountNo': {
                    required: true,
                    number: true,
                    isBankCard: type == 0 ? false : true,
                    debitCard: type == 0 ? false : true,
                    checkCreditCard: type == 0 ? false : true
                    //isEighteenBank: true
                },
                'zbankName': {
                    required: true
                },
                'zbankProvince': {
                    required: true
                },
                'zbankCity': {
                    required: true
                },
                'zbankRegionCode': {
                    required: true
                },
                'sl_accountName': {
                    required: true
                }
            }
        });
        validReset(me, null);
    }

    function validReset(me, accountName){
        if($(me).find('[name="accountType"]:checked').val() == 0 || accountName == 0){
            $(me).find('#accountNo').rules("remove");
            $(me).find('#accountNo').rules("add", { required: true, number: true });
        }
        else if($(me).find('#div_accountName').find('select').val() == 0){
            $(me).find('#accountNo').rules("remove");
            $(me).find('#accountNo').rules("add", { required: true, number: true });
        }
        else{
            $(me).find('#accountNo').rules("remove");
            $(me).find('#accountNo').rules("add", { required: true, number: true, isBankCard: true, debitCard: true, checkCreditCard: true });
        }
    }

    function accountNameHandle(me){
        //动态生成select，绑定事件
        var htmlNode = document.getElementsByName("sl_accountName");
        for (var i=0;i<htmlNode.length;i++){
            htmlNode[i].onchange=function(){
                var sl_aName = $(me).find('#accountName').find('option:selected').val();
                $(me).find('#sp_accountValid').addClass('disabled');
                if(sl_aName == 0){
                    $(me).find('.bank-infos-group').show();
                }
                else{

                    $(me).find('.bank-infos-group').hide();
                }
                $(me).find('#zbankName').removeAttr('disabled','disabled');
                $(me).find('#zbankName').val('');
                validReset(me, sl_aName);
            }
        }
    }

    //resp：获取用户银行数据库数据；proxy：委托人值；me是dialog；type：对公对私；kind：B1、B2；interMcht：外卡判断
    function loadAccountTypeHandle(resp, me, proxy, type, kind, interMcht){
        $(me).find('#div_accountName').html('');
        if(proxy == 1 && (resp.accountProxy == 0 || resp.accountProxy == null)){
            $(me).find('#account-proxy-check').show();
            $(me).find('#div_accountName').append('<input id="accountName" name="accountName" class="form-control" type="text" value="" />');
            if(type == 1){
                $(me).find('.bank-infos-group').hide();
                $(me).find('[name="accountType"]:nth(0)').removeAttr('checked', 'checked');
                $(me).find('[name="accountType"]:nth(1)').attr('checked', 'checked');
            }
            else{
                $(me).find('.bank-infos-group').show();
                $(me).find('[name="accountType"]:nth(0)').attr('checked', 'checked');
                $(me).find('[name="accountType"]:nth(1)').removeAttr('checked', 'checked');
            }
        }
        else if(resp.accountProxy == 1 && proxy == 1){
            $(me).find('#account-proxy-check').show();
            $(me).find('.bank-infos-group').show();
            $(me).find('#div_accountName').append('<input id="accountName" name="accountName" class="form-control" type="text" value="'+resp.accountName+'" />');
            if(type == 1){
                $(me).find('.bank-infos-group').hide();
                $(me).find('[name="accountType"]:nth(0)').removeAttr('checked', 'checked');
                $(me).find('[name="accountType"]:nth(1)').attr('checked', 'checked');
            }
            else{
                $(me).find('[name="accountType"]:nth(0)').attr('checked', 'checked');
                $(me).find('[name="accountType"]:nth(1)').removeAttr('checked', 'checked');
            }
        }
        else if(proxy == 0 && interMcht != null){//外卡商户
            $(me).find('.div_proxy').hide();
            $(me).find('.bank-infos-group').show();
            if(type == 0){
                $(me).find('#div_accountName').append('<select id="accountName" name="sl_accountName" class="form-control">' +
                '<option value="0" data="'+resp.mchtName+'" selected="selected" >'+resp.mchtName+'(对公)'+'</option>' +
                '<option value="1" data="'+resp.userName+'" >'+resp.userName+'(对私)'+'</option>' +
                '</select>');
            }
            else{
                $(me).find('.bank-infos-group').hide();
                $(me).find('#div_accountName').append('<select id="accountName" name="sl_accountName" class="form-control">' +
                '<option value="0" data="'+resp.mchtName+'" >'+resp.mchtName+'(对公)'+'</option>' +
                '<option value="1" data="'+resp.userName+'" selected="selected" >'+resp.userName+'(对私)'+'</option>' +
                '</select>');
            }
        }
        else if(proxy == 0 && kind == 'B1'){//个体商户 页面展示
            $(me).find('.div_proxy').hide();
            $(me).find('.bank-infos-group').hide();
            $(me).find('#div_accountName').append('<input id="accountName" name="accountName" class="form-control" type="text" value="'+resp.accountName+'" disabled="disabled" />');
            $(me).find('[name="accountType"]:nth(0)').removeAttr('checked', 'checked');
            $(me).find('[name="accountType"]:nth(1)').attr('checked', 'checked');
        }
        else{
            $(me).find('#account-proxy-check').hide();
            $(me).find('.bank-infos-group').show();
            if(type == 0){
                $(me).find('#div_accountName').append('<select id="accountName" name="sl_accountName" class="form-control">' +
                '<option value="0" data="'+resp.mchtName+'" selected="selected" >'+resp.mchtName+'(对公)'+'</option>' +
                '<option value="1" data="'+resp.userName+'" >'+resp.userName+'(对私)'+'</option>' +
                '</select>');
            }
            else if(type == null){
                $(me).find('.bank-infos-group').hide();
                $(me).find('#div_accountName').append('<select id="accountName" name="sl_accountName" class="form-control">' +
                '<option value="" data="">-请选择开户名-</option>' +
                '<option value="0" data="'+resp.mchtName+'" >'+resp.mchtName+'(对公)'+'</option>' +
                '<option value="1" data="'+resp.userName+'" >'+resp.userName+'(对私)'+'</option>' +
                '</select>');
            }
            else{
                $(me).find('.bank-infos-group').hide();
                $(me).find('#div_accountName').append('<select id="accountName" name="sl_accountName" class="form-control">' +
                '<option value="0" data="'+resp.mchtName+'" >'+resp.mchtName+'(对公)'+'</option>' +
                '<option value="1" data="'+resp.userName+'" selected="selected" >'+resp.userName+'(对私)'+'</option>' +
                '</select>');
            }
        }
        //验证 对公状态 针对对公状态 不做卡号验证
        validateBytGeneral(me, type);

        accountNameHandle(me);
    }

    function typeheadZbankName(me, resp, rowData) {
        var typeaheadTplFn = _.template([
            '<div style="padding: 0 15px; height: 30px; line-height: 30px;">',
            '<%= content %>',
            '</div>'
        ].join(''));
        var zbankTypehead;
        function replaceUrl(url, query) {
            var bankCode = null;
            if($(me).find('.bank-infos-group').is(":hidden")){
                bankCode = $(me).find('#bankLongNo').val();
            }
            else{
                if($(me).find('#bankInfos').select2('data') == null){
                    bankCode = resp.bankNo;
                }
                else{
                    bankCode = $(me).find('#bankInfos').select2('data').key;
                }
            }

            return 'api/system/options/zbank-name?' + $.param({
                    kw: $(me).find('#zbankName').val(),
                    regionCode: $(me).find('#zbankRegionCode').val(),
                    bankCode: bankCode,
                    maxLength: 20
                });
        }

        var zbankCommonUI = CommonUI.zbankName($(me).find('#zbankName'), {
            source: function(query, process) {
                $.ajax({
                    autoMsg: false,
                    url: replaceUrl(url._('options.zbankName'), query),
                    type: 'GET',
                    beforeSend: function() {
                        $(me).find('#zbankName').parent().find('.tt-dropdown-menu').find('.tt-dataset-zbank').html(typeaheadTplFn({content: '正在搜索...'})).show();
                    },
                    success: function(resp) {
                        process(resp);
                    }
                });
            },
            onReset: function() {
                $(me).find('#zbankNo').val('');
            },
            templates: {
                empty: typeaheadTplFn({content: '未能搜索到结果...'})
            },
            events: {
                'typeahead:selected': function(e, datum) {
                    $(me).find('#zbankNo').val(datum.value);
                    $(me).find('#zbankName').removeClass('has-revise-error');

                    if($(me).find('select[name="sl_accountName"]').val() != '0' && $(me).find('select[name="sl_accountName"]').val() != undefined){
                        $(me).find('#sp_accountValid').removeClass('disabled');
                    }
                    if($(me).find('input[name="accountType"]:checked').val() != '0' && $(me).find('input[name="accountType"]:checked').val() != undefined){
                        $(me).find('#sp_accountValid').removeClass('disabled');
                    }

                    $(me).find('#sp_accountValid').on('click', function(){
                        var av = this;
                        $(av).val('正在查询......');
                        $(me).find('#sp_accountValid').addClass('disabled');
                        Opf.ajax({
                            type: 'GET',
                            async: false,
                            url: url._('task.valid.account'),
                            data: {
                                mchtNo: rowData.mchtNo,
                                accountNo:  $(me).find('#accountNo').val(),
                                idCard: rowData.idNo,
                                bankCode: $(me).find('#bankLongNo').val()
                            },
                            success: function(resp){
                                //Opf.UI.ajaxLoading($(av).find('#sp_accountValid'), false);
                                if(resp.status == 0){
                                    $(av).val('账号验证通过');
                                    $(av).removeClass();
                                    $(av).addClass('btn btn-success');
                                    $(me).find('#sp_accountValid').addClass('disabled');
                                }
                                else if(resp.status == 2){
                                    $(av).val('账号未验证');
                                    $(av).removeClass();
                                    $(av).addClass('btn-default');
                                    $(me).find('#sp_accountValid').removeClass('disabled');
                                }
                                else{
                                    $(av).val('账号可能有误');
                                    $(av).removeClass();
                                    $(av).addClass('btn btn-warning');
                                    $(me).find('#sp_accountValid').removeClass('disabled');
                                }
                            }
                        });
                    });
                }
            }
        });
    }

});