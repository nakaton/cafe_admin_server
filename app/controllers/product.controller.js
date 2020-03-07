const Utils = require('../utils/utils');


/* 
Description: Get Products from DB 
*/
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

    //Response for GET success operation is 'OK'
    let values = [];
    await Utils.dataOperationToResponse(req, res, sqlCommand, values, "OK");
};


/* 
Description: Get Product by product code 
*/
exports.getProductByCd = async (productCd) => {
    let sqlCommand = "select product.product_cd as productCd, " + 
                            "product.product_name as productName, " + 
                            "product.category_cd as categoryCd, " + 
                            "category.category_name as categoryName, " + 
                            "product.unit_cost as unitCost, " + 
                            "product.selling_price as sellingPrice, " + 
                            "product.photo_filename as photoFileName, " + 
                            "product.comments " + 
                        "from product " + 
                        "left join category on product.category_cd = category.category_cd " + 
                       "where product.product_cd = ?;";

    console.log(`==> Select SQL: ${sqlCommand}`);

    let values = [productCd];

    //No Response for this function
    return await Utils.dataOperation("", "", sqlCommand, values);
};


/* 
Description: Create new product 
*/
exports.addProduct = async (req, res) => {

    let postDate = new Date();
    let values = [
        req.body.productCd,
        req.body.productName,
        req.body.categoryCd,
        req.body.unitCost,
        req.body.sellingPrice,
        req.body.photoFileName,
        req.body.comments,
        req.body.userName,
        postDate
    ];

    let sqlCommand = "insert into product " + 
                            "(product_cd, product_name, category_cd, unit_cost, selling_price, photo_filename, comments, create_person, create_date ) " + 
                     "values (?,?,?,?,?,?,?,?,?)";

    console.log(`==> Insert SQL: ${sqlCommand}`);

    //Response for POST success operation is 'Created'
    await Utils.dataOperationToResponse(req, res, sqlCommand, values, "Created");
};

/* 
Description: Update Product by product code
*/
exports.updateProduct = async (req, res) => {
    let productCd = req.params.cd;

    let data = await this.getProductByCd(productCd);

    if(data == undefined || data.length == 0){
        Utils.setUpResponse(res, "Not Found", "");
        return;
    }

    let udpateDate = new Date();
    let values = [
        req.body.productName,
        req.body.categoryCd,
        req.body.unitCost,
        req.body.sellingPrice,
        req.body.photoFileName,
        req.body.comments,
        req.body.userName,
        udpateDate,
        productCd
    ];

    let sqlCommand = "update product " + 
                        "set product_name = ?, " + 
                            "category_cd = ?, " + 
                            "unit_cost = ?, " + 
                            "selling_price = ?, " + 
                            "photo_filename = ?, " + 
                            "comments = ?, " + 
                            "update_person = ?, " + 
                            "update_date = ? " + 
                      "where product_cd = ?; ";

    console.log(`==> Update SQL: ${sqlCommand}`);

    //Response for UPDATE success operation is 'OK'
    await Utils.dataOperationToResponse(req, res, sqlCommand, values, "OK");
}

/* 
Description: Delete Product by product code
*/
exports.deleteProduct = async (req, res) => {
    let productCd = req.params.cd;

    let sqlCommand = "delete from product where product_cd = ?; ";

    console.log(`==> Delete SQL: ${sqlCommand}`);

    let values = [productCd];

    //Response for DELETE success operation is 'OK'
    await Utils.dataOperationToResponse(req, res, sqlCommand, values, "OK");
}
