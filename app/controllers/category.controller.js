const Utils = require('../utils/utils');
const Category = require('../models/category.model');


/* Get Food Categories from DB */
exports.getCategories = async (req, res) => {
    let sqlCommand = "select category_cd, category_name, parent_category_cd from category;";

    console.log(`==> Select SQL: ${sqlCommand}`);

    try {
        const result = await Category.getCategories(sqlCommand);

        res.statusMessage = 'OK';
        res.status(200).json(result);

    } catch (error) {
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
        const result = await Category.addCategory(sqlCommand, values);

        res.statusMessage = 'Created';
        res.status(201).send();
    } catch (error) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Bad Request';
        res.status(400)
            .send();
        return;
    }
};