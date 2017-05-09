
define(['App',
    'tpl!app/oms/mcht/edit/templates/edit-mcht.tpl',
    'i18n!app/oms/common/nls/mcht',
    'jquery.bootstrap.wizard'
], function(App, tpl, mcmgrLang) {

    var params = {
        viewType:"edit"
    };

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
                path: 'app/oms/mcht/edit/sub/info-view',
                renderTo: '#edit-person-mcht-info'
            },
            'pic': {
                path: 'app/oms/mcht/edit/sub/edit-pic-view',
                renderTo: '#edit-person-mcht-pic'
            },
            'extra': {
                path: 'app/oms/wkb/task/revise/sub/revise-extra-view',
                renderTo: '#edit-person-mcht-extra'
            },
            'confirm': {
                path: 'app/oms/mcht/add/sub/confirm-view',
                renderTo: '#edit-person-mcht-confirm'
            }
        };

        _.each(resultSubViewClass, function (viewClass) {
            viewClass.renderTo += _count;
        });

        return resultSubViewClass;
    }

    var Views = Marionette.ItemView.extend({
        className: 'person-mcht-wizard',
        template: tpl,

        events: {
            'click .btn-submit': 'onSubmit',
            'click .js-del': 'deleteTask',
            'click .js-back' : 'goback'
        },

        initialize: function () {
            this.subViewClass = countSubViewClass();
        },

        serializeData: function () {
            return {count: _count};
        },

        constructor: function (data, baseId, baseFrom) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.subViews = {};
            this.baseId = baseId;
            this.data = data||{};
            this.baseFrom = baseFrom||"";

            this._obj = _obj = $.extend({}, data);
        },

        getErrorMark: function () {
            return this.errorMark;
        },

        deleteTask: function () {
            // merchant.cancel.refused.one
            var me = this;
            Opf.confirm('您确定要删除该申请吗？', function (result) {
                if(result) {
                    Opf.ajax({
                        type: 'PUT',
                        url: url._('task.cancel', {id: me.baseId}),
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

        onSubmit: function (e) {

            var me = this;
            var submitBtns = me.$el.find('.btn-submit');

            var mchtData = $.extend({}, _obj);

            var urlName = me.tasks ? 'task.update.submit' : 'merchant';

            for(var p in mchtData) {
                if(mchtData.hasOwnProperty(p) && p.indexOf('_') === 0) {
                    delete mchtData[p];
                }
            }
            delete mchtData.uuid;

            //将原始的图片信息不论显示与否都回传给后台
            var originImages = $.extend([], me.data.images||[]);
            var postImages = mchtData.images;
            for(var j=0; j<postImages.length; j++){
                var postImage = postImages[j];
                if(postImage.name=="extra") continue;
                var originImage = _.findWhere(originImages, {name:postImage.name});
                if(!!originImage){
                    originImage.name = postImage.name;
                    originImage.value = postImage.value;
                } else {
                    originImages.push(postImage);
                }
            }
            mchtData.images = originImages;

            //console.info('>>>onSubmit obj values', _obj);
            //console.info('>>>onSubmit obj values', mchtData);

            submitBtns.text('正在提交...').addClass('disabled');
            App.maskCurTab();
            Opf.ajax({
                // user2: 商户查询
                url: me.baseFrom=='user2'? url._('merchant.user2', {id: me.baseId}):url._(urlName, {id: me.baseId}),
                method: 'PUT',
                data: JSON.stringify(mchtData),
                success: function (resp) {
                    Opf.Toast.success('提交成功');
                    //如果从工作台进去的（保存状态）则点击确认提交时返回到工作台任务列表，否则为商管表格
                    if(me.tasks){
                        me.$el.remove();
                        me.trigger('back');
                    } else {
                        switch(me.baseFrom){
                            case "user2":
                                console.log("Edit view from: ", me.baseFrom);
                                App.trigger('mchts:user2:list');
                                break;
                            case "":
                            default:
                                console.log("Edit view from: ", "mcht list");
                                App.trigger('mchts:list');
                                break;
                        }
                    }
                },
                complete: function () {
                    submitBtns.text('确认提交').removeClass('disabled');
                    App.unMaskCurTab();
                }
            });
        },

        onDestroy: function () {
            this.subViews = {};
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

        checkDeletable: function () {
            if(this.tasks) {
                this.$el.find('.js-del').show();
            }
        },

        renderSubView: function (name, callback) {
            var me = this;
            var viewName = me.baseFrom;
            var subViews = this.subViews;
            var clzPath = this.subViewClass[name].path;
            var selector = this.subViewClass[name].renderTo;

            //当confirm页面的时候重画
            if(!subViews[name]) {
                require([clzPath], function (Clz) {

                    //传入当前已录入的数据
                    var subView = new Clz($.extend({}, _obj, {viewName: viewName}), me.errorMark, params);
                    subView.render();
                    subView.$el.appendTo(me.$el.find(selector));

                    subViews[name] = subView;//cache and forbid reNew
                    //当界面上的dom都展现出来时触发
                    me.triggerMethod('end:show', name);
                });

                subViews[name] = true;//force forbid reNew since async require 
            }
            
            else {
                subViews[name].update && subViews[name].update($.extend({}, _obj));

                //三证合一 条件显示
                if(_obj.certFlag == 2 || _obj.certFlag == 3){
                    subViews.pic.$el.find('.orgImage-section').css('display','none');
                    subViews.pic.$el.find('.taxImage-section').css('display','none');
                }
                else{
                    subViews.pic.$el.find('.orgImage-section').css('display','block');
                    subViews.pic.$el.find('.taxImage-section').css('display','block');
                }
            }

            callback.call(me);
        },

        //每次都从当前页面抽取一些后面页面依赖的
        applyValuesFromSubView: function (name, values) {

            if(name === 'info') {
                $.extend(_obj, values);
            }

            else if(name === 'info2') {
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
            this.subViews[name].remove();
            this.subViews[name] = null;
        },

        hasExtraMcht: function (extraMchtName, extraUserCardNo) {
            var $el = this.$el;
            var mchtName = $el.find('input[name="mchtName"]').val();
            var userCardNo = $el.find('input[name="userCardNo"]').val();

            if(extraMchtName === mchtName && userCardNo === userCardNo){
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

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        },

        onRender: function () {
            var $head = this.$el.find('.wizard-head').show();

            var backBtnHtml = [
                '<button type="button" class="js-back btn btn-default pull-left">',
                    '<span class="icon icon-reply"></span> 返回',
                '</button>'
            ].join('');

            $head.find('.caption').text('修改商户信息');
            $head.after(backBtnHtml);

            _stupidHack4Chrome();

            var me = this;
            var subViews = me.subViews;

            me.$el.bootstrapWizard({
                tabClass:         '',
                nextSelector:     '.btn-next',
                previousSelector: '.btn-previous',
                onTabClick: function () {
                    return false;
                },
                onNext: function () {
                    if(subViews[me.curName].validate()===false) {
                        scrollToError(subViews[me.curName].$el);
                        return false;
                    }
                    //[华势通道]显示，用户没勾选，不能继续
                    // if(subViews[me.curName].$el.find('.mchtType-group').length > 0 && subViews[me.curName].$el.find('.mchtType-group').is(':hidden') == false && subViews[me.curName].$el.find('[name="ck_mchtType"]').is(':checked') == false) {
                    //     Opf.Toast.error('如已线下变更银行卡或未修改银行卡信息请勾选.');
                    //     return false;
                    // }

                    // 新增商户 去掉 身份证跟商户名的组合唯一性校验（胡德坤提）
                    // if(me.hasExtraMcht(me.data.mchtName, me.data.userCardNo)){
                    //     Opf.alert('该商户已经存在了！<br><br> 请修改商户名称或身份证号码。');
                    //     return false;
                    // }

                    var subValues = subViews[me.curName].getValues();

                    //console.info('editView onNext value from current value ===>', subValues);

                    me.applyValuesFromSubView(me.curName, subValues);
                },
                onPrevious: function () {
                    if(me.curName === 'confirm') {
                        me.destroySubView('confirm');
                    }
                },

                onTabShow: _.bind(me.onTabShow, me)
            });

            setTimeout(function(){
                me.checkDeletable();
            },100);


        }
    });


    function scrollToError (el) {
        var $error = $(el).find(".form-group.has-error:eq(0)");
        if(!$error.length) {
            $error = $(el).find(".has-error:eq(0)");
        }
        if($error.length) {
            var scrollTop = Math.max($error.offset().top - 50, 0);
            $("html, body").animate({scrollTop: scrollTop}, "slow");
        }
    }

    //chrome下第一次打开浏览器，当内容忽然增大,通过滚轮就不动了，但拖动滚动条是可以的
    function _stupidHack4Chrome () {
        setTimeout(function () {
            document.body.scrollTop = document.body.scrollTop+1;
        }, 1000);         
    }

    return Views;

});
