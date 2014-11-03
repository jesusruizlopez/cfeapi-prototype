'use strict';

var Report = require('../models/report'),
    Forum  = require('../models/forum'),
    config = require('../config');

exports.create = function(req, res) {

    req.assert('email', 'Debe proporcionar un correo electrónico válido').isEmail();
    req.assert('service_number', 'El numero de servicio debe tener entre 6 y 20 caracteres').len(8, 20);
    req.assert('observations', 'Favor de incluir una descripción a su reporte de 15 a no mas de 300 caracteres').len(15, 300);

    var errors = req.validationErrors();

    if (errors) {
        return res.send({
            success: false,
            errors: errors
        });
    }

    Report.create(req.body)
        .then(function(report) {
            if (!report) {
                console.log('Entró a creacion sin reporte');
                res.status(500);
                res.send({
                    message: "Ocurrió un problema al registrar el reporte"
                });
                throw new Error("Problema al registrar el reporte");
            } else {

                res.status(201);
                res.send({
                    message: "Reporte registrado correctamente"
                });
            }
        })
        .then(undefined, function(err) {
            var error = "Ocurrió un problema al registrar el reporte";
            if (err.code === 11000) {
                error = "Valores duplicados en otros reportes";
            }
            res.status(500);
            res.send({
                message: error
            });
        });
};
