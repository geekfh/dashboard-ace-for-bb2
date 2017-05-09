define([
    'tpl!app/oms/param/task-map/list/templates/special-role.tpl'
], function(tpl) {

    var ItemView = Marionette.ItemView.extend({
        template: tpl,
        className: 'special-role-form',
        ui: {
            taskFlag:  '[name="taskFlag"]',
            form: '.special-form'
        },

        events: {
            'change [name="taskFlag"]': 'onTaskFlagChange',
            'change .brh-level-sel': 'onBrhLevelSelChange',
            'change [name^="roleCode"]': function (e) {
                $(e.target).trigger('keyup');
            }
        },

        triggers: {
            'click .remove-special-role': 'click:special:remove'
        },

        initialize: function () {

        },

        onRender: function () {
            this.ui.taskFlag.change();

            for(var i=1; i<=3; i++) {
                this.addRoleSelect2(this.$el.find('[name="roleCode' + i + '"]'), this.$el.find('[name="brhLevel' + i + '"]'));
            }

            this.ui.form.validate({
                rules: {
                    roleCode1: { required: true },
                    roleCode2: { required: true },
                    roleCode3: { required: true }
                }
            });
        },

        addRoleSelect2: function ($sel, $level) {
            var me = this;

            $($sel).select2({
                placeholder: '选择角色',
                minimumInputLength: 1,
                ajax: {
                    type: 'GET',
                    url: url._('task.map.role'),
                    dataType: 'json',
                    data: function (term) { return { kw: encodeURIComponent(term), level: $level.val() }; },
                    results: function (data) { return { results: data }; }
                },
                initSelection: function () {},
                id: function (data) { return data.key; },
                formatResult: function(data){ return data.value; },
                formatSelection: function(data){ return data.value; }

            });

        },

        onTaskFlagChange: function () {
            var flag = this.ui.taskFlag.val();

            this.$el.find('[SpTaskLink]').each(function () {
                $(this).toggle($(this).attr('SpTaskLink') <= flag);
            });
        },

        onBrhLevelSelChange: function (e) {
            var $el = $(e.target),
                brhLevLink = $el.attr('brhLevLink');

            this.updateBrhLevelSelect(brhLevLink, $el.val());
        },

        updateBrhLevelSelect: function (index, value) {
            var me = this;

            this.$el.find('.brh-level-sel').each(function () {
                var $this = $(this);
                if ($this.attr('brhLevLink') > index) {
                    refreshLevelType($this, value);
                }
            });
        },

        getValues: function () {
            var $el = this.$el;
            var model = this.model;

            return {
                mapType   : model.get('mapType'),
                brhNo     : model.get('brhNo'),
                taskFlag  : this.ui.taskFlag.val(),
                brhLevel1 : $el.find('[name="brhLevel1"]:visible').val(),
                roleCode1 : $el.find('[name="roleCode1"]:visible').val(),
                brhLevel2 : $el.find('[name="brhLevel2"]:visible').val(),
                roleCode2 : $el.find('[name="roleCode2"]:visible').val(),
                brhLevel3 : $el.find('[name="brhLevel3"]:visible').val(),
                roleCode3 : $el.find('[name="roleCode3"]:visible').val()

            };
        },
        validate: function () {
            return this.ui.form.valid();
        }
    });

    function refreshLevelType($sel, i) {
        if (i == -1) {
            i = 7;
        }

        if ($sel.val() >= i) {
            $sel.val('0');
            $sel.trigger('change');
        }

        $sel.find('option').each(function () {
            $(this).attr('hidden', $(this).attr('value') > i);
            $(this).attr('disabled', $(this).attr('value') > i);
        });
    }
    
    return ItemView;
});