const { createCanvas } = require("canvas");
const fs = require("fs");

const makingTree = async (req, res) => {
  const json = req.body;
  if (!json) {
    return res.status(400).send("JSON data is required.");
  }
  try {
    const canvas = createCanvas(1000, 800);
    const context = canvas.getContext("2d");

    const { hierarchy, tree } = await import("d3");
    const margin = { top: 40, right: 20, bottom: 40, left: 20 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    const treeLayout = tree().size([width, height]);
    const hierarchyData = hierarchy(json);
    const nodes = treeLayout(hierarchyData).descendants();
    const links = treeLayout(hierarchyData).links();

    // Draw the tree visualization on the canvas
    context.fillStyle = "blue";
    context.font = "16px Arial";
    context.textAlign = "center";
    // Draw links between nodes
    context.strokeStyle = "black";
    context.lineWidth = 1;
    links.forEach((link) => {
      context.beginPath();
      context.moveTo(link.source.x, link.source.y);
      context.lineTo(link.target.x, link.target.y);
      context.stroke();
    });

    // Draw nodes and labels
    nodes.forEach((node) => {
      // Draw node
      context.beginPath();
      context.arc(node.x, node.y, 5, 0, 2 * Math.PI);
      context.fill();

      // Draw label
      context.fillText(node.data.name, node.x, node.y - 10); 
    });

    const buffer = canvas.toBuffer("image/png");

    fs.writeFileSync("tree.png", buffer);
    res.send("Tree visualization image generated: tree.png");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { makingTree };
