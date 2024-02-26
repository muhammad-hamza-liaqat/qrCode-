const express = require("express");
const { generateQRCode, getData } = require("../../controller/QRCode/qrCode.controller");
const qrRoute = express.Router();

qrRoute.route("/generate").post(generateQRCode);
qrRoute.route("/data/:id").get(getData)
module.exports = { qrRoute };
