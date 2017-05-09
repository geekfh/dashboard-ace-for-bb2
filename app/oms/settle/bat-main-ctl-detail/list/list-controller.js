/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的批处理主控任务
define(['App', 'app/oms/settle/bat-main-ctl-detail/list/list-view'], function(App, AbstratView) {

    var ViewT0 = AbstratView.extend({
        tabId: 'menu.t0.bat.main.ctl.detail',
        serializeData: function () {
            return {data: {gridId: 'bat-main-ctl-details-grid-t0'}};
        },

        onRender: function() {
            var me = this;

            setTimeout(function() {

                var grid = me.renderGrid();

                if ( !Ctx.avail('batMainCtlDetail.t0.startRun') ) {
                    return;
                }

                var $extraBtn = $('<div class="grid-extra-btn">开始运行</div>');
                $('#' + grid.attr('id') + '_toppager_right').empty().append($extraBtn);

                $extraBtn.on('click', function() {
                    if($extraBtn.hasClass('grid-extra-btn-disable')) {
                        return;
                    }

                    $extraBtn.addClass('grid-extra-btn-disable').text('正在运行...');
                    $.ajax({
                        type: 'GET',
                        url: url._('batMain.TZero'), // 'api/settle/bat-main-ctl-details/batMainTZero'
                        success: function(resp) {
                            grid.trigger('reloadGrid', [{page:1}]);
                            me.onClickButton(grid, resp.data);
                        },
                        complete: function() {
                            $extraBtn.removeClass('grid-extra-btn-disable').text('开始运行');

                        }
                    });
                });

            },1);
        },
        
        gridOptions: function (defaultOptions) {
            return $.extend(defaultOptions, {
                // TODO
                rsId:'batMainCtlDetail.t0',
                // caption: settleLang._('settleControl.txt'),
                gid: 'bat-main-ctl-details-grid-t0',
                url: url._('bat.main.zero'), // 'api/settle/bat-main-ctl-details/search-zero'
                tableCenterTitle: 'T+0 主控任务表'

            });
        }
    });

    var ViewT1 = AbstratView.extend({
        tabId: 'menu.bat.main.ctl.detail',
        
        gridOptions: function (defaultOptions) {
            return $.extend(defaultOptions, {
                // TODO
                tableCenterTitle: 'T+1 主控任务表',
                responsiveOptions: {
                    hidden: {
                        ss: ['nodeTime', 'priority'],
                        xs: ['nodeTime', 'priority'],
                        sm: ['nodeTime'],
                        md: ['nodeTime'],
                        ld: ['nodeTime']
                    }
                }
            });
        }
    });
    var ViewTC = AbstratView.extend({
        tabId: 'menu.tc.bat.main.ctl.detail',
        serializeData: function () {
            return {data: {gridId: 'bat-main-ctl-details-grid-tc'}};
        },
        gridOptions: function (defaultOptions) {
            return $.extend(true,{},defaultOptions, {
                // TODO
                rsId:'batMainCtlDetail.tc',
                // caption: settleLang._('settleControl.txt'),
                gid: 'bat-main-ctl-details-grid-tc',
                url: url._('bat.main.one'), // 'api/settle/bat-main-ctl-details/search-zero'
                tableCenterTitle: 'T+C 主控任务表',
                responsiveOptions: {
                    hidden: {
                        ss: ['nodeTime', 'priority'],
                        xs: ['nodeTime', 'priority'],
                        sm: ['nodeTime'],
                        md: ['nodeTime'],
                        ld: ['nodeTime']
                    }
                }

            });
        }
    });
	var Controller = Marionette.Controller.extend({
	
		listBatMainCtlDetails: function() {
			App.show(new ViewT1());

		}, 

        listT0BatMainCtlDetails: function () {
            App.show(new ViewT0());
        },

        listTCBatMainCtlDetails: function () {
            App.show(new ViewTC());
        }
	});

	var ctrl = new Controller();

    App.on('batMainCtlDetails:list', function() {
    	console.log('监听到 App触发的"batMainCtlDetails:list"事件, 触发清分清算下的批处理主控任务');
        ctrl.listBatMainCtlDetails();
    });

    App.on('batMainCtlDetails:t0:list', function() {
        console.log('监听到 App触发的"batMainCtlDetails:list"事件, 触发清分清算下的批处理主控任务');
        ctrl.listT0BatMainCtlDetails();
    });

    App.on('batMainCtlDetails:tc:list', function() {
        console.log('监听到 App触发的"batMainCtlDetails:list"事件, 触发清分清算下的批处理主控任务');
        ctrl.listTCBatMainCtlDetails();
    });

    return ctrl;
});