define(function(){
    /**
     * label: 字段名
     * key: data-key
     * checkable: true/false  默认true
     * type: text/image 默认""
     */

    return {
        infoSection: {
            legend: "身份认证结果",
            items: [
                {label: "人脸识别分数", key: "score", checkable: false},
                {label: "人脸识别图片", key: "faceRecognition", type: "image"}
            ]
        },
        imageSection: {
            legend: "身份证，银行卡信息(OCR)",
            idCardInfo: {
                items: [
                    {label: "身份证号", key: "userCardNo", checkable: false, type: "text"},
                    {label: "证件正面照", key: "idCardFront"},
                    {label: "手持证件照", key: "personWithIdCard"}
                ]
            },
            bankCardInfo: {
                items: [
                    {label: "账户号(卡号)", key: "accountNo", checkable: false, type: "text"},
                    {label: "银行卡/开户许可证照片", key: "bankCard"}
                ]
            }
        }
    }
});