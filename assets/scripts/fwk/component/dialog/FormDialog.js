define([
    'assets/scripts/fwk/component/Dialog'
], function(Dialog) {

    var FormDialog = Dialog.extend({

        //@config 点击默认的提交按钮会调用该方法
        onSubmit: function () {

        },

        //@config 点击取消后会调用该方法
        onCancel: function () {

        },

        button: [{
            text: '提交',
            iconCls: 'icon-ok',
            click: '_privateOnSubmit',
            btnCls: 'btn-primary'
        },{
            text: '取消',
            iconCls: 'icon-remove',
            click: '_privateOnCancel'
        }],

        _privateOnSubmit: function () {
            console.log('>>>_privateOnSubmit',this);
        },

        _privateOnCancel: function () {
            console.log('>>>_privateOnCancel',this);
        }
        
    });
    
    return FormDialog;
});