define(['App',
    'tpl!app/oms/param/disc-algo/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/param',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang) {

    var CARDTYPE_MAP = {
        '0': paramLang._('disc-algo.card.type.0'),
        '1': paramLang._('disc-algo.card.type.1'),
        '2': paramLang._('disc-algo.card.type.2'),
        '3': paramLang._('disc-algo.card.type.3'),
        '4': paramLang._('disc-algo.card.type.4')
    };

    var FLAG_MAP = {
        '1': paramLang._('disc-algo.flag.1'),
        '2': paramLang._('disc-algo.flag.2')/*,
        '3': paramLang._('disc-algo.flag.3'),
        '4': paramLang._('disc-algo.flag.4'),
        '5': paramLang._('disc-algo.flag.5'),
        '6': paramLang._('disc-algo.flag.6'),
        '7': paramLang._('disc-algo.flag.7'),*/
    };

    var FEE_LABEL_MAP = {
        '1': paramLang._('disc-algo.fee.value') + paramLang._('percent.bracket'),
        '2': paramLang._('disc-algo.fee.value') + paramLang._('yuan.bracket')
    };

    var count = 0;

    var feeTips = {
        content: paramLang._('disc-alog.fee.range.tips'),
        placement: 'top'
    };

    var GridView = Backbone.View.extend({

        className: 'row',

        tpl: function () {
            count++;
            return [
                '<div class="col-xs-12 jgrid-container">',
                    '<table id="disc-algos-grid-',count,'-table"></table>',
                    '<div id="disc-algos-grid-',count,'-pager" ></div>',
                '</div>',
            ].join('');
        },

        gid: function () {
            return 'disc-algos-grid-' + count;
        },

        initialize: function (options) {
            this.$renderTo = $(options.renderTo);
            this._gridOptions = options.gridOptions;
        },

        /**
         * 覆盖render的原因，一般我们list-view种的表格绘制需要的容器都在相应的模版中
         * 当view绘制完后才会添加到页面中，jqgrid通过全局选择器去找dom的时候可能会找不到
         * 这里就先把容器都放到页面上，再去绘制dom
         */
        render: function (records) {
            this.$el.append(this.tpl());

            this.renderGrid();

            // 由于在数据回来之前默认('.ui-jqgrid-htable')的样式是{'visibility': 'hidden'}，但是在这个View中数据回来之前就需要显示出来
            // TODO 暂时这样修改
            $(this.grid).closest('.ui-jqgrid').find('.ui-jqgrid-htable').css({'visibility': 'visible'});

            records && this.addRows(records);

            return this;
        },

        valid: function () {
            var $titlebar = this.$el.find('.ui-jqgrid-titlebar');
            var errorMsg = '';
            var isValid = true;
            if(this.grid && !this.grid.getDataIDs().length) {
                errorMsg = '不能为空';
                isValid =  false;
            }else {
                isValid =  true;
            }

            if(isValid) {
                $titlebar.find('.help-error').remove();
            }else {
                $titlebar.find('.help-error').remove();
                $titlebar.append('<span class="help-error ui-jqgrid-title">' + errorMsg + '</span>');
            }

            return isValid;
        },

        getRowDatas: function () {
            var ret = [], grid;
            if(grid = this.grid) {
                // ret = this.grid.getRowData();
                _.each(grid.getDataIDs(), function (rowId) {
                    ret.push(grid._getRecordByRowId(rowId));
                });
            }
            return ret;
        },

        addRows: function (records) {
            records = $.isArray(records) ? records : [records];
            var me = this;
            _.each(records, function (r, i) {
                //row id 是什么都没关系
                me.grid.jqGrid('addRowData', Opf.Util.id(), r);
            });
        },

        getGrid: function () {
            return this.grid;
        },

        renderGrid: function() {
            var me = this;
            
            this.$el.insertAfter(this.$renderTo);

            //TODO validation
            var grid = this.grid = App.Factory.createJqGrid($.extend({
                forceCpation: true,
                gid: me.gid(), //innerly get corresponding ct '#disc-algos-grid-table' '#disc-algos-grid-pager'
                //jqgrid会选择器在全局查找dom，避免grid渲染那一刻，找不到dom
                //提供一个父级元素来查找
                // elRoot: this.$el,
                rsId: 'discalgo',
                caption: paramLang._('disc-algo.txt'),
                dataProxy: function (ajaxOptions, xx, postdata) {
                    var data = ajaxOptions.data;
                    // var rowData = $.extend({}, pos);
                    var rowData;
                    if(postdata.oper === 'add') {
                        rowData = JSON.parse(ajaxOptions.data);
                        me.addRows(rowData);

                    }else if(postdata.oper === 'edit'){
                        //TODO 位置
                        // grid.jqGrid('delRowData', this.p.selrow);
                        rowData = JSON.parse(ajaxOptions.data);
                        grid.jqGrid('setRowData',this.p.selrow, rowData);
                    }else {

                        grid.jqGrid('delRowData', this.p.selrow);

                    }
                    me.valid();
                },
                nav: {
                    // edit: {
                    //     zIndex: 99999999
                    // }
                    actions: {
                        search: false,
                        refresh: false
                    },

                    formSize: {
                        width: Opf.Config._('ui', 'discalgo.grid.form.width'),
                        height: Opf.Config._('ui', 'discalgo.grid.form.height')
                    },

                    edit: {
                        beforeShowForm: function (form) {
                            attachValidation(form);
                        },
                        afterShowForm:function(form){
                            var $flag = $(form).find('select[name=flag]');
                            $flag.blur();
                        },
                        beforeSubmit: Opf.Validate.setup,
                        useDataProxy: true
                    },

                    add: {
                        beforeShowForm: function (form) {
                            attachValidation(form);
                        },
                        afterShowForm:function(form){
                            var $flag = $(form).find('select[name=flag]');
                            $flag.blur();
                        },
                        beforeSubmit: Opf.Validate.setup,
                        useDataProxy: true
                    },
                    del: {
                        useDataProxy: true
                    },

                    view:{
                        beforeShowForm: function (form) {
                            checkFeeValue(form);
                        }
                    }
                    
                },
                pager: false,
                // url: url._('disc-algo'),
                colNames: [
                    paramLang._('id'),
                    // paramLang._('code'),
                    paramLang._('disc-algo.flag'),
                    paramLang._('disc-algo.min.fee'),
                    paramLang._('disc-algo.max.fee'),
                    paramLang._('disc-algo.floor.amount'),
                    paramLang._('disc-algo.upper.amount'),
                    paramLang._('disc-algo.fee.value'),
                    paramLang._('disc-algo.card.type')
                ],

                responsiveOptions: {
                    hidden: {
                        ss: ['flag', 'feeValue', 'cardType'],
                        xs: ['feeValue', 'cardType'],
                        sm: ['cardType'],
                        md: [],
                        ld: []
                    }
                },

                colModel: [
                    {name:          'id', index:          'id', editable: false,    hidden:              true},
                    {name:        'flag', index:        'flag', editable:  true, 
                        formatter:     flagFormatter,
                        edittype:'select',
                        editoptions: {value: FLAG_MAP},
                        formoptions:{rowpos:4}
                    },
                    // {name:        'code', index:        'code', editable: true},
                    {name:      'minFee', index:      'minFee', editable: true, formoptions:{_tips: feeTips,label: fmtFeeFormLabel, rowpos:6}},
                    {name:      'maxFee', index:      'maxFee', editable: true, formoptions:{_tips: feeTips,label: fmtFeeFormLabel, rowpos:7}},
                    {name: 'floorAmount', index: 'floorAmount', editable: true, formoptions:{label: fmtFeeFormLabel, rowpos:2}},
                    {name: 'upperAmount', index: 'upperAmount', editable: true, formoptions:{label: fmtFeeFormLabel, rowpos:3}},
                    {name:    'feeValue', index:    'feeValue', editable: true, formoptions:{rowpos:5}},
                    {name:    'cardType', index:    'cardType', editable:  true, 
                        formatter: cardTypeFormatter,
                        edittype:'select',
                        editoptions: {value: CARDTYPE_MAP}}
                ],

                loadComplete: function() {}
            }, this._gridOptions));

            this.$el.find('.ui-jqgrid-pager').hide();

        }

    });

    function fmtFeeFormLabel (col, colLabel) {
        return colLabel + paramLang._('yuan.bracket');
    }

    function fmtFeeValueLabel (col, colLabel) {
         return colLabel + paramLang._('percent.bracket');
    }

    function cardTypeFormatter(val) {
        return CARDTYPE_MAP[val];
    }

    function flagFormatter(val) {
        if (FLAG_MAP[val]) {
            return FLAG_MAP[val];
        } else return '其他';
    }

    function attachValidation (form) {
        var $form = $(form);
        var $minFee = $form.find('[name="minFee"]');
        var $maxFee = $form.find('[name="maxFee"]');
        var $floorAmount = $form.find('[name="floorAmount"]');
        var $upperAmount = $form.find('[name="upperAmount"]');
        var $flag = $form.find('[name="flag"]');
        var $feeValue = $form.find('[name="feeValue"]');
        var $feeLabel = $feeValue.closest('tr').find('.CaptionTD');

        Opf.Validate.addRules(form, {
            rules: {
                minFee: {
                    required: {
                        depends: function () {
                            return !$(this).prop('disabled');
                        }
                    },
                    floatGteZero: true
                },
                maxFee: {
                    required: {
                        depends: function () {
                            return !$(this).prop('disabled');
                        }
                    },
                    floatGteZero: true,
                    gt: {
                        param: $minFee,
                        depends: function () {
                            //最大最小可以同时为0，囧~~
                            return !($minFee.val() =='0' && $maxFee.val() == '0');
                        }
                    }
                },
                floorAmount: {
                    required: true,
                    floatGteZero: true
                },
                upperAmount: {
                    required: true,
                    floatGteZero: true,
                    gt: {
                        param: $floorAmount,
                        depends: function () {
                            return !($floorAmount.val() =='0' && $upperAmount.val() == '0');
                        }
                    }
                },
                feeValue: {
                    required: true,
                    floatGteZero: true,
                    range: {
                        param: [0, 150],
                        depends: function () {
                            return $flag.val() == 1;//按比比例 的 时候是小于1百分数
                        }
                    }
                }
            },
            messages: {
                maxFee: {
                    gt: $.format('{0} 必须大于 {1}', 
                            [paramLang._('disc-algo.max.fee'),
                            paramLang._('disc-algo.min.fee')])
                },
                upperAmount: {
                    gt: $.format('{0} 必须大于 {1}', 
                            [paramLang._('disc-algo.upper.amount'),
                            paramLang._('disc-algo.floor.amount')])
                }
            }
        });

        $flag.on('change', function () {
            var flagVal = $(this).val();
            var feeLabelTxt = FEE_LABEL_MAP[flagVal] || paramLang._('disc-algo.fee.value');

            var $minMaxInputGroup = $minFee.add($maxFee);
            var $minMaxRowGroup = $minMaxInputGroup.closest('tr');

            if(flagVal == 1) {//按比比例
                $minMaxRowGroup.show();
                // minMaxGroup.prop('disabled', false);
            }

            else if(flagVal == 2) {//按比固定
                $minMaxRowGroup.hide();
                // minMaxGroup.val('').prop('disabled', true);
            }
            $minMaxInputGroup.removeClass('error');

            $feeLabel.text(feeLabelTxt);

            $form.valid();

        }).trigger('change');
    } 

    function checkFeeValue (form) {
        var $flag = $(form).find('#v_flag span');
        var $feeValueLabel = $(form).find('#trv_feeValue .form-view-label b');
        var feeValueText = $flag.text() === "按笔固定" ? paramLang._('yuan.bracket'):paramLang._('percent.bracket');
        $feeValueLabel.text(paramLang._('disc-algo.fee.value') + feeValueText);
    }

    return GridView;

});