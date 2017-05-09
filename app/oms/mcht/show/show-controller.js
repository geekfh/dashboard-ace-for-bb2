define(['App',
'app/oms/wkb/task/show/show-mcht-info-view'
], function(App, ShowMchtView) {

	App.module('MchtSysApp.List', function(List, App, Backbone, Marionette, $, _) {

		List.Controller = {

			showMcht: function(id) {

                console.log('>>>ctrl showMcht 商户列表详情', id);
				// Opf.UI.setLoading($('#page-body'));
                App.maskCurTab();
				Opf.ajax({
					url: url._('merchant.show', {id: id}),
					success: function (resp) {
                        //这个是为了做三证合一做的的，用一个固定变量来判断这个是商户列表详情点击的
                        resp.certFlagInfo = { val: 'showMcht' };
						var view = new ShowMchtView({
                          	data: resp
                        }).render();

                        view.on('imgDialog.open', function (imgDialog) {
                            $(imgDialog).find('.img-error').hide();
                        });

                        var isWildcard = !!(resp&&resp.interMcht);
                        var windWidth = $(window).width();
                        var dlgWidth = windWidth>1400? windWidth*0.9:windWidth*0.96;
                        Opf.Factory.createTheDialog({
                            title: '商户资料',
                            cls: 'mcht-detail-dialog',
                            zindex: 6000,
                            maxWidth: isWildcard? dlgWidth:1200,
                            paddingLayer: true,
                            paddingLayerCls: 'mcht-detail-view-pad-layer',
                            modal: true,
                            autoshow: true,
                            contentEl: view.$el
                        });

						// Opf.UI.setLoading($('#page-body'), false);

					},
                    complete: function () {
                        App.unMaskCurTab();
                    }
				});

			}, //@showMcht

			showMchtPufa: function(id) {
				
				console.log('>>>ctrl showMcht', id);
				// Opf.UI.setLoading($('#page-body'));
                App.maskCurTab();
				Opf.ajax({
					url: url._('merchant.show.pufa', {id: id}),
					success: function (resp) {
						var view = new ShowMchtView({
                          	data: resp
                        }).render();

                        view.on('imgDialog.open', function (imgDialog) {
                            $(imgDialog).find('.img-error').hide();
                        });

                        Opf.Factory.createTheDialog({
                            title: '商户资料',
                            cls: 'mcht-detail-dialog',
                            zindex: 6000,
                            maxWidth: 1200,
                            paddingLayer: true,
                            paddingLayerCls: 'mcht-detail-view-pad-layer',
                            modal: true,
                            autoshow: true,
                            contentEl: view.$el
                        });

						// Opf.UI.setLoading($('#page-body'), false);
					},
                    complete: function () {
                        App.unMaskCurTab();
                    }
				});

			},

            showMchtUser2: function(id) {

                console.log('>>>ctrl showMchtUser2', id);
                // Opf.UI.setLoading($('#page-body'));
                App.maskCurTab();
                Opf.ajax({
                    url: url._('merchant.user2.show', {id: id}),
                    success: function (resp) {
                        var view = new ShowMchtView({
                            data: resp
                        }).render();

                        view.on('imgDialog.open', function (imgDialog) {
                            $(imgDialog).find('.img-error').hide();
                        });

                        Opf.Factory.createTheDialog({
                            title: '商户资料',
                            cls: 'mcht-detail-dialog',
                            zindex: 6000,
                            maxWidth: 1200,
                            paddingLayer: true,
                            paddingLayerCls: 'mcht-detail-view-pad-layer',
                            modal: true,
                            autoshow: true,
                            contentEl: view.$el
                        });

                        // Opf.UI.setLoading($('#page-body'), false);
                    },
                    complete: function () {
                        App.unMaskCurTab();
                    }
                });

            }

		};

	});
	return App.MchtSysApp.List.Controller;
});