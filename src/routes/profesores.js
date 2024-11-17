const express = require('express');
const router = express.Router();
const queries = require('../repositories/ProfesoresRepository');
const { isLoggedIn } = require('../lib/auth');
// Función para formatear la fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options); // Usa 'es-MX' para el formato en español
}

// Listado de todos los profesores
router.get('/', isLoggedIn, async (request, response) => {
    try {
        const profesores = await queries.obtenerTodosLosProfesores();
        response.render('profesores/listado', { profesores });
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        response.status(500).send('Error al obtener profesores');
    }
});

// Mostrar formulario para agregar un profesor
router.get('/agregar', isLoggedIn, (request, response) => {
    try{
        response.render('profesores/agregar');
    }catch(error){
        console.error('Error al obtener profesores:', error);
        response.status(500).send('Error al obtener profesores');
    }
});

// Agregar un nuevo profesor
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body;
    try {
        const resultado = await queries.agregarProfesor(nombre, apellido, fecha_nacimiento, profesion, genero, email);
        if (resultado) {
            request.flash('success', 'Profesor agregado con éxito');
            response.redirect('/profesores');
        } else {
            request.flash('error', 'Error al agregar profesor');
            response.status(500).send('Error al agregar profesor');
        }
    } catch (error) {
        request.flash('error', 'Error al agregar profesor');
        console.error('Error al agregar profesor:', error);
        response.status(500).send('Error al agregar profesor');
    }
});

/// Mostrar formulario para actualizar un profesor
router.get('/actualizar/:idprofesor', isLoggedIn, async (request, response) => {
    try {
        const profesor = await queries.obtenerProfesorPorId(request.params.idprofesor);
        
        // Función para formatear la fecha en el formato YYYY-MM-DD
        function formatDateForInput(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes es 0-11, así que sumamos 1
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Convertir la fecha de nacimiento al formato YYYY-MM-DD
        profesor.fecha_nacimiento = formatDateForInput(profesor.fecha_nacimiento);

        // Renderizar la vista de actualización con el profesor
        response.render('profesores/actualizar', { profesor });
    } catch (error) {
        console.error('Error al obtener el profesor:', error);
        response.status(500).send('Error al obtener el profesor');
    }
});


// Actualizar un profesor
router.post('/actualizar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body;
    try {
        const resultado = await queries.actualizarProfesor(idprofesor, nombre, apellido, fecha_nacimiento, profesion, genero, email);
        if (resultado) {
            request.flash('success', 'Profesor actualizado con éxito');
            response.redirect('/profesores');
        } else {
            request.flash('error', 'Error al actualizar profesor');
            response.status(500).send('Error al actualizar profesor');
        }
    } catch (error) {
        request.flash('error', 'Error al actualizar profesor');
        console.error('Error al actualizar profesor:', error);
        response.status(500).send('Error al actualizar profesor');
    }
});

// Eliminar un profesor
router.get('/eliminar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    try {
        const resultado = await queries.eliminarProfesor(idprofesor);
        if (resultado) {
            request.flash('success', 'Profesor eliminado con éxito');
        } else {
            request.flash('error', 'Error al eliminar profesor');
        }
        response.redirect('/profesores');
    } catch (error) {
        request.flash('error', 'Error al eliminar profesor');
        console.error('Error al eliminar profesor:', error);
        response.status(500).send('Error al eliminar profesor');
    }
});

module.exports = router;
