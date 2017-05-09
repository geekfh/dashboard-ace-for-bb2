/**
 * Created by wupeiying on 2015/7/3.
 */
define([
    'tpl!app/oms/operate/blacklist/add/add-blacklist-view.tpl'
], function(tpl) {

    var View = Marionette.ItemView.extend({
        className: 'add-model-panel model-panel',

        template: tpl,

        ui: {
        },

        events:{
            'click .ui-pg-div .icon-plus-sign': 'onAddHandle'
        },

        initialize: function() {
            this.onRender();
        },

        //@abstract
        formTemplate: null,

        //@abstract
        FieldsetGroupView: null,

        //@abstract
        ajaxOptions: {

        },

        //@abstract
        getFormValues: function() {

        },

        //@abstract
        onBeforeSubmit: function() {
            return true;
        },

        //@abstract
        validateForm: function () {
            return true;
        },

        //@abstract
        validationConditionPanel: function () {
            return true;
        },

        onSubmit: function() {
            var me = this;
            Opf.confirm('确认提交？', function (confirm) {
                if (!confirm) {
                    return;
                }

                var bl = $('.add-blacklist-view').children();
                var blData = '';//放遍历所要添加的数据
                var blJson = '';//放抛到后台参数
                if(bl.length > 0){
                    _.each(bl, function(item, i){
                        blData += '{"type": "'+ bl.eq(i).find('select[name="type"]').val() +'", "value": "'+ bl.eq(i).find('input[name="value"]').val()  +'", "remark": "'+ bl.eq(i).find('input[name="remark"]').val() +'"},';
                    });
                }
                blData = blData.substring(0, blData.length - 1);
                blJson = $.parseJSON('{"blackList":['  +blData + ']}');

                Opf.ajax({
                    type: 'POST',
                    url: url._('operate.blacklist.add'),
                    jsonData: blJson,
                    success: function() {
                        Opf.Toast.success('提交成功');
                        me.trigger('add:submit');
                    }
                });

                //$.ajax({
                //    type: 'GET',
                //    dataType: 'json',
                //    contentType: 'application/json',
                //    url: url._('operate.blacklist.add') + '?data='+ blJson,
                //    success: function(){
                //        Opf.Toast.success('提交成功');
                //        me.trigger('add:submit');
                //    }
                //});

            });

        },

        //@abstract 编辑类 需要覆盖
        serializeFormData: function () {
            return {
                data: {}
            };
        },

        onAddHandle: function(){
            var html = addViewHandle();
            $('.add-blacklist-view').append(html);
        },
        onRender: function() {
            var me = this;

            Opf.Factory.createDialog(this.$el, {
                dialogClass: 'blacklist-dialog',
                destroyOnClose: true,
                width: 900,
                height: 400,
                modal: true,
                title: '批量新增黑名单',
                buttons: [{
                    type: 'submit',
                    click: function() {
                        me.onSubmit();
                    }
                }, {
                    type: 'cancel',
                    click: function(){
                        me.destroy();
                    }
                }]
            });
            $('.icon-ok').css('margin-right','35px');
            $('.ui-button-text-icon-primary .icon-remove').css('margin-right','35px');
        }
    });

    function addViewHandle(){
        var addHtml = [
            '<div class="form-group">',
                '<label class="col-md-1 control-label ">要素类型</label>',
            '<div class="col-md-2">',
                '<select class="form-control" name="type">',
                    '<option value="lienceNo">营业执照号码</option>',
                    '<option value="idNo">身份证号码</option>',
                    '<option value="phoneNo">手机号码</option>',
                    '<option value="orgCodce">组织机构证号</option>',
                    '<option value="bankCardNo">收款银行号卡号</option>',
                '</select>',
            '</div>',
            '<label class="col-md-1 control-label" style="width:10%">要素内容</label>',
            '<div class="col-md-2">',
            '<input class="form-control" type="text" name="value">',
            '</div>',
            '<label class="col-md-2 control-label" style="width:14%">备注</label>',
            '<div class="col-md-3">',
            '<input class="form-control" type="text" name="remark">',
            '</div>',
            '<div class="ui-pg-div">',
            '<span class="ui-icon icon-plus-sign blue" style="margin: 5px 0 0 0px;"></span>',
            '<span class="ui-icon icon-minus-sign red" style="margin: 5px 0 0 5px;" onclick="$(this).parent().parent().remove();"></span>', //需求催得劲，移除写成当前判断
            '</div>',
            '</div>'].join('');

        return addHtml;
    }

    return View;

});