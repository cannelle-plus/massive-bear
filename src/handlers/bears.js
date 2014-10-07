
var BearHandler = function(projections, commands){
	//add checking on the interface projections, commands

	var retrieveJsonGamesFor = function(response){ 
        return function(user){
            var bear = {
		        bear : user
	    	};
		 	response.send(JSON.stringify(bear));
        };
    };

    var writeError = function(err){
        console.log(err);
    };
	
	/* GET games list in JSON format */
	this.getBear = function(req, response) {
	   	// get data in json format
		 projections.getBear(req.user.id)
		 			.then(retrieveJsonGamesFor(response),writeError);
 	};

};

module.exports = BearHandler; 