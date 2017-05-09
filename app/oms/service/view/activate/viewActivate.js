define([
    'app/oms/service/edit/activate/editActivateView'
], function(EditView) {

    var View = EditView.extend({
        tabId: 'menu.service.model.view.activate',
        events: {
            'click .btn-submit':  'onBack',
            'click .back-list' : 'onBack'
        },
        onRender: function () {
            EditView.prototype.onRender.apply(this, arguments);
            this.changeValueToLabel();
            this.$el.find('.btn-submit').text('返 回');
            this.$el.find('.mcht-qualified').find('.left-menu').empty();
        },
        onBack: function () {
            App.trigger('service:list:page', this.page);
        },
        changeValueToLabel: function () {
            var me = this;
            var $el = me.$el;

            $el.find('select').each(function () {
                $(this).before('<label>' + $(this).find('option:selected').text() + '</label>').remove();
            });

            $el.find('input').not('[name="q"]').each(function () {
                $(this).before('<label>' + $(this).val() + '</label>').remove();
                
            });

        },
        getBranchColumns: function () {
            return [
                    {name: 'branchName',    label: '代理商名称',   cell: 'string',  editable: false},
                    {name: 'branchRemark',  label: '备注',         cell: 'string',  editable: false},
                    {name: 'qualifiedNum',  label: '达标商户数',   cell: 'integer', editable: false},
                    {name: 'inviteNum',     label: '邀请名额',     cell: 'integer', editable: false}
                ];
        },
        setDatepicker: function () {
            // 置为空函数
        },
        updateStatus: function () {
            // 置为空函数
        },
        renderUpload: function () {
            // 置为空函数
        }

    });

    return View;

});