var sqlite3 = require('sqlite3');


projections = (function()
{

return {

    getGames : function(fnCallback)
    {
    var db = new sqlite3.Database('./db/drawTeams.db',sqlite3.OPEN_READONLY)
    var games = [];

    db.serialize(function() {
        
        db.all("SELECT * FROM GamesList", function(err, gamesList) {
            if(err)
                throw err;

            fnCallback(gamesList);
            db.close;});
    });

    
    
    },

    getBears:function()
    {

    var db = new sqlite3.Database('./db/drawTeams.db')
    var users = [];

    db.serialize(function() {
        db.each("SELECT * FROM Users", function(err, row) {
             if(err)
                throw err;
            users.push(row);
        },function(){
            db.close;})
    })
    
    return users;

    },

    


}

})();

      

module.exports = projections;