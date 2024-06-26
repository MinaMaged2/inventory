const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const inventoryMoveHeaderSchema = new mongoose.Schema({
  // in out transfer
  type: {
    type: String,
    required: true,
    trim: true,
  },
  storeID:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
  description: {
    type: String,
    trim: true,
  },
  invoiceRefHeaderID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  inventoryMoveHeaderID: {
    type: Number,
    unique: true
  },
  operationDate: {
    type: Date
  },

},
{
  timestamps: true,
});

inventoryMoveHeaderSchema.plugin(AutoIncrement,  {inc_field: 'inventoryMoveHeaderID'} );
const inventoryMoveHeader = mongoose.model("InventoryMoveHeader", inventoryMoveHeaderSchema);
module.exports = inventoryMoveHeader;