var Q = require('q');

var msgDispatcher = function(aggRoot, id, msg) {
    var deferred = Q.defer();
    setTimeout(function() {
        deferred.resolve(msg);
    }, 1);
    return deferred.promise;
};

module.exports = msgDispatcher;