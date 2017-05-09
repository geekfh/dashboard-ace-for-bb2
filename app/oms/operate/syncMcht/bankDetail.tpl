<%
    var model = data;
%>
<div>
    <table style="width: 100%!important; text-align: center!important;" class="table table-striped table-bordered table-hover">
        <tbody>

        <%_.each(model, function (v, i) { %>
        <tr>
            <td class=""><%=v.bankName%></td>
        </tr>
        <% });%>
        </tbody>
    </table>
</div>