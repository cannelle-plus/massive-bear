var http = require('http');
var querystring = require('querystring');

module.exports = function(host, port){
    if(!host) throw 'host of eventStore not given';
    if(!port) throw 'port of eventStore not given';

    var _host = host;
    var _port = port;

    // An object of options to indicate where to post to
    var createReq = function(id,length) {
      var options = {
        host: _ipAddress,
        port: _port,
        path: '/streams/' + id,
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.eventstore.events+json',
            'Content-Length': length
        }
      };

      // Set up the request
      var post_req = http.request(options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log('Response: ' + chunk);
          });
        });
    };
    var _executeCommand = function(id,cmd){

        console.log(cmd);
        var data = querystring.stringify(cmd);
        var req = createReq(id, data.length);      

        // post the data
        post_req.write(data);
        post_req.end();
    };
    
    return {
        sendCmd : _executeCommand
    };

};