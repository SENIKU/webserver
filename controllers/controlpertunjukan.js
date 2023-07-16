const { cloudinaryconf } = require('../config/cloudinary');
const { Pertunjukan } = require('../models/pertunjukan');
const { bad, ok, created } = require('./statuscode');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinaryconf();

const getallpertunjukan = async(req,res) =>{
    try {
        const pertunjukan = await Pertunjukan.find({}).populate('provinsis', "nama -_id");


        const response = {
            data : pertunjukan
        }
        return res.status(ok).json(response)
        ;
    } catch (error) {
       return res.status(bad).send({
            message : error.message
        });
    }
}

const pertunjukancreate = async(req,res) =>{
    try {

        const pertunjukan = await Pertunjukan.create({
            judul : req.body.judul,
            content : req.body.content,
            provinsis : req.body.provinsis,
            image : req.body.image,
        });

        const response = {
            message : "Pertunjukan berhasil ditambahkan",
            data : pertunjukan
        }

        return res.status(created).json(response);

    } catch (error) {
        return res.status(bad).send({
            message : error.message
        });
    }
}

module.exports = {
    getallpertunjukan,
    pertunjukancreate,
}