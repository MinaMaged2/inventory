const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const supplierProductSchema = new mongoose.Schema(
  {
    supplierID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    lastPrice: {
      type: Number,
      required: true,

    },
    supplierProductID: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

supplierProductSchema.plugin(AutoIncrement, { inc_field: "supplierProductID" });
const SupplierProduct = mongoose.model(
  "SupplierProduct",
  supplierProductSchema
);
module.exports = SupplierProduct;
