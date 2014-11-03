'use strict';

var Session 	= require('../models/session'),
	User 	 	= require('../models/user'),
	nodemailer 	= require('nodemailer'),
	config 		= require('../config');

exports.signup = function(req, res) {
	
	req.assert('email', 'Debe proporcionar un correo electrónico válido').isEmail();
	req.assert('password', 'La contraseña debe tener entre 6 y 20 caracteres').len(8, 20);

  	var errors = req.validationErrors();

  	if (errors)
    	return res.send({success: false, message: "La información proporcionada no es válida", data: {errors: errors}});

	User.create(req.body)
	.then(function(response) {
		if (!response)
  			throw new Error("Problema al registrar el usuario");
		else {
			/*
			nodemailer.createTransport({
				service: config.mail.service,
				auth: {
					user: config.mail.auth.user,
					pass: config.mail.auth.pass
				}
			}).
			sendMail({
    			from: 'CFE Móvil - Una empresa de clase mundial <info@cfe.gob.mx>',
    			to: response.email,
    			subject: 'Registro con éxito',
    			html: 'Hola'
			});
			*/
			response.hashed_password = "";
			response.salt = "";
  			res.send({success: true, message: "Usuario registrado correctamente", data: {user: response}});
		}
	})
	.then(undefined, function(err) {
		var error = "Ocurrió un problema al registrar el usuario";
		if (err.code === 11000)
			error = "El correo electrónico ya está en uso";
		res.send({success: false, message: error, data: {error: err}});
	});

};

exports.login = function(req, res) {
	
	req.assert('email', 'Debe proporcionar un correo electrónico válido').isEmail();
	req.assert('password', 'La contraseña debe tener entre 6 y 20 caracteres').len(8, 20);
	
	var errors = req.validationErrors();
  	if (errors)
    	return res.send({success: false, message: "La información proporcionada no es válida", data: {errors: errors}});

    var user = {};

	User.findOne({email: req.body.email}).exec()
	.then(function(response) {
		if (!response)
			res.send({success: false, message: "No existe el usuario"});
		else if (!response.authenticate(req.body.password))
			res.send({success: false, message: "La contraseña no coincide"});
		else {
			user = response;
			return Session.remove({user: user._id}).exec()
		}
	})
	.then(function(response) {
		return Session.create({user: user._id});
	})
	.then(function(response) {
		if (!response)
  			throw new Error("Problema al ingresar");
		else {
			user.hashed_password = "";
			user.salt = "";
			res.send({success: true, message: "Ingreso correctamente", data: {session: response, user: user}})
		}
	})
	.then(undefined, function(err) {
    	res.send({success: false, message: "Ocurrió un problema al ingresar", data: {error: err}});
  	});

};

exports.logout = function(req, res) {
	Session.remove({_id: req.headers.authorization}).exec()
	.then(function(response) {
		res.send({success: true, message: "Se cerro sesión correctamente"});
	})
	.then(undefined, function(err) {
		res.send({success: false, message: "Ocurrió un problema al cerrar sesión"})
	});
};

exports.checkSession = function(req, res, next) {
	
	Session.findOne({_id: req.headers.authorization}, 'user')
	.populate('user', 'roles')
	.exec(function(err, response) {
		if (err || !response)
			res.status(401).end();
		else {
			var authorized = true;
			var roles = response.user.roles;
			roles.forEach(function(role) {
				if (role === 'guest')
					authorized = false;
			});
			if (authorized)
				next();
			else
				res.status(401).end();
		}
	});
	
};

exports.checkPermission = function(req, res, next) {
	
	Session.findOne({_id: req.headers.authorization}, 'user')
	.populate('user', 'roles')
	.exec(function(err, response) {
		if (err || !response)
			res.status(401).end();
		else {
			var authorized = false;
			var roles = response.user.roles;
			roles.forEach(function(role) {
				if (role === 'admin')
					authorized = true;
			});
			if (authorized)
				next();
			else
				res.status(401).end();
		}
	});

};
