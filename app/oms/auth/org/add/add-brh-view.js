
define([
    'tpl!app/oms/auth/org/common/templates/add-brh.tpl',
    'app/oms/common/store/OpfPageableCollection',
    'app/oms/auth/org/add/add-to-custom-rule-view',
    'app/oms/auth/rule/rule-mgr',
    'jquery.bootstrap.wizard'
], function(tpl, OpfPageableCollection, RuleView, RuleMgr) {

    var SUB_VIEW_CLASS = {
        'info': {
            path: 'app/oms/auth/org/common/sub/info-view',
            renderTo:'#add-brh-info'
        },
        'pic': {
            path: 'app/oms/auth/org/common/sub/pic-view',
            renderTo: '#add-brh-pic'
        },
        'confirm': {
            path: 'app/oms/auth/org/common/sub/confirm-view',
            renderTo:'#add-brh-confirm'
        }
    };

    var SUB_VIEW_ORDER = ['info', 'pic', 'confirm'];

    var brhView = Marionette.ItemView.extend({
        tabId: 'menu.org.add',
        className: 'add-brh-wrap',
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

        initialize: function () {
            Marionette.ItemView.prototype.initialize.apply(this, arguments);

            this.subViews = {};
            this._obj = {};
        },

        isNeedAskAddNewBrhToCustomRule: function () {
            return Ctx.avail('rule.add');
        },

        onSubmit: function (e) {
            var me = this;
            var obj = $.extend({}, me._obj);

	        //过滤对私账户银行卡/开户许可证图片信息
            var pbankCardIdx = -1;
            _.each(obj.images, function(image, idx){
                if(image.name == "pbankCard"){
                    pbankCardIdx = idx;
                    return false;
                }
            });
            if(pbankCardIdx !== -1){
                var pbankCardObj = obj.images.splice(pbankCardIdx, 1)[0];
                obj[pbankCardObj.name] = pbankCardObj.value;
            }

            me.ui.submitBtn.text('正在提交...').addClass('disabled');

            // Opf.UI.setLoading('.main-content',true,{text:'正在验证提交'});
            App.maskCurTab();

            $.ajax({
                url: url._('branch'),
                method: 'POST',
                //TODO 外面覆盖
                contentType: 'application/json',
                data: JSON.stringify(obj),
                success: function (resp) {
                    if(resp.success !== false) {

                        if(me.isNeedAskAddNewBrhToCustomRule()) {
                            Opf.confirm('需要把该机构添加到自定义规则中吗？', function (result) {
                                if (result) {
                                    RuleMgr.confirmAddBrhToCustomRule(resp.brhCode);
                                } else {
                                    Opf.Toast.success('提交成功');
                                    App.trigger('branch:add');
                                }
                                //0级机构新增完一级机构的之后都要提交一些填写任务配置
                                if(Ctx.getBrhLevel() == 0){
                                    Opf.alert('请到任务配置处给新建的一级机构配工作流');
                                }
                            });
                        }else {
                            Opf.Toast.success('提交成功');
                            App.trigger('branch:add');
                            //0级机构新增完一级机构的之后都要提交一些填写任务配置
                            if(Ctx.getBrhLevel() == 0){
                                Opf.alert('请到任务配置处给新建的一级机构配工作流');
                            }
                        }
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
            this.renderSubView('info');
        },
        renderSubView: function(name, callback) {
            var me = this;
            var clzPath = me.getSubViewClass(name).path;
            var selector = me.getSubViewClass(name).renderTo;
            var subViews = this.subViews;

            if(!subViews[name]) {
                Opf.UI.setLoading($('#page-content'), true);
                require([clzPath], function (Clz) {

                    //传入当前已录入的数据
                    var subView = me.getNewSubView(Clz, name); // new Clz(me._obj);
                    me.trigger('before:render', subView, name);
                    subView.render();

                    subView.$el.appendTo(me.$el.find(selector));

                    me.showSubView(name);

                    subViews[name] = subView;//cache and forbid reNew

                    //当界面上的dom都展现出来时触发
                    me.triggerMethod('end:show', name);

                    Opf.UI.setLoading($('#page-content'), false);

                });
            }else {
                me.showSubView(name);
                subViews[name].update && subViews[name].update(me._obj);
            }

            callback && callback.call(me);
        },

        getNewSubView: function(SubView, viewName) {
            var me = this;
            var subView = new SubView(this._obj);
            //这是子view在render之前执行的方法，可以在创建子view之前传入额外参数
            //需要传入 创建的子view 和 子view的名称
            me.on('before:render', function(subView, viewName){
                if(viewName == 'info'){

                }
            });

            return subView;
        },

        onNext: function () {
            var me = this;
            var subViews = me.subViews;

            if($(document).find('li[tabid="menu-org-add"]').hasClass('active')){
                if(subViews.info.ui.phoneNo.val() != '' && subViews.info.ui.info_brhName.val() == ''){
                    me.scrollToError();
                    return false;
                }
            }

            if(subViews[me.curName].validate() === false) {
                me.scrollToError();
                return false;
            }

            var subValues = subViews[me.curName].getValues();

            console.info('value from current value', subValues);

            me.applyValuesFromSubView(me.curName, subValues);

            var nextViewName = me.getSiblingName('next');

            me.renderSubView(nextViewName, function(){
                var isTerminal = Opf.Bowser.tablet || Opf.Bowser.mobile;
                if(name === 'pic' && isTerminal) {
                    me.$el.find('.btn-skip-img').show();
                } else {
                    me.$el.find('.btn-skip-img').hide();
                }
            });
        },

        //每次都从当前页面抽取一些后面页面依赖的
        applyValuesFromSubView: function (name, values) {

            var obj = this._obj;

            if(name === 'info') {
                $.extend(obj, values);

                obj.images = [];
                obj.images.push({
                    name: 'extra',
                    value: obj._extraImages.join(',')
                });
                delete obj._extraImages;
            }

            else if (name === 'pic') {
                //得到上传的7张图片值时先把补充图片保存起来，然后在最后push一下；
                var extraImages = _.findWhere(obj.images, {name: 'extra'});
                obj.images = values.images;
                obj.images.push(extraImages);
            }

            delete obj.recommendBrhName;

            console.info('>>>apply values from sub view, now is ', obj);
        },

        showSubView: function (name) {
            var me = this;
            var $el = this.$el;

            me.curName = name;
            me.switchBtnVisible(name);

            me.el.className = me.el.className.replace(/\bstatus-\w*\b/g, '');

            $el.addClass('status-'+name);

            $el.find('.tab-pane.active').removeClass('active');

            $el.find('#add-brh-' + name).addClass('active');
        },

        onEndShow: function (name) {
            console.log('>>>>>>>>>>> endshow: ', name);

            if(name == 'confirm') {
                //将图片缩略图按照正常比例调整
                this.fitImages();
            }
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
            if(this.curName == 'confirm') {
                this.destroySubView('confirm');
            }
            this.showSubView(this.getSiblingName('pre'));
        },

        /**
         * 兄弟名称
         * @param  {String} arrow 'pre'/'next'
         * @return {String}
         */
        getSiblingName: function (arrow) {
            //这里没有做越界保护，UI要控制好
            return SUB_VIEW_ORDER[_.indexOf(SUB_VIEW_ORDER, this.curName) + (arrow === 'pre' ? -1 : 1)];
        },

        destroySubView: function (name) {
            this.subViews[name].remove();
            this.subViews[name] = null;
        },

        switchBtnVisible: function (name) {
            this.ui.submitBtn.toggle(name === 'confirm');
            this.ui.backBtn.toggle(name !== 'info');

            this.ui.nextBtn.toggle(name !== 'confirm');
        },
        
        scrollToError: function() {
            var $error = this.$el.find(".has-error:visible").eq(0);
            var pos;

            if($error.length) {
                pos = Math.max($error.offset().top - 20, 0);
                $(document.body).animate({scrollTop: pos}, "slow");
            }
        }
    });

    return brhView;

});