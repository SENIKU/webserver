const mongoose = require("mongoose");
require("dotenv").config();

const dbs = process.env.MONGODB_URL;

// const connectDBs = async() =>{
//     try {
//         await mongoose.connect(dbs, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log("MongoDB Connected...");
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }
// }
const connectDBs = async() =>{
    mongoose.connect(dbs, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
 
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'Connection Error'));
    db.once('open', () => console.log('we are connected'));
}

module.exports = {
    connectDBs
};