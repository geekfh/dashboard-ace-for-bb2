define([
'App',
'tpl!app/oms/disc/add/templates/add.tpl',
'app/oms/disc/disc-algos-grid',
'common-ui'
], function(App, tpl, GridView, CommonUI) {

    var View = Backbone.View.extend({

        onSubmit: function () {

            var me = this;
            var $submitBtn = this.$submitBtn;

            var type = this.viewA.getTypeValue();
            var data = [];
            var valid = true;

            // if(type === 'brh') {
            //     valid = this.viewA.validate();
            // }else{
            //     valid = this.viewA.validate() && this.viewB.validate();
            // }
            valid = this.viewA.validate();

            if(valid === false) return;


            data.push(this.viewA.getValues());

            // if(type !== 'brh') {
            //     // console.log('提交两个表单');
            //     data.push(this.viewB.getValues());
            // }

            Opf.UI.busyText($submitBtn.find('.text'));
            me.canClose = true;
            Opf.ajax({
                url: url._('disc'),
                data: JSON.stringify(data), 
                type: 'POST',
                success: function (resp) {
                    if(resp.success !== false) {
                        me.$dialog.dialog('close');
                        me.trigger('submit');
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

            var branchCode = this.viewA.getBranchCode();
            var type = this.viewA.getTypeValue();
            var name = this.viewA.getNameVal();
            var otherTypeVal;//另一个面板的type值

            this.togglePanel('B');

            this.ensureViewB();

            if(type === 'mcht') {
                otherTypeVal = 'sale';
            }else /*sale*/{
                otherTypeVal = 'mcht';
            }
            this.canClose = true;
            this.viewB.setTypeValue(otherTypeVal);
            this.viewB.setNameVal(name);
            this.viewB.setBranchCode(branchCode);

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
 
        onTypeSwitch: function (type) {
            // mcht
            // sale
            // brh
            // console.log('typechange', type);
            if(type === 'mcht' || type === 'sale') {
                this.$submitBtn.hide();
                this.$nextBtn.show();
                this.populateNextBtnText(type);
                this.$el.find('[name="branchCode"]').closest('tr').show();

            }else {
                this.$submitBtn.show();
                this.$nextBtn.hide();
                this.$el.find('[name="branchCode"]').closest('tr').hide();

            }
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
                    //跳出循环，关闭跳出框
                    if(me.canClose){
                        return true;
                    }

                    Opf.confirm("确定要执行该操作吗，点击取消后，所填数据将不会保存", function(result){
                        if(result){
                            me.canClose = true;
                            //执行dialog的close方法之后再次调用beforeClose                   
                            //此前canClose设置为true保证顺利关闭dialog
                            me.$dialog.dialog('close');
                            me.canClose  = false;
                        }                                               
                    });

                    return false;                

                },

                buttons: [/*{
                        className: 'goback pull-left',
                        icons: {primary: 'icon-reply'},
                        text: '返回',
                        click: _.bind(this.onBack, this)
                    },*/{
                        className: 'submit',
                        icons: {primary: 'icon-ok'},
                        text: '提交',
                        click: _.bind(this.onSubmit, this)
                    },/* {
                        className: 'next',
                        icons: {primary: 'icon-arrow-right'},
                        text: '下一步',
                        click: _.bind(this.onNext, this)
                    }, */{
                        className: 'cancel',
                        icons: {primary: 'icon-remove'},
                        text: '取消',
                        click: _.bind(this.onCancel, this)
                    }

                ]
            });
    
            setTimeout(function () {
                style($dialog);
            }, 1);


            var $btnPanel = $dialog.next('.ui-dialog-buttonpane');
            // this.$gobackBtn = $btnPanel.find('button.goback').hide();
            this.$submitBtn = $btnPanel.find('button.submit');
            // this.$nextBtn = $btnPanel.find('button.next');
            this.$cancelBtn = $btnPanel.find('button.cancel');

            this.$panelA = $dialog.find('.part-1');
            // this.$panelB = $dialog.find('.part-2');

            // this.$panelB.find('[name="type"]').prop('disabled', true);
            // this.$panelB.find('[name="name"]').prop('disabled', true);
            // this.$panelB.find('[name="branchCode"]').prop('disabled', true);

            this.viewA = new FormView(this.$panelA);
            // this.viewB = new FormView(this.$panelB);
            // this.viewB.toggle(false);

            // this.$panelA.find('[name="type"]').change(function () {
            //     me.onTypeSwitch($(this).val());
            // }).trigger('change');

            /*CommonUI.branch4Disc((this.$panelA.add(this.$panelB)).find('[name="branchCode"]'));*/
        }

    });

    function FormView ($panel) {
        this.$panel = $panel;

        this.$form = $panel.find('form');
        this.$branchCode = this.$form.find('[name="branchCode"]');
        this.$type = this.$form.find('[name="type"]');
        this.$name = this.$form.find('[name="name"]');
        
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
                  maxlength: 12
                },
                'type': {
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

        setBranchCode: function (val) {
            this.$branchCode.val(val);
        },
        getBranchCode: function () {
            return this.$branchCode.val();
        },
        //返回表单名称字段的值
        getNameVal: function () {
            return this.$name.val();
        },
        setNameVal: function (val) {
            return this.$name.val(val);
        },
        getTypeValue: function () {
            return this.$type.val();
        },
        getTypeText: function () {
            return this.$type.find('option:selected').text();
        },
        setTypeValue: function (val) {
            this.$type.val(val);
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
                data[$(this).attr('name')] = $(this).val();
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