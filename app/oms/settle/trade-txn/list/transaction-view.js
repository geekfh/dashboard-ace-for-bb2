define([
    'tpl!app/oms/settle/trade-txn/list/templates/transaction.tpl'
], function(tpl) {

    var tmpData = {
        "ibox43": "自在山庄",
        "orderNo": "113027265559132918",
        "ibox42": "001440353980001",
        "iboxNo": "00210101013121594280",
        "acNo": "6217007200023023131",
        "subCode": "32",
        "stat": "1",
        "iboxBatchNo": "45613251432",
        "ibox11": "4561321",
        "fd38": "223165412",
        "fd37": "451321",
        "date": "20210121",
        "amt": "210"
    };

    var View = Marionette.ItemView.extend({
        template: tpl,
        events: {
            'dblclick .transaction-td2': 'dblClickEdit',
            'click': 'clickMainBody',
            'change .input-edit': 'inputChange'/*,
            'input .input-edit': 'enterInputEdit'*/
        },

        initialize: function () {

        },

        serializeData: function () {
            return {data: this.getOption('rowData')};
            // return {data: tmpData};
        },
        
        onRender: function () {

        },
        inputChange: function (e) {
            var $target = $(e.target);
            var value = $target.val();

            $target.closest('.transaction-td2').find('span').text(value);

            if (value = $target.find('option:selected').text()) {
                $target.closest('.transaction-td2').find('span').text(value);
            }
        },
        submitTrans: function () {
            if ($('iframe[name="settleTxnTrans"]').length > 0) {

            } else {
                var iframe = $('<iframe style="display: none;" name="settleTxnTrans"></iframe>');
                $('body').append(iframe);
            }

            this.$el.find('form').submit();
        },
        // enterInputEdit: function (e) {
        //     $(e.target).closest('.transaction-td2').removeClass('tr-editing');
        // },
        clickMainBody: function (e) {
            if($(e.target).closest('.tr-editing').length === 0) {
                this.$el.find('.transaction-tr').removeClass('tr-editing');
            }
        },
        dblClickEdit: function (e) {
            $(e.target).closest('.transaction-tr').addClass('tr-editing');
        }

    });
    
    return View;
});