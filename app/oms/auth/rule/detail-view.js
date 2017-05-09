define([
    'tpl!app/oms/auth/rule/templates/detail-view.tpl',
    'tpl!app/oms/auth/org/add/templates/add-to-custom-rule-item.tpl',
    'tpl!app/oms/auth/rule/list/templates/elem-list.tpl'
], function(tpl, ruleItemTpl, elemListTpl) {

    //TODO 统一字典
    var DIC_RULE_TYPE = {
        '0': '自定义规则',
        '1': '本机构全部',
        '2': '下级全部机构',
        '3': '本机构所有拓展员',
        '4': '仅查看自己拓展的'
    };

    var DetailView = Marionette.ItemView.extend({

        template: tpl,

        className: 'rule-detail-view',

        ui: {
            modal: '.modal',
            orgList: '.org-list',
            operatorList: '.operator-list'
        },

        events: {
            'click button[data-dismiss="modal"]': 'onCancel'
        },

        templateHelpers: {
            formatType: _.resultFn(DIC_RULE_TYPE)
        },

        onCancel: function () {
            this.destroy();
        },

        onRender: function() {
          
            this.$el.appendTo(document.body);

            this.$el.find('.modal').modal({
                backdrop: 'static'
            });

            var operatorElems = [];
            var brhElems = [];



            var branches = this.getOption('branches');
            var operators = this.getOption('operators');

            _.each(this.model.get('elems'), function (elem) {
                if(elem.type == '0') {
                    brhElems.push(elem);
                }else {
                    operatorElems.push(elem);
                }
            });

            var strBrhTpl = elemListTpl({
                list:brhElems,
                getText: function (code) {
                    var target = _.findWhere(branches, {code: code});
                    return target ? target.name : '';
                }
            });


            var strOperatorTpl = elemListTpl({
                list:operatorElems,
                getText: function (id) {
                    var target = _.findWhere(operators, {id: ''+id}) || _.findWhere(operators, {id: parseInt(''+id, 10)});
                    return target ? target.name : '';
                }
            });

            this.ui.orgList.append($(strBrhTpl));
            this.ui.operatorList.append($(strOperatorTpl));

        }

    });

    return DetailView;
});