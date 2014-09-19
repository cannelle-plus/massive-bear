
var BearHandler = function(projections, commands){
	//add checking on the interface projections, commands
	
	
	/* GET games list in JSON format */
	this.getBear = function(req, res) {
	   	// get data in json format
		 projections.getBear(req.user.id,function(user){
		    var bear = {
		        bear : user
	    	};
		 	res.send(JSON.stringify(bear));
	 	});
 	};

};

module.exports = BearHandler; 