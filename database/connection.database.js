const mongo = require("mongoose");
mongo
  .connect(process.env.connection_string)
  .then(() => {
    console.log("MongoDB connected to QRCode-database!");
  })
  .catch((error) => {
    console.log("MongoDB not connected! error: ", error);
  });
module.exports = mongo;
