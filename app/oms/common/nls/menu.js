define({
    root: {
        // from nls/nav
        'sys.txt'            : '系统',
        'sys.org.txt'        : '机构组织',
        'sys.job_title.txt'  : '岗位头衔',
        'sys.auth.txt'       : '权限配置',
        'sys.role-group.txt' : '角色组',
        'sys.role.txt'       : '角色',
        'auth.mgr.txt'       : '权限管理',
        'auth.user.txt'      : '操作员',

        'wkb.txt'     : '工作台',
        'wkb.task.txt'        : '任务',
        'wkb.taskList.txt'    : '任务管理',

        'staff.txt'          : '人员',
        'rule.txt'           : '规则',
        'rule-point.txt'     : '规则元素',
        'privilege.txt'      : '权限',

        'cashflow.txt'       : '资金',

        'device.txt'         : '设备',
        'report.export.txt'  : '报表查询',

        'disc'               : '计费模型',
        'disc.brh': '机构计费模型',
        'disc.profit': '机构分润方案',
        'disc.service': '服务费模型',
        'disc.service.list': '服务计费列表',
        'disc.service.model': '服务费模型',

        'param'             : '参数设置',
        'account'            : '账户',
        'card-bin'           : '卡bin',
        'disc-algo'          : '计费算法',
        'mcc'                : 'MCC',
        'mcc-group'          : 'MCC组',
        'region-code'        : '地区编号',
        'media'              : '媒体信息',
        'sys-param'          : '基本参数',
        'zbank'              : '支行',
        'task.map.txt'       : '任务配置',

        'mcht.mgr.txt'       : '商户管理',
        'mcht.add.txt'       : '商户增加',
        'mcht.change.txt'    : '商户信息变更',
        'mcht.service.txt'  : '商户服务列表',
        'terminals.mgr.txt'  : '终端管理',
        'terminals.query.txt'  : '终端查询',


        'settle.txt'         : '清分清算',
        'bat.main.ctl.detail.txt'  : '批处理主控任务',
        'channel.account.txt'      : '渠道账务信息',
        'channel.txn.txt'          : '渠道流水信息',
        'settle.error.txt'         : '清算失败信息',
        'settle.sum.txt'           : '清算汇总',
        'stlm.account.txt'         : '清算收付款账户信息',
        'stlm.error.txt'           : '差错交易信息',
        'stlm.repair.txt'          : '账单调整',
        'total.account.txt'        : '总账信息',
        'total.account.detail.txt' : '总账手动维护明细',
        'settle.control.txt'       : '清算控制',
        'settle.txn.txt'           : '清算流水表',
        'branch.settle.details.txt': '机构清算明细',
        'mcht.settle.detail.txt'   : '商户清算明细',
        'algo.detail.txt'          : '清分明细信息',
        'trade.txn.txt'            : '交易流水信息',
        'settle.lock.txt'          : '清算批次锁表',

        'mcht.server.query'  : '一站式查询',

        'settle.account.info': '账户账务信息',
        'settle.reconciliation.info' : '对账信息',
        'settle.liquidation.control' : '清算控制',
        'settle.chart.query': '报表查询',

        'menu.report.info.txt': '报表查询',
        'report.performance.report.txt': '业绩报表',
        'report.performance.rank.txt': '业绩排行',
        'report.bank.bundle.txt': '报表查询',
        'report.maintain.txt': '商户关系维护',

        'menu.t0.settle.txt'         : 'T+0清算',
        'menu.tc.settle.txt'         : '一清清算',
        'settle.control.t0.txt'      : '清算控制',
        'bat.main.ctl.detail.t0.txt' : '批处理主控任务',
        'settle.sum.t0.txt'          : '清算汇总',

        'menu.t0.faster':       'S+0清算',

        'service.manager.txt'        : '服务管理',
        'service.manager.list'       : '服务列表',

        'menu.push.txt': '推送管理',
        'msg.center.list': '消息中心',
        'msg.push.list': '消息推送',
        'sm.push.list': '短信发送',
        'menu.card.route'            : '有卡路由',
        'menu.nocard.route'          : '无卡路由',

        // 下级机构
        'menu.auth.org':    '机构列表',
        'menu.org.add':     '新增机构',
        'menu.org.rank':    '机构业绩排行',
        'menu.org.perform': '机构业绩报表',

        //我的商户
        'menu.mcht.user':    '商户列表',
        'menu.mcht.pufa':    '商户列表',
        'menu.mcht.user2':    '商户查询',
        'mcht.user.list':    '收银员列表',
        'menu.mcht.add':     '新增商户',
        'menu.mcht.change':  '商户信息变更',
        'menu.mcht.service': '商户服务列表',
        'menu.mcht.topuser': '推荐注册商户列表',
        'menu.report.maintain': '商户活跃度',
        


        //我的员工
        'menu.auth.opr': '员工管理',
        'menu.staff.add': '新增员工',
        'menu.staff.rank': '拓展员业绩排行',
        'menu.staff.perform': '拓展员业绩报表',
        'menu.auth.role': '角色',
        'menu.auth.rolegroup': '角色组',
        'menu.auth.rule': '管辖范围',
        


        //工作台
        'menu.wkb.task': '任务',
        'menu.wkb.taskList':  '任务管理',
        'menu.wkb.task.mcht': '商审审核',//任务（面向商审）

        //POS机管理
        'menu.terminals.mgr': 'POS机管理',
        'menu.terminals.mgr.new': 'POS机下发管理',
        'menu.terminals.query': 'POS机查询',
        'menu.terminals.type.display':  'POS机类型显示配置',
        'menu.terminals.query.code': '升级码获取',

        //异常处理
        'menu.exception.stlmerror': '异常交易',
        'menu.exception.stlmrepair':  '资金截留',
        'menu.exception.settleerror':  '清算失败',
        'menu.exception.S0':  'S0异常处理',
        'menu.exception.cancelorder':  '差错争议处理',
        'menu.service.refunds':     '服务费退费管理',

        //计费模型
            //机构计费模型
            'menu.disc.brh.indirectMcc': '间联MCC计费模型',
            'menu.disc.brh.indirectUnionSettle': '间联统一结算扣率',
            'menu.disc.brh.noBaseRatio': '无基准费率',
            'menu.disc.brh.baseToBorm': '签约扣率对应结算扣率',
            'menu.disc.brh.indirectChange': '间联月交易额结算扣率',
            'menu.disc.brh.indirectCanChange': '96费改机构分润模型',
            'menu.disc.brh.directMcc': '直联商户费率',
            'menu.disc.brh.canSetMore': '直联商户费率可高签',
            'menu.disc.profit': '机构分润方案',

            //商户计费模型
            'menu.disc.mcht.direct': '直联商户费率模型',
            'menu.disc.mcht.indirect': '间联商户费率模型',
            //服务费模型
            'menu.disc.service.list': '服务计费列表',
            'menu.disc.service.mcht': '单商户服务费',
            'menu.profit.service.list': '服务费分润',

        //参数设置
            'menu.param.mccgroup':  'MCC组',
            'menu.param.mcc':  'MCC',
            'menu.param.sysparam':  '基本参数',
            'menu.param.banks':  '总行',
            'menu.param.zbank':  '支行',
            'menu.param.task.map':  '任务配置',
            'menu.param.cardbin': '卡bin',
            'menu.param.refuseConfig': '审核拒绝理由模板',
            'menu.param.taskTag': '行业进件审核标签',

        //敏感信息控制
            'menu.param.version.ctrl': '版本控制',


        //查看分润
            'menu.query.branch.settle.details': '机构分润记录',
            'menu.query.algo.detail': '分润来源明细',
            'menu.trade.rate.sum': '交易额扣率汇总',



        //清分清算
            //操作审核
            'menu.settle.check': '操作审核',

            //清分清算日志
            'menu.settle.log': '清分清算日志',

            //账户账务信息
            'menu.total.account': '总账信息',
            'menu.total.account.detail': '总账手动维护明细',
            'menu.stlm.account': '清算收付款账户信息',

            //对账信息
            'menu.channel.account': '渠道账务信息',
            'menu.channel.txn': '渠道流水信息',
            'menu.local.txn': '成功交易流水',
            'menu.account.check': '账务审核',
            'menu.stlm.error': '差错交易信息',


            //清算控制
            'menu.bat.main.ctl.detail': '批处理主控任务',
            'menu.settle.channel.control': '渠道清算控制',
            'menu.stlm.repair': '账单调整',
            'menu.settle.sum': '清算汇总',
            'menu.settle.control': 'T+1清算控制',
            'menu.settle.txn': 'T+1清算流水',
            'menu.settle.error': '清算失败信息',
            'menu.settle.lock': '清算批次锁表',

            //账单调整
            'menu.repair.detail': '调账明细',
            'menu.repair.sum': '调账汇总',

            //报表查询
            'menu.branch.settle.details': '机构清算明细',
            'menu.mcht.settle.detail': '商户清算明细',
            'menu.algo.detail': '清分明细信息',
            'menu.settle.download': '报表查询',
               
               
            //T+0清算
            'menu.t0.settle.control':       'T+0清算控制',
            'menu.t0.settle.txn':           'T+0清算流水',
            'menu.t0.bat.main.ctl.detail':  '批处理主控任务',
            'menu.t0.settle.sum':           '清算汇总',
            'menu.settle.t0.error':         'T+0清算失败',

            //T0秒到
            'menu.t0.faster.txn':       'S0清算流水',//清算流水
            'menu.t0.faster.control':   'S0清算控制',//清算控制
            'menu.t0.faster.error':     'S0清算失败',//清算失败

            //一清清算
            'menu.tc.settle.control': 'T+C清算控制',
            'menu.tc.settle.txn': 'T+C清算流水',
            'menu.tc.bat.main.ctl.detail': '批处理主控任务',
            'menu.tc.settle.sum': '清算汇总',

        //综合查询
        'menu.mcht.query': '一站式查询', //一站式
        'menu.report.bank.bundle': '报表查询', //报表导出
        'menu.query.mcht.settle.detail': '商户清算明细',
        'menu.query.trade.txn': '交易流水信息',

        // 业绩指标查询
        'menu.brh.month.report': '机构业绩月报表',
        'menu.brh.day.report': '机构业绩日报表',
        'menu.opr.day.report': '拓展员业绩日报表',
        'menu.opr.month.report': '拓展员业绩月报表',

        //运营工具
        'menu.operate.raiseAmount':'公众号提额管理',
        'menu.operate.replyCodeQuery':'交易应答码',
        'menu.replyCodeQuery.hasCard':'有卡支付应答码',
        'menu.replyCodeQuery.noCard':'无卡支付应答码',
        'menu.operate.txn': '签购单',
        'menu.order.search': '工单管理',
        'menu.data.move': '数据迁移',
        'menu.data.move.org': '机构迁移',
        'menu.data.move.mcht': '商户迁移',
        'menu.data.move.user': '拓展员迁移',
        'menu.operate.serviceTelephone': '客服电话接入',

        'menu.operate.cmcht': '通道商户管理',
        'menu.operate.sync.mcht': '同步商户',
        'menu.operate.sync.mchtChannel': '同步商户信息渠道',
        'menu.operate.sync.hfmcht': '同步HF商户',

        'menu.operate.business': '商机查询',
        'menu.operate.convenience': '便民查询',
        'menu.operate.blacklist': '进件黑名单',
        'menu.service.target.config': '服务对象配置管理',
        'menu.discount.coupon': '钱盒优惠券管理',
        'menu.discount.accountTrade': '账户提现记录查询',
        'menu.operate.mchtCupsName': '渠道商户维护',

        'menu.operate.cashbox': '钱盒配置',
        'menu.cashbox.config': '钱盒增值服务配置',
        'menu.cashbox.manage': '钱盒后台管理',

        'menu.operate.cashpool': '资金池管理',
        'menu.cashpool.config':'资金池配置',
        'menu.cashpool.change':'资金池变更',

        //消息管理
        'menu.notice.mgr': '公告管理',
        'menu.msg.center.list': '消息中心',
        'menu.msg.push.list': '消息推送',
        'menu.sm.push.list': '短信发送',
        'menu.customer.sms.list': '客服短信发送配置',

        'menu.auth.log': '操作日志',
        
        //路由
        'menu.route.config': '二清实时规则',//原- 路由配置
        'menu.route.channel': '二清通道详情',//原-通道模型
        'menu.route.mcht': '商户号模型', ///原-商户模型
        'menu.channel.attr.config':'通道属性配置',
        'menu.onesettle.mcht.config':'一清商户配置',

        //无卡路由
        'menu.nocard.route.config':'二清实时规则',
        'menu.nocard.route.channel':'二清通道详情',
        'menu.nocard.route.mcht' : '商户号模型',
        'menu.nocard.route.mcht.config':'一清商户配置',
        'menu.nocard.channel.attr.config': '通道属性配置',

        //结算路由
        'menu.route.settlement.channelConfig': '出款通道配置',
        'menu.route.settlement': '结算路由',
        'menu.route.settlement.capacityConfig': '通道出款容量配置',
        'menu.route.settlement.regularConfig': '出款特定路由配置',

        //代扣路由
        'menu.route.withhold': '代扣路由',
        'menu.route.withhold.channelRouter': '通道模型配置',
        'menu.route.withhold.productConfig': '产品模型配置',
        'menu.route.withhold.channelProductConfig': '通道产品模型',

        //优惠活动配置
        'menu.promotions.model': '优惠方案模型',
        'menu.promotions.management': '优惠对象管理',

        //服务管理
	    'menu.service.model.config': '服务模型配置',
	    'menu.service.model.create.server': '添加服务模型',
	    'menu.service.model.edit.task': '修改任务配置',
	    'menu.service.model.edit.activate': '修改开通配置',
	    'menu.service.model.view.task': '查看任务配置',
	    'menu.service.model.view.activate': '查看开通配置',
	    'menu.service.target.mgr': '服务对象管理',
	    'menu.service.dispatch': '服务分配',
	    'menu.service.perform': '服务开通审核',


        //查看公告
        'menu.notice': '查看公告',

        //会议管理
        'menu.meeting.launch': '发起会议',

        //账户管理
        'menu.accountConfig.management': '账户管理',
        'menu.subject.management': '科目管理',
        'menu.manualAccount.list': '手工记账',
        'menu.adjustAccount.list': '调账管理',
        'menu.accountTrade.list' : '新增调账',
        'menu.accountRecord.management': '调账明细',
        'menu.postedTicket.list':   '贴票管理',
        'menu.postedTicket.audit': '贴票审核',
        'menu.postedInfo.list': '奖励分润信息',
        'menu.exceptions.cutOffCheckDetail': '日切异常处理',
        'menu.exceptions.cutOffCheckTotal': '总分账检查',


        //系统设置
        'oms.menu.system.permission': '菜单与权限配置',
        'oms.menu.system.union': '统一平台配置'

    }

});