/**
 * Created by zhuyimin on 2015/2/2.
 */
define([], function () {
	return {
		performConfig: {
			"operation": {
				"pass": {
					"text": "批量通过",
					"buttonicon": "icon-ok-sign white"
				},
				"reject": {
					"text": "批量拒绝",
					"buttonicon": "icon-remove-sign white"
				}
			},
			"rsId": "servicePerform",
			"enableAdd": false,
			"operationUrl": 'batch.change.perform.status',
			"url": 'service.perform'
		},
		targetMgrConfig: {
			"operation": {
				"open": {
					"text": "批量开通",
					"buttonicon": "icon-ok-sign white"
				},
				"stop": {
					"text": "批量停止",
					"buttonicon": "icon-remove-sign white"
				}
			},
			"rsId": "serviceTargetMgr",
			"enableAdd": false,
			"operationUrl": 'batch.change.service.target.status',
			"url": 'service.target.mgr'
		}
	}
});