var Q = require('q');

var msgDispatcher = function(aggRoot) {
	return function(id, msg) {
		var deferred = Q.defer();
		setTimeout(function() {
			deferred.resolve(msg);
		}, 1);
		return deferred.promise;
	};
};

module.exports = msgDispatcher;