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
    let orderNo = req.params.id;

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
    if(orderNo != undefined && orderNo != ""){
        sqlCommand += " and SellsOrder.order_no = ?"
        values.push(orderNo);
    }

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
Description: Get Order by order id 
*/
exports.getOrderById = async (req, res) => {
    // Get order raw data
    let results = await this.getOrders(req, res);

    Utils.setUpResponse(res, "OK", results);
};


/* 
Description: Create new Order 
*/
exports.addOrder = async (req, res) => {
    // TODO: Need to figure out Order register logic again.
    let postDate = new Date();
    let valuesOrder = [
        req.body.orderNo,
        req.body.customerId,
        postDate,
        amount,
        "R",
        "Received",
        req.body.comments,
        req.body.userName,
        postDate
    ];

    // TODO: add loop for dealing with order multiple items 
    let valuesOrderDetail = [
        req.body.orderNo,
        req.body.productCd,
        req.body.qty,
        "R",
        "Received",
        req.body.comments,
        req.body.userName,
        postDate
    ];

    let sqlCommandOrder = "insert into SellsOrder " + 
                            "(order_no, customer_id, order_time, amount, order_status, order_status_name, comments, create_person, create_date ) " + 
                     "values (?,?,?,?,?,?,?,?,?)";

    console.log(`==> Insert SQL: ${sqlCommandOrder}`);

    await Utils.dataOperation(req, res, sqlCommandOrderDetail, valuesOrder);


    let sqlCommandOrderDetail = "insert into OrderDetail " + 
                            "(order_no, product_cd, qty, product_status, product_status_name, comments, create_person, create_date ) " + 
                     "values (?,?,?,?,?,?,?,?,?)";

    console.log(`==> Insert SQL: ${sqlCommandOrderDetail}`);

    //Response for POST success operation is 'Created'
    await Utils.dataOperationToResponse(req, res, sqlCommandOrderDetail, valuesOrderDetail, "Created");
};

/* 
Description: Update Order status by order no
Status: R Received
        P Pending
        D Done
*/
exports.updateOrderStatus = async (req, res) => {
    let orderNo = req.params.id;

    let data = await prepareSqlAndExecute(req, res);

    if(data == undefined || data.length == 0){
        Utils.setUpResponse(res, "Not Found", "");
        return;
    }

    let udpateDate = new Date();
    let values = [
        req.body.orderStatus,
        req.body.orderStatusName,
        "admin",
        udpateDate,
        orderNo
    ];

    let sqlCommandOrderDetail = "update OrderDetail " + 
                        "set product_status = ?, " + 
                            "product_status_name = ?, " + 
                            "update_person = ?, " + 
                            "update_date = ? " + 
                      "where order_no = ?; ";

    console.log(`==> Update SQL: ${sqlCommandOrderDetail}`);

    await Utils.dataOperation(req, res, sqlCommandOrderDetail, values);


    let sqlCommandOrder = "update SellsOrder " + 
                        "set order_status = ?, " + 
                            "order_status_name = ?, " + 
                            "update_person = ?, " + 
                            "update_date = ? " + 
                      "where order_no = ?; ";

    console.log(`==> Update SQL: ${sqlCommandOrder}`);

    //Response for UPDATE success operation is 'OK'
    await Utils.dataOperationToResponse(req, res, sqlCommandOrder, values, "OK");
}

/* 
Description: Delete Order by Order No
*/
exports.deleteOrder = async (req, res) => {
    let orderNo = req.params.id;
    let values = [orderNo];

    let sqlCommandOrderDetail = "delete from OrderDetail where order_no = ?; ";

    console.log(`==> Delete SQL: ${sqlCommandOrderDetail}`);
    await Utils.dataOperation(req, res, sqlCommandOrderDetail, values);

    let sqlCommandOrder = "delete from SellsOrder where order_no = ?; ";

    console.log(`==> Delete SQL: ${sqlCommandOrder}`);


    //Response for DELETE success operation is 'OK'
    await Utils.dataOperationToResponse(req, res, sqlCommandOrder, values, "OK");
}
