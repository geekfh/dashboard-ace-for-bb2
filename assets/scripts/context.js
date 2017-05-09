/**
 * Context Module
 */
define([
    'assets/scripts/fwk/main/MenuMgr',
    'assets/scripts/fwk/main/PmMgr',
    'assets/scripts/fwk/main/UrlMgr',
    'assets/scripts/entities/user',
    'i18n!assets/scripts/fwk/nls/base',
    'jstorage', 'jquery.msgValidate'
],

function(menuConfiger, Permission, urlMgr, Users, baseLang) {

    BaseLang = baseLang;

    var UUID_POOL_INIT_SIZE = 10;

    var _permissionMap = null;//当前用户拥有的权限表<code, bool>
    //var _rawUser = null;//字面量对象，存放当前用户信息
    var _user = null;//当前用户模型
    var _id = null;//一个上下文随机id，后台传过来
    var _brhAccessLevels = null;//参数配置定义了一些机构访问级别，针对这些级别可以进行列显示配置
    var _uuidPool = [];
    var _defaultRoleGroupMap = {};
    var _leafBrhLevel;
    var _gid = $.jStorage.get('login.gid') || 1;

    var _map = {
        STR_DEFAULT_MAX_TRADE: '999999999999.99',
        SUPPORT_BRH_LEVEL_LIMIT: 6,
        SPECIFIC_OPERATORS: [
            {name:'拓展员', roleGroupId: 4},
            {name:'录入员', roleGroupId: 5},
            {name:'机构管理员（管理）', roleGroupId: 3},
            {name:'机构管理员（管理&业务）', roleGroupId: 2},
            {name:'统计员', roleGroupId: 6}
        ]
    };

    var _loginHtmlMap = {
        '1': 'login.html',
        '2': 'veipay-login.html',
        '3': 'dotpay-login.html',
        '4': 'mms-login.html'
    };

    /**
     * 机构审核时，可定义的等级
     * [{"type":1,"brhLevel":1,"name":"合作机构"},
     * {"type":2,"brhLevel":2,"name":"一级代理"},
     * {"type":3,"brhLevel":3,"name":"分销商"},
     * {"type":3,"brhLevel":4,"name":"分销商"}]
     *
     * 改造成:
     *
     * [{"type":1,"brhLevels":[1],"name":"合作机构"},
     * {"type":2,"brhLevels":[2],"name":"一级代理"},
     * {"type":3,"brhLevels":[3, 4],"name":"分销商"}]
     *
     */
    function convertBrhAccessLevels (data) {
        var ret = [], retItem;
        _.each(data, function (item) {
            retItem = _.findWhere(ret, {type: item.type});
            if(!retItem) {
                retItem = _.clone(item);
                retItem.brhLevels = [retItem.brhLevel];
                delete retItem.brhLevel;
                ret.push(retItem);
            }else {
                retItem.brhLevels.push(item.brhLevel);
            }
        });
        return ret;
    }


    /**
     * @private
     * @param  {Object} data
     * @example
     * {auths: [xx], user: {x:y,..}}
     */
    function initCtxInfo (data) {
        _user = data.user||{};
        _user["__system"] = data.system||[{serviceName:"oms", remark:"运营管理系统"}];
        _user = new Users.Model(_user);
        _leafBrhLevel = parseInt(data.leafBrhLevel, 10);
        //_rawUser = data.user;

        //缓存当前用户的权限编码
        _permissionMap = convert2PermissionMap(data);
        _defaultRoleGroupMap = convert2DefaultRoleGroupMap(_user.get("defaultRoleGroup"));

        if (data.gid) {
            _gid = data.gid;
            $.jStorage.set('login.gid', _gid);
        }

        //TODO 暂时放这里
        //$('span.user-info').html('<small>' + BaseLang._('u.r.welcome') + ',</small>' + _rawUser.name);
    }


    //目前没有用于真的token功能，只是用在商户录入的多个请求之间标识这是同一个用户的请求
    function getIdDefer () {
        var deferr =  Opf.ajax({
            url: url._('fwk.uuid', {num: UUID_POOL_INIT_SIZE+1}),
            dataType: 'json'
        });

        return deferr;
    }

    function loadBrhAccessLevels () {
        var deferr =  Opf.ajax({
            url: url._('fwk.brh.access.levels')
        });

        return deferr;
    }

    //加载上下文信息，包括：当前用户权限码列表、用户信息
    function loadContextInfo() {
        var deferr =  Opf.ajax({
            url: url._('fwk.context')
        });

        return deferr;
    }

    function convert2PermissionMap (data) {
        var ret = {}, code,
            authObj = data.auths;

        //为了兼容运管本地开发
        if(_.isArray(authObj)) {
            _.each(authObj, function(item){
                code = $.trim(item.code);
                code && (ret[code] = true);
            });
        }

        //统一平台多系统模式
        else {
            _.each(authObj, function (auths, k) {
                //var auth = ret[k] = {};
                _.each(auths, function(item){
                    code = $.trim(item.code);
                    code && (ret[code] = true);
                });
            });
        }

        return ret;
    }

    /**
     * convert2DefaultRoleGroupMap description
     * @private
     * @param  {[type]} roleGroupData [description]
     * @return {[type]}
     * {
     *     sysbsmgr: '对应角色组id',
     *     ...
     * }
     */
    function convert2DefaultRoleGroupMap (roleGroupData) {
        /**
         后台获取到的数据
         defaultRoleGroup:{
             1：'xx'，//机构管理角色组（管理+业务）
             2：‘xx’，//机构管理角色组（仅用于管理）
             3：'xx'，//拓展员角色组
             4：'xx'，//录入员角色组
             5：'x'，//统计查询角色组
         }
        */
        var codeToName = {
            1: 'sysbsmgr',
            2: 'sysmgr',
            3: 'expand',
            4: 'keyboard',
            5: 'statist'
        };
        var map = {};

        _.each(roleGroupData, function (value, key) {
            map[codeToName[key]] = value;
        });

        return map;
    }

    return {
        /**
         * @memberof Ctx
         * @example
         * // return
         * {
         *  'sysbsmgr': '默认 机构管理&业务 角色组id'
         *  'sysmgr': '默认 机构管理 角色组id'
         *  'expand': '默认 拓展员 角色组id'
         *  'keyboard': '默认 录入员 角色组id'
         *  'statist': '默认 统计员 角色组id'
         * }
         * @returns {Object} 返回默认角色组
         */
        getDefaultRoleGroupMap: function () {
            return _defaultRoleGroupMap;
        },

        /**
         * 获取机构等级
         * @memberof Ctx
         * @returns {String} "0~5"
         */
        getBrhAccessLevels: function () {
            return _brhAccessLevels;
        },

        /**
         * 是否叶子机构
         * @memberof Ctx
         * @returns {Boolean} true/false
         */
        isLeafBrh: function () {
            return this.getBrhLevel() == _leafBrhLevel;
        },

        /**
         * 获取叶子机构等级
         * @memberof Ctx
         * @returns {String} "0~5"
         */
        getLeafBrhLevel: function () {
            return _leafBrhLevel;
        },

        /** @private */
        get: function (key) {
            return _.clone(_map[key]);
        },

        /**
         * 是否0级机构
         * @memberof Ctx
         * @returns {boolean} true/false
         */
        isTopBrh: function () {
            return Ctx.getUser().get('brhLevel')=='0';
        },

        /**
         * 获取当前登录用户模型
         * @memberof Ctx
         * @returns {Model} Backbone.Model
         */
        getUser: function () {
            return _user;
        },

        /**
         * 获取当前用户机构等级
         * @memberof Ctx
         * @returns {String} "0~5"
         */
        getBrhLevel: function () {
            return Ctx.getUser().get('brhLevel');
        },

        /**
         * 获取brhCode
         * @memberof Ctx
         * @returns {String} "user's brhCode"
         */
        getBrhCode: function () {
            return Ctx.getUser().get('brhCode');
        },

        /**
         * @private
         * @returns {String}
         */
        getId: function () {
            return _id;
        },

        /**
         * @private
         * @returns {String}
         */
        getGid: function () {
            return _gid;
        },

        /**
         * @private
         * @returns {String} 返回系统标识码
         */
        getSubModuleList: function () {
            return Ctx.getUser().get('__system');
        },

        /**
         * @private
         * @returns {String}
         */
        getLoginHtml: function () {
            return _loginHtmlMap[Ctx.getGid()] || 'login.html';
        },

        /**
         * 同步获取UUID
         * @memberof Ctx
         * @returns {String} uuid
         */
        getUUID: function () {
            var ret;

            if(_uuidPool.length > 0) {
                ret = _uuidPool.shift();
            }

            if(_uuidPool.length === 0) {
                Opf.ajax({
                    async: false,
                    url: url._('fwk.uuid', {num: UUID_POOL_INIT_SIZE+1}),
                    dataType: 'json',
                    success: function (resp) {
                        _uuidPool = resp;
                    }
                });
            }

            return ret;
        },

        /**
         * private
         * @returns {Deferred} 返回jQuery.Deferred对象
         */
        load: function(callback) {
            var me = this;

            var ctxDeferral = loadContextInfo(),
                idDeferral = getIdDefer(),
                brhAccessLevelsDeferr = loadBrhAccessLevels();

            ctxDeferral.done(_.bind(initCtxInfo, me));

            brhAccessLevelsDeferr.done(function(data) {
                _brhAccessLevels = convertBrhAccessLevels(data);
                menuConfiger.extendSensitiveSubItems(_brhAccessLevels);
            });

            idDeferral.done(function (resp) {
                _id = resp.shift();
                _uuidPool = resp;
            });

            //ps: done用了一次之后，后面的done在回调里面就获取不到数据
            return $.when(ctxDeferral, idDeferral, brhAccessLevelsDeferr).done(function() {
                callback && callback.apply(null, arguments);
            });
        },

        /**
         * 校验权限码
         * 根据后端返回的权限码标识判断是否有页面权限
         * @memberof Ctx
         * @param {String} rsId - 权限码
         * @example
         * if(Ctx.avail("pm.demo.c")) { ... }
         * @returns {Boolean} true/false
         */
        avail: function (rsId) {
            return Permission.has(rsId, _permissionMap);
        }
    }
});