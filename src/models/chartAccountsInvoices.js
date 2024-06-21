const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const chartAccountInvoicesSchema = new mongoose.Schema(
  {
    chartAccountID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChartAccount",
      required: true,
    },
    type: {
      type: Boolean,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    amountBefore: {
      type: Number,
    },
    amountAfter: {
      type: Number,
    },
    transferHeaderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountTransferHeader",
    },
    chartAccountInvoicesID: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

chartAccountInvoicesSchema.plugin(AutoIncrement, {
  inc_field: "chartAccountInvoicesID",
});
const ChartAccountInvoices = mongoose.model(
  "ChartAccountInvoices",
  chartAccountInvoicesSchema
);
module.exports = ChartAccountInvoices;
