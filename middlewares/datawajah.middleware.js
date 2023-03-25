const { body, validationResult } = require('express-validator')
const models = require('../models')
require('dotenv').config()
const jwt = require('jsonwebtoken')

// const validateProduct = [
//     body('email')
//         .isEmail()
//         .withMessage('Invalid Email Address')
//         .notEmpty()
//         .withMessage("Email Must Be Filled"),
//     body('password')
//         .notEmpty()
//         .withMessage('Password Must Be Filled'),
//     body('username')
//         .notEmpty()
//         .withMessage('Username Must Be Filled'),
//     (req, res, next) => {
//         const error = validationResult(req).formatWith(({ msg }) => msg)

//         const hasError = !error.isEmpty()
    
//         if(hasError){
//             res.status(422).json({error: error.array()})
//         } else {
//             next()
//         }
//     }
// ]

const checkJWTWajah = async (req, res, next) => {
    const auth = await req.headers.authorization
    if (auth) {
        const token = await auth.split(' ')[1]
        const verified = jwt.verify(token, process.env.JWTKEY)
        if (verified) {
            const auth = await models.User.findOne({ where: { id: verified.id } })
            if (auth.emailVerified == true) {
                req.verified = verified
                next()
            }
            else {
                res.status(401).json({ message: "Email Not Verified" })
            }
        } else {
            res.sendStatus(401)
        }
    } else {
        res.status(401).json({ message: "Token Required" })
    }
}

module.exports = { checkJWTWajah, }