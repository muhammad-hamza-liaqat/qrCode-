const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { qrRoute } = require("./routes/qrCodeRoutes/qrcode.routes");
const { d3Routes } = require("./routes/d3Routes/d3.route");
require("./database/connection.database"); // database connection


// middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express static
app.use("/uploads",express.static('uploads'));


// routes
app.use("/api", qrRoute);
app.use("/api", d3Routes);

// server
app.listen(process.env.PORT, () => {
  console.log(`server running at http://localhost:${process.env.PORT}`);
});
