const express = require('express');
const { getallprovinsi, createprovinsi } = require('../controllers/controlprovinsi');
const { auth } = require('../middleware/auth');

const app = express();

const provinsiall = app.get("/api/provinsi",  getallprovinsi);
const provinsicreate = app.post("/api/provinsi", createprovinsi);

module.exports = {
    provinsiall,
    provinsicreate
}