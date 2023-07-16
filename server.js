const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDBs } = require("./config/dbs");
const { userall, userid, userupdate, userdelete } = require("./routes/routeuser");
const { newakun, loginakun } = require("./routes/routeauth");
const upload = require("express-fileupload");
const { provinsiall, provinsicreate } = require("./routes/routeprovinsi");
const { pertunjukanall, createpertunjukan } = require("./routes/routepertunjukan");

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

// users
app.use(userall, userid, userupdate, userdelete);

// auth
app.use(newakun, loginakun);

// provinsi
app.use(provinsiall, provinsicreate);

// pertunjukan
app.use(pertunjukanall, createpertunjukan);

app.listen(port,'0.0.0.0', function(){
    console.log(`Your application is running on the port ${port}`)
});