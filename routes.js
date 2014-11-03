'use strict';

// Controllers

var failures = require('./controllers/failures');

module.exports = function(app, config) {

	// Rutas sin ningún tipo de autorización
	// NIVEL DE SEGURIDAD: 0

	app.all('*', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
    	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Apikey');
    	if (req.method === 'OPTIONS') {
    		res.status(200).end();
    	}
    	next();
	});
	
	app.get('/', function(req, res) {
		res.send({status: 'ON', name: config.name, enviroment: config.enviroment});
	});

	// Rutas con autorización básica
	// NIVEL DE SEGURIDAD: 1

	app.all('*', function(req, res, next) {
		if (req.headers.apikey === config.keys.movil || req.headers.apikey === config.keys.admin)
			next();
		else
			res.status(401).end();
	});

	app.get('/ubications', function(req, res) {
		var fs = require('fs')
		fs.readFile('data/ubications.json', 'utf8', function(err, data) {
			data = JSON.parse(data);
			res.send({success: true, ubications: data});
		});
	});

};
