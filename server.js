'use strict';

// Dependencies

var express         = require('express'),
    validator       = require('express-validator'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    methodOverride  = require('method-override'),
    app             = express(),
    mongoose        = require('mongoose'),
    config          = require('./config');

// Database

mongoose.connect(config.db, function(err, res) {
	if (err)
    	console.log("Error al conectarse a la base de datos: "+err);
	else
    	console.log("Conexión con la base de datos exitosa");
});

// Server configurations

app.use(validator());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
require('./routes')(app, config);

// Web Server

app.listen(config.server.port, function(err) {
  if (err)
    console.log(err);
  else
    console.log("Servidor NodeJS: http://127.0.0.1:"+config.server.port+'/');
});
