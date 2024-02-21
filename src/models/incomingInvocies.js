const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const incomingInvoicesSchema = new mongoose.Schema(
  {
    supplierID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
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
      price:{
        type: Number,
        required: true,
      },
      cost: {
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
    // المحل او البنك
    payInvoiceFrom: {
      type: String,
      required: true,
    },
    // اول مدة - اذن وارد
    incomingInvoiceType: {
      type: String,
      required: true,
    },
    incomingInvoicesID: {
      type: Number,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

incomingInvoicesSchema.plugin(AutoIncrement,  {inc_field: 'incomingInvoicesID'});
const IncomingInvoices = mongoose.model("IncomingInvoices", incomingInvoicesSchema);
module.exports = IncomingInvoices;
