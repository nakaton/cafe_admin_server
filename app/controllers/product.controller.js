const dbConnection = require('../../config/dbConnection');
const Utils = require('../utils/utils');


/* Get Products from DB */
exports.getProducts = async (req, res) => {
    let sqlCommand = "select product.product_cd as productCd, " + 
                            "product.product_name as productName, " + 
                            "product.category_cd as categoryCd, " + 
                            "category.category_name as categoryName, " + 
                            "product.unit_cost as unitCost, " + 
                            "product.selling_price as sellingPrice, " + 
                            "product.photo_filename as photoFileName, " + 
                            "product.comments " + 
                        "from product " + 
                        "left join category on product.category_cd = category.category_cd;";

    console.log(`==> Select SQL: ${sqlCommand}`);

    try {
        const result = await dbConnection.executeSql(sqlCommand);

        Utils.setUpResponse(res, "OK", result);

    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        Utils.setUpResponse(res, "Bad Request", "");
        return;
    }
};


/* Get Food Category by code */
exports.getCategoryByCd = async (categoryCd) => {
    let sqlCommand = "select category_cd, category_name, parent_category_cd from category where category_cd = ?;";

    console.log(`==> Select SQL: ${sqlCommand}`);

    let values = [categoryCd];

    try {
        const result = await dbConnection.executeSql(sqlCommand, values);

        return result;

    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Bad Request';
        res.status(400)
            .send();
        return;
    }
};


/* Create new food category */
exports.addCategory = async (req, res) => {

    let postDate = new Date();
    let values = [
        req.body.categoryCd,
        req.body.categoryName,
        req.body.parentCategoryCd,
        req.body.userName,
        postDate
    ];

    let sqlCommand = "insert into category "
        + "(category_cd, category_name, parent_category_cd, create_person, create_date ) " 
        + "values (?,?,?,?,?)";

    console.log(`==> Insert SQL: ${sqlCommand}`);

    try {
        const result = await dbConnection.executeSql(sqlCommand, values);

        res.statusMessage = 'Created';
        res.status(201).send();
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Bad Request';
        res.status(400)
            .send();
        return;
    }
};

/* Update Category */
exports.updateCategory = async (req, res) => {
    let categoryCd = req.params.cd;

    let data = await this.getCategoryByCd(categoryCd);

    if(data == undefined || data.length == 0){
        res.statusMessage = 'Not Found';
        res.status(404)
            .send();
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

    let sqlCommand = "update category "
        + "set category_name = ?, parent_category_cd = ?, update_person = ?, update_date = ? where category_cd = ?; ";

    console.log(`==> Update SQL: ${sqlCommand}`);

    try {
        const result = await dbConnection.executeSql(sqlCommand, values);

        res.statusMessage = 'OK';
        res.status(200).send();
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Bad Request';
        res.status(400)
            .send();
        return;
    }
}

/* Delete Category */
exports.deleteCategory = async (req, res) => {
    let categoryCd = req.params.cd;

    let sqlCommand = "delete from category where category_cd = ?; ";

    console.log(`==> Delete SQL: ${sqlCommand}`);

    let values = [categoryCd];

    try {
        const result = await dbConnection.executeSql(sqlCommand, values);

        res.statusMessage = 'OK';
        res.status(200).send();
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Bad Request';
        res.status(400)
            .send();
        return;
    }
}
