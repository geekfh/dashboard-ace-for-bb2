define([
    'tpl!app/oms/service/view/mchts/templates/view-mchts.tpl',
    'app/oms/collection/PageableTasks',
    'backbone.paginator',
    'backgrid',
    'backgrid-paginator',
    'backgrid-filter'
], function (tpl, PageableCollection) {

    var View = Marionette.ItemView.extend({
        template: tpl,
        className: 'service-group',

        initialize: function () {

        },

        onRender: function () {
            var me = this;
            var MchtCollection = PageableCollection.extend({
                url: url._('service.registter.mchtlist', {id: me.id}),
                state: {
                    firstPage: 0,
                    pageSize: 5
                }
            });

            var mchtCollenction = new MchtCollection();

            var PageableGrid = new Backgrid.Grid({
                columns:  [
                    {name: 'mchtNo',      sortable: false, label: '商户号',   cell: 'string', editable: false},
                    {name: 'mchtName',    sortable: false, label: '商户名称', cell: 'string', editable: false},
                    {name: 'openDate',    sortable: false, label: '开通日期', cell: 'string', editable: false},
                    {name: 'closeDate',   sortable: false, label: '结束日期', cell: 'string', editable: false},
                    {name: 'remark',      sortable: false, label: '备注',     cell: 'string', editable: false},
                    {name: 'status',      sortable: false, label: '状态',     cell: Backgrid.SelectCell.extend({
                        optionValues: [["开通", "2"], ["停止", "3"]],
                        render: function (val) {
                            Backgrid.SelectCell.prototype.render.apply(this, arguments);
                            var $selVal = this.$el.html();
                            this.$el.html('<label class="invite-mcht">' + $selVal + '</label>');
                            return this;
                        }
                    })}
                ],
                collection: mchtCollenction
            });

            var paginator = new Backgrid.Extension.Paginator({
                collection: mchtCollenction
            });

            var filter = new Backgrid.Extension.ServerSideFilter({
                collection: mchtCollenction,
                name: 'q',
                placeholder: '这个是搜索你造吗？'
            });

            this.$el.find('.activate-mchts-group').append(PageableGrid.render().$el).after(paginator.render().$el).before(filter.render().$el);
            
            mchtCollenction.fetch({reset: true});
            this.addEvents(mchtCollenction);

        },

        addEvents: function (collection) {
            var me = this;
            collection.on('backgrid:edited', function (model) {
                model.save(null, {
                    type: 'POST', 
                    url: url._('service.status', {id: me.id, mchtNo: model.get('mchtNo'), status: model.get('status')}),
                    data: null,
                    success: function () {

                    },
                    error: function () {

                    },
                    complete: function () { collection.fetch(); }
                });
            });
        }

    });

    return View;

});