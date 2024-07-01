const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const customerProductSchema = new mongoose.Schema({
  
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
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
  customerProductID: {
    type: Number,
    unique: true
  }

},
{
  timestamps: true,
});

customerProductSchema.plugin(AutoIncrement,  {inc_field: 'customerProductID'} );
const CustomerProduct = mongoose.model("CustomerProduct", customerProductSchema);
module.exports = CustomerProduct;
