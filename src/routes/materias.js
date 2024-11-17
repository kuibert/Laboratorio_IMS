const express = require('express');
const router = express.Router();
const queries = require('../repositories/MateriasRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todas las materias
router.get('/', isLoggedIn, async (request, response) => {
    try {
        const materias = await queries.obtenerTodasLasMaterias();
        response.render('materias/listado', { materias });
    } catch (error) {
        console.error('Error al obtener materias:', error);
        response.status(500).send('Error al obtener materias');
    }
});

// Endpoint que permite mostrar el formulario para agregar una nueva materia
router.get('/agregar', isLoggedIn, (request, response) => {
    try {
    response.render('materias/agregar');
    } catch (error) {
        console.error('Error al mostrar formulario para agregar materia:', error);
        response.status(500).send('Error al mostrar formulario para agregar materia');
    }
});

// Endpoint para agregar una materia
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { idmateria, materia } = request.body;
    try {
        const resultado = await queries.agregarMateria(idmateria, materia);
        if (resultado) {
            request.flash('success', 'Materia agregada con éxito');
            response.redirect('/materias');
        } else {
            request.flash('error', 'Error al agregar materia');
            response.status(500).send('Error al agregar materia');
        }
    } catch (error) {
        request.flash('error', 'Error al agregar materia');
        console.error('Error al agregar materia:', error);
        response.status(500).send('Error al agregar materia');
    }
});

// Endpoint para mostrar el formulario de actualización de una materia
router.get('/actualizar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    try {
        const materia = await queries.obtenerMateriaPorId(idmateria);
        if (materia) {
            response.render('materias/actualizar', { id: materia.idmateria, nombre: materia.materia });
        } else {
            response.status(404).send('Materia no encontrada');
        }
    } catch (error) {
        console.error('Error al obtener materia para actualizar:', error);
        response.status(500).send('Error al obtener materia para actualizar');
    }
});

// Endpoint para actualizar una materia
router.post('/actualizar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    const { materia } = request.body;
    try {
        const resultado = await queries.actualizarMateria(idmateria, materia);
        if (resultado) {
            request.flash('success', 'Materia actualizada con éxito');
            response.redirect('/materias');
        } else {
            request.flash('error', 'Error al actualizar materia');
            response.status(500).send('Error al actualizar materia');
        }
    } catch (error) {
        request.flash('error', 'Error al actualizar materia');
        console.error('Error al actualizar materia:', error);
        response.status(500).send('Error al actualizar materia');
    }
});

// Endpoint que permite eliminar una materia
router.get('/eliminar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    try {
        const resultado = await queries.eliminarMateria(idmateria);
        if (resultado) {
            request.flash('success', 'Materia eliminada con éxito');
            response.redirect('/materias');
        } else {
            request.flash('error', 'Error al eliminar materia');
        }
    } catch (error) {
        request.flash('error', 'Error al eliminar materia');
        console.error('Error al eliminar materia:', error);
        response.status(500).send('Error al eliminar materia');
    }
});

module.exports = router;
