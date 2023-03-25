const express = require('express')
const router = express.Router()
const {login, register, registerAdmin ,lihatresetpassword, resetpassword, forgotpassword, aktivasiAkun, logUser}  = require('../controllers/auth.controller')
router.post("/login", login)
router.post("/register", register)
router.post("/registeradmin", registerAdmin)
router.put("/forgotpassword", forgotpassword)
router.get("/aktivasiAkun/:id", aktivasiAkun)
router.get("/resetpassword/:id/:token", lihatresetpassword)
router.put("/resetpassword/:id/:token", resetpassword)
router.get("/loguser",logUser)
module.exports = router