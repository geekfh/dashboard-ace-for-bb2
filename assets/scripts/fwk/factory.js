define(['underscore', //
		'assets/scripts/fwk/factory/jqgrid.factory',
        'assets/scripts/fwk/factory/dialog.factory'
	], //
	function(_, jqGridFactory, dialogFactory) {

		var Factory = {};

        _.merge(Factory, jqGridFactory);
		_.merge(Factory, dialogFactory);

		return Factory;
	});