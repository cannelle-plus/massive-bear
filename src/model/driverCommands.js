var fs=require('fs');

// "Driver" de commandes, il decide ou envoyer les commandes

module.exports = (function(){

    var _commandsToFile = function(cmd){
        // creer un fichier si il n'existe pas et écrit la commande
        fs.appendFile('commandes.txt', cmd+'\r\n', function (err) {
        if (err) throw err;
        });
    };
    
    return {
    
        sendCmd : function(cmd){
            _commandsToFile(cmd);
        }
        
    };
})();