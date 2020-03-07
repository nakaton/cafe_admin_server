const dbConnection = require('../../config/dbConnection');
const Utils = require('../utils/utils');


/* 
Description: Get Food Categories from DB 
*/
exports.getCategories = async (req, res) => {
    let sqlCommand = "select category_cd as categoryCd, " + 
                            "category_name as categoryName, " + 
                            "parent_category_cd as parentCategoryCd " + 
                       "from category;";

    console.log(`==> Select SQL: ${sqlCommand}`);

    //Response for GET success operation is 'OK'
    let values = [];
    await Utils.dataOperationToResponse(req, res, sqlCommand, values, "OK");
};


/* 
Description: Get Food Category by category code 
*/
exports.getCategoryByCd = async (categoryCd) => {
    let sqlCommand = "select category_cd as categoryCd, " + 
                            "category_name as categoryName, " + 
                            "parent_category_cd as parentCategoryCd " + 
                       "from category where category_cd = ?;";

    console.log(`==> Select SQL: ${sqlCommand}`);

    let values = [categoryCd];

    //No Response for this function
    return await Utils.dataOperation("", "", sqlCommand, values, "");
};


/* 
Description: Create new food category 
*/
exports.addCategory = async (req, res) => {

    let postDate = new Date();
    let values = [
        req.body.categoryCd,
        req.body.categoryName,
        req.body.parentCategoryCd,
        req.body.userName,
        postDate
    ];

    let sqlCommand = "insert into category " + 
                            "(category_cd, category_name, parent_category_cd, create_person, create_date ) " + 
                     "values (?,?,?,?,?)";

    console.log(`==> Insert SQL: ${sqlCommand}`);

    //Response for POST success operation is 'Created'
    await Utils.dataOperationToResponse(req, res, sqlCommand, values, "Created");
};


/* 
Description: Update Category by category code
*/
exports.updateCategory = async (req, res) => {
    let categoryCd = req.params.cd;

    let data = await this.getCategoryByCd(categoryCd);

    if(data == undefined || data.length == 0){
        Utils.setUpResponse(res, "Not Found", "");
        return;
    }

    let udpateDate = new Date();
    let values = [
        req.body.categoryName,
        req.body.parentCategoryCd,
        req.body.userName,
        udpateDate,
        categoryCd
    ];

    let sqlCommand = "update category " + 
                        "set category_name = ?, " + 
                            "parent_category_cd = ?, " + 
                            "update_person = ?, " + 
                            "update_date = ? " + 
                      "where category_cd = ?; ";

    console.log(`==> Update SQL: ${sqlCommand}`);

    //Response for UPDATE success operation is 'OK'
    await Utils.dataOperationToResponse(req, res, sqlCommand, values, "OK");
}


/* 
Description: Delete Category by category code
*/
exports.deleteCategory = async (req, res) => {
    let categoryCd = req.params.cd;

    let sqlCommand = "delete from category where category_cd = ?; ";

    console.log(`==> Delete SQL: ${sqlCommand}`);

    let values = [categoryCd];

    //Response for DELETE success operation is 'OK'
    await Utils.dataOperationToResponse(req, res, sqlCommand, values, "OK");
}