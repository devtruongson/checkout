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
    router.get('/manage-calendar/:id', SiteController.getManageCalendar);
    router.get('/get-meeting/:id', SiteController.getGetMeeting);
    router.get('/get-meeting-user/:id', SiteController.getGetMeetingUser);
    router.get('/get-home-user', SiteController.getHomeUser);
    router.get('/view-edit-group-user/:id', SiteController.getViewGroupUser);
    router.get('/get-manage-user', SiteController.getGetManageUser);

    // api
    router.post('/login', SiteController.handleLogin);
    router.post('/register', SiteController.handleRegister);
    router.post('/create-group', SiteController.handleCreateGroup);
    router.get('/get-all-class', SiteController.handleGetAllClasses);
    router.post('/create-class', SiteController.handleCreateClass);
    router.post('/create-meetings', SiteController.handleCreateMeeting);
    router.post('/canceled-meeting', SiteController.handleCanceledMeeting);
    router.post('/done-meeting', SiteController.handleDoneMeeting);
    router.post('/add-group-meeting', SiteController.handleAddGroupMeeting);
    router.post('/handle-meeting', SiteController.handWorkMeetings);
    router.post('/handle-meeting-user', SiteController.handWorkMeetingUser);
    router.get('/get-all-group-assets', SiteController.handleGetAllGroupAssets);
    router.post('/active-group', SiteController.handleActiveGroup);
    router.get('/get-all-meeting-empty', SiteController.handleGetAllMeetingsEmpty);
    router.post('/booking-meeting-empty', SiteController.handleBookingMeetingEmpty);
    router.get('/get-detail-user', SiteController.handleGetDetailUser);
    router.post('/update-user', SiteController.handleUpdateUser);
    router.post('/delete-user/:id', SiteController.handleDeleteUser);
    router.post('/post-notify', SiteController.handlePostNotify);

    return app.use('/', router);
};

module.exports = initWebRoute;
