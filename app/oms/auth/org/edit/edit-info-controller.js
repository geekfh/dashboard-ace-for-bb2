define(['App'], function(App) {

    var Controller = Marionette.Controller.extend({
        editBrh: function(id, rowData) {
            $.ajax({
                url: url._('branch.edit', {id: id}),
                type: 'GET',
                success: function (resp) {
                    require(['app/oms/auth/org/edit/edit-view'], function (InfoView) {
                        var infoView = new InfoView(resp, {id: id, rowData: rowData});
                        App.show(infoView);
                    });
                }
            });
        }
    });

    return new Controller();

});