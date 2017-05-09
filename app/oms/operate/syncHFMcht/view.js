define([
    'App',
    'assets/scripts/fwk/component/uploader'
],function(App, uploader){
    var tpl = [
        '<button type="button" class="btn btn-primary">同步弘付商户</button>'
    ].join("");

    var HFView = Marionette.ItemView.extend({
        tabId: 'menu.operate.sync.hfmcht',

        template: _.template(tpl),

        ui: {
            syncBtn: ":button"
        },

        events: {
            "click @ui.syncBtn": "doImport"
        },

        onRender: function () {},

        doImport: function() {
            uploader.doImport({
                uploadTitle: "同步HF商户",
                uploadResultTitle: "同步HF商户结果",
                uploadUrl: url._('operate.sync.hfmcht.import'),
                uploadTpl: url._('operate.sync.hfmcht.download')
                /*uploadParams: [
                    {label:'所属通道', type:'select', name:'channelNo', url:url._('operate.cmcht.channels')}
                ],
                cbSuccess: function(queueId){
                    grid.trigger("reloadGrid", [{current:true}]);
                }*/
            });
        }
    });

    App.on('operate:sync:hfmcht', function () {
        App.show(new HFView);
    });

    return HFView;
});