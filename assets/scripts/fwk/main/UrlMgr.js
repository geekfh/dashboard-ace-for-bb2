/**
 * url manager
 */
define(function() {

    var map = {
        'fwk.logout': 'api/entry/logout',
        'fwk.uuid': 'api/system/utils/uuid/(:num)',
        'fwk.context': 'api/system/auths/login-success',
        'fwk.brh.access.levels': 'api/system/options/brh-access-levels', //api/system/auths/brh-access-levels
        'fwk.notices.summary': 'api/announcement/currUser/summary' //接收者 获取当前公告概要信息
    };

    /**
     * 假设`map`配置为
     * map = {
     *   a: 'api/person/(:id)',
     *   b: 'api/role'
     * }
     *
     * 取key为a的url为  url._('a', {id:23})
     * 取key为b的url为 url._('b')
     * 取key为a但是不要参数部分 url._('a')
     *
     */
    var arg_exp = /\(:([\s\S]+?)\)/g;
    var replace_arg_exp = /\/?\(:([\s\S]+?)\)/g;

    var url = window.url || (window.url = {});

    url._ = function (key, data) {
        var strUrl = map[key];

        if(!strUrl) {
            console.error('url: 找不到key为', key, '的url配置');
            return null;
        }

        if(data) {
            return _.template(strUrl, data, {
                interpolate : arg_exp
            });
        }else {
            return strUrl.replace(replace_arg_exp, '');
        }
    };

    /**
     * 切换子系统的时候更新URL缓存
     * @private
     */
    url._switch = function() {
        if(_.isObject(window.App) && !_.isEmpty(App.__module__.urlMap)) {
            _.extend(map, App.__module__.urlMap);
        }
    };

    return url;
});
