const { cloudinaryconf } = require('../config/cloudinary');
const { Event } = require('../models/event');
const { bad, ok, created, notfound, servererror } = require('./statuscode');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinaryconf();

const getallevent = async(req,res) =>{
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: `i` };
        }

        const event = await Event.find(query)
        .sort({ date: -1 })
        .populate("comments.users", "username imgprofile");

        const response = {
            total: event.length,
            data : event
        }
        return res.status(ok).json(response)
        ;
    } catch (error) {
       return res.status(bad).send({
            message : error.message
        });
    }
}

const getidevent = async(req,res) =>{
    try {
        const event = await Event.findById(req.params.id)
        .sort({ date: -1 })
        .populate("comments.users", "fullname imgprofile");

        if(!event){
            return res.status(notfound).json({
                message : "event not Found"
            });
        };

        const response = {
            data : event
        }
        return res.status(ok).json(response);

    } catch (error) {
        return res.status(bad).send({
            message : error.message
        });
    }
}

const eventcreate = async(req,res) =>{
    try {
        const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
        const base64 = `data:image/jpeg;base64,${_base64}`;
        
        const cloudinaryResponse = await cloudinary.uploader.upload(base64,{folder: "seniku/event", public_id: new Date().getTime() });

        const imgevent = cloudinaryResponse.secure_url;
        const event = await Event.create({
            judul : req.body.judul,
            deskripsi : req.body.deskripsi,
            jadwal : new Date(req.body.jadwal),
            lokasi : req.body.lokasi,
            orang : req.body.orang,
            tiket : req.body.tiket,
            image : imgevent
        });

        const response = {
            message : "event berhasil ditambahkan",
            data : event
        }

        return res.status(created).json(response);

    } catch (error) {
        return res.status(bad).send({
            message : error.message
        });
    }
}

const eventupdate = async(req,res) =>{
    try {
        const eventimg = await Event.findById({
            _id : req.params.id
        });

         // cloudinary
         const imgPublicIdSplit = eventimg.image.split('/');

         const imgPublicId = imgPublicIdSplit[imgPublicIdSplit.length - 1];
         const publicId = imgPublicId.split('.')[0];
         const updateid = `seniku/event/${publicId}`;
       
         const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
         const base64 = `data:image/jpeg;base64,${_base64}`;
         
         const cloudinaryResponse = await cloudinary.uploader.upload(base64, { public_id: updateid, overwrite: true });
 
         const updateimage = cloudinaryResponse.secure_url;

         const { judul, deskripsi, lokasi, orang, tiket } = req.body;
         const jadwal = new Date(req.body.jadwal);
         const imgevent = updateimage;

         const event = await Event.findByIdAndUpdate({
                _id : req.params.id
            },{
                judul : judul,
                deskripsi : deskripsi,
                jadwal : jadwal,
                lokasi : lokasi,
                orang : orang,
                tiket : tiket,
                image : imgevent
            });

            if(!event){
                return res.status(notfound).json({
                    message : "event not Found"
                });
            };

            if(event){
                return res.status(ok).json({
                    message : "event berhasil diupdate",
                    data : event
                });
            }
    } catch (error) {
        return res.status(servererror).json({
            error: error.message
        });
    }
}

const eventdelete = async(req,res) =>{
    try {
         const event = await Event.findOne({
            _id : req.params.id
        });

        if(!event){
            return res.status(notfound).json({
                message : "event not Found"
            });
        };

          // hapus cloudinary
        const imgPublicIdSplit = event.image.split('/');
        
        const imgPublicId = imgPublicIdSplit[imgPublicIdSplit.length - 1];
        const publicId = imgPublicId.split('.')[0];
        
        // delete img olahraga from cloudinary
        const hapusimg = await cloudinary.uploader.destroy(`seniku/event/${publicId}`,  {folder: `seniku/event/${publicId}`});

        const eventdelete = await event.deleteOne({
            _id : req.params.id
        });
        if(eventdelete){
            return res.status(ok).json({
                message : "event berhasil dihapus",
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
    getallevent,
    getidevent,
    eventcreate,
    eventupdate,
    eventdelete,
}