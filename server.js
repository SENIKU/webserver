const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDBs } = require("./config/dbs");
const { userall, userid, userupdate, userdelete } = require("./routes/routeuser");
const { newakun, loginakun } = require("./routes/routeauth");
const upload = require("express-fileupload");
const { provinsiall, provinsicreate } = require("./routes/routeprovinsi");
const { pertunjukanall, createpertunjukan, pertunjukanbyid, deletepertunjukan, updatepertunjukan, commentcreate } = require("./routes/routepertunjukan");
const { Server} = require("socket.io");
const { commentget } = require("./routes/routecomment");

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
app.use(pertunjukanall, pertunjukanbyid , createpertunjukan, updatepertunjukan, deletepertunjukan, commentcreate);

// comment pertunjukan
app.use(commentget);
const server = app.listen(port,'0.0.0.0', function(){
    console.log(`Your application is running on the port ${port}`)
});

const io = new Server(server, {
    cors : {
        origin : "*"
    },
});

io.on("connection", function (socket){
    console.log("user connect");
    
    socket.on("disconnect", function(){
        console.log("user disconnect");
    });
    socket.on("message", function(data){
        console.log(data);
        socket.broadcast.emit("message", data);
    });

});