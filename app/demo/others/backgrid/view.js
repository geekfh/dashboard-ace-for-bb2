/**
 * User hefeng
 * Date 2016/7/18
 */
define([
    'tpl!app/demo/others/backgrid/templates/demo.tpl',
    'backbone.paginator',
    'backgrid', 'backgrid-filter', 'backgrid-paginator', 'backgrid-select-all'
], function(backgridTpl) {

    // 配置视图
    return Marionette.ItemView.extend({
        // TAB唯一标识
        tabId: 'demo.menu.others.backgrid',

        template: backgridTpl,

        className: "backgrid-sample",

        ui: {
            backgridContainer: "#backgrid-list",
            backgridFilterContainer: "#backgrid-filter",
            backgridPaginatorContainer: "#backgrid-paginator"
        },

        onRender: function () {
            var me = this;

            me.createBackgrid();

        },

        createBackgrid: function() {
            var columns = [{
                name: "id", // The key of the model attribute
                label: "ID", // The name to display in the header
                editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
                // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
                cell: Backgrid.IntegerCell.extend({
                    orderSeparator: ''
                })
            }, {
                name: "name",
                label: "Name",
                // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
                cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
            }, {
                name: "pop",
                label: "Population",
                cell: "integer" // An integer cell is a number cell that displays humanized integers
            }, {
                name: "percentage",
                label: "% of World Population",
                cell: "number" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
            }, {
                name: "date",
                label: "Date",
                cell: "date"
            }, {
                name: "url",
                label: "URL",
                cell: "uri" // Renders the value in an HTML anchor element
            }];

            var Territory = Backbone.Model.extend({});

            var PageableTerritories = Backbone.PageableCollection.extend({
                model: Territory,
                url: url._('demo.api.others.backgrid.territories'),
                state: {
                    pageSize: 15
                },
                mode: "client" // page entirely on the client side
            });

            var pageableTerritories = new PageableTerritories();

            // Initialize a new Grid instance
            var grid = new Backgrid.Grid({
                columns: columns,
                collection: pageableTerritories
            });

            //backgridContainer

            // Render the grid and attach the root to your HTML document
            this.ui.backgridContainer.append(grid.render().el);

            // Initialize the paginator
            var paginator = new Backgrid.Extension.Paginator({
                collection: pageableTerritories
            });

            // Render the paginator
            this.ui.backgridPaginatorContainer.append(paginator.render().el);

            // Initialize a client-side filter to filter on the client
            // mode pageable collection's cache.
            var filter = new Backgrid.Extension.ClientSideFilter({
                collection: pageableTerritories,
                fields: ['name']
            });

            // Render the filter
            this.ui.backgridFilterContainer.append(filter.render().el);

            // Add some space to the filter and move it to the right
            //$(filter.el).css({float: "right", margin: "20px"});

            // Fetch some countries from the url
            pageableTerritories.fetch({reset: true});
        }
    });

});