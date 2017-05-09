define(['App',
    'tpl!app/oms/wkb/task/list/templates/row.tpl',
    'tpl!app/oms/wkb/task/list/templates/list.tpl',
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
        tabId: 'menu.wkb.task',
        className: 'tasks-board',
        template: _.template(listTpl({data: wkbCommon.SUBTYPE_MAP})),
        childView: View.Task,
        childViewContainer: ".list",

        ui: {},

        events: {
            'click .revoke-trigger': 'restoreFromSearch',
            'click .btn-get-task': 'onGetTask',
            'click .refresh-btn': 'refreshTasks'
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

            me.setupHeaderResize();

            this.$btnSwitch = this.$el.find('.btn-switch');
            this.$btnGetTask = this.$el.find('.btn-get-task');


            $el.find('.form-search').submit(function () {
                me._onEnterSearch($.trim($el.find('.nav-search-input').val()));
                return false;
            });


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

        },

        setupHeaderResize: function () {
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
                    $dd.css({
                        'float': 'left',
                        'left': (totalAvailWidth - taskBtnWidth - ddWidth - searchWidth)/2
                    });
                    $searchWrap.css({
                        'position':'absolute',
                        right: '0'
                    });
                }
            });

            _.defer(function () {
                $(window).triggerHandler('resize.wkbheader');
            });

        },

        _onEnterSearch: function(kw) {

            console.log('>>>view enter ', kw);

            var me = this;

            if ($.trim(kw) === '') {
                me.restoreFromSearch();
            } else {
                me.submitSearch(kw);
            }

        },

        restoreFromSearch: function() {

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

        },

        busyTable: function(toggle) {
            Opf.UI.setLoading(this.$el.find('.list'), toggle);
        },

        //获取切换任务类型的当前值
        getTaskStatus: function() {
            return this.$btnSwitch.attr('ref');
        }
    });

    return View;
});