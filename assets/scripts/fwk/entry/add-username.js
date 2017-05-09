define([''], function() {
    var username = Ctx.getUser().get('name');

    $('span.user-info').each(function(){
        $(this).html('<small>' + BaseLang._('u.r.welcome') + ',</small>' + username);
    });
    // added.html('<small>Welcome,</small>' + username);
});