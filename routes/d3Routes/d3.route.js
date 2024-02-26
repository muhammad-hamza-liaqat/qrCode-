const express = require("express");
const { makingTree } = require("../../controller/d3.js/d3.controller");
const d3Routes = express.Router();

d3Routes.route("/make-tree").post(makingTree);

module.exports = { d3Routes };
