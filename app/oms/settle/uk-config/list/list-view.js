/**
 * @created 2014-5-10 
 */



define(['App',
    'tpl!app/oms/settle/uk-config/list/templates/table-ct.tpl',
    'tpl!app/oms/settle/uk-config/list/templates/accInfos.tpl',
    'tpl!app/oms/settle/uk-config/list/templates/accRows.tpl',
    'i18n!app/oms/common/nls/settle',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'select2'
], function(App, tableCtTpl, accInfosTpl, accRowsTpl, settleLang) {


    var ADD_ACC_INFOS_OPTIONS = '',
        UK_NUMBER = 0,
        ACCOUNT_NUMBER = 0,
        CLICK_SUBMIT = false;

    App.module('SettleApp.UkConfig.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.UkConfigs = Marionette.ItemView.extend({
            template: tableCtTpl,

            events: {

            },

            onRender: function() {
                var me = this;

                setTimeout(function() {

                    me.renderGrid();

                },1);
            },

            gridOptions: function (defaultOptions) {
                return defaultOptions;
            },



            attachValidation: function() {
                return {
                    setupValidation: Opf.Validate.setup,
                    addValidateRules: function(form) {
                        Opf.Validate.addRules(form, {
                            rules: {
                                oprId: 'required'
                            }
                        });
                    }
                };
                
            },

            renderGrid: function() {
                var me = this;
                var validation = this.attachValidation();

                var grid = App.Factory.createJqGrid(me.gridOptions({
                    rsId:'ukConfig',
                    caption: settleLang._('ukConfig.txt'),
                    actionsCol: {

                    },
                    nav: {
                        formSize: {
                            width: Opf.Config._('ui', 'ukConfig.grid.form.width'),
                            height: Opf.Config._('ui', 'ukConfig.grid.form.height')
                        },

                        add : {
                            beforeShowForm: function(form) {
                                UK_NUMBER = 0;
                                ACCOUNT_NUMBER = 0;
                                CLICK_SUBMIT = false;
                                $.ajax({
                                    type: 'GET',
                                    url:  url._('stlm.account.payaccount'),
                                    success: function(resp) {
                                        // console.log(resp);
                                        ADD_ACC_INFOS_OPTIONS = getOptions(resp);
                                        var accTpl = accInfosTpl({edit: false});
                                        var $form = $('form[name="FormPost"]');
                                        $form.append(accTpl);
                                        $form.on('click', formClick);

                                        $form.find('.add-more-acc-infos').trigger('click');
                                        // $form.find('select[name="oprId"]').select2();
                                        addOprIdSelect2($form.find('input[name="oprId"]'));

                                        validation.addValidateRules(form);

                                    }
                                });

                            },

                            beforeSubmit : function (postdata, form){
                                var $form = $(form);
                                CLICK_SUBMIT = true;
                                updateValidateRules($form, false);

                                var valid = $form.validate().form();
                                $form.find('.ui-state-error').hide();

                                return [valid, ''];
                            },

                            onclickSubmit: function(params, postdata) {

                                var postInfos = getFormValues($('form[name="FormPost"]'));

                                postdata['acctId'] = postInfos.accounts;
                                postdata['ukUser'] = postInfos.ukUsers;

                                var oprData = $('form[name="FormPost"]').find('input[name="oprId"]').select2('data');
                                postdata['oprId'] = oprData ? oprData.oprId : null;

                                return postdata;
                            }
                        },


                        edit : {
                            beforeShowForm: function(form) {
                                CLICK_SUBMIT = false;
                                $.ajax({
                                    type: 'GET',
                                    url:  url._('stlm.account.payaccount'),
                                    success: function(resp) {
                                        ADD_ACC_INFOS_OPTIONS = getOptions(resp);
                                        var rowData = grid._getRecordByRowId(Opf.Grid.getSelRowId(grid));
                                        UK_NUMBER = getTotalNumOfUkUsers(rowData.ukUsers);
                                        ACCOUNT_NUMBER = rowData.accounts.length;
                                        var editOpt = {edit: true, rows: $.extend(rowData, {options: resp})};
                                        var accTpl = accInfosTpl(editOpt);

                                        var $form = $('form[name="FormPost"]');
                                        $form.append(accTpl);
                                        $form.on('click', formClick);

                                        addOprIdSelect2($form.find('input[name="oprId"]'));
                                        console.log(rowData);
                                        $form.find('input[name="oprId"]').select2('data', {oprId: rowData.oprId, oprName: rowData.oprName});

                                        validation.addValidateRules(form);
                                    }
                                });
                            },

                            beforeSubmit: function (postdata, form){
                                var $form = $(form);
                                CLICK_SUBMIT = true;
                                updateValidateRules($form, false);

                                var valid = $form.validate().form();
                                $form.find('.ui-state-error').hide();

                                return [valid, ''];
                            },

                            onclickSubmit: function(params, postdata) {
                                var postInfos = getFormValues($('form[name="FormPost"]'));

                                postdata['acctId'] = postInfos.accounts;
                                postdata['ukUser'] = postInfos.ukUsers;

                                var oprData = $('form[name="FormPost"]').find('input[name="oprId"]').select2('data');
                                postdata['oprId'] = oprData ? oprData.oprId : null;

                                return postdata;
                            }
                        }
                        
                    },
                    gid: 'uk-config-grid',
                    url: url._('ukConfig.txn'),  //api/settle/trade-water
                    colNames: {
                        id         : settleLang._('uk.config.id'), //id
                        oprId      : settleLang._('uk.config.oprId'), //操作员ID
                        oprName    : settleLang._('uk.config.oprName'), //操作员姓名

                        accounts   : settleLang._('uk.config.acctId'),

                        // acctId     : settleLang._('uk.config.acctId'), //清算收付款账户ID
                        // acctName   : settleLang._('uk.config.acctName'), //清算收付款账户
                        ukUsers    : settleLang._('uk.config.ukUser')  //uk用户


                    },

                    responsiveOptions: {
                        hidden: {
                            ss: [],
                            xs: [],
                            sm: [],
                            md: [],
                            ld: []
                        }
                    },

                    colModel: [
                        {name: 'id',        index: 'id',        hidden: true},  //id
                        {name: 'oprId',     index: 'oprId',     editable: false, hidden: true},  //操作员ID
                        {name: 'oprName',   index: 'oprName',   width:50,   editable: false},  //操作员姓名
                        {name: 'accounts',  index: 'accounts',  editable: false, formatter: accountsFormatter},
                        // {name: 'acctId',    index: 'acctId',    editable: true, hidden: true},  //清算收付款账户ID
                        // {name: 'acctName',  index: 'acctName',  editable: false},  //清算收付款账户
                        {name: 'ukUsers',    index: 'ukUsers',  editable: false, hidden: true, viewable: false}  //uk用户
                       
                    ],

                    loadComplete: function(row) {
                   
                    }
                }));              
                
            }

        });

    });


    function accountsFormatter(val, options, rowData) {
        console.log('value is ---------->',val);
        console.log('rowData is ---------->',rowData);
        var accInfoShow = '';
        _.each(val, function(accountInfo) {
            accInfoShow += accountInfo.bank + " " + accountInfo.no + '<br><ul>';
            _.each(rowData.ukUsers[accountInfo.no], function(ukUserName) {
                accInfoShow += '<li>' + ukUserName + '</li>';
            });
            accInfoShow += '</ul>';
            console.log(accInfoShow);
        });

        return accInfoShow;

    }


    function formClick(e) {

        if(!e.target) {
            return;
        }

        var $el = $(e.target);
        var $form = $el.closest('form');

        if($el.hasClass('del-more-acc-infos')) {
            console.log('del-more-acc-infos');
            if($('#submit-append-values').find('.account-informations').length<=1) {
                Opf.alert('至少需要一个付款账户');
                return;
            }
            $el.closest('.account-informations').remove();
            updateValidateRules($form, CLICK_SUBMIT);

        } else if ($el.hasClass('del-more-uk-user')) {
            console.log('del-more-uk-user');
            $el.closest('.form-group').remove();
            updateValidateRules($form, CLICK_SUBMIT);

        } else if ($el.hasClass('add-more-uk-user')) {
            console.log('add-more-uk-user');
            $el.closest('.form-group').before(getUkUserTpl);

        } else if ($el.hasClass('add-more-acc-infos')) {
            console.log('add-more-acc-infos');
            $('#submit-append-values').append(accRowsTpl({options: ADD_ACC_INFOS_OPTIONS, ukNumber: ++UK_NUMBER, accountNumber: ++ACCOUNT_NUMBER}));

        }

    }

    function getOptions (opts) {
        var result = [];

        _.each(opts, function(option) {
            result.push('<option value="' + option.key + '">' + option.value + '</option>');
        });

        return result.join('');
    }


    function getFormValues (form) {
        var result = {};
        var $form = $(form);
        var accounts = [];
        var ukUsers = {};
        var acctNo, select2Data;

        select2Data = $form.find('input[name="oprId"]').select2('data');
        result.oprId = select2Data? select2Data.value : null;

        $form.find('.account-informations').each(function() {
            acctNo = $(this).find('select[name^="account"]').val();
            ukUsers[acctNo] = [];
            accounts.push(acctNo);

            $(this).find('input[name^="ukUser"]').each(function() {
                $(this).val() && ukUsers[acctNo].push($(this).val());
            });
        });

        result.accounts = accounts.join(",");
        result.ukUsers = JSON.stringify(ukUsers);

        return result;
    }


    function addOprIdSelect2 (select) {
        var $select = $(select);

        $select.select2({
            placeholder: '请输入操作员',
            minimumInputLength: 1,
            ajax: {
                type: "get",
                url: url._('options.operators'),
                dataType: 'json',
                data: function (term, page) {
                    return {
                        key: encodeURIComponent(term)
                    };
                },
                results: function (data, page) {
                    var resultData = [];

                    _.each(data, function(operator) {
                        var infos = {};
                        infos.oprId = operator.oprId || '';
                        infos.oprName = (operator.oprName || '') + '(' + (operator.loginName || '') + ')';
                        resultData.push(infos);

                    });

                    return {
                        results: resultData
                    };
                }
            },
            id: function (e) {
                return e.oprId;
            },
            formatResult: function(data, container, query, escapeMarkup){
                return data.oprName;
            },
            formatSelection: function(data, container, escapeMarkup){
                return data.oprName;
            }

        });
    }


    function getUkUserTpl() {
        return ['<div class="form-group">',
            '<label class="col-md-3 control-label">uk用户:</label>',
            '<div class="col-md-8">',
                '<input type="text" name="ukUser' + (++UK_NUMBER) + '"> <i class="icon-remove del-more-uk-user" style="margin-left: 6px;"></i>',
            '</div>',
        '</div>'].join('');
    }

    function getTotalNumOfUkUsers(rowData) {
        var length = 0;

        _.each(rowData, function(arr) {
            length += arr.length;
        });

        return length;
    }

    function updateValidateRules (form, updateValid) {
        var $form = $(form);

        $form.find('.account-informations').each(function() {
            var me = $(this);
            me.find('input[name^="ukUser"]').each(function(index, value) {
                var notEqualToRules = me.find('input[name^="ukUser"]');
                notEqualToRules.splice(index, 1);

                $(this).rules('add', {
                    required: true,
                    notEqualTo: notEqualToRules, 
                    messages: {
                        notEqualTo: 'uk用户不能重复'
                    }
                });
            });
        });

        $form.find('select[name^="account"]').each(function(index, value) {
            var selNotEqualToRules = $(form).find('select[name^="account"]');
            selNotEqualToRules.splice(index, 1);

            $(this).rules('add', {
                notEqualTo: selNotEqualToRules,
                messages: {
                    notEqualTo: '账户不能重复'
                }
            });
        });

        updateValid && $form.validate().form();
    }


    return App.SettleApp.UkConfig.List.View;

});











