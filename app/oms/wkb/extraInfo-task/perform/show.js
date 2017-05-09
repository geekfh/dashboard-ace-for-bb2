define(['app/oms/wkb/task/show/show-view'], function (ShowView){//任务管理>>点开详情
    var view = ShowView.extend({

        events: _.extend({
            'click .js-take' : 'requestTakeTask'
        }, ShowView.prototype.events),

        onRender: function () {
            ShowView.prototype.onRender.call(this, arguments);
            var data = ShowView.prototype.getDataInfo.call(this,arguments);
            this.addExtraImg(data);

            //如果状态为成功则查看详情需要提供审核不通过标识
            if(data.data.taskInfo.status=="5"){
                this.appendImg(data);
            }
        },
        addExtraImg: function(data){// 补充照片的位置显示 客户端新增的补充照片
            var $el = this.$el;
            var addInfoData = data.addInfoData;
            var mchtData = data.mchtData;
            //如果有原始的补充照片，那么.extra-img-outwrap 就不存在，所以这里给他追加一个
            if(data.orginExtraImg.length == 0){ //
                var $outDiv = $el.find('.out-extra-img');
                $outDiv.append($(getOutExtraImgTpl()));
            }
            var $outWrap = $el.find('.extra-img-outwrap');
            for(var key in addInfoData ){
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
        appendImg:function(data){
            var $el = this.$el;
            var addInfoData = data.addInfoData;
            var addCol = addInfoData ? Opf.get(addInfoData,'addColumn') : null;
            if(!addCol){
                return;
            }
            for (var i = 0;i < addCol.length; i++) {
                var key = addCol[i];
                var $target = $el.find('[name='+key+']');
                if($target.hasClass('checkable-text')){//文字
                    var $imgToText = $(getTextAppendTpl());
                    $target.append($imgToText);
                }else if($target.hasClass('img-wrap')){//图片
                    var $imgToImg = $(getImgAppendTpl());
                    $target.find('.img-inner-wrap').append($imgToImg);
                }
            }
        },

        getPerformViewPath: function () {
            return 'app/oms/wkb/extraInfo-task/perform/perform';
        }
    });

    //生成图片的改字
    function getImgAppendTpl(){
        return '<img class="tips-img modify" src="./assets/css/images/pixel.gif" />';
    }

    //生成文字后面的改字
    function getTextAppendTpl(){
        return '<img class="tips-txt modify" src="./assets/css/images/pixel.gif" />';
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
