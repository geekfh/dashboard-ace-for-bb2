define([
    'tpl!assets/scripts/fwk/component/templates/attachment-item.tpl',
    'jquery.scrollTo', 'upload'
], function(fileItemTpl) {

    var ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        template: fileItemTpl,
        className: 'upload-attach-panel',
        ui: {
            fileName: '.file-name',
            filePercent: '.file-percent',
            percentText: '.percent-text',
            fileValue: '.file-value'
        },
        triggers: {
            'click .btn-delete': 'remove:btn:click'
        },
        events: {
            
        },
        onUpdatePercent: function(percent) {
            this.ui.percentText.text(percent + '%');
        },

        onSuccess: function(url) {
            var ui = this.ui;

            //TODO 抽象成一个方法，在onrender用
            var fileName = ui.fileName.hide().text();
            
            setTimeout(function () {
                ui.filePercent.hide();
            }, 1000);

            ui.fileValue.attr('href', url).text(fileName).show();

            this.model.set('url', url);
        },

        onRender: function () {
            var ui = this.ui;
            var url = this.model.get('url');

            if(url) {
                var fileName = ui.fileName.hide().text();
                ui.filePercent.hide();
                ui.fileValue.attr('href', url).text(fileName).show();
                this.ui.fileValue.attr('href', url).text(fileName).show();
            }
        },

        onBeforeUpload: function () {
            this.ui.filePercent.show();
        },

        getFilename: function () {
            return this.model.get('filename');
        }

    });

    var View = Marionette.CompositeView.extend({

        childView: ItemView,
        childViewContainer: '.attachment-list',

        template: _.template([
            '<ul class="attachment-list">',
            '</ul>',
            '<a href="#" id="id-add-attachment" type="button" class="btn btn-sm btn-danger btn-attach">',
            '<i class="icon-paper-clip bigger-140"></i>',
            '增加附件',
            '</a> (单个文件不超过10M)'
        ].join('')),

        ui: {
            btnAttach: '.btn-attach'
        },

        initialize: function(options) {
            this.collection = new Backbone.Collection();

            this.options = options || {};

            this.render();

            this.uploadingIds = [];

            if(options.models) {
                this.collection.reset(options.models);
            }

        },

        reset: function () {
            this.collection.reset(null);
        },
        
        //filename, url
        addAttachments: function (models) {
            this.collection.add(models);
        },

        getFileUrls: function () {
            return this.collection.pluck('url');
        },

        onRender: function() {
            this.setup();
            this.options.renderTo && this.$el.appendTo(this.options.renderTo);
        },

        onChildviewRemoveBtnClick: function(childView) {
            var me = this;
            Opf.confirm('您确定移除附件 '+childView.getFilename()+'？', function(result) {
                if(result) {
                    me.collection.remove(childView.model);
                }
            });
        },

        setup: function() {
            var me = this;
            var ui = this.ui;
            var queueCache = this.queueCache;
            var model, childView;
            var id2Model = {};

            var uploader = new Uploader({
                trigger: ui.btnAttach,
                action: me.options.uploadUrl,
                data: {
                    tid: Ctx? (_.isFunction(Ctx.getId)?Ctx.getId():""):""
                },
                beforeSubmit: function(id) {

                    var inputFilename = this.getFilename();

                    if(me.collection.findWhere({inputFilename: inputFilename})) {
                        Opf.Toast.error('请不要重复上传文件');
                        return false;
                    }

                    id2Model[id] = me.collection.add({
                        inputFilename: inputFilename,
                        id: id,
                        filename: uploader.input.val().split(/[\/\\]/).pop()
                    });
                    me.uploadingIds.push(id);

                    childView = me.children.findByModel(id2Model[id]);
                    childView && childView.onBeforeUpload();
                },
                complete: function(id) {
                    _.remove(me.uploadingIds, id);
                },
                progress: function(id, event, position, total, percent) {
                    childView.triggerMethod('update:percent', percent);
                },
                error: function (id) {
                    childView = me.children.findByModel(id2Model[id]);
                    childView.destroy();
                    // Opf.alert('上传出错');
                },
                success: function(id, resp) {
                    childView = me.children.findByModel(id2Model[id]);
                    if (resp.success !== false) {
                        childView.triggerMethod('success', resp.url);
                    } else {
                        childView.destroy();
                        resp.msg &&　Opf.alert(resp.msg);
                    }
                }
            });

            me.collection.on('remove', function(model) {
                //TODO uploader.js 里面 uploader.abort的时候判断对应的xhr或frame是否完成
                uploader.abort(model.id);
            });

        },

        hasUploadingFile: function () {
            return this.uploadingIds.length > 0;
        },

        onAddChild: function () {
            //TDOO 编辑的时候 '#id-add-attachment' 可能还没有, 重构下
            if($('#id-add-attachment').length) {
                $('body').scrollTo('#id-add-attachment');
            }
        }
    });

    return View;
});