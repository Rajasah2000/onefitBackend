const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const {
  createOrder,
  getUserOrders,
  deleteOrder,
  getAllOrders,
} = require("../controllers/orderController");

// Create a new order
router.post("/add", createOrder);

// Get all orders for a specific user
router.get("/get/:userId", getUserOrders);

// Get all orders for a specific user
router.get("/getadminorder", getAllOrders);

// Delete an order by orderId
router.delete("/delete/:orderId", deleteOrder);

module.exports = router;
