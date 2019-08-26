'use strict';

var mysqlConnect = require('../Model/db');
var Log = require('../Model/Log');

exports.list_all_logs = function(req, res) {
  Log.getAllLog(function(err, log) {

    console.log('controller')
    if (err)
      res.send(err);
      console.log('res', log);
    res.send(log);
  });
};

exports.read_a_log = function(req, res) {
	console.log(' req ', req, ' res ', res);
  Log.getLogById(req.params.logId, function(err, log) {
    if (err)
      res.send(err);
    res.json(log);
  });
};


exports.index = function() {
	console.log('index');
//	console.log('ret: ', this.read_a_log(42);
	return Log.getLogById(42, function(err, log) {
		if (err)
	      throw err;
	    console.log('RET: ', log);
	    return log;
	});

}
