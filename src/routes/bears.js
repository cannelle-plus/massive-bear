var express = require('express');
var router = express.Router();
var projections = require('../model/projections');
var driverCommands = require('../model/driverCommands');
var commands = require('../model/commands')(driverCommands);

/* GET games list in JSON format */
router.get('/getBear', function(req, res) {
   	// get data in json format
	 projections.getBear(req.user.id,function(user){

    var bear = {
        bear : user
    };
		 res.send(JSON.stringify(bear));
	 });

});

module.exports = router;