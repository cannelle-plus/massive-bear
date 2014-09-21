var http = require('http');
  
module.exports = function(host, port){
    if(!host) throw 'host of eventStore not given';
    if(!port) throw 'port of eventStore not given';

    var _host = host;
    var _port = port;

    // An object of options to indicate where to post to
    var createReq = function(route,id,length) {
      var options = {
        host: _host,
        port: _port,
        path: '/' + route +'/' + id,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': length
        }
      };

      console.log(options);

      // Set up the request
      return http.request(options, function(res) { 
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log('Response: ' + chunk);
          });
        });
    };
    var _executeCommand = function(route,id,cmd){
      try
      {
        console.log(cmd);
        var data = JSON.stringify(cmd);
        var req = createReq(route, id, data.length);      

        // post the data
        req.write(data);
        req.end();
      }
      catch(e)
      {
        console.log("*********************************");
        console.log("Error while accessing wookie");
        console.log(e);
        console.log("*********************************");
      }
        
    };
    
    return {
        sendCmd : _executeCommand
    };

};