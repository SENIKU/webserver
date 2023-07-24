const express = require('express');
const { getallpertunjukan, pertunjukancreate, getidpertunjukan, pertunjukandelete, pertunjukanupdate } = require('../controllers/controlpertunjukan');
const { auth } = require('../middleware/auth');
const { roleadmin } = require('../middleware/authrole');
const { createcomment } = require('../controllers/controlcomment');

const app = express();

const pertunjukanall = app.get("/api/pertunjukan", getallpertunjukan);
const pertunjukanbyid = app.get("/api/pertunjukan/:id", getidpertunjukan);
const createpertunjukan = app.post("/api/pertunjukan", auth, roleadmin, pertunjukancreate);
const updatepertunjukan = app.put("/api/pertunjukan/:id", auth, roleadmin, pertunjukanupdate);
const deletepertunjukan = app.delete("/api/pertunjukan/:id", auth, roleadmin, pertunjukandelete);

// comment 
const commentcreate = app.post("/api/pertunjukan/:id/comment", auth, createcomment);

module.exports = {
    pertunjukanall,
    pertunjukanbyid,
    createpertunjukan,
    updatepertunjukan,
    deletepertunjukan,
    commentcreate
}