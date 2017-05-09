/**
 * 定义全局UI配置
 * 取值：Opf.Config._('ui', 'query.tradeTxn.grid.form.width')
 */
define({
    // ui config
    ui: {

        'query.tradeTxn.grid.form.width': 400,
        'query.tradeTxn.grid.form.height': 550,


        'org.grid.form.width': 400,
        'org.grid.form.height': 600,

        'users.grid.form.width': 400,
        'users.grid.form.height': 550,

        'roles.grid.form.width': 500,
        'roles.grid.form.height': 600,


        'rolegroup.grid.form.width': 500,
        'rolegroup.grid.form.height': 550,


        'privilege.grid.form.width': 400,
        'privilege.grid.form.height': 300,

        'disc.grid.form.width': 800,
        'disc.grid.form.height': 570,

        'rule.grid.form.width': 500,
        'rule.grid.form.height': 500,

        'discalgo.grid.form.width': 450,
        'discalgo.grid.form.height': 500,

        //*****************华丽分割

        'totalAccount.grid.form.width' : 400,
        'totalAccount.grid.form.height' : 540,
        'totalAccount.grid.viewform.width' : 400,
        'totalAccount.grid.viewform.height' : 400,

        'totalAccountDetail.grid.form.width' : 500,
        'totalAccountDetail.grid.form.height' : 300,
        'totalAccountDetail.grid.viewform.width' : 360,
        'totalAccountDetail.grid.viewform.height' : 400,
        'totalAccountDetail.grid.form.extra.height' : 300,
        'totalAccountDetail.grid.form.extra.width' : 350,

        'batMainCtlDetail.grid.form.width' : 400,
        'batMainCtlDetail.grid.form.height' : 500,
        'batMainCtlDetail.grid.viewform.width' : 360,
        'batMainCtlDetail.grid.viewform.height' : 600,


        'channelAccount.grid.form.width' : 360,
        'channelAccount.grid.form.height' : 500,
        'channelAccount.grid.viewform.width' : 520,
        'channelAccount.grid.viewform.height' : 430,
        'channelAccount.grid.form.extra.width' : 350,
        'channelAccount.grid.form.extra.height' : 330,

        'stlmError.grid.form.width' : 400,
        'stlmError.grid.form.height' : 300,
        'stlmError.grid.viewform.width' : 420,
        'stlmError.grid.viewform.height' : 600,
        'stlmError.grid.form.extra.height' : 300,
        'stlmError.grid.form.extra.width' : 350,


        'stlmRepair.grid.form.width' : 320,
        'stlmRepair.grid.form.height' : 360,
        'stlmRepair.grid.viewform.width' : 400,
        'stlmRepair.grid.viewform.height' : 570,
        'stlmRepair.grid.form.extra.height' : 300,
        'stlmRepair.grid.form.extra.width' : 350,

        'stlmAccount.grid.form.width' : 400,
        'stlmAccount.grid.form.height' : 500,
        'stlmAccount.grid.viewform.width' : 450,
        'stlmAccount.grid.viewform.height' : 600,

        'settleSum.grid.form.width' : 400,
        'settleSum.grid.form.height' : 500,
        'settleSum.grid.viewform.width' : 500,
        'settleSum.grid.viewform.height' : 500,
        'settleSum.grid.form.extra.height' : 450,
        'settleSum.grid.form.extra.width' : 350,


        'settleControl.grid.form.width' : 400,
        'settleControl.grid.form.height' : 500,
        'settleControl.grid.viewform.width' : 500,
        'settleControl.grid.viewform.height' : 500,
        'settleControl.grid.form.extra.height' : 450,
        'settleControl.grid.form.extra.width' : 400,

        'settleTxn.grid.form.width' : 400,
        'settleTxn.grid.form.height' : 500,
        'settleTxn.grid.viewform.width' : 400,
        'settleTxn.grid.viewform.height' : 500,
        'settleTxn.grid.form.extra.height' : 300,
        'settleTxn.grid.form.extra.width' : 350,

        'settleError.grid.form.width' : 400,
        'settleError.grid.form.height' : 500,
        'settleError.grid.viewform.width' : 400,
        'settleError.grid.viewform.height' : 500,
        'settleError.grid.addForm.width' : 420,
        'settleError.grid.extra.height' : 300,
        'settleError.grid.extra.width' : 350,


        'BranchSettleDetails.grid.form.width'  :  400,
        'BranchSettleDetails.grid.form.height'  :  500,
        'BranchSettleDetails.grid.viewform.width'  :  500,
        'BranchSettleDetails.grid.viewform.height'  :  500,


        'batMainCtlDetail.grid.form.actionCol.width' : 130,
        'BranchSettleDetails.grid.form.actionCol.width' : 130,
        'channelAccount.grid.form.actionCol.width' : 130,
        'settleControl.grid.form.actionsCol.width' : 130,
        'settleError.grid.form.actioonsCol.width' : 130,
        'settleSum.grid.form.actionsCol.width' : 130,
        'settleTxn.grid.form.actionsCol.width' : 130,
        'stlmError.grid.form.actionsCol.width' : 130,
        'stlmRepair.grid.form.actionsCol.width' : 130,
        'totalAccountDetail.grid.form.actionsCol.width' : 130,

        'mchtSettleDetail.grid.viewform.width' : 600,
        'mchtSettleDetail.grid.viewform.height' : 500,

        'ukConfig.grid.form.width'   :  450,
        'ukConfig.grid.form.height'   :  550,


        'mcht.grid.changestate.form.width': 400,
        'mcht.grid.changestate.form.height': 250,

        'terminalsMgr.grid.changestate.form.width': 300,
        'terminalsMgr.grid.changestate.form.height': 150,

        /**
         * 大图浏览时候的图片顺序
         * A1: 开放注册个人商户
         * A2: 开放注册企业商户
         * B1: 个体商户
         * B2: 普通商户
         * C1: 集团商户(门店)--->改为C2门店
         * C4: 集团商户(品牌)--->改为C1总店
         * D1/E1: 二维码商户/好哒商户
         */
        'mcht.images': [
            {name:      'idCardFront', url: '', tmbDescr:   '证件正面照', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name:       'idCardBack', url: '', tmbDescr: '证件反面照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'personWithIdCard', url: '', tmbDescr:   '手持证件照', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'bankCard', url: '', tmbDescr:   '银行卡/开户许可证照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'agreement', url: '', tmbDescr:     '委托清算协议书盖章页', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name:    'license', url: '', tmbDescr:     '营业执照', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'rentAgreement', url: '', tmbDescr:     '租赁协议', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name:  'shopFrontImg', url: '', tmbDescr:     '店铺门头照', bimgDescr: '',     belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name:  'shopInnerImg', url: '', tmbDescr:     '店内全景照', bimgDescr: '',     belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'checkstandImg', url: '', tmbDescr:     '商户收银台照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'productImg', url: '', tmbDescr:     '商品照片', bimgDescr: '',       belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'operatorMcht', url: '',  tmbDescr:     '拓展员商户合影', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'operatorCardIdFrontImg', url: '',  tmbDescr:     '拓展员身份证照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'operatorWithIdCardImg', url: '',  tmbDescr:     '拓展员手持身份证照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name:      'orgImage', url: '', tmbDescr:     '组织机构证照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'taxImage', url: '', tmbDescr:     '税务登记表照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'openAccountLicenses', url: '', tmbDescr:     '开户许可证', bimgDescr: '', belong: 'B1,B2,A1,C2,C1,D1,E1'},
            {name: 'faceRecognition', url: '', tmbDescr:     '条纹身份证照', bimgDescr: '', belong: 'B1,B2,A1'},
            {name: 'faceRecognition1', url: '', tmbDescr:     '人脸识别照-1', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'faceRecognition2', url: '', tmbDescr:     '人脸识别照-2', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'faceRecognition3', url: '', tmbDescr:     '人脸识别照-3', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'faceRecognition4', url: '', tmbDescr:     '人脸识别照-4', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'faceRecognition5', url: '', tmbDescr:     '人脸识别照-5', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},

            //钱盒补充资料的
            {name: 'bankLicensePath', url: '', tmbDescr:     '银行卡开户许可证', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'leaseContrPath', url: '', tmbDescr:     '租赁合同', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'bankCreditReportPath', url: '', tmbDescr:     '央行信用报告', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'individualInsurPath', url: '', tmbDescr:     '个人保单', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'shopPolicyPath', url: '', tmbDescr:     '商铺保单', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'proofFixedAssetsPath', url: '', tmbDescr:     '固定资产证明', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'driveLicePath', url: '', tmbDescr:     '驾驶证', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'otherInf1', url: '', tmbDescr:     '其他资料1', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'otherInf2', url: '', tmbDescr:     '其他资料2', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'otherInf3', url: '', tmbDescr:     '其他资料3', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'otherInf4', url: '', tmbDescr:     '其他资料4', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'}
        ],

        'org.images': [
            {name:      'idCardFront', url: '', tmbDescr:   '证件正面照', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name:       'idCardBack', url: '', tmbDescr: '证件反面照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'personWithIdCard', url: '', tmbDescr:   '手持证件照', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'pbankCard', url: '', tmbDescr:   '银行卡照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'bankCard', url: '', tmbDescr:   '银行卡/开户许可证照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name:          'license', url: '', tmbDescr:     '营业执照', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name:            'orgImage', url: '', tmbDescr:     '组织机构证照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name:            'taxImage', url: '', tmbDescr:     '税务登记表照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'}
        ],

        'user.images': [
            {name:      'idCardFront', url: '', tmbDescr:   '证件正面照', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name:       'idCardBack', url: '', tmbDescr: '证件反面照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'personWithIdCard', url: '', tmbDescr:   '手持证件照', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'bankCard', url: '', tmbDescr:   '银行卡/开户许可证照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'signPicture', url: '', tmbDescr:   '签名图片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'faceRecognition', url: '', tmbDescr:   '活体识别', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'faceRecognition1', url: '', tmbDescr:   '活体识别', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'transAppImage', tmbDescr: '转让申请书照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'openPermitImage', tmbDescr: '开户许可证照片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'},
            {name: 'businessLicImg', tmbDescr: '营业执照图片', bimgDescr: '', belong: 'B1,B2,A1,C2,C1'}
        ],

        //修改银行卡
        'bankNo.images': [
            {name:'bankCard', url:'', tmbDescr:'银行卡/开户许可证照片', bimgDescr:'', belong: 'B1,B2,A1'},
            {name:'personWithBankCard', url:'', tmbDescr:'手持证件照', bimgDescr:'', belong: 'B1,B2,A1'},
            {name:'idCardFront', url:'', tmbDescr:'商户身份证照片', bimgDescr:'', belong: 'B1,B2,A1'},
            {name:'personWithIdCard', url:'', tmbDescr:'商户手持身份证照片', bimgDescr:'', belong: 'B1,B2,A1'}
        ],

        //实名认证审核
        'certificate.images': [
            {name:'idCardFront', url:'', tmbDescr:'证件正面照', bimgDescr:'', belong: 'B1,B2,A1,C2,C1'},
            {name:'idCardBack', url:'', tmbDescr:'证件反面照片', bimgDescr:'', belong: 'B1,B2,A1,C2,C1'},
            {name:'personWithIdCard', url:'', tmbDescr:'手持证件照', bimgDescr:'', belong: 'B1,B2,A1,C2,C1'},
            {name:'bankCard', url:'', tmbDescr:'银行卡/开户许可证照片', bimgDescr:'', belong: 'B1,B2,A1,C2,C1'},
            {name:'signPicture', url:'', tmbDescr:'签名图片', bimgDescr:'', belong: 'B1,B2,A1,C2,C1'}
        ],

        //T0提额审核
        'T0.images': [
            {name:'orgImage', url:'', tmbDescr:'组织机构证照片', bimgDescr:'', belong: 'B1,B2,A1,C2,C1'},
            {name:'taxImage', url:'', tmbDescr:'税务登记表照片', bimgDescr:'', belong: 'B1,B2,A1,C2,C1'},
            {name:'license', url:'', tmbDescr:'营业执照', bimgDescr:'', belong: 'B1,B2,A1,C2,C1'}
        ],

        '__xx': '' // 这个配置项没有实质意义，仅用于容错
    }
});
