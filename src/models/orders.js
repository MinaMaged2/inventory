const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    clientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    orderData: [{
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      priceBefore:{
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
    }],
    totalPrice: {
      type: Number,
      required: true,
    },
    paidMoney: {
      type: Number,
      required: true,
    },
    remainingMoney: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
