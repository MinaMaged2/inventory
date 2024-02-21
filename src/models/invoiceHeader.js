const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const invoiceHeaderSchema = new mongoose.Schema(
  {
    // in out
    type: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    invoiceTotalWithTax: {
      type: Number,
      required: true,
    },
    invoiceTotalNoTax: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paidYN: {
      type: Boolean,
      required: true,
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    clientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    discount: {
      type: Number,
    },
    profit: {
      type: Number,
      required: true,
    },
    isPayment:{
      type: Boolean,
    },
    invoiceHeaderID: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

invoiceHeaderSchema.plugin(AutoIncrement, { inc_field: "invoiceHeaderID" });
const InvoiceHeader = mongoose.model("InvoiceHeader", invoiceHeaderSchema);
module.exports = InvoiceHeader;
