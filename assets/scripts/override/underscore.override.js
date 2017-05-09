define([
    'underscore.origin'
], function(_) {

    var enumerables = true,
        enumerablesTest = {
            toString: 1
        },
        i;

    for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
            'toLocaleString', 'toString', 'constructor'
        ];
    }

    /**
     * var obj = {name: 'peter'};
     * _.merge(obj, {name:'ken', age: 10}, {name: 'lily', gender:'female'})
     * //=>{name:'lily', age:10, gender:'female'}
     */
    _.merge = function(object, config, defaults) {
        if (defaults) {
            _.merge(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    /**
     * var obj = {name: 'peter', age: 10}
     * _.mergeIf(obj, {name:'ken', gender:'male'})
     * //=>{name:'peter', age: 10, gender:'male'}
     */
    _.mergeIf = function(object, config) {
        var property;

        if (object) {
            for (property in config) {
                if (object[property] === undefined) {
                    object[property] = config[property];
                }
            }
        }

        return object;
    };

    /**
     * @param  {Array}  array    
     * @param  {*}  value    
     * @param  {Boolean} isSorted 数组本身是否有序
     */
    _.remove = function (array, value, isSorted) {
        var target = _.indexOf(array, value, isSorted);
        if(target !== -1) {
            array.splice(target, 1);
            return true;
        }
        return false;
    };

    /**
     * _.format("hello {0}, {1}", "peter", "huxiang1")
     * //return "hello peter, huxiagn1"
     */
    _.format = function(format){ //jqgformat
        var args = $.makeArray(arguments).slice(1);
        if(format==void 0) { format = ""; }
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    };

    /**
     * var obj = {name:'peter', sayHello: function () {alert('hello');}};
     * var mapper = _.resultFn(obj);
     *
     * mapper('name')//=>'peter'
     * mapper('sayHello')//=>alert('hello');
     */
    _.resultFn = function (obj) {
        return function (name) {
            return _.result(obj, name);
        };
    };

    var __isEmpty = _.isEmpty;

     /**
      * 原来的功能
     * isEmpty(null)//true
     * isEmpty(undefined)//true
     * isEmpty({})//true
     * isEmpty([])//true
     * isEmpty('')//false
     *
     * 扩展
     * 第二个参数的作用，例子：
     * isEmpty('', true)//true
     */
    _.isEmpty = function (obj, allowEmptyString) {
        if(_.isString(obj) ) {
            return (!allowEmptyString ? obj === '' : false);
        }else {
            return __isEmpty(obj);
        }
    };

    //underscore 的 contains 方法，内部使用强等于，这里 weekContains 使用弱等于
    _.weekContains = _.weekInclude = function(obj, target) {
        if (obj == null) return false;
        return _.any(obj, function(value) {
            return value == target;
        });
    };

    return _;

});