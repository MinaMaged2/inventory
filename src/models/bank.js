const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  bankID: {
    type: Number,
    unique: true
  }
},
{
  timestamps: true,
});

bankSchema.plugin(AutoIncrement,  {inc_field: 'bankID'} );
const bank = mongoose.model("bank", bankSchema);
module.exports = bank;