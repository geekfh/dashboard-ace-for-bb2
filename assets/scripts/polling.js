define(['assets/scripts/fwk/ajax'], function(Ajax) {

    var INTERVAL = 5000;
    var _runningFlag = false;
    var _timer = null;

    var _pollingCallbackMap = {};

    function onPollingTaskResponse (resp) {
        var tid = resp.tid, obj, options, fn, scope, data;

        if(!(obj=_pollingCallbackMap[tid])) {
            //>>>DEBUG
            console.error('轮训结果返回未知tid', tid);
            return;
            //<<<DEBUG
        }

        options = obj.options;

        options.fn.call(options.scope, resp);
        
        delete _pollingCallbackMap[tid];
    }

    // 这个方法用来判断轮训回调map是否已经没有待回调的配置，如果是，返回true
    function hasKeyPolling () {
        var hasKey = false;
        for (var p in _pollingCallbackMap) {
            if(_pollingCallbackMap.hasOwnProperty(p)) {
                hasKey = true;
                break;
            }
        }
        return hasKey;
    }

    function stopPolling () {
        _timer && clearTimeout(_timer);
        _runningFlag = false;
    }

    function startPolling () {

        _runningFlag = true;

        function run () {
            _timer = setTimeout(function () {
                Ajax.request({
                    url: 'api/polling',
                    ignoreBsError: true,
                    success: function (resp) {
                        _.each(resp, function (taskData) {
                            if(taskData.tid) {
                                onPollingTaskResponse(taskData);
                            }
                        });
                    },
                    complete: function () {
                        //如果轮训回调map还有有待回调的配置，继续轮询，如果没有，那就停止轮训
                        if(hasKeyPolling()){
                            run();
                        }else{
                            stopPolling();
                        }
                    }
                });
            }, INTERVAL);
        }

        run();
    }

    var Polling = {
        /**
         * @param {[type]} options
         * {
         *     tid: 回调标识 (必须)
         *     fn: 回调执行方法 (必须)
         *     scope: 作用域 (可选)
         *     data: 额外参数 (可选)
         * }
         */
        addCallback: function(options) {

            if (_pollingCallbackMap[options.tid]) {

                console.error('已经存在重复的轮训id', options.tid);
                return;
            }

            if (!options.fn) {
                console.error('轮训回调需要传入{tid:xx, fn:xx}');
                return;
            }

            if(!_runningFlag) {
                startPolling();
            }

            _pollingCallbackMap[options.tid] = {
                requestTime: (new Date().getTime()),//记录请求那一刻的时间
                options: options
            };
        }
    };



    return Polling;
});