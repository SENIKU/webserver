require("dotenv").config();
const { notfound, forbiden, servererror } = require("../controllers/statuscode");
const { User} = require("../models/users");


const roleadmin = async(req, res, next)=>{
  try {
    const userId = req.user.sub;
    const users = await User.findById(userId).exec();

    req.user = userId;
   

    if(!users) {
       return res.status(notfound).json({
        message : "User tidak ditemukan"
       });
    }

    if(users.role !== "admin"){
        return res.status(forbiden).json({
            message : "Akses Denied"
        })
    };
    next();
  } catch (error) {
    console.error(error);
      return res.status(servererror).json({ 
        status: "failed", 
        message: error.message
    });
  }
}

const verifyuser = async(req,res ,next) =>{
  try {
      const userId = req.user.sub;
      const users = await User.findById(userId).exec();
  
      req.user = userId;
      console.log("ini masuk sebagai role x : ", userId);

      if (!userId) {
        return res.status(401).json({ msg: "Mohon Login ke akun Anda!" });
    }

      if (!users) {
        return res.status(notfound).json({ 
            status: "failed", 
            message: "User not found " 
        });
      }
      
      req.userId = users._id;
      req.role = users.role;
      next();
    } catch (err) {
      console.error(err);
      return res.status(servererror).json({ 
        status: "failed", 
        message: err.message
    });
    }
}

module.exports = {
    roleadmin,
    verifyuser
}