/**
 * 商户补充资料审核之前再次确认通过/拒绝的补充资料
 * 如果有拒绝的话需要补充“审核意见”
 */
define([
    'tpl!app/oms/wkb/extraInfo-task/perform/templates/confirm.tpl',
    'assets/scripts/fwk/component/linkage'
], function(confirmTpl, Linkage) {
    //商户资料字段
    var mchtInfoFields = [
        {name: 'explorerName', label: '拓展员'},
        {name: 'kind', label: '商户种类'},
        {name: 'mchtSource', label: '商户来源'},
        {name: 'mchtLevel', label: '商户等级'},
        {name: 'remark', label: '特殊说明'},
        {name: 'isCoMarketing', label: '联合营销商户'},
        {name: 'oprRegionCode', label: '拓展员地区'},
        {name: 'mchtName', label: '商户名称'},
        {name: 'address', label: '商家地址'},
        {name: 'comTel', label: '联系电话'},
        {name: 'scope', label: '经营范围'},
        {name: 'attr', label: '经济类型'},
        {name: 'certFlag', label: '证照属性'},
        {name: 'licNo', label: '营业执照注册号码'},
        {name: 'orgCode', label: '组织机构代码'},
        {name: 'taxNo', label: '税务登记号'},
        {name: 'userName', label: '姓名'},
        {name: 'userPhone', label: '手机号码'},
        {name: 'userCardNo', label: '身份证'},
        {name: 'userEmail', label: '电子邮箱'},
        {name: 'tNDiscId', label: '商户费率'},
        {name: 'discCycle', label: '结算周期'},
        {name: 'accountName', label: '开户名'},
        {name: 'accountNo', label: '账户号'},
        {name: 'zbankName', label: '开户支行'},
        {name: 'idCardFront', label: '身份证正面照'},
        {name: 'idCardBack', label: '身份证反面照'},
        {name: 'personWithIdCard', label: '手持身份证照'},
        {name: 'bankCard', label: '银行卡照片'},
        {name: 'agreement', label: '委托清算协议书盖章页'},
        {name: 'license', label: '营业执照的照片'},
        {name: 'rentAgreement', label: '租赁协议的照片'},
        {name: 'orgImage', label: '组织机构代码证'},
        {name: 'taxImage', label: '税务登记证'},
        {name: 'openAccountLicenses', label: '开户许可证照片'},
        {name: 'shopFrontImg', label: '店铺门头照'},
        {name: 'shopInnerImg', label: '店内全景照'},
        {name: 'checkstandImg', label: '商户收银台照片'},
        {name: 'productImg', label: '商品照片'},
        {name: 'operatorMcht', label: '拓展员商户合影'},
        {name: 'recognitionScore', label: '补充身份认证照片'}
    ];

    //数据转换
    var convertData = function(errorMark, addColumn){
        var confirmFields = [];
        _.each(addColumn, function(v){
            var itemField = _.findWhere(mchtInfoFields, {name:v});
            var label = itemField? itemField.label:"补充的照片";
            var isOk = errorMark[v]==0? false:true;
            confirmFields.push({label:label, isOk:isOk});
        });
        return confirmFields;
    };

    return Marionette.ItemView.extend({
        template: confirmTpl,
        className: 'extraInfo-task-confirm',
        initialize: function(options){
            this.errorMark = options.errorMark||{};
            this.addColumn = options.addColumn||{};
        },
        serializeData: function(){
            var me = this;
            return {
                data: convertData(me.errorMark, me.addColumn)
            }
        },
        ui: {
            rejectForm: '.reject-form',
            rejectContainer: '.reject-container'
        },
        onRender: function(){
            var me = this, ui = me.ui;
            if(ui.rejectContainer.length>0){
                me.renderReject();
                ui.rejectForm.validate({
                    rules: {
                        reason: {
                            required: true
                        }
                    }
                });
            }
        },
        //渲染拒绝原因级联
        renderReject: function(){
            var me = this, ui = me.ui;
            var linkage = new Linkage({
                renderTo: ui.rejectContainer,
                properties: {
                    selectName: 'reasonName',
                    textareaName: 'reason'
                }
            });
            linkage.render();
        },
        getRejectReason: function(){
            var obj = {
                refuseReason: this.ui.rejectContainer.find('textarea[name="reason"]').val()||""
            };
            var linkage = this.ui.rejectContainer.data('linkage');
            !!linkage && (_.extend(obj, {refuseId: linkage.key}));

            return obj;
        }
    });
});