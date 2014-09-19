var    sqlite3 = require('sqlite3');


projections = function(dbPath)
{
    var _dbPath = dbPath;
 

    var _getGames = function(fnCallback)
    {
        var db = new sqlite3.Database(_dbPath,sqlite3.OPEN_READONLY);
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
    }; 
   
    var _getBears = function()
    {

        var db = new sqlite3.Database(_dbPath);
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

    };

    var _getBear = function(userId,fnCallback)
    {

        var db = new sqlite3.Database(_dbPath);
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

    };
    
    return {
        getGames : _getGames,
        getBears : _getBears,
        getBear : _getBear
    };

};

      

module.exports = projections;