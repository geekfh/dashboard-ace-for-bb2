/**
 * Created by wupeiying on 2015/8/12.
 */
define(['App',
    'tpl!app/oms/wkb/mcht-task/templates/row.tpl',
    'tpl!app/oms/wkb/mcht-task/templates/list.tpl',
    'i18n!app/oms/common/nls/wkb',
    'app/oms/wkb/task/list/pager',
    'app/oms/wkb/common'
], function(App, rowTpl, listTpl, wkbLang, PagerView, wkbCommon) {

    var View = {};

    View.Task = Marionette.ItemView.extend({
        tagName: 'tr',
        className: 'task-row wkb-status-style',
        template: rowTpl,
        triggers: {
            'click': 'enter'
        },
        serializeData: function() {
            var data = Marionette.ItemView.prototype.serializeData.call(this);
            var type = wkbCommon.MAP[data.subType];

            //任务类型是“商户补充资料、修改银行卡、申请提额”时，发起人列固定显示“钱盒商户”
            if(data.subType=='205'||data.subType=='207'||data.subType=='304'){
                data.beginOpr = '钱盒商户';
            }

            data.typeIcon = type ? type.icon : 'icon-question';
            data.typeDescr = type ? type.typeTxt : '未知类型';
            data.isPriority = data && data.isPriority==0 ?
                '<i class="icon icon-wkb-card" title="优先卡，优先审"></i>'
                : "";
            data.statusFormat = statusFormat;
            return data;
        }
    });

    /**
     处于审核阶段的时候，需要依据当前处于第n审来判断
     其他情况就直接使用status
     status为
     */
    function statusFormat() {
        var labelWithStatus = {'0':'保存', '3':'拒绝', '4':'删除', '5':'成功'};
        var labelWithNowStep = {'1':'一审', '2':'二审', '3':'三审'};
        return labelWithStatus[this.status] || labelWithNowStep[this.nowStep] || '';
    }

    View.Tasks = Marionette.CompositeView.extend({
        tabId: 'menu.wkb.task.mcht',
        className: 'tasks-board',
        template: listTpl,
        childView: View.Task,
        childViewContainer: ".list",
        ui: {
            verifyonlines: '.bt-verifyonlines',//签到/签退
            refreshList: '.bt-refresh-list'//手动刷新
        },
        events: {
            //'click .revoke-trigger': 'restoreFromSearch',
            'click .btn-get-task': 'onGetTask',//领取任务按钮
            'click .refresh-btn': 'refreshTasks',
            'click .bt-verifyonlines': 'onVerifyOnlines'
        },

        initialize: function () {
            var me = this;
            this.collection.on({
                request: function() {
                    me.busyTable(true);
                },
                sync: function() {
                    me.busyTable(false);
                }
            });
        },

        onVerifyOnlines: function(e){
            var me = this;
            var $el = this.$el;
            var $btn = $(e.target);
            var onlinesVal = me.$el.find('.bt-verifyonlines').val();
            var $dd = this.$el.find('.dropdown');
            Opf.ajax({
                url: url._('task.mcht.status.save'),
                jsonData:{ oprId: Ctx.getUser().get('id'), oprStatus: onlinesVal },
                method: 'POST',
                success: function (resp) {
                    if(resp.success){
                        Opf.Toast.info('操作成功');
                        loadMchtOnline(me);//$el

                        // 自动隐藏，有权限才能显示，因为公用模块，只能商审能看到
                        //var first = 10;//默认设置10S
                        if(me.$el.find('.bt_i_verifyonlines').html() == '签到'){
                            //countDown(me, $el, first);
                            stopCountDown($el);
                        }
                    }
                    else{
                        Opf.Toast.info('操作失败');
                    }
                }
            });
        },

        onGetTask: _.debounce(function (e) {
            var me = this;
            var $btn = $(e.target);
            var $taskNumberSelect = me.$el.find('.task-amount');
            var subType = me.$el.find('.task-subtype').val();
            if(subType === '0'){
                Opf.alert('请选择任务类型！');
                return;
            }
            Opf.UI.busyText($btn, true, '正在领取任务');

            Opf.ajax({
                url: url._('task.take', {num: $taskNumberSelect.val()}),
                data:{subType:subType},
                success: function (resp) {
                    if(resp.num == '0') {
                        Opf.Toast.info(wkbLang._('task.take.notask.msg'));
                    }else {
                        Opf.Toast.success(wkbLang._('task.take.success.msg', resp.num));
                    }
                },
                complete: function () {
                    Opf.UI.busyText($btn, false);
                    me.trigger('task:switch:category', me.$btnSwitch.attr('ref'));
                }
            });

        }, 200),

        refreshTasks: function () {
            this.trigger('refresh:page');
        },

        //返回当前任务分类
        getClassify: function () {
            return this.$btnSwitch.attr('ref');
        },

        onRender: function() {
            var $el = this.$el;
            var dd = $el.find('.dropdown-switch');
            var me = this;

            //me.setupHeaderResize();

            this.$btnSwitch = this.$el.find('.btn-switch');
            //this.$btnGetTask = this.$el.find('.btn-get-task');

            /*$el.find('.form-search').submit(function () {
                me._onEnterSearch($.trim($el.find('.nav-search-input').val()));
                return false;
            });*/


            //每次选中都去刷新，即便跟上次选择相同
            dd.on('select.bs.dropdown', function (e, val) {
                me.trigger('task:switch:category', val);
            });

            // 等页面绘制完成后再触发。
            _.defer(function () {
                me.trigger('task:switch:category', dd.find('.dropdown-toggle').attr('ref'));
            });

            this.pager = new PagerView({
                collection: this.collection
            });

            this.listenTo(this.pager, 'all', function (evtName) {
                this.trigger.apply(this, arguments);
            });

            this.$el.append(this.pager.$el);

            stopCountDown($el);
            loadMchtOnline(me);//查询当前登录人签到状态 $el

            me.ui.verifyonlines.hide();//自动隐藏，有权限才能显示，因为公用模块，只能商审能看到
            if(Ctx.avail('task.Management.verifyonlines')){
                me.ui.verifyonlines.show();
            }
        },

        /*setupHeaderResize: function () {
            var $hInnerWrap = this.$el.find('.inner-wrap');
            var $dd = this.$el.find('.dropdown');
            var $taskBtn = this.$el.find('.task-btn-wrap');
            var $searchWrap = this.$el.find('.search-wrap');
            var newLine = false;

            //恶心，以后改成css响应式
            $(window).on('resize.wkbheader', function () {
                var totalAvailWidth = $hInnerWrap.width();//可用宽度
                var ddWidth = $dd.width();//dropdown宽度
                var taskBtnWidth = $taskBtn.width();//领取任务宽度
                var searchWidth = $searchWrap.width();//搜索宽度

                if(ddWidth + taskBtnWidth + searchWidth > totalAvailWidth) {
                    $dd.css({
                        'float': 'right',
                        'left': 'initial'
                    });
                    $searchWrap.css({
                        'position':'relative'
                    });
                }else {
                    //$dd.css({
                    //    'float': 'left',
                    //    'left': '400px'
                    //    //'left': (totalAvailWidth - taskBtnWidth - ddWidth - searchWidth)/2
                    //});
                    $searchWrap.css({
                        //'position':'absolute',
                        'float': 'right',
                        'right': '45px'//其他页面有公用到改class 则增加了style单独使用
                    });
                }
            });

            _.defer(function () {
                $(window).triggerHandler('resize.wkbheader');
            });

        },*/

        /*_onEnterSearch: function(kw) {
            console.log('>>>view enter ', kw);

            var me = this;

            if ($.trim(kw) === '') {
                me.restoreFromSearch();
            } else {
                me.submitSearch(kw);
            }

        },*/

        /*restoreFromSearch: function() {

            console.log('>>> view restore from search');

            this.$el.removeClass('state-search');

            this.$el.find('nav-search-input').text('');

            this.trigger('revokeSearch');
        },

        submitSearch: function(kw) {
            var me = this;

            me.$el.addClass('state-search');
            me.$el.find('.kw').text(kw);

            me.trigger('search', {
                kw: encodeURIComponent(kw)
            });

        },*/

        busyTable: function(toggle) {
            Opf.UI.setLoading(this.$el.find('.list'), toggle);
        },

        //获取切换任务类型的当前值
        getTaskStatus: function() {
            return this.$btnSwitch.attr('ref');
        }

    });

    function loadMchtOnline(me){//$el
        //var $dd = me.$el.find('.dropdown');
        Opf.ajax({
            url: url._('task.mcht.status.show'),
            async: false,
            type: 'GET',
            success: function (data) {
                if(data.success == true){
                    var first = 10;
                    switch (data.data.status){
                        case '0' : //异常状态
                            me.$el.find('.bt-verifyonlines').attr('disabled', 'disabled');
                            me.$el.find('.bt-verifyonlines').val('0');
                            break;
                        case '1' : //签到状态
                            me.$el.find('.bt_i_verifyonlines').html('签退');
                            me.$el.find('.bt-verifyonlines').removeClass('btn-success');
                            me.$el.find('.bt-verifyonlines').addClass('btn-danger');
                            me.$el.find('.bt-verifyonlines').val('2');
                            countDown(me, me.$el, first);
                            break;
                        case '2' : //签退状态
                            me.$el.find('.bt_i_verifyonlines').html('签到');
                            me.$el.find('.bt-verifyonlines').removeClass('btn-danger');
                            me.$el.find('.bt-verifyonlines').addClass('btn-success');
                            me.$el.find('.bt-verifyonlines').val('1');
                            break;
                        default:
                            me.$el.find('.bt_i_verifyonlines').show();
                            me.$el.find('.bt-verifyonlines').val('1');
                    }
                }
            }
        });
    }

    //倒计时10S
    var t;//用来计时
    function countDown(me, el, first){
        first = parseInt(first);
        var txt = (first < 10 ? '0' + first : first);
        el.find('.sp-refresh-list').html(_.template(txt +'秒(每10秒自动刷新页面)'));

        if(first > 0){//一分钟内一直跑
            first--;
            t = window.setTimeout(function(){
                countDown(me, el, first)
            }, 1000);
        }
        else if(first == -1 || first == 0){//结束 重新从10S开始 然后刷新页面
            me.trigger('refresh:page');
            t = window.setTimeout(function(){
                countDown(me, el, 10)
            }, 1000);
        }
    }

    //倒计时停止
    function stopCountDown(el){
        window.clearTimeout(t);
        el.find('.sp-refresh-list').html('');
    }

    return View;
});