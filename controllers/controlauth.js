const { User } = require("../models/users");
const { bad, created, notfound, ok, notallowed } = require("./statuscode");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const bcrypt =require("bcrypt");
const { cloudinaryconf } = require("../config/cloudinary");

const cloudinary = require('cloudinary').v2;
cloudinaryconf();

const SALT  = Number(process.env.PASSWORD_SALT);

const jwtsecret = process.env.JWT_SECRET;


const register = async(req, res) =>{
    try {
        const { fullname, username, email, password, confPassword} = req.body;
        const role = 'user';
        
       
        // mencari data user berdasarkan Email
        const existedEmail = await User.findOne({
           email : req.body.email 
        });

        // jika user sudah ada
        if(existedEmail){
            return res.status(notallowed).json({
                message : "Email already exist. Please Login!"
            });
        }
        
        // mencari data user berdasarkan username
        const existedusername = await User.findOne({
           username : req.body.username 
        });

        // jika user sudah ada
        if(existedusername){
            return res.status(notallowed).json({
                message : "username already exist. please re-enter username!"
            });
        }
       
        // jika nama kosong
        if(!fullname){
            return res.status(bad).json({
                message : "Please Insert Full Name"
            });
        }
        // jika username kosong
        if(!username){
            return res.status(bad).json({
                message : "Please Insert User Name"
            });
        }

        // jika email kosong
        if(!email){
            return res.status(bad).json({
                message : "Please Insert Email"
            });
        }

        // jika password tidak sampai 6 karakter
        if(password.length < 6){
            return res.status(bad).json({
                message : "Password must be at least 6 characters"
            });
        }
        // jika password tidak sama
        if(password !== confPassword){
            return res.status(bad).json({
                message : "Password and Confirm password do not match"
            });
        }

        // encrypt password
        const encryptedPassword = bcrypt.hashSync(password, SALT);

        // cloudinary
        const img = 'https://res.cloudinary.com/duw2tc97f/image/upload/v1689423319/seniku/profile/wgm5koobkuanlt5rmg4u' ;

        const cloudinaryResponse = await cloudinary.uploader.upload(img , {folder: "seniku/profile", public_id: new Date().getTime() });
        
        const imgprofile = cloudinaryResponse.secure_url;

       
        // create user
        const newUser = await User.create({
            fullname : fullname,
            username : username,
            email : email,
            password : encryptedPassword,
            role : role,
            imgprofile : imgprofile
        });

        const finduser = await User.findOne(newUser).select('fullname').select('username').select('email').select('imgprofile').select('created_at');

        res.status(created).json({
            message : "create akun successfuly",
            data : finduser
        });
    } catch (error) {
        return res.status(bad).json({
            message : error.message
        });
    }
}

const login = async(req, res) =>{
    const audience = req.header('x-audience');

    const email = req.body.email;
    const password = req.body.password;

    const users = await User.findOne({
        email : email
     });

    if(!users){
        res.status(notfound).json({
            message : "User not Found"
        })
    };

    if(!bcrypt.compare(password, users.password)){
        return res.status(bad).json({
            message : "Wrong Password"
        });
    }

    const token = jwt.sign({
        sub : users.id,
        id : users.id,
        iss : 'seniku',
        aud : audience,
        exp : parseInt(((new Date()).getTime() / 1000) + 5 * 60 * 60),
    }, jwtsecret);

    return res.status(ok).json({
        message : "Login Success",
        token : token,
        users : {
            id : users.id,
            name : users.fullname,
            username : users.username,
            imgprofile : users.imgprofile,
        }
    });
}

module.exports = {
    register,
    login
}