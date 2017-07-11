$(document).foundation()

$(document).ready(function(){
	$("#menu a").on('click', function(){
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
})