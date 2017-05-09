<%
var base = data.base;
var kind = data.mchtKind;
var sections = [{
    caption: '身份证正面照',
    desc: '1）申请人或法人代表身份证正面照片；<br/>'+
          '2）必须看清证件号码，否则会被审核拒绝；<br/>'+
          '3）照片支持png、jpg格式，最大不超过2M。<br/>',

    name:'idCardFront',
    egTitle: '身份证正面照示例',
    thumbTitle: '证件正面照',
    thumbImg: './assets/images/mcht/l_2.jpg',
    belong: 'B1,B2,branch'
},{
    caption: '身份证反面照',
    desc: '1）申请人或法人代表身份证反面照片；<br/>'+
          '2）必须看清证件号码，否则会被审核拒绝；<br/>'+
          '3）照片支持png、jpg格式，最大不超过2M。<br/>',

    name:'idCardBack',
    egTitle: '身份证反面照示例',
    thumbTitle: '证件反面照片',
    thumbImg: './assets/images/mcht/l_3.jpg',
    belong: 'B1,B2,branch'
},{
    caption: '手持身份证的照片',
    desc: '1）请手持身份证拍照；<br/>'+
          '2）照片需免冠，建议未化妆，需身份证本人手持证件；<br/>'+
          '3）必须看清证件号且证件号不能被遮挡；<br/>'+
          '4）照片支持png、jpg格式，最大不超过2M。<br/>',

    name: 'personWithIdCard',  
    egTitle: '手持身份证示例',
    thumbTitle: '手持证件照',
    thumbImg: './assets/images/mcht/l_1.jpg',
    bigImg: './assets/images/mcht/s_1.jpg',
    belong: 'B1,B2,branch',
    bigViewable:true
},{
    caption: '银行卡照片',
    desc:   '1）对私账户必须上传银行卡照片；<br/>'+
            '2）照片中的账号或卡号必需清晰可读；<br/>'+
            '3）照片支持png、jpg格式，最大不超过2M。<br/>',

    name: 'pbankCard',
    thumbTitle: '银行卡照片',
    egTitle: '开户照片实例',
    thumbImg: './assets/images/mcht/l_4.jpg',
    bigImg: './assets/images/mcht/s_4.jpg',
    bigViewable: true,
    belong: 'B1,B2,branch'
},{
    caption: '银行卡/开户许可证照片',
    desc: '1）对公账户必须上传开户许可证的正面照片；<br/>'+
          '2）照片中的账号或卡号必需清晰可读；<br/>'+
          '3）照片支持png、jpg格式，最大不超过2M。<br/>',

    name: 'bankCard',
    thumbTitle: '开户许可证正面照',
    egTitle: '开户许可证示例',
    thumbImg: './assets/images/mcht/khz.jpg',
    bigImg: './assets/images/mcht/khz.jpg',
    bigViewable: true,
    belong: 'B1,B2,branch'
},{
    caption: '委托清算协议书盖章页',
    desc: '1）必须能看清盖章/签名与协议内容；<br/>'+
          '2）照片支持png、jpg格式，最大不超过2M。<br/>',

    name: 'agreement',
    thumbTitle: '委托清算协议书盖章页',
    egTitle: '委托清算协议书盖章页示例',
    thumbImg: ''
},{
    caption: '营业执照的照片',
    desc: '1）确保有年检章的企业营业执照副本扫描照片；<br/>'+
          '2）必须看清证件内容描述；<br/>'+
          '3）照片支持png、jpg格式，最大不超过2M。<br/>',
    name: 'license',
    egTitle: '营业执照示例',
    thumbTitle: '营业执照',
    thumbImg: './assets/images/mcht/l_5.jpg',
    belong: 'B1,B2,branch'
},{
    caption: '店铺门头照',
    desc: '1）申请人站在店门口或店内拍照；<br/>'+
          '2）需清晰拍出店铺招牌，包含店铺名称或地址门牌号；<br/>'+
          '3）店铺应该正在营业；<br/>'+
          '4）照片支持png、jpg格式，最大不超过2M。<br/>',

    name: 'shopFrontImg',
    egTitle: '店铺门头示例',
    thumbTitle: '店铺门头照',
    thumbImg: './assets/images/mcht/l_7.jpg',
    belong: 'B1,B2'
},{
    caption: '店内全景照',
    desc: '1）需体现商户的实际经营情况；<br/>'+
          '2）主营产品并与营业执照经营业务范围相符；<br/>'+
          '3）照片支持png、jpg格式，最大不超过2M；<br/>',

    name: 'shopInnerImg',
    egTitle: '店内全景示例',
    thumbTitle: '店内全景照',
    thumbImg: './assets/images/mcht/l_8.jpg',
    belong: 'B1,B2'
},{
    caption: '商户收银台照片',
    desc: '1）收银台照片应与店内产品相关联；<br/>'+
          '2）若店铺没有收银台，可上传其他能反应商户经营情况的照片；<br/>'+
          '3）照片支持png、jpg格式，最大不超过2M；<br/>',

    name: 'checkstandImg',
    egTitle: '商户收银台示例',
    thumbTitle: '商户收银台照片',
    thumbImg: './assets/images/mcht/l_9.jpg',
    belong: 'B1,B2'
},{
    caption: '商品照片',
    desc: '1）商户的主营商品，需体现商户的真实经营情况；<br/>'+
          '2）照片支持png、jpg格式，最大不超过2M；<br/>',

    name: 'productImg',
    egTitle: '商品照片示例',
    thumbTitle: '商品照片',
    thumbImg: './assets/images/mcht/l_10.jpg',
    belong: 'B1,B2'
},{
    caption: '组织机构代码证',
    desc: '1）必须能看清盖章与证件内容；<br/>'+
          '2）照片支持png、jpg格式，最大不超过2M。<br/>',

    name:'orgImage',
    egTitle: '组织机构证示例',
    thumbTitle: '组织机构证照片',
    thumbImg: './assets/images/mcht/org.JPG',
    belong: 'B1,B2,branch'
},{
    caption: '税务登记证',
    desc: '1）必须能看清盖章与证件内容；<br/>'+
          '2）照片支持png、jpg格式，最大不超过2M。<br/>',

    name:'taxImage',
    egTitle: '税务登记表示例',
    thumbTitle: '税务登记表照片',
    thumbImg: './assets/images/mcht/tax.JPG',
    belong: 'B1,B2,branch',
    optinal: true
}];
%>
<div class="mcht-form-group mcht-add-pic">
  <form role="form">
  <%for(var i = 0; i < sections.length; i++){
    var item = sections[i];
  %>
    <div class="pull-left section <%=item.name%>-section" belong="<%=item.belong%>">

      <div class="caption"><%=item.caption%></div>

      <div class="upload-section row" name="<%=item.name%>">

        <div class="section-left col-xs-6">
          <div class="upload-trigger <%= item.optinal===true ? 'optinal' : '' %>">
            <div class="btn-panel">
                <i class="icon icon-trash remove-trigger" title="清空图片"></i>
            </div>
            <div class="preview-container">
                <span class="vertical-helper"></span><img src="">
            </div>
            <div class="uploading-indicator middle-wrap"> 
              <div class="v-align-middle indicator">
                <span class="icon-wrap">
                  <i class="icon-spinner icon-spin"></i>
                  <span class="progress-percent" ></span>
                </span>正在上传
              </div>
            </div>
            <i class="icon-plus icon-trigger hx-font100"></i>
            <div class="add-tips">点击此处添加照片</div>
          </div>

        </div>

        <div class="section-right prompt-wrap col-xs-6">
          <%=item.desc%>
          <br>
          <p><%=item.egTitle%></p>
          <div class="example-image-wrap">
            <img data-fancybox-group="gallery" src="<%=item.thumbImg%>">
            <%if(item.bigViewable){%>
              <a class="view-example-trigger fancybox" href="<%=item.bigImg%>">查看大图</a>
            <%}%>
          </div>
        </div>

      </div>

    </div>
<%}%>
  <div class="clearfix"></div>
  </form>
</div>