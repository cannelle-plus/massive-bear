
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
		var gameId = e.target.attributes.data.value;
		$.ajax({
	      type: "POST",
	      url: "/game/joinGame",
	      data: {game:gameId}
		}).done(function(data)
		{
			$(e.target).closest('.action').hide();
		})
	});

	$('.actionAbandonGame').on('click',function(e){
			var gameId = e.target.attributes.data.value;
		$.ajax({
	      type: "POST",
	      url: "/game/abandonGame",
	      data: {game:gameId}
		}).done(function(data)
		{
			$(e.target).closest('.action').hide();
		})
	});

	$('.actionCancelGame').on('click',function(e){
		var gameId = e.target.attributes.data.value;
		$.ajax({
	      type: "POST",
	      url: "/game/cancelGame",
	      data: {game:gameId}
		}).done(function(data)
		{
			$(e.target).closest('.action').hide();
		})
	});

	var $btnActionCreateGame = $(document.getElementById('btnCreateGame'));
	$btnActionCreateGame.on('click',function(e){

		doNothing(e);
		var gameDate = null;
		var gameName = $(document.getElementById('gameName')).val();
		var gameLocation = $(document.getElementById('gameLocation')).val();
		var date = $(document.getElementById('gameDate')).val();
		var hour = $(document.getElementById('gameHour')).val();
		var gameNbPlayers = document.getElementById('nbPlayersRequired').value;
		var error = null;

		if(date.length==0 || hour.length==0)
			error = "Date cannot be null !";


		if(gameName.length==0)
			error = "Game's name cannot be null !";

		if(gameLocation.length==0)
			error = "Game's location cannot be null !";

		if(isNaN(gameNbPlayers))
			error = "Game's players cannot be null !";

		if(error)
		{
			$(document.getElementById('textError')).text(error);
			return;
		}

		gameDate= date +' '+hour;

		$.ajax({
	      type: "POST",
	      url: "/game/createGame",
	      data: {gameName:gameName, 
	      		gameLocation: gameLocation, 
	      		gameDate : gameDate,
	      		nbPlayersRequired : gameNbPlayers
	      	}
		}).done(function(data)
		{
			console.log('Match créé');
			//TODO YRE doit retourner le nouveau match, le match doit être insérer dans la page
		})

	}); 
}

});
