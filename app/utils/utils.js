const dbConnection = require('../../config/dbConnection');
/* Common method for uses */


/* 
Description: Data operation with DB and response setup 
Parmas: values - params for sql execution
        sign - response message for success (GET, POST, PUT, DELETE)
*/
exports.dataOperationToResponse = async (req, res, sqlCommand, values, sign) => {
    try {
        let result = "";
        if(values.length == 0){
            result = await dbConnection.executeSql(sqlCommand);
        }else{
            result = await dbConnection.executeSql(sqlCommand, values);
        }
        this.setUpResponse(res, sign, result);

    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        this.setUpResponse(res, "Bad Request", "");
        return;
    }
}


/* 
Description: Data operation with DB and return result 
Params: values - params for sql execution
*/
exports.dataOperation = async (req, res, sqlCommand, values) => {
    try {
        const result = await dbConnection.executeSql(sqlCommand, values);
        return result;

    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        Utils.setUpResponse(res, "Bad Request", "");
        return;
    }
}

/* 
Description: Common Response setup 
*/
exports.setUpResponse = (res, sign, result) => {
    switch (sign) {
        case "OK":
            res.statusMessage = sign;
            res.status(200).json(result);
            break;

        case "Created":
            res.statusMessage = sign;
            res.status(201).send();
            break;

        case "Not Found":
            res.statusMessage = sign;
            res.status(404).send();
            break;

        case "Bad Request":
            res.statusMessage = sign;
            res.status(400).send();
            break;
    
        default:
            break;
    }
}