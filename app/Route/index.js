var express = require('express');
var router = express.Router();
var dataController = require('../Controller/dataController');

/* GET home page. */
router.get('/', function(req, res, next) {
	//index(req, res, next);
	dataController.index();
 	res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/log/:id', function(req, res, next) {
	//index(req, res, next);
	dataController.getLogById(req, res);
 	//res.render('index', { title: 'Express' });
});


function index(req, res, next) {
	//mysqlConnect.getConnection(connectionCb);
	const csv = require('csv-parser')
	const fs = require('fs')
	const results = [];
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
	if (index < 2)
		console.log('item: ', arr[index], item);

}


function connectionCb() {

}
module.exports = router;
