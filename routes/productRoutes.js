const express = require("express");
const router = express.Router();
const {
  getProducts,
  addProduct,
  editProduct,
  deleteProduct,
  getProductById,
  toggleAvailability,
  toggleLatest,
  toggleFeatured,
  getFeaturedProducts,
  getLatestProducts,
  getCategoryProducts,
  generateOrderId,
  verifyPayment,
  fetchPayment,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");

// Product routes
router.get("/admin/products/get", protect, getProducts);
router.post("/admin/products/add", protect, addProduct);
router.put("/admin/products/edit/:id", protect, editProduct);
router.put(
  "/admin/products/toggle-availability/:id",
  protect,
  toggleAvailability
);
router.get("/admin/products/single/:id", protect, getProductById);
router.delete("/admin/products/delete/:id", protect, deleteProduct);
router.post("/admin/products/toggle-latest/:id", toggleLatest);
router.post("/admin/products/toggle-featured/:id", toggleFeatured);
router.get("/admin/products/featured-products", getFeaturedProducts);
router.get("/admin/products/latest-products", getLatestProducts);
router.get("/admin/products/getallproduct", getProducts);
router.get(
  "/admin/products/getcategoryproducts/:categoryId",
  getCategoryProducts
);

router.post("/generate-order", generateOrderId);
router.post("/verify-payment", verifyPayment);
router.get("/payment-details/:paymentId", fetchPayment);
module.exports = router;
