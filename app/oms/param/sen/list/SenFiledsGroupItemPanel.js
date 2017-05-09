// filterType: '',//控制程度  1-去敏   0-不可见


// 对应一个类的配置视图
define([
    'tpl!app/oms/param/sen/list/templates/sen-fields-row.tpl',
    'tpl!app/oms/param/sen/list/templates/sen-fields-group-item-panel.tpl'
], function(rowTpl, groupItemTpl) {

    var FILTER_TYPE = {
        MOSAIC: 1,//去敏，马赛克
        HIDE: 0
    };

    var ChildView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: rowTpl,

        ui: {
            handleTypeCol: '.col-handle-type',
            mosicaEditCol: '.col-mosica',
            typeSelect: '.handle-type-select',
            beginInput: '.begin-input',
            endInput: '.end-input'
        },

        events: {
            'change select[name="filterType"]': 'onFilterTypeChange',
            'change :input[name]': function (e) {
                var $target = $(e.target);

                var name = $target.attr('name'), 
                    value = $target.val();

                //>>>DEBUG
                console.log('>>>change ' + name, this.model.toJSON());
                //<<<DEBUG

                $target.addClass('input-state-change');

                //界面输入去敏的起始结束位置是从1开始，程序从0开始
                if(name === 'begin' || name === 'end') {
                    value--;
                }

                this.model.set(name, value);

                $target.closest('tr').addClass('changed');

                //>>>DEBUG
                console.log('<<<change ' + name, this.model.toJSON());
                //<<<DEBUG
            }
        },

        initialize: function () {
            
        },

        onFilterTypeChange: function (e) {
            if(e.target.value == FILTER_TYPE.MOSAIC) {
                this.showUI4MosaicTypeInEditMode();
            }else {
                this.showUI4HiddenTypeInEditMode();
            }
        },

        //*号列 展示编辑内容（去敏）
        showUI4MosaicTypeInEditMode: function () {
            var ui = this.ui,
                model = this.model;

            ui.mosicaEditCol.find('.for-display').hide();

            //TODO 保证是整数
            ui.beginInput.val(model.get('begin')+1);
            ui.endInput.val(model.get('end')+1);

            ui.mosicaEditCol.find('.for-edit').hide();
            ui.mosicaEditCol.find('.for-edit.filter-type-mosaic').show();
        },

        //*号列 展示编辑内容（隐藏）
        showUI4HiddenTypeInEditMode: function () {
            var ui = this.ui,
                model = this.model;

            ui.mosicaEditCol.find('.for-display').hide();

            ui.mosicaEditCol.find('.for-edit').hide();
            ui.mosicaEditCol.find('.for-edit.filter-type-hidden').show();
        },

        enterEditMode: function () {
            var ui = this.ui;
            var model = this.model;
            var filterType = model.get('filterType');

            ui.typeSelect.val(model.get('filterType'));

            if(filterType == FILTER_TYPE.MOSAIC) {//原来是 去敏
                
                this.showUI4MosaicTypeInEditMode();

            }else if (filterType == FILTER_TYPE.HIDE){//原来是 隐藏
                
            }

            ui.handleTypeCol.find('.for-edit').show();
            ui.handleTypeCol.find('.for-display').hide();
        }


    });




    /////////////////////////////////////////  
    /////////// CompositeView /////////////// 
    ///////////////////////////////////////// 
    
    //手风琴效果使用bootstrap的组件
    var View =  Marionette.CompositeView.extend({
        className: 'group-item-panel panel panel-default',
        template: groupItemTpl,
        childView: ChildView,
        childViewContainer: '.fields-ct',

        ui: {
            panelHead: '.panel-heading',
            accordionToggle: '.accordion-toggle',
            panelCollapse: '.panel-collapse'
        },

        initialize: function () {
            var me = this;

            this.collection = this.model.get('fieldsCollection');

            this.isHeadUIFixed = false;//标识头部UI是否被固定了
        },

        //@deprecate
        xonRender: function () {
            var me = this;
            var ui = me.ui;
            var $head = me.$el.find('.panel-heading');
            var index = me.model.collection.indexOf(me.model);

            this.ui.accordionToggle.on('click', function () {
                //当头部被固定后，点击头部的效果
                //1.当内容未收缩，则滚动内容到可见
                //2.当内容收缩，则展开后在滚动内容到行可见
                if(me.isHeadUIFixed) {

                    var panelCollapseTop = ui.panelCollapse.offset().top;
                    var panelHeadTop = ui.panelHead.offset().top;
                    //体 超过 头部分的高度
                    var bodyOverHeadHeight = (panelHeadTop - panelCollapseTop);

                    if(bodyOverHeadHeight) {
                        //回滚 超出部分高度 加上 头部高度,额外回滚多1,保证能取消fix
                        document.body.scrollTop -= (bodyOverHeadHeight + $head.height() + 1);

                        _.defer(function () {//触发scrollfix组件在检查一次，实际上会取消fix
                            $(window).trigger('scroll.ScrollToFixed');
                        });

                        return false;
                    }

                }
            });

            //是的滚动过程中，时刻可以看到fixed的头部
            _.defer(function () {

                var headHeight = $head.height();

                //TODO 这里耦合太多外部dom选择器，通过参数传进来
                var marginTop = $head.closest('.sen-fields-panel').find('.fixed-head-wrap').height();

                $head.scrollToFixed({
                    marginTop: marginTop + (index * headHeight)
                })//
                .on('fixed.ScrollToFixed', function () {
                    me.isHeadUIFixed = true;
                })//
                .on('unfixed.ScrollToFixed', function () {
                    me.isHeadUIFixed = false;
                });
            });
        },

        enterEditMode: function () {
            this.children.invoke('enterEditMode');
        },

        expand: function () {
            if(this.ui.accordionToggle.hasClass('collapsed')) {
                this.ui.accordionToggle.trigger('click.bs.collapse.data-api');
            }
        },

        applyFilter: function (words) {
            words = $.makeArray(words);

            var childView;

            var children = this.children;
            var shouldHiddenViewCids = [];
            var isChildAllHidden = true;

            this.$el.hide();//考虑dom渲染性能，把容器先隐藏，最后在判断是否该显示本元素

            children.each(function (childView) {
            
                //SenFiledsStore里面的model
                if (childView.model.matchFilter(words)) {

                    childView.$el.show();
                    isChildAllHidden = false;

                }else {
                    childView.$el.hide();
                }

            });

            //如果所有孩子view都隐藏，那么就隐藏本el,否则显示
            this.$el.toggle(!isChildAllHidden);

            if(!isChildAllHidden) {
                this.expand();
            }
        }

    });


    return View;
});