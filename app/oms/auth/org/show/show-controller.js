define(['App'], function(App) {

    var Controller = Marionette.Controller.extend({

        viewBrh: function(id, rowData) {

            require(['app/oms/auth/org/show/show-brh-info-view'], function(ShowBrhInfoView){

                console.info('new view showBrh');
                // Opf.UI.setLoading($('#page-body'));
                App.maskCurTab();
                Opf.ajax({
                    type: 'GET',
                    url: url._('branch.show', {id: id}),
                    success: function (data){
                        var view = new ShowBrhInfoView({
                          data: data,
                          rowData: rowData
                        }).render();

                        Opf.Factory.createTheDialog({
                            title: '机构资料',
                            cls: 'brh-detail-dialog',
                            zindex: 6000,
                            maxWidth: 1200,
                            paddingLayer: true,
                            paddingLayerCls: 'brh-detail-view-pad-layer',
                            modal: true,
                            autoshow: true,
                            contentEl: view.$el
                        });

                        // Opf.UI.setLoading($('#page-body'), false);
                    },
                    complete: function () {
                        App.unMaskCurTab();
                    }
                });

            });
        }
    });

    return new Controller();

});