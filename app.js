require("dotenv").config()
const express = require("express");
const bodyParser = require('body-parser');
var cors = require('cors')
const path = require("path");
var app = express();
const port = 3000;
const router = require('./routes')
const corsConfig= {
  credentials:true,
}
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/assets',express.static(path.join(__dirname, "assets")));

app.use(router);
  
app.listen(process.env.PORT || port, () => {
  console.log("Server running on port", port)
})