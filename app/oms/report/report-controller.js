define([
'App',
'app/oms/report/common-performance',
'app/oms/report/common-rank'
], function(App, PerformanceView, RankView) {
    // 机构的业绩报表/排行多出来的列
    var orgExtraList = [
        {key: 'addedOprCount', label: '新增拓展员数', _width: 130, insertAfter: 'addedMchtAmt'},
        {key: 'totalOprCount', label: '拓展员总数', _width: 120, insertAfter: 'addedMchtAmt'}
    ];

    var Controller = Marionette.Controller.extend({

        rankReport: function(type) {
            var viewParams = {type: type};
            type === 'org' && $.extend(viewParams, {extraList: orgExtraList});
            App.show(new RankView(viewParams));
        },

        performanceReport: function(type) {
            var viewParams = {type: type};
            type === 'org' && $.extend(viewParams, {extraList: orgExtraList});
            App.show(new PerformanceView(viewParams));
        }
    });

    var ctrl = new Controller();

    App.on('branches:rank:report', function() {
        ctrl.rankReport('org');
    });

    App.on('branches:perform:report', function() {
        ctrl.performanceReport('org');
    });

    App.on('staff:rank:report', function() {
        ctrl.rankReport('explore');
    });

    App.on('staff:perform:report', function() {
        ctrl.performanceReport('explore');
    });


    return Controller;


});