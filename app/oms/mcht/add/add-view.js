/**
 * 新增商户
 */
define(['App',
    'tpl!app/oms/mcht/add/templates/add-mcht.tpl',
    'i18n!app/oms/common/nls/mcht',
    'jquery.bootstrap.wizard',
    'i18n!app/oms/common/nls/auth'
], function(App, tpl, mcmgrLang) {

    // 计数
    var _count = 0;

    function countSubViewClass () {
        _count++;
        var resultSubViewClass = {
               'info': {path: 'app/oms/mcht/add/sub/info-view',       renderTo: '#add-person-mcht-info'},
              'extra': {path: 'app/oms/mcht/add/sub/extra-view',      renderTo: '#add-person-mcht-extra'},
                'pic': {path: 'app/oms/mcht/common/abstract-pic-view',renderTo: '#add-person-mcht-pic'},
            'confirm': {path: 'app/oms/mcht/add/sub/confirm-view',    renderTo: '#add-person-mcht-confirm' }
        };

        _.each(resultSubViewClass, function (viewClass) {
            viewClass.renderTo += _count;
        });

        return resultSubViewClass;
    }

    App.module('MchtSysApp.Add.View', function(View, App, Backbone, Marionette, $, _) {
        View.PersonalMcht = Marionette.ItemView.extend({
            tabId: 'menu.mcht.add',
            className: 'person-mcht-wizard',
            template: tpl,

            events: {
                'click .btn-submit': 'onSubmit',
                'click .btn-save': 'onSaveMchtInfo',
                'click .btn-skip-img': 'noteIsSureSkipImage'
            },

            initialize: function () {
                this.subViewClass = countSubViewClass();
            },

            serializeData: function () {
                return {count: _count};
            },

            constructor: function () {
                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                this.subViews = {};
                this._obj = {};
            },

            noteIsSureSkipImage: function(){
                var me = this;
                var dialog = Opf.alert("<b>暂缓上传照片</b><br /><br /> &nbsp; &nbsp; &nbsp; &nbsp;注意：该商户不会被审核。您稍后可以在工作台里找到该商户记录，将相关照片补充完整后，即可提交审核。", function(){                    
                    me.skipImage();
                });
                dialog.find("button[data-bb-handler='ok']").html("我知道了");

            },

            skipImage: function () {                
                this.subViews.pic.skipValidation();
                this.$('.btn-next').eq(0).click();
            },

            onSaveMchtInfo: function (e) {
                var me = this;
                if(me.curName == 'info'){
                    if(me.subViews[me.curName].validate() === false) {
                        var $error = me.$el.find(".has-error:eq(0)");
                        if($error.length) {
                            me.toScroll(Math.max($error.offset().top - 20, 0));
                        }
                        return false;
                    }else{
                        me.onSave();
                    }
                }else{
                    me.onSave();
                }
            },

            onSave: function() {
                var me = this;
                var obj = me._obj;
                if(me.curName !== 'confirm'){
                    var subValues = me.subViews[me.curName].getValues();
                    me.applyValuesFromSubView(me.curName, subValues);
                }
                for(var p in obj) {
                    if(p.indexOf('_') === 0) {
                        delete obj[p];
                    }
                }
                var $saveBtn = me.$el.find('.btn-save');
                //传到后台的数据
                console.log('the save mcht-info is',obj);
                $saveBtn.text('正在保存').addClass('disabled');
                // Opf.UI.setLoading('.main-content',true,{text:'正在验证提交'});
                App.maskCurTab();
                Opf.ajax({
                    type: 'POST',
                    url: url._('merchant.save'),
                    data: JSON.stringify(obj),
                    success: function (resp) {
                        Opf.Toast.success('提交成功');
                        App.trigger('mcht:add');
                    },
                    error: function () {
                        Opf.alert('保存失败！');
                    },
                    complete: function () {
                        $saveBtn.text('保存').removeClass('disabled');
                        // Opf.UI.setLoading('.main-content',false);
                        App.unMaskCurTab();
                    }
                });
            },

            onSubmit: function (e) {

                var me = this;
                var submitBtns = me.$el.find('.btn-submit');

                var mchtValues = $.extend({}, this._obj);
                mchtValues.uuid = Ctx.getId();

                for(var p in mchtValues) {
                    if(p.indexOf('_') === 0) {
                        delete mchtValues[p];
                    }
                }

                console.info('>>>onSubmit obj values', this._obj);
                console.info('>>>onSubmit submit values', mchtValues);

                // Opf.UI.setLoading('.main-content',true,{text:'正在验证提交'});

                submitBtns.text('正在提交...').addClass('disabled');
                App.maskCurTab();
                $.ajax({
                    url: url._('merchant'),
                    method: 'POST',
                    //TODO 外面覆盖
                    contentType: 'application/json',
                    data: JSON.stringify(mchtValues),
                    success: function (resp) {
                        if(resp.success !== false) {
                            
                            Opf.Toast.success('提交成功');

                            //key 为是否弹出提示框的标识 0:不弹提示框 1:弹出提示框
                            if(resp.value == '1'){
                                Opf.alert(resp.name);
                            }

                            App.trigger('mcht:add');
                        }
                    },
                    error: function () {
                        Opf.alert('录入失败');
                    },
                    complete: function () {
                        submitBtns.text('确认提交').removeClass('disabled');
                        // Opf.UI.setLoading('.main-content',false);
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
                var isTerminal = Opf.Bowser.tablet || Opf.Bowser.mobile;

                this.curName = name;

                this.renderSubView(name, function () {
                    me.onAfterTabShow(tab, navigation, index);

                    if(name === 'pic' && isTerminal) {
                        me.$el.find('.btn-skip-img').show();
                    } else {
                        me.$el.find('.btn-skip-img').hide();
                    }

                    if(name === 'confirm') {
                        me.$el.find('.btn-submit').text('确认提交');
                        me.$el.find('.wizard-caption').text('确认提交');
                    }

                });

            },

            onEndShow: function (name) {
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
                var subViews = this.subViews;

                //当confirm页面的时候重画
                if(!subViews[name]) {
                    require([clzPath], function (Clz) {

                        //传入当前已录入的数据
                        var subView = new Clz(me._obj);
                        subView.render();

                        subView.$el.appendTo(me.$el.find(selector));

                        subViews[name] = subView;//cache and forbid reNew
                        //当界面上的dom都展现出来时触发
                        me.triggerMethod('end:show', name);

                    });
                    subViews[name] = true;//force forbid reNew since async require 

                }else {
                    subViews[name].update && subViews[name].update(me._obj);

                    if(subViews["pic"] != undefined){
                        //三证合一 条件显示
                        if(me._obj.certFlag == 2 || me._obj.certFlag == 3){
                            subViews["pic"].$el.find('.orgImage-section').css('display','none');
                            subViews["pic"].$el.find('.taxImage-section').css('display','none');
                        }
                        else{
                            subViews["pic"].$el.find('.orgImage-section').css('display','block');
                            subViews["pic"].$el.find('.taxImage-section').css('display','block');
                        }
                    }
                }

                callback.call(me);
            },

            //每次都从当前页面抽取一些后面页面依赖的
            applyValuesFromSubView: function (name, values) {

                var obj = this._obj;

                if(name === 'info') {
                    $.extend(obj, values);
                }

                /**
                 * 新增外卡商户独有资料信息(name:info2)
                 * Author: hefeng
                 * Date: 2015/9/21
                 */
                else if(name === 'info2') {
                    $.extend(obj, values);
                }

                else if (name === 'pic') {
                    $.extend(obj, values);
                }

                else if (name === 'extra') {
                    $.extend(obj, values);
                    
                    if(obj._extraImages && obj._extraImages.length) {
                        var extraImgList = _.where(obj.images,{name:"extra"});
                        obj.images =  _.difference(obj.images,extraImgList);
                        obj.images.push({
                            name: 'extra',
                            value: obj._extraImages.join(',')
                        });
                    }
                    // delete obj._extraImages;
                }

                console.info('>>>apply values from sub view, now is ', obj);
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
                            mchtName: encodeURIComponent(mchtName), //商户名称
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

            errorZbankName: function () {
                //在填写信息页面中，如果不用工作流，则支行必须要选择搜索到的
                return this.curName === 'info' && 
                       !Ctx.getUser().get('mchtNeedTask') && 
                       !this.$el.find('[name="zbankName"]').prop('disabled');
            },

            onRender: function () {
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
                        // console.info(arguments);
                        
                        if(subViews[me.curName].validate() === false) {
                            var $error = me.$el.find(".has-error:eq(0)");
                            if($error.length) {
                                me.toScroll(Math.max($error.offset().top - 20, 0));
                            }
                            return false;
                        }

                        // 新增商户 去掉 身份证跟商户名的组合唯一性校验（胡德坤提）
                        // if(me.hasExtraMcht()){
                        //     Opf.alert('该商户已经存在了！<br><br> 请修改商户名称或身份证号码。');
                        //     return false;
                        // }

                        if(me.errorZbankName()){
                            Opf.alert('手写的支行可能有误，请从搜索到的支行中选择一个。');
                            return false;
                        }

                        var subValues = subViews[me.curName].getValues();

                        console.info('onNext value from current value', subValues);

                        //TODO restore
                        me.applyValuesFromSubView(me.curName, subValues);
                    },
                    onPrevious: function () {
                        if(me.curName === 'confirm') {
                            // subViews[me.curNamer].destroy();
                            me.destroySubView('confirm');
                        }
                    },

                    onTabShow: _.bind(me.onTabShow, me)
                });


            },
            
            toScroll: function(pos) {
            	$("html, body").animate({scrollTop: pos ? pos : 0}, "slow");
            }

        });

    });



    return App.MchtSysApp.Add.View;

});
