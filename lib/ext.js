/* Copyright (c) 2009 Mustafa OZCAN (http://www.mustafaozcan.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Version: 1.0.2
 * Requires: jquery.1.3+
 */
jQuery.fn.fixedtableheader = function(options) {
	var settings = jQuery.extend({
		headerrowsize : 1,
		highlightrow : false,
		highlightclass : "highlight"
	}, options);
	this.each(function(i) {
				var $tbl = $(this);
				var $tblhfixed = $tbl.find("tr:lt(" + settings.headerrowsize
						+ ")");
				var headerelement = "th";
				if ($tblhfixed.find(headerelement).length == 0)
					headerelement = "td";
				if ($tblhfixed.find(headerelement).length > 0) {
					$tblhfixed.find(headerelement).each(function() {
						$(this).css("width", $(this).width());
					});
					
//					var $clonedTable = $tbl.clone().empty();
//					var tblwidth = GetTblWidth($tbl);
//					$clonedTable.attr("id", "fixedtableheader" + i).css({
//						"position" : "fixed",
//						"top" : "0",
//						"left" : $tbl.offset().left
//					}).append($tblhfixed.clone()).width(tblwidth).hide()
//							.appendTo($("body"));

					var tblwidth = GetTblWidth($tbl);
					var $clonedHead = $tbl.clone().empty().append($tblhfixed.clone()).width(tblwidth);
					
					$clonedHead.attr("id","newid");
					if($clonedHead.find('img').length == 0){
						$('#newid #ceil').append('<img class="sort_img" src="http://event.caifutong.com.cn/images/detail/asc.gif">');
					}
					
					var $clonedTable = $('<div></div>').append($('#detail_nav').clone()).append($clonedHead);
					
					$clonedTable.attr("id", "fixedtableheader" + i).css({
						"position" : "fixed",
						"top" : "0",
						"left" : $tbl.offset().left
					}).hide().appendTo($("body"));
					if (jQuery.browser.msie	&& jQuery.browser.version == "6.0"){
						$clonedTable.prepend('<iframe style="width:100%;filter:alpha(opacity=0);-moz-opacity:0; height:185px; position:absolute; z-index:-1"></iframe>');
					}
					
					if (settings.highlightrow)
						$("tr:gt(" + (settings.headerrowsize - 1) + ")", $tbl)
								.hover(
										function() {
											$(this).addClass(
													settings.highlightclass);
										},
										function() {
											$(this).removeClass(
													settings.highlightclass);
										});
					$(window).scroll(
									function() {
										if (jQuery.browser.msie
												&& jQuery.browser.version == "6.0")
											$clonedTable.css({
												"position" : "absolute",
												"top" : $(window).scrollTop(),
												"left" : $tbl.offset().left,
												"z-index" : "1"
											});
										else
											$clonedTable.css({
												"position" : "fixed",
												"top" : "0",
												"left" : $tbl.offset().left
														- $(window).scrollLeft()
											});
										var sctop = $(window).scrollTop();
										if (sctop > 0)
											$clonedTable.show();
										else
											$clonedTable.hide();
									});
					$(window).resize(
							function() {
								if ($clonedTable.outerWidth() != $tbl.outerWidth()) {
									$tblhfixed.find(headerelement).each(
											function(index) {
												var w = $(this).width();
												$(this).css("width", w);
												$clonedTable
														.find(headerelement)
														.eq(index).css("width",
																w);
											});
									$clonedTable.width($tbl.outerWidth());
								}
								$clonedTable.css("left", $tbl.offset().left);
							});
				}
			});
	function GetTblWidth($tbl) {
		var tblwidth = $tbl.outerWidth();
		return tblwidth;
	}
};