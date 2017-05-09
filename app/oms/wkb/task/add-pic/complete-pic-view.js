

define([
    'tpl!app/oms/wkb/task/add-pic/templates/add-pic.tpl',
    'app/oms/mcht/add/sub/extra-image-appender',
    'app/oms/mcht/edit/sub/edit-pic-view'

],function(tpl, ExtraImagerAppender, EditPicView){


    var MchtView = Marionette.ItemView.extend({
        className: 'person-mcht-wizard',
        template: tpl,

        events: {
            'click .btn-submit' : 'onSubmit'
        },

        initialize: function (data, baseId) {
            this.subViews = {};
            this.baseId = baseId;

            this.picData = data;

        },

        ui: {
            'preview' : '.imgs-preview',
            'imgTrigger': '.add-img-tirgger',
            'mchtPic'  :  '#add-person-mcht-pic',
            'submitBtn':  '.btn-submit'
        },

        onRender: function() {
            var me = this;
            var $el = this.$el;
            var picData = this.picData;
            var ui = this.ui;



            //传入当前已录入的数据
            var subView = this.subView = new EditPicView(picData);
            subView.render();

            subView.$el.prependTo(ui.mchtPic);

            new ExtraImagerAppender({
                trigger: ui.imgTrigger,
                previewCt: ui.preview
            });

            var extraItem = _.findWhere(picData.images, {name: 'extra'});
            var extraSrc = extraItem ? extraItem.value : '';
            var extraArr = extraSrc ? extraItem.value.split(',') : [];

            _.each(extraArr, function(imgUrl) {
                var extraView = new ExtraImagerAppender.ImageView().render();
                extraView.loadImage(imgUrl);
                extraView.$el.appendTo(ui.preview);
            });

        },

        getValues: function() {
            var ret = [];

            if(!this.subView.validate()) {
                return null;
            }


            ret = this.subView.getValues().images;

            var extraArr = [];
            this.ui.preview.find('img[data-set]').each(function () {
                extraArr.push($(this).attr('src'));
            });

            ret.push({
                name: 'extra',
                value: extraArr.join(',')
            });

            return ret;

        },

        onSubmit : function() {
            var me = this;
            var imgs = this.getValues();
            var ui = this.ui;

            if(!imgs) {
                return;
            }

            var baseId = this.baseId;
            var postData = {
                taskId: baseId,
                images: imgs
            };

            console.log(postData);

            Opf.UI.busyText(ui.submitBtn, true, '正在提交...');
            Opf.ajax({
                url: url._('task.update.images'),
                type: 'PUT',
                jsonData: postData,
                success: function (resp) {
                    console.log(resp);
                    Opf.Toast.success('提交成功');
                    me.$el.remove();
                    me.trigger('back');
                }, 
                complete: function() {
                    Opf.UI.busyText(ui.submitBtn, false);
                }
            });

            
        }


    });


    return MchtView;
});




// ##完善图片信息
// ###request    *POST*
// /api/system/tasks/update-images
// {
// taskId: //任务Id
// images:[
//             {name:'idCardFront',证件正面照 value: 'xxxx'//在单个图片上传后，后台会给出一个code标识这张图片},
//             {name: 'personWithIdCard',//本人手持正面照 value: 'xxx'},
//             {name:'license',   //   营业执照 value: 'xxx'}
//             {name: 'idCardBack',//证件反面照 value: 'xxx'},                  
//             {name: 'scene',//经营场景value: 'xxx'},
//             {
//                 name: 'extra',//可以添加多张补充照片 
//                 value: //urls 用英文逗号拼起来
//             }
//         ],

// }





