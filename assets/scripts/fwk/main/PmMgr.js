//TODO
/*
问题：如果现在要求  只有0级才能创建角色
通过限制某个按钮rsid可以达到目的，但是如果这个权限码对应多个rsId呢，怎么破？？？
 */

/**
 * whether a component accessable depends on whehter you have any one permission
 * included in the permissionCodes which mapping resourse (id)
 *
 * permissons of a component contains two part, one can find in `rs2pm`,
 * for anthor one, u should get the sub ref resourses id in `rs` map, and
 * include the permissons of the sub ones.
 */

define(function() {
    //某些UI资源的可用不完全依赖权限码，可能依赖一些业务逻辑
    var _filters = {
        //叶子机构不用显示下级机构菜单，后台做过滤才靠谱，恶心
        'menu.org': function () {
            return Ctx.getBrhLevel() < Ctx.getLeafBrhLevel();
        },
        //如果当前登录机构为叶子机构，则不能显示“POS机下发管理”菜单，同上，要让后台做过滤才靠谱
        'menu.terminals.mgr.new': function () {
            return Ctx.getBrhLevel() < Ctx.getLeafBrhLevel();
        },
        'menu.org.add': function () {
            return !Ctx.isLeafBrh() && Ctx.getBrhLevel() < 6;
        },
        'menu.param.sen': function () {
            return Ctx.getUser().get('brhCode') == '000';
        },
        'rule.add': function () {
            // 只有0级、1级才能自定义规则
            return Ctx.getBrhLevel() === 0 || Ctx.getBrhLevel() === 1;
        },
        'rolegroup.add': function () {
            // 只有0级、1级才能创建角色组
            return Ctx.getBrhLevel() === 0 || Ctx.getBrhLevel() === 1;
        },
        'user.add.expand': function () {
            // 0级、1级 不能创建拓展员类型的操作员 ​
            return Ctx.getBrhLevel() !== 0 && Ctx.getBrhLevel() !== 1;
        },
        'roles.add': function () {
            //只有0级才能创建角色
            return Ctx.getBrhLevel() === 0;
        },
        'org.add': function () {
            return Ctx.getBrhLevel() < 6;
        }
    };

    return {
        //某些特殊的权限码特殊处理
        filter: function (rsId) {
            return _filters[rsId] ? _filters[rsId]() : true; 
        },

        has: function (rsId, pmsMap) {
            return this.filter(rsId) && this._has(rsId, pmsMap);
        },

        _has: function(rsId, pmsMap) {
            // 如果rsId以"*"开头则表示该页面拥有"全部"权限
            if(/^\*\./.test(rsId)) {
                return true;
            }

            // 如果是"超级管理员"
            if (pmsMap['*']) {
                return true;
            }

            // console.log('>>>permisson has rsId', rsId, 'pmsMap', pmsMap);

            if (!rsId || !pmsMap) {
                return false;
            }

            var module_pmsMap = App.__module__.pmsMap;
            var pms = $.makeArray(module_pmsMap.rs2pm[rsId] || []);
            var refs = module_pmsMap.rs[rsId] || [];
            var i, ln;

            //TODO 如果有* 这样的超级权限，这句就出错，暂时在第一行hack一下
            if (!pms.length && !refs.length) {
                return false;
            }

            // for(i = 0, ln = pms.length; i < ln; i++) {
            //     if(pmsMap[pms[i]]) {
            //         return true;
            //     }
            // }
            //TODO rewirte it with regexp
            for (i = 0, ln = pms.length; i < ln; i++) {
                var auth = pms[i];
                var parts = auth.split(':');
                if (parts.length === 3) {
                    var bag = [
                        auth,
                        parts[0] + ':' + parts[1] + ':*',
                        parts[0] + ':*:' + parts[2],
                        parts[0] + ':*', '*'
                    ];
                    for (var j = 0, jlen = bag.length; j < jlen; j++) {
                        if (pmsMap[bag[j]]) {
                            return true;
                        }
                    }
                } else if (pmsMap[auth]) {
                    return true;
                }
            }

            //TODO dynamic add 
            for (i = 0, ln = refs.length; i < ln; i++) {
                if (this.has(refs[i], pmsMap)) {
                    return true;
                }
            }

            return false;
        }

    };
});