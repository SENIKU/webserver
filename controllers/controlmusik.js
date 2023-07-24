const { cloudinaryconf } = require('../config/cloudinary');
const { Musik } = require('../models/musik');
const { bad, ok, created, notfound, servererror } = require('./statuscode');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinaryconf();

const getallmusik = async(req,res) =>{
    try {
        const musik = await Musik.find({})
        .populate('users', "fullname -_id");
        const response = {
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
        const musik = await Musik.findById({
            _id : req.params.id
        });

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
        const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
        const base64 = `data:image/jpeg;base64,${_base64}`;
        
        const cloudinaryResponse = await cloudinary.uploader.upload(base64,{folder: "seniku/musik", public_id: new Date().getTime() });

        const imgmusik = cloudinaryResponse.secure_url;

        const musik = await Musik.create({
            judul : req.body.judul,
            jenis : req.body.jenis,
            content : req.body.content,
            provinsi : req.body.provinsi,
            linkyt : req.body.linkyt,
            referensi : req.body.referensi,
            image : imgmusik,
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
        const musikimg = await Musik.findById({
            _id : req.params.id
        });

         // cloudinary
         const imgPublicIdSplit = musikimg.image.split('/');

         const imgPublicId = imgPublicIdSplit[imgPublicIdSplit.length - 1];
         const publicId = imgPublicId.split('.')[0];
         const updateid = `seniku/musik/${publicId}`;
       
         const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
         const base64 = `data:image/jpeg;base64,${_base64}`;
         
         const cloudinaryResponse = await cloudinary.uploader.upload(base64, { public_id: updateid, overwrite: true });
 
         const updateimage = cloudinaryResponse.secure_url;

         const { judul, jenis, content, provinsi, linkyt, referensi} = req.body;
         const imagemusik = updateimage;

         const musik = await Musik.findByIdAndUpdate({
                _id : req.params.id
            },{
                judul : judul,
                jenis : jenis,
                content : content,
                provinsi : provinsi,
                linkyt : linkyt,
                referensi : referensi,
                image : imagemusik
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

          // hapus cloudinary
        const imgPublicIdSplit = musik.image.split('/');
        
        const imgPublicId = imgPublicIdSplit[imgPublicIdSplit.length - 1];
        const publicId = imgPublicId.split('.')[0];
        
        // delete img olahraga from cloudinary
        const hapusimg = await cloudinary.uploader.destroy(`seniku/musik/${publicId}`,  {folder: `seniku/musik/${publicId}`});

        const musikdelete = await Musik.deleteOne({
            _id : req.params.id
        });
        if(musikdelete){
            return res.status(ok).json({
                message : "musik berhasil dihapus",
                messageimg : hapusimg
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