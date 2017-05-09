define([
], function() {

    var Ctrl = {
        editMcht: function (id) {
            var me = this;
            var view;

            require(['app/oms/mcht/edit/edit-view'], function(View) {

                //获取录入时的信息
                Opf.ajax({
                    type: 'GET',
                    // url: 'assets/data/merchants/get/1.js',
                    url: url._('merchant', {
                        id: id
                    }),
                    success: function(data) {
                        console.log(data);
                        view = me.view = new View(data, id);

                        App.show(view);
                    }
                });
            });
        }
    };
    return Ctrl;
});