const express = require('express');
const path = require('path');

function configPublic(app) {
    app.use(express.static(path.join('./src/', 'public')));
}

module.exports = configPublic;
