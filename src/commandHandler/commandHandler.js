var uuid = require('node-uuid');

module.exports = function(dispatcher) {
    // Le controller va se charger du traitement des commandes

    this.handles = function(commandType, id, version, bearId, bearName, cmd) {
        //to be added an uuid for the message to garanty at-least once.
        var msg = {
            "Id": id,
            "Version": version,
            "MetaData": {
                "CorrelationId": uuid.v1(),
                "UserId": bearId,
                "UserName": bearName
            },
            "PayLoad": {
                "Case": commandType,
                "Fields": cmd
            }
        };

        return dispatcher(id, msg);
    };
};



// var _createGame = function(id, userId, userName, ownerId,startDate,location,name,nbPlayersRequired){

//     var cmd = [
//         name,
//         ownerId,
//         startDate,
//         location,
//         nbPlayersRequired
//     ];

//     dispatchMessage("CreateGame", id, 0,userId, userName, cmd);
// };

// var _joinGame = function(gameId, userId , userName){

//     var cmd = [];

//     dispatchMessage("JoinGame", gameId, version,userId, userName, cmd);

// };

// var _abondonGame = function(gameID, version,userId, userName){

//      var cmd = [];

//     dispatchMessage("AbandonGame", gameId, version,userId, userName, cmd);

// };

// var _cancelGame = function(gameID, version,userId, userName){

//     var cmd = [];

//     dispatchMessage("CancelGame", gameId, version,userId, userName, cmd);
// };


// return{
//     createGame:_createGame,
//     joinGame:_joinGame,
//     abandonGame:_abondonGame,
//     cancelGame:_cancelGame
// };