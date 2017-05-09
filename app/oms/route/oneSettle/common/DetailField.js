define([
    'tpl!app/oms/route/oneSettle/common/templates/detail-field-item.tpl'
], function(tpl) {

    var OPERATOR_CN = {
        eq: '等于',
        uq: '不等',
        gt: '大于',
        lt: '小于',
        'in': '在',
        not_in: '不在',
        not_null: '非空',
        is_null: '为空'
    };

    // var fieldLabelMap = {
    //     mchtNo: '商户编号',
    //     mccgroup: 'MCC组',
    //     terminal: '终端类型',
    //     cardType: '卡种类',
    //     cardMedia: '卡介质',
    //     account: '金额',
    //     txnType: '交易类型',
    //     totalAccount: '总额',
    //     bigAccount: '大额金额',
    //     bigAccountNum: '大额笔数',
    //     bank: '开户行',
    //     cardBin: '卡bin',
    //     brh: '所属机构',
    //     mcc: 'MCC',
    //     areaNo: '地区码',
    //     time: '时间'
    // };

    var fieldLabelMap = {
        'mcht_no': '商户编号',
        'mcc_grp': 'MCC组',
        'term_type': '终端类型',
        'card_type': '卡种类',
        'card_kind': '卡介质',
        'amount': '金额',
        'cmd_type': '交易类型',
        'total_amt': '总金额',
        // 'bigAccount': '大额金额',
        'total_num': '总笔数',
        'card_bank': '开户行',
        'card_no': '卡bin',
        'brh_no': '所属机构',
        'mcc': 'MCC',
        'region_code': '地区码',
        'tx_time': '时间',

        'disc': '结算周期',
        'term_no': '终端号',
        'mcht_type':   '商户类型',
        'fee_type':   '费率类型',
        'pin_type':   '有密无密',
        'card_amt': '单卡单日总金额',
        'card_num': '单卡单日总笔数',
        'bamt_num': '大额笔数',
        'lamt_num': '小额笔数'
    };

    var View = Marionette.ItemView.extend({
        template: tpl,
        tagName: 'tr',

        initialize: function () {

        },

        templateHelpers: {
            fieldFormatter: function (val) {
                return fieldLabelMap[val] || '';
            },
            operatorFormatter: function (val) {
                return OPERATOR_CN[val] || '';
            }

        }
    });
    
    return View;
});