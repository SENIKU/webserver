const express = require('express');
const { getallpertunjukan, pertunjukancreate, getidpertunjukan, pertunjukandelete, pertunjukanupdate } = require('../controllers/controlpertunjukan');
const { auth } = require('../middleware/auth');
const { roleadmin } = require('../middleware/authrole');

const app = express();

const pertunjukanall = app.get("/api/pertunjukan", getallpertunjukan);
const pertunjukanbyid = app.get("/api/pertunjukan/:id", getidpertunjukan);
const createpertunjukan = app.post("/api/pertunjukan", auth, roleadmin, pertunjukancreate);
const updatepertunjukan = app.put("/api/pertunjukan/:id", pertunjukanupdate);
const deletepertunjukan = app.delete("/api/pertunjukan/:id",  pertunjukandelete);

module.exports = {
    pertunjukanall,
    pertunjukanbyid,
    createpertunjukan,
    updatepertunjukan,
    deletepertunjukan
}