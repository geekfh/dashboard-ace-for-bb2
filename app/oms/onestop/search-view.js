
define(['App',
    'tpl!app/oms/onestop/templates/mcht-onestop-query.tpl',
    'i18n!app/oms/common/nls/mcht',
    'common-ui'
], function(App, tpl, mcmgrLang, CommonUi) {
    
    App.module('MchtSysApp.Query.View', function(View, App, Backbone, Marionette, $, _) {
        
        
        var arrResponse = [];
        var arrResponseData = [];
        
        View.Mcht = Marionette.CompositeView.extend({
            tabId: 'menu.mcht.query',
            className: 'person-mcht-wizard',
            template: tpl,
            currentPage : 1,                   

            events: {
                //"click .mcht-show-display": "doShowDisplay",
                'click input[name="mcht-reset"]' : 'clearInput',
                'click .mcht-factory' : 'goToSelfService',
                'click .previous a': 'toPrevPage',
                'click .next a': 'toNextPage'
            },

            initialize: function () {
                this.currentPage = 0;// 初始化当前页
            },

            /*doShowDisplay : function(e){
                var me = this;
                try{
                    var srcElement = e.target;
                    var $srcElement = $(e.target.parentNode).prev();
                    $srcElement.toggle(           
                        function(){
                            if(isHidden(this)){
                                $('input[name="mcht-snNo"]').val("");                       
                                //$('input[name="termTypeId"]').select2("data", null);
                                me.trigger('effect:input', me.getFilters());
                                srcElement.innerHTML = "展开筛选条件";  
                            }else{                              
                                srcElement.innerHTML = "隐藏筛选条件";  
                            }                                                       
                        }
                    );
                }catch(e1){
                    throw "此浏览不支持！";
                }
            },*/

            toPrevPage: function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')){
                    this.currentPage -= 1;
                    this.doGetMchtInfo(this.currentPage);
                }
            },

            toNextPage: function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')){
                    this.currentPage += 1;
                    this.doGetMchtInfo(this.currentPage);
                }
            },

            getFilters: function () {
                var filters = {};

                /*var $termTypeId = this.$el.find('input[name="termTypeId"]');
                var termType = $termTypeId.select2('data');
                termType && (filters.termTypeId = termType.typeId);*/

                this.$el.find('input.filter').each(function(){
                    var $this = $(this);
                    var name = $this.attr('name');
                    var value = $this.val();
                    value && name == 'mchtName' && (value = encodeURIComponent(value));
                    value && (filters[name] = value);
                });

                // 如果过滤的条件不为空，则给过滤条件设置每一页显示的页数
                // 如果过滤的条件为空，则返回 {}，便于判断 搜索商户 按钮是否可用
                !_.isEmpty(filters) && $.extend(filters, {size: 10});

                return filters;
            },
            
            doGetMchtInfo : function(page){             
                var me = this;
                //如果是点击翻页，则 page 存在，则给 filters 设置页数
                //如果是点击搜索商户按钮，则 page 不存在，默认设置 page 为 0
                page = page || 0;
                var filters = me.getFilters();
                $.extend(filters, {number: page});
                Opf.ajax({
                    cache: false,
                    url: url._('mcht.onestop.search'),
                    data: filters,
                    type : 'get',
                    dataType: 'json',            
                    complete: function(res){
                        arrResponseData = res.responseJSON;
                        me.trigger('mcht-query-result:refresh', arrResponseData);
                    }
                });
            },
            
            onRender : function(){ 
                var me = this;
                me.inputData = {};
                
                setTimeout(function(){
                    $(".mcht-form").validate({
                        rules: {
                            telphone: {mobile: true}                  
                        },
                        messages: {
                            telphone: {mobile: "请输入正确的手机号"}
                        },
                        submitHandler:function(form){
                            me.doGetMchtInfo();
                        },
                        success: function(label) {                      
                            
                        }
                    });
                }, 0);

                //CommonUi.terminalSelect(me.$el.find('input[name="termTypeId"]'));

                me.bindInputEvent();
                me.enableSeachBtn(false);
            },

            bindInputEvent: function () {
                var me = this;
                var $filterForm = me.$el.find('.mcht-form');
                me.on('effect:input', function(filters){
                    me.enableSeachBtn(!_.isEmpty(filters));
                });

                $filterForm.find('input').on('input', function(){
                    me.trigger('effect:input', me.getFilters());
                });
                $filterForm.find('input').on('change', function(){
                    me.trigger('effect:input', me.getFilters());
                });
                $filterForm.find('select').on('change', function(){
                    setTimeout(function(){
                        me.trigger('effect:input', me.getFilters());
                    },100);
                });
            },

            enableSeachBtn: function (toBeEnable) {
                this.$el.find('.mcht-submit').toggleClass('disabled', toBeEnable === false ? true : false);
            },
                                              
            clearInput : function () {  
                //清空输入域  
                var validator = $(".mcht-form").validate();                
                validator.resetForm();  
            },
            
            
            
            /**
             * 进入厂商页面
             */
            
            goToSelfService : function(e){
                var $el = $(e.target).closest('.mcht-factory');
                var mchtInfo = $el.data('param');
                var params = {};

                var urlParamMap = {
                    _m: 'mchtNo',
                    _u: 'userId',
                    _n: 'mchtName'
                };
                _.each(urlParamMap, function (bsKey, urlKey) {
                    params[urlKey] = mchtInfo[bsKey];
                });

                var urlSearchPart = $.param(params);

                window.open("onestation/index.html?" + urlSearchPart);
            }

        });
        
        
        function isHidden( elem, el ) {
            // isHidden might be called from jQuery#filter function;
            // in that case, element will be second argument
            elem = el || elem;
            return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
        }
        

    }); 


    return App.MchtSysApp.Query.View;

});


