const express = require('express')
const { checkJWTWajah} = require('../middlewares/datawajah.middleware')
const router = express.Router()
const {detaildevice,datawajah,detailuser ,datapengunjung, kelolauser, dashboardAdmin, updateprofileadmin} = require('../controllers/admin.controller')
router.get("/tampilwajah",checkJWTWajah, datawajah)
router.get("/detailuser/:id",checkJWTWajah, detailuser)
router.get("/detaildevice/:id",checkJWTWajah, detaildevice)
router.get("/tampilpengunjung",checkJWTWajah, datapengunjung)
router.get("/tampiluser",checkJWTWajah, kelolauser)
router.get('/dashboard',checkJWTWajah, dashboardAdmin)
router.put('/updateprofileadmin',checkJWTWajah, updateprofileadmin)
module.exports = router