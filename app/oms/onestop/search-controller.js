define([
], function() {

    var Ctrl = {
        searchMcht: function (id) {
           var view;
           var me = this;
           
            require(['app/oms/onestop/search-view'], function(View) {

                //获取录入时的信息
                view = me.view = new View.Mcht();
                
                me._attachViewEvent();
                
                App.show(view);
                
                
            });
        },
        
        _attachViewEvent: function () {
            var me = this;
            var view;
            me.view.on('mcht-query-result:refresh', function (typeVal) {
            	$(".mcht-result-table").empty();
            	var isMaybeIllegal = "";
                if(!typeVal || !typeVal.content){
                    typeVal = {};
                    typeVal.totalElements = 0;
                    typeVal.content = [];
                }
                $.each(typeVal && typeVal.content, function(index, _value){
                	
                	isMaybeIllegal = "";                	
                    if(_value.matchPrimary === false){
                    	// isMaybeIllegal = "来访者可能不是法人代表/申请人";
                    }
                    var mchtFactoryHtml = [
                        '<div class="mcht-factory">',
                            '<span>' + _value.mchtName + '</span><br />',
                            '<span>' + (_value.phoneNo==null?"" : _value.phoneNo) + '</span><span style="color:red;">' + isMaybeIllegal + '</span>',
                        '</div>'
                    ].join('');
                    var $mchtFactory = $(mchtFactoryHtml).data('param', _value);

                    $(".mcht-result-table").append($mchtFactory);
                }); 
                try{
                	//对于不支持respond.min.js的IE8，不会在页面做出响应式处理，会全屏显示，此时应该去掉分割线.
                	if($(".mcht-for-line form").outerWidth() > $(".mcht-for-line").outerWidth() * 0.4){
                		$(".mcht-query-line").css("display", "none");
                	}else{
                		$(".mcht-query-line").css("display", "block");
                	}               	
                }catch(e){
                	 throw "浏览器不支持CSS3样式";
                }
                
                $(".mcht-query-result").css("display", "block");
                if(typeVal.totalElements <= 0){
                    $(".mcht-text").css("border", "none");
                	$(".mcht-text").html("未查到该商户信息");
                	$(".next").hide();
                    $(".previous").hide();
                }else{
                	var startAt = typeVal.number * typeVal.size + 1;
                	var endAt = startAt + typeVal.numberOfElements - 1;
                    $(".mcht-text").css("border", "1px solid #dddddd");
                	$(".mcht-text").html("第" + startAt + "~" + endAt + "条/共" + typeVal.totalElements + "条");
                   
                	if(typeVal.number <= 0){
                		$(".previous").removeClass().addClass("previous disabled");                		
                	}else{
                		$(".previous").removeClass().addClass("previous active");
                	}
                	if(typeVal.number+1 >= typeVal.totalPages){
                		$(".next").removeClass().addClass("next disabled");                		
                	}else{
                		$(".next").removeClass().addClass("next active");
                	}
                    if(typeVal.totalElements <= typeVal.size){
                        $(".next").hide();
                        $(".previous").hide();
                    }else{
                       
                        $(".next").show();
                        $(".previous").show();
                    }

                }
                location.href = "#mcht-query-result";                       
            });
        }
                  
    };
    return Ctrl;
});