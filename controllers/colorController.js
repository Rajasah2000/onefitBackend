const ColorModal = require("../models/colorModel"); // Using the Color model

// Add Color API

const AddColor = async (req, res) => {
  try {
    // Ensure the color name is in lowercase and trimmed of whitespace
    const colorName = req.body.name?.trim().toLowerCase();

    // Validate that a non-empty color name is provided
    if (!colorName) {
      return res.status(400).send({
        msg: "Color name is required",
        status: false,
      });
    }

    // Check if the color name already exists (case-insensitive)
    const existingColor = await ColorModal.findOne({ name: colorName });
    if (existingColor) {
      return res.status(400).send({
        msg: "Color already exists",
        status: false,
      });
    }

    // Add the new color
    const newColor = await ColorModal.create({ name: colorName });
    res.status(201).send({
      msg: "Color added successfully",
      status: true,
      data: newColor,
    });
  } catch (error) {
    console.error("Error adding color:", error);
    res.status(500).send({
      msg: "Error adding color",
      status: false,
      error: error.message,
    });
  }
};

// Get All Colors API
const GetAllColor = async (req, res) => {
  try {
    const allColors = await ColorModal.find();
    res.send({
      status: true,
      data: allColors,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// Delete Color API
const DeleteColor = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedColor = await ColorModal.findByIdAndDelete(id);
    if (deletedColor) {
      res.json({
        status: true,
        message: "Deleted Successfully",
        data: deletedColor,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Color not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  AddColor,
  GetAllColor,
  DeleteColor,
};
