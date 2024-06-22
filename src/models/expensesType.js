const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const expensesTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  expensesTypeID: {
    type: Number,
    unique: true
  }
});

expensesTypeSchema.plugin(AutoIncrement,  {inc_field: 'expensesTypeID'} );
const ExpensesType = mongoose.model("ExpensesType", expensesTypeSchema);
module.exports = ExpensesType;