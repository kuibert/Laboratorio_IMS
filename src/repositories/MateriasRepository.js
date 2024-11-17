const pool = require('../config/databaseController');

module.exports = {
    // Consulta para obtener todas las materias
    obtenerTodasLasMaterias: async () => {
        try {
            const result = await pool.query('SELECT * FROM materias');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al obtener la lista de materias: ', error);
            throw error;
        }
    },

    // Obtener una materia por ID
    obtenerMateriaPorId: async (idmateria) => {
        try {
            const result = await pool.query('SELECT * FROM materias WHERE idmateria = ?', [idmateria]);
            return result[0];
        } catch (error) {
            console.error('Error al obtener la materia', error);
            throw error;
        }
    },

    // Insertar una materia
    agregarMateria: async (idmateria, materia) => {
        try {
            const result = await pool.query('INSERT INTO materias (idmateria, materia) VALUES (?, ?)', [idmateria, materia]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al insertar la materia', error);
            throw error;
        }
    },

    // Actualizar una materia
    actualizarMateria: async (idmateria, materia) => {
        try {
            const result = await pool.query('UPDATE materias SET materia = ? WHERE idmateria = ?', [materia, idmateria]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar la materia', error);
            throw error;
        }
    },

    // Eliminar una materia
    eliminarMateria: async (idmateria) => {
        try {
            const result = await pool.query('DELETE FROM materias WHERE idmateria = ?', [idmateria]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar la materia', error);
            throw error;
        }
    }
};
