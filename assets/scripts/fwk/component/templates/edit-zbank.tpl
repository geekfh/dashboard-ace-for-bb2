<div class="row row-text-font row-margintop zbank-tip-row">
    <div class="col-md-3 info-item-text"></div>
    <div class="col-md-8 hint-color">提示：支行名称可能有误</div>
</div>

<div class="row row-text-font row-margintop edit-zbank-btn-row">
    <div class="col-md-3 info-item-text">&nbsp;</div>
    <a class="col-md-9 update-bank">修改开户支行名称</a>
</div>

<form class="edit-zbank-form" onsubmit="return false;" hidden>
    <div class="row row-text-font row-margintop">
        <div class="col-md-3 info-item-text">修改为:</div>
        <div class="col-md-9 region-wrap">
            <select name="province"></select>
            <select name="city"></select>
            <select name="country"></select>
        </div>
    </div>

    <div class="row zbank-row">
        <div class="col-md-3 info-item-text">&nbsp;</div>
        <div class="col-md-9">
            <input class="zbank-input" name="zbankName" placeholder="输入支行名称">
            <input type="hidden" name="zbankNo">
        </div>
    </div>
    <div class="row zbank-btn-row">
        <div class="col-md-3 info-item-text">&nbsp;</div>
        <div class="col-md-9">
            <button class="btn btn-sm btn-success confirm-update-zbank">确认修改</button>
            <button class="btn btn-sm btn-danger cancel-update-zbank">取消修改</button>
        </div>
    </div>
</form>

<div class="row row-text-font row-margintop zbankNameModified-row" hidden>
    <div class="col-md-4 info-item-text">开户支行:</div>
    <div class="col-md-8">
        <span class="zbankNameModifiedTxt"></span>
    </div>
</div>