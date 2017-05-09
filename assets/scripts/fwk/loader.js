/**
 * suppose require.js has loaded
 */
define(['jquery'], function() {

    Loader = {

    };

    Loader.deferRquire = function(deps, callback, errback, optional) {

        var deferred = $.Deferred();
        var promised = deferred.promise();

        //original args of require: (deps, callback, errback, optional)
        require(deps, function() {

            callback && callback.apply(null, arguments);
            deferred.resolve.apply(deferred, arguments);

        }, function() {
            errback && errback.apply(null, arguments);
            deferred.reject.apply(deferred, arguments);

        }, optional);

        return deferred.promise();
    };


    return Loader;

});