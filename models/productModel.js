// models/Product.js

const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  size: [{ type: String, required: true }],
  color: { type: mongoose.Schema.Types.ObjectId, ref: "Color", required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: "" },
});

const ProductSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productName: { type: String, required: true },
    productDisc: { type: String, required: true },
    variants: [VariantSchema],
    available: { type: Boolean, default: true },
    isLatest: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
