/**
 * 直联商户费率模型
 */

define([
    'app/oms/disc/mcht-disc/common-list-view',
    'i18n!app/oms/common/nls/param'
    ], function(ListView,paramLang){
        var View = ListView.extend({
            tabId: 'menu.disc.mcht.direct',
            options:{
                rsId: 'disc.mcht.direct',
                caption: paramLang._('disc.mcht.txt'),
                title: '直联商户费率模型',
                gid: 'discs-mcht-direct-grid',
                url: url._('disc.direct.mcht'),
                type: 'P'
                
            }
        });

        App.on("discs:direct:list", function(){
            App.show(new View());
        });
        return View;
});