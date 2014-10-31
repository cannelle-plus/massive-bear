var uuid = require('node-uuid');

module.exports = function(dispatcher){ 
// Le controller va se charger du traitement des commandes


    var dispatchMessage =function(commandType, id,version, userId, userName, cmd)
    {
        //to be added an uuid for the message to garanty at-least once.
        var msg = {
            "Id" : id,
            "Version" : version,
            "MetaData" : {
                "CorrelationId" :  uuid.v1(),
                "UserId" :  uuid.v1(),
                "UserName":  userName 
            },
            "PayLoad" : {
                "Case" : commandType,
                "Fields" : cmd
            }
        };

        dispatcher.sendCmd("game", id, msg);
    };

    
    var _createGame = function(id, userId, userName, ownerId,startDate,location,name,nbPlayersRequired){
        
        var cmd = [
            name,
            ownerId,
            startDate,
            location,
            nbPlayersRequired
        ];

        dispatchMessage("CreateGame", id, 0,userId, userName, cmd);
    };
    
    var _joinGame = function(gameId, version,userId , userName){

        var cmd = [];

        dispatchMessage("JoinGame", gameId, version,userId, userName, cmd);

    };
    
    var _abondonGame = function(gameID, version,userId, userName){

         var cmd = [];

        dispatchMessage("AbandonGame", gameId, version,userId, userName, cmd);

    };

    var _cancelGame = function(gameID, version,userId, userName){

        var cmd = [];
        
        dispatchMessage("CancelGame", gameId, version,userId, userName, cmd);
    };

    
    return{
        createGame:_createGame,
        joinGame:_joinGame,
        abandonGame:_abondonGame,
        cancelGame:_cancelGame
    };

};

