define([
    'App',
    'tpl!app/oms/mcht/wildcard/common/templates/info2.tpl',
    'app/oms/mcht/wildcard/common/validate-info2',
    'app/oms/mcht/wildcard/common/config-info2',
    'jquery.validate',
    'jquery.autosize'
], function(App, tpl, wildcardInfo2Validate, wildcardInfo2Conf) {

    return Marionette.ItemView.extend({
        template: tpl,

        ui: {},

        constructor: function (data) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.data = data;
            console.log(">>>wildcard mcht data", data);
        },

        serializeData: function(){
            return {
                data: wildcardInfo2Conf
            }
        },

        onRender: function(){
            var me = this;

            me.attachValidation();
        },

        validate: function() {
            return this.$el.find("form").valid();
        },

        attachValidation: function () {
            wildcardInfo2Validate.addRules4Info2(this.$el.find('form:first'));
        },

        update: function(data){
            this.data = data;
            console.log("外卡商户资料更新", data);
        },

        getValues: function () {
            var obj = {};

            this.$el.find(':input[data-set]:visible').each(function() {
                var $this = $(this), theVal = "";
                var fieldName = $this.attr('name');

                if($this.is(':checkbox')) {
                    theVal = $this.prop('checked') ? 1 : 0;

                }else if($this.is(':radio')){
                    if($this.prop('checked')) {
                        theVal = $this.val();
                    }
                }
                else {
                    theVal = $this.val()? $this.val():null;
                }

                obj[fieldName] = theVal;
            });

            return obj;
        }

    });

});