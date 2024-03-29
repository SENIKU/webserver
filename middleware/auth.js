const jwt = require("jsonwebtoken");
const { unauthorized } = require("../controllers/statuscode");
require("dotenv").config();

const auth = async(req, res, next) =>{
    let response = {};
    const token = req.header('authorization');


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
                message : "Please, LogIn"
            }
            return res.status(unauthorized).json(response);
        }

        req.user = user;
        // console.log("ini masuk sebagai role : ",user);
        next();
    })
}

module.exports ={
    auth
}