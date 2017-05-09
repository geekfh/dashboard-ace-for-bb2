/**
 * 增强jquery.ui.dialog
 *
 * 增强配置：
 * destroyOnClose
 * 
 */
define(['jquery-ui',
    'assets/scripts/fwk/component/Dialog'
], function(x, Dialog) {
    /**
     * 创建Dialog
     * @memberof App.Factory
     * @param {DOM} el - jQuery/DOM对象
     * @param {Object} options - jquery-ui Dialog插件配置项
     * @returns {jQuery} Dialog
     * @see http://jqueryui.com/dialog/
     */
    function createDialog (el, options) {
        var $el = $(el);
        adapt($el, options);

        var $dialog = $el.dialog(options);

        // 当停止改变弹框窗口宽高，则让弹框居中
        $dialog.dialog({
            resizeStop: function () {
                _resize.call($dialog);
                $dialog.trigger('resize.stop');
            }
        });

        $(window).on('resize.dialog', _.bind(_resize, $dialog));

        $(window).triggerHandler('resize.dialog');

        return $dialog;
    }

    var DEFAULT_BUTTONS = {
        'cancel': {
            className: 'cancel',
            icons: { primary: 'icon-remove' },
            text: '取消',
            click: function () {
                $( this ).dialog( "close" );
            }
        },
        'submit': {
            className: 'submit',
            icons: { primary: 'icon-ok' },
            text: '提交'
        },
        'save': {
            className: 'save',
            icons: { primary: 'icon-ok' },
            text: '保存'
        }
    };

    function adapt ($el, options) {

        /*$el.on('dialogdestroy', function () {
            alert('destroy');
        });*/

        $el.on('dialogopen', function () {
            style(this);

            if(options.modal) {
                Opf.UI.fixedBody(true);

                $el.on('dialogclose', function () {
                    Opf.UI.fixedBody(false);                
                });
            }
        });

        if($.isArray(options.buttons)) {

            _.each(options.buttons, function (btn) {

                if(DEFAULT_BUTTONS[btn.type]) {

                    _.mergeIf(btn, DEFAULT_BUTTONS[btn.type]);
                }
            });
        }

        $el.on('dialogclose', function () {
            if(options.destroyOnClose) {
                $(this).dialog('destroy');
            }
        });
    }

    function style (dialog) {
        var $dialog = $(dialog);
        $dialog.closest('.ui-dialog').addClass('ui-jqdialog');
        $dialog.prev('.ui-widget-header').find('.ui-dialog-title').addClass('ui-jqdialog-title');

        $dialog.addClass('ui-jqdialog-content');
        var $btnPanel = $dialog.next('.ui-dialog-buttonpane');
        $btnPanel.find('button').addClass('fm-button  ui-corner-all fm-button-icon-left btn btn-sm btn-primary');
        $btnPanel.find('button[type="cancel"]').removeClass('btn-primary');
        $btnPanel.find('button .ui-icon').removeClass('ui-icon');
        $btnPanel.find('.ui-button-text').removeClass('ui-button-text').addClass('text');
    }

    function _resize(){
        var $dialog = $(this);
        var $dialogWrap = $dialog.closest('.ui-dialog');
        // 在改变弹框窗口宽高的过程中，不让该弹框自动居中
        if(!$dialogWrap.hasClass('ui-dialog-resizing')){
            $dialogWrap.position({
                my: 'center center',
                at: 'center center',
                of : window
            });
        }
    }


    /**
     * 基于jQuery-UI Dialog创建
     * @memberof App.Factory
     * @param {Object} options - jquery-ui Dialog插件配置项
     * @returns {ItemView} - Marionette.ItemView实例
     * @see http://jqueryui.com/dialog/
     */
    function createTheDialog (options) {
        return new Dialog(options);
    }

    return {
        createDialog: createDialog,
        createTheDialog: createTheDialog
    };

});