/**
 * 新增外卡商户
 */
define(['App',
    'tpl!app/oms/mcht/wildcard/add/templates/add-mcht.tpl',
    'app/oms/mcht/add/add-view'
], function(App, tpl, AddMchtView) {

    // 计数
    var _count = 0;

    function countSubViewClass () {
        _count++;
        var resultSubViewClass = {
            'info': {path: 'app/oms/mcht/wildcard/add/sub/info-view', renderTo: '#add-wildcard-mcht-info'},
           'info2': {path: 'app/oms/mcht/wildcard/add/sub/info2-view', renderTo: '#add-wildcard-mcht-info2'},
             'pic': {path: 'app/oms/mcht/wildcard/add/sub/pic-view', renderTo: '#add-wildcard-mcht-pic'},
           'extra': {path: 'app/oms/mcht/wildcard/add/sub/extra-view', renderTo: '#add-wildcard-mcht-extra'},
         'confirm': {path: 'app/oms/mcht/wildcard/add/sub/confirm-view', renderTo: '#add-wildcard-mcht-confirm' }
        };

        _.each(resultSubViewClass, function (viewClass) {
            viewClass.renderTo += _count;
        });

        return resultSubViewClass;
    }

    App.module('MchtSysApp.Add.View', function(View, App, Backbone, Marionette, $, _) {
        View.WildCardMcht = AddMchtView.PersonalMcht.extend({
            tabId: 'menu.mcht.addWildCard',
            template: tpl,

            initialize: function () {
                this.subViewClass = countSubViewClass();
            },

            serializeData: function () {
                return {
                    count: _count
                };
            },

            onSave: function() {
                var me = this;
                var obj = me._obj;
                if(me.curName !== 'confirm'){
                    var subValues = me.subViews[me.curName].getValues();
                    me.applyValuesFromSubView(me.curName, subValues);
                }
                for(var p in obj) {
                    if(p.indexOf('_') === 0) {
                        delete obj[p];
                    }
                }

                //传到后台的数据obj
                //传递外卡商户清算信息给后台容错
                obj.isInterMcht = 1;
                //obj.tNDiscId = null;

                var $saveBtn = me.$el.find('.btn-save');
                    $saveBtn.text('正在保存').addClass('disabled');

                App.maskCurTab();
                Opf.ajax({
                    type: 'POST',
                    url: url._('merchant.save'),
                    data: JSON.stringify(obj),
                    success: function (resp) {
                        Opf.Toast.success('提交成功');
                        App.trigger('mcht:add:wildCard');
                    },
                    error: function () {
                        Opf.alert('保存失败！');
                    },
                    complete: function () {
                        $saveBtn.text('保存').removeClass('disabled');
                        App.unMaskCurTab();
                    }
                });
            },

            onSubmit: function (e) {

                var me = this;
                var submitBtns = me.$el.find('.btn-submit');

                var mchtValues = $.extend({}, this._obj);
                    mchtValues.uuid = Ctx.getId();

                for(var p in mchtValues) {
                    if(p.indexOf('_') === 0) {
                        delete mchtValues[p];
                    }
                }

                //传递商户清算信息给后台容错
                mchtValues.isInterMcht = 1; //加上外卡商户特有标识
                //mchtValues.tNDiscId = null; //外卡费率

                submitBtns.text('正在提交...').addClass('disabled');
                App.maskCurTab();

                $.ajax({
                    url: url._('merchant.wildcard'),
                    method: 'POST',
                    //TODO 外面覆盖
                    contentType: 'application/json',
                    data: JSON.stringify(mchtValues),
                    success: function (resp) {
                        if(resp.success !== false) {

                            Opf.Toast.success('提交成功');

                            //key 为是否弹出提示框的标识 0:不弹提示框 1:弹出提示框
                            if(resp.value == '1'){
                                Opf.alert(resp.name);
                            }

                            App.trigger('mcht:add:wildCard');
                        }
                    },
                    error: function () {
                        Opf.alert('录入失败');
                    },
                    complete: function () {
                        submitBtns.text('确认提交').removeClass('disabled');
                        App.unMaskCurTab();
                    }
                });


            }
        });
    });

    return App.MchtSysApp.Add.View;
});
