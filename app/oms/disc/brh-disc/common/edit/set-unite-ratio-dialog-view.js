/**
 * 编辑机构费率模型 设定统一分润
 *
 * 在 set-unite-ratio-view 基础上包装一个窗口
 */
define([
    'app/oms/disc/brh-disc/common/edit/set-unite-ratio-view'
], function(BaseView) {


    var SetUniteRatioDialogView = BaseView.extend({

        // @config
        modelId: '',

        initialize: function () {
            BaseView.prototype.initialize.apply(this, arguments);
        },

        render: function () {
            var ret = BaseView.prototype.render.apply(this, arguments);


            //@deprecated
            //新增的时候默认没有值，这里添加两个模板
            //PS:如果这个view也用作编辑就要注意了
            //this.addDefaultFirstItem();
            //this.addDefaultLastItem();

            //新增的时候默认插入一条 上下限是 0 - DEFAULT_MAX_TRADE 的条目

            this.addDefaultItem();


            return ret;
        },

        onRender: function () {
            var me = this;
            
            this.$dialog = Opf.Factory.createDialog(this.$el, {
                //TODO 关闭后要销毁
                dialogClass: '',
                destroyOnClose: true,
                title: '统一设置分润',
                autoOpen: true,
                width: 600,
                height: 550,
                modal: true,
                buttons: [
                    {type: 'submit',text: '保存',click: _.bind(this._onDialogSave, this)},
                    {type: 'cancel'}
                ]
            });

            //dialog 关闭则销毁
            this.$dialog.on('dialogclose', function () {
                me.destroy();
            });
        },

        _onDialogSave: function () {
            var me = this;
            if (me.validate()) {
                Opf.UI.ajaxLoading(this.$el);
                Opf.ajax({
                    url: url._('disc.unite.ratio'),
                    type: 'POST',
                    jsonData: {
                        modelId: me.getOption('modelId'),
                        profitSetting: me.getPostValues()
                    },
                    success: function() {
                        me.trigger('save:success');
                    },
                    complete: function() {
                        me.$dialog.dialog('close');
                    }
                });
            }
        }
    });

    return SetUniteRatioDialogView;
});