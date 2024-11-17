const express = require('express');
const router = express.Router();
const queries = require('../repositories/CarrerasRepository');
const { isLoggedIn } = require('../lib/auth');
// Endpoint para mostrar todas las carreras
router.get('/', isLoggedIn, async (request, response) => {
    try {
        const carreras = await queries.obtenerTodasLasCarreras();
        response.render('carreras/listado', { carreras });
    } catch (error) {
        console.error('Error al obtener carreras:', error);
        response.redirect('/carreras');
    }
});


// Endpoint que permite mostrar el formulario para agregar una nueva carrera
router.get('/agregar', isLoggedIn, (request, response) => {
    try {
        response.render('carreras/agregar');
        
    } catch (error) {
        console.error('Error al cargar el formulario de agregar estudiante:', error);
        response.status(500).send('Error al cargar el formulario de agregar carrera');
    }
});

router.post('/agregar', isLoggedIn, async (request, response) => {
    const { idcarrera, carrera } = request.body;
    try {
        const resultado = await queries.agregarCarrera(idcarrera, carrera);
        if (resultado) {
            request.flash('success', 'Carrera agregada con éxito');
        } else {
            request.flash('error', 'Error al agregar carrera');
        }
        response.redirect('/carreras');
    } catch (error) {
        console.error('Error al agregar carrera:', error);
        request.flash('error', 'Error al agregar carrera');
    }
});


// Endpoint para mostrar el formulario de actualización de una carrera
router.get('/actualizar/:idcarrera', isLoggedIn, async (request, response) => {
    const { idcarrera } = request.params;
    try {
        const carrera = await queries.obtenerCarreraPorId(idcarrera);
        if (carrera) {
            response.render('carreras/actualizar', { id: carrera.idcarrera, nombre: carrera.carrera });
        } else {
            response.status(404).send('Carrera no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener carrera para actualizar:', error);
        response.status(500).send('Error al obtener carrera para actualizar');
    }
});

// Endpoint para actualizar una carrera
router.post('/actualizar/:idcarrera', isLoggedIn, async (request, response) => {
    const { idcarrera } = request.body; // Ahora tomamos el nuevo ID del cuerpo
    const { carrera } = request.body; // Obtenemos el nombre de la carrera
    try {
        const resultado = await queries.actualizarCarrera(idcarrera, carrera); // Usa el nuevo ID
        if (resultado) {  
            request.flash('success', 'Carrera actualizada con éxito');
            response.redirect('/carreras');
        } else {
            request.flash('error', 'Error al actualizar carrera');
            response.status(500).send('Error al actualizar carrera');
        }
    } catch (error) {
        console.error('Error al actualizar carrera:', error);
        response.status(500).send('Error al actualizar carrera');
    }
});

router.get('/eliminar/:idcarrera', isLoggedIn, async (req, res) => {
    const { idcarrera } = req.params;
    try {
        const resultado = await queries.eliminarCarrera(idcarrera);
        if (resultado > 0) {
            req.flash('success', 'Carrera eliminada con éxito');
        } else {
            req.flash('error', 'Error al eliminar carrera');
        };
        res.redirect('/carreras');
    } catch (error) {
        console.error('Error al eliminar carrera:', error);
        res.status(500).redirect('/carreras');
    }
});
module.exports = router;