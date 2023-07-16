const {Provinsi} = require("../models/provinsi");
const { ok, bad, created } = require("./statuscode");
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
    createprovinsi
}