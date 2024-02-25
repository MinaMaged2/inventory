const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const chartAccountsSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  accountRefId:{
    type: mongoose.Schema.Types.ObjectId,
  },
  balance:{
    type: Number,
    required: true,
  },
  amountDebit: {
    type: Number,
    required: true,
  },
  amountCredit: {
    type: Number,
    required: true,
  },
  netProfit:{
    amountDebit: {
      type: Number,
    },
    amountCredit: {
      type: Number,
    },
    balance: {
      type: Number,
    },
  },
  treasury:{
    amountDebit: {
      type: Number,
    },
    amountCredit: {
      type: Number,
    },
    balance: {
      type: Number,
    },
  },
  dailyExpenses:{
    amountDebit: {
      type: Number,
    },
    amountCredit: {
      type: Number,
    },
    balance: {
      type: Number,
    },
  },
  parentChartAccountID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainChartAccount",
  },
  chartAccountID: {
    type: Number,
    unique: true
  }

});

chartAccountsSchema.plugin(AutoIncrement,  {inc_field: 'chartAccountID'} );
const ChartAccount = mongoose.model("ChartAccount", chartAccountsSchema);
module.exports = ChartAccount;