const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

// const makingTree = async (req, res) => {
//   const json = req.body;
//   if (!json) {
//     return res.status(400).send("JSON data is required.");
//   }
//   try {
//     const canvas = createCanvas(1600, 1200); 
//     const context = canvas.getContext("2d");

//     context.fillStyle = "#ffffff"; 
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     const { hierarchy, tree } = await import("d3");

//     const margin = { top: 50, right: 80, bottom: 50, left: 200 }; 
//     const width = canvas.width - margin.left - margin.right;
//     const height = canvas.height - margin.top - margin.bottom;

//     const treeLayout = tree().size([width, height]);
//     const hierarchyData = hierarchy(json);
//     const nodes = treeLayout(hierarchyData).descendants();
//     const links = treeLayout(hierarchyData).links();

    
//     context.strokeStyle = "#888"; 
//     context.lineWidth = 1.5;
//     links.forEach((link) => {
//       context.beginPath();
//       context.moveTo(link.source.x + margin.left, link.source.y + margin.top); 
//       context.lineTo(link.target.x + margin.left, link.target.y + margin.top); 
//       context.stroke();
//     });

//     nodes.forEach((node) => {
//       context.fillStyle = "#4CAF50"; 
//       context.beginPath();
//       context.arc(node.x + margin.left, node.y + margin.top, 10, 0, 2 * Math.PI); 
//       context.fill();


//       context.fillStyle = "#000"; 
//       context.font = "16px Arial"; 
//       context.textAlign = "center";
//       context.fillText(node.data.value, node.x + margin.left, node.y + margin.top + 5); 
//     });

//     const treesFolderPath = path.join(__dirname, "..", "..", "tree_structure_graph");
//     if (!fs.existsSync(treesFolderPath)) {
//       fs.mkdirSync(treesFolderPath);
//     }

//     // Generate a unique filename with timestamp
//     const timestamp = Date.now();
//     const filename = `tree_${timestamp}.png`;
//     const filePath = path.join(treesFolderPath, filename);

//     const buffer = canvas.toBuffer("image/png");

//     // Save the image to a file
//     fs.writeFileSync(filePath, buffer);
//     res.send(`Tree visualization image generated: ${filename}`);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal server error");
//   }
// };

const makingTree = async (req, res) => {
  const { json, imageName } = req.body;
  if (!json) {
    return res.status(400).send("JSON data is required.");
  }
  if (!imageName) {
    return res.status(400).send("Image name is required.");
  }
  try {
    const canvas = createCanvas(1600, 1200); 
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff"; 
    context.fillRect(0, 0, canvas.width, canvas.height);

    const { hierarchy, tree } = await import("d3");

    const margin = { top: 50, right: 80, bottom: 50, left: 200 }; 
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    const treeLayout = tree().size([width, height]);
    const hierarchyData = hierarchy(json);
    const nodes = treeLayout(hierarchyData).descendants();
    const links = treeLayout(hierarchyData).links();

    
    context.strokeStyle = "#888"; 
    context.lineWidth = 1.5;
    links.forEach((link) => {
      context.beginPath();
      context.moveTo(link.source.x + margin.left, link.source.y + margin.top); 
      context.lineTo(link.target.x + margin.left, link.target.y + margin.top); 
      context.stroke();
    });

    nodes.forEach((node) => {
      context.fillStyle = "#4CAF50"; 
      context.beginPath();
      context.arc(node.x + margin.left, node.y + margin.top, 10, 0, 2 * Math.PI); 
      context.fill();


      context.fillStyle = "#000"; 
      context.font = "16px Arial"; 
      context.textAlign = "center";
      context.fillText(node.data.value, node.x + margin.left, node.y + margin.top + 5); 
    });

    const treesFolderPath = path.join(__dirname, "..", "..", "tree_structure_graph");
    if (!fs.existsSync(treesFolderPath)) {
      fs.mkdirSync(treesFolderPath);
    }

    // Generate a unique filename with the specified image name
    const filename = `${imageName}.html`;
    const filePath = path.join(treesFolderPath, filename);

    // Check if file already exists, if yes, remove it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Generate HTML content with the image reference
    const imageFileName = `${imageName}.png`;
    const timestamp = Date.now(); // Generate timestamp
    const htmlContent = `<html><head><title>${imageName}</title></head><body><img src="${imageFileName}?${timestamp}"></body></html>`;

    // Save the HTML file
    fs.writeFileSync(filePath, htmlContent);

    // Save the image to a file
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(path.join(treesFolderPath, imageFileName), buffer);

    res.send(`Tree visualization HTML generated: ${filename}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};



// the commented code will generate the graph eachtime with unique timestamp
// the second code will required the imageName for generating the image in the png format. and will replace if the file names already exists
const getTree = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "id not available in the params" });
  }

  const imageName = id.endsWith('.png') ? id.slice(0, -4) : id;

  const imagePath = path.join(__dirname, "..","..", 'tree_structure_graph', `${imageName}.png`);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {

      console.error("Error accessing image file:", err);
      return res.status(404).json({ message: "Image not found" });
    }

    console.log("Image file found:", imagePath);
    res.sendFile(imagePath);
  });
};
module.exports = { makingTree, getTree };