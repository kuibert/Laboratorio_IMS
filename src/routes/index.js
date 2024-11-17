const express = require('express');
const router = express.Router();
const EstudianteRepository = require('../repositories/EstudianteRepository');
const { isLoggedIn } = require('../lib/auth');
// Configuracion de ruta inicial de la aplicacion
router.get('/', isLoggedIn, async (request,response) => {
response.render('home/home');
});

module.exports = router;