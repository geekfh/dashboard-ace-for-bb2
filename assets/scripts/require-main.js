/**
 * main.js
 * 配置requirejs
 */
requirejs.config({

    //urlArgs: '_ts=20140523101759',//打包的时候会替换掉时间戳

    //waitSeconds: 0,//不使用超时机制

    //baseUrl: 'assets/scripts',

    // 框架依赖
    deps:['bowser' ,'jquery', 'jquery.ui.touch-punch', 'bootstrap', 'jquery-ui',
        'ace', 'ace-elements', 'ace-extra', 'moment.override',
        "marionette", 'framework','placeholder', 'jquery.disableBackSpaceLeavePage', 'jquery.scrolltofixed', 'jquery.scrollTo'
    ],

    // 路径配置
    paths: {
        /* app */
        'App': 'assets/scripts/app',
        'AppConf': 'assets/scripts/app-config',
        'context': 'assets/scripts/context',
        'polling': 'assets/scripts/polling',
        'common-ui': 'assets/scripts/common-ui',

        /* fwk */
        'framework': 'assets/scripts/fwk/framework',
        'jquery.edValidate': 'assets/scripts/fwk/validate.ed',
        'jquery.msgValidate': 'assets/scripts/fwk/validate.message',
        'jquery.disableBackSpaceLeavePage': 'assets/scripts/fwk/jquery.disableBackSpaceLeavePage',

		/* require */
        'tpl': 'assets/scripts/vendor/requirejs/text-0.24.0',
        'i18n': 'assets/scripts/vendor/requirejs/i18n-2.0.4',
        'css': 'assets/scripts/vendor/requirejs/css-0.1.8',

        /* vendor */
        'bootstrap': 'assets/scripts/vendor/bootstrap',
        'bootstrap-tagsinput': 'assets/scripts/vendor/bootstrap-tagsinput',

        'moment.origin': 'assets/scripts/vendor/moment',
        'spin': 'assets/scripts/vendor/spin',
        'spin.jquery': 'assets/scripts/vendor/spin.jquery',
        'typeahead': 'assets/scripts/vendor/typeahead.bundle',
        'fuelux.tree': 'assets/scripts/vendor/fuelux.tree',
        'jquery.scrollTo': 'assets/scripts/vendor/jquery.scrollTo',
        'select2': 'assets/scripts/vendor/select2',
        'bootbox': 'assets/scripts/vendor/bootbox',
        'blockui': 'assets/scripts/vendor/jquery.blockUI',

        'bowser': 'assets/scripts/vendor/bowser',
        'upload': 'assets/scripts/vendor/upload',
        'moment.override': 'assets/scripts/override/moment.override',
        'placeholder': 'assets/scripts/vendor/placeholders.min',
        'simple.storage': 'assets/scripts/vendor/simpleStorage',
        'jstorage': 'assets/scripts/vendor/jstorage',
        
        'echarts': 'assets/scripts/vendor/echarts/echarts.common.min',
        'echarts.macarons': 'assets/scripts/vendor/echarts/theme/macarons',
        'echarts.shine': 'assets/scripts/vendor/echarts/theme/shine',

        'backgrid': 'assets/scripts/vendor/backgrid',
        'backgrid-paginator':  'assets/scripts/vendor/backgrid-paginator',
        'backgrid-filter':  'assets/scripts/vendor/backgrid-filter',
        'backgrid-select-all': 'assets/scripts/vendor/backgrid-select-all',

        /* lib */
        'backbone': 'assets/scripts/vendor/backbone',
        'backbone.syphon': 'assets/scripts/vendor/backbone.syphon',
        'backbone.paginator': 'assets/scripts/vendor/backbone.paginator',
        'marionette': 'assets/scripts/vendor/backbone.marionette',
        'underscore': 'assets/scripts/override/underscore.override',
        'underscore.origin': 'assets/scripts/vendor/underscore',
        'json2': 'assets/scripts/vendor/json2',

        /* jQuery */
        'jquery': 'assets/scripts/vendor/jquery-1.10.2',
        'jquery.override': 'assets/scripts/override/jquery.override',
        'jquery-ui': 'assets/scripts/vendor/jquery-ui-1.10.4.custom',
        'jquery.mobile': 'assets/scripts/vendor/jquery.mobile.custom',
        'jquery.ui.touch-punch': 'assets/scripts/vendor/jquery.ui.touch-punch',//reflect mouse event to touch when in touch device
        'jquery.bootstrap.wizard': 'assets/scripts/vendor/jquery.bootstrap.wizard',
        'jquery.slimscroll': 'assets/scripts/vendor/jquery.slimscroll',
        'jquery.sparkline': 'assets/scripts/vendor/jquery.sparkline',

        'jquery.validate.origin': 'assets/scripts/vendor/jquery.validate',
        'jquery.validate': 'assets/scripts/override/jquery.validate.override',

        'jquery.jqGrid.origin': 'assets/scripts/vendor/jqGrid/jquery.jqGrid',
        'jquery.jqGrid': 'assets/scripts/override/jquery.jqgrid.override',
        'jquery.jqGrid.locale': 'assets/scripts/vendor/jqGrid/i18n/grid.locale-cn',

        'jquery.royalslider': 'assets/scripts/vendor/jquery.royalslider.all',
        'jquery.autosize': 'assets/scripts/vendor/jquery.autosize',
        'jquery.tagsinput': 'assets/scripts/vendor/jquery.tagsinput',
        'jquery.inputmask': 'assets/scripts/vendor/jquery.inputmask.bundle',
        'jquery.scrolltofixed': 'assets/scripts/vendor/jquery-scrolltofixed',

        /* ACE */
        'ace-extra': 'assets/scripts/vendor/ace-extra',
        'ace-elements': 'assets/scripts/vendor/ace-elements',
        'ace': 'assets/scripts/vendor/ace',
        
        /* plugins */
        'layer': 'assets/scripts/plugins/layer-3.0.1/layer',
        'ckeditor': 'assets/scripts/plugins/ckeditor-4.4.5/ckeditor',
        'zTree': 'assets/scripts/plugins/zTree-3.5.26/js/jquery.ztree.all',
        'jstree': 'assets/scripts/plugins/jstree-3.3.3/jstree',
        'jquery.fancybox': 'assets/scripts/plugins/fancyBox-2.1.5/source/jquery.fancybox',
        'bootstrap-datepicker': 'assets/scripts/plugins/bootstrap_v3/datepicker/js/bootstrap-datepicker',
        'bootstrap-datetimepicker': 'assets/scripts/plugins/bootstrap_v3/datetimepicker/js/bootstrap-datetimepicker',

        // invalid
        'bootstrap-daterangepicker': 'assets/scripts/plugins/bootstrap_v3/daterangepicker/js/daterangepicker'
    },

    // i18配置
    config: {
        i18n: {
            locale: 'en-US'
        }
    },

    // 配置模块依赖
    shim: {
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'backbone': {
            deps: ['jquery', 'underscore', 'json2'],
            exports: 'Backbone'
        },
        'backbone.relational': ['backbone'],
        'backbone.syphon': ['backbone'],
        'underscore': ['underscore.origin'],
        'underscore.origin': {exports: '_'},

        'backgrid': {
            desp: ['jquery','backbone','underscore'],
            exports: 'Backgrid'
        },
        'backgrid-paginator': ['backgrid'],
        'backgrid-filter': ['backgrid'],
        'backgrid-select-all': ['backgrid'],

        'jquery-ui': ['jquery'],
        'jquery.ui.touch-punch': ['jquery-ui'],
        'jquery.mobile': ['jquery'],
        'jquery.jqGrid': ['jquery', 'jquery-ui', 'jquery.jqGrid.locale'],
        'jquery.slimscroll': ['jquery'],
        'jquery.sparkline': ['jquery'],
        'jquery.validate': ['jquery'],
        'jquery.edValidate': ['jquery'],
        'jquery.autosize': ['jquery'],
        'jquery.disableBackSpaceLeavePage': ['jquery'],
        'jquery.scrolltofixed': ['jquery'],
        'spin.jquery': ['spin', 'jquery'],

        'mockjax': ['jquery'],
        'fuelux.tree': ['jquery'],
        'jstorage': ['jquery'],
        'placeholder': ['jquery'],
        'typeahead': ['jquery'],

        'bootstrap': ['jquery', 'jquery-ui'],

        // ACE-framework
        'ace': ['bootstrap'],
        'ace-elements': ['ace'],
        'ace-extra': ['ace'],

        // plugins
        'layer': ['jquery', 'css!assets/scripts/plugins/layer-3.0.1/skin/default/layer.css'],
        'zTree': ['jquery', 'css!assets/scripts/plugins/zTree-3.5.26/css/zTreeStyle/zTreeStyle.css'],
        'jstree': ['jquery', 'css!assets/scripts/plugins/jstree-3.3.3/themes/default/style.css'],
        'jquery.fancybox': ['jquery', 'css!assets/scripts/plugins/fancyBox-2.1.5/source/jquery.fancybox.css'],
        'bootstrap-datepicker': ['bootstrap', 'css!assets/scripts/plugins/bootstrap_v3/datepicker/css/bootstrap-datepicker.css'],
        'bootstrap-datetimepicker': ['bootstrap', 'css!assets/scripts/plugins/bootstrap_v3/datetimepicker/css/bootstrap-datetimepicker.css'],

        // invalid
        'bootstrap-daterangepicker': [
            'bootstrap',
            'css!assets/scripts/plugins/bootstrap_v3/daterangepicker/css/daterangepicker.css',
            'css!assets/scripts/plugins/bootstrap_v3/daterangepicker/css/daterangepicker-bs3.css'
        ]
    },

    // 框架回调
    callback: function() {
        require(['App'], function(App) {
            $("#loading-wrap").remove();
            $("#main-container").show();
            App.start(); //开启APP
        });
    }
});
