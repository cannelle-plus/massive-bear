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
    
    //Id must be create by controller ???
    var id = Math.floor((Math.random() * 10) + 1);
    
    var date = req.body.date;
    var location = req.body.location;
    var name = req.body.name;
    commands.createGame(id,date,location,name);  

    // to be defined 
    res.send("Nouveau match enregistré  ! :) ");
});


/* POST to Add new game */
router.post('/game/joinGame', function(req, res) {

    console.log('joinGame start');
    // Get our form values. These rely on the "name" attributes
    if(req.body.game)
    {
        console.log(req.user);
     //  commands.joinGame(id,date,location,name);   
    }    

    // to be defined 
    res.send("Nouveau joueur enregistré  ! :) ");
});

/* POST to Add new game */
router.post('/game/abandonGame', function(req, res) {

    // Get our form values. These rely on the "name" attributes
    
    var date = req.body.date;
    var location = req.body.location;
    var name = req.body.name;
    //commands.commands.createGame(id,date,location,name);  

    // to be defined 
    res.send("Nouveau match enregistré  ! :) ");
});


module.exports = router;