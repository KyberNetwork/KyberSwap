$(document).foundation()

$(document).ready(function(){
	
	var initUrl = $("#menu a").attr("data-href");
	$.get( initUrl, function( data ) {
	  $("#content").html(data);
	});
	$("#menu a:not(.disable").on('click', function(){
		//url
		//console.log($(this).attr("aria-selected"))
		if ($(this).attr("aria-selected") === 'true'){
			return;
		}
		var url = $(this).attr("data-href");

		$.get( url, function( data ) {
		  $("#content").html(data);
		});
		//console.log(url);
	})

	//for selected
	$(".k-select").each(function(){
		var _this = this;
		if($(this).find('.k-select-option > div.selected').length !== 1){
			(this).find('.k-select-option > div').removeClass('selected')
			(this).find('.k-select-option > div:first-child').addClass('selected')
		}
		$(this).find(".k-select-display").html($(this).find('.k-select-option div.selected').html());
		$(this).find(".k-select-display").on('click', function(){
			var option = $(_this).find('.k-select-option');
			if(option.is(":visible")){
				$(_this).find('.k-select-option').hide();	
			}else{
				$(_this).find('.k-select-option').show();	
			}			
		})
		$(this).find(".k-select-option > div").on('click', function(){
			if(!$(this).hasClass('selected')){
				$(_this).find('.k-select-option >div.selected').removeClass('selected');
				$(this).addClass('selected')
				$(_this).find(".k-select-display").html($(this).html());				
			}
			$(_this).find('.k-select-option').hide();
		})
	})
})