/**
 * @class Context
 * @singleton
 */
define([
    'assets/scripts/fwk/main/MenuMgr',
    'assets/scripts/fwk/main/PmMgr',
    'assets/scripts/fwk/main/UrlMgr',
    'jquery.msgValidate'
],

function() {

    var Context = {};

    Context.avail = function (rsId) {
        return rsId!=="menu.notice";
    };

    return Context;
});