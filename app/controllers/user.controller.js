const Utils = require('../utils/utils');


/* 
Description: User Login Check
*/
exports.login = async (req, res) => {
    let userName = req.body.username;
    let passWord = req.body.password;

    let values = [
        userName,
        passWord
    ]

    let sqlCommand = "select user_id as userId, " + 
                            "user_name as userName, " + 
                            "email as email, " + 
                            "given_name as givenName, " + 
                            "family_name as familyName, " + 
                            "auth_token as authToken, " + 
                            "profile_photo_filename as profilePhotoFilename " + 
                       "from user " + 
                       "where user_name = ? " + 
                       "  and password = ?;";

    console.log(`==> Select SQL: ${sqlCommand}`);

    //Response for GET success operation is 'OK'
    let result = await Utils.dataOperation(req, res, sqlCommand, values);

    if(result == undefined || result.length == 0){
        Utils.setUpResponse(res, "Not Found", "")
    }else{
        Utils.setUpResponse(res, "OK", result)
    }
};