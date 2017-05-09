/**
 * Created by wupeiying on 2015/7/15.
 */
define([
    'App',
    'tpl!app/oms/disc/profit/add.tpl',
    'app/oms/disc/profit/profit_dialog_grid',
    'common-ui',
    'select2'
], function(App, tpl, GridView, CommonUI) {

    var View = Backbone.View.extend({

        onSubmit: function () {
            var me = this;
            var $submitBtn = this.$submitBtn;
            //var data = {};
            var valid = true;

            valid = this.viewA.validate();//验证填写内容是否为空，没填值则不给执行后台

            if(valid === false) return;

            //data.push(this.viewA.getValues());

            Opf.UI.busyText($submitBtn.find('.text'));
            me.canClose = true;
            Opf.ajax({
                url: url._('disc.service.profit.add'),
                data: JSON.stringify(this.viewA.getValues()),
                type: 'POST',
                success: function (resp) {
                    if(resp.success !== false) {
                        me.$dialog.dialog('close');
                        me.trigger('add:success');
                    }
                },
                complete: function () {
                    Opf.UI.busyText($submitBtn.find('.text'), false);
                }
            });
        },

        togglePanel: function (name) {
            var showA = name === 'A';
            this.viewA.toggle(showA);
            this.viewB.toggle(!showA);

            this.toggleBtn(name);
        },

        toggleBtn: function (name) {
            var showA = name === 'A';
            this.$nextBtn.toggle(showA);
            this.$submitBtn.toggle(!showA);
            this.$gobackBtn.toggle(!showA);
        },

        onBack: function () {
            this.canClose = true;
            this.togglePanel('A');
        },

        onNext: function () {
            if(this.viewA.validate() === false) {
                return;
            }
            var type = this.viewA.getTypeValue();
            var name = this.viewA.getNameVal();
            var serviceName = this.viewA.getServiceName();
            var branchCode = this.viewA.getbranchCode();
            var otherTypeVal;//另一个面板的type值

            this.togglePanel('B');

            this.ensureViewB();

            if(type === 'mcht') {
                otherTypeVal = 'sale';
            }else{
                otherTypeVal = 'mcht';
            }
            this.canClose = true;
            this.viewB.setTypeValue(otherTypeVal);
            this.viewB.setNameVal(name);
            this.viewB.setbranchCode(branchCode);
            this.viewB.setServiceName(serviceName);
        },

        onCancel: function () {
            this.canClose = false;
            this.$dialog.dialog('close');
        },

        populateNextBtnText: function (type) {
            var $text = this.$nextBtn.find('.text');
            if(!$text.length) {
                $text = this.$nextBtn.find('.ui-button-text');
            }
            var otherType = {'mcht':'sale','sale':'mcht'}[type];
            $text.text('继续添加 '+this.$panelA.find('[name="type"]').find('option[value="'+otherType+'"]').text());
        },

        ensureViewB: function () {
            if(!this.viewB) {
                this.viewB = new FormView(this.$panelB);
            }
            return this.viewB;
        },

        render: function () {
            var me = this;

            this.$el.append(tpl());

            //初始：不能关闭
            me.canClose = true;

            //**dialog返回的dom指向content部分
            var $dialog = this.$dialog = this.$el.dialog({
                title: $.jgrid.edit.addCaption,
                dialogClass: 'ui-jqdialog',
                width: Opf.Config._('ui', 'disc.grid.form.width'),
                height: Opf.Config._('ui', 'disc.grid.form.height'),
                modal: true,
                beforeClose : function () {
                    if(me.canClose){
                        return true;
                    }
                    Opf.confirm("确定要执行该操作吗，点击取消后，所填数据将不会保存", function(result){
                        if(result){
                            me.canClose = true;
                            me.$dialog.dialog('close');
                            me.canClose  = false;
                        }
                    });

                    return false;

                },
                buttons: [{
                    className: 'submit',
                    icons: {primary: 'icon-ok'},
                    text: '提交',
                    click: _.bind(this.onSubmit, this)
                },{
                    className: 'cancel',
                    icons: {primary: 'icon-remove'},
                    text: '取消',
                    click: _.bind(this.onCancel, this)
                }]
            });

            style($dialog);

            var $btnPanel = $dialog.next('.ui-dialog-buttonpane');
            this.$submitBtn = $btnPanel.find('button.submit');
            this.$cancelBtn = $btnPanel.find('button.cancel');

            this.$panelA = $dialog.find('.part-1');

            this.viewA = new FormView(this.$panelA);

            $('#disc-part-addview').parent().css('overflow-x','hidden');
        }

    });

    function FormView ($panel) {
        this.$panel = $panel;

        this.$form = $panel.find('form');
        this.$name = this.$form.find('[name="name"]');
        this.$serviceName = this.$form.find('[name="serviceName"]');
        this.$branchCode = this.$form.find('[name="branchCode"]');

        //加载机构数据
        this.$branchCode.select2({
            placeholder: '请选择终端挂属机构',
            minimumInputLength: 1,
            ajax: {
                type: "GET",
                url: url._('report.tree.searchOrg'),
                dataType: 'json',
                data: function (term, page) { //page is one base
                    return {
                        kw: encodeURIComponent(term),
                        number: page - 1
                    };
                },
                results: function (data, page) { // 返回除分页信息外的内容，要正确过滤备选项就在这里操作
                    var more = page < data.totalPages,
                    //过滤非直接下属机构
                        content = _.filter(data.content, function(item){
                            return item.orgLevel >= Ctx.getUser().get('brhLevel');
                        });
                    return {
                        results: content,
                        more: more
                    };
                }
            },
            // 如果不设ID，将不能选择列表
            id: function (e) {
                return e.id;
            },
            //格式化备选项，显示给用户。对每一个数组元素都执行此方法，data即为数组元素
            formatResult: function(data, container, query, escapeMarkup){
                return data.orgName;
            },
            //选中之后显示的内容
            formatSelection: function(data, container, escapeMarkup){
                var orgLevel = Ctx.getUser().get('brhLevel');
                //可选同级或下级
                return data.orgLevel >= orgLevel && data.orgName;
            }
        });
        this.$branchCode.on('change', function(){
            $(this).closest('form').find('[name="branchCode"]').hide();
        });

        this.$serviceName.select2({
            placeholder: '请选择关联服务',
            ajax: {
                type: "GET",
                url: url._('disc.service.profit.servicename'),
                dataType: 'json',
                data: function (term, page) {
                    return {
                        kw: encodeURIComponent(term),
                        number: page - 1
                    };
                },
                results: function (data) {
                    result = _.filter(data, function(item){
                        return item.name;
                    });
                    return {
                        results: result
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data){
                return data.name;
            },
            formatSelection: function(data){
                return data.name;
            }
        });

        this.gridView = new GridView({
            renderTo: this.$form
        }).render();

        this.attachValidation();
    }

    FormView.prototype = {
        validate: function () {
            if(!this.$form.valid()) {
                return false;
            }

            if(!this.gridView.valid()) {
                return false;
            }

            return true;
        },
        attachValidation: function () {
            this.$form.validate({
                rules: {
                    'name': {
                        required: true,
                        maxlength: 50
                    },
                    'serviceName': {
                        required: true
                    },
                    'branchCode': {
                        required: true
                    },
                    'status': {
                        required: true
                    }
                }
            });
        },
        setServiceName: function (val) {
            this.$serviceName.val(val);
        },
        getServiceName: function () {
            return this.$serviceName.val();
        },
        setbranchCode: function (val) {
            this.$branchCode.val(val);
        },
        getbranchCode: function () {
            return this.$branchCode.val();
        },
        getNameVal: function () {
            return this.$name.val();
        },
        setNameVal: function (val) {
            return this.$name.val(val);
        },
        toggle: function (toggle) {
            this.$panel.toggle(toggle);
            if(toggle) {
                Opf.resizeJqGrid(this.gridView.getGrid());
            }
        },
        getValues: function () {
            var data = {};
            //如果哪天需要获取隐藏字段，最好还是配置一个字段列表
            this.$form.find(':input').each(function () {
                if($(this).attr('name') != null){
                    if($(this).attr('name') == 'serviceName'){
                        data[$(this).attr('name')] = $(this).val();//复制给自己
                        data['id'] = $(this).val();//并复制给ID
                    }
                    else{
                        data[$(this).attr('name')] = $(this).val();
                    }
                }
            });
            data.algos = this.gridView.getRowDatas();
            return data;
        }
    };

    function style ($dialog) {
        $dialog.prev('.ui-widget-header').find('.ui-dialog-title').addClass('ui-jqdialog-title');
        $dialog.addClass('ui-jqdialog-content');
        var $btnPanel = $dialog.next('.ui-dialog-buttonpane');
        $btnPanel.find('button').addClass('fm-button  ui-corner-all fm-button-icon-left btn btn-sm btn-primary');
        $btnPanel.find('button .ui-icon').removeClass('ui-icon');
        $btnPanel.find('.ui-button-text').removeClass('ui-button-text').addClass('text');
    }

    return View;
});