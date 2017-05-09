define([
    'App',
    'app/oms/wkb/wkb-sys-app',
    'app/oms/wkb/task/task-app',
    'app/oms/collection/PageableTasks'
], function(App, WkbSysApp, TaskApp, PageableTasks) {

    var tasks = new PageableTasks();
    var Controller = {
            _attachViewEvent: function () {
                var me = this;

                me.view.on('first:page', function () { tasks.getFirstPage(); });
                me.view.on('last:page', function () { tasks.getLastPage(); });
                me.view.on('previous:page', function () { tasks.getPreviousPage(); });
                me.view.on('next:page', function () { tasks.getNextPage(); });

                //刷新当前页面
                me.view.on('refresh:page', function () {
                    // var state = $.extend({}, tasks.state);
                    // var currentPage = state.currentPage || 0;

                    // 承启提的需求：如果刷新，则回到第一页。
                    tasks.getPage(0, {reset: true});
                });

                //改变每页显示数
                me.view.on('change:size', function (e) {
                    var state = $.extend({}, tasks.state);

                    var newSize = parseInt($(e.target).val(), 10);

                    //更新最新每页显示数
                    tasks.applyState({pageSize: newSize});

                    //确定要显示到第几页，保证变化前的第一条记录要出现新的页面
                    //有数据的时候才需要重新获取页数
                    if(state.totalElements != 0) {
                        var firstRowNoInCurPage = (state.currentPage) * state.pageSize + 1;//>=1
                        var newNumber = Math.ceil(firstRowNoInCurPage / newSize) - 1;//>=0

                        tasks.getPage(parseInt(newNumber, 10), {
                            reset: true
                        });
                    }
                });

                //切换目录
                me.view.on('task:switch:category', function (typeVal) {

                    console.log('>>>>task ctrl refresh', typeVal);


                    //每次切换目录，更新目录类型参数，然后重置分页(取第一页)
                    tasks.applyTaskCategory(typeVal).getFirstPage({
                        reset: true
                    });

                });

                //搜索
                me.view.on('search', function (param) {
                    tasks.applyKeyWord(param.kw).getFirstPage({
                        reset: true
                    });
                });

                //取消搜索
                me.view.on('revokeSearch', function (param) {

                    var lastTaskStatus = me.view.getTaskStatus();

                    console.log('>>> ctrl revokeSearch get type from view:', lastTaskStatus);

                    tasks.applyTaskCategory(me.view.getTaskStatus()).getFirstPage({
                        reset: true
                    });
                });

                //点击某行
                me.view.on('childview:enter', function (itemView, argsObj) {
                    console.log('>>>itemview enter', argsObj);

                    var model = itemView.model;
                    var type = parseInt(model.get('type'), 10);
                    var subType = parseInt(model.get('subType'), 10);
                    var status = parseInt(model.get('status'), 10);
                    var classify = me.view.getClassify();

                    //TODO 没考虑进度状态
                    //classify 5-参与过 2-待完成 1-待领取
                    //type 101-新增机构
                    //     102-新增商户
                    //     103-新增用户
                    //     104-新增直销拓展员
                    //     105-开放注册
                    //     106-新增外卡商户
                    //     108-新增商户(总店)
                    //     110-新增商户(门店)
                    //     ……
                    //     201-修改机构信息
                    //     202-修改商户信息
                    //     203-修改用户信息
                    //     204-修改终端信息
                    //     206-实名认证审核
                    //     207-商户补充资料审核
                    //     ……
                    //     301-申请生产终端
                    //     302-申领终端
                    //     303-申购终端
                    //     304-申请提额
                    //     305-新增直销拓展员-新
                    //     ……
                    //     306-盒伙人对私转对公
                    //     ……
                    //status:
                    // 0-新任务待确认提交(保存)
                    // 1－任务提交待处理(未领取)
                    // 2－任务已分配待处理(已领取)
                    // 3－待修改
                    // 4—任务结束（删除）
                    // 5—任务结束（成功）
                   
                    var nowOprId = model.get('nowOprId');
                    var beginOprId = model.get('beginOprId');
                    var curUserId= Ctx.getUser().get('id');

                    if(subType == 101){
                        if(status == 0 && nowOprId && beginOprId && nowOprId == beginOprId && beginOprId == curUserId) {
                            //机构保存
                            me.appendItemView({
                                _case: 1,
                                model: model,
                                view: 'app/oms/auth/org/save-edit/save-edit-view',
                                url: url._('task.revise', {id: model.id})
                            });
                        }
                        else if(status == 3 && isEditableRejectedNewTask(model)) {
                            //机构修订
                            me.appendItemView({
                                _case: 2,
                                model: model,
                                view: 'app/oms/wkb/branch-task/revise/revise-view',
                                url: url._('task.revise', {id: model.id})
                            });
                        }
                        else if(status == 2 && canIPerform(model)) {
                            //机构审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/branch-task/perform/perform-brh-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                        else if(status == 4){
                            //机构删除
                            me.appendItemView({
                                _case: 4,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-delete-view',
                                url: url._('task.history', {id: model.id})
                            });
                        }
                        else {
                            //其他
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/branch-task/show/show-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }

                    }
                    else if(subType == 102 || subType == 108 || subType == 110){
                        if(status == 0 && nowOprId && beginOprId && nowOprId == beginOprId && beginOprId == curUserId) {
                            me.appendItemView({
                                _case: 1,
                                model: model,
                                view: 'app/oms/mcht/edit/edit-view',
                                url: url._('task.revise', {id: model.id})
                            });

                        } else if(status == 3 && isEditableRejectedNewTask(model)) {
                            me.appendItemView({
                                _case: 2,
                                model: model,
                                view: 'app/oms/wkb/task/revise/revise-view',
                                url: url._('task.revise', {id: model.id})
                            });
                        }
                        else if(status == 2 && canIPerform(model)) {
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/task/perform/perform-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                        else if(status == 4){
                            me.appendItemView({
                                _case: 4,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-delete-view',
                                url: url._('task.history', {id: model.id})
                            });
                        }
                        else {
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                    else if(subType == 103){
                        if(status == 0 && nowOprId && beginOprId && nowOprId == beginOprId && beginOprId == curUserId) {
                            //这是保存
                            me.appendItemView({
                                _case: 1,
                                model: model,
                                view: 'app/oms/auth/user/save-edit/save-edit-view',
                                url: url._('task.revise', {id: model.id})
                            });
                        } else if(status == 3 && isEditableRejectedNewTask(model)) {
                            //操作员修订
                            me.appendItemView({
                                _case: 2,
                                model: model,
                                view: 'app/oms/auth/user/task/revise-view',
                                url: url._('task.revise', {id: model.id})
                            });
                        }
                        else if(status == 2 && canIPerform(model)) {
                            //操作员审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/auth/user/task/perform-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                        else if(status == 4){
                            //操作员删除
                            me.appendItemView({
                                _case: 4,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-delete-view',
                                url: url._('task.history', {id: model.id})
                            });
                        }
                        else {
                            //其他（查看详情）
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/auth/user/task/show-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                    else if(subType == 104 || subType == 305){
                        if(status == 2 && canIPerform(model)) {
                            //机构审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/auth/user/task/perform-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                        else if(status == 3 && isEditableRejectedNewTask(model)) {
                            //操作员修订
                            me.appendItemView({
                                _case: 2,
                                model: model,
                                view: 'app/oms/auth/user/task/revise-view',
                                url: url._('task.revise', {id: model.id})
                            });
                        }
                        else if(status == 4){
                            //操作员删除
                            me.appendItemView({
                                _case: 4,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-delete-view',
                                url: url._('task.history', {id: model.id})
                            });
                        }
                        else {
                            //其他（查看详情）
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/auth/user/task/show-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                    else if(subType == 105){//开放注册新增
                        if(status == 0 && nowOprId && beginOprId && nowOprId == beginOprId && beginOprId == curUserId) {
                            me.appendItemView({
                                _case: 1,
                                model: model,
                                view: 'app/oms/mcht/edit/edit-view',
                                url: url._('task.revise', {id: model.id})
                            });

                        } else if(status == 3 && isEditableRejectedNewTask(model)) {
                            me.appendItemView({
                                _case: 2,
                                model: model,
                                view: 'app/oms/wkb/task/revise/revise-view',
                                url: url._('task.revise', {id: model.id})
                            });
                        }
                        else if(status == 2 && canIPerform(model)) {
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/task/perform/perform-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                        else if(status == 4){
                            me.appendItemView({
                                _case: 4,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-delete-view',
                                url: url._('task.history', {id: model.id})
                            });
                        }
                        else {
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                    else if(subType == 106){
                        if(status == 2 && canIPerform(model)) {
                            //外卡商户审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/task/perform/perform-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                        else if(status == 4){
                            //外卡商户删除
                            me.appendItemView({
                                _case: 4,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-delete-view',
                                url: url._('task.history', {id: model.id})
                            });
                        }
                        else {
                            //其他情况
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                    else if(subType == 205){
                        if(status == 2 && canIPerform(model)){
                            //银行卡号审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/bankno-task/perform/bankno-perform',
                                url: url._('task.target', {id: model.id})
                            });
                        } else {
                            // 修改银行卡号（查看详情）
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/bankno-task/perform/bankno-show',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                    else if(subType == 206){
                        if(status == 2 && canIPerform(model)){
                            //实名认证审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/certification-task/perform/perform',
                                url: url._('task.target', {id: model.id})
                            });
                        } else {
                            // 实名认证审核（查看详情）
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/certification-task/perform/show',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                    else if(subType == 207){
                        if(status == 2 && canIPerform(model)){
                            // 商户补充资料审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/extraInfo-task/perform/perform',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                        else {
                            // 商户补充资料审核(查看详情)
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/extraInfo-task/perform/show',
                                url: url._('task.target', {id: model.id})
                                
                            });
                        }

                    }
                    else if(subType == 208){
                        if(status == 2 && canIPerform(model)){
                            // 直销人员补充资料审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/auth/user/furtherInfo-task/perform-view',
                                url: url._('task.target', {id: model.id})

                            });
                        }else{
                            // 直销人员补充资料审核(查看详情)
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/auth/user/furtherInfo-task/show-view',
                                url: url._('task.target', {id: model.id})

                            });
                        }

                    }
                    else if(subType == 209){
                        if(status == 2 && canIPerform(model)){
                            // 开放注册用户补充资料审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/extraInfo-open-task/perform/perform',
                                url: url._('task.target', {id: model.id})

                            });
                        }else{
                            // 开放注册用户补充资料审核(查看详情)
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/extraInfo-open-task/perform/show',
                                url: url._('task.target', {id: model.id})

                            });
                        }
                    }
                    else if(subType == 304){
                        if(status == 2 && canIPerform(model)){
                            //T+0提额审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/wkb/T0-task/perform/T0-perform',
                                url: url._('task.target', {id: model.id})
                            });
                        } else {
                            // T+0提额审核（查看详情）
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/wkb/T0-task/perform/T0-show',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                    else if(subType == 306){
                        if(status == 2 && canIPerform(model)) {
                            //机构审核
                            me.appendItemView({
                                _case: 3,
                                model: model,
                                view: 'app/oms/auth/user/task/perform-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                        else if(status == 3 && isEditableRejectedNewTask(model)) {
                            //操作员修订
                            me.appendItemView({
                                _case: 2,
                                model: model,
                                view: 'app/oms/auth/user/task/revise-view',
                                url: url._('task.revise', {id: model.id})
                            });
                        }
                        else if(status == 4){
                            //操作员删除
                            me.appendItemView({
                                _case: 4,
                                model: model,
                                view: 'app/oms/wkb/task/show/show-delete-view',
                                url: url._('task.history', {id: model.id})
                            });
                        }
                        else {
                            //其他（查看详情）
                            me.appendItemView({
                                _case: 5,
                                model: model,
                                view: 'app/oms/auth/user/task/show-view',
                                url: url._('task.target', {id: model.id})
                            });
                        }
                    }
                });
            },

            listTasks: function(kw) {

                var me = this;

                require(['app/oms/wkb/task/list/list-view' /*,'entities/task'*/ ], function(View) {

                    console.info('new view tasks');

                    var tasksView = me.view = new View.Tasks({
                        collection: tasks
                    });
                    
                    me._attachViewEvent();

                    App.show(tasksView);

                });

            }, //@listTasks

            appendItemView: function(options){
                var me = this;
                var _case = options._case;
                var model = options.model;
                var view = options.view;
                var url = options.url;

                require([view], function (itemView) {
                    // Opf.UI.setLoading($('#page-body'));
                    // App.maskCurTab();
                    Opf.ajax({
                        url: url,
                        success: function (data) {
                            var view;
                            switch(_case){
                                case 1 : view = new itemView(data.target, model.id); break;
                                case 2 : view = new itemView(data, model.toJSON()); break;
                                default: view = new itemView({
                                    data: data,
                                    taskModel:model,
                                    tasks: tasks
                                });
                            }
                            // view.render();
                            // $('.tasks-board').hide();
                            // App.getCurTabPaneEl().append(view.$el);
                            
                            var tabId = App.canRepeatShow(view, {tabName: '子任务'}).id;

                            //将图片缩略图按照正常比例调整
                            fitImages(view);
                            view.tasks = tasks;

                            view.$el.find('.js-back').hide();

                            view.on('back', function(){
                                // $('.tasks-board').show();
                                // var currentPage = tasks.state.currentPage;
                                // tasks.getPage(parseInt(currentPage, 10), {reset: true});
                                
                                App.closeTabViewById(tabId);

                                // 如果返回，则刷新列表
                                tasks.getPage(0, {reset: true});

                            });

                            view.on("showMoreTerminals", function(){
                                var containerHtml = "<div class='more-terminals-dialog'></div>",
                                    $moreTerminalsDialog = Opf.Factory.createDialog(containerHtml,{
                                        destroyOnClose: true,
                                        title: '终端列表',
                                        autoOpen: true,
                                        modal: true,
                                        width: 335,
                                        height: 370
                                    });

                                //实例化 pagebleView
                                require(['app/oms/collection/PageableTerminals','app/oms/wkb/task/show/show-more-terminals-view', 'url'],function(Terminals,TerminalsView, url){ //因为上面刚好有同名 url 参数，覆盖了 url._ 方法，所以再次 require 进来

                                    var url = url._('merchant.more.pos', {merchantId:data.mcht.mchtNo}),
                                        //在实例化 collection 时传递动态参数，参看源代码，形式为 new Collection(models,options)
                                        terminals = new Terminals([],{url:url}),
                                        terminalsView = new TerminalsView({collection: terminals});

                                    

                                    terminalsView.on('get:first:page', function () { terminals.getFirstPage(); });
                                    terminalsView.on('previous:btn:click', function () { terminals.getPreviousPage(); });
                                    terminalsView.on('next:btn:click', function () { terminals.getNextPage(); });

                                    terminalsView.render();

                                    $moreTerminalsDialog.empty().append(terminalsView.$el);

                                });
                                
                            });

                            // Opf.UI.setLoading($('#page-body'),false);
                            // App.unMaskCurTab();
                        }
                    });

                });
            }

        };


    //操作人==当前用户 && 发起人 !== 当前用户， 才能执行(审核)任务
    function canIPerform (model) {
        var nowOprId = model.get('nowOprId');
        var beginOprId = model.get('beginOprId');
        var curUserId= Ctx.getUser().get('id');

        if(nowOprId && beginOprId && nowOprId == curUserId && beginOprId !== curUserId) {
            return true;
        }
        return false;
    }

    // 操作人==发起人==当前用户，则是被拒绝打回,并且可操作
    function isEditableRejectedNewTask (model) {
        var nowOprId = model.get('nowOprId');
        var beginOprId = model.get('beginOprId');
        var curUserId= Ctx.getUser().get('id');

        if(nowOprId && beginOprId && nowOprId == beginOprId && beginOprId == curUserId) {
            return true;
        }
        return false;
        // if(model.get('nowOpr') && model.get('beginOpr'))
    }

    //调整图片大小为正常比例
    function fitImages (view) {
        var $imgWrapArray = view.$el.find('.img-wrap');
        if($imgWrapArray.length){
            $imgWrapArray.each(function () {
                var $imgWrap = $(this);
                Opf.Util.autoFitImg({
                    img: $imgWrap.find('img'),
                    constrain: $imgWrap.find('.img-inner-wrap')
                });
            });
        }
    }

    return Controller;


});