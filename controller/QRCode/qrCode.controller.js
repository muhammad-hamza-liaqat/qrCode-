const qrCodeModel = require("../../models/qrCode.model");
const qr = require("qrcode");
const fs = require("fs");
const path = require("path");

const generateQRCode = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "all fields are required!" });
  }
  try {
    const qrCodeText = `${name}`;
    const qrCode = await qr.toDataURL(qrCodeText);
    // console.log("qrCode generated=>", qrCode);

    // storing the record in the DB.
    const newBaseURL = await qrCodeModel.create({
      image: qrCode,
    });
    console.log("base64 saved to database");

    // response will send message, code base64URL, and id of the record in the database
    return res
      .status(200)
      .json({
        message: "qr generated successfully!",
        _id: newBaseURL._id,
        code: qrCode,
      });
  } catch (error) {
    console.log("error occured at qr code controller ", error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

// the id and URL is stored in the DB.
const getData = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json({ message: "ID field is required from params!" });
  }
  try {
    const qrData = await qrCodeModel.findById(id);
    if (!qrData) {
      return res.status(404).json({ message: "QR code not found!" });
    }
    res.send(`<img src="${qrData.image}" alt="QR Code converted">`);
  } catch (error) {
    console.log("Error occurred while fetching QR code from database:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

module.exports = { generateQRCode, getData };
