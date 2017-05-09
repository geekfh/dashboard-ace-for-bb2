define(['app/oms/wkb/task/perform/perform-view'], function (PerformView){//商审任务>>点开详情
    var view = PerformView.extend({

        events: _.extend({
            'click .verify-submit' : 'verifySubmit'
        }, PerformView.prototype.events),
        initialize: function (options) {
            this.data = options.data;
            this.addInfoData = this.data.addInfo;
            this.addCol = this.addInfoData ? Opf.get(this.addInfoData,'addColumn') : null;
            this.mchtData = this.data.mcht;
            this.orginExtraImg = this.mchtData.extraImages ? this.mchtData.extraImages.split(',') : [];//原始的补充照片
        },
        onRender: function () {
            PerformView.prototype.onRender.call(this, arguments);
            this.addExtraImg();
            var $btndiv = this.$el.find('.btn-groups').closest('.col-sm-4');
            var $verBtn = $(getVerifyBtnTpl());
            $btndiv.empty().append($verBtn);
            this.appendImg(this.data);
        },
        addExtraImg: function(){// 补充照片的位置显示 客户端新增的补充照片
            var $el = this.$el;
            var addInfoData = this.addInfoData;
            var mchtData = this.mchtData;
            //如果有原始的补充照片，那么.extra-img-outwrap 就不存在，所以这里给他追加一个
            if(this.orginExtraImg.length == 0){ //
                var $outDiv = $el.find('.out-extra-img');
                $outDiv.append($(getOutExtraImgTpl()));
            }
            var $outWrap = $el.find('.extra-img-outwrap');
            for(var key in addInfoData ){
                //if(!addInfoData[key] || key == 'addColumn'){
                //    continue;
                //}
                if(!mchtData[key]){
                    continue;
                }
                var $extrImg = $(getExtraImgTpl());
                $extrImg.attr('name',key);
                $extrImg.find('.add-col-img').attr('src',mchtData[key]);
                $outWrap.append($extrImg);

            }
            $el.find('.no-extra-img').hide();//去掉无字

        },
        renderTitle: function () {
            var $caption = this.$el.find('.caption:first');
            var title = '商户补充资料';
            $caption.text(title);
        },
        renderCheckBox: function(data){
            var me = this;
            me.$el.find('.checkable').each(function () {
                var name = $(this).attr('name');
                if(me.thisNameNeedAdd(name,data)){
                    me.appendCheckBox(this);
                }
            });
        },
        thisNameNeedAdd: function(name,data){
            var addCol = this.addCol;
            if(!addCol){
                return;
            }
            return addCol.indexOf(name) != -1;
        },
        //内容后面的补字
        appendImg:function(data){
            var $el = this.$el;
            var addInfoData = this.addInfoData;
            var addCol = this.addCol;
            if(!addCol){
                return;
            }
            for (var i = 0;i < addCol.length; i++) {
                var key = addCol[i];
                var $target = $el.find('[name='+key+']');
                if($target.hasClass('checkable-text')){//文字后面的补字
                    var $imgToText = $(getTextAppendTpl());
                    $target.find('.icon-ok').before($imgToText);
                }else if($target.hasClass('img-wrap')){//图片后面的补字
                    var $imgToImg = $(getImgAppendTpl());
                    $target.find('.img-inner-wrap').append($imgToImg);
                    $target.closest('.checkable').append($('<i class="check-trigger icon-ok" ></i>'));
                }
            }
        },
        //审核提交
        verifySubmit: function () {
            var me = this, $el = me.$el;
            var $rejectSubmitBtn = $el.find('.verify-submit');

            Opf.UI.busyText($rejectSubmitBtn, true);
            require(['app/oms/wkb/extraInfo-task/perform/confirm'], function(ConfirmView){
                Opf.UI.busyText($rejectSubmitBtn, false);

                var rejectData = me.getRejectSubmitValues();
                var addInfoData = me.addInfoData;
                var confirmView = new ConfirmView({
                    errorMark: rejectData.errorMark,
                    addColumn: addInfoData.addColumn
                }).render();

                var $dialog = Opf.Factory.createDialog(confirmView.$el, {
                    title: '商户补充资料审核',
                    destroyOnClose: true,
                    autoOpen: true,
                    modal: true,
                    width: 380,
                    height: 620,
                    buttons: [{
                        type: 'submit',
                        click: function () {
                            var rejectForm = $dialog.find('.reject-form');
                            var isValid = rejectForm.length>0? rejectForm.valid():true;
                            if(isValid){
                                var btnPanel = $dialog.siblings('.ui-dialog-buttonpane');
                                var btnSubmit = btnPanel.find('button[type="submit"]');
                                    btnSubmit.prop('disabled', true);
                                var rejectReason = confirmView.getRejectReason();
                                Opf.ajax({
                                    url: url._('task.verify', {
                                        id: me.data.taskId
                                    }),
                                    type: 'PUT',
                                    data: JSON.stringify(_.extend({}, rejectData, rejectReason)),
                                    success: function(resp) {
                                        if (resp.success !== false) {
                                            var tabId = me.$el.closest('[tabmainbody]').attr('id');
                                            App.closeTabViewById(tabId);
                                            me.goback();
                                        }
                                    },
                                    complete: function() {
                                        $dialog.dialog('close');
                                        //btnSubmit.prop('disabled', false);
                                    }
                                });
                            }
                        }
                    },{
                        type: 'cancel'
                    }]
                });
            });
        }
    });

    function getVerifyBtnTpl(){
        return [
            '<div class="center btn-groups">',
            '<button class="js-pass btn btn-success verify-submit">审核</button>',
            '</div>'
        ].join('');
    }

    //生成图片的补字
    function getImgAppendTpl(){
        return '<img class="flag-img add" src="./assets/css/images/pixel.gif" />';
    }

    //生成文字后面的补字
    function getTextAppendTpl(){
        return '<img class="flag-txt add" src="./assets/css/images/pixel.gif" />';
    }

    function getOutExtraImgTpl(){
        return [
            '<div class="row row-margintop extra-img-outwrap">',
            '</div>'
        ].join('');

    }
    function getExtraImgTpl(){
        return  [
            '<div class="extra-img-wrap col-xs-4 img-wrap checkable">',
            '<div class="img-inner-wrap">',
            '<span class="vertical-helper"></span><img class="add-col-img" >',
            '</div>',
            '</div>'
        ].join('');
    }
    return view;
})