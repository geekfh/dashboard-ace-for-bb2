define([], function(){

    var Collection = Backbone.Collection.extend({
        url: url._('push.sm.category')
    });

    return Collection;
});