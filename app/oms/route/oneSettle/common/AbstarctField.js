define(['tpl!app/oms/route/oneSettle/common/templates/base-field-item.tpl'], function(baseFieldItemTpl) {

    var FieldView = Marionette.ItemView.extend({
        template: baseFieldItemTpl,
        tagName: 'tr',
        className: 'field-wrap',

        templateHelpers: function() {
            return {
                label: this.getOption('label')
            };
        },

        triggers: {
            'click .btn-remove-field': 'btn:remove:click'
        },

        events: {
            'change .opr-select': 'onOprChange'
        },

        ui: {
            'oprSelect': '.opr-select',
            'singleValWrap': '.single-val-wrap',
            'mulValWrap': '.mul-val-wrap'
        },

        getObjValue: function () {
            return {
                factor: this.getOption('name'),
                opr: this.ui.oprSelect.val(),
                value: this.getValue(),
                remark: this.getRemark()
            };
        },

        //@abstract
        getRemark: function () {
            return this.isMulOpr() ? this.getMulRemark() : this.getSingleRemark();
        },

        //@abstract
        getMulRemark: function () {
            return '';
        },

        //@abstract
        getSingleRemark: function () {
            return '';
        },

        //@abstract 通常你扩展了 setupMulVal 就要同时扩展这个方法
        setMulValue: function(val) {
            //TODO?效率可能低，最好 是 初始化 tagsinput 前就把值设置到input上，不过setupMulVal就不优雅了
            _.each(val.split(','), function (v) {
                this.$mulInput.tagsinput('add', v);
            }, this);
        },

        //@abstract
        setSingleValue: function(val) {
            this.$singleInput.val(val);
        },

        //@abstract
        getMulValue: function() {
            return this.$mulInput.val();
        },

        //@abstract
        getSingleValue: function() {
            return this.$singleInput.val();
        },

        //@abstract
        setValue: function () {
            return this[this.isMulOpr() ? 'setMulValue' : 'setSingleValue'].apply(this, arguments);
        },

        //@abstract
        getValue: function() {
            return this.isMulOpr() ? this.getMulValue() : this.getSingleValue();
        },

        //@abstract 只会调用一次
        setupMulVal: function() {
            var placeholderTxt = this.getOption('label')+' （回车输入）';
            this.$mulInput = $('<input name="mul" class="mul-input">')//
                                .attr('placeholder', placeholderTxt) //
                                .appendTo(this.ui.mulValWrap);

            this.mulTags = this.$mulInput.tagsinput({
                trimValue: true
            });
        },

        //@abstract 只会调用一次
        setupSingleVal: function() {
            this.$singleInput = $('<input name="single" class="single-input">') //
            .appendTo(this.ui.singleValWrap);
        },

        isMulOpr: function() {
            var oprVal = this.ui.oprSelect.val();
            return oprVal === 'in' || oprVal === 'not_in';
        },

        _setupMulVal: function() {
            if (!this._mulValRendered) {
                this.setupMulVal();
            }
            this._mulValRendered = true;
        },

        _setupSingleVal: function() {
            if (!this._singleValRendered) {
                this.setupSingleVal();
            }
            this._singleValRendered = true;
        },

        showSinleVal: function() {
            this.$el.find('.val-wrap').hide();
            this.ui.singleValWrap.show();
            this._setupSingleVal();
        },

        showMulVal: function() {
            this.$el.find('.val-wrap').hide();
            this.ui.mulValWrap.show();
            this._setupMulVal();
        },

        onOprChange: function() {
            if (this.isMulOpr()) {
                this.showMulVal();
            } else {
                this.showSinleVal();
            }
        },

        // @abstract
        validate: function () {
            return true;
        },

        // @abstract
        addValidator: function () {
            
        },

        onRender: function() {
            var $el = this.$el;
            var me = this;

            _.each(this.getOption('extraOprs'), function(opr) {
                me.ui.oprSelect.find('option.op-' + opr).show();
            });

            if (this.defaultOprsGt) {
                me.ui.oprSelect.val('gt');
                me.ui.oprSelect.find('.op-eq').hide();//隐藏 等于 选项
                me.ui.oprSelect.find('.op-uq').hide();//隐藏 不等于 选项
            }

            this.refresh();
            this.addValidator();
        },

        refresh: function() {
            var opr, value;

            if(this.model) {
                opr = this.model.get('opr');
                value = this.model.get('value');
            }

            //必须先设置 "操作"
            (opr !== void 0) && this.ui.oprSelect.val(opr);

            this.onOprChange();

            (value !== void 0) && this.setValue(value);
        }

    });

    return FieldView;

});