/**
 * Created by wupeiying on 2015/7/27.
 */
define(['App',
    'tpl!app/oms/operate/service-targer/servicelist.tpl',
    'tpl!app/oms/operate/service-targer/uploadFile.tpl',
    'jquery.jqGrid',
    'jquery.validate',
    'upload'
], function(App, tpl, uploadFileTpl) {

    var TARGAR_MAP = {
        1: '商户',
        2: '机构'
    };

    var STATUS_MAP = {
        0: '关闭',
        1: '正常'
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.service.target.config',
        template: tpl,

        initialize: function () {},

        onRender: function() {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        showDialog: function(){
            Opf.Factory.createDialog(this.$el, {
                dialogClass: 'ui-jqdialog',
                open: true,
                destroyOnClose: true,
                width: 850,
                height: 600,
                modal: true,
                title: '服务对象',
                buttons: [{
                    type: 'cancel',
                    text: '关闭'
                }]
            });
            $('.ui-jqdialog-content').attr("style","overflow-x:hidden!important;");
            //$('.ui-dialog ').css('height','600');
        },
        renderGrid: function() {
            var me = this;
            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    rules : {
                        objNo: {
                            required: true,
                            number: true
                        }
                    }
                });
            };

            var grid = me.grid = App.Factory.createJqGrid({
                rsId:'service.targer',
                caption: '',
                gid: 'service-targer-grid',
                url: url._('service.targer.config', {serviceId: me.options.serviceId}),
                actionsCol: { view: false },
                nav: {
                    actions: { view: false },
                    edit: {
                        beforeShowForm: function(form) {
                            addValidateRules(form);
                            form.find('#objNo').attr('disabled', true);
                            form.find('#objType').attr('disabled', true);
                            loadEditCss(form);
                        },
                        beforeSubmit: setupValidation,
                        onclickSubmit: function (params, postdata) {
                            params.url = url._('service.targer.config.edit', { id: postdata.id });
                        }
                    },
                    add: {
                        beforeShowForm: function(form) {
                            addValidateRules(form);
                            form.find('#objNo').focus();
                            form.find('#serviceId').val(me.options.serviceId);
                            form.find('#tr_serviceId').css('display','none');
                            loadEditCss(form);
                            $('#objNo').parent().append('<label for="objNo" class="error" style="display: none;">商户号有误，请确认后重新输入</label>');//默认增加一个错误提示，隐藏。
                            var objNo = form.find('#objNo');
                            $(objNo).on('blur', function(){
                                if($(objNo).val().trim() != ''){
                                    Opf.ajax({
                                        type: 'GET',
                                        url: url._('service.targer.config.repeat', { objType: $('#objType').val(), objNo: $(objNo).val() }),
                                        success: function(data) {
                                            if(data == false){
                                                $('#objNo').addClass('error');
                                                $('label[for="objNo"]').css('display','block');
                                            }
                                        }
                                    });
                                }
                            });
                        },
                        beforeSubmit: function(postdata, form){
                            var objNo = $('#objNo');
                            if($(objNo).val().trim() != ''){
                                var flag = loadAddHandle(objNo);
                                return [flag, ''];
                            }
                            else{
                                var $form = $(form);
                                var valid = $form.validate().form();
                                return [valid, ''];
                            }
                        },
                        onclickSubmit: function (params, postdata) {
                            params.url = url._('service.targer.config.add');
                        }
                    },
                    del: {
                        onclickSubmit: function (params, postdata) {
                            params.url = url._('service.targer.config.del', { id: postdata });
                        }
                    }
                },
                colNames: {
                    id:     	 '',
                    objType:     '服务对象类型',
                    objNo:       '服务对象编号',
                    objName:     '服务对象名称',
                    signStatus:  '签约状态',
                    status:		 '服务状态',
                    remark:		 '备注',
                    serviceId:   '服务ID'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'objType',  search:true,  editable: true, formatter: typeFormatter,
                        edittype:'select',
                        editoptions: {
                            value: TARGAR_MAP
                        },
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: TARGAR_MAP
                        }
                    },
                    {name: 'objNo', search:true, editable: true},
                    {name: 'objName'},
                    {name: 'signStatus', search:true, editable: true, formatter: statusFormatter,
                        edittype:'select',
                        editoptions: {
                            value: STATUS_MAP
                        },
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: STATUS_MAP
                        }
                    },
                    {name: 'status', search:true, editable: true, formatter: statusFormatter,
                        edittype:'select',
                        editoptions: {
                            value: STATUS_MAP
                        },
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: STATUS_MAP
                        }
                    },
                    {name: 'remark',  editable: true, edittype: 'textarea'},//, formatter: remarkSubFormatter
                    {name: 'serviceId',  editable: true, hidden: true}
                ]
            });

            me.ImportBtn(grid);//批量导入

            return grid;
        },

        ImportBtn: function (grid)  {
            var me = this;
            Opf.Grid.navButtonAdd(grid, {
                caption: "",
                id: "configImport",
                name: "configImport",
                title:'批量导入',
                buttonicon: "icon-upload-alt white",
                position: "last",
                onClickButton: function(){
                    ImportDialog(me);
                }
            });
            $("#configImport").hover(function(){
                $(".icon-upload-alt").addClass("icon-upload-alt-hover");
            },function(){
                $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
            });
        }

    });

    function loadAddHandle(objNo){
        var flag = false;
        Opf.ajax({
            type: 'GET',
            async: false,
            url: url._('service.targer.config.repeat', { objType: $('#objType').val(), objNo: $(objNo).val() }),
            success: function(data) {
                if(data == false){
                    $('#objNo').addClass('error');
                    $('label[for="objNo"]').css('display','block');
                    flag = false;
                }
                else{
                    $('#objNo').removeClass('error');
                    $('label[for="objNo"]').css('display','none');
                    flag = true;
                }
            }
        });
        return flag;
    }

    //设置新增和修改框样式
    function loadEditCss(form){
        form.find('#tr_serviceId').css('display','none');
        form.find('#objType').css('width','180px');
        form.find('#signStatus').css('width','180px');
        form.find('#status').css('width','180px');
        form.find('#remark').css({ width: 180, height: 100, maxWidth: 180, maxHeight: 100 });
    }

    //批量导入
    function ImportDialog(me){
        var titleName = "服务对象导入";
        var uploader, tpl = null;
        uploader = tpl = uploadFileTpl({
            data: titleName
        });
        var $dialog = Opf.Factory.createDialog(tpl, {
            destroyOnClose: true,
            autoOpen: true,
            width: 450,
            height: 420,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function (e) {
                    var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);
                    if(fileSelected){
                        uploader.submit();
                    }
                    else{
                        $("label[for='uploadfile']").addClass("error").text("请选择文件");
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function() {
                var $me = $(this),
                    $indicator = $me.find('.uploadFileIndicator'),
                    $trigger = $me.find('.uploadfile'),
                    $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                uploader = new Uploader({
                    data: { serviceId: me.options.serviceId },
                    name: 'file',
                    trigger: $trigger,
                    action: url._('service.targer.config.import'),//上传接口, { serviceId: me.options.serviceId }
                    accept: '.xls, .xlsx',
                    change: function () {
                        $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                    },
                    beforeSubmit: function () {
                        Opf.UI.busyText($submitBtn);
                    },
                    complete: function () {
                        Opf.UI.busyText($submitBtn,false);
                    },
                    progress: function(queueId, event, position, total, percent) {
                        if(percent) {
                            $indicator.find('.progress-percent').text(percent+'%').show();
                        }
                    },
                    success: function(queueId, resp) {
                        if(resp.success === false) {
                            Opf.alert({ title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败' });
                        } else {
                            me.grid.trigger("reloadGrid", [{current:true}]);
                            $me.dialog("destroy");
                            Opf.alert({ title: '上传成功', message: resp.msg });
                        }

                    }
                });

                // 下载按钮
                $(this).find('.download-btn').click(function(event) {
                    Opf.UI.setLoading($('#page-content'), true);
                    Opf.ajax({
                        url: url._('service.targer.config.downLoad'),
                        success: function (resp) {
                            Opf.download(resp.data);
                        },

                        error: function(resp) {
                            console.log("downlaod template error");
                        },

                        complete: function (resp) {
                            Opf.UI.setLoading($(event.target).closest('#page-content'),false);
                        }
                    });
                });
            }
        });
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function typeFormatter (val) {
        return TARGAR_MAP[val] || '';
    }

    function remarkSubFormatter(val){
        var sub_val = val.substring(0, 32);
        var str_r = sub_val + '...';
        return str_r || '';
    }

    function remarkFormatter(val){
        return val || '';
    }

    //App.on('service:target:config', function () {
    //    App.show(new View());
    //});

    return View;

});