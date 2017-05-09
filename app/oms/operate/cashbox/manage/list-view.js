/**
 * @author hefeng
 * @date 2015/12/11
 * @description 钱盒配置 - 钱盒后台管理
 */
define(['App',
    'tpl!app/oms/operate/cashbox/manage/templates/page.tpl',
    'jquery.jqGrid'
],function(App, tpl){

    var View = Marionette.ItemView.extend({
        tabId: 'menu.cashbox.manage',
        template: tpl,
        ui: {
            tabsBtn: '.tab-btns>a'
        },
        events: {
            'click .tab-btns>a': 'doTab',
            'click button[data-system]': 'refreshConfig'
        },
        doTab: function(e){
            var me = this, self = $(e.target), $el = me.$el;
            $('.tab-btns>a', $el).removeClass('btn-primary');
            self.addClass('btn-primary');
        },
        refreshConfig: function(e){
            var self = $(e.target), me = this, ui = me.ui;
            var systemName = self.attr('data-system');
            var busType = ui.tabsBtn.filter('a.btn-primary').attr('data-type');
            var ajaxOptions = {
                type: 'POST',
                url: url._('operate.cashboxmanage.refresh'),
                jsonData: { sysName:systemName, busType:busType },
                beforeSend: function(){
                    Opf.UI.setLoading($("#page-content"), true);
                },
                success: function(resp){
                    if(resp.success == true){
                        Opf.Toast.success('刷新配置成功');
                    } else {
                        Opf.alert('刷新配置失败！');
                    }
                },
                complete: function(){
                    Opf.UI.setLoading($("#page-content"), false);
                }
            };
            Opf.ajax(ajaxOptions);
        },
        onRender: function () {

        }
    });

    App.on('operate:cashbox:manage', function(){
        App.show(new View());
    });

    return View;
});
