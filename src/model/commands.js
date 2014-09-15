
module.exports = (function(driverCmd){ 
// Le controller va se charger du traitement des commandes

    function fnSendCmd(cmd) 
    {
        driverCmd.sendCmd(cmd);
    }
    
    var _signIn = function(lastname,firstname,mail,username,password){
        var commande = 'SignIn{ LastName:'+lastname+',FisrtName:'+firstname+',Mail:'+mail+',UserName:'+username+',Password:'+password+'}';
        fnSendCmd(commande);
    };
    
    var _login = function(username,password){
        var commande = 'Login{UserName:'+username+',Password:'+password+'}';
        fnSendCmd(commande);   
    };
    
    var _logout = function(tokenid){
        var commande = 'Logout{TokenId:'+tokenid+'}';
        fnSendCmd(commande); 
    };
    
    var _createGame = function(ownerId,date,location,name,nbPlayersRequired){
        var commande = 'CreateGame{ownerId:'+ownerId+' ,Date:'+date+',Location:'+location+',Name:'+name+', nbPlayersRequired:'+nbPlayersRequired+'}';
        fnSendCmd(commande); 
    
    };
    
    var _joinGame = function(gameID,userId){
        var commande = 'JoinGame{gameID:'+gameID+' ,UserId:'+userId+'}';
        fnSendCmd(commande);
    };
    
    var _abondonGame = function(gameID,userId){
        var commande = 'AbandonGame{gameID:'+gameID+' ,UserId:'+userId+'}';
        fnSendCmd(commande);
    };

    var _cancelGame = function(gameID,userId){
        var commande = 'CancelGame{gameID:'+gameID+' ,UserId:'+userId+'}';
        fnSendCmd(commande);
    };

    
    return{
     
        signIn : _signIn,
        login : _login,
        logout:_logout,
        createGame:_createGame,
        joinGame:_joinGame,
        abandonGame:_abondonGame,
        cancelGame:_cancelGame
    };

});

