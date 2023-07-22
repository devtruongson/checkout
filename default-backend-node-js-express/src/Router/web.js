const express = require('express');
const SiteController = require('../controller/siteController');

const router = express.Router();

const initWebRoute = (app) => {
    // get view
    router.get('/get-login', SiteController.getLogin);
    router.get('/get-register', SiteController.getRegister);
    router.get('/home', SiteController.getHome);
    router.get('/', SiteController.getCheckAuth);
    router.get('/view-end-edit-group/:id', SiteController.getViewGroup);

    // api
    router.post('/login', SiteController.handleLogin);
    router.post('/register', SiteController.handleRegister);
    router.post('/create-group', SiteController.handleCreateGroup);
    router.get('/get-all-class', SiteController.handleGetAllClasses);
    router.post('/create-class', SiteController.handleCreateClass);
    router.post('/create-meetings', SiteController.handleCreateMeeting);

    return app.use('/', router);
};

module.exports = initWebRoute;
