var http = require('http');
var Q = require('q');

module.exports = function(host, port) {
  if (!host) throw 'host of eventStore not given';
  if (!port) throw 'port of eventStore not given';

  var _host = host;
  var _port = port;

  // An object of options to indicate where to post to
  var createReq = function(route, id, length) {
    var options = {
      host: _host,
      port: _port,
      path: '/' + route + '/' + id,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': length
      }
    };

    // Set up the request
    return http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        console.log('Response: ' + chunk);
      });
    });
  };
var callWookie = function(id, msg, aggRoot){
  try{

        console.log(msg);
        var data = JSON.stringify(msg);
        var req = createReq(aggRoot, id, data.length);

        // post the data
        req.write(data);
        req.end();
      } catch (e) {
        console.log("*********************************");
        console.log("Error while accessing wookieDispatcher : " + aggRoot);
        console.log(e);
        console.log("*********************************");
      }
};

  return function(aggRoot) {
    return function(id, msg) {
      var deferred = Q.defer();
      setTimeout(function() {
        callWookie(id, msg, aggRoot);
        deferred.resolve(msg);
      }, 1);
      return deferred.promise;
    };
  };

};
