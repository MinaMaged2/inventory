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
  // سبت 0 - حد 1 - اتنين 2 - تلات 3 - اربع 4 - خميس 5 - جمعة 6
  clientDays: [
    {
      type: Number,
    }
  ],
  clientID: {
    type: Number,
    unique: true
  }

});

clientSchema.plugin(AutoIncrement,  {inc_field: 'clientID'} );
const Client = mongoose.model("Client", clientSchema);
module.exports = Client;