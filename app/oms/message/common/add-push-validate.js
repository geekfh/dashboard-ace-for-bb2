define([], function() {

    //第一个页面添加验证规则
    function addRules4Info(form) {
        Opf.Validate.addRules($(form), {
            errorElement: "span",
            errorClass: "help-error",
            focusInvalid: false,
            rules: {
                msgSubject: {
                    required: true
                },

                msgContent1: {
                    required: true
                },

                msgContent2: {
                    required: true
                },

                'pushDate-mm': {
                    required: true
                },

                pushContent: {
                    required: true
                },

                pushObject: {
                    required: true
                },

                pushObjectRange: {
                    required: true
                },

                receiveId: {
                    required: true
                },

                userSystem: {
                    required: true
                },

                previewContent: {
                    //required: true,
                    maxlength: 340
                }
            },
            highlight: function(element) {
                // 这里element是DOM对象
                $(element).closest('.form-group').addClass('has-error');
            },
            success: function(element) {
                element.closest('.form-group').removeClass('has-error');
                element.remove();
            },
            errorPlacement: function(error, element) {
                error.addClass('help-block');
                if(element.is(':radio')||element.is(':checkbox')){
                    element.closest('td').append(error);
                } else {
                    error.insertAfter(element);
                }
            }
        });
    }

    return {
        addRules4Info: addRules4Info
    };
});