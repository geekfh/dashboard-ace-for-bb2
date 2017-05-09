define([
    'tpl!app/oms/promotions/management/list/templates/table-ct.tpl',
    'assets/scripts/fwk/component/uploader',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
],function(tpl, uploader){
    var filterEditOptsFn = function(jsonObj){
        return JSON.stringify(jsonObj).replace(/[\{|\}|'|"]/g, "").replace(/,/g, ";");
    };

    //活动对象类型
    var STATUS_MAP = {
        "1": "正常",
        "0": "关闭"
    };
    var STATUS_VALUE = {value:filterEditOptsFn(STATUS_MAP)};

    //是否满足活动条件
    var ISENABLE_MAP = {
        "1": "是",
        "0": "否"
    };
    var ISENABLE_VALUE = {value:filterEditOptsFn(ISENABLE_MAP)};

    //活动方式
    var PROMTSMODE_MAP = {
        "1": "按金额",
        "2": "按比例",
        "3": "按笔数"
    };

    //活动周期
    var PROMTSCYCLE_MAP = {
        "1": "天",
        "2": "周",
        "3": "月",
        "4": "仅一次"
    };

    //创建下拉列表
    var createOptions = function(url, $obj){
        Opf.ajax({
            url: url,
            type: 'GET',
            async: false,
            success: function (resp) {
                var tpl = _.map(resp,function(item){
                    var value = item.value||item.text||"";
                    var text = item.text||item.value||"";
                    return 	'<option value="' + value + '">' + text + '</option>';
                }).join('');
                var $options = $(tpl);
                $obj.append($options);
            }
        });
    };

    //格式化日期
    var dateFormatter = function(value) {
        return value ? moment(value, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    };

    //格式化字符串
    var stringFormatter = function(str) {
        return str ? str : '';
    };

    //格式化数据
    var numberFormatter = function(value) {
        var strValue = value ? ""+value : "";
        if(/^\.(\d)+$/.test(strValue)){
            strValue = "0"+strValue;
        }
        return strValue;
    };

    return Marionette.ItemView.extend({
        tabId: 'menu.promotions.management',
        template: tpl,
        events: {
        },

        initialize: function (options) {
            //TODO
        },

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        generateImportBtn: function (grid) {
            var me = this;
            setTimeout(function () {
                Opf.Grid.navButtonAdd(grid, {
                    caption: "",
                    id: "importPromObjTarget",
                    name: "importPromObjTarget",
                    title: '导入',
                    buttonicon: "icon-upload-alt white",
                    position: "last",
                    onClickButton: function () {
                        uploader.doImport({
                            uploadUrl: url._('promotions.management.import'),
                            uploadTpl: url._('promotions.management.download.tpl'),
                            uploadParams: [
                                {label:'选择相应的优惠活动', type:'select', name:'promtsModName', url:url._('promotions.management.get.promotsName')}
                            ],
                            cbSuccess: function(queueId){
                                me.grid.trigger("reloadGrid", [{current:true}]);
                            }
                        });
                    }
                });
            }, 10);
        },

        renderGrid: function () {
            var me = this;

            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    //要对select2作验证，选择添加select2前 input 的 name
                    //required: {boolean}
                    //number: {boolean},
                    //maxLength {number}
                    rules: {
                        objNo: {required:true},
                        amount: {required:true,number:true}
                    }
                });
            };

            var grid = me.grid = App.Factory.createJqGrid({
                caption: '优惠对象管理',
                rsId:'promotions.management',
                gid: 'promotions-management-grid',
                url: url._('promotions.management.list'),
                datatype: 'json',
                nav: {
                    formSize: {
                        height: 530
                    },
                    add: {
                        beforeShowForm: function(form){
                            //增加校验规则
                            addValidateRules(form);

                            //去掉多余项
                            var invalidField,
                                invalidFields = ["status", "isenable", "amount"];
                            for(var i=0; i<invalidFields.length; i++){
                                invalidField = invalidFields[i];
                                $("#tr_"+invalidField, form).hide();
                            }

                            //禁用相关项
                            var disableField,
                                disableFields = ["objName"];
                            for(var j=0; j<disableFields.length; j++){
                                disableField = disableFields[j];
                                $("input[name='"+disableField+"']", form).attr("disabled", true);
                            }

                            //活动对象编号
                            var $objNo = $("input[name='objNo']", form);
                            var oldMchtNo = newMchtNo = "";
                            $objNo.on('blur', function(){
                                newMchtNo = $objNo.val();
                                if(oldMchtNo==newMchtNo) return;
                                oldMchtNo = newMchtNo;
                                $.ajax({
                                    type: 'get',
                                    async: false,
                                    url: url._('promotions.management.get.mchtName'),
                                    data: {mchtNo:newMchtNo},
                                    success: function(res){
                                        var value = res&&res.value || "";
                                        if(value!==""){
                                            $("input[name='objName']", form).val(value);
                                            $("label[for='objName']", form).remove();
                                        } else {
                                            var errorInfo = '<label for="objName" style="display:block;color:#d16e6c;">没有查到对应商户名！</label>';
                                            if($("label[for='objName']", form).length==0){
                                                $("input[name='objName']", form).after(errorInfo).val("");
                                            } else {
                                                $("label[for='objName']", form).show();
                                            }
                                        }
                                    }
                                })
                            });

                            //获取活动名称下拉列表
                            var $select = $('<select for="promtsName" role="select"></select>');
                            var $promtsName = $("input[name='promtsName']").hide();
                            var promtsNameWrapper = $promtsName.parent();
                                promtsNameWrapper.append($select);
                            createOptions(url._('promotions.management.get.promotsName'), $select);
                            setTimeout(function(){
                                $promtsName.val($select.val());
                                $select.on('change', function(){
                                    $promtsName.val($(this).val());
                                });
                            },100);
                        },
                        beforeSubmit: function(postdata, form){
                            var validateBeforeSubmit = Opf.Validate.setup;
                            var ret = validateBeforeSubmit(postdata, form);
                            if($("label[for='objName']", form).length>0)
                                ret[0]=false;
                            return ret;
                        }
                    },
                    edit: {
                        beforeShowForm: function(form){
                            addValidateRules(form);

                            //禁用相关项
                            var disableField,
                                disableFields = ["objNo", "objName", 'promtsName'];
                            for(var j=0; j<disableFields.length; j++){
                                disableField = disableFields[j];
                                $("input[name='"+disableField+"']", form).attr("disabled", true);
                            }
                        },
                        beforeSubmit: setupValidation
                    },
                    view: {
                        width: 800,
                        beforeShowForm: function(form){
                            var wrapper = form;
                            form.parent().attr("class", "widget-main widget-body no-padding").css({marginTop:"-5px"});

                            var $objNo = $("#v_objNo", form);
                            var objNo = $.trim($objNo.text());
                            $.get(url._('promotions.management.get.promotsView'), {objNo:objNo}, function(res){
                                var items = res||[];
                                var table = '<table class="table table-bordered table-striped">';
                                    table += '<thead class="thin-border-bottom"><tr>';
                                    table += '<th>优惠对象编号</th>';
                                    table += '<th>优惠对象名称</th>';
                                    table += '<th>活动方案</th>';
                                    table += '<th>优惠额度</th>';
                                    table += '<th>优惠日期</th>';
                                    table += '<th>备注</th>';
                                    table += '</tr></thead></table>';
                                var $table = $(table);
                                var tr = '<tr>';
                                    tr += '<td></td>';
                                    tr += '<td></td>';
                                    tr += '<td></td>';
                                    tr += '<td></td>';
                                    tr += '<td></td>';
                                    tr += '<td></td>';
                                    tr += '</tr>';
                                var $tr = $(tr);
                                $.each(items, function(i, item){
                                    var _$tr = $tr.clone();
                                        _$tr.find("td:nth-child(1)").text(item.objNo);
                                        _$tr.find("td:nth-child(2)").text(stringFormatter(item.objName));
                                        _$tr.find("td:nth-child(3)").text(stringFormatter(item.promtsName));
                                        _$tr.find("td:nth-child(4)").text(numberFormatter(item.dealAmt));
                                        _$tr.find("td:nth-child(5)").text(dateFormatter(item.promtsDate)||"");
                                        _$tr.find("td:nth-child(6)").text(stringFormatter(item.remark));
                                    $table.append(_$tr);
                                });
                                $table.appendTo(wrapper);
                            });

                            wrapper.empty();
                        }
                    }
                },
                colNames: {
                    id:             'id',
                    objNo:          '优惠对象编号',
                    objName:        '优惠对象名称',
                    promtsId:       '活动编号',
                    promtsName:     '活动名称',
                    status:         '活动对象状态',
                    promtsMde:      '活动方式',
                    isenable:       '是否满足活动条件',
                    dealAmt:     '活动已优惠金额',
                    dealCount:      '活动已优惠笔数',
                    amount:         '优惠交易额度',
                    promtsCycle:    '活动周期'
                },
                colModel: [
                    //活动方案id
                    {
                        name: 'id',
                        index:'id',
                        hidden: true
                    },

                    //优惠对象编号
                    {
                        width: 100,
                        name: 'objNo',
                        index: 'objNo',
                        editable: true,
                        search: true,
                        searchoptions: {
                            sopt: ['eq','ne']
                        }
                    },

                    //优惠对象名称
                    {
                        name: 'objName',
                        index: 'objName',
                        editable: true,
                        search: true,
                        searchoptions: {
                            sopt: ['eq','ne']
                        }
                    },

                    //活动编号
                    {
                        width: 100,
                        name: 'promtsId',
                        index: 'promtsId',
                        search: true,
                        searchoptions: {
                            sopt: ['eq','ne']
                        }
                    },

                    //活动名称
                    {
                        name: 'promtsName',
                        index: 'promtsName',
                        editable: true,
                        search: true,
                        searchoptions: {
                            sopt: ['eq','ne']
                        }
                    },

                    //活动对象状态
                    {
                        width: 80,
                        name: 'status',
                        index: 'status',
                        editable: true,
                        edittype: 'select',
                        editoptions: STATUS_VALUE,
                        formatter: function(value){
                            return STATUS_MAP[value]||"";
                        }
                    },

                    //活动方式
                    {
                        width: 60,
                        name: 'promtsMde',
                        index: 'promtsMde',
                        formatter: function(value){
                            return PROMTSMODE_MAP[value]||"";
                        }
                    },

                    //是否满足活动条件
                    {
                        name: 'isenable',
                        index: 'isenable',
                        editable: true,
                        edittype: 'select',
                        editoptions: ISENABLE_VALUE,
                        formatter: function(value){
                            return ISENABLE_MAP[value]||"";
                        }
                    },

                    //活动已优惠金额
                    {
                        width: 100,
                        name: 'dealAmt',
                        index: 'dealAmt',
                        formatter: function(value){
                            return numberFormatter(value);
                        }
                    },

                    //活动已优惠笔数
                    {
                        width: 100,
                        name: 'dealCount',
                        index: 'dealCount'
                    },

                    //优惠交易额度
                    {
                        width: 80,
                        name: 'amount',
                        index: 'amount',
                        editable: true,
                        editoptions: {
                            dataInit : function (elem) {
                                var oldValue = $(elem).val();
                                $(elem).val(numberFormatter(oldValue));
                            }
                        },
                        formatter: function(value){
                            return numberFormatter(value);
                        }
                    },

                    //活动周期
                    {
                        width: 60,
                        name: 'promtsCycle',
                        index: 'promtsCycle',
                        formatter: function(value){
                            return PROMTSCYCLE_MAP[value]||"";
                        }
                    }
                ],

                loadComplete: function () {
                    //console.info(me.$el);
                }
            });

            //生成导入按钮
            if(Ctx.avail('promotions.management.export')){
                me.generateImportBtn(grid);
            }
        }
    });
});