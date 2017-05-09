/**
 * Created by huangzhenyong on 2014/12/19.
 */
//角色组添加角色时，候选角色列表
define([
    'tpl!app/oms/auth/role-group/templates/role-select-view.tpl',
    'tpl!app/oms/auth/role-group/templates/role-selected-collection.tpl',
    'tpl!app/oms/auth/role-group/templates/role-selected-item.tpl',
    'tpl!app/oms/auth/role-group/templates/role-options.tpl',
    'tpl!app/oms/auth/role-group/templates/role-options-item.tpl'
], function (tpl, selectedGroupTpl, selectedItemTpl, optionsTpl, optionsItemTpl) {

    var SelectedItemView = Marionette.ItemView.extend({

        template: selectedItemTpl,
        tagName: 'li',
        className: 'searched-choice',
        triggers: {
            'click a': 'click:remove'
        }

    });

    var SelectedListView = Marionette.CompositeView.extend({

        template: selectedGroupTpl,
        childView: SelectedItemView,
        childViewContainer: '.selected-list',
        ui: {
            selectedList: '.selected-list'
        },

        initialize: function () {
            this.collection = new Backbone.Collection(this.getOption('roles'));
            this.render();
        },

        validate: function () {
            //如果有选中的则合法
            if (this.collection.length > 0) {
                this.ui.selectedList.removeClass('has-error');
                this.$el.find('.error-msg-role').remove();            
                return true;
            } else {
                this.ui.selectedList.addClass('has-error');
                if (this.$el.find('.error-msg-role').length === 0) {
                    this.ui.selectedList.after('<span class="error-msg-role">角色不能为空</span>');
                }
                return false;
            }
        },

        getSelectedRoles: function () {
            return _.pluck(this.collection.toJSON(), 'id');
        },

        removeItemViewByModel: function (model) {
            this.collection.remove(model);
            this.validate();
        },

        addItemViewByModel: function (model) {
            this.collection.add(model);
            //让最近添加的一项在可视区域
            this.$el.find('ul')[0].scrollTop = 999999;
            this.validate();
        }

    });

    var OptionItemView = Marionette.ItemView.extend({

        template: optionsItemTpl,
        tagName: 'li',
        className: 'options-item',
        triggers: {
            'click .add-item': 'click:add'
        }

    });

    var RolesCollection = Backbone.Collection.extend({

        //根据多个关键字，返回过滤后的collection，需要包含所有关键字
        filterByKeywords: function (keywords) {
            return this.filter(function (model) {
                //角色组名称须包含所有关键字
                return _.every(keywords, function (kw) {
                    return model.get('name').indexOf(kw) !== -1;
                })
            });
        }
    });

    var OptionsListView = Marionette.CompositeView.extend({

        template: optionsTpl,
        childView: OptionItemView,
        childViewContainer: '.options-list',
        events: {
            'input input': 'onEnter',
            'click .remove-roles-icon': 'clearSearch'
        },
        ui: {
            'searchInput': '.search-input',
            'searchRemove': '.remove-roles-icon'
        },

        clearSearch: function () {
            this.ui.searchInput.val(null);
            this.ui.searchRemove.hide();
            this.searchRoles();
        },

        onEnter: function () {
            var value = $.trim(this.ui.searchInput.val());

            //有内容时，显示全删按钮
            this.ui.searchRemove.toggle(!!value);
            this.searchRoles(value);
        },

        searchRoles: _.throttle(function (value) {
            value = value || '';

            //把多个空格换成一个空格
            var keywords = value.split(/\s+/);

            var filteredRolesCollection = this.fullCollection.filterByKeywords(keywords);

            this.collection.reset(filteredRolesCollection);

            this.updateSearchResult();

        }, 200),

        /**
         * @param options
         * {
         *  roles: [{id:xx, name:xx},...]
         * }
         */
        initialize: function (options) {
            //如果有已选的角色，那么要过滤掉已有的
            var rolesData = options.roles;

            if(!_.isEmpty(options.selectedRoles)) {
                var selectedIds = _.pluck(options.selectedRoles, 'id');
                rolesData = _.filter(options.roles, function (optionRole) {
                    return !_.contains(selectedIds, optionRole.id);
                })
            }

            //表示所有角色组
            this.fullCollection = new RolesCollection(rolesData);

            //跟界面绑定的角色组列表
            this.collection = new Backbone.Collection(rolesData);
            //如果有已选角色，那么过滤掉这部分已选的角色

            this.render();
            this.updateSearchResult();
        },

        removeItemViewByModel: function (model) {
            this.fullCollection.remove(model);
            this.collection.remove(model);

            this.updateSearchResult();
        },

        addItemViewByModel: function (model) {
            this.fullCollection.add(model);
            this.collection.add(model);

            this.updateSearchResult();
        },

        updateSearchResult: function () {
            this.$el.find('.search-no-result').toggle(this.collection.length === 0);
        }

    });

    //编辑角色组
    var EditView = Marionette.ItemView.extend({

        template: tpl,

        initialize: function () {
            this._rawOptionRoles = [];//可选的角色组数据 [{id:xx, name},...]
            this._rawDefaultRoles = [];//默认已有的角色组数据 [{id:xx, name},...]
            this.render();
        },

        onRender: function () {
            var me = this;

            $.when(me.deferredAvailRoles(), me.deferredRoleGroupDetail()).done(function () {
                me.addChildrenView(me._rawDefaultRoles, me._rawOptionRoles);
            });

        },

        getAvailRolesUrl: function () {
            return url._('options.roles') + '?branchId=' + this.getOption('branchId');
        },

        //获取候选角色组列表
        deferredAvailRoles: function () {
            var me = this;
            //编辑角色组的时候会有机构id

            return Opf.ajax({
                type: 'GET',
                //如果是编辑的话，后台要根据角色组所在机构来获取可选角色
                url: me.getAvailRolesUrl(),
                success: function (resp) {
                    me._rawOptionRoles = _.map(resp, function (obj) {
                        //保证候选接口的数据 和 编辑时获取的已选数据同样为字符串
                        return {id: obj.value + '', name: obj.name};
                    });
                }
            });
        },

        getRoleGroupDetailUrl: function () {
            return url._('role-group-id', {id: this.getOption('roleGroupId')});
        },

        //获取已有角色组详情（编辑时）
        deferredRoleGroupDetail: function () {
            var me = this;

            //如果是编辑角色组，会有角色组ID
            var roleGroupId = me.getOption('roleGroupId');
            return Opf.ajax({
                type: 'GET',
                url: me.getRoleGroupDetailUrl(),
                success: function (resp) {
                    me._rawDefaultRoles = _.map(resp.roles, function (obj) {
                        //保证候选接口的数据 和 编辑时获取的已选数据同样为字符串
                        return {id: obj.id + '', name: obj.name};
                    });
                }
            });
        },

        addDefaultChildren: function(defaultRolesVal){
            var selectedView = this.selectedView = new SelectedListView({roles: defaultRolesVal});
            this.$el.find('.selected-group').empty().append(selectedView.$el);
        },

        addOptionsChildren: function(optionsRolesVal, defaultRolesVal){
            var optionsView = this.optionsView = new OptionsListView({roles: optionsRolesVal, selectedRoles: defaultRolesVal});
            this.$el.find('.options-group').empty().append(optionsView.$el);
        },

        addChildrenView: function (defaultRolesVal, optionsRolesVal) {
            var me = this;

            me.addDefaultChildren(defaultRolesVal);
            me.addOptionsChildren(optionsRolesVal, defaultRolesVal);

            me.addEvents();
            me.trigger('ready');
        },

        getSelectedRoles: function () {
            return this.selectedView.getSelectedRoles();
        },

        validate: function () {
            return this.selectedView.validate();
        },

        addEvents: function () {
            var me = this;

            me.selectedView.on('childview:click:remove', function (childView, obj) {
                var model = obj.model;

                me.selectedView.removeItemViewByModel(model);
                me.optionsView.addItemViewByModel(model);
            });

            me.optionsView.on('childview:click:add', function (childView, obj) {
                var model = obj.model;

                me.optionsView.removeItemViewByModel(model);
                me.selectedView.addItemViewByModel(model);
            });
        }
    });

    // 新增角色组
    var AddView = EditView.extend({
        getAvailRolesUrl: function () {
            return url._('options.roles');
        },

        onRender: function () {
            var me = this;

            $.when(me.deferredAvailRoles()).done(function () {
                me.addChildrenView(me._rawDefaultRoles, me._rawOptionRoles);
            });
        }
    });

    return {
        EditView: EditView,
        AddView: AddView
    };

});