const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  priceBefore: {
    type: Number,
    required: true,
  },
  priceAfter: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
