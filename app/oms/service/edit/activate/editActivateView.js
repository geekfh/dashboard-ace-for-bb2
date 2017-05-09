define([
    'tpl!app/oms/service/edit/activate/templates/activate.tpl',
    'upload',
    'app/oms/collection/PageableTasks',
    'backbone.paginator',
    'backgrid',
    'backgrid-paginator',
    'backgrid-filter',
    'bootstrap-datepicker'
], function (tpl, Uploader, PageableCollection) {

    var InputCell = Backgrid.IntegerCell.extend({
        render: function () {
            this.$el.empty();
            var model = this.model;
            this.$el.append('<label class="invite-num">' + this.formatter.fromRaw(model.get(this.column.get("name")), model) + '</label>');
            this.delegateEvents();
            return this;
        }
    });

    // main view
    var View = Marionette.ItemView.extend({
        tabId: 'menu.service.model.edit.activate',
        template: tpl,
        className: 'service-group',
        events: {
            'click .btn-submit':  'onSubmit',
            'blur input[name="planActiveNum"]': 'changePlanNum',
            'click .back-list': function () {
                App.trigger('service:list:page', this.page);
            }
        },

        initialize: function (options) {
            this.data = options.data;
            this.activateWay = options.data.activateWay;
            this.mchtData = options.data.mchtData || [];
            this.branchInvite = options.data.branchInvite || [];
            this.status = options.data.status;
            this.page = options.page;
            this.planActiveNum = options.data.planActiveNum;

        },

        serializeData: function () {
            return {
                data: this.data
            };
        },

        attachValidation: function () {
            Opf.Validate.addRules(this.$el.find('form.submit-form'), {
                rules: {
                    planOpenDate: {
                        required: true
                    },
                    closeDate: {
                        required: true
                    }
                }
            });
        },

        onRender: function () {
            var me = this;
            me.setDatepicker();
            me.updateStatus();
            me.renderUpload();
            me.attachValidation();

            // 完全开放
            if (me.activateWay == 1) {

            }

            // 代理商邀请
            if (me.activateWay == 2) {
                me.renderMchtGrid(me.mchtData);
                me.renderBranchGrid(me.branchInvite);
            }

            // 公司邀请
            if (me.activateWay == 3) {
                me.renderMchtGrid(me.mchtData);
            }

        },

        onSubmit: function () {
            var me = this;

            if (this.$el.find('form.submit-form').validate().form()) {
                Opf.ajax({
                    url: url._('service.saveRegister', {id: me.id}),
                    type: 'POST',
                    jsonData: me.getValue(),
                    success: function (resp) {
                        if (resp.success === true) {
                            Opf.Toast.success('提交成功');
                            App.trigger('service:list');
                        }
                    },
                    complete: function () {

                    }

                });
            }

        },


        updateStatus: function () {

            // 开始或者暂停，部分可以修改
            if (this.status != 0) {
                this.$el.find('[name="planOpenDate"]').prop('disabled', true);
                this.$el.find('[name="closeDate"]').prop('disabled', true);
            }

            if (this.status == 0) {
                this.$el.find('select[name="status"]').find('option[value=3]').remove();
            }

            if (this.status == 1 || this.status == 2) {
                this.$el.find('select[name="status"]').find('option[value=0]').remove();
            }

            if (this.status == 3) {
                this.$el.find('select[name="status"]').find('option[value!=3]').remove();
            }

        },

        setDatepicker: function() {
            var $form = this.$el.find('form.submit-form');

            this.$el.find('[name="planOpenDate"]').datepicker({ format: 'yyyymmdd', autoclose: true }).on('changeDate', function(e) {
                var $DateEl = $(e.target);
                $form.validate().element($DateEl);
            });
            this.$el.find('[name="closeDate"]').datepicker({ format: 'yyyymmdd', autoclose: true }).on('changeDate', function(e) {
                var $DateEl = $(e.target);
                $form.validate().element($DateEl);
            });

        },

        renderUpload: function () {
            var me = this;
            var $trigger = me.$el.find('.upload-mcht');

            new Uploader({
                trigger: $trigger,
                data: {
                    serviceid: me.id
                },
                action: url._('service.import'),
                accept: 'application/vnd.ms-excel',
                beforeSubmit: function (id) {
                    Opf.UI.setLoading('.service-activate',true,{text:'正在上传'});
                },
                progress: function(queueId, event, position, total, percent) {
                },
                success: function (queueId, resp) {
                    if (resp.success === false) {
                        Opf.alert({ title: '文件不合适',  message: resp.msg || '上传失败' });

                    } else {
                        me.refreshGrid();
                    }
                },
                error: function () {
                    Opf.alert('上传出错');
                },
                complete: function () {
                    Opf.UI.setLoading('.service-activate',false);
                }
            });

        },

        // 达到邀请标准的商户
        renderMchtGrid: function () {
            var me = this;
            var MchtCollection = PageableCollection.extend({
                url: url._('service.mchtlist', {id: me.id}),
                state: {
                    firstPage: 0,
                    pageSize: 5
                }
            });

            var mchtCollenction = this.mchtCollenction = new MchtCollection();

            var PageableGrid = new Backgrid.Grid({
                columns:  [
                    {name: 'mchtName',    label: '商户名称', sortable: false, cell: 'string', editable: false},
                    {name: 'branchName',  label: '签约机构', sortable: false, cell: 'string', editable: false},
                    {name: 'explorer',    label: '扩展员',   sortable: false, cell: 'string', editable: false}/*,
                    {name: 'isQualified', label: '勾选',     cell: 'boolean'}*/
                ],
                collection: mchtCollenction
            });

            var $append = this.$el.find('.mcht-qualified');
            $append.append(PageableGrid.render().$el).show();

            var paginator = new Backgrid.Extension.Paginator({
                collection: mchtCollenction
            });

            $append.after(paginator.render().$el);
            mchtCollenction.fetch({reset: true});

        },

        getBranchColumns: function () {
            return [
                    {name: 'branchName',    label: '代理商名称',   sortable: false, cell: 'string',  editable: false},
                    {name: 'branchRemark',  label: '机构备注',     sortable: false, cell: 'string',  editable: false},
                    {name: 'qualifiedNum',  label: '达标商户数',   sortable: false, cell: 'integer', editable: false},
                    {name: 'inviteNum',     label: '邀请名额',     sortable: false, cell: InputCell, editable: true}
                ];
        },

        // 代理商邀请名额
        renderBranchGrid: function () {
            var me = this;

            var BranchModel = Backbone.Model.extend({
                url: url._('service.brh.invitenum', {id: me.id})
            });

            var BranchCollection = PageableCollection.extend({
                model: BranchModel,
                url: url._('service.brhlist', {id: me.id}),
                state: {
                    firstPage: 0,
                    pageSize: 5
                }
            });

            var branchCollection = this.branchCollection = new BranchCollection();

            var PageableGrid = new Backgrid.Grid({
                columns:  me.getBranchColumns(),
                collection: branchCollection
            });

            var $append = this.$el.find('.branch-qualified');
            $append.append(PageableGrid.render().$el).show();

            var paginator = new Backgrid.Extension.Paginator({
                collection: branchCollection
            });
            $append.after(paginator.render().$el);

            var filter = new Backgrid.Extension.ServerSideFilter({
                collection: branchCollection,
                name: 'q',
                placeholder: '这个是搜索你造吗？'
            });
            $append.find('.left-menu').append(filter.render().$el);
            branchCollection.fetch({reset: true});
            this.addEvents();

        },

        refreshGrid: function () {
            this.mchtCollenction.fetch({reset: true});
            this.branchCollection.fetch({reset: true});
        },


        addEvents: function () {
            var me = this;
            this.branchCollection.on('backgrid:edited', function (model) {
                model.save(null, {
                    type: 'POST', 
                    success: function () {

                    },
                    error: function () {

                    },
                    complete: function () { me.branchCollection.fetch(); }
                });
            });
        },

        updatePlanActiveNum: function () {
            this.planActiveNum = this.$el.find('[name="planActiveNum"]').val();
        },

        cleanPlanActiveNum: function () {
            this.$el.find('[name="planActiveNum"]').val(this.planActiveNum);
        },

        changePlanNum: function () {
            var me = this;
            var value = me.$el.find('[name="planActiveNum"]').val();

            Opf.ajax({
                url: url._('service.invitenum', {id: me.id, num: value}),
                type: 'POST',
                success: function (resp) {
                    if (resp.success === true) {
                        me.updatePlanActiveNum(); 
                    } else {
                        me.cleanPlanActiveNum();
                    }
                },  
                error: function () {
                    me.cleanPlanActiveNum();
                },
                complete: function () {
                    me.branchCollection.fetch();
                }
            });
        },

        getValue: function () {
            var me = this;

            var result = {
                planOpenDate:  me.$el.find('[name="planOpenDate"]').val(),
                closeDate:     me.$el.find('[name="closeDate"]').val(),
                status:        me.$el.find('[name="status"]').val(),
                activateWay:   me.activateWay

            };

            return result;
        }

    });


    return View;

});