const express = require('express');
const router = express.Router();
const queries = require('../repositories/GruposRepository');
const { isLoggedIn } = require('../lib/auth');
// Endpoint para mostrar todos los grupos
router.get('/', isLoggedIn, async (request, response) => {
    try {
        const grupos = await queries.obtenerTodosLosGrupos();
        response.render('grupos/listado', { grupos });
    } catch (error) {
        console.error('Error al obtener grupos:', error);
        response.status(500).send('Error al obtener grupos');
    }
});

// Endpoint para mostrar el formulario de agregar grupo
router.get('/agregar', isLoggedIn, async (request, response) => {
    try {
        const materias = await queries.obtenerTodasLasMaterias(); // Obtener todas las materias
        const profesores = await queries.obtenerTodosLosProfesores(); // Obtener todos los profesores

        response.render('grupos/agregar', { materias, profesores });
    } catch (error) {
        console.error('Error al cargar el formulario de agregar grupo:', error);
        response.status(500).send('Error al cargar el formulario de agregar grupo');
    }
});

// Endpoint para procesar el agregar grupo
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { num_grupo, anio, ciclo, idmateria, idprofesor } = request.body;
    try {
        // Validar que se haya seleccionado una materia y un profesor
        if (!idmateria || idmateria === "0" || !idprofesor || idprofesor === "0") {
            const materias = await queries.obtenerTodasLasMaterias();
            const profesores = await queries.obtenerTodosLosProfesores();
            request.flash('error', 'Debe seleccionar una materia y un profesor válidos');
            return response.render('grupos/agregar', {
                materias,
                profesores,
                mensaje: 'Debe seleccionar una materia y un profesor válidos'
            });
        }
        const resultado = await queries.agregarGrupo({ num_grupo, anio, ciclo, idmateria, idprofesor });
        if (resultado) {
            request.flash('success', 'Grupo agregado con éxito');
            response.redirect('/grupos');
        } else {
            const materias = await queries.obtenerTodasLasMaterias();
            const profesores = await queries.obtenerTodosLosProfesores();
            request.flash('error', 'Error al agregar grupo');
            response.render('grupos/agregar', {
                materias,
                profesores,
                mensaje: 'Error al agregar grupo'
            });
        }
    } catch (error) {
        console.error('Error al agregar grupo:', error);
        request.flash('error', 'Error al agregar grupo: ' + error.message);
        const materias = await queries.obtenerTodasLasMaterias();
        const profesores = await queries.obtenerTodosLosProfesores();
        response.render('grupos/agregar', {
            materias,
            profesores,
            mensaje: 'Error al agregar grupo: ' + error.message
        });
    }
});

// Endpoint para mostrar el formulario de actualización de un grupo
router.get('/actualizar/:idgrupo', isLoggedIn, async (request, response) => {
    const { idgrupo } = request.params;
    try {
        const grupo = await queries.obtenerGrupoPorId(idgrupo);
        const materias = await queries.obtenerTodasLasMaterias(); // Obtener todas las materias
        const profesores = await queries.obtenerTodosLosProfesores(); // Obtener todos los profesores

        if (grupo) {
            const [materiaSeleccionada] = materias.filter(materia => materia.idmateria === grupo.idmateria);
            const [profesorSeleccionado] = profesores.filter(profesor => profesor.idprofesor === grupo.idprofesor);

            response.render('grupos/actualizar', { grupo, materias, profesores, materiaSeleccionada, profesorSeleccionado });
        } else {
            response.status(404).send('Grupo no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener grupo para actualizar:', error);
        response.status(500).send('Error al obtener grupo para actualizar');
    }
});

// Endpoint para actualizar un grupo
router.post('/actualizar/:idgrupo', isLoggedIn, async (request, response) => {
    const { idgrupo } = request.params;
    const { num_grupo, anio, ciclo, idmateria, idprofesor } = request.body;
    try {
        // Validar que se haya seleccionado una materia y un profesor
        if (!idmateria || idmateria === "0" || !idprofesor || idprofesor === "0") {
            const materias = await queries.obtenerTodasLasMaterias();
            const profesores = await queries.obtenerTodosLosProfesores();
            request.flash('error', 'Debe seleccionar una materia y un profesor válidos');
            return response.render('grupos/actualizar', {
                grupo: { idgrupo, num_grupo, anio, ciclo, idmateria, idprofesor },
                materias,
                profesores,
                mensaje: 'Debe seleccionar una materia y un profesor válidos'
            });
        }

        const resultado = await queries.actualizarGrupo(idgrupo, { num_grupo, anio, ciclo, idmateria, idprofesor });
        if (resultado) {
            request.flash('success', 'Grupo actualizado con éxito');
            response.redirect('/grupos');
        } else {
            request.flash('error', 'Error al actualizar grupo');
            response.status(500).send('Error al actualizar grupo');
        }
    } catch (error) {
        request.flash('error', 'Error al actualizar grupo: ' + error.message);
        console.error('Error al actualizar grupo:', error);
        response.status(500).send('Error al actualizar grupo');
    }
});

// Endpoint para eliminar un grupo
router.get('/eliminar/:idgrupo', isLoggedIn, async (request, response) => {
    const { idgrupo } = request.params;
    try {
        const resultado = await queries.eliminarGrupo(idgrupo);
        if (resultado) {
            request.flash('success', 'Grupo eliminado con éxito');
        } else {
            request.flash('error', 'No se pudo eliminar el grupo');
        }
        response.redirect('/grupos');
    } catch (error) {
        request.flash('error', 'Error al eliminar grupo');
        console.error('Error al eliminar grupo:', error);
        response.status(500).send('Error al eliminar grupo');
    }
});

// Enpoint que permite navegar a la pantalla para asignar un grupo
router.get('/asignargrupo/:idgrupo', isLoggedIn, async (request, reponse) => {
    const { idgrupo } = request.params;
    // Consultamos el listado de estudiantes disponible
    const lstEstudiantes = await estudiantesQuery.obtenerTodosLosEstudiantes();
    reponse.render('grupos/asignargrupo', { lstEstudiantes, idgrupo });
});

// Endpoint que permite asignar un grupo
router.post('/asignargrupo', isLoggedIn, async (request, response) => {
    const data = request.body;
    let resultado = null;
    const result = processDataFromForm(data);
    for (const tmp of result.grupo_estudiantes) {
        //const asignacion = [tmp.idgrupo, tmp.idestudiante];
        //const { idgrupo, idestudiante } = tmp;
        //const asignacionObj = {idgrupo, idestudiante};
        resultado = await queries.asignarGrupo(tmp);
    }
    if (resultado) {
        request.flash('success', 'Asignacion de grupo realizada con exito');
    } else {
        request.flash('error', 'Ocurrio un problema al realizar asignacion');
    }
    response.redirect('/grupos');
});
// Función para procesar los datos del formulario
function processDataFromForm(data) {
    const result = {
        grupo_estudiantes: []
    };
    for (const key in data) {
        if (key.startsWith('grupo_estudiantes[')) {
            const match = key.match(/\[(\d+)\]\[(\w+)\]/);
            if (match) {
                const index = parseInt(match[1]);
                const property = match[2];
                if (!result.grupo_estudiantes[index]) {
                    result.grupo_estudiantes[index] = {};
                }
                result.grupo_estudiantes[index][property] = data[key];
            }
        } else {
            result[key] = data[key];
        }
    }
    return result;
}

module.exports = router;