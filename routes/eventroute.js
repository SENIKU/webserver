const express = require('express');

const { auth } = require('../middleware/auth');
const { roleadmin } = require('../middleware/authrole');
const { getallevent, getidevent, eventcreate, eventupdate, eventdelete } = require('../controllers/controlevents');

const app = express();

const eventall = app.get("/api/event", getallevent);
const eventbyid = app.get("/api/event/:id", getidevent);
const createevent = app.post("/api/event", auth, roleadmin, eventcreate);
const updateevent = app.put("/api/event/:id", auth, roleadmin, eventupdate);
const deleteevent = app.delete("/api/event/:id", auth, roleadmin, eventdelete);

// comment 
// const commentcreateevent = app.post("/api/event/:id/comment", auth, createcommentevent);

module.exports = {
    eventall,
    eventbyid,
    createevent,
    updateevent,
    deleteevent,
    // commentcreateevent
}