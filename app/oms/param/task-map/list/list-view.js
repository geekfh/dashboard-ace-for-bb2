
define(['App',
    'tpl!app/oms/param/task-map/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/param',
    'app/oms/param/task-map/list/add-view',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'select2'
], function(App, tableCtTpl, paramLang, AddView) {

    var TASKFLAG_MAP = {
        '0': paramLang._('task.map.task.flag.0'),
        '1': paramLang._('task.map.task.flag.1'),
        '2': paramLang._('task.map.task.flag.2'),
        '3': paramLang._('task.map.task.flag.3')
    },

    SUBTYPE_MAP = {
        '101': paramLang._('task.map.sub.type.101'),
        '102': paramLang._('task.map.sub.type.102'),
        '103': paramLang._('task.map.sub.type.103'),
        '104': '新增直销拓展员',
        '106': '新增外卡商户',
        '107': '新增二维码商户',
        '205': '修改银行账户',
        '206': '开通宝实名认证',
        '207': '商户补充资料',
        '208': '直销人员补充资料审核',
        '304': 'T+0提额'
    },

    TASKTYPE_MAP = {
        '0': paramLang._('task.map.task.type.0'),
        '1': paramLang._('task.map.task.type.1'),
        '2': paramLang._('task.map.task.type.2')
    },

    MAPTYPE_MAP = {
        '0': paramLang._('task.map.mapType.0'),
        '1': paramLang._('task.map.mapType.1'),
        '2': paramLang._('task.map.mapType.2')
    },

    LEVEL_MAP = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6
    };

    var VIEWABLES = ['brhLevel', 'roleName'];

    App.module('ParamSysApp.TaskMap.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.TaskMaps = Marionette.ItemView.extend({
            tabId: 'menu.param.task.map',
            template: tableCtTpl,

            events: {

            },

            onRender: function() {
                var me = this;

                setTimeout(function() {

                    me.renderGrid();

                }, 1);
            },

            renderGrid: function() {
                var validation = attachValidation();

                var roleGird = App.Factory.createJqGrid({
                    rsId: 'taskMap',
                    caption: paramLang._('taskMap.txt'),
                    actionsCol: {
                        del: false
                    },
                    nav: {
                        actions: {
                            search: false,
                            addfunc: function () {
                                var view = new AddView();
                                var $dialog = Opf.Factory.createDialog(view.render().$el, {
                                    destroyOnClose: true,
                                    title: '新增任务配置',
                                    autoOpen: true,
                                    width: 500,
                                    height: 600,
                                    modal: true,
                                    buttons: [{
                                        type: 'submit',
                                        click: function () {
                                            if (view.validate()) {
                                                Opf.ajax({
                                                    url: url._('task.map.add'),
                                                    type: 'POST',
                                                    jsonData: view.getValues(),
                                                    success: function () {
                                                        $dialog.dialog('destroy');
                                                        Opf.Toast.success('操作成功');
                                                        roleGird.trigger('reloadGrid', {current: true});
                                                    }
                                                });
                                                
                                            }
                                        }
                                    }, {
                                        type: 'cancel'
                                    }]
                                });
                            }
                        },
                        edit: {
                            beforeShowForm: function(form) {
                                validation.addValidateRules(form);
                                var $form = $(form);

                                $form.find('#taskFlag').on('change', taskFlagChange).trigger('change');
                                $form.find('#subType').prop('disabled', true);

                                bindSubTypeEvent(form);

                                bindLevelSelectChange(form, {level: 1, changeToLevel: 2});
                                bindLevelSelectChange(form, {level: 2, changeToLevel: 3});
                                setBrhLevel(form, roleGird);

                                compressText('#roleCode1', '#roleCode2', '#roleCode3');
                            },

                            afterShowForm: function(form) {
                                var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));
                                //弹出对话框时，dom是动态设置上去的，但这个时候对应的值早就在弹框前设上去了，导致某些dom（主要是select）显示不对
                                //所以先把值拿出来，trigger以下再将值设回去
                                applyValueIntoSelect(form, rowData);
                                //设置select2
                                _.defer(function(){
                                    addSelect2($('#roleCode1'), $('#brhLevel1'), rowData.roleName1);
                                    addSelect2($('#roleCode2'), $('#brhLevel2'), rowData.roleName2);
                                    addSelect2($('#roleCode3'), $('#brhLevel3'), rowData.roleName3);
                                });
                            },

                            onclickSubmit: function(params, postdata) {
                                var num = parseInt(postdata['taskFlag']);

                                for(var i=num+1; i<=3; i++) {
                                    delete postdata['brhLevel' + i];
                                    delete postdata['roleCode' + i];
                                }

                                return postdata;
                            },
                            beforeSubmit: validation.setupValidation
                        },
                        view: {
                            height: 430,
                            beforeInitData: function() {
                                var num = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird))['taskFlag'];
                                num = parseInt(num);
                                var i;

                                for(i=1; i<=num; i++) {
                                    _.each(VIEWABLES, function(val) {
                                        $(roleGird).jqGrid('setColProp', val + i, {
                                            viewable: true
                                        });

                                    });
                                }

                                for(i=num+1; i<=3; i++) {
                                    _.each(VIEWABLES, function(val) {
                                        $(roleGird).jqGrid('setColProp', val + i, {
                                            viewable: false
                                        });

                                    });
                                } 

                            }
                        }
                    },
                    gid: 'task-map-grid',
                    url: url._('task.map'),
                    colNames: {
                        id : paramLang._('task.map.id'), // id
                        brhCode: paramLang._('task.map.brh.code'), //机构编号
                        brhName  : paramLang._('task.map.brh.name'), //所属机构
                        taskType : paramLang._('task.map.task.type'), //任务类型(0-新增任务, 1-修改任务,2-申请类任务)
                        subType : paramLang._('task.map.sub.type'), //子类型
                        taskFlag : paramLang._('task.map.task.flag'),  //任务标示(0-不用工作流, 1-需一次操作,2-需两次操作,3-需三次操作)
                        // authCode : paramLang._('task.map.auth.code'), //权限编号
                        authName : paramLang._('task.map.auth.name'), //权限名称
                        // mapVersion : paramLang._('task.map.map.version'), //配置版本号
                        mapType  : paramLang._('task.map.mapType'), //配置类型
                        mapBrh   : paramLang._('task.map.mapBrh'), //配置对应机构

                        brhLevel1 : paramLang._('task.map.brh.level1'),   //一次操作机构级别
                        roleCode1 : paramLang._('task.map.role.code1'),   //一次操作角色编号
                        roleName1 : paramLang._('task.map.role.name1'),   //一次操作角色

                        brhLevel2 : paramLang._('task.map.brh.level2'),   //二次操作机构级别
                        roleCode2 : paramLang._('task.map.role.code2'),   //二次操作角色编号
                        roleName2 : paramLang._('task.map.role.name2'),   //二次操作角色

                        brhLevel3 : paramLang._('task.map.brh.level3'),   //三次操作机构级别
                        roleCode3 : paramLang._('task.map.role.code3'),   //三次操作角色编号 
                        roleName3 : paramLang._('task.map.role.name3')    //三次操作角色
                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['brhCode','brhName','taskType','mapType','mapBrh'],
                            xs: ['brhCode','brhName','taskType','mapType','mapBrh'],
                            sm: ['mapType','mapBrh'],
                            md: [],
                            ld: []
                        }
                    },

                    colModel: [
                        {name: 'id',   index: 'id', editable: false, hidden: true},  // id
                        {name: 'brhCode', index: 'brhCode'},//机构编号
                        {name: 'brhName', index: 'brhName', editable: false},//所属机构
                        {name: 'taskType',   index: 'taskType', editable: false, formatter: taskTypeFormatter,
                            edittype:'select',
                            editoptions: {
                                value: TASKTYPE_MAP
                            }
                        },  //任务类型(0-新增任务, 1-修改任务,2-申请类任务)
                        {name: 'subType',   index: 'subType', editable: true, formatter: subTypeFormatter,
                            edittype: 'select',
                            editoptions: {
                                value: SUBTYPE_MAP
                            }

                        },  //子类型
                        {name: 'taskFlag',   index: 'taskFlag', editable: true, formatter: taskFlagFormatter,
                            edittype:'select',
                            editoptions: {
                                value: TASKFLAG_MAP
                            }
                        },  //任务标示(0-不用工作流, 1-需一次操作,2-需两次操作,3-需三次操作)
                        // {name: 'authCode',   index: 'authCode', editable: false, hidden: true},  //权限编号
                        {name: 'authName',   index: 'authName', editable: false, hidden: true},  //权限名称
                        // {name: 'mapVersion',  index: 'mapVersion', editable: false, hidden: true},  //配置版本号
                        {name: 'mapType',     index: 'mapType', editable: true, formatter: mapTypeFormatter, edittype: 'select', 
                            editoptions: {
                                value: MAPTYPE_MAP
                            }
                        },
                        {name: 'mapBrh',      index: 'mapBrh', editable: true},
                        {name: 'brhLevel1',   index: 'brhLevel1', editable: true, hidden: true, edittype: 'select', 
                            editoptions: {
                                value: LEVEL_MAP
                            }
                        },  //一次操作机构级别
                        {name: 'roleCode1',   index: 'roleCode1', editable: true, hidden: true, viewable: false},  //一次操作角色编号
                        {name: 'roleName1',   index: 'roleName1', editable: false,hidden: true},  //一次操作角色

                        {name: 'brhLevel2',   index: 'brhLevel2', editable: true, hidden: true, edittype: 'select', 
                            editoptions: {
                                value: LEVEL_MAP
                            }
                        },  //二次操作机构级别
                        {name: 'roleCode2',   index: 'roleCode2', editable: true, hidden: true, viewable: false},  //二次操作角色编号
                        {name: 'roleName2',   index: 'roleName2', editable: false,hidden: true},  //二次操作角色

                        {name: 'brhLevel3',   index: 'brhLevel3', editable: true, hidden: true, edittype: 'select', 
                            editoptions: {
                                value: LEVEL_MAP
                            }
                        },  //三次操作机构级别
                        {name: 'roleCode3',   index: 'roleCode3', editable: true, hidden: true, viewable: false},  //三次操作角色编号
                        {name: 'roleName3',   index: 'roleName3', editable: false,hidden: true}   //三次操作角色

                    ],

                    loadComplete: function() {}
                });

            }

        });

    });


    function subTypeFormatter (val, options, rowData) {
        if (val == '101') {
            return SUBTYPE_MAP[val] + '(' + rowData.authName + ')';

        } else {
            return SUBTYPE_MAP[val] || '';

        }
    }

    function taskFlagFormatter (val) {
        return TASKFLAG_MAP[val] || '';
    }

    function taskTypeFormatter (val) {
        return TASKTYPE_MAP[val] || '';
    }

    function mapTypeFormatter (val) {
        return MAPTYPE_MAP[val] || '';
    }

    function attachValidation() {
        return {
            setupValidation: Opf.Validate.setup,
            addValidateRules: function(form) {
                Opf.Validate.addRules(form, {
                    rules:{
                        roleCode1: 'required',
                        roleCode2: 'required',
                        roleCode3: 'required'
                    }
                });
            }
        };
    }

    function taskFlagChange() {
        var taskFlag = $('#taskFlag').val();

        switch(taskFlag) {
            case '0':
            hideMessage('#tr_brhLevel1', '#tr_roleCode1', '#tr_brhLevel2', '#tr_roleCode2', '#tr_brhLevel3', '#tr_roleCode3');
            break;

            case '1':
            showMessage('#tr_brhLevel1', '#tr_roleCode1');
            hideMessage('#tr_brhLevel2', '#tr_roleCode2', '#tr_brhLevel3', '#tr_roleCode3');
            break;

            case '2':
            showMessage('#tr_brhLevel1', '#tr_roleCode1', '#tr_brhLevel2', '#tr_roleCode2');
            hideMessage('#tr_brhLevel3', '#tr_roleCode3');
            break;

            case '3':
            showMessage('#tr_brhLevel1', '#tr_roleCode1', '#tr_brhLevel2', '#tr_roleCode2', '#tr_brhLevel3', '#tr_roleCode3');
            break;
        }
    }

    function setBrhLevel(form, roleGird) {
        var $form = $(form);
        var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));
        rowData.brhLevel1 && $form.find('#brhLevel1').val(rowData.brhLevel1);
        rowData.brhLevel2 && $form.find('#brhLevel2').val(rowData.brhLevel2);
        rowData.brhLevel3 && $form.find('#brhLevel3').val(rowData.brhLevel3);
    }


    function addSelect2($select, $level, roleName) {
        var roleCode = $($select).val();

        $($select).val('');
        $($select).select2({
            placeholder: '请选择角色名',
            minimumInputLength: 1,
            width: '70%',
            ajax: {
                type: "get",
                url: 'api/system/options/role',
                dataType: 'json',
                data: function (term, page) {
                    return {
                        key: encodeURIComponent(term),
                        level: $level.val()
                    };
                },
                results: function (data, page) {
                    return {
                        results: data
                    };
                }
            },
            initSelection: function(element, callback){
                var number = $(element).val();
                if (number !== "") {
                    $.ajax({
                        url: 'api/system/options/role',
                        dataType: "json"
                    }).done(function(data) { 
                        callback(data);
                    });
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data, container, query, escapeMarkup){
                data.name = data.name.replace(new RegExp("(" + query.term + ")", "g"), "<span class='select-term'>$1</span>");
                return "<div class='select-result'>" + data.name + "</div>";
            },
            formatSelection: function(data, container, escapeMarkup){
                return data.name;
            },
            formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
            formatInputTooShort: function (input, min) {
                var n = min - input.length;
                return "请输入至少 " + n + "个字符";
            },
            formatSearching: function () { 
                return "搜索中..."; 
            },
            adaptContainerCssClass: function(classname){
                return classname;
            },
            escapeMarkup: function (m) {
                return m;
            }
        });

        if(roleName && roleCode) {
            $($select).select2("data", {value: roleCode, name: roleName});
        }

    }

    function bindSubTypeEvent(form) {
        var $form = $(form);
        var $subType = $form.find('select[name="subType"]');
        var $mapType = $form.find('select[name="mapType"]');

        var $brhLevel1 = $form.find('#brhLevel1');
        var $brhLevel2 = $form.find('#brhLevel2');
        var $brhLevel3 = $form.find('#brhLevel3');

        // 对于配置类型 0-默认 1-自定义 2-操作员审核
        // 当子类型为新增用户时，去掉默认和自定义
        // 当子类型为新增商户，新增机构时，去掉操作员审核
        if($subType.val() == '103'){
            $mapType.find('option').not('[value="2"]').remove();
        }else{
            $mapType.find('option[value="2"]').remove();
        }

        // 当子类型为新增用户或者开通宝实名认证时，
        // 每一个操作机构级别下拉框的最小级别为-1
        // 如果当一次操作选择-1时，二次操作可以选择所有的级别
        if($subType.val() == '103' || $subType.val() == '206'){
            setLevelRange($brhLevel1, 6, -1);

            if($brhLevel1.val() == -1){
                setLevelRange($brhLevel2, 6, -1);
            }else{
                setLevelRange($brhLevel2, $brhLevel1.val(), -1);
            }

            setLevelRange($brhLevel3, $brhLevel2.val(), -1);
        }else{
            setLevelRange($brhLevel1, 6);
            setLevelRange($brhLevel2, $brhLevel1.val());
            setLevelRange($brhLevel3, $brhLevel2.val());
        }
    }

    function showMessage() {
        for(var i=0; i<arguments.length; i++) {
            $(arguments[i]).show();
        }
    }

    function hideMessage() {
        for(var i=0; i<arguments.length; i++) {
            $(arguments[i]).hide();
        }
    }


    function bindLevelSelectChange (form, options) {
        var $form = $(form);
        var $subType = $form.find('select[name="subType"]');
        var minLevelVal = ($subType.val() == '103' || $subType.val() == '206') ? -1 : void 0;
        var $level = $form.find('#brhLevel' + options.level);
        var $select2 = $form.find('#roleCode' + options.level);
        var $changeToLevel = $form.find('#brhLevel' + options.changeToLevel);

        $level.on('change', function () {
            var levelVal = $(this).val();
            if(($subType.val() == '103' || $subType.val() == '206') && options.level == 1 && levelVal == -1){
                //如果子类型是新增用户 && 选择了一次操作 && 一次操作选项为 -1
                //那么二次操作就可以选择所有的机构级别
                setLevelRange($changeToLevel, 6, minLevelVal);
            }else{
                //否则下次操作级别的选项不能超过本次操作级别
                setLevelRange($changeToLevel, levelVal, minLevelVal);
            }

            $select2.select2('data', null);
        });
    }

    function setLevelRange ($select, maxLevel, minLevel) {
        var newValue, oldValue = $select.val();
        minLevel = minLevel || 0;
        $select.empty().append('<option disabled>- 选择机构级别 -</option>');
        for(var i = minLevel; i <= maxLevel; i++){
            $select.append('<option value='+ i +'>'+ i +'</option>');
        }

        newValue =  oldValue > maxLevel ? 0 : oldValue;
        $select.val(newValue);
    }

    function compressText () {
        _.each(arguments, function(val){
            var toCompress = $(val).closest('tr').find('.CaptionTD');
            var value = toCompress.text().substring(0,toCompress.text().length-2);
            toCompress.html(value);

        });

    }

    function applyValueIntoSelect (form, rowData) {
        var $form = $(form);

        var $level1 = $form.find('#brhLevel1');
        var $level2 = $form.find('#brhLevel2');
        var $level3 = $form.find('#brhLevel3');

        $level1.val(rowData.brhLevel1);
        $level1.trigger('change');
        _.defer(function(){
            $level2.val(rowData.brhLevel2);
            $level2.trigger('change');

            _.defer(function(){
                $level3.val(rowData.brhLevel3);
            });
        });

    }




    return App.ParamSysApp.TaskMap.List.View;

});