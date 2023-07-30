const { cloudinaryconf } = require('../config/cloudinary');
const { Musik } = require('../models/musik');
const { bad, ok, created, notfound, servererror } = require('./statuscode');
require('dotenv').config();


const getallmusik = async(req,res) =>{
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: `i` };
        }

        const musik = await Musik.find(query)
        .sort({ date: -1 })
        .populate("comments.users", "username imgprofile");

        const response = {
            total: musik.length,
            data : musik
        }
        return res.status(ok).json(response)
        ;
    } catch (error) {
       return res.status(bad).send({
            message : error.message
        });
    }
}

const getidmusik = async(req,res) =>{
    try {
        const musik = await Musik.findById(req.params.id)
        .sort({ date: -1 })
        .populate("comments.users", "username imgprofile");

        if(!musik){
            return res.status(notfound).json({
                message : "Musik not Found"
            });
        };

        const response = {
            data : musik
        }
        return res.status(ok).json(response);

    } catch (error) {
        return res.status(bad).send({
            message : error.message
        });
    }
}

const musikcreate = async(req,res) =>{
    try {
       

        const musik = await Musik.create({
            judul : req.body.judul,
            jenis : req.body.jenis,
            content : req.body.content,
            ciptaan : req.body.ciptaan,
            lyrics : req.body.lyrics,
            provinsi : req.body.provinsi,
            linkyt : req.body.linkyt,
            referensi : req.body.referensi,
        });

        const response = {
            message : "Musik berhasil ditambahkan",
            data : musik
        }

        return res.status(created).json(response);

    } catch (error) {
        return res.status(servererror).send({
            message : error.message
        });
    }
}

const musikupdate = async(req,res) =>{
    try {
        
         const { judul, jenis, content, ciptaan, provinsi, linkyt, referensi, lyrics} = req.body;
        
         const musik = await Musik.findByIdAndUpdate({
                _id : req.params.id
            },{
                judul : judul,
                jenis : jenis,
                content : content,
                ciptaan : ciptaan,
                lyrics : lyrics,
                provinsi : provinsi,
                linkyt : linkyt,
                referensi : referensi,
            });

            if(!musik){
                return res.status(notfound).json({
                    message : "Musik not Found"
                });
            };

            if(musik){
                return res.status(ok).json({
                    message : "Musik berhasil diupdate",
                    data : musik
                });
            }
    } catch (error) {
        return res.status(servererror).json({
            error: error.message
        });
    }
}

const musikdelete = async(req,res) =>{
    try {
         const musik = await Musik.findOne({
            _id : req.params.id
        });

        if(!musik){
            return res.status(notfound).json({
                message : "Musik not Found"
            });
        };


        const musikdelete = await Musik.deleteOne({
            _id : req.params.id
        });
        if(musikdelete){
            return res.status(ok).json({
                message : "musik berhasil dihapus",
            });
        }
    } catch (error) {
         return res.status(servererror).json({
            error: error.message
        });
    }
   

}
module.exports = {
    getallmusik,
    getidmusik,
    musikcreate,
    musikupdate,
    musikdelete
}