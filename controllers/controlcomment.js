const { Pertunjukan } = require('../models/pertunjukan');
const { User } = require('../models/users');
const { servererror, notfound, bad, created } = require('./statuscode');
require('dotenv').config();

const createcomment = async(req, res)=>{
    try {
        const pertunjukan = await Pertunjukan.findById({
            _id : req.params.id
        });

        if(!pertunjukan){
            return res.status(notfound).json({
                message : "pertunjukan not Found"
            });
        }
        const users = await User.findById(req.user.id);

        if(!users){
            return res.status(notfound).json({
                message : "user not Found"
            });
        };

        if(!req.body.comment){
            return res.status(bad).json({
                message : "Please insert comment"
            });
        }

        pertunjukan.comments.push({
            users : users._id,
            comment : req.body.comment,
            createdAt : Date.now(),
        });
        await pertunjukan.save();
        
        res.status(created).json({
            status : "successfully",
            message : "comment add successfully",
        });
    } catch (error) {
        return res.status(servererror).send({
            message : error.message
        });
    }
}

const getcomment = async(req, res)=>{
    try {
        const pertunjukan = await Pertunjukan.aggregate([
        {
            $project : {
                _id : 1,
                judul : 1,
                jenis : 1,
                content : 1,
                provinsi : 1,
                image : 1,
                linkyt : 1,
                date : 1,
                commentCount: { $size: { $ifNull: ["$comments", []] } },
            },
        },{
            $sort : {
                commentCount : -1,
            }
        },
        {
            $limit : 5,
        },

    ]).exec();

    if(!pertunjukan){
        return res.status(notfound).json({
            message : "pertunjukan not Found"
        });
    }
    // await Pertunjukan.populate(pertunjukan, {path: "comments", select:  {_id: 1, fullname: 1}});
    res.status(created).json({
        status : "successfully",
        message : "comment add successfully",
        data : pertunjukan,
    });

    } catch (error) {
        res.status(servererror).json({
            message : error.message
        });
    }
}
module.exports ={
    createcomment,
    getcomment
}