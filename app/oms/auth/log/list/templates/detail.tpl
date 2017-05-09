<%
    var sModel = sModel;
    var mData = mData;

    var info = [
        {name :'mchtName' , value : '商户名'},
        {name :'kind' , value : '商户种类'},
        {name :'areaNo' , value : '地区码'},
        {name :'address' , value : '地区名'},
        {name :'group' , value : 'Mcc组'},
        {name :'mcc' , value : 'Mcc'},
        {name :'branchNo' , value : '所属机构'},
        {name :'branchName' , value : '机构姓名'},
        {name :'expandName' , value : '拓展员姓名'},
        {name :'stlmBranchNo' , value : '清算机构号'},
        {name :'stlmBranchName' , value : '清算机构名'},
        {name :'mchtDiscId' , value : '商户费率编号'},
        {name :'name' , value : '用户名称'},
        {name :'phone' , value : '手机号'},
        {name :'email' , value :' 邮箱'},
        {name :'cardNo' , value : '身份证号码'},
        {name :'no' , value : '卡号'},
        {name :'acctName' , value : '户名'},
        {name :'status' , value : '状态'},
        {name :'bankNo' , value : '总行号'},
        {name :'bankName' , value : '总行名'},
        {name :'zbankNo' , value : '支行号'},
        {name :'zbankName' , value : '支行名'},
        {name :'zbankCode' , value : '支行地区码'}
    ];

    var kind = {
        'A1': '开放注册个人商户',
        'A2': '开放注册企业商户',
        'A3': '新开放注册个人商户（钱盒开放注册）',
        'B1': '个体商户',
        'B2': '普通企业商户',
        'F1': '快捷商户'
    };

    var status = {
        0:'正常',
        1:'异常'
    };
%>

<form>
    <div id="div-soureInfo" style="width: 450px; max-width: 450px; float:left; padding: 0 0 0 30px;">
        <h5 class="header blue bolder smaller">修改前</h5>
        <div class="profile-user-info profile-user-info-striped">
            <textarea style="width:400px;height:450px;overflow: auto;"><%=Opf.String.replaceWordWrap(sModel)%></textarea>
        </div>
    </div>
    <div id="div-modifyInfo" style="width: 450px; max-width: 450px; float:left; padding: 0 0 0 30px;">
        <h5 class="header blue bolder smaller">修改后</h5>
        <div class="profile-user-info profile-user-info-striped">
            <textarea style="width:400px;height:450px;overflow: auto;"><%=Opf.String.replaceWordWrap(mData)%></textarea>
        </div>
    </div>
</form>