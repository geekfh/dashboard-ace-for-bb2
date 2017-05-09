<td class="cell  text-center"><%=statusFormat(this)%></td>

<td class="cell  wrap text-center hidden-xs">
    <i class="icon <%=typeIcon%>"></i><%=typeDescr%>
</td>
<td class="cell  text-center"><%=name%><%=isPriority%></td>
<td class="cell  beginer text-center"><%=beginOpr%></td>
<td class="cell  time text-center hidden-xs" title="<%=submitTime%>">
    <%=Opf.String.replaceFullDate(submitTime, '$1/$2/$3 $4:$5:$6')%>
</td>
<td class="cell  time text-center hidden-xs" title="<%=beginTime%>">
    <%=Opf.String.replaceFullDate(beginTime, '$1/$2/$3 $4:$5:$6')%>
</td>
