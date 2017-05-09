define([
    "App",
    'tpl!assets/scripts/fwk/entry/template/dialog.tpl',
    'jquery.validate'
], function(App, dialogTpl) {
    // 数字+字母
    jQuery.validator.addMethod("numberORletterOnly", function(value, element) {
        var valid=false;
        var reg_password = /^\w{6,12}$/; //字母，数字，下划线(6~12)
        var reg_password2 = /^(\d(?!\d*$)|[A-z](?![A-z]*$))\w*$/; //不能全是数字也不能全是字母
        if(reg_password.test(value)&&reg_password2.test(value)){
            valid = true;
        }
        return this.optional(element) || valid;
    }, "密码必须6到12位，且包含数字和字母");

    App.on('toChangePsw', showChangePswDiag);

    var isPswChanged, about_psw, about_psw_msg;
    function setVars(options){
        isPswChanged = options.isPswChanged;
        about_psw = options.about_psw;
        about_psw_msg = options.about_psw_msg;
    }

    function showChangePswDiag4Inig () {
        var $node;
        var insertNode;
        var $dialog = showChangePswDiag();
        $dialog.dialog( "option", "closeOnEscape", false );
        $dialog.closest('.ui-widget').find(".ui-dialog-titlebar-close").hide();
        $dialog.closest('.ui-widget').prev().css("background-color", "#ccc");

        if(!isPswChanged){
            insertNode = '<div style="margin: 20px 0 0 15px; color: red;"><span>为了您的账号安全，开始使用系统之前，请先修改密码。密码必须6到12位，且包含数字和字母。</span></div>';
        } else if(!!about_psw) {
            if(about_psw=="theTimeToUpdatePassword"){
                insertNode = '<div style="margin: 20px 0 0 15px; color: red;"><span>您的账号密码已过期，请修改密码。密码必须6到12位，且包含数字和字母。</span></div>';
            } else if(about_psw=="passworIsTooEasy") {
                insertNode = '<div style="margin: 20px 0 0 15px; color: red;"><span>为了您的账号安全，请修改密码。密码必须6到12位，且包含数字和字母。</span></div>';
            } else {
                insertNode = '<div style="margin: 20px 0 0 15px; color: red;"><span>未知密码异常。</span></div>';
            }
        } else {
            insertNode = '<div style="margin: 20px 0 0 15px; color: red;"><span>未知登录异常。</span></div>';
        }

        $node = $dialog.closest('.ui-widget').find("#ui-id-1");
        $node.before(insertNode);

        /**
         * 强制修改密码，取消跳过此项操作
         * Author: hefeng
         * Date: 2015/9/8
         */
        /*setTimeout(function(){
            var $buttonset = $('.ui-dialog-buttonset');
            $buttonset.append('<a class="psw-link">跳过此项操作</a>');
            var $pswLink = $buttonset.find('.psw-link');
            $pswLink.css({
                "float": "right",
                "margin-right": "15px",
                "margin-top": "15px",
                "cursor": "pointer"
            });
            $pswLink.click(function(){
                $dialog.dialog("destroy");
                App.trigger('psw:skip:success'); 
            });

        },10);*/

    }
    
    function showChangePswDiag() {
        var $dlg = $(dialogTpl({}));
        return $dlg.dialog({
            autoOpen: true,
            height: 420,
            width: 360,
            modal: true,
            title: "修改密码",
            closeOnEscape: true,
            buttons: [{
                html: "<i class='icon-ok'></i>&nbsp; 提交",
                "class" : "btn btn-xs btn-primary pull-right",
                click: function() {
                    var me = this;
                    var $form = $('form.repair-password-form');

                    if(!$form.validate().form()){
                        return;
                    }

                    var postData = {
                        oldpassword: $form.find('input[name="oldpassword"]').val(),
                        newpassword: $form.find('input[name="newpassword"]').val()
                    };

                    $.ajax({
                        url: 'api/system/operators/modify-password',
                        type: 'POST',
                        contentType: "application/x-www-form-urlencoded",
                        dataType: "json",
                        data: postData,
                        success: function(resp) {
                            if(resp.status === 1) {
                                Opf.Toast.success('修改密码成功');
                                $(me).dialog('destroy');
                                App.trigger('psw:change:success');
                                // $('#btn-entry-logout').trigger('click');
                            } else {
                                Opf.alert({
                                    title:'修改失败',
                                    message: resp.remark
                                });
                                console.log(JSON.stringify(resp));
                            }
                        },
                        error: function(resp) {
                            console.error(JSON.stringify(resp));
                        }
                    });
                }
            }],

            create: function() {
                var $form = $('form.repair-password-form');

                Opf.Validate.addRules($form, {
                    rules: {
                        oldpassword: 'required',
                        newpassword: {
                            required: true,
                            nowhitespace: true,
                            numberORletterOnly: true,
                            notEqualTo: '#oldpassword'
                        },
                        renewpassword: {
                            required: true,
                            equalTo: '#newpassword'
                        }
                    },
                    messages: {
                        oldpassword: {
                            required: '旧密码不能为空'
                        },
                        newpassword: {
                            required: '新密码不能为空',
                            nowhitespace: '密码不能包含空格',
                            notEqualTo: '新密码不能与旧密码相同'
                        },
                        renewpassword: {
                            required: '重复新密码不能为空',
                            equalTo: '新密码填写不一致'
                        }
                    }
                });

                $(this).prev('.ui-widget-header').find('.ui-dialog-title').addClass('settle-styles-paddingL-15');
            },
            open: function(){
                var styleCssNode = $(this).next('.ui-dialog-buttonpane').find(".ui-dialog-buttonset");
                styleCssNode.css("text-align", "left");
                var fontSize = styleCssNode[0].style.fontSize || 13;
                styleCssNode.css("padding-left", parseInt(fontSize) + parseInt(styleCssNode.innerWidth() * 0.25) - 2 + "px");
            },
            close: function() {
                $(this).dialog("destroy");
            }
        });
    }

    return {
        setVars: setVars,
        showChangePswDiag: showChangePswDiag,
        showChangePswDiag4Inig: showChangePswDiag4Inig
    };
});