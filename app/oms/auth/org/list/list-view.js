define(['App',
    'tpl!app/oms/auth/org/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/auth',
    'assets/scripts/fwk/factory/typeahead.factory',
    'common-ui',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.origin'

], function(App, tableCtTpl, authLang, typeaheadFactory,commonUi) {

    //机构等级翻译
    var ORG_LEVEL_MAP = {};

    var TYPE_MAP = {
        '1': authLang._('org.type.1'),
        '2': authLang._('org.type.2'),
        '0': authLang._('org.type.0')
    };
    var STATU_MAP = {
        '0': authLang._('org.status.normal'),
        '2': authLang._('org.status.submit.perform'),
        '3': authLang._('org.status.stop'),
        '4': authLang._('org.status.cancel'),
        '5': authLang._('org.status.revise.edit'),
        '6': authLang._('org.status.save')
    };

    var STATUS = {
        'STATUS_NORMAL': '0', // 正常
        'STATUS_STOP': '3' // 停用
    };
    var ISSTLM_MAP = {
        '0': authLang._('org.isStlm.0'),
        '1': authLang._('org.isStlm.1')
    };

    var CARDTYPE_MAP = {
        '1': authLang._('org.cardType.idcard')
    };
    
    var infoMap = {};
    var MAX_TYPEAHEAD_LENGTH = 20;

    var typeaheadTplFn = _.template([
        '<div style="padding: 0 15px; height: 30px; line-height: 30px">',
            '<%= content %>',
        '</div>'
    ].join(''));

    function getSingleBatchTpl () {
        return [
            '<form class="form-settle-txn">',
            '<div class="col-xs-12">',
            '<textarea name="message" style="width:250px;height:80px;margin:5px; "></textarea>',
            '<div style="color: #ff0000; padding: 5px;">',
            '提醒，机构停用会同时停用该机构所有下属机构；',
            '机构启用只会启用当前机构；请确认无误！',
            '</div>',
            '</div>',
            '</form>'
        ].join('');
    }

    App.module('AuthSysApp.Org.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.Orgs = Marionette.ItemView.extend({
            tabId: 'menu.auth.org',
            template: tableCtTpl,

            events: {

            },

            onRender: function() {
                var me = this;

                ORG_LEVEL_MAP = createOrgLevelMap();

                setTimeout(function() {

                    me.renderGrid();

                }, 1);
            },

            showEditView: function (id, rowData) {
                var me = this;
                require(['app/oms/auth/org/edit/edit-view'], function (InfoView) {
                    $.ajax({
                        url: url._('branch.edit', {id: id}),
                        type: 'GET',
                        success: function (resp) {
                            var infoView = new InfoView(resp, {id: id, rowData: rowData });
                            infoView.render();

                            bindBackBtnEvent(infoView, me.$el);

                            App.getCurTabPaneEl().append(infoView.$el);
                        }
                    });
                });
            },

            closeOrOpenBrh: function(rowData,value) {
                var me = this;
                var params = {
                    id: rowData.id,
                    status: value
                };
                    me.showDialog({
                        title: '备注信息',
                        tpl: getSingleBatchTpl(),
                        rules: {
                            message: {
                                required: true,
                                maxlength: 100
                            }
                        },
                        onClickCallBack: function (dialogForm) {
                            var $dialogForm = $(dialogForm);
                            var valid = $dialogForm.validate().form();
                            if(valid){
                                $.extend(params, {descr: $dialogForm.find('[name="message"]').val()});
                                me.submitCloseOrOpen(params);
                                $dialogForm.trigger('dialogclose');
                            }
                        }

                    });
            },

            submitCloseOrOpen: function(params){
                var me = this;
                // 0-正常 3-停用
                var id = params.id;
                Opf.ajax({
                    type: 'GET',
                    url: url._('brh.cloase.or.open.brh'),
                    data: params,
                    success: function (resp) {
                        Opf.Toast.success('操作成功！');
                        //刷新页面 me.grid 有声明
                        $(me.grid).trigger("reloadGrid", [{current: true}]);
                    }

                });
            },

            showDialog: function (options) {
                var rules = options.rules;
                var $dialogForm = $(options.tpl);

                Opf.Validate.addRules($dialogForm, {rules: rules});

                if(options.beforeShowDialog && _.isFunction(options.beforeShowDialog)){
                    options.beforeShowDialog($dialogForm);
                }

                var $dialog = Opf.Factory.createDialog($dialogForm, {
                    destroyOnClose: true,
                    title: options.title,
                    width: options.width || 350,
                    height: options.height || 260,
                    autoOpen: true,
                    modal: true,
                    buttons: [{
                        type: 'submit',
                        text: '确定',
                        click: function () {
                            options.onClickCallBack($dialog);
                        }
                    },{
                        type: 'cancel'
                    }]
                });
            },

            renderGrid: function() {
                var me = this;       

                var orgGird = me.grid = App.Factory.createJqGrid({
                    rsId: 'org',
                    caption: authLang._('org.txt'),
                    filters: [
                        {
                            caption: '条件过滤',
                            defaultRenderGrid: false,
                            canSearchAll: true,
                            canClearSearch: true,
                            components: [
                                {
                                    label: '机构名称',
                                    name: 'name'
                                },{
                                    label: '机构编号',
                                    name: 'code'
                                }
                            ],
                            searchBtn: {
                                text: '搜索'
                            }
                        }
                    ],
                    actionsCol: {
                        width: 105,
                        canButtonRender: function (name, options, rowData) {
                            // 0－正常,  1－机构新增保存,  2－提交待审核,  3－机构停用,  4－商户注销
                            var status = rowData.status;
                            //如果是自己机构那么就只能查看
                            if(Ctx.getUser().get('brhCode') === rowData.code){
                                if(name === 'edit') return false;
                                if(name === 'del') return false;
                                if(name === 'stopBranch') return false;
                                if(name === 'openBranch') return false;
                            }

                            if(name == 'edit' && status != 0){
                                return false;
                            }

                            //status 等于 状态 0,就显示按钮
                            if(name === 'stopBranch' && (status == '1' || status == '2' ||status == '3' ||status == '4' || status == '5' ||status == '6' || status == '7' )){
                                return false;
                            }

                            //status 等于状态 3,就显示按钮
                            if(name === 'openBranch' && (status == '0' || status == '1' ||status == '2' ||status == '4' || status == '5' ||status == '6' || status == '7')){
                                return false;
                            }

                        },
                        extraButtons: [
                            {name: 'stopBranch', title:'停用', caption: '', icon: 'icon-remove red', click: function(name,obj,rowData){
                                me.closeOrOpenBrh(rowData, STATUS.STATUS_STOP);
                            }},
                            {name: 'openBranch', title:'启用', caption: '', icon: 'icon-ok blue', click: function(name,obj,rowData){
                                me.closeOrOpenBrh(rowData, STATUS.STATUS_NORMAL);
                            }}
                        ]

                    },
                    nav: {
                        formSize: {
                            width: Opf.Config._('ui', 'org.grid.form.width'),
                            height: Opf.Config._('ui', 'org.grid.form.height')
                        },

                        actions:{
                            // 如果机构级别大于等于6，则不能新增机构
                            add: Ctx.getUser().get('brhLevel') >= 6 ? false : true,
                            addfunc: function () {
                                App.trigger('branch:add');
                            },
                            editfunc: function (id) {
                                var rowData = orgGird._getRecordByRowId(id);
                                me.showEditView(id, rowData);
                                me.$el.hide();
                            },

                            viewfunc: function (id) {
                                var rowData = orgGird._getRecordByRowId(id);
                                me.trigger('org:view', id, rowData);
                            }
                        }
                    },
                    gid: 'orgs-grid',//innerly get corresponding ct '#orgs-grid-table' '#orgs-grid-pager'
                    url: url._('org'),
                    colNames: [
                        '',
                        authLang._('org.name'),
                        authLang._('org.code'),
                        authLang._('org.address.txt'),
                        authLang._('org.cardType.txt'),
                        authLang._('org.cardNo.txt'),
                        authLang._('org.endDate.txt'),
                        authLang._('org.contact.txt'),
                        authLang._('org.mobile.txt'),
                        authLang._('org.tel.txt'),
                        authLang._('org.up.txt'),
                        //authLang._('org.type.txt'),
                        authLang._('org.status.txt'),
                        authLang._('org.isStlm.txt'),
                        authLang._('org.level.txt')
                    ],

                    responsiveOptions: {
                        hidden: {
                            ss: ['level','address','tel','cardType','cardNo','endDate','mobile', 'contact','upBranchName', 'type','isStlm'],
                            xs: ['address','tel', 'cardType','cardNo','endDate','mobile', 'contact','upBranchName', 'type','isStlm'],
                            sm: ['address','tel','cardType','cardNo','contact','upBranchName','type','isStlm'],
                            md: ['address','tel','contact','upBranchName','type','isStlm'],
                            ld: ['tel']
                        }
                    },

                    colModel: [
                        {name:           'id', index:           'id', editable:    false,      hidden:   true  },
                        {name:         'name', index:         'name', search:true,editable: true,
                            _searchType:'string'
                         },
                        {name:         'code', index:         'code', search:true,editable: false, editoptions: {disabled: true} ,
                            _searchType:'string'
                          },
                        {name:      'address', index:      'address', search:false,editable: true,width :200, hidden: true },
                        {name:    'cardType', index: 'cardType', search:false,editable: false, hidden: true,
                            formatter:cardTypeFormatter
                        },
                        {name:          'cardNo', index:          'cardNo', search:false,editable: true,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },
                        {name:          'endDate', index:          'endDate', search:false,editable: true, hidden: true  },
                        {name:      'contact', index:      'contact', search:true,editable: true,width :70,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },
                        {name:       'mobile', index:       'mobile', search:true,editable: true, hidden:true,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },
                        {name:          'tel', index:          'tel', search:false,editable: true  },
                        {name: 'upBranchName', index: 'upBranchName', search:false,editable: false  },
                        //{name: 'type', index: 'type', search:false,editable: true, width :50,formatter: typeFormatter,
                        //    stype:'select',
                        //    searchoptions:{
                        //        sopt:['eq'],
                        //        value: TYPE_MAP
                        //    },
                        //    edittype:'select',
                        //    editoptions: {
                        //        value: TYPE_MAP
                        //    }
                        //},
                        {name: 'status', index: 'status', search:true,editable: false, width :100,formatter: statusFormatter,

                            stype:'select',
                            searchoptions:{
                                sopt:['eq'],
                                value: STATU_MAP
                            },
                            edittype:'select',
                            editoptions: { value: STATU_MAP }
                        },
                        {name: 'isStlm', index: 'isStlm', width:100, search:false,editable: true, formatter: isStlmFormatter,
                            edittype:'select',
                            editoptions: {
                                dataEvents:[{type:'change',fn:function(e){
                                    var $accountBody = $(e.target).closest('tbody').next();
                                    var $discId = $accountBody.find('#discId');
                                    var isStlmValue = $(e.target).val();
                                    if(isStlmValue == 1){
                                        var div = $(e.target).closest('#editcntorgs-grid-table');
                                        $accountBody.toggle(true);
                                        $accountBody.data('setup',true);
                                        div.scrollTop($(e.target).position().top);
                                    }
                                    else{
                                        $accountBody.toggle(false);
                                        $accountBody.data('setup',false);
                                    }

                                }}],
                                value: ISSTLM_MAP
                            }
                        },
                        {name: 'level', index: 'level', width :100, search: true, formatter: levelFormatter,
                            stype:'select',
                            searchoptions: {
                                sopt: ['eq'],
                                value: ORG_LEVEL_MAP
                            }
                        }

                    ],
                    // pager: pagerSelector,// '#orgs-grid-pager'
                    onSelectAll: function (aRowids, status) {
                        console.info('my select all ');
                    },
                    onSelectRow: function (rowid, status, e) {
                        console.info('my select row');
                    },

                    onInitGrid: function () {
                        console.info('my oninit');
                    },
                    loadComplete: function() {
                        //$('a[name="stopBranch"]').attr("hidden",true);
                        //$('a[name="openBranch"]').attr("hidden",true);
                    }
                });
                
                // _.defer(function () {
                //     buildBrhTypeMenu4Add(orgGird);
                // });
            }

        });

    });
    

    function statusFormatter (cellvalue, options, rowObject) {
        return STATU_MAP[cellvalue];
    }

    function typeFormatter (cellvalue, options, rowObject) {
        return TYPE_MAP[cellvalue];
    }

    function isStlmFormatter (cellvalue, options, rowObject){
        return ISSTLM_MAP[cellvalue];
    }

    function cardTypeFormatter (cellvalue, options, rowObject){
        return CARDTYPE_MAP[cellvalue];
    }

    function levelFormatter (cellvalue, options, rowObject) {
        return ORG_LEVEL_MAP[cellvalue];
    }

    function createOrgLevelMap () {
        var maxOrgLevel = Ctx.get('SUPPORT_BRH_LEVEL_LIMIT') || 6;
        var orgLevel = Ctx.getBrhLevel();
        var orgLevelMap = {
            '0': '集团总部',
            '1': '合作机构'
        };
        for(var i = 2; i <= maxOrgLevel; i++){
            orgLevelMap[i + ''] = (i-1) + ' 级代理';
        }
        //去掉当前机构以上的机构级别
        for(var p in orgLevelMap){
            if(orgLevelMap.hasOwnProperty(p) && parseInt(p, 10) < orgLevel){
                delete orgLevelMap[p];
            }
        }
        return orgLevelMap;
    }

    function bindBackBtnEvent(view, gridEl) {
        var $gridEl = $(gridEl);

        view.on('back', function(){
            setTimeout(function(){
                $(window).trigger('resize');
                $gridEl.show();
            },1);
        });
    }

    return App.AuthSysApp.Org.List.View;

});