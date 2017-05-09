/**
 * 构建OM业务模块
 * gulp --gulpfile mcht-webapp-build/gulpfile.js [--fwk --module --onestation]
 */
var config = require('./config.js');
var FileUtils = require('../lib/FileUtils');
var MyUtils = require('../lib/MyUtils');
var TemplateUtils = require('../lib/TemplateUtils');
var PathUtils = require('../lib/PathUtils');
var BuildPathManager = require('../lib/BuildPathManager.js');

var fs = require('fs');
var util = require('util');
var path = require('path');
var Q = require('q');
var rimraf = require('rimraf');
var moment = require('moment');
var mkdirp = require('mkdirp');
var requirejs = require('requirejs');
var argv = require('yargs').argv;

var gulp = require('gulp');
var chug = require('gulp-chug');
var tap = require('gulp-tap');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var cleancss = require('gulp-clean-css');
//var gutil = require('gulp-util');
//var rename = require('gulp-rename');
//var debug = require('gulp-debug');
//var changed = require('gulp-changed');
//var jshint = require('gulp-jshint');

var _ = require('underscore');
var Minimize = require('minimize');
var minimize = new Minimize({
      // empty: true,        // KEEP empty attributes
      // cdata: true,        // KEEP CDATA from scripts
      // comments: true,     // KEEP comments
      // ssi: true,          // KEEP Server Side Includes
      conditionals: true//, // KEEP conditional internet explorer comments
      // spare: true,        // KEEP redundant attributes
      // quotes: true,       // KEEP arbitrary quotes
      // loose: true         // KEEP retain one whitespace
    });
var pathHelper = new BuildPathManager();

var getDistPath = function(sub) {
    return pathHelper.resolveDistPath(sub);
};
var getSrcPath = function(sub) {
    return pathHelper.resolveSrcPath(sub);
};

// 时间戳(更新文件缓存)
var ts = moment().format('YYYYMMDDHHmmss');

/**
 * 编译参数
 * @type {boolean}
 */
var IS_BUILD_FWK = !!argv.fwk;
var IS_BUILD_MODULE = !!argv.module;
var IS_BUILD_ONESTATION = !!argv.onestation;

/**
 * 环境变量
 * @type {string}
 */
var ENV_MODULE_NAME = IS_BUILD_MODULE? argv.module:"";
var ENV_MODULE_PATH = "";
var ENV_MODULE_CONF = {};
var ENV_FWK_CONF = {};

/**
 * 监听GULP事件
 * 设置编译环境变量
 */
gulp.on('task_start', function(taskObj) {
    var taskName = taskObj.task;

    // 设置框架环境变量
    if(/build-fwk-*/.test(taskName)) {
        ENV_FWK_CONF = config["fwk"];
        pathHelper.srcRoot = ENV_FWK_CONF.srcRoot;
        pathHelper.distRoot = ENV_FWK_CONF.distRoot;
    }

    // 设置模块环境变量
    if(/build-module-*/.test(taskName)) {
        ENV_MODULE_CONF = config["module"];
        ENV_MODULE_PATH = _.template(ENV_MODULE_CONF.baseUrl)({moduleName:ENV_MODULE_NAME});
        pathHelper.srcRoot = ENV_MODULE_CONF.srcRoot = (ENV_MODULE_CONF[ENV_MODULE_NAME]||{}).srcRoot||"./";
        pathHelper.distRoot = ENV_MODULE_CONF.distRoot = (ENV_MODULE_CONF[ENV_MODULE_NAME]||{}).distRoot||"./";
    }

});

/**
 * task stop
 */
gulp.on('task_stop', function(taskObj) {
    var taskName = taskObj.task;

    if(/build-.*-ready/.test(taskName)) {
        rimraf.sync(getDistPath());//清空输出目录下的内容
        mkdirp.sync(getDistPath());//创建输出根目录
    }
});

/**
 * 前端框架
 * build option: --fwk
 */
gulp.task('build-fwk', [
    'build-fwk-html',
    'build-fwk-images',
    'build-fwk-js',
    'build-fwk-optimize',
    'build-fwk-tpl',
    'build-fwk-plugins',
    'build-fwk-copy'
], function() {
    console.log("\n======== framework build done ========\n");
});

