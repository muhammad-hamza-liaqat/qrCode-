const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const makingTree = async (req, res) => {
  const json = req.body;
  if (!json) {
    return res.status(400).send("JSON data is required.");
  }
  try {
    const canvas = createCanvas(1200, 1000);
    const context = canvas.getContext("2d");

    // Set background color to grey
    context.fillStyle = "#f0f0f0"; // Light grey
    context.fillRect(0, 0, canvas.width, canvas.height);

    const { hierarchy, tree } = await import("d3");

    const margin = { top: 50, right: 80, bottom: 50, left: 200 }; // Adjusted margins
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    const treeLayout = tree().size([width, height]);
    const hierarchyData = hierarchy(json);
    const nodes = treeLayout(hierarchyData).descendants();
    const links = treeLayout(hierarchyData).links();

    // Draw links between nodes
    context.strokeStyle = "#888"; // Dark grey
    context.lineWidth = 1.5;
    links.forEach((link) => {
      context.beginPath();
      context.moveTo(link.source.x + margin.left, link.source.y + margin.top); // Adjusted position
      context.lineTo(link.target.x + margin.left, link.target.y + margin.top); // Adjusted position
      context.stroke();
    });

    // Draw nodes and labels
    nodes.forEach((node) => {
      // Draw node
      context.fillStyle = "#4CAF50"; // Green
      context.beginPath();
      context.arc(node.x + margin.left, node.y + margin.top, 5, 0, 2 * Math.PI); // Adjusted position
      context.fill();

      // Draw label
      context.fillStyle = "#000"; // Black
      context.font = "14px Arial";
      context.textAlign = "center";
      context.fillText(node.data.value, node.x + margin.left, node.y + margin.top - 10); // Adjusted position
    });

    // Create the 'trees' folder if it doesn't exist
    const treesFolderPath = path.join(__dirname, "..", "..", "tree_structure_graph");
    if (!fs.existsSync(treesFolderPath)) {
      fs.mkdirSync(treesFolderPath);
    }

    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `tree_${timestamp}.png`;
    const filePath = path.join(treesFolderPath, filename);

    const buffer = canvas.toBuffer("image/png");

    // Save the image to a file
    fs.writeFileSync(filePath, buffer);
    res.send(`Tree visualization image generated: ${filename}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { makingTree };
