const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  AddColor,
  GetAllColor,
  DeleteColor,
} = require("../controllers/colorController");

// Login route for admin
router.post("/add", protect, AddColor);
router.get("/get", protect, GetAllColor);
router.delete("/delete/:id", protect, DeleteColor);
module.exports = router;
