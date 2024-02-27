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
    // Generate the QR code image as data URL asynchronously
    qr.toDataURL(qrCodeText, { type: 'png' }, async (err, qrCodeDataURL) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return res.status(500).json({ message: "Error generating QR code", error: err });
      }

      // Convert the data URL to base64
      const base64Image = qrCodeDataURL.split(';base64,').pop();

      // Determine directory for saving
      const uploadDirectory = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory);
      }

      // Construct file name with date and URL
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date
      const fileName = `${currentDate}-${encodeURIComponent(url)}.png`;
      const filePath = path.join(uploadDirectory, fileName);

      // Save QR code image data URL to file
      fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));

      // Store the record in the DB with base64 image URL and relative path
      const newBaseURL = await qrCodeModel.create({
        imageURL: base64Image,
        path: filePath.replace(__dirname, '') // Get relative path from project directory
      });
      console.log("QR code image saved to database");

      // Respond with message, image URL, and ID
      return res.status(200).json({
        message: "QR code generated and saved successfully!",
        _id: newBaseURL._id,
        imageURL: base64Image,
        path: filePath.replace(__dirname, '') // Return relative path in response
      });
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
