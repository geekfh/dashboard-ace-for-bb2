var fs = require('fs');
var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp');
var reg_empty = /^\s*$/;

module.exports = {

    eachNonEmptyLine: function (strContent, cb) {
        strContent.trim().split(os.EOL).forEach(function (line) {
            if(!reg_empty.test(line)) {
                cb(line);
            }
        });
    },

    //写文件之前会创建父目录，如果不存在的话
    writeFileSync: function (filePath, content) {
        mkdirp.sync(path.dirname(filePath));
        return fs.writeFileSync(filePath, content);
    }
    
};
