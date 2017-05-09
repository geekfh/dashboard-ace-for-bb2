<%
    var Map = {
        '0': '一级代理商',
        '1': '分销商'
    }
%>

<div class="innerwrap">

    <div class="wizard-head row" hidden>
        <div class="caption col-lg-3 col-md-4 col-sm-4 col-xs-12">录入机构</div>
    </div>

    <div class="wizard-panel clearfix">
        <div class="top">
            <div class="wizard-caption pull-left">基本信息</div>
            <div class="btn btn btn-success btn-next pull-right">下一步:检测信息</div>
            <div class="btn btn btn-success btn-submit pull-right" style="display:none;">确认提交</div>
            <label class="pull-right">
                <a href="#" class="js-del" style="display:none; margin-right: 10px;">删除该申请</a>
            </label>
        </div>
        <div class="main">
           <div class="tab-content">
                <div class="tab-pane active" id="add-brh-info">
                </div>
                <div class="tab-pane active" id="add-brh-pic">
                </div>

                <div class="tab-pane" id="add-brh-confirm">
                </div>
            </div>                     
        </div>

        <div class="bottom">
            <div class="btn btn-primary pull-left btn-back">返回修改</div>
            <div class="btn btn btn-success btn-next pull-right">下一步:检测信息</div>
            <div class="btn btn btn-success btn-submit pull-right" style="display:none;">确认提交</div>
        </div>
        

    </div>

</div>