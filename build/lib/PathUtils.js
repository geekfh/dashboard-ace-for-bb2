var os = require('os');
var path = require('path');
var FileUtils = require('../lib/FileUtils');
var fs = require('fs');

module.exports = {

    normalizeForwardSlash: function(url) {
        return url.replace(/\\/g, '\/');
    },

    join: function() {
        return this.normalizeForwardSlash(path.join.apply(path, arguments));
    },

    /**
     * 抽取css的href属性对应的绝对路径
     * @param  {String} strLinks 多个csslink标签组成的字符串
     * @return {Array}
     */
    getCSSPaths: function(strLinks, basePath) {
        // console.log('>>>getCSSPaths');
        var ret = [];
        var reg_href = /href=(["'])(.*?)\1/;
        var matchRet, href, cssAbsolutePath, stat;

        FileUtils.eachNonEmptyLine(strLinks, function(line) {
            matchRet = line.match(reg_href);
            // console.log('>>>开始解析css标签的绝对路径', line);
            if (!matchRet) {
                throw new Error('css超链接匹配出错' + line);
            } else {
                href = matchRet[2];
                cssAbsolutePath = path.resolve(basePath, href);
                if (fs.existsSync(cssAbsolutePath)) {
                    ret.push(cssAbsolutePath);
                } else {
                    throw new Error('找不到对应css文件');
                }
            }
            // console.log('<<<结束解析css标签的绝对路径');
        });
        // console.log('收集到的路径', ret);
        // console.log('<<<getCSSPaths');
        return ret;
    }

};