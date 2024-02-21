const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const dailyInvoicesSchema = new mongoose.Schema(
  {
    clientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    clientName: {
      type: String,
      trim: true,
    },
    dailyInvoicesID: {
      type: Number,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

dailyInvoicesSchema.plugin(AutoIncrement,  {inc_field: 'dailyInvoicesID'} );
const DailyInvoices = mongoose.model("DailyInvoices", dailyInvoicesSchema);
module.exports = DailyInvoices;
