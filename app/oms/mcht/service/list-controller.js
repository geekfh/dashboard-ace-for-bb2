define([
    'app/oms/mcht/service/list-view',
    'app/oms/mcht/service/list-collection',
    'backgrid',
    'backgrid-paginator',
    'backgrid-filter',
    'backgrid-select-all'
    ],function(ComView,Collection){
    var Ctr = Marionette.Controller.extend({


        initialize: function(){
            var me = this;
            this.brhCode = Ctx.getUser().get('brhCode');
            this.collection = new Collection([],{url: url._('brh.service', {brhCode: this.brhCode})});
        },

        showList: function(){
            var me = this;
            //若不在每次调用 showList 时 new 一个 view ，则会出现 ViewDestroyedError 错误
            me.view = new ComView({collection: me.collection});
            me._addListener();
            App.show(me.view);
            me.collection.getFirstPage();
        },


        _addListener: function(){
            var me = this;
            this.view.on('invite:more', function(id){
                var $dialog = me._popDialog({
                    clz: 'invite-user-container',
                    title: '可邀请商户列表',
                    buttons: [{
                        type: 'submit',
                        click: handleSubmit
                    },{
                        type: 'cancel'
                    }]
                });
                var columns = [
                        {name: 'mchtNo',    label: '商户号', cell: 'string', editable: false},
                        {name: 'mchtName',    label: '商户名称', cell: 'string', editable: false},
                        {name: 'brName',  label: '开通日期', cell: 'string', editable: false},
                        {name: 'expandName',    label: '结束日期',   cell: 'string', editable: false},
                        {name: '',   cell: 'select-row', headerCell: 'select-all'}
                    ];
                var options = {
                        $dialog: $dialog,
                        id: id,
                        url: url._('brh.available.business', {id: id, brhCode: me.brhCode}),
                        columns: columns
                };
                var pageableGrid = me.renderGrid(options);

                function getMchtNoList(){
                    return _.map(pageableGrid.grid.getSelectedModels(), function(item){
                        return  item.get('mchtNo');
                    });
                }

                function handleSubmit(e){
                    if (!getMchtNoList().length) {
                        return false;
                    }
                    var data = {
                        id: id,
                        brhCode: me.brhCode,
                        mchtNoList: getMchtNoList()
                    };

                    var $submitButton = $(e.target).closest('button');
                    Opf.UI.busyText($submitButton);
                    Opf.ajax({
                        type: "POST",
                        url: url._('brh.invite.business'),
                        data: JSON.stringify(data),
                        successMsg: "操作成功",
                        success: function(resp){
                            pageableGrid.collection.getFirstPage();
                        },
                        complete: function(){
                            Opf.UI.busyText($submitButton, false);
                        }
                    });
                }


            });

            this.view.on('show:actual:user', function(id){
                var $dialog = me._popDialog({
                    clz: 'actual-user-container',
                    title: '实际开通商户列表'
                });
                var columns = [
                        {name: 'mchtNo',    label: '商户号', cell: 'string', editable: false},
                        {name: 'mchtName',    label: '商户名称', cell: 'string', editable: false},
                        {name: 'beginTime',  label: '开通日期', cell: 'string', editable: false},
                        {name: 'endTime',    label: '结束日期',   cell: 'string', editable: false},
                        {name: 'remark',    label: '备注',   cell: 'string', editable: false}
                    ];
                var options = {
                        $dialog: $dialog,
                        id: id,
                        url: url._('brh.active.business', {id: id, brhCode: me.brhCode}),
                        columns: columns
                };
                me.renderGrid(options);
            });

            this.view.on('first:page', function(){ this.collection.getFirstPage();});
            this.view.on('last:page', function(){ this.collection.getLastPage();});
            this.view.on('previous:page', function(){ this.collection.getPreviousPage();});
            this.view.on('next:page', function(){ this.collection.getNextPage();});
        },

        renderGrid: function(options){
            var me = this,
                $dialog = options.$dialog,
                collection = new Collection([],{url: options.url}),
                pageableGrid = new Backgrid.Grid({
                    columns: options.columns,
                    collection: collection
                });

            $dialog.append(pageableGrid.render().el);

            addPaginator();

            addFilter();

            collection.fetch({reset: true});

            function addPaginator(){
                var paginator = new Backgrid.Extension.Paginator({
                    collection: collection
                });

                $dialog.after(paginator.render().el);
            }

            function addFilter(){
                var filter = new Backgrid.Extension.ServerSideFilter({
                    collection: collection,
                    fields: 'q'
                });

                $dialog.before(filter.render().el);
            }

            return {grid: pageableGrid, collection: collection};

        },

        _popDialog: function(options){
            var defaultOptions = {
                    destroyOnClose: true,
                    title: '列表',
                    autoOpen: true,
                    modal: true,
                    width: 700,
                    height: 370
                },
            actualOptions = _.extend({},defaultOptions,options);

            var containerHtml = "<div class='" + options.clz + "'></div>",
                $dialog = Opf.Factory.createDialog(containerHtml,actualOptions);

            return $dialog;

        }

    });


    // App.on('brh:service:list', function(){
    //     var ctr = new Ctr();
    //     ctr.showList();
    // });
    return new Ctr();
});