'user strict';
var sql = require('./db.js');

//Log object constructor
var Log = function(log){
    this.id = log.id;
    this.cardId = log.cardId;
    this.created_at = new Date();
};
Log.getLogById = function (logId, result) {
    sql.query("SELECT * from log where id = ? ", logId, function (err, res) {             
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });   
};
Log.getAllLogs = function (result) {
    sql.query("SELECT * from log", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('logs : ', res);
            result(null, res);
        }
    });   
};

module.exports= Log;