var express = require('express');
var router = express.Router();
var projections = require('../model/projections');
var driverCommands = require('../model/driverCommands');
var commands = require('../model/commands')(driverCommands);

/* GET games list in JSON format */
router.get('/gamesList', function(req, res) {
   	// get data in json format
	 projections.getGames(function(rows){

    var games = {
        gamesList : rows
    };
		 res.send(JSON.stringify(games));
	 });

});

router.get('/games', function(req, res) {
   var options = {
    root: './public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
	 res.sendFile('games.html',options);
});


/* POST to Add new game */
router.post('/game/creategame', function(req, res) {

    // Get our form values. These rely on the "name" attributes
    
    if(!req.body.gameDate || req.body.gameDate.length==0)
        res.status(400).send('Game date is missing !');

    if(!req.body.gameLocation || req.body.gameLocation.length==0)
        res.status(400).send('Game location is missing !');

    if(!req.body.gameName)
        res.status(400).send('Game name is missing !');

    if(!req.body.nbPlayersRequired || req.body.nbPlayersRequired.length == 0)
        res.status(400).send('Game s players number is missing !');


    commands.createGame(req.user.id,req.body.gameDate ,req.body.gameLocation,req.body.gameName, req.body.nbPlayersRequired);  

    // to be defined 
    res.send("Game created  !");
});


/* POST to join game */
router.post('/game/joinGame', function(req, res) {


    // Get our form values. These rely on the "name" attributes

    if(req.body.game)
    {
        commands.joinGame(req.body.game,req.user.id);   
        res.send("Game joigned  ! :) ");
    }  
    else
        res.status(400).send('Game id is missing !');


});

/* POST to Add abandon game */
router.post('/game/abandonGame', function(req, res) {

    if(req.body.game)
    {
        commands.abandonGame(req.body.game,req.user.id);   
        res.send("Game abandoned  ! ");
    }  
    else
        res.status(400).send('Game id is missing !');

});

/* POST to Add abandon game */
router.post('/game/cancelGame', function(req, res) {

    if(req.body.game)
    {
        commands.cancelGame(req.body.game,req.user.id);   
        res.send("Game canceled  ! ");
    }  
    else
        res.status(400).send('Game id is missing !');

});


module.exports = router;