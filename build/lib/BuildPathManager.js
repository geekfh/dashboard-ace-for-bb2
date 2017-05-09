var os = require('os');
var path = require('path');
var _ = require('underscore');

var reg_empty = /^\s*$/;


function _basePath(base, sub) {
    var nonPrefix = false;
    sub = sub || '';
    if(_.isArray(sub)) {
        return _.map(sub, function (p) {
            return _basePath(base, p);
        });
    }
    if(sub.charAt(0)==='!') {
        nonPrefix = true;
        sub = sub.substring(1);
    }
    return (nonPrefix ? '!' : '') + path.resolve(base, sub);
}

function BuildPathManager (srcRoot, distRoot) {
    this.srcRoot = srcRoot;
    this.distRoot = distRoot;
}

BuildPathManager.prototype = {

    getSrcRoot: function () {
        return this.srcRoot;
    },

    getDistRoot: function () {
        return this.distRoot;
    },

    basePath: _basePath,

    resolveDistPath: function (sub) {
        if(!this.distRoot) {
            //throw error
        }
        return _basePath(this.distRoot, sub);
    },

    resolveSrcPath: function (sub) {
        if(!this.srcRoot){
            //throw error
        }
        return _basePath(this.srcRoot, sub);
    }

};

module.exports = BuildPathManager;

