define([
    'app/oms/mcht/wildcard/add/sub/info2-view'
], function(EditInfo2View){
    var _onRender = EditInfo2View.prototype.onRender;

    return EditInfo2View.extend({
        onRender: function(){
            _onRender.apply(this, arguments);
            this.applyWildcardMchtData();
        },
        applyWildcardMchtData: function(){
            var $el = this.$el;
            var data = this.data&&this.data.interMcht||{};

            // 输入框的值可以直接设置
            $el.find('*[name]').each(function () {
                var self = $(this);
                var name = self.attr('name');
                self.val((data[name] || data[name] == 0) ? data[name]:"");
                //self.is(":checkbox")||self.is(":radio")
            });
        }
    })
});