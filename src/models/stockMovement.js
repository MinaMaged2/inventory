const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const stockMovementSchema = new mongoose.Schema(
  {
    change: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    quantityBefore: {
      type: Number,
      required: true,
    },
    quantityAfter: {
      type: Number,
      required: true,
    },
    amountOfReturn:{
      type: Number,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    product: {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      productID: {
        type: Number,
      },
      productName: {
        type: String,
      },
      productCost: {
        type: Number,
      },
      productPrice: {
        type: Number,
      },
      productCode: {
        type: String,
      }
    },
    inventoryHeaderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stockMovementID: {
      type: Number,
      unique: true
    },
    operationDate: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

stockMovementSchema.plugin(AutoIncrement,  {inc_field: 'stockMovementID'} );
const StockMovement = mongoose.model("StockMovement", stockMovementSchema);
module.exports = StockMovement;
