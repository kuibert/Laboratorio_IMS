const pool = require('../config/databaseController');

module.exports = {
    // Obtener todos los grupos
    obtenerTodosLosGrupos: async () => {
        try {
            const result = await pool.query('SELECT * FROM grupos');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de grupos:', error);
            throw error;
        }
    },

    // Obtener un grupo por ID
    obtenerGrupoPorId: async (idgrupo) => {
        try {
            const result = await pool.query('SELECT * FROM grupos WHERE idgrupo = ?', [idgrupo]);
            return result[0];
        } catch (error) {
            console.error('Error al obtener el grupo:', error);
            throw error;
        }
    },

    // Obtener todas las materias
    obtenerTodasLasMaterias: async () => {
        try {
            const rows = await pool.query('SELECT * FROM materias');
            return rows; // Debería retornar un array de materias
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de materias:', error);
            throw error;
        }
    },

    // Obtener todos los profesores
    obtenerTodosLosProfesores: async () => {
        try {
            const rows = await pool.query('SELECT * FROM profesores');
            return rows; // Debería retornar un array de profesores
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de profesores:', error);
            throw error;
        }
    },

    // Insertar un grupo
    agregarGrupo: async (grupo) => {
        const { num_grupo, anio, ciclo, idmateria, idprofesor } = grupo;
        try {
            const result = await pool.query(
                'INSERT INTO grupos (num_grupo, anio, ciclo, idmateria, idprofesor) VALUES (?, ?, ?, ?, ?)',
                [num_grupo, anio, ciclo, idmateria, idprofesor]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al insertar el grupo:', error);
            throw error;
        }
    },

    // Asignar grupo
    asignarGrupo: async (asignacion) => {
        try {
            const result = await pool.query("INSERT INTO grupo_estudiantes SET ? ",
                asignacion);
            console.log('resultado: ', result)
            return result;
        } catch (error) {
            console.log('Ocurrio un problema al asignar el grupo', error);
        }
    },

    // Actualizar un grupo
    actualizarGrupo: async (idgrupo, grupo) => {
        const { num_grupo, anio, ciclo, idmateria, idprofesor } = grupo;
        try {
            const result = await pool.query(
                'UPDATE grupos SET num_grupo = ?, anio = ?, ciclo = ?, idmateria = ?, idprofesor = ? WHERE idgrupo = ?',
                [num_grupo, anio, ciclo, idmateria, idprofesor, idgrupo]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar el grupo:', error);
            throw error;
        }
    },

    // Eliminar un grupo
    eliminarGrupo: async (idgrupo) => {
        try {
            const result = await pool.query('DELETE FROM grupos WHERE idgrupo = ?', [idgrupo]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el grupo:', error);
            throw error;
        }
    }
};
