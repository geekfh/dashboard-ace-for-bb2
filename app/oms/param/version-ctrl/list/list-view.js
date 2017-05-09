
define(['App',
    'tpl!app/oms/param/version-ctrl/list/templates/table-ct.tpl',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'select2'
], function(App, tableCtTpl) {

    var CLIENT_OS_MAP  = {
        '1': 'ios',
        '2': 'android'
    },

    CLIENT_NAME_MAP = {
        '1': '钱盒商户通',
        '2': '开通宝',
        '5': '钱盒-企业',
        '6': '钱盒-APPSTORE',
        '7': '钱盒-HD'
    },

    IS_LASTEST_MAP = {
        '0': '不是',
        '1': '是'
    },

    IS_SUPPORTED_MAP = {
        '0': '不支持',
        '1': '支持'
    },

    DEPLOYTYPE_MAP = {
        '1': '商户',
        '2': '机构'
    };


    var View = Marionette.ItemView.extend({
        tabId: 'menu.param.version.ctrl',
        template: tableCtTpl,

        events: {},

        onRender: function() {
            var me = this;

            _.defer(function(){
                me.renderGrid();
            });
        },

        renderGrid: function() {
            var validation = this.attachValidation();
            var roleGird = App.Factory.createJqGrid({
                rsId: 'versionCtrl',
                caption: '版本控制',
                filters: [
                    {
                        caption: '快速查询',
                        canClearSearch: true,
                        components: [
                            {
                                type: 'select',
                                label: '客户端系统',
                                name: 'clientOs',
                                options: {
                                    value: CLIENT_OS_MAP
                                }
                            },
                            {
                                type: 'select',
                                label: '客户端名称',
                                name: 'clientName',
                                options: {
                                    value: CLIENT_NAME_MAP,
                                    dataInit: function (elem){
                                        var me = elem;
                                        $('.clientOs-form-group').find('a').on('click', function () {
                                            if($(this).text() == 'ios'){
                                                $(me).find('[value="1"]').parent().hide();
                                                $(me).find('[value="2"]').parent().show();
                                                $(me).find('[value="5"]').parent().show();
                                                $(me).find('[value="6"]').parent().show();
                                                $(me).find('[value="7"]').parent().show();
                                                //me.get(0).value = {
                                                //    '2': '开通宝',
                                                //    '5': '钱盒-企业',
                                                //    '6': '钱盒-APPSTORE',
                                                //    '7': '钱盒-HD'
                                                //};
                                            }
                                            else{
                                                $(me).find('[value="1"]').parent().show();
                                                $(me).find('[value="2"]').parent().show();
                                                $(me).find('[value="5"]').parent().hide();
                                                $(me).find('[value="6"]').parent().hide();
                                                $(me).find('[value="7"]').parent().hide();
                                                //me.get(0).value = {
                                                //    '1': '钱盒商户通',
                                                //    '2': '开通宝'
                                                //};
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                label: '客户端版本',
                                name:  'clientVersion'
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ],
                actionsCol: {
                },
                nav: {
                    actions: {},
                    formSize: {
                        width: 500,
                        height: 500
                    },
                    add: {
                        beforeShowForm: function(form) {
                            validation.addValidateRules(form);
                        },
                        //onclickSubmit: function(params, postdata) {
                        //    var arr = [];
                        //    postdata['codes'] = null;
                        //    $.each(postdata['codes'].split(','), function(i, v){
                        //        arr.push(v);
                        //    });
                        //    postdata['codes'] = arr;
                        //},
                        beforeSubmit: validation.setupValidation
                    },
                    edit: {
                        beforeShowForm: function(form) {
                            validation.addValidateRules(form);
                        },
                        //onclickSubmit: function(params, postdata) {
                        //    var arr = [];
                        //    $.each(postdata['ext3'].split(','), function(i, v){
                        //        arr.push(v);
                        //    });
                        //    postdata['ext3'] = arr;
                        //},
                        beforeSubmit: validation.setupValidation
                    }
                },
                gid: 'version-ctrl-grid',
                url: url._('version.ctrl'),
                colNames: {
                    id              : 'id',
                    clientOs        : '客户端系统', // 1：'iphone'  2:'android'
                    clientName      : '客户端名称', // 1:钱盒商户通  2:开通宝  5:钱盒-企业  6:钱盒-APPSTORE  7:钱盒-HD
                    clientVersion   : '客户端版本',
                    versionCode     : '版本号',
                    updateContent   : '版本更新内容',
                    isSupported     : '是否支持',  // 0:不支持 1:支持
                    isLastest       : '是否是最新版本',   // 0:不是  1:是
                    fileUrl         : '文件版本下载地址',
                    fileSize        : '文件大小（字节）',
                    md5             : '版本文件MD5值',
                    deployTime      : '发布时间',
                    deployType      : '版本支持类型',
                    //codes           : '版本支持编号',
                    ext3            : '版本支持编号'
                },
                colModel: [
                    {name: 'id',               editable: false, hidden: true}, 
                    {name: 'clientOs',         editable: true, formatter: clientOsFormatter,
                        edittype: 'select',
                        editoptions: {
                            value: CLIENT_OS_MAP
                        }
                    },
                    {name: 'clientName',       editable: true, formatter: clientNameFormatter,
                        edittype: 'select',
                        editoptions: {
                            value: CLIENT_NAME_MAP
                        }
                    },
                    {name: 'clientVersion',    editable: true}, 
                    {name: 'versionCode',      editable: true, search: true},
                    {name: 'updateContent',    editable: true, edittype:"textarea", editoptions:{ style: "width:260px; height:100px" }, search: true},
                    {name: 'isSupported',      editable: true, formatter: isSupportedFormatter,
                        edittype: 'select',
                        editoptions: {
                            value: IS_SUPPORTED_MAP
                        },
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            value: IS_SUPPORTED_MAP
                        }
                    },
                    {name: 'isLastest',        editable: true, formatter: isLastestFormatter,
                        edittype: 'select',
                        editoptions: {
                            value: IS_LASTEST_MAP
                        },
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            value: IS_LASTEST_MAP
                        }
                    },
                    {name: 'fileUrl',          editable: true}, 
                    {name: 'fileSize',         editable: true}, 
                    {name: 'md5',              editable: true, edittype: 'textarea', editoptions:{ style: "width:260px; height:60px;" }},
                    {name: 'deployTime',       editable: true, search: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }
                    },
                    {name: 'deployType', hidden: true, editable: true, edittype: 'select', editoptions: { value: DEPLOYTYPE_MAP }},
                    //{name: 'codes'},
                    {name: 'ext3', editable: true, hidden: true,
                        editoptions: {
                            dataInit: function (elem){
                                var me = elem;
                                var rowCode = $(this).find('[aria-selected="true"]').find('[aria-describedby="version-ctrl-grid-table_ext3"]').text();
                                codesSelect2(me, 1, rowCode);
                                $(me).parents().find('#tr_deployType').find('select').on('change', function () {
                                    codesSelect2(me, $(this).val(), rowCode);
                                });
                            }
                        }
                    //formatter: selectFormatter
                    }
                ],
                loadComplete: function() {}
            });
        },
        attachValidation: function() {
            return {
                setupValidation: Opf.Validate.setup,
                addValidateRules: function(form) {
                    Opf.Validate.addRules(form, {
                        rules:{
                            clientOs: {required: true},
                            clientName: {required: true},
                            clientVersion: {required: true},
                            updateContent: {required: true},
                            fileUrl: {required: true},
                            fileSize: {required: true},
                            isLastest: {required: true},
                            isSupported: {required: true},
                            md5: {required: true},
                            deployTime: {required: true},
                            versionCode: {required: true},
                            deployType: {required: true},
                            ext3: {required: true}
                        }
                    });
                }
            };
        }
    });

    function codesSelect2(elem, type, rowCode){
        if(type == 2){//机构
            var sl = $(elem).select2({
                placeholder: '--请选择机构--',
                multiple: true,
                minimumInputLength: 1,
                width: 200,
                // 如果不设ID，将不能选择列表
                id: function (e) {
                    return e.id;
                },
                ajax: {
                    type: 'GET',
                    url: url._('report.tree.searchOrg'),
                    dataType: 'json',
                    data: function (term, page) {
                        return {
                            kw: encodeURIComponent(term),
                            number: page - 1
                        };
                    },
                    results: function (data, page) { // 返回除分页信息外的内容，要正确过滤备选项就在这里操作
                        var more = page < data.totalPages,
                        //过滤非直接下属机构
                            content = _.filter(data.content, function (item) {
                                return item.orgLevel >= Ctx.getUser().get('brhLevel');
                            });
                        return {
                            results: content
                        };
                    }
                },
                initSelection : function(element, callback) {
                    var data = [];
                    if(rowCode != ''){
                        if(rowCode.indexOf(',') == -1){
                            $.ajax({
                                type: 'GET',
                                url: url._('report.tree.searchOrg'),
                                dataType: 'json',
                                async: false,
                                data: {kw: rowCode},
                                success: function(resp){
                                    data.push({value: resp[0].value, name: resp[0].name});
                                }
                            });
                        }
                        else{
                            $.each(rowCode.split(','), function(i, v){
                                $.ajax({
                                    type: 'GET',
                                    url: url._('report.tree.searchOrg'),
                                    dataType: 'json',
                                    async: false,
                                    data: {kw: v},
                                    success: function(resp){
                                        data.push({value: resp[0].value, name: resp[0].value.name});
                                    }
                                });
                            });
                        }
                    }
                    callback(data);
                },
                //格式化备选项，显示给用户。对每一个数组元素都执行此方法，data即为数组元素
                formatResult: function (data, container, query, escapeMarkup) {
                    return data.name;
                },
                formatSelection: function(data){
                    return data.name;
                }
            });

            return sl;
        }
        else if(type == 1){//商户
            var sl = $(elem).select2({
                placeholder: '--请选择商户--',
                multiple: true,
                minimumInputLength: 1,
                width: 200,
                id: function (e) {
                    return e.value;
                },
                ajax: {
                    type: 'GET',
                    url: url._('mcht.name'),
                    dataType: 'json',
                    data: function (term) {
                        return {
                            kw: encodeURIComponent(term)
                        };
                    },
                    results: function (data) {
                        return {
                            results: data
                        };
                    }
                },
                initSelection : function(element, callback) {
                    var data = [];
                    if(rowCode != ''){
                        if(rowCode.indexOf(',') == -1){
                            $.ajax({
                                type: 'GET',
                                url: url._('mcht.name'),
                                dataType: 'json',
                                async: false,
                                data: {kw: rowCode},
                                success: function(resp){
                                    data.push({value: resp[0].value, name: resp[0].name});
                                }
                            });
                        }
                        else{
                            $.each(rowCode.split(','), function(i, v){
                                $.ajax({
                                    type: 'GET',
                                    url: url._('mcht.name'),
                                    dataType: 'json',
                                    async: false,
                                    data: {kw: v},
                                    success: function(resp){
                                        data.push({value: resp[0].value, name: resp[0].name});
                                    }
                                });
                            });
                        }
                    }
                    callback(data);
                },
                formatResult: function(data){
                    return data.value + '_' + data.name;
                },
                formatSelection: function(data){
                    return data.value + '_' + data.name;
                }});

            return sl;
        }
    }

    function selectFormatter(val){
        var str = '';
        $.each(val, function(i, v){
            str = val[i].code+'_'+val[i].name+','
        });
        str = str.substring(0, str.length - 1);

        return str;
    }

    function clientOsFormatter (val) {
        return CLIENT_OS_MAP[val] || '';
    }

    function clientNameFormatter (val) {
        return CLIENT_NAME_MAP[val] || '';
    }

    function isSupportedFormatter (val) {
        return IS_LASTEST_MAP[val] || '';
    }

    function isLastestFormatter (val) {
        return IS_SUPPORTED_MAP[val] || '';
    }

    return View;

});