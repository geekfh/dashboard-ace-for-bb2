/**
 * @author hefeng
 * @date 2015/11/24
 * @description 下拉框与内容联动，只要用于拒绝操作模板化。
 */
define([
    'tpl!assets/scripts/fwk/component/templates/linkage.tpl'
], function(linkageTpl){
    return Marionette.ItemView.extend({
        template: linkageTpl,
        className: 'linkage-wrapper',
        ui: {
            linkageTitle: 'select.linkage-list',
            linkageContent: 'textarea.linkage-content'
        },
        initialize: function(options){
            this.renderTo = options.renderTo;
            this.properties = options.properties;
        },
        serializeData: function(){
            var me = this;
            return {
                properties: me.properties
            }
        },
        onRender: function(){
            var me = this, ui = me.ui, $el = me.$el;

            if(me.renderTo.find('select').length>0) return; //下拉模型已经被生成过

            me.renderTo.empty().append($el);

            //加载数据开始
            var refuseConfigFormatter = function(data){
                var group=null, str='', //<option value="-1">请选择拒绝原因</option>
                    newData = _.sortBy(data, 'group');
                _.each(newData, function(item, idx){
                    if(item.group !== group){
                        idx !==0 && (str += '</optgroup>');
                        str += '<optgroup label="'+item.group+'">';
                        group = item.group;
                    }
                    str += '<option value="'+item.key+'">'+item.value+'</option>';
                });
                str += '</optgroup>';
                return str;
            };

            //拒绝配置内容模板
            var refuseConfigContentFormatter = function(items){
                var contentStr = "";
                for(var i=0; i<items.length; i++){
                    var item = items[i];
                    contentStr += (i+1)+'. '+item.content+(i!==items.length-1? '\n':'');
                }
                return contentStr;
            };

            var ajaxOptions = {
                type: 'GET',
                dataType: 'json',
                url: url._('task.refuseConfig.select'),
                beforeSend: function(){
                    Opf.UI.setLoading(me.renderTo, true);
                },
                success: function(resp){
                    var refuseConfigData = resp;
                    var refuseConfigTpl = refuseConfigFormatter(refuseConfigData);

                    ui.linkageTitle
                        .append(refuseConfigTpl)
                        .select2({
                            placeholder: '点击此处选择拒绝理由模板',
                            closeOnSelect: false
                        })
                        .on('change', function(e){
                            var val = e.val||[];
                            var refuseConfigItems = [];
                            for(var i=0; i<val.length; i++){
                                var item = _.findWhere(refuseConfigData, {key: parseInt(val[i])});
                                if(_.isObject(item)){
                                    refuseConfigItems.push(item);
                                }
                            }

                            var content = refuseConfigContentFormatter(refuseConfigItems);
                            ui.linkageContent.val(content);

                            var refuseConfigItem = {
                                key: val.toString()||"-1"
                            };

                            var linkageData = me.renderTo.data('linkage');
                            if(linkageData){
                                _.extend(linkageData, refuseConfigItem)
                            } else {
                                me.renderTo.data('linkage', _.extend({},refuseConfigItem));
                            }
                        }).trigger('change');
                },
                complete: function(){
                    Opf.UI.setLoading(me.renderTo, false);
                }
            };

            _.defer(function(){
                Opf.ajax(ajaxOptions);
            })
        }
    })
});
