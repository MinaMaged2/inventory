const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productPerStoreSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productPerStoreID: {
      type: Number,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

productPerStoreSchema.plugin(AutoIncrement,  {inc_field: 'productPerStoreID'} );
const ProductPerStore = mongoose.model("ProductPerStore", productPerStoreSchema);
module.exports = ProductPerStore;
