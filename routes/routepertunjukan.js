const express = require('express');
const { getallpertunjukan, pertunjukancreate } = require('../controllers/controlpertunjukan');

const app = express();

const pertunjukanall = app.get("/api/pertunjukan", getallpertunjukan);
const createpertunjukan = app.post("/api/pertunjukan", pertunjukancreate);

module.exports = {
    pertunjukanall,
    createpertunjukan
}