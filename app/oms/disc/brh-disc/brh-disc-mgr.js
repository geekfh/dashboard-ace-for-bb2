define([
    'app/oms/disc/brh-disc/common/list/list-view',
    'i18n!app/oms/common/nls/param'

], function(CommonView, paramLang) {

    var Configs = {
        //间联MCC计费模型
        indirectMcc:{
            trigger: 'discs:indirectMcc:list ',
            viewOptions: {
                tabId: 'menu.disc.brh.indirectMcc',
                rsId: 'disc.indirectMcc',
                caption: paramLang._('disc.txt'),
                title: '间联MCC计费模型',
                gid: 'discs-indirectMcc-grid',
                url: url._('disc.brh.list',{modelId: 'HB'}),
                modelType: 'HB'
            }
        },
        //间联统一结算扣率
        indirectUnionSettle: {
            trigger: 'discs:indirectUnionSettle:list',
            viewOptions: {
                tabId: 'menu.disc.brh.indirectUnionSettle',
                rsId: 'disc.indirectUnionSettle',
                caption: paramLang._('disc.txt'),
                title: '间联统一结算扣率',
                gid: 'discs-indirectUnionSettle-grid',
                url: url._('disc.brh.list',{modelId: 'HA'}),
                modelType: 'HA'
            }
        },
        //无基准费率 （间联）
        noBaseRatio: {
            trigger: 'discs:noBaseRatio:list',
            viewOptions: {
                tabId: 'menu.disc.brh.noBaseRatio',
                rsId: 'disc.noBaseRatio',
                caption: paramLang._('disc.txt'),
                title: '无基准费率模型',
                gid: 'discs-noBaseRatio-grid',
                url: url._('disc.brh.list',{modelId: 'HE'}),
                modelType: 'HE'
            }
        },
        //间联 签约扣率对应结算扣率
        baseToBorm: {
            trigger: 'discs:baseToBorm:list',
            viewOptions: {
                tabId: 'menu.disc.brh.baseToBorm',
                rsId: 'disc.baseToBorm',
                caption: paramLang._('disc.txt'),
                title: '签约扣率对应变动结算扣率',
                gid: 'discs-baseToBorm-grid',
                url: url._('disc.brh.list',{modelId: 'HD'}),
                modelType: 'HD'
            }
        },
        //间联月交易额结算扣率
        indirectChange: {
            trigger: 'discs:indirectChange:list',
            viewOptions: {
                tabId: 'menu.disc.brh.indirectChange',
                rsId: 'disc.indirectChange',
                caption: paramLang._('disc.txt'),
                title: '间联月交易额结算扣率变动',
                gid: 'discs-indirectChange-grid',
                url: url._('disc.brh.list',{modelId: 'HC'}),
                modelType: 'HC'
            }
        },
        //MCC月交易额结算扣率  // 这个名字以后再改
        indirectCanChange: {
            trigger: 'discs:indirectCanChange:list',
            viewOptions: {
                tabId: 'menu.disc.brh.indirectCanChange',
                rsId: 'disc.indirectCanChange',
                caption: paramLang._('disc.txt'),
                title: 'MCC月交易额结算扣率',
                gid: 'discs-indirectCanChange-grid',
                url: url._('disc.brh.list',{modelId: 'FG'}),
                modelType: 'FG'
            }
        },
        //直联商户费率
        directMcc: {
            trigger: 'discs:directMcc:list',
            viewOptions: {
                tabId: 'menu.disc.brh.directMcc',
                rsId: 'disc.directMcc',
                caption: paramLang._('disc.txt'),
                title: '直联商户费率模型',
                gid: 'discs-directMcc-grid',
                url: url._('disc.brh.list',{modelId: 'PB'}),
                modelType: 'PB'
            }
        },
        canSetMore: {
            trigger: 'discs:canSetMore:list',
            viewOptions: {
                tabId: 'menu.disc.brh.canSetMore',
                rsId: 'disc.canSetMore',
                caption: paramLang._('disc.txt'),
                title: '直联商户费率模型-可高签',
                gid: 'discs-canSetMore-grid',
                url: url._('disc.brh.list',{modelId: 'PA'}),
                modelType: 'PA'
            }
        }
    };

    var Mgr = {
        MODEL_TYPE: {
            //-统一设定基准费率
            'IN_UNION_SETTLE': 'HA', 
            
            //-按MCC大类设定基准费率 
            'IN_MCC': 'HB', 
            
            //-基准费率根据月交易量变化 
            'IN_CHANGE_MONTHLY': 'HC', 
            
            //-商户费率与基准费率一一对应 
            'IN_BASE_TO_BORM': 'HD', 
            
            //-无基准费率 
            'IN_NO_BASERATIO': 'HE',

            //-MCC月交易额结算扣率
            'IN_CAN_CHANGE': 'FG',

            //-商户费率可高签 
            'DIR_CAN_SET_MORE': 'PA', 
            
            //-标准商户费率
            'DIR_MCC': 'PB' 
        }
    };

    _.each(Configs, function (item) {
        App.on(item.trigger, function () {
            if(!item.Clazz) {
                item.Clazz = CommonView.extend(item.viewOptions);
            }
            App.show(new item.Clazz());
        });
    });


    return Mgr;
});