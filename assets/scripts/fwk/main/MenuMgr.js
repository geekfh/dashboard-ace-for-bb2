/**
 * 菜单加载器
 */
define(function() {
    //context.js 中上下加载完后会调用这个方法
    function extendSensitiveSubItems (brhAccessLevelOptions) {
        console.log('>>>extendSensitiveSubItems');

        brhAccessLevelOptions = $.makeArray(brhAccessLevelOptions);

        // 获取菜单配置项
        var interval = setInterval(function() {
            if(_.isObject(window.App) && !_.isEmpty(App.__module__.menuItems)) {
                clearInterval(interval);

                var items = App.__module__.menuItems;
                var menuLang = App.__module__.menuLang;
                var objItem = _.findWhere(items, {rsId: 'menu.param'});
                var senItem = objItem? _.findWhere(objItem.items, {rsId: 'menu.param.sen'}):{};

                if(!_.isEmpty(senItem)) {
                    var senItemConf = senItem.itemsConf;

                    senItem.items = _.map(brhAccessLevelOptions, function (obj, index) {
                        obj.tabid = 'menu.param.sen.tab' + index;

                        menuLang[obj.tabid] = '敏感配置-' + obj.name;

                        return {
                            rsId: senItemConf.rsId,
                            name: obj.name,
                            deps: senItemConf.deps,
                            trigger: senItemConf.trigger,
                            data: obj
                        };
                    });
                }
            }
        }, 0);
    }

    return {
        // 获取菜单
        getItems: function() {
            return App.__module__.menuItems;
        },

        // 动态菜单配置
        extendSensitiveSubItems: extendSensitiveSubItems
    };

});