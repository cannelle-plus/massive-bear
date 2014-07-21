var driverCmd = require('./driverCmd'); 

var myController = (function(driverCmd){ 
// Le controller va se charger du traitement des commandes

    function fnSendCmd(cmd) 
    {
        driverCmd.commands.sendCmd(cmd);
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
    
    var _createGame = function(id,date,location,name){
        var commande = 'CreateGame{Id:'+id+',Date:'+date+',Location:'+location+',Name:'+name+'}';
        fnSendCmd(commande); 
    
    };
    
    var _joinGame = function(idGame){
        var commande = 'JoinGame{Id:'+idGame+'}';
        fnSendCmd(commande);
    };
    
    var _abondonGame = function(idGame){
        var commande = 'AbandonGame{Id:'+idGame+'}';
        fnSendCmd(commande);
    };
    
    return{
     
        signIn : _signIn,
        login : _login,
        logout:_logout,
        createGame:_createGame,
        joinGame:_joinGame,
        abandonGame:_abondonGame
    }

})(driverCmd);

exports.commands = myController;