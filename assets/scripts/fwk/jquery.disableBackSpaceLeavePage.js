//禁止回退键盘导致的离开页面
define(function () {
    disableBackspaceLeavePage();

    function disableBackspaceLeavePage(event) {

        $(document).bind('keydown', hanlder);
        $(document).bind('keypress', hanlder);

        var TEXT_RE = /^text|password|file|date|datetime|datetime-local|month|week|time|email|number|range|search|tel|url$/;

        function hanlder (event) {

            var doPrevent = false;//默认不禁止

            //如果是回退键,才考虑禁止默认行为
            if (event.keyCode === 8) {
                
                var target = event.srcElement || event.target,
                    type = target.type ? target.type.toLocaleLowerCase() : '',
                    tagName = target.tagName.toLocaleLowerCase();

                //如果是输入类的元素，那么是否禁止取决于是否可编辑，不可编辑则禁止回退
                if ((tagName === 'input' && TEXT_RE.test(type)) || tagName === 'textarea') {
                    doPrevent = target.readOnly || target.disabled;
                } else {
                    doPrevent = true;
                }
            }

            if (doPrevent) {
                event.preventDefault();
            }
        }
    }
});