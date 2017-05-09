
define([
    'tpl!app/oms/param/task-map/list/templates/add.tpl',
    'app/oms/param/task-map/list/special-role',
    'select2'
], function(tpl, SpRoleView) {

    /**
     * This view is a dialog view
     * @type {[Backbone.Marionette]}
     */
    var View = Marionette.CompositeView.extend({
        template: tpl,
        childViewContainer: '.role-list',
        childView: SpRoleView,

        ui: {
            taskType :         '[name="taskType"]',
            brhNo :            '[name="brhNo"]',
            specialBrh:        '[name="special-brh"]',
            form:              '.default-rule-form'
        },

        events: {
            'click .create-new-role'  : 'onCreateNewRole',
            'change .valid-select2': function (e) {
                $(e.target).trigger('keyup');
            },
            'change [name="taskType"]': 'onTaskTypeOrBrhNoChange',
            'change [name="brhNo"]':    'onTaskTypeOrBrhNoChange'
        },

        initialize: function () {
            this.collection = new Backbone.Collection();
        },

        onRender: function () {
            var me = this;
            this.addBrhSelect2(this.ui.brhNo, '000');
            this.addBrhSelect2(this.ui.specialBrh, this.ui.brhNo);
            this.addTaskTypeSelect2(this.ui.taskType);

            _.defer(function () {
                me.onTaskTypeOrBrhNoChange();
            });

            this.ui.form.validate({
                rules: {
                    taskType:  { required: true },
                    brhNo:     { required: true }

                }
            });

        },


        onCreateNewRole: function () {
            if (this.ui.specialBrh.data('select2') && this.ui.specialBrh.val()) {
                var brhData = this.ui.specialBrh.select2('data');
                var taskData = this.ui.taskType.select2('data') || {};
                this.collection.add({brhNo: brhData.key, brhName: brhData.value, mapType: 1, taskType: taskData.id});
                this.ui.specialBrh.select2('data', null);
            }
        },

        onChildviewClickSpecialRemove: function (childView, obj) {
            var model = obj.model;

            this.collection.remove(model);
        },

        onTaskTypeOrBrhNoChange: function () {
            var brhData = this.ui.brhNo.select2('data') || {};
            var taskData = this.ui.taskType.select2('data') || {};


            this.collection.reset();
            this.collection.add({brhNo: brhData.key, mapType: 0, taskType: taskData.id});
        },

        addTaskTypeSelect2: function ($sel) {

            this.ajaxTaskType(function (data) {
                $($sel).select2({
                    placeholder: '选择任务类型',
                    data: data
                });
            });
            
        },


        ajaxTaskType: function (callback) {
            Opf.ajax({
                url: url._('task.map.type'),
                type: 'GET',
                success: function (resp) {
                    var result = [];
                    _.each(resp, function (data) {
                        result.push({id: data.authCode + ',' + data.subType, text: data.authName});
                    });

                    callback(result);
                }

            });
        },

        addBrhSelect2: function ($sel, $upBrh) {
             $($sel).select2({
                placeholder: '选择机构',
                minimumInputLength: 1,
                ajax: {
                    type: 'GET',
                    url: url._('task.map.brh'),
                    dataType: 'json',
                    data: function (term) { 
                        return typeof $upBrh === 'string' ?{ kw: encodeURIComponent(term), upBrh: '000' } :  { kw: encodeURIComponent(term), upBrh: $upBrh.val() }; 
                    },
                    results: function (data) { return { results: data }; }
                },
                initSelection: function () {},
                id: function (data) { return data.key; },
                formatResult: function(data){ return data.value; },
                formatSelection: function(data){ return data.value; }

            });
        },



        getValues: function () {
            var data = this.ui.taskType.select2('data');
            var arr = data.id.split(',');
            var obj = {
                authCode:   arr[0],
                authName:   data.text,
                subType:    arr[1]
            };

            var results = [];

            this.children.each(function (childView) {
                results.push($.extend(true, childView.getValues(), obj));
            });

            return results;
        },

        validate: function () {
            var result = this.ui.form.valid();

            this.children.each(function (childView) {
                if (!childView.validate()) {
                    result = false;
                }
            });

            return result;
        }


    });


    return View;

});