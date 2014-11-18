var Q = require('q');

var OKDispatcher = function(aggRoot) {
	return function(id, msg) {
		var deferred = Q.defer();
		setTimeout(function() {
			deferred.resolve({
				responseFromTheDispatcher: "OK"
			});
		}, 1);
		return deferred.promise;
	};
};

module.exports = OKDispatcher;