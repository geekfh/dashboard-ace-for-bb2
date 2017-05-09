define(['jquery', 'underscore', 'assets/scripts/fwk/utils', 'assets/scripts/fwk/main/ReportPollingTask'],
    function($, _, xx, ReportPollingTask) {

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    var DEFAULT_AUTO_REFRESH_INTERVAL = 2000;
    var FORM_HEIGHT = 420;
    var FORM_WIDTH = 480;
    FORM_HEIGHT = Math.min(FORM_HEIGHT, windowHeight);
    FORM_WIDTH = Math.min(FORM_WIDTH, windowWidth);

    var SEARCH_OPR = {
        'default': ['lk', 'nlk','eq', 'ne', 'lt', 'le', 'gt', 'ge'],
        'date': ['eq', 'ne', 'lt', 'le', 'gt', 'ge'],
        'num': ['eq', 'ne', 'lt', 'le', 'gt', 'ge'],
        'string': ['lk','nlk','eq','ne']
    };

    var tpl_fmt_reg = new RegExp(_.templateSettings.interpolate.source);

    /*var factory = {

    };*/

    /**
     * [createJqGrid description]
     * @param  {[type]} options [description]
     * @return {[type]}     [description]
     */
    /*
    gridOptions = {
        //////////////////////////////////////
        // the default options for jqgrid //
        //////////////////////////////////////
        //entirely place thia part to default contructor arg

        ////////////////////////////////////////////
        // default but we cover with my default //
        ////////////////////////////////////////////
        height: 'auto',
        dataType: 'json',

        //////////////////////////
        // extend out options //
        //////////////////////////
        // if u use maxHeight but not use set height urself, then height will be same as maxheight
        className: '',//grid最外层容器的class里
        maxHeight: 500,
        //default true, make grid resize follow window,
        // since we prescribe to have grid container with class `jgrid-container`
        autoReisze: bool,
        actionsCol: {按钮列，默认提供edt/del/view三种按钮,如果要禁止这三种之一就要显示声明
            width: 100,//配置宽度
            edti: false,显示声明不需要编辑按钮
            //绘制某行的列按钮时，对每个按钮都会调用canButtonRender,如果返回false，那么这一行的这个按钮不绘制
            canButtonRender: function (name, rowData) {return false;}
            extraButtons: [
                {name: 'xx', caption: 'x', click: function (name, opts, rowData) {}},
                ...
            ]
        },


        // 配置select下拉搜索框
        // 下拉框权限配置为：rsId + '.' + 'quickSearch'
        // 配置示例：
        quickSearch: {
            placeholder: '-选择相应的快速搜索-',
            searchoptions: [{//id是唯一标示，text是下拉选项显示的内容，rules是需要搜索的条件。
                id: hele,
                text:'何乐',
                rules: [{field: 'loginName', op: 'eq', data: 'hele'}]
            }, {
                id: backEndGroup,
                text:'后台小组',
                rules: [{field: 'loginName', op: 'eq', data: '黄雄'},
                        {field: 'loginName', op: 'eq', data: '东东'}]
        }]},

        // 配置jqgrid 蓝色表头中间显示的文字
        tableCenterTitle: 'T+0控制表',

        nav: {
            //jqgrid默认支持六种按钮,工厂里面内置包含所有按钮，如果不需要，则自己配置
            //另外如果后台返回的权限不支持这种按钮，不管你怎么配置都不会出现
            actions: {add:false}, // on behalf of first arg for jqgrid.navGrid
            edit: {}, // on behalf of 2nd arg for jqgrid.navGrid
            add: {}, // on behalf of 3rd arg for jqgrid.navGrid
            del: {},
            search: {},
            view: {},
            //默认edit/add/view表单宽度会集成formSize的width和height
            //要单独设置可以在上面配置中设置width和height
            formSize: {
                width: xx,
                height: xx,
            }
        },
        //下载报表按钮
        //**** 对应的资源rsId默认为 表格的rsId+'.download' ****
        download: {
            url: url._('pfms.report.download'),
            //必须返回对象
            params: function () {
                return me.getDownloadPostData();
            },
            queueTask: {
                name: function () {
                    return '业绩报表';
                }
            }
        },
    };

    colModel里面的配置增强
    index 如果没有配置，默认使用name
    formoptions.label 原来是支持字符串，现在支持函数function (model, colName), 在创造表格前将配置变为字符串
    formatter: '<%firstName + " " + lastName%>'//支持模版，里面的数据对象就是行数据

*/

    var default_grid_options = {
        _pre: {
            onPaging: function () {

            }
        },
        _post: {
            onPaging: function () {

            }
        }
    };

    function adaptOptions (options) {
        options.className = (options.className || '') + ' ' + 'grid-from-factory';

        if(options.selectable === false) {
            options.multiselect = false;
        }

        //支持colName配置为map<name, label>
        var retColNames = [];
        var colNames = options.colNames;
        if($.isPlainObject(colNames)) {
            // var colNameKeys = _.keys(options.colNames);
            var colModel = options.colModel, name, col;

            for(var i = 0, len = colModel.length; i < len; i++) {
                col = colModel[i];

                name = col.name;

                if((name === 'id') && (typeof colNames.id === 'undefined')) {
                    retColNames.push('');
                    continue;
                }

                if(colNames[name] !== void 0) {
                    retColNames.push(colNames[name]);
                }else {
                    console.error('name为' + name + '的表头colNames映射没有配置');
                }

                //如果字段编辑类型是下拉框，但是没有配置editoptions.value则不会创建select
                if(col.edittype === 'select' && (!col.editoptions || !col.editoptions.value)) {
                    col.editoptions = (col.editoptions || {});
                    col.editoptions.value = {};
                }

            }
            options.colNames = retColNames;
        }


        var hiddenFieldNames = [];

        _.each(options.colModel, function (col, idx) {

            //如果没有配置index,那么默认使用name的
            col.index = col.index || col.name;

            //只有你自己配置true才可以搜索，默认都不能参加搜索
            if(col.search !== true) {
                col.search = false;

            }else {

                col.searchoptions = col.searchoptions || ( col.searchoptions = {});
                col.searchoptions.searchhidden = true;

                //如果没有配置了属性sopt，则实用自定义属性 _searchType, 如果两者都没有，则使用默认的
                if(!col.searchoptions.sopt) {
                    col.searchoptions.sopt = SEARCH_OPR[col._searchType] || SEARCH_OPR['default'];
                }
            }

            //支持表单label配置是函数
            if(col.formoptions) {
                if($.isFunction(col.formoptions.label)) {
                    col.formoptions.label = col.formoptions.label(col, options.colNames[idx]);
                }

                if(col.formoptions._tips) {
                    col.formoptions.label +=  _.template('<span class="help-button" data-trigger="hover" data-rel="popover" data-placement="<%=placement%>" data-content="<%=content%>" title="" data-original-title="">?</span>', col.formoptions._tips);
                }
            }

            if(col.name === 'id') {
                //强制覆盖ID列配置，设置editable:true,保证在编辑表单中提交，edithidden:false保证用户不会在表单上看到
                col = $.extend(true, col, {editable: true, editrules: {edithidden: false}});
            }else {
                col.editrules = $.extend(true, {edithidden: true}, col.editrules);
            }

            if(col.hidden === true) {
                hiddenFieldNames.push(col.name);
            }

            //支持列显示格式化模板
            if(col.formatter && tpl_fmt_reg.test(col.formatter)) {
                var _fmt = col.formatter;
                col.formatter = function (val, options, rowData) {
                    return _.template(_fmt, rowData);
                }
            }
        });

        // options.colModel.unshift({
        //  name: '_check',
        //  width: 20,
        //  sortable: false,
        //  formatter: function () {
        //      return '<input type="radio" name="_check"/>';
        //  }
        // });
        // options.colNames.unshift('');
        //把colModel里面配置的隐藏列加到，响应式隐藏配置列里
        if(options.responsiveOptions && hiddenFieldNames.length) {
            _.each(options.responsiveOptions.hidden, function (arr, mdName) {
                options.responsiveOptions.hidden[mdName] = _.union(arr, hiddenFieldNames);
            });
        }

        setupActionsCol(options);
    }

    function setupActionsCol (options) {
        var actionsCol = options.actionsCol;
        var rsId = options.rsId;
        var model;

        if(actionsCol !== false) {
            actionsCol = $.isPlainObject(actionsCol) ? actionsCol : {};

            options.colNames.push('操作');

            var defaultButtons = ['edit', 'del', 'view'];

            var buttons = _.filter(defaultButtons, function (name) {
                return actionsCol[name] !== false;
            });

            //不要深拷贝，如果要就要把buttons数组放出去
            model = $.extend({
                extraButtons: [],
                buttons : buttons,
                classes: 'action-col',
                editable:false,
                viewable:false,
                name: '_action_',
                search: false,
                formatter: actionColFormatter,
                width:78, fixed:true, sortable:false, resize:false/*,
                //jqgrid设置列宽度
                responsive: function (cm, lastMdName, newMdName) {
                    var $grid = $(this);
                    if(!$grid.data('widthOrg')) {
                        console.log('store width', $grid.jqGrid('getColProp',cm.name).width);
                        $grid.data('widthOrg', $grid.jqGrid('getColProp',cm.name).width);
                    }
                    if(Opf.Media.le(newMdName, 'xs')) {//<= xs
                        setTimeout(function () {
                            $($grid[0].grid.hDiv).find('th.action-col').width(30);
                        $($grid[0].grid.bDiv).find('td.action-col').width(30);
                    }, 1);
                        cm.widthOrg = 30;
                    }else {
                        setTimeout(function () {
                            $($grid[0].grid.hDiv).find('th.action-col').width($grid.data('widthOrg'));
                        $($grid[0].grid.bDiv).find('td.action-col').width($grid.data('widthOrg'));
                    }, 1);
                        cm.widthOrg = $grid.data('widthOrg');
                        // $grid.jqGrid('setColProp',cm.name, {width: $grid.data('pcWidth')});
                    }
                }*/
            }, actionsCol);

            filterPermission(model);
            extraButtonsMap(model);
            options.colModel.push(model);
            // 如果<= 'xs' 宽度设为30, 忽略外部配置
            // TODO暂时没法快速找到动态设置宽度的有效方法
            if(Opf.Media.le(Opf.Media.currentName(), Opf.Media.XS)) {
                model.width = 40;
            }
        }

        function filterPermission (model) {
            var afterPermissonCheckButtons = _.filter(model.buttons, function (btnName) {
                var btnRsId = rsId + /*'.btn.' +*/'.' + btnName;
                return Ctx.avail(btnRsId);
            });
            model.buttons = afterPermissonCheckButtons;

            var afterPermissonCheckExtraButtons = _.filter(model.extraButtons, function (item) {
                var btnRsId = rsId + /*'.btn.' +*/'.' + item.name;
                var avail = Ctx.avail(btnRsId);

                console.log('测试按钮权限 rsId:', btnRsId);

                return avail;
            });
            model.extraButtons = afterPermissonCheckExtraButtons;
        }

        function extraButtonsMap (model) {
            model.extraButtonsMap = {};
            _.each(model.extraButtons, function (item) {
                model.extraButtonsMap[item.name] = item;
            });
        }
    }

    //临时放在全局，便于把事件放在标签里面
    _actionColHandler = function(act) {
        var $tr = $(this).closest("tr.jqgrow"),
            rid = $tr.attr("id"),
            $id = $(this).closest("table.ui-jqgrid-btable").attr('id').replace(/_frozen([^_]*)$/,'$1'),
            $grid = $("#"+$id),
            t = $grid[0],
            p = t.p,
            cm = p.colModel[$.jgrid.getCellIndex(this)];
        var nav = p.nav || {};//原来下面一栏按钮的配置
        var navActions = nav.actions;
        function selectRow (rid) {
            if(rid && t.p.selrow && rid == t.p.selrow) {
                return;
            }
            $grid.jqGrid('setSelection', rid);
        }
        switch(act)
        {
            case 'del':
                selectRow(rid);
                if($.isFunction( navActions.delfunc ) ) {
                    navActions.delfunc.call(t, rid);
                }else {
                    $grid.jqGrid("delGridRow", rid, nav.del||{});
                }
                break;
            case 'edit':
                selectRow(rid);
                if($.isFunction( navActions.editfunc ) ) {
                    navActions.editfunc.call(t, rid);
                }else {
                    $grid.jqGrid("editGridRow", rid, nav.edit||{});
                }
                break;
            case 'view':
                selectRow(rid);
                if($.isFunction( navActions.viewfunc ) ) {
                    navActions.viewfunc.call(t, rid);
                }else {
                    $grid.jqGrid("viewGridRow", rid, nav.view||{});
                }
                break;
            case 'custom':
                selectRow(rid);
                var extraBtnConfig = cm.extraButtonsMap[$(this).attr('name')];
                if(extraBtnConfig && extraBtnConfig.click) {
                    extraBtnConfig.click.call(t, act, extraBtnConfig, $grid._getRecordByRowId(rid));//$grid._getSelRecord()
                }
                break;
        }
    };

    var btnTplFn = _.template([
        '<a title="<%=title%>" style="float:left;cursor:pointer;" class="action-btn ui-pg-div ui-inline-<%=type%>" ',
            'id="<%=id%>" onclick=_actionColHandler.call(this,"<%=type%>"); >',
            '<span style="margin:0 2px;" class="ui-icon <%=icon%>"></span><%=caption%>',
        '</a>'
    ].join(''));

    var extraBtnTplFn = _.template([
        '<a name="<%=name%>" title="<%=title%>" style="float:left;cursor:pointer;" class="action-btn ui-pg-div ui-inline-<%=type%>" id="<%=id%>" onclick=_actionColHandler.call(this,"custom");>',
            '<%if(typeof icon !== "undefined" && icon){%>',
                '<span style="margin:0 2px; overflow:visible;" class="ui-icon"><i class="<%=icon%>"></i></span>',
            '<%}%>',
            '<span class="caption"><%=caption%></span>',
        '</a>'
    ].join(''));

    var extraSearchTplFn = _.template([
        '<select style="position:relative; top: 2px; left: -5px; height: 24px;">',
            '<option value="" disabled selected style="display:none;"><%=configs.placeholder || "-快速查询-" %></option>',
            '<% _.each(configs.searchoptions, function(val) { %>',
            '<option role="option" value="<%=val.id %>"><%=val.text %></option>',
            '<% }); %>',
        '</select>'
    ].join(''));


    function actionColFormatter (cellval, opts, rowData) {
        //note: 一定要保证默认按钮和附加按钮渲染模版的数据字段都一致呀！
        var buttonsMap = {
            del:  {caption: '', id: 'jDeleteButton_' + rowid, type: 'del', title: $.jgrid.nav.deltitle, icon: 'ui-icon-trash'},
            edit: {caption: '', id: 'jEditButton_' + rowid, type: 'edit', title: $.jgrid.nav.edittitle, icon: 'ui-icon-pencil'},
            view: {caption: '', id: 'jViewButton_' + rowid, type: 'view', title: $.jgrid.nav.viewtitle, icon: 'icon-zoom-in grey'}
        };

        var cm = opts.colModel,
            gid = opts.gid,
            rsId = cm.rsId,
            rowid = opts.rowId,
            strHBtns = "",
            strVBtns = "",
            canButtonRender = cm.canButtonRender || $.noop;

        var btnNum = 0;
        var buttons = cm.buttons;
        var extraButtons = cm.extraButtons;
        var str;

        if(rowid === undefined || $.fmatter.isEmpty(rowid)) {return "";}

        _.each(buttons, function (name, i) {
            if(canButtonRender(name, opts, rowData) !== false) {
                str = btnTplFn(buttonsMap[name]);
                strHBtns += str;
                strVBtns += '<li>'+str+'</li>';
                btnNum++;
            }
        });

        _.each(extraButtons, function (item, i) {
            if(canButtonRender(item.name, opts, rowData, item) !== false) {
                str = extraBtnTplFn({
                    caption: item.caption || '',
                    id:   item.name + '_' + rowid,
                    type: item.name,
                    name: item.name,
                    title: item.title || '',
                    icon: item.icon || ''
                });
                strHBtns += str;
                strVBtns += '<li>'+str+'</li>';
                btnNum++;
            }
        });

        return [
        '<div class="horizontal-btns visible-md visible-lg visible-sm hidden-xs" style="margin-left:0px;">',
            strHBtns,
        '</div>',
        '<div class="vertical-btns visible-xs hidden-sm hidden-md hidden-lg">',
            '<div class="vertical-btns-inner inline position-relative">',
                '<button class="btn btn-minier btn-yellow dropdown-toggle" data-toggle="dropdown">',
                    '<i class="icon-caret-down icon-only bigger-120"></i>',
                '</button>',
                '<ul class="pop-left dropdown-menu dropdown-only-icon dropdown-yellow pull-right dropdown-caret dropdown-close">',
                    strVBtns,
                '</ul>',
            '</div>',
        '</div>'
        ].join('');
    }


    function checkArgs (options) {
        if(!options.rsId) {
            console.error('没有配置rsId', options.id || options.gid);
        }
    }

    function attachEvents (grid, options) {

        var $uiGrid = $(grid).closest('.ui-jqgrid');

        //表单提交成功后弹出toast信息框
        $(grid).on('_jqGridAddEditDelSubmitSuccess', function (event, ajaxObj, postData, opr) {
            Opf.Grid.toastSuccess(grid, opr);
        });

        //表单提交失败后统一弹出错误信息
        $(grid).on('_jqGridAddEditDelSubmitError', function (event, ajaxObj, postData, opr, frm) {

            var resp = ajaxObj.responseJSON;
            //resp.msg && Opf.Grid.alertFail(grid, opr, resp.msg);//暂时先删掉，后续看是否有问题

            if(opr === 'del') {
                $(frm).closest('.ui-jqdialog').find('.ui-jqdialog-titlebar-close').click();
            }
        });

        function busySubmitBtn (form, busy, btnSelector) {
            var $form = $(form);
            var $btn = $form.closest('.ui-jqdialog').find('.EditButton').find(btnSelector || '#sData');
            var $txt = $btn.contents().filter(function() {
                return this.nodeType === 3; //Node.TEXT_NODE
              }).eq(0);
            if(busy) {
                $btn.addClass('disabled');
                !$btn.data('jqgrid.text') && $btn.data('jqgrid.text', $txt.text());
                $txt.replaceWith($.jgrid.edit.bSubmiting);
            }else {
                $btn.removeClass('disabled');
                $btn.data('jqgrid.text') && $txt.replaceWith($btn.data('jqgrid.text'));
            }
        }

        //add/edit提交前
        $(grid).on('_jqGridAddEditBeforeRequest', function (event, postdata, form, frmoper) {
            busySubmitBtn(form, true);
        });

        //add/edit提交后
        $(grid).on('jqGridAddEditSubmitComplete', function (event, postdata, form, frmoper) {
            busySubmitBtn(form, false);
        });

        //del提交前
        $(grid).on('_jqGridDelBeforeRequest', function (event, postdata, form, frmoper) {
            busySubmitBtn(form, true, '#dData');
        });

        //del提交后
        $(grid).on('jqGridDelSubmitAfter', function (event, postdata, form, frmoper) {
            busySubmitBtn(form, false, '#dData');
        });

        //小屏下按钮菜单不够位置显示时，向左侧弹出
        $(grid).on('shown.bs.dropdown', '.vertical-btns-inner', doShowBtnColDropdown);

        $uiGrid.find('.ui-pg-selbox').on('change.storage', function () {
            this.value && Opf.Storage.set(options.rsId + '.rowNum', parseInt(this.value, 10));
        });

    }

    function doShowBtnColDropdown (e) {
        var $target = $(e.target);
        var $menu = $target.find('.dropdown-menu');
        var cacheTop = $menu.css('top');
        var cacheLeft = $menu.css('left');
        var cacheDisplay = $menu.css('display');
        var $table = $target.closest('.ui-jqgrid-btable');
        var $toggle = $target.find('.dropdown-toggle');
        var topGap;

        // $menu.css('top', -999);
        // var menuHeight = $menu.outerHeight(true);
        // $menu.css('top', cacheTop);

        // $menu.css({
        //  'left': -9999,
        //  display: 'block'
        // });
        // var menuTop = $menu.show().offset().top;
        // $menu.css({
        //  'left': cacheLeft,
        //  display: cacheDisplay
        // });

        if($table.length && $menu.length) {
            topGap = $table.offset().top - $menu.offset().top;
            if(topGap > 0) {
                $menu.addClass('offset-down');
            }
        }
    }

    //for grid nav 默认内置支持的全部按钮都有
    //如果不需要则配置相应按钮 例如禁用add按钮 nav: {actions:{add:false}}
    var DEFAULT_NAV_ACTIONS = {
        edit   : true,      editicon   : 'icon-pencil blue',
        add    : true,      addicon    : 'icon-plus-sign purple',
        del    : true,      delicon    : 'icon-trash red',
        search : true,      searchicon : 'icon-search orange',
        refresh: true,      refreshicon: 'icon-refresh green',
        view   : true,      viewicon   : 'icon-zoom-in grey'
    };

    //for edit/add/view
    var defaultAddEditViewForm = {
        width: FORM_WIDTH,
        height: FORM_HEIGHT,
        closeOnEscape: true
    };

    //for grid nav
    var defaultEdit = $.extend({}, defaultAddEditViewForm,{
        viewPagerButtons: false,
        recreateForm: true,
        closeAfterEdit: true,
        mtype: 'PUT', //thus ajax with http 'PUT'
        // ajaxEditOptions: {
        //  success: function () {
        //      console.log(arguments);
        //  }
        // },
        //pre interceptor
        _pre: {
            serializeEditData: function (postdata) {
                var data = $.extend(true, {}, postdata);
                delete data.oper;
                return JSON.stringify(data);
            },
            onclickSubmit: function(params, postdata) {
                //append the id the root restful path
                var tableId = $(this).attr('id');
                var id = postdata.id || postdata[tableId+'_id'];
                if(!new RegExp('\/'+id+'$').test(params.url)) {
                    params.url += '/' + encodeURIComponent(id);
                }
                //判断是否是进行提交的操作，对于提交的操作，在关闭对话框的时候取消提示
                pressSubmit = true;
            },
            beforeShowForm: function (form) {

                styleEditForm(form);
                var sIds = Opf.Grid.getSelRowIds(this);
                var id = Opf.Grid.getLastSelRowId(this);
                Opf.Grid.unSelRows(this, _.without(sIds, id));
                $(form).parents(".ui-jqdialog").find(".bottom-btns").find("a.ui-state-default").on("click", function(){
                    isCloseCancel = true;
                });
            }
        },
        //post interceptors
        _post: {
            afterShowForm: function (form) {
                editAddAfterShowForm.call(this, form);
            },
            onClose: function (form) {
                //关闭窗口时去掉固定背景内容
                closeDialogEvent();
                if(isPressSubmit() || (isCloseCancel && addInfoNodeBeforeDialogClose())){
                    isCloseCancel = false;
                    removeResizeFn4Dialog.call(this, form);
                }
            }
        }
    });



    //for grid nav
    var defaultAdd = $.extend({}, defaultAddEditViewForm,{
        mtype: 'POST', //thus ajax with http 'POST'
        closeAfterAdd: true,
        recreateForm: true,
        viewPagerButtons: false,
        _pre: {
            serializeEditData: function (postdata) {
                var data = $.extend(true, {}, postdata);
                if(data.id === '_empty'){
                    data.id = null;
                }
                delete data.oper;
                return JSON.stringify(data);
            },
            beforeShowForm: function (form) {
                styleEditForm(form);
                // attachValidationRules(this, form);
                $(form).parents(".ui-jqdialog").find(".bottom-btns").find("a.ui-state-default").on("click", function(){
                    isCloseCancel = true;
                });
            },

            onclickSubmit: function(params, postdata) {
                //判断是否是进行提交的操作，对于提交的操作，在关闭对话框的时候取消提示
                pressSubmit = true;
            }
        },
        //post interceptors
        _post: {
            afterShowForm: function (form) {
                editAddAfterShowForm.call(this, form);
            },
            onClose: function (form) {
                //关闭窗口时去掉固定背景内容
                closeDialogEvent();
                if(isPressSubmit() || (isCloseCancel && addInfoNodeBeforeDialogClose())){
                    isCloseCancel = false;
                    removeResizeFn4Dialog.call(this, form);
                }
            }/*,
            //TODO 如果外面覆盖这个方法，就没法获取验证错误相关的信息
            beforeSubmit: function () {
                return Opf.Validate.setup.apply(this, arguments);
            }*/
        }
    });

    var addDialogCanClose = false, addDialogJqmHide = null, pressSubmit = false, isCloseCancel = false;

    function addInfoNodeBeforeDialogClose(){

        if(addDialogCanClose){
            return true;
        }

        if(!addDialogJqmHide){
            //保存关闭对话框的函数，方便后面回复该函数
            addDialogJqmHide = $.fn.jqmHide;
        }
        //重载对话框关闭函数，不让对话框进行消失
        $.fn.jqmHide = function(){};

        Opf.confirm("确定要执行该操作吗，点击取消后，所填数据将不会保存", function(result){
            if(result){
                addDialogCanClose = true;
                //还原对话狂函数,保证对话框的关闭
                $.fn.jqmHide = addDialogJqmHide;

                //此前canClose设置为true保证顺利关闭dialog
                //没有想到怎么关闭对话框，就用了重新按取消键的方式，后面可以进行修改
                $(".EditButton #cData").click();
                addDialogCanClose = false;
                addDialogJqmHide = null;

            }
        });

        return false;
    }

    function isPressSubmit(){
        if(pressSubmit){
            if(addDialogJqmHide){
                $.fn.jqmHide = addDialogJqmHide;
            }
            pressSubmit = false;
            return true;
        }
        return false;
    }

    function checkTips (form) {
        $(form).find('[data-rel=tooltip]').tooltip();
        $(form).find('[data-rel=popover]').popover({html:true});
    }

    function editAddAfterShowForm (form) {
        $(form).find('#FormError').remove();
        var $dialog = closestDialog(form);
        addResizeFn4Dialog.call(this, form, this.p.nav.edit);
        $dialog.addClass('ui-dialog');//防止jquery.ui.dialog屏蔽了表单里的点击

        //打开表单窗口时让dialog背后内容不要滚动
        $('body').addClass('fixed-body');
        checkTips(form);

    }

    function attachValidationRules (t, form) {
        var validateRules = Opf.get(t.p, 'nav.add.validateRules');
        if(validateRules) {
            Opf.Validate.addRules(form, {rules: validateRules});
        }
    }

    //for grid nav
    var defaultView = $.extend({}, defaultAddEditViewForm,{
        recreateForm: true,
        resize: false,
        _pre: {
            beforeShowForm: function (form) {
                var $dialog = closestDialog(form);
                var viewOptions = this.p.nav.view;
                styleViewForm(form);

                //打开表单窗口时让dialog背后内容不要滚动
                $('body').addClass('fixed-body');

                //有的按钮（如 view）没有afterShowForm事件，所以统一用setTimeout模拟
                setTimeout(function () {
                    addResizeFn4Dialog.call(this, form, viewOptions);
                },50);
            }

        },
        //post interceptors
        _post: {
            onClose: function (form) {
                //关闭窗口时去掉固定背景内容
                closeDialogEvent();
                removeResizeFn4Dialog.call(this, form);
            }
        }
    });

    //for grid nav
    var defaultDel = {
        mtype: 'DELETE', //thus ajax with http 'DELETE'
        recreateForm: true,
        closeOnEscape: true,

        _pre: {
            serializeDelData: function() {
                //make the delete http request body empty
                return "";
            },
            onclickSubmit: function(params, id) {
                //append the id the root restful path
                params.url += '/' + encodeURIComponent(id);
            },
            beforeShowForm: function(form) {
                if (form.data('styled')) return false;

                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');

                styleDeleteForm(form);

                form.data('styled', true);

                alignCenterDialog(form);
            }
        }
    };

    // seach配置的filter，里面的每一个component的type映射到具体的类
    var FILTERS_COMPONENT_MAP = {
    	select2: 'assets/scripts/fwk/component/common-search-select2',
    	singleOrRangeDate: 'assets/scripts/fwk/component/common-search-date'
    };

    //for grid nav
    var defaultSearch = {
        recreateForm: true,
        multipleSearch: true,
        closeOnEscape: true,

        /**,
        multipleGroup:true,
        showQuery: true,
        */
        _pre: {
			onSearch: function() {
				var i, l, rules, rule, $grid = $(this),
					postData = $grid.jqGrid('getGridParam', 'postData'),
					filters = $.parseJSON(postData.filters);

				//找到当前的搜索框的dom，以及 customComponent 配置
				var fid = "fbox_"+ this.p.id;
				var filterDialogDom =  document.getElementById(fid);
                var customComponent = filterDialogDom.p.customComponent;
                var insMap = filterDialogDom.componentInstanceMap || (filterDialogDom.componentInstanceMap = {});

				//获取.search.customComponent.items 生成的view的值，加入到搜索查询的参数filters里
                if (customComponent) {
                	var newRules = filters.rules;

					_.each(customComponent.items, function(item, index) {
						var componentKey = item.type + index; //必须在循环内声明该变量，后面异步用到
		                newRules = _.union(newRules, insMap[componentKey].getRules());
		                // console.log('type:  '+ item.type);
		                // console.log('newRule:  '+ newRules);
					});

                	filters.rules = newRules;
				}


				if (filters && typeof filters.rules !== 'undefined' && filters.rules.length > 0) {
					rules = filters.rules = _.reject(filters.rules, function(obj) {
						var rd = $.trim(obj.data);
						if (_.isString(rd) && rd) {
							return false;
						}
						return true;
					});

					for (i = 0; i < rules.length; i++) {
						rule = rules[i];
						rule.data = encodeURIComponent(rule.data);
					}
					postData.filters = JSON.stringify(filters);
				}
			},
            afterShowSearch: function(e) {
                var form = $(e[0]),
                    searchOptions = this.p.nav.search;
                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
                styleSearchForm(form);
                //打开表单窗口时让dialog背后内容不要滚动
                $('body').addClass('fixed-body');
                addResizeFn4Dialog.call(this, form, searchOptions, true);
            },
            beforeRedraw: function () {
            	var dialogDom = this;
                var customComponent = this.p.customComponent;
                var insMap = this.componentInstanceMap || (this.componentInstanceMap = {});

                if(customComponent){
                    var comLoadFlags = this.comLoadFlags ||
                                        (this.comLoadFlags = _.map(customComponent.items, function () {return false;}));

                    // console.log('>>>factory beforeRedraw');
                    // console.log('insMap', insMap);

                    var hasNotLoad = _.some(comLoadFlags, function (flag) {return flag === false;});
                    if(hasNotLoad) {
                        Opf.UI.setLoading($(this), true);
                    }
                    // console.log('>>>setloading');
                    //标识某个item的依赖是否加载完


                	_.each(customComponent.items, function(item, index){
                		var componentKey = item.type + index;//必须在循环内声明该变量，后面异步用到

                		if(!insMap[componentKey]) {
                			var deferred = $.Deferred();
                			// console.log('不存在，加载类');
			                require([FILTERS_COMPONENT_MAP[item.type]], function(ComponentView){
			                	// console.log('加载完， 创建');
			                    insMap[componentKey] = new ComponentView(item);
				                insMap[componentKey].$el.hide().appendTo(document.body);
				                deferred.resolve();
				                comLoadFlags[index] = true;
				                //只要有一位标识为false，就表示还未全部加载完
				                var hasNotLoad = _.some(comLoadFlags, function (flag) {return flag === false;});
				                if(!hasNotLoad) {
				                	Opf.UI.setLoading(dialogDom, false);
				                	// console.log('<<<<setloading false');
				                }
			                });

			                insMap[componentKey] = deferred.promise();

                		}else {

		                	// console.log('存在，隐藏');
                			insMap[componentKey].$el && insMap[componentKey].$el.hide().appendTo(document.body);
                		}
                	});
                }

            },
			afterRedraw: function() {
				// console.log('>>factory afterRedraw', this);

				var $grid = $(this);
				var $tbody = $(this).find('tbody');
				var customComponent = this.p.customComponent;
				var insMap = this.componentInstanceMap || (this.componentInstanceMap = {});

				if (customComponent) {
					_.each(customComponent.items, function(item, index) {
						var componentKey = item.type + index; //必须在循环内声明该变量，后面异步用到

						//因为涉及requirejs的依赖延迟，这里用了个技巧，在第一次加载创建之前，
						//insMap[componentKey]是一个 deferred 对象，并且保证在加载创建完后调用resolve
						if (insMap[componentKey].done) {
							// console.log('组件是个deferred');
							insMap[componentKey].done(function() {
								showFilterComponent(componentKey);
							});
						} else {
							// console.log('组件是个view');
							showFilterComponent(componentKey);
						}
					});
				}

				function showFilterComponent(componentKey) {
					if (insMap[componentKey].$el) {
						_.defer(function() {
							// console.log('显示SearchDate');
							$tbody.find('tr:eq(1)').after(insMap[componentKey].$el);
							insMap[componentKey].$el.show();
						});
					}
				}

                // 恶心 有些搜素框的输入值一开始就是select，如果不手动选择一下发送请求时值的设置会失败，在这里触发一下select的change事件
                $(this).find('.operators').find('select').trigger('change');
			},
            beforeShowSearch: function (form) { // form is an array contains nothing at all
                alignCenterDialog(form); // but it works, by zhuyimin
                // 有些表初始化时设置了datatype 为 local 所以打开放大镜搜索的时候要把它设回 json，不然无法请求数据
                $(this).jqGrid('setGridParam', { datatype: 'json' });
                return true;
            },
            onReset: function () {
                var search = this.p.nav.search,
                    resetReserveValue = search.resetReserveValue;

                var $grid = $(this),
                    postData = $grid.jqGrid('getGridParam', 'postData');

                // 初始化 filters;
                var filters = {"groupOp":"AND", rules: null};

                // 如果有重置保留值，则在重置完毕之后给 filters 加上
                if(resetReserveValue && resetReserveValue.length){
                    filters.rules = resetReserveValue;
                }

                postData.filters = JSON.stringify(filters);

                return true;
            }
        },
        //post interceptors
        _post: {
            onClose: function (form) {
                //关闭窗口时去掉固定背景内容
                closeDialogEvent();
                removeResizeFn4Dialog.call(this, form);
            }
        }
    };

    var defaultGridOptions = {
        //don't change name `datatype`to ajax config `dataType`
        datatype: 'json',//this is jqgrid's config, means data type for loading when init
        height: 'auto'
    };

    // $.jgrid.ajaxOptions

    var RESIZE_BUF = 200;

    function closestDialog (el) {
        return $(el).closest('.ui-jqdialog');
    }

    function adjustSize () {

    }

    //options={width:xx, height:xx}
    //若新建的窗口是查询窗口 isSearchDialog = true，则不能设定其整体高度及其body高度
    function addResizeFn4Dialog (form, options, isSearchDialog) {
        var $dialog = closestDialog(form);

        var resizeFn = Opf.Function.createBuffered(function () {

            var height = $dialog.height(),
                outerHGap = $dialog.outerHeight(true) - height,
                windowHeight = $(window).height(),

                width = $dialog.width(),
                outerWGap = $dialog.outerWidth(true) - width,
                windowWidth = $(window).width(),

                titleH = $dialog.find('.ui-jqdialog-titlebar').height() || 0,
                bottomH = $dialog.find('.bottom-btns').height() || 0,
                bodyH = ($dialog.find('.ui-jqdialog-content tbody').height() + 1) || 0;
                // bodyH = ($dialog.find('.ui-jqdialog-content tbody').height()) || 0;


            //如果有配置了对应类型表单窗口的高度,如创建jqgrid的参数配置里有
            //nav: {edit: {height: 400}}
            //优先恢复到已有配置
            //ps: jqgrid的表单height配置不包括border&margin
            if(options && options.height && options.height !== height) {
                height = options.height;
            }



            if(options && options.width && options.width !== width) {
                width = options.width;
            } else if (isSearchDialog) {
                //nav一般都没有设置search，所以formsize设置对search不起作用，
                //因此当其宽度大于window宽度而被缩小后，
                //并不能在window宽度变得很大时恢复原来的大小，
                //此处重置其宽度为450，与jquery.jqGrid中的默认设置一样
                width = 450;
            }

            //其次在判断是否超出浏览器,这里要加上border&margin来比较
            if(height + outerHGap > windowHeight) {
                height = windowHeight - outerHGap;
            }

            if(width + outerWGap > windowWidth) {
                width = windowWidth - outerWGap;
            }

            //如果新建的窗口不是查询窗口，则设定其高度
            !isSearchDialog && $dialog.height(height);//jquery的height方法不包括border&margin

            $dialog.width(width);//jquery的height方法不包括border&margin

            alignCenterDialog($dialog);//居中

            //如果新建的窗口不是查询窗口
            !isSearchDialog && Opf.Grid.populateBodyHeight($dialog);//重新计算窗口body高度
        }, RESIZE_BUF);

        $dialog.data('resizeFn', resizeFn);

        $(window).on('resize.jqgridform', resizeFn).triggerHandler('resize.jqgridform');
        setTimeout(function(){
            $('.ui-jqdialog:first').focus();
        },100);
    }

    function removeResizeFn4Dialog (form) {
        //表单窗口关闭后，取消resize相关事件处理器
        var $dialog = $(form).closest('.ui-jqdialog');
        var resizeFn = $dialog.data('resizeFn');
        resizeFn && $(window).off('resize', resizeFn);
    }

    function buildGrid (opt) {

        var renderTo = opt.tableRenderTo ? opt.tableRenderTo :
                            opt.gid ? '#' + opt.gid + '-table' : document.body;

        var $tableCt;
        if(typeof renderTo === 'string' && opt.elRoot) {
            $tableCt = opt.elRoot.find(renderTo);
        }else {
            $tableCt = $(renderTo);
        }

        if(!$tableCt) console.error('can not file grid container', opt.gid);

        if(opt.pager === false) {
            $.extend(opt, {
                rowList: false, // disable page size dropdown
                pgbuttons: false, // disable page control like next, back button
                // pgtext: false,         // disable pager text like 'Page 0 of 10'
                viewrecords: false, // disable current view record text like 'View 1-10 of 100'
                pginput: false
            });
        }

        //默认jqgrid把分页按钮和编辑按钮都放在pager上
        //我们把pager的意义更改为分页按钮等
        //把nav的意义是是否要那些分页bar上的小按钮
        if(opt.pager !== false || opt.nav !== false) {
            opt.pager = '#' + opt.gid + '-pager';
        }

        // if('top' === Opf.get(opt, 'nav.position')) {
            // opt.toolbar = [true, 'top'];
            opt.toppager = opt.toppager === void 0 ? true : opt.toppager;
        // }

        //TODO height
        if(opt.maxHeight && opt.height === 'auto') {
            opt.height = opt.maxHeight;
        }

        //TODO用拦截配置的方式,防止被覆盖
        //配合后台页数从0开始
        var _serializeGridData = opt.serializeGridData;
        opt.serializeGridData = function (argPostData) {
            var postData = $.extend({}, argPostData);
            if(postData.number != void 0) {
                postData.number = parseInt(postData.number, 10) - 1;
            }

            if(postData.sidx) {
                postData.sort = JSON.stringify([{
                    "property": postData.sidx,
                    "direction": (postData.sord || 'ASC').toUpperCase()
                }]);
            }

            delete postData.sord;
            delete postData.sidx;

            if(_serializeGridData) {
                return _serializeGridData(postData);
            }else {
                return postData;
            }

        };


        // 在数据第一次返回的时候设置某些列的隐藏, 某些列不可编辑
        var handlerSensitiveCol = _.once(function ($this, data) {

            _.each(data.ignoreFields, function (field) {
                $this.hideCol(field);
                $this.jqGrid('setColProp', field, { viewable: false });
            });

            $this.data('ignoreFields', data.ignoreFields);

            //触发表格宽度调整相关的事件
            $(window).trigger('resize.grid.autosize');

            // _.each(data.sensitiveFields, function (field) {
            //  $this.jqGrid('setColProp', field, { editable: false });
            // });

        });

        //TODO用拦截配置的方式,防止被覆盖
        //配合后台页数从0开始
        opt.beforeProcessing = function (data) {

            if(data.number != void 0) {
                data.number = parseInt(data.number, 10) + 1;
            }

            // 如果返回的数据列表为空，那么ignoreFields的字段也为空，只有返回有数据的时候ignoreFields才有值。
            if(data.ignoreFields && data.ignoreFields.length > 0) {
                handlerSensitiveCol($(this), data);
            }
        };

        //TODO 拦截的方式
        //没有方法获取原来的数据，所以每次插入一行后，把数据挂到dom上
        opt.afterInsertRow = function (rowid, rowdata, rowelem) {
            $($(this).getGridRowById(rowid)).data('record', rowelem);
        };

        //设置上次存下来的“每页显示多少”
        var _lastRownum = Opf.Storage.get(opt.rsId + '.rowNum');
        if(!opt.rowNum && _lastRownum) {
            opt.rowNum = _lastRownum;
        }

        //TODO 拦截的方式
        // opt.onCellSelect = function (rowid, iCol,  cellcontent, e) {
        //  console.log(arguments);
        // };
        // opt.gridComplete = function () {

        // };
        // $tableCt.click(function (e) {
        //  var $target = $(e.target).closest('tr');

        // });

        opt.responsiveOptions = opt.responsiveOptions || true;

        setupIntercptors(opt);//里面涉及到处理filters显示

        // 只做一件事情：根据条件设置 datatype = 'local'
        // PS: 原来的 opt.datatype 为 'json'，默认请求数据; opt.datatype 为 'local', 不会请求数据
        if(opt.filters){
            var defaultFilters;
            for(var i = 0; i < opt.filters.length; i++){
                var filter = opt.filters[i];
                var defaultRenderGrid = filter.defaultRenderGrid === void 0 ? true : filter.defaultRenderGrid;
                var canSearchAll = filter.canSearchAll === void 0 ? false : filter.defaultRenderGrid;
                // 遍历每一个搜索条件的组合，如果 filter 没有配置 defaultRenderGrid 时，默认为true;
                // 如果 filter 配置 defaultRenderGrid 为false 时，则 datatype = 'local'
                // 如果 filter 配置 defaultRenderGrid 为true 时，
                //     条件一：如果 components 中配置了 defaultValue，则 datatype = 'local'
                //     条件二：如果 components 中没有配置了 defaultValue，并且 canSearchAll == false, 则 datatype = 'local'
                if(defaultRenderGrid === false){
                    $.extend(opt, {datatype: 'local'});
                    break;
                } else {
                    // 找出 component 中的默认值
                    defaultFilters = _.filter(filter.components, function (component) {
                        return component.defaultValue !== void 0;
                    });
                    if(defaultFilters.length){
                        $.extend(opt, {datatype: 'local'});
                        break;
                    }else if(canSearchAll === false){
                        $.extend(opt, {datatype: 'local'});
                        break;
                    }
                }
            }
        }

        $tableCt.jqGrid(opt);

        if(opt.forceCpation !== true) {
            $($tableCt[0].grid.cDiv).hide();
        }

        applyClassesToHeaders($tableCt);


        return $tableCt;
    }

    var applyClassesToHeaders = function ($grid) {
        // Use the passed in grid as context,
        // in case we have more than one table on the page.
        var trHead = jQuery("thead:first tr", $grid[0].grid.hdiv);
        var colModel = $grid.getGridParam("colModel");

        var cm;
        $('th', trHead).each(function (iCol, el) {
            cm = colModel[iCol];
            if(cm && cm.classes) {
                $(this).addClass(cm.classes);
            }
        });
    };

    function setupIntercptors (opt) {
        /****
        *   e.g.
        *   if(opt.loadComplete) {
        *       opt.loadComplete = Opf.Function.createInterceptor(
        *                                               defaultLoadComplete, opt.loadComplete);
        *   }
         */
        //TODO replace PRE_INTERCEPTORS with `defaultInterceptors`
        //if not, then easy to control, if so, less config
        _.each(PRE_INTERCEPTORS, function (func, name) {
                opt[name] = !opt[name] ? func : Opf.Function.createInterceptor(func, opt[name], opt);
        });
    }

    var PRE_INTERCEPTORS = {

        onInitGrid: function() {

            var table = this;
            var opt = table.p;
            var autoResize = opt.autoResize !== false ? true : false;
            var maxWidth = opt.maxWidth;
            var $grid = $(this);

            //max height
            if (opt.maxHeight) {
                Opf.setJqGridMaxHeight($grid, opt.maxHeight);
            }
            if (opt.maxWidth) {
                Opf.setJqGridMaxWidth($grid, opt.maxWidth);
            }

            if (opt.responsiveOptions) {
                //event `responsive` is trigger in utils.js
                $(window).bind('responsive.grid', function(e, lastMdName, newMdName) {

                    // console.info($grid.attr('id') + ' from ' + lastMdName + ' to ' + newMdName);

                    populateResponsive(this, lastMdName, newMdName);
                    _.each(opt.colModel, function (col) {
                        if(col.responsive) {
                            col.responsive.call(table, col, lastMdName, newMdName);
                        }
                    });

                    //TODO better to set hidden in columnModel for first time response
                    $grid.is(':visible') && populateResponsiveColVisibility($grid, opt, lastMdName, newMdName);

                }).trigger('responsive.grid', [null, Opf.Media.calcName()]);
            }

            if (autoResize) {
                $(window).bind('resize.grid.autosize', Opf.Function.createBuffered(function() {

                    Opf.resizeJqGrid(table);

                }, RESIZE_BUF));//.trigger('resize');

            }

            if(opt.download) {
                _.defer(function () {
                    addDownloadBtn(table, opt.download);
                });
            }

            opt.filters && addGridFilters(table);//处理filters

            setTimeout(function() {
                // styleCheckbox(table);
                //TODO 初始化的列宽度算法出错，暂时重新resize
                Opf.resizeJqGrid(table);

                updateActionIcons(table);
                updatePagerIcons(table);
                // enableTooltips(table);
            }, 0);
        },

        onSelectAll: function (records, check) {
            console.info('>>>onselectrow');
            Opf.Grid.toggleEnableToolBtns(this, ['edit', 'view', 'del'], check);
        },

        onSelectRow: function  (records, check) {
            console.info('>>>onselectrow');
            var enable = check || Opf.Grid.hasSelRow(this);
            Opf.Grid.toggleEnableToolBtns(this, ['edit', 'view', 'del'], enable);

            //fix jqgrid bug, when select data row and all the data row is selected
            //so then check the head box on
            if(check && $(this)[0].p.multiselect &&
                    Opf.Grid.getSelRowIds(this).length  === $(this).getDataIDs().length) {
                    $(this)[0].setHeadCheckBox(true);
            }
        },

        // 结束请求，生成报表数据失败，执行该方法
        loadError: function (resp) {
            var p = this.p;
            p.filters && setGridLoadingSearchBtn(true);
        },

        // 结束请求，生成报表数据成功，执行该方法
        loadComplete: function (resp) {
            var me = this;
            var p = this.p;
            var $this = $(this);
            var isEmptyRecords = _.isEmpty(resp[p.jsonReader.root]);
            var $uiJqgrid = $this.closest('.ui-jqgrid');

            p.filters && setGridLoadingSearchBtn(true);

            $(this).data('last.response', resp);

            //样式默认隐藏表头，因为要依赖后台数据来隐藏某些列，防止某些头部从有到无地闪一下
            //当返回的数据不为空的时候才显示表头
            if (resp.content && resp.content.length > 0) {
                $this.closest('.ui-jqgrid').find('.ui-jqgrid-htable').css({'visibility': 'visible'});
            }

            //default disable edit/view/del btn when no selected row
            if(!Opf.Grid.hasSelRow(this)) {
                Opf.Grid.toggleEnableToolBtns(this, ['edit', 'view', 'del'], false);
            }

            //auto refresh, loadComplete will be invoked every time after grid load data
            if(p.autoRefresh && !$this.data('refreshTimer')) {
                var refreshTimer = setInterval(function () {
                    // 判断jqgrid是否被移除，如果jqgrid已移除，则删除自动刷新
                    if ($this.closest('body').length === 0) {
                        clearInterval(refreshTimer);
                    }
                    $this.trigger('reloadGrid', {current: true});
                }, p.autoRefreshInterval || DEFAULT_AUTO_REFRESH_INTERVAL);
                //TODO? assign to p ?
                $this.data('refreshTimer', refreshTimer);
            }

            // isQuickSearch默认为false，当选择下拉框搜索时isQuickSearch才为true
            // 如果不是因为下拉选项搜索导致页面刷新则需要将下拉框的placeholder显示出来。
            if(p.quickSearch) {
                if(!p.isQuickSearch) {
                    p.$quickSearchEl && p.$quickSearchEl.children(':first').attr('selected',true);
                }
                p.isQuickSearch = false;
            }

            arguments[0].statDataMap && addStatLine($this,arguments);

            setTimeout(function() {
                p.title && addGridTitle(me);
                if(p.overflow){
                    adaptGridWidth(me);
                }
            },50);

            if(p.download) {
                setTimeout(function () {
                    //对比当前的下载按钮的rsId是否在下载任务队列中
                    //如果不在，
                    //下载按钮默认是disabled，判断：
                    //    如果队列中有未完成的任务或者表中没有数据，下载按钮不可用
                    var $uiPgBtnDl = $uiJqgrid.find('.ui-pg-button-download-default');
                    var thisTask = _.findWhere(App.TaskQueueMgr.getTaskList(), {rsId: $uiPgBtnDl.attr('rsId')});
                    var isWaitTask = thisTask && thisTask.status != 'done';
                    var showTitle = isEmptyRecords ? '无数据' : (isWaitTask ? '报表下载中,请等待...' : '下载最近生成的报表');

                    if(p.download.searchFilter === false){
                        p.download.searchFilter = true;
                    }
                    else{
                        $uiPgBtnDl.toggleClass('disabled', isWaitTask || isEmptyRecords);//两者只能有一个为true
                    }
                    $uiPgBtnDl.attr('title', showTitle);
                }, 50);
            }

        }

    };//ef defaultInterceptors

    /**这个是搜索优化框的配置选项
     * filters: [
        {
            caption: '精准搜索',(必填)
            canClearSearch: true/false,是否显示清空帅选条件按钮(选填)
            components: [
                {
                    label: '清算日期',(必填)
                    name:'settleDate',(必填)
                    type: text/select/date/rangeDate (如果不配，默认为text)(选填)
                    defaultValue: 'xxxx'/{startDate: 'xx', endDate: 'xx'}(用于日期范围)(选填)
                    options:{(选填)
                        sopt:['eq'],//'lk', 'nlk','eq', 'ne', 'lt', 'le', 'gt', 'ge'(如果仅有等于或者不配则去掉这个下拉列表)
                        dataInit: function (elem) {
                            ...(elem为输入值的框框，你可以在它显示之前进行处理)
                        },
                        value: VALUE_MAP(仅用于配置select的选项值)
                    }
                },{...},{...}

            ],
            searchBtn: {
                text:'搜索',
                id:'xxx'
            }
        }

    ]
     *
     */

    function setGridLoadingSearchBtn(toBeEnable) {
        $('.condition-wrap').find('.search-btn').prop('disabled', toBeEnable === false ? true : false);
    }

     //TODO 拆成一个单独插件
    function addDownloadBtn (table) {
        var options = table.p.download;
        var gid = table.p.gid;
        var rsId = table.p.rsId;
        var title = options.titleName ? options.titleName : '下载报表';

        //navButtonAdd 到时候放到工厂里
        Opf.Grid.navButtonAdd(table, {
            caption: '<span class="dl-text">'+title+'</span>',//<i class="icon-download"></i>
            title:'无数据',
            buttonicon: 'icon-download smaller-80',
            className: 'ui-pg-button-download-default disabled',
            onClickButton: onClickButton,
            position: "last"
        });

        var $uiPgBtnDl = $(table).closest('.ui-jqgrid').find('.ui-pg-button-download-default');
        var $dlText = $uiPgBtnDl.find('.dl-text');

        $uiPgBtnDl.attr('rsId', rsId);

        //TODO 判断权限
        // if(!Ctx.avail(rsId + '.btn.download')) {
        if(!Ctx.avail(rsId + '.download')) {
            $uiPgBtnDl.empty().width(100).removeClass('ui-pg-button').off('click');
            return;
        }

        function onClickButton() {
            if ($uiPgBtnDl.hasClass('disabled')) {
                return;
            }

            //TODO 还没处理正在请求数据（初始化和后续生成）,数据还没回来的情况
            var tid = Ctx.getUUID();//外面传进来？？

            //>>>DEBUG
            // tid='abcdefg';
            //<<<DEBUG

            var params = $.extend({}, _.result(options, 'params'), {tid: tid});

            Opf.UI.ajaxBusyText($dlText, '请求中...');
            $uiPgBtnDl.addClass('disabled');
            $uiPgBtnDl.attr('title', '报表下载中,请等待...');
            Opf.ajax({
                url: _.result(options, 'url'),
                type:'GET',
                data: params,
                success: function(resp) {
                    if(resp.success !== false) {
                        //判断回来的数中本身是不是有下载URL的，如果有，直接下载，不用走轮询
                        var dlUrl = resp.data || resp.url;
                        if(dlUrl){
                            Opf.download(dlUrl);
                            //当数据返回成功下载报表时，对比当前rsId的下载按钮，将其置为可用
                            var $uiPgBtnDl = $('.ui-pg-button-download-default[rsId="'+ rsId +'"]');
                            $uiPgBtnDl.length && $uiPgBtnDl.removeClass('disabled');
                        }else{
                            var reportQueueTask = new ReportPollingTask({
                                name: _.result(options.queueTask, 'name'),
                                params: params,
                                rsId: rsId
                            });

                            App.TaskQueueMgr.addTask(reportQueueTask);

                            Opf.Polling.addCallback({
                                tid: tid,
                                fn: function (obj) {
                                    reportQueueTask.updateByResponse(obj);
                                    if(obj.data){
                                        //当数据返回成功下载报表时，对比当前rsId的下载按钮，将其置为可用
                                        var $uiPgBtnDl = $('.ui-pg-button-download-default[rsId="'+ rsId +'"]');
                                        $uiPgBtnDl.length && $uiPgBtnDl.removeClass('disabled');
                                    }
                                }
                            });
                        }

                    }
                    // var source = resp.data || resp.url;
                    // source && Opf.download(source);
                    // $dlBtn.find('.dl-text').text('下载报表');
                    // $dlBtn.removeClass('disabled-dl');
                    // downloadInverse($dlBtn);
                }
            });
        }


        /**
         *
         *  filters: {
         *      components: [
         *      	{
         *      		label:'何乐', // 搜索字段显示名称 ---必填
         *      		name: 'hele', // 搜索字段 ---必填
         *      		type:'text', // 搜索内容输入框支持四种类型：text | date | rangeDate | select ---可选，默认为 text
         *      		ignoreFormReset: true, // 如果某个组件配置了ignoreFormReset = true，则在情清空过滤条件的时候将会不清空该组件 ---可选
         *      		defaultValue: 'xxx' | {startDate: moment对象, endDate: moment对象}, // 默认值：如果是 type=rangeDate，则设置格式为后者，其余为前者 ---可选
         *      		options: { ---可选
         *      	    	sopt: conditions, // 可选操作值：('lk':'包含','nlk':'不包含','gt':'大于','ge':'大于等于','eq':'等于','ne':'不等于','lt':'小于','le':'小于等于','in':'等于','ni':'不等') ---可选
         *      	    	value: VALUE_MAP, // 如果 type=select 则这个是下拉框的选项值 VALUE_MAP = {value: text, ...} ——> <option value="value">text</option> ---type=select 时必填
         *      	    	dataInit: function(elem){...} // 允许在生成dom后对搜索内容输入框进行操作 ---可选
         *      	   	}
         *      	}
         *      ]
         *  }
s         *
         * */
    }

    //addDownloadBtn
    function addGridFilters (grid) {
        var p = grid.p;
        var $grid = $(grid);
        var filters = p.filters||[];
        var $gridWrap = $(grid).closest('.jgrid-container');
        var filterViewList = [];

        // 适应于无查询条件且默认不显示数据的情形
        if(filters.length == 1 && !filters[0].components && filters[0].defaultRenderGrid === false) { return; }

        var $filterWrap = $('<div class="condition-wrap"></div>').insertBefore($gridWrap);

        require(['assets/scripts/fwk/component/common-filters-fieldset'], function (FiltersFieldset) {

            _.each(filters, function(filterOptions){

                var $filters = new FiltersFieldset(filterOptions);
                // defaultRenderGrid : 1.当值为 true 时，如果有默认值，就生成数据
                //                     2.当值为 false 时，不管有没默认值，都不生成数据
                //                     3.当值为 important 时，不管有没默认值，都生成数据

                if(filterOptions.defaultRenderGrid !== void 0 && filterOptions.defaultRenderGrid !== true){ // 不为 underfine 并且不为 true
                    $filters.defaultRenderGrid = filterOptions.defaultRenderGrid;
                } else {
                    $filters.defaultRenderGrid = true;
                }

                $filters.on('submit', function(filters) {
                    //缓存 原有的 filters
                    var postData = $grid.jqGrid('getGridParam', 'postData');

                    $grid.jqGrid('setGridParam', {
                        datatype: 'json'
                    });
                    postData.filters = filters;

                    // 支持过滤按钮的配置 onClickSubmit 方法，在请求后台之前对 postData 进行处理
                    if(filterOptions.searchBtn && $.isFunction(filterOptions.searchBtn.onClickSubmit)){
                        postData = filterOptions.searchBtn.onClickSubmit(postData);
                    }

                    //给机会外部调整请求参数
                    if(filterOptions.beforeSubmit && filterOptions.beforeSubmit(postData) === false) {
                        return false;
                    }else {
                        $grid.trigger("reloadGrid", [{page:1}]);
                        setGridLoadingSearchBtn(false);
                    }
                });

                $filterWrap.append($filters.$el);
                filterViewList.push($filters);
            });

            //cache filter view
            if(!p.filterViews){
                p.filterViews = filterViewList;
            }

            // defaultRenderGrid : 1.当值为 true 时，如果有默认值，就生成数据
            //                     2.当值为 false 时，不管有没默认值，都不生成数据
            //                     3.当值为 important 时，不管有没默认值，都生成数据

            var hasRenderGrid = false;
            for(var i = 0,ln = filterViewList.length; i < ln; i++) {
                if(filterViewList[i].defaultRenderGrid === 'important'){
                    filterViewList[i].clickSearchBtn();
                    hasRenderGrid = true;
                    break;
                }
            }
            if(!hasRenderGrid){
                for(var i = 0,ln = filterViewList.length; i < ln; i++) {
                    if(filterViewList[i].getFilterValue() && filterViewList[i].defaultRenderGrid === true){
                        filterViewList[i].clickSearchBtn();
                        hasRenderGrid = true;
                        break;
                    }
                }
            }

        });

    }

    function addGridTitle (grid) {
        var p = grid.p;
        var $gridWrap = $(grid).closest('.ui-jqgrid');
        var $toppager = $gridWrap.find('.ui-jqgrid-toppager');
        var $ctTd = $toppager.find('td[align="center"]');

        var tableTitleHtml = '<div class="report-title">'+ p.title +'</div>';
        $ctTd.empty().append(tableTitleHtml).show();
        $ctTd.css('width', 'auto');
    }

    function adaptGridWidth (grid){
        var p = grid.p;
        var $grid = $(grid);
        var $gridWrap = $grid.closest('.ui-jqgrid');
        var $tblHeanderRow;

        if($gridWrap.find('.jqg-first-row-header').length){
            $tblHeanderRow = $gridWrap.find('.jqg-first-row-header');
        }else{
            $tblHeanderRow = $gridWrap.find('.ui-jqgrid-labels');
        }

        var $tblBodyRow = $gridWrap.find('.jqgfirstrow');

        var needSetupClassList = ['view','toppager','hdiv','bdiv','pager'];
        $gridWrap.css('width', '100%');
        for(var i = 0; i < needSetupClassList.length; i++){
            var item = needSetupClassList[i];
            $gridWrap.find('.ui-jqgrid-' + item).css({'width': '100%'});
        }

        for(var i = 0; i < p.colModel.length; i++){
            var item = p.colModel[i];
            var colWidth = item._width ? item._width : 100;
            var $colTh = $tblHeanderRow.find('th').eq(i);
            var $colTd = $tblBodyRow.find('td').eq(i);

            $colTh.css('width', colWidth + 'px');
            $colTd.css('width', colWidth + 'px');
        }

        $gridWrap.find('.ui-jqgrid-toppager').find('table').css('table-layout', 'auto');
        //调节整体表格的宽度与表格内容宽度一致
        var $body = $gridWrap.find('.ui-jqgrid-btable');
        $(window).on('resize.adaptgrid', function(){
            if($gridWrap.width() > $body.width()){
                setTimeout(function(){
                    $body.width($gridWrap.width() - 2);
                },10);
            }
        }).triggerHandler('resize.adaptgrid');
    }


    function addQuickSearch (grid, quickSearchConfig) {
        _.each(quickSearchConfig.searchoptions, function(val) {
            val.id = val.id.toString();
        });

        var $extraSearch = $(extraSearchTplFn({configs: quickSearchConfig})),
            prepend = '#' + grid.attr('id') + '_toppager_right';
            $(prepend).prepend($extraSearch);

        //将下拉搜索框的DOM放入$quickSearchEl参数中
        grid.jqGrid('setGridParam', {$quickSearchEl: $extraSearch});
        $extraSearch.on('change', function() {
            var postData = $(grid).jqGrid('getGridParam', 'postData'),
                rules = _.findWhere(quickSearchConfig.searchoptions, {id: $extraSearch.val()}).rules;

            var oldFilters = postData.filters;

            if(rules) {
                var filters = JSON.stringify({groupOp:"AND",rules:rules});
                postData.filters = filters;
            } else {
                delete postData['filters'];
            }

            // isQuickSearch默认为false，当选择下拉框搜索时isQuickSearch才为true
            // 如果不是因为下拉选项搜索导致页面刷新则需要将下拉框的placeholder显示出来。
            $(grid).jqGrid('setGridParam', {search: true, postData: postData, isQuickSearch: true});
            $(grid).trigger("reloadGrid", [{page:1}]);

            //下拉搜索完毕后，还原filters的内容。
            // delete postData['filters'];
            // postData.filters = oldFilters;
            // $(grid).jqGrid('setGridParam', {postData: postData});
        });
    }

    function addTableCenterTitle (grid, centerTitle) {
        append = '#' + grid.attr('id') + '_toppager_center';
        $(append).append('<label class="jqgrid-table-center-title">' + centerTitle + '</label>').show().css({"width": "initial"});
    }


    function buildToolbar (grid, options) {
        var navRenderTo = '#' + options.gid + '-pager';

        var navOpt = options.nav || {};

        if(navOpt.formSize) {
            _.each(['edit', 'add', 'view'], function (type) {
                navOpt[type] = $.extend({}, navOpt.formSize, navOpt[type]);
            });
        }

        // 如果配置了 filters 那么默认配置 search.loadDefaults = false, 防止放大镜搜索依赖了优化搜索的参数
        if(options.filters && navOpt.search){
            navOpt.search.loadDefaults = false;
        }

        var isTopToolbar = ('top' === Opf.get(options, 'nav.position'));

        var actions = _.defaults({cloneToTop:isTopToolbar}, navOpt.actions || {}, DEFAULT_NAV_ACTIONS);
        applyPermissionToNavAction(actions, options);

        //>>permission

        //get practical permission code
        var permissionCode;

        //apply to the action options


        //<<<permission

        var edit    = assembleActionOptinon( defaultEdit,   navOpt.edit,   options.url);
        var add     = assembleActionOptinon( defaultAdd,    navOpt.add,    options.url);
        var del     = assembleActionOptinon( defaultDel,    navOpt.del,    options.url);
        var search  = assembleActionOptinon( defaultSearch, navOpt.search, options.url);
        var view    = assembleActionOptinon( defaultView,   navOpt.view);

        /**|--------------------------------------------
         * |new pager & nav
         * |--------------------------------------------*/
         // setTimeout(function () {//暂时不要延迟，不然自定义按钮找不到容器
            grid.jqGrid('navGrid', navRenderTo, actions, edit, add, del, search, view );
        // }, 1);

        customPagerStyle(grid);
        //如果toolbar按钮在配置在上方，就要把默认的左下方的按钮清空，右上方的pager按钮清空
        // if(isTopToolbar) {
            // grid.closest('.ui-jqgrid').find('.ui-pager-control:first tbody:first > tr> td:not(:first)').remove();
            // grid.closest('.ui-jqgrid').find('.ui-pager-control:last tbody:first > tr> td:first').empty();
        // }
    }

    /**
     * 生成页面工具条<toolbar>
 *     @toolbar {id:"", iconCls:"icon-xx", text:"", onClick:function(){}}
     * @author hefeng(2015/12/17)
     */
    function buildViewToolbar(grid, toolbar) {
        var rsId = $(grid).jqGrid('getGridParam', 'rsId');
        var $gridWrap = $(grid).closest('.jgrid-container');
        var $toolbarWrap = $('<div class="col-xs-12 toolbar-container" />');
        _.each(toolbar, function(item, idx){
            if(!Ctx.avail(rsId + '.' + item.name)) {
                console.log("没有表格工具条权限", item.name, rsId + '.' + item.name);
                return;
            }

            var buttonStr = '<button type="button" ';
                buttonStr += 'id="J_toolbar_'+(item.id? item.id:"btn_"+(idx+1))+'" ';
                buttonStr += 'class="btn btn-white btn-info btn-bold"';
                buttonStr += '>';
                buttonStr += '<i class="icon '+item.iconCls+' blue"></i>';
                buttonStr += item.text? item.text:"按钮";
                buttonStr += '</button>';
            var $button = $(buttonStr);

            if(_.isFunction(item.onClick)){
                $button.on('click', function(){
                    item.onClick.call(this, grid, item);
                });
            }

            $button.appendTo($toolbarWrap);
        });
        $gridWrap.before($toolbarWrap);
    }

    /**
     * 生成表格提示信息 by hefeng(2015/12/31)
     * @grid Table object
     * @helpers String||Array
     */
    function buildHelpers(grid, helpers){
        var $grid = $(grid);
        var $uiGrid = $grid.closest('.ui-jqgrid');
        var $uiGridPager = $uiGrid.find('.ui-jqgrid-pager');
        var helpersTpl = "";

        if(helpers.info){
            helpersTpl += '<div class="ui-jqgrid-helpers">';
            if(_.isString(helpers.info)){
                helpersTpl += '<div class="alert alert-block alert-info"><i class="icon icon-info-sign blue"></i> '+helpers.info+'</div>';
            } else if(_.isArray(helpers.info)) {
                //处理数组
                helpersTpl += '<ol class="alert alert-block alert-info">';
                _.each(helpers.info, function(v){
                    helpersTpl += '<li>'+v+'</li>';
                });
                helpersTpl += '</ol>';
            }
            helpersTpl += '</div>';
        }
        $uiGridPager.after(helpersTpl);
    }

    function addStatLine (grid, data) {
        var $grid = $(grid), gridResp = data[0];
        var stats = $grid.jqGrid('getGridParam').stats||{};

        var $uiGrid = $grid.closest('.ui-jqgrid');
        var $toppager = $uiGrid.find('.ui-jqgrid-toppager');

        // 只需在当前jqgrid里面找到'.totalInfo',再将其移除
        $toppager.parent().find('.totalInfo').remove();

        if(!_.isEmpty(stats) && gridResp){
            var statData = gridResp.statDataMap;
            var $statLine = $('<div class="totalInfo"></div>');

            /**
             * 格式化汇总信息
             * { labelConfig:{}, items:[], formatter:function(){} }
             */
            stats.formatter && stats.formatter(stats, statData);

            _.each(stats.items,function (item) {
                //如果配置的统计项，在 ignoreFields 里面，就返回
                if(_.contains(gridResp.ignoreFields, item.name)) {
                    return; //continue each
                }

                var value = statData[item.name];
                var type = item.type || 'currency';
                var statLabel = $.isFunction(item.label) ? item.label(item.name) : stats.labelConfig[item.name];
                var statValue = $.isFunction(item.value) ? item.value(value) : formatStatVal(value,type);

                var statHtml = [
                    '<div class="stat">',
                        '<span class="statLabel">'+ statLabel +':</span>',
                        '<span class="statValue">'+ statValue +'</span>',
                    '</div>'
                ].join('');
                value != null && $statLine.append(statHtml);
            });
            
            $toppager.after($statLine);
        }

        function formatStatVal (value,type){
            var valueConfig = {
                currency:{prefix:'￥', postfix:''},
                count:{prefix:'', postfix:'笔'},
                percent:{prefix:'', postfix:'%'},
                onlyNum:{prefix:'', postfix:''}
            };
            return valueConfig[type].prefix + Opf.currencyFormatter(value) + valueConfig[type].postfix;
        }
    }

    function customPagerStyle (grid) {
        //移除默认上方的分页栏按钮s
        var $grid = $(grid);//对应数据部分<table>
        var $uiGrid = $grid.closest('.ui-jqgrid');
        var $toppager = $uiGrid.find('.ui-jqgrid-toppager');

        //上方分页栏清空
        $toppager.find('td:not(:last)').empty();


        var $rtTd = $toppager.find('td:last');//.css({float:'right'});
        var $ltTd = $toppager.find('td:first');

        //先把把顶部的中间部分隐藏，便于小屏看到右上方按钮
        $toppager.find('td:eq(1)').hide();

        //左下方按钮放到右上方
        $uiGrid.find('.ui-pg-table.navtable').css({'float':'none'}).appendTo($ltTd);

        var $selBox = $uiGrid.find('.ui-pg-selbox');
        $rtTd.css({
            color: '#FFF'
        }).append($selBox);
        $selBox.before('显示 ');
        $selBox.after(' 条记录');
        // $selBox.prev('显示');
        // $selBox.after('显示');
        // $ltTd.append($.jgrid.format($grid[0].p.rowlisttext,tmpWrap.html()));

    }

    function applyPermissionToNavAction (actions, options) {
        //默认潜规则，如果需要再支持在nav配置rsId
        var rsId = options.rsId;
        // var map = {
        //  add: 'btn.add',
        //  del: 'btn.del',
        //  edit: 'btn.edit',
        //  view: 'btn.view',
        //  search: 'btn.search',
        //  refresh: 'btn.refresh'
        // };
        var map = {
            add: 'add',
            del: 'del',
            edit: 'edit',
            view: 'view',
            search: 'search',
            refresh: 'refresh'
        };
        var available, fullRsId;
        _.each(map, function (postfix, key) {
            fullRsId = rsId + '.' + postfix;
            available = Ctx.avail(fullRsId);

            if(!available) {
                console.log('没有表格按钮权限', key, fullRsId);
            }

            //如果创建grid的时候配置了false，那么即便有权限也不要去管
            if(actions[key] !== false) {
                actions[key] = available;
            }
        });
    }

    function assembleActionOptinon (defaultOptions, options, url) {
        //muse be an copy
        var opt = url ? {url:url} : {};

        $.extend(opt, defaultOptions, options || {});

        //apply the pre interceptors
        var pres = defaultOptions._pre;
        pres && _.each(pres, function(fun, name) {
            if (opt[name]) {
                //createInterceptor(org, new) ==> new()!==false && org();
                opt[name] = Opf.Function.createInterceptor(opt[name], pres[name]);
            }else {
                opt[name] = pres[name];
            }
        });

        //apply the post interceptors
        var posts = defaultOptions._post;
        posts && _.each(posts, function(fun, name) {
            if (opt[name]) {
                opt[name] = Opf.Function.createInterceptor(posts[name], opt[name]);
            }else {
                opt[name] = posts[name];
            }
        });

        return opt;
    }

    function styleDeleteForm(form) {
        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove(); //ui-icon, s-icon
        buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
        buttons.eq(1).prepend('<i class="icon-remove"></i>');
    }

    //it causes some flicker when reloading or navigating grid
    //it may be possible to have some custom formatter to do this as the grid is being created to prevent this
    //or go back to default browser checkbox styles for the grid
    function styleCheckbox(table) {

        $(table).find('input:checkbox').addClass('ace')
            .wrap('<label />')
            .after('<span class="lbl align-top" />');

        $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
            .find('input.cbox[type=checkbox]').addClass('ace')
            .wrap('<label />').after('<span class="lbl align-top" />');

    }

    //unlike navButtons icons, action icons in rows seem to be hard-coded
    //you can change them like this in here if you want
    function updateActionIcons(table) {
        var replacement = {
            'ui-icon-pencil': 'icon-pencil blue',
            'ui-icon-trash': 'icon-trash red',
            'ui-icon-disk': 'icon-ok green',
            'ui-icon-cancel': 'icon-remove red'
        };
        $(table).find('.ui-pg-div span.ui-icon').each(function() {
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
            if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
        });
    }

    //replace icons with FontAwesome icons like above
    function updatePagerIcons(table) {
        var replacement = {
            'ui-icon-seek-first': 'icon-double-angle-left bigger-140',
            'ui-icon-seek-prev': 'icon-angle-left bigger-140',
            'ui-icon-seek-next': 'icon-angle-right bigger-140',
            'ui-icon-seek-end': 'icon-double-angle-right bigger-140'
        };
        $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function() {
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

            if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
        });
    }

    function enableTooltips(table) {
        $('.navtable .ui-pg-button').tooltip({
            container: 'body'
        });
        $(table).find('.ui-pg-div').tooltip({
            container: 'body'
        });
    }

    function styleSearchFilters(form) {
        form.find('.delete-rule').val('X');
        form.find('.add-rule').addClass('btn btn-xs btn-primary');
        form.find('.add-group').addClass('btn btn-xs btn-success');
        form.find('.delete-group').addClass('btn btn-xs btn-danger');
    }

    function styleSearchForm(form) {
        var dialog = form.closest('.ui-jqdialog');
        var buttons = dialog.find('.EditTable');
        buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
        buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
        buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
    }

    //style the popup form when click edit/add/del/...
    function baseStyleForm(form) {
        form = $(form);
        var $dialog = form.closest('.ui-jqdialog');
        $dialog.find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
    }

    //保证表单窗口宽高不要超过浏览器
    function constrainDialogSize (el) {
        var $dialog = $(el).closest('.ui-jqdialog');
        var dialogH = $dialog.outerHeight(),
            windowH = $(window).height();

        if(dialogH > windowH) {
            $dialog.outerHeight(windowH);
            return true;
        }

        return false;
    }

    function styleViewForm (form) {
        baseStyleForm(form);

        // constrainDialogSize(form);
        alignCenterDialog(form);

        //有的按钮（如 view）没有afterShowForm事件，所以统一用setTimeout模拟
        setTimeout(function () {
            Opf.Grid.populateBodyHeight(form);
        }, 1);
    }

    function styleEditForm (form) {
        baseStyleForm(form);

        styleFormBottomBtns(form);

        // constrainDialogSize(form);
        alignCenterDialog(form);

        // if(populateHeight) {

            var $dialog = form.closest('.ui-jqdialog');
            //让底部按钮一直保持在最下面
            //wrap一个div.ui-jqdialog-content目的是用上原来的样式
            //如果class跟内部逻辑有冲突就重新写样式
            var $bottomBtn = form.next('table.EditTable');
            $('<div class="ui-jqdialog-content bottom-btns"></div>')//
            .append($bottomBtn)//
            .css({
                position: 'absolute',
                bottom: 0,
                width: '100%'
            }).appendTo($dialog);

            setTimeout(function () {
                Opf.Grid.populateBodyHeight(form);
            }, 1);
        // }
    }

    //align the pop form center center  when click edit/add/del/...
    function alignCenterDialog(form) {
        var dialog = $(form).closest('div.ui-jqdialog');
        setTimeout(function () {
            // Opf.Util.positionFixed(dialog);
            $(dialog).position({
                my: 'center center',
                at: 'center center',
                of: window,
                collision: 'flipfit'
            });

        }, 10);
    }

    //from ace.js
    function styleFormBottomBtns(form) {
        //enable datepicker on "sdate" field and switches for "stock" field
        // form.find('input[name=sdate]').datepicker({
        //  format: 'yyyy-mm-dd',
        //  autoclose: true
        // })
        //.end().find('input[name=stock]')
        //.addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

        //update buttons classes
        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove(); //ui-icon, s-icon
        buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
        buttons.eq(1).prepend('<i class="icon-remove"></i>');

        buttons = form.next().find('.navButton a');
        buttons.find('.ui-icon').remove();
        buttons.eq(0).append('<i class="icon-chevron-left"></i>');
        buttons.eq(1).append('<i class="icon-chevron-right"></i>');
    }

    function populateResponsive (t, lastMdName, newMdName) {

    }

    function populateResponsiveColVisibility(grid, options, lastMdName, newMdName) {
        showHideResponsiveCol(grid, options, lastMdName, newMdName);

        if('top' === Opf.get(options, 'nav.position')) {
                respBottomLayoutWhenTopNav(grid, options, lastMdName, newMdName);
        }else {
                respBottomLayoutWhenBottomNav(grid, options, lastMdName, newMdName);
        }
    }

    function showHideResponsiveCol(grid, options, lastMdName, newMdName) {

        var respOptions = options.responsiveOptions;
        if(!respOptions || !respOptions.hidden) return;

        grid = $(grid);
        respOptions = respOptions.hidden || {};

        //if never response before, then last hidden is empty
        var lastHiddenList = lastMdName ? (respOptions[lastMdName] || []) : [];
        var newHiddenList = respOptions[newMdName] || [];

        //这里有个假设前提：较小屏幕，如xs 包含 较大，如sm 所有配置列
        var toggleMethod = newHiddenList.length > lastHiddenList.length ? 'hideCol' : 'showCol';

        var tmp = [newHiddenList, lastHiddenList];
        if (newHiddenList.length < lastHiddenList.length) {
            tmp = [tmp[1], tmp[0]];
        }

        var diffs = _.difference(tmp[0], tmp[1]);

        var ignoreFields = grid.data('ignoreFields') || [];

        _.each(diffs, function(val) {

            // 如果val在ignoreFields需要忽略的列表中，则不予处理。
            if (_.contains(ignoreFields, val)) {
                return;
            }
            grid[toggleMethod].call(grid, val);
        });

        grid.data('mediaName', newMdName);
    }

    function respBottomLayoutWhenBottomNav (grid, options, lastMdName, newMdName) {
        // console.log(grid.attr('id') + ' bottom ' + ' line ');

        var respOptions = options.responsiveOptions;

        if(!respOptions) {
            return;
        }

        var pagerTbody = $(grid).closest('.ui-jqgrid').find('.ui-jqgrid-pager').find('tbody:first');

        //切换到ss
        if(newMdName === Opf.Media.SS) {
            var $orgTr = pagerTbody.find('>tr:first');
            $orgTr.find('>td:last').hide();
            $orgTr.find('.ui-paging-info').css('text-align', 'center');
            var $btnsPart = pagerTbody.find('>tr>td:eq(1)');
            $btnsPart.attr('align', 'center').css('text-align', '');
            $('<tr class="hack"></tr>').append($btnsPart).insertAfter($orgTr);
        }
        // //离开ss
        else if(lastMdName === Opf.Media.SS) {
            var $orgTr = pagerTbody.find('>tr:first');
            $orgTr.find('>td:last').show();
            $orgTr.find('.ui-paging-info').css('text-align', 'left');
            var $hackTr = pagerTbody.find('tr.hack');
            var $btnsPart = $hackTr.find('>td:first');
            $btnsPart.insertAfter($orgTr.find('td:first'));
            $hackTr.remove();
        }

        if(newMdName === Opf.Media.XS) {
            pagerTbody.find('>tr>td:last').hide();
            pagerTbody.find('>tr>td:eq(1)').attr('align', 'right').css('text-align', '');
        }else if(lastMdName === Opf.Media.XS){
            pagerTbody.find('>tr>td:last').show();
            pagerTbody.find('>tr>td:eq(1)').css('text-align', 'center');
        }

        pagerTbody.closest('.ui-jqgrid-pager').height(pagerTbody.height());

        /*var pagerTbody = $(grid).closest('.ui-jqgrid').find('.ui-pager-control:first tbody:first');

        //this time in [ss, xs]
        if(Opf.Media.range(newMdName, 'ss', 'xs')) {

            //last time not in [ss, xs]
            if(!Opf.Media.range(lastMdName, 'ss', 'xs')) {
                console.log('to bottom 2 line');
                //把中间的分页按钮放到下一行
                var pagerTds = pagerTbody.find('>tr>td:eq(1)');
                $('<tr></tr>').append(pagerTds).appendTo(pagerTbody);
            }

        }else {
            // console.log('to bottom 1 line');
            //把中间分页按钮放回上一行中间位置
            var secTr = pagerTbody.find('>tr:eq(1)');
            if(secTr.length) {
                secTr.find('>td').insertAfter(pagerTbody.find('>tr:first').find('>td:first'));
                secTr.remove();
            }
        }

        pagerTbody.closest('.ui-jqgrid-pager').height(pagerTbody.height());*/
    }

    //@deprecated
    function respBottomLayoutWhenTopNav (grid, options, lastMdName, newMdName, type) {
        console.log(grid.attr('id') + ' bottom ' + type + ' line ');

        var respOptions = options.responsiveOptions;

        if(!respOptions) {
            return;
        }

        var pagerTbody = $(grid).closest('.ui-jqgrid').find('.ui-pager-control:last tbody:first');

        //this time in [ss, xs]
        if(Opf.Media.le(newMdName, 'xs')) {//<=

            if(!lastMdName || Opf.Media.gt(lastMdName, 'xs')) {//>
                //把分页按钮前面的td隐藏
                //把分页按钮td内容左对齐
                pagerTbody.find('>tr>td:first').hide();
                pagerTbody.find('>tr>td:eq(1)').css('text-align', 'left');
            }

        }else {
                pagerTbody.find('>tr>td:first').show();
                pagerTbody.find('>tr>td:eq(1)').css('text-align', 'center');
        }

        pagerTbody.closest('.ui-jqgrid-pager').height(pagerTbody.height());

    }

    var $Body = $('body');

    function closeDialogEvent() {
        $Body.removeClass('fixed-body');
        $(window).trigger('resize.grid.autosize');
    }

    return {
        /**
         * 创建jqGrid
         * @memberof App.Factory
         * @param {Object} options - jqGrid配置参数
         * @prop {object} options.quickSearch - 详见{@link createJqGrid.options}
         * @returns {jQuery} jqGrid对象
         * @see http://www.trirand.com/jqgridwiki/doku.php
         */
        createJqGrid: function(options) {
            //>>>DEBUG
            checkArgs(options);
            //<<<DEBUG

            adaptOptions(options);

            var opt = $.extend(true, {}, defaultGridOptions, options);

            var grid = buildGrid(assembleActionOptinon(default_grid_options, opt));

            attachEvents(grid, options);

            if(opt.nav !== false)
                buildToolbar(grid, opt);

            if(opt.quickSearch && Ctx.avail(opt.rsId + '.quickSearch'))
                addQuickSearch(grid, opt.quickSearch);

            if(opt.tableCenterTitle) {
                addTableCenterTitle(grid, opt.tableCenterTitle);
            }

            if(opt.toolbar && _.isArray(opt.toolbar)){
                buildViewToolbar(grid, opt.toolbar);
            }

            //生成表格操作提示信息，帮助用户使用高级功能
            if(opt.helpers && _.isObject(opt.helpers)){
                buildHelpers(grid, opt.helpers);
            }

            return grid;
        }
    }
});