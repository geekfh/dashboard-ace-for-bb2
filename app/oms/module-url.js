/**
 * User hefeng
 * Date 2016/7/15
 */
define({
    urlRoot: {
        'org.direct.children'  : 'api/system/branchs/direct-children',//获取当前机构的直接孩子机构列表
        'org'                  : 'api/system/branchs',
        'org.canUpdate'        : 'api/system/branchs/can-update-settlebrh/(:id)',
        'brh.get.verifyCode'  : 'api/system/branchs/message-get-verify',//获取新增操作员验证码
        'brh.validate.verifyCode'  : 'api/system/branchs/message-validate-verify',//检验新增操作员验证码
        'brh.cloase.or.open.brh'  : 'api/system/branchs/close-or-open-branch',//机构关闭或者是启动

        'user'                 : 'api/system/operators/(:id)',//新增自定义操作员，编辑操作员
        'user.expand'          : 'api/system/operators/expand-operator',//新增拓展员
        'user.keyboard'        : 'api/system/operators/keyboard-operator',//新增录入员
        'user.sysmgr'          : 'api/system/operators/sysmgr-operator',//新增系统管理员
        'user.sysbsmgr'        : 'api/system/operators/sysbsmgr-operator',//新增系统&业务管理员
        'user.statist'         : 'api/system/operators/statist-operator',//新增统计员
        'user.changestate'     : 'api/system/operators/update-status/(:id)', //操作员状态变更
        'user.updateregion'    : 'api/system/operators/updateregioncode', //拓展员修改拓展范围
        'user.toplevel'        : 'api/system/operators/super/(:id)', //查看盒伙人上级和顶级

        'user.upload'          : 'api/system/operators/upload-opr-media',
        'user.get.verifyCode'  : 'api/system/operators/message-get-verify',//获取新增操作员验证码
        'user.validate.verifyCode'  : 'api/system/operators/message-validate-verify',//检验新增操作员验证码
        'checkUserInfoRepeat'  : 'api/system/operators/check?account=',
        'check.loginName'      : 'api/system/operators/check-loginName',// 验证员工登录名唯一性
        'check.mobile'         : 'api/system/operators/check-mobile',// 验证员工手机号唯一性
        'check.email'          : 'api/system/operators/check-email',// 验证员工邮箱唯一性
        'brhMobileCheck'       : 'api/system/branchs/checkMobile?mobile=(:mobile)',
        'brhIdCardCheck'       : 'api/system/branchs/checkIdCard?idcard=(:idCard)', //验证身份证号码的唯一性
        'brhIdCardCheck4User'  : 'api/system/operators/check-cardno?cardno=(:cardno)', //针对拓展员验证身份证号码唯一性
        'role'                 : 'api/system/roles/(:id)',//角色信息中权限部分为树形
        'role.v2'              : 'api/system/roles/v2/(:id)',//角色信息中权限部分为列表
        'role.v2.canaddauths'   : 'api/system/roles/v2/(:id)/can-add-auths',//角色信息中权限部分为列表
        'role-group'           : 'api/system/role-groups',
        'role-group-id'        : 'api/system/role-groups/(:id)',
        'options.roles'        : 'api/system/role-groups/roles',
        'auth'                 : 'api/system/auths',
        'privilege'            : 'api/system/auths',

        /*
         * 操作日志 模块
         * */
        'log'                  : 'api/system/logs',
        'log.model.show'       : 'api/system/auths/head',//加载操作业务模块
        'log.resName.show'     : 'api/system/auths/tail',//加载操作资源名称
        'log.type.show'        : 'api/system/auths/names',//加载操作类型
        'log.detail'           : 'api/system/logs/(:id)',//查询日志详情

        'upload.brh.media'     : 'api/system/branchs/upload-brh-media',
        'branch.info'          : 'api/system/branchs/branch-info/(:brhCode)',

        //参数设置
        'account'              : 'api/system/accounts',
        'card-bin'             : 'api/system/card-bin2',
        'disc'                 : 'api/system/discs/(:modelId)',
        'disc-algo'            : 'api/system/disc-algos',
        'mcc'                  : 'api/system/mccs',
        'mcc-group'            : 'api/system/mcc-groups',
        'media'                : 'api/system/medias',
        'region-code'          : 'api/system/region-codes',
        'sys-param'            : 'api/system/sys-params',
        'banks'                : 'api/system/bank',
        'zbank'                : 'api/system/zbanks',
        'zbank.search'         : 'api/system/options/bank_infos_thatKeyIsBankid',
        'zbank.import'         : 'api/system/zbanks/batch_import',
        'zbank.download'       : 'api/system/zbanks/download_template',
        'zbank.parents'        : 'api/system/zbanks/findRegionNameByBankRegionCode/(:no)',

        'card-bin.bankName'     : 'api/system/card-bin2/getbankName',//银行卡基本信息维护
        'card-bin.download'     : 'api/system/card-bin2/download-template',//银行卡基本信息维护 下载
        'card-bin.import'       : 'api/system/card-bin2/import/(:id)',//银行卡基本信息维护 导入

        'nav.config'           : 'navs',
        'rule'                 : 'api/system/rules/(:id)',
        'rule.branches'        : 'api/system/rules/branches',//获取当前机构的直接下级机构列表
        'rule.branch.name'     : 'api/system/options/brhName', //获取机构名称
        'rule.operators'       : 'api/system/rules/operators',
        'rule-id'              : 'api/system/rules/(:id)',
        'rule-elem'            : 'api/system/rule-elements',
        'rule.custom.add'      : 'api/system/rules/add-elem-to-custom-rule',
        'custom.rule.add.elem' : 'api/systemrules/(:id)/add-elem-to-custom-rule',//往某些自定义规则添加 机构/拓展员

        'task.get.auditor'      : 'api/system/tasks/get-auditor',//获取所有的审核人员
        'task.allot'            : 'api/system/tasks/allot',//指派给某个审核人员
        'task.release'          : 'api/system/tasks/release',//放回任务
        'task.mgr.view'         : 'api/system/tasks/(:id)/view',//任务管理-查看
        'task'                  : 'api/system/tasks',
        'task.take'             : 'api/system/tasks/(:num)/take',
        'task.target'           : 'api/system/tasks/(:id)/target',
        'task.history'          : 'api/system/tasks/(:id)/info',
        'task.refuse'           : 'api/system/tasks/(:id)/refuse',
        'task.updatezbank'      : 'api/system/tasks/(:id)/upd-zbank-info',
        'task.update.submit'    : 'api/system/tasks/(:id)/update-submit',//商户修改保存
        'task.revise'           : 'api/system/tasks/(:id)/revise',//执行修订任务获取时商户信息
        'task.revise.submit'    : 'api/system/tasks/(:id)/submit',//修订完提交
        'task.revise.submit.brh': 'api/system/tasks/(:id)/submit-brh',//机构修订完提交
        'task.revise.submit.user': 'api/system/tasks/(:id)/submit-opr',//操作员修订完提交
        'task.pass'             : 'api/system/tasks/(:id)/pass',
        'task.cancel'           : 'api/system/tasks/(:id)/cancle',
        'task.canitake'         : 'api/system/tasks/(:id)/can-take',
        'task.take.by.id'       : 'api/system/tasks/(:id)/take-ID',
        'task.putback'          : 'api/system/tasks/(:id)/give-up', //放回领取的任务
        'task.takeback'         : 'api/system/tasks/(:id)/takeback-task',
        'task.map'              : 'api/system/task-maps',
        'task.update.images'    : 'api/system/tasks/update-images',
        'task.list.grid'        : 'api/system/tasks/list',
        'task.verify'           : 'api/system/tasks/(:id)/dealMchtSupmchtInfo',

        'task.valid.mchtname'   : 'api/system/tasks/validate-mchtname',
        'task.valid.idcard'     : 'api/system/tasks/validate-idcard',
        'task.valid.account'    : 'api/system/tasks/validate-account',

        'task.map.add'          : 'api/system/task-maps/add-taskMap',   // 新增任务模型
        'task.map.role'         : 'api/system/options/role-kw-and-level',  // 获取角色
        'task.map.brh'          : 'api/system/options/brh-kw',         // 获取机构
        'task.map.type'         : 'api/system/options/task-map/type-and-authcode',   //获取任务类型

        //这个是单独给商审的 任务模块
        'task.mcht'             : 'api/system/tasks/new-mcht',
        'task.mcht.status.show' : 'api/mcht/verifyonlines/opr-status',//查询 当前登录人签到状态
        'task.mcht.status.save' : 'api/mcht/verifyonlines',//当前登录人签到签退
        'task.mcht.countDown'   : 'api/mcht/verifyonlines/task-time-out/(:id)',//倒计时接口

        //审核拒绝理由模板
        'task.refuseConfig': 'api/task/refuse-config',   //分页查询
        'task.refuseConfig.select': 'api/task/refuse-config/select',   //下拉框查询
        'task.refuseConfig.selectLevel': 'api/task/refuse-config/one-level',   //查询一级模板
        'task.menual.check.idCard': 'api/system/tasks/verificat_idcard/(:id)',//手动校验操作员身份证号
        'task.menual.check.cardNo': 'api/system/tasks/verificat_cardNo/(:id)',//手动校验操作员银行卡号

        'task.tag.list': 'api/mcht/project',//列表

        'branch'                : 'api/system/branchs/add-branch/(:id)',//机构录入/编辑完成后提交
        'branch.edit'           : 'api/system/branchs/edit-branch/(:id)',//机构编辑获取数据
        'branch.show'           : 'api/system/branchs/view-branch/(:id)',//机构查看获取数据
        'branch.canAddSettleBrh': 'api/system/branchs/can-add-settlebrh',//是否可以新增清算机构
        'branch.valid.licNo': 'api/system/branchs/check-lic/(:licNo)',//验证机构营业执照是否重复

        'mcht.serachTCStatus': 'api/mcht/merchants/serachTCStatus/(:id)',//商户列表、商户查询 拍卡状态变更-获取拍卡状态
        'mcht.updateTCStatus': 'api/mcht/merchants/updateTCStatus/(:id)',//商户列表、商户查询 拍卡状态变更-更改拍卡状态
        'mcht.updateMchtIOU': 'api/mcht/merchants/updateMchtIOU/update-iou/(:id) ',//商户列表、商户查询 白条开关请求
        'mcht.online.showservice': 'api/mcht/online/router/showservice',//商户列表 查看微信、支付宝服务开通状态
        'mcht.isInBlackList.edit': 'api/mcht/merchants/put_to_blackList/(:id)',//商户列表 加入黑名单
        'mcht.isCoMarketing'    : 'api/mcht/merchants/update-isCoMarketing/(:id)',//商户列表-表格-更改'是否联合商户'
        'mcht.changestate'      : 'api/mcht/merchants/update-status/(:id)',
        'mcht.changestates'     : 'api/mcht/merchants/update-statuses/(:id)',// 商户列表 - 状态变更
        'mcht.updateS0.out'     : 'api/mcht/merchants/update-s0/(:id)',// 商户列表 - S0状态修改
        'mcht.updateS0.in'      : 'api/mcht/merchants/insideMerchants/update-s0/(:id)',// 商户查询 - S0状态修改
        'mcht.updateT1.in'      : 'api/mcht/merchants/updateMchtRank/(:id)', //商户列表 - T1等级修改
        'mcht.upload'           : 'api/mcht/merchants/upload-mcht-media',
        'merchant'              : 'api/mcht/merchants/(:id)',//商户录入
        'merchant.save'         : 'api/mcht/merchants/save-mcht',//商户保存
        'merchant.show'         : 'api/mcht/merchants/show/(:id)',//查看商户资料
        'merchant.more.pos'     : 'api/mcht/terminals/find-by-mcht/(:merchantId)',//获取更多的终端号
        'merchant.valid.mobile' : 'api/mcht/merchants/check-mobile/(:mobile)',//验证商户手机号是否重复
        'merchant.valid.id'     : 'api/mcht/merchants/check-cardNo/(:id)',//验证身份证号码是否重复
        'merchant.valid.email'  : 'api/mcht/merchants/check-email',//验证商户邮箱是否重复
        'merchant.valid.BrhName'  : 'api/system/branchs/checkBrhName?brhName=(:BrhName)',//验证机构名称是否重复
        'merchant.valid.mcht'   : 'api/mcht/merchants/check-mcht',//验证商户是否重复
        'merchant.valid.licNo'  : 'api/mcht/merchants/check-lic/(:licNo)',//验证商户营业执照是否重复
        'valid.debitcard': 'api/system/bank/check-debit-card/(:bankCardNo)',//验证银行卡号是否为借记卡
        'valid.eighteen.bank': 'api/system/bank/check-specail-debit-card/(:bankCardNo)',//验证18家银行
        //'valid.eighteen.bank': 'api/system/bank/check-specail-debit-card/(:bankCardNo)',//验证18家银行
        'rolegroup.valid.name'  : 'api/system/role-groups/checkRoleGroupName?groupName=(:roleGroupName)',//验证角色组名称是否重复
        'mcht.blackList.merchants.view': 'api/mcht/merchants/searchRepeatMerchants',

        'terms.dirname.search': 'api/mcht/terminals/oprList',//终端 搜索直销网络拓展与

        'merchant.topuser'      : 'api/mcht/users/tmp',
        'merchant.pufa'         : 'api/mcht/merchants/pufa/(:id)',
        'merchant.show.pufa'    : 'api/mcht/merchants/pufa/show/(:id)',
        'mchts.person'          : 'api/mcht/users/(:id)',
        'mchts.changeStatus.edit': 'api/mcht/users/change-sta/(:id)',

        'merchant.user2'        : 'api/mcht/merchants/insideMerchants/(:id)',
        'merchant.user2.show'        : 'api/mcht/merchants/insideMerchants/show/(:id)',
        'mcht.user2.isInBlackList.edit': 'api/mcht/merchants/insideMerchants/put_to_blackList',
        'mcht.user2.isCoMarketing'    : 'api/mcht/merchants/insideMerchants/update-isCoMarketing/(:id)',
        'mcht.user2.changestate'      : 'api/mcht/merchants/insideMerchants/update-status/(:id)',
        'mcht.user2.changestates'      : 'api/mcht/merchants/insideMerchants/update-statuses/(:id)',// 商户查询 - 状态变更
        'mcht.user2.showservice': 'api/mcht/online/router/insideMerchants/showservice',//商户查询 查看微信、支付宝服务开通状态
        'mcht.changeStateView': 'api/mcht/merchants/remark/serach/(:id)',//商户列表-查看状态变更记录
        'mcht.user2.changeStateView': 'api/mcht/merchants/remark/single/serach/(:id)',//商户查询-查看状态变更记录
        'mcht.auth.changeStateView': 'api/system/operators/remark/search/(:id)',//员工管理-查看状态变更记录
        'mcht.updateMchtType': 'api/mcht/merchants/updateMchtType/(:id)',//直联商户修改

        'temrinals.mgr'         : 'api/mcht/terminals',
        'terminals.mgr.changestate' : 'api/mcht/terminals/update-status/(:id)',
        'terminals.mgr.options' : 'api/mcht/terminaltypedisplays/term-type-displays',
        'terminals.mgr.download.tpl': 'api/mcht/terminals/download-newTemplate',
        'terminals.mgr.newdownload.tpl': 'api/mcht/terminals/download-template',
        'terminals.mgr.unbind.terminal': 'api/mcht/terminals/unbundlingTerminals',
        'terminals.mgr.snsearch.excel': 'api/mcht/terminals/terminal',
        'terminals.mgr.replterm.excel': 'api/mcht/terminals/download-repalace-terminal',
        'terminals.mgr.snnooprid.excel': 'api/mcht/terminals/download-useadjust',//批量调整终端
        'terminals.mgr.useadjust.terminal':'api/mcht/terminals/use_adjust',//批量调整终端
        'terminals.mgr.sn-downloadUrl':'api/mcht/terminals/sn-downloadUrl',//二维码URL生成器

        'terminals.terminaltypedisplays': 'api/mcht/terminaltypedisplays',//POS类型配置
        'terminals.terminalQueryCode': 'api/mcht/upgrade',//升级码查询

        'terminals.mgr.allocate.terminal': 'api/mcht/terminals/allocate',//调配终端
        'terminals.mgr.import.terminal': 'api/mcht/terminals/bat_use_adjust',//批量导入终端

        'terminals.mgr.allocate.detail': 'api/mcht/terminals/change/detail',//终端出库/调配记录
        'mcht.terminals.status': 'api/mcht/terminals/status',//回收、停用、解绑终端
        'terminals.mgr.download': 'api/mcht/terminals/down-load',

        'mcht.terminals.agent': 'api/mcht/terminals/agent?termUsed=(:brhCode)',//根据上级机构获取直属下级机构信息
        'mcht.terminals.agent.nopage': 'api/mcht/terminals/agent-no-page?termUsed=(:brhCode)',//根据上级机构获取直属下级机构信息
        'mcht.terminals.log':'api/mcht/terminals/log?no=(:no)',//获取终端操作历史记录


        'service.target.mgr': 'api/calculation/service/object-manager', //服务对象管理列表
        'invite.mcht': 'api/calculation/service/object-manager/invite',//邀请商户
        'import.service.target':'api/calculation/service/object-manager/import',//导入服务对象
        'get.service.id':'api/calculation/service/object-manager/serviceId',//获取服务ID
        'service.target.download.tpl':'api/calculation/service/object-manager/download-template',//下载导入服务对象模板

        'batch.change.service.target.status': 'api/calculation/service/object-manager/status',//服务对象管理 批量开通/停止/拒绝

        'service.perform': 'api/calculation/service/perform', //服务开通复核
        'batch.change.perform.status': 'api/calculation/service/perform/status',//服务开通复核 批量通过/拒绝

        'options.city'         : 'api/system/options/region-codes/(:province)',
        'options.country'      : 'api/system/options/region-codes/city/(:city)',
        'options.nature'       : 'api/system/options/business-nature',
        'options.cardType'     : 'api/system/options/cards',
        'options.discCycle'    : 'api/system/options/disc-cycle',
        'options.disc'         : 'api/system/options/discs',
        'options.mchtdisc'     : 'api/system/options/mcht-discs',
        'options.mchtdisc.examine': 'api/system/options/examine-mcht-discs',
        'options.mcc'          : 'api/system/options/mccs/(:mccGroupId)',
        'options.region-code'  : 'api/system/options/region-codes',
        'options.province'     : 'api/system/options/region-codes',
        'options.mccGroup'     : 'api/system/options/mcc-groups',
        'options.zbankName'    : 'api/system/options/zbank-name',
        'options.disc-branchs' : 'api/system/rate/model/branchs/(:modelType)',   //在新计费模型中使用
        'options.disc-brhs'    : 'api/system/discs/brhs',
        'options.user.rolegroup' : 'api/system/options/role-group',
        'options.user.rolegroup.code' : 'api/system/options/role-group-code?brh=(:brhCode)',
        'options.user.rule' : 'api/system/options/rule',
        'options.explorers'    : 'api/system/options/explorers/(:kw)',
        'options.operators'    : 'api/system/options/operators',
        'options.group-mcc'    : 'api/system/options/group-mcc', //经营信息分组接口
        'options.business-mcc'    : 'api/system/options/business-mcc/(:groupId)', //经营信息明细接口
        'options.mccCode'       : 'api/system/options/mcc/(:mccCode)',   //通过 mccCode 获取 mcc 名称和 mcc 对应的分组
        //'options.brh.access.levels': 'api/system/options/brh-access-levels',//审核机构的时候定义机构的访问级别

        'bank.info': 'api/system/options/bank-infos', // 开户行
        'bank.special': 'api/system/options/special-bank-infos', // 推荐银行信息
        'bank.bankCode.by.bankName': 'api/system/options/bankcode', //开户行编号 查找银行名称

        'bat.main.ctl.detail'  : 'api/settle/bat-main-ctl-details',
        'bat.main.zero'        : 'api/settle/bat-main-ctl-details/search-zero',
        'bat.main.one'         : 'api/settle/bat-main-ctl-details/search-one-settle',
        'batMain.TZero'        : 'api/settle/bat-main-ctl-details/batMainTZero',
        'channel.account'      : 'api/settle/channel-accounts',
        'channel.account.download': 'api/settle/channel-accounts/new-download-report',
        'channel.account.statistics.download': 'api/settle/channel-accounts/statistics-download-report',
        'channel.account.deal': 'api/settle/channel-accounts/deal/(:id)',//渠道账务信息 处理功能
        'channel.txn'          : 'api/settle/cup-succs',
        'channel.txn.download' : 'api/settle/cup-succs/download-excell',
        'settle.error'         : 'api/settle/errors',
        'settle.sum'           : 'api/settle/sums',
        'settle.sum.zero'      : 'api/settle/sums/search-zero',
        'settle.sum.one'      : 'api/settle/sums/search-one-settle',
        'settle.txn'           : 'api/settle/txns/(:id)',
        'settle.txn.single.batch' : 'api/settle/txns/single-batch', // 单独成批
        'settle.txn.divide.batch' : 'api/settle/txns/divide-batch', // 划分批次
        'settle.txn.divide.batch.count' : 'api/settle/txns/divide-batch-count', // 批次总数
        'settle.txn.giveUp.batch' : 'api/settle/txns/give-up-batch',// 批次放弃
        'settle.txn.recovery.settle' : 'api/settle/txns/recovery-settle', // 恢复清算
        'settle.txn.stop.settle'  : 'api/settle/txns/stop-settle', // 暂停清算
        'settle.txn.set.success'  : 'api/settle/txns/set-success', // 设为成功
        'settle.txn.download'  : 'api/settle/txns/download-report',
        'settle.txn.maxAmountT0' : 'api/settle/txns/divide-max-amt-t0', //大额拆分T0清算
        'settle.txn.maxAmountOne' : 'api/settle/txns/divide-max-amt-tc', //大额拆分 一清
        'settle.control'       : 'api/settle/controls',
        'settle.control.repeal': 'api/settle/controls/revocation-batch/(:ctrId)',
        'settle.ctrl.transfer' : 'api/settle/controls/(:id)/transfer-account',
        'settle.ctrl.check'    : 'api/settle/controls/(:id)/check-account',
        'settle.ctrl.confirm'  : 'api/settle/controls/(:id)/confirm',
        'settle.ctrl.confirmT' : 'api/settle/controls/(:id)/settle-fail-again-confirm',
        'settle.account'       : 'api/settle/account', // 账户审核列表
        'settle.account.check' : 'api/settle/account/check', // 账户审核
        'settle.channel.control' : 'api/chn/settle', // 渠道清算控制
        'settle.channel.control.do' : 'api/chn/settle/(:id)', // 点击清算
        'settle.channel.control.doSecond' : 'api/chn/settle/second', // 点击清算
        'settle.txns.payRecords': 'api/settle/mcht-settle-details/pay-record/(:id)',//查询清算流水出款历史记录，公用功能涉及到的页面（清算控制-清算流水, T+0清算-清算流水, T+0秒到-清算流水, 一清清算-清算流水, 报表查询-商户清算明细, 综合查询-商户清算明细）

        'settle.t0.ctrl.transfer' : 'api/settle/controls/(:id)/transfer-account-zero',
        'settle.t0.ctrl.check' :    'api/settle/controls/(:id)/check-account-zero',
        'settle.t0.ctrl.confirm' : 'api/settle/controls/(:id)/confirm-zero',

        'settle.one.ctrl.transfer' : 'api/settle/controls/(:id)/transfer-account-one-settle',
        'settle.one.ctrl.check' :    'api/settle/controls/(:id)/check-account-one-settle',
        'settle.one.ctrl.confirm' : 'api/settle/controls/(:id)/confirm-one-settle',

        'settle.t0.txn'           : 'api/settle/txns/search-zero',
        'settle.t0.txn.download'  : 'api/settle/txns/download-report-zero', // 下载报表
        'settle.t0.txn.single.batch' : 'api/settle/txns/single-batch-zero', // 单独成批
        'settle.t0.txn.divide.batch' : 'api/settle/txns/divide-batch-zero', // 划分批次
        'settle.t0.txn.giveUp.batch' : 'api/settle/txns/give-up-batch-zero',// 批次放弃
        'settle.t0.txn.recovery.settle' : 'api/settle/txns/recovery-settle-zero', // 恢复清算
        'settle.t0.txn.stop.settle'  : 'api/settle/txns/stop-settle-zero', // 暂停清算
        'settle.t0.txn.set.success'  : 'api/settle/txns/set-success-zero', // 设为成功

        'settle.tn.error': 'api/settle/errors/search-tnc',//查询
        'settle.tn.error.autoBatch': 'api/settle/errors/genarate-batch',//自动成批
        'settle.tn.error.download': 'api/settle/errors/download-excell-tnc',//导出

        //T0清算-清算失败
        'settle.T0.error': 'api/settle/errors/search-t0', //查询
        'settle.T0.genarate': 'api/settle/errors/genarate-batch-t0', //自动成批
        'settle.T0.error.download': 'api/settle/errors/download-excell-t0', // 清算失败下载

        'settle.one.txn'           : 'api/settle/txns/search-one-settle',
        'settle.one.txn.download'  : 'api/settle/txns/download-report-one-settle', // 下载报表
        'settle.one.txn.single.batch' : 'api/settle/txns/single-batch-one-settle', // 单独成批
        'settle.one.txn.divide.batch' : 'api/settle/txns/divide-batch-one-settle', // 划分批次
        'settle.one.txn.giveUp.batch' : 'api/settle/txns/give-up-batch-one-settle',// 批次放弃
        'settle.one.txn.recovery.settle' : 'api/settle/txns/recovery-settle-one-settle', // 恢复清算
        'settle.one.txn.stop.settle'  : 'api/settle/txns/stop-settle-one-settle', // 暂停清算
        'settle.one.txn.set.success'  : 'api/settle/txns/set-success-one-settle', // 设为成功

        'settle.one.txn.cups' :'api/settle/txns/cups',//清分清算-清算流水 划分批次 渠道名称

        'settle.control.zero'  : 'api/settle/controls/search-zero',
        'settle.control.one'   : 'api/settle/controls/search-one-settle',
        'settle.lock'          : 'api/settle/locks',
        'stlm.account'         : 'api/settle/stlm-accounts',
        'stlm.account.payaccount':'api/settle/stlm-accounts/payaccount',
        'stlm.error'           : 'api/settle/stlm-errors',
        'export.stlm.error'    : 'api/settle/stlm-errors/export-excell',
        'stlm.repair'          : 'api/settle/stlm-repairs',
        'stlm.repair.download' : 'api/settle/stlm-repairs/download-report',
        'total.account'        : 'api/settle/total-accounts',
        'total.account.detail' : 'api/settle/total-account-details',
        'branch.settle.details': 'api/settle/branch-settle-details',
        'branch.settle.sub.details': 'api/settle/branch-settle-details/child-list',
        'mcht.settle.detail'   : 'api/settle/mcht-settle-details',
        'mcht.settle.detail.download'   : 'api/settle/mcht-settle-details/down-load',
        'algo.detail'          : 'api/settle/algo-details',
        'algo.detail.download' : 'api/ settle/algo-details/download_algoDetail',
        'mcht.settle.details.list':'api/settle/mcht-settle-details/(:id)',//综合查询-商户清算明细

        'stlm.service.refunds': 'api/settle/service-refunds',//异常交易-服务费退费管理
        'stlm.service.refunds.export': 'api/settle/service-refunds/export-excell',//异常交易-服务费退费管理
        'stlm.service.refunds.autobatch': 'api/settle/service-refunds/genarate-batch',//服务费退费管理-自动成批
        'stlm.service.refunds.bats': 'api/settle/service-refunds/bats',//服务费退费管理-处理/批量处理

        'settle.error.genarate': 'api/settle/errors/genarate-batch',
        'settle.error.update'  : 'api/settle/errors/(:id)/update',
        'settle.error.unknow'  : 'api/settle/errors/(:id)/change-unknow-status',
        'settle.error.operator': 'api/settle/errors/(:id)/operator-details',
        'settle.error.download': 'api/settle/errors/download-excell', // 清算失败下载
        'settle.exceptions0.list' : 'api/settle/exceptionTxnS0',
        'settle.exceptions0.changestate' : 'api/settle/exceptionTxnS0/(:id)',
        'stlm.error.s0.add' : 'api/settle/exceptionTxnS0/add_from_stlm_err/(:id)',
        'settle.error.s0.add' :'api/settle/exceptionTxnS0/add_from_settle_err/(:id)',

        'settle.lock.unlock'   : 'api/settle/locks/unLock/(:id)',
        'settle.lock.lock'   : 'api/settle/locks/lock/(:id)',
        'stlm.account.acctMmCode' : 'api/system/options/account-infos',
        'stlm.account.modify'  :  'api/settle/stlm-accounts/modify/(:id)',
        'local.txn'            :  'api/settle/txn-succ',
        'local.txn.download': 'api/settle/txn-succ/export-excel',
        'settle.check.list':'api/settle/check', //操作审核
        'settle.check.detail':'api/settle/check/(:id)', //审核信息查看
        'settle.check.submit':'api/settle/check/change-status', //审核信息提交
        'settle.log.search':'api/settle/record-logs', //清分清算日志
        'settle.check.download':'api/settle/check/download', //提供权限码标识

        //调单退单管理
        'settle.cancelorder.search': 'api/settle/cancel_order_info/(:id)',
        'settle.cancelorder.search.queryRepeatTradeNo': 'api/settle/cancel_order_info/queryRepeatTradeNo',
        'settle.cancelorder.add.search': 'api/settle/cancel_order_info/trade_txn_info',
        'settle.cancelorder.download': 'api/settle/cancel_order_info/down-load',
        'settle.cancelorder.whetherDeduction': 'api/settle/cancel_order_info/whetherDeduction/(:orderNo)',
        'settle.cancelorder.mchtEdit':'api/settle/cancel_order_info/(:id)', //编辑调单退单(商管)
        'settle.cancelorder.clearEdit':'api/settle/cancel_order_info/Account/(:id)', //编辑调单退单(清算)
        'settle.cancelorder.clearreleaseEdit':'api/settle/cancel_order_info/Release/(:id) ',//清分编辑调单释放

        //T0秒到-清算流水
        'settle.t0.faster.txn':'api/settle/txns/search-one-fast-settle',//T0秒到-清算流水
        'settle.t0.faster.txn.failDown':'api/settle/txns/del-one-fast/(:id)',//T0秒到-对账
        'settle.t0.faster.txn.download':'api/settle/txns/download-report-one-fast-settle',//T0秒到-下载列表
        'settle.t0.faster.single.batch' : 'api/settle/txns/single-batch-s0', // 单独成批
        'settle.t0.faster.divide.batch' : 'api/settle/txns/divide-batch-s0', // 划分批次
        //'settle.t0.faster.divide.batch.count' : 'api/settle/txns/divide-batch-count', // 批次总数
        'settle.t0.faster.stop.settle'  : 'api/settle/txns/stop-settle-s0', // 暂停清算
        'settle.t0.faster.recovery.settle' : 'api/settle/txns/recovery-settle-s0', // 恢复清算
        'settle.t0.faster.set.success'  : 'api/settle/txns/set-success-s0', // 设为成功

        //T0秒到-清算控制
        'settle.faster.control'  : 'api/settle/controls/search-s0',
        's0settle.ctrl.transfer' : 'api/settle/controls/(:id)/transfer-account-s0',
        's0settle.ctrl.check'    : 'api/settle/controls/(:id)/check-account-s0',
        's0settle.ctrl.confirm'  : 'api/settle/controls/(:id)/confirm-s0',
        's0settle.ctrl.confirmT' : 'api/settle/controls/(:id)/settle-fail-again-confirm',

        //T0秒到-清算失败
        'settle.faster.error': 'api/settle/errors/search-s0', //查询
        'settle.faster.genarate': 'api/settle/errors/genarate-batch-s0', //自动成批
        'settle.faster.error.download': 'api/settle/errors/download-excell-s0', // 清算失败下载

        //清算失败 退票功能
        'settle.error.existData.import' : 'api/settle/errors/search-exist-error/(:bounceId)',//已存在
        'settle.error.notTxnData.import' : 'api/settle/errors/search-not-txn/(:bounceId)',//未查询
        'settle.error.RepeatData.import' : 'api/settle/errors/search-mulit-txn/(:bounceId)',//重复的退票

        // 账单调整
        'repair.detail': 'api/settle/stlm-repair-dtl',
        'repair.detail.download': 'api/settle/stlm-repair-dtl/export-excel',
        'repair.detail.updateRepairExp': 'api/settle/stlm-repair-dtl/updateRepairExp/(:id)',
        'repair.sum': 'api/settle/stlm-repair-sums',
        'repair.sum.add': 'api/settle/stlm-repair-sums/subAmount',
        'repair.sum.reduce': 'api/settle/stlm-repair-sums/subtract',
        'repair.sum.thaw': 'api/settle/stlm-repair-sums/thaw',
        'repair.sum.stopThaw': 'api/settle/stlm-repair-sums/stopThaw',
        'repair.sum.search': 'api/settle/stlm-repair-sums/find-mchtOrBrhNo',
        'repair.sum.download': 'api/settle/stlm-repair-sums/export-excel',

        'auth.info.Recommend'  : 'api/system/branchs/checkRecommendPerson',
        'bankcode'             : 'api/system/bank/bank-code/(:bankCardNo)',
        'zbankno'              : 'api/settle/stlm-accounts/(:zbankNo)/zbankNo',
        'branchsID'            : 'api/system/branchs/(:id)',
        'mchtno'               : 'api/settle/stlm-repairs/find-mchtNo',
        'txnid'                : 'api/settle/stlm-errors/find-txnId',
        'branchlevel'          : 'api/system/branchs/operater-branch-level',
        'trade.txn'            : 'api/settle/trade-water',
        'ukConfig.txn'         : 'api/settle/uk-configs',
        'areaCode'             : 'api/system/options/region-codes/bank-code/(:code)',

        'stlm.errors.status'   : 'api/settle/stlm-errors/settle-status/(:id)',

        'trade.rate.sum'       : 'api/mcht/tradingValueRateCollect', // 交易额扣率汇总
        'trade.rate.sum.download': 'api/mcht/tradingValueRateCollect/download',

        'report.brh.fee'       : 'api/settle/report-brh-fee',
        'report.mcht.detail'   : 'api/settle/report-mcht-detail',
        'report.batch.payment' : 'api/settle/report-batch-payment',
        'export.report.brh.fee' : 'api/settle/report-brh-fee/export-excel',
        'export.report.mcht.detail' : 'api/settle/report-mcht-detail/export-excel',
        'export.report.batch.payment' : 'api/settle/report-batch-payment/export-excel',
        'export.trade.txn': 'api/settle/trade-water/export-excel',

        'boxSn'                : 'api/mcht/terminals/unbundling/(:boxSn)',

        'terminals.import.file' : 'api/mcht/terminals/import-excell',

        'terminals.adjust.file' : 'api/mcht/terminals/adjust-excell',  //调整终端
        'terminals.unbind.file' : 'api/mcht/terminals/unbind-excell', //解绑终端
        'terminals.putback.file': 'api/mcht/terminals/bat_collect',  //批量回收返修
        'terminals.snsearch.file': 'api/mcht/terminals/findBySns',  //SN批量查询
        'terminals.replterm.file': 'api/mcht/terminals/repalace-terminal-excell',  //租机替换

        'mcht.onestop.search'  : 'api/mcht/one-step/search',

        'report.amt.stat'                 : 'api/mcht/report/mcht-amt-stat',
        'report.trade.stat'               : 'api/mcht/report/mcht-trade-stat',
        'pfms-report'                     : 'api/mcht/report/pfms-report',
        'report.tree.getExploreByOrg'     : 'api/mcht/performance/report/getBrhExplorerInfo/(:id)',
        'report.tree.getChildrenByOrg'    : 'api/mcht/performance/report/getBrhInfo/(:id)',
        'report.tree.getInitOrgData'      : 'api/mcht/performance/report/getInitBrhInfo',

        'report.brh.month': 'api/report/rewardNorm/branch_month', // 机构业绩月报表
        'report.brh.day': 'api/report/rewardNorm/branch_day', // 机构业绩日报表
        'report.opr.month': 'api/report/rewardNorm/operator_month', // 拓展员业绩月报表
        'report.opr.day': 'api/report/rewardNorm/operator_day', // 拓展员业绩日报表

        'report.search.mcht'              : 'api/mcht/report/pointpay/mcht-info',

        //report.rank.child.brh.init 机构树初始化， 场景：比较目标机构的下级机构之间的业绩
        'report.rank.child.brh.init'       : 'api/mcht/performance/report/getInitBrhInfo?type=rankBrh',
        //report.performance.child.brh.init 机构树初始化， 场景：比较目标机构的业绩
        'report.performance.child.brh.init'       : 'api/mcht/performance/report/getInitBrhInfo?type=reportBrh',
        //report.explore.child.brh.init 机构树初始化， 场景：比较拓展员之间的业绩
        'report.explore.child.brh.init'       : 'api/mcht/performance/report/getInitBrhInfo?type=explore',

        'report.tree.searchExplore'       : 'api/mcht/performance/report/searchBrhExplorerInfo',
        'report.tree.searchOrg'           : 'api/mcht/performance/report/searchBranchInfo',
        'report.tree.searchBrh.award'     : 'api/mcht/performance/report/searchBranchInfoWithDataFilterByRule',//业绩指标查询中 机构弹框的搜索机构请求
        'report.chart.ranking'            : 'api/mcht/report/pfms-rank',
        'pfms.report.download'            : 'api/mcht/report/pfms-report-download',
        'pfms.rank.download'              : 'api/mcht/report/pfms-rank-download',

        'pointpay.report.org.tree.brh.init'      : 'api/mcht/report/pointpay/brh/getInitBrhInfo',//点付报表，选择机构，初始化机构树数据
        'pointpay.report.org.tree.opr.init'      : 'api/mcht/report/pointpay/opr/getInitBrhInfo',//点付报表，选择拓展员初始化机构树数据

        'report.mcht.txns'                : 'api/mcht/report/pointpay/mcht-txns',//商户流水对账
        'report.mcht.txns.download'       : 'api/mcht/report/pointpay/mcht-txns-down-load',//下载商户流水对账
        'report.brh.txns'                 : 'api/mcht/report/pointpay/brh-txns',//机构流水对账
        'report.brh.txns.download'        : 'api/mcht/report/pointpay/download-brh-txns',//下载机构流水对账
        'report.brh.expand'               : 'api/mcht/report/pointpay/branch-expand-statistics',//机构拓展员交易汇总
        'report.brh.expand.download'      : 'api/mcht/report/pointpay/branch-expand-statistics-down-load',//下载机构拓展员交易汇总
        'report.brh.mcht.trade'           : 'api/mcht/report/pointpay/brh-mcht-trade-statistic',//机构商户交易汇总
        'report.brh.mcht.trade.download'  : 'api/mcht/report/pointpay/download-brh-mcht-txns',//下载机构商户交易汇总
        'report.maintain.summary'         : 'api/mcht/report/maintain/summary',//商户关系维护汇总情况
        'report.maintain.summary.download': 'api/mcht/report/maintain/summary-download',//下载商户关系维护汇总情况
        'report.maintain.mcht.details'    : 'api/mcht/report/maintain/mchtDetails',//商户关系维护商户情况
        'report.maintain.mcht.details.download'    : 'api/mcht/report/maintain/mcht-details-download',//下载商户关系维护商户情况

        'sen.fields': 'api/column/config/sensitive-fields/(:which)',//列配置获取, which标识某种机构访问级别
        'sen.fields.updatebatch': 'api/column/config/sensitive-fields/(:which)/update-batch',//列配置更新, which标识某种机构访问级别
        'mcht-info-change': 'api/system/mcht-info-change', //商户信息变更历史

        'version.ctrl': 'api/version/control',  //版本控制


        'service.list':     'api/system/service',  // 获取服务列表
        'service.save':     'api/system/service/save-service/(:id)',  //创建新服务
        'service.get':      'api/system/service/get-service/(:id)',  //获取一条服务的详细数据
        'service.code':     'api/system/options/service-code',      //获得服务代码
        'service.fee':      'api/system/discs/service-fee-model/(:target)',      //获得商户/代理商  手续费率/分润模型
        'service.reward':   'api/system/discs/service-reward-model/(:target)',  //获得代理商奖励分润模型
        'service.register': 'api/system/service/get-register/(:id)', //获取开通服务的数据
        'service.saveRegister': 'api/system/service/save-register/(:id)',  //修改开通配置
        'service.fee.list': 'api/system/pro-configs/(:serviceCode)',  //获取费率服务列表
        'service.fee.model': 'api/system/discs/service-fee-model',  //获取费率服务模型
        'service.fee.today': 'api/system/pro-configs/service-pro/(:serviceCode)/(:date)',  //当前服务费率
        'service.fee.code' : 'api/calculation/service/object-manager/service-names',  //获得服务代码
        'service.fee.getMchtName': 'api/system/pro-configs/getMchtName',  //获得商户名
        'service.fee.save': 'api/system/pro-configs/bat',  //费率保存
        'service.fees.save': 'api/system/pro-configs/bat/week/(:year)/(:serviceCode)',  //费率批量保存

        'service.mchtlist':          'api/system/service/get-invate-mchtlist/(:id)',    //获得达到邀请标准的商户列表（分页）
        'service.brhlist':           'api/system/service/get-invate-brhlist/(:id)',    //获得代理商邀请名额列表（分页）
        'service.invitenum':         'api/system/service/save-service-invitenum/(:id)/(:num)',    //修改邀请总名额
        'service.brh.invitenum':     'api/system/service/save-brh-invitenum/(:id)',    //修改机构邀请名额
        'service.import':            'api/system/service/import-excell',

        'service.registter.mchtlist': 'api/system/service/get-register-mchtlist/(:id)',      //获取已开通服务的商户列表
        'service.status':     'api/system/service/set-register-status/(:id)/(:mchtNo)/(:status)',   //修改商户服务开通状态


        'brh.service' :                 'api/system/service/brhService/(:brhCode)', //获取代理商的服务列表
        'brh.active.business' :         'api/system/service/activeBusiness/(:id)/(:brhCode)',//获取已开通服务商户列表
        'brh.available.business' :      'api/system/service/availableBusiness/(:id)/(:brhCode)',//获取可邀请商户列表
        'brh.invite.business':          'api/system/service/inviteBusiness',//提交邀请商户列表

        //'user.notices.summary': 'api/announcement/currUser/summary',//接收者 获取当前公告概要信息
        'user.notices': 'api/announcement/currUser/(:id)',//用户（接受者）查看当前公告列表
        'mgr.notices': 'api/announcement/(:id)',
        'notice.receive': 'api/announcement/currUser',
        'send.notice': 'api/announcement',
        'notice.download.attachment': 'api/announcement/download-attachment',
        'notice.upload.attachment': 'api/announcement/upload-attachment',
        'notice.upload.image': 'api/announcement/upload-image',

        'push.sm.record': 'api/push/push-sm/sm-tasks', //获取短信记录列表
        'push.sm.eidt'     : 'api/push/push-sm/msg-type/(:id)',  // 增加、编辑、删除短信类型
        'push.sm.category': 'api/push/push-sm/msg-list', //获取用户自定义短信类型
        'push.sm.submit': 'api/push/push-sm/submit-send-task/(:id)', //提交短信
        'sm.upload.file': 'api/push/push-sm/upload-phone-no', //导入文件
        'push.sm.detail': 'api/push/push-sm/sm-tasks/plan-task/(:id)', //短信详情
        'push.sm.status': 'api/push/push-sm/sm-tasks/(:id)/status', //变更短信状态
        'push.sm.resend.fail': 'api/push/push-sm/sm-tasks/resend-fail/(:id)', //重发失败短信

        'push.msg': 'api/push/push-msg/(:id)',//推送消息
        'push.msg.receive': 'api/push/push-msg/receive?appType=(:appType)',//获取用户信息
        'push.msg.branchlist': 'api/push/push-msg/branchlist',//获取机构信息
        'push.msg.branchlistchosed': 'api/push/push-msg/branchlistchosed/(:id)',//获取机构默认信息
        'push.msg.perform': 'api/push/push-msg/perform/(:id)',//消息审核
        'upload.xls': 'api/push/push-msg/upload-push-target',//上传XLS
        'push.msg.center': 'api/push/push-msg-center/(:id)',//消息中心
        'push.msg.center.perform': 'api/push/push-msg-center/perform/(:id)',//消息中心审核
        'push.msg.center.cancel': 'api/push/push-msg-center/cancel/(:id)',//取消消息
        'push.msg.center.repeal': 'api/push/push-msg-center/repeal/(:id)',//撤销某条推送的消息
        'upload.center.xls': 'api/push/push-msg-center/upload-push-target',//上传XLS
        'upload.center.preview.image': 'api/push/push-msg-center/upload-preview-image',//上传消息预览图片
        'push.msg.cancel': 'api/push/push-msg/cancel/(:id)',//取消某条推送的消息
        'push.msg.repeal': 'api/push/push-msg/repeal/(:id)', //撤销某条推送的消息

        'message.customer.sms': 'api/customer-service',//查询-客服短信发送配置
        'message.customer.smsConfig': 'api/customer-service/update-limit',//设置-客服短信发送配置
        'message.template.Config.list': 'api/customer-service/msg-list',//查询-客服短信模板配置
        'mcht.send.message': 'api/mcht/merchants/send-message', //商户查询-发送短信
        'message.smsConfig.getLimit': 'api/customer-service/get-limit',//客服短信配置 显示数据

        'route.txn':       'api/mcht/route/txn-models/(:id)',  // 交易模型
        'route.channel':   'api/mcht/route/channel-models/(:id)',  // 通道模型
        'route.mcht':      'api/mcht/route/channel-mcht-models/(:id)',  //  通道商户模型
        'route.upload':    'api/mcht/route/upload-mcht-models',

        'route.open.close.default':   'api/mcht/route/channel-mcht-models/batch-open-close/bydefault',   //  批量开启、关闭无搜索条件
        'route.maxtotalamt.default':  'api/mcht/route/channel-mcht-models/batch-upd-maxtotalamt/bydefault',  // 批量修改额度 无搜索条件
        'route.channel.name':         'api/mcht/route/channel-mcht-models/get-channel-name',   // 获取通道名称的中文和英文名

        'route.channel.config':   'api/mcht/route/channel-attr-config/(:id)',  // 通道属性配置
        'route.channel.config.upd.status':   'api/mcht/route/channel-attr-config/upd-status/(:id)',  // 通道属性配置-修改状态
        'route.onesettle.mcht.config':'api/mcht/route/onesettle-mcht-config/(:id)',//一清商户配置
        'route.onesettle.config.upd.status':'api/mcht/route/onesettle-mcht-config/updateStatus/(:id)',//一清商户配置-修改状态

        //无卡路由商户配置
        'route.nocard.route.mcht.config'     :'api/mcht/online/router/(:id)',//无卡路由商户配置
        'route.nocard.route.config.upd.status'  :'api/mcht/online/router/updateStatus/(:id)',//修改单个状态
        'route.nocard.route.config.bat.upd.status' :'api/mcht/online/router/bat-update-sta',//批量修改状态
        'route.download.nocard.excel':'api/mcht/online/router/download_template',//下载excel模板
        'route.upload.nocard.excel':'api/mcht/online/router/batch_import',//批量导入excel模板
        'route.nocard.channel.name':'api/mcht/route/online/channel-mcht-models/get-channel-name',//无卡路由商户通道
        //无卡路由商户号模型
        'route.nocard.filters.mcht' :'api/mcht/route/online/channel-mcht-models-filters/(:id)', //获得无卡路由商户号模型列表/注销商户通道模型
        'route.nocard.mcht' :'api/mcht/route/online/channel-mcht-models/(:id)', //通道商户模型
        'route.nocard.dmaxtotalamt.default' :'api/mcht/route/online/channel-mcht-models/batch-upd-maxtotalamt/bydefault', //批量修改单日最大额度
        'route.nocard.remark.default' :'api/mcht/route/online/channel-mcht-models/batch-upd-remark/bydefault', //批量修改备注
        'route.nocard.open.close.default' :'api/mcht/route/online/channel-mcht-models/batch-open-close/bydefault', //批量开启/关闭
        'route.nocard.download.excel' :'api/mcht/route/online/channel-mcht-models/download-template',//下载excel模板
        'route.nocard.upload' :'api/mcht/route/online/upload-mcht-models',//上传excel模板
        'batch.nocard.open.close.filters': 'api/mcht/route/online/channel-mcht-models/batch-open-close/byfilters',  // 批量开启和关闭通道商户模型(条件过滤的时候)
        //无卡路由通道属性配置
        'route.nocard.channel.config':  'api/mcht/route/online/channel-attr-config/(:id)',  //通道属性列表
        'route.nocard.channel.config.upd.status': 'api/mcht/route/online/channel-attr-config//upd-status/(:id)',//状态变更
        //无卡路由二清通道列表
        'nocard.route.channel': 'api/mcht/route/online/channel-models/(:id)',//通道模型查询
        //无卡路由二清实时规则
        'nocard.route.txn.bind': 'api/mcht/route/online//txn-bind/(:id)',//修改关联的通道模型
        'nocard.route.channel.bind': 'api/mcht/route/online/channel-bind/(:id)',//修改关联的通道商户模型
        'nocard.route.txn': 'api/mcht/route/online/txn-models',//本机商户模型（交易模型）查询

        //有卡路由
        'route.filters.mcht': 'api/mcht/route/channel-mcht-models-filters/(:id)',  // 通道商户模型支持条件过滤
        'batch.open.close.filters':      'api/mcht/route/channel-mcht-models/batch-open-close/byfilters',  // 批量开启和关闭通道商户模型(条件过滤的时候)
        'batch.upd.maxtotalamt.filters': 'api/mcht/route/channel-mcht-models/batch-upd-maxtotalamt/byfilters',  //批量修改单日额度（条件过滤的时候）
        'batch.open.close.kw':      'api/mcht/route/channel-mcht-models/batch-open-close/bykw',  //批量修改单日额度（模糊搜索的时候）
        'batch.upd.maxtotalamt.kw': 'api/mcht/route/channel-mcht-models/batch-upd-maxtotalamt/bykw',  //批量修改单日额度（模糊搜索的时候）

        'route.remark.default':  'api/mcht/route/channel-mcht-models/batch-upd-remark/bydefault',  //批量备注信息 无条件搜索条件
        'route.txn.bind':           'api/mcht/route/txn-bind/(:id)',     // 修改交易模型与通道模型间的绑定关系
        'route.channel.bind':       'api/mcht/route/channel-bind/(:id)', // 修改通道模型与通道商户模型间的绑定关系
        'route.batch.bind':        'api/mcht/route/batch-bind/(:id)',  // 批量修改通道模型与通道商户模型间的绑定关系
        'route.download.excel':  'api/mcht/route/channel-mcht-models/download-template',
        'route.download.onesettle.excel':'api/mcht/route/onesettle-mcht-config/download_template',
        'route.upload.onesettle.excel':'api/mcht/route/onesettle-mcht-config/batch_import',

        //路由-结算路由
        'route.settlement.channelConfig.list': 'api/mcht/settle/route/channel',
        'route.settlement.channelConfig.edit': 'api/mcht/settle/route/channel/(:id)',
        'route.settlement.capacityConfig.list': 'api/mcht/settle/route/rule',
        'route.settlement.capacityConfig.edit': 'api/mcht/settle/route/rule/(:id)',
        'route.settlement.regularConfig.list': 'api/mcht/settle/route/special',
        'route.settlement.regularConfig.edit': 'api/mcht/settle/route/special/(:id)',

        //代扣路由-通道模型
        'route.withhold.channelRouter.list': 'api/mcht/withhold/route/base/channel',//查询
        'route.withhold.channelRouter.edit': 'api/mcht/withhold/route/base/channel/(:id)',//新增，编辑
        'route.withhold.channelRouter.upd-status': 'api/mcht/withhold/route/base/channel/upd-status/(:id)',//更改状态


        'disc.brh.list': 'api/system/rate/model/brh/(:modelId)', //获取机构费率模型列表
        'disc.brh': 'api/system/rate/model/brh/(:id)', //编辑 删除 机构费率模型
        'disc.brh.check.modelNm' : 'api/system/rate/model/checkModelNm/(:modelNm)', //验证机构费率模型名称是否重复

        //路由-代扣路由-产品模型
        'route.product': 'api/mcht/withhold/route/product',     //产品模型配置
        'route.channel.query': 'api/mcht/withhold/route/channel/query',          //查询银行
        'route.product.upd-status': 'api/mcht/withhold/route/product/upd-status/(:id)',          //更改状态

        //路由-代扣路由-通道产品模型
        'route.channelProduct.list': 'api/mcht/withhold/route/channel',     //查询列表
        'route.channelProduct.edit': 'api/mcht/withhold/route/channel/(:id)',     //编辑
        'route.channelProduct.upd-status': 'api/mcht/withhold/route/channel/upd-status/(:id)',    //更改状态
        'route.channelProduct.channel.query': 'api/mcht/withhold/route/base/channel/query',          //查询通道下拉列表

        //验证机构费率模型名称唯一性（同机构下）
        'valid.disc.brh.modelname.unique': 'api/system/rate/model/checkModelNm/(:modelName)/(:brhCode)',
        'disc.scheme': 'api/system/rate/model/disc/(:modelId)', //计费方案列表
        'disc.edit.scheme': 'api/system/rate/model/disc/(:id)', //编辑/删除计费方案
        'disc.unite.ratio': 'api/system/rate/model/uniteRatio', //统一分润配置

        'disc.direct.mcht': 'api/mcht-algos/model/model-list/P', //直联商户费率模型列表
        'disc.indirect.mcht': 'api/mcht-algos/model/model-list/H', //间联商户费率模型列表
        'disc.mcht.model.brh': 'api/system/options/model/modelBrh', //商户费率模型获取机构
        'disc.mcht.mchtGrp': 'api/mcht-algos/model/mchtGrp', //商户费率模型获取商户类型
        'disc.mcht.transType': 'api/mcht-algos/model/transType', //商户费率模型获取交易类型
        'disc.mcht.setting': 'api/mcht-algos/model/setting', ////商户费率模型获取费率相关设置
        'disc.mcht.model': 'api/mcht-algos//model/(:type)/mcht-model', //直联新增编辑费率模型
        'disc.mcht.pubdisc.algo': 'api/mcht-algos/pub-disc-algo/(:modelId)', //编辑费率模型 费率模型配置
        'disc.mcht.del': 'api/mcht-algos/DEL/(:type)/(:id)', //删除商户费率模型
        'disc.mcht.valid.modelNm': 'api/mcht-algos/model/check-name/?name=(:name)&brhCode=(:brhCode)', //验证商户费率模型名称是否重复
        'disc.mcht.upperBrhIsDirect': 'api/mcht-algos/model/PB/?brhCode=(:brhCode)', //判断 所属机构最近的机构模型的机构费率模型是否是 商户直联费率模型

        'brh.profit': 'api/system/rate/model/profit/(:id)', //机构分润模型方案
        'brh.standard.treaty': 'api/system/rate/model/standardTreaty/(:modelBrh)', //获取当前机构所建直联和间联费率模型
        'brh.upper.brh.disc': 'api/system/rate/model/upperBrhDisc', // 获取上级机构的特定商户类型的计费方案
        'disc.profit.valid.name': 'api/system/rate/model/checkProfitNm/(:modelNm)/(:modelBrh)', //验证机构分润模型名称是否重复

        'disc.service.profit': 'api/system/profit',//服务费分润 分页查询
        'disc.service.profit.add': 'api/system/profit/(:id)',//服务费分润 新增
        'disc.service.profit.servicename': 'api/system/profit/service-names',//关联服务下拉框显示内容
        'disc.service.profit.edit': 'api/system/profit/(:id)',//服务费分润 修改

        'disc.service.mcht': 'api/system/pro-configs',//单商户服务费配置 分页查询
        'disc.service.mcht.getName': 'api/system/pro-configs/mchtName?kw=(:mchtNo)',//单商户服务费配置 获取商户名
        'disc.service.mcht.download': 'api/system/pro-configs/download-template',//单商户服务费配置 批量导入 下载
        'disc.service.mcht.import': 'api/system/pro-configs/import-excell',//单商户服务费配置 批量导入 上传

        'mcht.name': 'api/system/options/mchtName',
        'mcht.ibox42': 'api/settle/trade-water',
        'org.name':  'api/system/options/orgName',
        'operateor.name': 'api/system/options/operatorName',
        'cups.name': 'api/system/options/cupsName',
        'cups.name.tc0': 'api/settle/txns/tc00-cups',//划分批次 单独查渠道名称
        'trade.txn.detail': 'api/settle/trade-water/findById/(:id)',
        'operate.txn.detail': 'api/utils/sign-purchase-order/findById/(:id)',

        'txn.transaction'      : 'api/utils/sign-purchase-order', //签购单
        'transaction.upload'   : 'api/utils/sign-purchase-order/upload-sign-media', //签购单上传图片
        'transaction.export'   : 'api/utils/sign-purchase-order/export-signOrder', //签购单导出
        'transaction.getsign'  : 'api/utils/sign-purchase-order/sign-pic-url', //签购单下载签名

        'operate.raiseAmount.auditCredit'    : 'api/credit/getcreditlist/auditCredit',//审批提额申请
        'operate.raiseAmount.getone'    : 'api/credit/getcreditlist/getone',//根据审批编号获取单笔提额记录
        'operate.raiseAmount'    : 'api/credit/getcreditlist',//查询微信提额记录列表
        'operate.blacklist'    : 'api/blackList',//进件黑名单分页查询
        'operate.blacklist.add': 'api/blackList/save',//进件黑名单添加
        'operate.blacklist.import.add': 'api/blackList/batch_import',//进件黑名单-批量导入
        'operate.blacklist.import.download': 'api/blackList/download_template',//进件黑名单-批量导入
        'operate.blacklist.status.edit': 'api/blackList/updateStatus/(:id)',//状态修改 黑名单启用/停用

        'service.targer.config' :  'api/serviceObj/Config/(:serviceId)',//服务对象配置管理
        'service.targer.config.edit' :  'api/serviceObj/Config/(:id)',//服务对象配置管理 修改
        'service.targer.config.add' :  'api/serviceObj/Config',//服务对象配置管理 新增
        'service.targer.config.del' :  'api/serviceObj/Config/(:id)',//服务对象配置管理 删除
        'service.targer.config.repeat' :  'api/serviceObj/Config/objNo/(:objType)/(:objNo)',//服务对象配置管理 查询服务编号重复

        'service.targer.config.downLoad' :  'api/serviceObj/Config/down-template',//服务对象配置管理 下载模板
        'service.targer.config.import' :  'api/serviceObj/Config/import',//服务对象配置管理 导入 /(:serviceId)

        'service.telephone.alertInfo' :  'api/mcht/custom-calls',//来电弹屏信息

        'order.search'         : 'api/utils/order', // 工单查询
        'order.search.download': 'api/utils/order/download-report', // 工单下载
        'order.search.deal': 'api/utils/order/deal', // 工单处理

        'operate.cmcht.list' : 'api/mcht/mcht_direc_clear', // 通道商户查询
        'operate.cmcht.import' : 'api/mcht/mcht_direc_clear/import', // 通道商户批量导入
        'operate.cmcht.export' : 'api/mcht/mcht_direc_clear/export-excel', // 通道商户批量导入
        'operate.cmcht.download' : 'api/mcht/mcht_direc_clear/download-template', // 下载通道商户模板
        'operate.cmcht.channels' : 'api/mcht/mcht_direc_clear/settle_channels', // 获取通道选项
        'operate.cmcht.changestatus' : 'api/mcht/mcht_direc_clear/change-status', // 批量更改商户状态
        'operate.cmcht.changestate' : 'api/mcht/mcht_direc_clear/change-state/(:id)', // 更改商户状态
        'operate.cmcht.changechannelstate' : 'api/mcht/mcht_direc_clear/channle-change-state/(:id)', // 更改通道状态
        'operate.cmcht.batofchannelstate' : 'api/mcht/mcht_direc_clear/sycMchtInfo', // 批量更改通道状态
        'operate.cmcht.checkmobile' : 'api/mcht/mcht_direc_clear/checkMobile?mobile=(:mobile)', // 校验手机号
        'operate.cmcht.checkcardno' : 'api/mcht/mcht_direc_clear/checkCardno?cardno=(:cardno)', // 校验身份证

        'operate.sync.mchtChannel.list': 'api/mcht/settle_channel',//同步商户信息渠道属性管理功能与配置
        //'operate.sync.mchtChannel.edit': 'api/mcht/settle_channel',//修改 同步商户信息渠道属性管理功能与配置
        'operate.sync.mchtChannel.updateStatus': 'api/mcht/settle_channel/(:id)',//修改状态
        'operate.sync.mchtChannel.listByChannelNo': 'api/mcht/settle_channel/(:channelNo)',//
        'operate.sync.hfmcht.download': 'api/mcht/mcht_direc_clear/gethftemplate',//同步弘付商户(HF)
        'operate.sync.hfmcht.import': 'api/mcht/mcht_direc_clear/import-mcht-sychinfo',//同步弘付商户(HF)

        'operate.cashboxconfig.list':'api/cashbox/serviceList', //钱盒增值服务配置
        'operate.cashboxconfig.save':'api/cashbox/serviceList/save', //钱盒增值服务配置
        'operate.cashboxconfig.update':'api/cashbox/serviceList/update/(:id)', //钱盒增值服务配置
        'operate.cashboxconfig.delete':'api/cashbox/serviceList/delete/(:id)', //钱盒增值服务配置
        'operate.cashboxmanage.refresh':'api/cashbox/console/refreshConfigs', //钱盒后台管理-刷新配置

        'operate.cashpollconfig.list': 'api/cashPool',//资金池配置
        'operate.cashpollchange.list': 'api/cashPoolLog',//资金池信息变更

        'operate.replycode.list':'api/trade/answercode', //有卡交易应答码查询
        'operate.replycode.download':'api/trade/answercode/download-import', //有卡交易应答码查询模板下载
        'operate.replycode.upload':'api/trade/answercode/import', //有卡交易应答码批量上传
        'operate.replycode.onlinelist':'api/trade/onlineanswercode', //无卡交易应答码查询
        'operate.replycode.onlinedownload':'api/trade/onlineanswercode/download-import', //无卡交易应答码查询模板下载
        'operate.replycode.onlineupload':'api/trade/onlineanswercode/import', //无卡交易应答码批量上传
        'operate.replycode.find-source':'api/trade/onlineanswercode/find-source', //无卡交易应答码错误来源

        'operate.business.search': 'api/buss/oppor', //商机查询
        'operate.business.user': 'api/buss/oppor/find/(:id)', //用户信息查询
        'operate.convenience.search': 'api/settle/handy', //便民查询
        'operate.convenience.download': 'api/settle/handy/down-load', //便民信息下载
        'operate.discount.coupon': 'api/discountCoupon', //钱盒优惠券查询
        'operate.discount.coupon.mchtName': 'api/mcht/bases/name_like', //获取商户列表
        'operate.discount.coupon.userName': 'api/system/operators/like_name', //获取发放人列表
        'operate.discount.coupon.get': 'api/discountCoupon/get_coupon', //钱盒优惠券面值
        'operate.discount.coupon.total': 'api/discountCoupon/total_coupon', //钱盒优惠券发放统计

        'operate.data.move.org.list': 'api/mcht/data-moves/brh/search', //机构迁移
        'operate.data.move.org.dataInit': 'api/mcht/data-moves/brh/init', //机构迁移-数据初始化
        'operate.data.move.org.dataClean': 'api/mcht/data-moves/brh/del', //机构迁移-数据初始化
        'operate.data.move.org.dataAction': 'api/mcht/data-moves/brh/action', //机构迁移-数据初始化
        'operate.data.move.user.list': 'api/mcht/data-moves/opr/search', //拓展员迁移
        'operate.data.move.user.dataInit': 'api/mcht/data-moves/opr/init', //拓展员迁移-数据初始化
        'operate.data.move.user.dataClean': 'api/mcht/data-moves/opr/del', //拓展员迁移-数据初始化
        'operate.data.move.user.dataAction': 'api/mcht/data-moves/opr/action', //拓展员迁移-数据初始化
        'operate.data.move.mcht.list': 'api/mcht/data-moves/mcht/search', //商户迁移
        'operate.data.move.mcht.dataInit': 'api/mcht/data-moves/mcht/init', //商户迁移-数据初始化
        'operate.data.move.mcht.dataClean': 'api/mcht/data-moves/mcht/del', //商户迁移-数据初始化
        'operate.data.move.mcht.dataAction': 'api/mcht/data-moves/mcht/action', //商户迁移-数据初始化
        'operate.data.move.mcht.downloadTpl': 'api/mcht/data-moves/download-template', //商户迁移-数据初始化
        'operate.data.move.log': 'api/mcht/data-moves/log/search', //数据迁移 - 查看日志

        'promotions.model.list':     'api/promotionsMod',  // 获取优惠方案模型列表
        'promotions.management.list':'api/promotionObj',  // 获取优惠对象管理列表
        'promotions.management.import':'api/promotionObj/import', //导入优惠对象
        'promotions.management.get.promotsView':'api/promotionObj/promotions', //获取优惠方案类型
        'promotions.management.get.promotsName':'api/promotionObj/getPromotsName', //获取优惠方案名称
        'promotions.management.get.mchtName':'api/promotionObj/getMchtName', //根据商户号获取商户名称
        'promotions.management.download.tpl':'api/promotionObj/download-template', //下载导入优惠对象模板

        'account.trade.list': 'api/account/getAccountTradeDetail',//账户提现记录查询

        'mcht.cupsName.list': 'api/mcht/channel ',//渠道商户维护
        'mcht.cupsName.views': 'api/mcht/channel/view/(:id)',//编辑时查看关联信息
        'meeting.launch.list': 'api/meeting', // 发起会议列表
        'meeting.launch.save': 'api/meeting/save', // 新增会议
        'meeting.launch.changestate': 'api/meeting/updateStatus/(:id)', // 更新会议状态

        //重置密码
        'operators.reset.password': 'api/system/operators/reset-pwd',
        'mcht.user.reset.password': 'api/mcht/users/reset-pwd',

        /**
         * menuName:账户管理
         * 主模块
         **/
        'account.info.list': 'api/account/userInfo',//用户信息查询
        'account.config.list': 'api/account/search',//主账户管理查询
        'account.config.status.edit':'api/account/changeStatus/(:id)',//主账户管理 状态修改
        'account.bind.list':'api/account/getBankCardList',//绑定卡管理查询
        'account.bind.status.edit':'api/account/changeBankCardStatus',//修改绑定卡状态
        'account.sub.list':'api/subAccount/list',//子账户查询
        'account.sub.status.edit':'api/subAccount/changeStatus',//修改子账户状态
        'account.sub.status.freeze':'api/subAccount/subAccountFreeze',//修改子账户 冻结
        'account.sub.status.unfreeze':'api/subAccount/subAccountUnfreeze',//修改子账户 解冻
        'account.sub.select': 'api/subAccount/select', //子账户查询下拉框 （手工记账有用到）

        /**
         * menuName:科目管理
         * 子模块
         **/
        'account.subject.list':'api/subject',//科目管理 查询
        'account.subject.detail':'api/subject/(:subjectCode)',//科目管理 详细查询
        'account.subject.info': 'api/subject/info', //科目查询 （手工记账用到）
        'account.subject.check': 'api/manualAccounting/audit',//审核功能

        /**
         * menuName:调账列表
         * 子模块
         **/
        'adjust.account.list': 'api/changeAccounting', //查询分页 调账
        'adjust.account.check': 'api/changeAccounting/audit', //审核
        'adjust.account.tradeDetails': 'api/account/getAccountTradeDetail', //查询分页 新增调账
        'adjust.account.tradeType': 'api/account/getTradeType', //交易类型数据 （调账有用到）
        'adjust.account.record.list': 'api/accounting/getAccountingRecords/(:tradeNo)', //调账新增===>查询详情然后调账操作

        /**
         * menuName: 手工记账
         * 子模块
         * */
        'manual.account.list': 'api/manualAccounting', //增查 手工记账
        'manual.account.edit': 'api/manualAccounting/(:id)', //改 手工记账

        //日切
        'exceptions.detail.list': 'api/cutoffCheck/detail',
        'exceptions.total.list': 'api/cutoffCheck/total',

        //奖励分润信息
        'posted.info.list': 'api/postedTicket',
        'postedInfo.download.file': 'template/account-posted-ticket.xls',//奖励分润信息 下载
        'postedInfo.file.import': 'api/postedTicket/import-excel',//奖励分润信息 导入
        'postedInfo.postedTicket':'api/postedTicket/re-check/(:batchNo)',//审核 分润也有审核功能
        'postedInfo.download': 'api/postedTicket/download/(:batchNo)',//导出


        //贴票管理
        'posted.ticket.list': 'api/postedTicket/detail-page',
        'posted.ticket.audit.edit':'api/postedTicket/audit/(:id)',//审核
        'posted.ticket.audit': 'api/postedTicket/posted/(:id)',//贴票
        'posted.ticket.frozen':'api/postedTicket/frozen/(:id)',//入账
        'posted.ticket.thaw': 'api/postedTicket/thaw/(:id)',//解冻
        'posted.ticket.batch.audit': 'api/postedTicket/batch-audit',//批量审核
        'posted.ticket.batchthaw': 'api/postedTicket/batch-thaw',//批量解冻
        'posted.ticket.downloadReward': 'api/postedTicket/downloadReward',        //导出奖励
        'posted.ticket.downloadDetail': 'api/postedTicket/download/detail',        //下载(导入贴票信息模板)
        'posted.ticket.importDetail': 'api/postedTicket/import/detail',        //贴票数据批量导入
        'posted.ticket.downloadDetailOut': 'api/postedTicket/download/detail/out',        //下载(导入变更发奖方式模板)
        'posted.ticket.importDetailOut': 'api/postedTicket/import/detail/out',        //变更发奖方式批量导入

        //贴票审核
        'posted.audit.list': 'api/operator/postedTicket/apply', //盒伙人贴票申请查询列表 GET //修改申请的贴票信息 PUT
        'posted.audit.exportApplyTable': 'api/operator/postedTicket/apply/exportApplyTable', //导出付款申请表
        'posted.audit.user': 'api/operator/postedTicket/apply/user/(:userId)', //点击审核通过的时候查询该用户名下的所有状态为待审核的奖励明细表记录
        'posted.audit.userUpdate': 'api/operator/postedTicket/apply/user/(:id)', //审核通过，点击最后确认按钮的时候
        'posted.audit.userSearch': 'api/operator/postedTicket/apply/user/search', //模糊查询接口
        'posted.audit.postedTicketFindUserId': 'api/operator/postedTicket/apply/find',

        //系统设置
        'system.setting.module': 'api/system/auths',  //模块权限配置
        'system.setting.unionPlatform': 'api/system/serviceInfo',  //统一平台配置
        'system.serviceInfoMap': 'api/system/serviceInfo/getServiceInfoMap', //查询模块为map
        'system.authCodeExist': 'api/system/auths/authCodeExist'//判断权限码是否存在
    }
});