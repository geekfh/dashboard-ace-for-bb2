define(['App',
  'tpl!app/oms/auth/user/task/templates/show.tpl',
  'app/oms/auth/user/show/show-info-view',
  'app/oms/wkb/branch-task/show/history-view',
  'common-ui',
  'moment.override'
], function(App, tpl, ShowInfoView, HistoryView) {

    var View = Marionette.ItemView.extend({
        className: 'show-task user-show',
        template: tpl,

        events: {
            'click .js-task-info' : 'popTaskInfo',
            'click .js-back'      : 'goback',
            'click .js-take' : 'requestTakeTask',
            'click .takeback': 'takeTaskBack'
        },

        ui: {
            btnTake:   '.js-take'
        },

        initialize: function (options) {
            var data = options.data;

            this.userInfo = data.userInfo;
            this.taskInfo = data.taskInfo;
            this.taskId = data.taskId;

            if(options.data.taskSubType != null){
                this.userInfo['taskSubType'] = options.data.taskSubType;
            }
            else{
                this.taskModel = options.taskModel;
            }
            this.tasks = options.tasks;
        },

        onRender: function () {
            var me = this;

            var showInfoView = new ShowInfoView({data: me.userInfo, taskModel: me.taskModel});
            showInfoView.render();

            me.$el.find('.info-board-wrap').html(showInfoView.$el);
            me.checkCanITake();
            me.checkCanITakeTaskBack();

            $(document.body).click(function(e) {
                if(me.$history && me.$history.is(':visible') && 
                    (!$(e.target).closest('.history-wrapper').length)) {

                    me.$history.hide();
                    console.log($(e.target).attr('class'));
                }
            });
        },

        requestTakeTask: function () {
            var me = this;
            Opf.UI.busyText(me.ui.btnTake);
            Opf.ajax({
                url: url._('task.take.by.id', {id: me.taskModel.id}),
                type: 'PUT',
                success: function (resp) {
                    me.taskModel.set('status', 2);//更改成已领取状态
                    // Opf.UI.setLoading($('#page-body'));
                    App.maskCurTab();
                    Opf.ajax({
                        url: url._('task.target', {id: me.taskModel.id}),
                        success: function (data) {
                            // 切换到 performView 界面
                            me.goToPerformView(data);
                            // Opf.UI.setLoading($('#page-body'), false);
                            App.unMaskCurTab();
                        }
                    });

                },
                complete: function () {
                    Opf.UI.busyText(me.ui.btnTake, false);
                }
            });
        },
        getPerformViewUrl: function(){
          return ['app/oms/auth/user/task/perform-view'];
        },
        goToPerformView: function (data) {
            var me = this;

            require(this.getPerformViewUrl(), function (PerformView) {
                var performView = new PerformView({
                    data: data,
                    taskModel: me.taskModel,
                    tasks: me.tasks
                });

                performView.render();
                me.$el.remove();

                App.getCurTabPaneEl().append(performView.$el);

                performView.$el.find('.js-back').hide();

                performView.on('back', function(){
                    $('.tasks-board').show();
                    // var currentPage = performView.tasks.state.currentPage;
                    performView.tasks.getPage(0, {reset: true});
                });
            });
        },

        checkCanITake: function () {
            var me = this;
            if(this.taskModel && this.taskModel.get('status') == 1) {
                Opf.ajax({
                    url: url._('task.canitake', {id: this.taskModel.id}),
                    success: function (resp) {
                        if(resp && resp.canTake) {
                            me.ui.btnTake.show();
                        }
                    }
                });
            }
        }, 

        checkCanITakeTaskBack: function () {
            var me = this;
            var userId = Ctx.getUser().get('id');
            var beginOprId = me.taskInfo.beginOprId;
            var status = me.taskInfo.status;

            var $takeback = me.$el.find('.takeback');
            var $notAllowTake = me.$el.find('.not-allow-takeback');
            var $toolTips = me.$el.find('.not-allow-toolTips');

            //当前任务如果进入了审核一状态则说明该任务已经审核过一次，不能取回
            var canNotTakeBackFlag = _.findWhere(me.taskInfo.taskDetails, {oprType:'21'});
            //一旦一审通过后就不能点击取回任务按钮
            console.log('canNotTakeBackFlag', canNotTakeBackFlag);
            if(userId === beginOprId){ //当操作人为发起人时有取回按钮
                /**
                 * status 标识
                 * 0-新任务待确认提交(保存)
                 * 1－任务提交待处理(未领取)
                 * 2－任务已分配待处理(已领取)
                 * 3－待修改
                 * 4—任务结束（删除）
                 * 5—任务结束（成功）
                 */
                if((status == '1' && canNotTakeBackFlag) || status == '2'){
                    //当前任务处于未领取状态并且不可取回 || 任务已被领取 时不能取回任务
                    //显示不可取回按钮
                    $notAllowTake.show();
                    $notAllowTake.on('mouseover', function(){
                        $toolTips.show();
                    });

                    $notAllowTake.on('mouseout', function(){
                        $toolTips.hide();
                    });
                }else if(status == '1' && !canNotTakeBackFlag){
                    //显示可取回按钮
                    $takeback.show();
                }
            }
        },

        popTaskInfo: function () {
            var me = this;
            setTimeout(function(){
                if(me.$history){
                    me.$history.show();
                }else{
                    me.doPopTaskInfo();
                }
            }, 10);
        }, 

        doPopTaskInfo: function () {
            var me = this;

            var $historyTrigger = me.$el.find('.history-trigger');
            var userTaskInfo = $.extend(me.taskInfo, {type: 'user'});
            var historyView = new HistoryView(userTaskInfo).render();

            me.$history = historyView.$el;
            $historyTrigger.append(me.$history);
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        },

        takeTaskBack: function () {
            // Opf.UI.busyText($('.page-body'));
            App.maskCurTab();
            var me = this;
            var taskId = me.taskId;
            Opf.ajax({
                type: 'PUT',
                url: url._('task.takeback', {id: taskId}),
                success: function () {
                    Opf.Toast.success('操作成功');
                    me.goback();
                },error: function () {
                    // 后台已做处理
                    // Opf.alert('工作人员已经开始处理，不能进行操作！');
                },
                complete: function () {
                    // Opf.UI.busyText($('.page-body'), false);
                    App.unMaskCurTab();
                }
            });
        }

    });


  return View;

});