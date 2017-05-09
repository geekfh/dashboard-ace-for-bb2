define([
    'tpl!app/oms/wkb/bankno-task/perform/templates/bankno-perform.tpl',
    'assets/scripts/fwk/component/linkage',
    'app/oms/wkb/bankno-task/perform/bankno-info',
    'app/oms/wkb/branch-task/show/history-view',
    'common-ui',
    'moment.override'
], function (tpl, Linkage, InfoView, HistoryView) {
    var View = Marionette.ItemView.extend({
        className: 'common-task perform-task bankno-task',

        template: tpl,

        events: {
            'click .js-task-info':                'popTaskInfo',
            'click .js-back':                     'goback',

            'click .reject-trigger':              'popRejectForm',
            'click .js-pass':                     'popPassForm',

            'click .reject-submit':               'rejectSubmit',
            'click .pass-submit':                 'passSubmit',

            'click .check-trigger':               'clickCheckBox',

            // 修改有误的支行相关事件
            'click .update-bank':                 'editZBank',
            'click .js-confirm-update-zbank':     'submitUpdateZbank',
            'click .js-cancel-update-zbank':      'cancelEditZbank'

            //
            //'click [name="ck_mchtType"]': 'popCkMchtType'
        },

        ui: {
            rejectFormDialog: '.reject-form-wrapper',
            passFormDialog: '.pass-form-wrapper',
            rejectForm: '.reject-form',
            passForm: '.pass-form',
            rejectSubmitBtn: '.reject-submit',
            passSubmitBtn: '.pass-submit',
            rejectContainer: '.reject-container',
            countDownOpt: '.div_countDown'
        },

        initialize: function (options) {
            this.data = options.data;
            this.taskInfo = options.data.taskInfo;
            this.taskModel = options.taskModel;
            this.tasks = options.tasks;
        },

        templateHelpers: {
            canGetHeighterLevel: function () {
                var acctData = this.acctInfo || {};

                return acctData.kind === 'B1' && (acctData.rentAgreement || acctData.license);
            }
        },

        serializeData: function () {
            return this.data;
        },

        onRender: function () {
            var me = this;
            this.renderBanknoInfo();

            this.attachValidation();

            this.checkZbankInfo();

            this.$el.find('.checkable').append($('<i class="check-trigger icon-ok" ></i>'));

            this.$el.find('.js-back').hide();

            //判断勾选控件
            this.renderMchtTypeCheckBox();

            //倒计时
            this.ui.countDownOpt.hide();
            if(Ctx.avail('menu.wkb.mchttask.countDown')){//如果是商审用户 才会显示倒计时
                var first = 0, seconds = 0;//first分 seconds秒
                Opf.ajax({
                    url: url._('task.mcht.countDown', {id: me.taskModel.id}),
                    type: 'GET',
                    async: false,
                    success: function (resp) {
                        if(resp.success){
                            var arr = resp.data.timeOut.split(':');
                            first = arr[0];
                            seconds = arr[1];
                        }
                    }
                });
                this.ui.countDownOpt.show();
                _.defer(function(){ CommonUI.countDownOption(me, first, seconds) });
            }

        },

        /**
         * author: yoyo
         * date: 2017/02/28
         * describe: 判断是否选中[华势通道]，没有勾选，无法审核 checkbox是ck_mchtType，disabled控件是拒绝和通过审核
         * */
        renderMchtTypeCheckBox: function (){
            if(this.$el.find('[name="ck_mchtType"]').length > 0){
                var ck = this.$el.find('[name="ck_mchtType"]').is(':checked');
                if(!ck){
                    this.$el.find('.js-pass').attr('disabled','disabled');
                    this.$el.find('.reject-trigger').attr('disabled','disabled');
                }
            }
        },
        //点击[华势通道]按钮判断
        popCkMchtType: function () {
            var ck = this.$el.find('[name="ck_mchtType"]').is(':checked');
            if(ck){
                this.$el.find('.js-pass').removeAttr('disabled','disabled');
                this.$el.find('.reject-trigger').removeAttr('disabled','disabled');
            }
            else{
                this.$el.find('.js-pass').attr('disabled','disabled');
                this.$el.find('.reject-trigger').attr('disabled','disabled');
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

        renderBanknoInfo: function () {
            var me = this, $el = me.$el;

            var showInfoView = new InfoView({
                data: me.data.acctInfo,
                convertor: function (item) {
                    item.check = !!$el.find('.checkable[name='+ item.name +']').hasClass('checked');
                }
            }).render();
            showInfoView.on('gallery.close', function (galleryView) {
                galleryView.$el.find(':checkbox').each(function () {
                    var name = $(this).attr('name');
                    var isChecked = $(this).prop('checked');
                    var $checkable = $el.find('.checkable[name="'+name+'"]');
                    $checkable.toggleClass('checked', isChecked);
                    $checkable.find('i.check-trigger').toggleClass('icon-remove', isChecked);
                });
            });

            me.$el.find('.info-board-wrap').html(showInfoView.$el);
        },

        attachValidation: function () {
            var me = this;
            me.ui.rejectForm.validate({
                rules: {
                    reason: {
                        required: true
                    },
                    successRemark: {
                        required: true
                    }
                }
            });

            $(document.body).click(function(e) {
                if(me.$history && me.$history.is(':visible') &&
                    (!$(e.target).closest('.history-wrapper').length)) {

                    me.$history.hide();
                    console.log($(e.target).attr('class'));
                }
            });
        },

        checkZbankInfo: function () {
            var $el = this.$el;
            var acctInfo = this.data.acctInfo || {};
            if(!acctInfo.zbankNo) {
                var $zbankNameRow = $el.find('[name="zbankName-row"]');
                var $zbankTip = $(getZbankTipTpl());
                var $zbankEditRow = $(getZbankEditTpl());

                $zbankNameRow.after($zbankTip).after($zbankEditRow);
            }
        },

        editZBank: function () {
            var $el = this.$el;
            var $editZbankForm = this.$el.find('.edit-zbank-form');
            var $regionWrap = $editZbankForm.find('.region-wrap');
            
            var $zbankModifiedRow = $el.find('.zbankNameModified-row');
            var $zbankTipRow = $el.find('.zbank-tip-row');

            $regionWrap.show(); // 显示支行省市区
            $zbankModifiedRow.hide(); 
            $zbankTipRow.hide(); // 隐藏错误提示

            this.renderZbankEditGroup();

            $editZbankForm && $editZbankForm.show();

        },

        renderZbankEditGroup: function () {
            if(this.zbankEditGroupIsRendered) {return;}
            var $zbankNameRow = this.$el.find('[name="zbankName-row"]');
            var $editZbankForm = $(getZbankSelectTpl());

            $zbankNameRow.after($editZbankForm);

            // 支行省市区联动
            var $province = $editZbankForm.find('[name="province"]');
            var $city = $editZbankForm.find('[name="city"]');
            var $regionCode = $editZbankForm.find('[name="country"]');
            var $zbankInput = $editZbankForm.find('.zbank-input');

            CommonUI.address($province,$city,$regionCode);


            // //TODO 银行号一定有？？
            addSelect2(this, $zbankInput, $regionCode, this.data.acctInfo.bankCode);

            Opf.Validate.addRules($editZbankForm,{
                rules: {
                    province: {required: true},
                    city: {required: true},
                    country: {required: true},
                    zbankName: {required: true}
                }
            });

            this.zbankEditGroupIsRendered = true;
        },

        submitUpdateZbank: function () {
            var me = this;
            var $el = this.$el;
            var $editZbankForm = $el.find('.edit-zbank-form');
            var $zbankModifiedRow = $el.find('.zbankNameModified-row');
            var $zBankTipLabel = $el.find('.zbank-tip-row').find('.hint-color');
            var $zbankNameRow = $el.find('[name="zbankName-row"]');
            
            var $regionCode = $editZbankForm.find('[name="country"]');
            var $zbankInput = $editZbankForm.find('.zbank-input');


            if($editZbankForm && !$editZbankForm.valid()) {return;}

            Opf.ajax({
                type: 'PUT',
                url: url._('task.updatezbank', {id: me.data.taskId}),
                data: JSON.stringify({
                    zbankCode: $regionCode.val(),//支行地区号
                    zbankName: $zbankInput.select2('data').name,
                    zbankNo: $zbankInput.select2('data').value
                    
                }),
                success: function () {
                    var $zbankNameModifiedTxt = $zbankModifiedRow.find('.zbankNameModifiedTxt');

                    $zbankNameModifiedTxt.text($zbankInput.select2('data').name);
                    $zbankNameModifiedTxt.data('zbankNo', $zbankInput.select2('data').value);
                    $zbankNameRow.find('.info-item-text').text('原开户支行:');

                    me.cancelEditZbank();

                    $zBankTipLabel && $zBankTipLabel.hide();

                }
            });
            return false;
        },

        cancelEditZbank: function () {
            var $el = this.$el;
            var $editZbankForm = $el.find('.edit-zbank-form');
            var $regionWrap = $editZbankForm.find('.region-wrap');

            var $zbankModifiedRow = $el.find('.zbankNameModified-row');
            var $zbankTipRow = $el.find('.zbank-tip-row');

            var zbankNameModifiedTxt = $zbankModifiedRow.find('.zbankNameModifiedTxt').text();

            if (zbankNameModifiedTxt) {
                $regionWrap.hide();
                $zbankModifiedRow.show();
            }

            $zbankTipRow.show();

            $editZbankForm.hide();
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
            var historyView = new HistoryView(me.taskInfo).render();

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

        canPass: function () {
            // 如果有支行号才允许通过弹出通过审核
            var $el = this.$el;
            return (this.data.acctInfo && this.data.acctInfo.zbankNo) || $el.find('.zbankNameModifiedTxt').data('zbankNo');
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        },

        passSubmit: function (e) {
            e.preventDefault();
            var me = this;
            var succRemk = this.ui.passForm.find('textarea[name="successRemark"]').val() || '';

            Opf.UI.busyText(me.ui.passSubmitBtn);
            Opf.ajax({
                type: 'PUT',
                url: url._('task.pass', {id:me.data.taskId}),
                data: JSON.stringify({
                    id: me.data.taskId,
                    successRemark: succRemk
                }),
                successMsg: '提交成功',
                success: function () {
                    Opf.Toast.success('操作成功');
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

        rejectSubmit: function (e) {
            e.preventDefault();
            var me = this;
            var $el = me.$el;

            console.log(me.getRejectSubmitValues());

            if($el.find('.checkable.checked').length < 1 && !$el.find('input[name="needAdd"]').is(':checked')){
                Opf.alert('请勾选错误信息！<br><br> 如果需要补充信息，请勾选拒绝按钮上方的“仍需补充资料”。');
            }else if(me.ui.rejectForm.valid()) {

                Opf.UI.busyText(me.ui.rejectSubmitBtn, true);
                Opf.ajax({
                    type: 'PUT',
                    url: url._('task.refuse', {id:me.data.taskId}),
                    data: JSON.stringify(me.getRejectSubmitValues()),
                    success: function () {
                        Opf.Toast.success('操作成功');
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
            this.$el.find('.checkable').each(function () {
                var name = $(this).attr('name');
                var isCheck = $(this).hasClass('checked');
                isCheck && (errorMark[name] = 0);

            });
            var obj = {
                errorMark: errorMark,
                refuseReason: this.ui.rejectContainer.find('textarea[name="reason"]').val()||""
            };
            var linkage = this.ui.rejectContainer.data('linkage');
            !!linkage && (_.extend(obj, {refuseId: linkage.key}));

            console.info('<<<<getRejectSubmitValues ', obj);

            return obj;
        },

        clickCheckBox : function(e) {
            var $checkable = getCheckable(e);

            if(!$checkable.length) {return;}

            this.toggleCheck($checkable, !$checkable.hasClass('checked'));
        },

        toggleCheck : function ($checkable, isChecked) {
            $checkable.toggleClass('checked', isChecked);
            $checkable.find('i.check-trigger').toggleClass('icon-remove', isChecked);
        }
    });

    function getCheckable (e) {
        return $(e.target ? e.target : e).closest('.checkable');
    }

    function getZbankTipTpl () {
        var zbankTipTpl = [
            '<div class="row row-text-font row-margintop zbank-tip-row" >',
                '<div class="col-lg-3 label-color"></div>',
                '<div class="col-lg-5 hint-color">提示：支行名称可能有误</div>',
                '<div class="col-lg-4 update-bank">修改开户支行名称</div>',
            '</div>'
        ].join('');

        return zbankTipTpl;
    }

    function getZbankEditTpl () {
        var zbankTpl = [
            '<div class="row row-text-font row-margintop zbankNameModified-row" hidden>',
                '<div class="col-lg-4 info-item-text">开户支行:</div>',
                '<div class="col-lg-8">',
                  '<span class="zbankNameModifiedTxt"></span>',
                '</div>',
            '</div>'
        ].join('');

        return zbankTpl;
    }

    function getZbankSelectTpl () {
        var zbankSelectTpl = [
            '<form class="edit-zbank-form" onsubmit="return false;">',
                '<div class="row row-text-font row-margintop region-wrap">',
                    '<div class="col-lg-3 info-item-text">修改为:</div>',
                    '<div class="col-lg-3 zbank-edit-group">',
                        '<select name="province" style="width: 100%"></select>',
                    '</div>',
                    '<div class="col-lg-3 zbank-edit-group">',
                        '<select name="city" style="width: 100%"></select>',
                    '</div>',
                    '<div class="col-lg-3 zbank-edit-group">',
                        '<select name="country" style="width: 100%"></select>',
                    '</div>',
                '</div>',

                '<div class="row zbank-row zbank-edit-group">',
                    '<div class="col-lg-4 info-item-text">&nbsp;</div>',
                    '<div class="col-lg-8">',
                        '<input class="zbank-input" name="zbankName" placeholder="输入支行名称">',
                        '<input type="hidden" name="zbankNo">',
                    '</div>',
                '</div>',
                '<div class="row zbank-btn-row zbank-edit-group">',
                    '<div class="col-lg-4 info-item-text">&nbsp;</div>',
                    '<div class="col-lg-8">',
                        '<button class="btn btn-sm btn-success js-confirm-update-zbank">确认修改</button>',
                        '<button class="btn btn-sm btn-danger js-cancel-update-zbank">取消修改</button>',
                    '</div>',
                '</div>',
            '</form>'
        ].join('');

        return zbankSelectTpl;
    }

    var MAX_LENGTH = 20;

    function addSelect2(me, $el, $regionCode, bankNo) {
        $el.select2({
            placeholder: '请选择支行',
            minimumInputLength: 1,
            width: '100%',
            ajax: {
                type: "get",
                url: 'api/system/options/zbank-name',
                dataType: 'json',
                data: function (term) {
                    return {
                        kw: encodeURIComponent(term),
                        regionCode: $regionCode.val(),
                        bankCode: bankNo,
                        maxLength: MAX_LENGTH
                    };
                },
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data){
                return "<div class='select-result'>" + data.name + "</div>";
            },
            formatSelection: function(data){
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

    return View;
});