const Product = require("../models/productModel");

const Category = require("../models/categoryModel"); // Ensure correct path
const Color = require("../models/colorModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const getProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories", // Collection name for Category
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo", // Unwind to include category object directly
      },
      {
        $lookup: {
          from: "colors", // Collection name for Color
          localField: "variants.color",
          foreignField: "_id",
          as: "colorDetails",
        },
      },
      {
        $addFields: {
          variants: {
            $map: {
              input: "$variants",
              as: "variant",
              in: {
                $mergeObjects: [
                  "$$variant",
                  {
                    color: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$colorDetails",
                            cond: { $eq: ["$$this._id", "$$variant.color"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          "categoryInfo._id": 0, // Optional: Exclude unnecessary fields from category
          "categoryInfo.createdAt": 0,
          "categoryInfo.updatedAt": 0,
          "categoryInfo.__v": 0,
          "variants.color.createdAt": 0,
          "variants.color.updatedAt": 0,
          "variants.color.__v": 0,
          colorDetails: 0, // Exclude colorDetails from the final output
        },
      },
    ]);

    res.send({
      status: true,
      data: products,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

const getCategoryProducts = async (req, res) => {
  try {
    const { categoryId } = req.params; // Get categoryId from the request params

    // Validate the categoryId
    if (!categoryId) {
      return res.status(400).send({
        status: false,
        message: "Category ID is required",
      });
    }

    // Ensure categoryId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid Category ID",
      });
    }

    // Fetch products filtered by the categoryId
    const products = await Product.aggregate([
      {
        $match: {
          category: new mongoose.Types.ObjectId(categoryId), // Ensure we are matching ObjectId
        },
      },
      {
        $lookup: {
          from: "categories", // Collection name for Category
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo", // Unwind to include category object directly
      },
      {
        $lookup: {
          from: "colors", // Collection name for Color
          localField: "variants.color",
          foreignField: "_id",
          as: "colorDetails",
        },
      },
      {
        $addFields: {
          variants: {
            $map: {
              input: "$variants",
              as: "variant",
              in: {
                $mergeObjects: [
                  "$$variant",
                  {
                    color: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$colorDetails",
                            cond: { $eq: ["$$this._id", "$$variant.color"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          "categoryInfo._id": 0, // Optional: Exclude unnecessary fields from category
          "categoryInfo.createdAt": 0,
          "categoryInfo.updatedAt": 0,
          "categoryInfo.__v": 0,
          "variants.color.createdAt": 0,
          "variants.color.updatedAt": 0,
          "variants.color.__v": 0,
          colorDetails: 0, // Exclude colorDetails from the final output
        },
      },
    ]);

    // If no products are found for the given categoryId
    if (products.length === 0) {
      return res.status(404).send({
        status: true,
        data: [],
        message: "No products found for this category",
      });
    }

    // Return the filtered products
    res.send({
      status: true,
      data: products,
    });
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// Get Single Product API
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category variants.color"
    );
    if (!product) {
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }
    res.send({
      status: true,
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.send({
      status: true,
      data: savedProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// Edit product
// Edit product function
const editProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("category")
      .populate("variants.color");

    if (!updatedProduct) {
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }
    res.send({
      status: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }
    res.send({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }

    // Toggle the availability status
    product.available = !product.available;
    const updatedProduct = await product.save();

    res.send({
      status: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// Toggle Latest Product
const toggleLatest = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }

    // Toggle the latest status
    product.isLatest = !product.isLatest;
    const updatedProduct = await product.save();

    res.send({
      status: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// Toggle Featured Product
const toggleFeatured = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }

    // Toggle the featured status
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    res.send({
      status: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// Get Featured Products
const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.aggregate([
      { $match: { isFeatured: true } }, // Match featured products only
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $lookup: {
          from: "colors",
          localField: "variants.color",
          foreignField: "_id",
          as: "colorDetails",
        },
      },
      {
        $addFields: {
          variants: {
            $map: {
              input: "$variants",
              as: "variant",
              in: {
                $mergeObjects: [
                  "$$variant",
                  {
                    color: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$colorDetails",
                            cond: { $eq: ["$$this._id", "$$variant.color"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          "categoryInfo._id": 0,
          "categoryInfo.createdAt": 0,
          "categoryInfo.updatedAt": 0,
          "categoryInfo.__v": 0,
          "variants.color._id": 0,
          "variants.color.createdAt": 0,
          "variants.color.updatedAt": 0,
          "variants.color.__v": 0,
          colorDetails: 0,
        },
      },
    ]);

    res.send({
      status: true,
      data: featuredProducts,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Server error",
    });
  }
};

// Get Latest Products
const getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.aggregate([
      { $match: { isLatest: true } }, // Match latest products only
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $lookup: {
          from: "colors",
          localField: "variants.color",
          foreignField: "_id",
          as: "colorDetails",
        },
      },
      {
        $addFields: {
          variants: {
            $map: {
              input: "$variants",
              as: "variant",
              in: {
                $mergeObjects: [
                  "$$variant",
                  {
                    color: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$colorDetails",
                            cond: { $eq: ["$$this._id", "$$variant.color"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          "categoryInfo._id": 0,
          "categoryInfo.createdAt": 0,
          "categoryInfo.updatedAt": 0,
          "categoryInfo.__v": 0,
          "variants.color._id": 0,
          "variants.color.createdAt": 0,
          "variants.color.updatedAt": 0,
          "variants.color.__v": 0,
          colorDetails: 0,
        },
      },
    ]);

    res.send({
      status: true,
      data: latestProducts,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Server error",
    });
  }
};

//  Payment Section

const razorpayInstance = new Razorpay({
  key_id: "rzp_live_1Dbrh57RMoBb1K",
  key_secret: "FlNNkiUVWDTxpeCdFBdcexXl",
});

const generateOrderId = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: receipt || `receipt_${new Date().getTime()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Unable to generate order", error });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", "FlNNkiUVWDTxpeCdFBdcexXl") // Use the Razorpay key_secret
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature, verification failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in payment verification",
      error,
    });
  }
};

const fetchPayment = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const paymentDetails = await razorpayInstance.payments.fetch(paymentId);

    res.status(200).json({ success: true, paymentDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch payment details",
      error,
    });
  }
};

module.exports = {
  generateOrderId,
  verifyPayment,
  fetchPayment,
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
};
