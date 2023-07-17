
const { Jenis } = require("../models/jenisp");
const { ok, bad, created } = require("./statuscode");
require("dotenv").config();

const getalljenis = async (req, res) =>{
    try {
        const jenisper = await Jenis.find({}); //.populate('pertunjukans', "judul -_id");
        const response = {
            data : jenisper
        }
        return res.status(ok).json(response);
    } catch (error) {
        return res.status(bad).send({
            message : error.message
        });
    }
};

const createjenis = async (req, res) =>{
    try {
        const jenis  = await Jenis.create({
            jenis : req.body.jenis
        });
        
        const response = {
            message : "Jenis pertunjukan berhasil ditambahkan",
            data : jenis
        }

        return res.status(created).json(response);

    } catch (error) {
        return res.status(bad).json({
            message : error.message
        });
    }
}

module.exports = {
    getalljenis,
    createjenis
}