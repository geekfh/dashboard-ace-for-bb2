<div class="mcht-query">
	<div class="mcht-for-line row">
		<form action="#mcht-query-result" class="col-lg-4 col-md-4 col-xs-11 mcht-form">
			<fieldset class="mcht-query-input">
				<legend class="mcht-query-input-title">商户基本信息</legend>
				<div class="mcht-span">
					<label class="mcht-label mcht-error">手机号&nbsp;&nbsp;</label>
					<div class="mcht-input">
						<input type="text"  name="phoneNo" class="mcht-telphone filter" placeholder="请输入完整的手机号">
					</div>
				</div>
				<div class="mcht-span">
					<label class="mcht-label">商户号&nbsp;&nbsp;</label>
					<div class="mcht-input">
						<input type="text" value="" name="mchtNo"  class="mcht-no filter">
					</div>
				</div>
				<!--<div class="mcht-span">-->
					<!--<label class="mcht-label">终端号&nbsp;&nbsp;</label>-->
					<!--<div class="mcht-input">-->
						<!--<input type="text" value="" name="termNo"  class="mcht-mgr-no filter">-->
					<!--</div>-->
				<!--</div>-->
				<div class="mcht-span">
					<label class="mcht-label">商户名&nbsp;&nbsp;</label>
					<div class="mcht-input">
						<input type="text" value="" name="mchtName"  class="mcht-name filter">
					</div>
				</div>

				<div class="mcht-span">
					<label class="mcht-label">SN号&nbsp;&nbsp;&nbsp;</label>
					<div class="mcht-input">
						<input type="text" name="snNo" class="mcht-snNo filter">
					</div>
				</div>
			</fieldset>

			<!--<fieldset class="mcht-query-sn">-->
				<!--<legend class="mcht-query-sn-title">POS机具SN号</legend>-->
				<!--<div class="mcht-sn-display">-->
					<!--<div class="mcht-span">-->
						<!--<label class="mcht-label">SN号&nbsp;&nbsp;&nbsp;</label>-->
						<!--<div class="mcht-input">-->
							<!--<input type="text" name="snNo" class="mcht-snNo filter">-->
						<!--</div>-->
					<!--</div>-->
					<!--&lt;!&ndash;<div class="mcht-span">&ndash;&gt;-->
						<!--&lt;!&ndash;<label class="mcht-label">终端类型&nbsp;&nbsp;&nbsp;</label>&ndash;&gt;-->
						<!--&lt;!&ndash;<div class="mcht-input">&ndash;&gt;-->
							<!--&lt;!&ndash;<input type="text" name="termTypeId">&ndash;&gt;-->
						<!--&lt;!&ndash;</div>&ndash;&gt;-->
					<!--&lt;!&ndash;</div>&ndash;&gt;-->
				<!--</div>-->
				<!--<div class="mcht-span mcht-a">-->
					<!--<a class="mcht-span mcht-input mcht-show-display" href="javascript: void(0);">展开筛选条件</a>-->
				<!--</div>-->
			<!--</fieldset>-->

			<div class="mcht-query-button">
				<table width="100%">
					<tr>
						<td style="text-align: left;">
							<input class="btn btn-primary mcht-submit" type="submit" value="搜索商户" name="mcht-submit" />
						</td>
						<td style="text-align: right;">
							<input class="btn mcht-reset" type="reset" value="清除搜索条件" name="mcht-reset" />
						</td>
					</tr>
				</table>
			</div>
		</form>
		<div class="mcht-query-line"></div>

		<div class="mcht-query-result col-lg-6 col-md-6 col-xs-11" id="mcht-query-result" name="mcht-query-result">			
				<div class="mcht-result-table" id="mcht-result-table"></div>
				<div class="foot">
					<ul class="opf-pager pager">

						<li class="page-info">
							<span class="mcht-text"></span>							
						</li>	
							
						<li class="previous active">
							<a href="javascript:void(0);">上一页</a>
						</li>
						
						<li class="next active">
							<a href="javascript:void(0);">下一页</a>
						</li>		
																														
					</ul>
				</div>
			</div>
		</div>
	</div>