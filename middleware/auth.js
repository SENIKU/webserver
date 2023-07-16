const jwt = require("jsonwebtoken");
const { unauthorized } = require("../controllers/statuscode");
require("dotenv").config();

const auth = async(req, res, next) =>{
    let response = {};
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        response ={ 
            status : "ERROR",
            message : "Please, Log Back In"
        };
        return res.status(unauthorized).json(response);
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) =>{
        if(error){
            response = {
                status : "Error",
                message : error.message
            }
            return res.status(unauthorized).json(response);
        }

        req.user = user;
        console.log("ini masuk sebagai role : ",user);
        next();
    })
}

module.exports ={
    auth
}