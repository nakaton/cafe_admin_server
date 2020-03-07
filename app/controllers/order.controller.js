const Utils = require('../utils/utils');


/* 
Description: Get Orders from DB 
*/
exports.getOrders = async (req, res) => {
    // Get order raw data
    let results = await prepareSqlAndExecute(req, res);

    // Final JSON result
    let jsonResult = [];

    // Raw data cleaning
    if(results.length > 0){
        let preOrderNo = results[0].orderNo;
        let orderDetailArr = [];
        let orderData = "";
        
        results.forEach(order => {

            if(order.orderNo == preOrderNo){
                let orderDetailData = setOrderDetailData(order);
                orderDetailArr.push(orderDetailData);

            }else{
                jsonResult.push(orderData);

                preOrderNo = order.orderNo;
                orderDetailArr = [];

                let orderDetailData = setOrderDetailData(order);
                orderDetailArr.push(orderDetailData);
            }
            orderData = setOrderData(order, orderDetailArr)
        });

        jsonResult.push(orderData);
        Utils.setUpResponse(res, "OK", jsonResult);

    }else{
        Utils.setUpResponse(res, "OK", results);
    }
};

/* 
Description: Prepare Order Detail Data to push into detail array
*/
setOrderDetailData = (order) => {
    return orderDetailData = {
        "productCd": order.productCd,
        "productName": order.productName,
        "qty": order.qty
    }
}

/* 
Description: Prepare Order Data to push into final JSON order array
*/
setOrderData = (order, orderDetailArr) => {
    return orderData = {
        "orderNo": order.orderNo,
        "OrderDetails": orderDetailArr,
        "amount": order.amount,
        "comments": order.comments,
        "orderStatus": order.orderStatus,
        "orderStatusName": order.orderStatusName,
        "orderTime": order.orderTime
    };
}

/* 
Description: Prepare SQL by specific condition and return execution result
*/
prepareSqlAndExecute = async (req, res) =>{
    // Get query params from request
    let dateFrom = req.query.dateFrom;
    let dateTo = req.query.dateTo;
    let orderStatus = req.query.orderStatus;

    let values = [];

    // Prepare SQL
    let sqlCommand = "select SellsOrder.order_no as orderNo, " + 
                            "OrderDetail.product_cd as productCd, " + 
                            "product.product_name as productName, " + 
                            "OrderDetail.qty as qty, " + 
                            "SellsOrder.amount as amount, " + 
                            "SellsOrder.comments as comments, " + 
                            "SellsOrder.order_status as orderStatus, " + 
                            "SellsOrder.order_status_name as orderStatusName, " + 
                            "SellsOrder.order_time as orderTime " + 
                        "from SellsOrder " + 
                        "left join OrderDetail on SellsOrder.order_no = OrderDetail.order_no " + 
                        "left join product on OrderDetail.product_cd = product.product_cd " + 
                        "where 1 = 1 ";

    // Add SQL condition by query params
    if(dateFrom != undefined && dateFrom != ""){
        sqlCommand += " and SellsOrder.order_time >= ?";
        values.push(dateFrom);
    }

    if(dateTo != undefined && dateTo != ""){
        sqlCommand += " and SellsOrder.order_time <= ?";
        values.push(dateTo);
    }

    if(orderStatus != undefined && orderStatus != ""){
        sqlCommand += " and SellsOrder.order_status = ?"
        values.push(orderStatus);
    }

    sqlCommand += " order by SellsOrder.order_no "

    console.log(`==> Select SQL: ${sqlCommand}`);

    // Retrieve raw data from DB
    return await Utils.dataOperation(req, res, sqlCommand, values);
}

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
    return await Utils.dataOperation("", "", sqlCommand, values, "");
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
