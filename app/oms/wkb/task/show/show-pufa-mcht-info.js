define(['tpl!app/oms/wkb/task/perform/templates/mcht-info-pufa.tpl',
        'app/oms/wkb/task/show/show-mcht-info-view'
    ], function(mchtInfoTpl, InfoView) {

    var View = InfoView.extend({

        render: function() {
            var strTpl = mchtInfoTpl({
                data: this.data
            });
            this.$el.append(strTpl);
        }

    });

    return View;
});