$(document).ready(function(){
	$("#exchange-next button").on('click', function(){
		var currentPage = parseInt($(this).closest('.exchange-page').attr('data-page'),10);
		//console.log(currentPage);
		if(currentPage < 5){
			$(this).closest('.exchange-page').attr('data-page',currentPage + 1);
		}
	})

	$(".exchange-account select").selectric();
	$(".exchange-input select").on('change', function(){
		$(this).closest('.exchange-input').find('input').val($(this).val());
	})

	$('.error .close').on('click', function(){
		$(this).closest('.error').addClass('hide');
	})
	// var popup = new Foundation.Reveal($('#error-modal'));
	// popup.open();
})