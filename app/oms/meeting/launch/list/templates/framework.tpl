<!-- framework -->
<style type="text/css">
    .meeting-info label.error {
        display: inline-block;
    }
</style>

<!-- 参数 -->
<div class="row">
    <div class="condition-wrap">
        <div class="condition-group">
            <fieldset class="meeting-info">
                <legend>会议设置</legend>
                <form id="J_meeting" class="fieldset-innerwrap">
                    <div class="filters">
                        <div class="opf-filters-panel">
                            <div class="filter-form-group form-group">
                                <div class="filter-group-label">
                                    <label class="the-label">会议链接：</label>
                                </div>
                                <div class="filter-group-content">
                                    <input type="text" name="url" class="filter-input" style="width:480px;" />
                                </div>
                            </div>
                        </div>
                        <div class="opf-filters-panel">
                            <div class="filter-form-group form-group">
                                <div class="filter-group-label">
                                    <label class="the-label">会议说明：</label>
                                </div>
                                <div class="filter-group-content">
                                    <textarea name="remark" class="filter-input" style="width:480px;height:100px;line-height:20px;"></textarea>
                                </div>
                            </div>
                            <div class="filter-form-group form-group" style="vertical-align: bottom;">
                                <button type="button" name="submitBtn" class="btn btn-primary search-btn">提交</button>
                            </div>
                        </div>
                    </div>
                </form>
            </fieldset>
        </div>
    </div>
</div>

<!-- 列表 -->
<div class="row">
    <div class="col-xs-12 jgrid-container">
        <table id="meeting-launch-grid-table"></table><!-- 数据表格 -->
        <div id="meeting-launch-grid-pager" ></div><!-- 分页 -->
    </div>
</div>