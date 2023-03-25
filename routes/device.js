const express = require('express')
const router = express.Router()
const deviceController = require('../controllers/device.controller')
const { checkJWTWajah} = require('../middlewares/datawajah.middleware')

router.post("/add", deviceController.kirimdevice)
router.post("/coba", deviceController.kirim)
router.post("/pilih/:id",  deviceController.pilihdevice)
router.get("/lihat", checkJWTWajah, deviceController.lihatdevice)
router.get("/lihatdevice", checkJWTWajah, deviceController.device)
module.exports = router;