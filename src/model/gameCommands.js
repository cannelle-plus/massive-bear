
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
        var msg = {
            "Id" : id,
            "Version" : version,
            "CorrelationId" : generateUUID(),
            "MetaData" : {
                "TokenId" : "88085239-6f0f-48c6-b73d-017333cb99ba", // remaining so far but should be disposed because passport is handling the security, so far...
                "UserId" : userId,
                "UserName" : userName
            },
            "PayLoad" : {
                "Case" : commandType,
                "value" : cmd
            }
        };

        dispatcher.sendCmd(msg);
    };

    
    var _createGame = function(userId, userName, ownerId,date,location,name,nbPlayersRequired){
        
        var cmd = {
            "OwnerId" : ownerId,
            "GameDate" : date,
            "GameLocation" : location,
            "GameName" : name,
            "NmPlayersRequired" : nbPlayersRequired
        };

        dispatchMessage("createGame", generateUUID(), 0,userId, userName, cmd);
    };
    
    var _joinGame = function(gameId, version,userId , userName){

        var cmd = {
            "UserId" : userId
        };

        dispatchMessage("JoinGame", gameId, version,userId, userName, cmd);

    };
    
    var _abondonGame = function(gameID, version,userId, userName){

         var cmd = {
            "UserId" : userId
        };

        dispatchMessage("AbandonGame", gameId, version,userId, userName, cmd);

    };

    var _cancelGame = function(gameID, version,userId, userName){

        var cmd = {
            "UserId" : userId
        };
        
        dispatchMessage("CancelGame", gameId, version,userId, userName, cmd);
    };

    
    return{
        createGame:_createGame,
        joinGame:_joinGame,
        abandonGame:_abondonGame,
        cancelGame:_cancelGame
    };

};

