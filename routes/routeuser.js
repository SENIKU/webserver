const express = require("express");
const { getalluser, getiduser, updateuser, deleteuser } = require("../controllers/controlusers");

const app = express();

app.get("/", (req, res) => res.send("Welcome to  API seniku"));
const userall = app.get("/api/users", getalluser);
const userid = app.get("/api/users/:id" , getiduser);
const userupdate = app.put("/api/users/:id" , updateuser);
const userdelete = app.delete("/api/users/:id" , deleteuser);

module.exports = {
    userall,
    userid,
    userupdate,
    userdelete
}