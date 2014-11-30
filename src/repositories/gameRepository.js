var QSQL = require('q-sqlite3');


var GameRepository = function(dbPath)
{
    var _dbPath = dbPath;
    var _db = null;

    console.log(dbPath);

    QSQL.createDatabase(dbPath).done(function(db) {
        _db = db;

        console.log('db created');
    });
 
    this.getGames = function()
    {
        return _db.all('SELECT * FROM GamesList');
    }; 
       

};

      

module.exports = GameRepository;
