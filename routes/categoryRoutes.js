const express = require("express");
const router = express.Router();
const {
  AddCategory,
  GetAllCategory,
  UpdateCategory,
  DeleteaCategory,
} = require("../controllers/categoryController");
const protect = require("../middleware/authMiddleware");

// Login route for admin
router.post("/add", protect, AddCategory);
router.get("/get", GetAllCategory);
router.put(`/update/:id`, protect, UpdateCategory);
router.delete("/delete/:id", protect, DeleteaCategory);
module.exports = router;
