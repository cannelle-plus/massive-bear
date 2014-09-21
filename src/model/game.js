
module.exports = function(dispatcher){ 
// Le controller va se charger du traitement des commandes

    //to be repalced by the node uuid module as soon as possible
    function generateUUID(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    }

    var dispatchMessage =function(commandType, id,version, userId, userName, cmd)
    {
        //to be added an uuid for the message to garanty at-least once.
        var msg = {
            "Id" : id,
            "Version" : version,
            "MetaData" : {
                "CorrelationId" :  generateUUID(),
                "UserId" :  generateUUID(),
                "UserName":  userName 
            },
            "PayLoad" : {
                "Case" : commandType,
                "Fields" : cmd
            }
        };

        dispatcher.sendCmd("game", id, msg);
    };

    
    var _createGame = function(userId, userName, ownerId,startDate,location,name,nbPlayersRequired){
        
        var cmd = [
            name,
            ownerId,
            startDate,
            location,
            nbPlayersRequired
        ];

        dispatchMessage("CreateGame", generateUUID(), 0,userId, userName, cmd);
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

