const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDBs } = require("./config/dbs");
const { userall, userid, userupdate, userdelete } = require("./routes/routeuser");
const { newakun, loginakun } = require("./routes/routeauth");
const upload = require("express-fileupload");

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin : true
}));
// kegunaannnya biar bisa menggunakan form-data
app.use(upload());

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

connectDBs();

// global api

app.use(userall, userid, userupdate, userdelete);
app.use(newakun, loginakun);

app.listen(port,'0.0.0.0', function(){
    console.log(`Your application is running on the port ${port}`)
});