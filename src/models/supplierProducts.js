const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const supplierProductSchema = new mongoose.Schema({
  
    supplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },
  products: [
    {
      productID:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      },

      lastPrice: {
        type: Number,
      }
    }
  ],
  supplierProductID: {
    type: Number,
    unique: true
  }

},
{
  timestamps: true,
});

supplierProductSchema.plugin(AutoIncrement,  {inc_field: 'supplierProductID'} );
const SupplierProduct = mongoose.model("SupplierProduct", supplierProductSchema);
module.exports = SupplierProduct;