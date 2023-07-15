const express = require("express");
const { register, login } = require("../controllers/controlauth");


const app = express();

const newakun = app.post("/api/register", register);
const loginakun = app.post("/api/login", login);


module.exports = {
    newakun,
    loginakun
}