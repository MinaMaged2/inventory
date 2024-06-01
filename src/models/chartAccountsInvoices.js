const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const chartAccountInvoicesSchema = new mongoose.Schema(
  {
    chartAccountID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChartAccount",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    chartAccountInvoicesID: {
      type: Number,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

chartAccountInvoicesSchema.plugin(AutoIncrement,  {inc_field: 'chartAccountInvoicesID'} );
const ChartAccountInvoices = mongoose.model("ChartAccountInvoices", chartAccountInvoicesSchema);
module.exports = ChartAccountInvoices;
