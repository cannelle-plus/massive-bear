var uuid = require('node-uuid');

module.exports = function(dispatcher) {

    this.handles = function(commandType, id, version, bear , cmd) {
        //to be added an uuid for the message to garanty at-least once.
        var msg = {
            "Id": id,
            "Version": version,
            "MetaData": {
                "CorrelationId": uuid.v1(),
                "UserId": bear.bearId,
                "UserName": bear.bearUsername
            },
            "PayLoad": {
                "Case": commandType,
                "Fields": cmd
            }
        };

        return dispatcher(id, msg);
    };
};

