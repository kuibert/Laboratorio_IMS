const mysql = require('mysql2');
const { promisify } = require('util');
const { database } = require('./keys');
const {CONSTANTS} = require('../utils/utils');
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        switch(err.code){
            case CONSTANTS.PROTOCOL_CONNECTION_LOST:
                console.error("Database connection was closed");
                break;
            case CONSTANTS.ER_CON_COUNT_ERROR:
                console.error("Database has too many connections");
                break;
            case CONSTANTS.ECONNREFUSED:
                console.error("Database connection was refused");
                break;
            case CONSTANTS.ER_ACCESS_DENIED_ERROR:
                console.error("Access denied for user");              
                break;
            default:
                console.error(err,"Base datos no encontrada");
                break;
        }
    }
    if(connection){
        console.log("CONEXION EXITOSA...");
        connection.release();
    }
    return;
});

pool.query = promisify(pool.query);
module.exports = pool;