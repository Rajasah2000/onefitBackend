const express = require("express");
const router = express.Router();
const { adminLogin, adminRegister } = require("../controllers/adminController");
const { getAllUsers } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// Login route and register for admin
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/users", protect, getAllUsers);

module.exports = router;
