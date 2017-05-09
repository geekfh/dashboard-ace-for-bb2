/**
 * 直联商户费率模型
 */

define([
    'app/oms/disc/mcht-disc/common-list-view',
    'i18n!app/oms/common/nls/param'
    ], function(ListView,paramLang){
        var View = ListView.extend({
            tabId: 'menu.disc.mcht.indirect',
            options:{
                rsId: 'disc.mcht.indirect',
                caption: paramLang._('disc.mcht.txt'),
                title: '间联商户费率模型',
                gid: 'discs-mcht-indirect-grid',
                url: url._('disc.indirect.mcht'),
                type: 'H'
                
            }
        });

        App.on("discs:indirect:list", function(){
            App.show(new View());
        });
        return View;
});