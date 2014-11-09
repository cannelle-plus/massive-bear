var express = require('express');
var Middleware = require('./routes/middleware');
var BearsRoutes = require('./routes/bearsRoutes');
var Rx = require('rx');
var Q = require('q');

var yoann = {
    id: 7,
    username: 'yoann'
};

var julien = {
    id: 8,
    username: 'julien'
};

var FakeBearRepo = function(data) {

    this.getBear = function(id) {
        var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve(data['bear' + id]);
        }, 1);
        return deferred.promise;
    };
};


var router = express.Router();
var app = express();



var router = express.Router();
var app = express();
var port    =   process.env.PORT || 8080;

// home page route (http://localhost:8080)
router.param('testId', function(req, res, next, testId) {
    req.testId = testId;
    next();
});

// home page route (http://localhost:8080)
router.get('/', function(req, res) {
	res.send('im the home page!' + req.testId);	
});

router.get('/test/:testId', function(req, res) {
    res.send('im the home page!' + req.testId); 
});



var source = Rx.Observable.create(function(observer) {});

var middleware = new Middleware(router,source);

middleware.login(yoann);

var bears = {
    'bear7' : yoann,
    'bear8' : julien,
};

var bearRepo = new FakeBearRepo(bears);
var bearsRoutes = new BearsRoutes(bearRepo);

middleware.addRoutes(bearsRoutes);

// apply the routes to our application
app.use('/', router);

app.listen(port);
console.log('Magic happens on port ' + port);