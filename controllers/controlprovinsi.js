const {Provinsi} = require("../models/provinsi");
const { ok, bad, created, notfound } = require("./statuscode");
require("dotenv").config();

const getallprovinsi = async (req, res) =>{
    try {
        const provinsi = await Provinsi.find({}); //.populate('pertunjukans', "judul -_id");
        const response = {
            data : provinsi
        }
        return res.status(ok).json(response);
    } catch (error) {
        return res.status(bad).send({
            message : error.message
        });
    }
};

const getidprovinsi = async (req, res) =>{
    try {
        const provinsi = await Provinsi.findById({
            _id : req.params.id
        });

        if(!provinsi){
            return res.status(notfound).json({
                message : "data provinsi not Found"
            });
        };

        const response = {
            data : provinsi
        }

        res.status(ok).json(response);
    } catch (error) {
        res.status(bad).send({
            message : error.message
        })
    }
}

const createprovinsi = async (req, res) =>{
    try {
        const provinsi  = await Provinsi.create({
            nama : req.body.nama
        });
        
        const response = {
            message : "Provinsi berhasil ditambahkan",
            data : provinsi
        }

        return res.status(created).json(response);

    } catch (error) {
        return res.status(bad).json({
            message : error.message
        });
    }
}


module.exports = {
    getallprovinsi,
    getidprovinsi,
    createprovinsi,
}