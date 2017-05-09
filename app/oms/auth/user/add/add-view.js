define(['App',
    'tpl!app/oms/auth/user/add/templates/add-user.tpl',
    'app/oms/common/store/OpfPageableCollection',
    'app/oms/auth/org/add/add-to-custom-rule-view',
    'app/oms/auth/rule/rule-mgr'
], function(App, tpl, OpfPageableCollection, RuleView, RuleMgr) {

    var SUB_VIEW_CLASS = {
        'info': {path:    'app/oms/auth/user/common/info-view', renderTo:     '#add-user-info'},
        'confirm': {path:   'app/oms/auth/user/common/confirm-view', renderTo:    '#add-user-confirm'}
    };

    var addUserView = Marionette.ItemView.extend({
        tabId: 'menu.staff.add',
        className: 'add-user-wrap',
        template: tpl,

        events: {
            'click .btn-submit': 'onSubmit',
            'click .btn-next': 'onNext',
            'click .btn-back': 'onPrevious'
        },

        ui: {
            nextBtn: '.btn-next',
            backBtn: '.btn-back',
            submitBtn: '.btn-submit'
        },

        getSubViewClass: function (name) {
            return SUB_VIEW_CLASS[name];
        },

        constructor: function () {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.subViews = {};
            this._obj = {};
        },

        getAddSubmitUrl: function () {
            var menuItemName = this.subViews.info.getMenuItemName();

            var ADD_USER_MAP_LIST = {
                'custom': url._('user'), //'操作员(能自定义角色组)',
                'expand': url._('user.expand'), //'拓展员',
                'keyboard': url._('user.keyboard'), //'录入员',
                'sysmgr': url._('user.sysmgr'), //'机构管理员(管理)',
                'sysbsmgr': url._('user.sysbsmgr'), //'机构管理员(管理&业务)',
                'statist': url._('user.statist') //'统计员',
            };
            var retUrl = ADD_USER_MAP_LIST[menuItemName];
            console.log('<<<<返回新增操作员url', retUrl);
            return retUrl;
        },

        onSubmit: function (e) {
            var me = this;
            var obj = $.extend({}, me._obj);

            for(var p in obj) {
                if(p.indexOf('_') === 0) {
                    delete obj[p];
                }
            }

            
            me.ui.submitBtn.text('正在提交...').addClass('disabled');
            
            // Opf.UI.setLoading('.main-content',true,{text:'正在验证提交'});
            App.maskCurTab();

            $.ajax({
                url: me.getAddSubmitUrl(),
                method: 'POST',
                //TODO 外面覆盖
                contentType: 'application/json',
                data: JSON.stringify(obj),
                success: function (resp) {
                    if(resp.success !== false) {
                        
                        Opf.Toast.success('提交成功');
                        App.trigger('user:add');
                        //自定义规则只有0级 和 1级 有
                        // 而 0级 1级 建不了拓展员，所以不需要
                        // 即便需要，我们还要判断他是否拓展员

                        // Opf.confirm('需要把该员工添加到自定义规则中吗？', function (result) {
                        //     if (result) {
                        //         RuleMgr.confirmAddOperatorToCustomRule(resp.id);

                        //     } else {
                        //         App.trigger('user:add');
                        //     }
                        // });

                        
                    }
                },
                error: function () {
                    Opf.alert('录入失败');
                },
                complete: function () {
                    me.ui.submitBtn.text('确认提交').removeClass('disabled');
                    // Opf.UI.setLoading('.main-content',false);
                    App.unMaskCurTab();
                }
            });
        },

        onDestroy: function () {
            this.subViews = {};
        },

        onRender: function () {
            var me = this;

            me.renderSubView('info');
        },

        renderSubView: function(name) {
            var me = this;
            var clzPath = me.getSubViewClass(name).path;
            var selector = me.getSubViewClass(name).renderTo;

            require([clzPath], function (Clz) {
                //传入当前已录入的数据
                var subView = me.getNewSubView(Clz, name);
                me.trigger('before:render', subView, name);
                subView.render();

                subView.$el.appendTo(me.$el.find(selector));

                me.showSubView(name);

                me.subViews[name] = subView;//cache and forbid reNew

                me.trigger('end:render', name);

                //当界面上的dom都展现出来时触发
                me.triggerMethod('end:show', name);

            });

            me.showBtnBy(name);
        },

        getNewSubView: function(SubView, viewName) {
            var me = this;
            var subView = new SubView(this._obj);
            //这是子view在render之前执行的方法，可以在创建子view之前传入额外参数
            //需要传入 创建的子view 和 子view的名称
            me.on('before:render', function(subView, viewName){
                // if(viewName == 'info'){}
            });

            return subView;
        },

        onNext: function () {
            var me = this;
            var subViews = me.subViews;

            if(subViews[me.curName].validate() === false) {
                var $error;
                if(me.$el.find(".has-error:eq(0)").length){
                    $error = me.$el.find(".has-error:eq(0)");
                }else if(me.$el.find(".has-revise-error:eq(0)").length){
                    $error = me.$el.find(".has-revise-error:eq(0)");
                }
                if($error.length) {
                    me.toScroll(Math.max($error.offset().top - 20, 0));
                }
                return false;
            }

            var subValues = subViews[me.curName].getValues();

            console.info('value from current value', subValues);
            me.curName === 'info' && me.resetViewValues();

            $.extend(this._obj, subValues);

            console.log(this._obj);
            me.renderSubView('confirm');
        },

        resetViewValues: function () {
            this._obj = {};
        },

        showSubView: function (name) {
            var me = this;
            var $el = this.$el;

            me.curName = name;
            me.showBtnBy(name);

            me.el.className = me.el.className.replace(/\bstatus-\w*\b/g, '');

            $el.addClass('status-'+name);

            $el.find('.tab-pane.active').removeClass('active');

            $el.find('#add-user-' + name).addClass('active');
        },

        onEndShow: function (name) {
            console.log('>>>>>>>>>>> endshow: ', name);
            //将图片缩略图按照正常比例调整
            this.fitImages();
        },

        fitImages: function () {
            this.$el.find('.img-wrap').each(function () {
                var $imgWrap = $(this);
                Opf.Util.autoFitImg({
                    img: $imgWrap.find('img'),
                    constrain: $imgWrap.find('.img-inner-wrap')
                });
            });
        },

        onPrevious: function () {
            this.destroySubView('confirm');
            this.resetViewValues('info');
            this.showSubView('info');
        },


        destroySubView: function (name) {
            this.subViews[name].remove();
            this.subViews[name] = null;
        },

        showBtnBy: function (name) {
            this.ui.submitBtn.toggle(name === 'confirm');
            this.ui.backBtn.toggle(name === 'confirm');

            this.ui.nextBtn.toggle(name !== 'confirm');
        },

        
        toScroll: function(pos) {
            $("html, body").animate({scrollTop: pos ? pos : 0}, "slow");
        }

    });

    
    return addUserView;

});