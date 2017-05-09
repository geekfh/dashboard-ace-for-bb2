/**
 * twitter - typeahead.js {@link https://github.com/twitter/typeahead.js}
 * module typeahead.factory
 */
define([
	'jquery',
	'underscore',
	'typeahead'
], function($, _){

	var modelMap = {};

	/**
	 * 经过二次封装的typeaheadFactory对象。
	 * deps: assets/scripts/fwk/factory/typeahead.factory
	 * @see twitter - typeahead.js {@link https://github.com/twitter/typeahead.js}
	 * @example
	 * define(['assets/scripts/fwk/factory/typeahead.factory'], function(typeaheadFactory) {
	 *  // 远程数据源参数配置
	 *  var model = typeaheadFactory.createModel('modelName', {
            search  : 'name',
            prefectch   : null,
            remote      : {
                url : url,
                replace : function(url, query){
                    return url + '?' + $.param({
                        kw: encodeURIComponent(me.$traceNo.val()),
                        type:me.$traceNo.attr('name'),
                        date:me.$dateInput.val()
                    });
                }
            }
        });

        // 返回一个Typeahead实例
        var traceTypeahead = typeaheadFactory.newTypeahead('modelName', {
            el : $el,
            displayKey : 'name'
        });

		// 触发选择事件
        traceTypeahead.on('typeahead:selected', function(e, obj){
			var id = obj.id || obj.value;
			tahIsSelect = id ? true:false;
			commonUi.triggerTahSelected($el,me.$removeIcon);
		});

		// 触发选择面板关闭事件
        traceTypeahead.on('typeahead:closed', function(e, obj){
        	if(!tahIsSelect) { $el.val('') };
			model.clearRemoteCache();
			tahIsSelect = false;
		});
	 * })
	 * @exports typeaheadFactory
	 */
	var typeaheadFactory = {
		/**
		 * 使用Bloodhound创建typeahead数据源模型
		 * @param {String} key - 模型标识(唯一)
		 * @param {Object} options - Bloodhound配置项 {@link https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md}
		 * @param {Object} [bhOptions] - Bloodhound配置项
		 * @param {Boolean} [override] true/false
		 * @returns {Bloodhound} Bloodhound实例
		 */
		createModel : function(key, options, bhOptions, override){
			var opt = $.extend(true, {
				search 	: 'name',
				paramKey 	: 'kw',
				limit 		: 10,
				limitKey	: 'limit',
				prefectch 	: null,
				remote		: null,
				fixParam	: null
			}, options);

			var bloodhound ;
			if(bhOptions){
				bloodhound = new Bloodhound(bhOptions);
			}else {
				var fp =  _.isString(opt.fixParam) ?  opt.fixParam : (_.isObject(opt.fixParam) ? $.param(opt.fixParam) : '');
				bloodhound = new Bloodhound({
					datumTokenizer : _.isFunction(opt.search) ?  opt.search : Bloodhound.tokenizers.obj.whitespace(opt.search),
					queryTokenizer : Bloodhound.tokenizers.whitespace,
					limit : opt.limit,
					prefetch : opt.prefectch,

					remote :   _.isString(opt.remote) ? (opt.remote + '?' + opt.limitKey + '=' + opt.limit + '&' + opt.paramKey + '=' + '%QUERY' + (fp ? '&'+fp : '') ) : opt.remote
				});
				bloodhound._getFromRemote = function getFromRemote(query, cb) {
		                var that = this, url, uriEncodedQuery;
		                query = query || "";
		                uriEncodedQuery = encodeURIComponent(encodeURIComponent(query));
		                url = this.remote.replace ? this.remote.replace(this.remote.url, query) : this.remote.url.replace(this.remote.wildcard, uriEncodedQuery);
		                return this.transport.get(url, this.remote.ajax, handleRemoteResponse);
		                function handleRemoteResponse(err, resp) {
		                    err ? cb([]) : cb(that.remote.filter ? that.remote.filter(resp) : resp);
		                }
		            };
			}

			if(key && bloodhound){
				// this.setModel(key, bloodhound, !!override);
				this.setModel(key, bloodhound, true);
			}
			bloodhound && bloodhound.initialize();

			return bloodhound;

		},

		/**
		 * 获取Bloodhound数据源模型
		 * @param {String} key - 模型ID存在的话就取该模型数据源，否则重新建立一个新的数据源并返回。
		 * @param createOption - 如果key没有配置则表示用新的配置项生成数据源模型，参数同createModel
		 * @returns {Bloodhound} Bloodhound实例也就是远程数据源模型
		 */
		getModel : function(key, createOption){
			var bloodhound ;
			if(key){
				bloodhound =  modelMap[key];
			}
			if(!bloodhound && createOption){
				bloodhound = this.createModel(key || createOption.key, createOption.options, createOption.bhOptions, createOption.override);
			}
			return bloodhound;
		},

		/** @ignore */
		setModel : function(key, bloodhound, override){
			if(!override){
				var obj  = this.getModel(key);
				if(obj){
					return ;
				}
			}
			if(key && bloodhound){
				modelMap[key] = bloodhound;
			}
		},

		/**
		 * 删除数据源(Bloodhound实例)
		 * @param {String} key - 模型ID
		 */
		removeModel : function(key){
			delete modelMap[key];
		},

		/**
		 * 实例化typeahead
		 * @param {String} modelKey - 模型ID
		 * @param {Object} options - typeahead配置项 {@link https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md}
		 * @returns {jQuery} - jQuery DOM 对象
		 */
		newTypeahead : function(modelKey, options){
			if(_.isObject(modelKey)){
				options = modelKey;
				modelKey = options.modelKey;
			}
			var el = options.el ? $(options.el) : null,
				name = options.name || modelKey,
				displayKey = options.displayKey,
				templates = options.templates,
				highlight = !!options.highlight,
				minLength = options.minLength ? options.minLength : 1,
				hint = options.hint === false ? true : false,
				source = options.source, model;

			if(!source && modelKey){
				model = this.getModel(modelKey);
				if(model){
					source = model.ttAdapter();
				}
			}

			if(el && source){
				$(el).typeahead({
					highlight : highlight,
					minLength : minLength,
					hint : hint
				}, {
					name : name,
					displayKey : displayKey,
					source: source,
					templates : templates
				});
			}

			return el;
		}

	};

	return typeaheadFactory;
});