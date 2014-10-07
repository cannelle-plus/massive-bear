var GameHandler = function(projections, commands)
{
    //add checking on the interface projections, commands

    var retrieveJsonGamesFor = function(res){ 
        return function(rows){
            var games = {
                            gamesList : rows
           };
           res.send(JSON.stringify(games));
        };
    };

    var writeError = function(err){
        console.log(err);
    };

    /* GET games list in JSON format */
    this.getGameList = function(req, response) {
       	// get data in json format
    	projections.getGames()
                   .then(retrieveJsonGamesFor(response),writeError);
    };

    this.getGames = function(req, res) {
       var options = {
        root: './www-root/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };
    	 res.sendFile('games.html',options);
    };


    /* POST to Add new game */
    this.createGame = function(req, res) {

        // Get our form values. These rely on the "name" attributes

        var startDate =req.body.startDate;
        var location = req.body.location;
        var name = req.body.name;
        var nbPlayersRequired = req.body.nbPlayersRequired;
        var ownerId  = req.user.id;
        var userId = req.user.id;
        var userName = req.user.username;
        
        if(!startDate || startDate.length===0)
            res.status(400).send('Game date is missing !');

        if(!location || location.length===0)
            res.status(400).send('Game location is missing !');

        if(!name)
            res.status(400).send('Game name is missing !');

        if(!nbPlayersRequired || nbPlayersRequired.length === 0)
            res.status(400).send('Game s players number is missing !');


        commands.createGame(userId,userName , ownerId, startDate ,location,name, nbPlayersRequired);  

        // to be defined 
        res.send("Game created  !");
    };


    /* POST to join game */
    this.joinGame = function(req, res) {

        // Get our form values. These rely on the "name" attributes

        if(req.body.id)
        {
            commands.joinGame(req.body.id,req.body.version,req.user.id,req.user.username);   
            res.send("Game joigned  ! :) ");
        }  
        else
            res.status(400).send('Game id is missing !!!');
    };

    /* POST to Add abandon game */
    this.abandonGame = function(req, res) {

        if(req.body.id)
        {
            commands.abandonGame(req.body.id,req.body.version,req.user.id,req.user.username);   
            res.send("Game abandoned  ! ");
        }  
        else
            res.status(400).send('Game id is missing !');

    };

    /* POST to Add cancel game */
    this.cancelGame = function(req, res) {

        if(req.body.id)
        {
            commands.cancelGame(req.body.id,req.body.version,req.user.id,req.user.username);   
            res.send("Game canceled  ! ");
        }  
        else
            res.status(400).send('Game id is missing !');
    };



};


module.exports = GameHandler;