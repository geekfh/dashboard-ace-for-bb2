;(function ($) {

var DATA_KEY = 'wizard';

function Wizard (el, options) {
    var element = $(el);
    var me = this;

    var settings = $.extend({}, $.fn.wizard.defaults, options);
    me.$navigation = element.find(navigationSelector);
    me.$activeTab = $navigation.find(settings.tabItemSelector + '.active');

    // Load onInit
    if(settings.onInit && typeof settings.onInit === 'function'){
        settings.onInit($activeTab, $navigation, 0);
    }

    this.fixNavigationButtons();
}

Wizard.prototype = {

    show: function () {

    },

    fixNavigationButtons : function() {
        // Get the current active tab
        if(!me.$activeTab.length) {
            // Select first one
            // me.$navigation.find('a:first').tab('show');
            // $activeTab = $navigation.find(baseItemSelector + ':first');
        }

        // See if we're currently in the first/last then disable the previous and last buttons
        $($settings.previousSelector, element).toggleClass('disabled', (obj.firstIndex() >= obj.currentIndex()));
        $($settings.nextSelector, element).toggleClass('disabled', (obj.currentIndex() >= obj.navigationLength()));

        // We are unbinding and rebinding to ensure single firing and no double-click errors
        obj.rebindClick($($settings.nextSelector, element), obj.next);
        obj.rebindClick($($settings.previousSelector, element), obj.previous);
        obj.rebindClick($($settings.lastSelector, element), obj.last);
        obj.rebindClick($($settings.firstSelector, element), obj.first);

        if($settings.onTabShow && typeof $settings.onTabShow === 'function' && $settings.onTabShow($activeTab, $navigation, obj.currentIndex())===false){
            return false;
        }
    }
};


$.fn.wizard = function(options) {
    //如果参数是字符串，则表示调用方法
    if (typeof options == 'string') {
        var args = Array.prototype.slice.call(arguments, 1);
        if(args.length === 1) {
            args.toString();
        }
        return this.data(DATA_KEY)[options](args);
    }

    //如果是参数是配置对象，则创建一个Wizard实例，并通过data方法挂到jdom元素上
    return this.each(function(index){
        var element = $(this);
        // Return early if this element already has a plugin instance
        if (element.data(DATA_KEY)) return;
        // pass options to plugin constructor
        var wizard = new Wizard(element, options);
        // Store plugin object in this element's data
        element.data(DATA_KEY, wizard);
    });
};

//暂时把进度向导的某部叫一个tab,便于后期与bootstrap的tab直接集成
 $.fn.wizard.defaults = {
    navigationSelector: 'ul:first',//.wizard-progress
    tabItemSelector:    'li:has([data-toggle="tab"])',//.wizard-progress .step
    nextSelector:       '.wizard li.next',//.wizard-panel .btn-next
    previousSelector:   '.wizard li.previous',//.wizard-panel .btn-previous
    onShow:             null,
    onInit:             null,
    onNext:             null,
    onPrevious:         null,
    onTabShow:          null//保留与bs的tab同名事件
};   
    

})(jQuery);