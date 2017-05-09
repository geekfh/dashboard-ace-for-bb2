define([], function() {

    var Model = Backbone.Model.extend({
        parse: function (data) {
            this._origin = data;
            return data;
        },

        matchFilter: function (words) {
            words = $.makeArray(words);

            var classNameDesc = this.get('classNameDesc') || '';
            var sensitiveFieldDesc = this.get('sensitiveFieldDesc') || '';
            var str = classNameDesc + ' ' + sensitiveFieldDesc;
            var i = words ? words.length : 0;

            while(i--) {
                //words数组中只要有一个元素不在str中，则表示不符合
                if(str.indexOf(words[i]) === -1) {
                    return false;
                }
            } 

            return true;
        }
    });

    var SenFiledsStore = Backbone.Collection.extend({
        model: Model,

        restoreToLastFetch: function () {
            //TODO 缺少上次fetch 的参数options
            if(this._lastFetchResp) {
                this.reset(this._lastFetchResp);
                this.trigger('sync', this, this._lastFetchResp);
            }
        },

        initialize: function () {
            // this.on('sync', function (collection, resp, options) {
            //     this._lastFetchResp = resp;
            //     console.log('>>>initialize on sync');
            //     console.log(arguments);
            //     // this._lastFetchData = 
            // });
        },

        fetch: function (options) {
            var me = this;
            function success (collection, resp) {
                me._lastFetchResp = resp;
            }

            if(options.success) {
                options.success = Opf.Function.createInterceptor(options.success, success);
            }else {
                options.success = success;
            }

            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        },

        getUpdateUrl: function () {
            console.log('please implete getUpdateUrl method!');
        },

        getChangedModels: function () {
            return this.filter(function (model) {
                return model.hasChanged();
            });
        },

        serializeChangedModels: function () {
            return _.map(this.getChangedModels(), function (model) {
                return model.toJSON();
            });
        },

        sync: function (method) {
            if(method === 'update') {

                return Opf.ajax({
                    type: 'PUT',
                    url: this.getUpdateUrl(),
                    jsonData: this.serializeChangedModels()
                });

            }

            return Backbone.Collection.prototype.sync.apply(this, arguments);
        }

    });

    var AgentSenFiledsStore = SenFiledsStore.extend({
        url: url._('sen.fields', {which: 'agent'}),
        getUpdateUrl: function () {
            return url._('sen.fields.updatebatch', {which: 'agent'});
        }
    });

    var DistSenFiledsStore = SenFiledsStore.extend({
        url: url._('sen.fields', {which: 'distributor'}),
        getUpdateUrl: function () {
            return url._('sen.fields.updatebatch', {which: 'distributor'});
        }
    });

    SenFiledsStore.DistSenFiledsStore = DistSenFiledsStore;
    SenFiledsStore.AgentSenFiledsStore = AgentSenFiledsStore;


    return SenFiledsStore;

});