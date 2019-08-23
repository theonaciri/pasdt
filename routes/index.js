var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	index(req, res, next);
  res.render('index', { title: 'Express' });
});


function index(req, res, next) {
	const mysqlConnect = require('../src/tools/mysqlConnect');
	mysqlConnect.getConnection(console.log);
	const csv = require('csv-parser')
	const fs = require('fs')
	const results = [];
	console.log('yoman');
	fs.createReadStream('data/dump.csv')
	  .pipe(csv({ separator: '\t' }))
	  .on('data', (data) => results.push(data))
	  .on('end', () => {
	    results.forEach(deepParse);
	    // [
	    //   { NAME: 'Daffy Duck', AGE: '24' },
	    //   { NAME: 'Bugs Bunny', AGE: '22' }
	    // ]


	   //var writer = fs.createWriteStream('data/output.json');
		//writer.write(JSON.stringify(results));
	  });
}

function deepParse(item, index, arr) {
	if (index < 10)
	console.log('item: ', item);
}
module.exports = router;
