//ckeditor:在 standard 版基础上加上enhance image 和 preview， 移除原有image， about
//如果需要修改正文默认字号需要修改
//content.css 里面的font-size 以及 我们查看时候的 font-size
define([
    'ckeditor'
], function() {

    function Editor(options) {
        options = options || {};

        var me = this;
        var _lastRespUrl = null;

        Opf.UI.setLoading(options.renderTo, true, {text: '正在加载 高级编辑器...'});

        var ckEditor = CKEDITOR.appendTo(options.renderTo[0], {
            // resize_maxWidth: "300px",
            extraPlugins: 'font,justify',
            fontSize_defaultLabel: '16px',
            toolbarGroups: [
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'editing', groups: ['find', 'selection' /*, 'spellchecker'*/ ]},
                {name: 'links'},
                {name: 'insert'},
                {name: 'forms'},
                {name: 'tools'},
                {name: 'document', groups: [ /*'mode',*/ 'document', 'doctools']},
                {name: 'others'},
                '/', 
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
                {name: 'styles'},
                {name: 'colors'}
                /*,
                { name: 'about' }*/
            ],
            removeDialogTabs: 'image:advanced;image:link;image:Link;'
        });


         // ckEditor.on('contentPreview', function () {
         //    debugger;
         // });

         //ckEditor.on('maximize', function () {
         //   debugger;
         //});

         CKEDITOR.on('instanceReady', function () {
            Opf.UI.setLoading(options.renderTo, false);
         });

        CKEDITOR.on('dialogDefinition', function(ev) {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;

            if (dialogName == 'image2') {
                var _onLoad = dialogDefinition.onLoad;
                var _onOK = dialogDefinition.onOk;


                var dialog = dialogDefinition.dialog;
  
                dialog.on('ok', function () {
                    var image = this.widget.parts.image;

                    if(_lastRespUrl) {
                        ckEditor.fire('insert:image', {
                            url: _lastRespUrl
                        });
                        _lastRespUrl = null;
                        $(image.$).attr('is-local', '1');
                    }

                });

                //'image' 插件用.onOk 这种方式， image2 可以用 ok 事件
                // dialogDefinition.onOk = function (e) {
                //     // _onOK && _onOK.apply(this, arguments);
                //     console.log('11');
                // };

                dialogDefinition.onLoad = function() {
                    _onLoad && _onLoad.apply(this, arguments);

                    var ckSrcElement = this.getContentElement('info', 'src');

                    if (ckSrcElement) {

                        $('#notice-ckeditor-btn-select-file').remove();

                        var $txtUrlElement = $('#' + ckSrcElement.domId);
                        var $trigger = $('<div id="notice-ckeditor-btn-select-file" class="btn-select-file" type="button">选择图片</div>');
                        var $dialogBody = $txtUrlElement.closest('.cke_dialog_body');

                        $txtUrlElement.find('input').css('width', 'auto').after($trigger);

                        new Uploader({
                            action: options.uploadUrl,
                            data: {
                                tid: Ctx? (_.isFunction(Ctx.getId)?Ctx.getId():""):""
                            },
                            accept: 'image/*',
                            beforeSubmit: function () {
                                Opf.UI.setLoading($dialogBody);
                            },
                            trigger: $trigger,
                            // progress: function(queueId, event, position, total, percent) {
                            //     view.updatePercent(percent);
                            // },
                            error: function() {

                            },
                            complete: function () {
                                Opf.UI.setLoading($dialogBody, false);
                            },
                            success: function(queueId, resp) {
                                if (resp.success !== false) {
                                    _lastRespUrl = resp.url;
                                    resp.url && ckSrcElement.setValue(resp.url);
                                } else {
                                    resp.msg && Opf.alert(resp.msg);
                                }
                            }
                        });

                    }
                };
            }
        });

        return ckEditor;
    }

    return Editor;
});