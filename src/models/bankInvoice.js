const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const bankInvoiceSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
    },
    operationDate: {
      type: Date,
    },
    typeOfMove: {
      type: Boolean,
    },
    bankInvoiceID: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

bankInvoiceSchema.plugin(AutoIncrement, { inc_field: "bankInvoiceID" });
const bankInvoice = mongoose.model("bankInvoice", bankInvoiceSchema);
module.exports = bankInvoice;
