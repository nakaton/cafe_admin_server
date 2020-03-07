const category = require('../controllers/category.controller');
const product = require('../controllers/product.controller');
const order = require('../controllers/order.controller');

module.exports = (app) => {
    // Route for category
    app.route(app.rootUrl + '/categories')
        .get(category.getCategories);

    app.route(app.rootUrl + '/category')
        .post(category.addCategory);

    app.route(app.rootUrl + '/category/:cd')
        .put(category.updateCategory);

    app.route(app.rootUrl + '/category/:cd')
        .delete(category.deleteCategory);
    
    // Route for Product
    app.route(app.rootUrl + '/products')
        .get(product.getProducts);

    app.route(app.rootUrl + '/product')
        .post(product.addProduct);

    app.route(app.rootUrl + '/product/:cd')
        .put(product.updateProduct);

    app.route(app.rootUrl + '/product/:cd')
        .delete(product.deleteProduct);


    // Route for Order
    app.route(app.rootUrl + '/orders')
        .get(order.getOrders);

    // app.route(app.rootUrl + '/order/:id')
    //     .get(order.getOrderById);

    // app.route(app.rootUrl + '/order')
    //     .post(order.addOrder);

    // app.route(app.rootUrl + '/order/:id')
    //     .put(order.updateOrderStatus);

    // app.route(app.rootUrl + '/order/:id')
    //     .delete(order.deleteOrder);
}