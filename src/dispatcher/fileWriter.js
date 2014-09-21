var fs=require('fs');

// "Driver" de commandes, il decide ou envoyer les commandes

module.exports = function(){

    var _writeCommandToFile = function(cmd){
        console.log(cmd);
        var json = JSON.stringify();
        // creer un fichier si il n'existe pas et écrit la commande
        fs.appendFile('commandes.txt', json+'\r\n', function (err) {
            if (err) throw err;
        });
    };
    
    return {
    
        sendCmd : function(cmd){
            _writeCommandToFile(cmd);
        }
        
    };
};