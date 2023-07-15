require("dotenv").config();
const { notfound, forbiden, servererror } = require("../controllers/statuscode");
const { User} = require("../models/users");

const roleadmin = async(req, res, next)=>{
    const userId = req.users.id;

    const users = await User.findbyId(userId).excc();

    if(!users) {
       return res.status(notfound).json({
        message : "User tidak ditemukan"
       });
    }
    console.log("ini role = ", users.role);

    if(users.role !== "admin"){
        return res.status(forbiden).json({
            message : "Akses Denied"
        })
    };
    next();
}

const verifyrole = async(req,res ,next) =>{
    const userId = req.users.id;
    try {
      const user = await User.findById(userId).exec();
  
      if (!user) {
        return res.status(notfound).json({ 
            status: "failed", 
            message: "User not found " 
        });
      }
  
      if (user.role === "admin") {
        next();
      } else {
        return res.status(forbiden).json({
          status: "failed",
          message: "You do not have admin permission",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(servererror).json({ 
        status: "failed", 
        message: "Server Error" 
    });
    }
}

module.exports = {
    roleadmin,
    verifyrole
}