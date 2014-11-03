'use strict';

// Dependencies

var path = require('path');

// Command: env NODE_ENV
// Project configurations

if (process.env.NODE_ENV === 'production') {
	module.exports = {
		name: 'RESTful API',
		enviroment: 'production',
		db: 'mongodb://127.0.0.1/cfepro',
		keys: {
			movil: 'b3a2a122ab1a51fb74c929b96798f892b719bb97d1e45b4d79787c8af8dac1dc',
			admin: 'b3a2a122ab1a51fb74c929b96798f892b719bb97d1e45b4d79787c8af8dac1dc'
		},
	  	server: {
	    	port: 3000,
	    	distFolder: path.resolve(__dirname, '../app')
	  	},
	  	mail: {
	  		service: 'gmail',
	  		auth: {
	  			user: '',
	  			pass: ''
	  		}
	  	}
	}
}
else {
	module.exports = {
		name: 'RESTful API',
		enviroment: 'development',
		db: 'mongodb://127.0.0.1/cfedev',
		keys: {
			movil: 'b3a2a122ab1a51fb74c929b96798f892b719bb97d1e45b4d79787c8af8dac1dc',
			admin: 'b3a2a122ab1a51fb74c929b96798f892b719bb97d1e45b4d79787c8af8dac1dc'
		},
	  	server: {
	    	port: 3000,
	    	distFolder: path.resolve(__dirname, '../app')
	  	},
	  	mail: {
	  		service: 'gmail',
	  		auth: {
	  			user: '',
	  			pass: ''
	  		}
	  	}
	}
}
