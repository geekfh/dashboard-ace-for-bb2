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
define({
    permissionRoot: {
        // 关联页面权限
        //< resourceId, permissionCodes<String/Array> >
        rs2pm: {

            //编辑商户信息时，忽略证件格式
            'mcht:edit:ignore:idcard:fmt:validate': 'mcht:idcard:u',

            //'_debug_': [],
            //'menu.auth': [], //权限管理菜单

            'menu.auth.org': [
                //机构
                'system:branch:c',
                'system:branch:r',
                'system:branch:s',
                'system:branch:u',
                'system:branch:cal'
            ],
            'menu.org.add': [//新增机构
                'system:branch:c'
            ],
            'menu.org.rank': [//机构排行
                'report:performanceorderbrh:r', //'查看每条记录详细信息'
                'report:performanceorderbrh:s', //'查看机构业绩排行报表'
                'report:performanceorderbrh:p' //'下载机构业绩排行报表'
            ],

            'org.rank.view': ['report:performanceorderbrh:r'],
            'org.rank.search': ['report:performanceorderbrh:s'],
            'org.rank.download': ['report:performanceorderbrh:p'],

            'menu.org.perform':[//机构业绩报表
                'report:performancebrh:r', //'查看每条记录详细信息', NULL, NULL, NULL, '报表查询-机构业绩查询', NULL);
                'report:performancebrh:s', //'查看机构业绩报表', NULL, NULL, NULL, '报表查询-机构业绩查询', NULL);
                'report:performancebrh:p' //'下载机构业绩报表', NULL, NULL, NULL, '报表查询-机构业绩查询', NULL);
            ],
            'org.report.view': ['report:performancebrh:r'],
            'org.report.search': ['report:performancebrh:s'],
            'org.report.download': ['report:performancebrh:p'],

            'menu.staff.add': [
                'system:operator:cs',
                'system:operator:ce',
                'system:operator:ci',
                'system:operator:cc',
                'system:operator:cm',
                'system:operator:cmb'
            ],
            'menu.staff.rank': [//拓展员排行
                'report:performanceorderexpand:r', //'查看每条记录详细信息'
                'report:performanceorderexpand:s', //'查看拓展员业绩排行报表'
                'report:performanceorderexpand:p' //'下载拓展员业绩排行报表'
            ],

            'explore.rank.view': ['report:performanceorderexpand:r'],
            'explore.rank.search': ['report:performanceorderexpand:s'],
            'explore.rank.download': ['report:performanceorderexpand:p'],

            'menu.staff.perform':[//拓展员业绩报表
                'report:performanceexpand:r', //'查看每条记录详细信息'
                'report:performanceexpand:s',// '查看拓展员业绩报表'
                'report:performanceexpand:p'// '下载拓展员业绩报表'
            ],

            'explore.report.view': ['report:performanceexpand:r'],
            'explore.report.search': ['report:performanceexpand:s'],
            'explore.report.download': ['report:performanceexpand:p'],

            'menu.exception.stlmerror': [//异常交易 （复制 清分清算>对账信息>差错交易）
                'errorinfo:stlmerror:r', //'查看每条记录详细信息'
                'errorinfo:stlmerror:s' //'查看异常交易信息'
            ],
            'menu.exception.stlmrepair':[//资金截留（拷贝 清分清算>清算控制>账单调整）
                'errorinfo:stlmrepair:r', //'查看每条记录详细信息',
                'errorinfo:stlmrepair:s' //'查看资金截留信息'
            ],
            'menu.exception.settleerror':[//清算失败 （拷贝 清分清算>清算控制>清算失败）
                'errorinfo:settleerror:r', //'查看每条记录详细信息'
                'errorinfo:settleerror:s' //'查看清算失败信息'
            ],

            'menu.exception.cancelorder':[
                'stlm:cancelorder:s',//查询
                'stlm:cancelorder:c', //新增
                'stlm:cancelorder:u', //更新
                'stlm:cancelorder:d', //删除
                'stlm:cancelorder:i',//导出
                'stlm:cancelorder:sg',//修改(商管)
                'stlm:cancelorder:ac',//修改(清算)
                'stlm:cancelorder:u'//释放(清算)
            ],
            'menu.exception.cancelorder.add':['stlm:cancelorder:c'],
            'menu.exception.cancelorder.view':['stlm:cancelorder:s'],
            'menu.exception.cancelorder.del':['stlm:cancelorder:d'],
            'menu.exception.cancelorder.search':['stlm:cancelorder:s'],
            'menu.exception.cancelorder.edit':['stlm:cancelorder:sg','stlm:cancelorder:ac','stlm:cancelorder:u'],//'stlm:cancelorder:u'
            'menu.exception.cancelorder.edit1':['stlm:cancelorder:sg'],//商管
            'menu.exception.cancelorder.edit2':['stlm:cancelorder:ac'],//清算
            'menu.exception.cancelorder.finance':['stlm:cancelorder:fe'],//财务
            'menu.exception.cancelorder.download':['stlm:cancelorder:i'],
            'menu.exception.cancelorder.mchtEdit':['stlm:cancelorder:sg'],//修改(商管)
            'menu.exception.cancelorder.clearEdit':['stlm:cancelorder:ac'],//修改(清算)
            'menu.exception.cancelorder.clearRelease':['stlm:cancelorder:u'],//释放(清算)

            'menu.exception.S0':[
                'stlm:exceptiontxns0:s',//列表查询
                'stlm:exceptiontxns0:P' //处理操作
            ],
            'exception.S0.refresh':['stlm:exceptiontxns0:s'],
            'exception.S0.changestate':['stlm:exceptiontxns0:p'],

            //服务费退费管理
            'menu.service.refunds':[
                'settle:servicerefund:s',
                'settle:servicerefund:export',
                'settle:servicerefund:sp',//自动成批
                'settle:servicerefund:u'//处理
            ],
            'refundsList': 'settle:servicerefund:s',
            'refundsList.refresh': 'settle:servicerefund:s',
            'refundsList.view': 'settle:servicerefund:s',
            'refundsList.search': 'settle:servicerefund:s',
            'refundsList.download': 'settle:servicerefund:export',
            'refundsList.autobatch': 'settle:servicerefund:sp',
            'refundsList.batsHandle':'settle:servicerefund:u',

            'menu.auth.log': [
                'system:log:r',
                'system:log:s'
            ],
            'menu.auth.opr': [
                'system:operator:cs',
                'system:operator:ce',
                'system:operator:ci',
                'system:operator:cc',
                'system:operator:cm',
                'system:operator:cmb',
                'system:operator:r',
                'system:operator:s',
                'system:operator:u',
                'system:operator:d',
                'system:operator:restpwd',
                'system:operator:urc',
                'system:operator:st'
            ],
            'menu.auth.role': [ //角色菜单
                'system:role:c',
                'system:role:r',
                'system:role:s',
                'system:role:u',
                'system:role:d'
            ],
            'menu.auth.rolegroup': [
                'system:rolegroup:c',
                'system:rolegroup:r',
                'system:rolegroup:s',
                'system:rolegroup:u',
                'system:rolegroup:d'
            ],
            'menu.auth.rule': [
                'system:rule:c',
                'system:rule:r',
                'system:rule:s',
                'system:rule:u',
                'system:rule:d'
            ],
            'menu.auth.privilege': [
                'system:auth:c',
                'system:auth:r',
                'system:auth:s',
                'system:auth:u',
                'system:auth:d'
            ],
            //  'menu.auth.privilege': '',//TODO lack

            //计费模型
            'menu.disc': [],
            'menu.disc.brh': [],
            'menu.disc.mcht': [],
            'menu.disc.service': [],

            'menu.disc.brh.canSetMore':[  //直联MCC类可高签
                'disc:dir:mcchigh'
            ],

            'menu.disc.brh.indirectMcc':[  //间联MCC类
                'disc:indir:mcc'
            ],

            'disc.indirectMcc.add': ['system:brhprofitmodel:c'],
            'disc.indirectMcc.view': ['system:brhprofitmodel:r'],
            'disc.indirectMcc.edit': ['system:brhprofitmodel:u'],
            'disc.indirectMcc.del': ['system:brhprofitmodel:d'],
            'disc.indirectMcc.search': ['system:brhprofitmodel:s'],
            'disc.indirectMcc.refresh': ['system:brhprofitmodel:s'],



            'menu.disc.brh.indirectUnionSettle': [  //间联统一结算扣率
                'disc:indir:us'
            ],

            'disc.indirectUnionSettle.add': ['system:brhprofitmodel:c'],
            'disc.indirectUnionSettle.view': ['system:brhprofitmodel:r'],
            'disc.indirectUnionSettle.edit': ['system:brhprofitmodel:u'],
            'disc.indirectUnionSettle.del': ['system:brhprofitmodel:d'],
            'disc.indirectUnionSettle.search': ['system:brhprofitmodel:s'],
            'disc.indirectUnionSettle.refresh': ['system:brhprofitmodel:s'],

            'menu.disc.brh.noBaseRatio':[  //间联无基准费率
                'disc:indir:nbr'
            ],

            'disc.noBaseRatio.add': ['system:brhprofitmodel:c'],
            'disc.noBaseRatio.edit': ['system:brhprofitmodel:u'],
            'disc.noBaseRatio.view': ['system:brhprofitmodel:r'],
            'disc.noBaseRatio.del': ['system:brhprofitmodel:d'],
            'disc.noBaseRatio.search': ['system:brhprofitmodel:s'],
            'disc.noBaseRatio.refresh': ['system:brhprofitmodel:s'],

            'menu.disc.brh.baseToBorm':[  //间联签约扣率变动结算扣率
                'disc:indir:sts'
            ],

            'disc.baseToBorm.add': ['system:brhprofitmodel:c'],
            'disc.baseToBorm.edit': ['system:brhprofitmodel:u'],
            'disc.baseToBorm.view': ['system:brhprofitmodel:r'],
            'disc.baseToBorm.del': ['system:brhprofitmodel:d'],
            'disc.baseToBorm.search': ['system:brhprofitmodel:s'],
            'disc.baseToBorm.refresh': ['system:brhprofitmodel:s'],

            'menu.disc.brh.indirectCanChange':[  //MCC月交易额结算扣率
                'disc:indir:hf'
            ],

            'disc.indirectCanChange.add': ['system:brhprofitmodel:c'],
            'disc.indirectCanChange.edit': ['system:brhprofitmodel:u'],
            'disc.indirectCanChange.view': ['system:brhprofitmodel:r'],
            'disc.indirectCanChange.del': ['system:brhprofitmodel:d'],
            'disc.indirectCanChange.search': ['system:brhprofitmodel:s'],
            'disc.indirectCanChange.refresh': ['system:brhprofitmodel:s'],

            'menu.disc.brh.indirectChange':[//间联月交易额结算扣率变动
                'disc:indir:srmc'
            ],
            'disc.indirectChange.add': ['system:brhprofitmodel:c'],
            'disc.indirectChange.edit': ['system:brhprofitmodel:u'],
            'disc.indirectChange.view': ['system:brhprofitmodel:r'],
            'disc.indirectChange.del': ['system:brhprofitmodel:d'],
            'disc.indirectChange.search': ['system:brhprofitmodel:s'],
            'disc.indirectChange.refresh': ['system:brhprofitmodel:s'],

            'menu.disc.brh.directMcc':[  //直联MCC类
                'disc:dir:mcc'
            ],

            'disc.directMcc.add': ['system:brhprofitmodel:c'],
            'disc.directMcc.view': ['system:brhprofitmodel:r'],
            'disc.directMcc.edit': ['system:brhprofitmodel:u'],
            'disc.directMcc.del': ['system:brhprofitmodel:d'],
            'disc.directMcc.search': ['system:brhprofitmodel:s'],
            'disc.directMcc.refresh': ['system:brhprofitmodel:s'],
            'disc.canSetMore.add': ['system:brhprofitmodel:c'],
            'disc.canSetMore.view': ['system:brhprofitmodel:r'],
            'disc.canSetMore.edit': ['system:brhprofitmodel:u'],
            'disc.canSetMore.del': ['system:brhprofitmodel:d'],
            'disc.canSetMore.search': ['system:brhprofitmodel:s'],
            'disc.canSetMore.refresh': ['system:brhprofitmodel:s'],

            'menu.disc.profit': [ //机构分润方案
                'system:brhprofitscheme:s',
                'system:brhprofitscheme:c',
                'system:brhprofitscheme:r',
                'system:brhprofitscheme:u',
                'system:brhprofitscheme:d'
            ],

            'brh.profit.add': ['system:brhprofitscheme:c'],
            'brh.profit.edit': ['system:brhprofitscheme:u'],
            'brh.profit.view': ['system:brhprofitscheme:r'],
            'brh.profit.del': ['system:brhprofitscheme:d'],
            'brh.profit.search': ['system:brhprofitscheme:s'],
            'brh.profit.refresh': ['system:brhprofitscheme:s'],

            'menu.disc.mcht.direct': [ //直联商户费率模型
                'system:mchtalgop:s',
                'system:mchtalgop:r',
                'system:mchtalgop:c',
                'system:mchtalgop:u',
                'system:mchtalgop:d'
            ],

            'menu.disc.mcht.indirect': [ //间联商户费率模型
                'system:mchtalgoh:s',
                'system:mchtalgoh:r',
                'system:mchtalgoh:c',
                'system:mchtalgoh:u',
                'system:mchtalgoh:d'
            ],

            'disc.mcht.direct.add': ['system:mchtalgop:c'],
            'disc.mcht.direct.edit': ['system:mchtalgop:u'],
            'disc.mcht.direct.view': ['system:mchtalgop:r'],
            'disc.mcht.direct.del': ['system:mchtalgop:d'],
            'disc.mcht.direct.search': ['system:mchtalgop:s'],
            'disc.mcht.direct.refresh': ['system:mchtalgop:s'],

            'disc.mcht.indirect.add': ['system:mchtalgoh:c'],
            'disc.mcht.indirect.edit': ['system:mchtalgoh:u'],
            'disc.mcht.indirect.view': ['system:mchtalgoh:r'],
            'disc.mcht.indirect.del': ['system:mchtalgoh:d'],
            'disc.mcht.indirect.search': ['system:mchtalgoh:s'],
            'disc.mcht.indirect.refresh': ['system:mchtalgoh:s'],

            //服务计费列表
            'menu.disc.service.list': [
                'system:disc:c',
                'system:disc:r',
                'system:disc:s',
                'system:disc:u',
                'system:disc:d'
            ],

            //单商户服务费
            'menu.disc.service.mcht': [
                'system:specialmchtpro:c', //新增
                'system:specialmchtpro:s', //查找
                'system:specialmchtpro:u', //修改
                'system:specialmchtpro:d' //删除
            ],
            'disc.service.mcht.add': ['system:specialmchtpro:c'],
            'disc.service.mcht.del': ['system:specialmchtpro:d'],
            'disc.service.mcht.edit': ['system:specialmchtpro:u'],
            'disc.service.mcht.search': ['system:specialmchtpro:s'],
            'disc.service.mcht.batchImport': ['system:specialmchtpro:c'],

            //服务费分润
            'menu.profit.service.list' : [
                'system:serviceprofit:s',//查询分页
                'system:serviceprofit:r',//详情
                'system:serviceprofit:c',//创建
                'system:serviceprofit:u',//更新
                'system:serviceprofit:d',//删除
                'profitdialog.view',
                'profitdialog.add',
                'profitdialog.edit',
                'profitdialog.del'
            ],

            'system.serviceprofit.view' : ['system:serviceprofit:s'],
            'system.serviceprofit.refresh' : ['system:serviceprofit:s'],
            'system.serviceprofit.search' : ['system:serviceprofit:s'],
            'system.serviceprofit.add' : ['system:serviceprofit:c'],
            'system.serviceprofit.edit' : ['system:serviceprofit:u'],
            'system.serviceprofit.del' : ['system:serviceprofit:d'],

            //服务费分润 详情
            'profitdialog.view' : [
                'system:serviceprofit:s',//查询分页
                'system:serviceprofit:r'//详情
            ],
            'profitdialog.add' : ['system:serviceprofit:c'],
            'profitdialog.edit' : ['system:serviceprofit:u'],
            'profitdialog.del' : ['system:serviceprofit:d'],

            //服务管理
            'menu.service': [],

            //服务模型配置
            'menu.service.model.config': [
                'system:service:c',
                'system:service:r',
                'system:service:u',
                'system:service:s'
            ],
            'services.manager.search': ['system:service:s'],
            'services.manager.refresh': ['system:service:s'],
            'services.manager.add': ['system:service:c'],
            'services.manager.editTask': ['system:service:u'],
            'services.manager.editActivate': ['system:service:u'],
            'services.manager.viewTask': ['system:service:r'],
            'services.manager.viewActivate': ['system:service:r'],
            //'services.manager.viewMchts': ['system:service:r'],

            //服务对象管理
            'menu.service.target.mgr':[
                'service:object:c',
                'service:object:s',
                'service:object:u',
                'service:object:i' //导入
            ],

            //服务邀请
            'serviceTargetMgr.add':[
                'service:object:c'
            ],
            'serviceTargetMgr.open':[
                'service:object:u'
            ],
            'serviceTargetMgr.stop':[
                'service:object:u'
            ],
            'serviceTargetMgr.search':[
                'service:object:s'
            ],
            'serviceTargetMgr.refresh':[
                'service:object:s'
            ],
            'serviceTargetMgr.importServiceTarget':[
                'service:object:i'
            ],


            //服务分配
            'menu.service.dispatch':[],//TODO lack
            //服务开通审核
            'menu.service.perform':[
                'service:perform:s',
                'service:perform:u'
            ],

            'servicePerform.search':[
                'service:perform:s'
            ],
            'servicePerform.refresh':[
                'service:perform:s'
            ],
            'servicePerform.pass':[
                'service:perform:u'
            ],
            'servicePerform.reject':[
                'service:perform:u'
            ],

            'menu.param': [], //参数设置菜单
            'menu.param.account': [], //TODO lack

            //银行卡基础信息维护
            'menu.param.cardbin': [
                'system:cardbin2:r',//查看详情
                'system:cardbin2:u',//修改
                'system:cardbin2:d',//删除
                'system:cardbin2:c',//增加
                'system:cardbin2:s',//查找
                'system:cardbin2:i'//导入/下载
            ],
            'cardbin.search':['system:cardbin2:s'],//卡bin 查询
            'cardbin.refresh':['system:cardbin2:s'],//卡bin 刷新
            'cardbin.view':['system:cardbin2:r'],//卡bin 详情
            'cardbin.add':['system:cardbin2:c'],//卡bin 新增
            'cardbin.edit':['system:cardbin2:u'],//卡bin 编辑
            'cardbin.del':['system:cardbin2:d'],//卡bin 删除
            'cardbin.Import':['system:cardbin2:i'],//卡bin 导入/下载

            //'cardbin.add': ['system:cardbin:c'],
            //'cardbin.del': ['system:cardbin:d'],
            //'cardbin.edit': ['system:cardbin:u'],
            //'cardbin.view': ['system:cardbin:r'],
            //'cardbin.search': ['system:cardbin:s'],
            //'cardbin.refresh': ['system:cardbin:s'],

            'menu.param.discalgo': [
                'system:discalgo:c',
                'system:discalgo:r',
                'system:discalgo:s',
                'system:discalgo:u',
                'system:discalgo:d'
            ],
            'menu.param.feemod': [
                'system:feemod:c',
                'system:feemod:r',
                'system:feemod:s',
                'system:feemod:u',
                'system:feemod:d'
            ],
            'menu.param.mccgroup': [
                'system:mccgroup:c',
                'system:mccgroup:r',
                'system:mccgroup:s',
                'system:mccgroup:u',
                'system:mccgroup:d'
            ],
            'menu.param.mcc': [
                'system:mcc:c',
                'system:mcc:r',
                'system:mcc:s',
                'system:mcc:u',
                'system:mcc:d'
            ],
            'menu.param.regioncode': [
                'system:regioncode:c',
                'system:regioncode:r',
                'system:regioncode:s',
                'system:regioncode:u',
                'system:regioncode:d'
            ],
            'menu.param.sysparam': [
                'system:systemparam:c',
                'system:systemparam:r',
                'system:systemparam:s',
                'system:systemparam:u',
                'system:systemparam:d'
            ],

            'menu.param.disc': [
                'system:disc:c',
                'system:disc:r',
                'system:disc:s',
                'system:disc:u',
                'system:disc:d'
            ],

            'menu.param.banks': [
                'system:bank:s',
                'system:bank:c',
                'system:bank:u'
            ],

            'menu.param.zbank': [
                'system:zbank:c',
                'system:zbank:r',
                'system:zbank:s',
                'system:zbank:u',
                'system:zbank:d'
            ],

            'menu.param.refuseConfig': [
                'task:refusecofig:s'
            ],
            'param.refuseConfig.add': 'task:refusecofig:s',
            'param.refuseConfig.edit': 'task:refusecofig:s',
            'param.refuseConfig.view': 'task:refusecofig:s',
            'param.refuseConfig.search': 'task:refusecofig:s',
            'param.refuseConfig.refresh': 'task:refusecofig:s',

            'menu.param.task.map': [
                'wkb:taskmap:r',
                'wkb:taskmap:s',
                'wkb:taskmap:u'
            ],

            'menu.param.taskTag':[
                'mcht:project:s',
                'mcht:project:c',
                'mcht:project:u',
                'mcht:project:d'
            ],
            'paramTaskTag.view': 'mcht:project:s',
            'paramTaskTag.refresh': 'mcht:project:s',
            'paramTaskTag.add': 'mcht:project:c',
            'paramTaskTag.edit': 'mcht:project:u',
            'paramTaskTag.del': 'mcht:project:d',

            //敏感列配置菜单
            'menu.param.sen': [
                'system:sensitivefields:s',
                'system:sensitivefields:u',
                'system:sensitivefields:un'
            ],
            //更改 敏感列配置 按钮
            'sen.edit': ['system:sensitivefields:u'],

            'menu.mcht': [],
            'menu.mcht.user': [
                'mcht:base:c',
                'mcht:base:r',
                'mcht:base:s',
                'mcht:base:u',
                'mcht:base:d',
                'service:object:t',
                'mcht:base:lhsh',
                'mcht:base:ptb',
                'mcht:base:usta',
                'mcht:base:uacct',
                'mcht:base:us0',
                'mcht:base:mchtrank',
                'mcht:base:servicestate',
                'mcht:base:mchtiou',
                'mcht:base:lsr',
                'mcht:base:mchttcs'
            ],

            'mchtsgrid.add': ['mcht:base:c'],
            'mchtsgrid.view': ['mcht:base:r'],
            'mchtsgrid.search': ['mcht:base:s'],
            'mchtsgrid.refresh': ['mcht:base:s'],
            'mchtsgrid.edit': ['mcht:base:u'],
            'mchtsgrid.del': ['mcht:base:d'],
            'mchtsgrid.editCoMarketing':'mcht:base:lhsh',//更改联合营销商户
            'mchtsgrid.changestate': ['mcht:base:usta'],//更改商户状态
            'mchtsgrid.IsBlackList': ['mcht:base:ptb'],//商户管理-进件黑名单-已加入进件黑名单
            'mchtsgrid.NoBlackList': ['mcht:base:ptb'],//商户管理-进件黑名单-未加入进件黑名单
            'mchtsgrid.editBank': 'mcht:base:uacct',//商户列表 对外
            'mchtsgrid.updateS0': 'mcht:base:us0',//商户列表 S0服务
            'mchtsgrid.updateT1': 'mcht:base:mchtrank', //商户列表 T1等级
            'mchtsgrid.viewWAState': 'mcht:base:servicestate', //商户列表 查看微信支付宝服务状态
            'mchtsgrid.whiteBars': 'mcht:base:mchtiou', //商户列表 白条开关
            'mchtsgrid.changeStateView': 'mcht:base:lsr', //商户列表 查看更改状态记录
            'mchtsgrid.changePhotoCardState': 'mcht:base:mchttcs', //商户列表 商户拍卡状态变更
            'mchtsgrid.changeMchtType': 'mcht:base:mchttype',

            'menu.mcht.add': ['mcht:base:c'],
            'menu.mcht.inviteMcht': ['service:object:t'],

            'menu.mcht.pufa': [
                'mcht:openbase:r',
                'mcht:openbase:s'
            ],
            'mchtsgrid.pufa.view'    : ['mcht:openbase:r'],
            'mchtsgrid.pufa.search'  : ['mcht:openbase:s'],
            'mchtsgrid.pufa.refresh' : ['mcht:openbase:s'],

            'mcht.user.list': [
                'mcht:user:r',
                'mcht:user:s',
                'mcht:user:t',
                'mcht:user:restpwd',
                'mcht:user:changesta'
            ],
            'person.mchts.view'           : ['mcht:user:r'],
            'person.mchts.search'         : ['mcht:user:s'],
            'person.mchts.refresh'        : ['mcht:user:s'],
            'person.mchts.synchronization': ['mcht:user:t'],
            'person.mchts.repeatPassword' : ['mcht:user:restpwd'],//收银员列表-重置密码
            'person.mchts.status'         : 'mcht:user:changesta',//修改状态

            'menu.mcht.user2': [
                'mcht:insidebase:s',
                'mcht:insidebase:r',
                'mcht:insidebase:u',
                'mcht:insidebase:d',
                'mcht:insidebase:ptb',
                'mcht:insidebase:lhsh',
                'mcht:insidebase:usta',
                'mcht:base:sms',
                'mcht:insidebase:uacct',
                'mcht:insidebase:us0',
                'mcht:insidebase:servicestate',
                'mcht:base:mchtiou',
                'mcht:base:ssr',
                'mcht:base:mchttcs'
            ],
            'mchtsgrid.user2.del': ['mcht:insidebase:d'],
            'mchtsgrid.user2.edit': ['mcht:insidebase:u'],
            'mchtsgrid.user2.view': ['mcht:insidebase:r'],
            'mchtsgrid.user2.search': ['mcht:insidebase:s'],
            'mchtsgrid.user2.refresh': ['mcht:insidebase:s'],
            'mchtsgrid.user2.changestate': ['mcht:insidebase:usta'],
            'mchtsgrid.user2.editCoMarketing': 'mcht:insidebase:lhsh',//更改联合营销商户
            'mchtsgrid.user2.IsBlackList': ['mcht:insidebase:ptb'],
            'mchtsgrid.user2.NoBlackList': ['mcht:insidebase:ptb'],
            'mchtsgrid.user2.sendMessage': ['mcht:base:sms'],//商户查询>>发送短信
            'mchtsgrid.user2.editBank': ['mcht:insidebase:uacct'],//商户查询>>修改银行卡
            'mchtsgrid.user2.updateS0': ['mcht:insidebase:us0'],//商户查询 S0修改
            'mchtsgrid.user2.viewWAState': 'mcht:insidebase:servicestate', //商户查询 查看微信支付宝服务状态
            'mchtsgrid.user2.whiteBars': 'mcht:base:mchtiou', //商户查询 白条开关
            'mchtsgrid.user2.changeStateView': 'mcht:base:ssr', //商户查询 查看更改状态记录
            'mchtsgrid.user2.changePhotoCardState': 'mcht:base:mchttcs', //商户查询 拍卡状态变更
            'mchtsgrid.user2.changeMchtType': 'mcht:base:mchttype',

            'menu.mcht.service': [
                'mcht:mchtservice:s',
                'mcht:mchtservice:r',
                'mcht:mchtservice:i'
            ],
            'mcht.service.show.active': ['mcht:mchtservice:r'],
            'mcht.service.invite': ['mcht:mchtservice:i'],

            'menu.mcht.change': [
                'mcht:infochange:r',  //'查看每条记录详细信息'
                'mcht:infochange:s'
            ],
            'infoChange.view': ['mcht:infochange:r'],

            'org.add': ['system:branch:c'],
            'org.del': ['system:branch:d'],
            'org.edit': ['system:branch:u'],
            'org.view': ['system:branch:r'],
            'org.search': ['system:branch:s'],
            'org.refresh': ['system:branch:s'],
            'org.stopBranch': ['system:branch:co'],//机构启用/停用权限
            'org.openBranch': ['system:branch:co'],//机构启用/停用权限

            'log.view': ['system:log:r'],
            'log.search': ['system:log:s'],
            'log.refresh': ['system:log:s'],

            'rule.add': ['system:rule:c'],
            'rule.del': ['system:rule:d'],
            'rule.edit': ['system:rule:u'],
            'rule.view': ['system:rule:r'],
            'rule.search': ['system:rule:s'],
            'rule.refresh': ['system:rule:s'],

            'roles.add': ['system:role:c'],
            'roles.del': ['system:role:d'],
            'roles.edit': ['system:role:u'],
            'roles.view': ['system:role:r'],
            'roles.search': ['system:role:s'],
            'roles.refresh': ['system:role:s'],

            'rolegroup.add': ['system:rolegroup:c'],
            'rolegroup.del': ['system:rolegroup:d'],
            'rolegroup.edit': ['system:rolegroup:u'],
            'rolegroup.view': ['system:rolegroup:r'],
            'rolegroup.search': ['system:rolegroup:s'],
            'rolegroup.refresh': ['system:rolegroup:s'],

            'privilege.add': ['system:auth:c'],
            'privilege.del': ['system:auth:d'],
            'privilege.edit': ['system:auth:u'],
            'privilege.view': ['system:auth:r'],
            'privilege.search': ['system:auth:s'],
            'privilege.refresh': ['system:auth:s'],

            'disc.add': ['system:disc:c'],
            'disc.del': ['system:disc:d'],
            'disc.edit': ['system:disc:u'],
            'disc.view': ['system:disc:r'],
            'disc.search': ['system:disc:s'],
            'disc.refresh': ['system:disc:s'],

            'discalgo.add': ['system:discalgo:c'],
            'discalgo.del': ['system:discalgo:d'],
            'discalgo.edit': ['system:discalgo:u'],
            'discalgo.view': ['system:discalgo:r'],
            'discalgo.search': ['system:discalgo:s'],
            'discalgo.refresh': ['system:discalgo:s'],

            'task.add': ['wkb:task:c'],
            'task.del': ['wkb:task:d'],
            'task.edit': ['wkb:task:u'],
            'task.view': ['wkb:task:r'],
            'task.search': ['wkb:task:s'],
            'task.refresh': ['wkb:task:s'],

            'taskList.view': ['wkb:taskinfo:r'],
            'taskList.search': ['wkb:taskinfo:s'],
            'taskList.refresh': ['wkb:taskinfo:s'],
            'taskList.sendUsers': ['wkb:taskinfo:su'], //人员指派权限
            'taskList.dropTask': ['wkb:taskinfo:dt'], //人员任务放回
            'taskList.verifyonline': ['mcht:verifyonline:s'], //在线管理

            'users.add': [
                'system:operator:cs',
                'system:operator:ce',
                'system:operator:ci',
                'system:operator:cc',
                'system:operator:cm',
                'system:operator:cmb',
                'system:operator:lsr'
            ],
            'users.del': ['system:operator:d'],
            'users.edit': ['system:operator:u'],
            'users.view': ['system:operator:r'],
            'users.search': ['system:operator:s'],
            'users.refresh': ['system:operator:s'],
            'users.changestate': ['system:operator:u'],
            'users.repeatPassword':['system:operator:restpwd'], //员工管理-重置密码
            'users.editdistrict':['system:operator:urc'], //地推拓展范围-编辑按钮
            'users.checkTopLevel':['system:operator:st'], //查看盒伙人上级和顶级
            'users.changeStateView':['system:operator:lsr'], //查看更改状态记录

            'user.add.custom': ['system:operator:cs'],//新增操作员:自定义操作员
            'user.add.expand': ['system:operator:ce'],//新增操作员:拓展员
            'user.add.entry': ['system:operator:ci'],//新增操作员:录入员
            'user.add.statist': ['system:operator:cc'],//新增操作员:统计员
            'user.add.brh.manage': ['system:operator:cm'],//新增操作员:机构管理员（管理）
            'user.add.brh.business': ['system:operator:cmb'],//新增操作员:机构管理员（管理&业务）

            'mccs.add': ['system:mcc:c'],
            'mccs.del': ['system:mcc:d'],
            'mccs.edit': ['system:mcc:u'],
            'mccs.view': ['system:mcc:r'],
            'mccs.search': ['system:mcc:s'],
            'mccs.refresh': ['system:mcc:s'],

            'mccgroup.add': ['system:mccgroup:c'],
            'mccgroup.del': ['system:mccgroup:d'],
            'mccgroup.edit': ['system:mccgroup:u'],
            'mccgroup.view': ['system:mccgroup:r'],
            'mccgroup.search': ['system:mccgroup:s'],
            'mccgroup.refresh': ['system:mccgroup:s'],

            'regioncode.add': ['system:regioncode:c'],
            'regioncode.del': ['system:regioncode:d'],
            'regioncode.edit': ['system:regioncode:u'],
            'regioncode.view': ['system:regioncode:r'],
            'regioncode.search': ['system:regioncode:s'],
            'regioncode.refresh': ['system:regioncode:s'],

            'sysparam.add': ['system:systemparam:c'],
            'sysparam.del': ['system:systemparam:d'],
            'sysparam.edit': ['system:systemparam:u'],
            'sysparam.view': ['system:systemparam:r'],
            'sysparam.search': ['system:systemparam:s'],
            'sysparam.refresh': ['system:systemparam:s'],

            'banks.add': ['system:bank:c'],
            'banks.edit': ['system:bank:u'],
            'banks.search': ['system:bank:s'],
            'banks.refresh': ['system:bank:s'],
            'banks.view': ['system:bank:c','system:bank:u','system:bank:s'],

            'zbank.add': ['system:zbank:c'],
            'zbank.del': ['system:zbank:d'],
            'zbank.edit': ['system:zbank:u'],
            'zbank.view': ['system:zbank:r'],
            'zbank.search': ['system:zbank:s'],
            'zbank.refresh': ['system:zbank:s'],
            'zbank.import': ['system:zbank:bi'],
            'zbank.download': ['system:zbank:dt'],

            'taskMap.view': ['wkb:taskmap:r'],
            'taskMap.search': ['wkb:taskmap:s'],
            'taskMap.refresh': ['wkb:taskmap:s'],
            'taskMap.edit': ['wkb:taskmap:u'],

            //终端管理
            'menu.terminals': [], // 终端管理菜单
            'menu.terminals.mgr': [
                'term:termmanage:r',
                'term:termmanage:s',
                'term:termmanage:c',
                'term:termmanage:i',
                'term:termmanage:u',
                'term:terminal:ua',
                'term:terminal:bua'
            ],
            'terminalsMgr.add': ['term:termmanage:c'],
            'terminalsMgr.view': ['term:termmanage:r'],
            'terminalsMgr.search': ['term:termmanage:s'],
            'terminalsMgr.refresh': ['term:termmanage:s'],
            'terminalsMgr.importInformation': ['term:termmanage:i'],
            'terminalsMgr.unbindTerminal': ['term:termmanage:u'],
            // 'terminalsMgr.exportTemplate': ['term:termmanage:i'],
            //'terminalsMgr.changestate': ['term:termmanage:o'],
            'terminalsMgr.recall':['term:termmanage:rc'],
            'terminalsMgr.allocate':['term:termmanage:dep'],
            'terminalsMgr.disable':['term:termmanage:sp'],
            'terminalsMgr.unbind':['term:termmanage:u'],//批量回收返修
            'terminalsMgr.resizeImport': ['term:termmanage:ri'],         //导入调整
            'terminalsMgr.unbundlingImport': ['term:termmanage:uli'],     //导入解绑
            'terminalsMgr.download': ['term:terminal:p'],     //下载报表
            'terminalsMgr.terminalStatusBySelect': 'term:terminal:ua',//终端变更用途 修改
            'terminalsMgr.terminalStatusByImport': 'term:terminal:bua',//导入调整租机状态
            'terminalsMgr.terminalGenerateSNList': 'term:terminal:du',//二维码URL生成器


            //终端下发管理
            'menu.terminals.mgr.new': [
                'term:termmanage:r',
                'term:termmanage:s',
                'term:termmanage:c',
                'term:termmanage:i',
                'term:termmanage:u',
                'term:termmanage:rc',
                'term:termmanage:sp',
                'term:termmanage:dep'
            ],


            'menu.terminals.query': [
                'term:termview:r',
                'term:termview:s'
            ],
            // 'terminalsQuery.view': ['term:termview:r'],
            // 'terminalsQuery.search': ['term:termview:s'],
            // 'terminalsQuery.refresh': ['term:termview:s'],

            'menu.terminals.query.code': [
                'mcht:number:s'
            ],
            'terminals.query.code.refresh': ['mcht:number:s'],

            'menu.terminals.type.display': [
                'term:typedisplay:s',
                'term:typedisplay:r',
                'term:typedisplay:u',
                'term:typedisplay:d'
            ],

            //后台暂时没加上 add 的权限
            //'terminalsTypeDisplays.add':['term:typedisplay:c'],
            'terminalsTypeDisplays.view':['term:typedisplay:r'],
            'terminalsTypeDisplays.refresh':['term:typedisplay:s'],
            'terminalsTypeDisplays.search':['term:typedisplay:s'],
            'terminalsTypeDisplays.del':['term:typedisplay:d'],
            'terminalsTypeDisplays.edit':['term:typedisplay:u'],



            /**
             * 清分清算权限信息
             */

            'menu.settle': [],                     //清分清算菜单
            'menu.settle.account.info': [],        //账务账户信息
            'menu.settle.reconciliation.info':[],  //对账信息
            'menu.settle.liquidation.control':[],  //清算控制
            'menu.settle.account.repair': [],      //账单调整
            'menu.settle.chart.query': [],         //报表查询

            //账务账户信息栏目下的权限
            //总账信息
            'menu.total.account': [
                'settle:totalaccount:c',
                'settle:totalaccount:r',
                'settle:totalaccount:u',
                'settle:totalaccount:d',
                'settle:totalaccount:s'
            ],

            'totalAccount.add': ['settle:totalaccount:c'],
            'totalAccount.view': ['settle:totalaccount:r'],
            'totalAccount.edit': ['settle:totalaccount:u'],
            'totalAccount.del': ['settle:totalaccount:d'],
            'totalAccount.search': ['settle:totalaccount:s'],
            'totalAccount.refresh': ['settle:totalaccount:s'],


            //总账手动维护明细
            'menu.total.account.detail': [
                'settle:totalaccountdetail:c',
                'settle:totalaccountdetail:r',
                'settle:totalaccountdetail:u',
                'settle:totalaccountdetail:d',
                'settle:totalaccountdetail:s',
                'settle:totalaccountdetail:ck'
            ],

            'totalAccountDetail.add': ['settle:totalaccountdetail:c'],
            'totalAccountDetail.view': ['settle:totalaccountdetail:r'],
            'totalAccountDetail.edit': ['settle:totalaccountdetail:u'],
            'totalAccountDetail.del': ['settle:totalaccountdetail:d'],
            'totalAccountDetail.search': ['settle:totalaccountdetail:s'],
            'totalAccountDetail.refresh': ['settle:totalaccountdetail:s'],
            'totalAccountDetail.check': ['settle:totalaccountdetail:ck'],


            //清算收付款账户信息
            'menu.stlm.account': [
                'settle:stlmaccount:c',
                'settle:stlmaccount:r',
                'settle:stlmaccount:u',
                'settle:stlmaccount:d',
                'settle:stlmaccount:s',
                'settle:stlmaccount:p'
            ],

            'stlmAccount.add': ['settle:stlmaccount:c'],
            'stlmAccount.view': ['settle:stlmaccount:r'],
            'stlmAccount.edit': ['settle:stlmaccount:u'],
            'stlmAccount.del': ['settle:stlmaccount:d'],
            'stlmAccount.search': ['settle:stlmaccount:s'],
            'stlmAccount.refresh': ['settle:stlmaccount:s'],
            'stlmAccount.acctMmCode': ['settle:stlmaccount:p'],


            //对账信息菜单下的权限
            //渠道财务信息
            'menu.channel.account': [
                'settle:channelaccount:c',
                'settle:channelaccount:r',
                'settle:channelaccount:u',
                'settle:channelaccount:d',
                'settle:channelaccount:s',
                'settle:channelaccount:ck',
                'settle:channelaccount:p',
                'settle:channelaccount:ck',//处理
                'settle:channelaccount:p'
            ],

            'channelAccount.add': ['settle:channelaccount:c'],
            'channelAccount.view': ['settle:channelaccount:r'],
            'channelAccount.edit': ['settle:channelaccount:u'],
            'channelAccount.del': ['settle:channelaccount:d'],
            'channelAccount.search': ['settle:channelaccount:s'],
            'channelAccount.refresh': ['settle:channelaccount:s'],
            'channelAccount.affirm': ['settle:channelaccount:ck'],
            'channelAccount.download': ['settle:channelaccount:p'],
            'channelAccount.downLoadCups': ['settle:channelaccount:p'],
            'channelAccount.deal': ['settle:channelaccount:ck'],


            //渠道流水信息
            'menu.channel.txn': [
                'settle:cup:r',
                'settle:cup:s'
            ],
            'channelTxn.view': ['settle:cup:r'],
            'channelTxn.search': ['settle:cup:s'],
            'channelTxn.refresh': ['settle:cup:s'],
            'channelTxn.download': ['settle:cup:p'],


            'menu.local.txn': [
                'settle:txnsucc:s',
                'settle:txnsucc:r',
                'settle:txnsucc:e'
            ],

            'local.txn.view': ['settle:txnsucc:s'],
            'local.txn.search': ['settle:txnsucc:s'],
            'local.txn.refresh': ['settle:txnsucc:s'],
            'local.txn.download': ['settle:txnsucc:e'],

            //账务审核
            'menu.account.check': [
                'settle:account:s',
                'settle:account:c'
            ],

            'accountCheck.view': ['settle:account:s'],
            'accountCheck.search': ['settle:account:s'],
            'accountCheck.refresh': ['settle:account:s'],
            'accountCheck.check': ['settle:account:c'],

            //差错交易信息
            'menu.stlm.error': [
                'settle:stlmerror:c',
                'settle:stlmerror:r',
                'settle:stlmerror:u',
                'settle:stlmerror:d',
                'settle:stlmerror:s',
                'settle:stlmerror:ck',
                'settle:stlmerror:p'
            ],

            'stlmError.add': ['settle:stlmerror:c'],
            'stlmError.view': ['settle:stlmerror:r', 'errorinfo:stlmerror:r'],
            'stlmError.edit': ['settle:stlmerror:u'],
            'stlmError.del': ['settle:stlmerror:d'],
            'stlmError.search': ['settle:stlmerror:s', 'errorinfo:stlmerror:s'],
            'stlmError.refresh': ['settle:stlmerror:s', 'errorinfo:stlmerror:s'],
            'stlmError.work': ['settle:stlmerror:ck'],
            'stlmError.dealS0': ['settle:stlmerror:ck'],
            'stlmError.download' : ['settle:stlmerror:p'],


            //清算控制菜单下的权限
            //批处理主控任务
            'menu.bat.main.ctl.detail': [
                'settle:batmainctldetail:c',
                'settle:batmainctldetail:r',
                'settle:batmainctldetail:u',
                'settle:batmainctldetail:d',
                'settle:batmainctldetail:s',
                'settle:batmainctldetail:l'
            ],

            'batMainCtlDetail.add': ['settle:batmainctldetail:c'],
            'batMainCtlDetail.view': ['settle:batmainctldetail:r'],
            'batMainCtlDetail.edit': ['settle:batmainctldetail:u'],
            'batMainCtlDetail.del': ['settle:batmainctldetail:d'],
            'batMainCtlDetail.search': ['settle:batmainctldetail:s'],
            'batMainCtlDetail.refresh': ['settle:batmainctldetail:s'],
            'batMainCtlDetail.reStart': ['settle:batmainctldetail:l'],

            //渠道清算控制
            'menu.settle.channel.control': [
                'settle:channelctrl:u',
                'settle:channelctrl:s'
            ],
            'settle.channel.control.changestate': ['settle:channelctrl:u'],
            'settle.channel.control.search': ['settle:channelctrl:s'],
            'settle.channel.control.refresh': ['settle:channelctrl:s'],

            //账单调整
            'menu.stlm.repair': [
                'settle:stlmrepair:c',
                'settle:stlmrepair:r',
                'settle:stlmrepair:u',
                'settle:stlmrepair:d',
                'settle:stlmrepair:s',
                'settle:stlmrepair:ck',
                'settle:stlmrepair:p'
            ],

            'stlmRepair.add': ['settle:stlmrepair:c'],
            'stlmRepair.view': ['settle:stlmrepair:r', 'errorinfo:stlmrepair:r'],
            'stlmRepair.edit': ['settle:stlmrepair:u'],
            'stlmRepair.del': ['settle:stlmrepair:d'],
            'stlmRepair.search': ['settle:stlmrepair:s', 'errorinfo:stlmrepair:s'],
            'stlmRepair.refresh': ['settle:stlmrepair:s', 'errorinfo:stlmrepair:s'],
            'stlmRepair.check': ['settle:stlmrepair:ck'],
            'stlmRepair.download': ['settle:stlmrepair:p'],


            //清算汇总
            'menu.settle.sum': [
                'settle:settlesum:c',
                'settle:settlesum:r',
                'settle:settlesum:u',
                'settle:settlesum:d',
                'settle:settlesum:s',
                'settle:settlesum:st'
            ],

            //操作审核
            'menu.settle.check':[
                "settle:check:r", //预览
                "settle:check:s", //查询
                'settle:check:t', // 差错交易来源审核
                'settle:check:a', // 资金解冻来源审核
                'settle:check:f', // 清算失败来源审核
                'settle:check:audit', //审核
                'settle:check:i'//下载
            ],
            'settle.check.search': ['settle:check:s'],
            'settle.check.refresh': ['settle:check:s'],
            'settle.check.view': ['settle:check:r'],
            'settle.check.t': 'settle:check:t',// 差错交易来源审核
            'settle.check.a': 'settle:check:a',// 资金解冻来源审核
            'settle.check.f': 'settle:check:audit',// 清算失败来源审核
            'settle.check.b': 'settle:check:b',// 退票来源审核
            'settle.check.checkstatus1': ['settle:check:audit'],
            'settle.check.checkstatus3': ['settle:check:a'],
            'settle.check.checkstatus4': ['settle:check:t'],
            'settle.check.checkstatus5': ['settle:check:b'],
            'settle:check:download': 'settle:check:i',

            //清分清算日志
            'menu.settle.log':[
                'settle:recordlog:s' //清分清算日志查询列表
            ],
            'settleLog.search': ['settle:recordlog:s'],
            'settleLog.view': ['settle:recordlog:s'],

            'settleSum.add': ['settle:settlesum:c'],
            'settleSum.view': ['settle:settlesum:r'],
            'settleSum.edit': ['settle:settlesum:u'],
            'settleSum.del': ['settle:settlesum:d'],
            'settleSum.search': ['settle:settlesum:s'],
            'settleSum.refresh': ['settle:settlesum:s'],
            'settleSum.todo': ['settle:settlesum:st'],

            //清算控制
            'menu.settle.control': [
                'settle:settlecontrol:c',
                'settle:settlecontrol:r',
                'settle:settlecontrol:u',
                'settle:settlecontrol:d',
                'settle:settlecontrol:s',
                'settle:settlecontrol:t',
                'settle:settlecontrol:ck',
                'settle:settlecontrol:ts',
                'settle:settlecontrol:cf',
                'settle:settlecontrol:rc'
            ],

            'settleControl.add': ['settle:settlecontrol:c'],
            'settleControl.view': ['settle:settlecontrol:r'],
            'settleControl.edit': ['settle:settlecontrol:u'],
            'settleControl.del': ['settle:settlecontrol:d'],
            'settleControl.search': ['settle:settlecontrol:s'],
            'settleControl.refresh': ['settle:settlecontrol:s'],
            'settleControl.transfer': ['settle:settlecontrol:ts'],
            'settleControl.check': ['settle:settlecontrol:ck'],
            'settleControl.confirm': ['settle:settlecontrol:cf'],
            'settleControl.repeal': ['settle:settlecontrol:rc'],

            'settleControl.batchTransfer': ['settle:settlecontrol:ts'],
            'settleControl.batchCheck': ['settle:settlecontrol:ck'],
            'settleControl.batchConfirm': ['settle:settlecontrol:cf'],

            //清算流水 出款历史明细列表
            'menu.settleHistory.list': 'settle:settletxn:s',

            //清算流水表
            'menu.settle.txn': [
                'settle:settletxn:c',
                'settle:settletxn:r',
                'settle:settletxn:u',
                'settle:settletxn:d',
                'settle:settletxn:s',
                'settle:settletxn:ck',
                'settle:settletxn:p',
                'settle:settletxn:sd',
                'settle:settletxn:h',
                'settle:settletxn:ss',
                'settle:settletxn:rs',
                'settle:settletxn:ok'
            ],

            'settleTxn.add': ['settle:settletxn:c'],
            'settleTxn.view': ['settle:settletxn:r'],
            'settleTxn.edit': ['settle:settletxn:u'],
            'settleTxn.del': ['settle:settletxn:d'],
            'settleTxn.search': ['settle:settletxn:s'],
            'settleTxn.refresh': ['settle:settletxn:s'],
            'settleTxn.check': ['settle:settletxn:ck'],
            'settleTxn.download': ['settle:settletxn:p'],
            'settleTxn.singleBatch': ['settle:settletxn:sd'],
            'settleTxn.divideBatch': ['settle:settletxn:h'],
            'settleTxn.stopSettle': ['settle:settletxn:ss'],
            'settleTxn.recoverySettle': ['settle:settletxn:rs'],
            'settleTxn.setSuccess': ['settle:settletxn:ok'],
            'settleTxn.maxAmountT0': ['t0settle:t0settletxn:amth'],
            'settleTxn.maxAmountOne': ['tcsettle:tcsettletxn:amth'],
            'settleTxn.history': ['settle:settletxn:s'],

            //清算失败信息
            'menu.settle.error': [
                'settle:settleerror:c',
                'settle:settleerror:r',
                'settle:settleerror:u',
                'settle:settleerror:d',
                'settle:settleerror:s',
                'settle:settleerror:qs',
                'settle:settleerror:yy',
                'settle:settleerror:sp'
            ],

            'settleError.newAdd': ['settle:settleerror:c'],
            'settleError.view': ['settle:settleerror:r', 'errorinfo:settleerror:r'],
            'settleError.edit': ['settle:settleerror:u'],
            'settleError.del': ['settle:settleerror:d'],
            'settleError.search': ['settle:settleerror:s', 'errorinfo:settleerror:s'],
            'settleError.refresh': ['settle:settleerror:s', 'errorinfo:settleerror:s'],
            'settleError.settleDo': ['settle:settleerror:qs'],
            'settleError.operateDo': ['settle:settleerror:yy'],
            'settleError.dealS0': ['settle:settleerror:yy'],
            'settleError.autoDo': ['settle:settleerror:sp'],
            'settleError.download': ['settle:settleerror:p'],
            'settleError.errorDataImport': ['settle:settleerror:c'],

            //清算批次锁表
            'menu.settle.lock': [
                'settle:settlelock:r',
                'settle:settlelock:u',
                'settle:settlelock:l',
                'settle:settlelock:s'
            ],

            'settleLock.view': ['settle:settlelock:r'],
            'settleLock.unlock': ['settle:settlelock:u'],
            'settleLock.lock': ['settle:settlelock:l'],
            'settleLock.search': ['settle:settlelock:s'],
            'settleLock.refresh': ['settle:settlelock:s'],


            'menu.repair.detail': [
                'settle:stlmrepairdtl:s',
                'settle:stlmrepairdtl:e',
                'settle:stlmrepairdtl:re'
            ],

            'repair.detail.view': ['settle:stlmrepairdtl:s'],
            'repair.detail.search': ['settle:stlmrepairdtl:s'],
            'repair.detail.refresh': ['settle:stlmrepairdtl:s'],
            'repair.detail.download': ['settle:stlmrepairdtl:e'],
            'repair.detail.updateRepairExp': ['settle:stlmrepairdtl:re'],

            'menu.repair.sum': [
                'settle:stlmrepairsum:s',
                'settle:stlmrepairsum:r',
                'settle:stlmrepairsum:c',
                'settle:stlmrepairsum:zt',
                'settle:stlmrepairsum:zj',
                'settle:stlmrepairsum:jd',
                'settle:stlmrepairsum:tzjd',
                'settle:stlmrepairsum:u',
                ''
            ],

            'repair.sum.add': ['settle:stlmrepairsum:c'],
            'repair.sum.refresh': ['settle:stlmrepairsum:s'],
            'repair.sum.search': ['settle:stlmrepairsum:s'],
            'repair.sum.view': ['settle:stlmrepairsum:r'],
            'repair.sum.addUp': ['settle:stlmrepairsum:zt'],
            'repair.sum.reduce': ['settle:stlmrepairsum:zj'],
            'repair.sum.thaw': ['settle:stlmrepairsum:jd'],
            'repair.sum.stopThaw': ['settle:stlmrepairsum:tzjd'],
            'repair.sum.download': ['settle:stlmrepairsum:e'],
            'repair.sum.edit': ['settle:stlmrepairsum:u'],


            //报表查询菜单下的权限
            //机构清算明细表
            'menu.branch.settle.details': [
                "settle:branchsettledetail:c",
                "settle:branchsettledetail:r",
                "settle:branchsettledetail:u",
                "settle:branchsettledetail:d",
                "settle:branchsettledetail:s",
                "settle:branchsettledetail:ck",
                "settle:branchsettledetail:nck"
            ],

            'BranchSettleDetails.add': ["settle:branchsettledetail:c"],
            'BranchSettleDetails.view': ["settle:branchsettledetail:r"],
            'BranchSettleDetails.edit': ["settle:branchsettledetail:u"],
            'BranchSettleDetails.del': ["settle:branchsettledetail:d"],
            'BranchSettleDetails.search': ["settle:branchsettledetail:s"],
            'BranchSettleDetails.refresh': ["settle:branchsettledetail:s"],
            'BranchSettleDetails.doRefresh': ["settle:branchsettledetail:s"],
            'BranchSettleDetails.join': ["settle:branchsettledetail:ck"],
            'BranchSettleDetails.notJoin': ["settle:branchsettledetail:nck"],


            //商户清算明细
            'menu.mcht.settle.detail': [
                'settle:mchtsettledtl:s',
                'settle:mchtsettledtl:r',
                'settle:mchtsettledtl:p'
            ],

            'mchtSettleDetail.view': ['settle:mchtsettledtl:r'],
            'mchtSettleDetail.search': ['settle:mchtsettledtl:s'],
            'mchtSettleDetail.download': ['settle:mchtsettledtl:p'],
            'mchtSettleDetail.maxAmountList': 'settle:mchtsettledtl:r',//大额拆分列表
            'mchtSettleDetail.history': ['settle:mchtsettledtl:s'],
            'query.mchtSettleDetail': 'settle:mchtsettledtl:s',


            //清分明细信息
            'menu.algo.detail': [
                'settle:algodtl:r',
                'settle:algodtl:s',
                'settle:algodtl:p'
            ],

            'algoDetail.view': ['settle:algodtl:r'],
            'algoDetail.search': ['settle:algodtl:s'],
            'algoDetail.refresh': ['settle:algodtl:s'],
            'algoDetail.download': ['settle:algodtl:p'],


            //交易流水信息   这部分权限已经删除
            /*
             'menu.trade.txn': [
             'settle:ntxn:r',
             'settle:ntxn:s'
             ],

             'tradeTxn.view': ['settle:ntxn:r'],
             'tradeTxn.search': ['settle:ntxn:s'],
             'tradeTxn.refresh': ['settle:ntxn:s'],
             */
            //uk配置表权限 。
            'menu.uk.config': [
                'settle:ukconfig:s',
                'settle:ukconfig:r',
                'settle:ukconfig:u',
                'settle:ukconfig:c',
                'settle:ukconfig:d'
            ],

            'ukConfig.view' : ['settle:ukconfig:r'],
            'ukConfig.search' : ['settle:ukconfig:s'],
            'ukConfig.refresh' : ['settle:ukconfig:s'],
            'ukConfig.add' : ['settle:ukconfig:c'],
            'ukConfig.edit' : ['settle:ukconfig:u'],
            'ukConfig.del' : ['settle:ukconfig:d'],


            //报表导出
            'menu.settle.download': ['settle:report:p'],

            'brhFee.view': ['settle:report:p'],
            'brhFee.refresh': ['settle:report:p'],
            'brhFee.search': ['settle:report:p'],
            'brhFee.download': ['settle:report:p'],

            'mcthDetail.view': ['settle:report:p'],
            'mcthDetail.refresh': ['settle:report:p'],
            'mcthDetail.search': ['settle:report:p'],
            'mcthDetail.download': ['settle:report:p'],

            'batchPayment.view': ['settle:report:p'],
            'batchPayment.refresh': ['settle:report:p'],
            'batchPayment.search': ['settle:report:p'],
            'batchPayment.download': ['settle:report:p'],


            /**
             * 信息查询菜单
             */

            'menu.query': [], //信息查询菜单

            //信息查询>机构清算明细
            'menu.query.branch.settle.details': [
                'settleinfo:brhsettledtl:r',
                'settleinfo:brhsettledtl:s'
            ],

            'query.BranchSettleDetails.view'   : ['settleinfo:brhsettledtl:r'],
            'query.BranchSettleDetails.search' : ['settleinfo:brhsettledtl:s'],
            'query.BranchSettleDetails.refresh' : ['settleinfo:brhsettledtl:s'],

            'menu.query.mcht.settle.detail' : [
                'settleinfo:mchtsettledtl:r',
                'settleinfo:mchtsettledtl:s'
            ],

            'query.mchtSettleDetail.view'  : ['settleinfo:mchtsettledtl:r'],
            'query.mchtSettleDetail.search': ['settleinfo:mchtsettledtl:s'],
            'query.mchtSettleDetail.refresh': ['settleinfo:mchtsettledtl:s'],

            'menu.query.algo.detail'  : [
                'settleinfo:algodtl:r',
                'settleinfo:algodtl:s'
            ],

            'query.algoDetail.view'   : ['settleinfo:algodtl:r'],
            'query.algoDetail.search' : ['settleinfo:algodtl:s'],
            'query.algoDetail.refresh' : ['settleinfo:algodtl:s'],

            'menu.trade.rate.sum' : [
                'report:tradingratecollect:s',
                'report:tradingratecollect:p'
            ],

            'tradeRateSum.view': ['report:tradingratecollect:s'],
            'tradeRateSum.refresh': ['report:tradingratecollect:s'],
            'tradeRateSum.download': ['report:tradingratecollect:p'],

            'menu.query.trade.txn' : [
                'settleinfo:ntxn:r',
                'settleinfo:ntxn:s',
                'settleinfo:ntxn:e',
                'settleinfo:ntxn:u'
            ],

            //机构业绩月报表
            'menu.brh.month.report' : 'report:rewardnormbranchmonth:s',
            'brh.month.report.view' : 'report:rewardnormbranchmonth:s',
            'brh.month.report.refresh' : 'report:rewardnormbranchmonth:s',
            //机构业绩日报表
            'menu.brh.day.report' : 'report:rewardnormbranchday:s',
            'brh.day.report.view' :'report:rewardnormbranchday:s',
            'brh.day.report.refresh' :'report:rewardnormbranchday:s',
            //操作员业绩月报表
            'menu.opr.month.report' : 'report:rewardnormoperatormonth:s',
            'opr.month.report.view' : 'report:rewardnormoperatormonth:s',
            'opr.month.report.refresh' : 'report:rewardnormoperatormonth:s',
            //操作员业绩日报表
            'menu.opr.day.report' : 'report:rewardnormoperatorday:s',
            'opr.day.report.view' : 'report:rewardnormoperatorday:s',
            'opr.day.report.refresh' : 'report:rewardnormoperatorday:s',
            //商户终端信息
            'menu.user.terminal.report' : 'report:rewardnormmchtterminalsmonth:s',

            'query.tradeTxn.view'   : ['settleinfo:ntxn:r'],
            'query.tradeTxn.search'   : ['settleinfo:ntxn:s'],
            'query.tradeTxn.refresh'   : ['settleinfo:ntxn:s'],
            'query.tradeTxn.download' : ['settleinfo:ntxn:e'],
            'query.tradeTxn.refreshStatus' : ['settleinfo:ntxn:u'],


            //快速查询权限
            'query.tradeTxn.grid.quickSearch': ['settleinfo:ntxn:s'],

            //工作台修订页面的删除按钮
            'wkb.revise.btn.del': ['wkb:task:d'],

            //一站式查询权限配置
            'menu.mcht.query' : ['settleinfo:onestation:s'],

            'menu.msg.center.list': [
                'message:messagecenter:s',
                'message:messagecenter:r',
                'message:messagecenter:c',
                'message:messagecenter:u',
                'message:messagecenter:rb',
                'message:messagecenter:cancel',
                'message:messagecenter:review'
            ],

            'msg.center.search': ['message:messagecenter:s'],
            'msg.center.refresh': ['message:messagecenter:s'],
            'msg.center.view': ['message:messagecenter:r'],
            'msg.center.add': ['message:messagecenter:c'],
            'msg.center.edit': ['message:messagecenter:u'],
            'msg.center.repeal': ['message:messagecenter:rb'],
            'msg.center.cancel': ['message:messagecenter:cancel'],
            'msg.center.perform': ['message:messagecenter:review'],

            'menu.msg.push.list': [
                'message:messageput:s',
                'message:messageput:r',
                'message:messageput:c',
                'message:messageput:u',
                'message:messageput:rb',
                'message:messageput:cancel',
                'message:messageput:review'
            ],

            'msg.push.search': ['message:messageput:s'],
            'msg.push.refresh': ['message:messageput:s'],
            'msg.push.view': ['message:messageput:r'],
            'msg.push.add': ['message:messageput:c'],
            'msg.push.edit': ['message:messageput:u'],
            'msg.push.repeal': ['message:messageput:rb'],
            'msg.push.cancel': ['message:messageput:cancel'],
            'msg.push.perform': ['message:messageput:review'],

            'menu.sm.push.list': [
                'message:smsput:s',
                'message:smsput:r',
                'message:smsput:c',
                'message:smsput:u',
                'message:smsput:rb',
                'message:smsput:cancel',
                'message:smsput:review',
                'message:smsput:resend'
            ],


            'push.record.search':['message:smsput:s'],
            'push.record.refresh':['message:smsput:s'],
            'push.record.view':['message:smsput:r'],
            'push.record.add':['message:smsput:c'],
            'push.record.edit':['message:smsput:u'],
            'push.record.undo':['message:smsput:rb'],
            'push.record.cancel':['message:smsput:cancel'],
            'push.record.perform':['message:smsput:review'],
            'push.record.resendAll':['message:smsput:resend'],
            'push.record.resendFail':['message:smsput:resend'],

            'menu.report': [], //信息查询菜单

            'perform.report.view': ['report:performance:r'],
            'perform.report.search': ['report:performance:s'],
            'perform.report.download': ['report:performance:p'],

            'rank.view': ['report:performanceorder:r'],
            'rank.search': ['report:performanceorder:s'],
            'rank.download': ['report:performanceorder:p'],

            'menu.report.bank.bundle': [
                'report:reportexport:mtx',
                'report:reportexport:btx',
                'report:reportexport:eto',
                'report:reportexport:mto'
            ],

            'mcht.txn.grid': ['report:reportexport:mtx'],
            'mchtTxn.download': ['report:reportexport:mtxd'],
            'mchtTxn.view': ['report:reportexport:mtx'],

            'org.txn.grid': ['report:reportexport:btx'],
            'orgTxn.download': ['report:reportexport:btxd'],
            'orgTxn.view': ['report:reportexport:btx'],

            'org.explore.sum.grid': ['report:reportexport:eto'],
            'orgExploreSum.download': ['report:reportexport:etod'],
            'orgExploreSum.view': ['report:reportexport:eto'],

            'org.mcht.sum.grid': ['report:reportexport:mto'],
            'orgMchtSum.download': ['report:reportexport:mtod'],
            'orgMchtSum.view': ['report:reportexport:mto'],

            'menu.mcht.topuser': ['mcht:usertmp:s'],

            'menu.report.maintain': [
                'report:mchtcrm:r',
                'report:mchtcrm:s',
                'report:mchtcrm:p'
            ],

            'summary.view': ['report:mchtcrm:r'],
            'mcht.view': ['report:mchtcrm:r'],
            'summary.download': ['report:mchtcrm:p'],
            'mcht.download': ['report:mchtcrm:p'],

            'menu.t0.settle': [],
            //T0清算控制相关权限
            'menu.t0.settle.control'  : [
                't0settle:t0settlecontrol:r',
                't0settle:t0settlecontrol:s',

                't0settle:t0settlecontrol:ts',
                't0settle:t0settlecontrol:ck',
                't0settle:t0settlecontrol:cf',
                't0settle:t0settlecontrol:rc'
            ],

            'settleControl.t0.view'   : ['t0settle:t0settlecontrol:r'],
            'settleControl.t0.search' : ['t0settle:t0settlecontrol:s'],
            'settleControl.t0.refresh': ['t0settle:t0settlecontrol:s'],
            'settleControl.t0.transfer': ['t0settle:t0settlecontrol:ts'],
            'settleControl.t0.check':    ['t0settle:t0settlecontrol:ck'],
            'settleControl.t0.confirm':  ['t0settle:t0settlecontrol:cf'],
            'settleControl.t0.repeal':  ['t0settle:t0settlecontrol:rc'],

            'settleControl.t0.batchTransfer': ['t0settle:t0settlecontrol:ts'],
            'settleControl.t0.batchCheck': ['t0settle:t0settlecontrol:ck'],
            'settleControl.t0.batchConfirm': ['t0settle:t0settlecontrol:cf'],

            //TC清算控制相关权限
            'menu.tc.settle.control'  : [
                'tcsettle:tcsettlecontrol:r',
                'tcsettle:tcsettlecontrol:s',

                'tcsettle:tcsettlecontrol:ts',
                'tcsettle:tcsettlecontrol:ck',
                'tcsettle:tcsettlecontrol:cf',
                'tcsettle:tcsettlecontrol:rc'
            ],
            'settleControl.tc.view'   : ['tcsettle:tcsettlecontrol:r'],
            'settleControl.tc.search' : ['tcsettle:tcsettlecontrol:s'],
            'settleControl.tc.refresh': ['tcsettle:tcsettlecontrol:s'],
            'settleControl.tc.transfer': ['tcsettle:tcsettlecontrol:ts'],
            'settleControl.tc.check':    ['tcsettle:tcsettlecontrol:ck'],
            'settleControl.tc.confirm':  ['tcsettle:tcsettlecontrol:cf'],
            'settleControl.tc.repeal':  ['tcsettle:tcsettlecontrol:rc'],

            'settleControl.tc.batchTransfer': ['tcsettle:tcsettlecontrol:ts'],
            'settleControl.tc.batchCheck': ['tcsettle:tcsettlecontrol:ck'],
            'settleControl.tc.batchConfirm': ['tcsettle:tcsettlecontrol:cf'],
            //T+0批处理主控任务
            'menu.t0.bat.main.ctl.detail'  : [
                't0settle:t0batmainctldetail:r',
                't0settle:t0batmainctldetail:s',
                't0settle:t0batmainctldetail:l'
            ],

            'batMainCtlDetail.t0.view': ['t0settle:t0batmainctldetail:r'],
            'batMainCtlDetail.t0.search': ['t0settle:t0batmainctldetail:s'],
            'batMainCtlDetail.t0.refresh': ['t0settle:t0batmainctldetail:s'],
            'batMainCtlDetail.t0.reStart': ['t0settle:t0batmainctldetail:l'],
            'batMainCtlDetail.t0.startRun': ['t0settle:t0batmainctldetail:l'],
            //T+C批处理主控任务
            'menu.tc.bat.main.ctl.detail'  : [
                'tcsettle:tcbatmainctldetail:r',
                'tcsettle:tcbatmainctldetail:s',
                'tcsettle:tcbatmainctldetail:l'
            ],

            'batMainCtlDetail.tc.view': ['tcsettle:tcbatmainctldetail:r'],
            'batMainCtlDetail.tc.search': ['tcsettle:tcbatmainctldetail:s'],
            'batMainCtlDetail.tc.refresh': ['tcsettle:tcbatmainctldetail:s'],
            'batMainCtlDetail.tc.reStart': ['tcsettle:tcbatmainctldetail:l'],
            'batMainCtlDetail.tc.startRun': ['tcsettle:tcbatmainctldetail:l'],
            //T+0清算汇总
            'menu.t0.settle.sum'  : [
                't0settle:t0settlesum:s',
                't0settle:t0settlesum:st',
                't0settle:t0settlesum:r'
            ],

            'settleSum.t0.view': ['t0settle:t0settlesum:r'],
            'settleSum.t0.search': ['t0settle:t0settlesum:s'],
            'settleSum.t0.refresh': ['t0settle:t0settlesum:s'],
            'settleSum.t0.todo': ['t0settle:t0settlesum:st'],


            //T+C清算汇总
            'menu.tc.settle.sum'  : [
                'tcsettle:tcsettlesum:s',
                'tcsettle:tcsettlesum:st',
                'tcsettle:tcsettlesum:r'
            ],

            'settleSum.tc.view': ['tcsettle:tcsettlesum:r'],
            'settleSum.tc.search': ['tcsettle:tcsettlesum:s'],
            'settleSum.tc.refresh': ['tcsettle:tcsettlesum:s'],
            'settleSum.tc.todo': ['tcsettle:tcsettlesum:st'],

            // T+0 清算流水
            'menu.t0.settle.txn': [
                "t0settle:t0settletxn:r",
                "t0settle:t0settletxn:s",
                "t0settle:t0settletxn:h", //划分批次
                "t0settle:t0settletxn:sd", //单独成批  /single-batch-zero
                "t0settle:t0settletxn:ss", //暂停清算  /stop-settle-zero
                "t0settle:t0settletxn:rs", //恢复清算
                "t0settle:t0settletxn:ok", //设为成功
                "t0settle:t0settletxn:p" //导出excel表
            ],

            'settleTxn.t0.view': ['t0settle:t0settletxn:r'],
            'settleTxn.t0.search': ['t0settle:t0settletxn:s'],
            'settleTxn.t0.refresh': ['t0settle:t0settletxn:s'],
            'settleTxn.t0.check': ['t0settle:t0settletxn:ck'],
            'settleTxn.t0.download': ['t0settle:t0settletxn:p'],
            'settleTxn.t0.singleBatch': ['t0settle:t0settletxn:sd'],
            'settleTxn.t0.divideBatch': ['t0settle:t0settletxn:h'],
            'settleTxn.t0.stopSettle': ['t0settle:t0settletxn:ss'],
            'settleTxn.t0.recoverySettle': ['t0settle:t0settletxn:rs'],
            'settleTxn.t0.setSuccess': ['t0settle:t0settletxn:ok'],
            'settleTxn.t0.history': 't0settle:t0settletxn:s',


            // T+C 清算流水相关权限
            'menu.tc.settle.txn': [
                "tcsettle:tcsettletxn:r",
                "tcsettle:tcsettletxn:s",
                "tcsettle:tcsettletxn:h", //划分批次
                "tcsettle:tcsettletxn:sd", //单独成批  /single-batch-zero
                "tcsettle:tcsettletxn:ss", //暂停清算  /stop-settle-zero
                "tcsettle:tcsettletxn:rs", //恢复清算
                "tcsettle:tcsettletxn:ok", //设为成功
                "tcsettle:tcsettletxn:p" //导出excel表
            ],

            'settleTxn.tc.view': ['tcsettle:tcsettletxn:r'],
            'settleTxn.tc.search': ['tcsettle:tcsettletxn:s'],
            'settleTxn.tc.refresh': ['tcsettle:tcsettletxn:s'],
            'settleTxn.tc.check': ['tcsettle:tcsettletxn:ck'],
            'settleTxn.tc.download': ['tcsettle:tcsettletxn:p'],
            'settleTxn.tc.singleBatch': ['tcsettle:tcsettletxn:sd'],
            'settleTxn.tc.divideBatch': ['tcsettle:tcsettletxn:h'],
            'settleTxn.tc.stopSettle': ['tcsettle:tcsettletxn:ss'],
            'settleTxn.tc.recoverySettle': ['tcsettle:tcsettletxn:rs'],
            'settleTxn.tc.setSuccess': ['tcsettle:tcsettletxn:ok'],
            'settleTxn.tc.history': ['tcsettle:tcsettletxn:s'],


            //T0流水-清算失败表
            'menu.settle.t0.error':[
                't0settle:settleerror:s',
                't0settle:settleerror:c',
                't0settle:settleerror:sp',
                't0settle:settleerror:yy',
                't0settle:settleerror:qs',
                't0settle:settleerror:p'
            ],
            'settleT0Error': ['t0settle:settleerror:s'],
            'settleT0Error.view': ['t0settle:settleerror:s'],
            'settleT0Error.refresh': ['t0settle:settleerror:s'],
            'settleT0Error.search': ['t0settle:settleerror:s'],
            'settleT0Error.add': ['t0settle:settleerror:c'],//新增
            'settleT0Error.autoDo': ['t0settle:settleerror:sp'],//自动成批
            'settleT0Error.operateDo': ['t0settle:settleerror:yy'],//运营人员处理
            'settleT0Error.settleDo': ['t0settle:settleerror:qs'],//清算人员处理
            'settleT0Error.download': ['t0settle:settleerror:p'],//下载
            'settleT0Error.errorDataImport': ['t0settle:settleerror:c'],

            //ps: 公告里面的资源，跟管理者有关的就是 notice.mgr 开头， 接收者就是 notice
            'menu.notice.mgr': [
                'announce:annoumanage:o'//管理员对公告的所有操作，定义为同一个权限码
            ],

            'menu.notice': [
                'announce:annoureceive:r'
            ],

            /**
             * 客服短信发送配置
             * */
            'menu.customer.sms.list': [
                'customer:smsput:s'
            ],
            'customerSms':'customer:smsput:s',
            'customerSms.view':'customer:smsput:s',
            'customerSms.refresh':'customer:smsput:s',
            'customerSms.search':'customer:smsput:s',
            'customerSms.templateConfig':'message:terminals:s',//消息管理>>短信模板配置按钮
            'customerSms.smsConfig':'customer:message:u',//客服短信发送配置>>短信发送配置

            //消息管理>>短信模板配置
            'templateConfig': 'message:terminals:s',
            'templateConfig.view': 'message:terminals:s',
            'templateConfig.refresh': 'message:terminals:s',
            'templateConfig.search': 'message:terminals:s',
            'templateConfig.add': 'customer:smsput:c',//新增
            'templateConfig.del': 'customer:smsput:d',//删除
            'templateConfig.edit': 'customer:smsput:u',//修改


            /*'menu.service.manager.list': [
             'service:servicetable:s',
             'service:servicetable:c',
             'service:servicetable:ut',
             'service:servicetable:uo',
             'service:servicetable:st',
             'service:servicetable:so',
             'service:servicetable:sm'
             ],*/

            'menu.operate.txn': ['operationtools:signorder:s'],
            'operate.txn.export.transaction': ['operationtools:signorder:s'],
            'operate.txn.export.refresh': ['operationtools:signorder:s'],
            'operate.txn.export.view': ['operationtools:signorder:s'],

            //公众号提额管理——菜单权限 [查询微信提额记录列表, 根据审批编号获取单笔提额记录, 审批提额申请]
            'menu.operate.raiseAmount': ['raiseamount:get:creditlist', 'raiseamount:get:onecredit', 'raiseamount:audit:credit'],
            //公众号提额管理权限码——页面权限 [查询微信提额记录列表, 根据审批编号获取单笔提额记录, 审批提额申请]
            'page.raiseAmount':['raiseamount:get:creditlist', 'raiseamount:get:onecredit', 'raiseamount:audit:credit'], //页面
            'page.raiseAmount.refresh':['raiseamount:get:creditlist', 'raiseamount:get:onecredit', 'raiseamount:audit:credit'], //页面的刷新按钮
            'page.raiseAmount.edit':['raiseamount:get:creditlist', 'raiseamount:get:onecredit', 'raiseamount:audit:credit'], //页面的审核按钮
            'page.raiseAmount.view':['raiseamount:get:creditlist', 'raiseamount:get:onecredit'], //页面的详情按钮

            //来电弹屏
            'menu.operate.serviceTelephone': [
                'operationtools:servicetelephone:s'
            ],
            //交易应答码 -->有卡
            'menu.replyCodeQuery.hasCard':[
                'trade:answercode:a',
                'trade:answercode:r',
                'trade:answercode:e',
                'trade:answercode:b',
                'trade:answercode:d'
            ],
            'reply.code.add':['trade:answercode:a'], //新增
            'reply.code.search':['trade:answercode:r'], //搜索查看
            'reply.code.view':['trade:answercode:r'], //详情查看
            'reply.code.edit':['trade:answercode:e'], //修改
            'reply.code.del':['trade:answercode:d'], //删除
            'reply.code.replyCodeImport':['trade:answercode:b'], //批量导入

            //交易应答码 -->无卡
            'menu.replyCodeQuery.noCard':[
                'trade:onlineanswercode:a',
                'trade:onlineanswercode:r',
                'trade:onlineanswercode:e',
                'trade:onlineanswercode:b',
                'trade:onlineanswercode:d'
            ],
            'replyCode.noCard.add':['trade:onlineanswercode:a'],   //新增
            'replyCode.noCard.search':['trade:onlineanswercode:r'], //搜索查看
            'replyCode.noCard.view':['trade:onlineanswercode:r'], //详情查看
            'replyCode.noCard.edit':['trade:onlineanswercode:e'], //修改
            'replyCode.noCard.del':['trade:onlineanswercode:d'], //删除
            'replyCode.noCard.replyCodeImport':['trade:onlineanswercode:b'], //批量导入

            //进件黑名单
            'menu.operate.blacklist': [
                'black:list:s',
                'black:list:c',
                'black:list:u',
                'black:list:us',
                'black:list:b',
                'black:list:d'
            ],
            'operate.blacklist.view':['black:list:s'],
            'operate.blacklist.search':['black:list:s'],
            'operate.blacklist.refresh':['black:list:s'],
            'operate.blacklist.add':['black:list:c'],
            'operate.blacklist.edit':['black:list:u'],
            'operate.blacklist.changeStatus':['black:list:us'],
            'operate.blacklist.import':['black:list:b'],
            'operate.blacklist.blackListImport':['black:list:d'],

            'menu.discount.coupon': [
                'discount:coupon:c',
                'discount:coupon:s'
            ],
            //'discountCoupon': 'discount:coupon:s',
            'discountCoupon.add': 'discount:coupon:c',
            'discountCoupon.view': 'discount:coupon:s',
            'discountCoupon.refresh': 'discount:coupon:s',

            'menu.discount.accountTrade': [
                'accmanager:account:z'
            ],
            //'accountTrade': 'ccmanager:account:z',
            'accountTrade.refresh': 'ccmanager:account:z',
            'accountTrade.view': 'ccmanager:account:z',

            //通道商户管理
            'menu.operate.cmcht': [
                'operationtools:cmcht:s', //查找
                'operationtools:cmcht:c', //新增
                'operationtools:cmcht:e', //编辑
                'operationtools:cmcht:i', //导入
                'operationtools:cmcht:d' //删除
            ],
            'operate.cmcht.add': 'operationtools:cmcht:c',
            'operate.cmcht.del': 'operationtools:cmcht:d',
            'operate.cmcht.search': 'operationtools:cmcht:s',
            'operate.cmcht.refresh': 'operationtools:cmcht:s',
            'operate.cmcht.view': 'operationtools:cmcht:s',
            'operate.cmcht.edit': 'operationtools:cmcht:e',
            'operate.cmcht.import': 'operationtools:cmcht:i',
            'operate.cmcht.export': 'operationtools:cmcht:i',
            'operate.cmcht.changestate': 'operationtools:cmcht:e',
            'operate.cmcht.changestatus': 'operationtools:cmcht:e',

            //同步HF商户
            'menu.operate.sync.hfmcht': ["mcht:base:hfsych"],

            //统一同步商户信息渠道属性管理功能与配置
            'menu.operate.sync.mchtChannel': [
                'settle:channel:s',
                'settle:channel:c',
                'settle:channel:e',
                'settle:channel:d',
                'settle:channel:u'
            ],
            'operate.sync.mchtChannel.view': 'settle:channel:s',
            'operate.sync.mchtChannel.refresh': 'settle:channel:s',
            'operate.sync.mchtChannel.add': 'settle:channel:c',
            'operate.sync.mchtChannel.edit': 'settle:channel:e',
            'operate.sync.mchtChannel.del': 'settle:channel:d',
            'operate.sync.mchtChannel.updateStatus': 'settle:channel:u',

            //商机查询
            'menu.operate.business': [
                'buss:oppr:s',
                'buss:oppr:p'
            ],
            'operate.business.view': ['buss:oppr:s'],
            'operate.business.refresh': ['buss:oppr:s'],
            'operate.business.viewMcht': 'buss:oppr:p', //用户信息查询

            //便民查询
            'menu.operate.convenience': [
                'handy:service:s',
                'handy:service:i'
            ],
            'operate.convenience.refresh': 'handy:service:s',
            'operate.convenience.view': 'handy:service:s',
            'operate.convenience.download': 'handy:service:i',

            //渠道商户维护
            'menu.operate.mchtCupsName': [
                'mcht:channel:s',
                'mcht:channel:c',
                'mcht:channel:u',
                'mcht:channel:b'
            ],
            'mchtCupsName.view': 'mcht:channel:s',
            'mchtCupsName.add': 'mcht:channel:c',
            'mchtCupsName.edit': 'mcht:channel:u',
            'mchtCupsName.batchImport': 'mcht:channel:b',

            //订单查询
            'menu.order.search': [
                'operationtools:ordersearch:s',
                'operationtools:ordersearch:p'
            ],
            'operate.order.search.refresh': ['operationtools:ordersearch:s'],
            'operate.order.search.search': ['operationtools:ordersearch:s'],
            'operate.order.search.view': ['operationtools:ordersearch:s'],
            'operate.order.search.download': ['operationtools:ordersearch:p'],
            'operate.order.search.work': ['operationtools:ordersearch:s'],//处理按钮

            //二清实时规则
            'menu.route.config': [
                'route:txmodle:c',
                'route:txmodle:d',
                'route:txmodle:s',
                'route:txmodle:u'
            ],
            'route.config.editbind': ['route:txmodle:u'],
            'route.config.trade.add': ['route:txmodle:c'],
            'route.config.trade.edit': ['route:txmodle:u'],
            'route.config.trade.del': ['route:txmodle:d'],
            'route.config.channel.add': ['route:txmodle:c'],
            'route.config.channel.edit': ['route:txmodle:u'],
            'route.config.channel.del': ['route:txmodle:d'],
            'route.config.mcht.add': ['route:txmodle:c'],
            'route.config.mcht.edit': ['route:txmodle:u'],
            'route.config.mcht.del': ['route:txmodle:d'],
            'route.config.mcht.upload': ['route:txmodle:u'],

            //二清通道详情
            'menu.route.channel': [
                'route:channelmodle:c',
                'route:channelmodle:d',
                'route:channelmodle:u',
                'route:channelmodle:s'
            ],
            'route.channel.grid.add': ['route:channelmodle:c'],
            'route.channel.grid.del': ['route:channelmodle:d'],
            'route.channel.grid.edit': ['route:channelmodle:u'],
            'route.channel.grid.view': ['route:channelmodle:s'],
            'route.channel.grid.search': ['route:channelmodle:s'],
            'route.channel.grid.refresh': ['route:channelmodle:s'],
            'route.channel.grid.editStatus': ['route:channelmodle:u'],

            //商户号模型
            'menu.route.mcht':  [
                'route:channelmchtmodle:c',
                'route:channelmchtmodle:d',
                'route:channelmchtmodle:u',
                'route:channelmchtmodle:s',
                'route:channelmchtmodle:i'
            ],
            'route.mcht.grid.add': ['route:channelmchtmodle:c'],
            'route.mcht.grid.del': ['route:channelmchtmodle:d'],
            'route.mcht.grid.edit': ['route:channelmchtmodle:u'],
            'route.mcht.grid.view': ['route:channelmchtmodle:s'],
            'route.mcht.grid.refresh': ['route:channelmchtmodle:s'],
            'route.mcht.grid.upload': ['route:channelmchtmodle:i'],

            //通道属性配置
            'menu.channel.attr.config':[
                'r:cha:param:c',
                'r:cha:param:u',
                'r:cha:param:s'
            ],
            'channel.attr.config.add':['r:cha:param:c'],
            'channel.attr.config.edit':['r:cha:param:u'],
            'channel.attr.config.view':['r:cha:param:s'],
            'channel.attr.config.refresh':['r:cha:param:s'],
            'channel.attr.config.changestate':['r:cha:param:u'],

            //一清商户配置
            'menu.onesettle.mcht.config':[
                'onesettle:mcht:s',
                'onesettle:mcht:c',
                'onesettle:mcht:u',
                'onesettle:mcht:us',
                'onesettle:mcht:d',
                'onesettle:mcht:b'
            ],
            'onesettle.mcht.config.add':['onesettle:mcht:c'],
            'onesettle.mcht.config.edit':['onesettle:mcht:u'],
            'onesettle.mcht.config.view':['onesettle:mcht:s'],
            'onesettle.mcht.config.refresh':['onesettle:mcht:s'],
            'onesettle.mcht.config.changestate':['onesettle:mcht:us'],
            'onesettle.mcht.config.upload':['onesettle:mcht:b'],
            'onesettle.mcht.config.editStatus':['onesettle:mcht:us'],

            //二清实时规则(无卡)
            'menu.nocard.route.config': [
                'onlineroute:txmodle:c',
                'onlineroute:txmodle:d',
                'onlineroute:txmodle:u',
                'onlineroute:channelmodle:c',
                'onlineroute:channelmodle:d',
                'onlineroute:channelmodle:u',
                'onlineroute:channelmchtmodle:c',
                'onlineroute:channelmchtmodle:d',
                'onlineroute:channelmchtmodle:u',
                'onlineroute:channelmchtmodle:i'
            ],
            'nocard.route.config.editbind': ['onlineroute:txmodle:u'],
            'nocard.route.config.trade.add': ['onlineroute:txmodle:c'],
            'nocard.route.config.trade.edit': ['onlineroute:txmodle:u'],
            'nocard.route.config.trade.del': ['onlineroute:txmodle:d'],
            'nocard.route.config.channel.add': ['onlineroute:channelmodle:c'],
            'nocard.route.config.channel.edit': ['onlineroute:channelmodle:u'],
            'nocard.route.config.channel.del': ['onlineroute:channelmodle:d'],
            'nocard.route.config.mcht.add': ['onlineroute:channelmchtmodle:c'],
            'nocard.route.config.mcht.edit': ['onlineroute:channelmchtmodle:u'],
            'nocard.route.config.mcht.del': ['onlineroute:channelmchtmodle:d'],
            'nocard.route.config.mcht.upload': ['onlineroute:channelmchtmodle:i'],

            //二清通道详情(无卡)
            'menu.nocard.route.channel': [
                'onlineroute:channelmodle:c',
                'onlineroute:channelmodle:d',
                'onlineroute:channelmodle:u',
                'onlineroute:channelmodle:s'
            ],
            'nocard.route.channel.grid.add': ['onlineroute:channelmodle:c'],
            'nocard.route.channel.grid.del': ['onlineroute:channelmodle:d'],
            'nocard.route.channel.grid.edit': ['onlineroute:channelmodle:u'],
            'nocard.route.channel.grid.view': ['onlineroute:channelmodle:s'],
            'nocard.route.channel.grid.search': ['onlineroute:channelmodle:s'],
            'nocard.route.channel.grid.refresh': ['onlineroute:channelmodle:s'],
            'nocard.route.channel.grid.editStatus': ['onlineroute:channelmodle:u'],

            //商户号模型(无卡)
            'menu.nocard.route.mcht':  [
                'onlineroute:channelmchtmodle:c',
                'onlineroute:channelmchtmodle:d',
                'onlineroute:channelmchtmodle:u',
                'onlineroute:channelmchtmodle:s',
                'onlineroute:channelmchtmodle:i'
            ],
            'nocard.route.mcht.grid.add': ['onlineroute:channelmchtmodle:c'],
            'nocard.route.mcht.grid.del': ['onlineroute:channelmchtmodle:d'],
            'nocard.route.mcht.grid.edit': ['onlineroute:channelmchtmodle:u'],
            'nocard.route.mcht.grid.view': ['onlineroute:channelmchtmodle:s'],
            'nocard.route.mcht.grid.refresh': ['onlineroute:channelmchtmodle:s'],
            'nocard.route.mcht.grid.upload': ['onlineroute:channelmchtmodle:i'],

            //通道属性配置(无卡)
            'menu.nocard.channel.attr.config':[
                'o:cha:param:c',
                'o:cha:param:u',
                'o:cha:param:s'
            ],
            'nocard.channel.attr.config.add':['o:cha:param:c'],
            'nocard.channel.attr.config.edit':['o:cha:param:u'],
            'nocard.channel.attr.config.view':['o:cha:param:s'],
            'nocard.channel.attr.config.refresh':['o:cha:param:s'],
            'nocard.channel.attr.config.changestate':['o:cha:param:u'],

            //一清商户配置(无卡)
            'menu.nocard.route.mcht.config':[
                'online:mcht:s',
                'online:mcht:c',
                'online:mcht:u',
                'online:mcht:us',
                'online:mcht:d',
                'online:mcht:b'
            ],
            'nocard.route.mcht.config.add':['online:mcht:c'],
            'nocard.route.mcht.config.edit':['online:mcht:u'],
            'nocard.route.mcht.config.view':['online:mcht:s'],
            'nocard.route.mcht.config.refresh':['online:mcht:s'],
            'nocard.route.mcht.config.changestate':['online:mcht:us'],
            'nocard.route.mcht.config.upload':['online:mcht:b'],
            'nocard.route.mcht.config.editStatus':['online:mcht:us'],

            //结算路由
            'menu.route.settlement.channelConfig': [
                'settleroute:channelmodle:s',
                'settleroute:channelmodle:c',
                'settleroute:channelmodle:u',
                'settleroute:channelmodle:d'
            ],
            'route.settlement.channelConfig.view': 'settleroute:channelmodle:s',
            'route.settlement.channelConfig.refresh': 'settleroute:channelmodle:s',
            'route.settlement.channelConfig.add': 'settleroute:channelmodle:c',
            'route.settlement.channelConfig.edit': 'settleroute:channelmodle:u',
            'route.settlement.channelConfig.del': 'settleroute:channelmodle:d',

            //代扣路由-通道产品模型
            'menu.route.withhold.channelProductConfig': [
                'withholdroute:channelmodle:s',
                'withholdroute:channelmodle:c',
                'withholdroute:channelmodle:u',
                'withholdroute:channelmodle:us',
                'withholdroute:channelmodle:d'
            ],
            'route.withhold.channelProductConfig.view': 'withholdroute:channelmodle:s',
            'route.withhold.channelProductConfig.add': 'withholdroute:channelmodle:c',
            'route.withhold.channelProductConfig.edit': 'withholdroute:channelmodle:u',
            'route.withhold.channelProductConfig.changestate': 'withholdroute:channelmodle:us',
            'route.withhold.channelProductConfig.del': 'withholdroute:channelmodle:d',

            //代扣路由-产品模型
            'menu.route.withhold.productConfig': [
                'withholdroute:productmodle:s',
                'withholdroute:productmodle:c',
                'withholdroute:productmodle:u',
                'withholdroute:productmodle:d',
                'withholdroute:productmodle:us'
            ],
            'route.productConfig.grid.view': 'withholdroute:productmodle:s',
            'route.productConfig.grid.add': 'withholdroute:productmodle:c',
            'route.productConfig.grid.edit': 'withholdroute:productmodle:u',
            'route.productConfig.grid.del': 'withholdroute:productmodle:d',
            'route.productConfig.grid.changestate': 'withholdroute:productmodle:us',

            //代扣路由-基本信息
            'menu.route.withhold.channelRouter': [
                'withholdroute:channelmodle:s',
                'withholdroute:channelmodle:c',
                'withholdroute:channelmodle:u',
                'withholdroute:channelmodle:d',
                'withholdroute:basechannel:us'
            ],
            'route.withhold.channelRouter.view': 'withholdroute:channelmodle:s',
            'route.withhold.channelRouter.refresh': 'withholdroute:channelmodle:s',
            'route.withhold.channelRouter.add': 'withholdroute:channelmodle:c',
            'route.withhold.channelRouter.edit': 'withholdroute:channelmodle:u',
            'route.withhold.channelRouter.del': 'withholdroute:channelmodle:d',
            'route.withhold.channelRouter.changestate': 'withholdroute:basechannel:us',

            //通道出款容量配置
            'menu.route.settlement.capacityConfig': [
                'settleroute:channelrule:s',
                'settleroute:channelrule:c',
                'settleroute:channelrule:u',
                'settleroute:channelrule:d'
            ],
            'route.settlement.capacityConfig.view': 'settleroute:channelrule:s',
            'route.settlement.capacityConfig.refresh': 'settleroute:channelrule:s',
            'route.settlement.capacityConfig.add': 'settleroute:channelrule:c',
            'route.settlement.capacityConfig.edit': 'settleroute:channelrule:u',
            'route.settlement.capacityConfig.del': 'settleroute:channelrule:d',

            //通道出款容量配置
            'menu.route.settlement.regularConfig': [
                'settleroute:channelspecial:s',
                'settleroute:channelspecial:c',
                'settleroute:channelspecial:u',
                'settleroute:channelspecial:d'
            ],
            'route.settlement.regularConfig.view': 'settleroute:channelspecial:s',
            'route.settlement.regularConfig.refresh': 'settleroute:channelspecial:s',
            'route.settlement.regularConfig.add': 'settleroute:channelspecial:c',
            'route.settlement.regularConfig.edit': 'settleroute:channelspecial:u',
            'route.settlement.regularConfig.del': 'settleroute:channelspecial:d',


            //优惠方案模型
            'menu.promotions.model': [
                'promotion:mod:s', //查找
                'promotion:mod:c', //新增
                'promotion:mod:e', //修改
                'promotion:mod:d' //删除
            ],
            'promotions.model.add': ['promotion:mod:c'],
            'promotions.model.edit': ['promotion:mod:e'],
            'promotions.model.del': ['promotion:mod:d'],
            'promotions.model.search': ['promotion:mod:s'],
            'promotions.model.refresh': ['promotion:mod:s'],

            //优惠对象管理
            'menu.promotions.management': [
                'promotion:obj:s', //查找
                'promotion:obj:c', //新增
                'promotion:obj:e', //修改
                'promotion:obj:i', //导入
                'promotion:obj:d' //删除
            ],
            'promotions.management.add': ['promotion:obj:c'],
            'promotions.management.edit': ['promotion:obj:e'],
            'promotions.management.del': ['promotion:obj:d'],
            'promotions.management.export': ['promotion:obj:i'],
            'promotions.management.search': ['promotion:obj:s'],
            'promotions.management.refresh': ['promotion:obj:s'],
            'promotions.management.view': ['promotion:obj:s'],

            //会议管理
            'menu.meeting.launch': [
                'meeting:action:c',
                'meeting:action:u'
            ],
            'meeting.launch.create': ['meeting:action:c'],
            'meeting.launch.refresh': ['meeting:action:c'],
            'meeting.launch.changestate': ['meeting:action:u'],

            //T0秒到
            'menu.t0.faster.txn':[
                't0fastsettle:tcsettletxn:s',
                't0fastsettle:tcsettletxn:p',
                't0fastsettle:tcsettletxn:del',
                't0fastsettle:tcsettletxn:sd',
                't0fastsettle:tcsettletxn:h',
                't0fastsettle:tcsettletxn:ss',
                't0fastsettle:tcsettletxn:rs',
                't0fastsettle:tcsettletxn:ok'
            ],
            'settleFasterTxn.view':['t0fastsettle:tcsettletxn:s'],
            'settleFasterTxn.refresh':['t0fastsettle:tcsettletxn:s'],
            'settleFasterTxn.search':['t0fastsettle:tcsettletxn:s'],
            'settleFasterTxn.download':['t0fastsettle:tcsettletxn:p'],
            'settleFasterTxn.changestate':['t0fastsettle:tcsettletxn:del'],
            'settleFasterTxn.history': 't0fastsettle:tcsettletxn:s',

            'settleFasterTxn.checkedAll':       't0fastsettle:tcsettletxn:s',
            'settleFasterTxn.singleBatch':      't0fastsettle:tcsettletxn:sd',
            'settleFasterTxn.divideBatch':      't0fastsettle:tcsettletxn:h',
            'settleFasterTxn.stopSettle':       't0fastsettle:tcsettletxn:ss',
            'settleFasterTxn.recoverySettle':   't0fastsettle:tcsettletxn:rs',
            'settleFasterTxn.setSuccess':       't0fastsettle:tcsettletxn:ok',


            //T0秒到-清算控制--->等于s0
            'menu.t0.faster.control':[
                's0settle:s0settlecontrol:s',
                's0settle:s0settlecontrol:ts',
                's0settle:s0settlecontrol:ck',
                's0settle:s0settlecontrol:cf'
            ],
            'settleFasterControl':'s0settle:s0settlecontrol:s',
            'settleFasterControl.view':'s0settle:s0settlecontrol:s',
            'settleFasterControl.refresh':'s0settle:s0settlecontrol:s',
            'settleFasterControl.search':'s0settle:s0settlecontrol:s',
            'settleFasterControl.batchTransfer':'s0settle:s0settlecontrol:ts',//推送
            'settleFasterControl.batchCheck':'s0settle:s0settlecontrol:ck',//对账
            'settleFasterControl.batchConfirm':'s0settle:s0settlecontrol:cf',//汇总
            //行权限
            'settleFasterControl.transfer':'s0settle:s0settlecontrol:ts',//推送
            'settleFasterControl.check':'s0settle:s0settlecontrol:ck',//对账
            'settleFasterControl.confirm':'s0settle:s0settlecontrol:cf',//汇总

            //S0秒到-清算失败表
            'menu.t0.faster.error':[
                's0settle:settleerror:s',
                's0settle:settleerror:c',
                's0settle:settleerror:sp',
                's0settle:settleerror:yy',
                's0settle:settleerror:qs',
                's0settle:settleerror:p'
            ],
            'settleFasterError': ['s0settle:settleerror:s'],
            'settleFasterError.view': ['s0settle:settleerror:s'],
            'settleFasterError.refresh': ['s0settle:settleerror:s'],
            'settleFasterError.search': ['s0settle:settleerror:s'],
            'settleFasterError.add': ['s0settle:settleerror:c'],//新增
            'settleFasterError.autoDo': ['s0settle:settleerror:sp'],//自动成批
            'settleFasterError.operateDo': ['s0settle:settleerror:yy'],//运营人员处理
            'settleFasterError.settleDo': ['s0settle:settleerror:qs'],//清算人员处理
            'settleFasterError.download': ['s0settle:settleerror:p'],//下载
            'settleFasterError.errorDataImport': ['s0settle:settleerror:c'],

            //运营工具->钱盒增值服务配置
            'menu.cashbox.config':[
                'operationtools:cbservicelist:s','operationtools:cbservicelist:c','operationtools:cbservicelist:u','operationtools:cbservicelist:d',
                'service:targer:config:s','service:targer:config:s','service:targer:config:c','service:targer:config:d'
            ],
            'cashbox.config.view':['operationtools:cbservicelist:s'],
            'cashbox.config.refresh':['operationtools:cbservicelist:s'],
            'cashbox.config.search':['operationtools:cbservicelist:s'],
            'cashbox.config.add':['operationtools:cbservicelist:c'],
            'cashbox.config.edit':['operationtools:cbservicelist:u'],
            'cashbox.config.del':['operationtools:cbservicelist:d'],
            'cashbox.config.serviceObjConfig':['operationtools:cbservicelist:u'],

            //运营工具->钱盒后台管理
            'menu.cashbox.manage':['product:cashboxrefreshconfig:all'],
            'operate.cashboxconfig.view':['operationtools:cbservicelist:s'],
            'operate.cashboxconfig.refresh':['operationtools:cbservicelist:s'],
            'operate.cashboxconfig.search':['operationtools:cbservicelist:s'],
            'operate.cashboxconfig.add':['operationtools:cbservicelist:c'],
            'operate.cashboxconfig.edit':['operationtools:cbservicelist:u'],
            'operate.cashboxconfig.del':['operationtools:cbservicelist:d'],
            'operate.cashboxconfig.serviceObjConfig':['operationtools:cbservicelist:u'],

            //运营工具->资金池配置
            'menu.cashpool.config': [
                'product:cashpool:s',
                'product:cashpool:a',
                'product:cashpool:u',
                'product:cashpool:d',
                'product:cashpool:op'
            ],
            'cashpool.config.view':['product:cashpool:s', 'product:cashpool:op'],
            'cashpool.config.refresh':['product:cashpool:s', 'product:cashpool:op'],
            //'cashpool.config.search':['product:cashpool:s'],
            'cashpool.config.add':['product:cashpool:a'],
            'cashpool.config.edit':['product:cashpool:u'],
            'cashpool.config.del':['product:cashpool:d'],
            'cashpool.config.operate':['product:cashpool:op'],//给运维单独的权限 屏蔽

            //运营工具->资金池变更
            'menu.cashpool.change': [
                'product:cashpoollog:s'
            ],
            'cashpool.change.view':['product:cashpoollog:s'],
            'cashpool.change.refresh':['product:cashpoollog:s'],
            'cashpool.change.search':['product:cashpoollog:s'],

            //运营工具->钱盒增值服务配->服务管理
            'service.targer.view': ['service:targer:config:s'],//服务对象配置 详情
            'service.targer.search': ['service:targer:config:s'],//服务对象配置 查询
            'service.targer.refresh': ['service:targer:config:s'],//服务对象配置 刷新
            'service.targer.add': ['service:targer:config:c'],//服务对象配置 新增
            'service.targer.edit': ['service:targer:config:c'],//服务对象配置 修改
            'service.targer.del': ['service:targer:config:d'],//服务对象配置 删除

            'menu.param.version.ctrl': [
                'client:version:s',
                'client:version:a',
                'client:version:u',
                'client:version:d'
            ],
            'versionCtrl' : 'client:version:s',
            'versionCtrl.search' : 'client:version:s',
            'versionCtrl.view' : 'client:version:s',
            'versionCtrl.refresh' : 'client:version:s',
            'versionCtrl.add' : 'client:version:a',
            'versionCtrl.edit' : 'client:version:u',
            'versionCtrl.del' : 'client:version:d',

            // 机构迁移
            /*'menu.data.move.org': [
                'datamove:brh:s',
                'datamove:brh:init',
                'datamove:brh:action',
                'datamove:brh:d',
                'datamove:brh:log'
            ],
            'data.move.org.init': 'datamove:brh:init',
            'data.move.org.clean': 'datamove:brh:d',
            'data.move.org.moveTo': 'datamove:brh:action',
            'data.move.org.log': 'datamove:brh:log',*/

            // 商户迁移
            /*'menu.data.move.mcht': [
                'datamove:mcht:s',
                'datamove:mcht:init',
                'datamove:mcht:action',
                'datamove:mcht:d',
                'datamove:mcht:log'
            ],
            'data.move.mcht.init': 'datamove:mcht:init',
            'data.move.mcht.clean': 'datamove:mcht:d',
            'data.move.mcht.moveTo': 'datamove:mcht:action',
            'data.move.mcht.log': 'datamove:mcht:log',*/

            // 拓展员迁移
            /*'menu.data.move.user': [
                'datamove:opr:s',
                'datamove:opr:init',
                'datamove:opr:action',
                'datamove:opr:d',
                'datamove:opr:log'
            ],
            'data.move.user.init': 'datamove:opr:init',
            'data.move.user.clean': 'datamove:opr:d',
            'data.move.user.moveTo': 'datamove:opr:action',
            'data.move.user.log': 'datamove:opr:log',*/

            //工作台
            'menu.wkb.task': [
                //工作台任务，工作台属于系统管理模块
                'wkb:task:c',
                'wkb:task:r',
                'wkb:task:s',
                'wkb:task:u',
                'wkb:task:d'
            ],

            'menu.wkb.taskList': [
                'wkb:taskinfo:s',
                'wkb:taskinfo:r',
                'wkb:taskinfo:su',
                'wkb:taskinfo:dt',
                'mcht:verifyonline:deal'//商审
            ],

            //任务  单独开给商审
            'menu.wkb.task.mcht':[
                'mchtwkb:taskinfo:pr',//商审审核模块
                'mchtwkb:taskinfo:s',//查询
                'mcht:verifyonline:s',
                'mcht:verifyonline:inorout'
            ],
            'menu.wkb.mchttask.countDown'   : 'mchtwkb:taskinfo:s',//倒计时 权限（只有商审可以看到）
            'menu.blacklist.credentials'    : 'wkb:task:s',//黑名单 重复证件列表
            'credentialsList.view'          : 'wkb:task:s',//黑名单 重复证件列表

            //任务管理 商审在线管理
            //'menu.task.management.config'   : 'mcht:verifyonline:s',
            //'task.Management.view'          : 'mcht:verifyonline:s',
            //'task.Management.search'        : 'mcht:verifyonline:s',
            //'task.Management.refresh'       : 'mcht:verifyonline:s',
            'task.Management.down'          : 'mcht:verifyonline:deal',//处理按钮
            'task.Management.verifyonlines' : 'mcht:verifyonline:inorout',//签到/签退按钮

            //账户管理-账户管理
            'menu.accountConfig.management': [
                'accmanager:mainacc:s',//账户管理
                'accmanager:mainacc:e',
                'accmanager:mainacccard:b',//绑定卡
                'accmanager:mainacccard:e',
                'accmanager:subacc:s',//子账户查询
                'accmanager:subacc:e',//子账户修改
                'accmanager:mainacc:s'//用户查询管理
            ],
            //账户管理
            'accountConfig.view': 'accmanager:mainacc:s',
            'accountConfig.refresh': 'accmanager:mainacc:s',
            'accountConfig.changeStatus': 'accmanager:mainacc:e',
            'accountConfig.bindAccountView': 'accmanager:mainacccard:b',
            'accountConfig.childAccountView': 'accmanager:subacc:s',

            //账户管理-账户管理-绑定卡
            'bindAccountView': 'accmanager:mainacccard:b',
            'bindAccount.view':'accmanager:mainacccard:b',
            'bindAccount.refresh':'accmanager:mainacccard:b',
            'bindAccount.changeStatus': 'accmanager:mainacccard:e',


            //账户管理-账户管理-子账户
            'accountSub': 'accmanager:subacc:s',
            'accountSub.view': 'accmanager:subacc:s',
            'accountSub.refresh': 'accmanager:subacc:s',
            'accountSub.changeStatus': 'accmanager:subacc:e',
            'accountSub.changeFreeze': 'accmanager:subacc:e',
            //'accountSub.changeUnFreeze': 'accmanager:subacc:s',//下一版本需求

            //账户管理-用户查询管理
            'accountInfo': 'accmanager:mainacc:s',
            'accountInfo.view': 'accmanager:mainacc:s',
            'accountInfo.refresh': 'accmanager:mainacc:s',
            'accountInfo.accountView': 'accmanager:mainacc:s',

            //账户管理-科目管理
            'menu.subject.management':[
                'accmanager:subject:s',
                'accmanager:subject:a',
                'accmanager:subject:u'
            ],
            'subjectConfig': 'accmanager:subject:s',
            'subjectConfig.view': 'accmanager:subject:s',
            'subjectConfig.refresh': 'accmanager:subject:s',
            'subjectConfig.edit':   'accmanager:subject:u',
            'subjectConfig.add':'accmanager:subject:a',

            //财务处理 手工记账
            'menu.manualAccount.list': [
                'accmanager:maccounting:s',
                'accmanager:maccounting:a',
                'accmanager:maccounting:e',
                'accmanager:maccounting:au'
            ],
            'manualAccount': 'accmanager:maccounting:s',
            'manualAccount.view': 'accmanager:maccounting:s',
            'manualAccount.refresh': 'accmanager:maccounting:s',
            'manualAccount.edit': 'accmanager:maccounting:e',
            'manualAccount.manualCheck': 'accmanager:maccounting:au',
            'manualAccount.addManual': 'accmanager:maccounting:a',

            //调账
            'menu.adjustAccount.list': [
                'accmanager:caccounting:s',
                'accmanager:caccounting:e',
                'accmanager:caccounting:a',
                'accmanager:caccounting:au'
                //'menu.accountTrade.list',
                //'menu.accountRecord.management'
            ],
            'adjustAccount': 'accmanager:caccounting:s',
            'adjustAccount.view': 'accmanager:caccounting:s',
            'adjustAccount.refresh': 'accmanager:caccounting:s',
            'adjustAccount.edit': 'accmanager:caccounting:e',
            'adjustAccount.manualCheck': 'accmanager:caccounting:au',

            'menu.accountTrade.list':[
                'accmanager:caccounting:s',
                'accmanager:caccounting:a'
            ],
            'accountTradeDetail':'accmanager:caccounting:s',
            'accountTradeDetail.refresh':'accmanager:caccounting:s',
            'accountTradeDetail.AccountRecord':'accmanager:caccounting:a',

            'menu.accountRecord.management': [
                'accmanager:account:z',
                'accmanager:caccounting:a'
            ],
            'accountRecord': 'accmanager:account:z',
            'accountRecord.refresh': 'accmanager:account:z',
            'accountRecord.addAdjust': 'accmanager:caccounting:a',

            //日切
            'menu.exceptions.cutOffCheckDetail':[
                'accmanager:cutoffcheck:s'
            ],
            'exceptionsDetail': 'accmanager:cutoffcheck:s',
            'exceptionsDetail.refresh': 'accmanager:cutoffcheck:s',

            'menu.exceptions.cutOffCheckTotal':['accmanager:cutoffcheck:s'],
            'exceptionsTotal': 'accmanager:cutoffcheck:s',
            'exceptionsTotal.refresh': 'accmanager:cutoffcheck:s',

            //奖励分润信息
            'menu.postedInfo.list':[
                'accmanager:rewardprofit:s',
                'accmanager:rewardprofit:i',
                'accmanager:rewardprofit:r'
            ],
            'postedInfo': 'accmanager:rewardprofit:s',
            'postedInfo.view': 'accmanager:rewardprofit:s',
            'postedInfo.refresh': 'accmanager:rewardprofit:s',
            'postedInfo.import': 'accmanager:rewardprofit:i',
            'postedInfo.postedTicket': 'accmanager:rewardprofit:r',
            'postedInfo.detail': 'accmanager:postedticket:s',
            'postedInfo.download': 'accmanager:postedticket:s',

            //贴票管理
            'menu.postedTicket.list': [
                'accmanager:postedticket:s',
                'accmanager:postedticket:a',
                'accmanager:postedticket:t',
                'accmanager:postedticket:thaw',
                'accmanager:postedticket:account',
                'accmanager:postedticket:e',
                'accmanager:postedticket:reward',
                'accmanager:postedticket:dd',
                'accmanager:postedticket:id',
                'accmanager:postedticket:do',
                'accmanager:postedticket:io'
            ],
            'postedTicket': 'accmanager:postedticket:s',
            'postedTicket.refresh': 'accmanager:postedticket:s',
            'postedTicket.search': 'accmanager:postedticket:s',
            'postedTicket.ticket': 'accmanager:postedticket:t',
            'postedTicket.check': 'accmanager:postedticket:a',
            'postedTicket.thaw': 'accmanager:postedticket:thaw',
            'postedTicket.frozen': 'accmanager:postedticket:account',
            'postedTicket.batchAudit': 'accmanager:postedticket:a',
            'postedTicket.batchThaw': 'accmanager:postedticket:thaw',
            'postedTicket.export': 'accmanager:postedticket:reward',// 导出奖励明细
            'postedTicket.input': ['accmanager:postedticket:dd','accmanager:postedticket:id'],// 导入贴票 下载(导入贴票信息模板) 贴票数据批量导入
            'postedTicket.updateAwardWay': ['accmanager:postedticket:do','accmanager:postedticket:io'],// 变更发奖方式 下载(导入变更发奖方式模板) 变更发奖方式批量导入
            'postedTicket.ticketEdit': 'accmanager:postedticket:e',
            'postedTicket.service': 'accmanager:postedticket:skf',

            //贴票审核
            'menu.postedTicket.audit':[
                'accmanager:ticketapply:s', //盒伙人贴票申请查询列表
                'accmanager:ticketapply:u', //修改申请的贴票信息
                'accmanager:ticketapply:export', //导出付款申请单
                'accmanager:ticketapply:c'
            ],
            'postedTicket.audit': 'accmanager:ticketapply:s',
            'postedTicket.audit.refresh': 'accmanager:ticketapply:s',
            'postedTicket.audit.search': 'accmanager:ticketapply:s',
            'postedTicket.audit.audit': 'accmanager:ticketapply:u',
            'postedTicket.audit.import': 'accmanager:ticketapply:export',
            'postedTicket.audit.add': 'accmanager:ticketapply:c',
            'postedTicket.audit.importDetail': 'accmanager:ticketapply:ee',
            'postedTicket.audit.service': 'accmanager:postedticket:skf',

            /****************************新的配置规范***************************/
            //系统设置
            'oms.menu.system.permission': 'oms:system-permission:*',     //菜单&权限配置
            'oms.menu.system.union': 'oms:system-union:*'  //统一平台配置
        },

        // 关联菜单权限
        rs: {

            /**
             * 查看分润
             */
            'menu.profit':[
                'menu.query.branch.settle.details',
                'menu.query.algo.detail',
                'menu.trade.rate.sum'
            ],

            /**
             * 异常处理
             */
            'menu.exception': [
                'menu.exception.stlmerror',
                'menu.exception.stlmrepair',
                'menu.exception.settleerror',
                'menu.exception.cancelorder',
                'menu.exception.S0',
                'menu.service.refunds'//服务费退费管理
            ],

            /**
             * 下级机构
             */
            'menu.org':[
                'menu.auth.org',
                'menu.org.rank',
                'menu.org.perform'
            ],

            /**
             * 我的员工
             */
            'menu.staff': [
                'menu.auth.opr',
                'menu.staff.add',
                'menu.auth.role',
                'menu.auth.rolegroup',
                'menu.auth.rule',
                'menu.staff.rank',
                'menu.staff.perform'
            ],


            /**
             * 工作台
             */
            'menu.wkb': [
                'menu.wkb.task',
                'menu.wkb.taskList',
                'menu.wkb.task.mcht',
                'menu.blacklist.credentials'
            ],


            /**
             * 计费模型
             * 一级目录到二级目录
             */
            'menu.disc': [
                'menu.disc.brh', //有两级配置
                'menu.disc.mcht', //有两级配置
                'menu.disc.service' //有两级配置
            ],

            /**
             * 机构费率模型二级配置
             */
            'menu.disc.brh': [
                'menu.disc.brh.canSetMore',
                'menu.disc.brh.indirectMcc',
                'menu.disc.brh.indirectUnionSettle',
                'menu.disc.brh.noBaseRatio',
                'menu.disc.brh.baseToBorm',
                'menu.disc.brh.indirectCanChange',
                'menu.disc.brh.indirectChange',
                'menu.disc.brh.directMcc',
                'menu.disc.profit'
            ],

            /**
             * 商户费率模型二级配置
             */
            'menu.disc.mcht': [
                'menu.disc.mcht.direct',
                'menu.disc.mcht.indirect'

            ],


            /**
             * 服务费率模型二级配置
             */
            'menu.disc.service': [
                'menu.disc.service.list',
                'menu.disc.service.mcht',
                'menu.profit.service.list' //服务费分润
            ],


            /**
             * 参数设置
             */
            'menu.param': [
                'menu.param.account', 'menu.param.cardbin', 'menu.param.discalgo',
                'menu.param.feemod', 'menu.param.mccgroup', 'menu.param.mcc', 'menu.param.banks',
                'menu.param.regioncode', 'menu.param.sysparam', 'menu.param.zbank', 'menu.param.task.map',
                'menu.param.sen', 'menu.param.refuseConfig',
                'menu.param.taskTag'
            ],

            /**
             * 商户管理
             */
            'menu.mcht': [
                'menu.mcht.user',
                'menu.mcht.pufa',
                'menu.mcht.user2',
                'menu.mcht.add',
                'menu.mcht.service',
                'menu.mcht.change',
                'mcht.user.list',
                'menu.mcht.topuser',
                'menu.report.maintain',
                'mchtsgrid.IsBlackList',
                'mchtsgrid.NoBlackList'
            ],

            /**
             * 终端管理
             */
            'menu.terminals': [
                'menu.terminals.mgr',
                'menu.terminals.mgr.new',
                'menu.terminals.query',
                'menu.terminals.type.display',
                'menu.terminals.query.code'
            ],

            /**
             * 服务管理
             * */
            'menu.service':[
                'menu.service.model.config',
                'menu.service.target.mgr',
                'menu.service.dispatch',
                'menu.service.perform'
            ],



            /**
             * 清分清算
             */
            // 一级栏目到二级栏目的配置
            'menu.settle': [
                'menu.settle.account.info',
                'menu.settle.reconciliation.info',
                'menu.settle.liquidation.control',
                'menu.settle.account.repair',
                'menu.settle.chart.query',
                'menu.t0.settle',
                'menu.settle.check',
                'menu.settle.log',
                'menu.t0.faster',//T0秒到
                'menu.settleHistory.list'//公用出款历史明细列表
            ],
            //二级栏目账户账务信息
            'menu.settle.account.info' : [
                'menu.total.account',              //总账信息
                'menu.total.account.detail',       //总账手动维护明细
                'menu.stlm.account'                //清算收付款账户信息
            ],
            //二级栏目对账信息
            'menu.settle.reconciliation.info':[
                'menu.channel.account',             //渠道账务信息
                'menu.channel.txn',                 //渠道流水信息
                'menu.local.txn',                   //本地流水信息
                'menu.account.check',               //账务审核
                'menu.stlm.error'                   //差错交易信息
            ],
            //二级栏目清算控制
            'menu.settle.liquidation.control':[
                'menu.bat.main.ctl.detail',         //批处理主控任务
                'menu.settle.channel.control',      //渠道清算控制
                'menu.stlm.repair',                 //账单调整
                'menu.settle.sum',                  //清算汇总
                'menu.settle.control',              //清算控制
                'menu.settle.txn',                  //清算流水表
                'menu.settle.error',                //清算失败信息
                'menu.settle.lock',                 //清算批次锁表
                'menu.uk.config'                    //清算账户UK配置表
            ],


            // 二级菜单栏目
            'menu.settle.account.repair': [
                'menu.repair.detail',
                'menu.repair.sum'
            ],

            //二级栏目报表查询
            'menu.settle.chart.query':[
                'menu.branch.settle.details',       //机构清算明细息
                'menu.mcht.settle.detail',          //商户清算明细
                'menu.algo.detail',                 //清分明细信息
                'menu.settle.download'              //报表导出
            ],


            /**
             * 消息推送
             */
            'menu.message': [
                'menu.msg.center.list',
                'menu.msg.push.list',
                'menu.sm.push.list',
                'menu.notice.mgr',
                'menu.customer.sms.list'
            ],

            /**
             * 综合查询
             */
            'menu.complexquery': [
                'menu.mcht.query',                  //一站式查询
                'menu.report.bank.bundle',          //报表查询
                'menu.query.mcht.settle.detail',    //商户清算明细
                'menu.query.trade.txn',             //交易流水明细
                'menu.pfms.search'                  //业绩指标查询
            ],
            //业绩指标查询
            'menu.pfms.search': [
                'menu.brh.month.report',
                'menu.brh.day.report',
                'menu.opr.month.report',
                'menu.opr.day.report',
                'menu.user.terminal.report'
            ],
            //T+0清算
            'menu.t0.settle': [
                'menu.t0.settle.control',
                'menu.t0.settle.txn',
                'menu.t0.bat.main.ctl.detail',
                'menu.t0.settle.sum',
                'menu.settle.t0.error'
            ],

            //T0秒到
            'menu.t0.faster': [
                'menu.t0.faster.txn',
                'menu.t0.faster.control',
                'menu.t0.faster.error'
            ],

            //T+C权限
            'menu.tc.settle': [
                'menu.tc.settle.control',
                'menu.tc.settle.txn',
                'menu.tc.bat.main.ctl.detail',
                'menu.tc.settle.sum'
            ],

            'menu.service.manager': [
                'menu.service.manager.list'
            ],


            /**
             * 路由
             */
            'menu.route': [
                'menu.card.route',
                'menu.nocard.route',
                'menu.route.settlement',
                'menu.route.withhold'
            ],

            // 有卡路由
            'menu.card.route': [
                'menu.route.config',
                'menu.route.channel',
                'menu.route.mcht',
                'menu.channel.attr.config',
                'menu.onesettle.mcht.config'
            ],

            // 无卡路由
            'menu.nocard.route': [
                'menu.nocard.route.config',
                'menu.nocard.route.channel',
                'menu.nocard.route.mcht',
                'menu.nocard.channel.attr.config',
                'menu.nocard.route.mcht.config'
            ],

            //结算路由
            'menu.route.settlement': [
                'menu.route.settlement.channelConfig',
                'menu.route.settlement.capacityConfig',
                'menu.route.settlement.regularConfig'
            ],

            //代扣路由
            'menu.route.withhold': [
                'menu.route.withhold.channelRouter',
                'menu.route.withhold.productConfig',
                'menu.route.withhold.channelProductConfig'
            ],
            /**
             * 产品运营
             */
            'menu.operate.product': [
                'menu.operate.cashbox', //menu.operate.cashboxconfig
                'menu.operate.cashpool',
                'menu.param.version.ctrl'
            ],
            'menu.operate.cashbox': [
                'menu.cashbox.config',
                'menu.cashbox.manage'
            ],
            'menu.operate.cashpool': [
                'menu.cashpool.config',
                'menu.cashpool.change'
            ],

            /**
             * 运营工具
             */
            'menu.operate': [
                'menu.operate.replyCodeQuery',
                'menu.operate.txn',
                'menu.order.search',
                //'menu.data.move',
                'menu.operate.serviceTelephone',
                'menu.operate.blacklist',
                'menu.operate.business',
                'menu.operate.convenience',
                'menu.discount.coupon',
                'menu.discount.accountTrade',
                'menu.operate.sync.mcht'
            ],

            'menu.operate.sync.mcht':[
                'menu.operate.cmcht',
                'menu.operate.sync.hfmcht',
                'menu.operate.sync.mchtChannel'
            ],

            //交易应答码
            'menu.operate.replyCodeQuery': [
                'menu.replyCodeQuery.hasCard',
                'menu.replyCodeQuery.noCard'
            ],
            //数据迁移
            /*'menu.data.move': [
                'menu.data.move.org', // 机构迁移
                'menu.data.move.mcht', // 商户迁移
                'menu.data.move.user' // 拓展员迁移
            ],*/

            /**
             * 优惠活动配置
             */
            'menu.promotions':[
                'menu.promotions.model',
                'menu.promotions.management'
            ],

            /**
             * 会议管理
             */
            'menu.meeting': [
                'menu.meeting.launch'
            ],

            /**
             * 账户管理
             **/
            'menu.account.management':[
                'menu.account.baseInfo',
                'menu.account.financeInfo',//账务处理
                'menu.account.profitInfo',//奖励分润 父
                'menu.account.exceptions'//异常处理
            ],
            'menu.account.baseInfo': [
                'menu.accountConfig.management',
                'menu.subject.management'
            ],
            'menu.account.financeInfo': [
                'menu.manualAccount.list',
                'menu.adjustAccount.list'
            ],
            'menu.adjustAccount.list': [
                'menu.accountTrade.list',
                'menu.accountRecord.management'
            ],

            'menu.account.profitInfo':[
                'menu.postedInfo.list',//奖励分润信息
                'menu.postedTicket.list',//贴票管理
                'menu.postedTicket.audit'//贴票审核
            ],
            'menu.account.exceptions':[
                'menu.exceptions.cutOffCheckDetail',
                'menu.exceptions.cutOffCheckTotal'
            ],


            /*********************新的配置规范*********************/
            //系统设置
            'oms.menu.system': [
                'oms.menu.system.permission',
                'oms.menu.system.union'
            ]

        }
    }
});
