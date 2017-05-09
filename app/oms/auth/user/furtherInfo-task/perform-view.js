/**
 * 直销人员补充资料 任务相关
 */
define(['app/oms/auth/user/task/perform-view',
    'app/oms/auth/user/furtherInfo-task/common-view'
], function (PerformView, CommonView) {
        var View = PerformView.extend({
            onRender: function () {
                var me = this;
                PerformView.prototype.onRender.apply(this, arguments);
                me.showFurtherInfo();
                setTimeout(function(){
                    me.showLicPreCheckResult();
                },100);
            },
            convertor: function (item) {
                item.check = !!this.$el.find('.checkable[name=' + item.name + ']').hasClass('checked');
            },
            showFurtherInfo: function () {
                var me = this, $el = me.$el,
                   $lastSection =$el.find('.user-form-section:last'),
                   $secondSection = $el.find('.user-form-section:first').next(),
                   $lastSectionChildren = $lastSection.children();

                $secondSection.append($lastSectionChildren);
                $lastSection.append(new CommonView(this.data.userInfo, me.convertor).render().$el);//追加审核信息

                var $audit = this.$el.find('.right-btns');//把审核按钮弄到下面
                this.$el.find('.further-info-wrap').append($audit);
                this.$el.find('.checkable-text,.img-wrap').each(function(index,elem){
                    $(elem).removeClass('checkable').find('.icon-ok').remove();//只审核营业执照跟名称 其他的干掉勾选框
                });

                this.$el.find('div[name=businessName],div[name=businessLicNo],div[name=businessLicImg]').each(function (index, elem) {
                    $(elem).addClass('checkable').append($('<i class="check-trigger icon-ok" ></i>'));
                });

                this.$el.find('.center-wrap span').text('直销人员补充资料');
                this.$el.find('.needAdd').remove();
            },
            showLicPreCheckResult: function () {
                var preview =this.data.preview || {};
                if(this.data.userInfo.businessLicNo){
                    var idlabel = this.generateLabel(preview.licsStatus || '2', '营业执照信息');
                    this.$el.find('.businessLicNo-row').after($(idlabel));
                }
            },
            showPreCheckResult: function () {
                //判断this.data.preview中的数据
                //preview 的值有可能为空，所以做一下保护
                //如果为空，默认status的值为'2'(为验证)
                var me = this;
                var $el = me.$el;
                var preview = me.data.preview || {};
                var userInfo = me.data.userInfo;
                if(preview) {
                    if(userInfo.cardNo){
                        var idlabel = me.generateLabel(preview.idStatus || '2', '身份证信息');
                        $el.find('div.cardNo-row').after($(idlabel));
                    }
                    //this.generateAutoRejectIcon(name);
                    if(userInfo.accountNo){
                        var accountlabel =  me.generateLabel(preview.cardStatus || '2', '账号');
                        $el.find('div.accountNo-row').after($(accountlabel));
                    }
                }
                //在相应地方append相应内容
                // <span class="label label-warning">xx可能有误</span>
                // <span class="label label-success">xx已验证</span>
                // <span class="label ">xx未验证</span>

            },
            rejectSubmit: function (e) {
                e.preventDefault();
                var me = this;
                var $el = me.$el;

                console.log(me.getRejectSubmitValues());

              if(me.ui.rejectForm.valid()) {

                    Opf.UI.busyText(me.ui.rejectSubmitBtn, true);
                    //me.getRejectSubmitValues();
                    Opf.ajax({
                        url: url._('task.refuse', {id:me.data.taskId}),
                        type: 'PUT',
                        data: JSON.stringify(me.getRejectSubmitValues()),
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
            }
        });
    return View;
})
