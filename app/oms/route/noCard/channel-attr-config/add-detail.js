//新增的时候展现的详情页面
define([
    'app/oms/route/noCard/common/BaseDetailModelView',
    'tpl!app/oms/route/noCard/templates/view-model-detail.tpl',
    'tpl!app/oms/route/noCard/channel/templates/relevance-txn-model.tpl'
], function(BaseDetailModelView, tpl, relevanceTxnTpl) {

    var STATUS_MAP = {
        '0' : '启用',
        '1' : '不启用',
        '3' : '注销'
    },BANKMARK_MAP = {
        '1':'是银商系'
    };

    var View = BaseDetailModelView.extend({
        initialize:function(options){
            this.model = options.model;
            this.params = options.params;
            this.callBack = options.callBack;
            BaseDetailModelView.prototype.initialize.apply(this,arguments);
        },
        title: '查看通道属性配置',
        formTemplate: tpl,

        // @override
        relevanceModelTemplate: relevanceTxnTpl,
        onRender:function(){
            var me = this;
            BaseDetailModelView.prototype.onRender.apply(this,arguments);
            this.$el.find('.relevance-model-sit').hide();
        },
        // @override
        serializeFormData: function () {
            var formLayout = [
                { label: '序列号',name: 'id' },
                { label: '通道名称',name: 'channelName' },
                { label: '通道中文名称',name: 'channelCnName' },
                { label: '通道状态',name: 'status', formatter: function (val) { return STATUS_MAP[val] || ''; } },
                { label: '通道银商系标记',name: 'bankMark',formatter: function(val){ return BANKMARK_MAP[val] ? BANKMARK_MAP[val] : '不是银商系';}  },
                { label: '是否虚拟通道',name: 'xntdFlag', formatter: function(val){ return val == 1 ? '是' : '否' } },
                { label: '真实通道名称',name: 'chaZsnm'},
                { label: '备注',name: 'remark' }
            ];

            return { formLayout: formLayout, model: this.model };
        },

        // @override
        serializeRelevanceData: function () {
            return {
                txnModels: this.model.get('txnModels')
            };
            
        },
        showDialog: function(){
            var me = this;
            var $myEl = this.$el;
            Opf.Factory.createDialog($myEl, {
                dialogClass: 'theme-bb bb-dialog',
                open: true,
                destroyOnClose: true,
                width: 410,
                modal: true,
                title: this.getOption('title'),
                buttons: [{
                    type: 'cancel',
                    text: '返回'
                },{
                    type:'submit',
                    click: function(){
                        if(me.options.model.attributes.chaZsnm != ''){
                            var chaZsnmTest = /^[\u4e00-\u9fa5a\w]{1,8}$/;
                            var chaZsnm = me.options.model.attributes.chaZsnm;
                            if(!chaZsnmTest.test(chaZsnm)){
                                Opf.alert('真实通道名称不得超过8字节');
                                return false;
                            }
                        }
                        me.callBack(me.params,function(){
                            $myEl.trigger('dialogclose');
                        });
                    }
                }]
            });
        }
    });
    
    return View;
});