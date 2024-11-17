const pool = require('../config/databaseController');

module.exports ={
    // Consulta para obtener todas las carreras
    obtenerTodasLasCarreras: async () => {
        try {
            const result = await pool.query('SELECT * FROM carreras');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de carreras: ', error);
            throw error;
        }
    },

    // Obtener una carrera por ID
    obtenerCarreraPorId: async (idcarrera) => {
        try {
            const result = await pool.query('SELECT * FROM carreras WHERE idcarrera = ?', [idcarrera]);
            return result[0];
        } catch (error) {
            console.error('Error al obtener la carrera', error);
            throw error;
        }
    },

    // Insertar una carrera
    agregarCarrera: async (idcarrera, carrera) => {
        try {
            const result = await pool.query('INSERT INTO carreras (idcarrera, carrera) VALUES (?, ?)', [idcarrera, carrera]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al insertar la carrera', error);
            throw error;
        }
    },

    // Actualizar una carrera
    actualizarCarrera: async (idcarrera, carrera) => {
        try {
            const result = await pool.query('UPDATE carreras SET carrera = ? WHERE idcarrera = ?', [carrera, idcarrera]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar la carrera', error);
            throw error;
        }
    },

    // Eliminar una carrera
    eliminarCarrera: async (idcarrera) => {
        try {
            const result = await pool.query('DELETE FROM carreras WHERE idcarrera = ?', [idcarrera]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar la carrera', error);
            throw error;
        }
    }
};