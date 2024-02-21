const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const outgoingInvoicesSchema = new mongoose.Schema(
  {
    clientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    clientName: {
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
    outgoingInvoicesID: {
      type: Number,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

outgoingInvoicesSchema.plugin(AutoIncrement,  {inc_field: 'outgoingInvoicesID'} );
const OutgoingInvoices = mongoose.model("OutgoingInvoices", outgoingInvoicesSchema);
module.exports = OutgoingInvoices;
