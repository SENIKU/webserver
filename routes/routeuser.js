const express = require("express");
const { getalluser, getiduser, updateuser, deleteuser } = require("../controllers/controlusers");
const { auth } = require("../middleware/auth");
const { roleadmin, verifyuser } = require("../middleware/authrole");

const app = express();

app.get("/", (req, res) => res.send("Welcome to  API seniku"));
const userall = app.get("/api/users", auth, roleadmin, getalluser);
const userid = app.get("/api/users/:id", auth, verifyuser, getiduser);
const userupdate = app.put("/api/users/:id" , updateuser);
const userdelete = app.delete("/api/users/:id" , auth, roleadmin, deleteuser);

module.exports = {
    userall,
    userid,
    userupdate,
    userdelete
}