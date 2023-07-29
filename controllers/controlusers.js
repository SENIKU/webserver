const { cloudinaryconf } = require("../config/cloudinary");
const { User } = require("../models/users");
const { bad, created, ok, notfound, servererror } = require("./statuscode");
require("dotenv").config();
const cloudinary = require('cloudinary').v2;
cloudinaryconf();

const getalluser = async (req, res) =>{
    try {
        const users = await User.find({}).select('fullname').select('username').select('email').select('role').select('imgprofile').select('created_at');
        
        const response = {
            data : users
        }
        return res.status(ok).json(response);
    } catch (error) {
        res.status(bad).send({
            message : error.message
        });
    }
}

const getiduser = async (req, res) =>{
    try {
        const users = await User.findById({
            _id : req.params.id
        }).select('fullname').select('username').select('email').select('imgprofile').select('created_at');

        if(!users){
            return res.status(notfound).json({
                message : "Users not Found"
            });
        };

        const response = {
            data : users
        }

        res.status(ok).json(response);
    } catch (error) {
        res.status(bad).send({
            message : error.message
        })
    }
}

const updateuser = async(req, res) =>{

    try {
        const {fullname, username} = req.body;

        if (!fullname && !username && !req.files) {
            return res.status(400).json({
              status: "failed",
              message: "Please update at least one data",
            });
          }
          const dataUser = {
            fullname: req.body.fullname,
            username: req.body.username,
          };
        
        //ketika data req.user.id diambil dari middleware auth
        const usersimg = await User.findById({
            _id : req.user.id 
        });
        
        // cloudinary
        if(req.files){
            const imgPublicIdSplit = usersimg.imgprofile.split('/');

            const imgPublicId = imgPublicIdSplit[imgPublicIdSplit.length - 1];
            const publicId = imgPublicId.split('.')[0];
            const updateid = `seniku/profile/${publicId}`;
          
            const _base64 = Buffer.from(req.files.imgprofile.data, 'base64').toString('base64');
            const base64 = `data:image/jpeg;base64,${_base64}`;
            
            const cloudinaryResponse = await cloudinary.uploader.upload(base64,{ public_id: updateid, overwrite: true });
    
            const updateimgprofile = cloudinaryResponse.secure_url;
            
            dataUser.imgprofile = updateimgprofile;
        }
        
        const existedusername = await User.findOne({
            username : req.body.username 
         });

        if(existedusername){
            return res.status(bad).json({
                message : "Username already exist"
            });
        }
        
        const user = await User.findByIdAndUpdate(req.user.id, dataUser, {
            new: true,
            runValidators: true,
        }).select('fullname').select('username').select('email').select('imgprofile');

        if(!user){
            return res.status(notfound).json({
                message : "User not Found"
            });
        }
        if(user){
            return res.status(created).json({
                message : "Update Users success",
                data : user
            });
        }
    } catch (error) {
        return res.status(servererror).json({
            error: error.message
        });
    }
}

const deleteuser = async(req, res) =>{
    try {
        
        const users = await User.findOne({
            _id : req.params.id
        });
        
        if(!users){
            return res.status(notfound).json({
                message : "User Not Found"
            });
        }
        
        // cloudinary
        const imgPublicIdSplit = users.imgprofile.split('/');
        
        const imgPublicId = imgPublicIdSplit[imgPublicIdSplit.length - 1];
        const publicId = imgPublicId.split('.')[0];
        
        // delete img olahraga from cloudinary
        const hapusimg = await cloudinary.uploader.destroy(`seniku/profile/${publicId}`,  {folder: `seniku/profile/${publicId}`});
        
        const usersdelete = await User.deleteOne({
            _id : req.params.id
        });
        if(usersdelete){
           return res.status(ok).json({
                message : "Delete Users Successfuly",
                img : hapusimg
            });
        } 

    } catch (error) {
        return res.status(servererror).json({
            error: error.message
        });
    }
    
}

module.exports = {
    getalluser,
    getiduser,
    updateuser,
    deleteuser
}