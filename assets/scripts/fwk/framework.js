define([
    'bowser',
    'jquery',
	'underscore',
	'assets/scripts/fwk/Opf',
	'assets/scripts/fwk/factory',
    'assets/scripts/fwk/function',
	'assets/scripts/fwk/utils',
    'assets/scripts/fwk/media',
    'assets/scripts/fwk/loader',
    'assets/scripts/fwk/ajax',
    'assets/scripts/fwk/component/toastr',
    'bootbox',
    'blockui',
    'simple.storage',
    'polling',
    'assets/scripts/fwk/layers-mgr',
    'assets/scripts/fwk/config-mgr',
    'jstorage'
], function(Bowser, $, _, Opf, Factory, FuncObj, Utils, Media, Loader, Ajax, Toast, Bootbox, blockui, Storage, Polling, LayersMgr, ConfMgr) {

    Opf.Bowser = Bowser;
	Opf.Factory = Factory;
    Opf.Function = FuncObj;
    Opf.Media = Media;
    Opf.Loader = Loader;
    Opf.Ajax = Ajax;
    Opf.Toast = Toast;
    Opf.Bootbox = Bootbox;
    Opf.Storage = Storage;

    Opf.Utils = Opf.Util;

    Opf.alert = Bootbox.alert;
    Opf.confirm = Bootbox.confirm;
    Opf.prompt = Bootbox.prompt;
    Opf.ajax = Ajax.request;
    Opf.Polling = Polling;
    Opf.LayersMgr = LayersMgr;
    Opf.Config = ConfMgr;
    Opf.jStorage = $.jStorage;

	return Opf;
});