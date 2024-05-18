const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  amountDebit: {
    type: Number,
  },
  clientID: {
    type: Number,
    unique: true
  }

});

clientSchema.plugin(AutoIncrement,  {inc_field: 'clientID'} );
const Client = mongoose.model("Client", clientSchema);
module.exports = Client;