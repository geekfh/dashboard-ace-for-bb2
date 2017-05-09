var fs = require('fs');
var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp');
var reg_empty = /^\s*$/;
var templateSettings = {
  evaluate  : /<%([\s\S]+?)%>/g,
  interpolate : /<%=([\s\S]+?)%>/g,
  escape      : /<%-([\s\S]+?)%>/g
};

var escapes = {
  "'":      "'",
  '\\':     '\\',
  '\r':     'r',
  '\n':     'n',
  '\t':     't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
// .replace(escaper, function(match) { return '\\' + escapes[match]; });

module.exports = {

    //从require-tpl插件抠出来
    template: function(str) {
        var c = templateSettings;
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
            'with(obj||{}){__p.push(\'' +
            str.replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(c.interpolate, function(match, code) {
                return "'," + code.replace(/\\'/g, "'") + ",'";
            })
            .replace(c.escape, function(match, code) {
            return "'," + /*globalEscapeFunName + */"_.escape(" + code.replace(/\\'/g, "'") + "),'";
            })
            .replace(c.evaluate || null, function(match, code) {
                return "');" + code.replace(/\\'/g, "'")
                    .replace(/[\r\n\t]/g, ' ') + "; __p.push('";
            })
            .replace(/\r/g, '')
            .replace(/\n/g, '')
            .replace(/\t/g, '') + "');}return __p.join('');";
        return tmpl;
    },

    genTemplateModule: function (moduleName, rawContent) {
      return "define('tpl!" + moduleName  +
              "', function() {return function(obj) { " +
                this.template(rawContent) +
              "}});";
    }
    
};