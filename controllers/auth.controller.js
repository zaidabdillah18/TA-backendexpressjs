const models = require('../models')
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const say = require('say')
module.exports = {

    login: async (req, res) => {
        const data = await req.body

        if ((data.email == null || data.password == null) || (data.email == "" || data.password == "")) {
            res.status(422).json({ message: "Email and Password Must Be Filled" })
        } else {
            const userData = await models.User.findOne({
                where: {
                    email: data.email
                }
            })
            if (userData) {
                const check = bcrypt.compareSync(data.password, userData.password)

                if (check) {
                    const token = jwt.sign(
                        {
                            id: userData.id,
                            username: userData.username,
                            role: userData.role
                        }, process.env.JWTKEY, { expiresIn: '30d' }
                    )
                    // await models.User.update({deviceToken: data.deviceToken},{
                    //     where:{
                    //         email: data.email
                    //     }})
                    res.status(201).json({
                        message: "Login Success",
                        token
                    })
                } else {
                    res.status(401).json({
                        message: "Password does not match"
                    })
                }
            } else {
                res.status(401).json({
                    message: "Email is not registered"
                })
            }
        }
    },
    register: async (req, res) => {
        try {
            const data = await req.body
            const saltRounds = 10

            const hash = bcrypt.hashSync(data.password, saltRounds)
            data.password = hash

            const temp = await models.User.create({
                username: data.username,
                email: data.email,
                password: data.password,
                role: 0,
                emailVerified: 0
            })

            await models.UserDetail.create({
                userId: temp.id
            })
        

            const userfind = await models.User.findOne({ where: { email: req.body.email } })
            const mailOptions = {
                from: process.env.EMAIL,
                to: data.email,
                subject: "Email Verification",
                text: `This Link Valid For 2 MINUTES http://localhost:3001/user/aktivasiAkun/${userfind.id}`
            }
            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 587, false for other ports
                requireTLS: true,
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
                    res.status(201).json({ status: 201, message: "Email sent Successfully" })
                }
            })
            res.status(201).json({ message: "Account Created", temp })
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },
    aktivasiAkun: async (req, res) => {
        const { id } = req.params;
        try {
            // const validuser = await models.User.findOne({ where: { id: id } })
            const temp = await models.User.update({ emailVerified: 1 }, {
                where: {
                    id: id
                }
            });
            if(temp){
            res.status(201).json({ message: "Email verification success" })
            // console.log(validuser.id)
            // const verified = jwt.verify(token, process.env.JWTKEY)
            // if (validuser && verified.id) {
            //     res.status(201).json({ validuser })
            // } else {
            //     res.status(400).json({ message: "User not Exist" })
            // }
            }
        } catch (error) {
            res.status(401).json({ error })
        }
    },
    registerAdmin: async (req, res) => {
        try {
            const data = await req.body
            const saltRounds = 10

            const hash = bcrypt.hashSync(data.password, saltRounds)
            data.password = hash

            const temp = await models.User.create({
                username: data.username,
                email: data.email,
                password: data.password,
                role: 1,
                emailVerified: 0
            })

            await models.AdminDetail.create({
                fullName: null,
                mobile: null,
                address: null,
                provinceId: null,
                cityId: null,
                postalCode: null,
                picturePath: null,
                adminId: temp.id
            })

            res.status(201).json({ message: "Account Created", data : temp })
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },

    forgotpassword: async (req, res) => {
        const { email } = req.body;
        if (!email) {
            res.status(401).json({ status: 401, message: "Enter Your Email" })
        } else {

            const userfind = await models.User.findOne({ where: { email: req.body.email } })
            if (!userfind) {
                res.status(400).json({
                    status: false,
                    message: 'email tidak tersedia'
                })
            } else {
                const token = jwt.sign(
                    {
                        id: userfind.id,
                        email: userfind.email
                    },
                    process.env.JWTKEY,
                    { expiresIn: '1h' }
                )
                await models.User.update(
                    {
                        resetpasswordLink: token
                    },
                    {
                        where: {
                            id: userfind.id
                        }
                    }
                )

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For password Reset",
                    text: `This Link Valid For 2 MINUTES http://localhost:3001/user/resetpassword/${userfind.id}/${userfind.resetpasswordLink}`
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
                        res.status(201).json({ status: 201, message: "Email sent Successfully" })
                    }
                })

            }
        }
    },

    lihatresetpassword: async (req, res) => {
        const { id, token } = req.params;
        try {
            const validuser = await models.User.findOne({ where: { id: id } })
            console.log(validuser.id)
            const verified = jwt.verify(token, process.env.JWTKEY)
            if (validuser && verified.id) {
                res.status(201).json({ validuser })
            } else {
                res.status(400).json({ message: "User not Exist" })
            }
        } catch (error) {
            res.status(401).json({ error })
        }
    },

    resetpassword: async (req, res) => {
        try {
            const { id, token } = req.params;
            const validuser = await models.User.findOne({ where: { id: id } })
            console.log(validuser.id)
            const verified = jwt.verify(token, process.env.JWTKEY)
            if (validuser && verified.id) {
                const data = await req.body
                const saltRounds = 10
                const hash = bcrypt.hashSync(data.password, saltRounds)
                data.password = hash
                await models.User.update({ password: data.password }, {
                    where: {
                        id: validuser.id
                    }
                })
                res.status(200).json({
                    message: 'password updated Successfully'
                })
            }
        } catch (error) {
            res.status(401).json({ message: 'password update failed', error })
        }
    },
    logUser: async (req, res) => {
        const auth = await req.headers.authorization
        const token = await auth.split(' ')[1]
        const verified = jwt.verify(token, process.env.JWTKEY)
        const user = await models.User.findOne({
            attributes: {
                exclude: ['password']
            },
            where: {
                id: verified.id,
            }
            // include: [
            //     {
            //         model: UserApplicantDetail,
            //         as: 'user_applicant_detail',
            //         attributes: {
            //             exclude: ['id', 'user_id', 'createdAt', 'updatedAt']
            //         }
            //     },
            //     {
            //         model: UserOrganizationDetail,
            //         as: 'user_organization_detail',
            //         attributes: {
            //             exclude: ['id', 'user_id', 'createdAt', 'updatedAt']
            //         }
            //     }
            // ]
        });
        if (user) {
            res.status(201).json({ message: "Account succesfull", data: user })
        } else {
            res.status(400).json({ message: "User not Exist" })
        }
    }

}