/**
 * 子系统(模块)
 * build option: --module
 */
gulp.task('build-module', [
    'build-module-js',
    'build-module-optimize',
    'build-module-tpl'
], function() {
    console.log("\n======== module build done ========\n");
});

/**
 * 一站式查询
 * build option: --onestation
 */
gulp.task('build-onestation', function() {
    return gulp.src(['../onestation-build/gulpfile.js'])
        .pipe(chug())
        .on("error", function(err){
            console.error(">>>err:onestation", err);
        });
});

/**
 * 启动不同的编译模式
 */
var runSequenceCallback = function() {
    gulp.run("copy-folder", function() {
        console.log("*_* congratulations *_*");
    });
};
// fwk+module+onestation
if(IS_BUILD_FWK && IS_BUILD_MODULE && IS_BUILD_ONESTATION) {
    gulp.task('default', function() {
        runSequence(
            'build-fwk-ready', 'build-fwk',
            'build-module', 'build-onestation',
            runSequenceCallback
        )
    });
}
// fwk+module
else if(IS_BUILD_FWK && IS_BUILD_MODULE) {
    gulp.task('default', function() {
        runSequence(
            'build-fwk-ready', 'build-fwk',
            'build-module', runSequenceCallback
        )
    });
}
// fwk+onestation
else if(IS_BUILD_FWK && IS_BUILD_ONESTATION) {
    gulp.task('default', function() {
        runSequence(
            'build-fwk-ready', 'build-fwk',
            'build-onestation', runSequenceCallback
        )
    });
}
// module+onestation
else if(IS_BUILD_MODULE && IS_BUILD_ONESTATION) {
    gulp.task('default', function() {
        runSequence(
            'build-module-ready', 'build-module',
            'build-onestation', runSequenceCallback
        )
    });
}
// fwk
else if(IS_BUILD_FWK) {
    gulp.task('default', function() {
        runSequence(
            'build-fwk-ready', 'build-fwk',
            runSequenceCallback
        )
    });
}
// module
else if(IS_BUILD_MODULE) {
    gulp.task('default', function() {
        runSequence(
            'build-module-ready', 'build-module',
            runSequenceCallback
        )
    });
}
// onestation
else if(IS_BUILD_ONESTATION) {
    gulp.task('default', function() {
        console.log("====================================================");
        console.log(" exec: gulp --gulpfile onestation-build/gulpfile.js ");
        console.log("====================================================");
    });
}
// others
else {
    console.log("\n======== build params error [--fwk --module --onestation] ========\n");
}

/**
 * 设置FWK环境变量
 */
gulp.task('build-fwk-ready', function () {
    console.log("fwk env done");
});

/**
 * 设置MDL环境变量
 */
gulp.task('build-module-ready', function () {
    console.log("module env done");
});

/**
 * 处理html，抽取css分包压缩
 */
gulp.task('build-fwk-html', function () {
   handlerHtml(getSrcPath('index.html'), getDistPath('index.html')); 
   handlerHtml(getSrcPath('login.html'), getDistPath('login.html')); 
});

/**
 * 压缩框架JS
 */
gulp.task('build-fwk-js', function () {
    return gulp.src(getSrcPath(ENV_FWK_CONF.paths.js))
        .pipe(tap(function(file){
            var contents = file.contents.toString();
            contents = handlerUrl(contents, false);
            file.contents = new Buffer(contents);
            console.log("PATH=", file.path);
        }))
        .pipe(uglify())
        .pipe(gulp.dest(getDistPath(ENV_FWK_CONF.dests.js)))
        .on('error', function(err) {
            console.error(">>>err:build:fwk:js", err);
        });
});

/**
 * JS优化
 */
