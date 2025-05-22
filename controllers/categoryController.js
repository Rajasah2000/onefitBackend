const Category = require("../models/categoryModel");

// Add new category
const AddCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    // Check for existing category (case-insensitive)
    const existing = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existing) {
      return res.send({
        msg: "Category already exists",
        status: false,
      });
    }

    const newCategory = await Category.create({ name, image });

    res.status(201).send({
      msg: "Category added successfully",
      status: true,
      data: newCategory,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      msg: "Error while adding category",
      error: error.message,
    });
  }
};

// Get all categories
const GetAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find();
    res.send({
      status: true,
      data: allCategory,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
};

// Update category
const UpdateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    const updated = await Category.findByIdAndUpdate(
      id,
      { name, image },
      { new: true }
    );

    res.json({
      status: true,
      message: "Category Updated Successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// Delete category
const DeleteaCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Category.findByIdAndDelete(id);

    res.json({
      status: true,
      message: "Deleted Successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};

module.exports = {
  AddCategory,
  GetAllCategory,
  UpdateCategory,
  DeleteaCategory,
};
