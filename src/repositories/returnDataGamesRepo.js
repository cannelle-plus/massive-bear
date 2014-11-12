var Q = require('q');

var ReturnDataGamesRepo = function(data) {

	var _returnFn = function(){
		var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve(data);
        }, 1);
        return deferred.promise;
	};

    this.getGames = function() {
        return _returnFn();
    };

    this.getBear = function() {
        return _returnFn();
    };
};

module.exports = ReturnDataGamesRepo;