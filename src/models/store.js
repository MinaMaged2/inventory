const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  storeID: {
    type: Number,
    unique: true
  }

});

storeSchema.plugin(AutoIncrement,  {inc_field: 'storeID'} );
const Store = mongoose.model("Store", storeSchema);
module.exports = Store;