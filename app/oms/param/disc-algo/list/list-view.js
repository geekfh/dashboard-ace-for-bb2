
define(['App',
	'tpl!app/oms/param/disc-algo/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/param',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang) {

	var CARDTYPE_MAP={
		'0':paramLang._('disc-algo.card.type.0'),
		'1':paramLang._('disc-algo.card.type.1'),
		'2':paramLang._('disc-algo.card.type.2'),
		'3':paramLang._('disc-algo.card.type.3'),
		'4':paramLang._('disc-algo.card.type.4')
	};

	var FLAG_MAP = {
		'1':paramLang._('disc-algo.flag.1'),
		'2':paramLang._('disc-algo.flag.2'),
		'3':paramLang._('disc-algo.flag.3'),
		'4':paramLang._('disc-algo.flag.4'),
		'5':paramLang._('disc-algo.flag.5'),
		'6':paramLang._('disc-algo.flag.6'),
		'7':paramLang._('disc-algo.flag.7')

	};

	App.module('ParamSysApp.DiscAlgo.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.DiscAlgos = Marionette.ItemView.extend({
			template: tableCtTpl,

			events: {

			},

			onRender: function() {
				var me = this;

				setTimeout(function() {

					me.renderGrid();

				},1);
			},

			renderGrid: function() {

				var roleGird = App.Factory.createJqGrid({
					rsId:'discalgo',
					caption: paramLang._('disc-algo.txt'),
					nav: {
					},
					gid: 'disc-algos-grid',//innerly get corresponding ct '#disc-algos-grid-table' '#disc-algos-grid-pager'
					url: url._('disc-algo'),
					colNames: [
						paramLang._('id'),
						paramLang._('code'),
						paramLang._('disc-algo.min.fee'),
						paramLang._('disc-algo.max.fee'),
						paramLang._('disc-algo.floor.amount'),
						paramLang._('disc-algo.upper.amount'),
						paramLang._('disc-algo.flag'),
						paramLang._('disc-algo.fee.value'),
						paramLang._('disc-algo.card.type')
					],


					responsiveOptions: {
						hidden: {
							ss: ['flag','feeValue','cardType'],
							xs: ['feeValue','cardType'],
							sm: ['cardType'],
							md: [],
							ld: []
						}
					},

					colModel: [
						{name:          'id', index:          'id', editable: false, hidden: true},
						{name:      'code', index:      'code', editable: true},
						{name:      'minFee', index:      'minFee', editable: true},
						{name:      'maxFee', index:      'maxFee', editable: true},
						{name: 'floorAmount', index: 'floorAmount', editable: true},
						{name: 'upperAmount', index: 'upperAmount', editable: true},
						{name:        'flag', index:        'flag', editable: true,formatter: flagFormatter},
						{name:    'feeValue', index:    'feeValue', editable: true},
						{name:    'cardType', index:    'cardType', editable: true,formatter: cardTypeFormatter}
					],

					loadComplete: function() {}
				});

			}

		});

	});
	
	function cardTypeFormatter(val){
		return CARDTYPE_MAP[val];
	}

	function flagFormatter(val){
		if(FLAG_MAP[val]) {
			return FLAG_MAP[val];
		}
		else return '其他';
	}


	return App.ParamSysApp.DiscAlgo.List.View;

});