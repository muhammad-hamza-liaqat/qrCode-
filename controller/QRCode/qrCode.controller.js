const qrCodeModel = require("../../models/qrCode.model");
const qr = require("qrcode");
const fs = require("fs");
const path = require("path");

const generateQRCode = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL field is required!" });
  }
  
  try {
    const qrCodeText = `${url}`;

    const uploadDirectory = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory);
    }

    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '-');
    const fileName = `${currentTime}.png`; 
    const filePath = path.join(uploadDirectory, fileName);
    
    await qr.toFile(filePath, qrCodeText);

    // Construct complete URL with prefix
    const baseURL = "http://localhost:3000/uploads/";
    const imageURL = baseURL + fileName;

    const newQRCode = await qrCodeModel.create({
      path: imageURL
    });
    console.log("QR code image saved to database", newQRCode);
    return res.status(200).json({
      message: "QR code generated and saved successfully!",
      _id: newQRCode._id,
      path: imageURL
    });
  } catch (error) {
    console.error("Error occurred at QR code controller:", error);
    return res.status(500).json({ message: "Internal server error", error: error });
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
