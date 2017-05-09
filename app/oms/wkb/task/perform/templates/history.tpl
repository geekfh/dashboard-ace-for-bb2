<%
    var type = type || '';
    var MAP = {
        '11':{ oprTypeDesc:'任务保存', needDesc:false, icon:'icon-ok green'},
        '12':{ oprTypeDesc:'任务提交', needDesc:false, icon:'icon-ok green'},
        '13':{ oprTypeDesc:'任务修改再提交', needDesc:false, icon:'icon-edit yellow'},
        '14':{ oprTypeDesc:'任务删除', needDesc:false, icon:'icon-trash red'},
        '21':{ oprTypeDesc:'审核1', needDesc:true, icon:''},
        '22':{ oprTypeDesc:'审核2', needDesc:true, icon:''},
        '23':{ oprTypeDesc:'审核3', needDesc:true, icon:''},
        '31':{ oprTypeDesc:'任务协作1', needDesc:true, icon:''},
        '32':{ oprTypeDesc:'任务协作2', needDesc:true, icon:''},
        '33':{ oprTypeDesc:'任务协作3', needDesc:true, icon:''}
    };

    var options = function(oprType,oprStatus,oprDesc){
        var icon, oprTypeDesc, desc;

        if(MAP[oprType].needDesc){
            if(oprStatus == 0){
                icon = 'icon-ok green';
                oprTypeDesc = MAP[oprType].oprTypeDesc + '已通过';
                desc = '通过原因：'+ (oprDesc ? oprDesc : '无');
            }else if(oprStatus == 1){
                icon = 'icon-remove red';
                oprTypeDesc = MAP[oprType].oprTypeDesc + '被拒绝';
                desc = '拒绝原因：'+ oprDesc;
            }
        }else{
            icon = MAP[oprType].icon;
            oprTypeDesc = MAP[oprType].oprTypeDesc;
        }

        return {
            icon: icon,
            oprTypeDesc: oprTypeDesc,
            oprDesc: desc
        };
    };

    var beginOpr = keyName+'&nbsp;-&nbsp;'+beginOprName;
    var subType = subType || '', isBeginOpr=false;
    if(subType=='205'||subType=='207'||subType=='304'){
        beginOpr = '钱盒商户';
        isBeginOpr = true;
    }
%>


<div class="history-wrapper task-history">
    <div class="arrow" ></div>
    <div class="arrow-border" ></div>

    <div class="inner-wrapper">
        <div class="checkHistoryHead">
            <div class="taskId">编号：<%=taskId%></div>
            <div class="vetical">|</div>
            <div class="taskStep">步骤：<span style="color: red"><%=nowStep%></span> / <%=taskStep%></div>
        </div>

        <div class="checkPeopleInfo">
            <div class="beginOprName">
                <strong>发起人：</strong><%=beginOpr%>
            </div>

            <% if(expandName){ %>
            <div class="expand">
                <strong><%=type == 'user' ? '操作员：' : '拓展员：'%></strong><%=expandName%> ( <%=expandMobile%> )
            </div>
            <% } %>

            <%
                var _beginTime = moment(beginTime,'YYYYMMDDhhmm').formatCnFull();
            %>
            <div class="beginTime">
                <strong>发起时间：</strong><%=_beginTime%>
            </div>
            
            <% if(twoLevelBrhName&&!isBeginOpr){ %>
            <div class="twoLevelBrhName">
                <strong>二级机构名称：</strong><%=twoLevelBrhName%>
            </div>
            <% } %>
        </div>

        <div class="taskDetails">
            <%
            for(var i = 0,len=taskDetails.length; i < len; i++) {
                var item = taskDetails[i];
                var itemOptions = options(item.oprType, item.oprStatus, item.oprDesc);
                console.log('taskDetails>>>>>>>>>>>', itemOptions);
            %>  
                <div class="desc"></div>
                <div class="single-state">
                    <div class="status">
                        <i class="icon <%=itemOptions['icon']%>"></i>
                    </div>
                    <i class="icon icon-circle"></i>
                    <%
                    var _oprTime = moment(item.oprTime,'YYYYMMDDhhmm').formatCnFull();
                    %>
                    <div class="taskInfo">
                        <strong><%=_oprTime%></strong>
                    </div>
                </div>
                <div class="opr-name">
                    <span>操作人：<%= /^2/.test(item.oprType)? item.oprName:beginOpr%></span>
                </div>
                <div class="desc"><span><%=itemOptions['oprTypeDesc']%></span></div>
                <% if(itemOptions['oprDesc']){ %>
                <div class="desc">
                    <span><%=itemOptions['oprDesc']%></span>
                </div>
                <% } %>
            <% } %>
        </div>
    </div>
</div>