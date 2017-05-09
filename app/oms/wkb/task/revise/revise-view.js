
define(['App',
    'tpl!app/oms/wkb/task/revise/templates/add-mcht.tpl',
    'i18n!app/oms/common/nls/mcht',
    'jquery.bootstrap.wizard'
], function(App, tpl, mcmgrLang) {


    var params = {
        viewType:"revise"
    };

    var _subViews = {};

    var _obj = {
        //这份数据大部分跟录入商户的接口一样，其他部分仅在前端使用，这部分数据以下划线开头
        //具体有哪些可以参考子view的模板的开头声明部分
    };

        // 计数
    var _count = 0;

    function countSubViewClass () {
        _count++;
        var resultSubViewClass = {
            'info': {
                path: 'app/oms/wkb/task/revise/sub/info-view',
                renderTo: '#revise-person-mcht-info'
            },
            'extra': {
                path: 'app/oms/wkb/task/revise/sub/revise-extra-view',
                renderTo: '#revise-person-mcht-extra'
            },
            'pic': {
                path: 'app/oms/wkb/task/revise/sub/pic-view',
                renderTo: '#revise-person-mcht-pic'
            },
            'confirm': {
                path: 'app/oms/mcht/add/sub/confirm-view',
                renderTo: '#revise-person-mcht-confirm'
            }
        };

        _.each(resultSubViewClass, function (viewClass) {
            viewClass.renderTo += _count;
        });

        return resultSubViewClass;
    }



        var MchtView = Marionette.ItemView.extend({

            className: 'person-mcht-wizard',
            template: tpl,

            events: {
                'click .btn-submit': 'onSubmit',
                'click .js-del': 'deleteTask',
                'click .js-back': 'goback'
            },

            ui: {
                delBtn: '.js-del'
            },

            deleteTask: function () {
                // merchant.cancel.refused.one
                var me = this;
                Opf.confirm('您确定要删除该申请吗？', function (result) {
                    if(result) {
                        Opf.ajax({
                            type: 'PUT',
                            url: url._('task.cancel', {id: me.taskData.id}),
                            // url: 'api/system/tasks?type=2',
                            // block: {
                            //     msg: '正在删除'
                            // },
                            successMsg: '删除成功',
                            success: function () {
                                me.$el.remove();
                                me.trigger('back');
                            }
                        });
                    }
                });
            },

            initialize: function () {
                this.subViewClass = countSubViewClass();
            },

            serializeData: function () {
                return {count: _count};
            },

            constructor: function (data, taskData) {
                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                _subViews = {};


                this.data = data;
                this.orgMchtData = data.target;
                params['originalData'] = data.target;
                this.errorMark = data.errorMark;
                this.taskData = taskData;
                
                // _obj = convertToObj(this.orgMchtData);
                _obj = $.extend({}, this.orgMchtData);
            },

            getErrorMark: function () {
                return this.errorMark;
            },

            onSubmit: function (e) {

                var me = this;
                var submitBtns = me.$el.find('.btn-submit');

                var mchtData = $.extend({}, _obj);
                mchtData.uuid = Ctx.getId();

                for(var p in mchtData) {
                    if(p.indexOf('_') === 0) {
                        delete mchtData[p];
                    }
                }

                console.info('>>>onSubmit obj values', _obj);
                console.info('>>>onSubmit obj values', mchtData);

                submitBtns.text('正在提交...').addClass('disabled');
                
                Opf.ajax({
                    url: url._('task.revise.submit', {id: me.taskData.id}),
                    method: 'PUT',
                    data: JSON.stringify({
                        target: mchtData,
                        task: me.taskData
                    }),
                    success: function (resp) {
                        Opf.Toast.success('提交成功');
                        me.$el.remove();
                        me.trigger('back');
                    },          
                    error: function () {
                        // alert('提交失败');
                    },
                    complete: function () {
                        submitBtns.text('确认提交').removeClass('disabled');
                    }
                });


            },

            onDestroy: function () {
                _subViews = {};
            },

            onTabShow: function (tab, navigation, index) {
                var me = this;
                var name = $(tab).attr('name');

                this.curName = name;

                this.renderSubView(name, function () {
                    me.onAfterTabShow(tab, navigation, index);
                });
            },

            onEndShow: function (name) {
                if(name == 'confirm'){
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

            onAfterTabShow: function (tab, navigation, index) {
                var me = this;
                var $tab = $(tab);
                var name = $tab.attr('name');
                var $steps = tab.closest('ul');
                
                $steps.children('li').each(function (idx, el) {
                    $(el).toggleClass('passing', idx <= index);
                });

                me.$el.find('.btn-submit').toggle(name === 'confirm');
                me.$el.find('.btn-next').toggle(name !== 'confirm');

                me.el.className = me.el.className.replace(/\bstatus-\w*\b/g, '');
                me.$el.addClass('status-'+name);
                me.$el.find('.wizard-caption').text($tab.find('.desc').text());
            },

            renderSubView: function (name, callback) {
                var me = this;
                var clzPath = this.subViewClass[name].path;
                var selector = this.subViewClass[name].renderTo;

                //当confirm页面的时候重画
                if(!_subViews[name]) {
                    require([clzPath], function (Clz) {

                        //传入当前已录入的数据
                        var subView = new Clz($.extend({}, _obj), me.errorMark, params);
                        subView.render();

                        subView.$el.appendTo(me.$el.find(selector));

                        _subViews[name] = subView;//cache and forbid reNew
                        //当界面上的dom都展现出来时触发
                        me.triggerMethod('end:show', name);

                    });
                    _subViews[name] = true;//force forbid reNew since async require 

                }else {
                    _subViews[name].update && _subViews[name].update($.extend({}, _obj));
                }

                callback.call(me);
            },

            //每次都从当前页面抽取一些后面页面依赖的
            applyValuesFromSubView: function (name, values) {

                if(name === 'info') {
                    $.extend(_obj, values);
                }

                else if (name === 'pic') {
                    var extra = _.findWhere(_obj.images, {name:'extra'});
                    $.extend(_obj, values);
                    //不能直接弄掉原来的extra，不然初始化的extra图片就被干掉
                    if(extra) {
                        _obj.images.push(extra);
                    }
                }

                else if (name === 'extra') {
                    $.extend(_obj, values);
                    if(values._extraImages)  {
                        var extraImgUrlJoin = values._extraImages.join(',');
                        var extraItem = _.findWhere(_obj.images, {name:'extra'});
                        if(!extraItem) {
                            _obj.images.push({name:'extra', value: extraImgUrlJoin});
                        }else {
                            extraItem.value = extraImgUrlJoin;
                        }
                    }
                }

                console.info('>>>apply values from sub view, now is ', _obj);
            },

            destroySubView: function (name) {
                _subViews[name].remove();
                _subViews[name] = null;
            },

            showRejectReason: function () {
                this.$el.find('.tab-content').prepend(
                    templateRejectReason(this.data.refuseReason));
            },

            checkDeletable: function () {
                if(Ctx.avail('wkb.revise.btn.del')) {
                    this.ui.delBtn.show();
                }
            },

            hasExtraMcht: function (ignoreMchtName, ignoreUserCardNo) {
                var $el = this.$el;
                var mchtName = $el.find('input[name="mchtName"]').val();
                var userCardNo = $el.find('input[name="userCardNo"]').val();

                if(ignoreMchtName === mchtName && ignoreUserCardNo === userCardNo){
                    return false;
                }else{
                    var extraMcht = true;
                    Opf.ajax({
                        type:'GET',
                        autoMsg: false,
                        async: false,
                        data:{
                            mchtName: encodeURIComponent(mchtName),  //商户名称
                            userCardNo: userCardNo //身份证号码
                        },
                        url:url._('merchant.valid.mcht'),
                        success: function (data) {
                            extraMcht = false;
                        },
                        error: function (resp) {
                            extraMcht = true;
                        }
                    });

                    return extraMcht;
                }
            },

            onRender: function () {
                this.checkDeletable();
                this.showRejectReason();

                _stupidHack4Chrome();

                var me = this;

                var $head = this.$el.find('.wizard-head').show();

                var backBtnHtml = [
                    '<button type="button" class="js-back btn btn-default pull-left">',
                        '<span class="icon icon-reply"></span> 返回',
                    '</button>'
                ].join('');

                $head.find('.caption').text('修订商户信息');
                $head.after(backBtnHtml);

                me.$el.bootstrapWizard({
                    tabClass:         '',
                    nextSelector:     '.btn-next',
                    previousSelector: '.btn-previous',
                    onTabClick: function () {
                        return false;
                    },
                    onNext: function () {
                        // console.info(arguments);
                        //TODO 验证，用同步的验证，现在控件基于事件
                        if(_subViews[me.curName].validate()===false) {
                            var $error = me.$el.find(".has-error:eq(0)");
                            if(!$error.length) {
                                $error = me.$el.find('.has-revise-error');
                            }
                            if($error.length) {
                            	var scrollTop = $error.offset().top - 50;
                            	me.toScroll( scrollTop < 0 ? 0 :  scrollTop );
                            }
                            return false;
                        }

                        // 新增商户 去掉 身份证跟商户名的组合唯一性校验（胡德坤提）
                        // if(me.hasExtraMcht(me.orgMchtData.mchtName, me.orgMchtData.userCardNo)){
                        //     Opf.alert('该商户已经存在了！<br><br> 请修改商户名称或身份证号码。');
                        //     return false;
                        // }

                        var subValues = _subViews[me.curName].getValues();

                        console.info('value from current value', subValues);

                        //TODO restore
                        me.applyValuesFromSubView(me.curName, subValues);
                    },
                    onPrevious: function () {
                        if(me.curName === 'confirm') {
                            // _subViews[me.curNamer].destroy();
                            me.destroySubView('confirm');
                        }
                    },

                    onTabShow: _.bind(me.onTabShow, me)
                });


            },
            
            toScroll: function(pos) {
            	pos = pos || 0;
            	$("html, body").animate({scrollTop: pos ? pos : 0}, "slow");
            },

            goback: function () {
                this.$el.remove();
                this.trigger('back');
            }

        });


    function templateRejectReason (strReason) {
        var arr = [];
        _.each(strReason.split(/\n/),function (line) {
            line = $.trim(line);
            if(line.length) {
                arr.push('<li>- '+line+'</li>');
            }
        });
        return [
        '<div class="outter-wrap">',
            '<div class="reject-reason-wrap">',
                '<p>请根据以下提示修改表格，再继续提交</p>',
                '<ul class="reject-reason-txt">',
                    arr.join(''),
                '</ul>',
            '</div>',
        '</div>'
        ].join('');
    }

    //chrome下第一次打开浏览器，当内容忽然增大,通过滚轮就不动了，但拖动滚动条是可以的
    function _stupidHack4Chrome () {
        var orgScrollTop = document.body.scrollTop;
        setTimeout(function () {
            document.body.scrollTop = orgScrollTop+1;
            document.body.scrollTop = orgScrollTop;
        }, 1000);         
        // setTimeout(function () {
        // },101);
    }

    return MchtView;

});
