var port = 8380;

var currentPort = function() {
    port = port + 1;
    return port;
};

module.exports = currentPort;