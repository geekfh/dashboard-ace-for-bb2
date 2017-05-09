define(['App',
    'tpl!app/oms/wkb/branch-task/perform/templates/perform-brh.tpl',
    'assets/scripts/fwk/component/linkage',
    'app/oms/auth/org/show/show-brh-info-view',
    'app/oms/mcht/common/image-gallery-view',
    'app/oms/wkb/branch-task/show/history-view',
    'assets/scripts/fwk/component/common-edit-zbank',
    'common-ui',
    'moment.override'
], function(App, tpl, Linkage, BrhInfoView, GalleryView, HistoryView, EditZbankView) {
    var MAX_LENGTH = 20;

    var labelWarningFormatter = function(data, desc, type){
        var errorInfo = data.preview && data.preview[type+"Json"]||{};
        if(_.isString(errorInfo)) errorInfo = JSON.parse(errorInfo);

        return errorInfo.respMsg||errorInfo.description||(desc||"信息")+"可能有误";
    };

    var STATUS_MAP = {
        0 : { cls: 'label-success', icon: 'icon-opf-check-circle', descr: '已验证' },//pre check pass
        1 : { cls: 'label-warning', icon: 'icon-opf-warning', formatter:labelWarningFormatter },//pre check fail
        2 : { cls: '', icon: 'icon-opf-questions', descr:'未验证' }//unknown
    },

    View = Marionette.ItemView.extend({
        className: 'perform-task brh-task',
        template: tpl,

        events: {
            'click .js-task-info':                'popTaskInfo',
            'click .js-back':                     'goback',
            'click .put-back-task':               'putBackTask',

            'click .reject-trigger':              'popRejectForm',
            'click .js-pass':                     'popPassForm',

            'click .reject-submit':               'rejectSubmit',
            'click .pass-submit':                 'passSubmit',

            'click .check-trigger':               'clickCheckBox'
        },

        ui: {
            putBackTaskBtn: '.put-back-task',
            rejectFormDialog: '.reject-form-wrapper',
            passFormDialog: '.pass-form-wrapper',
            rejectForm: '.reject-form',
            passForm: '.pass-form',
            rejectSubmitBtn: '.reject-submit',
            passSubmitBtn: '.pass-submit',
            rejectContainer: '.reject-container',
            brhTypeSelect: '[name="brhType"]'
        },

        initialize: function (options) {
            var data = options.data;
            this.taskModel = options.taskModel;
            this.tasks = options.tasks;

            this.data = data;
            this.taskInfo = data.taskInfo;

            this.hasEditedZbank = null;
        },

        serializeData: function () {
            return this.data;
        },

        onRender: function () {
            var me = this;
            var $el = me.$el;

            me.renderBrhInfo();

            $el.find('.checkable').append($('<i class="check-trigger icon-ok" ></i>'));

            $(document.body).click(function(e) {
                if(me.$history && me.$history.is(':visible') && 
                    (!$(e.target).closest('.history-wrapper').length)) {

                    me.$history.hide();
                    console.log($(e.target).attr('class'));
                }
            });

            me.$zbankRow = $el.find('.zbankName-row');

            //如果有accountId 但没有zbankNo时 显示修改支行号
            if(me.data.brhInfo.accountId && !me.data.brhInfo.zbankNo) {
                var editZbankView = new EditZbankView({
                    bankCode: me.data.brhInfo.bankNo,
                    taskId: me.data.taskId,
                    renderAfter: me.$zbankRow
                });

                editZbankView.on('updatezbank.success', function () {
                    me.hasEditedZbank = true;
                    me.$zbankRow.find('.info-item-text').text('原开户支行');
                });
            }

            me.attachValidation();
            setTimeout(function(){
                me.showPreCheckResult();
            },100);

            this.setDefaultBrhLevel();
        },

        // 放回任务
        putBackTask: function () {
            var me = this;

            Opf.UI.busyText(me.ui.putBackTaskBtn);
            Opf.ajax({
                url: url._('task.putback', {id: me.taskModel.id}),
                type: 'PUT',
                success: function (resp) {
                    me.taskModel.set('status', 1);//更改成待领取状态
                    // Opf.UI.setLoading($('#page-body'));
                    App.maskCurTab();
                    Opf.ajax({
                        url: url._('task.target', {id: me.taskModel.id}),
                        success: function (data) {
                            // 切换到 showView 界面
                            me.goToShowView(data);
                            // Opf.UI.setLoading($('#page-body'), false);
                            App.unMaskCurTab();
                        }
                    });
                },
                complete: function () {
                    Opf.UI.busyText(me.ui.putBackTaskBtn, false);
                }
            });
        },

        goToShowView: function (data) {
            var me = this;

            require(['app/oms/wkb/branch-task/show/show-view'], function (ShowView) {
                var showView = new ShowView({
                    data: data,
                    taskModel: me.taskModel,
                    tasks: me.tasks
                }).render();

                me.$el.remove();
                App.getCurTabPaneEl().append(showView.$el);

                showView.$el.find('.js-back').hide();

                //绑定 showView 的返回事件
                showView.on('back', function(){
                    $('.tasks-board').show();
                    // var currentPage = showView.tasks.state.currentPage;
                    me.tasks.getPage(0, {reset: true});
                });
            });
        },

        //设置默认的机构类型，依赖后台数据
        setDefaultBrhLevel: function () {
            var me = this;
            //根据被审核的机构号请求得到机构级别，作为机构类型的默认值、
            Opf.ajax({
                type: 'GET',
                autoMsg: false,
                url: url._('branch.info',{brhCode: me.data.brhInfo.brhCode}),
                success: function (data) {
                    //设置机构类型的默认选项值
                    me.ui.brhTypeSelect.val(data.brhLevel>3? 3:data.brhLevel);
                }
            });
        },

        showPreCheckResult: function () {
            //判断this.data.preview中的数据
            //preview 的值有可能为空，所以做一下保护
            //如果为空，默认status的值为'2'(未验证)
            var me = this;
            var $el = me.$el;
            var preview = me.data.preview || {};
            var oprPreview = me.data.oprPreview || {};

            //对私账户预审
            if(oprPreview.cardStatus) {
                var preCheckStatus = oprPreview.cardStatus || '2';
                if(me.data.brhInfo.paccountId){
                    var paccountlabel =  me.generateLabel(preCheckStatus, '账号', 'card');
                    $el.find('div.paccountNo-row').after($(paccountlabel));

                    //如果审核未通过，则不显示审核通过按钮
                    if(preCheckStatus != 0){
                        $el.find('button.js-pass').remove();
                        me.ui.passFormDialog.remove();
                        me.ui.rejectFormDialog.css("right", 0);

                        $el.find('div.checkable[name="paccountName"]>i.check-trigger').trigger('click');
                        $el.find('div.checkable[name="paccountNo"]>i.check-trigger').trigger('click');
                        $el.find('div.checkable[name="pzbankName"]>i.check-trigger').trigger('click');
                    }
                }
            }

            //对公账户预审
            if(preview) {
                var idlabel = me.generateLabel(preview.idStatus || '2', '身份证信息', 'id');
                $el.find('div.cardNo-row').after($(idlabel));

                var licslabel = me.generateLabel(preview.licsStatus || '2', '营业执照号');
                $el.find('div.licNo-row').after($(licslabel));

                //对公账号不需要预审
                //何锋修改于2015/7/29
                /*if(me.data.brhInfo.accountId){
                    var accountlabel =  me.generateLabel(preview.cardStatus || '2', '账号');
                    $el.find('div.accountNo-row').after($(accountlabel));
                }*/
            }

            //在相应地方append相应内容
            // <span class="label label-warning">xx可能有误</span>
            // <span class="label label-success">xx已验证</span>
            // <span class="label ">xx未验证</span>
            
        },

        generateLabel: function(status, desc, type){
            var data = this.data||{},
                previewItem = STATUS_MAP[status];
            var labelTpl = [
                    '<div class="row row-text-font row-margintop pre-check-result">',
                        '<div class="col-lg-1"></div>',
                        '<div class="col-lg-10">',
                            '<span class="label ' + previewItem.cls + '">',
                                '<i class="icon '+ previewItem.icon +'"></i>',
                                previewItem.formatter?
                                    previewItem.formatter(data, desc, type):
                                    (desc||"") + previewItem.descr,
                            '</span>',
                        '</div>',
                    '</div>'
                ].join('');
            return labelTpl;
        },
        
        rejectSubmit: function () {
            var me = this;
            var $el = me.$el;
            if($el.find('.checkable.checked').length < 1 && !$el.find('input[name="needAdd"]').is(':checked')){
                Opf.alert('请勾选错误信息！<br><br> 如果需要补充信息，请勾选拒绝按钮上方的“仍需补充资料”。');
            }else if(me.ui.rejectForm.valid()) {

                Opf.UI.busyText(me.ui.rejectSubmitBtn, true);
                var rejectValues = me.getRejectSubmitValues();
                Opf.ajax({
                    url: url._('task.refuse', {id:me.data.taskId}),
                    type: 'PUT',
                    data: JSON.stringify(rejectValues),
                    success: function (resp) {
                        Opf.Toast.success('操作成功');
                        var tabId = me.$el.closest('[tabmainbody]').attr('id');
                        App.closeTabViewById(tabId);

                        me.goback();

                    },
                    error: function () {
                        Opf.alert('提交失败');
                    },
                    complete: function () { 
                        Opf.UI.busyText(me.ui.rejectSubmitBtn, false);
                    }
                });
                
            }
            return false;
        },

        getRejectSubmitValues: function () {
            var errorMark = {};

            var expreg = /^extraImg(\d+)/;
            var match;
            var extraImg = [];
            var needExtra = false;
            this.$el.find('.checkable').each(function () {
                var name = $(this).attr('name');
                var isCheck = $(this).hasClass('checked');
                if((match = name.match(expreg))) {
                    //标识第几张照片是拒绝的
                    extraImg[match[1]] = isCheck ? 0 : 1;
                    if(!needExtra){
                        needExtra = isCheck;//如果有某张补充的照片被拒绝才会有`extraImg`这个字段
                    }

                }else if(isCheck){
                    errorMark[name] = 0;
                }
            });

            needExtra && (errorMark.extra = extraImg);
            var obj = {
                errorMark: errorMark,
                refuseReason: this.ui.rejectContainer.find('textarea[name="reason"]').val()||""
            };
            var linkage = this.ui.rejectContainer.data('linkage');
            !!linkage && (_.extend(obj, {refuseId: linkage.key}));

            console.info('<<<<getRejectSubmitValues ', obj);

            return obj;
        },

        toggleCheck : function ($checkable, isChecked) {
            $checkable.toggleClass('checked', isChecked);
            $checkable.find('i.check-trigger').toggleClass('icon-remove', isChecked);
        },


        renderBrhInfo: function () {
            var me = this;
            var $el = this.$el;
            var brhInfoView = new BrhInfoView({
                data: this.data.brhInfo,
                convertor: function (item) {
                    item.check =  $el.find('.checkable[name=' + item.name + ']').hasClass('checked');
                }
            });
            brhInfoView.render();
            brhInfoView.on('gallery.close', function (galleryView) {
                galleryView.$el.find(':checkbox').each(function () {
                    var name = $(this).attr('name');
                    var $checkable = $el.find('.checkable[name="'+name+'"]');
                    me.toggleCheck($checkable, $(this).prop('checked'));
                });
            });

            this.$el.find('.info-board-wrap').html(brhInfoView.$el);


        },

        //渲染拒绝原因级联
        renderReject: function(){
            var me = this, ui = me.ui;
            var linkage = new Linkage({
                renderTo: ui.rejectContainer,
                properties: {
                    selectName: 'reasonName',
                    textareaName: 'reason'
                }
            });
            linkage.render();
        },

        attachValidation: function () {
            this.ui.rejectForm.validate({
              rules: {
                reason: {
                  required: true
                },
                successRemark: {
                  required: true
                }
              }
            });
        },

        popTaskInfo: function () {
            var me = this;
            setTimeout(function(){
                if(me.$history){
                        me.$history.show();
                }else{
                    me.doPopTaskInfo();
                }
            }, 10);
        }, 

        doPopTaskInfo: function () {
            var me = this;

            var $historyTrigger = me.$el.find('.history-trigger');
            var brhTaskInfo = $.extend(me.taskInfo, {type: 'user'});
            var historyView = new HistoryView(brhTaskInfo).render();

            me.$history = historyView.$el;
            $historyTrigger.append(me.$history);
        },

        popRejectForm: function () {
            this.ui.passFormDialog.hide();
            this.ui.rejectFormDialog.toggle();
            var isVisible = this.ui.rejectFormDialog.is(':visible');
            isVisible && this.renderReject();
        },

        popPassForm: function (e) {
            this.ui.rejectFormDialog.hide();

            if(this.canPass()){
                this.ui.passFormDialog.toggle();
            } else{
                Opf.alert({title:'支行名称可能有误', message:'请修改后再确认通过！'});
            }
        },

        canPass: function(){
            var me = this;
            //如果没有账户信息 或者 有账户信息并且有支行号 或者 有账户信息手写支行但已修改，则允许通过
            return !me.data.brhInfo.accountId || this.data.brhInfo.zbankNo || me.hasEditedZbank /* 当审核员点击确认修改时应该会获取到 zbankNo*/;
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        },
    
        passSubmit: function (e) {
            e.preventDefault();

            var me = this;
            var succRemk = this.ui.passForm.find('textarea[name="successRemark"]').val() || '';
            var brhType = this.ui.passForm.find('select[name="brhType"]').val() || '';
            
            Opf.UI.busyText(me.ui.passSubmitBtn);
            Opf.ajax({
                type: 'PUT',
                url: url._('task.pass', {id:me.data.taskId}),
                data: JSON.stringify({
                    id: me.data.taskId,
                    successRemark: succRemk,
                    riskLevel: '',
                    brhAddType: brhType,
                    code: me.data.brhInfo.id,
                    type: 'branch'
                }),
                successMsg: '提交成功',
                success: function (resp) {
                    Opf.Toast.success('操作成功');
                    var tabId = me.$el.closest('[tabmainbody]').attr('id');
                    App.closeTabViewById(tabId);
                        
                    me.goback();
                },
                error: function () {
                    Opf.alert('提交失败');
                },
                complete: function () {
                    Opf.UI.busyText(me.ui.passSubmitBtn, false);
                }
            });
        },

        clickCheckBox : function(e) {
            var $checkable = getCheckable(e);

            if(!$checkable.length) return;

            this.toggleCheck($checkable, !$checkable.hasClass('checked'));
        }

    });

    function getCheckable (e) {
        return $(e.target ? e.target : e).closest('.checkable');
    }


  return View;

});