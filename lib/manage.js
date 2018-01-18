/**
 * 
 */
function AutoGetQuote(codestr,sort,fixhead){
    $.ajax({
		url: "http://hqdigi2.eastmoney.com/EM_Quote2010NumericApplication/CompatiblePage.aspx?Type=Z2&r="+Math.ceil(Math.random() * 100)+"&fav="+codestr,
		type : 'GET',
		cache: false,
		async : true,
		dataType : 'jsonp', // 类型
		jsonp : 'callback',
		complete : function(result) {
            eval(result);
			for(i=0;i in stockData.DataList;i++){
				if(stockData.DataList[i].length<=0){
					continue;
				}
				var stock_arr = stockData.DataList[i].split(",");
				var css_name = '';
				
				if(stock_arr[5] < 0){
					css_name = 'greena';
				}else if (stock_arr[5] > 0){
					css_name = 'reda';
				}else{
					css_name = 'common';
				}
				if(stock_arr[3] == 0){
					stock_arr[3] = '--';
				}
				$("#price_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[3]+'</span>');
				if ($("#DayClose_"+stock_arr[1]+"_"+i).length > 0){ 
					$("#DayClose_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[3]+'</span>');
				}
				stock_arr[4] = stock_arr[4].substring(0,stock_arr[4].length-1);
				$("#ceil_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[4]+'</span>');
				if ($("#DayIncreaseRatio_"+stock_arr[1]+"_"+i).length > 0){ 
					$("#DayIncreaseRatio_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[4]+'</span>');
				}
				
			}
			//旧版本
			if(sort == 1){
				sort_table('ceil','desc','detail_table');
			}else if(sort == 2){
			//新版本
				sort_click();
			}
			
			if(fixhead){
				$('#detail_table').fixedtableheader({
					headerrowsize:fixhead
				});
			}
			
		}
	});
}

function getPrice(cal,md5,end_date){
	var start_date = cal.selection.sel[0];
	var stock_id = $("#Rank"+md5+"StockId").val();
	$.ajax({
		url: "http://event.caifutong.com.cn/manage/getPriceByDate/"+stock_id+"/"+start_date+"/"+end_date+"/",
		type : 'GET',
		cache: false,
		async : true,
		dataType : 'json', // 类型
		success : function(result) {
			$("#Rank"+md5+"PriceHigh").val(result.maxzf);
			$("#Rank"+md5+"PriceLow").val(result.minzf);
			$("#Rank"+md5+"PriceAver").val(result.averzf);
		}
	});
}

//sort
var sort_column = [];
function sort_table(sort_key,sort_by,table){
	//默认desc
	if(!in_array(sort_column,sort_key)){
        sort_column[sort_key] = 'desc';
	}
	//修正sort_by
	if(sort_by){
		sort_column[sort_key] = sort_by;
	}
	
	//除了sortkey外，该表其他字段重置desc
	if(sort_key.indexOf('_') > 0){
		var pre = sort_key.split('_');
		if(pre[1] == 'ceil'){
			sort_column[pre[0]+'_price'] = 'desc';
		}else if(pre[1] == 'price'){
			sort_column[pre[0]+'_ceil'] = 'desc';
		}
	}else{
		for(var i in sort_column){
			if(i != sort_key){
				sort_column[i] = 'desc';
			}
		}
	}
	
	sort_column[sort_key] = sort_column[sort_key] == 'asc'?'desc':'asc';
	
	var $table = $('#'+table).find('tr');
	$.each( $table, function( index, row ){
		var findSortKey;
		findSortKey = function( $cell ){
            return isNaN($cell) ? 0 : parseFloat($cell);
	    }
		var zf = $(row).find('.'+sort_key).text();
		row.sortKey = findSortKey(zf);
	});
	
	
	if(sort_column[sort_key] == 'desc'){
		$table.sort(function( a, b ){
	        //降序
	        if(a.sortKey < b.sortKey)   return -1;
	        if(a.sortKey > b.sortKey)   return  1;                    
	        return 0;
	    });
	}else{
		$table.sort(function( a, b ){
	        //升序
	        if(a.sortKey < b.sortKey)   return 1;
	        if(a.sortKey > b.sortKey)   return  -1;                    
	        return 0;
	    });
	}
	
	$('table#'+table).empty();
	
	//旧版
	if(table == 'detail_table'){
		//去除 fixtablehead标识
		$('#newid').find('th .sort_img').remove();
		$('#newid #'+sort_key).append('<img class="sort_img" src="/images/asc.gif">');
		var i = 0;
		$.each($table, function(index, tr){
			//去除标识
			$(tr).find('th .sort_img').remove();
			if($(tr).find('td').length){
				i ++;
			}
			//序号
			if(index>0){
				$(tr).find('td:first').html(i);
			}else{
				//清除php排序
				$(tr).find('a').each(function(){
					if($(this).attr('href')){
						var href = [];
						href = $(this).attr('href').split('&direction=');
						$(this).attr('href',href[0]+"&direction=desc")
					}
				});
				
				//标识
				$(tr).find('#'+sort_key).append('<img class="sort_img" src="/images/'+sort_column[sort_key]+'.gif">');
			}
			$('table#'+table).append('<tr>'+$(tr).html()+'</tr>');
		});
		$("table#"+table+" tr:even").addClass("sec");
	}else{
	//新版
		$.each($table, function(index, tr){
			//去除标识
			$('#'+table+'_ul').find('.sort_img').remove();
			//增加标识
			$('#'+sort_key).before('<img class="sort_img" src="、images/'+sort_column[sort_key]+'.gif">');
			//生成表格
			$('table#'+table).append('<tr>'+$(tr).html()+'</tr>');
		});
		var sort_key_arr = sort_key.split("_");
		var i = sort_key_arr[0].substr(1,1);
		
		$('.sort_key').each(function(index){
			//不修改同栏目url
			if($(this).parent().parent().attr("id") != 'm'+i+'_table_ul'){
				var url = $(this).attr('href');
				var url_sort = sort_column[sort_key] == 'asc'?'desc':'asc';
				
				url = url.replace(eval("/s"+i+"=[^&]*/"),'s'+i+'='+sort_key_arr[1]+':'+url_sort);
				$(this).attr('href',url);
			}
		})
	}
}

function in_array(array,key){
	for(var i in array){
		if(i == key){
			return true;
		}
	}
	return false;
}

module.exports = function (codestr,sort,fixhead){
    $.ajax({
        url: "http://hqdigi2.eastmoney.com/EM_Quote2010NumericApplication/CompatiblePage.aspx?Type=Z2&r="+Math.ceil(Math.random() * 100)+"&fav="+codestr,
        type : 'GET',
        cache: false,
        async : true,
        dataType : 'jsonp', // 类型
        jsonp : 'callback',
        complete : function(result) {
            eval(result);
            var g_pj = 0.0;
            for(i=0;i in stockData.DataList;i++){
                if(stockData.DataList[i].length<=0){
                    continue;
                }
                var stock_arr = stockData.DataList[i].split(",");
                var css_name = '';
                if(stock_arr[5] < 0){
                    css_name = 'greena';
                }else if (stock_arr[5] > 0){
                    css_name = 'reda';
                }else{
                    css_name = 'common';
                }
                if(stock_arr[3] == 0){
                    stock_arr[3] = '--';
                }
                $("#price_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[3]+'&nbsp;,&nbsp;</span>');
                $("#SecurityName_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[2]+'</span>');//股票名称
                $("#SecurityCode_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+'('+stock_arr[1]+')</span>');//股票代码
                $("#IncreaseRatio3_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[5]+'</span>');//涨跌
                $("#IncreaseRatio5_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[12]+'</span>');//今开
                $("#IndustryName_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[14]+'</span>');//最高
                $("#IndustryIndexDayIncreaseRatio_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[10]+'</span>');//成交量


                if ($("#DayClose_"+stock_arr[1]+"_"+i).length > 0){
                    $("#DayClose_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[3]+'</span>');
                }
                stock_arr[4] = stock_arr[4].substring(0,stock_arr[4].length-1);
                $("#ceil_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[4]+'%</span>');
                if ($("#DayIncreaseRatio_"+stock_arr[1]+"_"+i).length > 0){
                    $("#DayIncreaseRatio_"+stock_arr[1]+"_"+i).html('<span class="'+css_name+'">'+stock_arr[4]+'</span>');
                }
                g_pj += parseFloat(stock_arr[4]);
            }

            if(stockData.DataList.length > 0)
                g_pj = parseFloat(g_pj / parseInt(stockData.DataList.length));
            else
                g_pj = 0.0;
            var pj_css_name = '';
            if(g_pj < 0)
            {
                pj_css_name = 'greena';
            }
            else if (g_pj > 0)
            {
                pj_css_name = 'reda';
            }
            else
            {
                pj_css_name = 'common';
            }
            $("#id_pj").html('<span class="'+pj_css_name+'">'+g_pj.toFixed(2)+'%</span>');

            //旧版本
            if(sort == 1){
                sort_table('ceil','desc','detail_table');
            }else if(sort == 2){
                //新版本
                sort_click();
            }

            if(fixhead){
                $('#detail_table').fixedtableheader({
                    headerrowsize:fixhead
                });
            }

        }
    });
}