gulp.task('build-fwk-optimize', function () {
    var deferred = Q.defer();
    var rjsConfig = {
        name: ENV_FWK_CONF.paths.requireMainFile,
        baseUrl: getSrcPath(config['rjs.baseUrl']),
        mainConfigFile: getSrcPath(ENV_FWK_CONF.paths.requireMainFile+'.js'),
        preserveLicenseComments: false,
        optimize: 'uglify2',
        /*uglify2: {
            mangle: false,
            output: {
                beautify: true
            },
            beautify: {
                semicolons: false
            }
        },*/
        out: function (outTxt) {
            var newOutTxt = outTxt//.replace(/(urlArgs\s*:\s*(['"]))(_ts=).*?\2/, '$1$3'+ts+'$2')
                                 .replace(/(requirejs\.config\({[\s\r\n]*?deps\s*:\s*\[)/m, '$1"'+ENV_FWK_CONF.paths.allTplFile+'",');
			newOutTxt = handlerUrl(newOutTxt, false);
            FileUtils.writeFileSync(getDistPath(ENV_FWK_CONF.paths.requireMainFile+".js"), newOutTxt);
        }
    };

    requirejs.optimize(rjsConfig, function(buildResponse) {
        //buildResponse is just a text output of the modules
        //included. Load the built file for the contents.
        //Use config.out to get the optimized file contents.
        // var contents = fs.readFileSync(config.out, 'utf8');
        //buildResponse记录依赖的文件
        deferred.resolve();
    }, function(err) {
        console.error(">>>err:build:fwk:optimize", err);
        //optimization err callback
    });

    return deferred.promise;
});

/**
 * 打包tpl文件
 * 封装成一个js，解决跨域访问模板文件
 */
gulp.task('build-fwk-tpl', function() {
    var rjsBaseUrl = getSrcPath(config['rjs.baseUrl']),
        tplModuleName, strTpl, newContent;

    return gulp.src(getSrcPath(ENV_FWK_CONF.paths.tpl))
        .pipe(tap(function(file) {
            tplModuleName = PathUtils.normalizeForwardSlash(path.relative(rjsBaseUrl, file.path));
            strTpl = file.contents.toString().replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/mg, '');
            newContent = TemplateUtils.genTemplateModule(tplModuleName, strTpl);
            newContent = handlerUrl(newContent, false);
            file.contents = new Buffer(newContent);
            console.log("PATH=", file.path);
        }))
        .pipe(concat(ENV_FWK_CONF.allTplFileName))
        .pipe(gulp.dest(getDistPath(ENV_FWK_CONF.dests.tpl)))
        .on('error', function(err) {
            console.error(">>>err:build:fwk:tpl", err);
        });
});

/**
 * 抽取所有包含images目录的照片
 * 放到assets/css/images目录下
 */
gulp.task('build-fwk-images', function() {
    var imageFolderName = 'images';

    return gulp.src(getSrcPath(ENV_FWK_CONF.paths.images))
        .pipe(tap(function (file) {
            file.base = file.path.substring(0, file.path.indexOf(imageFolderName) + imageFolderName.length);
        }))
        .pipe(gulp.dest(getDistPath(ENV_FWK_CONF.dests.images)));
});

/**
 * 插件优化
 */
gulp.task('build-fwk-plugins-css', function() {
    return gulp.src(getSrcPath(ENV_FWK_CONF.paths.plugins.css))
        .pipe(cleancss())
        .pipe(gulp.dest(getDistPath(ENV_FWK_CONF.paths.plugins.dist)))
        .on('error', function(err) {
            console.error(">>>err:build:fwk:plugins:css", err);
        });
});
gulp.task('build-fwk-plugins-js', function() {
    return gulp.src(getSrcPath(ENV_FWK_CONF.paths.plugins.js))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(gulp.dest(getDistPath(ENV_FWK_CONF.paths.plugins.dist)))
        .on('error', function(err) {
            console.error(">>>err:build:fwk:plugins:js", err);
        });
});
gulp.task('build-fwk-plugins-images', function() {
    return gulp.src(getSrcPath(ENV_FWK_CONF.paths.plugins.images))
        .pipe(gulp.dest(getDistPath(ENV_FWK_CONF.paths.plugins.dist)));
});
gulp.task('build-fwk-plugins', [
    'build-fwk-plugins-css',
    'build-fwk-plugins-js',
    'build-fwk-plugins-images'
], function() {
    console.log(">>>plugins build done");
});

/**
 * 复制文件夹
 */
gulp.task('build-fwk-copy', function () {
    _.each(ENV_FWK_CONF.copyTask, function (item) {
        return gulp.src(getSrcPath(item.src))
            .pipe(gulp.dest(getDistPath(item.dest)));
    });
});

/**
 * 压缩JS模块
 */
gulp.task('build-module-js', function () {
     return gulp.src(getSrcPath(ENV_MODULE_CONF.paths.js))
         .pipe(tap(function(file){
             var contents = file.contents.toString();
             contents = handlerUrl(contents, false);
             file.contents = new Buffer(contents);
             console.log("PATH=", file.path);
         }))
         .pipe(uglify())
         .pipe(gulp.dest(getDistPath(ENV_MODULE_CONF.appDir)))
         .on('error', function(err) {
             console.error(">>>err:build:module:js", err);
         });
});

/**
 * 把tpl文件包装成js模块
 * 解决跨域访问问题
 */
gulp.task('build-module-tpl', function() {
    var rjsBaseUrl = getSrcPath(config['rjs.baseUrl']),
        tplModuleName, strTpl, newContent;

    return gulp.src(getSrcPath(ENV_MODULE_CONF.paths.tpl))
        .pipe(tap(function(file) {
            tplModuleName = PathUtils.normalizeForwardSlash(path.relative(rjsBaseUrl, file.path));
            strTpl = file.contents.toString().replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/mg, '');
            newContent = TemplateUtils.genTemplateModule(tplModuleName, strTpl);
            newContent = handlerUrl(newContent, false);
            file.contents = new Buffer(newContent);
            console.log("PATH=", file.path);
        }))
        .pipe(concat(ENV_MODULE_CONF.allTplFileName))
        .pipe(gulp.dest(getDistPath(ENV_MODULE_PATH)))
        .on('error', function(err) {
            console.error(">>>err:build:module:tpl", err);
        });
});

/**
 * 主模块优化
 */
gulp.task('build-module-optimize', function () {
    var deferred = Q.defer();
    var _name = _.template(ENV_MODULE_CONF.paths.requireMainFile)({moduleName:ENV_MODULE_NAME});
    var _tplFileName = ENV_MODULE_CONF.allTplFileName.replace(/\.js/ig, "");

    var rjsConfig = {
        name: _name,
        baseUrl: getSrcPath(config['rjs.baseUrl']),
        preserveLicenseComments: false,
        optimize: 'uglify2',
        paths: {
            i18n: ENV_MODULE_PATH+'/common/i18n' //assets/scripts/vendor/i18n
        },
        out: function (outTxt) {
            var newOutTxt = outTxt.replace(/(define.*module-main.*?['"]\s*)(\])/, '$1,"'+ENV_MODULE_PATH+"/"+_tplFileName+'"$2');
                newOutTxt = handlerUrl(newOutTxt, false);
            FileUtils.writeFileSync(getDistPath(_name+".js"), newOutTxt);
        }
    };

    requirejs.optimize(rjsConfig, function() {
        deferred.resolve();
    }, function(err) {
        console.error(">>>err:build:module:optimize", err);
    });

    return deferred.promise;
});

/**
 * copy根目录下的文件夹
 */
gulp.task('copy-folder', function () {
    var srcRoot = getSrcPath(''), subFolder;

    fs.readdirSync(srcRoot).forEach(function(item){
        subFolder = srcRoot + '/' + item;
        //如果是直接目录，并且不再 “排除配置” 里，则创建目录
        if(fs.statSync(subFolder).isDirectory() &&
            !_.contains(config.excludeFolder, item)){
            console.log("SUB_FOLDER=", subFolder);

            mkdirp.sync(getDistPath(item));

            return gulp.src(getSrcPath(subFolder + '/**'))
                .pipe(gulp.dest(getDistPath(item)));
        }
    });
});

/**
 * 处理html，抽取css分包压缩
 * @filePath 原始文件路径
 * @destPath 文件输出路径
 */
function handlerHtml(filePath, destPath) {
    console.log('PATH=', filePath);

    var content = fs.readFileSync(filePath, 'utf-8').toString();
    var fileName = path.basename(filePath, '.html');
    var cssPkgCount = 0, cssPkgName;
    var nextCssPkgId = function() { return ++cssPkgCount; };

    // 打包所有浏览器都用到的css文件
    content = content.replace(/<!--.*@compress-start.*-->((?:.|\r|\n)*?)<!--.*@compress-end.*-->/gmi, function(matchText, cssLines) {
        cssPkgName = util.format('opf-all-%s-%s.css', fileName, nextCssPkgId());

        console.log('package:css:begin', cssPkgName);

        MyUtils.gulpCompressCssByCssHtml(getSrcPath(), cssLines, cssPkgName, getDistPath(ENV_FWK_CONF.dests.css))
            .on('end', function() {
                console.log('package:css:end', cssPkgName);
            });

        return '<link rel="stylesheet" href="' + PathUtils.join(ENV_FWK_CONF.dests.css, cssPkgName) + '" />';
    });

    //打包IE相关的css文件
    content = content.replace(/(<!--\[if(.*)\]>)((?:\s|\r|\n)*?<link(?:.|\r|\n)*?)(<!\[endif\]-->)/gmi, function(matchText, startTag, condition, cssLines, endTag) {
        cssPkgName = util.format('opf-all-%s-%s-%s.css', fileName, nextCssPkgId(),
            condition.trim().toLowerCase().replace('!', 'non').replace(/\s+/g, '-'));

        console.log('package:IE:css:begin', cssPkgName);

        MyUtils.gulpCompressCssByCssHtml(getSrcPath(), cssLines, cssPkgName, getDistPath(ENV_FWK_CONF.dests.css))//
                .on('end', function () {
                    console.log('package:IE:css:end', cssPkgName);
                });

        return [
            startTag,
            '<link rel="stylesheet" href="' + PathUtils.join(ENV_FWK_CONF.dests.css, cssPkgName) + '" />',
            endTag
        ].join('\n');
    });

    content = MyUtils.disableCacheHrefs(content, ts);

    minimize.parse(content, function(error, data) {
        data = handlerUrl(data, false);
        fs.writeFileSync(destPath, data);
    });
}

/**
 * 替换URL
 * @content 文件路径或者文件内容
 * @flag true/false 路径|文件内容
 */
function handlerUrl(content, flag) {
	var isFilePath = flag;
	var filePath = isFilePath && content;
	var resBaseUrl = config['res.baseUrl'];
	var contents = isFilePath? fs.readFileSync(filePath, 'utf-8').toString():content;

	var baseUrl_flag = 'baseUrl:\\s*([\'\"]).*\\1';
    var urlArgs_flag = 'urlArgs:\\s*([\'\"]).*\\1';
	var html_flag = '^<!DOCTYPE html>.*$';
	var js_flag = '(./)?assets/scripts(?!/require-main)';
	var css_flag = '(./)?assets/css';
	var images_flag = '(./)?assets/images';

    var reb = new RegExp(baseUrl_flag, 'gmi');
    var ret = new RegExp(urlArgs_flag, 'gmi');
    var reh = new RegExp(html_flag, 'gmi');
	var rej = new RegExp(js_flag, 'gmi');
	var re = new RegExp(css_flag+'|'+images_flag, 'gmi');

    // 替换HTML
    if(reh.test(contents)) {
        //scripts
        contents = contents.replace(rej, function(matchText){
            return resBaseUrl+matchText;
        });

        //urlArgs
        contents = contents.replace(ret, function(matchText){
            return matchText.replace(/\d+/, ts);
        });

        //baseUrl
        contents = contents.replace(reb, function(matchText){
            return matchText.replace(/\.\//, resBaseUrl);
        });
    }

    // css和image的引用路径改为绝对路径
    contents = contents.replace(re, function(matchText){
        return resBaseUrl+matchText;
    });

	if(!isFilePath) return contents;
	
	fs.writeFileSync(filePath, contents);
}

// gulp.task('watch', function () {
    // gulp.watch( config.paths.js, ['js'] );
// });
