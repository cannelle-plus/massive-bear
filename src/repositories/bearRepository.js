var QSQL = require('q-sqlite3');


var BearRepository = function(dbPath)
{
    var _dbPath = dbPath;
    var _db = null;

    console.log(dbPath);

    QSQL.createDatabase(dbPath).done(function(db) {
        _db = db;

        console.log('db created');
    });
  
    this.getBears = function()
    {
        return _db.all('SELECT * FROM Bears');
    };

    this.saveProfile = function()
    {
        //do something useful here add friends , something what!!!
        // return _db.all('SELECT * FROM Users');
    };

    this.getBear = function(bearId)
    {
        return _db.get('SELECT * FROM Bears WHERE bearId='+bearId);
    };

    this.hasSignedIn = function(socialId)
    {
        return _db.get('SELECT * FROM Bears as b inner join users as u on b.bearId=u.bearId  WHERE u.socialId="'+socialId +'"');
    };

};

      

module.exports = BearRepository;
