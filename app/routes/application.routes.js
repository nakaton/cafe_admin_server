const category = require('../controllers/category.controller');

module.exports = (app) => {
    app.route(app.rootUrl + '/categories')
        .get(category.getCategories);

    app.route(app.rootUrl + '/category')
        .post(category.addCategory);

    // app.route(app.rootUrl + '/products')
    //     .get(product.getProducts);

    // app.route(app.rootUrl + '/orders')
    //     .get(order.getOrders);
    
}