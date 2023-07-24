const express = require('express');

const { auth } = require('../middleware/auth');
const { roleadmin } = require('../middleware/authrole');
const { createcommentmusik } = require('../controllers/controlcomment');
const { getallmusik, getidmusik, musikcreate, musikupdate, musikdelete } = require('../controllers/controlmusik');

const app = express();

const musikall = app.get("/api/musik", getallmusik);
const musikbyid = app.get("/api/musik/:id", getidmusik);
const createmusik = app.post("/api/musik", auth, roleadmin, musikcreate);
const updatemusik = app.put("/api/musik/:id", auth, roleadmin, musikupdate);
const deletemusik = app.delete("/api/musik/:id", auth, roleadmin, musikdelete);

// comment 
const commentcreatemusik = app.post("/api/musik/:id/comment", auth, createcommentmusik);

module.exports = {
    musikall,
    musikbyid,
    createmusik,
    updatemusik,
    deletemusik,
    commentcreatemusik
}