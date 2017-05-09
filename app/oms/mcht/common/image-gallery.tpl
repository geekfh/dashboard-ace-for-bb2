<div class="btn-panel">
    <i class="icon-resize-full enterFullScreen"></i>
    <i title="上一张" class="icon-arrow-left prev"></i>
    <i title="下一张" class="icon-arrow-right next"></i>
    <i title="图片左转" class="icon-rotate-left turnLeft"></i>
    <i title="图片右转" class="icon-rotate-right turnRight"></i>
    <i title="关闭" class="icon-remove clickClose"></i>
</div>
<div class="gallery royalSlider rsDefault  rsDefaultInv ">
<%for(var i = 0; i < items.length; i++){
    var item = items[i];
%>
    <div class="rsContent">
        <a class="rsImg bugaga"  data-rsBigImg='<%=item.url + "?_t=" + (item._t || (new Date()).getTime()) %>' href='<%=item.url + "?_t=" + (item._t || (new Date()).getTime()) %>'>
            <div class="rsTmb">
                <img src='<%=item.url + "?_t=" + (item._t || (new Date()).getTime()) %>' /><div class="tmb-text"><%=item.tmbDescr%></div>
            </div>
        </a>
        <div class="img-bottom-wrap">
            <%if(item.bimgDescr) {%>
                <%=$.isFunction(item.bimgDescr) ? item.bimgDescr() : item.bimgDescr%>
            <%}%>
            <%if(item.check === true || item.check === false){%>
             <div>
                 <input name="<%=item.name%>" id="mcht-img-check-<%=item.name%>" type="checkbox"  <%=item.check ? 'checked="checked"' : ''%>>
                 <label for="mcht-img-check-<%=item.name%>">&nbsp;&nbsp;照片有误</label>
             </div>
            <%}%>
        </div>
    </div>
<%}%>
</div>
