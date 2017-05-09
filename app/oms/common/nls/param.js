define({
	root: {
			//@link(value="account")
		'account.txt'              : '账户信息',
		'account.app.type'         : '应用类型',
		'account.app.id'           : '应用标示号',
		'account.seq'              : '帐户序号',
		'account.is.default'       : '是否为默认帐户',
		'account.type'             : '帐户类型',
		'account.no'               : '帐户帐号',
		'account.name'             : '帐户名称',
		'account.status'           : '帐户状态',
		'account.bank.no'          : '帐户开户行号',
		'account.bank.name'        : '帐户开户行名称',
		'account.zbank.no'         : '帐户开户支行号',
		'account.zbank.name'       : '帐户开户支行名称',
		'account.zbank.addr'       : '帐户开户支行地址',
		'account.zbank.code'       : '帐户开户支行地区号',
		'account.net.no'           : '帐户网银支付号',
		'account.union.no'         : '帐户联行号',
		'account.is.default.true'  : '是',
		'account.is.default.false' : '否',
		'account.type.public'      : '对公',
		'account.type.private'     : '对私',
		'account.status.normal'    : '正常',
		'account.status.abnormal'  : '异常',


			//@link(value="card-bin")
		'card-bin.txt'           : '卡bin',
		'card-bin.ins.id.cd'      : '发卡行',
		'card-bin.acct.offset'    : '卡号偏移量',
		'card-bin.acct.len'       : '卡号长度',
		'card-bin.acct.tnum'      : '卡号磁道号',
		'card-bin.bin.offset'     : '卡bin偏移量',
		'card-bin.bin.len'        : '卡bin长',
		'card-bin.bin.start.no'   : '卡bin起始号',
		'card-bin.bin.end.no'     : '卡bin结束号',
		'card-bin.bin.tnum'       : '卡bin磁道号',
		'card-bin.card.type'      : '卡类型',
		'card-bin.card.discr'     : '描述',

			//@link(value="disc")
		'disc.txt'         : '计费模型',
		'disc.id'          : 'id',
		'disc.name'        : '名称',
		'disc.type'        : '类型',
		'disc.type.mcht'   : '商户手续费率',
		'disc.type.sale'   : '商户基准销售费率',
		'disc.type.brh'    : '机构服务费率',
		'disc.branch.code' : '机构编号',
		'disc.branch.name' : '适用机构',
		'disc.status'      : '状态',
		'disc.status.0'    : '启用',
		'disc.status.1'    : '停用',
		'disc.forbranch'   : '机构编号',


		//机构计费模型

		'disc.model.id': '模型编号',
		'disc.model.name': '模型名称',
		'disc.model.brh': '所属机构编号',
		'disc.model.brh.name': '所属机构',
		'disc.model.flag': '状态',
		'disc.model.unite.ratio': '统一分润',


		//商户计费模型
		'disc.mcht.txt': '商户计费模型',
		'disc.mcht.model.id': '模型编号',
		'disc.mcht.model.name': '模型名称',
		'disc.mcht.model.brh': '所属机构编号',
		'disc.mcht.model.brh.name': '所属机构',
		'disc.mcht.model.flag': '状态',
		'disc.mcht.model.trans.type': '交易类型',
		'disc.mcht.model.mcht.grp': '商户类型',


		//机构分润模型方案
		'brh.profit.modelNm': '方案名称',
		'brh.profit.standardId': '直联机构模型ID',
		'brh.profit.standardNm': '直联机构模型名称',
		'brh.profit.treatyId': '间联机构模型ID',
		'brh.profit.treatyNm': '间联机构模型名称',

			//@link(value="disc-algo")
		'disc-algo.txt'          : '计费算法',
		'disc-algo.disc.id'      : '手续费模型',
		'disc-algo.idx'          : '索引',
		'disc-algo.min.fee'      : '最小手续费',
		'disc-algo.max.fee'      : '最大手续费',
		'disc-algo.floor.amount' : '底线费',
		'disc-algo.upper.amount' : '最高费',
		'disc-algo.flag'         : '收费模式',
		'disc-algo.flag.1'         : '按笔比例',
		'disc-algo.flag.2'         : '按笔固定',
		'disc-algo.flag.3'         : '固定收费按日',
		'disc-algo.flag.4'         : '固定收费按月',
		'disc-algo.flag.5'         : '固定收费按季',
		'disc-algo.flag.6'         : '固定收费按半年',
		'disc-algo.flag.7'         : '固定收费按年',
		'disc-algo.fee.value'    : '费率',
		'disc-algo.card.type'    : '卡类型',
		'disc-algo.card.type.0'    : '全部卡类型',
		'disc-algo.card.type.1'    : '借记卡',
		'disc-algo.card.type.2'    : '信用卡',
		'disc-algo.card.type.3'    : '准贷记卡',
		'disc-algo.card.type.4'    : '预付费卡',

		'disc-alog.fee.range.tips' : '当 “底线费” <= 交易金额 <= “最高费” 时，本条收费规则生效。',

			//@link(value="mcc-group")
		'mcc-group.txt'          : 'MCC组',
		'mcc-group.id'           : 'id',
		'mcc-group.code'         : '编号',
		'mcc-group.name'         : '名称',
		'mcc-group.base.fee'     : '基本费率',
		'mcc-group.descr'        : '描述',

			//@link(value="mcc")
		'mcc.txt'                : 'MCC',
		'mcc.id'                 : 'id',
		'mcc.code'               : '编号',
		'mcc.type'               : '类型',
		'mcc.group'              : 'MCC组',
		'mcc.descr'              : '描述',
		'mcc.group.01'            : '宾馆娱乐类',
		'mcc.group.02'            : '房产批发类',
		'mcc.group.03'            : '超市加油类',
		'mcc.group.04'            : '医院学校类',
		'mcc.group.05'            : '一般商户类',
		'mcc.group.06'            : '新兴行业类',
		'mcc.group.07'            : '县乡优惠',

			//@link(value="media")
		'media.txt'              : '媒体信息',
		'media.id'               : '',
		'media.app.type'         : '应用类型',
		'media.app.id'           : '应用ID',
		'media.path'             : '路径',
		'media.descr'            : '描述',

			//@link(value="region-code")
		'region-code.txt'        : '地区编号',
		'region-code.id'         : '',
		'region-code.code'       : '地区编号',
		'region-code.name'       : '地区名称',
		'region-code.level'      : '级别',
		'region-code.postal'     : '邮编',
		'region-code.express'    : '快递费',

			//@link(value="sys-param")
		'sys-param.txt'          : '基本参数',
		'sys-param.id'           : '',
		'sys-param.owner'        : '属主',
		'sys-param.key'          : '键',
		'sys-param.type'         : '类型',
		'sys-param.value'        : '键值',
		'sys-param.descr'        : '描述',

			//@link(value="zbank")
		'zbank.txt'              : '支行',
		'zbank.id'               : '',
		'zbank.no'               : '支行行号',
		'zbank.name'             : '支行行名',
		'zbank.netpay.no'        : '网银支付号',
		'zbank.netpay.name'      : '网银支付行名',
		'zbank.address'          : '支行地址',

		'taskMap.txt'            : '任务配置表',
		'task.map.id'            : 'id',
		'task.map.brh.code'      : '机构编号',
		'task.map.auth.code'     : '权限编号',
		'task.map.brh.name'      : '所属机构',
		'task.map.auth.name'     : '权限名称',
		'task.map.task.flag'     : '任务标示',
		'task.map.mapBrh'        : '配置对应机构',
		'task.map.mapType'       : '配置类型',
		'task.map.sub.type'      : '子类型',
		'task.map.task.type'     : '任务类型',
		'task.map.map.version'   : '配置版本号',
		'task.map.brh.level1'    : '一次操作机构级别',
		'task.map.role.code1'    : '一次操作角色编号',
		'task.map.role.name1'    : '一次操作角色',
		'task.map.brh.level2'    : '二次操作机构级别',
		'task.map.role.code2'    : '二次操作角色编号',
		'task.map.role.name2'    : '二次操作角色',
		'task.map.brh.level3'    : '三次操作机构级别',
		'task.map.role.code3'    : '三次操作角色编号',
		'task.map.role.name3'    : '三次操作角色',

		'task.map.sub.type.101'  : '新增机构',
		'task.map.sub.type.102'  : '新增商户',
		'task.map.sub.type.103'  : '新增用户',

		'task.map.task.flag.0'   : '不用工作流',
		'task.map.task.flag.1'   : '需一次操作',
		'task.map.task.flag.2'   : '需两次操作',
		'task.map.task.flag.3'   : '需三次操作',

		'task.map.mapType.0'     : '默认',
		'task.map.mapType.1'     : '自定义',
		'task.map.mapType.2'     : '操作员审核',

		'task.map.task.type.0'   : '新增任务',
		'task.map.task.type.1'   : '修改任务',
		'task.map.task.type.2'   : '申请类任务'

	}

	//, 'en-US'              : true
});