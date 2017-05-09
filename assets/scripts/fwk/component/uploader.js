/**
 * 批量导入EXCEL数据
 */
define([
    'tpl!assets/scripts/fwk/component/templates/uploadFile.tpl',
    'upload'
],function(uploadFileTpl){
    /**
     * 生成下拉列表
     * @param url 远程请求地址
     * @param $obj select对象
     * @param formatterData 格式化数据
     */
    var createOptions = function(url, $obj, formatterData){
        var buildOptions = function(data){
            var tpl = _.map(data, function(item){
                var value = item.value||item.text||"";
                var text = item.text||item.value||"";
                return 	'<option value="' + value + '">' + text + '</option>';
            }).join('');
            var $options = $(tpl);
            $obj.append($options);
        };

        var items;

        if(typeof url == "string"){
            Opf.ajax({
                url: url,
                type: 'GET',
                success: function (resp) {
                    if(_.isFunction(formatterData)){
                        items = formatterData(resp);
                    } else {
                        items = resp;
                    }
                    buildOptions(items);
                }
            });
        } else {
            if(_.isFunction(formatterData)){
                items = formatterData(url);
            } else {
                items = url;
            }
            buildOptions(items);
        }
    };

    return {
        doImport: function(options){
            var uploadTitle = options.uploadTitle||"批量导入";
            var uploadUrl = options.uploadUrl||"";
            var uploadTpl = options.uploadTpl||"";
            var uploadParams = options.uploadParams||[];
            var uploadResultTitle = options.uploadResultTitle;
            var cbSuccess = options.cbSuccess||function(){};
            var uploader, tpl = uploadFileTpl();

            var $dialog = Opf.Factory.createDialog(tpl, {
                title: uploadTitle,
                destroyOnClose: true,
                autoOpen: true,
                width: 450,
                height: 420,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function (e) {
                        var fileSelected = $dialog.find("input[name='file']").val() !== "";
                        var formData = Opf.Util.getFormData($("#uploadFileTplContent", $dialog));

                        if(fileSelected){
                            uploader.setData(formData);
                            uploader.submit();
                        } else {
                            $("label[for='uploadfile']").addClass("error").text("请选择文件");
                        }
                    }
                }, {
                    type: 'cancel'
                }],
                create: function() {
                    var me = this, $me = $(me),
                        $indicator = $me.find('.uploadFileIndicator'),
                        $labelForUploadFile = $me.find("label[for='uploadfile']"),
                        $trigger = $me.find('.uploadfile'),
                        $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');

                    //模板上传类型
                    var uploadFileTplContent = $("#uploadFileTplContent", $me);
                    for(var i=0; i<uploadParams.length; i++){
                        var param = uploadParams[i];
                        var $label,
                            $select,
                            $div = $('<div class="row-param"></div>');

                        switch(param.type){
                            case "label":
                                $label = $('<label>'+param.label+'</label>');
                                $div.append($label);
                                break;

                            case "select":
                                $label = $('<label for="'+param.name+'">'+param.label+'：</label>');
                                $select = $('<select name="'+param.name+'"></select>');
                                createOptions(param.url, $select, param.formatterData);
                                $div.append($label, $select);
                                break;

                            default:
                                break;
                        }

                        uploadFileTplContent.append($div);
                    }

                    if(uploadParams.length==0){
                        $("#uploadFileTplContent", $me).html('<i class="text-muted">无附加条件</i>');
                    }

                    uploader = new Uploader({
                        data: {},
                        name: 'file',
                        trigger: $trigger,
                        action: uploadUrl,
                        accept: '.xls, .xlsx',
                        change: function () {
                            $labelForUploadFile.removeClass("error").text($me.find("input[name='file']").val());
                        },
                        beforeSubmit: function () {
                            $indicator.show();
                            Opf.UI.busyText($submitBtn);
                        },
                        complete: function () {
                            $indicator.hide();
                            Opf.UI.busyText($submitBtn,false);
                        },
                        progress: function(queueId, event, position, total, percent) {
                            if(percent) {
                                $indicator.find('.progress-percent').text(percent+'%').show();
                            }
                        },
                        success: function(queueId, resp) {
                            if(resp.success === false) {
                                Opf.alert({
                                    title: uploadResultTitle ? uploadResultTitle : '批量导入结果',
                                    message: resp.msg ? resp.msg : '上传失败，请先下载上传模板。'
                                });
                            } else {
                                if(!_.isEmpty(resp.msg)) {
                                    Opf.alert({
                                        title: uploadResultTitle ? uploadResultTitle : '批量导入结果',
                                        message: resp.msg
                                    });
                                } else {
                                    Opf.Toast.success('导入成功');
                                }
                            }
                            $me.dialog("close");
                            cbSuccess.call(me, queueId, resp);
                        }
                    });

                    // 下载按钮
                    $(this).find('.download-btn').click(function(event) {
                        Opf.UI.setLoading($('#page-content'), true);
                        Opf.ajax({
                            url: uploadTpl,
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
    }
});
