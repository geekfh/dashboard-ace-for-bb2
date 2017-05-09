define([], function(){
    var CommonGrid = {};

    CommonGrid.addDownloadBtn = function (opt) {
        //加上下载报表的按钮
        var grid = opt.grid,
            dlUrl = opt.dlUrl,
            params = opt.params,
            gid = grid.jqGrid('getGridParam', 'gid');

        Opf.Grid.navButtonAdd(grid, {
            caption: '<span class="dl-text">下载报表</span>',//<i class="icon-download"></i>
            name: gid + "Dl",
            title:'下载报表',
            buttonicon: 'icon-download smaller-80',
            id: 'dl-'+ gid,
            onClickButton: function() {
                var $dlBtn = $('#dl-'+ gid);
                if($dlBtn.data('without-data')){
                    Opf.alert('报表中没有数据，无法下载报表！');
                    return false;
                }
                params = $dlBtn.data('postData') || params;
                if(!$dlBtn.hasClass('disabled-dl')){
                    $dlBtn.find('.dl-text').text('请求中...');
                    $dlBtn.addClass('disabled-dl');
                    Opf.ajax({ 
                        url: dlUrl,
                        type:'GET',
                        data: params,
                        success: function(resp) {
                            var source = resp.data || resp.url;
                            source && Opf.download(source);
                            $dlBtn.find('.dl-text').text('下载报表');
                            $dlBtn.removeClass('disabled-dl');
                            // downloadInverse($dlBtn);
                        }
                    });
                }
            },
            position: "last"
        });   
    };

    CommonGrid.blendHeadBody = function (grid) {
        var $head, $gridWrap = $(grid).closest('.ui-jqgrid');
        var $htable = $gridWrap.find('.ui-jqgrid-htable');
        var $btable = $gridWrap.find('.ui-jqgrid-btable');

        $head = $htable.find('thead');
        if($head.length){
            grid.headHtml = $head.html();
        }

        $htable.find('thead').remove();
        $btable.find('thead').remove();
        var $h = $('<thead></thead>').append(grid.headHtml);
        $btable.prepend($h);
        $h.find('.ui-jqgrid-sortable').css('padding-left', '0');
        $h.find('span.ui-jqgrid-resize').remove();
    };

    CommonGrid.setDownloadPostData = function (dlBtn, postData) {
        $(dlBtn).data('postData', postData);
    };

    CommonGrid.checkCanDownload = function (dlBtn, data) {
        var $dlBtn = $(dlBtn);

        $dlBtn.data('without-data', false);
        if(!data || !data.length){
            $dlBtn.data('without-data', true);
        }
    };

    //下载报表完毕后倒数
    function downloadInverse (el) {
        var $el = $(el);
        var timer, waitTime = 5;
        timer = setInterval(function(){
            $el.find('.dl-text').text(waitTime + '秒后可下载');
            waitTime = waitTime - 1;
            if(waitTime == -1) {
                $el.find('.dl-text').text('下载报表');
                $el.removeClass('disabled-dl');
                clearInterval(timer);
            }
        }, 1000);
    }

    return CommonGrid;

});