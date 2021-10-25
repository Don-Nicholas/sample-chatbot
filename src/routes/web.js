const express =  require('express');
const homePageController = require('../controllers/homePageController');
const chatBotController = require('../controllers/chatBotController');

let router = express.Router();

let initWebRoutes = (app) => {
    app.get('/', homePageController.getHomePage);
    

    app.get('/webhook', chatBotController.getWebhook);
    app.post('/webhook', chatBotController.postWebhook);

    return app.use('/', router);
};

module.exports = initWebRoutes;