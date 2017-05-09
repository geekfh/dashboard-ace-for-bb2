/**
 * cover default config
 *
 * should load after jqgrid.js
 */

define(['jquery.jqGrid.origin'], function() {

    var _navGrid = $.fn.jqGrid.navGrid;
    var _setRowData = $.fn.jqGrid.setRowData;
    
    $.jgrid.extend({
        navGrid: function (elem, o, pEdit,pAdd,pDel,pSearch, pView) {
            this[0].p.nav = {
                actions: o,
                edit: pEdit,
                add: pAdd,
                del: pDel,
                search: pSearch,
                view: pView
            };
            _navGrid.apply(this, arguments);
        },

        setRowData: function (rowid, data, cssp) {
        	var success;
        	if(success = _setRowData.apply(this, arguments)) {
        		$(this.getGridRowById(rowid)).data('record', data);
        	}
        	return success;
        },

        //jqgrid不支持获取原生数据，在工厂中每次插入数据后都把原生数据挂到dom上，所以这里可以取出
        _getRecordByRowId: function (rowId) {
        	return $(this.getGridRowById(rowId)).data('record');
        },

        _getSelRecord: function () {
            return $(this)._getRecordByRowId($(this).jqGrid('getGridParam', 'selrow'));
        }
    });
    
	/*|-------------------------------
    	| cover jqgrid defaut config
    	|-------------------------------*/
    $.extend(true, $.jgrid, {
        defaults: {
            rowlisttext: '显示 {0} 条记录',//自定义

            recordpos: 'left',

            altRows: true, //奇偶行高亮

            rowNum: 10,
            //toppager: true,
            rowList: [10, 20, 30],

            multiselect: false,
            //WARN: multikey lead a bug
            // multikey: "ctrlKey",
            multiboxonly: true,//是否只通过checkbox选中
            autowidth: true,

            viewrecords: true,//显示总数

            prmNames: {
                page: 'number', //当前第几页
                rows: 'size' //每页显示行数
            },

            jsonReader: {
                root: 'content', //默认响应数据中，记录数据的入口字段

                page: "number", //当前第几页
                total: "totalPages", //总页数
                records: "totalElements" //总条数
            }
        },
        edit : {
            bSubmiting: "正在提交",
            top: -9999,
            left: -9999
        },
        add : {
            top: -9999,
            left: -9999
        },
        search : {
            top: -9999,
            left: -9999
        },
        view : {
            top: -9999,
            left: -9999
        },
        del : {
            top: -9999,
            left: -9999
        }
    });

    $.extend($.jqm.params, {
        closeoverlay : false//配置false之后点击弹出表单背后的蒙板不会关闭表单
    });

	/*|----------------------------------------------
		| cover default config form jquery.ajax
		|----------------------------------------------*/
	$.extend(true, $.jgrid.ajaxOptions, {

		contentType: 'application/json', //默认请求头`Content-Type` 为 'application/json'
        autoMsg: true //如果后台抛错则弹出错误信息 {success:false, msg:"xxxx"}
	});


	/**|--------------------------------------------
	 * |formater
	 * |--------------------------------------------*/
	$.fn.fmatter.map = function (cellval, opts) {
		var op = $.extend({}, opts.map);

		if(!(opts.colModel.formatoptions && opts.colModel.formatoptions.map)) {
			console.err('u must config `formatoptions:{map:xx}` when use `map` formmatter');
		}

		if(opts.colModel !== undefined && opts.colModel.formatoptions !== undefined) {
			op = $.extend({},op,opts.colModel.formatoptions);
		}
		if($.fmatter.isEmpty(cellval)) {
			return op.defaultValue;
		}
		return op.map[cellval];
	};





});