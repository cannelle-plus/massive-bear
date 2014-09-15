var sqlite3 = require('sqlite3');


projections = (function()
{

return {

    getGames : function(fnCallback)
    {
    var db = new sqlite3.Database('./db/drawTeams.db',sqlite3.OPEN_READONLY);
    var games = [];

    db.serialize(function() {
        
        db.all("SELECT * FROM GamesList", function(err, gamesList) {
            if(err)
                throw err;

            fnCallback(gamesList);
            /*jshint -W030 */
            db.close;   
        });
    });

    
    
    },

    getBears:function()
    {

    var db = new sqlite3.Database('./db/drawTeams.db');
    var users = [];

    db.serialize(function() {
        db.each("SELECT * FROM Users", function(err, row) {
             if(err)
                throw err;
            users.push(row);
        },function(){
            /*jshint -W030 */
            db.close;
        });
    });
    
    return users;

    },

    getBear:function(userId,fnCallback)
    {

    var db = new sqlite3.Database('./db/drawTeams.db');
    var user = null;

    db.serialize(function() {
        db.get("SELECT * FROM Users WHERE userId="+userId, function(err, row) {
             if(err)
                throw err;
            if(row)
            user = row;

            fnCallback(user);
            /*jshint -W030 */
            db.close;
        });
    });
    
    return user;

    }, 
    


};

})();

      

module.exports = projections;