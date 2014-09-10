
$(document).ready(function(){
    
$.ajax({
      type: "GET",
      url: "/gamesList",
}).done(function(data)
{
	objDatasource = JSON.parse(data);
	var template = doT.template(document.getElementById('gamesListTemplate').innerHTML);
	$(document.getElementById('gamesListContainer')).html(template(objDatasource)); 
	bindControls();
});  

function bindControls()
{
	$('.actionJoin').on('click',function(e){
		var json = e.target.attributes.data;
		$.ajax({
	      type: "POST",
	      url: "/game/joinGame",
	      data: {game:1}
		}).done(function(data)
		{

		})
	});

	$('.actionAbandonGame').on('click',function(e){
		$(this).closest('.action').hide();
	});
}

});
