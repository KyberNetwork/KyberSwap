$(document).ready(function(){
	$("#transaction-list .item").on('click', function(){
		var popup = new Foundation.Reveal($('#tx-modal'));
		popup.open();
	})
})