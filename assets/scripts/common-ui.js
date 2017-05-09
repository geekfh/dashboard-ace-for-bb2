//?要依赖么？
define([
    'assets/scripts/fwk/factory/typeahead.factory',
    'assets/scripts/fwk/component/ajax-select',
    'assets/scripts/fwk/component/jquery.datePickerWithInfo',
    'select2'
], function (typeaheadFactory, AjaxSelect, datePickerWithInfo) {

    var SELECT_PLACEHOLDER_OPTION_CLS = 'placeholder';

    var ZHI_XIA_SHI = {
        '11' : {label:'北京市'},
        '31' : {label:'上海市'},
        '12' : {label:'天津市'},
        '50' : {label:'重庆市'}
    };

    CommonUI = {
        //弹出框
        showStatusDialog: function(status, arr_status){
            var strTpl = _.template([
                '<div id="div_status">',
                '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
                '<tbody>',
                '<tr class="FormData">',
                '<td class="CaptionTD" style="padding-right:10px;">状态:</td>',
                '<td class="DataTD">',
                '&nbsp;',
                '<select role="select" name="status" class="FormElement ui-widget-content ui-corner-all">',
                '<% $.each(arr_status, function (i, v){' ,
                'if(i == status){%>' ,
                '<option value="<%=i%>" selected="selected"><%=v%></option>',
                '<%}',
                'else{%>' ,
                '<option value="<%=i%>"><%=v%></option>',
                '<%}',
                '});%>',
                '</select>',
                '</td>',
                '</tr>',
                '</tbody>',
                '</table>',
                '</div>'].join(''));

            var $dialog = Opf.Factory.createDialog(strTpl({status: status, arr_status: arr_status}), {
                destroyOnClose: true,
                title: '修改状态',
                autoOpen: true,
                width: 230,
                height: 170,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function () {
                        $dialog.dialog('close');
                        //弹回去 做处理
                    }
                }, {
                    type: 'cancel'
                }],
                create: function (){}
            });

            return $dialog;
        },

        //开户行 {bankNo,bankName}
        addSelect2: function(select, resp) {
            var $select = $(select);
            var bankName = null;
            if(resp.accountType == 1 || resp.bankName == null){//|| resp.accountProxy == 0
                bankName = '--请选择开户行--';
            }
            else{
                bankName = resp.bankName;
            }
            $select.select2({
                placeholder: bankName,
                //minimumInputLength: 1,
                ajax: {
                    type: 'GET',
                    url: 'api/system/options/bank-infos',
                    //data: {value: bankName},
                    dataType: 'json',
                    data: function (term) {
                        return {
                            value: encodeURIComponent(term)
                        };
                    },
                    results: function (data) {
                        return {
                            results: data
                        };
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
                }
            });
            $select.change(function(){
                var $form = $(this).closest('form');
                $form.validate && $form.validate().element($(this));
            });
        },

        /*
         * jqGrid搜索功能select2（添加select2方法）
         * form：弹出选择控件
         * className：选择哪个字段做select2 例如：cupsNo
         * 使用过的字段名有：cupsNo(渠道名称)，bankId所属银行
         * */
        searchFormBySelect2: function (form, className){
            var newClass = className=='bankName'?'bankId':className;

            form.find('.ui-widget-content').css('width','400px');

            $.each(form.find('tr'), function(i, v){
                if(i > 1){
                    var s = $(form.find('tr')[i]).find('[value="'+className+'"]').attr('selected');
                    if(s == 'selected'){
                        var tar = form.find('tr')[i];
                        $(tar).find('.data').css('width','220px');
                        $(tar).find('.data').children().remove();
                        /*if(className == 'bankName'){
                            className = 'bankId';
                        }*/
                        $(tar).find('.data').append('<input id="sl_'+newClass+'" class="input-elm">');
                        switch(className)
                        {
                            case 'cupsNo':
                                cupsNameBySearch(tar);
                                break;
                            case 'bankName':
                                bankIdBySearch(tar);
                                break;
                            default:

                        }
                    }
                }
            });
            form.find('.columns>select').on('change', function (str) {
                if(str.target.value == className){
                    var tar = $(str.target).parent().closest('tr');
                    tar.find('.data').css('width','220px');
                    tar.find('.data').children().remove();
                    /*if(className == 'bankName'){
                        className = 'bankId';
                    }*/
                    tar.find('.data').append('<input id="sl_'+newClass+'" class="input-elm">');
                    switch(className)
                    {
                        case 'cupsNo':
                            cupsNameBySearch(tar);
                            break;
                        case 'bankName':
                            bankIdBySearch(tar);
                            break;
                        default:

                    }
                }
            });
            return true;
        },

        /*
         * jqGrid搜索功能select2（搜索出渠道名称，然后需要调用onsearch，搜索过程进行过滤）
         * form：弹出选择控件
         * postData：获取jqGrid本身过滤条件
         * className：选择哪个字段做select2 例如：cupsNo
         * */
        searchFilterBySelect2: function (form, postData, className){
            var queryFilters = postData,
                newClass = className=="bankName"? "bankId":className,
                val = $(form).find('#sl_' + newClass).select2('val');

            if(_.isString(val) && val!==""){
                var filtersJson = $.parseJSON(queryFilters.filters);
                filtersJson.rules.push({"field": newClass,"op": "eq","data": val});
                postData.filters = JSON.stringify(filtersJson);
            }

            return postData;
        },

        //出错提示 公用
        loadError: function(view, content){
            $(view).find('.div_hd_error').css('display','block');
            $(view).find('.hd_error').html(content);
        },

        //清空错误警告
        loadCleanError: function(view, content){
            $(view).find('.div_hd_error').css('display','none');
            $(view).find('.hd_error').html('');
        },

        //倒计时 控件 用在任务模块(因任务模块有多个地方用到，则放公共文件)
        countDownOption: function(el, first, seconds){
            first = parseInt(first);
            seconds = parseInt(seconds);
            var txt = (first < 10 ? '0' + first : first) + ' : ' + (seconds < 10 ? '0' + seconds : seconds);
            el.$el.find('.sp_countDown').html(
                _.template('请及时完成审核，否则该任务将被自动取消 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color: #ff0000;">任务审核剩余时间：<b>'
                + txt + '</b></font>'));

            if(seconds == 0 && first > 0){//一分钟处理一次
                first--;
                setTimeout(function(){
                    CommonUI.countDownOption(el, first, 59)
                }, 1000);
            }
            else if(first > -1 && seconds != 0){//一分钟内一直跑
                seconds--;
                setTimeout(function(){
                    CommonUI.countDownOption(el, first, seconds)
                }, 1000);
            }
            else if(first == -1 || first == 0 && seconds == 0){//结束 分:秒
                el.$el.find('.js-pass').attr('disabled','disabled');//时间超时 一切禁止
                el.$el.find('.reject-trigger').attr('disabled','disabled');//时间超时 一切禁止
                el.$el.find('.sp_countDown').html(
                    _.template('请及时完成审核，否则该任务将被自动取消 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color: #ff0000;">任务审核剩余时间：<b>00 : 00</b></font>'));
            }
        },

        terminalSelect: function (el, select2Options) {
            Opf.ajax({
                url: url._('terminals.mgr.options'),
                success: function(resp) {
                    var ddCls = 'select2-dd-'+Opf.Utils.id();
                    $(el).select2($.extend({
                        dropdownCssClass: ddCls,
                        matcher: function(kw, text, obj) {
                            return obj.textFroSearch && (obj.textFroSearch.indexOf(kw) !== -1);
                        },
                        data: convertData(resp),
                        width: 230,
                        placeholder: ' - 选择终端类型 - '
                    }, select2Options)) //

                        .on('change.validation', function() {
                            $(this).trigger('keyup');
                        });
                }
            });

            function convertData(resp) {
                var arr = [];

                _.each(resp, function(item) {
                    var data = _.findWhere(arr, {
                        text: item.termFactory
                    });

                    if (!data) {
                        data = {
                            text: item.termFactory,
                            children: []
                        };
                        arr.push(data);
                    }

                    data.children.push({
                        id: item.termMachType,
                        text: item.termMachType,
                        //textFroSearch 包含厂商信息和型号，便于搜索
                        textFroSearch: ('' + item.termFactory + item.termMachType),
                        //对应的Id号
                        typeId: item.id
                    });
                });
                return arr;
            }
        },

        rule4User: function (el, defaultValue,brhCode) {
            var _brhCode = brhCode == void 0 ? '' : '?brhCode=' + brhCode;
            return new AjaxSelect(el, {
                value: defaultValue,
                placeholder: '- 选择规则 -',
                ajax : {
                    url: url._('options.user.rule') + _brhCode
                }
            });
        },

        roleGroup4User: function (el, defaultValue,oprId) {
            var _oprId = oprId == void 0 ? '' : '?oprId=' + oprId;
            return new AjaxSelect(el, {
                value: defaultValue,
                placeholder: '- 选择角色组 -',
                ajax : {
                    url: url._('options.user.rolegroup') + _oprId
                }
            });
        },

        newBranch4Disc: function (el, options) {
            options = options || {};
            new AjaxSelect(el, {
                value: options.defaultValue,
                placeholder: '- 选择适用机构 -',
                ajax : {
                    url: url._('options.disc-branchs', {modelType: options.modelId}),
                    success: function(){
                        if(el.find('option').length == 1){
                            el.find('option').text('未查询到机构');
                        }
                    }
                }
            });
        },

        /**
         * [select2Branch4Disc description]
         * @param  {[type]} el      [description]
         * @param  {[type]} options {modelType:'HB'}
         * @return {[type]}         [description]
         */
        select2Branch4Disc: function (el, options) {
            var me = this;
            options = options || {};

            Opf.ajax({
                url: url._('options.disc-branchs', {modelType: options.modelType}),
                success: function(resp) {
                    var strOptions = _.map(resp, function(item) {
                            return me.template('select.option', item);
                        }).join('') || '<option disabled></option>';

                    $(el).empty().append(strOptions).select2({
                        formatNoMatches: function () { return "没有找到匹配机构"; },
                        width: 250,
                        placeholder: '- 选择机构 -'
                    });
                }
            });
        },

        /**
         * [select2Branch4DiscByInput description]
         * @param  {[type]} el      [description]
         * @param  {[type]} options {modelType:'HB/...'}
         * @return {[type]}         [description]
         */
        select2Branch4DiscByInput: function (el, options) {
            Opf.ajax({
                url: url._('options.disc-branchs', {
                    modelType: options.modelType
                }),
                success: function(resp) {
                    $(el).select2({
                        formatNoMatches: function() {
                            return "没有找到匹配机构";
                        },
                        width: 250,
                        placeholder: '- 选择机构 -',
                        data: _.map(resp, function (item) {
                            return {id: item.value, text: item.name};
                        })
                    });
                }
            });
        },

        branch4Disc: function (el, defaultValue) {  //此接口已不能用
            new AjaxSelect(el, {
                value: defaultValue,
                placeholder: '- 选择所属机构 -',
                ajax : {
                    url: url._('options.disc-branchs')
                }
            });
        },

        /**
         * 使用商户名称和法人名称拼装成候选项
         */
        accountName: function (el, pubNameEl, privNameEl, defaultVal) {
            initSelectPlaceHolder(el, '- 请选择开户名 -');
            var $el = $(el), 
                $pubNameEl = $(pubNameEl);
                $privNameEl = $(privNameEl);

            $pubNameEl.on('change.common.ui', function() {
                $el.find('option[value="0"]').remove();
                $el.append($('<option value="0">' + $(this).val() + ' (对公)' + '</option>'));
            });

            $privNameEl.on('change.common.ui', function() {
                $el.find('option[value="1"]').remove();
                $el.append($('<option value="1">' + $(this).val() + ' (对私)' + '</option>'));
            });

            $pubNameEl.val() && $pubNameEl.trigger('change.common.ui');
            $privNameEl.val() && $privNameEl.trigger('change.common.ui');

            defaultVal !== void 0 && $el.val(defaultVal);
        },
        mccSection: function (mccGroupEl, mccEl, defaultMccGroupVal, defaultMccVal) {
            var $mccGroup = $(mccGroupEl),
                $mccEl = $(mccEl);

            new AjaxSelect($mccGroup, {
                value: defaultMccGroupVal,
                placeholder: '- 选择MCC组 -',
                ajax : {
                    url: url._('options.mccGroup')
                },
                onDefaultValue: onGroupChange
            });

            var commonMccSelect = new AjaxSelect($mccEl, {
                value: defaultMccVal/*,
                 placeholder: '- 选择MCC码 -'*/
            });

            $mccEl.select2({
                placeholder: '- 选择MCC码 -',
                formatResult: function(data, container, query, escapeMarkup){
                    // console.log('----formatResult----');
                    // console.log(data, container, query, escapeMarkup);
                    return '[' + data.id + ']' + data.text;
                },
                formatSelection: function(data, container, escapeMarkup){
                    // console.log('----formatSelection----');
                    // console.log(data, container, escapeMarkup);
                    return '[' + data.id + ']' + data.text;
                },
                matcher: function(kw, value, $option) {
                    // console.log('---------matcher----------');
                    // console.log(arguments);
                    var mccCode = $option.attr('value') || '';
                    var fullText = mccCode + $.trim(value);

                    return fullText.indexOf(kw) >= 0;
                }
            });

            $mccEl.change(function(){
                var $this = $(this),
                    $form = $this.closest('form');

                if(_.isObject($this.data('ajaxselect.obj'))) {
                    $this.select2('data', $this.data('ajaxselect.obj'));
                    $this.data('ajaxselect.obj', null);
                }

                $form.validate && $form.validate() && $form.validate().element($this);
            });

            $mccGroup.change(onGroupChange);

            function onGroupChange () {
                var mccGroupId = $mccGroup.val();
                // 清空Mcc
                resetMcc();

                if(mccGroupId) {
                    commonMccSelect.init();

                    $.when(commonMccSelect.fetch({
                        url: url._('options.mcc', {mccGroupId: mccGroupId})
                    })).done(function(data) {
                        $mccEl.trigger('change');
                    });

                    /*commonMccSelect.fetch({
                        url: url._('options.mcc', {mccGroupId: mccGroupId})
                    });*/
                }

                //$mccEl.select2('data', null);
            }

            function resetMcc () {
                $mccEl.html('');
                $mccEl.select2('data', null);
            }
        },

        nature: function (el, value) {
            new AjaxSelect(el, {
                value: value,
                placeholder: '- 选择经济类型 -',
                ajax: {
                    url: url._('options.nature')
                }
            });
        },

        disc: function (el, type, value, options) {
            var data = {type: type || 'mcht'};
            if(options && options.brhCode){
                data = $.extend(data, {brhCode: options.brhCode});
            }
            new AjaxSelect(el, $.extend(true, {
                value: value,
                placeholder: '- 选择费率模型 -',
                ajax: {
                    data: data,
                    url: url._('options.disc')
                }
            }, options));
        },

        /**
         * @param  {[type]} el      inputEl
         * @param  {[type]} options
         * {
         *     onSetDefaultValue: function (value, list) {}
         *     ajaxOptions: xx,
         *     filter: function (费率模型列表数据) {},//暴露过滤数据的借口
         *     defaultValue: xx
         *     select2s:xx
         * }
         */
        discSelectTwo: function (el, options) {
            var initResp = [];

            var defaultValue = options.defaultValue || $(el).data('ajaxselect.value');

            $(el).select2({
                placeholder: '- 选择费率模型 -',

                //每次展现下拉列表都会调用
                data: function () {
                    var data = initResp;

                    if(options.filter) {
                        data = options.filter(data);
                    }

                    var result = {
                        results: _.map(data, function (item) {
                            return {text: item.name, id: item.value};
                        })
                    };
                    return result;
                }
            });

            Opf.ajax($.extend({
                url: url._('options.disc'),
                success: function(resp) {
                    initResp = resp;
                    if (defaultValue) {
                        var defaultObj = _.findWhere(resp, {value: defaultValue}) || {};
                        $(el).select2('data', {id: defaultValue, text: defaultObj.name});

                        if (options.defaultValueCallback) {
                            options.defaultValueCallback(defaultObj.category);
                        }
                    }
                }
            }, options.ajaxOptions));
        },

        /**
         * 机构select2
         * @param el
         * @param options
         */
        branchSelect2: function (el, options) {
            var $el = $(el);
            options || (options = {});

            var defaultValue = options.defaultValue || $el.data('ajaxselect.value');

            $el.select2({
                placeholder: '-- 请选择机构 --',
                minimumInputLength: 1,
                ajax: {
                    type: 'GET',
                    url: url._('report.tree.searchOrg'),
                    dataType: 'json',
                    data: function (term, page) { //page is one base
                        return {
                            kw: encodeURIComponent(term),
                            number: page - 1
                        };
                    },
                    results: function (data, page) { // 返回除分页信息外的内容，要正确过滤备选项就在这里操作
                        return {
                            results: data.content,
                            more: page < data.totalPages
                        };
                    }
                },
                // 如果不设ID，将不能选择列表
                id: function (e) {
                    return e.id;
                },
                //格式化备选项，显示给用户。对每一个数组元素都执行此方法，data即为数组元素
                formatResult: function(data){
                    return data.orgName;
                },
                formatSelection: function(data){
                    return data.orgName;
                }
            });

            if (defaultValue) {
                Opf.ajax({
                    url: url._('rule.branch.name'),
                    type: 'GET',
                    data: { brh: defaultValue },
                    success: function (resp) {
                        $el.select2('data', {id: defaultValue, orgName: resp.useBrhName});
                    }
                });
            }


        },

        /**
         * 开户行select2
         * @param el
         * @param options
         */
        bankInfoSelect2: function (el, options) {
            var $el = $(el);
            options || (options = {});

            var defaultValue = options.defaultValue || $el.data('ajaxselect.value');

            $el.select2({
                placeholder: '请选择开户行',
                minimumInputLength: 1,
                ajax: {
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
                id: function (data) {
                    return data.key;
                },
                formatResult: function(data){
                    return data.value;
                },
                formatSelection: function(data){
                    return data.value;
                }
            });

            if (defaultValue && typeof defaultValue === 'object') {
                $el.select2('data', defaultValue);
            }
        },

        /**
         * @param  {[type]} el      inputEl
         * @param  {[type]} options
         * {
         *     onSetDefaultValue: function (valueObj) {}
         *     defaultValue: xx
         * }
         */
        mchtDiscSelectTwo: function (el, options) {
            var cache = {};
            var options4Direct = [];//用于直联的费率模型选项
            var options4Indirect = [];//用于间联的费率模型选项

            var defaultValue = options.defaultValue || $(el).data('ajaxselect.value');

            $(el).select2({
                placeholder: '- 选择费率模型 -',
                //每次展现下拉列表都会调用
                data: function () {
                    var curOptions = _.result(options, 'category') === 'direct' ?
                        options4Direct: options4Indirect;
                    return  {
                        results: _.map(curOptions, function (item) {
                            return {text: item.name, id: item.value};
                        })
                    };
                }
            });

            fetch({async:false});//默认做一次，新增的时候没有参数，只有编辑的时候会取值

            function fetch(ajaxOptions) {
                var param = {
                    brhCode: _.result(options, 'brhCode'),
                    mccGroup: _.result(options, 'mccGroup'),
                    category: _.result(options, 'category')
                };

                //mcc组 和 模型类型 是必须的
                if(!param.mccGroup || !param.category) {
                    return;
                }
                var cacheKey = [(param.brhCode || ''),
                    param.mccGroup, param.category].join('-');

                //如果请求过相同参数，则数据会被缓存
                if(cache[cacheKey]) {
                    onSuccess(cache[cacheKey]);
                }else {
                    Opf.ajax($.extend({
                        url: url._('options.mchtdisc'),
                        data: param,
                        success: function (resp) {
                            cache[cacheKey] = resp;//缓存
                            onSuccess(resp);
                        }
                    }, ajaxOptions));
                }

                //成功后，按照当前请求参数，分别更新 直联/间联 模型候选项
                function onSuccess (resp) {
                    //清空，避免因异步延迟，用了上次的值
                    options4Direct = options4Indirect = [];

                    if(param.category === 'direct') {
                        options4Direct = resp;
                    }else {
                        options4Indirect = resp;
                    }
                    if(defaultValue) {
                        var defaultObj = _.findWhere(resp, {value: defaultValue});
                        if(defaultObj) {
                            $(el).select2('val', defaultValue);
                            options.onSetDefaultValue && options.onSetDefaultValue(defaultObj);
                        }
                    }
                }
            }

            return {
                fetch: _.debounce(fetch, 150)
            };
        },

        /**
         * 商审通过时，直联商户需要选择费率模型
         * @param el
         * @param value
         */
        tNDiscId: function (el, value) {
            return new AjaxSelect(el, {
                value: value? value:"",
                ajax: {
                    url: url._('options.mchtdisc.examine')
                }
            });
        },

        discCycle: function (el, value) {
            new AjaxSelect(el, {
                value: value,
                placeholder: '- 选择结算周期 -',
                ajax: {
                    url: url._('options.discCycle')
                }
            });
        },

        codeSel: function (el, val) {
            new AjaxSelect(el, {
                value: val,
                placeholder: '- 选择代码 -',
                ajax: {
                    url: url._('service.code')
                }
            });
        },

        feeSel: function (el, val, target) {
            new AjaxSelect(el, {
                value: val,
                placeholder: '- 请选择 -',
                ajax: {
                    url: url._('service.fee')
                }
            });
        },

        feeModel: function(el, val, target) {
            new AjaxSelect(el, {
                value: val,
                placeholder: '- 请选择 -',
                ajax: {
                    url: url._('service.fee.model')
                }
            });
        },

        shareProfit: function (el, val, target) {
            new AjaxSelect(el, {
                value: val,
                placeholder: '- 请选择 -',
                ajax: {
                    url: url._('service.reward')
                }
            });
        },

        cardType: function (el, defaultVal) {
            $(el).append('<option value="1" selected>身份证</option>').val(1);
        },

        channelName: function (el, defaultValue) {
            new AjaxSelect(el, {
                value: defaultValue,
                placeholder: '- 选择通道 -',
                ajax: {
                    url: url._('route.channel.name')
                }
            });
        },

        noCradChannelName: function (el, defaultValue) {
            new AjaxSelect(el, {
                value: defaultValue,
                placeholder: '- 选择通道 -',
                ajax: {
                    url: url._('route.nocard.channel.name')
                }
            });
        },


        /**
         * 省市区下拉框，支持只选省 或者省市
         */
        subAddress: function (provinceEl, cityEl, countryEl,
                              defaultProvinceVal, defaultCityVal, defaultCountryVal) {

            // TODO 暂时copy address方法，需重构
            var commonCitySelect = new AjaxSelect(cityEl, {
                placeholder: '- 选择市 -',
                value: defaultCityVal,
                onDefaultValue: onCityChange
            });

            var commonDistricSelect = new AjaxSelect(countryEl, {
                placeholder: '- 选择区 -',
                value: defaultCountryVal
            });

            new AjaxSelect(provinceEl, {
                value: defaultProvinceVal,
                placeholder: '- 选择省 -',
                ajax: {
                    url: url._('options.province')
                },
                onDefaultValue: onProvinceChange
            });

            $(provinceEl).change(onProvinceChange);
            function onProvinceChange () {
                commonCitySelect.clear();
                commonDistricSelect.clear();
                $(this).attr('title',$(this).find('option:checked').text());
                var provinceId = $(this).val(), duchy;
                if(!provinceId) return;

                //如果是直辖市，就直接添加到“市”选项，并且选中
                if(duchy = ZHI_XIA_SHI[provinceId]) {
                    commonCitySelect.updateOptions([{value:provinceId, name:duchy.label}], provinceId);
                } else {
                    commonCitySelect.fetch({
                        url: url._('options.city', {province : provinceId})
                    }).done(function () {
                        $(cityEl).prepend('<option value="all">所有</option>');
                    });
                }
            }

            $(cityEl).change(onCityChange);
            function onCityChange () {
                commonDistricSelect.clear();
                $(this).attr('title',$(this).find('option:checked').text());
                var cityId = $(this).val();
                if(!cityId) return;

                if (cityId === 'all') {
                    commonDistricSelect.updateOptions([{value:'all', name:'所有'}], 'all');
                    $(countryEl).trigger('change');
                } else {
                    commonDistricSelect.fetch({
                        url: url._('options.country', {city : cityId})
                    }).done(function () {
                        $(countryEl).find('option:checked').after('<option value="all">所有</option>');
                    });
                }
            }

            $(countryEl).change(function(){
                $(this).attr('title',$(this).find('option:checked').text());
            });

            // 防止多次渲染
            return true;
        },

        /**
         * 后三个参数适合修订录入信息的时候使用
         */
        address: function (provinceEl, cityEl, countryEl,
                           defaultProvinceVal, defaultCityVal, defaultCountryVal) {

            var commonCitySelect = new AjaxSelect(cityEl, {
                placeholder: '- 选择市 -',
                value: defaultCityVal,
                onDefaultValue: onCityChange
            });

            var commonDistricSelect = new AjaxSelect(countryEl, {
                placeholder: '- 选择区 -',
                value: defaultCountryVal
            });

            new AjaxSelect(provinceEl, {
                value: defaultProvinceVal,
                placeholder: '- 选择省 -',
                ajax: {
                    url: url._('options.province')
                },
                onDefaultValue: onProvinceChange
            });

            $(provinceEl).change(onProvinceChange);
            function onProvinceChange () {
                commonCitySelect.clear();
                commonDistricSelect.clear();
                $(this).attr('title',$(this).find('option:checked').text());
                var provinceId = $(this).val(), duchy;
                if(!provinceId) return;

                //如果是直辖市，就直接添加到“市”选项，并且选中
                if(duchy = ZHI_XIA_SHI[provinceId]) {
                    commonCitySelect.updateOptions([{value:provinceId, name:duchy.label}], provinceId);
                }
                else {
                    commonCitySelect.fetch({
                        url: url._('options.city', {province : provinceId})
                    });
                }
            }

            $(cityEl).change(onCityChange);
            function onCityChange () {
                commonDistricSelect.clear();
                $(this).attr('title',$(this).find('option:checked').text());
                var cityId = $(this).val();
                if(!cityId) return;

                commonDistricSelect.fetch({
                    url: url._('options.country', {city : cityId})
                });

            }

            $(countryEl).change(function(){
                $(this).attr('title',$(this).find('option:checked').text());
            });

        },

        //返回支行名称的typehead
        //提供一个事件''
        /**
         * [zbankName description]
         * options:{
         * el:xx,
         * model: {},
         * onReset: function () {}
         * }
         */
        zbankName: function (el, options) {
            var obj = CommonUI.typehead2($.extend(true, {
                name: 'zbank',
                el: el,
                model: {
                    remote: {
                        url: url._('options.zbankName')
                    }
                }
            }, options));

            return obj;
        },

        explorerName: function(el, options) {
            var obj = CommonUI.typehead2($.extend(true, {
                name: 'explorer',
                el: el,
                model: {
                    remote: {
                        url: url._('options.explorers')/*,
                        replace: function(xurl, query) {
                            return url._('options.explorers', {
                                kw: encodeURIComponent(encodeURIComponent(query))
                            });
                        }*/
                    }
                }
            }, options));

            // var th = obj.typehead;
            var lastSelName = null;
            obj.typeahead.on('typeahead:selected', function(e, datum) {
                lastSelName = datum.name;
            });
            $(el).blur(function () {
                if(!$(this).data('datum')){
                    obj.reset();
                }
            });


            return obj;
        },

        /**
         * [typehead2 description]
         * @param  {[type]} options {el: el, name:'zbank', url: 'api/xx/xx', onReset:function(){}}
         * @return {[type]}         {typeahead: instance, reset: reset }
         */
        typehead2: function (options) {
            var name = options.name;
            var url = options.url;
            var $el = $(options.el);
            var onReset = options.onReset;
            var defaultDatum = options.defaultDatum || $el.data('default.datum');
            var events = options.events;

            var model = typeaheadFactory.createModel(name, $.extend(true, {
                search: 'name',
                prefectch: null
            }, options.model));

            var instance = typeaheadFactory.newTypeahead(name, {
                el : $el,
                displayKey : 'name',
                source: options.source,
                templates: options.templates
            });

            if(events) {
                _.each(events, function (handler, eName) {
                    instance.on(eName, handler);
                });
            }

            var $trigger = $('<i class="icon icon-remove-circle remove-trigger" title="清空，重新输入"></i>').click(function(){
                reset();
            }).hide();

            $el.parent().append($trigger);

            instance.on('typeahead:selected', function(e, datum) {
                $el.data('datum', datum);
                $el.prop('disabled', true);
                $trigger.show();
            });

            instance.on('typeahead:opened', function(e, obj){
                instance.parent('.twitter-typeahead').find('.tt-dropdown-menu').css({
                    top: 'auto',
                    bottom: '100%',
                    marginBottom: '1px',
                    height: '200px',
                    overflow: 'auto'
                });
            });

            //光标移开的时候判断是否有修改
            //是：必须选择合法的值
            //否：保持原值不变
            var _val = $el.val();
            instance.on('focusout', function(){
                var __val = $el.val();
                if(_val !== __val){
                    setTimeout(function(){
                        if($trigger.is(':hidden')){
                            reset();
                        }
                    }, 50);
                }
            });

            function reset () {
                $el.data('datum', null);
                $el.prop('disabled', false);
                $trigger.hide();
                instance.typeahead('val', '');
                $el.val('');
                onReset && onReset();
            }

            if(defaultDatum) {
                $el.data('ttTypeahead')._select({
                    name: name,
                    raw: defaultDatum,
                    value: defaultDatum.name//默认displayKey是'name'
                });
                // instance.trigger('typeahead:selected', [defaultDatum]);
            }

            return {
                typeahead: instance,
                reset: reset
            };
        },

        template: function (tplKey, data) {
            if(!compiledTemplate[tplKey]) {
                compiledTemplate[tplKey] = _.template(TEMPLATES[tplKey]);
            }
            return compiledTemplate[tplKey](data || {data:{}});
        },

        //为需要绑定typeahead的el加上删除按钮，初始化；
        creatRemoveIconWith:function(typeaheadEl){
            var $el = $(typeaheadEl);
            var $trigger = $('<i class="icon icon-remove" title="清空支行名称，重新输入"></i>');
            $trigger.css({
                'position':'absolute',
                'line-height':'40px',
                'margin-left':'-20px',
                'color':'red',
                'font-size':'15px',
                'cursor':'pointer'
            }).click(function(){
                $el.prop({ disabled: false });
                $el.typeahead('val', '').trigger('change');
                $(this).hide();
            }).hide();

            $el.parent().append($trigger);

            return $trigger;
        },

        //为需要绑定typeahead的el添加如下规则：选中后不能单独修改;
        triggerTahSelected:function(typeaheadEl,removeIcon){
            var $el = $(typeaheadEl);
            var $removeIcon = $(removeIcon);
            $el.prop({ disabled:true });
            $removeIcon.css({
                'display':'inline-block'
            });
        },

        datePickerWithInfo: function(options){
            /*var pickerOptions = {
             targetId: 'opf_calendar_time',
             url: 'date.php',
             callback: function(){
             var that = this;
             console.log(that.attr("data-date"));
             }
             };*/
            return datePickerWithInfo(options)
        },

        //地区码 任务审核有展示
        loadProvinceByRegionCode: function(code){
            var flag = '';
            Opf.ajax({
                type: 'GET',
                async: false,
                url: url._('options.province'),//, {value: code}
                success: function(data) {
                    $.each(data, function(i, v){
                        if(v.value == code){
                            flag = v.name || '';
                        }
                    });
                }
            });
            return flag;
        },

        /**
         * @author hefeng
         * @date 2015/12/4
         * @description 消息推送/消息中心 选择用户范围
         */
        selectMsgUsers: function(el, options){
            var opts = options||{};
            var receiveObj = el.data('receiveObj')||{};
            new AjaxSelect(el, {
                placeholder: '- 请选择用户范围 -',
                value: opts.appType==receiveObj.appType? receiveObj.defaultValue:"",
                ajax : {
                    url: url._('push.msg.receive', {appType:opts.appType})
                }
            });
        },

        /**
         * @author hefeng
         * @date 2015/12/4
         * 刷新审核拒绝理由模板分类
         */
        refreshRefuseConfig: function(el, defaultValue){
            new AjaxSelect(el, {
                value: defaultValue,
                placeholder: '- 请选择模板 -',
                convertField: {name:'refuseTitle', value:'id'}, //非标准name-value对进行转变
                ajax : {
                    url: url._('task.refuseConfig.selectLevel')
                }
            });
        }
    };

    var compiledTemplate = {

    };

    var TEMPLATES = {
        'bank.logo.name': [
            '<img src="assets/images/bankCardLogo/bankcard_<%=value%>.png" style="width:35px;height:35px">',
            '<label><%=name%></label>'
        ].join(''),

        'select.option': '<option value="<%=value%>"><%=name%></option>'

    };

    //搜索对应的select2，因后端没有统一对应哪个key value所以得写两道
    function cupsNameBySearch(str){
        var name = '';
        $(str).find('#sl_cupsNo').select2({
            placeholder: '请选择交易渠道',
            minimumInputLength: 1,
            ajax: {
                type: 'GET',
                url: url._('cups.name'),
                dataType: 'json',
                data: function (term) {
                    return {
                        kw: encodeURIComponent(term)
                    };
                },
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data, container, query, escapeMarkup){
                return data.name;
            },
            formatSelection: function(data, container, escapeMarkup){
                name = data.name;
                return data.name;
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
        return name;
    }

    function bankIdBySearch(str){
        var name = '';
        $(str).find('#sl_bankId').select2({
            placeholder: '请选择所属银行',
            minimumInputLength: 1,
            ajax: {
                type: 'GET',
                url: url._('card-bin.bankName'),
                dataType: 'json',
                data: function (term, page) {
                    return {
                        bankName: encodeURIComponent(term)
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
                if(number !== ''){
                    return $.ajax({
                        type: 'GET',
                        url: url._('card-bin.bankName'),
                        dataType: 'json',
                        data: function (term, page) {
                            return {
                                bankName: encodeURIComponent(number)
                            };
                        },
                        results: function (data, page) {
                            return {
                                results: data.bankName
                            };
                        }
                    });
                }
            },
            id: function (e) {
                return e.bankId;
            },
            formatResult: function(data, container, query, escapeMarkup){
                return data.bankName;
            },
            formatSelection: function(data, container, escapeMarkup){
                return data.bankName;
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

        return name;
    }

    //select标签模拟一个placeholder
    //方法：给select加一个options <option class="placeholder" disabled="disabled " selected="selected">-选择省-</option>
    function initSelectPlaceHolder (el, placeholder) {
        placeholder = placeholder || $(el).data('placeholder') || '- 请选择 -';
        $(el).empty().append(
            $('<option disabled="disabled " selected="selected"></option>')
            .text(placeholder)
            .addClass(SELECT_PLACEHOLDER_OPTION_CLS)
        );
        $(el).data('placeholder', placeholder);
    }

    return CommonUI;

});