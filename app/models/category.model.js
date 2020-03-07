const dbConnection = require('../../config/dbConnection');

/* Get all category data from DB */
exports.getCategories = async (sql) => {
    try {
        let result = await dbConnection.getPool().query(sql);
        return result;
    } catch (error) {
        console.error(err.message);
        throw err;
    }
}

/* Create new category */
exports.addCategory = async (sql, values) => {
    try {
        let result = await dbConnection.getPool().query(sql, values);
        return result;
    } catch (error) {
        console.error(err.message);
        throw err;
    }
}