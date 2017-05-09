/**
 * url manager
 */
define(function() {

    var CONF = {
        ui: {
            _: function(key, confMap) {
                var uiMap = confMap.ui||{};
                if (uiMap[key] === void 0) {
                    console.error('config: 找不到key为', key, '的配置');
                }
                return uiMap[key];
            }
        }
    };

    return {
        /**
         * 获取模型配置
         */
        _: function(name, key) {
            var confMap = App.__module__.confMap;
            if (_.isEmpty(confMap) || CONF[name] === void 0) {
                console.error("请检查module-config的配置信息是否正确！");
                return null;
            }
            return CONF[name]._(key, confMap);
        }
    };
});
