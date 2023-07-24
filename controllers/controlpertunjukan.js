const { cloudinaryconf } = require('../config/cloudinary');
const { Pertunjukan } = require('../models/pertunjukan');
const { bad, ok, created, notfound, servererror } = require('./statuscode');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinaryconf();

const getallpertunjukan = async(req,res) =>{
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: `i` };
        }

        const pertunjukan = await Pertunjukan.find(query)
        .sort({ date: -1 })
        .populate("comments.users", "fullname imgprofile");

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

const getidpertunjukan = async(req,res) =>{
    try {
        const pertunjukan = await Pertunjukan.findById(req.params.id)
        .sort({ date: -1 })
        .populate("comments.users", "fullname imgprofile");

        if(!pertunjukan){
            return res.status(notfound).json({
                message : "Pertunjukan not Found"
            });
        };

        const response = {
            data : pertunjukan
        }
        return res.status(ok).json(response);

    } catch (error) {
        return res.status(bad).send({
            message : error.message
        });
    }
}

const pertunjukancreate = async(req,res) =>{
    try {
        const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
        const base64 = `data:image/jpeg;base64,${_base64}`;
        
        const cloudinaryResponse = await cloudinary.uploader.upload(base64,{folder: "seniku/pertunjukan", public_id: new Date().getTime() });

        const imgpertunjukan = cloudinaryResponse.secure_url;

        const pertunjukan = await Pertunjukan.create({
            judul : req.body.judul,
            jenis : req.body.jenis,
            content : req.body.content,
            provinsi : req.body.provinsi,
            linkyt : req.body.linkyt,
            referensi : req.body.referensi,
            image : imgpertunjukan
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

const pertunjukanupdate = async(req,res) =>{
    try {
        const pertunjukanimg = await Pertunjukan.findById({
            _id : req.params.id
        });

         // cloudinary
         const imgPublicIdSplit = pertunjukanimg.image.split('/');

         const imgPublicId = imgPublicIdSplit[imgPublicIdSplit.length - 1];
         const publicId = imgPublicId.split('.')[0];
         const updateid = `seniku/pertunjukan/${publicId}`;
       
         const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
         const base64 = `data:image/jpeg;base64,${_base64}`;
         
         const cloudinaryResponse = await cloudinary.uploader.upload(base64, { public_id: updateid, overwrite: true });
 
         const updateimage = cloudinaryResponse.secure_url;

         const { judul, jenis, content, provinsi, linkyt, referensi } = req.body;
         const imagepertunjukan = updateimage;

         const pertunjukan = await Pertunjukan.findByIdAndUpdate({
                _id : req.params.id
            },{
                judul : judul,
                jenis : jenis,
                content : content,
                provinsi : provinsi,
                linkyt : linkyt,
                referensi : referensi,
                image : imagepertunjukan
            });

            if(!pertunjukan){
                return res.status(notfound).json({
                    message : "Pertunjukan not Found"
                });
            };

            if(pertunjukan){
                return res.status(ok).json({
                    message : "Pertunjukan berhasil diupdate",
                    data : pertunjukan
                });
            }
    } catch (error) {
        return res.status(servererror).json({
            error: error.message
        });
    }
}

const pertunjukandelete = async(req,res) =>{
    try {
         const pertunjukan = await Pertunjukan.findOne({
            _id : req.params.id
        });

        if(!pertunjukan){
            return res.status(notfound).json({
                message : "Pertunjukan not Found"
            });
        };

          // hapus cloudinary
        const imgPublicIdSplit = pertunjukan.image.split('/');
        
        const imgPublicId = imgPublicIdSplit[imgPublicIdSplit.length - 1];
        const publicId = imgPublicId.split('.')[0];
        
        // delete img olahraga from cloudinary
        const hapusimg = await cloudinary.uploader.destroy(`seniku/pertunjukan/${publicId}`,  {folder: `seniku/pertunjukan/${publicId}`});

        const pertunjukandelete = await Pertunjukan.deleteOne({
            _id : req.params.id
        });
        if(pertunjukandelete){
            return res.status(ok).json({
                message : "Pertunjukan berhasil dihapus",
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
    getallpertunjukan,
    getidpertunjukan,
    pertunjukancreate,
    pertunjukanupdate,
    pertunjukandelete,
}