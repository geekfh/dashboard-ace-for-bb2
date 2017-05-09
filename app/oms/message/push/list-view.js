define([
    'app/oms/message/push/add-view',
    'app/oms/message/common/common-perform',
    'app/oms/message/common/common-format',
    'app/oms/message/common/timeSelect',
    'moment.override',
    'jquery.jqGrid'
], function(AddView, PerformView, Format, TimeSelectView) {
    var tpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="msgPush-grid-table"></table>',
                '<div id="msgPush-grid-pager" ></div>',
            '</div>',
        '</div>'].join('');

    var DEFAULT_SEARCH_FILTERS = {
        groupOp:"AND",
        rules: [
            {field: 'startDate', op: 'ge', data: ''},
            {field: 'endDate', op: 'le', data: ''}
        ]
    };

    var view = Marionette.ItemView.extend({
        tabId: 'menu.msg.push.list',
        template: _.template(tpl),

        onRender: function() {
            var me = this;
            _.defer(function(){
                me.renderGrid();
            });
        },

        renderGrid: function(){
            var me = this;
            var gird = me.grid = App.Factory.createJqGrid({
                rsId:'msg.push',

                actionsCol: {
                    width: 110,
                    del: false,
                    canButtonRender: function (name, options, rowData) {
                        // 状态 1-待审核 2-已审核 3-已发送 4-已撤销 5-已取消
                        var status = rowData.pushStatus;
                        var creatorId = rowData.creatorId;
                        if(name === 'edit') {
                            return creatorId == Ctx.getUser().get('id') && status == 1;
                        }else if(name === 'perform'){
                            return status == 1;
                        }else if(name === 'repeal'){
                            return status == 1;
                        }else if(name === 'cancel'){
                            return creatorId !== Ctx.getUser().get('id') && status == 2;
                        }else if(name === 'view'){
                            return true;
                        }else{
                            return false;
                        }
                    },
                    extraButtons: [
                        {name: 'perform', caption: '', title:'审核', icon: 'icon-opf-param-config green', click: function(name, obj, rowData) {
                            me.triggerMethod('show:perform', rowData);
                        }},
                        {name: 'cancel', caption: '', title:'取消', icon: 'icon-opf-times-circle red', click: function(name, obj, rowData) {
                            me.triggerMethod('msg:cancel', rowData);
                        }},
                        {name: 'repeal', caption: '', title:'撤销', icon: 'icon-opf-rotate-left orange', click: function(name, obj, rowData) {
                            me.triggerMethod('msg:repeal', rowData);
                        }}
                    ]
                },
                nav: {
                    actions:{
                        addfunc: function () {
                            me.createPushDialog();
                        },
                        editfunc: function (id) {
                            me.createPushDialog(id);
                        }
                    },
                    search:{
                        // 以下实现了默认查询条件，查看demo http://www.trirand.com/blog/jqgrid/jqgrid.html ---> Search Templates
                        tmplNames: ["customDefaultSearch"],
                        tmplFilters: [DEFAULT_SEARCH_FILTERS],
                        tmplLabel: "",
                        beforeShowSearch: function(form){
                            // 查看 jquery.jqgrid.js 中的 showFilter 函数，发现：
                            // form 参数在 beforeShowSearch 第一次执行时有值，之后执行都为空数组
                            if (form.length) {
                                me.form = form;
                            }
                            //选中定制的搜索模板并触发change事件
                            $(me.form).parent().find('select.ui-template').val("0").trigger('change').hide();

                            return true;
                        },

                        afterRedraw: function(){
                            addTimeSelectEl(this);
                        }
                    }
                },
                url: url._('push.msg'),
                gid: 'msgPush-grid',//innerly get corresponding ct '#mchts-grid-table' '#mchts-grid-pager'

                colNames: {
                    id: '',
                    creatorId: '',
                    pushApp: '推送APP',
                    pushContent: '推送内容',
                    pushDate: '推送时间',
                    pushStatus: '状态',
                    pushDevice: '推送设备',
                    pushType: '推送方式',
                    pushObject: '推送对象',
                    pushPosition: 'APP打开后定位',
                    startDate: '起始日期',
                    endDate: '结束日期'
                },
                colModel: [
                    {name:'id', index: 'id', hidden: true},
                    {name:'creatorId', index: 'creatorId', hidden: true, editable: false, viewable: false},
                    {name:'pushApp', index: 'pushApp', formatter: Format.pushApp},//推送APP
                    {name:'pushContent', index: 'pushContent'},//消息内容
                    {name:'pushDate', index: 'pushDate', formatter: Format.pushDate},//推送时间
                    {name:'pushStatus', index: 'pushStatus', formatter: Format.pushStatus, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: Format.PUSH_STATUS_MAP,
                            sopt: ['eq', 'ne']
                        }
                    },//状态
                    {name:'pushDevice', index: 'pushDevice', formatter: Format.pushDevice, search:true,
                        stype: 'select',
                        searchoptions: {
                            value: Format.PUSH_DEVICE_MAP,
                            sopt: ['eq', 'ne']
                        }  
                    },//推送设备
                    {name:'pushType', index: 'pushType', formatter: Format.pushType, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: Format.PUSH_TYPE_MAP,
                            sopt: ['eq', 'ne']
                        }
                    },//推送方式
                    {name:'pushObject', index: 'pushObject', formatter: Format.pushObject, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: Format.PUSH_OBJECT_MAP,
                            sopt: ['eq', 'ne']
                        }
                    },//发送对象
                    {name:'pushPosition', index: 'pushPosition', formatter: Format.pushPosition}, //APP打开后定位
                    {name:'startDate', index: 'startDate', hidden: true, editable: false, viewable: false, search: true,
                        searchoptions: {
                            sopt: ['ge']
                        }
                    },
                    {name:'endDate', index: 'endDate', hidden: true, editable: false, viewable: false, search: true,
                        searchoptions: {
                            sopt: ['le']
                        }
                    }
                ],
                loadComplete: function (){}
            });

        },

        onShowPerform: function (data) {
            var me = this;
            var model = new Backbone.Model(data);
            var view = new PerformView({
                model: model,
                url: url._('push.msg.perform', {id: model.get('id')}),
                formLayout: [
                    { name: 'pushObject', label: '发送对象', formatter: Format.pushObject},
                    { name: 'pushDetail', label: '发送对象明细', formatter: Format.pushDetail},
                    { name: 'pushDevice', label: '发送设备', formatter: Format.pushDevice},
                    { name: 'pushPosition', label: 'APP接收后', formatter: Format.pushPosition},
                    { name: 'pushContent', label: '推送内容' },
                    { name: 'pushDate',   label: '发送时间', formatter: function (val) {
                        if(val){
                            var pushDateHtml = '<span class="red">'+ Format.pushDate(val) +'</span>';
                            return '于 ' + pushDateHtml + ' 发送';
                        }else{
                            return '无';
                        }
                    }}
                ]
            });

            var $dialog = Opf.Factory.createDialog(view.$el, {
                destroyOnClose: true,
                title: '审核页面',
                autoOpen: true,
                width: 500,
                height: 550,
                modal: true
            });

            view.on('perform:cancel', function () {
                $dialog.dialog('destroy');
            });

            view.on('perform:success', function () {
                $dialog.dialog('destroy');
                me.grid.trigger("reloadGrid", [{current:true}]);
            });

        },

        onMsgCancel: function(rowData) {
            var me = this;
            Opf.confirm('您确定要取消该消息吗？', function (result) {
                if(result) {
                    Opf.ajax({
                        type: 'PUT',
                        url: url._('push.msg.cancel', {id: rowData.id}),
                        successMsg: '取消成功',
                        success: function() {
                            me.grid.trigger("reloadGrid", [{current:true}]);
                        }
                    });
                }
            });
        },

        onMsgRepeal: function(rowData) {
            var me = this;
            Opf.confirm('您确定要撤销该消息吗？', function (result) {
                if(result) {
                    Opf.ajax({
                        type: 'PUT',
                        url: url._('push.msg.repeal', {id: rowData.id}),
                        successMsg: '撤销成功',
                        success: function() {
                            me.grid.trigger("reloadGrid", [{current:true}]);
                        }
                    });
                }
            });
        },

        createPushDialog: function(id){
            var me = this;
            var addView = new AddView().render();

            var $dialog = Opf.Factory.createDialog(addView.$el, {
                modal: true,
                height: 600,
                minHeight: 500,
                width: 500,
                title: '消息推送',
                appendTo: document.body,
                buttons: [{
                    type: 'submit',
                    text: '下一步',
                    click: function(e) {
                        var $dialogWrap = $dialog.closest('.ui-dialog');
                        var $submit = $dialogWrap.find('[classname="submit"]');
                        var $cancel = $dialogWrap.find('[classname="cancel"]');

                        //是否选择终端类型
                        if($.trim($submit.text())=="下一步"){
                            if(!addView.nextValidate()){
                                return;
                            }
                            addView.doNext();
                        } else {
                            if(!addView.validate()){
                                return null;
                            } else {
                                $submit.addClass('disabled');
                                $cancel.addClass('disabled');
                                $submit.find('span.text').text('正在提交...');

                                Opf.UI.setLoading($dialog);

                                var deferr = Opf.ajax({
                                    type: id ? 'PUT' : 'POST',
                                    url: url._('push.msg',{id: id}),
                                    jsonData: $.extend(addView.getValue(), {id: id})
                                });

                                ajaxDone(deferr, {
                                    grid: me.grid,
                                    dialog: this
                                });
                            }
                        }
                    }
                },{
                    type: 'cancel'
                }],
                close: function() {
                    $(this).dialog('destroy');
                }
            });

            //设置默认值
            if(id){
                var rowData = me.grid._getRecordByRowId(id);
                addView.setDefaultData(rowData);
            }
        }

    });

    function ajaxDone(deferr, option) {
        var grid = option.grid,
            $dialog = $(option.dialog);

        var $dialogWrap = $dialog.closest('.ui-dialog');
        var $submit = $dialogWrap.find('[classname="submit"]');
        var $cancel = $dialogWrap.find('[classname="cancel"]');

        deferr.success(function(){
            Opf.Toast.success('操作成功');
            $dialog.dialog('destroy');
            grid.trigger("reloadGrid", [{current:true}]);

        }).error(function(){
            Opf.alert('新增失败!');

        }).complete(function(){
            $submit.removeClass('disabled');
            $cancel.removeClass('disabled');
            $submit.find('span.text').text('提交审核');
            Opf.UI.setLoading($dialog, false);
        });
    }

    function addTimeSelectEl (grid) {
        var $form = $(grid);
        var $select = $form.find('.columns select');

        //找到所有应该放timeSelect的input，替换成timeSelect；
        _.each($select, function(item){
            var itemVal = $(item).find('option:selected').attr('value');
            if(itemVal == 'startDate' || itemVal == 'endDate'){
                var $data = $(item).closest('tr').find('.data');
                buildTimeSelectUI($data);
            }
        });

        //找到所有的搜索条件下拉框重新绑定事件
        $select.on('change.addTimeSelect',function(){
            var me = $(this), itemVal = me.find('option:selected').attr('value');
            if(itemVal == 'startDate' || itemVal == 'endDate'){
                var $data = me.closest('tr').find('.data');
                buildTimeSelectUI($data);
            }
        });

    }

    function buildTimeSelectUI(el) {
        var timeView = new TimeSelectView();
        var $data = $(el);
        var $inputElm = $data.find('.input-elm');

        $inputElm.hide();
        $data.append(timeView.$el);
        timeView.setTime($inputElm.val());
        timeView.on('getTime', function (time){
            $inputElm.val(time);
            $inputElm.trigger('change');
        });
    }

    return view;
});