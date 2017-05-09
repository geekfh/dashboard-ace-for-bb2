/**
 * module menus
 */
define(['i18n!app/oms/common/nls/menu'], function(menusLang) {

    //我的下级机构
    var ORG_MENU = {
        rsId: 'menu.org',
        iconCls: 'icon-sitemap',
        name: '下级机构',
        items: [
            // 机构列表
            {
                rsId: 'menu.auth.org',
                name: menusLang._('menu.auth.org'),
                deps: ['app/oms/auth/org/list/list-controller'],
                trigger: 'branches:list'
            },

            // 新增机构
            {
                rsId: 'menu.org.add',
                name: menusLang._('menu.org.add'),
                deps: ['app/oms/auth/org/list/list-controller'],
                trigger: 'branch:add'
            },

            // 机构业绩排行
            {
                rsId: 'menu.org.rank',
                name: menusLang._('menu.org.rank'),
                deps: ['app/oms/report/report-controller'],
                trigger: 'branches:rank:report'
            },

            // 机构业绩报表
            {
                rsId: 'menu.org.perform',
                name: menusLang._('menu.org.perform'),
                deps: ['app/oms/report/report-controller'],
                trigger: 'branches:perform:report'
            }
        ]

    };

    //我的员工
    var STAFF_MENU = {
        rsId: 'menu.staff',
        iconCls: 'icon-group',
        name: '我的员工',
        items: [
            // 员工管理
            {
                rsId: 'menu.auth.opr',
                name: menusLang._('menu.auth.opr'),
                deps: ['app/oms/auth/user/list/list-controller'],
                trigger: 'user:list'
            },

            // 新增员工
            {
                rsId: 'menu.staff.add',
                name: menusLang._('menu.staff.add'),
                deps: ['app/oms/auth/user/list/list-controller'],
                trigger: 'user:add'
            },

            // 拓展员业绩排行
            {
                rsId: 'menu.staff.rank',
                name: menusLang._('menu.staff.rank'),
                deps: ['app/oms/report/report-controller'],
                trigger: 'staff:rank:report'
            },

            // 拓展员业绩报表
            {
                rsId: 'menu.staff.perform',
                name: menusLang._('menu.staff.perform'),
                deps: ['app/oms/report/report-controller'],
                trigger: 'staff:perform:report'
            },

            // 角色
            {
                rsId: 'menu.auth.role',
                name: menusLang._('menu.auth.role'),
                deps: ['app/oms/auth/role/list/list-controller'],
                trigger: 'roles:list'
            },

            // 角色
            {
                rsId: 'menu.auth.rolegroup',
                name: menusLang._('menu.auth.rolegroup'),
                deps: ['app/oms/auth/role-group/list/list-controller'],
                trigger: 'role-groups:list'
            },

            // 管辖范围
            {
                rsId: 'menu.auth.rule',
                name: menusLang._('menu.auth.rule'),
                deps: ['app/oms/auth/rule/list/list-controller'],
                trigger: 'rules:list'
            }
        ]
    };

    //工作台
    var WKB_MENU = {
        rsId: 'menu.wkb',
        name: menusLang._('wkb.txt'),
        iconCls: 'icon-tasks',
        items: [
            // 任务
            {
                rsId: 'menu.wkb.task',
                name: menusLang._('menu.wkb.task'),
                deps: ['app/oms/wkb/wkb-sys-app'],
                trigger: 'tasks:list'
            },

            // 商审审核
            {
                rsId: 'menu.wkb.task.mcht',
                name: menusLang._('menu.wkb.task.mcht'),//单独给商审开的
                deps: ['app/oms/wkb/wkb-sys-app'],
                trigger: 'tasks:mcht:list'
            },

            // 任务管理
            {
                rsId: 'menu.wkb.taskList',
                name: menusLang._('menu.wkb.taskList'),
                deps: ['app/oms/wkb/wkb-sys-app'],
                trigger: 'tasksList:show'
            }
        ]
    };

    //计费模型
    var DISC_MENU = {
        rsId: 'menu.disc',
        name: menusLang._('disc'),
        iconCls: 'icon-bar-chart',
        items: [
            // 机构计费模型
            {
                rsId: 'menu.disc.brh',
                name: menusLang._('disc.brh'),
                items: [
                    // 间联MCC计费模型
                    /*{
                        rsId: 'menu.disc.brh.indirectMcc', //间联MCC
                        name: menusLang._('menu.disc.brh.indirectMcc'),
                        deps: ['app/oms/disc/brh-disc/brh-disc-mgr'],
                        trigger: 'discs:indirectMcc:list'
                    },

                    // 间联统一结算扣率
                    {
                        rsId: 'menu.disc.brh.indirectUnionSettle', //间联统一结算扣率
                        name: menusLang._('menu.disc.brh.indirectUnionSettle'),
                        deps: ['app/oms/disc/brh-disc/brh-disc-mgr'],
                        trigger: 'discs:indirectUnionSettle:list'
                    },

                    // 无基准费率
                    {
                        rsId: 'menu.disc.brh.noBaseRatio', //无基准费率
                        name: menusLang._('menu.disc.brh.noBaseRatio'),
                        deps: ['app/oms/disc/brh-disc/brh-disc-mgr'],
                        trigger: 'discs:noBaseRatio:list'
                    },

                    // 签约扣率对应结算扣率
                    {
                        rsId: 'menu.disc.brh.baseToBorm', //签约扣率对应结算扣率
                        name: menusLang._('menu.disc.brh.baseToBorm'), //'签约扣率对应结算扣率',
                        deps: ['app/oms/disc/brh-disc/brh-disc-mgr'],
                        trigger: 'discs:baseToBorm:list'
                    },

                    // 间联月交易额结算扣率
                    {
                        rsId: 'menu.disc.brh.indirectChange', //间联月交易额结算扣率变动
                        name: menusLang._('menu.disc.brh.indirectChange'), //'间联月交易额结算扣率',
                        deps: ['app/oms/disc/brh-disc/brh-disc-mgr'],
                        trigger: 'discs:indirectChange:list'
                    },*/

                    // MCC月交易额结算扣率---------------->>>改名为：96费改机构分润模型
                    {
                        rsId: 'menu.disc.brh.indirectCanChange', //MCC月交易额结算扣率---------------->>>改名为：96费改机构分润模型
                        name: menusLang._('menu.disc.brh.indirectCanChange'), //MCC月交易额结算扣率---------------->>>改名为：96费改机构分润模型
                        deps: ['app/oms/disc/brh-disc/brh-disc-mgr'],
                        trigger: 'discs:indirectCanChange:list'
                    }

                    // 直联商户费率
                    /*{
                        rsId: 'menu.disc.brh.directMcc', //直联MCC
                        name: menusLang._('menu.disc.brh.directMcc'), //'直联商户费率',
                        deps: ['app/oms/disc/brh-disc/brh-disc-mgr'],
                        trigger: 'discs:directMcc:list'
                    },

                    // 直联商户费率可高签
                    {
                        rsId: 'menu.disc.brh.canSetMore', //直联商户费率可高签
                        name: menusLang._('menu.disc.brh.canSetMore'), //'直联商户费率可高签',
                        deps: ['app/oms/disc/brh-disc/brh-disc-mgr'],
                        trigger: 'discs:canSetMore:list'
                    },

                    // 机构分润方案
                    {
                        rsId: 'menu.disc.profit',
                        name: menusLang._('menu.disc.profit'),
                        deps: ['app/oms/disc/brh-disc/brh-profit/list-view'],
                        trigger: 'brh:profit:list'
                    }*/
                ]
            },

            // 商户计费模型
            {
                rsId: 'menu.disc.mcht',
                name: '商户计费模型',
                items: [
                    // 直联商户费率模型
                    {
                        rsId: 'menu.disc.mcht.direct',
                        name: menusLang._('menu.disc.mcht.direct'),
                        deps: ['app/oms/disc/mcht-disc/direct-list-view'],
                        trigger: 'discs:direct:list'
                    },

                    // 间联商户费率模型
                    {
                        rsId: 'menu.disc.mcht.indirect',
                        name: menusLang._('menu.disc.mcht.indirect'), //'间联商户费率模型',
                        deps: ['app/oms/disc/mcht-disc/indirect-list-view'],
                        trigger: 'discs:indirect:list'
                    }
                ]
            },

            // 服务费模型
            {
                rsId: 'menu.disc.service',
                name: menusLang._('disc.service'),
                items: [
                    // 服务计费列表
                    {
                        rsId: 'menu.disc.service.list',  //服务计费列表
                        name: menusLang._('menu.disc.service.list'),
                        deps: ['app/oms/disc/list/list-controller'],
                        trigger: 'discs:list'
                    },

                    // 服务费分润
                    {
                        rsId: 'menu.profit.service.list',  //服务费分润
                        name: menusLang._('menu.profit.service.list'),
                        deps: ['app/oms/disc/list/list-controller'],
                        trigger: 'profit:list'
                    },

                    // 单商户服务费
                    {
                        rsId: 'menu.disc.service.mcht',  //单商户服务费
                        name: menusLang._('menu.disc.service.mcht'),
                        deps: ['app/oms/disc/list/list-controller'],
                        trigger: 'discs:list:mcht'
                    }
                ]
            }
        ]
    };

    //参数设置
    var PARAM_MENU = {
        rsId: 'menu.param',
        name: menusLang._('param'),
        iconCls: 'icon-opf-param-config',
        items: [
            /*{
             rsId: 'menu.param.disc',
             name: menusLang._('disc'),
             deps: ['app/oms/param/disc/list/list-controller'],
             trigger: 'discs:list'
             },{
             rsId: 'menu.param.disc',
             name: '机构分润方案',
             deps: ['app/oms/param/disc/brh-profit/list-view'],
             trigger: 'brh:profit:list'
             },*/

            // MCC组
            {
                rsId: 'menu.param.mccgroup',
                name: menusLang._('menu.param.mccgroup'),
                deps: ['app/oms/param/mcc-group/list/list-controller'],
                trigger: 'mcc-groups:list'
            },

            // MCC
            {
                rsId: 'menu.param.mcc',
                name: menusLang._('menu.param.mcc'),
                deps: ['app/oms/param/mcc/list/list-controller'],
                trigger: 'mccs:list'
            },

            // 基本参数
            {
                rsId: 'menu.param.sysparam',
                name: menusLang._('menu.param.sysparam'),
                deps: ['app/oms/param/sys-param/list/list-controller'],
                trigger: 'sys-params:list'
            },

            // 总行
            {
                rsId: 'menu.param.banks',
                name: menusLang._('menu.param.banks'),
                deps: ['app/oms/param/banks/list/list-controller'],
                trigger: 'banks:list'
            },

            // 支行
            {
                rsId: 'menu.param.zbank',
                iconCls: 'icon-double-angle-right',
                name: menusLang._('menu.param.zbank'),
                deps: ['app/oms/param/zbank/list/list-controller'],
                trigger: 'zbanks:list'
            },

            // 任务配置
            {
                rsId: 'menu.param.task.map',
                name: menusLang._('menu.param.task.map'),
                deps: ['app/oms/param/task-map/list/list-controller'],
                trigger: 'task-map:list'
            },

            // 卡bin
            {
                rsId: 'menu.param.cardbin',
                name: menusLang._('menu.param.cardbin'),
                deps: ['app/oms/param/card-bin/list/list-view'],
                trigger: 'card-bins:list'
            },

            // 敏感信息控制
            {
                rsId: 'menu.param.sen',
                name: '敏感信息控制',
                itemsConf: {
                    rsId: 'menu.param.sen',
                    deps: ['app/oms/param/sen/list/list-controller'],
                    trigger: 'sen:fields:list'
                }
            },

            // 审核拒绝理由模板
            {
                rsId: 'menu.param.refuseConfig',
                name: menusLang._('menu.param.refuseConfig'),
                deps: ['app/oms/param/refuse-config/list/list-controller'],
                trigger: 'refuse:config:list'
            },

            // 行业进件审核标签
            {
                rsId: 'menu.param.taskTag',
                name: menusLang._('menu.param.taskTag'),
                deps: ['app/oms/param/task-tag/list-view'],
                trigger: 'task:tag:list'
            }
        ]
    };

    //商户管理
    var MCHT_MENU = {
        rsId: 'menu.mcht',
        iconCls: 'icon-opf-office',
        name: '我的商户',
        items: [
            //商户列表
            {
                rsId: 'menu.mcht.user',
                name: menusLang._('menu.mcht.user'),
                deps: ['app/oms/mcht/mcht-sys-app'],
                trigger: 'mchts:list'
            },

            //'商户管理(浦发)'
            {
                rsId: 'menu.mcht.pufa',
                name: menusLang._('menu.mcht.pufa'),
                deps: ['app/oms/mcht/mcht-sys-app'],
                trigger: 'mchts:pufa:list'
            },

            //'商户查询(客服/运营)'
            {
                rsId: 'menu.mcht.user2',
                name: menusLang._('menu.mcht.user2'),
                deps: ['app/oms/mcht/mcht-sys-app'],
                trigger: 'mchts:user2:list'
            },

            //收银员列表
            {
                rsId: 'mcht.user.list',
                name: menusLang._('mcht.user.list'),
                trigger: 'mcht:user:list',
                deps: ['app/oms/mcht/mcht-sys-app']
            },

            //新增商户
            {
                rsId: 'menu.mcht.add',
                name: menusLang._('menu.mcht.add'),
                deps: ['app/oms/mcht/mcht-sys-app'],
                trigger: 'mcht:add'
            },

            //商户信息变更
            {
                rsId: 'menu.mcht.change',
                name: menusLang._('menu.mcht.change'),
                deps: ['app/oms/mcht/mcht-sys-app'],
                trigger: 'mcht:info:change'
            },

            //商户服务列表
            {
                rsId: 'menu.mcht.service',
                name: menusLang._('menu.mcht.service'),
                deps: ['app/oms/mcht/mcht-sys-app'],
                trigger: 'mcht:service:list'
            },

            //推荐注册商户列表
            {
                rsId: 'menu.mcht.topuser',
                name: menusLang._('menu.mcht.topuser'),
                deps: ['app/oms/mcht/mcht-sys-app'],
                trigger: 'mchts:topuser:list'
            },

            //商户活跃度
            {
                rsId: 'menu.report.maintain',
                name: menusLang._('menu.report.maintain'),
                deps: ['app/oms/report/maintain/maintain-controller'],
                trigger: 'maintain:stat:list'
            }
        ]
    };

    // POS机管理
    var TERMINAL_MENU = {
        rsId: 'menu.terminals',
        className: 'menu-terminals',
        iconCls: 'icon-opf-terminals',
        name: 'POS机管理',
        items: [
            // POS机管理
            {
                rsId: 'menu.terminals.mgr',
                name: menusLang._('menu.terminals.mgr'),
                deps: ['app/oms/terminals/terminals-app'],
                trigger: 'terminals:list'
            },

            // POS机下发管理
            {
                rsId: 'menu.terminals.mgr.new',
                name: menusLang._('menu.terminals.mgr.new'),
                deps: ['app/oms/terminals/tn-mgr/terminals-mgr-controller'],
                trigger: 'show:agent:groups'
            },

            // POS机查询
            {
                rsId: 'menu.terminals.query',
                name: menusLang._('menu.terminals.query'),
                deps: ['app/oms/terminals/terminals-app'],
                trigger: 'terminalsQuery:list'
            },

            // POS机类型显示配置
            {
                rsId: 'menu.terminals.type.display',
                name: menusLang._('menu.terminals.type.display'),
                deps: ['app/oms/terminals/terminals-app'],
                trigger: 'terminalsTypeDisplay:list'
            },

            // 升级码查询
            {
                rsId: 'menu.terminals.query.code',
                name: menusLang._('menu.terminals.query.code'),
                deps: ['app/oms/terminals/terminals-app'],
                trigger: 'terminalsQueryCode:list'
            }
        ]
    };

    // 异常处理
    var EXCEPTION_MENU = {
        rsId: 'menu.exception',
        iconCls: 'icon-warning-sign',
        name: '异常处理',
        items: [
            // 异常交易
            {
                rsId: 'menu.exception.stlmerror',
                name: menusLang._('menu.exception.stlmerror'),
                deps: ['app/oms/settle/stlm-error/list/list-controller'],
                trigger: 'exception:stlmErrors:list'
            },

            //{ //原：账单调整
            // rsId: 'menu.exception.stlmrepair',
            // name: menusLang._('menu.exception.stlmrepair'),
            // deps: ['app/oms/settle/stlm-repair/list/list-controller'],
            // trigger: 'exception:stlmRepairs:list'
            // },

            // 清算失败
            {
                rsId: 'menu.exception.settleerror',
                name: menusLang._('menu.exception.settleerror'),
                deps: ['app/oms/settle/settle-error/list/list-controller'],
                trigger: 'exception:settleErrors:list'
            },

            //差错争议处理
            {
                rsId: 'menu.exception.cancelorder',
                name: menusLang._('menu.exception.cancelorder'),
                deps: ['app/oms/settle/cancel-order/list-view'],
                trigger: 'exception:cancelOrder:list'
            },

            /*{ //S0异常处理
             rsId: 'menu.exception.S0',
             name: menusLang._('menu.exception.S0'),
             deps: ['app/oms/settle/settle-S0/list/list-controller'],
             trigger: 'exception:S0:list'
             },*/

            //服务费退费管理
            {
                rsId: 'menu.service.refunds',
                name: menusLang._('menu.service.refunds'),
                deps: ['app/oms/settle/stlm-error/service/list-view'],
                trigger: 'service:refunds:list'
            }
        ]
    };

    // 查看分润
    var PROFIT_MENU = {
        rsId: 'menu.profit',
        iconCls: 'icon-opf-rmb-bag',
        className:'menu-profit',
        name: '查看分润',
        items: [
            // 机构分润记录
            {
                rsId: 'menu.query.branch.settle.details',
                name: menusLang._('menu.query.branch.settle.details'),
                deps: ['app/oms/settle/branch-settle-details/list/list-controller'],
                trigger: 'branchSettleDetails:list:query'
            },

            // 分润来源明细
            {
                rsId: 'menu.query.algo.detail',
                name: menusLang._('menu.query.algo.detail'),
                deps: ['app/oms/settle/algo-detail/list/list-controller'],
                trigger: 'algoDetail:list:query'
            },

            // 交易额扣率汇总
            {
                rsId: 'menu.trade.rate.sum',
                name: menusLang._('menu.trade.rate.sum'),
                deps: ['app/oms/settle/trade-rate-sum/list-view'],
                trigger: 'trade:rate:sum'
            }
        ]
    };

    //清分清算
    var SETTLE_MENU = {
        rsId: 'menu.settle',
        iconCls: 'icon-yen',
        name: menusLang._('settle.txt'),
        items: [
            //账户账务信息  二级菜单配置: 下面配置三个栏目
            {
                rsId: 'menu.settle.account.info',
                name: menusLang._('settle.account.info'),
                items :[
                    //总账信息
                    {
                        rsId: 'menu.total.account',
                        name: menusLang._('menu.total.account'),
                        deps: ['app/oms/settle/total-account/list/list-controller'],
                        trigger: 'totalAccounts:list'
                    },

                    // 总账手动维护明细
                    {
                        rsId: 'menu.total.account.detail',
                        name: menusLang._('menu.total.account.detail'),
                        deps: ['app/oms/settle/total-account-detail/list/list-controller'],
                        trigger: 'totalAccountDetails:list'
                    },

                    //清算收付款账户信息
                    {
                        rsId: 'menu.stlm.account',
                        name: menusLang._('menu.stlm.account'),
                        deps: ['app/oms/settle/stlm-account/list/list-controller'],
                        trigger: 'stlmAccounts:list'
                    }
                ]
            },

            //对账信息  二级菜单配置，下面有三个栏目
            {
                rsId: 'menu.settle.reconciliation.info',
                name: menusLang._('settle.reconciliation.info'),
                items: [
                    //  渠道账户信息
                    {
                        rsId: 'menu.channel.account',
                        name: menusLang._('menu.channel.account'),
                        deps: ['app/oms/settle/channel-account/list/list-controller'],
                        trigger: 'channelAccounts:list'
                    },

                    //渠道流水信息
                    {
                        rsId: 'menu.channel.txn', //渠道流水信息
                        name: menusLang._('menu.channel.txn'),
                        deps: ['app/oms/settle/channel-txn/list/list-controller'],
                        trigger: 'channelTxn:list'
                    },

                    // 成功交易流水
                    {
                        rsId: 'menu.local.txn', //本地流水
                        name: menusLang._('menu.local.txn'),
                        deps: ['app/oms/settle/local-txn/list/list-view'],
                        trigger: 'localTxn:list'
                    },

                    // 账务审核
                    {
                        rsId: 'menu.account.check', //账务审核
                        name: menusLang._('menu.account.check'),
                        deps: ['app/oms/settle/settle-account-check/list/list-controller'],
                        trigger: 'accountCheck:list'
                    },

                    //差错交易信息
                    {
                        rsId: 'menu.stlm.error',
                        name: menusLang._('menu.stlm.error'),
                        deps: ['app/oms/settle/stlm-error/list/list-controller'],
                        trigger: 'stlmErrors:list'
                    }
                ]
            },

            //清算控制  二级菜单配置，下面有七个栏目
            {
                rsId: 'menu.settle.liquidation.control',
                name: menusLang._('settle.liquidation.control'),
                items: [
                    //批处理主控任务
                    {
                        rsId: 'menu.bat.main.ctl.detail',
                        name: menusLang._('menu.bat.main.ctl.detail'),
                        deps: ['app/oms/settle/bat-main-ctl-detail/list/list-controller'],
                        trigger: 'batMainCtlDetails:list'
                    },

                    //渠道清算控制
                    {
                        rsId: 'menu.settle.channel.control',
                        name: menusLang._('menu.settle.channel.control'),
                        deps: ['app/oms/settle/settle-channel-control/list/list-controller'],
                        trigger: 'settle:channel:control:list'
                    },

                    //账单调整
                    /*{
                     rsId: 'menu.stlm.repair',
                     name: menusLang._('menu.stlm.repair'),
                     deps: ['app/oms/settle/stlm-repair/list/list-controller'],
                     trigger: 'stlmRepairs:list'
                     },*/

                    //清算汇总
                    {
                        rsId: 'menu.settle.sum',
                        name: menusLang._('menu.settle.sum'),
                        deps: ['app/oms/settle/settle-sum/list/list-controller'],
                        trigger: 'settleSums:list'
                    },

                    // T+1清算控制
                    {
                        rsId: 'menu.settle.control',
                        name: menusLang._('menu.settle.control'),
                        deps: ['app/oms/settle/settle-control/list/list-controller'],
                        trigger: 'settleControls:list'
                    },

                    // T+1清算流水
                    {
                        rsId: 'menu.settle.txn',
                        name: menusLang._('menu.settle.txn'),
                        deps: ['app/oms/settle/settle-txn/list/list-controller'],
                        trigger: 'settleTxns:list'
                    },

                    //清算失败信息
                    {
                        rsId: 'menu.settle.error',
                        name: menusLang._('menu.settle.error'),
                        deps: ['app/oms/settle/settle-error/list/list-controller'],
                        trigger: 'settleErrors:list'
                    },

                    //清算批次锁表
                    {
                        rsId: 'menu.settle.lock',
                        name: menusLang._('menu.settle.lock'),
                        deps: ['app/oms/settle/settle-lock/list/list-controller'],
                        trigger: 'settleLock:list'
                    }
                ]
            },

            // 账单调整
            {
                rsId: 'menu.settle.account.repair',
                name: '账单调整',
                items: [
                    //调账明细
                    {
                        rsId: 'menu.repair.detail',
                        name: menusLang._('menu.repair.detail'),
                        deps: ['app/oms/settle/repair-detail/list/list-view'],
                        trigger: 'repairDetail:list'
                    },

                    //调账汇总
                    {
                        rsId: 'menu.repair.sum',
                        name: menusLang._('menu.repair.sum'),
                        deps: ['app/oms/settle/repair-sum/list/list-view'],
                        trigger: 'repairSum:list'
                    }
                ]
            },

            //报表查询  二级菜单配置，下面有四个栏目
            {
                rsId: 'menu.settle.chart.query',
                name: menusLang._('settle.chart.query'),
                items: [
                    //机构清算明细
                    {
                        rsId: 'menu.branch.settle.details',
                        name: menusLang._('menu.branch.settle.details'),
                        deps: ['app/oms/settle/branch-settle-details/list/list-controller'],
                        trigger: 'branchSettleDetails:list'
                    },

                    //商户清算明细
                    {
                        rsId: 'menu.mcht.settle.detail',
                        name: menusLang._('menu.mcht.settle.detail'),
                        deps: ['app/oms/settle/mcht-settle-detail/list/list-controller'],
                        trigger: 'mchtSettleDetail:list'
                    },

                    //清分明细信息
                    {
                        rsId: 'menu.algo.detail',
                        name: menusLang._('menu.algo.detail'),
                        deps: ['app/oms/settle/algo-detail/list/list-controller'],
                        trigger: 'algoDetail:list'
                    }

                    //报表查询
                    /*{
                     rsId: 'menu.settle.download',
                     name: menusLang._('menu.settle.download'),
                     deps: ['app/oms/settle/settle-download/list/list-controller'],
                     trigger: 'settleDownload:list'
                     }*/
                ]
            },

            //T+0清算
            {
                rsId: 'menu.t0.settle',
                name: menusLang._('menu.t0.settle.txt'),
                items: [
                    // T+0清算流水
                    {
                        rsId: 'menu.t0.settle.txn',
                        name: menusLang._('menu.t0.settle.txn'),
                        deps: ['app/oms/settle/settle-txn/list/list-controller'],
                        trigger: 'settleTxns:t0:list'
                    },

                    // T+0清算控制
                    {
                        rsId: 'menu.t0.settle.control',
                        name: menusLang._('menu.t0.settle.control'),
                        deps: ['app/oms/settle/settle-control/list/list-controller'],
                        trigger: 'settleControls:t0:list'
                    },

                    // T+0清算失败(与异常处理-清算失败同个地方)
                    {
                        rsId: 'menu.settle.t0.error',
                        name: menusLang._('menu.settle.t0.error'),
                        deps: ['app/oms/settle/settle-error/list/list-controller'],
                        trigger: 'settle:t0:error:list'
                    },

                    //批处理主控任务
                    {
                        rsId: 'menu.t0.bat.main.ctl.detail',
                        name: menusLang._('menu.t0.bat.main.ctl.detail'),
                        deps: ['app/oms/settle/bat-main-ctl-detail/list/list-controller'],
                        trigger: 'batMainCtlDetails:t0:list'
                    },

                    //清算汇总
                    {
                        rsId: 'menu.t0.settle.sum',
                        name: menusLang._('menu.t0.settle.sum'),
                        deps: ['app/oms/settle/settle-sum/list/list-controller'],
                        trigger: 'settleSums:t0:list'
                    }
                ]
            },

            //S+0清算
            {
                rsId: 'menu.t0.faster',
                name: menusLang._('menu.t0.faster'),
                items: [
                    // S0清算流水
                    {
                        rsId: 'menu.t0.faster.txn',
                        name: menusLang._('menu.t0.faster.txn'),
                        deps: ['app/oms/settle/settle-faster/list-view'],
                        trigger: 'settleFaster:t0:list'
                    },

                    // S0清算控制
                    {
                        rsId: 'menu.t0.faster.control',
                        name: menusLang._('menu.t0.faster.control'),
                        deps: ['app/oms/settle/settle-faster/control/list-view'],
                        trigger: 'settleFaster:t0:control:list'
                    },

                    // S0清算失败 失败(与异常处理-清算失败同个地方)
                    {
                        rsId: 'menu.t0.faster.error',
                        name: menusLang._('menu.t0.faster.error'),
                        deps: ['app/oms/settle/settle-error/list/list-controller'],
                        trigger: 'settleFaster:t0:error:list'
                    }
                ]
            },

            //一清清算
            {
                rsId: 'menu.tc.settle',
                name: menusLang._('menu.tc.settle.txt'),
                items: [
                    // T+C清算控制
                    {
                        rsId: 'menu.tc.settle.control',
                        name: menusLang._('menu.tc.settle.control'),
                        deps: ['app/oms/settle/settle-control/list/list-controller'],
                        trigger: 'settleControls:one:list'
                    },

                    // T+C清算流水
                    {
                        rsId: 'menu.tc.settle.txn',
                        name: menusLang._('menu.tc.settle.txn'),
                        deps: ['app/oms/settle/settle-txn/list/list-controller'],
                        trigger: 'settleTxns:one:list'
                    },

                    //批处理主控任务
                    {
                        rsId: 'menu.tc.bat.main.ctl.detail',
                        name: menusLang._('menu.tc.bat.main.ctl.detail'),
                        deps: ['app/oms/settle/bat-main-ctl-detail/list/list-controller'],
                        trigger: 'batMainCtlDetails:tc:list'
                    },

                    //清算汇总
                    {
                        rsId: 'menu.tc.settle.sum',
                        name: menusLang._('menu.tc.settle.sum'),
                        deps: ['app/oms/settle/settle-sum/list/list-controller'],
                        trigger: 'settleSums:tc:list'
                    }
                ]
            },

            //操作审核
            {
                rsId: 'menu.settle.check',
                name: '操作审核',
                deps: ['app/oms/settle/settle-check/list-controller'],
                trigger: 'settle:check:list'
            },

            //清分清算日志
            {
                rsId: 'menu.settle.log',
                name: '清分清算日志',
                deps: ['app/oms/settle/settle-log/list-view'],
                trigger: 'settle:log:list'
            }
        ]
    };

    //综合查询
    var COMPLEX_QUERY_MENU = {
        rsId: 'menu.complexquery',
        iconCls: 'icon-search',
        name: '综合查询',
        items: [
            // 一站式查询
            {
                rsId: 'menu.mcht.query',
                name: menusLang._('menu.mcht.query'),
                deps: ['app/oms/mcht/mcht-sys-app'],
                trigger: 'mcht:query'
            },

            // 报表查询
            {
                rsId: 'menu.report.bank.bundle',
                name: menusLang._('menu.report.bank.bundle'),
                deps: ['app/oms/report/bank-bundle/bank-bundle-controller'],
                trigger: 'export:stat:list'
            },

            //商户清算明细
            {
                rsId: 'menu.query.mcht.settle.detail',
                name: menusLang._('menu.query.mcht.settle.detail'),
                deps: ['app/oms/settle/mcht-settle-detail/list/list-controller'],
                trigger: 'mchtSettleDetail:list:query'
            },

            //交易流水信息
            {
                rsId: 'menu.query.trade.txn',
                name: menusLang._('menu.query.trade.txn'),
                deps: ['app/oms/settle/trade-txn/list/list-controller'],
                trigger: 'tradeTxn:list:query'
            },

            //业绩指标查询
            {
                rsId: 'menu.pfms.search',
                name: '业绩指标查询',
                items: [
                    // 机构业绩月报表
                    {
                        rsId: 'menu.brh.month.report',
                        name: '机构业绩月报表',
                        deps: ['app/oms/report/award-report/brh-report-controller'],
                        trigger: 'branches:month:report'
                    },

                    // 机构业绩日报表
                    {
                        rsId: 'menu.brh.day.report',
                        name: '机构业绩日报表',
                        deps: ['app/oms/report/award-report/brh-report-controller'],
                        trigger: 'branches:day:report'
                    },

                    // 拓展员业绩月报表
                    {
                        rsId: 'menu.opr.month.report',
                        name: '拓展员业绩月报表',
                        deps: ['app/oms/report/award-report/opr-report-controller'],
                        trigger: 'operators:month:report'
                    },

                    // 拓展员业绩日报表
                    {
                        rsId: 'menu.opr.day.report',
                        name: '拓展员业绩日报表',
                        deps: ['app/oms/report/award-report/opr-report-controller'],
                        trigger: 'operators:day:report'
                    }
                ]
            }
        ]
    };

    //消息管理
    var MESSAGE_PUSH_MENU = {
        rsId: 'menu.message',
        iconCls: 'icon-comments',
        name: '消息管理',
        items: [
            // 公告管理
            {
                rsId: 'menu.notice.mgr',
                name: menusLang._('menu.notice.mgr'),
                trigger: 'notice:mgr:list',
                deps: ['app/oms/notice-mgr/notice-mgr-view']
            },

            // 消息中心
            {
                rsId: 'menu.msg.center.list',
                name: menusLang._('menu.msg.center.list'),
                deps: ['app/oms/message/msg-center/list-controller'],
                trigger: 'msg:center:list'
            },

            // 消息推送
            {
                rsId: 'menu.msg.push.list',
                name: menusLang._('menu.msg.push.list'),
                deps: ['app/oms/message/push/list-controller'],
                trigger: 'msg:push:list'
            },

            // 短信发送
            {
                rsId: 'menu.sm.push.list',
                name: menusLang._('menu.sm.push.list'),
                deps: ['app/oms/message/push-app'],
                trigger: 'sm:record'
            },

            // 客服短信发送配置
            {
                rsId: 'menu.customer.sms.list',
                name: menusLang._('menu.customer.sms.list'),
                deps: ['app/oms/message/customer-sms/list-view'],
                trigger: 'msg:customer:sms'
            }
        ]
    };


    // 查看公告
    var NOTICE_MENU = {
        rsId: 'menu.notice',
        iconCls: 'icon-bullhorn',
        name: menusLang._('menu.notice'),
        trigger: 'notice:list',
        deps: ['app/oms/notice/notice-list-view'],
        className: 'menu-notice'
    };

    //路由
    var ROUTE_MENU = {
        rsId: 'menu.route',
        iconCls: 'icon-random',
        name: '路由',
        items: [
            {//有卡路由
                rsId: 'menu.card.route',
                name: menusLang._('menu.card.route'),
                items: [
                    // 二清实时规则
                    {
                        rsId: 'menu.route.config',
                        name: menusLang._('menu.route.config'),
                        trigger: 'route:config',
                        deps: ['app/oms/route/oneSettle/panel']
                    },

                    // 二清通道详情
                    {
                        rsId: 'menu.route.channel',
                        name: menusLang._('menu.route.channel'),
                        trigger: 'route:channel:list',
                        deps: ['app/oms/route/oneSettle/route-channel/list-view']
                    },

                    // 商户号模型
                    {
                        rsId: 'menu.route.mcht',
                        name: menusLang._('menu.route.mcht'),
                        trigger: 'route:mcht:list',
                        deps: ['app/oms/route/oneSettle/route-mcht/list-view']
                    },

                    // 通道属性配置
                    {
                        rsId: 'menu.channel.attr.config',
                        name: menusLang._('menu.channel.attr.config'),
                        trigger: 'route:channelConfig:list',
                        deps: ['app/oms/route/oneSettle/channel-attr-config/list-view']
                    },

                    // 一清商户配置
                    {
                        rsId: 'menu.onesettle.mcht.config',
                        name: menusLang._('menu.onesettle.mcht.config'),
                        trigger: 'route:onesettleMchtConfig:list',
                        deps: ['app/oms/route/oneSettle/onesettle-mcht-config/list-view']
                    }
                ]
            },

            {//无卡路由
                rsId: 'menu.nocard.route',
                name: menusLang._('menu.nocard.route'),
                items: [
                    // 二清实时规则
                    /*{
                     rsId: 'menu.nocard.route.config',
                     name: menusLang._('menu.nocard.route.config'),
                     trigger: 'nocard:route:config',
                     deps: ['app/oms/route/noCard/panel']
                     },*/

                    // 二清通道详情
                    /*{
                     rsId: 'menu.nocard.route.channel',
                     name: menusLang._('menu.nocard.route.channel'),
                     trigger: 'nocard:route:channel:list',
                     deps: ['app/oms/route/noCard/route-channel/list-view']
                     },*/

                    //无卡商户号模型
                    {
                        rsId: 'menu.nocard.route.mcht',
                        name: menusLang._('menu.nocard.route.mcht'),
                        trigger: 'route:nocard:mcht:list',
                        deps: ['app/oms/route/noCard/route-mcht/list-view']
                    },

                    // 无卡通道属性配置
                    {
                        rsId: 'menu.nocard.channel.attr.config',
                        name: menusLang._('menu.nocard.channel.attr.config'),
                        trigger: 'route:nocard:channelConfig:list',
                        deps: ['app/oms/route/noCard/channel-attr-config/list-view']
                    },

                    //无卡路由商户配置
                    {
                        rsId: 'menu.nocard.route.mcht.config',
                        name: menusLang._('menu.nocard.route.mcht.config'),
                        trigger: 'route:nocardRouteMchtConfig:list',
                        deps: ['app/oms/route/noCard/nocard-route-mcht-config/list-view']
                    }
                ]
            },
            //结算路由
            {
                rsId: 'menu.route.settlement',
                name: menusLang._('menu.route.settlement'),
                items: [
                    {
                        rsId: 'menu.route.settlement.channelConfig',
                        name: menusLang._('menu.route.settlement.channelConfig'),
                        trigger: 'route:settlement:channelConfig',
                        deps: ['app/oms/route/settlement/channelConfig/list-view']
                    },
                    {
                        rsId: 'menu.route.settlement.capacityConfig',
                        name: menusLang._('menu.route.settlement.capacityConfig'),
                        trigger: 'route:settlement:capacityConfig',
                        deps: ['app/oms/route/settlement/capacityConfig/list-view']
                    },
                    {
                        rsId: 'menu.route.settlement.regularConfig',
                        name: menusLang._('menu.route.settlement.regularConfig'),
                        trigger: 'route:settlement:regularConfig',
                        deps: ['app/oms/route/settlement/regularConfig/list-view']
                    }
                ]
            },
            //代扣路由
            {
                rsId: 'menu.route.withhold',
                name: menusLang._('menu.route.withhold'),
                items: [
                    {//基本信息配置
                        rsId: 'menu.route.withhold.channelRouter',
                        name: menusLang._('menu.route.withhold.channelRouter'),
                        trigger: 'route:withhold:channelRouter',
                        deps: ['app/oms/route/withhold/channelRouter/list-view']
                    },
                    {//产品模型配置
                        rsId: 'menu.route.withhold.productConfig',
                        name: menusLang._('menu.route.withhold.productConfig'),
                        trigger: 'route:withhold:productConfig',
                        deps: ['app/oms/route/withhold/productConfig/list-view']
                    },
                    {//通道产品模型配置
                        rsId: 'menu.route.withhold.channelProductConfig',
                        name: menusLang._('menu.route.withhold.channelProductConfig'),
                        trigger: 'route:withhold:channelProductConfig',
                        deps: ['app/oms/route/withhold/channelProductConfig/list-view']
                    }
                ]
            }
        ]
    };

    //服务管理
    var SERVICE_MENU = {
        rsId: 'menu.service',
        iconCls: 'icon-suitcase',
        name: '服务管理',
        items: [
            //服务模型配置
            {
                rsId: 'menu.service.model.config',
                name: menusLang._('menu.service.model.config'),
                trigger: 'service:list',
                deps: ['app/oms/service/list/listController']
            },

            //服务对象管理
            {
                rsId: 'menu.service.target.mgr',
                name: menusLang._('menu.service.target.mgr'),
                trigger: 'service:target:mgr',
                deps: ['app/oms/service/target-mgr/list-view']
            },

            /*
             //服务分配
             //modify by wangjiancheng
             {
             rsId: 'menu.service.dispatch',
             name: menusLang._('menu.service.dispatch'),
             trigger: 'service:dispatch',
             deps: ['app/oms/service/dispatch/list-view']
             },*/

            //服务开通审核
            {
                rsId: 'menu.service.perform',
                name: menusLang._('menu.service.perform'),
                trigger: 'service:perform',
                deps: ['app/oms/service/perform/list-view']
            }
        ]
    };

    //产品运营
    var OPERATE_PRODUCT_MENU = {
        rsId: 'menu.operate.product',
        iconCls: 'icon-trophy',
        name: '产品运营',
        items:[
            // 钱盒配置
            {
                rsId: 'menu.operate.cashbox',
                name: menusLang._('menu.operate.cashbox'),
                items: [
                    // 钱盒增值服务配置
                    {
                        rsId: 'menu.cashbox.config',
                        name: menusLang._('menu.cashbox.config'),
                        trigger: 'operate:cashbox:config',
                        deps: ['app/oms/operate/cashbox/config/list-view']
                    },

                    // 钱盒后台管理
                    {
                        rsId: 'menu.cashbox.manage',
                        name: menusLang._('menu.cashbox.manage'),
                        trigger: 'operate:cashbox:manage',
                        deps: ['app/oms/operate/cashbox/manage/list-view']
                    }
                ]
            },

            // 资金池管理
            {
                rsId: 'menu.operate.cashpool',
                name: menusLang._('menu.operate.cashpool'),
                items:[
                    // 资金池配置
                    {
                        rsId: 'menu.cashpool.config',
                        name: menusLang._('menu.cashpool.config'),
                        trigger: 'operate:cashpoll:list',
                        deps: ['app/oms/operate/cashpool/config/list-view']
                    },

                    // 资金池变更
                    {
                        rsId: 'menu.cashpool.change',
                        name: menusLang._('menu.cashpool.change'),
                        trigger: 'operate:cashpollchange:list',
                        deps: ['app/oms/operate/cashpool/change/list-view']
                    }
                ]
            },

            // 版本控制
            {
                rsId: 'menu.param.version.ctrl',
                name: menusLang._('menu.param.version.ctrl'),
                deps: ['app/oms/param/version-ctrl/list/list-controller'],
                trigger: 'version-ctrl:list'
            }
        ]
    };

    //运营工具
    var OPERATE_MENU = {
        rsId: 'menu.operate',
        iconCls: 'icon-wrench',
        name: '运营工具',
        items:[
            //公众号提额管理
            {
                rsId: 'menu.operate.raiseAmount',
                name: menusLang._('menu.operate.raiseAmount'),
                trigger: 'operate:raiseAmount',
                deps: ['app/oms/operate/raiseAmount/list-view']
            },
            //应答码查询
            {
                rsId:'menu.operate.replyCodeQuery',
                name:menusLang._('menu.operate.replyCodeQuery'),
                items:[
                    //有卡支付应答码
                    {
                        rsId: 'menu.replyCodeQuery.hasCard',
                        name: menusLang._('menu.replyCodeQuery.hasCard'),
                        trigger: 'operate:replyCodeQuery:hasCard',
                        deps: ['app/oms/operate/replyCodeQuery/reply-code-query-app']
                    },
                    //无卡支付应答码
                    {
                        rsId: 'menu.replyCodeQuery.noCard',
                        name: menusLang._('menu.replyCodeQuery.noCard'),
                        trigger: 'operate:replyCodeQuery:noCard',
                        deps: ['app/oms/operate/replyCodeQuery/reply-code-query-app']
                    }
                ]
            },
            //签购单
            {
                rsId: 'menu.operate.txn',
                name: menusLang._('menu.operate.txn'),
                trigger: 'operate:txn',
                deps: ['app/oms/operate/txn/list-view']
            },

            //工单管理
            {
                rsId: 'menu.order.search',
                name: menusLang._('menu.order.search'),
                trigger: 'order:search',
                deps: ['app/oms/operate/order-search/list-view']
            },

            //数据迁移
            /*{
                rsId: 'menu.data.move',
                name: menusLang._('menu.data.move'),
                items: [
                    //机构迁移
                    {
                        rsId: 'menu.data.move.org',
                        name: menusLang._('menu.data.move.org'),
                        trigger: 'data:move:org',
                        deps: ['app/oms/operate/mdata/controller']
                    },

                    //商户迁移
                    {
                        rsId: 'menu.data.move.mcht',
                        name: menusLang._('menu.data.move.mcht'),
                        trigger: 'data:move:mcht',
                        deps: ['app/oms/operate/mdata/controller']
                    },

                    //拓展员迁移
                    {
                        rsId: 'menu.data.move.user',
                        name: menusLang._('menu.data.move.user'),
                        trigger: 'data:move:user',
                        deps: ['app/oms/operate/mdata/controller']
                    }
                ]
            },*/

            //客服电话接入
            {
                rsId: 'menu.operate.serviceTelephone',
                name: menusLang._('menu.operate.serviceTelephone'),
                trigger: 'operate:serviceTelephone',
                deps: ['app/oms/operate/service-telephone/controller']
            },

            //进件黑名单
            {
                rsId: 'menu.operate.blacklist',
                name: menusLang._('menu.operate.blacklist'),
                trigger: 'operate:blacklist',
                deps: ['app/oms/operate/blacklist/list-view']
            },

            //同步商户
            {
                rsId:'menu.operate.sync.mcht',
                name: menusLang._('menu.operate.sync.mcht'),
                items:[
                    //通道商户管理
                    {
                        rsId: 'menu.operate.cmcht',
                        name: menusLang._('menu.operate.cmcht'),
                        trigger: 'operate:cmcht:list',
                        deps: ['app/oms/operate/cmcht/list-controller']
                    },

                    //同步HF商户
                    {
                        rsId: 'menu.operate.sync.hfmcht',
                        name: menusLang._('menu.operate.sync.hfmcht'),
                        trigger: 'operate:sync:hfmcht',
                        deps: ['app/oms/operate/syncHFMcht/view']
                    },

                    //统一同步商户信息渠道属性管理功能与配置
                    {
                        rsId: 'menu.operate.sync.mchtChannel',
                        name: menusLang._('menu.operate.sync.mchtChannel'),
                        trigger: 'operate:sync:mchtChannel',
                        deps: ['app/oms/operate/syncMcht/list-view']
                    }
                ]
            },

            //商机查询
            {
                rsId: 'menu.operate.business',
                name: menusLang._('menu.operate.business'),
                trigger: 'operate:business:list',
                deps: ['app/oms/operate/business/list-controller']
            },

            //便民查询
            {
                rsId: 'menu.operate.convenience',
                name: menusLang._('menu.operate.convenience'),
                trigger: 'operate:convenience:list',
                deps: ['app/oms/operate/convenience/list-controller']
            },

            //钱盒优惠券管理
            {
                rsId: 'menu.discount.coupon',
                name: menusLang._('menu.discount.coupon'),
                trigger: 'operate:discountCoupon:list',
                deps: ['app/oms/operate/coupon/list-view']
            },

            // 账户提现记录查询
            {
                rsId: 'menu.discount.accountTrade',
                name: menusLang._('menu.discount.accountTrade'),
                trigger: 'operate:accountTrade:list',
                deps: ['app/oms/operate/accountTrade/list-view']
            },

            // 渠道商户维护
            {
                rsId: 'menu.operate.mchtCupsName',
                name: menusLang._('menu.operate.mchtCupsName'),
                trigger: 'operate:mchtCupsName:list',
                deps: ['app/oms/operate/mchtCupsName/list-view']
            }
        ]
    };

    //优惠活动配置
    var PROMOTIONS_MENU = {
        rsId: 'menu.promotions',
        iconCls: 'icon-gift',
        name: '优惠活动配置',
        items:[
            //优惠方案模型
            {
                rsId: 'menu.promotions.model',
                name: menusLang._('menu.promotions.model'),
                trigger: 'model:list',
                deps: ['app/oms/promotions/model/list/list-controller']
            },

            //优惠对象管理
            {
                rsId: 'menu.promotions.management',
                name: menusLang._('menu.promotions.management'),
                trigger: 'management:list',
                deps: ['app/oms/promotions/management/list/list-controller']
            }
        ]
    };

    //会议管理
    var MEETING_MENU = {
        rsId: 'menu.meeting',
        iconCls: 'icon-facetime-video',
        name: '会议管理',
        items:[
            //发起会议
            {
                rsId: 'menu.meeting.launch',
                name: menusLang._('menu.meeting.launch'),
                trigger: 'launch:list',
                deps: ['app/oms/meeting/launch/list/list-controller']
            }
        ]
    };

    //账户管理
    var ACCOUNT_MENU = {
        rsId: 'menu.account.management',
        iconCls: 'icon-user',
        name: '账户管理',
        items:[
            // 基础信息
            {
                rsId: 'menu.account.baseInfo',
                name: '基础信息',
                items:[
                    // 账户管理
                    {
                        rsId: 'menu.accountConfig.management',
                        name: menusLang._('menu.accountConfig.management'),
                        trigger: 'account:config:list',
                        deps: ['app/oms/account/account-app']
                    },

                    // 科目管理
                    {
                        rsId: 'menu.subject.management',
                        name: menusLang._('menu.subject.management'),
                        trigger: 'subject:management:list',
                        deps: ['app/oms/account/subject/list/list-view']
                    }
                ]
            },

            // 账务处理
            {
                rsId: 'menu.account.financeInfo',
                name: '账务处理',
                items:[
                    // 手工记账
                    {
                        rsId: 'menu.manualAccount.list',
                        name: menusLang._('menu.manualAccount.list'),
                        trigger: 'manual:account:list',
                        deps: ['app/oms/account/manualAccount/list-view']
                    },

                    // 调账管理
                    {
                        rsId: 'menu.adjustAccount.list',
                        name: menusLang._('menu.adjustAccount.list'),
                        trigger: 'adjust:account:list',
                        deps: ['app/oms/account/adjustAccount/list-view']
                    }
                ]
            },

            // 奖励分润
            {
                rsId: 'menu.account.profitInfo',
                name: '奖励分润',
                items:[
                    // 奖励分润信息
                    {
                        rsId: 'menu.postedInfo.list',
                        name: '奖励分润信息',
                        trigger: 'posted:info:list',
                        deps: ['app/oms/account/profit/list-view']
                    },

                    // 贴票管理
                    {
                        rsId: 'menu.postedTicket.list',
                        name: '贴票管理',
                        trigger: 'posted:ticket:list',
                        deps: ['app/oms/account/profit/postedTicket-view']
                    },
                    //贴票审核
                    {
                        rsId: 'menu.postedTicket.audit',
                        name: '贴票审核',
                        trigger: 'posted:ticket:audit',
                        deps: ['app/oms/account/profit/postedTicketAudit-view']
                    }
                ]
            },

            // 异常处理
            {
                rsId: 'menu.account.exceptions',
                name: '异常处理',
                items:[
                    // 日切异常处理
                    {
                        rsId: 'menu.exceptions.cutOffCheckDetail',
                        name: '日切异常处理',
                        trigger: 'exceptions:detail:list',
                        deps: ['app/oms/account/exceptions/list-view']
                    },

                    //总分账检查
                    {
                        rsId: 'menu.exceptions.cutOffCheckTotal',
                        name: '总分账检查',
                        trigger: 'exceptions:total:list',
                        deps: ['app/oms/account/exceptions/total-list']
                    }
                ]
            }
        ]
    };

    // 操作日志
    var LOG_MENU = {
        rsId: 'menu.auth.log',
        iconCls: 'icon-book',
        name: menusLang._('menu.auth.log'), //menusLang._('log.txt'),
        deps: ['app/oms/auth/log/list/list-controller'],
        trigger: 'log:list'
    };

    /*************************新的配置规范**************************/
    //系统设置
    var SYSTEM_SETTING = {
        rsId: 'oms.menu.system',
        iconCls: 'icon-cog',
        name: '系统设置',
        items:[
            //菜单&权限配置
            {
                rsId: 'oms.menu.system.permission',
                name: menusLang._('oms.menu.system.permission'),
                trigger: 'oms:evt:system:permission',
                deps: ['app/oms/system/controller']
            },

            //统一平台配置
            {
                rsId: 'oms.menu.system.union',
                name: menusLang._('oms.menu.system.union'),
                trigger: 'oms:evt:system:union',
                deps: ['app/oms/system/controller']
            }
        ]
    };

    return {
        menuRoot: [
            MCHT_MENU,
            STAFF_MENU,
            ORG_MENU,
            WKB_MENU,
            TERMINAL_MENU,
            EXCEPTION_MENU,
            DISC_MENU,
            PARAM_MENU,
            PROFIT_MENU,
            SETTLE_MENU,
            COMPLEX_QUERY_MENU,
            MESSAGE_PUSH_MENU,
            ROUTE_MENU,
            OPERATE_PRODUCT_MENU,
            OPERATE_MENU,
            PROMOTIONS_MENU,
            ACCOUNT_MENU,
            SERVICE_MENU,
            NOTICE_MENU,
            MEETING_MENU,
            SYSTEM_SETTING,
            LOG_MENU
        ]
    };
});
