var gulp = require('gulp');
//var gutil = require('gulp-util');
var minifyCSS = require('gulp-clean-css');
var gulpConcat = require('gulp-concat');
var moment = require('moment');
var PathUtils = require('../lib/PathUtils');

var DEFAULT_TS = moment().format('YYYYMMDDHHmmss');

var SCRIPT_TAG_REG = /(<script.+src=['"][^'"]+.js)(['"]>\s*?<\/script>)/g;
var CSS_TAG_REG = /(<link.+href=['"][^'"]+.css)(['"][^>]+>)/g;

var MyUtils = {

    /**
     * gulp 压缩多个css，输出成一个css文件
     * @param  {[type]} srcBasePath  html代码中css的相对基路径
     * @param  {[type]} cssLines     links组成的html代码
     * @param  {[type]} destFileName 输出的css文件名
     * @param  {[type]} destPath     输出的目录
     */
    gulpCompressCssByCssHtml: function(srcBasePath, cssLines, destFileName, destPath) {
        var cssPaths = PathUtils.getCSSPaths(cssLines, srcBasePath);

        console.log('收集到css文件' + cssPaths.length + '个\n', cssPaths);

        return gulp.src(cssPaths) //
            // .pipe(debug({verbose: true}))
            .pipe(gulpConcat(destFileName))
            .pipe(minifyCSS())
            .pipe(gulp.dest(destPath))
            .on('error', function(err) {
                console.error(">>>err:html-css", err);
            });

    },

    // 扫描代码，给 script标签/css标签 的引用加上时间戳参数
    disableCacheHrefs: function(content, ts) {
        ts = ts || DEFAULT_TS;

        var ret = content.replace(SCRIPT_TAG_REG, '$1?_ts=' + ts + '$2') //
            .replace(CSS_TAG_REG, '$1?_ts=' + ts + '$2');

        return ret;
    }
};

module.exports = MyUtils;