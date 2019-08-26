'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    connectionLimit : 100,
    host     : 'pasdt003.spin-io.fr',
    port     :  3306,
    user     : 'pasdt',
    password : 'ZiAEfboYP0uv',
    database : 'pasdt'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;