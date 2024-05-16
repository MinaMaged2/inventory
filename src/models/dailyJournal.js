const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const dailyJournalSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amountDebit: {
      type: Number,
      required: true,
    },
    amountCredit: {
      type: Number,
      required: true,
    },
    chartAccountID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChartAccount",
      required: true,
    },
    invoicesHeaderID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // invoiceHeaderID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "InvoiceHeader",
    //   required: true,
    // },
    // purchaseHeaderID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PurchaseHeader",
    //   required: true,
    // },
    dailyJournalID: {
      type: Number,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

dailyJournalSchema.plugin(AutoIncrement,  {inc_field: 'dailyJournalID'} );
const DailyJournal = mongoose.model("DailyJournal", dailyJournalSchema);
module.exports = DailyJournal;
