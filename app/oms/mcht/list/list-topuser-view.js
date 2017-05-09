/**
 * @author hefeng
 * @data 2015/12/18
 * @version OMS-Dev2.1.25
 * @description 推荐注册商户列表
 */
define(['App',
    'jquery.jqGrid'
], function(App) {
    var STATUS_MAP = {
        '0': '推荐注册商户',
        '1': '开放注册商户'
    };

    var tpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="mchts-topuser-grid-table"></table>',
                '<div id="mchts-topuser-grid-pager" ></div>',
            '</div>',
        '</div>'
    ].join('');

    return Marionette.ItemView.extend({
        tabId: 'menu.mcht.topuser',
        template: _.template(tpl),

        onRender: function() {
            var me = this;
            _.defer(function(){
                me.renderGrid();
            });
        },

        renderGrid: function() {
            App.Factory.createJqGrid({
                rsId: 'mcht.topuser',
                caption: "推荐注册商户列表",
                filters: [
                    {
                        caption: '精准搜索',
                        defaultRenderGrid: false,
                        canSearchAll: false,
                        components: [
                            {
                                label: '手机号',
                                name: 'phone',
                                options: {
									sopt: ['eq']
								}
                            },{
                                label: '推荐商户号',
                                name: 'mchtNo',
                                options: {
									sopt: ['eq']
								}
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ],
                actionsCol: false,
                nav: { actions:{add:false, search:false, refresh:true} },
                gid: 'mchts-topuser-grid',
                url: url._('merchant.topuser'),
                //rowNum:100000,
                //rowList:{},
                //pgbuttons:false,
                //pginput:false,
                colNames: {
                    id: 'ID',
                    userPhone: "手机号",
                    mchtNo: "推荐商户号",
                    createTime: "注册时间",
                    status: "状态"

                },

                colModel: [
                    {name:'id', hidden: true},
                    {name:'userPhone'},
                    {name:'mchtNo'},
                    {name:'createTime'},
                    {name:'status', formatter: statusFormatter}
                ]
            });

        }

    });
    function statusFormatter (val) {
        return STATUS_MAP[val] || '';
    }
});