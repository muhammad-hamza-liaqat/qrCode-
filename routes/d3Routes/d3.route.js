const express = require("express");
const { makingTree, getTree } = require("../../controller/d3.js/d3.controller");
const d3Routes = express.Router();


d3Routes.route("/make-tree").post(makingTree);
d3Routes.route("/get-tree/:id").get(getTree);

module.exports = { d3Routes };
