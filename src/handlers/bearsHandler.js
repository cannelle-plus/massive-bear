
var BearHandler = function(projections, commands){
	//add checking on the interface projections, commands

	var retrieveJsonGamesFor = function(response){ 
        return function(user){
		 	response.json({
		        bear : user
	    	});
        };
    };

    var writeError = function(err){
        console.log(err);
    };
	
	/* GET games list in JSON format */
	this.getBear = function(req, response, session) {
	   	// get data in json format
		 projections.getBear(req.user.id)
		 			.then(retrieveJsonGamesFor(response),writeError);
 	};

};

module.exports = BearHandler; 