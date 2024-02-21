const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const mainChartAccountsSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  mainChartAccountID: {
    type: Number,
    unique: true
  }

},
{
  timestamps: true,
});

mainChartAccountsSchema.plugin(AutoIncrement,  {inc_field: 'mainChartAccountID'} );
const MainChartAccount = mongoose.model("MainChartAccount", mainChartAccountsSchema);
module.exports = MainChartAccount;