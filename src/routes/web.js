const express =  require('express');
const homePageController = require('../controllers/homePageController');

let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/', (req, res) => {
    //     res.send({data:'Hello World!'});
    // })

    app.get('/', homePageController.getHomePage);
    return app.use('/', router);
};

module.exports = initWebRoutes;