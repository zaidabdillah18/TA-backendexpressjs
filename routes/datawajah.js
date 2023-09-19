const express = require('express')
const router = express.Router()
const datawajahController = require('../controllers/datawajah.controller')
// dependency multer
const multer = require("multer");
// dependency path
const path = require("path");
const { checkJWTWajah} = require('../middlewares/datawajah.middleware')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./assets");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        path.parse(file.originalname).name +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }); 
  
const upload = multer({ storage: storage });
router.post("/kirim", checkJWTWajah, upload.single('gambar'), datawajahController.kirimdatawajah)
router.get("/lihat", checkJWTWajah, datawajahController.lihatdatawajah  )
router.post("/hasilpredict",checkJWTWajah, datawajahController.hasilpredict)
router.post("/keluarpintu/:id",checkJWTWajah, datawajahController.keluarpengunjung)
router.get("/rekappengunjung", checkJWTWajah,datawajahController.rekappengunjung)
router.get("/lihatpengunjung", checkJWTWajah,datawajahController.lihatpengunjung)
router.put("/updateprofile", checkJWTWajah,datawajahController.updateprofile)
router.get("/profile", checkJWTWajah,datawajahController.showprofile)
router.delete("/deleteprofile/:id", checkJWTWajah,datawajahController.deletewajah)
module.exports = router