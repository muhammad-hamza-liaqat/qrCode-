const mongoose = require("mongoose");

const QRCode = new mongoose.Schema({
    path:{
        type: String,
        required: true
    }
});

console.log("qrCode Model sync successfully!")
const qrCodeModel = mongoose.model("qrcode", QRCode);

module.exports = qrCodeModel