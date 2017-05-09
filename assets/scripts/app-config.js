/**
 * User hefeng
 * Date 2016/11/15
 * 描述 电话工具条相应状态回调函数
 */
define({
	// 天润
	ccic2: {
		// 登录回调
		cbLogin: $.noop,

		// 登出回调
		cbLogout: $.noop,

		// 置忙回调
		cbPause: $.noop,

		// 置闲回调
		cbUnpause: $.noop,

		// 获取座席状态回调
		cbStatus: $.noop,

		// 获取队列状态回调
		cbQueueStatus: $.noop,

		// 当前座席状态回调
		cbThisStatus: $.noop,

		// 队列状态
		cbQueue: $.noop,

		// 被踢下线
		cbKickout: $.noop,

		// 被管理员踢下线
		cbBackendLogout: $.noop,

		// 断线重连
		cbBreakLine: $.noop,

		// 未接来电
		cbUnanswer: $.noop,

		// 预约提醒
		cbAgenda: $.noop,

		// 接听回调
		cbLink: $.noop,

		// 拒接回调
		cbRefuse: $.noop,

		// 挂断回调
		cbUnLink: $.noop,

		// 电话保持回调
		cbHold: $.noop
	}
});
