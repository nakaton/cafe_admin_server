const mysql = require('promise-mysql');

let pool = null;

/* Create DB Connnection Pool */
exports.createPool = async () => {
    pool = await mysql.createPool({
        multipleStatements: true,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
};

/* Get pool instance */ 
exports.getPool = () => {
    return pool;
};

/* Execute SQL without params */
exports.executeSql = async (sql) => {
    try {
        let result = await pool.query(sql);
        return result;
    } catch (error) {
        console.error(err.message);
        throw err;
    }
}

/* Execute SQL with params */
exports.executeSql = async (sql, values) => {
    try {
        let result = await pool.query(sql, values);
        return result;
    } catch (error) {
        console.error(err.message);
        throw err;
    }
}