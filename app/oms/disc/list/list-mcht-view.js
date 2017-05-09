
define(['App',
    'tpl!app/oms/disc/list/templates/uploadFile.tpl',
	'i18n!app/oms/common/nls/param',
	'app/oms/disc/disc-algos-grid',
	'jquery.jqGrid',
	'common-ui',
	'jquery.validate',
	'bootstrap-datepicker',
	'select2',
    'upload'
], function(App, uploadFileTpl) {

    var FEE_VALUE = "",
        SERVICE_CODE_VALUE = "",
        SERVICE_CODE_MAP = "";

    var tpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="disc-service-mcht-grid-table"></table>',
        '<div id="disc-service-mcht-grid-pager" ></div>',
        '</div>',
        '</div>'
    ].join('');


    var filterEditOptsFn = function(jsonObj){
        return JSON.stringify(jsonObj).replace(/[\{\}'"\\]/g, "").replace(/,/g, ";");
    };


    var select2Opts = {
        placeholder: '请选择费率',
        minimumInputLength: 1,
        width: 175,
        allowClear: true,
        ajax: {
            type: "get",
            url: 'api/system/options/disc-infos',
            dataType: 'json',
            data: function (value, page) {
                return {
                    kw: encodeURIComponent(value)
                };
            },
            results: function (data, page) {
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
            return data.name;
        }
    };

    var submitData = function(form, params){
        var $form = $(form);

        //增加校验规则
        Opf.Validate.addRules(form, {
            rules: {
                mchtNo: {required:true,number:true},
                proRateName: {required:true},
                proFixName: {required:true}
            }
        });

        var disableFields4Edit = params == "edit"? ["mchtNo", "serviceCode"] : [];

        //禁用相关项
        var disableField,
            disableFields = _.union(["mchtName", "batchNo"], disableFields4Edit);
        for(var j=0; j<disableFields.length; j++){
            disableField = disableFields[j];
            $("[name='"+disableField+"']", form).attr("disabled", true);
        }

        //商户对象编号
        var $mchtNo = $("input[name='mchtNo']", form);
        var oldMchtNo = newMchtNo = "";
        $mchtNo.on('blur', function(){
            newMchtNo = $(this).val();
            if(oldMchtNo==newMchtNo) return;
            oldMchtNo = newMchtNo;
            $.ajax({
                type: 'get',
                async: false,
                url: url._('service.fee.getMchtName'),
                data: {mchtNo:newMchtNo},
                success: function(res){
                    var value = (res&&res.value) || "无此商户";
                    $("input[name='mchtName']", form).val(value);
                }
            })
        });

        //按笔比例费率
        var $proRateName = $("input[name='proRateName']", form);
        $proRateName.select2(select2Opts);
        $proRateName.on('change', function(e){
            e.removed? $proFixName.rules('add', {required:true}):$proFixName.rules('remove');
            $form.validate().element($proRateName);
            $form.validate().element($proFixName);
        });

        //按笔固定费率
        var $proFixName = $("input[name='proFixName']", form);
        $proFixName.select2(select2Opts);
        $proFixName.on('change', function(e){
            e.removed? $proRateName.rules('add', {required:true}):$proRateName.rules('remove');
            $form.validate().element($proRateName);
            $form.validate().element($proFixName);
        });

        var $proRateValue = $("input[name='proRateValue']", form),
            $proFixValue = $("input[name='profixValue']", form);

        //编辑模式需要设置初始值
        if(params == "edit"){
            var proRateName = $proRateName.val(),
                proRateValue = $proRateValue.val(),
                proRate_default_value = {value:proRateValue, name:proRateName};
            !!proRateName && !!proRateValue && $proRateName.select2('data', proRate_default_value).trigger('change');

            var proFixName = $proFixName.val(),
                proFixValue = $proFixValue.val(),
                proFix_default_value = {value:proFixValue, name:proFixName};
            !!proFixName && !!proFixValue && $proFixName.select2('data', proFix_default_value).trigger('change');
        }

        //删除备选项
        $proRateValue.closest('tr.FormData').remove();
        $proFixValue.closest('tr.FormData').remove();

        if(params == 'edit') {
            //增加复选框
            var isBatCheckbox = [
                '<tr class="FormData">',
                '<td class="CaptionTD">&nbsp;&nbsp;</td>',
                '<td class="DataTD">&nbsp;<input type="checkbox" name="isBat" value="1">&nbsp;修改同一批次下所有商户</td>',
                '</tr>'
            ].join('');

            $form.find('#tr_batchNo').after($(isBatCheckbox));
        } else {
            // 删除批次号
            $form.find('#tr_batchNo').remove();
        }
    };

    var submitValidate = function(postdata, form){
        var validateBeforeSubmit = Opf.Validate.setup;
        var ret = validateBeforeSubmit(postdata, form);

        var isBat = $(form).find('input[name="isBat"]').is(':checked')? "0" : "1";

        if(ret[0]){
            postdata.isBat = isBat;
            try{
                delete postdata.mchtName;
            } catch(e){}
        }
        return ret;
    };

	App.module('ParamSysApp.Disc.List.View', function(View, App, Backbone, Marionette, $, _) {

        (function(){
            //同步获取下拉菜单
            //获取费率
            /*$.ajax({
                type: 'GET',
                url: url._('service.fee.model'),
                dataType: 'json',
                async: false,
                success: function(rst){
                    var rstData = rst||[];
                    var rstObj = {};
                    for(var i=0; i<rstData.length; i++){
                        var item = rstData[i];
                        rstObj[item.value] = item.name;
                    }
                    FEE_VALUE = {value:filterEditOptsFn(JSON.stringify(rstObj))};
                }
            });*/

            //服务名称
            $.ajax({
                type: 'GET',
                url: url._('service.fee.code'),
                dataType: 'json',
                async: false,
                success: function(rst){
                    var rstData = rst||[];
                    var rstObj = {};
                    for(var i=0; i<rstData.length; i++){
                        var item = rstData[i];
                        rstObj[item.value] = item.name;
                    }
                    SERVICE_CODE_MAP = rstObj;
                    SERVICE_CODE_VALUE = {value:filterEditOptsFn(JSON.stringify(rstObj))};
                }
            });
        })();

		View.Mcht = Marionette.ItemView.extend({
			tabId: 'menu.disc.service.mcht',
			template: _.template(tpl),

			onRender: function() {
				var me = this;
				_.defer(function () {
					me.renderGrid();
				});
			},

			renderGrid: function() {
				var me = this;
				me.grid = App.Factory.createJqGrid({
                    caption: '单商户服务费',
					rsId:'disc.service.mcht',
                    gid: 'disc-service-mcht-grid',
                    url: url._('disc.service.mcht'),
                    filters: [
                        {
                            caption: '精准搜索',
                            defaultRenderGrid: false,
                            canSearchAll: true,
                            canClearSearch: true,
                            components: [
                                {
                                    label: '商户号',
                                    name: 'mchtNo',
                                    inputmask: {
                                        integer: true
                                    },
                                    options:{
                                        sopt:['eq']
                                    }
                                }, {
                                    label: '商户名',
                                    name: 'mchtName',
                                    options:{
                                        sopt:['eq']
                                    }
                                }, {
                                    label: '批次号',
                                    name: 'batchNo',
                                    options:{
                                        sopt:['eq']
                                    }
                                }, {
                                    label: '服务名',
                                    name: 'serviceCode',
                                    type: 'select',
                                    options: {
                                        sopt: ['eq'],
                                        value: SERVICE_CODE_MAP
                                    }
                                }
                            ],
                            searchBtn: {
                                text: '搜索'
                            }
                        }
                    ],
                    actionsCol: {
                        view:false
                    },
					nav: {
						formSize: {
			                width: 420,
			                height: 400
						},
                        actions: {
                            search :false
                        },
                        add: {
                            beforeShowForm: submitData,
                            beforeSubmit: submitValidate
                        },
                        edit: {
                            beforeShowForm: submitData,
                            beforeSubmit: submitValidate
                        },
                        del: {
                            beforeInitData: function($t) {
                                // 设置checkbox默认为不选
                                $t.find(':checkbox').attr('checked', false);
                            },
                            beforeShowForm: function($t) {
                                var that = this;
                                var $target = $t.find('tr:last>td');
                                var $delData = $t.find('tr#DelData>td');
                                var $delError = $t.find('tr#DelError');

                                // 增加复选框
                                var isBatCheckbox = [
                                    '<div class="checkbox"><label class="text-primary">',
                                    '<input id="isBat" type="checkbox" name="isBat" value="1">是否删除批次',
                                    '</label></div>'
                                ].join('');

                                // 暂存当前勾选状态
                                var $cbDiv = $(isBatCheckbox);

                                $cbDiv.find(':checkbox').on('change', function() {
                                    var isChecked = $(this).is(':checked'),
                                        delData = $delData.text(),
                                        newDelData = delData.split(',');

                                    var $grid = $(that),
                                        rowData = $grid._getSelRecord(),
                                        batchNo = rowData.batchNo||"";

                                    if(isChecked) {
                                        if(batchNo == "") {
                                            $delError.find('.ui-state-error').text('批次号异常：只能删除单条商户记录。');
                                            $delError.show();

                                            $(this).attr('checked', false);

                                            return;
                                        }

                                        newDelData[1] = batchNo;
                                    } else {
                                        newDelData.splice(1, 1);
                                    }

                                    $delData.text(newDelData.join(','));
                                });

                                $target.empty().append($cbDiv);
                            }
                        }
					},
					colNames: {
                        mchtNo: "商户号",
                        mchtName: "商户名",
                        serviceCode: "服务名称",
                        proRateName: "按笔比例费率",
                        proFixName: "按笔固定费率",
                        batchNo: "批次号",
                        proRateValue: "&nbsp;&nbsp;",
                        profixValue: "&nbsp;&nbsp;"
					},

					colModel: [
						{name: 'id', index: 'id', hidden: true},
						{name: 'mchtNo', index: 'mchtNo', editable:true},
						{name: 'mchtName', index: 'mchtName', editable:true, edittype: 'text'},
						{name: 'serviceCode', index: 'serviceCode',
                            editable:true, edittype: 'select', editoptions: SERVICE_CODE_VALUE,
                            formatter:function(value){ return SERVICE_CODE_MAP[value]||""; }
                        },
						{name: 'proRateName', index: 'proRateName', editable:true},
						{name: 'proFixName', index: 'proFixName', editable:true},
						{name: 'batchNo', index: 'batchNo', editable:true},
                        {name: 'proRateValue', index: 'proRateValue', editable:true, hidden: true},
                        {name: 'profixValue', index: 'profixValue', editable:true, hidden: true}
					]
				});

                me.generateImportBtn(me.grid);
			},

            generateImportBtn: function (grid) {
                var me = this;
                if (!Ctx.avail('disc.service.mcht.batchImport')) {
                    return;
                }
                Opf.Grid.navButtonAdd(grid, {
                    caption: '',
                    id: 'batchImport',
                    name: 'batchImport',
                    title: '批量导入',
                    buttonicon: 'icon-upload-alt white',
                    position: 'last',
                    onClickButton: function () {
                        addDialog(me);
                    }
                });
                $("#importInformation").hover(function () {
                    $(".icon-upload-alt").addClass("icon-upload-alt-hover");
                }, function () {
                    $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
                });
            }

		});

	});

    function addDialog(me) {
        var uploader = null;
        uploader = uploadFileTpl();

        var $dialog = Opf.Factory.createDialog(uploader, {
            destroyOnClose: true,
            autoOpen: true,
            width: 450,
            height: 420,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var serviceCode = $dialog.find('[name="serviceCode"]').val(),
                        proRateName = $dialog.find('[name="proRateName"]').select2('data') == null ? '' : $dialog.find('[name="proRateName"]').select2('data').value,
                        proFixName = $dialog.find('[name="proFixName"]').select2('data') == null ? '' : $dialog.find('[name="proFixName"]').select2('data').value,
                        fileSelected = ($dialog.find("input[name='file']").val() === '' ? false : true);

                    // 校验数据是否合法
                    var $form = $dialog.find('form.upload-form');
                    var isValid = $form.validate().element($dialog.find('[name="proRateName"]')) ||
                                    $form.validate().element($dialog.find('[name="proFixName"]'));
                    if(!isValid) return;

                    var postData = {serviceCode: serviceCode, proRateName: proRateName, proFixName: proFixName};

                    if (fileSelected) {
                        uploader.setData(postData);
                        uploader.submit();
                    }
                    else if(serviceCode == null){
                        $("label[for='uploadfile']").addClass("error").text("选择服务名称必填.");
                    }
                    else if(proRateName == '' && proFixName == ''){
                        $("label[for='uploadfile']").addClass("error").text("费率任意选择一个填写.");
                    }
                    else{
                        $("label[for='uploadfile']").addClass("error").text("请选择文件.");
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                var $me = $(this),
                    $indicator = $me.find('.uploadFileIndicator'),
                    $trigger = $me.find('.uploadfile'),
                    $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');

                var sCode_html = '';
                $.each(SERVICE_CODE_MAP, function(i, v){
                    sCode_html += '<option value="'+i+'">'+v+'</option>';
                });
                $me.find('[name="serviceCode"]').append(sCode_html);

                /*$me.find('[name="proRateName"]').select2(select2Opts);
                $me.find('[name="proFixName"]').select2(select2Opts);*/

                submitData($me.find('form.upload-form'));

                uploader = new Uploader({
                    data: {},
                    name: 'file',
                    trigger: $trigger,
                    action: url._('disc.service.mcht.import'),
                    accept: '.xls, .xlsx',
                    change: function () {
                        $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                    },
                    beforeSubmit: function () {
                        Opf.UI.busyText($submitBtn);
                        $indicator.show();
                    },
                    complete: function () {
                        $indicator.hide();
                        Opf.UI.busyText($submitBtn, false);
                    },
                    progress: function (queueId, event, position, total, percent) {
                        if (percent) {
                            $indicator.find('.progress-percent').text(percent + '%').show();
                        }
                    },
                    success: function (queueId, resp) {
                        if (resp.success === false) {
                            if(resp.data == undefined){
                                Opf.alert({title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败'});
                            }
                            else{
                                Opf.alert({
                                    title: '文件格式不合法',
                                    message: resp.msg ? '导入数据有异常，'+ '<a href="'+resp.data+'">点击下载查看详情！</a>' + '请先下载上传模板。' : '上传失败'
                                });
                            }
                        }
                        else {
                            me.grid.trigger("reloadGrid", [{current: true}]);
                            $me.dialog("destroy");
                        }
                    }
                });

                // 下载按钮
                $(this).find('.download-btn').click(function (event) {
                    Opf.UI.setLoading($('#page-content'), true);
                    Opf.ajax({
                        url: url._('disc.service.mcht.download'),
                        success: function (resp) {
                            Opf.download(resp.data);
                        },

                        error: function (resp) {
                            console.log("downlaod template error");
                        },

                        complete: function (resp) {
                            Opf.UI.setLoading($(event.target).closest('#page-content'), false);
                        }
                    });
                });
            }
        });
    }

	return App.ParamSysApp.Disc.List.View;
});