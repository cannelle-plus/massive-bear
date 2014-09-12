$(function() {
  // Navigation
	$('a[data-target]').on('click',function(e){
		doNothing(e);
		var id = '#' + $(this).attr('data-target'),
				tX = -100 * $(id).index();
		$('#main > section').css('-webkit-transform','translateX( ' + tX + '%)');
	});
	// Modal
	$('a[data-modal]').on('click',function(e){
		doNothing(e);
		if($(this).attr('data-modal') === 'open')
			$('.overlay').show();
		else	
			$('.overlay').hide();
	});
	
	// Action on game
	$('#games .games').on('click','li',function(e){
		$(this).find('.action').show();
	});
	$('#games .games').on('click','.action a',function(e){
		doNothing(e);
		$(this).closest('.action').hide();
	});
});

function doNothing(event){
	event.preventDefault();
	event.stopPropagation();
}