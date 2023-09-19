const models = require('../models')
const { Op } = require('sequelize');
require('dotenv').config()
module.exports = {
    datawajah: async (req, res) => {
        const verified = req.verified
        if (verified.role === true) {
            const tampilwajah = await models.datawajah.findAll({  include: [{
                model: models.fotowajah,
            }
            ]})
            if (tampilwajah) {
                res.status(200).json({ message: "show data wajah", data: tampilwajah })
            } else {
                res.status(422).json({ message: "failed show data wajah" })
            }
        } else {
            res.status(500).json({ message: "Invalid credentials!" })
        }
    },
    datapengunjung: async (req, res) => {
        try{
        const verified = req.verified
        if (verified.role === true) {
            console.log(verified.id)
            const alat = await models.device.findOne({ where: { admin_id: verified.id } })
            console.log(alat.id)
            const tampildatapengunjung = await models.device.findAll({
                include:[
                    {
                      model: models.datapengunjung
                    }
                    // {
                    //     model: models.User
                    // }
                ],
                where: {
                    id: alat.id
                }
            })
            if (tampildatapengunjung) {
                res.status(200).json({ message: "show data pengunjung", data: tampildatapengunjung })
            } else {
                res.status(422).json({ message: "failed show data pengunjung" })
            }
        } else {
            res.status(500).json({ message: "Invalid credentials!" })
        }
    } catch (error) {
        res.status(500).json({ message: "Mohon Check Device Data Wajah dan Suhu Anda", error })
    }
    },
    kelolauser: async (req, res) => {
        const verified = req.verified
        if (verified.role === true) {
            const datauser = await models.User.findAll({ where: {
                role : false,
                
            }})
            if (datauser) {
                res.status(200).json({ message: "show data user", data: datauser })
            } else {
                res.status(422).json({ message: "failed show data user" })
            }
        } else {
            res.status(500).json({ message: "Invalid credentials!" })
        }

    },
    detaildevice: async (req, res) => {
        const verified = req.verified
        if (verified.role === true) {
            const id = req.params.id
         
            const tempip = await models.pilihdevice.findAll({
                include: [{
                    model: models.device,
                },
                {
                    model: models.User
                }
                ],
                where: {    
                    id_user: id,
                }
            })
            const device =  await models.device.findAll()
            if (tempip && device) {
                res.status(200).json({ message: "show data user", datas:device, data: tempip})
            } else {
                res.status(422).json({ message: "failed show data user" })
            }
        } else {
            res.status(500).json({ message: "Invalid credentials!" })
        } 
    },
    detailuser: async (req, res) => {
        const verified = req.verified
        if (verified.role === true) {
            const id = req.params.id
            const datauser = await models.UserDetail.findAll({
                where: {
                    id: id,
                }
            })
            const tempip = await models.pilihdevice.findAll({
                include: [{
                    model: models.device,
                },
                {
                    model: models.User
                }
                ],
                where: {    
                    id_user: id,
                }
            })
            const device =  await models.device.findAll()
            if (datauser && device) {
                res.status(200).json({ message: "show data user", data: datauser, datas:device, data1: tempip})
            } else {
                res.status(422).json({ message: "failed show data user" })
            }
        } else {
            res.status(500).json({ message: "Invalid credentials!" })
        }
    },
    absenUser: async (req, res) => {
        const verified = req.verified
        if (verified.role === true) {
            const startedDate = new Date("00:00:00");
            const endDate = new Date("23:59:00");
            const absen = models.datapengunjung.findAll({
                where: { waktu: { [Op.between]: [startedDate, endDate] } },
                order: [
                    ['waktu', 'DESC'],
                ],
            })
            if (absen) {
                res.status(200).json({ message: "show data user", data: absen })
            } else {
                res.status(422).json({ message: "failed show data user" })
            }
        } else {
            res.status(500).json({ message: "Invalid credentials!" })
        }
    },
    dashboardAdmin: async(req,res)=>{
        const verified = req.verified
        if (verified.role === true) {
           const dashboardSuhuAdmin = await models.datapengunjung.findAndCountAll({
            where: {
              statusSuhu: {
                [Op.like]: 'Normal'
              }
            }
          });
          const dashboardpengunjung = await models.datapengunjung.findAndCountAll()
          const dashboarduser = await models.UserDetail.findAndCountAll()
          const dashboarddevice = await models.pilihdevice.findAndCountAll()
          if(dashboardSuhuAdmin){
            res.status(200).json({ message: "Show Data Dashboard Admin", datadevice: dashboarddevice, datasuhu: dashboardSuhuAdmin, datapengunjung: dashboardpengunjung, datauser: dashboarduser })
          } else{
            res.status(422).json({ message: "failed show data dashboard admin" })
          }
        }
    },
    updateprofileadmin: async(req,res)=>{
        const verified = req.verified
       if(verified.role == true){
            const data = await req.body
            const updateprofileadmin = await models.AdminDetail.update({
                fullName: data.fullName,
                mobile: data.mobile,
                address: data.address,
                province: data.province,
                city: data.city,
                postalCode: data.postalCode,
            }, {
                where: {
                    adminId: verified.id
                }
            });
            if (updateprofileadmin) {
                res.status(200).json({ message: "updated profile" })
            } else {
                res.status(422).json({ message: "failed updated profile" })
            }
        } else {
            res.status(500).json({ message: "Invalid credentials!" })
        }
    }


}