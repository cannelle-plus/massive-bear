var express = require('express');
var dotTemplating = require('dot');
var router = express.Router();


/* GET game create game form */
router.get('/bears', function(req, res) {
var data = { name: "David" };                                 // step 1
var template = "Hey <b>{{=it.name}}</b>, you own me money.";  // step 2
var templateFunction = dotTemplating.template(template);              // step 3
var html = templateFunction( data );                          // step 4
   res.send(html);
});
       

module.exports = router;