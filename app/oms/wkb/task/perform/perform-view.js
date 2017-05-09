define(['App',
  'i18n!app/oms/common/nls/wkb',
  'tpl!app/oms/wkb/task/perform/templates/perform.tpl',
  'assets/scripts/fwk/component/linkage',
  'assets/scripts/fwk/factory/typeahead.factory',
  'app/oms/wkb/task/show/show-mcht-info-view',
  'app/oms/wkb/branch-task/show/history-view',
  'app/oms/common/moduleUI',
  'common-ui',
  'moment.override'
], function(App, wkbLang, tpl, Linkage, typeaheadFactory, MchtInfoView, HistoryView, ModuleUI) {
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

    TITLE_MAP = {
        'B1': '新增个体商户',
        'B2': '新增普通商户',
        'D1': '新增二维码商户',
        'E1': '新增好哒商户',
        'C2': '新增集团商户(门店)',
        'C1': '新增集团商户(总店)'
    },

    MAX_LENGTH = 20;

    var getSubType = function(data){
        data = data||{};
        var taskInfo = data.taskInfo||{};
        return taskInfo.subType;
    };

    var View = Marionette.ItemView.extend({
        className: 'perform-task',
        template: tpl,

        events: {
            'click .js-task-info' : 'popTaskInfo',
            'click .js-back'      : 'goback',
            'click .reject-trigger'    : 'popRejectForm',
            'click .js-pass'      : 'pass',

            'click .pass-submit'      : 'passSubmit',//确认通过
            'submit .reject-form': 'rejectSubmit',//确认拒绝

            'click .check-trigger'             : 'clickCheckBox',

            'click .update-bank': 'editZBank',

            'click .js-confirm-update-zbank': 'submitUpdateZbank',
            'click .js-cancel-update-zbank': 'cancelUpdateZbank',

            'click .put-back-task':   'putBackTask'

        },

        ui: {
            countDownOpt: '.div_countDown',
            rejectContainer: '.reject-container',
            groupMcc: '[name="grpBudID"]',  //新的经营分类大类
            businessMcc: '[name="businessId"]',//新的经营分类子类
            tNDiscId: '[name="tNDiscId"]',
            mccGroup: '[name="group"]',
            mcc: '[name="mcc"]',
            category: '[name="category"]'
        },

        editZBank: function () {
            showEditZbankform(this);
        },

        submitUpdateZbank: function () {
            var me = this,
                $zBankTip = this.$el.find('.zbank-tip-row div.hint-color');
            if(me.$editZbankForm && !me.$editZbankForm.valid()) {
                return;
            }
            Opf.ajax({
                type: 'PUT',
                url: url._('task.updatezbank', {id: me.data.taskId}),
                data: JSON.stringify({
                    zbankCode: me.$regionCode.val(),//支行地区号
                    zbankName: me.$zbankInput.select2('data').name,
                    zbankNo: me.$zbankInput.select2('data').value

                }),
                success: function () {
                    me.$zbankNameModifiedRow.find('.zbankNameModifiedTxt').text(me.$zbankInput.select2('data').name);
                    me.$zbankNameModifiedRow.find('.zbankNameModifiedTxt').data('zbankNo', me.$zbankInput.select2('data').value);
                    me.$zbankRow.find('.label-color').text('原开户支行');
                    doCancelEditZbank(me);
                    $zBankTip && $zBankTip.hide();

                }
            });
            return false;
        },

        cancelUpdateZbank: function () {
            doCancelEditZbank(this);
        },

        rejectSubmit: function (e) {
            e.preventDefault();

            var me = this;
            var $el = me.$el;
            if($el.find('.checkable.checked').length < 1 && !$el.find('input[name="needAdd"]').is(':checked')){
                Opf.alert('请勾选错误信息！<br><br> 如果需要补充信息，请勾选拒绝按钮上方的“仍需补充资料”。');
            } else if(this.$rejectForm.valid()) {
                Opf.UI.busyText(me.$rejectSubmitBtn, true);
                Opf.ajax({
                    url: url._('task.refuse', {id:me.data.taskId}),
                    type: 'PUT',
                    data: JSON.stringify(me.getRejectSubmitValues()),
                    success: function (resp) {
                        if(resp.success !== false) {
                            var tabId = me.$el.closest('[tabmainbody]').attr('id');
                            App.closeTabViewById(tabId);

                            me.goback();
                        }
                    },
                    error: function () {
                        Opf.alert('提交失败');
                    },
                    complete: function () {
                        Opf.UI.busyText(me.$rejectSubmitBtn, false);
                    }
                });
            }

            return false;
        },

        getRejectSubmitValues: function () {
            var errorMark = {};

            var expreg = /^extra(\d+)/;
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
                        needExtra = isCheck;//如果有某张补充的照片被拒绝才会有`extraImages`这个字段
                    }

                }else if(isCheck){
                    errorMark[name] = 0;
                }
            });

            needExtra && (errorMark.extraImages = extraImg);
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

        initialize: function (options) {
            this.data = options.data;
            this.taskModel = options.taskModel;
            this.tasks = options.tasks;
        },

        templateHelpers: {
            mchtRank: function(){
                return this.mcht.mchtRank;
            },
            canGetHeighterLevel: function () {
                var mchtData = this.mcht || {};

                return mchtData.kind === 'B1' && (mchtData.rentAgreement || mchtData.license);
            },
            getSubType: function(){
                return getSubType(this);
            }
        },

        serializeData: function () {
            return this.data;
        },

        renderMchtInfo: function () {
            var me = this;
            var $el = this.$el;
            var mchtInfoView = new MchtInfoView({
                data: this.data,
                convertor: function (item) {
                    var check =  $el.find('.checkable[name=' + item.name + ']').hasClass('checked');
                    item.check = check;
                    console.log(item.name, check);
                }
            });
            mchtInfoView.render();

            // 审核界面上的查看大图的弹框点击“确定”，根据 是否勾选“照片有误” 而设置 审核界面上的缩略图的'红叉' 是否勾上
            // mchtInfoView.on('imgDialog.sure', function (imgCheckMap) {
            //     // 审核页面上的缩略图
            //     var $imgWrap = $el.find('.img-wrap');
            //     $imgWrap.each(function () {
            //         var $this= $(this);
            //         var name = $this.attr('name');
            //         var isChecked = imgCheckMap[name];

            //         me.toggleCheck($this, isChecked);
            //     });


            // });

            mchtInfoView.on('gallery.close', function (galleryView) {
               galleryView.$el.find(':checkbox').each(function () {
                   var name = $(this).attr('name');
                   var $checkable = $el.find('.checkable[name="'+name+'"]');
                   me.toggleCheck($checkable, $(this).prop('checked'));
               });
            });

            this.$el.find('.info-board-wrap').html(mchtInfoView.$el);

            this.showPreCheckResult();

        },

        //渲染复选框
        renderCheckBox: function(data){
            var me = this;
            me.$el.find('.checkable').each(function () {
                me.appendCheckBox(this);
            });
        },
        showPreCheckResult: function () {
            //判断this.data.preview中的数据
            //preview 的值有可能为空，所以做一下保护
            //如果为空，默认status的值为'2'(为验证)
            var me = this;
            var preview = this.data.preview || {};
            var mchtData = this.data.mcht;

            var PREVIEW_LIST = [
                {
                    type: 'card',
                    forName: 'accountNo',
                    status: preview.cardStatus || '2', label: '账号',
                    url: url._('task.valid.account'),
                    paramData: {
                        mchtNo: mchtData.mchtNo,
                        accountNo: mchtData.accountNo,
                        idCard: mchtData.cardNo,
                        bankCode: mchtData.bankCode
                    }
                },{
                    type: 'id',
                    forName: 'userCardNo',
                    status: preview.idStatus || '2', label: '身份证信息',
                    url: url._('task.valid.idcard'),
                    paramData: {mchtNo: mchtData.mchtNo, idCard: mchtData.cardNo}
                },{
                    forName: 'mchtName',
                    status: preview.licsStatus || '2', label: '商户名称',
                    url: url._('task.valid.mchtname'),
                    paramData: {
                        mchtNo: mchtData.mchtNo,
                        mchtName: encodeURIComponent(encodeURIComponent(mchtData.mchtName)),
                        licNo: mchtData.licNo || ''
                    }
                }
            ];

            if(preview) {
                _.each(PREVIEW_LIST, function (item) {
                    me.setPreviewItemResult(item);
                });
            }

            //在相应地方append相应内容
            // <span class="label label-warning">xx可能有误</span>
            // <span class="label label-success">xx已验证</span>
            // <span class="label ">xx未验证</span>
        },

        setPreviewItemResult: function(options){
            var me = this;
            var forName = options.forName;
            var $afterTarget = me.$el.find('.'+ forName +'-row');
            var $resultRow = $(generateRow(options, me.data)).addClass(forName + '-status-row');

            if(options.url && options.status == 2){
                // 对未验证的状态加上按钮，点击请求后台验证
                var $checkBtn = $('<a class="check-result">验证</a>');

                $resultRow.find('.desc').append($checkBtn);

                $checkBtn.on('click', function () {
                    Opf.UI.setLoading($resultRow);
                    Opf.ajax({
                        type:'GET',
                        autoMsg: false,
                        url: options.url,
                        data: options.paramData,
                        success: function (data) {
                            $resultRow && $resultRow.length && Opf.UI.setLoading($resultRow, false);
                            me.updatePreviewResult(options, data.status);
                        }
                    });
                });

            }

            $afterTarget.after($resultRow);
        },

        updatePreviewResult: function (options, status) {
            var resultRowClsName = options.forName + '-status-row';

            this.$el.find('.'+resultRowClsName).remove();
            this.setPreviewItemResult({
                forName: options.forName,
                label: options.label,
                status: status
            });
        },

        onRender: function () {
            var me = this, ui = me.ui, $el = me.$el;
            var mccGroupVal = Opf.get(me.data, 'mcht.group')||"";
            var mccVal = Opf.get(me.data, 'mcht.mcc')||"";
            var firstGroupMCC = !_.isEmpty(mccGroupVal || mccVal);

            this.renderMchtInfo();
            this.renderCheckBox(me.data);

            $el.find('.t1-level').remove();
            $(document.body).click(function(e) {
                if(me.$history && me.$history.is(':visible') &&
                    (!$(e.target).closest('.history-wrapper').length)) {

                    me.$history.hide();
                    console.log($(e.target).attr('class'));
                }
            });
            // $el.find('.checkable').append($('<i class="check-trigger icon-ok" ></i>'));

            this.$rejectFormDialog = $el.find('.reject-form-wrapper');
            this.$passFormDialog = $el.find('.pass-form-wrapper');
            this.$rejectForm = $el.find('.reject-form');
            this.$passForm = $el.find('.pass-form');
            this.$rejectTrigger = $el.find('.reject-trigger');
            this.$rejectSubmitBtn = $el.find('.reject-submit');
            this.$passSubmitBtn = $el.find('.pass-submit');
            //this.$rejectReason = $el.find('.reject-reason');

            this.$zbankRow = $el.find('.zbankName-row');

            if(!this.data.mcht || !this.data.mcht.zbankNo) {
                this.$zbankNameModifiedRow = $([
                    '<div class="row row-text-font row-margintop zbankNameModified-row">',
                        '<div class="col-lg-3 label-color">开户支行</div>',
                        '<div class="col-lg-9">',
                            '<span class="zbankNameModifiedTxt"></span>',
                        '</div>',
                    '</div>'
                ].join(''));
                this.$zbankTipRow = $([
                    '<div class="row row-text-font row-margintop zbank-tip-row" >',
                        '<div class="col-lg-3 label-color"></div>',
                        '<div class="col-lg-5 hint-color">提示：支行名称可能有误</div>',
                        '<div class="col-lg-4 update-bank">修改开户支行名称</div>',
                    '</div>'
                ].join(''));
                this.$zbankTipRow.insertAfter(this.$zbankRow);
                this.$zbankNameModifiedRow.insertAfter(this.$zbankRow).hide();

            }

            this.attachValidation();
            this.renderTitle();

            //审核隐藏POS部分
            //this.$el.find('.pos-section').hide();

            if(getSubType(me.data) == "102" || getSubType(me.data) == "107"){ //新增商户，新增二维码商户
                CommonUI.mccSection(ui.mccGroup, ui.mcc, mccGroupVal, mccVal);
                CommonUI.tNDiscId(ui.tNDiscId);

                ui.tNDiscId.select2({ placeholder: '- 选择费率模型 -' });
                ui.tNDiscId.change(function(){
                    var validator = me.passFormValidator;
                        validator.element($(this));
                });

                ui.category.change(function(){
                    var self = $(this);
                    var type = self.val();

                    var tNDiscIdTarget = ui.tNDiscId.siblings('.select2-container');
                        tNDiscIdTarget.toggle(type=="1");

                    if(type=="0"){
                        try{
                            tNDiscIdTarget.removeClass('error');
                            tNDiscIdTarget.siblings('label[for="tNDiscId"]').remove();
                        }catch(e){}
                    }
                });

                //添加校验规则
                this.passFormValidator = this.$passForm.validate({
                    rules: {
                        grpBudID: {
                            required: true
                        },
                        businessId: {
                            required: true
                        },
                        group: {
                            required: true
                        },
                        mcc: {
                            required: true
                        },
                        tNDiscId: {
                            required: true
                        }
                    }
                });

                // 根据经营范围带出MCC
                var grpBudID = Opf.get(me.data, "mcht.grpBudID")||"";
                var businessId = Opf.get(me.data, "mcht.businessId")||"";
                ModuleUI.mccSection(ui.groupMcc, ui.businessMcc, grpBudID, businessId);
                ui.businessMcc.on('change.mcc', function(){
                    if(firstGroupMCC) {
                        firstGroupMCC = false;
                    } else {
                        _.defer(function() {
                            var mccCode = ui.businessMcc.attr("data-mcc");
                            if(!_.isEmpty(mccCode)) {
                                Opf.ajax({
                                    url: url._('options.mccCode', {mccCode:mccCode}),
                                    type: 'GET',
                                    success: function(resp){
                                        if(!!resp){
                                            ui.mcc.data('ajaxselect.obj', {id: resp.mccValue, text: resp.mccName});
                                            ui.mccGroup.val(resp.grpValue).trigger('change');
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }

            ui.countDownOpt.hide();
            if(Ctx.avail('menu.wkb.mchttask.countDown')){//如果是商审用户 才会显示倒计时
                var first = 0, seconds = 0;//first分 seconds秒
                Opf.ajax({
                    type: 'GET',
                    url: url._('task.mcht.countDown', {id: me.data.taskId}),//me.taskModel.id
                    async: false,
                    success: function (resp) {
                        if(resp.success){
                            var arr = resp.data.timeOut.split(':');
                            first = arr[0];
                            seconds = arr[1];
                        }
                    }
                });
                ui.countDownOpt.show();

                _.defer(function(){ CommonUI.countDownOption(me, first, seconds) });
            }
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

        appendCheckBox: function (el) {
            $(el).append($('<i class="check-trigger icon-ok" ></i>'));
        },
        // 放回任务
        putBackTask: function () {
            var me = this;
            Opf.UI.busyText(me.$el.find('.put-back-task'));
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
                    Opf.UI.busyText(me.$el.find('.put-back-task'), false);
                }
            });
        },

        goToShowView: function (data) {
            var me = this;

            require(['app/oms/wkb/task/show/show-view'], function (ShowView) {
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

        attachValidation: function () {
            this.$rejectForm.validate({
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

        renderTitle: function () {
            var $caption = this.$el.find('.caption:first');
            var title = TITLE_MAP[this.data.mcht.kind];

            $caption.text(title);
        },

        popTaskInfo: function () {
            var me = this;
            setTimeout(function(){
                if(me.$history){
                        me.$history.show();
                }
                else{
                    me.doPopTaskInfo();
                }
            }, 10);
        },

        doPopTaskInfo: function () {
            var me = this;

            var $historyTrigger = me.$el.find('.history-trigger');
            var mchtTaskInfo = $.extend(me.data.taskInfo, {type: 'user'});
            var historyView = new HistoryView(mchtTaskInfo).render();

            me.$history = historyView.$el;
            $historyTrigger.append(me.$history);
        },

        popRejectForm: function () {
            this.$passFormDialog.hide();
            this.$rejectFormDialog.toggle();
            var isVisible = this.$rejectFormDialog.is(':visible');
            isVisible && this.renderReject();
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        },

        reject: function () {
            alert('reject');
        },

        pass: function (e) {
            this.$rejectFormDialog.hide();

            if(this.canPass()){
                this.$passFormDialog.toggle();
            } else{
                Opf.alert({title:'支行名称可能有误', message:'请修改后再确认通过！'});
            }
        },

        canPass: function(){
            var me = this;
            return (this.data.mcht && this.data.mcht.zbankNo) || me.$zbankNameModifiedRow.find('.zbankNameModifiedTxt').data('zbankNo') /* 当审核员点击确认修改时应该会获取到 zbankNo*/;
        },

        getExtraValues: function(){
            var me = this, ui = me.ui, obj = {};
            if(getSubType(me.data)=="102" || getSubType(me.data)=="107"){
                obj.businessId = ui.businessMcc.val();
                obj.mchtNo = me.data.mcht.mchtNo;
                obj.group = ui.mccGroup.val() || me.data.group;
                obj.mcc = ui.mcc.select2('data') && ui.mcc.select2('data').id;
                obj.tNDiscId = ui.tNDiscId.siblings('.select2-container').is(':visible')? ui.tNDiscId.select2('data') && ui.tNDiscId.select2('data').id:"";
                obj.category = ui.category.filter(':checked').val();
            }
            return obj;
        },

        passSubmit: function (e) {
            e.preventDefault();

            var me = this, ui = me.ui;
            var succRemk = this.$passForm.find('textarea[name="successRemark"]').val() || '';
            var level = this.$passForm.find('select[name="riskLevel"]').val() || '';

            if(me.data.mcht.idNoIsRepeat == 1 && succRemk.trim() == ""){
                Opf.alert('标识[进件黑名单、证件号重复]的商户，必须填写备注内容!');
                return;
            }
            if(me.data.mcht.licenceNoIsRepeat == 1 && succRemk.trim() == ""){
                Opf.alert('标识[进件黑名单、证件号重复]的商户，必须填写备注内容!');
                return;
            }
            if(me.data.mcht.phoneNoIsIn == 1 && succRemk.trim() == ""){
                Opf.alert('标识[进件黑名单、证件号重复]的商户，必须填写备注内容!');
                return;
            }
            if(me.data.mcht.idNoIsIn == 1 && succRemk.trim() == ""){
                Opf.alert('标识[进件黑名单、证件号重复]的商户，必须填写备注内容!');
                return;
            }
            if(me.data.mcht.licenceNoIsIn == 1 && succRemk.trim() == ""){
                Opf.alert('标识[进件黑名单、证件号重复]的商户，必须填写备注内容!');
                return;
            }
            if(me.data.mcht.orgCodeIsIn == 1 && succRemk.trim() == ""){
                Opf.alert('标识[进件黑名单、证件号重复]的商户，必须填写备注内容!');
                return;
            }
            if(me.data.mcht.bankCardNoIsIn == 1 && succRemk.trim() == ""){
                Opf.alert('标识[进件黑名单、证件号重复]的商户，必须填写备注内容!');
                return;
            }
            if(getSubType(me.data)=="102" || getSubType(me.data)=="107"){ //新增商户
                if(me.data.mcht.remark && me.data.mcht.remark.indexOf("标准")>-1 && ui.category.filter(':checked').val()==0){
                    Opf.confirm("商户可能期望为直联商户，是否继续审核为间联商户？", function(isOk){
                        if(isOk){
                            if(doPassSubmitValidate() === false) return;
                            doPassSubmit();
                        }
                    });
                } else {
                    if(doPassSubmitValidate() === false) return;
                    doPassSubmit();
                }
            } else {
                doPassSubmit();
            }

            function doPassSubmitValidate(){
                var validator = me.passFormValidator;
                var isValid = validator.form();
                var isValid2 = true;

                if(ui.category.filter(':checked').val() == 1){
                    isValid2 = validator.element(ui.tNDiscId);
                }

                return isValid && isValid2;
            }

            function doPassSubmit(){
                Opf.UI.busyText(me.$passSubmitBtn);
                Opf.ajax({
                    type: 'PUT',
                    url: url._('task.pass', {id:me.data.taskId}),
                    data: JSON.stringify(_.extend({
                        id: me.data.taskId,
                        successRemark: succRemk,
                        riskLevel: level,
                        brhAddType: '',
                        code: '',
                        type: 'mcht'
                    }, me.getExtraValues())),
                    successMsg: '提交成功',
                    success: function (resp) {
                        if(resp.success !== false) {
                            var tabId = me.$el.closest('[tabmainbody]').attr('id');
                            App.closeTabViewById(tabId);
                            me.goback();
                        }
                    },
                    complete: function () {
                        Opf.UI.busyText(me.$passSubmitBtn, false);
                    }
                });
            }
        },

        clickCheckBox : function(e) {
            var $checkable = getCheckable(e);

            if(!$checkable.length) return;

            this.toggleCheck($checkable, !$checkable.hasClass('checked'));

            //license， certFlag，licNo触发勾选，审核的时候。
            if($(e.currentTarget).parent().attr('name') == 'certFlag' && this.data.taskInfo && this.data.taskInfo.subType == '207' ||
                $(e.currentTarget).parent().attr('name') == 'license' && this.data.taskInfo && this.data.taskInfo.subType == '207' ||
                $(e.currentTarget).parent().attr('name') == 'licNo' && this.data.taskInfo && this.data.taskInfo.subType == '207'){
                this.licClickAllHandle($(e.currentTarget).parent().attr('name'));
            }
        },

        licClickAllHandle: function(licName){
            var me = this.$el;
            _.each($(me).find('[name="license"], [name="certFlag"]:eq(0), [name="licNo"]'), function(v){
                if(licName != $(v).attr('name') && $(v).hasClass('checked')){
                    $(v).removeClass('checked');
                    $(v).find('.check-trigger').removeClass('icon-remove');
                }
                else if(licName != $(v).attr('name') && !$(v).hasClass('checked')){
                    $(v).addClass('checked');
                    $(v).find('.check-trigger').addClass('icon-remove');
                }
            });
        },

        addPhotoEnterClass: function(e) {
            if (!e) {
                return;
            }

            var selected = $(e.target);
            if(selected.attr('selected')) {
                return;
            }
            selected.addClass('mouse-enter-photo');
            selected.append('<i class="icon-check-empty"></i>');
        },

        removePhotoLeaveClass: function(e) {
            if (!e) {
                return;
            }

            var selected = $(e.target);
            if(selected.attr('selected')) {
                return;
            }
            selected.removeClass('mouse-enter-photo');
            selected.find('i').remove();
        }
    });

    function getCheckable (e) {
        return $(e.target ? e.target : e).closest('.checkable');
    }


    function doCancelEditZbank (me) {
        if (me.$zbankNameModifiedRow.find('.zbankNameModifiedTxt').text()) {
            me.$zbankRow.hide();
            me.$zbankNameModifiedRow.show();
        }
        me.$zbankTipRow && me.$zbankTipRow.show();
        me.$editZbankForm && me.$editZbankForm.hide();
    }

    function renderZbankEditGroup (me) {
        if(me.isZbankEditGroupRendered) return;

        var $editZbankForm = me.$editZbankForm = $([
        '<form class="edit-zbank-form" onsubmit="return false;">',
            '<div class="row row-text-font row-margintop zbankName-row">',
                '<div class="col-lg-3 label-color">修改为</div>',
                '<div class="col-lg-3 zbank-edit-group">',
                    '<select name="province"></select>',
                '</div>',
                '<div class="col-lg-3 zbank-edit-group">',
                    '<select name="city"></select>',
                '</div>',
                '<div class="col-lg-3 zbank-edit-group">',
                    '<select name="country"></select>',
                '</div>',
            '</div>',
            '<div class="row zbank-row zbank-edit-group">',
                '<div class="col-lg-3">&nbsp;</div>',
                '<div class="col-lg-9">',
                    '<input class="zbank-input" name="zbankName" placeholder="输入支行名称">',
                    '<input type="hidden" name="zbankNo">',
                '</div>',
            '</div>',
            '<div class="row zbank-btn-row zbank-edit-group">',
                '<div class="col-lg-3">&nbsp;</div>',
                '<div class="col-lg-9">',
                    '<button class="btn btn-sm btn-success js-confirm-update-zbank">确认修改</button>',
                    '<button class="btn btn-sm btn-danger js-cancel-update-zbank">取消修改</button>',
                '</div>',
            '</div>',
        '</form>'
        ].join(''));

        me.$zbankRow.after($editZbankForm);
        CommonUI.address(
            $editZbankForm.find('[name="province"]'),
            $editZbankForm.find('[name="city"]'),
            $editZbankForm.find('[name="country"]')
        );

        me.$regionCode = $editZbankForm.find('[name="country"]');

        var $zbankInput = me.$zbankInput = $editZbankForm.find('.zbank-input');

        // //TODO 银行号一定有？？
        // createZbankTypehead(me, $zbankInput, me.$regionCode, me.data.mcht.bankCode);
        addSelect2(me, $zbankInput, me.$regionCode, me.data.mcht.bankCode);

        Opf.Validate.addRules($editZbankForm,{
            rules: {
                province: {required: true},
                city: {required: true},
                country: {required: true},
                zbankName: {required: true}
            }
        });

        me.isZbankEditGroupRendered = true;
    }

    // function createZbankTypehead (me, $el, $regionCode, bankNo) {

    //     function replaceUrl (url, query) {
    //         return url + '?' + $.param({
    //             kw: encodeURIComponent($el.val()),
    //             regionCode: $regionCode.val(),
    //             bankCode: bankNo,
    //             maxLength: MAX_LENGTH
    //         });
    //     }

    //     var zbankCommonUI = me.zbankCommonUI = CommonUI.zbankName($el, {
    //         model: {
    //             remote: {
    //                 replace: replaceUrl
    //             }
    //         },
    //         events: {
    //             'typeahead:selected': function(e, datum) {
    //                 me.$zbankInput.data('zbankNo', datum.value);
    //             }
    //         }
    //     });
    // }


    function addSelect2(me, $el, $regionCode, bankNo) {
        $el.select2({
            placeholder: '请选择支行',
            minimumInputLength: 1,
            width: '100%',
            ajax: {
                type: "get",
                autoMsg: false,
                url: 'api/system/options/zbank-name',
                dataType: 'json',
                data: function (term, page) {
                    return {
                        kw: encodeURIComponent(term),
                        regionCode: $regionCode.val(),
                        bankCode: bankNo,
                        maxLength: MAX_LENGTH
                    };
                },
                results: function (data, page) {
                    return {
                        results: data
                    };
                }
            },
            initSelection: function(element, callback){

            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data, container, query, escapeMarkup){
                return "<div class='select-result'>" + data.name + "</div>";
            },
            formatSelection: function(data, container, escapeMarkup){
                return data.name;
            },
            formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
            formatInputTooShort: function (input, min) {
                var n = min - input.length;
                return "请输入至少 " + n + "个字符";
            },
            formatSearching: function () {
                return "搜索中...";
            },
            adaptContainerCssClass: function(classname){
                return classname;
            },
            escapeMarkup: function (m) {
                return m;
            }
        });
    }

    function showEditZbankform (me) {
        var $el = me.$el;
        me.$zbankRow.show();
        me.$zbankNameModifiedRow.hide();
        me.$zbankTipRow && me.$zbankTipRow.hide();

        renderZbankEditGroup(me);

        me.$editZbankForm && me.$editZbankForm.show();
    }

    function generateRow (options, data){
        var status = options.status;
        var desc = options.label;
        var type = options.type;
        var previewItem = STATUS_MAP[status];
        console.log("正在获取", type||"未知", "的审核结果");
        var rowTpl = [
            '<div class="row row-text-font row-margintop pre-check-result">',
                '<div class="col-lg-3"></div>',
                '<div class="col-lg-9 desc">',
                    '<span class="label ' + previewItem.cls + '">',
                        '<i class="icon '+ previewItem.icon +'"></i>',
                        previewItem.formatter?
                            previewItem.formatter(data||{}, desc, type):
                            (desc||"") + previewItem.descr,
                    '</span>',
                '</div>',
            '</div>'
        ].join('');

        return rowTpl;
    }

    //倒计时 控件
    function countDownOption(me, first, seconds){
        var txt = '0' + first + ' : ' + (seconds == 0 ? '00' : seconds);
        me.$el.find('.div_countDown').html(
            _.template('请及时完成审核，否则该任务将被自动取消 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color: #ff0000;">任务审核剩余时间：<b>'
            + txt + '</b></font>'));
        seconds--;

        if(seconds < 10 && seconds > 0){
            seconds = '0' + seconds;
            setTimeout(function(){
                countDownOption(me, first, seconds)
            }, 1000);
        }
        else if(seconds == 0){
            first = 0;
            setTimeout(function(){
                countDownOption(me, 0, 0)
            }, 1000);
        }
        else if(first == 1){
            setTimeout(function(){
                countDownOption(me, first, seconds)
            }, 1000);
        }
    }

    return View;

});