const models = require('../models')
require('dotenv').config()
async function kirim(req,res){
    let datadevice = await models.device.create({ nama: req.body.nama, ip: req.body.ip })
    if (datadevice) {
        res.status(200).json({ message: "create data device", data: datadevice })
    } else {
        res.status(422).json({ message: "failed updated data device" })
    }
}
async function kirimdevice(req, res) {
   
    //console.log(api_key)
        const api_key_value = "tPmAT5Ab3j7F9";
        const apikey = req.body.api_key
        //const nama = "123456"
        // const nama = req.body.nama
        // console.log(nama)
        if (apikey === api_key_value) {

            let datadevice = await models.device.create({ nama: req.body.nama, ip: req.body.ip, status: req.body.status })
            if (datadevice) {
                res.status(200).json({ message: "create data device", data: datadevice })
            } else {
                res.status(422).json({ message: "failed updated data device" })
            }
        }



}
async function pilihdevice(req, res) {
    const verified = req.verified
    if (verified.role === true) {
    const id = req.params.id
    const iduserDetail = await models.UserDetail.findOne({ where: { userId: id } })
    // const temp =  await models.DataPenyandang.findByPk(verified.id_user)
    const pilihdevice = await models.pilihdevice.create({
        id_device: req.body.id_device,
        id_user: iduserDetail.id,
    })
    if (pilihdevice) {
        res.status(200).json({
            message: 'Success create data',
            data: pilihdevice
        })
    } else {
        res.status(400).json({
            message: 'failed create data',
        })
    }
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
async function lihatdevice(req, res) {
    const verified = req.verified

    if (verified.role === false) {
        const tempip = await models.pilihdevice.findAll({
            include: [{
                model: models.device,
            },
            {
                model: models.User,
                attributes: {
                    exclude: ['password']
                },
            }
            ],

            where: {
                id_user: verified.id,
            }
        })
        if (tempip) {
            res.status(200).json({
                message: 'Success show data',
                data: tempip
            })
        } else {
            res.status(400).json({
                message: 'failed show data',
            })
        }
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }

}
async function device(req,res){
    const temp = await models.device.findAll()
    if (temp) {
        res.status(200).json({
            message: 'Success show data',
            data: temp
        })
    } else {
        res.status(400).json({
            message: 'failed show data',
        })
    }
}
module.exports = {
    device: device,
    kirimdevice: kirimdevice,
    pilihdevice: pilihdevice,
    lihatdevice: lihatdevice,
    kirim:kirim
}