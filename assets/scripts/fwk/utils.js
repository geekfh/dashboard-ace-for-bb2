define(['spin', 'assets/scripts/fwk/Opf', 'i18n!assets/scripts/fwk/nls/base', 'assets/scripts/fwk/function', 'jquery'], function(Spinner, Opf, lang, FuncUtils, $) {

    var $body = $(document.body);

    /**
     * configurations:
     * @param  {Array/Object} data array of nodes Or single Node object
     * @param  {String/Function} parentChecker name of property represent children node list
     * Or function (node)
     * @param  {Functcion} nodeCb function (bool_isParent, data_node, collection), if the callback
     * is invoke for parent node and return sth. non-null, then it may be the new collection used in the sub node callbacks
     * @param  {Functcion} parentNodeCb function (data_node, collection), if the callback
     * return sth. non-null, then it may be the new collection used in the sub node callbacks
     * @param  {Functcion} childNodeCb function (data_node, collection)
     * @param  {Mixed} collection optinal anything you can use in the callback, usually [] or {}888
     * @param {Int} deep the recursively deep level, default -1 means unlimited, if u want the walk
     * a parent node and its direct child only, then assign `deep` as `1`, sb may assign `0`
     */
    //data, parentChecker, parentNodeCb, childNodeCb, collection
    Opf.walkTree = function(data, options) {
        var opt = options;

        parentCheckerCopy = opt.parentChecker || 'isLeaf',
        //default checker is whether existed property `isLeaf`
        parentChecker = !parentCheckerCopy ? 'isLeaf' :
            _.isString(parentCheckerCopy) ? function(node) {
                return !!node[parentCheckerCopy];
        } : parentCheckerCopy;

        nodeCb = opt.nodeCb,
        parentNodeCb = opt.parentNodeCb,
        childNodeCb = opt.childNodeCb,
        collection = opt.collection,
        wantToDeepLevel = opt.deep;

        var deep = 1;

        var isChildList = $.isArray(data);

        function handleNode(node) {

            var isLeaf = !parentChecker(node);

            if (isLeaf) {
                nodeCb && nodeCb(false, node, collection);
                childNodeCb && childNodeCb(node, collection);

            } else {
                var newCollection, tmp;
                nodeCb && (newCollection = nodeCb(true, node, collection));
                parentNodeCb && (tmp = parentNodeCb(node, collection));
                newCollection = tmp || newCollection;

                //recusively walk deeper
                if (deep >= wantToDeepLevel) {
                    return;
                }

                deep++;
                walkTree(node, {
                    parentChecker: parentChecker,
                    nodeCb: nodeCb,
                    parentNodeCb: parentNodeCb,
                    childNodeCb: childNodeCb,
                    collection: newCollection || collection
                });
                deep--;
            }
        } //ef handleNode

        if (isChildList) {
            _.each(data, function(node) {
                handleNode(node);
            });
        } else {
            handleNode(data);
        }
    };

    /**|--------------------------------------------
     * |@string
     * 1.var beautyNum = Opf.String.beautyWithSeparator(6227000784020797363,'-');
     *   var _beautyNum = Opf.String.beautyWithSeparator('6227000784020797363','-');
     *   var xbeautyNum = Opf.String.beautyWithSeparator('6227000784020797363','-',6);
     *   ==> beautyNum = '6227-0007-8402-0797-363'
     *       _beautyNum = '6227-0007-8402-0797-363'
     *       xbeautyNum = '622700-078402-079736-3'
     * 2.var _beautyIdNo = Opf.Stirng.beautyIdNo('45010219840721789x','-');
     *   ==> _beautyNum = '450102-1984-0721-789x'
     * 3.var _beautyBankCardNo = Opf.Stirng.beautyBankCardNo('6227000784020797363','-');
     *   ==> _beautyNum = '6227-0007-8402-0797-363'
     * |--------------------------------------------*/

    var PURE_YM_REG = /(\d{4})(\d{2})/;
    var PURE_YMD_REG = /(\d{4})(\d{2})(\d{2})/;
    var PURE_TIME_REG = /(\d{2})(\d{2})(\d{2})/;
    var PURE_FULL_DATE = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    var REPLACE_REG = {
        YYYY: /YYYY/g, MM: /MM/g, M: /M/g, DD: /DD/g, D: /D/g,
        HH: /HH/g, H: /H/g, mm: /mm/g, m: /m/g, ss: /ss/g, s: /s/g
    };

    Opf.String = {
        beautyWithSeparator: function (input, separator, everyN){
            if(!input){
                return '';
            }
            var _everyN, _input, _separator, reg, output;

            _everyN = everyN ? everyN : 4;
            _separator = separator ? separator : ' ';
            _input = input.toString();
            reg = new RegExp('(.{'+ _everyN +'})','g');
            output = _input.replace(reg,'$1'+ _separator);

            if(_input.length % _everyN == 0){
                return output.slice(0,output.length-1);
            }else{
                return output;
            }
        },

        beautyIdNo : function (input,separator) {
            if(!input){
                return '';
            }
            var _input = input.toString();
            var _separator = separator ? separator : ' ';
            return _input.replace(/(\d{6})(\d{4})(\d{4})/,'$1'+_separator+'$2'+_separator+'$3'+_separator);
        },

        beautyBankCardNo : function (input, separator) {
            var _separator = separator ? separator : ' ';
            return this.beautyWithSeparator(input, _separator);
        },

        substitute: function(str, object, regexp){
            return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
                if (match.charAt(0) == '\\') return match.slice(1);
                return (object[name] != null) ? object[name] : '';
            });
        },

        /**
         * _.format("hello {0}, {1}", "peter", "huxiang1")
         * //return "hello peter, huxiagn1"
         */
        format : function(format){ //jqgformat
            var args = $.makeArray(arguments).slice(1);
            if(format==void 0) { format = ""; }
            return format.replace(/\{(\d+)\}/g, function(m, i){
                return args[i];
            });
        },

        getLastChar: function (str) {
            var ret = '';
            if(str && str.length > 1) {
                ret = str.charAt(str.length - 1);
            }
            return ret;
        },

        confirmFullStop: function (str) {
            var trimStr = $.trim(str), lastChar;
            if(trimStr) {
                lastChar = this.getLastChar(trimStr);
                if(lastChar === '.' || lastChar === '。') {
                    return trimStr;
                }else {
                    return trimStr + '。';
                }
            }
            return trimStr;
        },

        /**
         * Opf.String.replaceYMD('201506', '$1年$2月');//2015年06月
         * Opf.String.replaceYMD('201506', 'YYYY年MM月');//2015年06月
         * Opf.String.replaceYMD('201506', 'YYYY年M月');//2015年6月
         */
        replaceYM: function (input, strWith) {
            var output = '';
            if(/\$\d/.test(strWith)) {
                output = input.replace(PURE_YM_REG, strWith);

            }else if(/[YM]/.test(strWith)){

                var fullY, fullM;
                var result = PURE_YM_REG.exec(input);

                if(result) {
                    fullY = result[1];   
                    fullM = result[2];  

                    output = strWith.replace(REPLACE_REG.YYYY, fullY)//
                            .replace(REPLACE_REG.MM, fullM)//
                            .replace(REPLACE_REG.M, parseInt(fullM, 10));
                }

            }
            return output;
        },

        /**
         * Opf.String.replaceYMD('20150602', '$1年$2月$3日');//2015年06月02日
         * Opf.String.replaceYMD('20150602', 'YYYY年MM月DD日');//2015年06月02日
         * Opf.String.replaceYMD('20150602', 'YYYY年M月D日');//2015年6月2日
         */
        replaceYMD: function (input, strWith) {
            var output = '';
            if(/\$\d/.test(strWith)) {
                output = input.replace(PURE_YMD_REG, strWith);

            }else if(/[YMD]/.test(strWith)){

                var fullY, fullM, fullD;
                var result = PURE_YMD_REG.exec(input);

                if(result) {
                    fullY = result[1];   
                    fullM = result[2];   
                    fullD = result[3];   

                    output = strWith.replace(REPLACE_REG.YYYY, fullY)//
                            .replace(REPLACE_REG.MM, fullM)//
                            .replace(REPLACE_REG.DD, fullD)//

                            .replace(REPLACE_REG.M, parseInt(fullM, 10))//
                            .replace(REPLACE_REG.D, parseInt(fullD, 10));
                }

            }
            return output;
        },

        /**
         * Opf.String.replaceHms('150602', '$1时$2分$3秒');//15时06分02秒
         * Opf.String.replaceHms('150602', 'HH时mm分dd秒');//15时06分02秒
         * Opf.String.replaceHms('150602', 'HH时m分d秒');//15时6分2秒
         */
        replaceHms: function (input, strWith) {
            var output = '';
            if(/\$\d/.test(strWith)) {
                output = input.replace(PURE_TIME_REG, strWith);

            }else if(/[Hms]/.test(strWith)){

                var fullH, fullMin, fullSec;
                var result = PURE_TIME_REG.exec(input);

                if(result) {
                    fullH = result[1]; fullMin = result[2]; fullSec = result[3];   

                    output = strWith.replace(REPLACE_REG.HH, fullH)//
                            .replace(REPLACE_REG.mm, fullMin)//
                            .replace(REPLACE_REG.ss, fullSec)//
                            .replace(REPLACE_REG.m, parseInt(fullMin, 10))//
                            .replace(REPLACE_REG.s, parseInt(fullSec, 10));
                }
            }
            return output;
        },

        /**
         *
         * Opf.String.replaceFullDate('20150612130102', '$1年$2月$3日$4时$5分$6秒');//2015年06月12日13时01分02秒
         * 其他类似上面两个方法
         * 
         */
        replaceFullDate: function (input, strWith) {
            if(!input){
                return '';
            }
            var output = '';
            if(/\$\d/.test(strWith)) {
                output = input.replace(PURE_FULL_DATE, strWith);

            }else if(/[YMDHms]/.test(strWith)){

                var fullY, fullMon, fullD, fullH, fullMin, fullSec;
                var result = PURE_FULL_DATE.exec(input);

                if(result) {
                    fullY = result[1];   
                    fullMon = result[2];   
                    fullD = result[3]; 
                    fullH = result[4];   
                    fullMin = result[5];   
                    fullSec = result[6];     
                    
                    output = strWith.replace(REPLACE_REG.YYYY, fullY)//
                            .replace(REPLACE_REG.MM, fullMon)//
                            .replace(REPLACE_REG.DD, fullD)//

                            .replace(REPLACE_REG.M, parseInt(fullMon, 10))//
                            .replace(REPLACE_REG.D, parseInt(fullD, 10))//

                            .replace(REPLACE_REG.HH, fullH)//
                            .replace(REPLACE_REG.mm, fullMin)//
                            .replace(REPLACE_REG.ss, fullSec)//

                            .replace(REPLACE_REG.m, parseInt(fullMin, 10))//
                            .replace(REPLACE_REG.s, parseInt(fullSec, 10));
                }

            }
            return output;
        },

        // 外部调用为 Opf.String.trim('xxxxx'), 清除前后空格
        trim: function (str) {
            return str.replace(/^\s*(.*?)\s*$/, '$1');
        },
        //修改前修改后用的
        replaceWordWrap: function (str) {
            if(str == null || str == ''){
                return '';
            }
            else{
                var rp = new RegExp(",", "g");
                var new_str = str.replace(rp, ',\r\n').replace('{', '{\r\n').replace('}', '\r\n}');
                return new_str;
            }
        },
        //审核标签用的
        replaceWordWrapByHtml: function (str) {
            if(str == null || str == ''){
                return '';
            }
            else{
                var rp = new RegExp("\n", "g");
                var new_str = str.replace(rp, '<br>');
                return new_str;
            }
        },
        
        //手机号加密
        phoneFormat: function(str){
            if(str == null || str == ''){
                return str;
            }
            else{
                var reg = /^(\d{3})\d+(\d{4})$/;
                return str.replace(reg, "$1****$2") || str;
            }
        }
     };

    /**|--------------------------------------------
     * |@UI
     * |--------------------------------------------*/

     var FIXED_INDEX = 0; // fixed-body 标识
     Opf.UI = {
        /**
         * 设置进度条
         * 参数类似 setLoading 的调用方法
         * 差别在于第三个参数，传入对象：{}, 其中属性功能如下
         * {
         *     title: // 当前进度条所表示的任务名称，默认“提交中, 请稍后...”
         *     totalTime: // 完成进度的总时间，单位为毫秒，默认 5000
         * }
         * */
        setProgress: function (el, toggle, options) {
            options = options || {};
            var percent = 0, $el;
            var totalTime = options.totalTime || 5000;
            var title = options.title || '提交中, 请稍后...';

            if(arguments.length === 0 || arguments[0] === void 0) {
                el = true;
            }
            if(el === true || el === false) {
                $el = $('#page-body');
                toggle = el;
            }else {
                $el = $(el.el || el);
            }
            if(!$el.length) {
                $el = $(document.body);
            }

            if(toggle !== false){
                var progressTpl = [
                    '<div class="progress-wrap">',
                        '<div class="progress-title">'+ title +'</div>',
                        '<div class="progress progress-striped" data-percent="0%">',
                            '<div class="progress-bar progress-bar-blue"></div>',
                        '</div>',
                    '</div>'
                ].join('');

                var $progressWrap = $(progressTpl);

                $el.append('<div class="progress-overlay"></div>');
                $el.append($progressWrap);

                var intervaler = setInterval(function () {
                    percent ++;
                    $progressWrap.find('.progress').attr('data-percent', percent + '%');
                    $progressWrap.find('.progress-bar').css('width', percent + '%');

                    if(percent == 99){
                        clearInterval(intervaler);
                    }
                }, parseInt(totalTime/100));

                $progressWrap.data('cacheIntervaler', intervaler);

            }else{
                var $progressOverlay = $el.find('.progress-overlay');
                var $progressWrap = $el.find('.progress-wrap');

                if($progressWrap.length){
                    clearInterval($progressWrap.data('cacheIntervaler'));
                    percent = 100;
                    $progressWrap.find('.progress').attr('data-percent', percent + '%');
                    $progressWrap.find('.progress-bar').css('width', percent + '%');

                    var timer = setTimeout(function () {
                        $progressOverlay.remove();
                        $progressWrap.remove();
                        clearTimeout(timer);
                    },1000);
                }
            }

        },

        isBodyFixed: function () {
            return $body.hasClass('fixed-body');
        },

        /**
         * 通过标识来判断是否加上或删除 'fixed-body'
         * */
        fixedBody: function (toggle) {
            toggle = toggle === false ? false : true;

            if(toggle){
                // 当前标识为 0 时，就加上 'fixed-body'
                if(FIXED_INDEX === 0) {
                    $body.addClass('fixed-body');
                }
                FIXED_INDEX ++;
            }else{
                // 当前标识为 1 时，就删除 'fixed-body'
                if(FIXED_INDEX === 1){
                    $body.removeClass('fixed-body');
                }
                FIXED_INDEX > 0 && FIXED_INDEX --;
            }
        },

        //执行旋转方法
        roate90 : function (el, degree) {
            degree = parseInt(degree, 10);

            var $el = $(el);
            var curCls = $el.attr('class');

            var oldDegree = 0, 
                newDegree,
                roatingRegReplace = /rotating-(\w)/;

            var matchRet = curCls.match(roatingRegReplace);
            if(matchRet) {//原来已经加上了旋转样式
                //取出当前的旋转级数，叠加上degree
                oldDegree = parseInt(matchRet[1], 10);
                newDegree = (oldDegree + degree + 4) % 4 ;
                newCls = curCls.replace(matchRet[0], '') + ('rotating-'+newDegree);//改成设置元素的class属性
                $el.attr('class',newCls);

            }else {//原来没加上旋转样式
                newDegree = (degree + 4) % 4 ;
                $el.addClass('rotating-' + newDegree);
            }
        },

        busyText: function ($btn, busy, text) {
            $btn.each(function () {
                //TODO li18n
                if(busy!==false) {
                    $(this).addClass('disabled').data('html', $btn.html()).html(text || '正在提交...');
                }else {
                    $(this).removeClass('disabled').html($btn.data('html'));
                }
            });
        },

        ajaxBusyText: function ($btn, text) {
            this.busyText($btn, true, text);
            $( document ).one('ajaxStop', function() {
                Opf.UI.busyText($btn, false);
            });
        },

        /**
         * 大部分使用setLoading的场景都是ajax请求前后设置蒙板，所以全局上监听ajax结束自动去掉蒙板
         * 当ajax场景下直接用ajaxLoading，免去请求完成后手动去掉蒙板的操作
         * 
         * 设置蒙板的实现依赖 setLoading
         */
        ajaxLoading: function (el, toggle, options) {
            if(toggle !== false) {
                var $el = this.setLoading(el, toggle, options);
                $( document ).one('ajaxStop', function() {
                    Opf.UI.setLoading($el, false);
                });
            }
        },

        /**
         * @param {[type]} el      [description]
         * @param {[type]} toggle  [description]
         * @param {[type]} options {text:'xxx'}
         */
        setLoading: function(el, toggle, options) {
            options = options || {};
            var maxTop = 45;
            var orgPosition, cachedPos, 
                text = options.text || '';

            if(arguments.length === 0 || arguments[0] === void 0) {
                el = true;
            }
            if(el === true || el === false) {
                $el = $('#page-body');
                toggle = el;
            }else {
                $el = $(el.el || el);
            }
            if(!$el.length) {
                $el = $(document.body);
            }

            if(toggle !== false) {

                orgPosition = $el.css('position');
                if(orgPosition  !== 'relative' && orgPosition  !== 'absolute' && 
                        orgPosition !=='fixed') {
                    $el.data('opf.cache.position', orgPosition);
                    $el.css('position', 'relative');
                }

                var $tpl = $([
                '<div class="loading-overlay">',
                    '<div class="loading-indicator">',
                        '<span class="loading-icon"></span>',
                        '<span class="loading-text">' + text + '</span>',
                    '</div>',
                '</div>'
                ].join(''));

                $el.append($tpl);

                var $indicator = $tpl.find('.loading-indicator');

                $el.find('.loading-indicator').position({
                    my: 'center center',
                    at: 'center center',
                    of: $el.find('.loading-overlay')
                });

                //TODO 容器内容可能太长导致滚动，loading图标看不到
                //暂时把最大top设为45
                if(parseInt($indicator.css('top'), 10) > maxTop) {
                    $indicator.css('top', maxTop);
                }

            }else {   

                $el.find('.loading-overlay').remove();

                cachedPos = $el.data('opf.cache.position');
                if(cachedPos !== void 0) {
                    $el.css('position', cachedPos);
                }
            }
            return $el;
        },

        unSpin: function(renderTo) {
            $(renderTo).find('.spinner').remove();
        },

        spin: function(renderTo, options) {

            var defaultSpinLength = 120;//TODO 暂时的

            var opts = $.extend({   
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: "#000", // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: "spinner", // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: "30px", // Top position relative to parent in px
                left: "auto" // Left position relative to parent in px
            },options);

            var spinner = new Spinner(opts).spin($('<div class=""></div>'));

            var $ct = renderTo || opts.renderTo || document.body;
            $(spinner.el).css({
                position: 'absolute',
                left: ($ct.width() - /*$(spinner.el).width()*/defaultSpinLength) / 2,
                top: ($ct.height() - /*$(spinner.el).height()*/defaultSpinLength) / 2
            }).appendTo(renderTo || opts.renderTo || document.body);
        }
    };


    /**
     * 1.     var obj = {name : {first : 'Peter'}};
     *        Object.getFromPath (obj, 'name.first')// return 'Peter'
     *        Object.getFromPath (obj, ['name', 'first'])// return 'Peter'
     *
     *  2.    Object.getFromPath('name.first') will return window.name.first
     *
     * @param {Object/String} source
     * @param {String/Array} parts
     */

    Opf.get = function(source, parts) {
        if (typeof source === 'undefined') {
            return null;
        }
        if (arguments.length === 1) {
            return arguments.callee(Opf.global, source);
        } else {
            if (typeof parts === 'string') {
                parts = parts.split('.');
            }

            /**
             * 输出错误提示信息
             */
                try {
                    parts.length;
                } catch(e) {
                    console.log(">>>>Opf.get传入的对象属性有误 ", parts);
                }

            var length = parts.length||0;

            if (length === 0) {
                return source;
            }
            for (var i = 0, l = length; i < l; i++) {
                if (_.has(source, parts[i])) {
                    source = source[parts[i]];
                } else {
                    return null;
                }
            }
            return source;
        }
    };


    // //Takes css classes assigned to each column in the jqGrid colModel
    //                 //and applies them to the associated header.
    //                 function applyClassesToHeaders(grid) {
    //                     // Use the passed in grid as context,
    //                     // in case we have more than one table on the page.
    //                     var trHead = jQuery("thead:first tr", grid.hdiv);
    //                     var colModel = grid.getGridParam("colModel");

    //                     for (var iCol = 0; iCol < colModel.length; iCol++) {
    //                         var columnInfo = colModel[iCol];
    //                         if (columnInfo.classes) {
    //                             var headDiv = jQuery("th:eq(" + iCol + ")", trHead);
    //                             headDiv.addClass(columnInfo.classes);
    //                         }
    //                     }
    //                 }//ed funciont
    //                 applyClassesToHeaders(orgGird);
    /**|--------------------------------------------
     * |#jqgrid
     * |--------------------------------------------*/
    Opf.Grid = {

        navButtonAdd: function (grid, options) {
            var $grid = $(grid);
            var addID = '#' + $grid.attr('id') + '_toppager_left';
            var t = $grid.get(0);
            $grid.navButtonAdd(addID, options);
        },

        availNavButtonAdd: function (grid, options) {
            var rsId = $(grid).get(0).p.rsId;

            if (options.name && Ctx.avail(rsId + '.' + options.name)){
                Opf.Grid.navButtonAdd(grid, options);
            }

        },

        /**
         *  用于add/edit/del 成功后弹出toast框
         *  内容形如  "增加/删除/修改 机构 成功" 
         * @param  {[type]} grid   [description]
         * @param  {[type]} strOpr 'add/edit/del'
         */
        toastSuccess: function (grid, strOpr) {
            var msgTpl = '{0} <strong>' + ($(grid)[0].p.caption || '') + '</strong> {1}';
            var msg =  _.format(msgTpl, lang._(strOpr), lang._('success'));
            Opf.Toast.success(msg);
        },

        alertFail: function (grid, strOpr, msg) {
            var titleTpl =  '{0} <strong>' + ($(grid)[0].p.caption || '') + '</strong> {1}';
            var title = _.format(titleTpl, lang._(strOpr), lang._('fail'));

            Opf.alert({
              title: title,
              message: msg || ''
            });
        },

        appendFieldEl: function(form, el) {
            var $form = $(form);

            var $tbody = $form.find('tbody');


        },

        getSelRowIds: function(grid) {
            return $(grid).jqGrid('getGridParam', 'selarrrow');
        },
        
        getSelRowId: function(grid) {
            return $(grid).jqGrid('getGridParam', 'selrow');
        },

        unSelRows: function(grid, ids) {
            _.each(Opf.Array.from(ids), function(id) {
                this.jqGrid('setSelection', id);
            }, $(grid));
        },

        hasSelRow: function(grid) {
            var ids = this.getSelRowIds(grid);
            return ids && ids.length;
        },

        enableToolBtns: function(grid, actions) {
            this.toggleEnableToolBtns(grid, action, true);
        },

        disableToolBtns: function(grid, actions) {
            this.toggleEnableToolBtns(grid, action, false);
        },

        toggleEnableToolBtns: function(grid, actions, enable) {
            var selectors = _.map(actions, function(action) {
                return '.ui-pg-button[id^=' + action + ']';
            });

            $(grid).closest('.ui-jqgrid').find(selectors.join(',')) //
            [enable ? 'removeClass' : 'addClass']('ui-state-disabled');
        },

        getLastSelRowId: function(grid) {
            return $(grid).jqGrid('getGridParam', 'selrow');
        },

        getLastSelRecord: function (grid) {
            return $(grid)._getRecordByRowId(this.getLastSelRowId(grid));
        },

        populateBodyHeight: function (el) {
            var $dialog = $(el).closest('.ui-jqdialog');

            if($dialog.length) {
                var titleH = $dialog.find('.ui-jqdialog-titlebar').height() || 0;
                var bottomH = $dialog.find('.bottom-btns').height() || 0;
                var bodyH = $dialog.height() - titleH - bottomH;
                $dialog.find('.ui-jqdialog-content:first').height(bodyH).css({
                    'overflow': 'auto'
                });
            }
        }

    };
    Opf.jqGrid = Opf.JqGrid = Opf.Grid;


    Opf.resizeJqGrid = function(grid, ct) {

        grid = $(grid);

        ct = ct ? $(ct) : grid.closest('.jgrid-container');
        //TODO buffer, use ext function xxx fire once during n sec
        setTimeout(function() {

            grid.setGridWidth(ct.width(), true);

        }, 10);
    };

    Opf.setJqGridMaxHeight = function(grid, maxHeight) {
        //TODO util is int
        maxHeight = parseInt(maxHeight, 10);

        if (grid && maxHeight) {
            $(grid).closest('.ui-jqgrid-bdiv').css('max-height', maxHeight);
        }
    };

    Opf.setJqGridMaxWidth = function(grid, maxWidth) {
        //TODO util is int
        maxWidth = parseInt(maxWidth, 10);

        if (grid && maxWidth) {
            $(grid).closest('.jgrid-container').css('max-width', maxWidth);
        }
    };

    /**|--------------------------------------------
     * |@Util
     * |--------------------------------------------*/
    var _uuid = 1;
    var rts = /([?&])_=[^&]*/;
    var ajax_rquery = /\?/;
    var ajax_nonce = jQuery.now();

    Opf.Util = {

        //保证输入框的值都一样,某个输入框值改变，同步所有其他输入框
        autoSyncInputs: function (inputA, inputB) {
            var $inputPackage = $();
            _.each(arguments, function (input) {
                $inputPackage = $inputPackage.add(input);
                $(input).on('input.syncinputs', function (e, extraParam) {
                    if(extraParam && extraParam.ignore === true) {
                        return false;
                    }
                    var value = $(this).val();
                    $inputPackage.not(this).val(value);
                });
            });
        },

        //计算孩子里面zindex最大的
        calcChildMaxZIndex: function (el) {
            var zindex = 0, tmp;
            $(el).children().each(function (index, dom) {
                tmp = parseInt($(dom).css('z-index'), 10);
                if(!isNaN(tmp) && tmp > zindex) {
                    zindex = tmp;
                }
            });
            return zindex;
        },

        /**
         * [walkThrough description]
         * @param  {[type]} target  需要遍历的目标
         * @param  {[type]}   deep     [description]
         * @param  {Function} callback  function (val, key/index, setFn) {} //调用setFn会把值设置到当前位置
         * @return {[type]}            [description]
         */
        walkThrough: function(target, deep, callback) {
            _.each(target, function(val, key) {
                if (deep &&
                    ($.isPlainObject(val) || $.isArray(val))) {
                    Opf.Utils.walkThrough(val, deep, callback);
                } else {
                    var setVal = function(customval) {
                        target[key] = customval;
                    };
                    callback.call(target, val, key, setVal, 'object');
                }
            });
        },

        /**
         * 使用该方法要保证dom都是“可视”，便于获取高度
         * @param  {Object} options 
         * {
         *      target: （必填）你的列表容器,不要设置scroll、height等属性
         *     collection: （必填）OpfPagableCollection,
         *     cls: '',
         *     loadingIndicatorFun 默认空，如果方法 function (isLoading true/false) {}
         *     loadingIndicator: 默认为'加载中...' dom 默认添加到wrapper尾部 
         *     prefill: 默认true, 是否自动下载更多填满容器
         *     onBeforeLoadMore: function()//返回false可以打断加载更多
         *     onLoadMore: 每次加载完一页的回调     
         *     onFullLoad: function ()
         *     fullLoadIndicator: 默认为'全部加载完' dom 默认添加到wrapper尾部 
         *     fullLoadIndicatorFun: 
         * }
         * @return {$EL} $wrapper
         */
        scrollLoadMore: function (options) {
            options = $.extend({
                fullLoadIndicator: [
                    '<div class="end-indicator align-center">',
                    '<div class="text-wrap align-center"><span class="text">全部加载完</span></div>',
                        '<div class="the-line"></div>',
                    '</div>'
                ].join(''),
                loadingIndicator: [
                    '<div class="load-indicator align-center" >',
                        '<span class="loading-icon"></span>',
                        '<span class="text">',
                            '<span class="">正在加载&nbsp;</span>',
                            '<span>&#183;&#183;&#183;</span>',
                        '</span>',
                    '</div>'
                ].join(''),
                buffer: 30,
                prefill: true,
                onBeforeLoadMore: $.noop,
                loadingIndicatorFun: function (isLoading) {
                    getLoadingIndicator().appendTo($wrap).toggle(isLoading);
                },
                fullLoadIndicatorFun: function () {
                    getFullLoadIndicator().appendTo($wrap);
                }
            }, options);

            var loading = false, _theLoadingIndicator, _theFullLoadIndicator;

            var collection = options.collection;
            var $target = $(options.target);
            var $wrap = $target.wrap('<div class="scroll-more-wrapper"></div>')
                            .closest('.scroll-more-wrapper').addClass(options.cls);

            applyStyle();
            attach();

            function attach () {
                collection.on('request', function (c) {
                    if(c instanceof Backbone.Collection) {
                        loading = true;
                    }
                });
                collection.on('sync', function(c) {
                    if(c instanceof Backbone.Collection) {
                        checkPrefill();
                        checkFullLoad();
                        loading = false;
                    }
                });
                $wrap.on('scroll', _.debounce(scrollHandler, 100));
            }

            //通过分页collection获取下页，配置不移除原有数据达到加载更多
            function loadMore(ajaxOptions) {

                //如果是最后一些 或者 正在加载 或者 回调返回false
                if (collection.state.isLastPage || loading || 
                        options.onBeforeLoadMore() === false) {
                    return;
                }

                options.loadingIndicatorFun(true);

                collection.getNextPage($.extend({
                    remove: false,
                    success: function () {
                        options.onLoadMore && options.onLoadMore();
                    },
                    complete: function() {
                        options.loadingIndicatorFun(false);
                    }
                }, ajaxOptions));
            }

            var _fullLoad = false;
            //检测是否全部加载完毕
            function checkFullLoad () {
                if(_fullLoad) return;

                if (collection.state.isLastPage) {
                    _fullLoad = true;
                    options.fullLoadIndicatorFun();
                    options.onFullLoad && options.onFullLoad();
                }
            }

            //当目标高度没有达到配置高度时，加载数据包裹wrapper
            function checkPrefill() {
                needPrefill() && loadMore();
            }

            function needPrefill() {
                return options.prefill && (getOverBottom() <= 0);
            }
            
            function applyStyle() {
                $target = $(options.target)//
                            .css({height: 'auto','overflow': 'visible'});

                $wrap.css({ position: 'relative', height: options.height, 'max-height': options.maxHeight, overflow: 'auto'});
            }

            //获取列表超过容器底部多少,如果列表底部在容器内则返回负数
            function getOverBottom () {
                return $target.outerHeight(true) - 
                            ($wrap[0].scrollTop + $wrap.height());
            }


            function needLoadMore () { return getOverBottom() < options.buffer;}
            function scrollHandler() { needLoadMore() && loadMore(); }

            function getLoadingIndicator () {
                return _theLoadingIndicator || 
                    (_theLoadingIndicator = $(options.loadingIndicator));
            }
            function getFullLoadIndicator () {
                return _theFullLoadIndicator || 
                    (_theFullLoadIndicator = $(options.fullLoadIndicator));
            }

            return $wrap;
        },


        /**
         * //TODO 计算某个宽高
         * @param  {[type]} iW 当前实际宽 (如果是图片，也不一定是自然宽)
         * @param  {[type]} iH [description]
         * @param  {[type]} mW 限制宽
         * @param  {[type]} mH [description]
         * @return {[type]}    [description]
         */
        calcConstrainSize: function (iW, iH, mW, mH) {
            var w = iW, h = iH;
            var wRatioH = w/h;
            var hRatioW = h/w;

            //先按照宽度等比例缩放
            if(mW && w > mW) {
                w = mW;
                h = w * hRatioW;
            }

            if(mH && h > mH) {
                h = mH;
                w = h * wRatioH;
            }
            return {
                width: w,
                height: h
            };
        },

        /**
         * 异步
         * @param  {Element/String} img img标签元素或者url
         * @return {Object}     
         */
        getImageNaturalSize: function (src, cb) {
            // 创建对象
            var imgTag, timer = null, width = 0, height = 0, done = false;

            if (typeof src !== 'string') {
                src = $(src).attr('src');

                if(!src) {
                    return;
                }
            }

            imgTag = new Image();
            imgTag.src = src;

            check();

            if(!done) {
                imgTag.onload = function(){
                    if(!done) {
                        check(true);//加载完后，要保证计时器停掉
                        done = true;
                    }
                };

                imgTag.onerror = function () {
                    done = true;
                    timer && clearTimeout(timer);
                };
            }
            
            function check (stopTimer){
                if(done) {return;}

                width = imgTag.width;
                height = imgTag.height;

                // 只要 宽/高 大于0, 表示服务器已经返回宽高
                if(width > 0 || height > 0){
                    timer && clearTimeout(timer);
                    done = true;
                    cb && cb({width: width, height: height});
                }

                if(stopTimer !== true && done !== true) {
                    timer = setTimeout(check, 100);
                }
            }
        },

        /**
         * 让图片按原比例展示，默认限制在图片的父容器内
         * @param options
         * {
         *  img: img标签，
         *  constrain: 限制容器的dom 或者 {width:xx, height: xx}
         * }
         */
        autoFitImg: function (options) {
            var $img = $(options.img),
                constrainWidth, constrainHeight, $ct;
            //如果constrain是宽高对象
            if($.isPlainObject(options.constrain)){
                constrainWidth = options.constrain.width;
                constrainHeight = options.constrain.height;
            //如果constrain是DOM
            }else {
                $ct = $(options.constrain || $img.parent());
                constrainWidth = $ct.width();
                constrainHeight = $ct.height();
            }

            Opf.Util.getImageNaturalSize($img,function(init){
                var fitSize = Opf.Util.calcConstrainSize(init.width,init.height,constrainWidth,constrainHeight);
                $img.css({
                    'width':fitSize.width,
                    'height':fitSize.height
                });
            });
        },

        //拷贝jquery的代码
        makeNoCacheUrl: function (strUrl) {
            
            return rts.test( strUrl ) ?

            // If there is already a '_' parameter, set its value
            strUrl.replace( rts, "$1_=" + ajax_nonce++ ) :

            // Otherwise add one to the end
            strUrl + ( ajax_rquery.test( strUrl ) ? "&" : "?" ) + "_=" + ajax_nonce++;
        },

        utf8ByteLength: function(s) {
            var totalLength = 0;
            var i;
            var charCode;
            for (i = 0; i < s.length; i++) {
                charCode = s.charCodeAt(i);
                if (charCode < 0x007f) {
                    totalLength = totalLength + 1;
                } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                    totalLength += 2;
                } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                    totalLength += 3;
                }
            }
            return totalLength;
        },

        getSelectedOptionText: function (el) {
            var $el = $(el);
            var ret;
            if($el.data('select2')) {
                ret = ($el.select2('data')||{}).text;
            }else {
                ret = $el.find('option:selected').text();
            }
            return ret || '';
        },

        id: function () {
            return _uuid++;
        },

        //解析地区编码，返回[省，市，区]
        //如果 省 是直辖市，那么返回的 省 和 市 一样
        parseRegionCode: function (regionCode) {
            regionCode = regionCode || '';
            var ZHI_XIA_SHI = {
                '11' : {label:'北京市'},
                '31' : {label:'上海市'},
                '12' : {label:'天津市'},
                '50' : {label:'重庆市'}
            };
            var province, city, country;
            province = regionCode.substring(0, 2);
            
            if(ZHI_XIA_SHI[province]) {
                city = province;
            }else {
                city = regionCode.substring(0, 4);
            }
            country = regionCode;
            return [province, city, country];
        },

        // 解析地区编码，返回是否为完整的省市区号
        isFullRegionCode: function (regionCode) {
            if(!regionCode){
                return false;
            }
            var isFull = true;
            var ZHI_XIA_SHI = {
                '11' : {label:'北京市'},
                '31' : {label:'上海市'},
                '12' : {label:'天津市'},
                '50' : {label:'重庆市'}
            };

            var province = regionCode.substring(0, 2);

            if(regionCode.length === 4 && !ZHI_XIA_SHI[province]){
                isFull = false;
            }

            return isFull;
        },

        positionFixed: function(el, base, to) {
            base = base || 'c-c';
            to = to || 'c-c';

            var $el = $(el);

            var tmp = (base + to).replace(/-/g, '');

            var baseH = tmp[0],
                baseV = tmp[1],
                toH = tmp[2],
                toV = tmp[3];

            var w = $el.width(),
                h = $el.height();

            var maginMap = {
                c: 2,
                r: 1
            };
            var posMap = {
                l: 0,
                c: '50%',
                r: '100%'
            };

            $(el).css({
                position: 'fixed',
                left: posMap[toH],
                top: posMap[toV],
                'margin-left': -(maginMap[baseH] ? w / maginMap[baseH] : 0), //0 when 'c'
                'margin-top': -(maginMap[baseV] ? h / maginMap[baseV] : 0) //0 when 'c'
            });
        },

        /**
         * Author: 何锋
         * Date: 2015/7/4
         * Description: 批量获取表单带name属性的输入值
         * @param form
         * @returns {{}}
         */
        getFormData: function(form){
            var $form = $(form), formData = {};
                $form.find(
                    'input[name], select[name], textarea[name]'
                ).each(function() {
                    var self = $(this);
                    var name = self.attr("name");
                    var value = self.val();
                    formData[name] = value;
                });
            return formData;
        }
    };

    /**|--------------------------------------------
     * |@Array
     * |--------------------------------------------*/
    Opf.Array = {
        from: function(arr) {
            return $.isArray(arr) ? arr :
                arr == null ? [] : [arr];
        }
    };


    Opf.isDef = function(obj) {
        return typeof obj !== 'undefined';
    };

    Opf.isNotDef = function(obj) {
        return typeof obj === 'undefined';
    };


    Opf.jqgValidate = {
    	
    	//for jqgrid validation
    	mustPickOne : function (value, name){
			var success = true, 
				message = '';
			
			if(!value){
				success = false;
				message = name + ': 必须从列表中选择一个值';
			}
			return [success, message];
		}
    	
    };
    
    Opf.Validate = {
        algosJqGridSetup: function(postdata, form){
            $('.ui-jqgrid-titlebar').find('.help-error').remove();
            if(postdata.algos.length == 0){
                $('.ui-jqgrid-titlebar').append('<span class="help-error ui-jqgrid-title">不能为空!</span>');
                var $form = $(form);
                var valid = $form.validate().form();
                return false;
            }
            else{
                var $form = $(form);
                var valid = $form.validate().form();
                $form.find('.ui-state-error').hide();
                return [valid, ''];
            }
        },
    	//for jqgrid validation
    	setup : function (postdata, form){
			var $form = $(form);
			var valid = $form.validate().form();
			$form.find('.ui-state-error').hide();
			return [valid, ''];
		},

        validateBeforeJqGridFormSubmit: function (postdata, form) {
            return Opf.Validate.setup(postdata, form);
        },
		
		addRules : function(form, opts){
			
			$(form).validate( $.extend({
				errorPlacement: function(error, element) {
                    error.appendTo(element.parent());
                }
			}, ( opts || { rules:{} } ) ));
			
			return Opf;
		},

        //高亮的时候适应bs的表单
        addRulesToBsForm: function (form, options) {
            Opf.Validate.addRules(form, $.extend({
                errorElement: "span",
                errorClass: "help-error",
                focusInvalid: false,
                highlight: function(element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                success: function(element) {
                    element.closest('.form-group').removeClass('has-error');
                    element.remove();
                },
                errorPlacement: function(error, element) {
                    error.addClass('help-block').insertAfter(element);
                }
            }, options));
        }
    	
    };
    
    
    Opf.Number = {

            /**
             * 对于 '321312.00' 这样的数字，返回取整
             * @return {number} [description]
             */
            clearNum: function (num) {
                if(!isNaN(parseFloat(num)) &&
                     parseFloat(num) === parseInt(num, 10)) {
                    return parseInt(num, 10);
                }
                return num; 
            },
    		/**
    		 * // Example usage:
					currency(54321); // ￥54,321
					currency(12345, 0, "£ "); // £ 12,345
    		 */
    		currency : function (number, places, symbol, thousand, decimal, smartDecimal) {
    			var source = number;
    			number = number || 0;
    			
    			places = !isNaN(places = Math.abs(places)) ? places : 2;
    			
    			symbol = symbol !== undefined ? symbol : "￥";
    			thousand = thousand || ",";
    			decimal = decimal || ".";
    			var negative = number < 0 ? "-" : "",
    			    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    			    j = (j = i.length) > 3 ? j % 3 : 0;
    			var intPart = symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand);
    			var dPart = Math.abs(number - i);
    			var e = source - i;
    			if(smartDecimal === true){
    				return e > 0 ? intPart + (places ? decimal + dPart.toFixed(places).slice(2) : "") : intPart;
    			}
    			return intPart + (places ? decimal + dPart.toFixed(places).slice(2) : "");
    		}	
    };
    
    Opf.currencyFormatter = function(val, options, obj){
        val = val || 0;
        var value = val < 0 ? String(val).replace('-','') : val;
        var symbol = val < 0 ? '-' : '';
        return symbol + Opf.Number.currency(value, 2, '', ',', '.', true);
    };

    Opf.nodeTimeFormatter = function(val, options, obj) {
        if(!val) { return ''; }
        var value = val.toString();
        return value.substring(0, 2) + ':' + value.substring(2, 4);
    };

    //TODO临时放这里，将来放到jquery.ui.override
    //扩展jquery ui diloag配置fluid,适应屏幕resize
    (function() {
        // run function on all dialog opens
        $(document).on("dialogopen", ".ui-dialog", function(event, ui) {
            if($(event.target).closest(".ui-dialog-content").data("ui-dialog")) {
                // fluidDialog();
            }
        });

        // remove window resize namespace
        $(document).on("dialogclose", ".ui-dialog", function(event, ui) {
            if ($(event.target).data('resize.dialog.responsive.fn')) {
                $(window).off("resize.dialog.responsive", $(event.target).data('resize.dialog.responsive.fn'));
            }
        });

        function fluidDialog() {
            var $visible = $(".ui-dialog:visible");
            // each open dialog
            $visible.each(function() {
                var $this = $(this);
                var $uiDialogContent = $this.find(".ui-dialog-content");
                var dialog = $uiDialogContent.data("ui-dialog");
                if(dialog) {

                    if (dialog.options.maxWidth && dialog.options.width) {
                        // fix maxWidth bug
                        $this.css("max-width", dialog.options.maxWidth);
                        //reposition dialog
                        dialog.option("position", ['center', 'center']);
                    }

                    if (dialog.options.fluid) {
                        var fn = FuncUtils.createBuffered(function() {
                            var wWidth = $(window).width();
                            // check window width against dialog width
                            if (wWidth < dialog.options.maxWidth + 50) {
                                // keep dialog from filling entire screen
                                $this.css("width", "90%");
                            }
                            dialog.option("position", dialog.options.position);

                        }, 150);
                        $uiDialogContent.data('resize.dialog.responsive.fn', fn);
                        // namespace window resize
                        $(window).on("resize.dialog.responsive", fn);
                        setTimeout(function () {
                            $(window).triggerHandler("resize.dialog.responsive");
                        });
                    }
                }

            });
        }

    })();

    Opf.download = function (url) {
        $('<iframe></iframe>').css({
            display: 'none',
            width: 0,
            height: 0
        }).attr('src', url).appendTo(document.body);
    };

    Opf.formatUrl = function (url){ 
        var reg=/(?:[?&]+)([^&]+)=([^&]+)/g; 
        var data={}; 
        function fn(str,pro,value){ 
            data[decodeURIComponent(pro)]=decodeURIComponent(value); 
        } 
        url.replace(reg,fn); 
        return data; 
    };

    Opf.scrollToError = function($el) {
        var $error = $el.find(".has-error:visible").eq(0);
        if($error.length) {
            var pos = Math.max($error.offset().top-20, 0);
            $("html, body").animate({scrollTop: pos}, "fast");
        }
    };
    
    return Opf;

});