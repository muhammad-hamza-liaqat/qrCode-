const express = require("express");
const d3Routes = express.Router();

d3Routes.route("/make-tree").post(makingTree);

module.exports = { d3Routes };
