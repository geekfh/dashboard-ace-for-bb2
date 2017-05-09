define([
    'app/oms/auth/org/add/add-brh-view'

], function (AbstractView) {
    var SUB_VIEW_CLASS = {
        'info':{
            path:'app/oms/auth/org/edit/edit-info-view',
            renderTo:'#add-brh-info',
            next: 'pic', pre:''
        },
        'pic': {
            path:'app/oms/auth/org/edit/edit-pic-view',
            renderTo:'#add-brh-pic',
            next: 'confirm', pre:'info'
        },
        'confirm': {
            path:'app/oms/auth/org/common/sub/confirm-view',
            renderTo:'#add-brh-confirm',
            next: '', pre: 'pic'
        }
    };

    var View = AbstractView.extend({
        constructor: function (data, options) {
            AbstractView.prototype.constructor.apply(this, arguments);

            this.subViews = {};
            this._obj = data;
            this.branchId = options.id;
            this.rowData = options.rowData;
        },

        events: _.extend({
            'click .js-back' : 'goback'
        }, AbstractView.prototype.events),

        getSubViewClass: function (name) {
            return SUB_VIEW_CLASS[name];
        },

        onRender: function () {
            var me = this;
            me.renderSubView('info');

            var $head = this.$el.find('.wizard-head').show();

            var backBtnHtml = [
                '<button type="button" class="js-back btn btn-default pull-left">',
                    '<span class="icon icon-reply"></span> 返回',
                '</button>'
            ].join('');

            $head.find('.caption').text('编辑机构');
            $head.after(backBtnHtml);

        },

        getNewSubView: function(SubView, viewName) {
            var me = this;
            var subView = new SubView(this._obj);
            //这是子view在render之前执行的方法，可以在创建子view之前传入额外参数
            //需要传入 创建的子view 和 子view的名称
            me.on('before:render', function(subView, viewName){
                if(viewName == 'info'){
                    subView.setExtraParams({
                        rowData: me.rowData
                    });
                }
            });

            return subView;
        },

        //每次都从当前页面抽取一些后面页面依赖的
        applyValuesFromSubView: function (name, values) {

            var obj = this._obj;

            if(name === 'info') {
                $.extend(obj, values);
                //编辑的时候先把原来的补充照片去掉，然后再加入新的
                obj.images = _.filter(obj.images, function(item){
                    return item.name != 'extra';
                });

                obj.images.push({
                    name: 'extra',
                    value: obj._extraImages.join(',')
                });

                delete obj._extraImages;

            } else if (name === 'pic') {
                //得到上传的7张图片值时先把补充图片保存起来，然后在最后push一下；
                var extraImages = _.findWhere(obj.images, {name: 'extra'});
                obj.images = values.images;
                obj.images.push(extraImages);
            }

            delete obj.recommendBrhName;

            console.info('>>>apply values from sub view, now is ', obj);
        },


        onSubmit: function (e) {
            var me = this;
            // Opf.UI.setLoading('.main-content',true,{text:'正在验证提交'});
            App.maskCurTab();
            delete me._obj.extraImages;
            delete me._obj.recommendBrhName;

            var images = me._obj.images;
            var pbankCardItem = _.findWhere(images, {name:"pbankCard"});
            pbankCardItem && (me._obj[pbankCardItem.name] = pbankCardItem.value||"");

            console.info(">>>Edit org info", me._obj);

            $.ajax({
                url: url._('branch', {id: me.branchId}),
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(me._obj),
                success: function (resp) {
                    if(resp.success !== false) {
                        Opf.Toast.success('提交成功');
                        App.trigger('branches:list');
                    }
                },
                error: function () {
                    Opf.alert('录入失败');
                },
                complete: function () {
                    // submitBtns.text('确认提交').removeClass('disabled');
                    // Opf.UI.setLoading('.main-content',false);
                    App.unMaskCurTab();
                }
            });
        },
        
        goback: function () {
            this.$el.remove();
            this.trigger('back');
        }
        
    });

    return View;

});