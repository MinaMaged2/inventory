const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const purchaseHeaderSchema = new mongoose.Schema({
  // in out 
  type: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  invoiceTotalWithTax: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  paidYN: {
    type: Boolean,
    required: true,
  },
  storeID:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
  supplierID:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  isPayment: {
    type: Boolean,
  },
  purchaseHeaderID: {
    type: Number,
    unique: true
  }

},
{
  timestamps: true,
});

purchaseHeaderSchema.plugin(AutoIncrement,  {inc_field: 'purchaseHeaderID'} );
const PurchaseHeader = mongoose.model("PurchaseHeader", purchaseHeaderSchema);
module.exports = PurchaseHeader;