define([
], function(App) {

    //检查第一个页面的值是否都取到了
    function checkInfo (obj) {
        var map = {
            'explorerId': 'B1,B2,D1,E1',
            'explorerName': 'B1,B2,D1,E1',

            'mchtName': 'B1,B2,D1,E1',
            'mchtKind': 'B1,B2,D1,E1,C1,C4',
            'areaNo': 'B1,B2,D1,E1',
            'address': 'B1,B2,D1,E1',
            'group': 'B1,B2,D1,E1',
            'mcc': 'B1,B2,D1,E1',
            'tNDiscId': 'B1,B2,D1,E1',
            'tZeroDiscId': 'B1,B2,D1,E1',
            'discCycle': 'B1,B2,D1,E1',

            'userName': 'B1,B2,D1,E1',
            'userPhone': 'B1,B2,D1,E1',
            'userCardType': 'B1,B2,D1,E1',
            'userCardNo': 'B1,B2,D1,E1',
            'userEmail': 'B1,B2,D1,E1',

            'licNo':'B2',
            'taxNo':'B2',
            'attr':'B2',
            'comTel':'B2',

            'accountName':'B1,B2,D1,E1',
            'accountNo':'B1,B2,D1,E1',
            'zbankRegionCode':'B1,B2,D1,E1',
            'zbankName':'B1,B2,D1,E1',
            'zbankNo':'B1,B2,D1,E1',
            'bankNo':'B1,B2,D1,E1',
            'bankName':'B1,B2,D1,E1',
            'accountType':'B1,B2,D1,E1',
            "accountProxy":'B1,B2,D1,E1', 
            "_accountProxyType":'B1,B2,D1,E1',

            '_attrDescr':'B1,B2,D1,E1',
            '_cardTypeDescr':'B1,B2,D1,E1',
            '_discCycleDesc':'B1,B2,D1,E1',
            '_mccDescr':'B1,B2,D1,E1',
            '_mccGroupDescr':'B1,B2,D1,E1',
            '_mchtDiscIdDescr':'B1,B2,D1,E1',
            '_mchtDiscIdZeroDescr':'B1,B2,D1,E1'

        };

        var checkedKeys = [];
        var valid = true;
        _.each(map, function (belongs, key) {
            var kind = obj.mchtKind, theVal;
            if(!kind) {
                console.error('没有mchtKind');
                return false;
            }

            if(belongs.indexOf(kind) !== -1) {
                checkedKeys.push(key);
                if(!Opf.get(obj, 'accountProxy') && key=='_accountProxyType') {
                    valid = true;
                }
                else if(Opf.get(obj, key) == null) {
                    valid = false;
                    console.error('没有'+key);
                }
            }
        });
        if(valid) {
            console.log('obj字段验证通过');
        }

        function keys (o) {
            var ret = [];
            for(var p in o) {
                if($.isPlainObject(o[p])) {
                    var arr = keys(o[p]);
                    _.map(arr, function (v, i) {
                        ret.push(p+'.'+v);
                    });
                }else {
                    ret.push(p);
                }
            }
            return ret;
        }
        //var unchecked = _.difference(keys(obj), checkedKeys);
        //unchecked.length && console.error('多余的参数', unchecked);

    }

    return {
        checkInfo: checkInfo
    };
});