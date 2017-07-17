$(document).ready(function(){
	$("#exchange-next").on('click', function(){
		var currentPage = parseInt($(this).closest('.exchange-page').attr('data-page'),10);
		//console.log(currentPage);
		if(currentPage < 5){
			$(this).closest('.exchange-page').attr('data-page',currentPage + 1);
		}
	})
	$("#exchange-prev").on('click', function(){
		var currentPage = parseInt($(this).closest('.exchange-page').attr('data-page'),10);
		//console.log(currentPage);
		if(currentPage > 1){
			$(this).closest('.exchange-page').attr('data-page',currentPage - 1);
		}
	})

	$(".input-item select").selectric();
	$(".input-account select").on('change', function(){
		$(this).closest('.input-account').find('input').val($(this).val());
	})

	// $(".input-item input").on('focusin', function(){
	// 	$('.input-group-item').removeClass('focus');
	// 	$(this).closest('.input-group-item').addClass('focus');
	// 	$('.k-page-exchange').addClass('blind');

	// })
	// $(".input-item input").on('focusout', function(){
	// 	$('.input-group-item').removeClass('focus');	
	// 	$('.k-page-exchange').removeClass('blind');

	// })
	$('.error .close').on('click', function(){
		$(this).closest('.error').addClass('hide');
	})
	// var popup = new Foundation.Reveal($('#error-modal'));
	// popup.open();
})