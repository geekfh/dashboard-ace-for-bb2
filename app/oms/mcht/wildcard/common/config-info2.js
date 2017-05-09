/**
 * info2配置文件
 **/
define(function(){
    //结算是否审核
    var whetherCheckOptions = {
        "1": "是",
        "0": "否"
    };
    var whetherCheckFormatter = function(val){
        return whetherCheckOptions[val];
    };

    //商户结算类型
    var settleTypeOptions = {
        "1": "日结",
        "2": "月结",
        "3": "周结"
    };
    var settleTypeFormatter = function(val){
        return settleTypeOptions[val];
    };

    //结算币种
    var settleMoneyKindOptions = {
        "1": "人民币"
    };
    var settleMoneyKindFormatter = function(val){
        return settleMoneyKindOptions[val];
    };

    //拒付罚款币种
    var inFineMoneyOptions = {
        "1": "美元",
        "2": "欧元",
        "3": "港币",
        "4": "人民币"
    };
    var inFineMoneyFormatter = function(val){
        return inFineMoneyOptions[val];
    };

    return [
        {
            name:'wildcard-base',
            caption:'外卡商户基础信息',
            items:[
                {key:'billAddress', label:'账单地址(中英文)', belong:'B2', type:'input'},
                {key:'name', label:'对外经营名字(中英文)', belong:'B2', type:'input'},
                {key:'regAddress', label:'注册地址', belong:'B2', type:'input'},
                {key:'businessAddress', label:'经营地址(中英文)', belong:'B2', type:'input'},
                {key:'site', label:'网址', belong:'B2', type:'input'},
                {key:'contactPerson', label:'联系人', belong:'B2', type:'input'},
                {key:'contactPhone', label:'联系电话(手机及固话)', belong:'B2', type:'input'},
                {key:'email', label:'Email', belong:'B2', type:'input'}
            ]
        },
        {
            name:'wildcard-business',
            caption:'外卡商户经营信息',
            items:[
                {key:'business', label:'主营业务内容', belong:'B2', type:'textarea'},
                {key:'employeesNum', label:'员工人数', belong:'B2', type:'input'},
                {key:'aveOrdersAmount', label:'预计每张签购单平均交易额(人民币)', belong:'B2', type:'input'},
                {key:'aveMonthAmount', label:'预计月平均收单额(人民币)', belong:'B2', type:'input'}
            ]
        },
        {
            name:'wildcard-settle',
            caption:'外卡商户费用清算信息',
            items:[
                {key:'openCosts', label:'开通费用', belong:'B2', type:'input'},
                {key:'annualServiceFee', label:'年服务费用', belong:'B2', type:'input'},
                {key:'guaranteeAmount', label:'固定保证金额', belong:'B2', type:'input'},
                {key:'takeAmount', label:'最低提现金额', belong:'B2', type:'input'},
                {key:'proportionFee', label:'比例手续费率', belong:'B2', type:'input'},
                {key:'fixedFee', label:'固定手续费', belong:'B2', type:'input'},
                {key:'riskPeriod', label:'风险预存期', belong:'B2', type:'input'},
                {key:'freezDay', label:'循保冻结天数', belong:'B2', type:'input', defaultValue:"180", helps:'默认180天'},
                {key:'cycleRate', label:'循保费用比例', belong:'B2', type:'input', helps:'数值范围0~1'},
                {key:'whetherCheck', label:'结算是否审核', belong:'B2', type:'select', soptions:whetherCheckOptions, format:whetherCheckFormatter},
                {key:'settleType', label:'商户结算类型', belong:'B2', type:'select', soptions:settleTypeOptions, format:settleTypeFormatter},
                {key:'settleMoneyKind', label:'结算币种', belong:'B2', type:'select', soptions:settleMoneyKindOptions, format:settleMoneyKindFormatter},
                {key:'moneyLimit', label:'月累计拒付金额上限比例', belong:'B2', type:'input', helps:'数值范围0~1'},
                {key:'countLimit', label:'月累计拒付笔数上限比例', belong:'B2', type:'input', helps:'数值范围0~1'},
                {key:'inFineMoney', label:'拒付罚款币种', belong:'B2', type:'select', soptions:inFineMoneyOptions, format:inFineMoneyFormatter},
                {key:'outFineMoney', label:'超过比例后每单拒付罚款金额', belong:'B2', type:'input'},
                {key:'refuseDealMoney', label:'拒付处理费(笔/元)', belong:'B2', type:'input'},
                {key:'firstMoney', label:'一级阶梯月交易总额', belong:'B2', type:'input'},
                {key:'firstRate', label:'一级阶梯手续费费率', belong:'B2', type:'input', helps:'数值范围0~1'},
                {key:'secondMoney', label:'二级阶梯月交易总额', belong:'B2', type:'input'},
                {key:'secondRate', label:'二级阶梯手续费费率', belong:'B2', type:'input', helps:'数值范围0~1'},
                {key:'thirdMoney', label:'三级阶梯月交易总额', belong:'B2', type:'input'},
                {key:'thirdRate', label:'三级阶梯手续费费率', belong:'B2', type:'input', helps:'数值范围0~1'},
                {key:'fourMoney', label:'四级阶梯月交易总额', belong:'B2', type:'input'},
                {key:'fourRate', label:'四级阶梯手续费费率', belong:'B2', type:'input', helps:'数值范围0~1'}
            ]
        }
    ]
});