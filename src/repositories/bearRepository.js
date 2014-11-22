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
        return _db.all('SELECT * FROM Bears');
    };

    var _saveProfile = function()
    {
        //do something useful here
        // return _db.all('SELECT * FROM Users');
    };

    var _getBear = function(bearId)
    {
        return _db.get('SELECT * FROM Bears WHERE bearId='+bearId);
    };

    var _hasSignedIn = function(userId)
    {
        return _db.get('SELECT * FROM Bears as b inner join users as u on b.bearId=u.bearId  WHERE u.userId="'+userId +'"');
    };
   
    return {
        getBears : _getBears,
        getBear : _getBear,
        saveProfile : _saveProfile,
        hasSignedIn : _hasSignedIn
    };

};

      

module.exports = bearRepository;
