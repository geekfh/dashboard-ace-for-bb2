/**
 * 直销人员补充资料 任务相关
 */
define(['app/oms/auth/user/task/show-view',
    'app/oms/auth/user/furtherInfo-task/common-view'
], function (ShowView, CommonView) {

    var View = ShowView.extend({

        onRender: function () {
            ShowView.prototype.onRender.apply(this, arguments);
            this.showFurtherInfo();
        },
        showFurtherInfo: function () {
            var $el = this.$el,
                $lastSection =$el.find('.user-form-section:last'),
                $secondSection = $el.find('.user-form-section:first').next(),
                $lastSectionChildren = $lastSection.children();
            $secondSection.append($lastSectionChildren);
            $lastSection.append(new CommonView(this.userInfo).render().$el);//追加审核信息
            this.$el.find('.center-wrap span').text('直销人员补充资料');
        },
        getPerformViewUrl: function(){
            return ['app/oms/auth/user/furtherInfo-task/perform-view'];
        }

    });
    return View;
})
