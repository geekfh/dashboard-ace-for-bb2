var gulp = require('gulp');
var fs = require('fs');
var tap = require('gulp-tap');

var tplPath = [ '../../openplatform-mcht-webapp/src/main/webapp/assets/**/*.tpl' ];
var SUB_STRING = "<%="; // 搜索包含"<%="字串



var HTML_HEAD = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<title></title>',
    '<meta charset="utf-8">',
    '<style type="text/css">',
    '.contain-height-light {',
        'background: #F99;',
    '}',
    '.default-list {',
        'background: #CFD;',
    '}',
    '.height-light-list {',
        'background: #ffecdb;',
    '}',
    '</style>',
    '</head>',
    '<body>'
];

var HTML_BOTTOM = [
    '</body>',
    '</html>'
];



//  判断是否包含"<%="
function containSubString (filePath, subStrArr) {
    var isContain = false;
    var writeConetntArr = [], tmpHtmlStr;

    writeConetntArr.push(strAddDiv(filePath));

    for (var i=0; i<subStrArr.length; i++) {
        if (subStrArr[i].indexOf(SUB_STRING) !== -1) {
            tmpHtmlStr = formatterHeightLightHtml(formatterToHtml(subStrArr[i]));
            isContain = true;
            writeConetntArr.push(strAddHeightLightDiv(i + 1 + ': ' + tmpHtmlStr));
        } else {
            tmpHtmlStr = formatterToHtml(subStrArr[i]);
            writeConetntArr.push(strAddDiv(i + 1 + ': ' + tmpHtmlStr));
        }
    }

    writeConetntArr.push('<br><br><br>');

    return {isContain: isContain, writeConetnt: writeConetntArr.join('\n')};
}

function formatterToHtml (str) {
    return str.replace(/</g, '&lt').replace(/>/g, '&gt').replace(/ /g, '&nbsp');
}

function formatterHeightLightHtml (str) {
    return str.replace(/&lt%=/g, '<label class="contain-height-light"><%=').replace(/%&gt/g, '%></label>');
}

function strAddDiv (str) {
    return '<div class="tpl-list default-list">' + str + '</div>';
}

function strAddHeightLightDiv (str) {
    return '<div class="tpl-list height-light-list">' + str + '</div>';
}


gulp.task('default', function() {

    var tplArr = [];

    gulp.src(tplPath)//
    .pipe(tap(function(file) {
        var tplRealPath = file.path.split('scripts\\')[1];
        var lineArr = file.contents.toString().split('\n');

        var result = containSubString(tplRealPath, lineArr);

        result.isContain && tplArr.push(result.writeConetnt);

    }))
    .on('end', function(){

        var resultTplPAthHtml = HTML_HEAD.join('\n') + tplArr.join('\n') + HTML_BOTTOM.join('\n');

        fs.writeFile('tpl-out/tpl-result.html', resultTplPAthHtml,  function () {
            console.log(resultTplPAthHtml);
        });
    });//



}); 