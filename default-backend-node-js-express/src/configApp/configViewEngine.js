const express = require('express');
const path = require('path');

function ConfigViewEngine(app) {
    app.set('view engine', 'ejs');
    app.set('views', path.join('./src/', 'views'));
}

module.exports = ConfigViewEngine;
