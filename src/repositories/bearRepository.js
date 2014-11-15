var QSQL = require('q-sqlite3');


bearRepository = function(dbPath)
{
    var _dbPath = dbPath;
    var _db = null;

    console.log(dbPath);

    QSQL.createDatabase(dbPath).done(function(db) {
        _db = db;

        console.log('db created');
    });
  
    var _getBears = function()
    {
        return _db.all('SELECT * FROM Users');
    };

    var _saveProfile = function()
    {
        //do something useful here
        // return _db.all('SELECT * FROM Users');
    };

    var _getBear = function(userId)
    {
        return _db.get('SELECT * FROM Users WHERE userId='+userId);
    };
   
    return {
        getBears : _getBears,
        getBear : _getBear
    };

};

      

module.exports = bearRepository;
