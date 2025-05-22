const express = require("express");
const {
  UserRegister,
  UserLogin,
  addCartItem,
  viewCartItems,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItems,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

// Login route and register for admin
router.post("/register", UserRegister);
router.post("/login", UserLogin);

router.post("/addcart", authenticate, addCartItem);
router.get("/cart", authenticate, viewCartItems);
router.put("/updatecart/:id", authenticate, updateCartItem);
router.delete("/deletecart/:id", authenticate, deleteCartItem);
router.delete("/cart/delete-all", authenticate, deleteAllCartItems);
module.exports = router;
