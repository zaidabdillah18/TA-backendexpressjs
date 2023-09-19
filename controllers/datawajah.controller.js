const models = require('../models')
require('dotenv').config()
const fs = require('fs')
const path = require("path");
const say = require('say')
const nodemailer = require("nodemailer")
const axiosLib = require('axios')
const axios = axiosLib.create({ baseURL: process.env.DJANGO_SERVER + "/api" });
// const qrcode = require('qrcode-terminal');

// const { Client } = require('whatsapp-web.js');
// const client = new Client();

// client.on('qr', qr => {
//     qrcode.generate(qr, { small: true });
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

// client.initialize();

// const imageToBase64 = require('image-to-base64');
async function kirimdatawajah(req, res) {
    const verified = req.verified
    if (verified.role === false) {
        // let finalimageurl = req.protocol + "://" + req.get("host") + "/assets/" + req.file.filename;
        // const kirimwajah = await models.datawajah.create({
        //     nama: req.body.nama,
        //     gambar: finalimageurl,
        //     base64: new Buffer(fs.readFileSync(req.file.path)).toString("base64")
        // })
        const iduserDetail = await models.datawajah.findOne({ where: { userId: verified.id } })
        const updatedatawajah = await models.fotowajah.create({
            base64: req.body.base64,
            userId: iduserDetail.userId
        });
        if (updatedatawajah) {
            res.status(200).json({ message: "create data wajah" })
        } else {
            res.status(422).json({ message: "failed updated data wajah" })
        }
        // res.json({
        //     status: 200,
        //     message: 'success created data',
        //     data: kirimwajah
        // })
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
async function lihatdatawajah(req, res) {
    const verified = req.verified
    console.log(verified)
    if (verified.role === false) {
        // let finalimageurl = req.protocol + "://" + req.get("host") + "/assets/" + req.file.filename;
        // const kirimwajah = await models.datawajah.create({
        //     nama: req.body.nama,
        //     gambar: finalimageurl,
        //     base64: new Buffer(fs.readFileSync(req.file.path)).toString("base64")
        // })
        const iduserDetail = await models.datawajah.findOne({ where: { userId: verified.id } })
        console.log(iduserDetail.userId)
        const getdatawajah = await models.datawajah.findAll({
            include: [{
                model: models.fotowajah,
                
            }
            ], where: {
                userId: iduserDetail.userId
            }
        });
        // console.log(getdatawajah);
        if (getdatawajah) {
            res.status(200).json({ message: "show data wajah", data: getdatawajah })
        } else {
            res.status(422).json({ message: "failed updated data wajah" })
        }
        // res.json({
        //     status: 200,
        //     message: 'success created data',
        //     data: kirimwajah
        // })
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
async function hasilpredict(req, res) {
    try {
        const verified = req.verified

        if (verified.role === false) {
            let images = []
            let labels = []
            let hasil = "";
            let aslisuhu = "";
            const iduserDetails = await models.UserDetail.findOne({ where: { userId: verified.id } })
            console.log(iduserDetails.namalengkap)
            const faces = await models.datawajah.findAll({
                include: [{
                    model: models.fotowajah,
                }
                ]
            });

            await Promise.all(faces.map(async (faces1) => {
                faces1.fotowajahs.map(temp => {
                    images.push(temp.base64)
                    labels.push(faces1.nama)
                });
            }));
            result = await axios.post('/multi-predict', {
                method: 'POST',
                query: req.body.base64,
                images
            });

            let predicts = result.data
            let datas = getNewObject(predicts, labels, images.length)
            datas.sort((a, b) => {
                return b.predict - a.predict
            })

            const data = datas[0]
            console.log(data)
            const tempip = await models.pilihdevice.findAll({
                include: [{
                    model: models.device,
                },
                {
                    model: models.User
                }
                ],
                where: {
                    id_user: verified.id,
                }
            })
            const suhu = await axios.get(`http://${tempip[0].device.ip}/temp`, {
                method: 'GET'
            });
            const hasilsuhu = parseFloat(suhu.data)


            if (hasilsuhu >= 39.00) {
                hasil = "Sangat Panas"
                aslisuhu = 40.00
            }
            else if (hasilsuhu >= 37.00 && hasilsuhu <= 38.99) {
                hasil = "Panas"
                aslisuhu = 38.00
            } else if (hasilsuhu <= 36.99) {
                hasil = "Normal"
                aslisuhu = 36.00
            }
            if (data.label == iduserDetails.namalengkap && data.predict >= 0.90 && tempip[0].device.ip && aslisuhu <= 36.00) {
                // if (tempip[0].device.ip && aslisuhu <= 36.00) {
                say.speak("Welcome, Please Enter The Room", 'Alex')
                const device1 = await axios.get(`http://${tempip[0].device.ip}/pintu/on`, {
                    method: 'GET'
                });
                setTimeout(async function setTimeout() {
                    await axios.get(`http://${tempip[0].device.ip}/pintu/off`, {
                        method: 'GET'
                    });
                }, 9000);
                var datetime = new Date().getTime()
                const iduserDetail = await models.UserDetail.findOne({ where: { userId: verified.id } })
                let datapengunjung = await models.datapengunjung.create({ nama: data.label, akurasi: data.predict.toString(), picture: req.body.base64, suhu: aslisuhu, deviceId: tempip[0].device.id, statusSuhu: hasil, waktu: datetime, userId: iduserDetail.id, statusUser: "Pengunjung Terdaftar" })
                // let newface = {
                //     akurasi: data.predict.toString(),
                //     nama: data.label,
                //     suhu: aslisuhu,
                //     statusSuhu: hasil
                // }
                // if (datapengunjung) {
                //     res.status(201).json({ status: 201, data: datapengunjung, message: 'success created data' })
                // } else {
                //     res.status(400).json({ status: 400, message: 'Failed created data' })
                // }

                let users = await models.User.findOne({ where: { id: verified.id } })
                let usersdetail = await models.UserDetail.findOne({ where: { id: verified.id } })
                console.log(usersdetail.nohp)
                let datapengunjungs = await models.datapengunjung.findOne({ where: { nama: data.label } })
                console.log(users.email)
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: users.email,
                    subject: "Rekap Data Pengunjung",
                    text: `nama: ${datapengunjungs.nama}, Suhu: ${datapengunjungs.suhu}, gambar: ${datapengunjungs.picture}, statusPintu: ${datapengunjungs.statusPintu}`
                }
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                })
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(401).json({ status: 401, message: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ status: 200, message: "Email sent Successfully" })
                    }
                })
                // if (device1) {
                //     res.status(200).json({ status: 200, message: "User Boleh Masuk Ruangan" })
                // }
                // } else {
                //     res.status(400).json({ status: 400, message: "User Tidak Boleh Masuk Ruangan" })
                // }
                //res.status(200).json({ status: 200, data: datapengunjung, newface, message: "Data Wajah User Valid" })
                // if (datapengunjung) {
                    res.status(201).json({ status: 201, data: datapengunjung, message: 'User Boleh Masuk Ruangan' })
                // } 
            } else if(data.label == iduserDetails.namalengkap && data.predict <= 0.90){
                var datetime = new Date().getTime()
                const iduserDetail = await models.UserDetail.findOne({ where: { userId: verified.id } })
                let datapengunjungs = await models.datapengunjung.create({ nama: data.label, akurasi: data.predict.toString(), picture: req.body.base64, waktu: datetime, userId: iduserDetail.id, statusUser: "Pengunjung Tidak Terdaftar" })
                res.status(200).json({ status: 200, data: datapengunjungs, message: 'User Tidak Boleh Masuk Ruangan' })
            } 
            else {
                res.status(400).json({ status: 400, message: "Mohon Maaf Anda Tidak dibolehkan Masuk Ruangan" })
                say.speak("Do Not Enter Room Your face is not registered in the system", 'Alex')
                const temp = await axios.get(`http://${tempip[0].device.ip}/bunyi/on`, {
                    method: 'GET'
                });
                await axios.get(`http://${tempip[0].device.ip}/pintu/off`, {
                    method: 'GET'
                });
            }
        } else {
            res.status(400).json({ status: 400, message: "Mohon Maaf Akun Anda Belum Login" })
        }
    } catch (error) {
        res.status(500).json({ message: "Mohon Check Data Wajah dan Suhu Anda", error })
    }
}

