const express = require('express');
const {getcomment } = require('../controllers/controlcomment');

const app = express();


const commentget = app.get("/api/comment", getcomment);

module.exports = {
    commentget
}