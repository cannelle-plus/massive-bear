var QSQL = require('q-sqlite3');


projections = function(dbPath)
{
    var _dbPath = dbPath;
    var _db = null;

    console.log(dbPath);

    QSQL.createDatabase(dbPath, "OPEN_READONLY").done(function(db) {
        console.log('db created');
        _db = db;
    });
 
    var _getGames = function()
    {
        return _db.all('SELECT * FROM GamesList');
    }; 
   
    var _getBears = function()
    {
        return _db.all('SELECT * FROM Users');
    };

    var _getBear = function(userId)
    {
        return _db.get('SELECT * FROM Users WHERE userId='+userId);
    };
    
    return {
        getGames : _getGames,
        getBears : _getBears,
        getBear : _getBear
    };

};

      

module.exports = projections;