async function hasilpredict1(req, res) {
    // try {
    // const base64 = new Buffer(fs.readFileSync(req.file.path)).toString("base64")
    const verified = req.verified

    if (verified.role === false) {

        const tempip = await models.pilihdevice.findAll({
            include: [{
                model: models.device,
            },
            {
                model: models.User
            }
            ],
            where: {
                id_user: verified.id,
            }
        })
        // console.log(tempip[0].device.ip)
        if (tempip[0].device.ip) {

            let images = []
            let labels = []
            let hasil = "";
            let aslisuhu = "";
            const iduserDetails = await models.UserDetail.findOne({ where: { userId: verified.id } })
            console.log(iduserDetails.namalengkap)
            const faces = await models.datawajah.findAll({
                include: [{
                    model: models.fotowajah,
                }
                ]
            });

            await Promise.all(faces.map(async (faces1) => {
                faces1.fotowajahs.map(temp => {
                    images.push(temp.base64)
                    labels.push(faces1.nama)
                });
            }));
            result = await axios.post('/multi-predict', {
                method: 'POST',
                query: req.body.base64,
                images
            });

            let predicts = result.data
            let datas = getNewObject(predicts, labels, images.length)

            // const groupedDatas = datas.reduce(groupAndCollectByCode, {});

            // let newObjs = []
            // for (let index = 1; index <= foods.length; index++) {
            //     const key = Storage.FOOD+"-"+index
            //     const predictAvg = getAverage(groupedDatas[key])
            //     const data = {
            //         predict: predictAvg,
            //         label : key
            //     }
            //     newObjs.push(data)
            // }

            datas.sort((a, b) => {
                return b.predict - a.predict
            })

            console.log(datas[0])
            const data = datas[0]

            //if (tempip.ip) {
            const suhu = await axios.get(`http://${tempip[0].device.ip}/temp`, {
                method: 'GET'
            });
            // console.log(suhu.data)
            const hasilsuhu = parseFloat(suhu.data)


            if (hasilsuhu >= 39.00) {
                hasil = "Sangat Panas"
                aslisuhu = 40.00
            }
            else if (hasilsuhu >= 37.00 && hasilsuhu <= 38.99) {
                hasil = "Panas"
                aslisuhu = 38.00
            } else if (hasilsuhu <= 36.99) {
                hasil = "Normal"
                aslisuhu = 36.00
            }
            console.log(data.label)
            if (data.label == data.label && data.predict >= 0.90 && aslisuhu <= 36.00) {
                say.speak("Welcome, Please Enter The Room", 'Alex')
                await axios.get(`http://${tempip[0].device.ip}/pintu/on`, {
                    method: 'GET'
                });
                setTimeout(async function setTimeout() {
                    await axios.get(`http://${tempip[0].device.ip}/pintu/off`, {
                        method: 'GET'
                    });
                }, 500000);
                var datetime = new Date().getTime()
                const iduserDetail = await models.UserDetail.findOne({ where: { userId: verified.id } })
                let datapengunjung = await models.datapengunjung.create({ nama: data.label, akurasi: data.predict.toString(), picture: req.body.base64, suhu: aslisuhu, deviceId: tempip[0].device.id, statusSuhu: hasil, waktu: datetime, userId: iduserDetail.id })
                let newface = {
                    akurasi: data.predict.toString(),
                    nama: data.label,
                    suhu: aslisuhu,
                    statusSuhu: hasil
                }
                if (datapengunjung) {
                    res.json({ status: 200, newface, data: datapengunjung, message: 'success created data' })
                } else {
                    res.json({ status: 400, message: 'Failed created data' })
                }

                // let users = await models.User.findOne({ where: { id: verified.id } })
                // let datapengunjungs = await models.datapengunjung.findOne({ where: { nama: data.label } })
                // const mailOptions = {
                //     from: process.env.EMAIL,
                //     to: users.email,
                //     subject: "Rekap Data Pengunjung",
                //     text: `nama: ${datapengunjungs.nama}, Suhu: ${datapengunjungs.suhu}, gambar: ${datapengunjungs.picture}, statusPintu: ${datapengunjungs.statusPintu}`
                // }
                // const transporter = nodemailer.createTransport({
                //     service: "gmail",
                //     auth: {
                //         user: process.env.EMAIL,
                //         pass: process.env.PASSWORD
                //     }
                // })
                // transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         console.log("error", error);
                //         res.status(401).json({ status: 401, message: "email not send" })
                //     } else {
                //         console.log("Email sent", info.response);
                //         res.status(201).json({ status: 201, message: "Email sent Successfully" })
                //     }
                // })


            } else  {
               
                say.speak("Do Not Enter Room Your face is not registered in the system", 'Alex')
                await axios.get(`http://${tempip[0].device.ip}/bunyi/on`, {
                    method: 'GET'
                });
                await axios.get(`http://${tempip[0].device.ip}/pintu/off`, {
                    method: 'GET'
                });
                const iduserDetail = await models.UserDetail.findOne({ where: { userId: verified.id } })
                let pengunjungwrong = await models.datapengunjung.create({ nama: "User tidak terdaftar sistem", akurasi: data.predict.toString(), picture: req.body.base64, suhu: aslisuhu, deviceId: tempip[0].device.id, statusSuhu: hasil, waktu: datetime, userId: iduserDetail.id })
                res.status(400).json({ status: 200, message: "Mohon Maaf Anda Tidak dibolehkan Masuk Ruangan", data: pengunjungwrong})

            }
            // else{
            //     await axios.get('http://192.168.100.195/pintu/on', {
            //         method: 'GET'
            //     });
            //     // const response = await fetch('http://192.168.100.195/bunyi/on')

            // }
            // let finalimageurl = req.protocol + "://" + req.get("host") + "/assets/" + req.file.filename;

            // res.json({
            //     status: 200,
            //     message: 'success created data',
            //     data: datapengunjung
            // })
            // }
            // catch (error) {
            //     res.status(400).json({
            //         message: error.toString()
            //     })
            // }
        } else {
            res.status(400).json({ message: "Invalid Device!" })
        }
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
    // } catch (error) {
    //     res.status(400).json({ message: "Mohon Check Data Wajah dan Suhu Anda", error })
    // }
}

const getNewObject = (predicts, labels, len) => {
    let datas = []
    for (let index = 0; index < len; index++) {
        const data = {
            predict: predicts[index],
            label: labels[index]
        }
        datas.push(data)
    }
    console.log(datas)
    return datas
}

async function rekappengunjung(req, res) {
    const verified = req.verified
    if (verified.role === false) {
        const iduserDetail = await models.UserDetail.findOne({ where: { userId: verified.id } })
        const tampildatawajah = await models.datapengunjung.findAll({
            include: [{
                model: models.device,
               }],
            where: {
                userId: iduserDetail.id
            }
        })
        res.json({
            status: 200,
            message: 'success show data',
            data: tampildatawajah
        })
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
async function lihatpengunjung(req, res) {
    const verified = req.verified
    if (verified.role === false) {
        const tampildatawajah = await models.datapengunjung.findAll({
            where: {
                userId: req.verified.id,
                statusPintu: "Masuk"
            },
            order: [
                ['id', 'DESC'],
            ],
        })
        let temp = {
            id: tampildatawajah[0].id,
            nama: tampildatawajah[0].nama,
            picture: tampildatawajah[0].picture,
            akurasi: tampildatawajah[0].akurasi,
            suhu: tampildatawajah[0].suhu,
            statusSuhu: tampildatawajah[0].statusSuhu,
            statusPintu: tampildatawajah[0].statusPintu
        }
        res.json({
            status: 200,
            message: 'success show data',
            data: temp
        })
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
async function keluarpengunjung(req, res) {
    const verified = req.verified
    if (verified.role === false) {
        const id = req.params.id
        const keluarpengunjung = await models.datapengunjung.findOne({
            where: {
                id: id,
            },
        })
        const kirimpengunjung = await models.datapengunjung.create({
            nama: keluarpengunjung.nama, akurasi: keluarpengunjung.akurasi, picture: keluarpengunjung.picture, suhu: keluarpengunjung.suhu, statusPintu: "Keluar", statusSuhu: keluarpengunjung.statusSuhu, userId: verified.id
        })
        res.json({
            status: 200,
            message: 'success create data',
            data: kirimpengunjung
        })
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
async function showprofile(req, res) {
    const verified = req.verified
    if (verified.role === false) {
        const getprofileid = await models.UserDetail.findAll({
            where: { userId: verified.id }
        })
        res.json({
            status: 200,
            message: 'success show data',
            data: getprofileid
        })
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
async function updateprofile(req, res) {
    const verified = req.verified
    if (verified.role === false) {
        const data = await req.body
        const iduserDetail = await models.UserDetail.findOne({ where: { userId: verified.id } })
        console.log(iduserDetail.namalengkap)
        if (iduserDetail.namalengkap == null) {
            const updateprofile = await models.UserDetail.update({
                namalengkap: data.namalengkap,
                nohp: data.nohp,
                alamat: data.alamat,
                provinsi: data.provinsi,
                kota: data.kota,
                kodepos: data.kodepos,
                jeniskelamin: data.jeniskelamin,
                tempatlahir: data.tempatlahir,
                tanggallahir: data.tanggallahir,
                agama: data.agama
            }, {
                where: {
                    userId: verified.id
                }
            });

            const iduserDetail = await models.UserDetail.findOne({ where: { userId: verified.id } })
            await models.datawajah.create({
                userId: iduserDetail.userId,
                nama: iduserDetail.namalengkap
            })
            if (updateprofile) {
                res.status(200).json(req.body)
            } else {
                res.status(422).json({ message: "failed updated profile" })
            }
        } else {
            const updateprofile = await models.UserDetail.update({
                namalengkap: data.namalengkap,
                nohp: data.nohp,
                alamat: data.alamat,
                provinsi: data.provinsi,
                kota: data.kota,
                kodepos: data.kodepos,
                jeniskelamin: data.jeniskelamin,
                tempatlahir: data.tempatlahir,
                tanggallahir: data.tanggallahir,
                agama: data.agama
            }, {
                where: {
                    userId: verified.id
                }
            });
            // const iduserDetail = await models.UserDetail.findOne({ where: { userId: verified.id } })
            await models.datawajah.update({
                nama: updateprofile.namalengkap
            })
            if (updateprofile) {
                res.status(200).json(req.body)
            } else {
                res.status(422).json({ message: "failed updated profile" })
            }
        }

    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
async function deletewajah(req, res) {
    const verified = req.verified
    if (verified.role === false) {

        const { id } = req.params;
        const foto = await models.fotowajah.findOne({
            where: {
                id: id
            }
        });
        console.log(foto.id)
        await models.fotowajah.destroy({
            where: { id: id }
        })
        res.json({
            status: 200,
            message: 'success delete data',
        })
    } else {
        res.status(500).json({ message: "Invalid credentials!" })
    }
}
module.exports = {
    kirimdatawajah: kirimdatawajah,
    hasilpredict: hasilpredict,
    rekappengunjung: rekappengunjung,
    updateprofile: updateprofile,
    lihatdatawajah: lihatdatawajah,
    showprofile: showprofile,
    lihatpengunjung: lihatpengunjung,
    keluarpengunjung: keluarpengunjung,
    deletewajah: deletewajah
}