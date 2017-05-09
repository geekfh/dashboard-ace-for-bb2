define([
    'app/oms/common/store/OpfPageableCollection',
    'app/oms/auth/org/add/add-to-custom-rule-view'
], function( OpfPageableCollection, RuleView) {

    var CUSTOM_RULE_TYPE = 0; //自定义规则

    var Mgr = {

        confirmAddBrhToCustomRule: function (orgCode) {
            this._confirmAddToCustomRule({
                onBeforeSubmit: function (ruleIds, ajaxOptions) {
                    return $.extend(true, ajaxOptions, {
                        jsonData:{
                            rules: ruleIds,
                            elem: orgCode, 
                            type: 'org'
                        }
                    });
                },
                onComplete: function () {
                    App.trigger('branch:add');
                }
            });
        },

        confirmAddOperatorToCustomRule: function (expandId) {
            this._confirmAddToCustomRule({
                onBeforeSubmit: function (ruleIds, ajaxOptions) {
                    return $.extend(true, ajaxOptions, {
                        jsonData:{
                            rules: ruleIds,
                            elem: expandId,
                            type: 'explorer'
                        }
                    });
                },
                onComplete: function () {
                    App.trigger('user:add');
                }
            });
        },

        /**
         * @param  {[type]} options
         *          onBeforeSubmit  function(ruleIds, ajaxOptions) 修改 ajaxOptions 会影响请求
         *          onCancel            询问是否后，点击取消的回调
         *          onComplete          整个流程，任一操作分支结束
         *          onSuccess          提交成功后
         */
        _confirmAddToCustomRule: function (options) {
            var collection = this.newCustomRuleCollection();
            collection.fetch().done(function () {
                onFetch(collection);
            });

            function onFetch(collection) {
                var view;

                if (collection.length) {
                    view = new RuleView({ collection: collection});

                    view.on('cancel', function() {
                        console.log('<<<ruleview on cancel');
                        cancel();
                    });
                    view.on('submit', function(ruleIds) {
                        console.log('<<<ruleview on submit', ruleIds);
                        submit(ruleIds);
                    });

                } else {
                    complete();
                }

                function submit(ruleIds) {
                    if (ruleIds.length <= 0) {
                        view.onCancel();
                    }

                    var ajaxOptions = {
                        url: url._('rule.custom.add'),
                        type: 'POST',
                        success: function() {
                            options.onSuccess && options.onSuccess();
                            Opf.Toast.success('提交成功');
                            view && view.destroy();
                        },
                        complete: function() {
                            complete();
                        }
                    };

                    if (options.onBeforeSubmit && 
                            options.onBeforeSubmit(ruleIds, ajaxOptions) === false) {
                        return;
                    }
                    Opf.ajax(ajaxOptions);
                }

                function cancel () {
                    console.log('>>>ask add to rule, on cancel');
                    options.onCancel && options.onCancel();
                    complete();
                }

                function complete() {
                    console.log('>>>ask add to rule, on complete');
                    options.onComplete && options.onComplete();
                }
            }
        },

        newCustomRuleCollection: function () {
            //自定义规则列表
            var Collection = OpfPageableCollection.extend({
                state: {
                    pageSize: 15 //这个值要跟模板中每页显示select对应，后期改成jsstorage取
                },
                //搜索自定义规则
                queryParams: {
                    filters: JSON.stringify({
                        groupOp: "AND",
                        rules: [{field: 'type',op: 'eq',data: CUSTOM_RULE_TYPE}]
                    })
                },
                url: url._('rule')
            });
            return new Collection();
        },

        xx: function () {

        }



    };
    
    return Mgr;
});