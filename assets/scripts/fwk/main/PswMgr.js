define(function() {

    function deferredForceChangeInitPsw () {
        var defer = $.Deferred();

        var isPswChanged = Ctx.getUser().get("isPswChanged");
        var about_psw = Ctx.getUser().get("about_psw");
        var about_psw_msg = Ctx.getUser().get("about_psw_msg")||"";

        function onPswChangeSuccess () {
            //App.off('psw:skip:success', onPswSkip);
            defer.resolve();
        }

        /*function onPswSkip () {
            App.off('psw:change:success', onPswChangeSuccess);
            defer.resolve();
        }*/

        isPswChanged = typeof isPswChanged == "string"? parseInt(isPswChanged):isPswChanged;
        if(!isPswChanged || !!about_psw){
            var options = {
                isPswChanged: isPswChanged,
                about_psw: about_psw,
                about_psw_msg: about_psw_msg
            };
            require(['assets/scripts/fwk/entry/repair-password'], function(PswDialogApis) {
                PswDialogApis.setVars(options);
                PswDialogApis.showChangePswDiag4Inig();
                App.once('psw:change:success', onPswChangeSuccess);
                //App.once('psw:skip:success', onPswSkip);
            });
        } else {
            defer.resolve();
        }

        return defer.promise();
    }
    
    return {
        deferredForceChangeInitPsw: deferredForceChangeInitPsw
    };
});