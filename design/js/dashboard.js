$(document).ready(function(){
	$("#account-list .acc-title").on('click', function(){
		if($(this).closest('.acc-item').hasClass('active')){
			return;
		}
		$("#account-list .acc-item").removeClass('active');
		$(this).closest('.acc-item').addClass('active');
	})
	$("#account-list .acc-title .acc-title-expand").on('click', function(e){
		$(this).closest('.acc-item').toggleClass('expand');
		e.stopPropagation();
	})
})