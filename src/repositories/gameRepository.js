var QSQL = require('q-sqlite3');


gameRepository = function(dbPath)
{
    var _dbPath = dbPath;
    var _db = null;

    console.log(dbPath);

    QSQL.createDatabase(dbPath).done(function(db) {
        _db = db;

        console.log('db created');
    });
 
    var _getGames = function()
    {
        return _db.all('SELECT * FROM GamesList');
    }; 
   
    return {
        getGames : _getGames
    };

};

      

module.exports = bearRepository;
