const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const logger = require('../middleware/logger');
const allowCrossOriginRequests = require('../middleware/crossOrigin');


module.exports = () => {
    const app = express();
    app.rootUrl = process.env.ROOT_URL || '/api/v1';

    // Init MiddleWare
    app.use(logger);
    app.use(allowCrossOriginRequests);
    app.use(bodyParser.json());
    app.use(bodyParser.raw({type: 'image/jpeg', limit: '50mb' }));
    app.use(bodyParser.raw({type: 'image/png', limit: '50mb' }));
    app.use(multer({dest: process.env.PHOTO_DIRECTORY || './storage/photos/'}).single('photo'));
    
    // Init Route
    // require('')

    // Test for express work.
    app.get('/', (req, res) => {
        res.send({'message': 'Hello World!'})
    })

    return app;
}