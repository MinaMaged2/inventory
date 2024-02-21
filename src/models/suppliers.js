const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  supplierID: {
    type: Number,
    unique: true
  }
});

supplierSchema.plugin(AutoIncrement,  {inc_field: 'supplierID'} );

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;