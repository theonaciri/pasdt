var mysql = require("mysql");

var pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'past0003.spin-io.fr',
        port     :  3306,
        user     : 'pasdt',
        password : 'ZiAEfboYP0uv'/*,
        database : 'pasdt',*/
    });

exports.getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      return callback(err);
    }
    callback(err, conn);
  });
};
