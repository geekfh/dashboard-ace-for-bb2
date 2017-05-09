define([
    'assets/scripts/fwk/function',
    'jquery'
], function(Funcs) {

    var SS_MAX = 480;
    var XS_MIN = 481,
        XS_MAX = 767;
    var SM_MIN = 768,
        SM_MAX = 991;
    var MD_MIN = 992,
        MD_MAX = 1199;
    var LD_MIN = 1200;

    var mediaNames = {
        'ss': 10, // [0,    480]
        'xs': 20, // [481,  781]
        'sm': 30, // [782,  991]
        'md': 40, // [992,  1199]
        'ld': 50  // [1200, +oo]
    };

    /*
     xs        sm        md          ld
    [0, 767]  [768, 991] [992, 1199] [1200,+00);
    */
   

    var Media = {
        SS: 'ss',
        XS: 'xs',
        SM: 'sm',
        MD: 'md',
        LD: 'ld',

        calcName : function() {
            var w = $(window).width();
            if (w >= LD_MIN) {
                return 'ld';
            } else if (w >= MD_MIN) {
                return 'md';
            } else if (w >= SM_MIN) {
                return 'sm';
            } else if (w >= XS_MIN) {
                return 'xs';
            } else {
                return 'ss';
            }
        },

        currentName: function() {
            return Media.calcName();
        },
        /**
         * [compareName description]
         * @param  {[type]} left  [description]
         * @param  {[type]} right [description]
         * @return left > right return 1, left = right return 0
         *                left < right return -1
         */
        compareName: function(left, right) {
            var l = mediaNames[left],
                r = mediaNames[right];

            if (!l && !r) return 0;

            if (!r) return 1;

            if (!l) return -1;

            var delta = l - r;

            return delta === 0 ? 0 : delta / Math.abs(delta);
        },

        gt: function(left, right) {
            if(arguments.length === 1) {
                right = left;
            }
            left = this.currentName();
            return Media.compareName(left, right) > 0;
        },

        ge: function(left, right) {
            if(arguments.length === 1) {
                right = left;
            }
            left = this.currentName();
            return Media.compareName(left, right) >= 0;
        },

        lt: function(left, right) {
            if(arguments.length === 1) {
                right = left;
            }
            left = this.currentName();
            return Media.compareName(left, right) < 0;
        },

        le: function(left, right) {
            if(arguments.length === 1) {
                right = left;
            }
            left = this.currentName();
            return Media.compareName(left, right) <= 0;
        },

        range: function(val, l, r, lEq, rEq) {
            if (!val) return false;

            //TODO arg protect
            lEq = lEq === false ? false : true;
            rEq = rEq === false ? false : true;

            var comparator = Media.compareName;
            var lValid, rValid,
                lRet, rRet;

            if (!l) {
                lValid = true;
            } else {
                //close range then > -1 means >= 0
                //open range then > 0
                lRet = comparator(val, l);
                lValid = lRet > (lEq ? -1 : 0);
            }

            if (!r) {
                rValid = true;
            } else {
                rRet = comparator(r, val);
                rValid = rRet > (rEq ? -1 : 0);

            }

            return lValid && rValid;
        }
    };

    var RESIZE_BUF = 150;

    var initMd = Media.calcName();
    $(document.body).addClass(initMd);
    $(window).data('mediaName', Media.calcName());

    $(window).bind('resize.responsive', Funcs.createBuffered(function() {

        var newMdName = Media.calcName();
        var lastMdName = $(this).data('mediaName');

        if (lastMdName !== newMdName) {
            $(this).data('mediaName', newMdName);
            $(window).trigger('responsive', [lastMdName, newMdName]);

            $(window).trigger('responsive.enter', [newMdName, lastMdName]);
            $(window).trigger('responsive.enter.' + newMdName);

            $(window).trigger('responsive.leave', [lastMdName, newMdName]);
            $(window).trigger('responsive.leave.' + lastMdName, [newMdName]);
        }

    }, RESIZE_BUF)).trigger('resize.responsive');
    
    return Media;

});