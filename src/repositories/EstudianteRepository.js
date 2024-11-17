const pool = require('../config/databaseController');

module.exports = {
    obtenerTodosLosEstudiantes: async () => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes');
            return result;
        } catch (err) {
            console.error("Ha ocurrido un problema: ", err);
        }
    },
    //obtener todas las carreras
    obtenerTodasLasCarreras: async () => {
        try {
            const result = await pool.query('SELECT * FROM carreras');
            return result;
        } catch (err) {
            console.error("Ha ocurrido un problema: ", err);
            throw err;
        }
    },
    // Agregar un estudiante
    agregarEstudiante: async (idestudiante, nombre, apellido, email, idcarrera, usuario) => {
        try {
            const carreraExists = await pool.query('SELECT 1 FROM carreras WHERE idcarrera = ?', [idcarrera]);
            if (!carreraExists.length) {
                throw new Error(`La carrera con id ${idcarrera} no existe`);
            }

            const result = await pool.query(
                'INSERT INTO estudiantes (idestudiante, nombre, apellido, email, idcarrera, usuario) VALUES (?, ?, ?, ?, ?, ?)',
                [idestudiante, nombre, apellido, email, idcarrera, usuario]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al insertar el estudiante:', error);
            throw error;
        }
    },
    //obtener por id
    obtenerEstudiantePorId: async (idestudiante) => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result[0];
        } catch (error) {
            console.error('Error al obtener el registro', error);
        }
    },

    // actualizar un estudiante
    actualizarEstudiante: async (idestudiante, nombre, apellido, email, idcarrera, usuario) => {
         try {
            // Verificar si la carrera existe
            const carreraExists = await pool.query('SELECT 1 FROM carreras WHERE idcarrera = ?', [idcarrera]);
            if (!carreraExists.length) {
                throw new Error(`La carrera con id ${idcarrera} no existe`);
            }

            const result = await pool.query(
                'UPDATE estudiantes SET nombre = ?, apellido = ?, email = ?, idcarrera = ?, usuario = ? WHERE idestudiante = ?',
                [nombre, apellido, email, idcarrera, usuario, idestudiante]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar el estudiante:', error);
            throw error;
        }
    },
    // Eliminar un estudiante
    eliminarEstudiante: async (idestudiante) => {
        try {
            const result = await pool.query('DELETE FROM estudiantes WHERE idestudiante = ? ', [idestudiante]);
    return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    }
}
