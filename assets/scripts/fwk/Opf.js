define(['underscore'], function() {
    //global namespace
    Opf = {};

    var global = this;

    Opf.global = this;

    Opf.supports = {
        /**
         * @property TimeoutActualLateness True if the browser passes the "actualLateness" parameter to
         * setTimeout. See: https://developer.mozilla.org/en/DOM/window.setTimeout
         * @type {Boolean}
         */
        TimeoutActualLateness: (function() {
            setTimeout(function() {
                Opf.supports.TimeoutActualLateness = arguments.length !== 0;
            }, 0);
        }())
    };

    /**
     * Opf.ns('a.b.c');//==> window.a = {b:{c:{}}}
     *
     * var obj = {a:{name:'x'}}
     * Opf.ns(obj, 'a.b.c') //==> obj={a:{name:'x',b:{c:{}}}}
     */
    Opf.ns = function(root, packagePath, seperator) {
        if(typeof arguments[0] === 'string') {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(window);
            return Opf.ns.apply(null, args);
        }
        var o, d;
        _.each(Array.prototype.slice.call(arguments, 1), function(v) {
            d = v.split(seperator || '.');
            o = root[d[0]] = root[d[0]] || {};
            _.each(d.slice(1), function(v2) {
                o = o[v2] = o[v2] || {};
            });
        });
        return o;
    };

    _.merge(Opf, {
        
        /**
         * 用于判断业务逻辑上术语布尔真的值，并非js的布尔真判断
         */
        isBsTrue: function (val) {
            return val === true || val === '1' || val === 1;
        },

        isBsFalse: function (val) {
            return !this.isBsTrue(val);
        }
    });

    return Opf;
});